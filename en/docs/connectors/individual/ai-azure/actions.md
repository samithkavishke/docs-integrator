---
title: "Azure OpenAI (LLM Provider) - Actions"
description: "Available actions and operations for the ballerinax/ai.azure connector."
---

# Azure OpenAI LLM Provider Actions

The `ballerinax/ai.azure` module provides an `OpenAiModelProvider` that implements the `ai:ModelProvider` interface for Azure-hosted OpenAI models.

## Model Provider Initialization

```ballerina
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

final ai:ModelProvider azureModel = check new azure:OpenAiModelProvider(
    azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
);
```

## chat()

Send messages to the Azure OpenAI deployment and receive an assistant response.

```ballerina
ai:ChatMessage[] messages = [
    {role: "user", content: "Explain the saga pattern."}
];

ai:ChatAssistantMessage response = check azureModel->chat(messages, tools = []);
```

### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `messages` | `ai:ChatMessage[]` | Yes | Conversation history |
| `tools` | `ai:ChatCompletionTool[]` | Yes | Tool definitions (pass empty array if none) |

## Chat with System Prompt

```ballerina
ai:ChatMessage[] messages = [
    {role: "system", content: "You are an Azure solutions architect."},
    {role: "user", content: "Design a high-availability web application."}
];

ai:ChatAssistantMessage response = check azureModel->chat(messages, tools = []);
```

## Chat with Tools

```ballerina
ai:ChatCompletionTool[] tools = [
    {
        name: "lookup_resource",
        description: "Look up an Azure resource by name",
        parameters: {
            properties: {
                resourceName: {'type: "string", description: "Azure resource name"}
            }
        }
    }
];

ai:ChatMessage[] messages = [
    {role: "user", content: "Find the storage account named mydata"}
];

ai:ChatAssistantMessage response = check azureModel->chat(messages, tools);
```

## Multi-Turn Conversation

```ballerina
ai:ChatMessage[] chatMessages = [
    {role: "user", content: "What is Azure Service Bus?"}
];

ai:ChatAssistantMessage r1 = check azureModel->chat(chatMessages, tools = []);
chatMessages.push(r1);

chatMessages.push({role: "user", content: "How does it compare to Event Hubs?"});
ai:ChatAssistantMessage r2 = check azureModel->chat(chatMessages, tools = []);
```

## Error Handling

```ballerina
do {
    ai:ChatAssistantMessage response = check azureModel->chat(messages, tools = []);
} on fail error e {
    io:println("Azure OpenAI error: ", e.message());
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
