---
title: "AI & LLM Connectors"
description: "Connect to AI providers, large language models, and vector databases from WSO2 Integrator."
---

# AI & LLM Connectors

WSO2 Integrator provides connectors for leading AI/LLM providers and vector databases. Use these to build AI agents, RAG applications, and intelligent automation workflows.

## LLM Providers

| Connector | Package | Description |
|-----------|---------|-------------|
| **OpenAI Chat** | `ballerinax/openai.chat` | GPT-4o, GPT-4, GPT-3.5 — chat completions, tool calling, vision, structured outputs |
| **OpenAI Audio** | `ballerinax/openai.audio` | Whisper (speech-to-text) and TTS (text-to-speech) |
| **OpenAI Images** | `ballerinax/openai.images` | DALL-E image generation |
| **OpenAI Assistants** | `ballerinax/openai.assistants` | OpenAI Assistants API with threads and runs |
| **Azure OpenAI** | `ballerinax/azure.openai.chat` | Azure-hosted OpenAI models with enterprise compliance |
| **Anthropic Claude** | `ballerinax/anthropic.claude` | Claude models for chat, analysis, and tool use |
| **Google Vertex AI** | `ballerinax/googleapis.vertexai` | Gemini models via Google Cloud Vertex AI |
| **Mistral AI** | `ballerinax/mistral.chat` | Mistral and Mixtral open-weight models |

## AI Agent Framework

| Connector | Package | Description |
|-----------|---------|-------------|
| **AI Agent** | `ballerinax/ai.agent` | Build AI agents with tool binding, memory, and multi-step reasoning |

## Embedding & Vector Databases

| Connector | Package | Description |
|-----------|---------|-------------|
| **OpenAI Embeddings** | `ballerinax/openai.embeddings` | Generate text embeddings for RAG and similarity search |
| **Pinecone** | `ballerinax/pinecone.vector` | Managed vector database for similarity search |
| **Qdrant** | `ballerinax/qdrant` | Open-source vector database |
| **ChromaDB** | `ballerinax/chromadb` | Lightweight embedding database |

## OpenAI Chat Example

```ballerina
import ballerinax/openai.chat;

configurable string openaiKey = ?;

final chat:Client openai = check new ({
    auth: {token: openaiKey}
});

function askQuestion(string question) returns string|error {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o",
        messages: [
            {role: "system", content: "You are a helpful assistant."},
            {role: "user", content: question}
        ]
    };

    chat:CreateChatCompletionResponse response =
        check openai->/chat/completions.post(request);
    return response.choices[0].message.content ?: "No response";
}
```

## Tool Calling (Function Calling)

```ballerina
chat:CreateChatCompletionRequest request = {
    model: "gpt-4o",
    messages: [{role: "user", content: "What's the weather in London?"}],
    tools: [
        {
            'type: "function",
            'function: {
                name: "get_weather",
                description: "Get weather for a location",
                parameters: {
                    'type: "object",
                    properties: {
                        "location": {'type: "string", description: "City name"}
                    },
                    required: ["location"]
                }
            }
        }
    ]
};
```

## AI Agent Example

```ballerina
import ballerinax/ai.agent;
import ballerinax/ai.provider.openai;

configurable string openaiKey = ?;

public function main() returns error? {
    openai:Client model = check new ({
        auth: {token: openaiKey},
        model: "gpt-4o"
    });

    agent:InlineAgent myAgent = check new (
        model = model,
        systemPrompt = "You are a travel assistant.",
        tools = [searchFlights, bookHotel]
    );

    string response = check myAgent.run("Find flights to London next week");
}
```

## RAG with Embeddings + Vector DB

```ballerina
import ballerinax/openai.embeddings;
import ballerinax/pinecone.vector;

// Generate embeddings
embeddings:Client embeddingClient = check new ({auth: {token: openaiKey}});

embeddings:CreateEmbeddingResponse embResult = check embeddingClient->/embeddings.post({
    model: "text-embedding-3-small",
    input: "What is WSO2 Integrator?"
});

// Store in Pinecone
vector:Client pinecone = check new ({apiKey: pineconeKey});
check pinecone->upsert("my-index", [
    {id: "doc-1", values: embResult.data[0].embedding}
]);

// Query similar documents
vector:QueryResponse queryResult = check pinecone->query("my-index", {
    vector: embResult.data[0].embedding,
    topK: 5
});
```

## Authentication

| Provider | Auth Method |
|----------|------------|
| **OpenAI** | API key (Bearer token) |
| **Azure OpenAI** | API key or Azure AD token |
| **Anthropic** | API key (x-api-key header) |
| **Google Vertex AI** | OAuth 2.0 service account |
| **Pinecone** | API key |

## What's Next

- [GenAI Overview](/docs/genai) — Full guide to building AI applications
- [Build an AI Agent](/docs/get-started/quick-start-ai-agent) — Quick start tutorial
- [RAG Applications](/docs/genai/rag/architecture-overview) — Build knowledge-augmented AI
- [Connection Configuration](configuration.md) — Set up AI provider connections
