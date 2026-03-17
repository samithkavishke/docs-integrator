---
title: "OpenAI Chat - Examples"
description: "Code examples for the ballerinax/openai.chat connector."
---

# OpenAI Chat Examples

## Example 1: Basic Chat Completion

A simple question-and-answer interaction using GPT-4o-mini.

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "user",
                "content": "What is Ballerina programming language?"
            }
        ]
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);

    string? content = response.choices[0].message.content;
    io:println(content ?: "No response received.");
}
```

## Example 2: Multi-Turn Conversation with System Prompt

Maintain conversation context across multiple exchanges by accumulating messages.

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

public function main() returns error? {
    // Build a conversation with history
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o",
        messages: [
            {
                "role": "system",
                "content": "You are a senior integration architect. Provide concise, technical answers about enterprise integration patterns."
            },
            {
                "role": "user",
                "content": "What is the scatter-gather pattern?"
            },
            {
                "role": "assistant",
                "content": "The scatter-gather pattern broadcasts a request to multiple recipients and re-aggregates the responses into a single unified message."
            },
            {
                "role": "user",
                "content": "How would I implement this in a Ballerina service?"
            }
        ],
        temperature: 0.7,
        max_tokens: 500
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);

    io:println(response.choices[0].message.content);

    // Track token usage
    chat:CompletionUsage? usage = response.usage;
    if usage is chat:CompletionUsage {
        io:println("Tokens used: ", usage.total_tokens);
    }
}
```

## Example 3: Function Calling for Data Extraction

Use function calling to extract structured data from natural language input. The model determines which function to call and generates the required arguments.

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

public function main() returns error? {
    // Define the tool (function) the model can call
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o",
        messages: [
            {
                "role": "user",
                "content": "Create an order for 3 laptops at $999 each for customer John Smith, email john@example.com"
            }
        ],
        tools: [
            {
                "type": "function",
                "function": {
                    "name": "create_order",
                    "description": "Create a new product order",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "customer_name": {
                                "type": "string",
                                "description": "Full name of the customer"
                            },
                            "customer_email": {
                                "type": "string",
                                "description": "Customer email address"
                            },
                            "product": {
                                "type": "string",
                                "description": "Product name"
                            },
                            "quantity": {
                                "type": "integer",
                                "description": "Number of items"
                            },
                            "unit_price": {
                                "type": "number",
                                "description": "Price per unit in USD"
                            }
                        },
                        "required": [
                            "customer_name",
                            "customer_email",
                            "product",
                            "quantity",
                            "unit_price"
                        ]
                    }
                }
            }
        ],
        tool_choice: "auto"
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);

    chat:ChatCompletionResponseMessage msg = response.choices[0].message;

    // Process the tool call
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

## Example 4: Chat-Powered HTTP Service

Expose a chat completion endpoint as a RESTful service.

```ballerina
import ballerina/http;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

type ChatRequest record {|
    string message;
    string? systemPrompt;
|};

type ChatResponse record {|
    string reply;
    int tokensUsed;
|};

service /api on new http:Listener(8080) {

    resource function post chat(ChatRequest payload) returns ChatResponse|error {
        string systemContent = payload.systemPrompt
            ?: "You are a helpful assistant.";

        chat:CreateChatCompletionRequest request = {
            model: "gpt-4o-mini",
            messages: [
                {"role": "system", "content": systemContent},
                {"role": "user", "content": payload.message}
            ],
            temperature: 0.7,
            max_tokens: 1024
        };

        chat:CreateChatCompletionResponse response =
            check openAIChat->/chat/completions.post(request);

        string reply = response.choices[0].message.content ?: "";
        int tokensUsed = response.usage?.total_tokens ?: 0;

        return {reply, tokensUsed};
    }
}
```

## Example 5: JSON Mode for Structured Output

Force the model to return valid JSON, useful for downstream parsing in integration pipelines.

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

type ProductInfo record {|
    string name;
    string category;
    decimal price;
    string[] features;
|};

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "system",
                "content": "You are a product catalog assistant. Always respond with valid JSON."
            },
            {
                "role": "user",
                "content": "Describe a wireless bluetooth headphone product with noise cancelling, 30-hour battery life, priced at $79.99"
            }
        ],
        response_format: {"type": "json_object"}
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);

    string? jsonContent = response.choices[0].message.content;
    io:println("Structured response: ", jsonContent);
}
```

## Example 6: Vision -- Analyzing Images

Use GPT-4o to analyze images provided via URL.

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o",
        messages: [
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Describe the architecture diagram in this image. List all components and their connections."
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": "https://example.com/architecture-diagram.png",
                            "detail": "high"
                        }
                    }
                ]
            }
        ],
        max_tokens: 1000
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);

    io:println(response.choices[0].message.content);
}
```

## Example 7: Error Handling and Retry Logic

Production-ready pattern with error handling and retry logic.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

function chatWithRetry(string userMessage, int maxRetries = 3) returns string|error {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {"role": "user", "content": userMessage}
        ],
        max_tokens: 512
    };

    int attempt = 0;
    while attempt < maxRetries {
        do {
            chat:CreateChatCompletionResponse response =
                check openAIChat->/chat/completions.post(request);
            return response.choices[0].message.content ?: "";
        } on fail error e {
            attempt += 1;
            io:println("Attempt ", attempt, " failed: ", e.message());
            if attempt < maxRetries {
                // Exponential backoff
                runtime:sleep(attempt * 2);
            }
        }
    }

    return error("Failed after maximum retries.");
}

public function main() returns error? {
    string response = check chatWithRetry("Summarize REST vs SOAP in two sentences.");
    io:println(response);
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration instructions
- [Actions Reference](actions) -- Full list of operations
