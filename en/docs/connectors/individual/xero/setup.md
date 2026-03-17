---
title: "Xero - Setup"
description: "How to set up and configure the ballerinax/xero.accounts connector."
---

# Xero Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Xero account (free trial or paid subscription)
- A Xero Developer App configured for OAuth 2.0 access

## Step 1: Create a Xero Developer App

1. Sign in to the [Xero Developer Portal](https://developer.xero.com/app/manage).
2. Click **New app**.
3. Enter the following:
   - **App name**: WSO2 Integrator
   - **Integration type**: Web app
   - **Company or application URL**: Your organization URL
   - **Redirect URI**: `http://localhost:8080/callback` (for development)
4. Click **Create app**.

## Step 2: Obtain Client ID and Client Secret

1. After creating the app, navigate to the app's **Configuration** page.
2. Copy the **Client ID**.
3. Click **Generate a secret** and copy the **Client Secret**.

## Step 3: Obtain OAuth 2.0 Tokens

1. Construct the authorization URL:

```
https://login.xero.com/identity/connect/authorize?response_type=code&client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&scope=openid profile email accounting.transactions accounting.contacts accounting.settings offline_access&state=random_state
```

2. Visit the URL, log in, and select the Xero organization to connect.
3. After authorization, extract the code from the redirect URL.
4. Exchange the code for tokens:

```bash
curl -X POST "https://identity.xero.com/connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=<AUTH_CODE>" \
  -d "redirect_uri=<REDIRECT_URI>" \
  -d "client_id=<CLIENT_ID>" \
  -d "client_secret=<CLIENT_SECRET>"
```

5. The response includes:
   - `access_token` - Short-lived token (30 minutes) for API calls
   - `refresh_token` - Long-lived token (60 days) for obtaining new access tokens
   - `id_token` - OpenID Connect identity token

## Step 4: Obtain the Tenant ID

Xero requires a `xero-tenant-id` header for all API calls. Retrieve your tenant connections:

```bash
curl -H "Authorization: Bearer <ACCESS_TOKEN>" \
  "https://api.xero.com/connections"
```

The response returns an array of connected organizations with their `tenantId` values.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Xero** in the connector list.
4. Follow the connection wizard to enter your OAuth credentials.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/xero.accounts;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "xero.accounts"
version = "1.5.1"
```

## Configuration

### Bearer Token (Development)

```ballerina
import ballerinax/xero.accounts;

configurable string token = ?;

accounts:Client xero = check new ({
    auth: {
        token: token
    }
});
```

```toml
# Config.toml
token = "<your-access-token>"
```

### OAuth 2.0 Refresh Token Grant (Recommended for Production)

```ballerina
import ballerinax/xero.accounts;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

accounts:Client xero = check new ({
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
refreshUrl = "https://identity.xero.com/connect/token"
```

## Required OAuth 2.0 Scopes

| Scope | Description |
|---|---|
| `accounting.transactions` | Read/write access to invoices, payments, credit notes, and bank transactions |
| `accounting.contacts` | Read/write access to contacts and contact groups |
| `accounting.settings` | Read/write access to chart of accounts and organization settings |
| `offline_access` | Required for refresh token support |

## Verify the Setup

Test the connection by listing contacts:

```ballerina
import ballerina/io;
import ballerinax/xero.accounts;

configurable string token = ?;
configurable string tenantId = ?;

public function main() returns error? {
    accounts:Client xero = check new ({
        auth: { token: token }
    });

    accounts:Contacts contacts = check xero->getContacts(xeroTenantId = tenantId);
    io:println("Connected to Xero. Contacts found: ", contacts?.Contacts?.length());
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `403 Forbidden` | Verify your OAuth scopes include the required permissions for the operation. |
| `401 Unauthorized` | Access token has expired. Use the refresh token to obtain a new one. |
| `Rate Limit (429)` | Xero limits API calls to 60 per minute. Implement backoff logic. |
| `Invalid Tenant ID` | Re-check the tenant ID from the `/connections` endpoint. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
