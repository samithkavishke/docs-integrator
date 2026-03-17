---
title: "Mistral AI - Setup"
description: "How to set up and configure the ballerinax/ai.mistral connector."
---

# Mistral AI Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Mistral AI API key from [console.mistral.ai](https://console.mistral.ai/)

## Step 1: Obtain a Mistral API Key

1. Create a [Mistral account](https://console.mistral.ai/) if you do not have one.
2. Navigate to **API Keys** in the console.
3. Click **Create new key** and store the key securely.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.mistral;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.mistral"
version = "1.2.1"
```

## Step 3: Configure Credentials

```toml
# Config.toml
mistralApiKey = "<your-mistral-api-key>"
```

```ballerina
configurable string mistralApiKey = ?;
```

## Step 4: Initialize the Model Provider

```ballerina
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

final ai:ModelProvider mistralModel = check new mistral:ModelProvider(
    mistralApiKey, mistral:MINISTRAL_3B_2410
);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiKey` | `string` | Your Mistral API key |
| `model` | `string` | Model constant (e.g., `mistral:MINISTRAL_3B_2410`) |

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.mistral;

configurable string mistralApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new mistral:ModelProvider(
        mistralApiKey, mistral:MINISTRAL_3B_2410
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
| `Authentication error` | Verify your API key in `Config.toml` |
| `Model not found` | Use supported model constants like `mistral:MINISTRAL_3B_2410` |
| `Rate limit exceeded` | Implement retry logic or upgrade your plan |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
