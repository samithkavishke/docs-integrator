---
title: "Trello - Setup"
description: "How to set up and configure the ballerinax/trello connector."
---

# Trello Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Trello account
- A Trello API key and token

## Step 1: Create a Trello Account

If you do not have a Trello account, sign up at [trello.com](https://trello.com/).

## Step 2: Generate API Key and Token

1. Visit the [Trello Power-Ups admin page](https://trello.com/power-ups/admin).
2. Click **New** to create a new Power-Up.
3. Enter a name, an iframe connector URL (can be a placeholder), and click **Create**.
4. Navigate to the **API Key** section and click **Generate**.
5. Copy and securely store your API key.
6. Click the **Token** link next to the API key.
7. Authorize the Power-Up and copy the generated OAuth token.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Trello**.
4. Enter your API key and token.

### Using Code

```ballerina
import ballerinax/trello;
```

```toml
[[dependency]]
org = "ballerinax"
name = "trello"
version = "2.0.1"
```

## Configuration

```ballerina
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;

trello:ConnectionConfig config = {
    auth: {
        token: token
    }
};

trello:Client trello = check new (config);
```

### Config.toml

```toml
# Config.toml
key = "<your-trello-api-key>"
token = "<your-trello-token>"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;

public function main() returns error? {
    trello:Client trello = check new ({
        auth: { token: token }
    });

    // Get all boards for the authenticated user
    trello:Board[] boards = check trello->/members/me/boards(key = key, token = token);
    io:println("Connected successfully. Found ", boards.length(), " boards.");
}
```

Run the verification:

```bash
bal run
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify both API key and token are correct |
| `invalid key` | Regenerate your API key from the Power-Ups admin page |
| `invalid token` | Reauthorize and generate a new token |
| `404 Not Found` | Check that the board or card ID exists and you have access |
| Rate limit exceeded | Trello allows 300 requests per 10 seconds. Add throttling. |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
