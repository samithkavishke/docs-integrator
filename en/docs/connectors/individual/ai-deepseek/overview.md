---
title: "Deepseek"
description: "Overview of the ballerinax/ai.deepseek connector for WSO2 Integrator."
---

# DeepSeek LLM Provider

| | |
|---|---|
| **Package** | [`ballerinax/ai.deepseek`](https://central.ballerina.io/ballerinax/ai.deepseek/latest) |
| **Version** | 1.1.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.deepseek/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.deepseek/latest#functions) |

## Overview

The `ballerinax/ai.deepseek` module provides a Model Provider implementation for connecting with DeepSeek Large Language Models. It implements the `ai:ModelProvider` interface, enabling DeepSeek models to be used within the Ballerina AI ecosystem.

DeepSeek is an AI company that develops powerful open-weight language models known for strong performance in reasoning, coding, and mathematics. Their models offer competitive performance at cost-effective pricing.

## Key Features

- **ModelProvider Interface** -- Implements `ai:ModelProvider` for standardized AI module integration
- **Chat Completion** -- Generate responses using DeepSeek models
- **Tool Use Support** -- Define tools for structured function calling
- **Agent Integration** -- Use as the LLM backend for `ai.agent` agents
- **Cost-Effective** -- Competitive pricing for high-quality language model access

## Supported Models

| Model | Description |
|-------|-------------|
| DeepSeek-V3 | Latest general-purpose model with strong reasoning |
| DeepSeek-R1 | Reasoning-optimized model |
| DeepSeek-Coder | Code generation specialist |

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

final ai:ModelProvider deepseekModel = check new deepseek:ModelProvider(deepseekApiKey);

public function main() returns error? {
    ai:ChatMessage[] messages = [
        {role: "user", content: "What is the Ballerina programming language?"}
    ];

    ai:ChatAssistantMessage response = check deepseekModel->chat(messages, tools = []);
}
```

## Related Resources

- [Setup Guide](setup) -- API key configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [DeepSeek Platform](https://platform.deepseek.com) -- Official DeepSeek platform
