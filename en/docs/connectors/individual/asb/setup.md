---
title: "Azure Service Bus - Setup"
description: "How to set up and configure the ballerinax/asb connector."
---

# Azure Service Bus Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Azure subscription with a Service Bus namespace

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Azure Service Bus**
4. Enter your connection string from the Azure portal

### Using code

```ballerina
import ballerinax/asb;
```

```toml
[[dependency]]
org = "ballerinax"
name = "asb"
version = "3.9.1"
```

## Azure portal setup

### Step 1: Create a Service Bus namespace

1. Sign in to the [Azure Portal](https://portal.azure.com/)
2. Navigate to **All services** > **Integration** > **Service Bus**
3. Click **Create** on the Service Bus tile
4. Fill in the required details:
   - **Subscription**: Select your Azure subscription
   - **Resource group**: Choose or create a resource group
   - **Namespace name**: Enter a globally unique name
   - **Location**: Select a region
   - **Pricing tier**: Standard or Premium (topics require Standard+)
5. Click **Review + create**, then **Create**

### Step 2: Obtain the connection string

1. Navigate to your Service Bus namespace
2. Click **Shared access policies** in the left pane
3. Click **RootManageSharedAccessKey**
4. Copy the **Primary Connection String**

### Step 3: Create a queue or topic

1. In the namespace overview, click **+ Queue** or **+ Topic**
2. Enter a name and configure options (message TTL, max size, sessions)
3. Click **Create**

## Configuration

### Admin client

```ballerina
configurable string connectionString = ?;

asb:AdminClient admin = check new (connectionString);
```

### Message sender

```ballerina
configurable string connectionString = ?;
configurable string queueName = ?;

asb:MessageSender sender = check new (connectionString, queueName);
```

### Message receiver

```ballerina
configurable string connectionString = ?;
configurable string queueName = ?;

// PEEK_LOCK: message locked until completed/abandoned
asb:MessageReceiver receiver = check new (connectionString, queueName, asb:PEEK_LOCK);

// RECEIVE_AND_DELETE: message removed on receive
asb:MessageReceiver receiver2 = check new (connectionString, queueName, asb:RECEIVE_AND_DELETE);
```

### Topic subscription receiver

```ballerina
configurable string connectionString = ?;

asb:MessageReceiver subReceiver = check new (connectionString,
    "my-topic", asb:PEEK_LOCK,
    subscriptionName = "my-subscription");
```

### Config.toml

```toml
# Config.toml
connectionString = "Endpoint=sb://my-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=..."
queueName = "my-queue"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `Unauthorized access` | Invalid connection string | Re-copy from Azure portal |
| `Entity not found` | Queue/topic does not exist | Create in Azure portal first |
| `Quota exceeded` | Namespace capacity reached | Upgrade pricing tier |

## Next steps

- [Actions Reference](actions) -- Sender, receiver, admin operations
- [Examples](examples) -- Code examples
