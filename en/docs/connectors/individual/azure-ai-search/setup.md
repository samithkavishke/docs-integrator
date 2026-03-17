---
title: "Azure AI Search - Setup"
description: "How to set up and configure the ballerinax/azure.ai.search connector."
---

# Azure AI Search Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Azure account with an active subscription
- An Azure AI Search service provisioned in your subscription

## Step 1: Create an Azure AI Search Service

1. Sign in to the [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** and search for "AI Search".
3. Select **AI Search** and click **Create**.
4. Fill in the required details:
   - **Resource group**: Select or create a new resource group
   - **Service name**: Choose a unique name for your search service
   - **Location**: Select a region close to your application
   - **Pricing tier**: Choose the appropriate tier based on your needs
5. Click **Review + create** and then **Create** to provision the service.

## Step 2: Get the Service URL and Admin Key

1. Navigate to your Azure AI Search service in the Azure Portal.
2. In the **Overview** section, note the URL (e.g., `https://your-service.search.windows.net`).
3. Navigate to **Keys** in the left menu to find your admin keys.
4. Copy either the primary or secondary admin key.

## Step 3: Install the Module

```ballerina
import ballerinax/azure.ai.search as azureSearch;
```

```toml
[[dependency]]
org = "ballerinax"
name = "azure.ai.search"
version = "1.0.1"
```

## Step 4: Configure Credentials

```toml
# Config.toml
serviceUrl = "https://your-service.search.windows.net"
adminKey = "<your-admin-key>"
```

```ballerina
configurable string serviceUrl = ?;
configurable string adminKey = ?;
```

## Step 5: Initialize the Client

```ballerina
import ballerinax/azure.ai.search as azureSearch;

configurable string serviceUrl = ?;
configurable string adminKey = ?;

final azureSearch:Client searchClient = check new (serviceUrl, {});
```

## Step 6: Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/azure.ai.search as azureSearch;

configurable string serviceUrl = ?;
configurable string adminKey = ?;

public function main() returns error? {
    final azureSearch:Client searchClient = check new (serviceUrl, {});

    io:println("Azure AI Search client initialized successfully.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Authentication error` | Verify the admin key in `Config.toml` |
| `Service not found` | Check the service URL matches your Azure AI Search instance |
| `403 Forbidden` | Ensure the admin key has the required permissions |
| `Connection timeout` | Verify network connectivity to Azure services |
| `Invalid API version` | Update the API version parameter to a supported version |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
