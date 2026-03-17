---
title: "SaaS Connectors"
description: "Connect to Salesforce, SAP, ServiceNow, HubSpot, Stripe, Twilio, GitHub, and other SaaS platforms."
---

# SaaS Connectors

WSO2 Integrator provides connectors for popular SaaS platforms through the `ballerinax` ecosystem on [Ballerina Central](https://central.ballerina.io). Each connector handles authentication, serialization, pagination, and error mapping.

## CRM & Sales

| Connector | Package | Description |
|-----------|---------|-------------|
| **Salesforce** | `ballerinax/salesforce` | Full CRM — SOQL, SOSL, REST/SOAP/Bulk APIs, CDC events |
| **HubSpot CRM** | `ballerinax/hubspot.crm.contact` | Contacts, companies, deals, pipelines |
| **Dynamics 365** | `ballerinax/microsoft.dynamics365` | Microsoft CRM operations |
| **Zoho CRM** | `ballerinax/zoho.crm` | Leads, contacts, deals, modules |

### Salesforce Example

```ballerina
import ballerinax/salesforce;

salesforce:Client sf = check new ({
    baseUrl: baseUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});

// Create a record
salesforce:CreationResponse res = check sf->create("Account",
    {"Name": "Acme Corp", "Industry": "Technology"});

// Query with SOQL
stream<record {}, error?> query = check sf->query(
    "SELECT Id, Name FROM Account WHERE Industry = 'Technology'");

// Listen for changes (CDC)
listener salesforce:Listener sfListener = check new ({
    auth: sfAuth,
    channelName: "/data/AccountChangeEvent"
});

service on sfListener {
    remote function onCreate(salesforce:EventData event) {
        // Handle new account
    }
}
```

## Communication

| Connector | Package | Description |
|-----------|---------|-------------|
| **Twilio** | `ballerinax/twilio` | SMS, voice calls, WhatsApp messaging |
| **SendGrid** | `ballerinax/sendgrid` | Transactional and marketing email |
| **Slack** | `ballerinax/slack` | Channels, messages, users, reactions |
| **Microsoft Teams** | `ballerinax/microsoft.teams` | Teams, channels, messages, meetings |

### Twilio Example

```ballerina
import ballerinax/twilio;

twilio:Client twilio = check new ({
    twilioAuth: {
        accountSid: accountSid,
        authToken: authToken
    }
});

twilio:SmsResponse sms = check twilio->sendSms(
    fromNo = "+15551234567",
    toNo = "+15559876543",
    body = "Order #123 has shipped!"
);
```

## ERP & Business

| Connector | Package | Description |
|-----------|---------|-------------|
| **SAP** | `ballerinax/sap` | SAP S/4HANA, ECC via OData and RFC |
| **ServiceNow** | `ballerinax/servicenow` | IT service management — incidents, changes, requests |
| **NetSuite** | `ballerinax/netsuite` | Oracle NetSuite ERP operations |
| **Workday** | `ballerinax/workday` | HR, finance, payroll |

## Payments & Finance

| Connector | Package | Description |
|-----------|---------|-------------|
| **Stripe** | `ballerinax/stripe` | Payments, customers, invoices, subscriptions |
| **PayPal** | `ballerinax/paypal` | PayPal payments and orders |
| **Xero** | `ballerinax/xero` | Accounting — invoices, contacts, bank transactions |
| **QuickBooks** | `ballerinax/intuit.quickbooksonline` | Accounting and invoicing |

### Stripe Example

```ballerina
import ballerinax/stripe;

stripe:Client stripe = check new ({auth: {token: stripeApiKey}});

// Create a customer
stripe:Customer customer = check stripe->createCustomer({
    name: "Alice Smith",
    email: "alice@example.com"
});

// Create a payment intent
stripe:PaymentIntent payment = check stripe->createPaymentIntent({
    amount: 5000,  // $50.00 in cents
    currency: "usd",
    customer: customer.id
});
```

## Developer Tools

| Connector | Package | Description |
|-----------|---------|-------------|
| **GitHub** | `ballerinax/github` | Repos, issues, PRs, webhooks, actions |
| **Jira** | `ballerinax/jira` | Issues, projects, boards, sprints |
| **Asana** | `ballerinax/asana` | Tasks, projects, workspaces |
| **PagerDuty** | `ballerinax/pagerduty` | Incidents, services, escalation policies |
| **Zendesk** | `ballerinax/zendesk` | Support tickets, users, organizations |

### GitHub Example

```ballerina
import ballerinax/github;

github:Client gh = check new ({auth: {token: githubToken}});

// Create an issue
github:Issue issue = check gh->createIssue("myorg", "myrepo", {
    title: "Bug: Data sync failing",
    body: "Steps to reproduce...",
    labels: ["bug", "integration"]
});
```

## E-Commerce

| Connector | Package | Description |
|-----------|---------|-------------|
| **Shopify** | `ballerinax/shopify.admin` | Products, orders, customers, inventory |
| **WooCommerce** | `ballerinax/woocommerce` | WordPress e-commerce operations |

## Productivity

| Connector | Package | Description |
|-----------|---------|-------------|
| **Google Sheets** | `ballerinax/googleapis.sheets` | Read, write, format spreadsheets |
| **Google Calendar** | `ballerinax/googleapis.calendar` | Events, calendars, availability |
| **Microsoft Outlook** | `ballerinax/microsoft.outlook.mail` | Email, calendar, contacts |
| **Notion** | `ballerinax/notion` | Pages, databases, blocks |

## Authentication Patterns

Most SaaS connectors use one of these auth methods:

| Auth Type | Usage |
|-----------|-------|
| **OAuth 2.0** | Salesforce, Google, Microsoft, Slack, HubSpot |
| **API Key** | Stripe, SendGrid, GitHub, PagerDuty |
| **Basic Auth** | Jira, ServiceNow (legacy) |
| **JWT** | Custom token-based services |

## Finding More Connectors

Browse all available connectors at [Ballerina Central](https://central.ballerina.io):

```bash
# Search from the CLI
bal search <keyword>

# Add a dependency
bal add ballerinax/<connector_name>
```

## What's Next

- [Connection Configuration](configuration.md) — Set up SaaS connections in the visual designer
- [CRM & Sales Connectors](crm-sales.md) — Detailed CRM connector guide
- [Build Your Own Connector](custom-development.md) — Create custom connectors
