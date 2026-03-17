---
title: "Mistral AI - Actions"
description: "Available actions and operations for the ballerinax/ai.mistral connector."
---

# Mistral AI Actions

The `ballerinax/ai.mistral` module provides a `ModelProvider` that implements the `ai:ModelProvider` interface for Mistral AI LLMs.

## Model Provider Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

final ai:ModelProvider mistralModel = check new mistral:ModelProvider(
    mistralApiKey, mistral:MINISTRAL_3B_2410
);
```

## chat()

Send messages to the Mistral model and receive an assistant response.

```ballerina
ai:ChatMessage[] messages = [
    {role: "user", content: "Explain the CQRS pattern."}
];

ai:ChatAssistantMessage response = check mistralModel->chat(messages, tools = []);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]` | Yes | Conversation history |
| `tools` | `ai:ChatCompletionTool[]` | Yes | Tool definitions (pass empty array if none) |

## Chat with System Prompt

```ballerina
ai:ChatMessage[] messages = [
    {role: "system", content: "You are a concise technical writer."},
    {role: "user", content: "What is API rate limiting?"}
];

ai:ChatAssistantMessage response = check mistralModel->chat(messages, tools = []);
```

## Chat with Tools

```ballerina
ai:ChatCompletionTool[] tools = [
    {
        name: "convert_currency",
        description: "Convert between currencies",
        parameters: {
            properties: {
                amount: {'type: "number", description: "Amount to convert"},
                fromCurrency: {'type: "string", description: "Source currency (e.g., USD)"},
                toCurrency: {'type: "string", description: "Target currency (e.g., EUR)"}
            }
        }
    }
];

ai:ChatMessage[] messages = [
    {role: "user", content: "Convert 100 USD to EUR"}
];

ai:ChatAssistantMessage response = check mistralModel->chat(messages, tools);
```

## Available Model Constants

| Constant | Model |
|----------|-------|
| `mistral:MISTRAL_LARGE_LATEST` | Mistral Large |
| `mistral:MISTRAL_MEDIUM_LATEST` | Mistral Medium |
| `mistral:MISTRAL_SMALL_LATEST` | Mistral Small |
| `mistral:MINISTRAL_3B_2410` | Ministral 3B |
| `mistral:MINISTRAL_8B_2410` | Ministral 8B |
| `mistral:CODESTRAL_LATEST` | Codestral |

## Error Handling

```ballerina
do {
    ai:ChatAssistantMessage response = check mistralModel->chat(messages, tools = []);
} on fail error e {
    io:println("Mistral error: ", e.message());
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
