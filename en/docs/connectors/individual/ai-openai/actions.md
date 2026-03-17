---
title: "OpenAI (LLM Provider) - Actions"
description: "Available actions and operations for the ballerinax/ai.openai connector."
---

# OpenAI LLM Provider Actions

The `ballerinax/ai.openai` module provides a `ModelProvider` that implements the `ai:ModelProvider` interface for chat completions with OpenAI models.

## Model Provider Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider openAiModel = check new openai:ModelProvider(
    openAiApiKey, modelType = openai:GPT_4O
);
```

## chat()

Send messages to the OpenAI model and receive an assistant response.

```ballerina
ai:ChatMessage[] messages = [
    {role: "user", content: "What are integration best practices?"}
];

ai:ChatAssistantMessage response = check openAiModel->chat(messages, tools = []);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]` | Yes | Conversation message history |
| `tools` | `ai:ChatCompletionTool[]` | Yes | Tool definitions (pass empty array if none) |

### Message Roles

| Role | Description |
|------|-------------|
| `"system"` | System instructions |
| `"user"` | User input |
| `"assistant"` | Previous model responses |
| `"tool"` | Tool execution results |

## Chat with System Prompt

```ballerina
ai:ChatMessage[] messages = [
    {role: "system", content: "You are a helpful coding assistant."},
    {role: "user", content: "Write a Ballerina HTTP service."}
];

ai:ChatAssistantMessage response = check openAiModel->chat(messages, tools = []);
```

## Chat with Tools

```ballerina
ai:ChatCompletionTool[] tools = [
    {
        name: "get_stock_price",
        description: "Get the current stock price for a ticker symbol",
        parameters: {
            properties: {
                symbol: {'type: "string", description: "Stock ticker symbol"}
            }
        }
    }
];

ai:ChatMessage[] messages = [
    {role: "user", content: "What is the price of AAPL?"}
];

ai:ChatAssistantMessage response = check openAiModel->chat(messages, tools);
```

## Multi-Turn Conversation

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is Ballerina?"}
];

ai:ChatAssistantMessage response1 = check openAiModel->chat(chatMessages, tools = []);
chatMessages.push(response1);

chatMessages.push({role: "user", content: "How does it handle errors?"});
ai:ChatAssistantMessage response2 = check openAiModel->chat(chatMessages, tools = []);
```

## Available Model Constants

| Constant | Model |
|----------|-------|
| `openai:GPT_4O` | GPT-4o |
| `openai:GPT_4O_MINI` | GPT-4o Mini |
| `openai:GPT_4_TURBO` | GPT-4 Turbo |
| `openai:GPT_4` | GPT-4 |
| `openai:GPT_3_5_TURBO` | GPT-3.5 Turbo |

## Error Handling

```ballerina
do {
    ai:ChatAssistantMessage response = check openAiModel->chat(messages, tools = []);
} on fail error e {
    io:println("OpenAI error: ", e.message());
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
