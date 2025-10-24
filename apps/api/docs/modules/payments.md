### Payments Module

- Abstracted payments with provider stubs and escrow capture.
- Endpoints:
  - POST /api/payments/:paymentId/initiate { provider }
  - PATCH /api/payments/:paymentId/capture
