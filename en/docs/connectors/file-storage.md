---
title: "File & Storage Connectors"
description: "Transfer, read, and write files via FTP, SFTP, S3, Azure Blob, and local file system."
---

# File & Storage Connectors

WSO2 Integrator provides connectors for file transfer protocols and cloud storage services. Use these for file-based integrations, ETL pipelines, batch processing, and document management.

## Available Connectors

| Connector | Package | Description |
|-----------|---------|-------------|
| **FTP** | `ballerina/ftp` | FTP and SFTP file transfer with directory listener |
| **Local File System** | `ballerina/file` | Read, write, copy, move, and watch local files and directories |
| **AWS S3** | `ballerinax/aws.s3` | Amazon S3 object storage — buckets, objects, multipart uploads |
| **Azure Blob** | `ballerinax/azure.storageservice.blobs` | Azure Blob Storage — containers, blobs, SAS tokens |
| **Google Drive** | `ballerinax/googleapis.drive` | Google Drive — files, folders, permissions, search |
| **OneDrive** | `ballerinax/microsoft.onedrive` | Microsoft OneDrive file management |
| **Box** | `ballerinax/box` | Box cloud content management |

## FTP / SFTP

### Client Operations

```ballerina
import ballerina/ftp;

ftp:Client ftpClient = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {
        credentials: {username: "user", password: "pass"}
    }
});

// List files
ftp:FileInfo[] files = check ftpClient->list("/uploads");

// Download a file
stream<byte[] & readonly, io:Error?> fileStream =
    check ftpClient->get("/uploads/report.csv");

// Upload a file
check ftpClient->put("/outgoing/result.json", content.toBytes());

// Delete a file
check ftpClient->delete("/uploads/processed.csv");
```

### File Listener (Watch for new files)

```ballerina
import ballerina/ftp;

listener ftp:Listener ftpListener = check new ({
    protocol: ftp:SFTP,
    host: "sftp.example.com",
    port: 22,
    auth: {credentials: {username: "user", password: "pass"}},
    path: "/incoming",
    pollingInterval: 30  // Check every 30 seconds
});

service on ftpListener {
    remote function onFileChange(ftp:WatchEvent & readonly event,
            ftp:Caller caller) returns error? {
        foreach ftp:FileInfo file in event.addedFiles {
            // Process new file
            stream<byte[] & readonly, io:Error?> content =
                check caller->get(file.path);
        }
    }
}
```

## Local File System

```ballerina
import ballerina/file;
import ballerina/io;

// Read a file
string content = check io:fileReadString("/data/input.json");

// Write a file
check io:fileWriteString("/data/output.json", jsonContent.toJsonString());

// List directory
file:MetaData[] entries = check file:readDir("/data/incoming");

// Copy / Move
check file:copy("/data/source.csv", "/data/archive/source.csv");
check file:rename("/data/temp.csv", "/data/processed.csv");

// Check existence
boolean exists = check file:test("/data/report.csv", file:EXISTS);
```

### Directory Watcher

```ballerina
import ballerina/file;

listener file:Listener dirWatcher = new ({
    path: "/data/incoming",
    recursive: false
});

service on dirWatcher {
    remote function onCreate(file:FileEvent event) {
        // New file detected
    }

    remote function onModify(file:FileEvent event) {
        // File modified
    }

    remote function onDelete(file:FileEvent event) {
        // File deleted
    }
}
```

## AWS S3

```ballerina
import ballerinax/aws.s3;

s3:Client s3 = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "us-east-1"
});

// Upload
check s3->createObject("my-bucket", "data/report.csv",
    {content: csvData.toBytes()});

// Download
s3:S3Object obj = check s3->getObject("my-bucket", "data/report.csv");

// List objects with prefix
s3:S3Object[] files = check s3->listObjects("my-bucket", prefix = "data/");

// Presigned URL for temporary access
string url = check s3->createPresignedUrl("my-bucket", "data/report.csv",
    expirationInSeconds = 3600);
```

## File Processing Patterns

### Batch File Processing

```ballerina
// Poll FTP, process files, archive when done
service on ftpListener {
    remote function onFileChange(ftp:WatchEvent & readonly event,
            ftp:Caller caller) returns error? {
        foreach ftp:FileInfo file in event.addedFiles {
            // 1. Download
            stream<byte[] & readonly, io:Error?> content =
                check caller->get(file.path);
            byte[] data = check readStream(content);

            // 2. Process (parse CSV, transform, etc.)
            json[] records = check parseCsv(data);

            // 3. Archive original
            check caller->put("/archive/" + file.name, data);
            check caller->delete(file.path);
        }
    }
}
```

### Cloud-to-Cloud File Sync

```ballerina
// Sync files from S3 to Azure Blob
s3:S3Object[] files = check s3Client->listObjects("source-bucket");
foreach var file in files {
    s3:S3Object obj = check s3Client->getObject("source-bucket", file.key);
    check azureBlobClient->putBlob("destination-container", file.key,
        "BlockBlob", obj.content);
}
```

## Authentication

| Connector | Supported Auth |
|-----------|---------------|
| **FTP** | Username/password |
| **SFTP** | Username/password, SSH key pair |
| **AWS S3** | Access key + secret, IAM role |
| **Azure Blob** | Connection string, SAS token, Azure AD |
| **Google Drive** | OAuth 2.0 (refresh token) |

## What's Next

- [Connection Configuration](configuration.md) — Set up file connections in the visual designer
- [Database Connectors](databases.md) — Connect to databases for data persistence
- [Cloud Service Connectors](cloud-services.md) — More cloud platform integrations
