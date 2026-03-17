---
title: "Azure Cosmos DB - Setup"
description: "How to set up and configure the ballerinax/azure_cosmosdb connector."
---

# Azure Cosmos DB Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.4.1 or later
- An Azure account with an active subscription
- An Azure Cosmos DB account (SQL API)

## Step 1: Create a Cosmos DB Account

1. Navigate to the **Azure Portal**
2. Click **Create a resource** and search for **Azure Cosmos DB**
3. Select **Azure Cosmos DB for NoSQL** (SQL API)
4. Configure:
   - **Resource Group**: Select or create a resource group
   - **Account Name**: Choose a globally unique name
   - **Location**: Select your preferred region
   - **Capacity mode**: Provisioned throughput or Serverless
5. Click **Review + Create** and then **Create**

## Step 2: Get Connection Credentials

1. Navigate to your Cosmos DB account in the Azure Portal
2. Go to **Settings** > **Keys**
3. Copy the following values:
   - **URI** (this is your `baseUrl`)
   - **PRIMARY KEY** (or **SECONDARY KEY**)

The connection string pattern is:

```
AccountEndpoint=https://<account-name>.documents.azure.com:443/;AccountKey=<primary-key>;
```

### Azure AD Authentication (Alternative)

For production environments, Azure AD authentication is recommended:

1. Register an application in **Azure Active Directory**
2. Assign the **Cosmos DB Built-in Data Contributor** role
3. Use the application's client ID, tenant ID, and client secret

## Step 3: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Azure Cosmos DB**
4. Enter the URI and Primary Key

### Using Code

```ballerina
import ballerinax/azure_cosmosdb as cosmosdb;
```

```toml
[[dependency]]
org = "ballerinax"
name = "azure_cosmosdb"
version = "4.2.0"
```

## Step 4: Configure Credentials

```ballerina
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

cosmosdb:ConnectionConfig cosmosConfig = {
    baseUrl: baseUrl,
    primaryKeyOrResourceToken: primaryKey
};

cosmosdb:DataPlaneClient cosmosClient = check new (cosmosConfig);
cosmosdb:ManagementClient mgmtClient = check new (cosmosConfig);
```

```toml
# Config.toml
baseUrl = "https://my-cosmos-account.documents.azure.com:443/"
primaryKey = "<YOUR_PRIMARY_KEY>"
```

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

public function main() returns error? {
    cosmosdb:ManagementClient mgmtClient = check new ({
        baseUrl: baseUrl,
        primaryKeyOrResourceToken: primaryKey
    });

    cosmosdb:DatabaseList databases = check mgmtClient->listDatabases();
    io:println("Connected. Databases found: ", databases.databases.length());
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `Unauthorized` (401) | Verify the primary key in Config.toml |
| `NotFound` (404) | Check the database, container, or document ID |
| `Conflict` (409) | Resource with the same ID already exists |
| `TooManyRequests` (429) | Exceeded provisioned RU/s; increase throughput or retry |
| Connection refused | Verify the baseUrl format includes the port (443) |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
