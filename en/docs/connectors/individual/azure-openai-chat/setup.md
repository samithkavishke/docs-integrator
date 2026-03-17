---
title: "Azure OpenAI Chat - Setup"
description: "How to set up and configure the ballerinax/azure.openai.chat connector."
---

# Azure OpenAI Chat Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Azure account with an active subscription
- An Azure OpenAI Service resource with a deployed model

## Step 1: Create an Azure OpenAI Resource

1. Sign in to the [Azure Portal](https://portal.azure.com).
2. Click **Create a resource** and search for "Azure OpenAI".
3. Select **Azure OpenAI** and click **Create**.
4. Fill in the required details:
   - **Subscription**: Select your Azure subscription
   - **Resource group**: Select or create a new resource group
   - **Region**: Choose a region where Azure OpenAI is available (e.g., East US, West Europe)
   - **Name**: Enter a unique name for your resource
   - **Pricing tier**: Select Standard S0
5. Click **Review + create**, then **Create**.

## Step 2: Deploy a Model

1. Navigate to your Azure OpenAI resource in the Azure Portal.
2. Go to **Model deployments** > **Manage Deployments** to open Azure AI Studio.
3. Click **Create new deployment**.
4. Select the model (e.g., `gpt-4o`, `gpt-4`, `gpt-35-turbo`).
5. Give the deployment a name (e.g., `my-gpt4o-deployment`).
6. Configure capacity and click **Create**.

:::info
Note your **deployment name** -- you will use this instead of the model name when making API calls.
:::

## Step 3: Obtain Credentials

### Option A: API Key Authentication

1. In the Azure Portal, navigate to your Azure OpenAI resource.
2. Go to **Keys and Endpoint** in the left sidebar.
3. Copy **KEY 1** (or KEY 2) and the **Endpoint** URL.

### Option B: Azure AD Authentication

For production environments, use Azure AD (Entra ID) authentication:

1. Register your application in Azure AD.
2. Assign the **Cognitive Services OpenAI User** role to your application's service principal.
3. Use the Azure Identity SDK to obtain bearer tokens.

## Step 4: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Azure OpenAI Chat**.
4. Follow the connection wizard to enter your endpoint URL and API key.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/azure.openai.chat;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "azure.openai.chat"
version = "3.0.2"
```

## Step 5: Configure the Connection

### API Key Authentication

```ballerina
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);
```

Create a `Config.toml` file:

```toml
# Config.toml
apiKey = "<your-azure-openai-api-key>"
serviceUrl = "https://<your-resource-name>.openai.azure.com"
deploymentId = "<your-deployment-name>"
```

### Azure AD (Bearer Token) Authentication

```ballerina
import ballerinax/azure.openai.chat;

configurable string serviceUrl = ?;
configurable string deploymentId = ?;
configurable string token = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        token
    }
}, serviceUrl);
```

```toml
# Config.toml
serviceUrl = "https://<your-resource-name>.openai.azure.com"
deploymentId = "<your-deployment-name>"
token = "<your-azure-ad-bearer-token>"
```

## Step 6: Verify the Setup

Run a quick verification:

```ballerina
import ballerina/io;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        messages: [
            {"role": "user", "content": "Say hello in one word."}
        ]
    };

    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );

    io:println("Connection verified: ", response.choices[0].message.content);
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` | Verify your API key or Azure AD token. Check that the key matches the resource. |
| `404 Resource Not Found` | Confirm the service URL and deployment ID are correct. |
| `DeploymentNotFound` | The deployment name does not match any deployment in your resource. Check Azure AI Studio. |
| `Model not available in region` | Some models are only available in specific Azure regions. Check regional availability. |
| `Content filter triggered` | Azure's content filtering blocked the request. Review your prompt content. |

## Security Best Practices

- Use Azure AD authentication with managed identities in production
- Store API keys in `Config.toml` or Azure Key Vault, never in source code
- Enable private endpoints for your Azure OpenAI resource in production
- Use separate deployments for development, staging, and production
- Monitor usage through Azure Monitor and set up cost alerts

## Next Steps

- [Actions Reference](actions) -- Explore available operations
- [Examples](examples) -- See production-ready code samples
