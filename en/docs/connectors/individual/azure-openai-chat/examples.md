---
title: "Azure OpenAI Chat - Examples"
description: "Code examples for the ballerinax/azure.openai.chat connector."
---

# Azure OpenAI Chat Examples

## Example 1: Basic Chat Completion

A simple chat completion using your Azure OpenAI deployment.

```ballerina
import ballerina/io;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        messages: [
            {
                "role": "user",
                "content": "What is Azure OpenAI Service and how does it differ from OpenAI?"
            }
        ]
    };

    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );

    string? content = response.choices[0].message.content;
    io:println(content ?: "No response received.");
}
```

## Example 2: Multi-Turn Conversation with System Prompt

Maintain context across exchanges using Azure OpenAI.

```ballerina
import ballerina/io;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        messages: [
            {
                "role": "system",
                "content": "You are a cloud architecture advisor specializing in Azure services. Provide concise, actionable recommendations."
            },
            {
                "role": "user",
                "content": "I need to build a real-time data pipeline."
            },
            {
                "role": "assistant",
                "content": "For a real-time data pipeline on Azure, consider Event Hubs for ingestion, Stream Analytics for processing, and Cosmos DB or Synapse for storage."
            },
            {
                "role": "user",
                "content": "How would I add AI-powered anomaly detection to this pipeline?"
            }
        ],
        temperature: 0.7,
        max_tokens: 600
    };

    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );

    io:println(response.choices[0].message.content);
}
```

## Example 3: Function Calling with Azure OpenAI

Use function calling to extract structured data and integrate with backend systems.

```ballerina
import ballerina/io;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        messages: [
            {
                "role": "user",
                "content": "Schedule a meeting with the engineering team next Tuesday at 2pm for 1 hour about Q3 planning"
            }
        ],
        tools: [
            {
                "type": "function",
                "function": {
                    "name": "schedule_meeting",
                    "description": "Schedule a calendar meeting",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "title": {
                                "type": "string",
                                "description": "Meeting title"
                            },
                            "attendees": {
                                "type": "string",
                                "description": "Team or attendee names"
                            },
                            "date": {
                                "type": "string",
                                "description": "Date in ISO format"
                            },
                            "time": {
                                "type": "string",
                                "description": "Time in HH:MM format"
                            },
                            "duration_minutes": {
                                "type": "integer",
                                "description": "Duration in minutes"
                            }
                        },
                        "required": ["title", "date", "time", "duration_minutes"]
                    }
                }
            }
        ],
        tool_choice: "auto"
    };

    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );

    chat:ChatCompletionResponseMessage msg = response.choices[0].message;

    if msg.tool_calls is chat:ChatCompletionMessageToolCall[] {
        chat:ChatCompletionMessageToolCall[] toolCalls =
            <chat:ChatCompletionMessageToolCall[]>msg.tool_calls;
        foreach chat:ChatCompletionMessageToolCall toolCall in toolCalls {
            io:println("Function: ", toolCall.function.name);
            io:println("Arguments: ", toolCall.function.arguments);
        }
    }
}
```

## Example 4: Chat Service with Azure OpenAI Backend

Expose Azure OpenAI as an HTTP service endpoint.

```ballerina
import ballerina/http;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

type ChatRequest record {|
    string message;
    string? context;
|};

type ChatResponse record {|
    string reply;
    int tokensUsed;
|};

service /api on new http:Listener(8080) {

    resource function post chat(ChatRequest payload) returns ChatResponse|error {
        string systemPrompt = payload.context
            ?: "You are a helpful enterprise assistant.";

        chat:CreateChatCompletionRequest request = {
            messages: [
                {"role": "system", "content": systemPrompt},
                {"role": "user", "content": payload.message}
            ],
            temperature: 0.7,
            max_tokens: 1024
        };

        chat:CreateChatCompletionResponse response =
            check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
                "2024-06-01", request
            );

        string reply = response.choices[0].message.content ?: "";
        int tokensUsed = response.usage?.total_tokens ?: 0;

        return {reply, tokensUsed};
    }
}
```

## Example 5: Error Handling with Content Filtering

Handle Azure-specific content filtering and error scenarios.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        messages: [
            {"role": "user", "content": "Provide a summary of cloud security best practices."}
        ],
        max_tokens: 500
    };

    do {
        chat:CreateChatCompletionResponse response =
            check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
                "2024-06-01", request
            );

        string? content = response.choices[0].message.content;
        string finishReason = response.choices[0].finish_reason ?: "unknown";

        if finishReason == "content_filter" {
            log:printWarn("Response was filtered by Azure content safety.");
        }

        io:println(content ?: "No content returned.");

        // Log token usage for cost tracking
        chat:CompletionUsage? usage = response.usage;
        if usage is chat:CompletionUsage {
            log:printInfo("Token usage",
                prompt = usage.prompt_tokens,
                completion = usage.completion_tokens,
                total = usage.total_tokens
            );
        }
    } on fail error e {
        log:printError("Azure OpenAI request failed", 'error = e);
    }
}
```

## Example 6: JSON Mode for Structured Output

Force structured JSON responses for integration pipelines.

```ballerina
import ballerina/io;
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        messages: [
            {
                "role": "system",
                "content": "You are a data extraction assistant. Always respond with valid JSON."
            },
            {
                "role": "user",
                "content": "Extract the key details: Invoice #INV-2024-001 from Contoso Ltd for $15,750.00 dated March 15, 2024, due April 14, 2024."
            }
        ],
        response_format: {"type": "json_object"}
    };

    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );

    io:println("Extracted data: ", response.choices[0].message.content);
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Azure resource configuration
- [Actions Reference](actions) -- Full list of operations
