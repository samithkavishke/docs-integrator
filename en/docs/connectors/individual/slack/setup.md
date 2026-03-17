---
title: "Slack - Setup"
description: "How to set up and configure the ballerinax/slack connector."
---

# Slack Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Slack workspace with admin privileges
- A Slack App with a User or Bot OAuth token

## Step 1: Create a Slack Account

If you do not have a Slack account, sign up at [slack.com/get-started](https://slack.com/get-started#/createnew).

## Step 2: Create a Slack App

1. Navigate to [api.slack.com/apps](https://api.slack.com/apps).
2. Click **Create New App** > **From scratch**.
3. Provide an app name and select the workspace.
4. Click **Create App**.

## Step 3: Configure OAuth Scopes

1. In your app settings, go to **OAuth & Permissions**.
2. Under **User Token Scopes** (or **Bot Token Scopes**), add the required scopes:
   - `chat:write` -- Send messages
   - `channels:read` -- View basic channel information
   - `channels:write` -- Manage channels
   - `users:read` -- View user information
   - `users:read.email` -- View user email addresses
   - `files:write` -- Upload and manage files
3. Click **Save Changes**.

## Step 4: Install App and Get Token

1. Navigate to **Install App** in the sidebar.
2. Click **Install to Workspace** and authorize the app.
3. Copy the **User OAuth Token** (starts with `xoxp-`) or **Bot User OAuth Token** (starts with `xoxb-`).

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Slack**.
4. Enter your OAuth token.

### Using Code

```ballerina
import ballerinax/slack;
```

```toml
[[dependency]]
org = "ballerinax"
name = "slack"
version = "5.0.0"
```

## Configuration

```ballerina
import ballerinax/slack;

configurable string token = ?;

slack:Client slack = check new ({
    auth: {
        token
    }
});
```

### Config.toml

```toml
# Config.toml
token = "<your-slack-oauth-token>"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/slack;

configurable string token = ?;

public function main() returns error? {
    slack:Client slack = check new ({
        auth: { token }
    });

    // Send a test message to general channel
    slack:ChatPostMessageResponse response = check slack->/chat\.postMessage.post({
        channel: "general",
        text: "Hello from WSO2 Integrator!"
    });
    io:println("Message sent: ", response.ok);
}
```

Run the verification:

```bash
bal run
```

## Troubleshooting

| Error | Solution |
|---|---|
| `invalid_auth` | Verify your OAuth token is correct and not expired |
| `channel_not_found` | Ensure the channel name or ID exists and the bot is a member |
| `not_in_channel` | Invite the bot to the channel before posting messages |
| `missing_scope` | Add the required OAuth scope in your Slack app settings |
| `ratelimited` | Slack enforces rate limits. Implement exponential backoff. |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
