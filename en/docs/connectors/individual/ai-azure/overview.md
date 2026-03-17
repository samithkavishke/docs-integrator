---
title: "Azure OpenAI (LLM Provider)"
description: "Overview of the ballerinax/ai.azure connector for WSO2 Integrator."
---

# Azure OpenAI LLM Provider

| | |
|---|---|
| **Package** | [`ballerinax/ai.azure`](https://central.ballerina.io/ballerinax/ai.azure/latest) |
| **Version** | 1.4.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.azure/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.azure/latest#functions) |

## Overview

The `ballerinax/ai.azure` module provides a Model Provider implementation for connecting with Azure OpenAI Large Language Models. It implements the `ai:ModelProvider` interface, enabling Azure-hosted OpenAI models to be used seamlessly within the Ballerina AI ecosystem.

:::info
This module is the **AI module provider** for Azure OpenAI, designed to work with the `ballerina/ai` module and agent framework. For direct REST API access to Azure OpenAI with full parameter control, use the [`ballerinax/azure.openai.chat`](../azure-openai-chat/overview) connector instead.
:::

## Key Features

- **ModelProvider Interface** -- Implements `ai:ModelProvider` for standardized AI module integration
- **Azure-Hosted Models** -- Access OpenAI models through Azure's enterprise infrastructure
- **Deployment-Based Access** -- Reference models by Azure deployment ID
- **Enterprise Security** -- Leverage Azure AD authentication and private networking
- **Agent Integration** -- Use as the LLM backend for `ai.agent` agents

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

final ai:ModelProvider azureModel = check new azure:OpenAiModelProvider(
    azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
);

public function main() returns error? {
    ai:ChatMessage[] messages = [
        {role: "user", content: "What is event-driven architecture?"}
    ];

    ai:ChatAssistantMessage response = check azureModel->chat(messages, tools = []);
}
```

## Related Resources

- [Setup Guide](setup) -- Azure resource creation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Azure OpenAI Chat Connector](../azure-openai-chat/overview) -- Direct REST API access
