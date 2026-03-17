---
title: "Xero - Actions"
description: "Available actions and operations for the ballerinax/xero.accounts connector."
---

# Xero Actions

The `ballerinax/xero.accounts` package provides a client for interacting with the Xero Accounting API, supporting invoices, contacts, payments, bank transactions, and accounts management.

## Client Initialization

```ballerina
import ballerinax/xero.accounts;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;
configurable string tenantId = ?;

accounts:Client xero = check new ({
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});
```

:::note
All Xero API operations require the `xeroTenantId` parameter to identify the target organization. Retrieve tenant IDs from the Xero connections endpoint during setup.
:::

## Invoice Operations

### getInvoices

Retrieve all invoices, optionally filtered by status or date.

```ballerina
accounts:Invoices invoices = check xero->getInvoices(
    xeroTenantId = tenantId,
    statuses = ["AUTHORISED", "PAID"],
    where = "Type==\"ACCREC\""
);
```

### getInvoice

Retrieve a specific invoice by ID.

```ballerina
accounts:Invoices invoice = check xero->getInvoice(
    xeroTenantId = tenantId,
    invoiceID = "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
);
```

### createInvoices

Create one or more invoices.

```ballerina
accounts:Invoices newInvoices = check xero->createInvoices(
    xeroTenantId = tenantId,
    payload = {
        Invoices: [
            {
                Type: "ACCREC",
                Contact: { ContactID: "contact-uuid" },
                LineItems: [
                    {
                        Description: "Consulting Services - March 2025",
                        Quantity: 20.0,
                        UnitAmount: 150.00,
                        AccountCode: "200"
                    }
                ],
                Date: "2025-03-01",
                DueDate: "2025-03-31",
                Reference: "INV-2025-001",
                Status: "DRAFT"
            }
        ]
    }
);
```

### updateInvoice

Update an existing invoice.

```ballerina
accounts:Invoices updated = check xero->updateInvoice(
    xeroTenantId = tenantId,
    invoiceID = "invoice-uuid",
    payload = {
        Invoices: [
            {
                InvoiceID: "invoice-uuid",
                Status: "AUTHORISED",
                Reference: "INV-2025-001-UPDATED"
            }
        ]
    }
);
```

### emailInvoice

Email an invoice directly to the contact.

```ballerina
check xero->emailInvoice(
    xeroTenantId = tenantId,
    invoiceID = "invoice-uuid",
    payload = {}
);
```

## Contact Operations

### getContacts

Retrieve all contacts, optionally filtered.

```ballerina
accounts:Contacts contacts = check xero->getContacts(
    xeroTenantId = tenantId,
    where = "IsCustomer==true"
);
```

### createContacts

Create one or more contacts.

```ballerina
accounts:Contacts newContacts = check xero->createContacts(
    xeroTenantId = tenantId,
    payload = {
        Contacts: [
            {
                Name: "Acme Corporation",
                EmailAddress: "billing@acme.example.com",
                Phones: [
                    { PhoneType: "DEFAULT", PhoneNumber: "555-0100" }
                ],
                Addresses: [
                    {
                        AddressType: "STREET",
                        AddressLine1: "123 Main Street",
                        City: "San Francisco",
                        Region: "CA",
                        PostalCode: "94105",
                        Country: "US"
                    }
                ]
            }
        ]
    }
);
```

### updateContact

Update an existing contact.

```ballerina
accounts:Contacts updated = check xero->updateContact(
    xeroTenantId = tenantId,
    contactID = "contact-uuid",
    payload = {
        Contacts: [
            {
                ContactID: "contact-uuid",
                EmailAddress: "new-email@acme.example.com"
            }
        ]
    }
);
```

## Payment Operations

### createPayments

Record payments against invoices.

```ballerina
accounts:Payments payments = check xero->createPayments(
    xeroTenantId = tenantId,
    payload = {
        Payments: [
            {
                Invoice: { InvoiceID: "invoice-uuid" },
                Account: { Code: "090" },
                Date: "2025-03-15",
                Amount: 3000.00,
                Reference: "PAY-001"
            }
        ]
    }
);
```

### getPayments

Retrieve payments, optionally filtered by date.

```ballerina
accounts:Payments allPayments = check xero->getPayments(
    xeroTenantId = tenantId,
    where = "Date>=DateTime(2025,01,01)"
);
```

## Account Operations

### getAccounts

Retrieve the chart of accounts.

```ballerina
accounts:Accounts chartOfAccounts = check xero->getAccounts(
    xeroTenantId = tenantId
);
```

### createAccount

Create a new account in the chart of accounts.

```ballerina
accounts:Accounts newAccount = check xero->createAccount(
    xeroTenantId = tenantId,
    payload = {
        Code: "610",
        Name: "Software Subscriptions",
        Type: "EXPENSE"
    }
);
```

## Bank Transaction Operations

### createBankTransactions

Record bank transactions for reconciliation.

```ballerina
accounts:BankTransactions txns = check xero->createBankTransactions(
    xeroTenantId = tenantId,
    payload = {
        BankTransactions: [
            {
                Type: "SPEND",
                Contact: { ContactID: "contact-uuid" },
                BankAccount: { Code: "090" },
                LineItems: [
                    {
                        Description: "Office supplies",
                        Quantity: 1.0,
                        UnitAmount: 85.50,
                        AccountCode: "429"
                    }
                ],
                Date: "2025-03-10"
            }
        ]
    }
);
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use structured error handling:

```ballerina
do {
    accounts:Invoices invoices = check xero->getInvoices(
        xeroTenantId = tenantId
    );
    io:println("Invoices retrieved: ", invoices?.Invoices?.length());
} on fail error e {
    io:println("Error: ", e.message());
    log:printError("Xero operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/xero.accounts/latest#clients)
