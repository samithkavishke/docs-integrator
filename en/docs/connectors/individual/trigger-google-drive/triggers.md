---
title: "Google Drive Trigger - Triggers"
description: "Available trigger events and payload types for the ballerinax/trigger.google.drive connector."
---

# Google Drive Trigger - Available Events

The `ballerinax/trigger.google.drive` listener polls the Google Drive API v3 for changes and dispatches events through the `DriveService` service type. The listener detects file and folder creation, updates, trash operations, and permanent deletions.

## Listener initialization

Create the listener by providing OAuth 2.0 credentials for the Google Drive API.

```ballerina
import ballerinax/trigger.google.drive as drive;

listener drive:Listener driveListener = new (listenerConfig = {
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: "<REFRESH_TOKEN>",
        clientId: "<CLIENT_ID>",
        clientSecret: "<CLIENT_SECRET>"
    }
});
```

You can externalize the credentials using `Config.toml`:

```toml
# Config.toml
[listenerConfig.auth]
refreshUrl = "https://oauth2.googleapis.com/token"
refreshToken = "<REFRESH_TOKEN>"
clientId = "<CLIENT_ID>"
clientSecret = "<CLIENT_SECRET>"
```

## Service type: `DriveService`

The `drive:DriveService` requires implementing all seven remote functions. Each function receives a `drive:Change` payload.

```ballerina
service drive:DriveService on driveListener {

    remote function onFileCreate(drive:Change changeInfo) returns error? {
        // A new file was added to the drive
    }

    remote function onFolderCreate(drive:Change changeInfo) returns error? {
        // A new folder was created
    }

    remote function onFileUpdate(drive:Change changeInfo) returns error? {
        // An existing file was modified
    }

    remote function onFolderUpdate(drive:Change changeInfo) returns error? {
        // An existing folder was modified
    }

    remote function onFileTrash(drive:Change changeInfo) returns error? {
        // A file was moved to the trash
    }

    remote function onFolderTrash(drive:Change changeInfo) returns error? {
        // A folder was moved to the trash
    }

    remote function onDelete(drive:Change changeInfo) returns error? {
        // A file or folder was permanently deleted
    }
}
```

## Event details

### `onFileCreate`

Triggered when a new file (document, image, PDF, etc.) is uploaded or created in Google Drive.

### `onFolderCreate`

Triggered when a new folder is created in the drive hierarchy.

### `onFileUpdate`

Triggered when the content or metadata of an existing file changes. This includes renaming, moving, or editing the file.

### `onFolderUpdate`

Triggered when a folder's metadata changes, such as renaming or moving the folder.

### `onFileTrash`

Triggered when a file is moved to the Drive trash. The file is not permanently deleted at this point and can still be recovered.

### `onFolderTrash`

Triggered when a folder is moved to the Drive trash.

### `onDelete`

Triggered when a file or folder is permanently removed from the drive (emptied from trash or deleted via API).

## `Change` payload

All events deliver a `drive:Change` record. Key fields include:

| Field | Type | Description |
|---|---|---|
| `fileId` | `string?` | The ID of the affected file or folder |
| `time` | `string?` | The time of the change |
| `removed` | `boolean?` | Whether the item was removed from the drive |
| `file` | `record {}?` | The full file resource metadata, including name, mimeType, and parents |

```ballerina
remote function onFileCreate(drive:Change changeInfo) returns error? {
    string? fileId = changeInfo?.fileId;
    log:printInfo("File created", fileId = fileId.toString());
}
```

## Error handling

Each remote function returns `error?`. Use `do`/`on fail` for structured error handling:

```ballerina
remote function onFileCreate(drive:Change changeInfo) returns error? {
    do {
        string? fileId = changeInfo?.fileId;
        // Process the new file
        log:printInfo("Processing new file", fileId = fileId.toString());
    } on fail error e {
        log:printError("Failed to process file creation event", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
