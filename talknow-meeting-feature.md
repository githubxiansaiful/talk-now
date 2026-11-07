# TalkNow Meeting Feature
## Add-on Development Specification for Google Antigravity

**Project:** Existing TalkNow application  
**Feature:** Meeting-style group calling  
**Purpose:** Add calling to the working TalkNow project without rebuilding or disturbing its current chat system.

---

# 1. Feature Goal

Add a polished meeting experience inside existing TalkNow rooms.

People should be able to open a TalkNow room, start or join a meeting, see who is attending, control their microphones, and continue using the existing text chat.

The first release should focus on reliable group audio calling. Keep the design ready for video and screen sharing later, but do not delay the audio release with those features.

**Main experience:** Create a TalkNow room → Invite people → Start a meeting → Talk together.

# 2. Important: Preserve the Existing Project

The current TalkNow application is already working. It is the source of truth.

Before changing code:

1. Read the existing project guide and inspect the repository.
2. Find the current room model, member identity, room access checks, Socket.IO setup, and room page.
3. Reuse the current room and member system.
4. Do not create a second room system for calls.
5. Do not add login, registration, email, or password requirements.
6. Do not replace or rewrite working chat features.
7. Do not rename existing routes, events, database fields, or packages without a clear need.
8. Add call code in focused modules and components.
9. If a database change is needed, use a safe Prisma migration. Never reset or drop existing data.
10. Run existing checks and tests before and after the changes.

The existing TalkNow room, temporary member identity, room link, and room expiry rules must continue to work as they do now.

# 3. User Experience

## 3.1 Start a meeting

Inside an active room, show a clear **Start meeting** button.

When a member starts a meeting:

- Create a meeting session linked to the existing room.
- Set the meeting state to active.
- Show an active meeting banner to room members.
- Let each person choose whether to join with their microphone muted or unmuted.
- Ask for microphone permission only when needed.
- Open the meeting interface after the person joins.

If a meeting is already active, show **Join meeting** rather than creating another one.

Allow only one active meeting per TalkNow room in the first release.

## 3.2 Join a meeting

A member already in the TalkNow room can select **Join meeting**.

Show a pre-join screen with:

- Room or meeting name.
- Current participant count.
- Microphone permission status.
- Microphone selection when more than one device is available.
- Mute setting.
- **Join meeting** button.

Reuse the existing temporary TalkNow member identity. Do not ask the person to create another identity.

If microphone permission is denied, explain how to allow access and let the person retry. Never show a fake connected state.

## 3.3 During a meeting

The meeting screen should include:

- Main participant area.
- Participant names and connection states.
- Microphone states.
- Active speaker highlight.
- Meeting duration.
- Participant count.
- Bottom control bar.
- Optional side panel for the existing room chat.
- Clear leave meeting action.

A person can leave the meeting and remain in the TalkNow text room.

If a person leaves the TalkNow room entirely, their meeting connection must also end.

## 3.4 End a meeting

The host can end the meeting for everyone. Other participants can leave without ending it.

When the host ends the meeting:

- Notify all meeting participants.
- Stop local audio tracks.
- Close media connections.
- Remove the active meeting state.
- Return people to the existing TalkNow room.
- Keep the text room active unless its normal expiry or close rules say otherwise.

If the host disconnects unexpectedly, use a short reconnect grace period and a clear host recovery rule. Do not end the meeting immediately on a brief network drop.

# 4. Meeting Interface and Visual Direction

Create a premium, calm meeting interface inspired by modern online meeting tools. Do not copy another product exactly.

Match the existing TalkNow fonts, colors, buttons, borders, spacing, and theme behaviour.

## Desktop layout concept

```text
+-------------------------------------------------------------------+
| TalkNow     Friends Room       Meeting 12:42       5 participants |
+-------------------------------------------------------------------+
|                                                                   |
|                     PARTICIPANT AREA                              |
|                                                                   |
|       +-------------------+       +-------------------+            |
|       |                   |       |                   |            |
|       |    Saiful          |       |    Alex           |            |
|       |    Microphone      |       |    Speaking       |            |
|       |                   |       |                   |            |
|       +-------------------+       +-------------------+            |
|                                                                   |
|       +-------------------+       +-------------------+            |
|       |                   |       |                   |            |
|       |    Rahim           |       |    Maria          |            |
|       |    Muted           |       |    Connecting     |            |
|       |                   |       |                   |            |
|       +-------------------+       +-------------------+            |
|                                                                   |
+-------------------------------------------------------------------+
| Participants | Chat | Mic | Audio settings | Leave | End meeting  |
+-------------------------------------------------------------------+
```

