---
title: "Devant Document Processing - Actions"
description: "Available actions and operations for the ballerinax/ai.devant connector."
---

# Devant Document Processing Actions

The `ballerinax/ai.devant` module provides two main components for document processing: `BinaryDataLoader` for loading documents and `Chunker` for splitting documents into chunks using the Devant AI service.

## BinaryDataLoader

The `BinaryDataLoader` reads binary documents (PDF, text, etc.) from the local filesystem and converts them into `ai:Document` objects.

### Initialization

```ballerina
import ballerinax/ai.devant;

devant:BinaryDataLoader loader = check new ("./path/to/document.pdf");
```

### Constructor Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `filePath` | `string` | Path to the document file to load |

### load()

Load the document from the filesystem and return it as an `ai:Document` or array of documents.

```ballerina
import ballerina/ai;
import ballerinax/ai.devant;

devant:BinaryDataLoader loader = check new ("./reports/quarterly-report.pdf");
ai:Document|ai:Document[] docs = check loader.load();
```

#### Return Type

| Type | Description |
|------|-------------|
| `ai:Document\|ai:Document[]` | Single document or array of documents loaded from the file |
| `ai:Error` | Error if the file cannot be read or parsed |

## Chunker

The `Chunker` connects to the Devant AI service to split documents into semantically meaningful chunks suitable for embedding and vector storage.

### Initialization

```ballerina
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

devant:Chunker chunker = new (serviceUrl, accessToken);
```

### Constructor Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `serviceUrl` | `string` | The Devant AI service endpoint URL |
| `accessToken` | `string` | Access token for authenticating with the Devant service |

### chunk()

Split a document into semantically meaningful chunks using the Devant AI chunking service.

```ballerina
import ballerina/ai;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    devant:BinaryDataLoader loader = check new ("./sample.pdf");
    ai:Document|ai:Document[] docs = check loader.load();

    devant:Chunker chunker = new (serviceUrl, accessToken);
    if docs is ai:Document {
        ai:Chunk[] chunks = check chunker.chunk(docs);
        // Each chunk contains type and content fields
    }
}
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `document` | `ai:Document` | The document to chunk |

#### Return Type

| Type | Description |
|------|-------------|
| `ai:Chunk[]` | Array of document chunks with type and content |
| `ai:Error` | Error if chunking fails |

Each `ai:Chunk` contains:

| Field | Type | Description |
|-------|------|-------------|
| `'type` | `string` | The chunk type (e.g., `"text"`) |
| `content` | `string` | The text content of the chunk |

## Complete Workflow

```ballerina
import ballerina/ai;
import ballerina/io;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    // Step 1: Load document
    devant:BinaryDataLoader loader = check new ("./knowledge-base/guide.pdf");
    ai:Document|ai:Document[] docs = check loader.load();

    // Step 2: Chunk the document
    devant:Chunker chunker = new (serviceUrl, accessToken);
    if docs is ai:Document {
        ai:Chunk[] chunks = check chunker.chunk(docs);
        io:println("Generated ", chunks.length(), " chunks");
        foreach ai:Chunk chunk in chunks {
            io:println("Chunk: ", chunk.content);
        }
    }
}
```

## Error Handling

```ballerina
import ballerina/ai;
import ballerina/log;
import ballerinax/ai.devant;

configurable string serviceUrl = ?;
configurable string accessToken = ?;

public function main() returns error? {
    do {
        devant:BinaryDataLoader loader = check new ("./document.pdf");
        ai:Document|ai:Document[] docs = check loader.load();

        devant:Chunker chunker = new (serviceUrl, accessToken);
        if docs is ai:Document {
            ai:Chunk[] chunks = check chunker.chunk(docs);
            log:printInfo(string `Successfully chunked document into ${chunks.length()} chunks`);
        }
    } on fail error e {
        log:printError("Document processing failed", 'error = e);
    }
}
```

## Related

- [Overview](overview) -- Connector overview
- [Setup Guide](setup) -- Configuration
- [Examples](examples) -- Code examples
