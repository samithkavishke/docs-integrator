---
title: "Xero - Examples"
description: "Code examples for the ballerinax/xero.accounts connector."
---

# Xero Examples

## Example 1: Create and Send an Invoice

Create a sales invoice for a customer and authorize it for sending.

```ballerina
import ballerina/io;
import ballerinax/xero.accounts;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;
configurable string tenantId = ?;

public function main() returns error? {
    accounts:Client xero = check new ({
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    // Create a sales invoice with multiple line items
    accounts:Invoices created = check xero->createInvoices(
        xeroTenantId = tenantId,
        payload = {
            Invoices: [
                {
                    Type: "ACCREC",
                    Contact: { ContactID: "contact-uuid-here" },
                    LineItems: [
                        {
                            Description: "Web Development - Phase 1",
                            Quantity: 40.0,
                            UnitAmount: 125.00,
                            AccountCode: "200",
                            TaxType: "OUTPUT"
                        },
                        {
                            Description: "UI/UX Design",
                            Quantity: 16.0,
                            UnitAmount: 95.00,
                            AccountCode: "200",
                            TaxType: "OUTPUT"
                        }
                    ],
                    Date: "2025-03-01",
                    DueDate: "2025-03-31",
                    Reference: "PROJ-2025-001",
                    Status: "AUTHORISED"
                }
            ]
        }
    );

    accounts:Invoice[]? invoiceList = created?.Invoices;
    if invoiceList is accounts:Invoice[] && invoiceList.length() > 0 {
        string? invoiceId = invoiceList[0]?.InvoiceID;
        io:println("Invoice created: ", invoiceId);

        // Email the invoice to the contact
        if invoiceId is string {
            check xero->emailInvoice(
                xeroTenantId = tenantId,
                invoiceID = invoiceId,
                payload = {}
            );
            io:println("Invoice emailed successfully");
        }
    }
}
```

```toml
# Config.toml
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
refreshToken = "<your-refresh-token>"
refreshUrl = "https://identity.xero.com/connect/token"
tenantId = "<your-tenant-id>"
```

## Example 2: Contact Sync from External CRM

Synchronize contacts from an external source into Xero.

```ballerina
import ballerina/io;
import ballerinax/xero.accounts;

configurable string token = ?;
configurable string tenantId = ?;

type CrmContact record {|
    string name;
    string email;
    string phone;
    string address;
    string city;
    string state;
    string zip;
|};

public function main() returns error? {
    accounts:Client xero = check new ({
        auth: { token: token }
    });

    // Simulated CRM contacts to sync
    CrmContact[] crmContacts = [
        {name: "DataFlow Inc.", email: "ap@dataflow.example.com", phone: "555-0201",
         address: "789 Tech Blvd", city: "Austin", state: "TX", zip: "78701"},
        {name: "CloudNine Systems", email: "billing@cloudnine.example.com", phone: "555-0302",
         address: "456 Cloud Ave", city: "Seattle", state: "WA", zip: "98101"}
    ];

    // Check for existing contacts
    accounts:Contacts existing = check xero->getContacts(xeroTenantId = tenantId);

    foreach CrmContact crm in crmContacts {
        boolean found = false;
        accounts:Contact[]? existingList = existing?.Contacts;
        if existingList is accounts:Contact[] {
            foreach accounts:Contact c in existingList {
                if c?.Name == crm.name {
                    found = true;
                    break;
                }
            }
        }

        if !found {
            accounts:Contacts created = check xero->createContacts(
                xeroTenantId = tenantId,
                payload = {
                    Contacts: [{
                        Name: crm.name,
                        EmailAddress: crm.email,
                        Phones: [{ PhoneType: "DEFAULT", PhoneNumber: crm.phone }],
                        Addresses: [{
                            AddressType: "STREET",
                            AddressLine1: crm.address,
                            City: crm.city,
                            Region: crm.state,
                            PostalCode: crm.zip,
                            Country: "US"
                        }]
                    }]
                }
            );
            io:println("Created contact: ", crm.name);
        } else {
            io:println("Contact already exists: ", crm.name);
        }
    }
}
```

## Example 3: Invoice Payment Reconciliation Service

A REST service that receives payment notifications and records them in Xero.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/xero.accounts;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;
configurable string tenantId = ?;

final accounts:Client xeroClient = check new ({
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});

type PaymentNotification record {|
    string invoiceNumber;
    decimal amount;
    string date;
    string bankAccountCode;
    string reference;
|};

service /api/v1 on new http:Listener(8090) {

    resource function post payments(PaymentNotification notification)
            returns http:Created|http:NotFound|http:InternalServerError {
        do {
            // Look up the invoice by number
            accounts:Invoices invoiceResult = check xeroClient->getInvoices(
                xeroTenantId = tenantId,
                invoiceNumbers = [notification.invoiceNumber]
            );

            accounts:Invoice[]? invoiceList = invoiceResult?.Invoices;
            if invoiceList is () || invoiceList.length() == 0 {
                return <http:NotFound>{
                    body: {message: "Invoice not found: " + notification.invoiceNumber}
                };
            }

            string invoiceId = invoiceList[0]?.InvoiceID ?: "";

            // Record the payment
            accounts:Payments payment = check xeroClient->createPayments(
                xeroTenantId = tenantId,
                payload = {
                    Payments: [{
                        Invoice: { InvoiceID: invoiceId },
                        Account: { Code: notification.bankAccountCode },
                        Date: notification.date,
                        Amount: notification.amount,
                        Reference: notification.reference
                    }]
                }
            );

            log:printInfo("Payment recorded",
                invoiceNumber = notification.invoiceNumber,
                amount = notification.amount
            );
            return <http:Created>{body: {message: "Payment recorded"}};
        } on fail error e {
            log:printError("Payment recording failed", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to record payment"}
            };
        }
    }

    resource function get invoices/outstanding()
            returns json|http:InternalServerError {
        do {
            accounts:Invoices invoices = check xeroClient->getInvoices(
                xeroTenantId = tenantId,
                statuses = ["AUTHORISED"],
                where = "Type==\"ACCREC\"&&AmountDue>0"
            );
            return invoices.toJson();
        } on fail error e {
            log:printError("Failed to query invoices", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to fetch outstanding invoices"}
            };
        }
    }
}
```

## Example 4: Monthly Expense Report Generator

Query Xero for expense transactions and generate a summary.

```ballerina
import ballerina/io;
import ballerinax/xero.accounts;

configurable string token = ?;
configurable string tenantId = ?;

public function main() returns error? {
    accounts:Client xero = check new ({
        auth: { token: token }
    });

    // Get all expense accounts
    accounts:Accounts accts = check xero->getAccounts(
        xeroTenantId = tenantId,
        where = "Type==\"EXPENSE\""
    );

    io:println("=== Monthly Expense Report ===");
    io:println("");

    // Get bank transactions (expenses) for the current month
    accounts:BankTransactions txns = check xero->getBankTransactions(
        xeroTenantId = tenantId,
        where = "Type==\"SPEND\"&&Date>=DateTime(2025,03,01)&&Date<=DateTime(2025,03,31)"
    );

    decimal totalExpenses = 0.0;
    accounts:BankTransaction[]? txnList = txns?.BankTransactions;
    if txnList is accounts:BankTransaction[] {
        foreach accounts:BankTransaction txn in txnList {
            decimal amount = txn?.Total ?: 0.0;
            totalExpenses += amount;
            io:println(string `  ${txn?.Contact?.Name ?: "Unknown"}: $${amount}`);
        }
    }

    io:println("");
    io:println(string `Total Expenses: $${totalExpenses}`);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
