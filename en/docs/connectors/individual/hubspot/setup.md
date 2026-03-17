---
title: "HubSpot CRM - Setup"
description: "How to set up and configure the ballerinax/hubspot.crm.contact connector."
---

# HubSpot CRM Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A HubSpot account with CRM access
- A HubSpot private app or OAuth 2.0 app for API authentication

## Step 1: Create a HubSpot Private App

1. Log in to your HubSpot account and navigate to **Settings** (gear icon in the top navigation).
2. In the left sidebar, go to **Integrations** > **Private Apps**.
3. Click **Create a private app**.
4. Enter an app name (e.g., "WSO2 Integrator") and description.
5. Navigate to the **Scopes** tab and select the following scopes:
   - `crm.objects.contacts.read` - Read contacts
   - `crm.objects.contacts.write` - Create/update/delete contacts
   - `crm.objects.companies.read` - Read associated companies
   - `crm.objects.deals.read` - Read associated deals
6. Click **Create app** and confirm.
7. Copy the generated **Access Token**.

## Step 2: (Alternative) Set Up OAuth 2.0

For production deployments that require token refresh:

1. Navigate to **Settings** > **Integrations** > **Connected Apps** > **Create App**.
2. Configure your app with the redirect URI: `https://your-app-domain/callback`.
3. Under **Auth**, note the **Client ID** and **Client Secret**.
4. Generate an authorization URL:

```
https://app.hubspot.com/oauth/authorize?client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&scope=crm.objects.contacts.read%20crm.objects.contacts.write
```

5. Exchange the authorization code for tokens:

```bash
curl -X POST https://api.hubapi.com/oauth/v1/token \
  -d "grant_type=authorization_code" \
  -d "client_id=<CLIENT_ID>" \
  -d "client_secret=<CLIENT_SECRET>" \
  -d "redirect_uri=<REDIRECT_URI>" \
  -d "code=<AUTHORIZATION_CODE>"
```

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **HubSpot CRM**.
4. Follow the connection wizard to enter your access token or OAuth credentials.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/hubspot.crm.contact;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "hubspot.crm.contact"
version = "2.3.1"
```

## Configuration

### Private App Token (Simplest)

```ballerina
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

contact:ConnectionConfig config = {
    auth: {
        token: accessToken
    }
};

contact:Client hubspot = check new (config);
```

```toml
# Config.toml
accessToken = "<your-private-app-access-token>"
```

### OAuth 2.0 with Refresh Token

```ballerina
import ballerinax/hubspot.crm.contact;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;

contact:ConnectionConfig config = {
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://api.hubapi.com/oauth/v1/token"
    }
};

contact:Client hubspot = check new (config);
```

```toml
# Config.toml
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
refreshToken = "<your-refresh-token>"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

public function main() returns error? {
    contact:Client hubspot = check new ({
        auth: { token: accessToken }
    });

    contact:CollectionResponseSimplePublicObjectWithAssociationsForwardPaging response =
        check hubspot->getPage();
    io:println("Successfully connected. Contacts found: ", response.results.length());
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify your access token is valid and not expired |
| `403 Forbidden` | Check that the required scopes are enabled in your private app |
| `429 Too Many Requests` | HubSpot has rate limits (100 requests per 10 seconds for private apps). Implement retry logic. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
