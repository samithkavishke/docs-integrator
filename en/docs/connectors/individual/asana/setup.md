---
title: "Asana - Setup"
description: "How to set up and configure the ballerinax/asana connector."
---

# Asana Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Asana account (free or paid)
- A Personal Access Token (PAT) or OAuth2 credentials

## Step 1: Create an Asana Account

If you do not have an Asana account, sign up at [asana.com](https://asana.com/).

## Step 2: Generate a Personal Access Token

1. Log in to your Asana account.
2. Navigate to the [Asana Developer Console](https://app.asana.com/0/my-apps).
3. Click **+ Create new token**.
4. Provide a descriptive name for the token.
5. Accept Asana's API terms.
6. Click **Create token**.
7. Copy the generated token and store it securely (it is only shown once).

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Asana**.
4. Enter your Personal Access Token.

### Using Code

```ballerina
import ballerinax/asana;
```

```toml
[[dependency]]
org = "ballerinax"
name = "asana"
version = "3.0.0"
```

## Configuration

### Basic Authentication with PAT

```ballerina
import ballerinax/asana;

configurable string token = ?;

asana:ConnectionConfig config = {
    auth: {
        token: token
    }
};

asana:Client asana = check new (config);
```

### Config.toml

```toml
# Config.toml
token = "<your-asana-personal-access-token>"
```

### OAuth2 Authentication

For applications acting on behalf of users:

```ballerina
import ballerinax/asana;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;

asana:ConnectionConfig config = {
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://app.asana.com/-/oauth_token"
    }
};

asana:Client asana = check new (config);
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/asana;

configurable string token = ?;

public function main() returns error? {
    asana:Client asana = check new ({
        auth: { token: token }
    });

    // List projects for the authenticated user
    asana:Inline_response_200_9 projects = check asana->/projects();
    io:println("Connected successfully. Projects found.");
}
```

Run the verification:

```bash
bal run
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify your PAT is correct and has not been revoked |
| `403 Forbidden` | Check that you have access to the requested workspace or project |
| `404 Not Found` | Confirm the resource GID (task, project) exists |
| `429 Too Many Requests` | Asana enforces rate limits (150 requests/minute). Add retry logic. |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
