---
title: "Azure Data Lake - Examples"
description: "Code examples for the ballerinax/azure.datalake connector."
---

# Azure Data Lake Examples

## Example 1: CSV Data Ingestion Pipeline

Upload CSV data to Azure Data Lake Storage for analytics processing.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure.datalake;

configurable string accountName = ?;
configurable string accessKey = ?;

public function main() returns error? {
    datalake:Client dlClient = check new ({
        accountName: accountName,
        accessKey: accessKey
    });

    string fileSystem = "sales-data";

    // Ensure file system exists
    do {
        check dlClient->createFileSystem(fileSystem);
        log:printInfo("File system created", name = fileSystem);
    } on fail error e {
        log:printInfo("File system already exists", name = fileSystem);
    }

    // Create directory structure
    check dlClient->createDirectory(fileSystem, "raw/2024/q1");

    // Prepare CSV content
    string csvData = "order_id,customer,product,quantity,total\n" +
        "1001,Acme Corp,Widget A,50,2499.50\n" +
        "1002,Beta Inc,Widget B,100,8990.00\n" +
        "1003,Gamma LLC,Widget A,25,1249.75\n";

    byte[] content = csvData.toBytes();
    string filePath = "raw/2024/q1/orders.csv";

    // Create the file, append content, and flush
    check dlClient->createFile(fileSystem, filePath);
    check dlClient->appendToFile(fileSystem, filePath, content, 0);
    check dlClient->flushFile(fileSystem, filePath, content.length());

    log:printInfo("CSV data uploaded", path = filePath, sizeBytes = content.length());
}
```

```toml
# Config.toml
accountName = "mydatalakeaccount"
accessKey = "<your-access-key>"
```

## Example 2: Data Lake File Browser Service

Expose an HTTP API to browse and download files from Data Lake Storage.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/azure.datalake;

configurable string accountName = ?;
configurable string accessKey = ?;

final datalake:Client dlClient = check new ({
    accountName: accountName,
    accessKey: accessKey
});

service /datalake on new http:Listener(8080) {

    // List all file systems
    resource function get filesystems() returns json|error {
        datalake:FileSystemList fsList = check dlClient->listFileSystems();
        return fsList.toJson();
    }

    // List files in a directory
    resource function get files/[string fileSystem](string? directory) returns json|error {
        datalake:PathList paths = check dlClient->listPaths(fileSystem,
            directory = directory ?: "");
        return paths.toJson();
    }

    // Download a file
    resource function get download/[string fileSystem](string path)
            returns http:Response|error {
        byte[] content = check dlClient->readFile(fileSystem, path);

        http:Response response = new;
        response.setBinaryPayload(content);
        response.setHeader("Content-Disposition",
            string `attachment; filename="${getFileName(path)}"`);
        return response;
    }
}

function getFileName(string path) returns string {
    string[] parts = re `/`.split(path);
    return parts[parts.length() - 1];
}
```

## Example 3: Log Archival System

Archive application logs from a local directory to Data Lake with organized directory structure.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerina/time;
import ballerinax/azure.datalake;

configurable string accountName = ?;
configurable string accessKey = ?;

public function main() returns error? {
    datalake:Client dlClient = check new ({
        accountName: accountName,
        accessKey: accessKey
    });

    string fileSystem = "application-logs";

    // Create file system if needed
    do {
        check dlClient->createFileSystem(fileSystem);
    } on fail error e {
        log:printInfo("File system exists");
    }

    // Build date-based directory structure
    time:Utc now = time:utcNow();
    time:Civil civil = time:utcToCivil(now);
    string dirPath = string `logs/${civil.year}/${civil.month}/${civil.day}`;
    check dlClient->createDirectory(fileSystem, dirPath);

    // Simulate log entries
    string[] logEntries = [
        "[INFO] Application started successfully",
        "[INFO] Processing 150 records from queue",
        "[WARN] Slow query detected: 2.3s",
        "[INFO] Batch processing completed",
        "[ERROR] Connection timeout to external API - retrying"
    ];

    string logContent = "";
    foreach string entry in logEntries {
        logContent += string `${time:utcToString(time:utcNow())} ${entry}\n`;
    }

    byte[] content = logContent.toBytes();
    string fileName = string `${dirPath}/app-${time:utcToString(now)}.log`;

    check dlClient->createFile(fileSystem, fileName);
    check dlClient->appendToFile(fileSystem, fileName, content, 0);
    check dlClient->flushFile(fileSystem, fileName, content.length());

    log:printInfo("Logs archived", path = fileName);
}
```

## Example 4: Data Migration Between File Systems

Move processed data from a staging file system to a production file system.

```ballerina
import ballerina/log;
import ballerinax/azure.datalake;

configurable string accountName = ?;
configurable string accessKey = ?;

public function main() returns error? {
    datalake:Client dlClient = check new ({
        accountName: accountName,
        accessKey: accessKey
    });

    string sourceFs = "staging-data";
    string targetFs = "production-data";

    // List all files in the staging directory
    datalake:PathList paths = check dlClient->listPaths(sourceFs, directory = "approved");

    int migrated = 0;
    foreach datalake:Path path in paths.paths {
        if path.isDirectory == true {
            continue;
        }

        // Read from staging
        byte[] content = check dlClient->readFile(sourceFs, path.name);

        // Write to production
        string targetPath = "current/" + getBaseName(path.name);
        do {
            check dlClient->createFile(targetFs, targetPath);
        } on fail error e {
            log:printInfo("File exists, overwriting", path = targetPath);
        }

        check dlClient->appendToFile(targetFs, targetPath, content, 0);
        check dlClient->flushFile(targetFs, targetPath, content.length());

        // Remove from staging after successful migration
        check dlClient->deleteFile(sourceFs, path.name);

        migrated += 1;
        log:printInfo("File migrated", source = path.name, target = targetPath);
    }

    log:printInfo("Migration completed", totalFiles = migrated);
}

function getBaseName(string path) returns string {
    string[] parts = re `/`.split(path);
    return parts[parts.length() - 1];
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
- [Azure Data Lake Storage Documentation](https://learn.microsoft.com/en-us/azure/storage/data-lake-storage/)
