# Mom Comment App

Simple Vercel + MongoDB birthday message app.

## Files

- `index.html` — main birthday page
- `leave-message.html` — form page to save a message
- `api/comments.js` — Vercel serverless API route

## Setup

1. Upload this project to GitHub or Vercel.
2. In Vercel, make sure the project root is this folder.
3. Add these environment variables in Vercel:
   - `MONGODB_URI`
   - `MONGODB_DB=birthday_app`
4. Deploy.

## Local / install

```bash
npm install
```

## Important

The API file must stay at:

```bash
api/comments.js
```

That is what creates the `/api/comments` route on Vercel.
