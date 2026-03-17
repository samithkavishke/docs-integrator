---
title: "Zoom - Setup"
description: "How to set up and configure the ballerinax/zoom connector."
---

# Zoom Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Zoom account (Pro, Business, or Enterprise plan recommended)
- A Zoom App configured in the Zoom Marketplace

## Step 1: Create a Zoom App

1. Sign in to the [Zoom App Marketplace](https://marketplace.zoom.us/).
2. Click **Develop** in the top-right corner and select **Build App**.
3. Choose the app type:
   - **Server-to-Server OAuth** - For backend integrations (recommended for automation)
   - **OAuth** - For user-context operations
4. Enter the app name (e.g., "WSO2 Integrator") and click **Create**.

## Step 2: Configure Server-to-Server OAuth (Recommended)

1. In the app configuration, navigate to **App Credentials**.
2. Note the following values:
   - **Account ID**
   - **Client ID**
   - **Client Secret**
3. Under **Scopes**, add the required scopes for your integration:
   - `meeting:write:admin` - Create and manage meetings
   - `meeting:read:admin` - Read meeting information
   - `webinar:write:admin` - Create and manage webinars
   - `webinar:read:admin` - Read webinar information
   - `user:read:admin` - Read user information
   - `report:read:admin` - Read usage reports
4. Click **Continue** and then **Activate** the app.

## Step 3: Obtain an Access Token (Server-to-Server OAuth)

```bash
curl -X POST "https://zoom.us/oauth/token?grant_type=account_credentials&account_id=<ACCOUNT_ID>" \
  -H "Authorization: Basic $(echo -n '<CLIENT_ID>:<CLIENT_SECRET>' | base64)"
```

The response includes an `access_token` valid for 1 hour.

## Step 4: Configure OAuth (User-Context)

If you need user-context operations, use the standard OAuth flow:

1. Set the **Redirect URL** (e.g., `http://localhost:8080/callback`).
2. Construct the authorization URL:

```
https://zoom.us/oauth/authorize?response_type=code&client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>
```

3. Exchange the authorization code for tokens:

```bash
curl -X POST "https://zoom.us/oauth/token" \
  -H "Authorization: Basic $(echo -n '<CLIENT_ID>:<CLIENT_SECRET>' | base64)" \
  -d "grant_type=authorization_code" \
  -d "code=<AUTH_CODE>" \
  -d "redirect_uri=<REDIRECT_URI>"
```

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Zoom** in the connector list.
4. Follow the connection wizard to enter your credentials.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/zoom;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "zoom"
version = "1.7.1"
```

## Configuration

### Bearer Token

```ballerina
import ballerinax/zoom;

configurable string token = ?;

zoom:Client zoom = check new ({
    auth: {
        token: token
    }
});
```

```toml
# Config.toml
token = "<your-access-token>"
```

### OAuth 2.0 Refresh Token Grant

For user-context operations with automatic token refresh:

```ballerina
import ballerinax/zoom;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

zoom:Client zoom = check new ({
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});
```

```toml
# Config.toml
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
refreshToken = "<your-refresh-token>"
refreshUrl = "https://zoom.us/oauth/token"
```

## Verify the Setup

Test the connection by listing users:

```ballerina
import ballerina/io;
import ballerinax/zoom;

configurable string token = ?;

public function main() returns error? {
    zoom:Client zm = check new ({
        auth: { token: token }
    });

    zoom:UserList users = check zm->users();
    io:println("Connected to Zoom. Users found: ", users?.total_records);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Access token has expired. For Server-to-Server OAuth, request a new token. |
| `403 Forbidden` | Your app lacks the required scopes. Add scopes in the Marketplace and reactivate. |
| `404 User not found` | Use `"me"` as the userId for the authenticated user, or verify the user email/ID. |
| `429 Rate Limit` | Zoom API has rate limits (varies by endpoint). Implement exponential backoff. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
