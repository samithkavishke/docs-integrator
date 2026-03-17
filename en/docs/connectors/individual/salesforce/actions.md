---
title: "Salesforce - Actions"
description: "Available actions and operations for the ballerinax/salesforce connector."
---

# Salesforce Actions

The `ballerinax/salesforce` package provides a comprehensive client with operations spanning REST API, SOAP API, Bulk API, and APEX REST API for interacting with Salesforce.

## Client Initialization

```ballerina
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

salesforce:Client salesforce = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});
```

## SOQL and SOSL Query Operations

### query

Execute a SOQL query and return results as a stream.

```ballerina
stream<record {}, error?> resultStream = check salesforce->query(
    "SELECT Id, Name, Email FROM Contact WHERE MailingCity = 'San Francisco'"
);

check resultStream.forEach(function(record {} rec) {
    io:println(rec);
});
```

### query with custom types

Use Ballerina record types to get strongly typed results.

```ballerina
type ContactRecord record {|
    string Id;
    string Name;
    string Email;
    string Phone;
|};

stream<ContactRecord, error?> contacts = check salesforce->query(
    "SELECT Id, Name, Email, Phone FROM Contact WHERE Department = 'Engineering'"
);
```

### search

Execute a SOSL search across multiple objects.

```ballerina
salesforce:SoslSearchResult searchResult = check salesforce->search(
    "FIND {Acme} IN ALL FIELDS RETURNING Account(Id, Name), Contact(Id, Name, Email)"
);
```

## sObject CRUD Operations

### create

Create a new sObject record and return the creation response.

```ballerina
salesforce:CreationResponse response = check salesforce->create("Account", {
    "Name": "Acme Corporation",
    "Industry": "Technology",
    "BillingCity": "San Francisco",
    "BillingState": "CA",
    "Phone": "(415) 555-1234"
});

string accountId = response.id;
```

### getById

Retrieve an sObject record by its ID.

```ballerina
record {} account = check salesforce->getById("Account", accountId);
```

### getByExternalId

Retrieve an sObject record by an external ID field.

```ballerina
record {} account = check salesforce->getByExternalId("Account", "External_Id__c", "EXT-001");
```

### update

Update an existing sObject record.

```ballerina
check salesforce->update("Account", accountId, {
    "Phone": "(415) 555-5678",
    "Website": "https://www.acme.com"
});
```

### upsert

Insert or update a record based on an external ID field.

```ballerina
salesforce:UpsertResult upsertResult = check salesforce->upsert("Account", "External_Id__c", {
    "External_Id__c": "EXT-001",
    "Name": "Acme Corporation",
    "Industry": "Technology"
});
```

### delete

Delete an sObject record by ID.

```ballerina
check salesforce->delete("Account", accountId);
```

## Describe Operations

### describeAvailableObjects

Get metadata about all available sObjects in the org.

```ballerina
salesforce:OrgMetadata orgMetadata = check salesforce->describeAvailableObjects();
```

### describeSObject

Get detailed metadata about a specific sObject.

```ballerina
salesforce:SObjectMetaData accountMeta = check salesforce->describeSObject("Account");
```

### getOrganizationMetaData

Get metadata about the Salesforce organization.

```ballerina
salesforce:OrganizationMetadata orgInfo = check salesforce->getOrganizationMetaData();
```

## Bulk API Operations

### createJob

Create a bulk job for large-volume data operations.

```ballerina
salesforce:BulkJob bulkJob = check salesforce->createJob("insert", "Contact", "JSON");
```

### addBatch

Add a batch of records to an existing bulk job.

```ballerina
json contactsBatch = [
    {"FirstName": "John", "LastName": "Doe", "Email": "john.doe@example.com"},
    {"FirstName": "Jane", "LastName": "Smith", "Email": "jane.smith@example.com"},
    {"FirstName": "Bob", "LastName": "Wilson", "Email": "bob.wilson@example.com"}
];

salesforce:BatchInfo batchInfo = check salesforce->addBatch(bulkJob.id, contactsBatch);
```

### getBatchInfo

Check the status of a batch within a bulk job.

```ballerina
salesforce:BatchInfo batchStatus = check salesforce->getBatchInfo(bulkJob.id, batchInfo.id);
io:println("Batch state: ", batchStatus.state);
```

### closeJob

Close a bulk job after all batches have been added.

```ballerina
salesforce:BulkJob closedJob = check salesforce->closeJob(bulkJob.id);
```

### getBatchResult

Retrieve the results of a completed batch.

```ballerina
json batchResult = check salesforce->getBatchResult(bulkJob.id, batchInfo.id);
```

## APEX REST Operations

### apexRestExecute

Execute a custom Apex REST endpoint.

```ballerina
// GET request to a custom Apex REST endpoint
json getResult = check salesforce->apexRestExecute("/services/apexrest/CustomEndpoint", "GET", ());

// POST request with a payload
json postResult = check salesforce->apexRestExecute(
    "/services/apexrest/CustomEndpoint",
    "POST",
    {"param1": "value1", "param2": "value2"}
);
```

## Listener Operations

### Change Data Capture Events

Subscribe to record change events for real-time processing.

```ballerina
import ballerina/io;
import ballerinax/salesforce;

configurable string username = ?;
configurable string password = ?;

salesforce:ListenerConfig listenerConfig = {
    auth: {
        username: username,
        password: password
    }
};

listener salesforce:Listener eventListener = new (listenerConfig);

service "/data/ChangeEvents" on eventListener {
    remote function onCreate(salesforce:EventData payload) {
        io:println("Record created: ", payload.toString());
    }

    remote isolated function onUpdate(salesforce:EventData payload) {
        io:println("Record updated: ", payload.toString());
    }

    remote function onDelete(salesforce:EventData payload) {
        io:println("Record deleted: ", payload.toString());
    }

    remote function onRestore(salesforce:EventData payload) {
        io:println("Record restored: ", payload.toString());
    }
}
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` for structured error handling:

```ballerina
do {
    salesforce:CreationResponse res = check salesforce->create("Account", {
        "Name": "Test Account"
    });
    io:println("Created account: ", res.id);
} on fail error e {
    io:println("Error code: ", e.message());
    log:printError("Salesforce operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/salesforce/latest#clients)
