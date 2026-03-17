---
title: "OpenAI Chat - Actions"
description: "Available actions and operations for the ballerinax/openai.chat connector."
---

# OpenAI Chat Actions

The `ballerinax/openai.chat` connector exposes the OpenAI Chat Completions API through a resource-based client interface. All operations are accessed via the `chat:Client`.

## Client Initialization

```ballerina
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});
```

## Create Chat Completion

The primary operation for generating chat responses. Sends a list of messages and returns a model-generated response.

**Resource path:** `POST /chat/completions`

```ballerina
chat:CreateChatCompletionRequest request = {
    model: "gpt-4o-mini",
    messages: [
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Explain microservices architecture."
        }
    ]
};

chat:CreateChatCompletionResponse response =
    check openAIChat->/chat/completions.post(request);
```

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `model` | `string` | Yes | Model ID to use (e.g., `gpt-4o`, `gpt-4o-mini`, `gpt-3.5-turbo`) |
| `messages` | `ChatCompletionRequestMessage[]` | Yes | List of messages in the conversation |
| `temperature` | `float` | No | Sampling temperature between 0 and 2. Lower values are more deterministic. Default: 1 |
| `top_p` | `float` | No | Nucleus sampling threshold. Default: 1 |
| `max_tokens` | `int` | No | Maximum number of tokens to generate |
| `n` | `int` | No | Number of completions to generate. Default: 1 |
| `stop` | `string` or `string[]` | No | Sequences where the model will stop generating |
| `presence_penalty` | `float` | No | Penalty for new topics, between -2.0 and 2.0. Default: 0 |
| `frequency_penalty` | `float` | No | Penalty for repeated tokens, between -2.0 and 2.0. Default: 0 |
| `response_format` | `record` | No | Format specification (e.g., JSON mode) |
| `seed` | `int` | No | Seed for deterministic sampling |
| `tools` | `ChatCompletionTool[]` | No | List of tools (functions) the model can call |
| `tool_choice` | `string` or `record` | No | Controls which function is called |

### Response Structure

The `CreateChatCompletionResponse` includes:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier for the completion |
| `choices` | `Choice[]` | Array of completion choices |
| `created` | `int` | Unix timestamp of creation |
| `model` | `string` | Model used for completion |
| `usage` | `CompletionUsage` | Token usage statistics |

Each `Choice` contains:

| Field | Type | Description |
|-------|------|-------------|
| `message` | `ChatCompletionResponseMessage` | The generated message |
| `finish_reason` | `string` | Why the model stopped: `stop`, `length`, `tool_calls`, or `content_filter` |
| `index` | `int` | Index of the choice |

## Message Roles

Messages use the following roles:

| Role | Description |
|------|-------------|
| `system` | Sets the behavior and persona of the assistant |
| `user` | Messages from the end user |
| `assistant` | Previous responses from the model |
| `tool` | Results from tool/function calls |

```ballerina
chat:CreateChatCompletionRequest request = {
    model: "gpt-4o",
    messages: [
        {"role": "system", "content": "You are a concise technical writer."},
        {"role": "user", "content": "What is REST?"},
        {"role": "assistant", "content": "REST is an architectural style for APIs..."},
        {"role": "user", "content": "How does it compare to GraphQL?"}
    ]
};
```

## Function Calling (Tools)

Define tools that the model can invoke to interact with external systems.

### Defining Tools

```ballerina
chat:CreateChatCompletionRequest request = {
    model: "gpt-4o",
    messages: [
        {"role": "user", "content": "What is the weather in London?"}
    ],
    tools: [
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather for a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City name, e.g., London, UK"
                        },
                        "unit": {
                            "type": "string",
                            "enum": ["celsius", "fahrenheit"]
                        }
                    },
                    "required": ["location"]
                }
            }
        }
    ],
    tool_choice: "auto"
};
```

### Processing Tool Calls

```ballerina
chat:CreateChatCompletionResponse response =
    check openAIChat->/chat/completions.post(request);

chat:ChatCompletionResponseMessage msg = response.choices[0].message;

// Check if the model wants to call a function
if msg.tool_calls is chat:ChatCompletionMessageToolCall[] {
    chat:ChatCompletionMessageToolCall[] toolCalls = <chat:ChatCompletionMessageToolCall[]>msg.tool_calls;
    foreach chat:ChatCompletionMessageToolCall toolCall in toolCalls {
        string functionName = toolCall.function.name;
        string arguments = toolCall.function.arguments;
        // Execute the function and return results
    }
}
```

## JSON Mode

Force the model to output valid JSON:

```ballerina
chat:CreateChatCompletionRequest request = {
    model: "gpt-4o-mini",
    messages: [
        {
            "role": "system",
            "content": "Output valid JSON only."
        },
        {
            "role": "user",
            "content": "List 3 programming languages with their paradigms."
        }
    ],
    response_format: {"type": "json_object"}
};
```

## Vision (Image Input)

Send images for analysis with vision-capable models:

```ballerina
chat:CreateChatCompletionRequest request = {
    model: "gpt-4o",
    messages: [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": "Describe what you see in this image."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/image.png"
                    }
                }
            ]
        }
    ]
};
```

## Token Usage Tracking

Monitor token consumption from the response:

```ballerina
chat:CreateChatCompletionResponse response =
    check openAIChat->/chat/completions.post(request);

chat:CompletionUsage? usage = response.usage;
if usage is chat:CompletionUsage {
    io:println("Prompt tokens: ", usage.prompt_tokens);
    io:println("Completion tokens: ", usage.completion_tokens);
    io:println("Total tokens: ", usage.total_tokens);
}
```

## Error Handling

All operations return `error` on failure. Use `check` for propagation or `do/on fail` for explicit handling:

```ballerina
do {
    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);
    io:println(response.choices[0].message.content);
} on fail error e {
    io:println("Error code: ", e.message());
    // Handle specific error types:
    // - 401: Invalid API key
    // - 429: Rate limit exceeded
    // - 500: OpenAI server error
}
```

## Related

- [Overview](overview) -- Connector overview and supported models
- [Setup Guide](setup) -- Configuration instructions
- [Examples](examples) -- Full code examples
- [API Reference](https://central.ballerina.io/ballerinax/openai.chat/latest) -- Complete API docs
