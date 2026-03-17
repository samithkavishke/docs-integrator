---
title: "Oracle NetSuite - Actions"
description: "Available actions and operations for the ballerinax/netsuite connector."
---

# Oracle NetSuite Actions

The `ballerinax/netsuite` package provides operations to interact with NetSuite through the SuiteTalk Web Services API, supporting record CRUD, search, and SuiteQL queries.

## Client Initialization

```ballerina
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

netsuite:Client netsuite = check new ({
    accountId: accountId,
    consumerId: consumerId,
    consumerSecret: consumerSecret,
    token: token,
    tokenSecret: tokenSecret
});
```

## Record Operations

### addRecord

Create a new record in NetSuite.

```ballerina
netsuite:Customer customer = {
    entityId: "CUST-001",
    companyName: "Acme Corporation",
    email: "info@acme.com",
    phone: "555-0100",
    subsidiary: { internalId: "1" }
};

netsuite:RecordAddResponse response = check netsuite->addRecord(customer);
string internalId = response.internalId;
```

### getRecord

Retrieve a record by its internal or external ID.

```ballerina
netsuite:RecordRef ref = {
    internalId: "1234",
    'type: "customer"
};

netsuite:ReadResponse result = check netsuite->getRecord(ref);
```

### updateRecord

Update an existing record.

```ballerina
netsuite:Customer updateData = {
    internalId: "1234",
    phone: "555-0200",
    email: "newemail@acme.com"
};

netsuite:RecordUpdateResponse updateResult = check netsuite->updateRecord(updateData);
```

### upsertRecord

Insert or update a record based on an external ID.

```ballerina
netsuite:Customer upsertData = {
    externalId: "EXT-CUST-001",
    companyName: "Acme Corporation",
    email: "info@acme.com"
};

netsuite:RecordUpdateResponse upsertResult = check netsuite->upsertRecord(upsertData);
```

### deleteRecord

Delete a record by its reference.

```ballerina
netsuite:RecordRef deleteRef = {
    internalId: "1234",
    'type: "customer"
};

netsuite:RecordDeletionResponse deleteResult = check netsuite->deleteRecord(deleteRef);
```

## Search Operations

### search

Execute a search on NetSuite records with criteria.

```ballerina
netsuite:CustomerSearch searchCriteria = {
    basic: {
        companyName: {
            operator: "contains",
            searchValue: "Acme"
        }
    }
};

netsuite:SearchResult searchResult = check netsuite->search(searchCriteria);
```

### searchMoreWithId

Retrieve additional pages from a previous search result.

```ballerina
netsuite:SearchResult nextPage = check netsuite->searchMoreWithId(
    searchResult.searchId, 2
);
```

## SuiteQL Operations

### queryWithSuiteQL

Execute SuiteQL queries for flexible data retrieval.

```ballerina
string query = "SELECT id, companyName, email, phone FROM customer WHERE subsidiary = 1 ORDER BY companyName";

json queryResult = check netsuite->queryWithSuiteQL(query);
```

Query with pagination:

```ballerina
json pagedResult = check netsuite->queryWithSuiteQL(
    "SELECT id, tranId, total FROM transaction WHERE type = 'SalesOrd' ORDER BY tranDate DESC",
    'limit = 100,
    offset = 0
);
```

## Transaction Record Operations

### Create a Sales Order

```ballerina
netsuite:SalesOrder salesOrder = {
    entity: { internalId: "1234" },
    tranDate: "2024-01-15",
    memo: "Order from web portal",
    itemList: {
        item: [
            {
                item: { internalId: "100" },
                quantity: 5,
                rate: "29.99"
            },
            {
                item: { internalId: "101" },
                quantity: 2,
                rate: "49.99"
            }
        ]
    }
};

netsuite:RecordAddResponse orderResponse = check netsuite->addRecord(salesOrder);
```

### Create an Invoice

```ballerina
netsuite:Invoice invoice = {
    entity: { internalId: "1234" },
    tranDate: "2024-01-20",
    dueDate: "2024-02-20",
    itemList: {
        item: [
            {
                item: { internalId: "100" },
                quantity: 5,
                amount: 149.95
            }
        ]
    }
};

netsuite:RecordAddResponse invoiceResponse = check netsuite->addRecord(invoice);
```

## Error Handling

```ballerina
do {
    netsuite:RecordAddResponse res = check netsuite->addRecord(customer);
    io:println("Record created: ", res.internalId);
} on fail error e {
    io:println("NetSuite error: ", e.message());
    log:printError("Operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/netsuite/latest#clients)
