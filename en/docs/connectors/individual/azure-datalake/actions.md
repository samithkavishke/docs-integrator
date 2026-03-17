---
title: "Azure Data Lake - Actions"
description: "Available actions and operations for the ballerinax/azure.datalake connector."
---

# Azure Data Lake Actions

The `ballerinax/azure.datalake` package provides a client with operations to manage file systems, directories, and files in Azure Data Lake Storage Gen2.

## Client Initialization

```ballerina
import ballerinax/azure.datalake;

configurable string accountName = ?;
configurable string accessKey = ?;

datalake:Client dlClient = check new ({
    accountName: accountName,
    accessKey: accessKey
});
```

## File System Operations

### Create File System

Create a new file system (container) in the Data Lake account.

```ballerina
check dlClient->createFileSystem("analytics-data");
```

### List File Systems

List all file systems in the storage account.

```ballerina
datalake:FileSystemList fileSystems = check dlClient->listFileSystems();
foreach datalake:FileSystem fs in fileSystems.filesystems {
    // fs.name contains the file system name
}
```

### Delete File System

Delete a file system and all its contents.

```ballerina
check dlClient->deleteFileSystem("old-data");
```

### Get File System Properties

Retrieve properties and metadata for a file system.

```ballerina
datalake:FileSystemProperties props = check dlClient->getFileSystemProperties("analytics-data");
```

## Directory Operations

### Create Directory

Create a directory within a file system.

```ballerina
check dlClient->createDirectory("analytics-data", "raw/2024/january");
```

### Delete Directory

Delete a directory and optionally its contents.

```ballerina
check dlClient->deleteDirectory("analytics-data", "raw/2024/january");
```

### Rename Directory

Rename or move a directory within the file system.

```ballerina
check dlClient->renameDirectory("analytics-data", "raw/temp", "raw/processed");
```

### List Paths

List files and directories within a file system, optionally within a directory.

```ballerina
datalake:PathList paths = check dlClient->listPaths("analytics-data", directory = "raw");
foreach datalake:Path path in paths.paths {
    // path.name, path.isDirectory, path.contentLength
}
```

## File Operations

### Create File

Create an empty file at a specified path.

```ballerina
check dlClient->createFile("analytics-data", "raw/orders/data.csv");
```

### Upload File Content

Append data to a file and flush it to make it available.

```ballerina
byte[] content = "id,name,amount\n1,Widget,29.99\n2,Gadget,49.99\n".toBytes();

// Append data starting at position 0
check dlClient->appendToFile("analytics-data", "raw/orders/data.csv", content, 0);

// Flush to commit the data
check dlClient->flushFile("analytics-data", "raw/orders/data.csv", content.length());
```

### Read File

Download the contents of a file.

```ballerina
byte[] content = check dlClient->readFile("analytics-data", "raw/orders/data.csv");
string fileContent = check string:fromBytes(content);
```

### Delete File

Delete a file from the file system.

```ballerina
check dlClient->deleteFile("analytics-data", "raw/orders/data.csv");
```

### Rename File

Rename or move a file within the file system.

```ballerina
check dlClient->renameFile("analytics-data", "raw/temp.csv", "processed/output.csv");
```

## Path Properties and Access Control

### Get Path Properties

Retrieve properties for a file or directory.

```ballerina
datalake:PathProperties props = check dlClient->getPathProperties("analytics-data", "raw/orders/data.csv");
// props.contentLength, props.lastModified, etc.
```

### Set Path Access Control

Set POSIX-style access control on a path.

```ballerina
check dlClient->setPathAccessControl("analytics-data", "raw/orders/data.csv",
    owner = "user1",
    group = "group1",
    permissions = "rwxr-x---"
);
```

### Get Path Access Control

Retrieve the access control list for a path.

```ballerina
datalake:PathAccessControl acl = check dlClient->getPathAccessControl("analytics-data", "raw/orders/data.csv");
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` for localized handling:

```ballerina
import ballerina/log;

do {
    byte[] content = check dlClient->readFile("analytics-data", "reports/summary.csv");
    log:printInfo("File read successfully", size = content.length());
} on fail error e {
    log:printError("Failed to read file", 'error = e);
}
```

### Common Error Scenarios

| Error | Cause |
|---|---|
| `FileSystemNotFound` (404) | The specified file system does not exist |
| `PathNotFound` (404) | The file or directory path does not exist |
| `FileSystemAlreadyExists` (409) | Attempting to create a file system that already exists |
| `Unauthorized` (401) | Invalid access key or SAS token |
| `InsufficientAccountPermissions` (403) | Account does not have required permissions |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Reference on Ballerina Central](https://central.ballerina.io/ballerinax/azure.datalake/1.5.1)
