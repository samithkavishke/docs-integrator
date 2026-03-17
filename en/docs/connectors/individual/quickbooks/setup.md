---
title: "QuickBooks - Setup"
description: "How to set up and configure the ballerinax/quickbooks.online connector."
---

# QuickBooks Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A QuickBooks Online account (Developer sandbox or production)
- An Intuit Developer account with an OAuth 2.0 app configured

## Step 1: Create an Intuit Developer App

1. Sign in to the [Intuit Developer Portal](https://developer.intuit.com/).
2. Navigate to **My Apps** and click **Create an app**.
3. Select **QuickBooks Online and Payments** as the platform.
4. Enter a name for your app (e.g., "WSO2 Integrator") and click **Create**.

## Step 2: Configure OAuth 2.0 Settings

1. In your app's **Keys & credentials** section, locate the **Development** or **Production** settings.
2. Note the following values:
   - **Client ID**
   - **Client Secret**
3. Under **Redirect URIs**, add your callback URL (e.g., `https://developer.intuit.com/v2/OAuth2Playground/RedirectUrl` for testing).

## Step 3: Obtain OAuth 2.0 Tokens

1. Use the [Intuit OAuth 2.0 Playground](https://developer.intuit.com/app/developer/playground) or construct the authorization URL:

```
https://appcenter.intuit.com/connect/oauth2?client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&response_type=code&scope=com.intuit.quickbooks.accounting&state=security_token
```

2. After authorizing, extract the authorization code from the redirect URL.
3. Exchange the code for tokens:

```bash
curl -X POST "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer" \
  -H "Accept: application/json" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=<AUTH_CODE>" \
  -d "redirect_uri=<REDIRECT_URI>" \
  -d "client_id=<CLIENT_ID>" \
  -d "client_secret=<CLIENT_SECRET>"
```

4. The response will include:
   - `access_token` - Short-lived token (1 hour) for API calls
   - `refresh_token` - Long-lived token (100 days) for obtaining new access tokens
   - `realm_id` - Your QuickBooks company ID

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **QuickBooks** in the connector list.
4. Follow the connection wizard to enter your OAuth credentials.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/quickbooks.online;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "quickbooks.online"
version = "1.5.1"
```

## Configuration

### OAuth 2.0 Bearer Token

Configure the connector using `configurable` variables and provide values via `Config.toml`:

```ballerina
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;

online:Client quickbooks = check new ({
    serviceUrl: serviceUrl,
    auth: {
        token: token
    }
});
```

```toml
# Config.toml
serviceUrl = "https://quickbooks.api.intuit.com"
token = "<your-access-token>"
```

### OAuth 2.0 Refresh Token Grant (Recommended for Production)

For production use, configure automatic token refresh:

```ballerina
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

online:Client quickbooks = check new ({
    serviceUrl: serviceUrl,
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
serviceUrl = "https://quickbooks.api.intuit.com"
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
refreshToken = "<your-refresh-token>"
refreshUrl = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
```

### Sandbox vs Production

| Environment | Base URL |
|---|---|
| Sandbox | `https://sandbox-quickbooks.api.intuit.com` |
| Production | `https://quickbooks.api.intuit.com` |

## Verify the Setup

After configuring, run your integration to verify the connection:

```bash
bal run
```

Test with a simple query to list company information:

```ballerina
import ballerina/io;
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;
configurable string realmId = ?;

public function main() returns error? {
    online:Client qb = check new ({
        serviceUrl: serviceUrl,
        auth: { token: token }
    });

    json companyInfo = check qb->get(string `/v3/company/${realmId}/companyinfo/${realmId}`);
    io:println("Connected to QuickBooks: ", companyInfo);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `AuthenticationFailed` | Access token may be expired. Use the refresh token to obtain a new access token. |
| `Invalid Company` | Verify your `realmId` matches the QuickBooks company you authorized. |
| `Rate Limit Exceeded` | QuickBooks allows 500 requests per minute. Implement backoff and retry logic. |
| `Scope Error` | Ensure your OAuth app has the `com.intuit.quickbooks.accounting` scope. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
