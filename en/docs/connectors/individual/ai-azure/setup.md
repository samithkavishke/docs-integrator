---
title: "Azure OpenAI (LLM Provider) - Setup"
description: "How to set up and configure the ballerinax/ai.azure connector."
---

# Azure OpenAI LLM Provider Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Azure account with an active subscription
- An Azure OpenAI Service resource with a deployed model

## Step 1: Create Azure OpenAI Resources

1. Sign in to the [Azure Portal](https://portal.azure.com).
2. Create an [Azure OpenAI resource](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource).
3. Deploy a model (e.g., GPT-4o) and note the **deployment name**.
4. Navigate to **Keys and Endpoint** and copy the API key and endpoint URL.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.azure;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.azure"
version = "1.4.1"
```

## Step 3: Configure Credentials

```toml
# Config.toml
azureApiKey = "<your-azure-openai-api-key>"
azureServiceUrl = "https://<your-resource-name>.openai.azure.com"
azureDeploymentId = "<your-deployment-name>"
azureApiVersion = "2024-06-01"
```

```ballerina
configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;
configurable string azureApiVersion = ?;
```

## Step 4: Initialize the Model Provider

```ballerina
import ballerina/ai;
import ballerinax/ai.azure;

final ai:ModelProvider azureModel = check new azure:OpenAiModelProvider(
    azureServiceUrl, azureApiKey, azureDeploymentId, azureApiVersion
);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `serviceUrl` | `string` | Azure OpenAI endpoint URL |
| `apiKey` | `string` | Azure API key |
| `deploymentId` | `string` | Azure model deployment name |
| `apiVersion` | `string` | API version (e.g., `"2024-06-01"`) |

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

public function main() returns error? {
    ai:ModelProvider model = check new azure:OpenAiModelProvider(
        azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
    );

    ai:ChatMessage[] messages = [{role: "user", content: "Say hello."}];
    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println("Connection verified.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` | Verify your Azure API key |
| `DeploymentNotFound` | Check deployment name matches your Azure portal configuration |
| `Model not available in region` | Some models are only available in specific Azure regions |
| `Invalid API version` | Use a supported version like `"2024-06-01"` |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
