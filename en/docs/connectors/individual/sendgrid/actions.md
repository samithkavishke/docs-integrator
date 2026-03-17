---
title: "SendGrid - Actions"
description: "Available actions and operations for the ballerinax/sendgrid connector."
---

# SendGrid Actions

The `ballerinax/sendgrid` package provides operations for sending emails, managing templates, and handling email delivery through SendGrid.

## Client Initialization

```ballerina
import ballerinax/sendgrid;

configurable string apiKey = ?;

sendgrid:Client sendgrid = check new ({
    auth: { token: apiKey }
});
```

## Email Sending Operations

### sendEmail

Send an email with plain text or HTML content.

```ballerina
sendgrid:Email email = {
    personalizations: [
        {
            to: [{ email: "recipient@example.com", name: "John Doe" }],
            subject: "Order Confirmation #12345"
        }
    ],
    'from: { email: "orders@yourdomain.com", name: "My Store" },
    content: [
        { 'type: "text/plain", value: "Thank you for your order!" },
        { 'type: "text/html", value: "<h1>Order Confirmed</h1><p>Thank you for your order #12345.</p>" }
    ]
};

json response = check sendgrid->sendEmail(email);
```

### Send with Dynamic Template

Use a pre-built SendGrid dynamic template with variable substitution.

```ballerina
sendgrid:Email templateEmail = {
    personalizations: [
        {
            to: [{ email: "customer@example.com" }],
            dynamicTemplateData: {
                "name": "Alice",
                "orderId": "ORD-12345",
                "total": "$149.99",
                "items": [
                    {"name": "Widget A", "qty": "2", "price": "$49.99"},
                    {"name": "Widget B", "qty": "1", "price": "$50.01"}
                ]
            }
        }
    ],
    'from: { email: "orders@yourdomain.com", name: "My Store" },
    templateId: "d-abc123def456"
};

json response = check sendgrid->sendEmail(templateEmail);
```

### Send to Multiple Recipients with Personalization

```ballerina
sendgrid:Email bulkEmail = {
    personalizations: [
        {
            to: [{ email: "alice@example.com" }],
            dynamicTemplateData: { "name": "Alice", "discount": "20%" }
        },
        {
            to: [{ email: "bob@example.com" }],
            dynamicTemplateData: { "name": "Bob", "discount": "15%" }
        }
    ],
    'from: { email: "marketing@yourdomain.com" },
    templateId: "d-promo-template-id"
};

json response = check sendgrid->sendEmail(bulkEmail);
```

### Send with Attachments

```ballerina
sendgrid:Email emailWithAttachment = {
    personalizations: [
        { to: [{ email: "client@example.com" }] }
    ],
    'from: { email: "reports@yourdomain.com" },
    subject: "Monthly Report - March 2024",
    content: [
        { 'type: "text/plain", value: "Please find your monthly report attached." }
    ],
    attachments: [
        {
            content: encodedBase64Content,
            filename: "report-march-2024.pdf",
            'type: "application/pdf",
            disposition: "attachment"
        }
    ]
};

json response = check sendgrid->sendEmail(emailWithAttachment);
```

### Send with CC and BCC

```ballerina
sendgrid:Email ccEmail = {
    personalizations: [
        {
            to: [{ email: "primary@example.com" }],
            cc: [{ email: "manager@example.com" }],
            bcc: [{ email: "archive@yourdomain.com" }]
        }
    ],
    'from: { email: "support@yourdomain.com" },
    subject: "Support Ticket #5678 Resolved",
    content: [
        { 'type: "text/plain", value: "Your support ticket has been resolved." }
    ]
};

json response = check sendgrid->sendEmail(ccEmail);
```

## Error Handling

```ballerina
do {
    json response = check sendgrid->sendEmail(email);
    io:println("Email sent successfully");
} on fail error e {
    io:println("Failed to send email: ", e.message());
    log:printError("SendGrid operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
