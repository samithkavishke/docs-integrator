---
title: "Ollama - Actions"
description: "Available actions and operations for the ballerinax/ai.ollama connector."
---

# Ollama Actions

The `ballerinax/ai.ollama` module provides a `ModelProvider` that implements the `ai:ModelProvider` interface for locally running LLMs via Ollama.

## Model Provider Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.ollama;

final ai:ModelProvider ollamaModel = check new ollama:ModelProvider("llama3.1");
```

## chat()

Send messages to the local Ollama model and receive an assistant response.

```ballerina
ai:ChatMessage[] messages = [
    {role: "user", content: "What is the observer pattern?"}
];

ai:ChatAssistantMessage response = check ollamaModel->chat(messages, tools = []);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]` | Yes | Conversation history |
| `tools` | `ai:ChatCompletionTool[]` | Yes | Tool definitions (pass empty array if none) |

## Chat with System Prompt

```ballerina
ai:ChatMessage[] messages = [
    {role: "system", content: "You are a Ballerina programming expert."},
    {role: "user", content: "How do I create an HTTP service?"}
];

ai:ChatAssistantMessage response = check ollamaModel->chat(messages, tools = []);
```

## Chat with Tools

Tool calling support depends on the model. Models like `llama3.1` and `mistral` support function calling:

```ballerina
ai:ChatCompletionTool[] tools = [
    {
        name: "get_time",
        description: "Get the current time",
        parameters: {
            properties: {
                timezone: {'type: "string", description: "Timezone (e.g., UTC, EST)"}
            }
        }
    }
];

ai:ChatMessage[] messages = [
    {role: "user", content: "What time is it in UTC?"}
];

ai:ChatAssistantMessage response = check ollamaModel->chat(messages, tools);
```

## Multi-Turn Conversation

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is Docker?"}
];

ai:ChatAssistantMessage r1 = check ollamaModel->chat(chatMessages, tools = []);
chatMessages.push(r1);

chatMessages.push({role: "user", content: "How does it compare to Podman?"});
ai:ChatAssistantMessage r2 = check ollamaModel->chat(chatMessages, tools = []);
```

## Error Handling

```ballerina
do {
    ai:ChatAssistantMessage response = check ollamaModel->chat(messages, tools = []);
} on fail error e {
    io:println("Ollama error: ", e.message());
    // Common errors:
    // - Connection refused (server not running)
    // - Model not found (not pulled)
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Installation and configuration
- [Examples](examples) -- Code examples
