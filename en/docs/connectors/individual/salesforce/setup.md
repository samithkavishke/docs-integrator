---
title: "Salesforce - Setup"
description: "How to set up and configure the ballerinax/salesforce connector."
---

# Salesforce Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Salesforce account (Developer, Enterprise, or Unlimited edition)
- A Connected App configured for OAuth 2.0 API access

## Step 1: Create a Salesforce Connected App

1. Log in to your Salesforce org and navigate to **Setup** > **Apps** > **App Manager**.
2. Click **New Connected App** in the top-right corner.
3. Fill in the required fields:
   - **Connected App Name**: WSO2 Integrator
   - **API Name**: WSO2_Integrator
   - **Contact Email**: Your email address
4. Under **API (Enable OAuth Settings)**:
   - Check **Enable OAuth Settings**
   - Set **Callback URL** to `https://test.salesforce.com` (sandbox) or `https://login.salesforce.com` (production)
   - Add the following OAuth Scopes:
     - **Full access (full)**
     - **Perform requests at any time (refresh_token, offline_access)**
5. Click **Save** and wait for the app to be created (this may take a few minutes).

## Step 2: Obtain Consumer Key and Secret

1. After creating the Connected App, click **Manage Consumer Details**.
2. You may be prompted to verify your identity. Complete the verification.
3. Copy the **Consumer Key** and **Consumer Secret** values.

## Step 3: Obtain the Authorization Code

1. In your browser, navigate to the following URL (replace the placeholders):

```
https://<YOUR_INSTANCE>.salesforce.com/services/oauth2/authorize?response_type=code&client_id=<CONSUMER_KEY>&redirect_uri=<REDIRECT_URL>
```

2. Log in and allow access when prompted.
3. The browser will redirect to a URL containing your authorization code:

```
https://login.salesforce.com/?code=<ENCODED_CODE>
```

4. URL-decode the code value for the next step.

## Step 4: Obtain Access and Refresh Tokens

Send a POST request to the Salesforce token endpoint:

```bash
curl -X POST "https://<YOUR_INSTANCE>.salesforce.com/services/oauth2/token" \
  -d "code=<CODE>" \
  -d "grant_type=authorization_code" \
  -d "client_id=<CONSUMER_KEY>" \
  -d "client_secret=<CONSUMER_SECRET>" \
  -d "redirect_uri=<REDIRECT_URL>"
```

The response will contain:
- `access_token` - Short-lived token for API calls
- `refresh_token` - Long-lived token for obtaining new access tokens
- `instance_url` - Your Salesforce instance URL (use this as `baseUrl`)

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Salesforce** in the connector list.
4. Follow the connection wizard to enter your OAuth credentials.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/salesforce;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "salesforce"
version = "8.3.0"
```

## Configuration

### OAuth 2.0 Refresh Token Grant (Recommended)

Configure the connector using `configurable` variables and provide values via `Config.toml`:

```ballerina
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

salesforce:ConnectionConfig sfConfig = {
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
};

salesforce:Client salesforce = check new (sfConfig);
```

```toml
# Config.toml
baseUrl = "https://your-instance.salesforce.com"
clientId = "<your-consumer-key>"
clientSecret = "<your-consumer-secret>"
refreshToken = "<your-refresh-token>"
refreshUrl = "https://login.salesforce.com/services/oauth2/token"
```

### Bearer Token Configuration

For short-lived scenarios, you can use a direct bearer token:

```ballerina
salesforce:ConnectionConfig sfConfig = {
    baseUrl: baseUrl,
    auth: {
        token: accessToken
    }
};
```

### Listener Configuration (Change Data Capture)

To listen for Salesforce Change Data Capture events, configure a listener with username-password authentication:

```ballerina
import ballerinax/salesforce;

configurable string username = ?;
configurable string password = ?;

salesforce:ListenerConfig listenerConfig = {
    auth: {
        username: username,
        password: password
    }
};

listener salesforce:Listener eventListener = new (listenerConfig);
```

```toml
# Config.toml
username = "your-salesforce-username"
password = "your-password-and-security-token"
```

:::note
The password field for the listener requires your Salesforce password concatenated with your security token. For example, if your password is `myPassword` and your security token is `XXXX`, the value should be `myPasswordXXXX`.
:::

## Environment-Specific Configuration

### Sandbox Environment

For sandbox environments, use `https://test.salesforce.com` as the login and refresh URL:

```toml
# Config.toml
baseUrl = "https://your-sandbox.sandbox.my.salesforce.com"
refreshUrl = "https://test.salesforce.com/services/oauth2/token"
```

### Production Environment

For production environments, use `https://login.salesforce.com`:

```toml
# Config.toml
baseUrl = "https://your-org.my.salesforce.com"
refreshUrl = "https://login.salesforce.com/services/oauth2/token"
```

## Verify the Setup

After configuring, run your integration to verify the connection:

```bash
bal run
```

Test with a simple query:

```ballerina
import ballerina/io;
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

public function main() returns error? {
    salesforce:Client sf = check new ({
        baseUrl: baseUrl,
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    salesforce:OrganizationMetadata orgInfo = check sf->getOrganizationMetaData();
    io:println("Connected to Salesforce org: ", orgInfo);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `INVALID_SESSION_ID` | Refresh token may be expired. Re-authorize and obtain a new refresh token. |
| `INVALID_CLIENT_ID` | Verify the Consumer Key in your Connected App settings. |
| `API_DISABLED_FOR_ORG` | Ensure your Salesforce edition supports API access. Developer and Enterprise editions have API access by default. |
| `REQUEST_LIMIT_EXCEEDED` | You have exceeded your org's API request limit. Check usage in Setup > Company Information. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
