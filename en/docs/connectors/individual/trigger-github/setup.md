---
title: "GitHub Trigger - Setup"
description: "How to set up and configure the ballerinax/trigger.github connector."
---

# GitHub Trigger Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A GitHub account with repository admin access
- A publicly accessible URL for webhooks (use ngrok for development)

## Installation

```ballerina
import ballerinax/trigger.github;
```

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.github"
version = "0.10.0"
```

## GitHub webhook setup

### Step 1: Start your listener service

```bash
bal run
```

### Step 2: Expose your service (development)

Use ngrok to get a public URL:

```bash
ngrok http 8090
```

### Step 3: Create a webhook in GitHub

1. Go to your repository **Settings** > **Webhooks** > **Add webhook**
2. Set the **Payload URL** to your public URL (e.g., `https://abc123.ngrok.io/`)
3. Set **Content type** to `application/json`
4. Optionally set a **Secret** for webhook verification
5. Select the events you want to subscribe to
6. Click **Add webhook**

## Configuration

### Basic listener (no secret)

```ballerina
listener github:Listener webhookListener = new (listenOn = 8090);
```

### Listener with webhook secret

```ballerina
configurable string webhookSecret = ?;

github:ListenerConfig listenerConfig = {
    secret: webhookSecret
};

listener github:Listener webhookListener = new (listenerConfig, 8090);
```

### Config.toml

```toml
# Config.toml
webhookSecret = "your-webhook-secret"
```

## Verify the setup

After configuring the webhook in GitHub, it sends a `ping` event. Check your console for the ping confirmation.

| Error | Cause | Solution |
|-------|-------|----------|
| `Webhook delivery failed` | Service not reachable | Check ngrok and port |
| `Signature mismatch` | Wrong secret | Verify webhook secret |
| `404 Not Found` | Wrong URL path | Add trailing `/` to webhook URL |

## Next steps

- [Triggers Reference](triggers) -- Available event types
- [Examples](examples) -- Code examples
