'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import { Meeting, MeetingParticipant, MeetingTokenResponse, SOCKET_EVENTS } from '@talknow/shared';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

interface UseMeetingOptions {
  roomCode: string;
  sessionToken: string;
  creatorToken?: string;
  currentUser: {
    id: string;
    displayName: string;
    isCreator: boolean;
  };
  socket: Socket | null;
  isConnected: boolean;
}

export function useMeeting({
  roomCode,
  sessionToken,
  creatorToken,
  currentUser,
  socket,
  isConnected,
}: UseMeetingOptions) {
  // Meeting states
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isPreJoinOpen, setIsPreJoinOpen] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [meetingDuration, setMeetingDuration] = useState(0);

  // Audio & media states
  const [permissionState, setPermissionState] = useState<MicPermissionState>('prompt');
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0 to 100 for visualizer
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioInput, setSelectedAudioInput] = useState<string>('');
  const [selectedAudioOutput, setSelectedAudioOutput] = useState<string>('');

  // Refs for audio pipeline & LiveKit
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const livekitRoomRef = useRef<any>(null);
  const meetingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTokenDataRef = useRef<MeetingTokenResponse | null>(null);

  // Query devices
  const updateDeviceList = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.enumerateDevices) {
      return;
    }
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const inputs = devices.filter((d) => d.kind === 'audioinput');
      const outputs = devices.filter((d) => d.kind === 'audiooutput');
      setAudioDevices(inputs);
      setAudioOutputDevices(outputs);

      if (inputs.length > 0 && !selectedAudioInput) {
        setSelectedAudioInput(inputs[0].deviceId);
      }
      if (outputs.length > 0 && !selectedAudioOutput) {
        setSelectedAudioOutput(outputs[0].deviceId);
      }
    } catch (err) {
      console.warn('[Meeting] Failed to enumerate audio devices:', err);
    }
  }, [selectedAudioInput, selectedAudioOutput]);

  // Stop local mic stream
  const stopLocalStream = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    setAudioLevel(0);
  }, []);

  // Request & attach local mic stream with AudioContext level analyzer
  const startLocalAudioStream = useCallback(
    async (deviceId?: string) => {
      stopLocalStream();

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setPermissionState('unsupported');
        return null;
      }

      try {
        const constraints: MediaStreamConstraints = {
          audio: {
            deviceId: deviceId ? { exact: deviceId } : undefined,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        localStreamRef.current = stream;
        setPermissionState('granted');
        await updateDeviceList();

        // Setup audio level analyzer for live speaking indication
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            source.connect(analyser);
            analyserRef.current = analyser;

            const buffer = new Uint8Array(analyser.frequencyBinCount);
            let lastSpeakingState = false;

            const analyzeAudio = () => {
              if (!analyserRef.current) return;
              analyserRef.current.getByteFrequencyData(buffer);

              let sum = 0;
              for (let i = 0; i < buffer.length; i++) {
                sum += buffer[i];
              }
              const average = sum / buffer.length;
              // Scale to 0-100
              const level = Math.min(100, Math.round((average / 128) * 100));
              setAudioLevel(level);

              const isSpeakingNow = level > 12 && !isMuted;
              if (isSpeakingNow !== lastSpeakingState) {
                lastSpeakingState = isSpeakingNow;
                if (socket && meeting) {
                  socket.emit(SOCKET_EVENTS.MEETING_AUDIO_STATE, {
                    roomCode,
                    meetingId: meeting.id,
                    isMuted,
                    isSpeaking: isSpeakingNow,
                  });
                }
              }

              animationFrameRef.current = requestAnimationFrame(analyzeAudio);
            };

            analyzeAudio();
          }
        } catch (analyzerErr) {
          console.warn('[Meeting] Web Audio analyzer initialization warning:', analyzerErr);
        }

        return stream;
      } catch (err: any) {
        console.error('[Meeting] Mic access error:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setPermissionState('denied');
        } else {
          setPermissionState('unsupported');
        }
        return null;
      }
    },
    [isMuted, meeting, roomCode, socket, stopLocalStream, updateDeviceList]
  );

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          track.enabled = !nextMuted;
        });
      }

      if (livekitRoomRef.current?.localParticipant) {
        try {
          livekitRoomRef.current.localParticipant.setMicrophoneEnabled(!nextMuted);
        } catch {}
      }

      if (socket && meeting) {
        socket.emit(SOCKET_EVENTS.MEETING_AUDIO_STATE, {
          roomCode,
          meetingId: meeting.id,
          isMuted: nextMuted,
          isSpeaking: false,
        });
      }

      return nextMuted;
    });
  }, [meeting, roomCode, socket]);

  // Connect to LiveKit if serverUrl is configured
  const connectLiveKit = useCallback(
    async (tokenData: MeetingTokenResponse) => {
      if (tokenData.serverUrl === 'local' || !tokenData.token) {
        return;
      }

      try {
        const { Room, RoomEvent } = await import('livekit-client');
        const lkRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          audioCaptureDefaults: {
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        livekitRoomRef.current = lkRoom;

        // Remote participant audio playback
        lkRoom.on(RoomEvent.TrackSubscribed, (track: any) => {
          if (track.kind === 'audio') {
            const audioElement = track.attach();
            document.body.appendChild(audioElement);
          }
        });

        // Remote active speakers
        lkRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers: any[]) => {
          const speakerIds = new Set(speakers.map((s) => s.identity));
          setParticipants((prev) =>
            prev.map((p) => ({
              ...p,
              isSpeaking: speakerIds.has(p.memberId),
            }))
          );
        });

        // Connect
        await lkRoom.connect(tokenData.serverUrl, tokenData.token);

        // Publish local mic track
        await lkRoom.localParticipant.setMicrophoneEnabled(!isMuted);
      } catch (err) {
        console.warn('[Meeting] LiveKit connection warning, operating in Web Audio mesh mode:', err);
      }
    },
    [isMuted]
  );

  // Disconnect LiveKit
  const disconnectLiveKit = useCallback(() => {
    if (livekitRoomRef.current) {
      try {
        livekitRoomRef.current.disconnect();
      } catch {}
      livekitRoomRef.current = null;
    }
  }, []);

  // Open Pre-join Screen
  const openPreJoin = useCallback(async () => {
    setIsPreJoinOpen(true);
    await startLocalAudioStream(selectedAudioInput);
  }, [selectedAudioInput, startLocalAudioStream]);

  // Close Pre-join Screen
  const closePreJoin = useCallback(() => {
    setIsPreJoinOpen(false);
    if (!isInMeeting) {
      stopLocalStream();
    }
  }, [isInMeeting, stopLocalStream]);

  // Start Meeting
  const startMeeting = useCallback(async () => {
    if (!sessionToken) return;
    setIsStarting(true);
    try {
      const { meeting: newMeeting, tokenData } = await apiClient.startMeeting(roomCode, sessionToken);
      currentTokenDataRef.current = tokenData;
      setMeeting(newMeeting);
      setIsInMeeting(true);
      setIsPreJoinOpen(false);

      // Start local stream if not running
      await startLocalAudioStream(selectedAudioInput);

      // Connect media SFU if available
      await connectLiveKit(tokenData);

      // Fetch participants
      const activeParticipants = await apiClient.getMeetingParticipants(roomCode, newMeeting.id);
      setParticipants(activeParticipants);

      toast.success('Meeting Started', {
        description: 'You are now the meeting host.',
      });
    } catch (err: any) {
      console.error('[Meeting] Failed to start meeting:', err);
      toast.error('Failed to start meeting', {
        description: err.message || 'Please try again.',
      });
    } finally {
      setIsStarting(false);
    }
  }, [connectLiveKit, roomCode, selectedAudioInput, sessionToken, startLocalAudioStream]);

  // Join Meeting
  const joinMeeting = useCallback(async () => {
    if (!sessionToken || !meeting) return;
    setIsJoining(true);
    try {
      const { meeting: updatedMeeting, tokenData } = await apiClient.joinMeeting(
        roomCode,
        meeting.id,
        sessionToken
      );
      currentTokenDataRef.current = tokenData;
      setMeeting(updatedMeeting);
      setIsInMeeting(true);
      setIsPreJoinOpen(false);

      // Start local audio track
      await startLocalAudioStream(selectedAudioInput);

      // Connect media SFU if available
      await connectLiveKit(tokenData);

      // Fetch participants
      const activeParticipants = await apiClient.getMeetingParticipants(roomCode, meeting.id);
      setParticipants(activeParticipants);

      toast.success('Joined Meeting');
    } catch (err: any) {
      console.error('[Meeting] Failed to join meeting:', err);
      toast.error('Failed to join meeting', {
        description: err.message || 'Please try again.',
      });
    } finally {
      setIsJoining(false);
    }
  }, [connectLiveKit, meeting, roomCode, selectedAudioInput, sessionToken, startLocalAudioStream]);

  // Leave Meeting (stay in room)
  const leaveMeeting = useCallback(async () => {
    if (meeting && sessionToken) {
      try {
        await apiClient.leaveMeeting(roomCode, meeting.id, sessionToken, currentUser.id);
        if (socket) {
          socket.emit(SOCKET_EVENTS.MEETING_LEAVE, {
            roomCode,
            meetingId: meeting.id,
          });
        }
      } catch (err) {
        console.warn('[Meeting] Error leaving meeting:', err);
      }
    }

    disconnectLiveKit();
    stopLocalStream();
    setIsInMeeting(false);
    setIsPreJoinOpen(false);
    toast.info('Left the meeting', {
      description: 'You remain connected to the room chat.',
    });
  }, [currentUser.id, disconnectLiveKit, meeting, roomCode, sessionToken, socket, stopLocalStream]);

  // End Meeting for Everyone (Host or room creator)
  const endMeeting = useCallback(async () => {
    if (!meeting || !sessionToken) return;
    try {
      await apiClient.endMeeting(roomCode, meeting.id, sessionToken, creatorToken);
      disconnectLiveKit();
      stopLocalStream();
      setMeeting(null);
      setIsInMeeting(false);
      setIsPreJoinOpen(false);
      setParticipants([]);

      toast.success('Meeting Ended', {
        description: 'Meeting was ended for all participants.',
      });
    } catch (err: any) {
      console.error('[Meeting] Failed to end meeting:', err);
      toast.error('Failed to end meeting', {
        description: err.message || 'Only host can end the meeting.',
      });
    }
  }, [creatorToken, disconnectLiveKit, meeting, roomCode, sessionToken, stopLocalStream]);

  // Poll or check active meeting on mount
  useEffect(() => {
    let isMounted = true;
    apiClient
      .getActiveMeeting(roomCode)
      .then((active) => {
        if (isMounted) {
          setMeeting(active);
          if (active) {
            apiClient.getMeetingParticipants(roomCode, active.id).then((p) => {
              if (isMounted) setParticipants(p);
            });
          }
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [roomCode]);

  // Socket event listeners for meeting coordination
  useEffect(() => {
    if (!socket) return;

    // Meeting started
    const handleMeetingStarted = (data: { roomCode: string; meeting: Meeting }) => {
      if (data.roomCode === roomCode) {
        setMeeting(data.meeting);
        apiClient.getMeetingParticipants(roomCode, data.meeting.id).then(setParticipants);
        toast.info('Meeting Started', {
          description: `${data.meeting.hostDisplayName || 'A member'} started a group call.`,
          action: {
            label: 'Join',
            onClick: () => setIsPreJoinOpen(true),
          },
          duration: 6000,
        });
      }
    };

    // Meeting state
    const handleMeetingState = (data: { meeting: Meeting | null; participants: MeetingParticipant[] }) => {
      setMeeting(data.meeting);
      if (data.participants) {
        setParticipants(data.participants);
      }
    };

    // Participant joined
    const handleParticipantJoined = (data: {
      meetingId: string;
      participant: MeetingParticipant;
      participantCount: number;
    }) => {
      setParticipants((prev) => {
        const filtered = prev.filter((p) => p.memberId !== data.participant.memberId);
        return [...filtered, data.participant];
      });
      setMeeting((prev) => (prev ? { ...prev, participantCount: data.participantCount } : prev));
    };

    // Participant left
    const handleParticipantLeft = (data: { meetingId: string; memberId: string }) => {
      setParticipants((prev) => prev.filter((p) => p.memberId !== data.memberId));
      setMeeting((prev) =>
        prev
          ? {
              ...prev,
              participantCount: Math.max(0, (prev.participantCount || 1) - 1),
            }
          : prev
      );
    };

    // Participant updated (mute, speaking)
    const handleParticipantUpdated = (data: {
      meetingId: string;
      memberId: string;
      displayName: string;
      isMuted: boolean;
      isSpeaking: boolean;
    }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.memberId === data.memberId
            ? { ...p, isMuted: data.isMuted, isSpeaking: data.isSpeaking }
            : p
        )
      );
    };

    // Meeting ended
    const handleMeetingEnded = (data: { roomCode: string }) => {
      if (data.roomCode === roomCode) {
        disconnectLiveKit();
        stopLocalStream();
        setMeeting(null);
        setIsInMeeting(false);
        setIsPreJoinOpen(false);
        setParticipants([]);
        toast.info('Meeting Ended', {
          description: 'The meeting was ended by the host.',
        });
      }
    };

    socket.on(SOCKET_EVENTS.MEETING_STARTED, handleMeetingStarted);
    socket.on(SOCKET_EVENTS.MEETING_STATE, handleMeetingState);
    socket.on(SOCKET_EVENTS.MEETING_PARTICIPANT_JOINED, handleParticipantJoined);
    socket.on(SOCKET_EVENTS.MEETING_PARTICIPANT_LEFT, handleParticipantLeft);
    socket.on(SOCKET_EVENTS.MEETING_PARTICIPANT_UPDATED, handleParticipantUpdated);
    socket.on(SOCKET_EVENTS.MEETING_ENDED, handleMeetingEnded);

    // Request meeting state on connect
    if (socket.connected) {
      socket.emit(SOCKET_EVENTS.MEETING_STATE_REQUEST, { roomCode });
    }

    return () => {
      socket.off(SOCKET_EVENTS.MEETING_STARTED, handleMeetingStarted);
      socket.off(SOCKET_EVENTS.MEETING_STATE, handleMeetingState);
      socket.off(SOCKET_EVENTS.MEETING_PARTICIPANT_JOINED, handleParticipantJoined);
      socket.off(SOCKET_EVENTS.MEETING_PARTICIPANT_LEFT, handleParticipantLeft);
      socket.off(SOCKET_EVENTS.MEETING_PARTICIPANT_UPDATED, handleParticipantUpdated);
      socket.off(SOCKET_EVENTS.MEETING_ENDED, handleMeetingEnded);
    };
  }, [disconnectLiveKit, roomCode, socket, stopLocalStream]);

  // Duration timer
  useEffect(() => {
    if (!meeting?.startedAt || !isInMeeting) {
      setMeetingDuration(0);
      if (meetingTimerRef.current) {
        clearInterval(meetingTimerRef.current);
        meetingTimerRef.current = null;
      }
      return;
    }

    const startTimestamp = new Date(meeting.startedAt).getTime();
    const updateDuration = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - startTimestamp) / 1000));
      setMeetingDuration(elapsed);
    };

    updateDuration();
    meetingTimerRef.current = setInterval(updateDuration, 1000);

    return () => {
      if (meetingTimerRef.current) {
        clearInterval(meetingTimerRef.current);
        meetingTimerRef.current = null;
      }
    };
  }, [meeting?.startedAt, isInMeeting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalStream();
      disconnectLiveKit();
    };
  }, [disconnectLiveKit, stopLocalStream]);

  return {
    meeting,
    participants,
    isPreJoinOpen,
    isInMeeting,
    isStarting,
    isJoining,
    meetingDuration,
    permissionState,
    isMuted,
    audioLevel,
    audioDevices,
    audioOutputDevices,
    selectedAudioInput,
    selectedAudioOutput,
    setSelectedAudioInput,
    setSelectedAudioOutput,
    openPreJoin,
    closePreJoin,
    startLocalAudioStream,
    toggleMute,
    startMeeting,
    joinMeeting,
    leaveMeeting,
    endMeeting,
  };
}
