---
title: "Anthropic Claude - Setup"
description: "How to set up and configure the ballerinax/ai.anthropic connector."
---

# Anthropic Claude Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Anthropic API key from [console.anthropic.com](https://console.anthropic.com)

## Step 1: Obtain an Anthropic API Key

1. Create an [Anthropic account](https://www.anthropic.com/signup) if you do not have one.
2. Navigate to the [Anthropic Console](https://console.anthropic.com).
3. Go to **Settings > API Keys**.
4. Click **Create Key** to generate a new API key.
5. Copy and securely store the key.

## Step 2: Install the Module

Add the import to your Ballerina file:

```ballerina
import ballerinax/ai.anthropic;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "ai.anthropic"
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
anthropicApiKey = "<your-anthropic-api-key>"
```

Define the configurable variable in your Ballerina code:

```ballerina
configurable string anthropicApiKey = ?;
```

## Step 4: Initialize the Model Provider

```ballerina
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

final ai:ModelProvider anthropicModel = check new anthropic:ModelProvider(
    anthropicApiKey,
    anthropic:CLAUDE_3_7_SONNET_20250219,
    "2023-06-01"  // Anthropic API version
);
```

The `ModelProvider` constructor accepts:

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiKey` | `string` | Your Anthropic API key |
| `model` | `string` | Model identifier constant (e.g., `anthropic:CLAUDE_3_7_SONNET_20250219`) |
| `apiVersion` | `string` | Anthropic API version string (e.g., `"2023-06-01"`) |

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.anthropic;

configurable string anthropicApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new anthropic:ModelProvider(
        anthropicApiKey,
        anthropic:CLAUDE_3_7_SONNET_20250219,
        "2023-06-01"
    );

    ai:ChatMessage[] messages = [
        {role: "user", content: "Say hello in one word."}
    ];

    ai:ChatAssistantMessage response = check model->chat(messages, tools = []);
    io:println("Connection verified. Response received.");
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Authentication error` | Verify your API key in `Config.toml` |
| `Model not found` | Use the model constants (e.g., `anthropic:CLAUDE_3_7_SONNET_20250219`) |
| `Rate limit exceeded` | Implement retry logic or reduce request frequency |
| `Invalid API version` | Use `"2023-06-01"` as the API version string |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
