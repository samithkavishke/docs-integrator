---
title: "ActiveCampaign - Actions"
description: "Available actions and operations for the ballerinax/activecampaign connector."
---

# ActiveCampaign Actions

The `ballerinax/activecampaign` package provides operations for managing contacts, automations, deals, and lists in ActiveCampaign.

## Client Initialization

```ballerina
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

activecampaign:Client activeCampaign = check new ({
    baseUrl: apiUrl,
    auth: { token: apiKey }
});
```

## Contact Operations

### createContact

Create a new contact.

```ballerina
json contact = check activeCampaign->createContact({
    "contact": {
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1-555-0100"
    }
});
```

### getContact

Retrieve a contact by ID.

```ballerina
json contact = check activeCampaign->getContact(contactId);
```

### updateContact

Update a contact's information.

```ballerina
json updated = check activeCampaign->updateContact(contactId, {
    "contact": {
        "firstName": "John",
        "lastName": "Doe-Smith",
        "phone": "+1-555-0200"
    }
});
```

### listContacts

List contacts with optional filters.

```ballerina
json contacts = check activeCampaign->listContacts(
    'limit = 50,
    offset = 0
);
```

### deleteContact

Delete a contact by ID.

```ballerina
check activeCampaign->deleteContact(contactId);
```

### syncContact

Create or update a contact by email address.

```ballerina
json synced = check activeCampaign->syncContact({
    "contact": {
        "email": "john.doe@example.com",
        "firstName": "John",
        "lastName": "Updated"
    }
});
```

## Tag Operations

### addTagToContact

Apply a tag to a contact.

```ballerina
json result = check activeCampaign->addTagToContact({
    "contactTag": {
        "contact": contactId.toString(),
        "tag": tagId.toString()
    }
});
```

### removeTagFromContact

Remove a tag from a contact.

```ballerina
check activeCampaign->removeTagFromContact(contactTagId);
```

### createTag

Create a new tag.

```ballerina
json tag = check activeCampaign->createTag({
    "tag": {
        "tag": "VIP Customer",
        "tagType": "contact",
        "description": "High-value customer segment"
    }
});
```

## List Operations

### addContactToList

Subscribe a contact to a list.

```ballerina
json result = check activeCampaign->addContactToList({
    "contactList": {
        "list": listId.toString(),
        "contact": contactId.toString(),
        "status": 1
    }
});
```

## Automation Operations

### addContactToAutomation

Add a contact to an automation workflow.

```ballerina
json result = check activeCampaign->addContactToAutomation({
    "contactAutomation": {
        "contact": contactId.toString(),
        "automation": automationId.toString()
    }
});
```

## Deal Operations

### createDeal

Create a new deal in the CRM pipeline.

```ballerina
json deal = check activeCampaign->createDeal({
    "deal": {
        "title": "Enterprise License",
        "value": 50000,
        "currency": "usd",
        "contact": contactId.toString(),
        "pipeline": "1",
        "stage": "1"
    }
});
```

### updateDeal

Update a deal's properties.

```ballerina
json updated = check activeCampaign->updateDeal(dealId, {
    "deal": {
        "stage": "3",
        "value": 75000
    }
});
```

## Custom Field Operations

### createContactCustomFieldValue

Set a custom field value for a contact.

```ballerina
json fieldValue = check activeCampaign->createContactCustomFieldValue({
    "fieldValue": {
        "contact": contactId.toString(),
        "field": fieldId.toString(),
        "value": "Premium Tier"
    }
});
```

## Error Handling

```ballerina
do {
    json contact = check activeCampaign->createContact({
        "contact": {
            "email": "test@example.com",
            "firstName": "Test"
        }
    });
    io:println("Contact created: ", contact);
} on fail error e {
    log:printError("ActiveCampaign operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
