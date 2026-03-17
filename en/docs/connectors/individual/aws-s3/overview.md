---
title: "Amazon S3"
description: "Overview of the ballerinax/aws.s3 connector for WSO2 Integrator."
---

# Amazon S3

| | |
|---|---|
| **Package** | [`ballerinax/aws.s3`](https://central.ballerina.io/ballerinax/aws.s3/latest) |
| **Version** | 3.5.1 |
| **Category** | Cloud Services - Storage |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.s3/3.5.1) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.s3/3.5.1#functions) |
| **AWS API Version** | 2006-03-01 |

## Overview

The `ballerinax/aws.s3` connector provides programmatic access to Amazon Simple Storage Service (S3) from WSO2 Integrator. Amazon S3 is an object storage service that offers scalability, data availability, security, and performance. This connector enables you to manage buckets, upload and download objects, configure access policies, generate presigned URLs, and perform multipart uploads for large files.

## Key Capabilities

- **Bucket Management** -- Create, list, and delete S3 buckets across AWS regions
- **Object CRUD** -- Upload, download, copy, and delete objects with metadata support
- **Presigned URLs** -- Generate time-limited URLs for secure object sharing without AWS credentials
- **Multipart Upload** -- Upload large files efficiently using multipart upload operations
- **Access Control** -- Configure bucket policies and object ACLs
- **Object Listing** -- List objects with prefix filtering and pagination support

## Use Cases

| Scenario | Description |
|---|---|
| File Archival | Store and retrieve documents, backups, and media files |
| Static Asset Hosting | Serve static web assets from S3 buckets |
| Data Lake Ingestion | Upload processed data to S3 for analytics pipelines |
| Secure File Sharing | Generate presigned URLs for temporary, secure file access |
| Cross-Region Replication | Copy objects between buckets in different regions |

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "aws.s3"
version = "3.5.1"
```

Import and initialize the client:

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

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Amazon S3 API | 2006-03-01 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/aws.s3/3.5.1)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
