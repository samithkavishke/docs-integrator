---
title: "Azure OpenAI Chat - Actions"
description: "Available actions and operations for the ballerinax/azure.openai.chat connector."
---

# Azure OpenAI Chat Actions

The `ballerinax/azure.openai.chat` connector exposes the Azure OpenAI Chat Completions API through a resource-based client interface. The key difference from the direct OpenAI connector is that requests are routed through Azure deployment endpoints and require an API version parameter.

## Client Initialization

### With API Key

```ballerina
import ballerinax/azure.openai.chat;

configurable string apiKey = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        apiKey
    }
}, serviceUrl);
```

### With Azure AD Token

```ballerina
import ballerinax/azure.openai.chat;

configurable string token = ?;
configurable string serviceUrl = ?;
configurable string deploymentId = ?;

final chat:Client azureOpenAI = check new ({
    auth: {
        token
    }
}, serviceUrl);
```

## Create Chat Completion

The primary operation for generating chat responses through your Azure OpenAI deployment.

**Resource path:** `POST /deployments/{deploymentId}/chat/completions`

```ballerina
chat:CreateChatCompletionRequest request = {
    messages: [
        {
            "role": "system",
            "content": "You are a helpful enterprise assistant."
        },
        {
            "role": "user",
            "content": "Summarize the key benefits of microservices."
        }
    ]
};

chat:CreateChatCompletionResponse response =
    check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
        "2024-06-01", request
    );
```

:::info
Note that the `model` field is not required in the request body for Azure OpenAI, since the model is determined by the deployment. The API version string (e.g., `"2024-06-01"`) is passed as the first argument.
:::

### Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `api-version` | `string` | Yes | Azure API version (e.g., `2024-06-01`) |
| `messages` | `ChatCompletionRequestMessage[]` | Yes | Conversation message history |
| `temperature` | `float` | No | Sampling temperature between 0 and 2. Default: 1 |
| `top_p` | `float` | No | Nucleus sampling threshold. Default: 1 |
| `max_tokens` | `int` | No | Maximum tokens to generate |
| `n` | `int` | No | Number of completions to generate. Default: 1 |
| `stop` | `string` or `string[]` | No | Stop sequences |
| `presence_penalty` | `float` | No | Penalty for new topics (-2.0 to 2.0). Default: 0 |
| `frequency_penalty` | `float` | No | Penalty for repeated tokens (-2.0 to 2.0). Default: 0 |
| `response_format` | `record` | No | Output format (e.g., JSON mode) |
| `tools` | `ChatCompletionTool[]` | No | Tool definitions for function calling |
| `tool_choice` | `string` or `record` | No | Controls function selection behavior |
| `seed` | `int` | No | Seed for deterministic sampling |

### Response Structure

The response follows the same structure as the OpenAI connector:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique completion identifier |
| `choices` | `Choice[]` | Array of generated completion choices |
| `created` | `int` | Unix timestamp of creation |
| `model` | `string` | The model used (reflects the deployment's model) |
| `usage` | `CompletionUsage` | Token usage statistics |

### API Versions

Azure OpenAI uses versioned APIs. Common versions include:

| Version | Status | Notes |
|---------|--------|-------|
| `2024-06-01` | GA | Recommended for production |
| `2024-02-15-preview` | Preview | Early access to new features |
| `2023-12-01-preview` | Preview | Legacy preview |

## Function Calling

Define tools for structured data extraction and external system integration:

```ballerina
chat:CreateChatCompletionRequest request = {
    messages: [
        {
            "role": "user",
            "content": "Look up customer order #12345"
        }
    ],
    tools: [
        {
            "type": "function",
            "function": {
                "name": "lookup_order",
                "description": "Look up a customer order by order ID",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "order_id": {
                            "type": "string",
                            "description": "The order identifier"
                        }
                    },
                    "required": ["order_id"]
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
```

## JSON Mode

Force structured JSON output:

```ballerina
chat:CreateChatCompletionRequest request = {
    messages: [
        {
            "role": "system",
            "content": "You output only valid JSON."
        },
        {
            "role": "user",
            "content": "List 3 Azure services with their categories."
        }
    ],
    response_format: {"type": "json_object"}
};
```

## Content Filtering

Azure OpenAI includes built-in content filtering. If a request or response triggers the content filter, the API returns a specific error. Handle content filter results in your error handling logic:

```ballerina
do {
    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );
    io:println(response.choices[0].message.content);
} on fail error e {
    // Content filter violations return specific error codes
    io:println("Error: ", e.message());
}
```

## Error Handling

All operations return `error` on failure. Common Azure-specific errors:

```ballerina
do {
    chat:CreateChatCompletionResponse response =
        check azureOpenAI->/deployments/[deploymentId]/chat/completions.post(
            "2024-06-01", request
        );
    io:println(response.choices[0].message.content);
} on fail error e {
    io:println("Operation failed: ", e.message());
    // Common errors:
    // - 401: Invalid API key or token
    // - 404: Deployment not found
    // - 429: Rate limit exceeded (throttled)
    // - 400: Content filter triggered
}
```

## Related

- [Overview](overview) -- Connector overview and comparison with OpenAI direct
- [Setup Guide](setup) -- Azure resource creation and configuration
- [Examples](examples) -- Full code examples
