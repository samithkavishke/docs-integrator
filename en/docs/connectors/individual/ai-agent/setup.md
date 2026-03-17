---
title: "AI Agent Framework - Setup"
description: "How to set up and configure the ballerinax/ai.agent connector."
---

# AI Agent Framework Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An LLM provider API key (OpenAI, Azure OpenAI, or another supported provider)

## Step 1: Install the Module

Add the import to your Ballerina file:

```ballerina
import ballerinax/ai.agent;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "ai.agent"
version = "0.9.2"
```

## Step 2: Choose an LLM Provider

The agent framework supports multiple LLM providers. You need an API key from at least one provider.

### Option A: OpenAI

1. Create an [OpenAI account](https://platform.openai.com/signup).
2. Obtain an API key from the [API keys dashboard](https://platform.openai.com/api-keys).

```ballerina
agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
```

### Option B: Azure OpenAI

1. Create an [Azure OpenAI resource](https://learn.microsoft.com/en-us/azure/cognitive-services/openai/how-to/create-resource).
2. Deploy a model and obtain the API key, endpoint URL, and deployment ID.

```ballerina
agent:AzureChatGptModel model = check new (
    {auth: {apiKey: azureApiKey}},
    serviceUrl,
    deploymentId,
    apiVersion
);
```

### Option C: Custom LLM Provider

You can extend the agent framework with any LLM by implementing the `ChatLlmModel` and `FunctionCallLlmModel` interfaces.

## Step 3: Configure Credentials

Create a `Config.toml` file in your project root:

### For OpenAI

```toml
# Config.toml
openAiApiKey = "<your-openai-api-key>"
```

```ballerina
configurable string openAiApiKey = ?;
```

### For Azure OpenAI

```toml
# Config.toml
azureApiKey = "<your-azure-openai-api-key>"
azureServiceUrl = "https://<resource>.openai.azure.com"
azureDeploymentId = "<your-deployment-name>"
azureApiVersion = "2024-06-01"
```

```ballerina
configurable string azureApiKey = ?;
configurable string azureServiceUrl = ?;
configurable string azureDeploymentId = ?;
configurable string azureApiVersion = ?;
```

## Step 4: Define Tools

Tools are the actions your agent can perform. There are three ways to define tools.

### Ballerina Functions as Tools

Define isolated functions that the agent can call:

```ballerina
isolated function searchDatabase(record {|string query;|} params) returns json|error {
    // Database search implementation
    return {"results": ["item1", "item2"]};
}

agent:Tool searchTool = {
    name: "search_database",
    description: "Search the product database by keyword",
    parameters: {
        properties: {
            query: {'type: agent:STRING, description: "Search keyword"}
        }
    },
    caller: searchDatabase
};
```

### HTTP API Resources as Tools

Define REST API endpoints as tools:

```ballerina
agent:HttpTool getOrderTool = {
    name: "get_order",
    description: "Retrieve order details by order ID",
    path: "/orders/{orderId}",
    method: agent:GET,
    parameters: {
        "orderId": {
            location: agent:PATH,
            schema: {'type: agent:STRING}
        }
    }
};
```

### Auto-Extract from OpenAPI Specs

Load tools automatically from an OpenAPI specification file:

```ballerina
string specPath = "./resources/openapi.json";
agent:HttpApiSpecification apiSpec =
    check agent:extractToolsFromOpenApiSpecFile(specPath);
agent:HttpTool[] tools = apiSpec.tools;
```

## Step 5: Verify the Setup

Test your agent with a simple query:

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

isolated function greet(record {|string name;|} params) returns string|error {
    return "Hello, " + params.name + "!";
}

public function main() returns error? {
    agent:Tool greetTool = {
        name: "greet",
        description: "Greet a person by name",
        parameters: {
            properties: {
                name: {'type: agent:STRING, description: "Person's name"}
            }
        },
        caller: greet
    };

    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:FunctionCallAgent myAgent = check new (model, greetTool);

    string response = check myAgent->run("Say hello to Alice");
    io:println(response);
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `LLM authentication error` | Verify your API key in `Config.toml` |
| `Tool not found by agent` | Check the tool name and description are clear and descriptive |
| `Agent loop timeout` | The agent may need more iterations; increase the iteration limit |
| `Function not isolated` | Tool functions must be declared as `isolated` |
| `OpenAPI parse error` | Ensure the OpenAPI spec is valid JSON or YAML (3.x format) |

## Next Steps

- [Actions Reference](actions) -- Learn about agent types and tool definitions
- [Examples](examples) -- See production-ready agent examples
