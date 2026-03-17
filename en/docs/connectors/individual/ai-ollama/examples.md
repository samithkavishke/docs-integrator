---
title: "Ollama - Examples"
description: "Code examples for the ballerinax/ai.ollama connector."
---

# Ollama Examples

## Example 1: Basic Chat with Local Model

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.ollama;

public function main() returns error? {
    ai:ModelProvider model = check new ollama:ModelProvider("llama3.1");

    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain REST APIs in simple terms."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 2: Code Generation with CodeLlama

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.ollama;

public function main() returns error? {
    ai:ModelProvider model = check new ollama:ModelProvider("codellama");

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are a Ballerina code generator. Output only valid Ballerina code."},
        {role: "user", content: "Write a Ballerina function that calculates fibonacci numbers recursively."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 3: Multi-Turn Conversation

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.ollama;

public function main() returns error? {
    ai:ModelProvider model = check new ollama:ModelProvider("mistral");

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are a database expert."},
        {role: "user", content: "When should I use NoSQL over SQL?"}
    ];

    ai:ChatAssistantMessage r1 = check model->chat(messages, tools = []);
    messages.push(r1);
    io:println("Turn 1: ", r1.content);

    messages.push({role: "user", content: "Give me examples of each type."});
    ai:ChatAssistantMessage r2 = check model->chat(messages, tools = []);
    io:println("Turn 2: ", r2.content);
}
```

## Example 4: Local AI Service for Development

Run a local chat service backed by Ollama for development and testing.

```ballerina
import ballerina/http;
import ballerina/ai;
import ballerinax/ai.ollama;

final ai:ModelProvider localModel = check new ollama:ModelProvider("phi3");

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
            check localModel->chat(messages, tools = []);

        return {reply: response.content ?: ""};
    }
}
```

## Example 5: Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.ollama;

public function main() returns error? {
    do {
        ai:ModelProvider model = check new ollama:ModelProvider("llama3.1");

        ai:ChatMessage[] messages = [
            {role: "user", content: "Hello!"}
        ];

        ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
        io:println(response.content);
    } on fail error e {
        log:printError("Ollama request failed. Is the server running?", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Installation
- [Actions Reference](actions) -- Operations
