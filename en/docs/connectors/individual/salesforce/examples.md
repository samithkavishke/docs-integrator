---
title: "Salesforce - Examples"
description: "Code examples for the ballerinax/salesforce connector."
---

# Salesforce Examples

## Example 1: SOQL Query with Typed Records

Query Salesforce contacts and map results to Ballerina records for type-safe processing.

```ballerina
import ballerina/io;
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

type ContactRecord record {|
    string Id;
    string FirstName;
    string LastName;
    string Email;
    string? Phone;
    string? Department;
|};

public function main() returns error? {
    salesforce:Client sf = check new ({
        baseUrl: baseUrl,
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    string soqlQuery = "SELECT Id, FirstName, LastName, Email, Phone, Department " +
                       "FROM Contact WHERE Department = 'Engineering' " +
                       "ORDER BY LastName ASC LIMIT 50";

    stream<ContactRecord, error?> contacts = check sf->query(soqlQuery);

    int count = 0;
    check contacts.forEach(function(ContactRecord contact) {
        io:println(string `Contact: ${contact.FirstName} ${contact.LastName} - ${contact.Email}`);
        count += 1;
    });

    io:println(string `Total engineering contacts: ${count}`);
}
```

```toml
# Config.toml
baseUrl = "https://your-instance.my.salesforce.com"
clientId = "<consumer-key>"
clientSecret = "<consumer-secret>"
refreshToken = "<refresh-token>"
refreshUrl = "https://login.salesforce.com/services/oauth2/token"
```

## Example 2: Account and Contact CRUD Operations

Create an account with associated contacts, then update and query them.

```ballerina
import ballerina/io;
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

public function main() returns error? {
    salesforce:Client sf = check new ({
        baseUrl: baseUrl,
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    // Create an Account
    salesforce:CreationResponse accountRes = check sf->create("Account", {
        "Name": "TechStart Inc.",
        "Industry": "Technology",
        "BillingCity": "Austin",
        "BillingState": "TX",
        "Phone": "(512) 555-0100",
        "Website": "https://www.techstart.example.com"
    });
    string accountId = accountRes.id;
    io:println("Created Account: ", accountId);

    // Create Contacts linked to the Account
    salesforce:CreationResponse contact1Res = check sf->create("Contact", {
        "AccountId": accountId,
        "FirstName": "Alice",
        "LastName": "Johnson",
        "Email": "alice.johnson@techstart.example.com",
        "Title": "CTO"
    });
    io:println("Created Contact: ", contact1Res.id);

    salesforce:CreationResponse contact2Res = check sf->create("Contact", {
        "AccountId": accountId,
        "FirstName": "Bob",
        "LastName": "Martinez",
        "Email": "bob.martinez@techstart.example.com",
        "Title": "VP of Engineering"
    });
    io:println("Created Contact: ", contact2Res.id);

    // Update the Account with additional details
    check sf->update("Account", accountId, {
        "NumberOfEmployees": 150,
        "Description": "Fast-growing technology startup specializing in cloud infrastructure"
    });
    io:println("Updated Account details");

    // Query all contacts for this account
    stream<record {}, error?> relatedContacts = check sf->query(
        string `SELECT Id, Name, Title, Email FROM Contact WHERE AccountId = '${accountId}'`
    );

    io:println("Contacts for TechStart Inc.:");
    check relatedContacts.forEach(function(record {} c) {
        io:println("  - ", c);
    });
}
```

## Example 3: Bulk Data Import with Bulk API

Import a large number of records using the Salesforce Bulk API for efficient processing.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

