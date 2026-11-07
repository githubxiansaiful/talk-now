# TalkNow

## Project Structure and Development Guide for Google Antigravity

**Project type:** Temporary, link-based group conversation web
application\
**Primary goal:** Let people create a room, share a link, and chat
together instantly without creating accounts.\
**Working product name:** TalkNow\
**Document purpose:** This file is the main product, design,
architecture, and implementation guide for Antigravity.

------------------------------------------------------------------------

# 1. Product Vision

TalkNow is a fast, simple, temporary group chat application.

A person opens the website, creates a room, chooses a temporary display
name, and shares a private invitation link. Other people open the link,
choose their display names, and join the same room. Everyone can
exchange messages in real time.

The product should feel polished and welcoming, not like a developer
demo or a basic chat clone.

## Core product promise

**Create a room. Invite everyone. Talk instantly. No account needed.**

## Product principles

1.  No account creation, email address, phone number, or password.
2.  Joining a room should take only a few simple steps.
3.  A room link should be difficult to guess.
4.  The chat should feel instant and work well on mobile and desktop.
5.  Rooms and messages are temporary and have clear expiry rules.
6.  The interface should be calm, clean, accessible, and easy to
    understand.
7.  Do not claim that a room is end to end encrypted unless that feature
    has been properly designed and implemented.

------------------------------------------------------------------------

# 2. Main User Journeys

## 2.1 Create a room

1.  A visitor opens the homepage.
2.  They select **Create a room**.
3.  They enter a display name.
4.  They choose a room duration.
5.  They create the room.
6.  The application creates a secure, random room identifier.
7.  The visitor enters the room as its first member.
8.  The room page shows a shareable invitation link.

## 2.2 Join a room

1.  A person receives an invitation link.
2.  They open the link.
3.  The application checks that the room exists and is still active.
4.  The person enters a display name.
5.  They join the room and see the current conversation.
6.  The member list updates for everyone in the room.

## 2.3 Chat together

Members can:

-   Send and receive text messages in real time.
-   See who is online.
-   See when another member is typing.
-   See message time.
-   Copy the room invitation link.
-   Leave the room.
-   View recent messages that are still available in the room.

## 2.4 Room ends

-   The room creator can end the room.
-   A room automatically expires at its expiry time.
-   Expired rooms cannot accept new members or messages.
-   Temporary messages and room data are deleted according to the
    retention policy.
-   People who open an expired link see a helpful expired-room page.

------------------------------------------------------------------------

# 3. Scope and Release Plan

## Version 1: Core group chat

Build and test these features first:

-   Homepage and room creation.
-   Temporary display names.
-   Private invitation links.
-   Group rooms with multiple members.
-   Real-time text messaging.
-   Online member list.
-   Typing indicator.
-   Message timestamps.
-   Copy invitation link.
-   Leave room.
-   Creator room controls.
-   Room expiry.
-   Responsive design.
-   Basic abuse prevention and rate limits.
-   Clear connection and error states.

## Version 1.1: Better chat experience

Add after the core version is stable:

-   Emoji picker.
-   Message reactions.
-   Reply to a message.
-   Image sharing with file validation and size limits.
-   Unread message indicator.
-   Member join and leave notices.
-   Optional room password.
-   Optional room capacity setting.

## Later versions

Consider these only after the core product is reliable:

-   Voice messages.
-   Voice calls.
-   Video calls.
-   Screen sharing.
-   End to end encryption.
-   Larger public communities.
-   Progressive Web App support.

Do not let later features delay the first working release.

------------------------------------------------------------------------

# 4. Recommended Technology

Use a TypeScript based monorepo with separate web and real-time server
applications.

  -----------------------------------------------------------------------
  Layer                   Technology              Responsibility
  ----------------------- ----------------------- -----------------------
  Web application         Next.js App Router      Pages, layouts, user
                                                  interface

  Language                TypeScript              Shared types and safer
                                                  code

  Styling                 Tailwind CSS            Responsive visual
                                                  system

  UI components           shadcn/ui and Lucide    Accessible interface
                                                  components

  Real-time connection    Socket.IO               Live messages and room
                                                  events

  Server                  Node.js                 Socket server and API
                                                  logic

  Database                PostgreSQL              Rooms, members,
                                                  messages

  Database toolkit        Prisma                  Schema and database
                                                  queries

  Presence and scaling    Redis                   Online status, socket
                                                  coordination, rate
                                                  limits

  Validation              Zod                     Validate client and
                                                  server data

  File storage            S3-compatible storage   Optional image uploads
                                                  in a later release

  Deployment              VPS, Docker, Nginx      Production hosting
  -----------------------------------------------------------------------

