---
sidebar_position: 4
title: File Processing
description: Build integrations triggered by file arrival on FTP, SFTP, or local directories.
---

# File Processing

File processing integrations handle files from remote servers, local directories, or cloud storage. They typically poll for new files, read and transform data, and write the results to a destination.

## FTP / SFTP Listener

### Watching for New Files

Use the `ftp:Listener` to poll an FTP or SFTP server and react when new files arrive.

```ballerina
import ballerina/ftp;
import ballerina/io;
import ballerina/log;

listener ftp:Listener fileListener = new ({
    host: "ftp.example.com",
    auth: {
        credentials: {
            username: "user",
            password: "secret"
        }
    },
    path: "/incoming/orders",
    fileNamePattern: "(.*).csv",
    pollingInterval: 30
});

service on fileListener {

    remote function onFileChange(ftp:WatchEvent event, ftp:Caller caller) returns error? {
        foreach ftp:FileInfo file in event.addedFiles {
            log:printInfo("New file detected", fileName = file.name);
            stream<io:Block, io:Error?> fileStream = check caller->get(file.pathDecoded);
            check processFile(file.name, fileStream);
        }
    }
}
```

### SFTP Configuration

For secure file transfer, configure the SFTP connection with key-based authentication.

```ballerina
listener ftp:Listener sftpListener = new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {
        credentials: {
            username: "sftpuser",
            password: "secret"
        },
        privateKey: {
            path: "./keys/id_rsa",
            password: "keypass"
        }
    },
    path: "/data/incoming",
    pollingInterval: 60
});
```

## Reading Files

### CSV Files

Parse CSV files into typed records using the `ballerina/data.csv` module.

```ballerina
import ballerina/data.csv;
import ballerina/io;

type ProductRecord record {
    string sku;
    string name;
    decimal price;
    int quantity;
};

function readCsvFile(string filePath) returns ProductRecord[]|error {
    string csvContent = check io:fileReadString(filePath);
    ProductRecord[] products = check csv:parseString(csvContent);
    return products;
}
```

### JSON Files

Read and parse JSON files with type-safe binding.

```ballerina
import ballerina/io;

type Config record {
    string appName;
    int port;
    string[] allowedOrigins;
};

function readJsonFile(string filePath) returns Config|error {
    json content = check io:fileReadJson(filePath);
    Config config = check content.cloneWithType();
    return config;
}
```

### XML Files

Process XML files using Ballerina's native XML support.

```ballerina
import ballerina/io;

function readXmlFile(string filePath) returns xml|error {
    xml content = check io:fileReadXml(filePath);

    // Navigate with XPath-like expressions
    xml items = content/<items>/<item>;
    foreach xml item in items {
        string name = (item/<name>).data();
        string price = (item/<price>).data();
        log:printInfo("Item found", name = name, price = price);
    }
    return content;
}
```

## Batch Processing Patterns

### Chunked Processing

Process large files in chunks to manage memory and enable progress tracking.

```ballerina
function processCsvInBatches(string filePath, int batchSize) returns error? {
    string[][] rows = check io:fileReadCsv(filePath);

    int totalRows = rows.length();
    int offset = 0;

    while offset < totalRows {
        int end = int:min(offset + batchSize, totalRows);
        string[][] batch = rows.slice(offset, end);

        check processBatch(batch);
        log:printInfo("Batch processed",
            processed = end,
            total = totalRows
        );
        offset = end;
    }
}
```

### Parallel File Processing

Use Ballerina workers to process multiple files concurrently.

```ballerina
function processFilesInParallel(string[] filePaths) returns error? {
    // Process files concurrently using fork/join
    error?[] results = filePaths.'map(isolated function(string path) returns error? {
        return processFile(path);
    });

    foreach error? result in results {
        if result is error {
            log:printError("File processing failed", 'error = result);
        }
    }
}
```

## Writing Files

### Writing Output Files

Write transformed data to output files in various formats.

```ballerina
import ballerina/io;

function writeCsvOutput(string filePath, string[][] data) returns error? {
    check io:fileWriteCsv(filePath, data);
    log:printInfo("Output written", filePath = filePath, rows = data.length());
}

function writeJsonOutput(string filePath, json data) returns error? {
    check io:fileWriteJson(filePath, data);
}
```

### Uploading to FTP/SFTP

Write processed files back to a remote server.

```ballerina
import ballerina/ftp;
import ballerina/io;

final ftp:Client ftpClient = check new ({
    host: "ftp.example.com",
    auth: {
        credentials: {username: "user", password: "secret"}
    }
});

function uploadResult(string remotePath, string localPath) returns error? {
    byte[] content = check io:fileReadBytes(localPath);
    stream<io:Block, io:Error?> byteStream = new (content);
    check ftpClient->put(remotePath, byteStream);
    log:printInfo("File uploaded", remotePath = remotePath);
}
```

## Error Handling for File Operations

Handle partial failures, corrupt files, and transient errors with structured error handling.

```ballerina
function safeProcessFile(string filePath) returns error? {
    do {
        string content = check io:fileReadString(filePath);
        check validateFileContent(content);
        check transformAndStore(content);
        check moveToProcessed(filePath);
    } on fail error e {
        log:printError("File processing failed", filePath = filePath, 'error = e);
        check moveToFailed(filePath);
        check sendAlert("File processing failed: " + filePath + " - " + e.message());
    }
}

function moveToProcessed(string filePath) returns error? {
    // Move successfully processed files to an archive directory
    check io:fileRename(filePath, filePath.replace("/incoming/", "/processed/"));
}

function moveToFailed(string filePath) returns error? {
    check io:fileRename(filePath, filePath.replace("/incoming/", "/failed/"));
}
```

## What's Next

- [AI Agents](ai-agents.md) -- Build intelligent integrations
- [Error Handling](error-handling.md) -- Handle failures gracefully
