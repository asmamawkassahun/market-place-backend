### Chat Module

- Realtime buyer–merchant chat with text and WebRTC signaling.
- REST:
  - POST `/api/chat/conversations/:merchantId`
  - GET `/api/chat/conversations/:conversationId/messages`
  - GET `/api/chat/conversations/:conversationId/search?q=`
  - POST `/api/chat/conversations/:conversationId/read/:latestMessageId`
  - POST `/api/chat/messages/:messageId/report`
  - GET `/api/chat/admin/reports` (ADMIN)
  - PATCH `/api/chat/admin/reports/:reportId/resolve` (ADMIN)
  - GET `/api/chat/ice` (STUN/TURN config)
- WebSocket (`/chat` namespace, JWT required):
  - `join` { conversationId }
  - `text` { conversationId, senderRole, senderId, content }
  - `signal` { conversationId, senderRole, senderId, data }
  - `typing` { conversationId, senderRole }
  - `read` { conversationId, latestMessageId }