## Important architecture choice

Run the Next.js web application and Socket.IO server as separate
processes.

Do not depend on a short-lived serverless function for persistent
Socket.IO connections. Use a Node.js process that can keep WebSocket
connections open.

For the first local development release, Redis can be optional if the
server uses a simple in-memory adapter. Before running multiple
Socket.IO server instances in production, add Redis and the appropriate
Socket.IO adapter.

------------------------------------------------------------------------

# 5. System Architecture

``` text
                    VISITORS
                       |
                       v
              NEXT.JS WEB APP
              - Homepage
              - Create room
              - Join room
              - Chat interface
                       |
             HTTPS / API requests
                       |
                       v
                NODE.JS SERVER
                - Room service
                - Member service
                - Message service
                - Validation
                - Rate limits
                       |
                 SOCKET.IO
                /     |      \
               /      |       \
          Person A Person B Person C
                       |
             ---------------------
             |                   |
             v                   v
        POSTGRESQL             REDIS
        - Rooms                - Presence
        - Members              - Socket adapter
        - Messages             - Temporary limits
        - Expiry data
```

## Main responsibilities

### Next.js

-   Render the homepage and chat pages.
-   Handle room creation forms.
-   Handle the join screen.
-   Display messages and room members.
-   Connect to the Socket.IO server from the browser.
-   Show loading, offline, reconnecting, and error states.

### Node.js and Socket.IO

-   Validate room access.
-   Add and remove room members.
-   Broadcast messages to room members.
-   Broadcast typing status.
-   Maintain online presence.
-   Enforce room expiry.
-   Apply message limits and abuse protection.

### PostgreSQL

-   Store room records.
-   Store temporary member records when needed.
-   Store messages until room expiry.
-   Support room history after a page refresh while the room is active.

### Redis

-   Store short-lived presence information.
-   Coordinate Socket.IO events across multiple server instances.
-   Support shared rate limits and temporary state where needed.

------------------------------------------------------------------------

# 6. Suggested Project Folder Structure

Use a monorepo so the web application, real-time server, and shared
types stay organized.