## Participant tiles

For audio-only meetings, show:

- Generated avatar using initials or the existing avatar.
- Display name.
- Microphone status.
- Speaking indicator.
- Connection status when reconnecting.

Do not show empty black video boxes in audio-only mode.

Responsive layout guidance:

- 1 participant: one centered tile.
- 2 participants: two balanced tiles.
- 3 to 4 participants: balanced grid.
- 5 to 9 participants: responsive grid with smaller tiles.
- More participants: pagination or a scrollable participant layout.

## Active speaker

Highlight the person whose microphone audio is active. Use a subtle border, glow, or speaking indicator. Avoid distracting animation and do not rely on color alone.

## Bottom control bar

Include:

1. Microphone mute or unmute.
2. Audio device settings.
3. Participants panel.
4. Chat panel.
5. Leave meeting.
6. End meeting for everyone, for the host only.

Use clear labels or tooltips. Keep the end meeting action visually distinct and ask for confirmation.

## Mobile layout

- Use the full available screen.
- Keep the participant area clear.
- Use a compact bottom control bar.
- Make controls easy to tap.
- Put participant and chat lists inside drawers or sheets.
- Respect mobile safe areas.
- Prevent controls from being hidden by the browser or keyboard.
- Keep leave and end meeting actions separate.

# 5. Feature Scope

## Release 1: Group audio meeting

Required:

- Start a meeting from an existing TalkNow room.
- Join an active meeting.
- Multiple participants.
- Microphone permission handling.
- Mute and unmute.
- Participant list.
- Participant join and leave updates.
- Active speaker indication.
- Meeting duration.
- Connection and reconnect status.
- Leave meeting.
- Host ends meeting for everyone.
- Meeting state synchronized across users.
- Responsive meeting interface.
- Clear error handling.
- Proper cleanup of audio and network resources.

## Release 1.1: Better meeting controls

After the first release is stable:

- Select microphone input device.
- Select speaker output device where browser support allows.
- Push-to-talk option.
- Noise suppression and echo cancellation settings where supported.
- Meeting waiting state.
- Host mute controls with clear feedback.
- Optional meeting lock.
- Participant removal by host.
- Network quality indicator.

## Later release: Video and screen sharing

Keep the design and architecture ready for:

- Camera on and off.
- Video participant tiles.
- Screen sharing.
- Screen share permissions.
- Full-screen shared content.
- Speaker and gallery view.
- Camera selection.
- Video quality settings.

Do not implement video or screen sharing in the first audio release unless specifically approved.

# 6. Recommended Calling Technology

Use WebRTC for real-time audio.

Socket.IO should manage meeting signalling and participant state. It must not carry the actual audio stream.

For group calling, use an SFU media server rather than connecting every participant directly to every other participant. Full mesh connections can become expensive for devices and networks as the group grows.

## Preferred option: LiveKit

Evaluate LiveKit as the preferred media layer.

LiveKit provides:

- WebRTC based audio and video rooms.
- Server managed media routing through an SFU.
- Participant connection management.
- Audio track publishing and subscription.
- Active speaker information.
- Reconnection support.
- Room and participant permissions.

Use a self-hosted LiveKit server or a hosted service based on the current deployment, expected traffic, budget, and operational needs.

Do not assume LiveKit is already installed. Inspect the project and deployment first.

| Technology | Responsibility |
|---|---|
| Existing Next.js app | Meeting screens and controls |
| Existing Socket.IO server | Room state and meeting coordination |
| WebRTC media layer | Real-time audio |
| LiveKit, if selected | SFU routing and media session |
| Existing PostgreSQL | Meeting records if needed |
| Existing Redis | Shared presence and coordination if already configured |

Do not build an SFU from scratch. Use a proven media server.

# 7. Meeting Architecture

