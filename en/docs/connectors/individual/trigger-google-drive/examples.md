---
title: "Google Drive Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.google.drive connector."
---

# Google Drive Trigger Examples

## Example 1: Log all file and folder changes

A minimal listener that logs every Google Drive event. This is useful for understanding the event flow during development.

```ballerina
import ballerina/log;
import ballerinax/trigger.google.drive as drive;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

listener drive:Listener driveListener = new (listenerConfig = {
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

service drive:DriveService on driveListener {

    remote function onFileCreate(drive:Change changeInfo) returns error? {
        log:printInfo("File created", fileId = changeInfo?.fileId.toString());
    }

    remote function onFolderCreate(drive:Change changeInfo) returns error? {
        log:printInfo("Folder created", fileId = changeInfo?.fileId.toString());
    }

    remote function onFileUpdate(drive:Change changeInfo) returns error? {
        log:printInfo("File updated", fileId = changeInfo?.fileId.toString());
    }

    remote function onFolderUpdate(drive:Change changeInfo) returns error? {
        log:printInfo("Folder updated", fileId = changeInfo?.fileId.toString());
    }

    remote function onFileTrash(drive:Change changeInfo) returns error? {
        log:printInfo("File trashed", fileId = changeInfo?.fileId.toString());
    }

    remote function onFolderTrash(drive:Change changeInfo) returns error? {
        log:printInfo("Folder trashed", fileId = changeInfo?.fileId.toString());
    }

    remote function onDelete(drive:Change changeInfo) returns error? {
        log:printInfo("Item permanently deleted",
            fileId = changeInfo?.fileId.toString());
    }
}
```

**Config.toml:**

```toml
refreshToken = "<YOUR_REFRESH_TOKEN>"
clientId = "<YOUR_CLIENT_ID>"
clientSecret = "<YOUR_CLIENT_SECRET>"
```

## Example 2: Forward new file events to a downstream API

When a new file is created in Google Drive, this example sends the file metadata to an external REST API for processing (e.g., document indexing or approval workflow).

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.google.drive as drive;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string downstreamUrl = ?;

listener drive:Listener driveListener = new (listenerConfig = {
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

final http:Client apiClient = check new (downstreamUrl);

service drive:DriveService on driveListener {

    remote function onFileCreate(drive:Change changeInfo) returns error? {
        json payload = {
            event: "file_created",
            fileId: changeInfo?.fileId,
            timestamp: changeInfo?.time
        };
        http:Response resp = check apiClient->post("/drive-events", payload);
        log:printInfo("Forwarded file create event",
            statusCode = resp.statusCode);
    }

    remote function onFolderCreate(drive:Change changeInfo) returns error? { return; }
    remote function onFileUpdate(drive:Change changeInfo) returns error? { return; }
    remote function onFolderUpdate(drive:Change changeInfo) returns error? { return; }
    remote function onFileTrash(drive:Change changeInfo) returns error? { return; }
    remote function onFolderTrash(drive:Change changeInfo) returns error? { return; }
    remote function onDelete(drive:Change changeInfo) returns error? { return; }
}
```

## Example 3: Audit trail for file deletions

This example records file trash and permanent delete events to a log store, providing an audit trail for compliance purposes.

```ballerina
import ballerina/log;
import ballerina/time;
import ballerinax/trigger.google.drive as drive;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

listener drive:Listener driveListener = new (listenerConfig = {
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

service drive:DriveService on driveListener {

    remote function onFileTrash(drive:Change changeInfo) returns error? {
        string timestamp = time:utcToString(time:utcNow());
        log:printInfo("AUDIT: File trashed",
            fileId = changeInfo?.fileId.toString(),
            timestamp = timestamp);
    }

    remote function onFolderTrash(drive:Change changeInfo) returns error? {
        string timestamp = time:utcToString(time:utcNow());
        log:printInfo("AUDIT: Folder trashed",
            fileId = changeInfo?.fileId.toString(),
            timestamp = timestamp);
    }

    remote function onDelete(drive:Change changeInfo) returns error? {
        string timestamp = time:utcToString(time:utcNow());
        log:printInfo("AUDIT: Permanent deletion",
            fileId = changeInfo?.fileId.toString(),
            timestamp = timestamp);
    }

    remote function onFileCreate(drive:Change changeInfo) returns error? { return; }
    remote function onFolderCreate(drive:Change changeInfo) returns error? { return; }
    remote function onFileUpdate(drive:Change changeInfo) returns error? { return; }
    remote function onFolderUpdate(drive:Change changeInfo) returns error? { return; }
}
```

## Running the examples

1. Set up OAuth 2.0 credentials as described in the [Setup Guide](setup).
2. Provide credentials in `Config.toml`.
3. Compile and run:

   ```bash
   bal run
   ```

4. Create, edit, or delete a file in your Google Drive to see the events dispatched to your service.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