``` text
talknow/
|
|-- apps/
|   |
|   |-- web/
|   |   |-- public/
|   |   |   |-- images/
|   |   |   |-- icons/
|   |   |   `-- fonts/
|   |   |
|   |   |-- src/
|   |       |-- app/
|   |       |   |-- (marketing)/
|   |       |   |   |-- page.tsx
|   |       |   |   `-- layout.tsx
|   |       |   |
|   |       |   |-- create/
|   |       |   |   `-- page.tsx
|   |       |   |
|   |       |   |-- room/
|   |       |   |   `-- [roomCode]/
|   |       |   |       `-- page.tsx
|   |       |   |
|   |       |   |-- expired/
|   |       |   |   `-- page.tsx
|   |       |   |
|   |       |   |-- privacy/
|   |       |   |   `-- page.tsx
|   |       |   |
|   |       |   |-- terms/
|   |       |   |   `-- page.tsx
|   |       |   |
|   |       |   |-- globals.css
|   |       |   `-- layout.tsx
|   |       |
|   |       |-- components/
|   |       |   |-- ui/
|   |       |   |-- landing/
|   |       |   |   |-- hero.tsx
|   |       |   |   |-- feature-grid.tsx
|   |       |   |   `-- site-footer.tsx
|   |       |   |
|   |       |   |-- room/
|   |       |   |   |-- chat-header.tsx
|   |       |   |   |-- chat-layout.tsx
|   |       |   |   |-- message-list.tsx
|   |       |   |   |-- message-item.tsx
|   |       |   |   |-- message-composer.tsx
|   |       |   |   |-- member-list.tsx
|   |       |   |   |-- typing-indicator.tsx
|   |       |   |   |-- room-share-dialog.tsx
|   |       |   |   |-- room-settings-dialog.tsx
|   |       |   |   `-- room-expiry-label.tsx
|   |       |   |
|   |       |   `-- common/
|   |       |       |-- app-logo.tsx
|   |       |       |-- theme-toggle.tsx
|   |       |       |-- loading-screen.tsx
|   |       |       `-- error-state.tsx
|   |       |
|   |       |-- hooks/
|   |       |   |-- use-socket.ts
|   |       |   |-- use-room.ts
|   |       |   |-- use-messages.ts
|   |       |   `-- use-presence.ts
|   |       |
|   |       |-- lib/
|   |       |   |-- socket-client.ts
|   |       |   |-- api-client.ts
|   |       |   |-- utils.ts
|   |       |   `-- constants.ts
|   |       |
|   |       `-- types/
|   |           `-- index.ts
|   |
|   `-- server/
|       |-- src/
|           |-- index.ts
|           |-- config/
|           |   |-- env.ts
|           |   `-- cors.ts
|           |
|           |-- socket/
|           |   |-- index.ts
|           |   |-- middleware.ts
|           |   |-- room-handlers.ts
|           |   |-- message-handlers.ts
|           |   |-- presence-handlers.ts
|           |   `-- typing-handlers.ts
|           |
|           |-- modules/
|           |   |-- rooms/
|           |   |   |-- room.controller.ts
|           |   |   |-- room.service.ts
|           |   |   |-- room.repository.ts
|           |   |   `-- room.validation.ts
|           |   |
|           |   |-- members/
|           |   |   |-- member.service.ts
|           |   |   `-- member.repository.ts
|           |   |
|           |   `-- messages/
|           |       |-- message.service.ts
|           |       |-- message.repository.ts
|           |       `-- message.validation.ts
|           |
|           |-- middleware/
|           |   |-- rate-limit.ts
|           |   `-- error-handler.ts
|           |
|           |-- jobs/
|           |   `-- expire-rooms.ts
|           |
|           |-- lib/
|           |   |-- prisma.ts
|           |   |-- redis.ts
|           |   `-- logger.ts
|           |
|           `-- utils/
|               |-- room-code.ts
|               `-- time.ts
|
|-- packages/
|   |-- database/
|   |   |-- prisma/
|   |   |   `-- schema.prisma
|   |   `-- src/
|   |       `-- index.ts
|   |
|   |-- shared/
|   |   `-- src/
|   |       |-- events.ts
|   |       |-- schemas.ts
|   |       |-- types.ts
|   |       `-- constants.ts
|   |
|   `-- config/
|       |-- typescript/
|       `-- eslint/
|
|-- docs/
|   |-- architecture.md
|   |-- socket-events.md
|   `-- deployment.md
|
|-- .env.example
|-- .gitignore
|-- package.json
|-- pnpm-workspace.yaml
|-- turbo.json
|-- tsconfig.json
`-- README.md
```

Keep modules small and focused. Do not put all socket events, database
queries, and business rules into one large file.

------------------------------------------------------------------------

# 7. Pages and Routes

  Route                Purpose
  -------------------- ------------------------------
  `/`                  Main landing page
  `/create`            Create a new conversation
  `/room/[roomCode]`   Join or open a chat room
  `/expired`           Friendly expired room screen
  `/privacy`           Privacy information
  `/terms`             Terms of use

## Homepage

The homepage should explain the product immediately.

Main heading:

**A conversation starts with one click.**

Supporting text:

Create a private room, invite your friends, and start talking instantly.
No accounts, no passwords, no hassle.

Primary action: **Create a room**

Secondary action: **Join a room**

The homepage should include:

-   A polished hero section.
-   A clear room creation action.
-   A short three-step explanation.
-   A small feature section.
-   A privacy and temporary-room explanation.
-   A simple footer.

Do not overcrowd the homepage.

## Create room page

Fields:

-   Your display name.
-   Room name, optional.
-   Room duration.
-   Optional member limit.

Primary action: **Create room**

Suggested room durations:

-   30 minutes.
-   1 hour.
-   6 hours.
-   24 hours.

The room creator should enter the room automatically after successful
creation.

## Join room screen

Before joining, show:

-   Room name, if available.
-   Current member count.
-   Room expiry time.
-   Display name field.
-   Join button.

Never reveal private message history to a visitor until the server has
accepted them as a room member.

