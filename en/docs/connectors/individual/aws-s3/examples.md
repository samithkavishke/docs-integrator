---
title: "Amazon S3 - Examples"
description: "Code examples for the ballerinax/aws.s3 connector."
---

# Amazon S3 Examples

## Example 1: File Upload and Download Service

Expose an HTTP service that uploads files to S3 and retrieves them via presigned URLs.

```ballerina
import ballerina/http;
import ballerina/io;
import ballerina/log;
import ballerina/mime;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string bucketName = ?;

final s3:Client s3Client = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

service /files on new http:Listener(8080) {

    // Upload a file to S3
    resource function post upload(http:Request req) returns json|error {
        mime:Entity[] bodyParts = check req.getBodyParts();
        if bodyParts.length() == 0 {
            return error("No file provided in request body");
        }

        mime:Entity filePart = bodyParts[0];
        byte[] fileContent = check filePart.getByteArray();
        string fileName = filePart.getContentDisposition().fileName;

        string objectKey = string `uploads/${fileName}`;
        check s3Client->createObject(bucketName, objectKey, fileContent);

        log:printInfo("File uploaded successfully", fileName = fileName);
        return {
            status: "uploaded",
            objectKey: objectKey,
            bucket: bucketName
        };
    }

    // Get a presigned download URL for a file
    resource function get download/[string fileName]() returns json|error {
        string objectKey = string `uploads/${fileName}`;
        string presignedUrl = check s3Client->generatePresignedUrl(
            bucketName, objectKey, 3600
        );

        return {
            fileName: fileName,
            downloadUrl: presignedUrl,
            expiresInSeconds: 3600
        };
    }

    // List all uploaded files
    resource function get list() returns json|error {
        s3:S3Object[] objects = check s3Client->listObjects(bucketName,
            prefix = "uploads/");

        json[] fileList = [];
        foreach s3:S3Object obj in objects {
            fileList.push({
                name: obj.objectName,
                size: obj.objectSize,
                lastModified: obj.lastModified
            });
        }
        return {files: fileList};
    }

    // Delete a file from S3
    resource function delete remove/[string fileName]() returns json|error {
        string objectKey = string `uploads/${fileName}`;
        check s3Client->deleteObject(bucketName, objectKey);

        log:printInfo("File deleted", fileName = fileName);
        return {status: "deleted", objectKey: objectKey};
    }
}
```

**Config.toml:**

```toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
bucketName = "my-integration-bucket"
```

## Example 2: Automated Backup Service

Periodically back up local files to S3 with timestamped keys.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;
import ballerina/log;
import ballerina/time;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string backupBucket = ?;

final s3:Client s3Client = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

