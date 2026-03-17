---
title: "Slack Trigger - Setup"
description: "How to set up and configure the ballerinax/trigger.slack connector."
---

# Slack Trigger Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Slack workspace and app with Event Subscriptions enabled

## Installation

```ballerina
import ballerinax/trigger.slack;
```

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.slack"
version = "0.9.0"
```

## Slack app setup

### Step 1: Create a Slack App

1. Visit [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click **Create New App** > **From scratch**
3. Name your app and select your workspace

### Step 2: Enable Event Subscriptions

1. Go to **Event Subscriptions** in your app settings
2. Toggle **Enable Events** to On
3. Set the **Request URL** to your public endpoint (e.g., `https://your-domain.com/slack/events/`)
4. Subscribe to events in **Subscribe to events on behalf of users** (e.g., `message.channels`, `user_change`)
5. Click **Save Changes**

### Step 3: Get the Verification Token

1. Go to **Basic Information** in your app settings
2. Copy the **Verification Token**

## Configuration

```ballerina
configurable string verificationToken = ?;

slack:ListenerConfig config = {
    verificationToken: verificationToken
};

listener slack:Listener slackListener = new (config);
```

### Config.toml

```toml
# Config.toml
verificationToken = "your-slack-verification-token"
```

### URL verification

When you first set the Request URL, Slack sends a `url_verification` challenge. The listener handles this automatically by comparing the token and responding with the challenge value.

## Verify the setup

1. Run your service: `bal run`
2. Start ngrok: `ngrok http 9090`
3. Paste the ngrok URL in Slack Event Subscriptions (add `/slack/events/` suffix with trailing slash)
4. Verify the URL shows as **Verified**

## Next steps

- [Triggers Reference](triggers) -- Available event types
- [Examples](examples) -- Code examples
