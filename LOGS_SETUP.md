# Browser Console Logs in Terminal Setup

This setup allows you to see browser console logs directly in your Cursor terminal.

## Quick Start

1. **Start the log server** (in a separate terminal or run concurrently):
   ```bash
   npm run log-server
   ```

2. **Or run both dev server and log server together**:
   ```bash
   npm run dev:with-logs
   ```
   (Note: You may need to install `concurrently` first: `npm install --save-dev concurrently`)

3. **Start your dev server** (if not using the combined command):
   ```bash
   npm run dev
   ```

4. **View logs**: Browser console logs will now appear in the terminal where the log server is running!

## How It Works

1. The `logger` utility in `src/lib/logger.ts` captures all console logs
2. Logs are sent to a local log server at `http://localhost:3002/api/logs`
3. The log server prints logs to the terminal and also saves them to `logs/browser-console.log`

## Log Files

All logs are also saved to: `logs/browser-console.log`

You can tail this file in another terminal:
```bash
tail -f logs/browser-console.log
```

## Manual Setup (if concurrently is not installed)

Open two terminals:

**Terminal 1:**
```bash
npm run log-server
```

**Terminal 2:**
```bash
npm run dev
```

## Troubleshooting

- If logs don't appear, make sure the log server is running on port 3002
- Check that the Vite proxy is configured correctly in `vite.config.ts`
- The log server must be running before you start using the app