public function main() returns error? {
    string[] filesToBackup = ["./data/config.json", "./data/users.csv"];

    foreach string filePath in filesToBackup {
        byte[] content = check io:fileReadBytes(filePath);

        string timestamp = time:utcToString(time:utcNow());
        string fileName = filePath.substring(filePath.lastIndexOf("/") + 1);
        string objectKey = string `backups/${timestamp}/${fileName}`;

        do {
            check s3Client->createObject(backupBucket, objectKey, content);
            log:printInfo("Backup successful",
                file = fileName, s3Key = objectKey);
        } on fail error e {
            log:printError("Backup failed",
                file = fileName, 'error = e);
        }
    }

    log:printInfo("Backup process completed");
}
```

## Example 3: Cross-Bucket Object Sync

Copy objects from a source bucket to a destination bucket, syncing only new or updated objects.

```ballerina
import ballerina/log;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string sourceBucket = ?;
configurable string destBucket = ?;

final s3:Client s3Client = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

public function main() returns error? {
    s3:S3Object[] sourceObjects = check s3Client->listObjects(sourceBucket);
    s3:S3Object[] destObjects = check s3Client->listObjects(destBucket);

    // Build a set of existing destination keys
    map<boolean> destKeys = {};
    foreach s3:S3Object destObj in destObjects {
        destKeys[destObj.objectName] = true;
    }

    int syncCount = 0;
    foreach s3:S3Object srcObj in sourceObjects {
        if !destKeys.hasKey(srcObj.objectName) {
            do {
                string copySource = string `/${sourceBucket}/${srcObj.objectName}`;
                check s3Client->copyObject(destBucket, srcObj.objectName, copySource);
                syncCount += 1;
                log:printInfo("Synced object", key = srcObj.objectName);
            } on fail error e {
                log:printError("Failed to sync object",
                    key = srcObj.objectName, 'error = e);
            }
        }
    }

    log:printInfo("Sync completed", totalSynced = syncCount);
}
```

## Example 4: Large File Multipart Upload

Upload large files using multipart upload with progress tracking.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string bucketName = ?;

final s3:Client s3Client = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

const int PART_SIZE = 5 * 1024 * 1024; // 5 MB per part

public function main() returns error? {
    string localPath = "./large-dataset.zip";
    string objectKey = "datasets/large-dataset.zip";

    byte[] fileContent = check io:fileReadBytes(localPath);
    int totalSize = fileContent.length();

    if totalSize < PART_SIZE {
        // Use simple upload for small files
        check s3Client->createObject(bucketName, objectKey, fileContent);
        log:printInfo("File uploaded via simple upload", size = totalSize);
        return;
    }

    // Initiate multipart upload
    string uploadId = check s3Client->createMultipartUpload(bucketName, objectKey);
    log:printInfo("Multipart upload initiated", uploadId = uploadId);

    s3:CompletedPart[] completedParts = [];
    int partNumber = 1;
    int offset = 0;

    do {
        while offset < totalSize {
            int end = offset + PART_SIZE;
            if end > totalSize {
                end = totalSize;
            }

            byte[] partData = fileContent.slice(offset, end);
            s3:CompletedPart part = check s3Client->uploadPart(
                bucketName, objectKey, uploadId, partNumber, partData
            );
            completedParts.push(part);

            int progress = (end * 100) / totalSize;
            log:printInfo("Part uploaded",
                partNumber = partNumber, progress = progress);

            partNumber += 1;
            offset = end;
        }

        // Complete multipart upload
        check s3Client->completeMultipartUpload(
            bucketName, objectKey, uploadId, completedParts
        );
        log:printInfo("Multipart upload completed successfully");
    } on fail error e {
        log:printError("Upload failed, aborting", 'error = e);
        check s3Client->abortMultipartUpload(bucketName, objectKey, uploadId);
    }
}
```

## Example 5: S3 Event-Driven Data Processing Pipeline

An HTTP service that receives S3 event notifications and processes uploaded CSV files.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

final s3:Client s3Client = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

type S3EventRecord record {
    record {
        record {
            string name;
        } bucket;
        record {
            string key;
            int size;
        } 'object;
    } s3;
};

type S3Event record {
    S3EventRecord[] Records;
};

service /webhook on new http:Listener(9090) {

    resource function post s3events(S3Event event) returns json|error {
        foreach S3EventRecord rec in event.Records {
            string bucket = rec.s3.bucket.name;
            string key = rec.s3.'object.key;

            log:printInfo("Processing S3 event",
                bucket = bucket, key = key);

            if key.endsWith(".csv") {
                s3:S3Object obj = check s3Client->getObject(bucket, key);
                if obj.content is byte[] {
                    string csvContent = check string:fromBytes(
                        <byte[]>obj.content);
                    // Process CSV data
                    string[] lines = re`\n`.split(csvContent);
                    log:printInfo("CSV processed",
                        key = key, rowCount = lines.length());

                    // Store processed result
                    string resultKey = key.substring(0, key.length() - 4)
                        + "_processed.json";
                    check s3Client->createObject(bucket, resultKey,
                        string `{"rowsProcessed": ${lines.length()}}`);
                }
            }
        }

        return {status: "processed"};
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
