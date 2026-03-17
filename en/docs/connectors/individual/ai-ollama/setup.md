---
title: "Ollama - Setup"
description: "How to set up and configure the ballerinax/ai.ollama connector."
---

# Ollama Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Ollama installed and running locally

## Step 1: Install Ollama

### macOS

```bash
brew install ollama
```

Or download from [ollama.com/download](https://ollama.com/download).

### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

### Windows

Download the installer from [ollama.com/download](https://ollama.com/download).

## Step 2: Pull a Model

Download a model to run locally:

```bash
# Pull the Llama 3.1 model (default 8B parameters)
ollama pull llama3.1

# Pull Mistral 7B
ollama pull mistral

# Pull a smaller model for testing
ollama pull phi3
```

## Step 3: Start the Ollama Server

Ollama runs as a background service. Start it with:

```bash
ollama serve
```

By default, Ollama listens on `http://localhost:11434`.

Verify the server is running:

```bash
curl http://localhost:11434/api/tags
```

## Step 4: Install the Module

```ballerina
import ballerinax/ai.ollama;
```

```toml
[[dependency]]
org = "ballerinax"
name = "ai.ollama"
version = "1.2.1"
```

## Step 5: Initialize the Model Provider

No API key is required for Ollama. Simply provide the model name:

```ballerina
import ballerina/ai;
import ballerinax/ai.ollama;

final ai:ModelProvider ollamaModel = check new ollama:ModelProvider("llama3.1");
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `modelName` | `string` | Name of the Ollama model to use (must be pulled first) |

### Custom Server URL

If Ollama runs on a different host or port:

```ballerina
final ai:ModelProvider ollamaModel = check new ollama:ModelProvider(
    "llama3.1"
);
```

## Step 6: Verify the Setup

```ballerina
import ballerina/io;
import ballerina/ai;
import ballerinax/ai.ollama;

public function main() returns error? {
    ai:ModelProvider model = check new ollama:ModelProvider("llama3.1");

    ai:ChatMessage[] messages = [{role: "user", content: "Say hello."}];
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
| `Connection refused` | Ensure `ollama serve` is running |
| `Model not found` | Run `ollama pull <model-name>` first |
| `Slow responses` | Use a smaller model (e.g., `phi3`) or ensure GPU acceleration is enabled |
| `Out of memory` | Choose a model with fewer parameters that fits your RAM/VRAM |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
