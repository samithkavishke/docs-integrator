---
title: "Amazon S3 - Actions"
description: "Available actions and operations for the ballerinax/aws.s3 connector."
---

# Amazon S3 Actions

The `ballerinax/aws.s3` package provides a comprehensive client for interacting with Amazon S3 buckets and objects.

## Client Initialization

```ballerina
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

s3:ConnectionConfig s3Config = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
};

s3:Client s3Client = check new (s3Config);
```

## Bucket Operations

### List Buckets

Retrieve all S3 buckets owned by the authenticated user.

```ballerina
s3:Bucket[] buckets = check s3Client->listBuckets();
foreach s3:Bucket bucket in buckets {
    io:println("Bucket: ", bucket.name, " | Created: ", bucket.creationDate);
}
```

### Create Bucket

Create a new S3 bucket in the configured region.

```ballerina
check s3Client->createBucket("my-integration-bucket");
```

Create a bucket in a specific region:

```ballerina
check s3Client->createBucket("my-eu-bucket", "eu-west-1");
```

### Delete Bucket

Delete an empty S3 bucket.

```ballerina
check s3Client->deleteBucket("my-integration-bucket");
```

## Object Operations

### Put Object

Upload an object to an S3 bucket. Supports string, byte array, and stream payloads.

**Upload a string:**

```ballerina
check s3Client->createObject("my-bucket", "data/report.txt",
    "This is the report content");
```

**Upload binary data (bytes):**

```ballerina
byte[] imageData = check io:fileReadBytes("./local-image.png");
check s3Client->createObject("my-bucket", "images/photo.png", imageData);
```

**Upload with content type:**

```ballerina
s3:ObjectCreationHeaders headers = {
    contentType: "application/json"
};
check s3Client->createObject("my-bucket", "config/settings.json",
    "{\"key\": \"value\"}", headers);
```

### Get Object

Download an object from an S3 bucket.

```ballerina
s3:S3Object s3Obj = check s3Client->getObject("my-bucket", "data/report.txt");
if s3Obj.content is byte[] {
    string content = check string:fromBytes(<byte[]>s3Obj.content);
    io:println("Content: ", content);
}
```

### Delete Object

Remove an object from a bucket.

```ballerina
check s3Client->deleteObject("my-bucket", "data/old-report.txt");
```

### Copy Object

Copy an object within or across buckets.

```ballerina
check s3Client->copyObject("destination-bucket", "backup/report.txt",
    "/source-bucket/data/report.txt");
```

### List Objects

List objects in a bucket with optional prefix filtering.

```ballerina
s3:S3Object[] objects = check s3Client->listObjects("my-bucket");
foreach s3:S3Object obj in objects {
    io:println("Key: ", obj.objectName, " | Size: ", obj.objectSize);
}
```

**List with prefix filter:**

```ballerina
s3:S3Object[] dataFiles = check s3Client->listObjects("my-bucket",
    prefix = "data/");
```

**List with delimiter for directory-like listing:**

```ballerina
s3:S3Object[] topLevel = check s3Client->listObjects("my-bucket",
    delimiter = "/");
```

**List with pagination (max keys):**

```ballerina
s3:S3Object[] page = check s3Client->listObjects("my-bucket",
    maxKeys = 100);
```

### Delete Multiple Objects

Delete multiple objects in a single request.

```ballerina
check s3Client->deleteObjects("my-bucket", ["file1.txt", "file2.txt", "file3.txt"]);
```

## Presigned URLs

### Generate Presigned URL

Create a time-limited URL that allows temporary access to a private object without AWS credentials. Useful for sharing files with external users or systems.

```ballerina
string presignedUrl = check s3Client->generatePresignedUrl("my-bucket",
    "reports/quarterly.pdf", 3600);
io:println("Download link (valid for 1 hour): ", presignedUrl);
```

## Multipart Upload Operations

For uploading large files (greater than 5 GB or when network reliability requires chunked uploads), use the multipart upload API.

### Create Multipart Upload

```ballerina
string uploadId = check s3Client->createMultipartUpload("my-bucket",
    "large-files/backup.zip");
io:println("Multipart upload initiated. Upload ID: ", uploadId);
```

### Upload Part

```ballerina
byte[] partData = check io:fileReadBytes("./part1.dat");
s3:CompletedPart part1 = check s3Client->uploadPart("my-bucket",
    "large-files/backup.zip", uploadId, 1, partData);
```

### Complete Multipart Upload

```ballerina
s3:CompletedPart[] completedParts = [part1, part2, part3];
check s3Client->completeMultipartUpload("my-bucket",
    "large-files/backup.zip", uploadId, completedParts);
```

### Abort Multipart Upload

Cancel an in-progress multipart upload and clean up uploaded parts.

```ballerina
check s3Client->abortMultipartUpload("my-bucket",
    "large-files/backup.zip", uploadId);
```

## Error Handling

All S3 operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` blocks for custom handling:

```ballerina
import ballerina/log;

do {
    s3:S3Object obj = check s3Client->getObject("my-bucket", "missing-key.txt");
} on fail error e {
    log:printError("S3 operation failed", 'error = e, bucket = "my-bucket");
}
```

### Common Error Scenarios

| Error | Cause | Resolution |
|---|---|---|
| `NoSuchBucket` | Bucket does not exist | Verify bucket name and region |
| `NoSuchKey` | Object key not found | Check the object key path |
| `AccessDenied` | Insufficient IAM permissions | Update IAM policy |
| `BucketNotEmpty` | Attempting to delete non-empty bucket | Delete all objects first |
| `EntityTooLarge` | Object exceeds 5 GB single upload limit | Use multipart upload |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Documentation](https://central.ballerina.io/ballerinax/aws.s3/3.5.1)
