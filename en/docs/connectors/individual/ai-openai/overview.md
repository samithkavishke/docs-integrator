---
title: "OpenAI (LLM Provider)"
description: "Overview of the ballerinax/ai.openai connector for WSO2 Integrator."
---

# OpenAI LLM Provider

| | |
|---|---|
| **Package** | [`ballerinax/ai.openai`](https://central.ballerina.io/ballerinax/ai.openai/latest) |
| **Version** | 1.3.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.openai/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.openai/latest#functions) |

## Overview

The `ballerinax/ai.openai` module provides a Model Provider implementation for connecting with OpenAI Large Language Models. It implements the `ai:ModelProvider` interface from the `ballerina/ai` module, providing a standardized way to interact with OpenAI models within the Ballerina AI ecosystem.

:::info
This module is the **AI module provider** for OpenAI, designed to work with the `ballerina/ai` module and agent framework. For direct access to the OpenAI Chat Completions REST API with full parameter control, use the [`ballerinax/openai.chat`](../openai-chat/overview) connector instead.
:::

## Key Features

- **ModelProvider Interface** -- Implements `ai:ModelProvider` for standardized AI module integration
- **Chat Completion** -- Generate responses using OpenAI GPT models
- **Tool Use Support** -- Define tools for structured function calling
- **Agent Integration** -- Use as the LLM backend for `ai.agent` agents
- **Model Selection** -- Choose from GPT-4o, GPT-4, GPT-3.5 Turbo, and other available models

## Supported Models

| Model Constant | Model |
|----------------|-------|
| `openai:GPT_4O` | GPT-4o (multimodal) |
| `openai:GPT_4O_MINI` | GPT-4o Mini |
| `openai:GPT_4_TURBO` | GPT-4 Turbo |
| `openai:GPT_4` | GPT-4 |
| `openai:GPT_3_5_TURBO` | GPT-3.5 Turbo |

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider openAiModel = check new openai:ModelProvider(
    openAiApiKey, modelType = openai:GPT_4O
);

public function main() returns error? {
    ai:ChatMessage[] messages = [
        {role: "user", content: "What is the Ballerina programming language?"}
    ];

    ai:ChatAssistantMessage response = check openAiModel->chat(messages, tools = []);
    // Process response
}
```

## Related Resources

- [Setup Guide](setup) -- API key configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [OpenAI Chat Connector](../openai-chat/overview) -- Direct REST API access
- [AI Agent Framework](../ai-agent/overview) -- Build agents with OpenAI
