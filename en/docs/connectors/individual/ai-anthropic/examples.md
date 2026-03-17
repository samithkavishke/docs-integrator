---
title: "Anthropic Claude - Examples"
description: "Code examples for the ballerinax/ai.anthropic connector."
---

# Anthropic Claude Examples

## Example 1: Basic Chat Completion

Simple question-and-answer using Claude.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new anthropic:ModelProvider(
        anthropicApiKey,
        anthropic:CLAUDE_3_7_SONNET_20250219,
        "2023-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain microservices architecture in 3 sentences."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 2: Multi-Turn Conversation

Build a conversation with context maintained across turns.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new anthropic:ModelProvider(
        anthropicApiKey,
        anthropic:CLAUDE_3_5_SONNET_20241022,
        "2023-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are an integration architecture expert."},
        {role: "user", content: "What is the saga pattern?"}
    ];

    // First turn
    ai:ChatAssistantMessage response1 = check model->chat(messages, tools = []);
    messages.push(response1);
    io:println("Turn 1: ", response1.content);

    // Second turn
    messages.push({role: "user", content: "How does it compare to two-phase commit?"});
    ai:ChatAssistantMessage response2 = check model->chat(messages, tools = []);
    io:println("Turn 2: ", response2.content);
}
```

## Example 3: Using Claude with the AI Agent Framework

Use Anthropic Claude as the LLM backend for an AI agent.

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.anthropic;
import ballerinax/ai.agent;

configurable string anthropicApiKey = ?;

isolated function lookupProduct(
    record {|string productName;|} params
) returns json|error {
    return {
        "name": params.productName,
        "price": 29.99,
        "inStock": true,
        "category": "Electronics"
    };
}

public function main() returns error? {
    ai:ModelProvider model = check new anthropic:ModelProvider(
        anthropicApiKey,
        anthropic:CLAUDE_3_7_SONNET_20250219,
        "2023-06-01"
    );

    agent:Tool productTool = {
        name: "lookup_product",
        description: "Look up product details by name",
        parameters: {
            properties: {
                productName: {'type: agent:STRING, description: "Product name"}
            }
        },
        caller: lookupProduct
    };

    // The ai.agent framework works with any ai:ModelProvider
    // Use model with agent for tool-augmented conversations
    ai:ChatMessage[] messages = [
        {role: "user", content: "Tell me about the wireless charger product."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 4: Chat Service with Claude Backend

Expose Claude as an HTTP service.

```ballerina
import ballerina/http;
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

final ai:ModelProvider claudeModel = check new anthropic:ModelProvider(
    anthropicApiKey,
    anthropic:CLAUDE_3_5_HAIKU_20241022,
    "2023-06-01"
);

type ChatRequest record {|
    string message;
    string? systemPrompt;
|};

type ChatResponse record {|
    string reply;
|};

service /api on new http:Listener(8080) {

    resource function post chat(ChatRequest payload) returns ChatResponse|error {
        ai:ChatMessage[] messages = [];

        if payload.systemPrompt is string {
            messages.push({role: "system", content: <string>payload.systemPrompt});
        }

        messages.push({role: "user", content: payload.message});

        ai:ChatAssistantMessage response =
            check claudeModel->chat(messages, tools = []);

        string reply = response.content ?: "";
        return {reply};
    }
}
```

## Example 5: Error Handling

Production-ready error handling for Claude API calls.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new anthropic:ModelProvider(
        anthropicApiKey,
        anthropic:CLAUDE_3_7_SONNET_20250219,
        "2023-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Summarize the key principles of API design."}
    ];

    do {
        ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
        io:println(response.content);
    } on fail error e {
        log:printError("Claude API request failed", 'error = e);
        io:println("Failed to get response: ", e.message());
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration instructions
- [Actions Reference](actions) -- Full list of operations
