'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';
import type { Room as LiveKitRoom, RemoteTrack } from 'livekit-client';
import { Meeting, MeetingParticipant, MeetingTokenResponse, SOCKET_EVENTS } from '@talknow/shared';
import { apiClient } from '@/lib/api-client';
import { toast } from 'sonner';

export type MicPermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
  iceCandidatePoolSize: 10,
};

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
}: UseMeetingOptions) {
  // Meeting states
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<MeetingParticipant[]>([]);
  const [isPreJoinOpen, setIsPreJoinOpen] = useState(false);
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  // Refs for audio pipeline & LiveKit (preventing stale closures in RAF loop)
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const livekitRoomRef = useRef<LiveKitRoom | null>(null);
  const attachedAudioElementsRef = useRef<HTMLMediaElement[]>([]);
  const meetingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentTokenDataRef = useRef<MeetingTokenResponse | null>(null);

  const isMutedRef = useRef(isMuted);
  const meetingRef = useRef<Meeting | null>(meeting);
  const socketRef = useRef<Socket | null>(socket);
  const isInMeetingRef = useRef(isInMeeting);
  const selectedAudioOutputRef = useRef(selectedAudioOutput);

  // WebRTC Mesh refs
  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const remoteAudioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const isUsingLiveKitRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    meetingRef.current = meeting;
  }, [meeting]);

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    isInMeetingRef.current = isInMeeting;
  }, [isInMeeting]);

  useEffect(() => {
    selectedAudioOutputRef.current = selectedAudioOutput;
  }, [selectedAudioOutput]);

  // Query available audio input & output devices
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

      setSelectedAudioInput((prev) => prev || (inputs[0]?.deviceId ?? ''));
      setSelectedAudioOutput((prev) => prev || (outputs[0]?.deviceId ?? ''));
    } catch (err) {
      console.warn('[Meeting] Failed to enumerate audio devices:', err);
    }
  }, []);

  // Stop local mic stream & analyzer
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
        // Respect current mute state on newly acquired tracks
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isMutedRef.current;
        });

        localStreamRef.current = stream;
        setPermissionState('granted');
        await updateDeviceList();

        // Setup audio level analyzer for live speaking indication
        try {
          const AudioCtx =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            audioContextRef.current = ctx;
            const source = ctx.createMediaStreamSource(stream);
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 256;
            analyser.smoothingTimeConstant = 0.6;
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
              const currentMuted = isMutedRef.current;
              const level = currentMuted ? 0 : Math.min(100, Math.round((average / 110) * 100));
              setAudioLevel(level);

              const isSpeakingNow = level > 12 && !currentMuted;
              if (isSpeakingNow !== lastSpeakingState) {
                lastSpeakingState = isSpeakingNow;
                const activeSocket = socketRef.current;
                const activeMeeting = meetingRef.current;
                if (activeSocket && activeMeeting) {
                  activeSocket.emit(SOCKET_EVENTS.MEETING_AUDIO_STATE, {
                    roomCode,
                    meetingId: activeMeeting.id,
                    isMuted: currentMuted,
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
      } catch (err: unknown) {
        console.error('[Meeting] Mic access error:', err);
        const errorName = err instanceof Error ? err.name : '';
        if (errorName === 'NotAllowedError' || errorName === 'PermissionDeniedError') {
          setPermissionState('denied');
        } else {
          setPermissionState('unsupported');
        }
        return null;
      }
    },
    [roomCode, stopLocalStream, updateDeviceList]
  );

  // Switch Microphone Input Device dynamically
  const handleSelectAudioInput = useCallback(
    async (deviceId: string) => {
      setSelectedAudioInput(deviceId);
      if (isPreJoinOpen || isInMeeting) {
        const stream = await startLocalAudioStream(deviceId);
        if (stream) {
          const newTrack = stream.getAudioTracks()[0];
          if (newTrack) {
            peerConnectionsRef.current.forEach((pc) => {
              const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'audio');
              if (sender) {
                sender.replaceTrack(newTrack).catch(() => {});
              }
            });
          }
        }
      }
      if (livekitRoomRef.current) {
        try {
          await livekitRoomRef.current.switchActiveDevice('audioinput', deviceId);
        } catch (err) {
          console.warn('[Meeting] Failed to switch LiveKit audioinput device:', err);
        }
      }
    },
    [isInMeeting, isPreJoinOpen, startLocalAudioStream]
  );

  // Switch Speaker Output Device dynamically
  const handleSelectAudioOutput = useCallback(async (deviceId: string) => {
    setSelectedAudioOutput(deviceId);
    if (livekitRoomRef.current) {
      try {
        await livekitRoomRef.current.switchActiveDevice('audiooutput', deviceId);
      } catch (err) {
        console.warn('[Meeting] Failed to switch LiveKit audiooutput device:', err);
      }
    }
    remoteAudioElementsRef.current.forEach((el) => {
      const sinkEl = el as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
      if (typeof sinkEl.setSinkId === 'function') {
        sinkEl.setSinkId(deviceId).catch(() => {});
      }
    });
    attachedAudioElementsRef.current.forEach((el) => {
      const sinkEl = el as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
      if (typeof sinkEl.setSinkId === 'function') {
        sinkEl.setSinkId(deviceId).catch(() => {});
      }
    });
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const nextMuted = !prev;
      isMutedRef.current = nextMuted;

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

      if (nextMuted) {
        setAudioLevel(0);
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

  // Clean up all audio: WebRTC mesh peers, remote audio elements, and LiveKit
  const cleanupAudioConnections = useCallback(() => {
    peerConnectionsRef.current.forEach((pc) => {
      try {
        pc.ontrack = null;
        pc.onicecandidate = null;
        pc.close();
      } catch {}
    });
    peerConnectionsRef.current.clear();
    pendingCandidatesRef.current.clear();

    remoteAudioElementsRef.current.forEach((el) => {
      try {
        el.pause();
        el.srcObject = null;
        el.remove();
      } catch {}
    });
    remoteAudioElementsRef.current.clear();

    attachedAudioElementsRef.current.forEach((el) => {
      try {
        el.pause();
        el.srcObject = null;
        el.remove();
      } catch {}
    });
    attachedAudioElementsRef.current = [];

    if (livekitRoomRef.current) {
      try {
        livekitRoomRef.current.disconnect();
      } catch {}
      livekitRoomRef.current = null;
    }

    isUsingLiveKitRef.current = false;
  }, []);

  // Create or retrieve an RTCPeerConnection for a remote peer
  const createPeerConnection = useCallback(
    (remoteMemberId: string): RTCPeerConnection => {
      const existing = peerConnectionsRef.current.get(remoteMemberId);
      if (existing) {
        try {
          existing.close();
        } catch {}
      }

      const pc = new RTCPeerConnection(RTC_CONFIG);
      peerConnectionsRef.current.set(remoteMemberId, pc);

      // Attach local audio track
      if (localStreamRef.current) {
        localStreamRef.current.getAudioTracks().forEach((track) => {
          try {
            pc.addTrack(track, localStreamRef.current!);
          } catch (err) {
            console.warn('[WebRTC] Error adding local track:', err);
          }
        });
      }

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && socketRef.current && meetingRef.current) {
          socketRef.current.emit(SOCKET_EVENTS.MEETING_SIGNAL, {
            roomCode,
            meetingId: meetingRef.current.id,
            targetMemberId: remoteMemberId,
            signal: {
              type: 'ice-candidate',
              candidate: event.candidate.toJSON ? event.candidate.toJSON() : event.candidate,
            },
          });
        }
      };

      // Receive remote audio track
      pc.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track]);

        let audioEl = remoteAudioElementsRef.current.get(remoteMemberId);
        if (!audioEl) {
          audioEl = document.createElement('audio');
          audioEl.autoplay = true;
          audioEl.setAttribute('playsinline', 'true');
          audioEl.style.display = 'none';
          document.body.appendChild(audioEl);
          remoteAudioElementsRef.current.set(remoteMemberId, audioEl);
          attachedAudioElementsRef.current.push(audioEl);
        }

        audioEl.srcObject = stream;
        if (selectedAudioOutputRef.current && 'setSinkId' in audioEl) {
          const sinkEl = audioEl as HTMLMediaElement & { setSinkId?: (id: string) => Promise<void> };
          if (typeof sinkEl.setSinkId === 'function') {
            sinkEl.setSinkId(selectedAudioOutputRef.current).catch(() => {});
          }
        }

        audioEl.play().catch((playErr) => {
          console.warn('[WebRTC] Autoplay pending user interaction:', playErr);
        });
      };

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'failed' || pc.connectionState === 'closed') {
          try {
            pc.close();
          } catch {}
          peerConnectionsRef.current.delete(remoteMemberId);
        }
      };

      return pc;
    },
    [roomCode]
  );

  // Initiate an SDP offer to a specific remote peer
  const initiateOffer = useCallback(
    async (remoteMemberId: string) => {
      try {
        const pc = createPeerConnection(remoteMemberId);
        const offer = await pc.createOffer({
          offerToReceiveAudio: true,
          offerToReceiveVideo: false,
        });
        await pc.setLocalDescription(offer);

        if (socketRef.current && meetingRef.current) {
          socketRef.current.emit(SOCKET_EVENTS.MEETING_SIGNAL, {
            roomCode,
            meetingId: meetingRef.current.id,
            targetMemberId: remoteMemberId,
            signal: {
              type: 'offer',
              sdp: offer,
            },
          });
        }
      } catch (err) {
        console.error('[WebRTC] Error initiating offer:', err);
      }
    },
    [createPeerConnection, roomCode]
  );

  // Initialize WebRTC Mesh
  const initWebRTCMesh = useCallback(
    async (existingParticipants?: MeetingParticipant[]) => {
      isUsingLiveKitRef.current = false;

      // Broadcast join signal to notify all call participants
      if (socketRef.current && meetingRef.current) {
        socketRef.current.emit(SOCKET_EVENTS.MEETING_SIGNAL, {
          roomCode,
          meetingId: meetingRef.current.id,
          signal: { type: 'join' },
        });
      }

      // For any existing participant where currentUser.id < remoteMemberId, create offer deterministically
      if (existingParticipants && existingParticipants.length > 0) {
        for (const p of existingParticipants) {
          if (p.memberId !== currentUser.id && currentUser.id < p.memberId) {
            initiateOffer(p.memberId);
          }
        }
      }
    },
    [currentUser.id, initiateOffer, roomCode]
  );

  // Connect to LiveKit if serverUrl is configured
  const connectLiveKit = useCallback(
    async (tokenData: MeetingTokenResponse) => {
      if (tokenData.serverUrl === 'local' || !tokenData.token) {
        return;
      }

      try {
        cleanupAudioConnections();
        const { Room, RoomEvent } = await import('livekit-client');
        const lkRoom = new Room({
          adaptiveStream: true,
          dynacast: true,
          audioCaptureDefaults: {
            deviceId: selectedAudioInput || undefined,
            autoGainControl: true,
            echoCancellation: true,
            noiseSuppression: true,
          },
        });

        livekitRoomRef.current = lkRoom;

        // Remote participant audio playback
        lkRoom.on(RoomEvent.TrackSubscribed, (track: RemoteTrack) => {
          if (track.kind === 'audio') {
            const audioElement = track.attach();
            audioElement.style.display = 'none';
            document.body.appendChild(audioElement);
            attachedAudioElementsRef.current.push(audioElement);
          }
        });

        lkRoom.on(RoomEvent.TrackUnsubscribed, (track: RemoteTrack) => {
          if (track.kind === 'audio') {
            const detached = track.detach();
            detached.forEach((el) => el.remove());
            attachedAudioElementsRef.current = attachedAudioElementsRef.current.filter(
              (el) => !detached.includes(el)
            );
          }
        });

        // Remote active speakers
        lkRoom.on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
          const speakerIds = new Set(speakers.map((s) => s.identity));
          setParticipants((prev) =>
            prev.map((p) => ({
              ...p,
              isSpeaking: speakerIds.has(p.memberId),
            }))
          );
        });

        await lkRoom.connect(tokenData.serverUrl, tokenData.token);
        await lkRoom.localParticipant.setMicrophoneEnabled(!isMutedRef.current);
      } catch (err) {
        console.warn('[Meeting] LiveKit connection warning, operating in Web Audio mode:', err);
      }
    },
    [cleanupAudioConnections, selectedAudioInput]
  );

  // Open Pre-join Screen
  const openPreJoin = useCallback(async () => {
    if (isInMeeting) {
      setIsMinimized(false);
      return;
    }
    setIsPreJoinOpen(true);
    await startLocalAudioStream(selectedAudioInput);
  }, [isInMeeting, selectedAudioInput, startLocalAudioStream]);

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
      meetingRef.current = newMeeting;
      setMeeting(newMeeting);
      setIsInMeeting(true);
      setIsMinimized(false);
      setIsPreJoinOpen(false);

      if (!localStreamRef.current) {
        await startLocalAudioStream(selectedAudioInput);
      }

      let connectedLiveKit = false;
      if (tokenData.serverUrl !== 'local' && tokenData.token) {
        try {
          await connectLiveKit(tokenData);
          connectedLiveKit = true;
          isUsingLiveKitRef.current = true;
        } catch (lkErr) {
          console.warn('[Meeting] LiveKit failed, falling back to WebRTC mesh:', lkErr);
        }
      }

      if (!connectedLiveKit) {
        await initWebRTCMesh([]);
      }

      const activeParticipants = await apiClient.getMeetingParticipants(roomCode, newMeeting.id);
      setParticipants(activeParticipants);
    } catch (err: unknown) {
      console.error('[Meeting] Failed to start meeting:', err);
      toast.error('Failed to start call', {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setIsStarting(false);
    }
  }, [connectLiveKit, initWebRTCMesh, roomCode, selectedAudioInput, sessionToken, startLocalAudioStream]);

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
      meetingRef.current = updatedMeeting;
      setMeeting(updatedMeeting);
      setIsInMeeting(true);
      setIsMinimized(false);
      setIsPreJoinOpen(false);

      if (!localStreamRef.current) {
        await startLocalAudioStream(selectedAudioInput);
      }

      const activeParticipants = await apiClient.getMeetingParticipants(roomCode, meeting.id);
      setParticipants(activeParticipants);

      let connectedLiveKit = false;
      if (tokenData.serverUrl !== 'local' && tokenData.token) {
        try {
          await connectLiveKit(tokenData);
          connectedLiveKit = true;
          isUsingLiveKitRef.current = true;
        } catch (lkErr) {
          console.warn('[Meeting] LiveKit failed, falling back to WebRTC mesh:', lkErr);
        }
      }

      if (!connectedLiveKit) {
        await initWebRTCMesh(activeParticipants);
      }
    } catch (err: unknown) {
      console.error('[Meeting] Failed to join meeting:', err);
      toast.error('Failed to join call', {
        description: err instanceof Error ? err.message : 'Please try again.',
      });
    } finally {
      setIsJoining(false);
    }
  }, [connectLiveKit, initWebRTCMesh, meeting, roomCode, selectedAudioInput, sessionToken, startLocalAudioStream]);

  // Leave Meeting (stay in room)
  const leaveMeeting = useCallback(async () => {
    if (meeting && sessionToken) {
      try {
        await apiClient.leaveMeeting(roomCode, meeting.id, sessionToken, currentUser.id);
      } catch (err) {
        console.warn('[Meeting] Error leaving meeting:', err);
      }
    }

    cleanupAudioConnections();
    stopLocalStream();
    setIsInMeeting(false);
    setIsMinimized(false);
    setIsPreJoinOpen(false);
    setMeetingDuration(0);
  }, [cleanupAudioConnections, currentUser.id, meeting, roomCode, sessionToken, stopLocalStream]);

  // End Meeting for Everyone (Host or room creator)
  const endMeeting = useCallback(async () => {
    if (!meeting || !sessionToken) return;
    try {
      await apiClient.endMeeting(roomCode, meeting.id, sessionToken, creatorToken);
      cleanupAudioConnections();
      stopLocalStream();
      setMeeting(null);
      setIsInMeeting(false);
      setIsMinimized(false);
      setIsPreJoinOpen(false);
      setParticipants([]);
      setMeetingDuration(0);
    } catch (err: unknown) {
      console.error('[Meeting] Failed to end meeting:', err);
      toast.error('Failed to end call', {
        description: err instanceof Error ? err.message : 'Only the host can end the call.',
      });
    }
  }, [cleanupAudioConnections, creatorToken, meeting, roomCode, sessionToken, stopLocalStream]);

  // Check active meeting on mount
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

    const handleMeetingStarted = (data: { roomCode: string; meeting: Meeting }) => {
      if (data.roomCode === roomCode) {
        setMeeting(data.meeting);
        apiClient.getMeetingParticipants(roomCode, data.meeting.id).then(setParticipants);
      }
    };

    const handleMeetingState = (data: { meeting: Meeting | null; participants: MeetingParticipant[] }) => {
      setMeeting(data.meeting);
      if (data.participants) {
        setParticipants(data.participants);
      }
    };

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

      // In WebRTC mesh mode: deterministic initiator creates offer
      if (isInMeetingRef.current && !isUsingLiveKitRef.current) {
        if (data.participant.memberId !== currentUser.id && currentUser.id < data.participant.memberId) {
          initiateOffer(data.participant.memberId);
        }
      }
    };

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

      // Clean up peer connection & audio element for this participant
      const pc = peerConnectionsRef.current.get(data.memberId);
      if (pc) {
        try {
          pc.close();
        } catch {}
        peerConnectionsRef.current.delete(data.memberId);
      }
      pendingCandidatesRef.current.delete(data.memberId);

      const audioEl = remoteAudioElementsRef.current.get(data.memberId);
      if (audioEl) {
        try {
          audioEl.pause();
          audioEl.srcObject = null;
          audioEl.remove();
        } catch {}
        remoteAudioElementsRef.current.delete(data.memberId);
      }
    };

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

    const handleMeetingEnded = (data: { roomCode: string }) => {
      if (data.roomCode === roomCode) {
        cleanupAudioConnections();
        stopLocalStream();
        setMeeting(null);
        setIsInMeeting(false);
        setIsMinimized(false);
        setIsPreJoinOpen(false);
        setParticipants([]);
        setMeetingDuration(0);
      }
    };

    const handleMeetingSignal = async (data: {
      roomCode: string;
      meetingId?: string;
      senderMemberId: string;
      targetMemberId?: string;
      signal: {
        type: 'join' | 'offer' | 'answer' | 'ice-candidate';
        sdp?: RTCSessionDescriptionInit;
        candidate?: RTCIceCandidateInit;
      };
    }) => {
      if (isUsingLiveKitRef.current) return;
      if (!isInMeetingRef.current) return;
      if (!data || data.senderMemberId === currentUser.id) return;
      if (data.targetMemberId && data.targetMemberId !== currentUser.id) return;

      const { senderMemberId, signal } = data;

      // Another peer announced they joined: if we are initiator, send offer
      if (signal.type === 'join') {
        if (currentUser.id < senderMemberId) {
          await initiateOffer(senderMemberId);
        }
        return;
      }

      // Received Offer
      if (signal.type === 'offer' && signal.sdp) {
        try {
          const pc = createPeerConnection(senderMemberId);
          await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

          const queued = pendingCandidatesRef.current.get(senderMemberId) || [];
          for (const cand of queued) {
            try {
              await pc.addIceCandidate(new RTCIceCandidate(cand));
            } catch {}
          }
          pendingCandidatesRef.current.delete(senderMemberId);

          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          if (socketRef.current && meetingRef.current) {
            socketRef.current.emit(SOCKET_EVENTS.MEETING_SIGNAL, {
              roomCode,
              meetingId: meetingRef.current.id,
              targetMemberId: senderMemberId,
              signal: {
                type: 'answer',
                sdp: answer,
              },
            });
          }
        } catch (err) {
          console.error('[WebRTC] Error handling offer:', err);
        }
        return;
      }

      // Received Answer
      if (signal.type === 'answer' && signal.sdp) {
        try {
          const pc = peerConnectionsRef.current.get(senderMemberId);
          if (pc) {
            await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));

            const queued = pendingCandidatesRef.current.get(senderMemberId) || [];
            for (const cand of queued) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(cand));
              } catch {}
            }
            pendingCandidatesRef.current.delete(senderMemberId);
          }
        } catch (err) {
          console.error('[WebRTC] Error handling answer:', err);
        }
        return;
      }

      // Received ICE Candidate
      if (signal.type === 'ice-candidate' && signal.candidate) {
        try {
          const pc = peerConnectionsRef.current.get(senderMemberId);
          if (pc && pc.remoteDescription && pc.remoteDescription.type) {
            await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
          } else {
            const list = pendingCandidatesRef.current.get(senderMemberId) || [];
            list.push(signal.candidate);
            pendingCandidatesRef.current.set(senderMemberId, list);
          }
        } catch (err) {
          console.warn('[WebRTC] Error adding ICE candidate:', err);
        }
        return;
      }
    };

    socket.on(SOCKET_EVENTS.MEETING_STARTED, handleMeetingStarted);
    socket.on(SOCKET_EVENTS.MEETING_STATE, handleMeetingState);
    socket.on(SOCKET_EVENTS.MEETING_PARTICIPANT_JOINED, handleParticipantJoined);
    socket.on(SOCKET_EVENTS.MEETING_PARTICIPANT_LEFT, handleParticipantLeft);
    socket.on(SOCKET_EVENTS.MEETING_PARTICIPANT_UPDATED, handleParticipantUpdated);
    socket.on(SOCKET_EVENTS.MEETING_ENDED, handleMeetingEnded);
    socket.on(SOCKET_EVENTS.MEETING_SIGNAL, handleMeetingSignal);

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
      socket.off(SOCKET_EVENTS.MEETING_SIGNAL, handleMeetingSignal);
    };
  }, [
    cleanupAudioConnections,
    createPeerConnection,
    currentUser.id,
    initiateOffer,
    roomCode,
    selectedAudioInput,
    socket,
    startLocalAudioStream,
    stopLocalStream,
  ]);

  // Duration timer while in meeting
  useEffect(() => {
    if (!meeting?.startedAt || !isInMeeting) {
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

  // Autoplay unlocker on user interaction
  useEffect(() => {
    if (!isInMeeting) return;
    const unlockAudio = () => {
      remoteAudioElementsRef.current.forEach((el) => {
        if (el.paused) {
          el.play().catch(() => {});
        }
      });
      attachedAudioElementsRef.current.forEach((el) => {
        if (el.paused) {
          el.play().catch(() => {});
        }
      });
    };
    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [isInMeeting]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLocalStream();
      cleanupAudioConnections();
    };
  }, [cleanupAudioConnections, stopLocalStream]);

  return {
    meeting,
    participants,
    isPreJoinOpen,
    isInMeeting,
    isMinimized,
    setIsMinimized,
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
    setSelectedAudioInput: handleSelectAudioInput,
    setSelectedAudioOutput: handleSelectAudioOutput,
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