## Chat room page

The chat page is the most important screen in the product.

Desktop layout:

``` text
+----------------------------------------------------------+
| TalkNow       Room name             Invite   Settings    |
+----------------------+-----------------------------------+
| MEMBERS              | CHAT                              |
|                      |                                   |
| Saiful (You)         | Saiful                            |
| Alex                 | Hello everyone!                   |
| Rahim                |                                   |
| Maria                |                         Alex      |
|                      |               Hey, how are you?   |
|                      |                                   |
|                      | Rahim                             |
|                      | I just joined!                    |
|                      |                                   |
|                      |-----------------------------------|
|                      | Write a message...          Send  |
+----------------------+-----------------------------------+
```

Mobile layout:

-   Use the full screen for the conversation.
-   Keep the chat header compact.
-   Put the member list inside a drawer or sheet.
-   Keep the message composer fixed at the bottom.
-   Make buttons easy to tap.
-   Respect mobile safe areas.
-   Prevent the keyboard from hiding the composer.

------------------------------------------------------------------------

# 8. Visual Design System

The interface must look like a carefully designed modern product.

## Design direction

Use a clean, warm, modern style with a subtle purple accent.

The design should feel:

-   Friendly.
-   Calm.
-   Modern.
-   Light.
-   Premium.
-   Simple.
-   Trustworthy.

Avoid:

-   Excessive gradients.
-   Too many colors.
-   Heavy shadows.
-   Huge rounded cards everywhere.
-   Crowded layouts.
-   Unnecessary animation.
-   A generic dashboard look.

## Suggested color palette

  Token            Color       Use
  ---------------- ----------- --------------------------------
  Background       `#F8F8FC`   Main page background
  Surface          `#FFFFFF`   Cards and panels
  Primary          `#7657E8`   Main actions
  Primary hover    `#6545D5`   Hover state
  Text             `#171725`   Main text
  Secondary text   `#747487`   Supporting text
  Border           `#E9E8F0`   Dividers and borders
  Success          `#16A36A`   Online status
  Danger           `#DC4C4C`   Errors and destructive actions

Use CSS variables so colors can be changed in one place.

## Typography

Use a clean sans-serif font such as Inter or Geist.

Suggested hierarchy:

-   Hero heading: 56 to 64px desktop.
-   Section heading: 32 to 40px.
-   Page heading: 28 to 36px.
-   Card heading: 18 to 22px.
-   Body text: 15 to 16px.
-   Small labels: 12 to 14px.

Use a readable line height and avoid very thin font weights.

## Spacing and shape

-   Use a consistent spacing scale.
-   Main content width: approximately 1120px.
-   Use 12 to 16px corner radius for controls.
-   Use 16 to 24px corner radius for larger cards.
-   Use subtle borders.
-   Use shadows only where they help show depth.

## Light and dark modes

Support both modes if it can be done without delaying the core chat
experience.

The light mode should be the default. Dark mode should use carefully
chosen surface and text colors, not simply invert every color.

## Animation

Use small, useful transitions:

-   Button hover and press.
-   Dialog opening.
-   New message arrival.
-   Typing indicator dots.
-   Online status changes.

Keep animations quick and respect reduced-motion preferences.

------------------------------------------------------------------------

# 9. Database Design

Use PostgreSQL with Prisma.

The first version can use these models.

## Room

Suggested fields:

-   `id`: internal UUID.
-   `code`: unique, random public room code.
-   `name`: optional room name.
-   `creatorTokenHash`: hash of the creator's room control token.
-   `status`: ACTIVE or EXPIRED or CLOSED.
-   `maxMembers`: optional member limit.
-   `createdAt`.
-   `expiresAt`.
-   `closedAt`: optional.

## Member

Suggested fields:

-   `id`: internal UUID.
-   `roomId`: relation to Room.
-   `displayName`.
-   `sessionTokenHash`: hash of the temporary member session token.
-   `joinedAt`.
-   `lastSeenAt`.
-   `leftAt`: optional.
-   `isCreator`: boolean.

## Message

Suggested fields:

-   `id`: internal UUID.
-   `roomId`: relation to Room.
-   `memberId`: relation to Member.
-   `content`.
-   `messageType`: TEXT in the first version.
-   `createdAt`.
-   `editedAt`: optional.
-   `deletedAt`: optional.