```text
                 EXISTING TALKNOW ROOM
                           |
             Existing temporary member identity
                           |
                           v
                 MEETING COORDINATION
                 Existing Node.js server
                 - Start meeting
                 - Join meeting
                 - Leave meeting
                 - Host permissions
                 - Meeting state
                           |
               Secure media token request
                           |
                           v
                    MEDIA SERVER
                  LiveKit SFU or chosen
                  WebRTC media service
                           |
             -----------------------------
             |             |             |
          Person A      Person B      Person C
          Microphone    Microphone    Microphone
             |             |             |
             -----------------------------
                           |
                    Group audio
```

The existing TalkNow room remains the source of membership and identity. A meeting is a temporary session attached to that room.

# 8. Meeting State and Data

Inspect the current database before adding models.

If the existing schema does not already support this, add a meeting record linked to the existing room.

## Suggested Meeting model

- `id`: internal unique identifier.
- `roomId`: relation to the existing TalkNow room.
- `status`: ACTIVE, ENDED, or EXPIRED.
- `hostMemberId`: existing room member who started the meeting.
- `providerRoomId`: media provider room identifier.
- `startedAt`.
- `endedAt`: optional.
- `createdAt`.
- `updatedAt`.

Use the media provider's live participant state where possible. Avoid storing unnecessary duplicate presence data.

If participant history is needed, store only the minimum:

- `id`.
- `meetingId`.
- `memberId`.
- `joinedAt`.
- `leftAt`.
- `role`, if needed.

Do not store audio recordings. Do not record calls. Do not store microphone audio.

## Data rules

- A meeting must belong to an existing TalkNow room.
- A meeting cannot continue after its parent room expires or closes.
- Only one active meeting per room in the first release.
- A room member must be validated before a media token is issued.
- The host must be validated on the server.
- Never trust a client supplied host flag.
- Do not expose media server API secrets to the browser.

# 9. Meeting Events and API Behaviour

Reuse the existing Socket.IO connection and event conventions. Inspect current event names before adding new ones.

Suggested client-to-server events:

| Event | Purpose |
|---|---|
| `meeting:start` | Request a new meeting |
| `meeting:join` | Join an active meeting |
| `meeting:leave` | Leave the meeting |
| `meeting:end` | Host ends meeting |
| `meeting:state:request` | Request current meeting state |

Suggested server-to-client events:

| Event | Purpose |
|---|---|
| `meeting:started` | Meeting has started |
| `meeting:state` | Current meeting state |
| `meeting:participant:joined` | Participant joined |
| `meeting:participant:left` | Participant left |
| `meeting:participant:updated` | Participant state changed |
| `meeting:ended` | Meeting ended |
| `meeting:error` | Meeting action failed |

Use acknowledgement callbacks for actions that need a clear success or failure response.

## Secure media token flow

1. Browser requests to join the meeting.
2. Existing server validates the TalkNow room.
3. Server validates the member's temporary session.
4. Server checks that the meeting is active.
5. Server creates a short-lived media access token using server-only credentials.
6. Browser receives the token through a secure response.
7. Browser connects to the media server.
8. Participant publishes their microphone track.
9. Other authorized participants subscribe to the audio track.

Never generate media tokens in client-side code. Never put media server secrets or long-lived credentials in public environment variables.

# 10. Microphone and Audio Behaviour

## Permission handling

- Request microphone permission only after the user chooses to join.
- Explain why microphone access is needed.
- Show a useful message if permission is denied.
- Let the user retry after changing browser permission.
- Stop audio tracks when the person leaves.
- Handle devices with no microphone.
- Handle a microphone being disconnected during a meeting.

## Mute behaviour

- Mute must stop publishing microphone audio to others.
- Unmute must restore audio only after permission is granted.
- The interface must reflect the actual microphone state.
- If the browser blocks the microphone, show a clear error.
- Do not show an unmuted state when no microphone track is active.

## Audio quality

Use supported browser audio processing options where available:

- Echo cancellation.
- Noise suppression.
- Automatic gain control.

Allow the media provider to manage adaptive audio quality. Do not force a high audio bitrate on weak connections.

# 11. Participant and Meeting Behaviour

Show useful states:

- Connecting.
- Connected.
- Speaking.
- Muted.
- Reconnecting.
- Connection lost.

