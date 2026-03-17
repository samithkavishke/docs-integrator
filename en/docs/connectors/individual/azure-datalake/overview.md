---
title: "Azure Data Lake"
description: "Overview of the ballerinax/azure.datalake connector for WSO2 Integrator."
---

# Azure Data Lake

| | |
|---|---|
| **Package** | [`ballerinax/azure.datalake`](https://central.ballerina.io/ballerinax/azure.datalake/latest) |
| **Version** | 1.5.1 |
| **Category** | Cloud Services - Storage |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure.datalake/1.5.1) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure.datalake/1.5.1#functions) |

## Overview

The `ballerinax/azure.datalake` connector provides programmatic access to Azure Data Lake Storage Gen2 from WSO2 Integrator. Azure Data Lake Storage Gen2 is a set of capabilities built on Azure Blob Storage, designed for big data analytics workloads. This connector enables you to manage file systems (containers), directories, and files within a Data Lake Storage account using the ADLS Gen2 REST API.

## Key Capabilities

- **File System Management** -- Create, list, and delete file systems (containers)
- **Directory Operations** -- Create, rename, delete, and list directories
- **File Operations** -- Upload, download, append, and delete files
- **Path Management** -- Get properties and set access controls on paths
- **Hierarchical Namespace** -- Work with the hierarchical file system structure

## Use Cases

| Scenario | Description |
|---|---|
| Data Lake Ingestion | Upload raw data files for analytics processing |
| ETL Pipelines | Read, transform, and write data across Data Lake directories |
| Log Archival | Store application and audit logs in organized directory structures |
| Data Export | Export processed data to Data Lake for consumption by analytics tools |
| Backup and Recovery | Create structured backups of application data in cloud storage |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "azure.datalake"
version = "1.5.1"
```

```ballerina
import ballerinax/azure.datalake;

configurable string accountName = ?;
configurable string accessKey = ?;

datalake:Client dlClient = check new ({
    accountName: accountName,
    accessKey: accessKey
});
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| ADLS Gen2 REST API | 2019-10-31 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure storage account and authentication
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/azure.datalake/1.5.1)
- [Azure Data Lake Storage Documentation](https://learn.microsoft.com/en-us/azure/storage/data-lake-storage/)
