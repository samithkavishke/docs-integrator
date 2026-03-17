---
title: "Azure Blob Storage - Actions"
description: "Available actions and operations for the ballerinax/azure_storage_service connector."
---

# Azure Blob Storage Actions

The `ballerinax/azure_storage_service` package provides two clients: `BlobClient` for blob operations and `ManagementClient` for container management.

## Client Initialization

```ballerina
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;

azure_storage:ConnectionConfig config = {
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
};

azure_storage:BlobClient blobClient = check new (config);
azure_storage:ManagementClient mgmtClient = check new (config);
```

## Container Operations

### List Containers

```ballerina
azure_storage:ContainerList containers = check mgmtClient->listContainers();
foreach azure_storage:Container container in containers.containers {
    io:println("Container: ", container.name);
}
```

### Create Container

```ballerina
check mgmtClient->createContainer("my-documents");
io:println("Container created");
```

### Delete Container

```ballerina
check mgmtClient->deleteContainer("old-container");
```

## Blob Operations

### Upload Blob (Put Blob)

Upload content as a block blob.

**Upload string content:**

```ballerina
check blobClient->putBlob("my-container", "reports/summary.txt",
    "Text", "This is the report summary content");
```

**Upload binary content:**

```ballerina
byte[] fileContent = check io:fileReadBytes("./document.pdf");
check blobClient->putBlob("my-container", "documents/report.pdf",
    "BlockBlob", fileContent);
```

### Download Blob (Get Blob)

```ballerina
azure_storage:BlobResult result = check blobClient->getBlob(
    "my-container", "reports/summary.txt");
string content = check string:fromBytes(result.blobContent);
io:println("Blob content: ", content);
```

**Save downloaded blob to file:**

```ballerina
azure_storage:BlobResult pdfResult = check blobClient->getBlob(
    "my-container", "documents/report.pdf");
check io:fileWriteBytes("./downloaded-report.pdf", pdfResult.blobContent);
```

### Delete Blob

```ballerina
check blobClient->deleteBlob("my-container", "reports/old-report.txt");
```

### List Blobs

```ballerina
azure_storage:BlobList blobList = check blobClient->listBlobs("my-container");
foreach azure_storage:Blob blob in blobList.blobs {
    io:println("Blob: ", blob.name, " | Size: ", blob.properties.contentLength);
}
```

**List with prefix:**

```ballerina
azure_storage:BlobList filteredBlobs = check blobClient->listBlobs(
    "my-container", prefix = "reports/");
```

### Get Blob Properties

```ballerina
azure_storage:BlobProperties props = check blobClient->getBlobProperties(
    "my-container", "documents/report.pdf");
io:println("Content Type: ", props.contentType);
io:println("Content Length: ", props.contentLength);
io:println("Last Modified: ", props.lastModified);
```

### Set Blob Metadata

```ballerina
map<string> metadata = {
    "author": "Integration Team",
    "category": "quarterly-reports",
    "version": "2.0"
};
check blobClient->setBlobMetadata("my-container", "reports/summary.txt",
    metadata);
```

### Get Blob Metadata

```ballerina
map<string> blobMetadata = check blobClient->getBlobMetadata(
    "my-container", "reports/summary.txt");
foreach [string, string] [key, value] in blobMetadata.entries() {
    io:println("  ", key, ": ", value);
}
```

### Copy Blob

Copy a blob to a new location within the same or different container.

```ballerina
string sourceUrl = string `https://${accountName}.blob.core.windows.net/source-container/original.txt`;
check blobClient->copyBlob("dest-container", "copy.txt", sourceUrl);
```

## Append Blob Operations

### Create Append Blob

```ballerina
check blobClient->putBlob("logs-container", "app.log", "AppendBlob");
```

### Append Block

```ballerina
string logEntry = "2024-01-15T10:30:00Z INFO Application started\n";
check blobClient->appendBlock("logs-container", "app.log",
    logEntry.toBytes());
```

## Error Handling

```ballerina
import ballerina/log;

do {
    azure_storage:BlobResult result = check blobClient->getBlob(
        "my-container", "nonexistent.txt");
} on fail error e {
    log:printError("Azure Blob operation failed", 'error = e);
}
```

### Common Error Scenarios

| Error | Cause | Resolution |
|---|---|---|
| `ContainerNotFound` | Container does not exist | Create the container first |
| `BlobNotFound` | Blob does not exist at the specified path | Verify blob name |
| `AuthenticationFailed` | Invalid credentials | Check access key or SAS token |
| `ContainerAlreadyExists` | Container with the same name exists | Use existing container or choose a different name |
| `BlobTooLarge` | Blob exceeds 256 MB for single put | Use block upload for larger files |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
