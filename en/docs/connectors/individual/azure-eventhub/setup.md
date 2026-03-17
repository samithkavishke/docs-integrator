---
title: "Azure Event Hubs - Setup"
description: "How to set up and configure the ballerinax/azure_eventhub connector."
---

# Azure Event Hubs Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.4.1 or later
- An Azure account with an active subscription
- An Azure Event Hubs namespace and Event Hub created

## Step 1: Create Event Hubs Resources

1. Navigate to the **Azure Portal**
2. Click **Create a resource** and search for **Event Hubs**
3. Create an **Event Hubs Namespace**:
   - **Resource Group**: Select or create a resource group
   - **Namespace name**: Choose a globally unique name
   - **Pricing tier**: Basic, Standard, or Premium
   - **Region**: Select your preferred region
4. Within the namespace, create an **Event Hub**:
   - **Name**: e.g., `my-event-hub`
   - **Partition count**: 2-32 (default: 4)
   - **Message retention**: 1-7 days

## Step 2: Get SAS Credentials

1. Navigate to your **Event Hubs Namespace** in the Azure Portal
2. Go to **Settings** > **Shared access policies**
3. Click on **RootManageSharedAccessKey** (or create a new policy)
4. Copy the **Policy name** and **Primary key**

The connection string pattern is:

```
Endpoint=sb://<namespace>.servicebus.windows.net/;SharedAccessKeyName=<policy-name>;SharedAccessKey=<key>
```

### Azure AD Authentication (Alternative)

For production environments:

1. Register an application in **Azure Active Directory**
2. Assign the **Azure Event Hubs Data Sender** or **Data Receiver** role
3. Use the application credentials for authentication

## Step 3: Install the Connector

```ballerina
import ballerinax/azure_eventhub as eventhub;
```

```toml
[[dependency]]
org = "ballerinax"
name = "azure_eventhub"
version = "3.1.0"
```

## Step 4: Configure Credentials

```ballerina
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

eventhub:ConnectionConfig config = {
    sasKeyName: sasKeyName,
    sasKey: sasKey,
    resourceUri: resourceUri
};

eventhub:Client eventHubClient = check new (config);
```

```toml
# Config.toml
sasKeyName = "RootManageSharedAccessKey"
sasKey = "<YOUR_SAS_KEY>"
resourceUri = "https://my-namespace.servicebus.windows.net"
```

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/azure_eventhub as eventhub;

configurable string sasKeyName = ?;
configurable string sasKey = ?;
configurable string resourceUri = ?;

public function main() returns error? {
    eventhub:Client client = check new ({
        sasKeyName: sasKeyName,
        sasKey: sasKey,
        resourceUri: resourceUri
    });

    check client->send("my-event-hub", "Hello from Ballerina!");
    io:println("Event sent successfully. Connection verified.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `Unauthorized` (401) | Verify SAS key name and key value |
| `NotFound` (404) | Check Event Hub name and namespace URI |
| `QuotaExceeded` (403) | Namespace has exceeded its throughput units |
| Connection timeout | Verify the resource URI format and network access |
| Message too large | Event Hub message limit is 1 MB (256 KB for Basic tier) |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