public function main() returns error? {
    salesforce:Client sf = check new ({
        baseUrl: baseUrl,
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    // Create a bulk insert job for Contacts
    salesforce:BulkJob bulkJob = check sf->createJob("insert", "Contact", "JSON");
    io:println("Created Bulk Job: ", bulkJob.id);

    // Prepare batch data
    json contactsBatch = [
        {"FirstName": "John", "LastName": "Doe", "Email": "john.doe@example.com", "Department": "Sales"},
        {"FirstName": "Jane", "LastName": "Smith", "Email": "jane.smith@example.com", "Department": "Marketing"},
        {"FirstName": "Mike", "LastName": "Brown", "Email": "mike.brown@example.com", "Department": "Engineering"},
        {"FirstName": "Sarah", "LastName": "Davis", "Email": "sarah.davis@example.com", "Department": "Support"},
        {"FirstName": "Tom", "LastName": "Wilson", "Email": "tom.wilson@example.com", "Department": "Sales"}
    ];

    // Add batch to the job
    salesforce:BatchInfo batchInfo = check sf->addBatch(bulkJob.id, contactsBatch);
    io:println("Added batch: ", batchInfo.id);

    // Close the job to start processing
    _ = check sf->closeJob(bulkJob.id);

    // Poll for batch completion
    salesforce:BatchInfo status = check sf->getBatchInfo(bulkJob.id, batchInfo.id);
    while status.state == "Queued" || status.state == "InProgress" {
        runtime:sleep(2);
        status = check sf->getBatchInfo(bulkJob.id, batchInfo.id);
        io:println("Batch status: ", status.state);
    }

    // Get results
    if status.state == "Completed" {
        json results = check sf->getBatchResult(bulkJob.id, batchInfo.id);
        io:println("Batch results: ", results);
    } else {
        io:println("Batch failed with state: ", status.state);
    }
}
```

## Example 4: Change Data Capture Event Listener

Listen for real-time changes to Salesforce records and process them as they occur.

```ballerina
import ballerina/io;
import ballerina/log;
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
        string objectType = payload?.metadata?.objectType ?: "Unknown";
        io:println(string `[CREATE] New ${objectType} record created`);
        io:println("  Payload: ", payload.toString());
    }

    remote isolated function onUpdate(salesforce:EventData payload) {
        io:println("[UPDATE] Record updated");
        io:println("  Changed fields: ", payload?.changedFields.toString());
    }

    remote function onDelete(salesforce:EventData payload) {
        io:println("[DELETE] Record deleted");
        log:printWarn("Record deletion detected", recordId = payload?.metadata?.recordId);
    }

    remote function onRestore(salesforce:EventData payload) {
        io:println("[RESTORE] Record restored from recycle bin");
    }
}
```

```toml
# Config.toml
username = "your-salesforce-username"
password = "your-password-and-security-token"
```

## Example 5: REST API Integration Service

Expose a REST API that acts as a bridge between external systems and Salesforce.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/salesforce;

configurable string baseUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

final salesforce:Client sfClient = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});

type LeadInput record {|
    string firstName;
    string lastName;
    string company;
    string email;
    string? phone;
|};

service /api/v1 on new http:Listener(8090) {

    resource function post leads(LeadInput input) returns http:Created|http:InternalServerError {
        do {
            salesforce:CreationResponse res = check sfClient->create("Lead", {
                "FirstName": input.firstName,
                "LastName": input.lastName,
                "Company": input.company,
                "Email": input.email,
                "Phone": input?.phone
            });

            log:printInfo("Lead created in Salesforce", leadId = res.id);
            return <http:Created>{body: {id: res.id, message: "Lead created successfully"}};
        } on fail error e {
            log:printError("Failed to create lead", 'error = e);
            return <http:InternalServerError>{body: {message: "Failed to create lead in Salesforce"}};
        }
    }

    resource function get leads(string? department) returns json|http:InternalServerError {
        do {
            string query = "SELECT Id, FirstName, LastName, Company, Email, Status FROM Lead";
            if department is string {
                query += string ` WHERE Department__c = '${department}'`;
            }
            query += " ORDER BY CreatedDate DESC LIMIT 100";

            stream<record {}, error?> leads = check sfClient->query(query);
            record {}[] leadList = [];
            check leads.forEach(function(record {} lead) {
                leadList.push(lead);
            });

            return leadList;
        } on fail error e {
            log:printError("Failed to query leads", 'error = e);
            return <http:InternalServerError>{body: {message: "Failed to fetch leads"}};
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
