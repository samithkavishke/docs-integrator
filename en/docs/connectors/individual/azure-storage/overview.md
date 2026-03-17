---
title: "Azure Blob Storage"
description: "Overview of the ballerinax/azure_storage_service connector for WSO2 Integrator."
---

# Azure Blob Storage

| | |
|---|---|
| **Package** | [`ballerinax/azure_storage_service`](https://central.ballerina.io/ballerinax/azure_storage_service/latest) |
| **Version** | 4.3.3 |
| **Category** | Cloud Services - Storage |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure_storage_service/4.3.3) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure_storage_service/4.3.3#functions) |

## Overview

The `ballerinax/azure_storage_service` connector provides programmatic access to Azure Blob Storage from WSO2 Integrator. Azure Blob Storage is a massively scalable object storage service for unstructured data. This connector enables you to manage containers, upload and download blobs, generate SAS tokens, and handle blob metadata.

## Key Capabilities

- **Container Management** -- Create, list, and delete blob containers
- **Blob Upload/Download** -- Upload and download block blobs, append blobs, and page blobs
- **SAS Token Generation** -- Create Shared Access Signature tokens for secure, scoped access
- **Blob Metadata** -- Set and retrieve custom metadata on blobs
- **Blob Listing** -- List blobs within containers with prefix filtering
- **Blob Properties** -- Get and set blob properties including content type and cache control

## Use Cases

| Scenario | Description |
|---|---|
| Document Storage | Store and retrieve business documents and media files |
| Backup and Archival | Archive data to Azure Blob Storage tiers (Hot, Cool, Archive) |
| Static Content Delivery | Serve static web content from blob containers |
| Data Pipeline Staging | Stage data files for Azure Data Factory or Synapse pipelines |
| Log Aggregation | Centralize application logs in blob storage |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "azure_storage_service"
version = "4.3.3"
```

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
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Azure Blob Storage API | 2021-08-06 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/azure_storage_service/4.3.3)
- [Azure Blob Storage Documentation](https://learn.microsoft.com/en-us/azure/storage/blobs/)
