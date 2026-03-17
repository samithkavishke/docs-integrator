---
title: "Salesforce Trigger - Setup"
description: "How to set up and configure the ballerinax/trigger.salesforce connector."
---

# Salesforce Trigger Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Salesforce account (Developer, Enterprise, or Unlimited edition)
- Salesforce Streaming API enabled

## Installation

```ballerina
import ballerinax/trigger.salesforce;
```

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.salesforce"
version = "0.10.0"
```

## Salesforce setup

### Enable Change Data Capture

1. Log in to Salesforce and navigate to **Setup**
2. Search for **Change Data Capture** in the Quick Find box
3. Select the objects you want to track (e.g., Account, Contact, Opportunity)
4. Click **Save**

### Create a Connected App (for OAuth)

1. Navigate to **Setup** > **App Manager** > **New Connected App**
2. Enable OAuth settings
3. Add the required scopes (e.g., `api`, `refresh_token`)
4. Record the **Consumer Key** and **Consumer Secret**

## Configuration

### Basic configuration (username/password)

```ballerina
configurable string username = ?;
configurable string password = ?;

listener salesforce:Listener sfListener = new ({
    username,
    password
});
```

### Config.toml

```toml
# Config.toml
username = "user@example.com"
password = "yourPassword+securityToken"
```

:::note
Append your Salesforce security token to the password. You can reset the security token from **My Settings** > **Personal** > **Reset My Security Token**.
:::

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `INVALID_LOGIN` | Bad credentials | Verify username and password+token |
| `INVALID_SESSION_ID` | Session expired | Check security token |
| `API_DISABLED_FOR_ORG` | Streaming API not enabled | Enable in Salesforce Setup |

## Next steps

- [Triggers Reference](triggers) -- Available events
- [Examples](examples) -- Code examples
