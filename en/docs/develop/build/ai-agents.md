---
sidebar_position: 5
title: AI Agents & Natural Functions
description: Build intelligent agents powered by LLMs with tool calling and memory.
---

# AI Agents & Natural Functions

Build intelligent integrations that use large language models (LLMs) for reasoning, tool calling, and conversation. The `ballerinax/ai.agent` package provides the foundation for creating AI-powered agents in WSO2 Integrator.

## Agent Architecture Overview

An agent consists of three key components:

1. **Model** -- The LLM that provides reasoning (OpenAI, Anthropic, Azure OpenAI, Mistral, or Ollama).
2. **Tools** -- Functions the agent can invoke to interact with external systems.
3. **Memory** -- Conversation history that provides context across interactions.

The agent receives a natural language query, reasons about which tools to call, executes them, observes the results, and repeats until it can provide a final answer.

## Creating Agents

### Function Calling Agent

The function calling agent leverages the LLM's native function calling API for tool selection.

```ballerina
import ballerinax/ai.agent;
import ballerina/http;

configurable string openAiKey = ?;

agent:OpenAiModel model = check new ({
    auth: {token: openAiKey},
    modelType: agent:GPT_4O
});

agent:FunctionCallAgent myAgent = check new (model, ...getTools());

service /agent on new http:Listener(8090) {

    resource function post chat(@http:Payload ChatRequest req) returns ChatResponse|error {
        agent:ExecutionResult result = check agent:run(myAgent, req.message, maxIter = 10);
        return {answer: result.answer};
    }
}
```

### ReAct Agent

The ReAct agent uses a reasoning-observation loop. It works with models that may not support native function calling.

```ballerina
agent:OpenAiModel model = check new ({
    auth: {token: openAiKey},
    modelType: agent:GPT_4O,
    temperature: 0.0
});

agent:ReActAgent reasoningAgent = check new (model, ...getTools());
```

## Model Configuration

Configure different LLM providers based on your requirements.

```ballerina
// OpenAI
agent:OpenAiModel openai = check new ({
    auth: {token: openAiKey},
    modelType: agent:GPT_4O,
    maxTokens: 2048,
    temperature: 0.7
});

// Azure OpenAI
agent:AzureOpenAiModel azure = check new ({
    auth: {apiKey: azureKey},
    serviceUrl: "https://myinstance.openai.azure.com",
    deploymentId: "gpt-4o",
    apiVersion: "2024-02-01"
});

// Anthropic Claude
agent:AnthropicModel claude = check new ({
    auth: {token: anthropicKey},
    modelType: agent:CLAUDE_3_5_SONNET
});
```

## Tools and Function Calling

### Defining Function Tools

Tools are isolated functions that the agent can invoke. Each tool has a name, description, and typed parameters.

```ballerina
isolated function getWeather(record {|string city; string unit?;|} input)
        returns string|error {
    http:Client weatherApi = check new ("https://api.weather.example.com");
    json result = check weatherApi->get("/current?city=" + input.city);
    return result.toJsonString();
}

isolated function searchDatabase(record {|string query; int 'limit?;|} input)
        returns string|error {
    // Query the database and return results
    json[] results = check db->queryRows(input.query, input.'limit ?: 10);
    return results.toJsonString();
}

agent:Tool weatherTool = {
    name: "GetWeather",
    description: "Get current weather for a city",
    parameters: {
        properties: {
            city: {'type: agent:STRING, description: "City name"},
            unit: {'type: agent:STRING, description: "Temperature unit (celsius or fahrenheit)"}
        },
        required: ["city"]
    },
    caller: getWeather
};

agent:Tool dbTool = {
    name: "SearchDatabase",
    description: "Search the customer database",
    parameters: {
        properties: {
            query: {'type: agent:STRING, description: "Search query"},
            'limit: {'type: agent:INTEGER, description: "Max results to return"}
        },
        required: ["query"]
    },
    caller: searchDatabase
};

function getTools() returns agent:Tool[] {
    return [weatherTool, dbTool];
}
```

### HTTP Tools

Expose REST API endpoints directly as agent tools without writing wrapper functions.

```ballerina
agent:HttpTool listOrders = {
    name: "ListOrders",
    path: "/api/orders",
    method: agent:GET,
    description: "List recent orders for a customer",
    parameters: {
        customerId: {
            location: agent:QUERY,
            schema: {'type: agent:STRING, description: "Customer ID"}
        }
    }
};
```

## Configuring Agent Memory

Memory allows agents to maintain context across multiple interactions in a conversation.

```ballerina
// Create a memory instance with a window of 20 messages
agent:MessageWindowChatMemory memory = new (20);

// Use the memory with the agent
agent:ExecutionResult result = check agent:run(myAgent, userMessage,
    memory = memory, maxIter = 10);
```

For multi-user applications, use a memory manager to maintain separate memory per session.

```ballerina
agent:DefaultMessageWindowChatMemoryManager memoryManager = new (20);

service /agent on new http:Listener(8090) {

    resource function post chat(@http:Payload ChatRequest req) returns ChatResponse|error {
        agent:MessageWindowChatMemory memory = check memoryManager.get(req.sessionId);
        agent:ExecutionResult result = check agent:run(myAgent, req.message,
            memory = memory, maxIter = 10);
        return {answer: result.answer};
    }
}
```

## Natural Functions

Natural functions let you call an LLM as a typed function in your integration code. Define the input and output types, and the LLM handles the transformation.

```ballerina
import ballerinax/ai;

type SentimentResult record {|
    string sentiment;   // "positive", "negative", "neutral"
    decimal confidence;
    string summary;
|};

// The LLM interprets the function signature and generates the output
function analyzeSentiment(string text) returns SentimentResult|error {
    return ai:call(openAiModel, text, SentimentResult);
}

// Use in a service
resource function post analyze(@http:Payload string feedback) returns SentimentResult|error {
    return check analyzeSentiment(feedback);
}
```

## Agent Best Practices

1. **Write clear tool descriptions** -- The LLM selects tools based on their descriptions. Be specific about what each tool does and when to use it.
2. **Limit the number of tools** -- Too many tools can confuse the model. Group related operations into a single tool when possible.
3. **Set `maxIter` appropriately** -- Prevent runaway agent loops by setting a reasonable iteration limit.
4. **Handle errors in tools** -- Tools should return descriptive error messages so the agent can reason about failures.
5. **Use low temperature for agents** -- Set `temperature: 0.0` for more deterministic tool selection.
6. **Monitor token usage** -- Agent loops can consume many tokens. Log usage for cost monitoring.

## What's Next

- [RAG Applications](rag-applications.md) -- Add knowledge bases to agents
- [Services](services.md) -- Expose agents as API endpoints
