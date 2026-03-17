---
title: "AI Agent Framework - Actions"
description: "Available actions and operations for the ballerinax/ai.agent connector."
---

# AI Agent Framework Actions

The `ballerinax/ai.agent` module provides agent types, tool definitions, and LLM model abstractions for building AI agents that can reason and act on natural language instructions.

## Agent Types

### FunctionCallAgent

Uses the LLM's native function calling API for structured tool invocation. Recommended when using OpenAI GPT-4 or similar models with built-in function calling support.

```ballerina
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
agent:FunctionCallAgent fcAgent = check new (model, tool1, tool2, toolKit1);
```

### ReActAgent

Implements the ReAct (Reasoning + Acting) framework using prompt engineering. Works with any LLM that supports chat or text completion.

```ballerina
agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
agent:ReActAgent reactAgent = check new (model, tool1, tool2);
```

## Agent Operations

### run()

Execute a single query and get the final response. The agent iterates through the ReAct loop until it reaches a conclusion.

```ballerina
string response = check myAgent->run("What is the order status for #12345?");
```

### chat()

Execute a query with multi-turn conversation support. Maintains message history across calls.

```ballerina
// First turn
agent:ChatMessage[] history = [];
string response1 = check myAgent->chat("Find orders for customer Alice", history);

// Second turn (history is maintained)
string response2 = check myAgent->chat("Now filter by orders from last week", history);
```

## Tool Definition

### Function Tool

Define a tool backed by a Ballerina function. The function must be `isolated` for concurrency safety.

```ballerina
// The function must follow this signature pattern
isolated function calculateTotal(
    record {|decimal price; int quantity;|} params
) returns decimal|error {
    return params.price * <decimal>params.quantity;
}

agent:Tool calculatorTool = {
    name: "calculate_total",
    description: "Calculate the total price given unit price and quantity",
    parameters: {
        properties: {
            price: {
                'type: agent:NUMBER,
                description: "Unit price in USD"
            },
            quantity: {
                'type: agent:INTEGER,
                description: "Number of items"
            }
        }
    },
    caller: calculateTotal
};
```

### Input Schema Types

The following types are available for defining tool input schemas:

| Type | Constant | Description |
|------|----------|-------------|
| String | `agent:STRING` | Text input |
| Number | `agent:NUMBER` | Floating-point number |
| Integer | `agent:INTEGER` | Whole number |
| Boolean | `agent:BOOLEAN` | True/false value |
| Object | `agent:OBJECT` | Nested object with properties |
| Array | `agent:ARRAY` | List of values |

### HTTP Tool

Define a REST API endpoint as a tool:

```ballerina
agent:HttpTool createTicketTool = {
    name: "create_support_ticket",
    description: "Create a new customer support ticket",
    path: "/api/tickets",
    method: agent:POST,
    parameters: {
        "priority": {
            location: agent:QUERY,
            schema: {
                'type: agent:STRING,
                description: "Ticket priority: low, medium, high"
            }
        }
    },
    requestBody: {
        mediaType: "application/json",
        schema: {
            properties: {
                "title": {'type: agent:STRING, description: "Ticket title"},
                "description": {'type: agent:STRING, description: "Issue description"},
                "customer_email": {'type: agent:STRING, description: "Customer email"}
            }
        }
    }
};
```

### HTTP Method Constants

| Constant | HTTP Method |
|----------|-------------|
| `agent:GET` | GET |
| `agent:POST` | POST |
| `agent:PUT` | PUT |
| `agent:DELETE` | DELETE |
| `agent:PATCH` | PATCH |

## ToolKit

Group related HTTP tools that share the same service URL and client configuration:

```ballerina
agent:HttpTool listOrders = {
    name: "list_orders",
    description: "List all orders",
    path: "/orders",
    method: agent:GET
};

agent:HttpTool getOrder = {
    name: "get_order",
    description: "Get order by ID",
    path: "/orders/{orderId}",
    method: agent:GET,
    parameters: {
        "orderId": {
            location: agent:PATH,
            schema: {'type: agent:STRING}
        }
    }
};

agent:HttpServiceToolKit orderToolKit = check new (
    "https://api.example.com",
    [listOrders, getOrder],
    {},  // HTTP client configs
    {"Authorization": "Bearer <token>"}  // HTTP headers
);
```

## OpenAPI Tool Extraction

Automatically extract tools from an OpenAPI 3.x specification:

```ballerina
// From a file
string openApiPath = "./resources/petstore.json";
agent:HttpApiSpecification apiSpec =
    check agent:extractToolsFromOpenApiSpecFile(openApiPath);

string? serviceUrl = apiSpec.serviceUrl;
agent:HttpTool[] tools = apiSpec.tools;

// Create a toolkit from the extracted tools
agent:HttpServiceToolKit toolKit = check new (
    serviceUrl ?: "https://api.example.com",
    tools
);
```

## LLM Models

### Built-in Models

| Model Class | Provider | API Type |
|-------------|----------|----------|
| `agent:ChatGptModel` | OpenAI | Chat + Function Calling |
| `agent:AzureChatGptModel` | Azure OpenAI | Chat + Function Calling |
| `agent:Gpt3Model` | OpenAI | Completion only |
| `agent:AzureGpt3Model` | Azure OpenAI | Completion only |

### OpenAI ChatGPT Model

```ballerina
agent:ChatGptModel model = check new ({
    auth: {token: "<OPENAI_API_KEY>"}
});
```

### Azure OpenAI ChatGPT Model

```ballerina
agent:AzureChatGptModel model = check new (
    {auth: {apiKey: "<AZURE_API_KEY>"}},
    "https://<resource>.openai.azure.com",
    "<deployment-id>",
    "2024-06-01"
);
```

### Custom LLM Model

Extend the agent framework with a custom LLM by implementing the model interfaces:

```ballerina
isolated class CustomModel {
    *agent:ChatLlmModel;
    *agent:FunctionCallLlmModel;

    function init() returns error? {
        // Initialize connection to the custom LLM
    }

    public isolated function chatComplete(
        agent:ChatMessage[] messages, string? stop = ()
    ) returns string|agent:LlmError {
        // Call the chat API and return text content
        return "<response text>";
    }

    public isolated function functionCall(
        agent:ChatMessage[] messages,
        agent:ChatCompletionFunctions[] functions,
        string? stop
    ) returns string|agent:FunctionCall|agent:LlmError {
        // Call the function calling API
        return {name: "function_name", arguments: "{}"};
    }
}
```

## Error Handling

Agent operations return `error` on failure. Common error types:

```ballerina
do {
    string response = check myAgent->run("Process this order");
    io:println(response);
} on fail error e {
    io:println("Agent execution failed: ", e.message());
    // Common errors:
    // - LLM authentication failure
    // - Tool execution error
    // - Maximum iteration limit reached
    // - Invalid tool response format
}
```

## Related

- [Overview](overview) -- Agent architecture and concepts
- [Setup Guide](setup) -- Configuration and LLM provider setup
- [Examples](examples) -- Full agent examples
