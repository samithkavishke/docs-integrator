---
title: "Google Drive Trigger"
description: "Overview of the ballerinax/trigger.google.drive connector for WSO2 Integrator."
---

# Google Drive Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.google.drive`](https://central.ballerina.io/ballerinax/trigger.google.drive/latest) |
| **Version** | 0.11.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.google.drive/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.google.drive/latest#functions) |

## Overview

The `ballerinax/trigger.google.drive` module provides a listener that receives events when files and folders are created, updated, trashed, or deleted in Google Drive. It polls the Google Drive API v3 for changes and dispatches events to your Ballerina service through dedicated remote functions.

The listener uses OAuth 2.0 credentials to authenticate with Google Drive and automatically registers a watch channel to detect changes in the user's drive.

### Supported events

| Event | Remote function | Description |
|---|---|---|
| File created | `onFileCreate` | A new file is added to the drive |
| Folder created | `onFolderCreate` | A new folder is created |
| File updated | `onFileUpdate` | An existing file is modified |
| Folder updated | `onFolderUpdate` | An existing folder is modified |
| File trashed | `onFileTrash` | A file is moved to the trash |
| Folder trashed | `onFolderTrash` | A folder is moved to the trash |
| Deleted | `onDelete` | A file or folder is permanently deleted |

### Common use cases

- **Automated document processing** -- Trigger a workflow when new files are uploaded to a shared Drive folder, such as parsing invoices or extracting data from uploaded PDFs.
- **Backup and sync** -- Detect file changes in Google Drive and replicate them to an external storage system such as AWS S3 or Azure Blob Storage.
- **Audit and compliance logging** -- Record every file creation, modification, and deletion for compliance reporting.
- **Content moderation** -- Scan newly uploaded files for policy violations or sensitive data.

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.google.drive"
version = "0.11.0"
```

```ballerina
import ballerinax/trigger.google.drive as drive;
import ballerina/log;

listener drive:Listener driveListener = new (listenerConfig = {
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: "<REFRESH_TOKEN>",
        clientId: "<CLIENT_ID>",
        clientSecret: "<CLIENT_SECRET>"
    }
});

service drive:DriveService on driveListener {
    remote function onFileCreate(drive:Change changeInfo) returns error? {
        log:printInfo("New file created", fileId = changeInfo?.fileId.toString());
    }

    remote function onFileUpdate(drive:Change changeInfo) returns error? {
        log:printInfo("File updated", fileId = changeInfo?.fileId.toString());
    }

    remote function onFolderCreate(drive:Change changeInfo) returns error? { return; }
    remote function onFolderUpdate(drive:Change changeInfo) returns error? { return; }
    remote function onFileTrash(drive:Change changeInfo) returns error? { return; }
    remote function onFolderTrash(drive:Change changeInfo) returns error? { return; }
    remote function onDelete(drive:Change changeInfo) returns error? { return; }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.google.drive/latest)
