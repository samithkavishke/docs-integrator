---
title: "Pipedrive - Setup"
description: "How to set up and configure the ballerinax/pipedrive connector."
---

# Pipedrive Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Pipedrive account (Essential plan or higher for API access)

## Step 1: Obtain API Token

1. Log in to your Pipedrive account.
2. Click your profile icon in the top-right corner and select **Personal preferences**.
3. Navigate to the **API** tab.
4. Copy your **Personal API token**.

## Step 2: (Alternative) OAuth 2.0 Setup

For production integrations with multiple users:

1. Go to the [Pipedrive Developer Hub](https://developers.pipedrive.com/).
2. Create a new app and configure OAuth 2.0 settings.
3. Set the redirect URI and required scopes.
4. Note the **Client ID** and **Client Secret**.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Pipedrive**.
4. Enter your API token.

### Using Code

```ballerina
import ballerinax/pipedrive;
```

```toml
[[dependency]]
org = "ballerinax"
name = "pipedrive"
version = "1.5.1"
```

## Configuration

### API Token Authentication

```ballerina
import ballerinax/pipedrive;

configurable string apiToken = ?;

pipedrive:ConnectionConfig config = {
    auth: {
        token: apiToken
    }
};

pipedrive:Client pipedrive = check new (config);
```

```toml
# Config.toml
apiToken = "<your-api-token>"
```

### OAuth 2.0 Authentication

```ballerina
import ballerinax/pipedrive;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;

pipedrive:ConnectionConfig config = {
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://oauth.pipedrive.com/oauth/token"
    }
};

pipedrive:Client pipedrive = check new (config);
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/pipedrive;

configurable string apiToken = ?;

public function main() returns error? {
    pipedrive:Client pd = check new ({
        auth: { token: apiToken }
    });

    json deals = check pd->getDeals();
    io:println("Connected successfully. Deals retrieved.");
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify your API token is correct and active |
| `403 Forbidden` | Your plan may not support API access. Upgrade to Essential or higher. |
| `429 Rate Limit` | Pipedrive limits to 100 requests per 10 seconds. Implement throttling. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
