---
title: "Azure OpenAI (LLM Provider) - Examples"
description: "Code examples for the ballerinax/ai.azure connector."
---

# Azure OpenAI LLM Provider Examples

## Example 1: Basic Chat Completion

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

public function main() returns error? {
    ai:ModelProvider model = check new azure:OpenAiModelProvider(
        azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Explain Azure Functions in 3 sentences."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println(response.content);
}
```

## Example 2: Multi-Turn Conversation

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

public function main() returns error? {
    ai:ModelProvider model = check new azure:OpenAiModelProvider(
        azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "system", content: "You are a cloud infrastructure expert."},
        {role: "user", content: "What is Azure Kubernetes Service?"}
    ];

    ai:ChatAssistantMessage r1 = check model->chat(messages, tools = []);
    messages.push(r1);
    io:println("Turn 1: ", r1.content);

    messages.push({role: "user", content: "How does autoscaling work?"});
    ai:ChatAssistantMessage r2 = check model->chat(messages, tools = []);
    io:println("Turn 2: ", r2.content);
}
```

## Example 3: Azure OpenAI as HTTP Service

```ballerina
import ballerina/http;
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

final ai:ModelProvider azureModel = check new azure:OpenAiModelProvider(
    azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
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
            check azureModel->chat(messages, tools = []);

        return {reply: response.content ?: ""};
    }
}
```

## Example 4: Error Handling

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/ai;
import ballerinax/ai.azure;

configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;

public function main() returns error? {
    ai:ModelProvider model = check new azure:OpenAiModelProvider(
        azureServiceUrl, azureApiKey, azureDeploymentId, "2024-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Summarize Azure networking options."}
    ];

    do {
        ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
        io:println(response.content);
    } on fail error e {
        log:printError("Azure OpenAI request failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Actions Reference](actions) -- Operations
