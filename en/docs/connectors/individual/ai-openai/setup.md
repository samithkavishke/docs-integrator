---
title: "OpenAI (LLM Provider) - Setup"
description: "How to set up and configure the ballerinax/ai.openai connector."
---

# OpenAI LLM Provider Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An OpenAI API key from [platform.openai.com](https://platform.openai.com)

## Step 1: Obtain an OpenAI API Key

1. Create an [OpenAI account](https://platform.openai.com/signup) if you do not have one.
2. Navigate to the [OpenAI Platform Dashboard](https://platform.openai.com).
3. Go to **Dashboard > API keys**.
4. Click **Create new secret key** and store the key securely.

## Step 2: Install the Module

Add the import to your Ballerina file:

```ballerina
import ballerinax/ai.openai;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "ai.openai"
version = "1.3.1"
```

You also need the core AI module:

```ballerina
import ballerina/ai;
```

## Step 3: Configure Credentials

Create a `Config.toml` file:

```toml
# Config.toml
openAiApiKey = "<your-openai-api-key>"
```

Define the configurable variable in your code:

```ballerina
configurable string openAiApiKey = ?;
```

## Step 4: Initialize the Model Provider

```ballerina
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

final ai:ModelProvider openAiModel = check new openai:ModelProvider(
    openAiApiKey, modelType = openai:GPT_4O
);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiKey` | `string` | Your OpenAI API key |
| `modelType` | `string` | Model constant (e.g., `openai:GPT_4O`) |

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.openai;

configurable string openAiApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new openai:ModelProvider(
        openAiApiKey, modelType = openai:GPT_4O
    );

    ai:ChatMessage[] messages = [{role: "user", content: "Say hello."}];
    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println("Connection verified.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Authentication error` | Verify your API key in `Config.toml` |
| `Model not available` | Use supported model constants like `openai:GPT_4O` |
| `Rate limit exceeded` | Implement retry logic or check your OpenAI plan limits |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