## Database rules

-   Index `Room.code`.
-   Index `Room.expiresAt`.
-   Index messages by `roomId` and `createdAt`.
-   Use foreign keys and sensible delete rules.
-   Use database transactions when creating a room and its first member.
-   Never store raw creator or member session tokens.
-   Keep room codes separate from private session tokens.
-   Delete expired room data with a scheduled cleanup job.

------------------------------------------------------------------------

# 10. Socket.IO Events

Use a shared event contract in `packages/shared`.

All incoming event data must be validated on the server.

## Client to server events

  Event                    Purpose
  ------------------------ -------------------------------
  `room:join`              Request to join a room
  `room:leave`             Leave a room
  `message:send`           Send a new message
  `typing:start`           Start typing indicator
  `typing:stop`            Stop typing indicator
  `room:members:request`   Request current member list
  `room:close`             Creator requests room closure

## Server to client events

  Event                  Purpose
  ---------------------- -------------------------------
  `room:joined`          Join accepted
  `room:error`           Room or join error
  `room:member:joined`   A member joined
  `room:member:left`     A member left
  `room:members`         Current member list
  `message:new`          New message received
  `message:rejected`     Message could not be accepted
  `typing:update`        Typing status changed
  `room:closed`          Room has been closed
  `room:expired`         Room has expired
  `presence:update`      Online status changed

## Event design rules

-   Use acknowledgement callbacks for actions that need a clear success
    or failure response.
-   Include a unique message ID generated by the client or server to
    prevent duplicate display.
-   Validate message length and type.
-   Do not trust a client supplied member ID or creator flag.
-   Derive member identity from a validated server session.
-   Do not broadcast secret session tokens.
-   Do not send a message to a room until membership and room status
    have been checked.
-   Handle reconnects without creating duplicate members.

------------------------------------------------------------------------

# 11. Temporary Identity and Room Security

No login does not mean no security.

Use temporary identity sessions.

## Member identity flow

1.  A visitor enters a display name.
2.  The server validates the room and name.
3.  The server creates a random member session token.
4.  Store only a hash of that token in the database.
5.  Return the token securely to the browser.
6.  The browser stores it in a secure, appropriate session mechanism.
7.  On reconnect, the server validates the token and restores the member
    session.

For browser security, prefer an HttpOnly, Secure, SameSite cookie for
session tokens when the application architecture allows it. Do not put
long-lived secret tokens in URLs or local storage.

## Room link security

-   Generate room codes using a cryptographically secure random
    generator.
-   Use enough random data to make guessing impractical.
-   Treat a room link as a private invitation, not as proof of end to
    end encryption.
-   Apply join rate limits.
-   Allow the creator to close the room.
-   Do not expose internal database IDs in public URLs.

## Abuse prevention

-   Limit message length.
-   Limit messages sent per member within a time window.
-   Limit room creation per IP or other privacy-conscious abuse signal.
-   Limit join attempts.
-   Validate display names.
-   Escape or safely render message content.
-   Do not render user messages as raw HTML.
-   Validate uploaded files before allowing file sharing.
-   Set CORS to the exact production web origin.
-   Use HTTPS in production.
-   Add basic server logs without recording private message content
    unnecessarily.

------------------------------------------------------------------------

# 12. Room Expiry and Data Retention

Temporary conversations must have clear rules.

Suggested default:

-   Default room duration: 1 hour.
-   Creator can choose 30 minutes, 1 hour, 6 hours, or 24 hours.
-   Show the remaining room time in the chat header.
-   Do not accept new messages after expiry.
-   Notify connected users when the room expires.
-   Mark the room as expired.
-   Delete its messages and member records after the defined cleanup
    period.

Use a scheduled background job to find and clean expired rooms. Do not
rely only on a browser timer.

For the first release, define a short cleanup delay to allow a room to
transition cleanly to the expired state. Explain the actual deletion
policy in the privacy page.

------------------------------------------------------------------------

# 13. Message and Presence Behaviour

## Message behaviour

-   Show messages in chronological order.
-   Group consecutive messages from the same person.
-   Show the sender's name and time.
-   Use different alignment or subtle styling for the current user's
    messages.
