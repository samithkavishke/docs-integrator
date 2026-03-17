---
title: "Oracle NetSuite - Examples"
description: "Code examples for the ballerinax/netsuite connector."
---

# Oracle NetSuite Examples

## Example 1: Customer Record Management

Create, update, and query customer records in NetSuite.

```ballerina
import ballerina/io;
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

public function main() returns error? {
    netsuite:Client ns = check new ({
        accountId: accountId,
        consumerId: consumerId,
        consumerSecret: consumerSecret,
        token: token,
        tokenSecret: tokenSecret
    });

    // Create a new customer
    netsuite:Customer newCustomer = {
        entityId: "CUST-2024-001",
        companyName: "Global Tech Solutions",
        email: "contact@globaltech.example.com",
        phone: "555-0300",
        subsidiary: { internalId: "1" },
        addressbookList: {
            addressbook: [
                {
                    defaultShipping: true,
                    defaultBilling: true,
                    addressbookAddress: {
                        addr1: "100 Technology Drive",
                        city: "San Jose",
                        state: "CA",
                        zip: "95110",
                        country: "_unitedStates"
                    }
                }
            ]
        }
    };

    netsuite:RecordAddResponse createRes = check ns->addRecord(newCustomer);
    io:println("Customer created with ID: ", createRes.internalId);

    // Query customers using SuiteQL
    json customers = check ns->queryWithSuiteQL(
        "SELECT id, entityId, companyName, email FROM customer WHERE companyName LIKE '%Tech%' ORDER BY companyName"
    );
    io:println("Matching customers: ", customers);
}
```

## Example 2: Sales Order Processing

Create sales orders with line items and track order status.

```ballerina
import ballerina/io;
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

public function main() returns error? {
    netsuite:Client ns = check new ({
        accountId: accountId,
        consumerId: consumerId,
        consumerSecret: consumerSecret,
        token: token,
        tokenSecret: tokenSecret
    });

    // Create a sales order with multiple line items
    netsuite:SalesOrder order = {
        entity: { internalId: "1234" },
        tranDate: "2024-03-15",
        memo: "Web portal order #WEB-5001",
        shipMethod: { internalId: "2" },
        itemList: {
            item: [
                {
                    item: { internalId: "500" },
                    quantity: 10,
                    rate: "25.00",
                    description: "Widget A - Standard"
                },
                {
                    item: { internalId: "501" },
                    quantity: 5,
                    rate: "45.00",
                    description: "Widget B - Premium"
                },
                {
                    item: { internalId: "502" },
                    quantity: 2,
                    rate: "150.00",
                    description: "Widget C - Enterprise"
                }
            ]
        }
    };

    netsuite:RecordAddResponse orderRes = check ns->addRecord(order);
    io:println("Sales Order created: ", orderRes.internalId);

    // Query recent orders using SuiteQL
    json recentOrders = check ns->queryWithSuiteQL(
        string `SELECT id, tranId, entity, total, status FROM transaction WHERE type = 'SalesOrd' AND tranDate >= '2024-03-01' ORDER BY tranDate DESC`,
        'limit = 50
    );
    io:println("Recent sales orders: ", recentOrders);
}
```

## Example 3: Invoice Generation Service

Expose a REST API that generates NetSuite invoices from external order data.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

final netsuite:Client nsClient = check new ({
    accountId: accountId,
    consumerId: consumerId,
    consumerSecret: consumerSecret,
    token: token,
    tokenSecret: tokenSecret
});

type InvoiceLineItem record {|
    string itemId;
    int quantity;
    decimal amount;
|};

type InvoiceRequest record {|
    string customerId;
    string dueDate;
    InvoiceLineItem[] items;
    string? memo;
|};

service /api/invoices on new http:Listener(8090) {

    resource function post .(InvoiceRequest req) returns http:Created|http:InternalServerError {
        do {
            netsuite:InvoiceItem[] nsItems = from InvoiceLineItem item in req.items
                select {
                    item: { internalId: item.itemId },
                    quantity: item.quantity,
                    amount: item.amount
                };

            netsuite:Invoice invoice = {
                entity: { internalId: req.customerId },
                tranDate: "2024-03-15",
                dueDate: req.dueDate,
                memo: req?.memo ?: "Auto-generated invoice",
                itemList: { item: nsItems }
            };

            netsuite:RecordAddResponse res = check nsClient->addRecord(invoice);
            log:printInfo("Invoice created", invoiceId = res.internalId);
            return <http:Created>{
                body: { invoiceId: res.internalId, message: "Invoice created" }
            };
        } on fail error e {
            log:printError("Invoice creation failed", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }

    resource function get [string id]() returns json|http:NotFound {
        do {
            netsuite:ReadResponse result = check nsClient->getRecord({
                internalId: id,
                'type: "invoice"
            });
            return result.toJson();
        } on fail error e {
            log:printError("Invoice not found", 'error = e);
            return <http:NotFound>{body: {message: "Invoice not found"}};
        }
    }
}
```

## Example 4: Inventory Level Sync

Synchronize inventory levels between NetSuite and an external system.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

type InventoryLevel record {|
    string itemId;
    string itemName;
    decimal quantityOnHand;
    decimal quantityAvailable;
|};

public function main() returns error? {
    netsuite:Client ns = check new ({
        accountId: accountId,
        consumerId: consumerId,
        consumerSecret: consumerSecret,
        token: token,
        tokenSecret: tokenSecret
    });

    // Query current inventory levels
    json inventoryData = check ns->queryWithSuiteQL(
        "SELECT item.id, item.itemId, item.displayName, " +
        "quantityOnHand, quantityAvailable " +
        "FROM inventoryBalance " +
        "WHERE location = 1 " +
        "ORDER BY item.displayName",
        'limit = 500
    );

    io:println("Current inventory levels:");
    io:println(inventoryData);

    // Check for low stock items
    json lowStockItems = check ns->queryWithSuiteQL(
        "SELECT item.id, item.itemId, item.displayName, quantityAvailable " +
        "FROM inventoryBalance " +
        "WHERE quantityAvailable < 10 AND location = 1",
        'limit = 100
    );

    log:printWarn("Low stock items detected", data = lowStockItems.toString());
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
