---
title: "Deepseek - Examples"
description: "Code examples for the ballerinax/ai.deepseek connector."
---

# DeepSeek Examples

## Example 1: Basic Chat Completion

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new deepseek:ModelProvider(deepseekApiKey);

    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain the publish-subscribe pattern."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 2: Code Generation

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new deepseek:ModelProvider(deepseekApiKey);

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are a Ballerina code expert. Output only valid Ballerina code."},
        {role: "user", content: "Write a Ballerina function that validates email addresses using regex."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 3: Chat Service with DeepSeek Backend

```ballerina
import ballerina/http;
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

final ai:ModelProvider deepseekModel = check new deepseek:ModelProvider(deepseekApiKey);

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
            check deepseekModel->chat(messages, tools = []);

        return {reply: response.content ?: ""};
    }
}
```

## Example 4: Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new deepseek:ModelProvider(deepseekApiKey);

    ai:ChatMessage[] messages = [
        {role: "user", content: "Summarize API gateway patterns."}
    ];

    do {
        ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
        io:println(response.content);
    } on fail error e {
        log:printError("DeepSeek request failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