-   Keep long messages readable.
-   Add a clear empty state when no messages exist.
-   Scroll to the latest message when appropriate.
-   Do not force scroll to the bottom when a user is reading older
    messages.

## Online members

-   Show each member's display name.
-   Show a small online indicator.
-   Mark the current user clearly.
-   Update the member list when someone joins or leaves.
-   Do not count multiple browser tabs as multiple people if they share
    one member session.

## Typing status

-   Send typing events only while the user is actively typing.
-   Stop typing after a short idle period.
-   Do not send a typing event for every keystroke.
-   Show a compact indicator such as "Alex is typing".
-   Avoid showing the current user's own typing status.

## Reconnection

-   Show a reconnecting message when the socket connection drops.
-   Attempt to reconnect automatically.
-   Restore the member session after reconnecting.
-   Load messages that arrived while the user was offline.
-   Avoid duplicate messages after reconnect.

------------------------------------------------------------------------

# 14. Accessibility and Responsive Requirements

-   Use semantic HTML.
-   Use visible focus states.
-   Support keyboard navigation.
-   Give icon-only buttons accessible labels.
-   Keep text contrast readable.
-   Do not rely on color alone for status.
-   Respect reduced-motion preferences.
-   Make the chat usable on narrow mobile screens.
-   Keep the composer reachable when the mobile keyboard is open.
-   Use clear error messages that explain what the user can do next.

------------------------------------------------------------------------

# 15. Environment Variables

Create `.env.example` with placeholders only.

``` env
# Web application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000

# Node server
PORT=4000
WEB_ORIGIN=http://localhost:3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/talknow

# Redis
REDIS_URL=redis://localhost:6379

# Security
SESSION_SECRET=replace_with_a_long_random_secret
```

Never commit real secrets. Validate required environment variables when
each application starts.

------------------------------------------------------------------------

# 16. Development Scripts

Use pnpm workspaces.

Suggested root scripts:

``` json
{
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "db:generate": "pnpm --filter @talknow/database db:generate",
    "db:migrate": "pnpm --filter @talknow/database db:migrate"
  }
}
```

Adjust package names and scripts to match the actual workspace
configuration.

------------------------------------------------------------------------

# 17. Testing Plan

Do not consider a feature complete just because the page looks correct.

## Core tests

-   A visitor can create a room.
-   The creator joins the room automatically.
-   A second visitor can join using the invitation link.
-   Five or more people can chat in the same room.
-   Every connected member receives a new message.
-   A visitor with an invalid room link cannot join.
-   An expired room cannot accept new members.
-   A closed room cannot accept new messages.
-   A member can leave and rejoin.
-   A temporary session can reconnect.
-   A member cannot act as the creator without creator authorization.
-   Message rate limits work.
-   A page refresh does not lose valid room access.
-   Mobile layout works at common phone widths.

## Real-time tests

Test at least:

-   Two browser windows.
-   Several different browser profiles.
-   Five or more simultaneous members.
-   Network disconnection and reconnection.
-   Two members sending messages at nearly the same time.
-   Room expiry while people are connected.

## Quality checks

-   No TypeScript errors.
-   No broken routes.
-   No console errors during normal use.
-   No leaked session tokens.
-   No duplicate messages after reconnect.
-   No room access after expiry or closure.
-   No horizontal scrolling on mobile.

------------------------------------------------------------------------

# 18. Deployment Plan

A simple first production setup can use one VPS.

``` text
Internet
   |
   v
Nginx
   |
   |-- talknow.com       -> Next.js on port 3000
   |
   `-- socket.talknow.com -> Socket.IO on port 4000

