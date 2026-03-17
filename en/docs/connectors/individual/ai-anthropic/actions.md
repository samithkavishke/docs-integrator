---
title: "Anthropic Claude - Actions"
description: "Available actions and operations for the ballerinax/ai.anthropic connector."
---

# Anthropic Claude Actions

The `ballerinax/ai.anthropic` module provides a `ModelProvider` that implements the `ai:ModelProvider` interface for chat completions with Anthropic Claude models.

## Model Provider Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

final ai:ModelProvider anthropicModel = check new anthropic:ModelProvider(
    anthropicApiKey,
    anthropic:CLAUDE_3_7_SONNET_20250219,
    "2023-06-01"
);
```

## chat()

The primary operation for generating responses. Sends a list of chat messages and optional tool definitions, returning an assistant message.

```ballerina
ai:ChatMessage[] messages = [
    {role: "user", content: "What is the circuit breaker pattern?"}
];

ai:ChatAssistantMessage response = check anthropicModel->chat(messages, tools = []);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]` | Yes | Conversation history |
| `tools` | `ai:ChatCompletionTool[]` | Yes | Available tools (pass empty array if none) |

### Message Types

Messages use the `ai:ChatMessage` type with the following roles:

| Role | Description |
|------|-------------|
| `"system"` | System instructions that guide the model's behavior |
| `"user"` | User input messages |
| `"assistant"` | Previous model responses |
| `"tool"` | Tool execution results |

### Response Type

The `ai:ChatAssistantMessage` contains the model's response, including any tool call requests.

## Chat with System Prompt

```ballerina
ai:ChatMessage[] messages = [
    {role: "system", content: "You are a concise technical writer."},
    {role: "user", content: "Explain REST API versioning strategies."}
];

ai:ChatAssistantMessage response = check anthropicModel->chat(messages, tools = []);
```

## Chat with Tools

Define tools for function calling:

```ballerina
ai:ChatCompletionTool[] tools = [
    {
        name: "get_weather",
        description: "Get current weather for a location",
        parameters: {
            properties: {
                location: {'type: "string", description: "City name"}
            }
        }
    }
];

ai:ChatMessage[] messages = [
    {role: "user", content: "What is the weather in Paris?"}
];

ai:ChatAssistantMessage response = check anthropicModel->chat(messages, tools);
```

## Multi-Turn Conversation

Maintain context by accumulating messages:

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is Ballerina?"}
];

ai:ChatAssistantMessage response1 = check anthropicModel->chat(chatMessages, tools = []);
chatMessages.push(response1);

chatMessages.push({role: "user", content: "How does it handle concurrency?"});
ai:ChatAssistantMessage response2 = check anthropicModel->chat(chatMessages, tools = []);
```

## Available Model Constants

| Constant | Model |
|----------|-------|
| `anthropic:CLAUDE_3_7_SONNET_20250219` | Claude 3.7 Sonnet |
| `anthropic:CLAUDE_3_5_SONNET_20241022` | Claude 3.5 Sonnet |
| `anthropic:CLAUDE_3_5_HAIKU_20241022` | Claude 3.5 Haiku |
| `anthropic:CLAUDE_3_OPUS_20240229` | Claude 3 Opus |

## Error Handling

```ballerina
do {
    ai:ChatAssistantMessage response = check anthropicModel->chat(messages, tools = []);
    // Process response
} on fail error e {
    io:println("Anthropic API error: ", e.message());
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration instructions
- [Examples](examples) -- Code examples
