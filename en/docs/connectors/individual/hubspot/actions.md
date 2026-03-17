---
title: "HubSpot CRM - Actions"
description: "Available actions and operations for the ballerinax/hubspot.crm.contact connector."
---

# HubSpot CRM Actions

The `ballerinax/hubspot.crm.contact` package provides a client with operations to manage contacts in HubSpot CRM using the V3 API.

## Client Initialization

```ballerina
import ballerinax/hubspot.crm.contact;

configurable string accessToken = ?;

contact:Client hubspot = check new ({
    auth: { token: accessToken }
});
```

## Contact CRUD Operations

### create

Create a new contact in HubSpot CRM.

```ballerina
contact:SimplePublicObject newContact = check hubspot->create({
    properties: {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "phone": "+1-555-0100",
        "company": "Acme Inc.",
        "jobtitle": "Software Engineer",
        "lifecyclestage": "lead"
    }
});

string contactId = newContact.id;
```

### getById

Retrieve a contact by its HubSpot ID.

```ballerina
contact:SimplePublicObjectWithAssociations result = check hubspot->getById(contactId);
io:println("Contact: ", result.properties);
```

Retrieve with specific properties:

```ballerina
contact:SimplePublicObjectWithAssociations result = check hubspot->getById(
    contactId,
    properties = ["firstname", "lastname", "email", "company"]
);
```

### getPage

Retrieve a page of contacts with pagination.

```ballerina
contact:CollectionResponseSimplePublicObjectWithAssociationsForwardPaging contacts =
    check hubspot->getPage(
        'limit = 50,
        properties = ["firstname", "lastname", "email"]
    );

foreach contact:SimplePublicObjectWithAssociations c in contacts.results {
    io:println(c.properties);
}
```

### update

Update an existing contact's properties.

```ballerina
contact:SimplePublicObject updated = check hubspot->update(contactId, {
    properties: {
        "phone": "+1-555-0200",
        "jobtitle": "Senior Software Engineer",
        "lifecyclestage": "opportunity"
    }
});
```

### archive

Archive (soft-delete) a contact.

```ballerina
check hubspot->archive(contactId);
```

## Search Operations

### search

Search for contacts using filters and query strings.

```ballerina
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
                        propertyName: "lifecyclestage",
                        operator: "EQ",
                        value: "lead"
                    }
                ]
            }
        ],
        sorts: ["lastname"],
        properties: ["firstname", "lastname", "email", "company"],
        'limit: 20,
        after: "0"
    });

io:println("Found contacts: ", searchResults.total);
```

## Batch Operations

### batchCreate

Create multiple contacts in a single request.

```ballerina
contact:BatchResponseSimplePublicObject batchResult = check hubspot->batchCreate({
    inputs: [
        {
            properties: {
                "firstname": "Alice",
                "lastname": "Smith",
                "email": "alice@example.com"
            }
        },
        {
            properties: {
                "firstname": "Bob",
                "lastname": "Johnson",
                "email": "bob@example.com"
            }
        }
    ]
});
```

### batchRead

Read multiple contacts by ID in one request.

```ballerina
contact:BatchResponseSimplePublicObject batchRead = check hubspot->batchRead({
    inputs: [
        { id: "101" },
        { id: "102" },
        { id: "103" }
    ],
    properties: ["firstname", "lastname", "email"]
});
```

### batchUpdate

Update multiple contacts in a single request.

```ballerina
contact:BatchResponseSimplePublicObject batchUpdated = check hubspot->batchUpdate({
    inputs: [
        {
            id: "101",
            properties: { "lifecyclestage": "customer" }
        },
        {
            id: "102",
            properties: { "lifecyclestage": "customer" }
        }
    ]
});
```

### batchArchive

Archive multiple contacts at once.

```ballerina
check hubspot->batchArchive({
    inputs: [
        { id: "201" },
        { id: "202" }
    ]
});
```

## Merge Operations

### merge

Merge two duplicate contact records.

```ballerina
contact:SimplePublicObject mergedContact = check hubspot->merge({
    primaryObjectId: "101",
    objectIdToMerge: "102"
});
```

## Error Handling

```ballerina
do {
    contact:SimplePublicObject newContact = check hubspot->create({
        properties: {
            "firstname": "Test",
            "lastname": "User",
            "email": "test@example.com"
        }
    });
    io:println("Created contact: ", newContact.id);
} on fail error e {
    io:println("Failed to create contact: ", e.message());
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/hubspot.crm.contact/latest#clients)
