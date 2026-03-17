---
title: "OpenAI (LLM Provider) - Examples"
description: "Code examples for the ballerinax/ai.openai connector."
---

# OpenAI LLM Provider Examples

## Example 1: Basic Chat Completion

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain the publish-subscribe pattern in 3 sentences."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 2: Multi-Turn Conversation

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are an API design expert."},
        {role: "user", content: "What are REST API best practices?"}
    ];

    ai:ChatAssistantMessage response1 = check model->chat(messages, tools = []);
    messages.push(response1);
    io:println("Turn 1: ", response1.content);

    messages.push({role: "user", content: "How should I handle versioning?"});
    ai:ChatAssistantMessage response2 = check model->chat(messages, tools = []);
    io:println("Turn 2: ", response2.content);
}
```

## Example 3: Chat Service with OpenAI Backend

```ballerina
import ballerina/http;
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider openAiModel = check new openai:ModelProvider(
    openAiApiKey, modelType = openai:GPT_4O_MINI
);

type ChatRequest record {|
    string message;
|};

type ChatResponse record {|
    string reply;
|};

service /api on new http:Listener(8080) {

    resource function post chat(ChatRequest payload) returns ChatResponse|error {
        ai:ChatMessage[] messages = [
            {role: "user", content: payload.message}
        ];

        ai:ChatAssistantMessage response =
            check openAiModel->chat(messages, tools = []);

        string reply = response.content ?: "";
        return {reply};
    }
}
```

## Example 4: Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Summarize data integration patterns."}
    ];

    do {
        ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
        io:println(response.content);
    } on fail error e {
        log:printError("OpenAI request failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
