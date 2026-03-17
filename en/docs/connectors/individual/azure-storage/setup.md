---
title: "Azure Blob Storage - Setup"
description: "How to set up and configure the ballerinax/azure_storage_service connector."
---

# Azure Blob Storage Setup

## Prerequisites

- WSO2 Integrator with VS Code extension installed
- Ballerina Swan Lake 2201.4.1 or later
- An Azure account with an active subscription
- An Azure Storage Account created

## Step 1: Create an Azure Storage Account

1. Navigate to the **Azure Portal** (portal.azure.com)
2. Click **Create a resource** and search for **Storage account**
3. Configure the storage account:
   - **Resource group**: Select or create a resource group
   - **Storage account name**: Choose a globally unique name (3-24 lowercase letters/numbers)
   - **Region**: Select your preferred Azure region
   - **Performance**: Standard or Premium
   - **Redundancy**: LRS, GRS, ZRS, or GZRS
4. Click **Review + create** and then **Create**

## Step 2: Get Access Keys

1. Navigate to your **Storage Account** in the Azure Portal
2. Go to **Security + networking** > **Access keys**
3. Copy the **Storage account name** and **Key1** (or **Key2**)

### Alternative: Use a SAS Token

Generate a Shared Access Signature for more granular access control:

1. In your Storage Account, go to **Security + networking** > **Shared access signature**
2. Select the allowed services (Blob), resource types, and permissions
3. Set the start and expiry time
4. Click **Generate SAS and connection string**
5. Copy the **SAS token**

### Connection String Pattern

The Azure Storage connection string follows this pattern:

```
DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net
```

## Step 3: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Azure Blob Storage**
4. Follow the connection wizard to enter credentials

### Using Code

```ballerina
import ballerinax/azure_storage_service as azure_storage;
```

```toml
[[dependency]]
org = "ballerinax"
name = "azure_storage_service"
version = "4.3.3"
```

## Step 4: Configure Credentials

### Using Access Key

```ballerina
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;

azure_storage:ConnectionConfig config = {
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
};

azure_storage:BlobClient blobClient = check new (config);
azure_storage:ManagementClient mgmtClient = check new (config);
```

### Using SAS Token

```ballerina
configurable string accountName = ?;
configurable string sasToken = ?;

azure_storage:ConnectionConfig config = {
    accessKeyOrSAS: sasToken,
    accountName: accountName,
    authorizationMethod: "SAS"
};

azure_storage:BlobClient blobClient = check new (config);
```

```toml
# Config.toml
accountName = "mystorageaccount"
accessKey = "<YOUR_STORAGE_ACCESS_KEY>"
```

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;

public function main() returns error? {
    azure_storage:ManagementClient mgmtClient = check new ({
        accessKeyOrSAS: accessKey,
        accountName: accountName,
        authorizationMethod: "accessKey"
    });

    azure_storage:ContainerList containers = check mgmtClient->listContainers();
    io:println("Connected. Found containers: ", containers.containers.length());
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|---|---|
| `AuthenticationFailed` | Verify the access key or SAS token in Config.toml |
| `ContainerNotFound` | Check container name (lowercase, 3-63 characters, no special chars) |
| `AuthorizationFailure` | Ensure SAS token has the required permissions and is not expired |
| `AccountNotFound` | Verify the storage account name |
| Timeout errors | Check network connectivity to Azure endpoints |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
