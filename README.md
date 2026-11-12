# TalkNow

> **Create a room. Invite everyone. Talk instantly. No accounts, no downloads, zero footprint.**

TalkNow is an instant, temporary, link-based group conversation platform. It is engineered for people who need to have a quick conversation, meeting, or group chat right now—without forcing anyone to sign up, download software, reveal personal phone numbers, or leave permanent digital trails.

---

## 🎯 The Goal & Vision

Modern communication platforms (Slack, Teams, Discord, WhatsApp, Zoom) have introduced immense friction to simple conversations: mandatory accounts, phone verification, client downloads, contact syncing, and permanent chat history that lasts forever.

**TalkNow is built on a simple philosophy: Digital communication should be as immediate, natural, and disposable as walking into a room, having a conversation, and leaving.**

- **Friction-Zero:** Anyone can generate a room in two seconds and share the link. Guests pick a temporary display name and start chatting immediately.
- **Privacy by Design:** Nothing is permanent. Every room has an expiry countdown. When the timer expires or the creator closes the room, all messages, reactions, participants, and tokens are permanently destroyed from the database.
- **Instant Real-Time Chat:** Optimistic zero-latency messaging, typing indicators, and emoji reactions right in any browser without signing up.

---

## ✨ Key Features

### 🚀 Zero-Friction Group Rooms
- **Instant Creation:** Generate a temporary room in one click with optional custom room names.
- **Shareable Links & QR Codes:** Invite anyone with a clean link, ready-to-share invitation snippets, or scannable QR codes.
- **No Signups Required:** No emails, passwords, phone numbers, or OAuth logins. Participants just choose a temporary display name.
- **Host & Creator Badges:** Room creators maintain administrative rights to extend room duration or terminate the session on demand.

### ⏳ Ephemeral & Self-Destructing
- **Configurable Lifespan:** Set rooms to expire after 15 minutes, 30 minutes, 1 hour, 6 hours, or 24 hours.
- **Live Expiry Countdown:** Synchronized countdown clock visible to all active participants in real time.
- **Automated Data Purge:** Background schedulers automatically remove all database records, chat logs, and active sessions once time expires.
- **On-Demand Extension:** Room creators can extend active sessions whenever discussions run longer than expected.

### 💬 Real-Time Group Chat
- **High-Speed Messaging:** Bi-directional real-time communication powered by WebSockets with 0ms optimistic UI rendering.
- **Inline System Notices:** Messenger-style timeline notices when members join, leave, or room time is extended.
- **Interactive Emoji Reactions:** React to any message with emojis, complete with live counters and member attribution.
- **Typing Indicators:** Real-time feedback when participants are typing.
- **Intelligent Auto-Scroll:** Smart viewport handling that stays anchored at the latest messages while keeping chat smooth on page refreshes.

### 🎨 Modern Responsive Interface
- **Polished Visual Identity:** Clean theme centered around a signature purple aesthetic (`#7657E8`).
- **Dark & Light Mode:** Automatic system preference detection with quick manual theme switching.
- **Cross-Device Support:** Fully optimized experience across desktop browsers, tablets, and mobile screens.
- **Accessible & High-Contrast:** Intuitive typography, subtle transitions, and touch-friendly controls.

---

## 🏛️ System Architecture

TalkNow operates on a streamlined architecture designed for instant speed and resilient WebSocket connections:

```
[ Web Client / Browser ]
           │
           ├──► Frontend (Edge CDN) ─── Fast static asset delivery & SSR
           │
           └──► Backend Server (Node.js / Express / Socket.IO)
                     │
                     ├──► WebSocket & REST APIs (Room lifecycle, live chat, presence)
                     └──► Neon PostgreSQL (Ephemeral room storage & auto-expiry engine)
```

---

## 🔒 Privacy & Security Highlights

> [!IMPORTANT]
> **TalkNow does not track you.**
> - No user tracking cookies or third-party analytics trackers.
> - No phone numbers or email addresses are ever requested or stored.
> - Cryptographic token hashing ensures only authorized room creators can manage administrative controls.
> - When a room expires, cascading database deletion permanently wipes all associated data.
