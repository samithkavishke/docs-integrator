---
title: "Azure Blob Storage - Examples"
description: "Code examples for the ballerinax/azure_storage_service connector."
---

# Azure Blob Storage Examples

## Example 1: File Upload and Download API

An HTTP service for managing files in Azure Blob Storage.

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/mime;
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;
configurable string containerName = ?;

final azure_storage:BlobClient blobClient = check new ({
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
});

service /blobs on new http:Listener(8080) {

    resource function post upload(http:Request req) returns json|error {
        mime:Entity[] bodyParts = check req.getBodyParts();
        if bodyParts.length() == 0 {
            return error("No file provided");
        }

        mime:Entity filePart = bodyParts[0];
        byte[] content = check filePart.getByteArray();
        string fileName = filePart.getContentDisposition().fileName;

        check blobClient->putBlob(containerName, fileName,
            "BlockBlob", content);

        log:printInfo("File uploaded", fileName = fileName);
        return {status: "uploaded", blobName: fileName};
    }

    resource function get download/[string blobName]() returns http:Response|error {
        azure_storage:BlobResult result = check blobClient->getBlob(
            containerName, blobName);

        http:Response resp = new;
        resp.setBinaryPayload(result.blobContent);
        resp.setHeader("Content-Disposition",
            string `attachment; filename="${blobName}"`);
        return resp;
    }

    resource function get list() returns json|error {
        azure_storage:BlobList blobList = check blobClient->listBlobs(containerName);
        json[] files = [];
        foreach azure_storage:Blob blob in blobList.blobs {
            files.push({
                name: blob.name,
                size: blob.properties.contentLength,
                contentType: blob.properties.contentType,
                lastModified: blob.properties.lastModified
            });
        }
        return {container: containerName, files: files};
    }

    resource function delete [string blobName]() returns json|error {
        check blobClient->deleteBlob(containerName, blobName);
        log:printInfo("Blob deleted", blobName = blobName);
        return {status: "deleted", blobName: blobName};
    }
}
```

**Config.toml:**

```toml
accountName = "mystorageaccount"
accessKey = "<YOUR_STORAGE_ACCESS_KEY>"
containerName = "uploads"
```

## Example 2: Log Aggregation with Append Blobs

Aggregate application logs into Azure Append Blobs organized by date.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;

final azure_storage:BlobClient blobClient = check new ({
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
});

const string LOG_CONTAINER = "application-logs";

type LogEntry record {
    string level;
    string 'source;
    string message;
    map<string> context?;
};

service /logs on new http:Listener(9090) {

    resource function post ingest(LogEntry logEntry) returns json|error {
        string timestamp = time:utcToString(time:utcNow());
        string dateStr = timestamp.substring(0, 10); // YYYY-MM-DD
        string blobName = string `${logEntry.'source}/${dateStr}.log`;

        string logLine = string `[${timestamp}] [${logEntry.level.toUpperAscii()}] ${logEntry.message}\n`;

        // Try to append; create blob if it does not exist
        do {
            check blobClient->appendBlock(LOG_CONTAINER, blobName,
                logLine.toBytes());
        } on fail error _e {
            // Blob might not exist yet, create it
            check blobClient->putBlob(LOG_CONTAINER, blobName, "AppendBlob");
            check blobClient->appendBlock(LOG_CONTAINER, blobName,
                logLine.toBytes());
        }

        return {status: "logged", blob: blobName};
    }

    resource function get [string source]/[string date]() returns string|error {
        string blobName = string `${source}/${date}.log`;
        azure_storage:BlobResult result = check blobClient->getBlob(
            LOG_CONTAINER, blobName);
        return check string:fromBytes(result.blobContent);
    }
}
```

## Example 3: Backup and Archival Service

Back up data from an HTTP endpoint to Azure Blob Storage with retention management.

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/time;
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;

final azure_storage:BlobClient blobClient = check new ({
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
});

final azure_storage:ManagementClient mgmtClient = check new ({
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
});

const string BACKUP_CONTAINER = "backups";

public function main() returns error? {
    // Ensure backup container exists
    do {
        check mgmtClient->createContainer(BACKUP_CONTAINER);
        log:printInfo("Backup container created");
    } on fail error _e {
        log:printInfo("Backup container already exists");
    }

    // Fetch data from an API to back up
    http:Client apiClient = check new ("https://api.example.com");
    json data = check apiClient->get("/export/all-data");

    // Create timestamped backup
    string timestamp = time:utcToString(time:utcNow());
    string backupName = string `daily/${timestamp}/full-export.json`;

    byte[] content = data.toJsonString().toBytes();
    check blobClient->putBlob(BACKUP_CONTAINER, backupName,
        "BlockBlob", content);

    // Add metadata to track backup
    map<string> metadata = {
        "backupType": "full",
        "timestamp": timestamp,
        "sizeBytes": content.length().toString()
    };
    check blobClient->setBlobMetadata(BACKUP_CONTAINER, backupName, metadata);

    log:printInfo("Backup completed",
        blobName = backupName, sizeBytes = content.length());
}
```

## Example 4: Multi-Container Data Migration

Migrate blobs between containers with progress tracking.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure_storage_service as azure_storage;

configurable string accountName = ?;
configurable string accessKey = ?;
configurable string sourceContainer = ?;
configurable string destContainer = ?;

final azure_storage:BlobClient blobClient = check new ({
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
});

final azure_storage:ManagementClient mgmtClient = check new ({
    accessKeyOrSAS: accessKey,
    accountName: accountName,
    authorizationMethod: "accessKey"
});

public function main() returns error? {
    // Ensure destination container exists
    do {
        check mgmtClient->createContainer(destContainer);
    } on fail error _e {
        log:printInfo("Destination container exists");
    }

    // List all blobs in source container
    azure_storage:BlobList sourceBlobs = check blobClient->listBlobs(sourceContainer);
    int total = sourceBlobs.blobs.length();
    int migrated = 0;
    int failed = 0;

    foreach azure_storage:Blob blob in sourceBlobs.blobs {
        do {
            // Download from source
            azure_storage:BlobResult result = check blobClient->getBlob(
                sourceContainer, blob.name);

            // Upload to destination
            check blobClient->putBlob(destContainer, blob.name,
                "BlockBlob", result.blobContent);

            migrated += 1;
            int progress = (migrated * 100) / total;
            log:printInfo("Migrated blob",
                name = blob.name, progress = string `${progress}%`);
        } on fail error e {
            failed += 1;
            log:printError("Migration failed",
                blob = blob.name, 'error = e);
        }
    }

    io:println("Migration complete. Migrated: ", migrated,
        " Failed: ", failed, " Total: ", total);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
