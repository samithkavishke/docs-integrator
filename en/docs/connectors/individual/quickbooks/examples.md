---
title: "QuickBooks - Examples"
description: "Code examples for the ballerinax/quickbooks.online connector."
---

# QuickBooks Examples

## Example 1: Create and Send an Invoice

Create an invoice for a customer and email it directly.

```ballerina
import ballerina/io;
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;
configurable string realmId = ?;

public function main() returns error? {
    online:Client qb = check new ({
        serviceUrl: serviceUrl,
        auth: { token: token }
    });

    // Create an invoice with multiple line items
    json invoice = check qb->post(string `/v3/company/${realmId}/invoice`, {
        "Line": [
            {
                "Amount": 500.00,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail": {
                    "ItemRef": {"value": "1", "name": "Web Development"},
                    "Qty": 10,
                    "UnitPrice": 50.00
                }
            },
            {
                "Amount": 200.00,
                "DetailType": "SalesItemLineDetail",
                "SalesItemLineDetail": {
                    "ItemRef": {"value": "2", "name": "Hosting Setup"},
                    "Qty": 1,
                    "UnitPrice": 200.00
                }
            }
        ],
        "CustomerRef": {"value": "1"},
        "DueDate": "2025-07-15",
        "PrivateNote": "Project Phase 1 - Web Development"
    });

    string invoiceId = check (check invoice.Invoice.Id).toString();
    io:println("Invoice created with ID: ", invoiceId);

    // Send the invoice via email
    json sent = check qb->post(
        string `/v3/company/${realmId}/invoice/${invoiceId}/send?sendTo=client@example.com`, {}
    );
    io:println("Invoice emailed successfully");
}
```

```toml
# Config.toml
serviceUrl = "https://sandbox-quickbooks.api.intuit.com"
token = "<your-access-token>"
realmId = "<your-company-id>"
```

## Example 2: Customer Management with Search

Create customers and search for existing ones using QuickBooks query language.

```ballerina
import ballerina/io;
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;
configurable string realmId = ?;

public function main() returns error? {
    online:Client qb = check new ({
        serviceUrl: serviceUrl,
        auth: { token: token }
    });

    // Create a new customer
    json newCustomer = check qb->post(string `/v3/company/${realmId}/customer`, {
        "DisplayName": "TechStart Solutions",
        "CompanyName": "TechStart Solutions Inc.",
        "PrimaryEmailAddr": {"Address": "accounts@techstart.example.com"},
        "PrimaryPhone": {"FreeFormNumber": "(512) 555-0100"},
        "BillAddr": {
            "Line1": "456 Innovation Drive",
            "City": "Austin",
            "CountrySubDivisionCode": "TX",
            "PostalCode": "78701",
            "Country": "US"
        },
        "Notes": "Enterprise client - Net 30 terms"
    });
    io:println("Customer created: ", check newCustomer.Customer.DisplayName);

    // Query active customers in California
    json caCustomers = check qb->get(
        string `/v3/company/${realmId}/query?query=SELECT * FROM Customer WHERE Active = true AND BillAddr.CountrySubDivisionCode = 'CA' ORDERBY DisplayName`
    );
    io:println("California customers: ", caCustomers);

    // Search for a specific customer by name
    json searchResult = check qb->get(
        string `/v3/company/${realmId}/query?query=SELECT * FROM Customer WHERE DisplayName LIKE '%TechStart%'`
    );
    io:println("Search results: ", searchResult);
}
```

## Example 3: Payment Reconciliation Service

Expose a REST API that records payments in QuickBooks when orders are fulfilled.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;
configurable string realmId = ?;

final online:Client qbClient = check new ({
    serviceUrl: serviceUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});

type PaymentRequest record {|
    string invoiceId;
    decimal amount;
    string customerId;
    string paymentMethod;
|};

service /api/v1 on new http:Listener(8090) {

    resource function post payments(PaymentRequest input)
            returns http:Created|http:InternalServerError {
        do {
            json payment = check qbClient->post(
                string `/v3/company/${realmId}/payment`, {
                    "TotalAmt": input.amount,
                    "CustomerRef": {"value": input.customerId},
                    "Line": [
                        {
                            "Amount": input.amount,
                            "LinkedTxn": [
                                {
                                    "TxnId": input.invoiceId,
                                    "TxnType": "Invoice"
                                }
                            ]
                        }
                    ],
                    "PaymentMethodRef": {"value": input.paymentMethod}
                }
            );

            string paymentId = check (check payment.Payment.Id).toString();
            log:printInfo("Payment recorded", paymentId = paymentId);
            return <http:Created>{
                body: {id: paymentId, message: "Payment recorded successfully"}
            };
        } on fail error e {
            log:printError("Failed to record payment", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to record payment in QuickBooks"}
            };
        }
    }

    resource function get invoices/overdue()
            returns json|http:InternalServerError {
        do {
            json overdueInvoices = check qbClient->get(
                string `/v3/company/${realmId}/query?query=SELECT * FROM Invoice WHERE DueDate < '2025-06-01' AND Balance > '0' ORDERBY DueDate`
            );
            return overdueInvoices;
        } on fail error e {
            log:printError("Failed to query overdue invoices", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to fetch overdue invoices"}
            };
        }
    }
}
```

## Example 4: Financial Report Extraction

Extract profit and loss data and format it for an external dashboard.

```ballerina
import ballerina/io;
import ballerinax/quickbooks.online;

configurable string serviceUrl = ?;
configurable string token = ?;
configurable string realmId = ?;

public function main() returns error? {
    online:Client qb = check new ({
        serviceUrl: serviceUrl,
        auth: { token: token }
    });

    // Fetch Profit and Loss report
    json pnlReport = check qb->get(
        string `/v3/company/${realmId}/reports/ProfitAndLoss?start_date=2025-01-01&end_date=2025-06-30&summarize_column_by=Month`
    );
    io:println("Profit & Loss Report: ", pnlReport);

    // Fetch Balance Sheet
    json balanceSheet = check qb->get(
        string `/v3/company/${realmId}/reports/BalanceSheet?date=2025-06-30`
    );
    io:println("Balance Sheet: ", balanceSheet);

    // Fetch Accounts Receivable aging summary
    json arAging = check qb->get(
        string `/v3/company/${realmId}/reports/AgedReceivables?date=2025-06-30`
    );
    io:println("AR Aging: ", arAging);

    // Query recent transactions for audit
    json recentTxns = check qb->get(
        string `/v3/company/${realmId}/query?query=SELECT * FROM Invoice WHERE MetaData.LastUpdatedTime > '2025-06-01T00:00:00' ORDERBY MetaData.LastUpdatedTime DESC MAXRESULTS 50`
    );
    io:println("Recent transactions: ", recentTxns);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
