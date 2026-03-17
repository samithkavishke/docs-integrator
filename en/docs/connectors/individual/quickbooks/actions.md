---
title: "QuickBooks - Actions"
description: "Available actions and operations for the ballerinax/quickbooks.online connector."
---

# QuickBooks Actions

The `ballerinax/quickbooks.online` package provides a client for interacting with the QuickBooks Online API v3, supporting invoicing, customer management, payments, and other accounting operations.

## Client Initialization

```ballerina
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;
configurable string realmId = ?;

online:Client quickbooks = check new ({
    serviceUrl: serviceUrl,
    auth: {
        token: token
    }
});
```

## Invoice Operations

### Create an Invoice

Create a new invoice for a customer with line items.

```ballerina
json invoicePayload = {
    "Line": [
        {
            "Amount": 275.00,
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
                "ItemRef": {"value": "1", "name": "Consulting Services"},
                "Qty": 5,
                "UnitPrice": 55.00
            }
        }
    ],
    "CustomerRef": {"value": "1"}
};

json invoice = check quickbooks->post(
    string `/v3/company/${realmId}/invoice`, invoicePayload
);
```

### Query Invoices

Retrieve invoices using QuickBooks query language.

```ballerina
json invoices = check quickbooks->get(
    string `/v3/company/${realmId}/query?query=SELECT * FROM Invoice WHERE DueDate < '2025-12-31' MAXRESULTS 100`
);
```

### Get Invoice by ID

Retrieve a specific invoice by its ID.

```ballerina
json invoice = check quickbooks->get(
    string `/v3/company/${realmId}/invoice/123`
);
```

### Update an Invoice

Update an existing invoice (requires the SyncToken for concurrency control).

```ballerina
json updatePayload = {
    "Id": "123",
    "SyncToken": "0",
    "Line": [
        {
            "Amount": 300.00,
            "DetailType": "SalesItemLineDetail",
            "SalesItemLineDetail": {
                "ItemRef": {"value": "1", "name": "Consulting Services"},
                "Qty": 6,
                "UnitPrice": 50.00
            }
        }
    ],
    "CustomerRef": {"value": "1"}
};

json updated = check quickbooks->post(
    string `/v3/company/${realmId}/invoice`, updatePayload
);
```

### Delete an Invoice

Soft-delete an invoice (sets status to "Voided").

```ballerina
json deletePayload = {
    "Id": "123",
    "SyncToken": "0"
};

json result = check quickbooks->post(
    string `/v3/company/${realmId}/invoice?operation=delete`, deletePayload
);
```

### Send Invoice via Email

Email an invoice directly to the customer.

```ballerina
json sent = check quickbooks->post(
    string `/v3/company/${realmId}/invoice/123/send?sendTo=customer@example.com`, {}
);
```

## Customer Operations

### Create a Customer

```ballerina
json customer = check quickbooks->post(
    string `/v3/company/${realmId}/customer`, {
        "DisplayName": "Acme Corporation",
        "PrimaryEmailAddr": {"Address": "billing@acme.example.com"},
        "PrimaryPhone": {"FreeFormNumber": "(555) 123-4567"},
        "BillAddr": {
            "Line1": "123 Main Street",
            "City": "San Francisco",
            "CountrySubDivisionCode": "CA",
            "PostalCode": "94105"
        }
    }
);
```

### Query Customers

```ballerina
json customers = check quickbooks->get(
    string `/v3/company/${realmId}/query?query=SELECT * FROM Customer WHERE Active = true ORDERBY DisplayName`
);
```

### Update a Customer

```ballerina
json updated = check quickbooks->post(
    string `/v3/company/${realmId}/customer`, {
        "Id": "42",
        "SyncToken": "1",
        "DisplayName": "Acme Corp International",
        "PrimaryPhone": {"FreeFormNumber": "(555) 999-8888"}
    }
);
```

## Payment Operations

### Record a Payment

Record a payment against one or more invoices.

```ballerina
json payment = check quickbooks->post(
    string `/v3/company/${realmId}/payment`, {
        "TotalAmt": 275.00,
        "CustomerRef": {"value": "1"},
        "Line": [
            {
                "Amount": 275.00,
                "LinkedTxn": [
                    {"TxnId": "123", "TxnType": "Invoice"}
                ]
            }
        ]
    }
);
```

### Query Payments

```ballerina
json payments = check quickbooks->get(
    string `/v3/company/${realmId}/query?query=SELECT * FROM Payment WHERE TxnDate > '2025-01-01'`
);
```

## Item Operations

### Create an Item

```ballerina
json item = check quickbooks->post(
    string `/v3/company/${realmId}/item`, {
        "Name": "Premium Consulting",
        "Type": "Service",
        "IncomeAccountRef": {"value": "1"},
        "UnitPrice": 150.00
    }
);
```

### Query Items

```ballerina
json items = check quickbooks->get(
    string `/v3/company/${realmId}/query?query=SELECT * FROM Item WHERE Type = 'Service'`
);
```

## Report Operations

### Profit and Loss Report

```ballerina
json pnl = check quickbooks->get(
    string `/v3/company/${realmId}/reports/ProfitAndLoss?start_date=2025-01-01&end_date=2025-12-31`
);
```

### Balance Sheet Report

```ballerina
json balanceSheet = check quickbooks->get(
    string `/v3/company/${realmId}/reports/BalanceSheet?date=2025-12-31`
);
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` for structured error handling:

```ballerina
do {
    json invoice = check quickbooks->get(
        string `/v3/company/${realmId}/invoice/999`
    );
    io:println("Invoice: ", invoice);
} on fail error e {
    io:println("Error: ", e.message());
    log:printError("QuickBooks operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/quickbooks.online/latest#clients)
