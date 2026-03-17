---
title: "Deepseek - Setup"
description: "How to set up and configure the ballerinax/ai.deepseek connector."
---

# DeepSeek Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A DeepSeek API key from [platform.deepseek.com](https://platform.deepseek.com)

## Step 1: Obtain a DeepSeek API Key

1. Create an account at [platform.deepseek.com](https://platform.deepseek.com).
2. Navigate to the API keys section.
3. Generate a new API key and store it securely.

## Step 2: Install the Module

```ballerina
import ballerinax/ai.deepseek;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.deepseek"
version = "1.1.1"
```

## Step 3: Configure Credentials

```toml
# Config.toml
deepseekApiKey = "<your-deepseek-api-key>"
```

```ballerina
configurable string deepseekApiKey = ?;
```

## Step 4: Initialize the Model Provider

```ballerina
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

final ai:ModelProvider deepseekModel = check new deepseek:ModelProvider(deepseekApiKey);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `apiKey` | `string` | Your DeepSeek API key |

## Step 5: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.deepseek;

configurable string deepseekApiKey = ?;

public function main() returns error? {
    ai:ModelProvider model = check new deepseek:ModelProvider(deepseekApiKey);

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
| `Rate limit exceeded` | Implement retry logic or reduce request frequency |
| `Connection timeout` | Check network connectivity to the DeepSeek API |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
