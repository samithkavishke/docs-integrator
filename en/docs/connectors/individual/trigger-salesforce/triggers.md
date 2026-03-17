---
title: "Salesforce Trigger - Triggers"
description: "Available triggers for the ballerinax/trigger.salesforce connector."
---

# Salesforce Trigger Events

The `ballerinax/trigger.salesforce` module provides a Listener that subscribes to Salesforce Streaming API events.

## Listener setup

```ballerina
import ballerinax/trigger.salesforce;
import ballerina/log;

configurable string username = ?;
configurable string password = ?;

listener salesforce:Listener sfListener = new ({
    username,
    password
});
```

## Available events

### Record service (Change Data Capture)

Use `salesforce:RecordService` to listen to create, update, delete, and restore events on Salesforce objects.

```ballerina
service salesforce:RecordService on sfListener {
    remote function onCreate(salesforce:EventData payload) returns error? {
        log:printInfo("Record created",
            sobjectType = payload.metadata.objectType,
            recordId = payload.metadata.recordId);
    }

    remote function onUpdate(salesforce:EventData payload) returns error? {
        log:printInfo("Record updated",
            changedFields = payload.changedFields.toString());
    }

    remote function onDelete(salesforce:EventData payload) returns error? {
        log:printInfo("Record deleted",
            recordId = payload.metadata.recordId);
    }

    remote function onRestore(salesforce:EventData payload) returns error? {
        log:printInfo("Record restored",
            recordId = payload.metadata.recordId);
    }
}
```

### Event payload types

The `salesforce:EventData` record contains:

- `metadata` -- Event metadata including `objectType`, `recordId`, `changeType`, and `commitTimestamp`
- `changedFields` -- Map of fields that were modified (for update events)
- `payload` -- The full record data

## Error handling

```ballerina
service salesforce:RecordService on sfListener {
    remote function onCreate(salesforce:EventData payload) returns error? {
        do {
            check processNewRecord(payload);
        } on fail error e {
            log:printError("Failed to process new record", 'error = e);
        }
    }

    remote function onUpdate(salesforce:EventData payload) returns error? {
        do {
            check syncUpdatedRecord(payload);
        } on fail error e {
            log:printError("Failed to sync update", 'error = e);
        }
    }

    remote function onDelete(salesforce:EventData payload) returns error? {
        return;
    }

    remote function onRestore(salesforce:EventData payload) returns error? {
        return;
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