VPS services:
- Next.js process
- Node.js Socket.IO process
- PostgreSQL
- Redis
```

Use PM2 or Docker to keep processes running.

Production requirements:

-   HTTPS for all public traffic.
-   Secure cookies.
-   Correct CORS settings.
-   Database backups.
-   Redis password and private network access.
-   Process monitoring.
-   Log rotation.
-   Scheduled room cleanup.
-   Health check endpoints.
-   Firewall rules that expose only required ports.

Do not expose PostgreSQL or Redis directly to the public internet.

------------------------------------------------------------------------

# 19. Implementation Phases for Antigravity

Build the product in clear phases. Keep the application runnable after
every phase.

## Phase 1: Foundation and design

-   Create the pnpm monorepo.
-   Set up the Next.js application.
-   Set up the Node.js Socket.IO server.
-   Add shared TypeScript types.
-   Configure Tailwind CSS and UI components.
-   Build the homepage.
-   Build the create room page.
-   Build the join screen.
-   Build the responsive chat layout using realistic sample data.

**Completion check:** The visual application is polished and all main
screens work with sample data.

## Phase 2: Database and room creation

-   Set up PostgreSQL and Prisma.
-   Create Room, Member, and Message models.
-   Add room creation service.
-   Generate secure room codes.
-   Add room expiry settings.
-   Add temporary member sessions.
-   Add server side validation.

**Completion check:** A visitor can create a real room and receive a
working invitation link.

## Phase 3: Real-time group messaging

-   Connect the browser to Socket.IO.
-   Add room join and leave events.
-   Add message send and receive events.
-   Save accepted messages.
-   Load recent room messages.
-   Add online member updates.
-   Add typing indicators.
-   Add reconnect handling.

**Completion check:** Multiple people can join one room and chat in real
time from separate browsers.

## Phase 4: Room controls and safety

-   Add creator authorization.
-   Add close room action.
-   Add expiry handling.
-   Add message and join rate limits.
-   Add safe message rendering.
-   Add cleanup job.
-   Add helpful error and empty states.

**Completion check:** Invalid, closed, and expired rooms behave
correctly.

## Phase 5: Final design and quality

-   Refine desktop and mobile layouts.
-   Add loading and reconnect states.
-   Test keyboard access.
-   Test common screen sizes.
-   Test several simultaneous users.
-   Fix errors and performance issues.

**Completion check:** The application is ready for a private beta.

## Phase 6: Production deployment

-   Configure production environment variables.
-   Deploy web and socket services.
-   Configure Nginx and HTTPS.
-   Configure database and Redis.
-   Add backups and monitoring.
-   Test room expiry in production.

**Completion check:** The public application works over HTTPS and can
handle real users.

------------------------------------------------------------------------

# 20. Instructions for Google Antigravity

Treat this document as the main source of truth for the product.

## How to work

1.  Read this complete document before writing code.
2.  Inspect the existing project before changing files.
3.  If the project is empty, create the monorepo structure described
    above.
4.  If code already exists, preserve working code and adapt the
    structure carefully.
5.  Build one phase at a time.
6.  Do not create every file with empty placeholder code.
7.  Write working, connected features rather than static demonstrations.
8.  Keep shared event names and types in the shared package.
9.  Keep database access on the server.
10. Validate all important input on the server.
11. Never trust a client supplied room role or member identity.
12. Keep secrets in environment variables.
13. Run type checks and lint checks after meaningful changes.
14. Fix errors before moving to the next phase.
15. Update the README with setup and run instructions.
16. Keep the interface consistent with the visual design section.
17. Do not add login, registration, email verification, or password
    flows.
18. Do not add voice or video calls until the core text chat works
    reliably.

## Important development rules

-   Use TypeScript throughout.
-   Prefer small reusable components.
-   Avoid giant components and giant socket handler files.
-   Use Zod for input validation.
-   Use Prisma for database access.
-   Use clear error handling.
-   Keep the UI responsive from the beginning.
-   Do not use fake success messages for unfinished backend actions.
-   Do not store private tokens in public room URLs.
-   Do not claim security or encryption that has not been implemented.
-   Add tests for room access, message delivery, expiry, and reconnect
    behaviour.

## First task

Start with **Phase 1 only**.

First inspect the workspace, then create the project foundation and
polished user interface. Build the homepage, create room screen, join
screen, and chat screen with realistic sample data.

Do not begin Phase 2 until Phase 1 runs successfully and the main
screens have been checked on desktop and mobile.

At the end of Phase 1, report:

-   Files and folders created.
-   Main screens completed.
-   Design choices made.
-   Commands used to run the project.
-   Tests and checks completed.
-   Any remaining issues.

------------------------------------------------------------------------

# 21. Final Product Standard

TalkNow should not look or feel like a school project.

It should feel like a real product that someone can open, understand,
and use immediately.

The most important measure of success is simple:

**A person should be able to create a room, share one link, invite
several people, and start a smooth group conversation in less than a
minute.**
