---
title: "Mistral AI"
description: "Overview of the ballerinax/ai.mistral connector for WSO2 Integrator."
---

# Mistral AI LLM Provider

| | |
|---|---|
| **Package** | [`ballerinax/ai.mistral`](https://central.ballerina.io/ballerinax/ai.mistral/latest) |
| **Version** | 1.2.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.mistral/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.mistral/latest#functions) |

## Overview

The `ballerinax/ai.mistral` module provides a Model Provider implementation for connecting with Mistral AI Large Language Models. It implements the `ai:ModelProvider` interface, enabling Mistral models to be used within the Ballerina AI ecosystem.

Mistral AI is a French AI company building efficient, open-weight language models. Their models are known for high performance relative to their size, making them excellent choices for cost-effective deployments.

## Key Features

- **ModelProvider Interface** -- Implements `ai:ModelProvider` for standardized AI module integration
- **Chat Completion** -- Generate responses using Mistral models
- **Tool Use Support** -- Define tools for structured function calling
- **Agent Integration** -- Use as the LLM backend for `ai.agent` agents
- **Efficient Models** -- High performance-to-cost ratio

## Supported Models

| Model Constant | Model | Description |
|----------------|-------|-------------|
| `mistral:MISTRAL_LARGE_LATEST` | Mistral Large | Most capable model |
| `mistral:MISTRAL_MEDIUM_LATEST` | Mistral Medium | Balanced performance |
| `mistral:MISTRAL_SMALL_LATEST` | Mistral Small | Fast and efficient |
| `mistral:MINISTRAL_3B_2410` | Ministral 3B | Ultra-compact model |
| `mistral:MINISTRAL_8B_2410` | Ministral 8B | Compact but capable |
| `mistral:CODESTRAL_LATEST` | Codestral | Code generation specialist |

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

final ai:ModelProvider mistralModel = check new mistral:ModelProvider(
    mistralApiKey, mistral:MINISTRAL_3B_2410
);

public function main() returns error? {
    ai:ChatMessage[] messages = [
        {role: "user", content: "What is event sourcing?"}
    ];

    ai:ChatAssistantMessage response = check mistralModel->chat(messages, tools = []);
}
```

## Related Resources

- [Setup Guide](setup) -- API key configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Mistral AI Console](https://console.mistral.ai/) -- Official platform
