---
title: "Anthropic Claude"
description: "Overview of the ballerinax/ai.anthropic connector for WSO2 Integrator."
---

# Anthropic Claude LLM Provider

| | |
|---|---|
| **Package** | [`ballerinax/ai.anthropic`](https://central.ballerina.io/ballerinax/ai.anthropic/latest) |
| **Version** | 1.3.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.anthropic/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.anthropic/latest#functions) |

## Overview

The `ballerinax/ai.anthropic` module provides a Model Provider implementation for connecting with Anthropic Claude Large Language Models. It implements the `ai:ModelProvider` interface from the `ballerina/ai` module, enabling seamless integration with the Ballerina AI ecosystem including the agent framework and RAG pipelines.

Anthropic is an AI safety company that builds reliable, interpretable, and steerable AI systems. Their Claude models excel at thoughtful, nuanced responses and are known for strong performance in analysis, coding, math, and creative tasks.

## Key Features

- **ModelProvider Interface** -- Implements `ai:ModelProvider` for use with the Ballerina AI module
- **Chat Completion** -- Generate conversational responses using Claude models
- **Tool Use Support** -- Define tools for structured function calling
- **Multi-turn Conversations** -- Maintain conversation context with message history
- **Agent Integration** -- Use as the LLM backend for `ai.agent` ReAct and function calling agents

## Supported Models

| Model Constant | Model | Description |
|----------------|-------|-------------|
| `anthropic:CLAUDE_3_7_SONNET_20250219` | Claude 3.7 Sonnet | Latest balanced model with strong reasoning |
| `anthropic:CLAUDE_3_5_SONNET_20241022` | Claude 3.5 Sonnet | High-performance with vision support |
| `anthropic:CLAUDE_3_5_HAIKU_20241022` | Claude 3.5 Haiku | Fast and cost-effective |
| `anthropic:CLAUDE_3_OPUS_20240229` | Claude 3 Opus | Most capable for complex tasks |

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

final ai:ModelProvider anthropicModel = check new anthropic:ModelProvider(
    anthropicApiKey,
    anthropic:CLAUDE_3_7_SONNET_20250219,
    "2023-06-01"
);

public function main() returns error? {
    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain the benefits of event-driven architecture."}
    ];

    ai:ChatAssistantMessage response = check anthropicModel->chat(messages, tools = []);
    // Process response
}
```

## Related Resources

- [Setup Guide](setup) -- API key configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Production-ready code examples
- [AI Agent Framework](../ai-agent/overview) -- Build agents with Claude as the LLM backend
