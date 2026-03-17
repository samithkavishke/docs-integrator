---
title: "Mistral AI - Examples"
description: "Code examples for the ballerinax/ai.mistral connector."
---

# Mistral AI Examples

## Example 1: Basic Chat Completion

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new mistral:ModelProvider(
        mistralApiKey, mistral:MINISTRAL_3B_2410
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain the scatter-gather integration pattern."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 2: Code Generation with Codestral

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new mistral:ModelProvider(
        mistralApiKey, mistral:CODESTRAL_LATEST
    );

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are a Ballerina code expert. Output only valid Ballerina code."},
        {role: "user", content: "Write a function that retries an HTTP call with exponential backoff."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 3: Multi-Turn Conversation

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new mistral:ModelProvider(
        mistralApiKey, mistral:MISTRAL_SMALL_LATEST
    );

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are an enterprise integration expert."},
        {role: "user", content: "What is an API gateway?"}
    ];

    ai:ChatAssistantMessage r1 = check model->chat(messages, tools = []);
    messages.push(r1);
    io:println("Turn 1: ", r1.content);

    messages.push({role: "user", content: "What security features should it provide?"});
    ai:ChatAssistantMessage r2 = check model->chat(messages, tools = []);
    io:println("Turn 2: ", r2.content);
}
```

## Example 4: Chat Service

```ballerina
import ballerina/http;
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

final ai:ModelProvider mistralModel = check new mistral:ModelProvider(
    mistralApiKey, mistral:MINISTRAL_3B_2410
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
            check mistralModel->chat(messages, tools = []);

        return {reply: response.content ?: ""};
    }
}
```

## Example 5: Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new mistral:ModelProvider(
        mistralApiKey, mistral:MINISTRAL_3B_2410
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "List common API design patterns."}
    ];

    do {
        ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
        io:println(response.content);
    } on fail error e {
        log:printError("Mistral request failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
