---
title: "Ollama"
description: "Overview of the ballerinax/ai.ollama connector for WSO2 Integrator."
---

# Ollama LLM Provider

| | |
|---|---|
| **Package** | [`ballerinax/ai.ollama`](https://central.ballerina.io/ballerinax/ai.ollama/latest) |
| **Version** | 1.2.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.ollama/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.ollama/latest#functions) |

## Overview

The `ballerinax/ai.ollama` module provides a Model Provider implementation for connecting with locally running LLMs through [Ollama](https://ollama.com). It implements the `ai:ModelProvider` interface, enabling local models to be used within the Ballerina AI ecosystem for development, testing, and privacy-sensitive deployments where data must not leave the local network.

Ollama is an open-source tool that lets you run large language models locally. It supports a wide range of models including Llama 3, Mistral, Gemma, Phi, and many others.

## Key Features

- **Local LLM Execution** -- Run AI models on your own hardware without sending data to external APIs
- **No API Key Required** -- No cloud provider account or billing setup needed
- **ModelProvider Interface** -- Implements `ai:ModelProvider` for standardized AI module integration
- **Wide Model Support** -- Works with any model available in the Ollama library
- **Agent Integration** -- Use as the LLM backend for `ai.agent` agents in development and testing
- **Privacy-First** -- Keep all data local for compliance-sensitive use cases

## Supported Models

Ollama supports hundreds of models. Some popular ones include:

| Model | Parameters | Description |
|-------|-----------|-------------|
| `llama3.1` | 8B/70B/405B | Meta's latest open LLM |
| `mistral` | 7B | Mistral AI's efficient model |
| `gemma2` | 9B/27B | Google's open model |
| `phi3` | 3.8B/14B | Microsoft's compact model |
| `codellama` | 7B/13B/34B | Code-specialized Llama |
| `deepseek-coder` | 6.7B/33B | Code generation specialist |

## Quick Start

```ballerina
import ballerina/ai;
import ballerinax/ai.ollama;

final ai:ModelProvider ollamaModel = check new ollama:ModelProvider("llama3.1");

public function main() returns error? {
    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain event-driven architecture."}
    ];

    ai:ChatAssistantMessage response = check ollamaModel->chat(messages, tools = []);
}
```

## Related Resources

- [Setup Guide](setup) -- Install Ollama and configure models
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
- [Ollama Model Library](https://ollama.com/library) -- Browse available models
