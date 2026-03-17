---
title: "Azure OpenAI Chat"
description: "Overview of the ballerinax/azure.openai.chat connector for WSO2 Integrator."
---

# Azure OpenAI Chat Connector

| | |
|---|---|
| **Package** | [`ballerinax/azure.openai.chat`](https://central.ballerina.io/ballerinax/azure.openai.chat/latest) |
| **Version** | 3.0.2 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure.openai.chat/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure.openai.chat/latest#functions) |

## Overview

The `ballerinax/azure.openai.chat` connector provides integration with the [Azure OpenAI Service Chat Completions API](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/reference#chat-completions), allowing WSO2 Integrator applications to access OpenAI models hosted on Microsoft Azure infrastructure.

Azure OpenAI Service provides enterprise-grade security, compliance, and regional availability for OpenAI models. It offers the same powerful GPT models as OpenAI but with added benefits including private networking, managed identity authentication, and data residency guarantees.

### API Compatibility

Azure OpenAI Service REST API: v2024-06-01 (and preview versions)

## Key Features

- **Enterprise-Grade Security** -- Access OpenAI models through Azure's security infrastructure with private endpoints and Azure AD authentication
- **Regional Deployment** -- Deploy models in specific Azure regions for data residency and latency optimization
- **Azure AD Authentication** -- Use managed identities and Azure Active Directory tokens instead of API keys
- **Content Filtering** -- Built-in responsible AI content filtering powered by Azure AI Content Safety
- **Chat Completions** -- Generate conversational responses using GPT-4o, GPT-4, and GPT-3.5 Turbo deployments
- **Function Calling** -- Integrate with external systems through structured tool definitions
- **Custom Deployments** -- Use named model deployments for version control and traffic management

## Azure OpenAI vs OpenAI Direct

| Feature | Azure OpenAI | OpenAI Direct |
|---------|-------------|---------------|
| Authentication | API Key or Azure AD | API Key only |
| Data Residency | Region-specific | US-based |
| Private Networking | VNet, Private Endpoints | Public only |
| SLA | Enterprise SLA | Best effort |
| Content Filtering | Built-in Azure filters | OpenAI moderation |
| Billing | Azure subscription | OpenAI account |
| Model Access | Deployment-based | Direct model names |

## Supported Models

Models available depend on your Azure OpenAI resource region and deployment configuration:

| Model | Description |
|-------|-------------|
| `gpt-4o` | Latest multimodal model with vision support |
| `gpt-4o-mini` | Lightweight, cost-effective option |
| `gpt-4` | Advanced reasoning capabilities |
| `gpt-4-turbo` | High-capability with 128K context window |
| `gpt-35-turbo` | Fast, cost-effective for simpler tasks |

:::info
In Azure OpenAI, you reference your **deployment name** rather than the model name directly. The deployment name is assigned when you deploy a model in the Azure portal.
:::

## Quick Start

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
            {
                "role": "user",
                "content": "What are the benefits of Azure OpenAI Service?"
            }
        ]
    };

    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );

    io:println(response.choices[0].message.content);
}
```

## Related Resources

- [Setup Guide](setup) -- Azure portal resource creation and configuration
- [Actions Reference](actions) -- Available operations and parameters
- [Examples](examples) -- Production-ready code examples
- [Azure OpenAI Documentation](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/) -- Official Microsoft docs
