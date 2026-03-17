---
title: "HubSpot CRM - Examples"
description: "Code examples for the ballerinax/hubspot.crm.contact connector."
---

# HubSpot CRM Examples

## Example 1: Contact Management Service

Expose a REST API to manage HubSpot contacts from external applications.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

final contact:Client hubspot = check new ({
    auth: { token: accessToken }
});

type ContactInput record {|
    string firstName;
    string lastName;
    string email;
    string? company;
    string? phone;
|};

service /api/contacts on new http:Listener(8090) {

    resource function post .(ContactInput input) returns http:Created|http:InternalServerError {
        do {
            contact:SimplePublicObject result = check hubspot->create({
                properties: {
                    "firstname": input.firstName,
                    "lastname": input.lastName,
                    "email": input.email,
                    "company": input?.company ?: "",
                    "phone": input?.phone ?: ""
                }
            });
            log:printInfo("Contact created", contactId = result.id);
            return <http:Created>{body: {id: result.id, message: "Contact created"}};
        } on fail error e {
            log:printError("Failed to create contact", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }

    resource function get [string id]() returns json|http:NotFound|http:InternalServerError {
        do {
            contact:SimplePublicObjectWithAssociations result = check hubspot->getById(id,
                properties = ["firstname", "lastname", "email", "company", "phone", "lifecyclestage"]
            );
            return result.properties;
        } on fail error e {
            log:printError("Failed to get contact", 'error = e);
            return <http:NotFound>{body: {message: "Contact not found"}};
        }
    }

    resource function get .(int 'limit = 20) returns json|http:InternalServerError {
        do {
            contact:CollectionResponseSimplePublicObjectWithAssociationsForwardPaging contacts =
                check hubspot->getPage(
                    'limit = 'limit,
                    properties = ["firstname", "lastname", "email", "company"]
                );
            return contacts.results.toJson();
        } on fail error e {
            log:printError("Failed to list contacts", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}
```

## Example 2: Batch Contact Import

Import multiple contacts from an external data source into HubSpot CRM.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

type CsvContact record {|
    string firstName;
    string lastName;
    string email;
    string company;
    string title;
|};

public function main() returns error? {
    contact:Client hubspot = check new ({
        auth: { token: accessToken }
    });

    // Sample contacts to import
    CsvContact[] contacts = [
        {firstName: "Alice", lastName: "Wang", email: "alice.wang@example.com", company: "TechCorp", title: "CTO"},
        {firstName: "Bob", lastName: "Garcia", email: "bob.garcia@example.com", company: "DataInc", title: "VP Engineering"},
        {firstName: "Carol", lastName: "Patel", email: "carol.patel@example.com", company: "CloudCo", title: "Director"},
        {firstName: "David", lastName: "Kim", email: "david.kim@example.com", company: "AILabs", title: "Lead Engineer"},
        {firstName: "Eva", lastName: "Brown", email: "eva.brown@example.com", company: "StartupX", title: "CEO"}
    ];

    // Build batch input
    contact:SimplePublicObjectInputForCreate[] inputs = from CsvContact c in contacts
        select {
            properties: {
                "firstname": c.firstName,
                "lastname": c.lastName,
                "email": c.email,
                "company": c.company,
                "jobtitle": c.title,
                "lifecyclestage": "lead"
            }
        };

    contact:BatchResponseSimplePublicObject result = check hubspot->batchCreate({
        inputs: inputs
    });

    io:println(string `Successfully imported ${result.results.length()} contacts`);
    foreach contact:SimplePublicObject created in result.results {
        log:printInfo("Imported contact", id = created.id, email = created.properties["email"]);
    }
}
```

## Example 3: Contact Search and Enrichment

Search for contacts matching criteria and update them with enriched data.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

public function main() returns error? {
    contact:Client hubspot = check new ({
        auth: { token: accessToken }
    });

    // Search for contacts at a specific company without a phone number
    contact:CollectionResponseWithTotalSimplePublicObjectForwardPaging searchResults =
        check hubspot->search({
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: "company",
                            operator: "EQ",
                            value: "Acme Inc."
                        },
                        {
                            propertyName: "phone",
                            operator: "NOT_HAS_PROPERTY"
                        }
                    ]
                }
            ],
            properties: ["firstname", "lastname", "email", "company"],
            'limit: 100
        });

    io:println(string `Found ${searchResults.total} contacts without phone numbers at Acme Inc.`);

    // Update each contact with enriched data
    foreach var result in searchResults.results {
        string email = result.properties["email"] ?: "";
        string? phoneFromLookup = lookupPhone(email);

        if phoneFromLookup is string {
            _ = check hubspot->update(result.id, {
                properties: {
                    "phone": phoneFromLookup
                }
            });
            log:printInfo("Updated phone for contact", id = result.id);
        }
    }
}

function lookupPhone(string email) returns string? {
    // Simulated phone lookup from an external enrichment service
    map<string> phoneDirectory = {
        "alice@acme.com": "+1-555-0101",
        "bob@acme.com": "+1-555-0102"
    };
    return phoneDirectory[email];
}
```

## Example 4: Contact Deduplication

Find and merge duplicate contacts based on email address.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

public function main() returns error? {
    contact:Client hubspot = check new ({
        auth: { token: accessToken }
    });

    string targetEmail = "john.doe@example.com";

    // Search for all contacts with the same email
    contact:CollectionResponseWithTotalSimplePublicObjectForwardPaging duplicates =
        check hubspot->search({
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: "email",
                            operator: "EQ",
                            value: targetEmail
                        }
                    ]
                }
            ],
            properties: ["firstname", "lastname", "email", "createdate"]
        });

    if duplicates.total <= 1 {
        io:println("No duplicates found for: ", targetEmail);
        return;
    }

    io:println(string `Found ${duplicates.total} contacts with email: ${targetEmail}`);

    // Keep the oldest contact as primary (first created)
    string primaryId = duplicates.results[0].id;

    // Merge remaining duplicates into the primary
    foreach int i in 1 ..< duplicates.results.length() {
        string duplicateId = duplicates.results[i].id;
        _ = check hubspot->merge({
            primaryObjectId: primaryId,
            objectIdToMerge: duplicateId
        });
        log:printInfo("Merged duplicate", duplicateId = duplicateId, primaryId = primaryId);
    }

    io:println("Deduplication complete. Primary contact ID: ", primaryId);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
