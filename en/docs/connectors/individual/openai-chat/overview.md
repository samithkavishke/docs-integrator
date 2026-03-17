---
title: "OpenAI Chat"
description: "Overview of the ballerinax/openai.chat connector for WSO2 Integrator."
---

# OpenAI Chat Connector

| | |
|---|---|
| **Package** | [`ballerinax/openai.chat`](https://central.ballerina.io/ballerinax/openai.chat/latest) |
| **Version** | 4.0.1 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/openai.chat/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/openai.chat/latest#functions) |

## Overview

The `ballerinax/openai.chat` connector provides seamless integration with the [OpenAI Chat Completions API](https://platform.openai.com/docs/api-reference/chat), enabling WSO2 Integrator applications to leverage advanced GPT models for conversational AI, text generation, function calling, and vision-based tasks.

OpenAI is an AI research organization focused on creating safe and beneficial artificial intelligence. The OpenAI API gives developers programmatic access to powerful language models including GPT-4o, GPT-4, and GPT-3.5 Turbo for a wide range of natural language processing tasks.

## Key Features

- **Chat Completions** -- Generate conversational responses using state-of-the-art GPT models
- **Multi-turn Conversations** -- Maintain context across multiple exchanges with message history
- **Function Calling** -- Let the model invoke structured functions based on natural language input
- **Streaming Responses** -- Receive partial responses in real time for lower-latency applications
- **Vision Support** -- Send images alongside text for multimodal analysis (GPT-4o, GPT-4 Turbo)
- **System Prompts** -- Control model behavior with system-level instructions
- **Token Management** -- Fine-tune response length and cost with token limits

## Supported Models

| Model | Description | Context Window |
|-------|-------------|----------------|
| `gpt-4o` | Most capable multimodal model, optimized for speed | 128K tokens |
| `gpt-4o-mini` | Small, fast, and affordable for lightweight tasks | 128K tokens |
| `gpt-4-turbo` | High-capability model with vision support | 128K tokens |
| `gpt-4` | Advanced reasoning and instruction following | 8K tokens |
| `gpt-3.5-turbo` | Fast and cost-effective for simpler tasks | 16K tokens |

## Use Cases

- **Customer Support Automation** -- Build intelligent chatbots that understand context and provide accurate responses
- **Content Generation** -- Generate articles, summaries, translations, and creative writing
- **Code Assistance** -- Create coding assistants that explain, debug, and generate code
- **Data Extraction** -- Use function calling to extract structured data from unstructured text
- **Image Analysis** -- Analyze images and documents using vision capabilities
- **Integration Orchestration** -- Combine chat completions with other connectors for intelligent workflow automation

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "openai.chat"
version = "4.0.1"
```

Import and initialize the client:

```ballerina
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});
```

Send a basic chat completion request:

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "user",
                "content": "What is WSO2 Integrator?"
            }
        ]
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);
    io:println(response.choices[0].message.content);
}
```

## Related Resources

- [Setup Guide](setup) -- Configure API keys and connection settings
- [Actions Reference](actions) -- Complete list of available operations
- [Examples](examples) -- Production-ready code examples
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/openai.chat/latest) -- Full API documentation
- [OpenAI API Reference](https://platform.openai.com/docs/api-reference/chat) -- Official OpenAI documentation