Use the media provider's active speaker information if available. Do not rely only on Socket.IO typing events to detect speech.

Prevent one temporary member session from appearing as several unrelated people where possible. Define clear behaviour if the same member joins from another tab. Avoid duplicate participant tiles and microphone feedback.

When a network connection drops:

- Show a reconnecting state.
- Attempt to restore the media connection.
- Keep the TalkNow text room usable if the meeting connection fails.
- Restore participant state after reconnect.
- Avoid duplicate participant records.
- Explain when the participant must manually rejoin.

# 12. Host Permissions

The meeting host is the member who starts the meeting.

In the first release, the host can:

- End meeting for everyone.

Later, consider:

- Remove a participant.
- Lock the meeting.
- Mute a participant.
- Transfer host role.

All host actions must be checked by the server.

If the host leaves without ending the meeting, use a defined grace period. If the host does not return, either assign a new host using a clear server-side rule or end the meeting and notify everyone. Choose one rule and document it.

# 13. Privacy and Security

- Require active TalkNow room membership before issuing a meeting token.
- Use short-lived media access tokens.
- Limit each token to the correct meeting and participant identity.
- Give audio publish and subscribe permissions only as needed.
- Do not expose media server credentials.
- Use HTTPS in production.
- Configure media server network access and firewall rules correctly.
- Apply meeting start and join rate limits.
- Prevent users from joining expired or closed rooms.
- End media sessions when the parent room ends.
- Do not record calls.
- Do not claim end-to-end encryption unless it is implemented and verified.
- Explain that the media service processes live audio to deliver the call.

Update the privacy page to explain live audio processing and the media provider used.

# 14. Environment Configuration

Add only the variables required by the selected media provider.

For LiveKit, use server-only variables such as:

```env
# Server only. Never expose these through NEXT_PUBLIC variables.
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

# Public connection URL, if required by the client SDK.
NEXT_PUBLIC_LIVEKIT_URL=
```

Use the actual variable naming and connection requirements from the chosen deployment.

Do not place API secrets in the Next.js client bundle. Do not overwrite the existing `.env` file. Update `.env.example` with safe placeholders and preserve all current variables.

# 15. Network and Deployment Requirements

Real-time audio may need network configuration beyond the existing website and Socket.IO server.

Before production launch:

- Confirm the media server is reachable from the public internet.
- Configure HTTPS and secure WebSocket connections.
- Configure the media server's required UDP and TCP ports.
- Configure a TURN service if required by the chosen deployment and network conditions.
- Test users behind home routers, office firewalls, mobile networks, and restrictive networks.
- Keep PostgreSQL and Redis private.
- Monitor media server CPU, memory, network traffic, and active participants.
- Set resource limits and usage alerts.

A working website and Socket.IO connection do not prove that WebRTC audio will work. Test the media path separately.

# 16. Testing Plan

## Functional tests

- A room member can start a meeting.
- Another room member can join.
- Several people can join the same meeting.
- A non-member cannot obtain a meeting token.
- A user cannot join an expired or closed room.
- A user can mute and unmute.
- Other participants see the correct microphone state.
- Active speaker indication works.
- A participant can leave without ending the meeting.
- The host can end the meeting for everyone.
- Ending the parent TalkNow room also ends its meeting.
- Existing text chat works during a meeting.
- A participant can keep using text chat after leaving the meeting.

## Device tests

- Microphone permission allowed.
- Microphone permission denied.
- No microphone connected.
- Microphone unplugged during a call.
- Multiple microphones available.
- Browser tab refresh.
- Browser tab closed.
- Mobile browser permission flow.

## Network tests

- Stable Wi-Fi.
- Weak Wi-Fi.
- Mobile data.
- Temporary network loss.
- Reconnection.
- Several people joining at the same time.
- Participants on different networks.

## Quality checks

- No duplicate participant tiles.
- No microphone audio continues after leaving.
- No audio continues after the meeting ends.
- No leaked media tokens.
- No broken existing chat features.
- No console errors during normal use.
- No TypeScript or lint errors.

Test with real devices and browsers. A successful local test in two tabs is not enough.

# 17. Implementation Phases

Keep the application working after every phase.

## Phase 1: Inspect and plan

