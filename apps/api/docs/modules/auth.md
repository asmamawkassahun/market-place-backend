### Auth Module

- Phone OTP login (mock OTP '123456' for MVP) and JWT issuance.
- Endpoints:
  - POST /api/auth/request-otp { phone }
  - POST /api/auth/verify-otp { phone, code } -> { access_token }
- Guards & strategies: JwtStrategy, JwtAuthGuard.
