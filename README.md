# Indoseed Agri Makmur Frontend

This is a Next.js project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Copy the `.env.example` file to `.env` or set the variables manually.
Currently used environment variables:
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the API (e.g., `http://localhost:8080/api`)
- `JWT_SECRET`: Secret key for JWT.

## API Integration

Authentication routes have been hardcoded inside the components:
- Login: `/auth/login`
- Register: `/auth/register`
- Verify OTP: `/verify-otp`
- Resend OTP: `/resend-otp`

The frontend communicates with the backend via `fetch` pointing to `NEXT_PUBLIC_API_BASE_URL` concatenated with the hardcoded paths.
