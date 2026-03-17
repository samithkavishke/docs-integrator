---
title: "Salesforce Trigger - Examples"
description: "Code examples for the ballerinax/trigger.salesforce connector."
---

# Salesforce Trigger Examples

## Example 1: Sync Salesforce contacts to a database

```ballerina
import ballerina/log;
import ballerinax/trigger.salesforce;

configurable string username = ?;
configurable string password = ?;

listener salesforce:Listener sfListener = new ({
    username,
    password
});

service salesforce:RecordService on sfListener {
    remote function onCreate(salesforce:EventData payload) returns error? {
        log:printInfo("New contact created in Salesforce",
            recordId = payload.metadata.recordId);
        // Sync to external database
        check syncToDatabase("INSERT", payload);
    }

    remote function onUpdate(salesforce:EventData payload) returns error? {
        log:printInfo("Contact updated in Salesforce",
            changedFields = payload.changedFields.toString());
        check syncToDatabase("UPDATE", payload);
    }

    remote function onDelete(salesforce:EventData payload) returns error? {
        log:printInfo("Contact deleted from Salesforce",
            recordId = payload.metadata.recordId);
        check syncToDatabase("DELETE", payload);
    }

    remote function onRestore(salesforce:EventData payload) returns error? {
        log:printInfo("Contact restored in Salesforce");
        check syncToDatabase("INSERT", payload);
    }
}

function syncToDatabase(string operation, salesforce:EventData data) returns error? {
    log:printInfo("Syncing to database",
        operation = operation,
        recordId = data.metadata.recordId);
}
```

## Example 2: Opportunity notification pipeline

```ballerina
import ballerina/log;
import ballerinax/trigger.salesforce;

configurable string username = ?;
configurable string password = ?;

listener salesforce:Listener sfListener = new ({
    username,
    password
});

service salesforce:RecordService on sfListener {
    remote function onCreate(salesforce:EventData payload) returns error? {
        if payload.metadata.objectType == "Opportunity" {
            log:printInfo("New opportunity detected",
                recordId = payload.metadata.recordId);
            // Send notification to sales team
        }
    }

    remote function onUpdate(salesforce:EventData payload) returns error? {
        if payload.metadata.objectType == "Opportunity" {
            log:printInfo("Opportunity updated",
                changedFields = payload.changedFields.toString());
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

## Example 3: Config.toml

```toml
# Config.toml
username = "admin@company.com"
password = "MyPassword123SecurityToken"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
