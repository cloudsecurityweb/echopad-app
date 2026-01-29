# Echopad Backend API

Backend API service for Echopad that connects to Azure CosmosDB and provides REST endpoints for user management.

## Features

- ✅ RESTful API with Express.js
- ✅ Azure CosmosDB integration
- ✅ Microsoft Entra ID (Azure AD) authentication
- ✅ JWT token verification with JWKS
- ✅ Full CRUD operations for users
- ✅ Health check endpoint
- ✅ Error handling and validation

## API Endpoints

### Health Check
- `GET /health` - Check server and CosmosDB connection status
- `GET /health/cosmos` - Test Cosmos DB container by creating, reading, and deleting a test item

### Authentication API
- `POST /api/auth/sign-in` - Sign in with existing account (requires Bearer token)
- `POST /api/auth/sign-up` - Sign up new organization and user (requires Bearer token)
- `GET /api/auth/me` - Get current user profile (requires Bearer token)

**Note:** All auth endpoints require `Authorization: Bearer <token>` header with a valid Microsoft Entra ID JWT token.

### Users API
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get a specific user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update an existing user
- `DELETE /api/users/:id` - Delete a user

## Prerequisites

- Node.js >= 18.0.0
- Azure CosmosDB account with:
  - Database: `echopad` (will be created automatically if it doesn't exist)
  - Containers: The application automatically creates the following containers on startup:
    - `activity`, `analytics`, `billing`, `clients`, `feedback`, `licenses`, `products`, `subscriptions`, `transcriptions`, `users`, `test`
  - All containers use partition key: `/id`

## Local Development Setup

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment variables:**
   
   Create a `.env` file in the `backend` directory:
   ```env
   # Cosmos DB Configuration
   COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
   COSMOS_KEY=your-primary-key-here
   COSMOS_DATABASE=echopad
   COSMOS_CONTAINER=users
   
   # Microsoft Entra ID (Azure AD) Configuration
   AZURE_TENANT_ID=your-tenant-id-here
   AZURE_CLIENT_ID=your-client-id-here
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

   **Required Environment Variables:**
   - `COSMOS_ENDPOINT` - Azure CosmosDB endpoint URI
   - `COSMOS_KEY` - Azure CosmosDB primary key
   - `AZURE_TENANT_ID` - Microsoft Entra ID tenant ID (required for authentication)
   - `AZURE_CLIENT_ID` - Microsoft Entra ID application (client) ID (required for authentication)
   - `PORT` - Server port (default: 3000)
   - `NODE_ENV` - Environment mode (development/production)

   **Getting your CosmosDB credentials:**
   - Go to Azure Portal → Your CosmosDB Account
   - Navigate to **Keys** section
   - Copy the **URI** (this is your `COSMOS_ENDPOINT`)
   - Copy the **Primary Key** (this is your `COSMOS_KEY`)

   **Getting your Entra ID credentials:**
   - Go to Azure Portal → Azure Active Directory → App registrations
   - Find your application registration
   - Copy the **Application (client) ID** (this is your `AZURE_CLIENT_ID`)
   - Copy the **Directory (tenant) ID** (this is your `AZURE_TENANT_ID`)

3. **Run the server:**
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Test the API:**
   ```bash
   # Health check
   curl http://localhost:3000/health
   
   # Test Cosmos DB container (creates, reads, and deletes a test item)
   curl http://localhost:3000/health/cosmos
   
   # List users
   curl http://localhost:3000/api/users
   
   # Create a user
   curl -X POST http://localhost:3000/api/users \
     -H "Content-Type: application/json" \
     -d '{"id": "user1", "name": "John Doe", "email": "john@example.com"}'
   
   # Get a user
   curl http://localhost:3000/api/users/user1
   
   # Update a user
   curl -X PUT http://localhost:3000/api/users/user1 \
     -H "Content-Type: application/json" \
     -d '{"id": "user1", "name": "Jane Doe", "email": "jane@example.com"}'
   
   # Delete a user
   curl -X DELETE http://localhost:3000/api/users/user1
   ```

## Azure App Service Deployment

### Step 1: Configure App Service Environment Variables

1. Go to **Azure Portal → Your App Service → Configuration → Application Settings**
2. Add the following application settings:
   - `COSMOS_ENDPOINT` = Your CosmosDB URI (e.g., `https://your-account.documents.azure.com:443/`)
   - `COSMOS_KEY` = Your CosmosDB primary key
   - `COSMOS_DATABASE` = `echopad`
   - `COSMOS_CONTAINER` = `users`
   - `AZURE_TENANT_ID` = Your Microsoft Entra ID tenant ID
   - `AZURE_CLIENT_ID` = Your Microsoft Entra ID application (client) ID
   - `PORT` = `8080` (or the port your App Service uses)
   - `NODE_ENV` = `production`

### Step 2: Deploy Your Code

**Option A: Deploy via Azure CLI**
```bash
# Install Azure CLI if not already installed
# Login to Azure
az login

# Deploy to App Service
cd backend
az webapp up --name your-app-service-name --resource-group your-resource-group --runtime "NODE:18-lts"
```

**Option B: Deploy via Git**
```bash
# Add Azure remote (get URL from App Service → Deployment Center)
git remote add azure https://your-app.scm.azurewebsites.net/your-app.git

# Push to deploy
git push azure main
```

**Option C: Deploy via VS Code Azure Extension**
1. Install the "Azure App Service" extension
2. Right-click on the `backend` folder
3. Select "Deploy to Web App"
4. Follow the prompts

### Step 3: Verify Deployment

1. Check the App Service logs:
   - Azure Portal → App Service → Log stream
   - Look for: `🚀 Server running on port...`

2. Test the health endpoint:
   ```bash
   curl https://your-app.azurewebsites.net/health
   ```

3. Test Cosmos DB containers:
   ```bash
   # Test endpoint that verifies container read/write operations
   curl https://your-app.azurewebsites.net/health/cosmos
   ```

4. Test the users API:
   ```bash
   curl https://your-app.azurewebsites.net/api/users
   ```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── cosmosClient.js    # CosmosDB client configuration
│   │   └── containers.js      # Container definitions and configuration
│   ├── controllers/
│   │   ├── healthController.js # Health check and test endpoints
│   │   └── userController.js   # User CRUD operations
│   ├── routes/
│   │   ├── index.js           # Main router
│   │   └── users.js           # User routes
│   ├── middleware/
│   │   ├── errorHandler.js    # Error handling middleware
│   │   └── notFound.js        # 404 handler
│   └── server.js              # Express app entry point
├── package.json               # Dependencies and scripts
├── .env.example              # Example environment variables
├── .gitignore               # Git ignore rules
└── README.md                # This file
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "error": "Error description",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error
- `503` - Service Unavailable (CosmosDB connection issue)

## Security Notes

- ⚠️ **Never commit `.env` files** with real credentials
- ✅ Use Azure App Service Application Settings for production secrets
- ✅ Consider using Azure Key Vault for sensitive configuration
- ✅ Enable CORS if calling from a frontend (add CORS middleware)

## Troubleshooting

### Connection Issues

**Error: "Missing required CosmosDB configuration"**
- Ensure environment variables are set correctly
- Check App Service Configuration → Application Settings

**Error: "Connection test failed"**
- Verify CosmosDB endpoint and key are correct
- Check network connectivity to CosmosDB
- Ensure CosmosDB account is running

### API Issues

**404 on all routes**
- Check that the server is running
- Verify the route paths match exactly
- Check App Service deployment logs

**500 Internal Server Error**
- Check App Service logs for detailed error messages
- Verify CosmosDB container exists and partition key matches
- Ensure user data structure matches expected format

## Authentication

The API uses Microsoft Entra ID (Azure AD) for authentication. All protected endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### Token Verification

The backend verifies tokens using:
- **JWKS endpoint**: `https://login.microsoftonline.com/{tenantId}/discovery/v2.0/keys`
- **Issuer validation**: `https://login.microsoftonline.com/{tenantId}/v2.0`
- **Audience validation**: Must match `AZURE_CLIENT_ID`

### Role Mapping

Entra ID app roles are mapped to backend roles:
- `SuperAdmin` → `superAdmin`
- `ClientAdmin` → `clientAdmin`
- `UserAdmin` → `user`

### Example: Sign In

```bash
curl -X POST https://your-api.azurewebsites.net/api/auth/sign-in \
  -H "Authorization: Bearer <your-entra-token>" \
  -H "Content-Type: application/json"
```

### Example: Sign Up

```bash
curl -X POST https://your-api.azurewebsites.net/api/auth/sign-up \
  -H "Authorization: Bearer <your-entra-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "organizationName": "My Organization",
    "organizerName": "John Doe",
    "email": "john@example.com"
  }'
```

## Next Steps

- ✅ Authentication/authorization middleware (implemented)
- Implement pagination for list endpoints
- Add request validation with a library like Joi or Zod
- Set up CORS for frontend integration
- Add logging with Winston or similar
- Implement rate limiting
- Add API documentation with Swagger/OpenAPI
# Test - Thu Jan 29 17:17:14 IST 2026
