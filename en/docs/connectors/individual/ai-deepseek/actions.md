---
title: "Deepseek - Actions"
description: "Available actions and operations for the ballerinax/ai.deepseek connector."
---

# DeepSeek Actions

The `ballerinax/ai.deepseek` module provides a `ModelProvider` that implements the `ai:ModelProvider` interface for DeepSeek LLMs.

## Model Provider Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

final ai:ModelProvider deepseekModel = check new deepseek:ModelProvider(deepseekApiKey);
```

## chat()

Send messages to the DeepSeek model and receive an assistant response.

```ballerina
ai:ChatMessage[] messages = [
    {role: "user", content: "Explain the circuit breaker pattern."}
];

ai:ChatAssistantMessage response = check deepseekModel->chat(messages, tools = []);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]` | Yes | Conversation history |
| `tools` | `ai:ChatCompletionTool[]` | Yes | Tool definitions (pass empty array if none) |

## Chat with System Prompt

```ballerina
ai:ChatMessage[] messages = [
    {role: "system", content: "You are a software architecture expert."},
    {role: "user", content: "Design a microservices architecture for e-commerce."}
];

ai:ChatAssistantMessage response = check deepseekModel->chat(messages, tools = []);
```

## Chat with Tools

```ballerina
ai:ChatCompletionTool[] tools = [
    {
        name: "search_docs",
        description: "Search technical documentation",
        parameters: {
            properties: {
                query: {'type: "string", description: "Search query"}
            }
        }
    }
];

ai:ChatMessage[] messages = [
    {role: "user", content: "Find documentation about Ballerina HTTP modules"}
];

ai:ChatAssistantMessage response = check deepseekModel->chat(messages, tools);
```

## Multi-Turn Conversation

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is gRPC?"}
];

ai:ChatAssistantMessage r1 = check deepseekModel->chat(chatMessages, tools = []);
chatMessages.push(r1);

chatMessages.push({role: "user", content: "When should I use it over REST?"});
ai:ChatAssistantMessage r2 = check deepseekModel->chat(chatMessages, tools = []);
```

## Error Handling

```ballerina
do {
    ai:ChatAssistantMessage response = check deepseekModel->chat(messages, tools = []);
} on fail error e {
    io:println("DeepSeek error: ", e.message());
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
