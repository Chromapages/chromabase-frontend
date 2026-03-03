# ChromaBase API

Standalone REST API for the ChromaBase CRM.

## Deployment on Hostinger VPS

1. **Prerequisites**: Node.js 18+ installed on the VPS.
2. **Setup**:
   - Clone this repository.
   - Add your `service-account.json` (from Firebase Console) to the root directory.
3. **Execution**:
   ```bash
   npm install
   # For production (using PM2 recommended)
   pm2 start server.js --name "chromabase-api"
   ```

## Endpoints

- `GET /api/health` - Check API and Database status.
- `GET /api/stats` - Fetch dashboard statistics.
- See the full reference in the CRM Settings page.