- Inspect the existing TalkNow application.
- Find room and member models.
- Find the existing Socket.IO server and event conventions.
- Find the current room page and design system.
- Check deployment and environment setup.
- Decide how the media server will be hosted.
- Write a short implementation plan based on the actual code.

**Completion check:** The plan shows how meetings will use existing rooms and members without duplicating the current system.

## Phase 2: Meeting interface

- Add Start meeting.
- Add Join meeting state.
- Build the pre-join screen.
- Build the responsive meeting screen.
- Add participant tiles using sample data.
- Add microphone and leave controls.
- Match the existing TalkNow design system.

**Completion check:** Screens look correct on desktop and mobile. Clearly label any controls that are not connected yet.

## Phase 3: Media server and audio connection

- Configure the chosen media provider.
- Add secure server-side token generation.
- Validate existing room membership.
- Connect the browser to the media server.
- Publish microphone audio.
- Subscribe to other participants' audio.
- Add mute and unmute.
- Handle permission errors.

**Completion check:** Two or more real devices can hear one another in the same meeting.

## Phase 4: Meeting state and participant experience

- Add start and join coordination.
- Add participant updates.
- Add active speaker indication.
- Add meeting duration.
- Add reconnect handling.
- Add host end meeting action.
- Clean up tracks and sessions.

**Completion check:** State remains correct when people join, leave, refresh, disconnect, and reconnect.

## Phase 5: Security and testing

- Test room access.
- Test token permissions.
- Test expired and closed rooms.
- Test device and network failures.
- Test several simultaneous participants.
- Confirm existing chat is unaffected.
- Review privacy information.

**Completion check:** Functional, device, network, and security tests pass.

## Phase 6: Production release

- Configure the production media server.
- Configure network ports and TURN if needed.
- Add monitoring and resource limits.
- Deploy the updated application.
- Test from different networks and real devices.
- Release to a small group before opening it to everyone.

**Completion check:** People can reliably join and leave a group audio meeting in production.

# 18. Instructions for Google Antigravity

Treat this document as a feature specification for the existing TalkNow project.

Before coding:

1. Inspect the actual repository.
2. Read the existing project guide.
3. Identify the current room and member identity implementation.
4. Identify the current Socket.IO connection and event naming style.
5. Identify the existing design system and reusable components.
6. Identify the current database schema and deployment setup.
7. Present a concise plan listing the files to add or change.

During development:

- Preserve all working chat functionality.
- Reuse existing room and member identity.
- Do not create a separate login or registration system.
- Do not duplicate the room database model.
- Do not put media provider secrets in the browser.
- Use a proven SFU media service for group audio.
- Keep meeting state on the server.
- Validate every important action on the server.
- Keep UI components small and reusable.
- Match the existing TalkNow visual style.
- Make desktop and mobile experiences equally usable.
- Do not add fake controls that appear to work.
- Do not add video or screen sharing in the first audio release unless specifically approved.
- Run existing tests and checks before and after implementation.

## First task for Antigravity

Start with **Phase 1: Inspect and plan**. Do not immediately rewrite or generate the application.

First inspect the current TalkNow code and report:

- How the current room system works.
- How temporary member identity works.
- How Socket.IO is configured.
- Which existing files should be reused.
- Which new files are needed.
- Whether a database migration is needed.
- Which media server option best fits the current deployment.
- Any risks to existing chat functionality.

After presenting this plan, implement the meeting feature phase by phase.

# 19. Definition of Done

The meeting feature is complete when:

1. A member can start a meeting from an existing TalkNow room.
2. Other members can join without creating an account.
3. Several people can hear one another in real time.
4. Microphone mute and unmute work correctly.
5. Participant tiles show correct names and states.
6. Active speaker indication works.
7. A participant can leave without ending the meeting.
8. The host can end the meeting for everyone.
9. Room expiry and closure also end the meeting.
10. Audio tracks and media sessions are cleaned up correctly.
11. The meeting works on desktop and mobile.
12. Existing text chat continues to work.
13. Real device and network tests pass.

**Final product experience:** A person opens TalkNow, creates a room, shares one link, and invites friends. Everyone can chat together. When they want to talk, they enter the meeting area and speak naturally, just like an online group meeting.

Keep it simple for users, reliable behind the scenes, and visually polished.
