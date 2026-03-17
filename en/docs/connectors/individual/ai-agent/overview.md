---
title: "AI Agent Framework"
description: "Overview of the ballerinax/ai.agent connector for WSO2 Integrator."
---

# AI Agent Framework

| | |
|---|---|
| **Package** | [`ballerinax/ai.agent`](https://central.ballerina.io/ballerinax/ai.agent/latest) |
| **Version** | 0.9.2 |
| **Category** | AI & Machine Learning |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/ai.agent/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/ai.agent/latest#functions) |

## Overview

The `ballerinax/ai.agent` module provides the functionality required to build AI agents that use Large Language Models (LLMs) to reason about tasks, call tools, and produce results. It implements the [ReAct (Reasoning + Acting)](https://arxiv.org/abs/2210.03629) framework and function calling patterns, allowing agents to iteratively reason through problems, invoke external tools, and synthesize final answers.

This module is designed to work with multiple LLM providers through the Ballerina AI module ecosystem, including OpenAI, Azure OpenAI, Anthropic, Mistral, Ollama, and DeepSeek.

## Key Features

- **ReAct Agent** -- Implements the ReAct loop: Thought, Action, Observation for step-by-step reasoning
- **Function Calling Agent** -- Uses LLM-native function calling APIs for structured tool invocation
- **Tool System** -- Define tools as Ballerina functions or HTTP API resources
- **ToolKit Support** -- Group related tools with shared configuration (e.g., HTTP services)
- **OpenAPI Integration** -- Automatically extract tools from OpenAPI 3.x specification files
- **Multi-LLM Support** -- Works with OpenAI, Azure OpenAI, Anthropic, and custom LLM providers
- **Extensible Architecture** -- Extend the base agent class to build custom reasoning protocols
- **Memory Management** -- Maintain conversation history for multi-turn agent interactions

## Agent Architecture

The agent operates through an iterative loop:

1. **Receive** -- The agent receives a natural language query from the user
2. **Reason** -- The LLM analyzes the query and determines the next action
3. **Act** -- The agent invokes the selected tool with extracted parameters
4. **Observe** -- The tool result is fed back to the LLM for further reasoning
5. **Repeat or Respond** -- The loop continues until the agent has enough information to provide a final answer

## Agent Types

### ReAct Agent

Uses a prompt-based reasoning loop with Thought/Action/Observation steps. Works with any LLM that supports chat completion.

### Function Calling Agent

Leverages the LLM's native function calling API (e.g., OpenAI Function Calls) for more structured and reliable tool invocation.

## Tool Types

| Tool Type | Description | Use Case |
|-----------|-------------|----------|
| **Function Tool** | Ballerina isolated function | Local computation, data processing |
| **HTTP Tool** | REST API endpoint definition | External service integration |
| **OpenAPI Tools** | Auto-extracted from OpenAPI specs | API-driven workflows |
| **ToolKit** | Grouped tools with shared config | Multi-resource HTTP services |

## Quick Start

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

// Define a tool
isolated function getWeather(record {|string city;|} params) returns string|error {
    // Simulated weather lookup
    return "The weather in " + params.city + " is 22C and sunny.";
}

public function main() returns error? {
    // Define tools
    agent:Tool weatherTool = {
        name: "get_weather",
        description: "Get the current weather for a city",
        parameters: {
            properties: {
                city: {'type: agent:STRING, description: "City name"}
            }
        },
        caller: getWeather
    };

    // Create the agent with an LLM model
    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:FunctionCallAgent myAgent = check new (model, weatherTool);

    // Run the agent
    string response = check myAgent->run("What is the weather in London?");
    io:println(response);
}
```

## Related Resources

- [Setup Guide](setup) -- Configure LLM providers and tools
- [Actions Reference](actions) -- Agent types, tools, and operations
- [Examples](examples) -- Production-ready agent examples
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/ai.agent/latest) -- Full API documentation
