## E-commerce API — Ordered Postman Testing Guide

Base URL: `{{baseUrl}}` (default `http://localhost:3000/api`)

1) Health and Metrics
- GET `health`
- GET `metrics`

2) Auth — Login as Merchant
- POST `auth/request-otp` body: `{ "phone": "+251900000001" }`
- POST `auth/verify-otp` body: `{ "phone": "+251900000001", "code": "123456" }`
  - Collection test saves `merchantAccessToken`.

3) Auth — Login as Buyer
- POST `auth/request-otp` body: `{ "phone": "+251900000002" }`
- POST `auth/verify-otp` body: `{ "phone": "+251900000002", "code": "123456" }`
  - Collection test saves `buyerAccessToken`.

4) Merchant Setup (use merchant token)
- POST `merchants` body: `{ "displayName": "Demo Merchant", "lat": 8.9806, "lon": 38.7578 }`
  - Saves `merchantId`.
- GET `merchants/me` to confirm.

5) Catalog
- GET `catalog/categories` (optional seed/list)

6) Products (merchant token)
- POST `products` body: `{ "name": "Demo Maize", "slug": "demo-maize", "description": "Quality maize" }` → `productId`
- POST `products/{{productId}}/skus` body: `{ "name": "50kg bag", "unitType": "KG", "unitIncrement": 1, "pricePerCanonicalUnit": 1500 }` → `skuId`

7) Inventory (merchant token)
- POST `inventory/lots` body: `{ "skuId": "{{skuId}}", "quantity": 100 }`
- GET `inventory/lots` (verify)

8) Buyer Address and Cart (buyer token)
- POST `addresses` body: `{ "fullName": "Buyer One", "phone": "+251900000002", "line1": "Churchill Rd", "city": "Addis Ababa" }` → `addressId`
- POST `cart/items` body: `{ "skuId": "{{skuId}}", "quantity": 2 }`
- GET `cart`

9) Orders (buyer token)
- POST `orders/create-from-cart` body: `{ "addressId": "{{addressId}}", "paymentProvider": "telebirr" }` → `orderId`, `paymentId`
- GET `orders`

10) Payments & Invoice (buyer token)
- POST `payments/initiate` body: `{ "paymentId": "{{paymentId}}", "provider": "telebirr" }`
- POST `payments/capture` body: `{ "paymentId": "{{paymentId}}" }`
- GET `invoices/{{orderId}}`

11) Shipments (optional)
- POST `shipments/create/{{orderId}}` (merchant token) → `shipmentId` (OTP is server-side only)
- POST `shipments/confirm/{{shipmentId}}` body: `{ "otp": "XXXXXX" }` (requires DB/log access)

12) Reviews & QnA
- POST `reviews/product/{{productId}}` body: `{ "rating": 5, "comment": "Great quality!" }`
- GET `reviews/product/{{productId}}`
- POST `qna/ask/{{productId}}` body: `{ "question": "Is this freshly harvested?" }` → `qnaId`
- POST `qna/answer/{{qnaId}}` body: `{ "answer": "Yes, harvested this week." }`
- GET `qna/product/{{productId}}`

13) Geo & Payouts
- GET `geo/nearby-merchants?lat=8.9806&lon=38.7578&radiusKm=25`
- POST `payouts/request` body: `{ "amount": 10000 }` (merchant token)
- GET `payouts/mine` (merchant token)

14) Chat (optional)
- POST `chat/conversations/{{merchantId}}` (buyer token) → `conversationId`
- GET `chat/conversations/{{conversationId}}/messages`
- GET `chat/conversations/{{conversationId}}/search?q=hi`
- POST `chat/conversations/{{conversationId}}/read/{{messageId}}`
- POST `chat/conversations/{{conversationId}}/invites` → `token`
- POST `chat/invites/{{token}}/redeem`
- POST `chat/conversations/{{conversationId}}/attachments` (requires S3 env)

Notes
- OTP for login is static: `123456`.
- Shipment OTP is not returned; skip confirm in black-box testing.
- Provider/Signature checks are stubbed; webhooks accept any payload.





