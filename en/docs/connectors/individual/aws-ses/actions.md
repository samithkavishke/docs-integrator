---
title: "Amazon SES - Actions"
description: "Available actions and operations for the ballerinax/aws.ses connector."
---

# Amazon SES Actions

The `ballerinax/aws.ses` package provides a client for sending emails and managing identities through Amazon SES.

## Client Initialization

```ballerina
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

ses:Client sesClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});
```

## Send Email Operations

### Send Email

Send a formatted email with HTML and/or plain-text body.

```ballerina
ses:Email email = {
    sender: "noreply@example.com",
    subject: "Order Confirmation - #12345",
    toAddresses: ["customer@example.com"],
    htmlBody: "<h1>Order Confirmed</h1><p>Your order #12345 has been placed.</p>",
    textBody: "Order Confirmed. Your order #12345 has been placed."
};

ses:MessageId messageId = check sesClient->sendEmail(email);
io:println("Email sent. Message ID: ", messageId);
```

### Send Email with CC and BCC

```ballerina
ses:Email emailWithCc = {
    sender: "noreply@example.com",
    subject: "Monthly Report - January 2024",
    toAddresses: ["manager@example.com"],
    ccAddresses: ["team-lead@example.com"],
    bccAddresses: ["archive@example.com"],
    htmlBody: "<h1>Monthly Report</h1><p>Please find the January report attached.</p>"
};

_ = check sesClient->sendEmail(emailWithCc);
```

### Send Raw Email

Send a raw email message with full MIME control, useful for attachments.

```ballerina
string rawMessage = string `From: noreply@example.com
To: customer@example.com
Subject: Invoice Attached
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="boundary123"

--boundary123
Content-Type: text/html; charset=UTF-8

<p>Please find your invoice attached.</p>

--boundary123
Content-Type: application/pdf; name="invoice.pdf"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="invoice.pdf"

JVBERi0xLjQK...
--boundary123--`;

ses:MessageId rawMsgId = check sesClient->sendRawEmail(rawMessage);
```

## Template Operations

### Create Template

Create a reusable email template with placeholder variables.

```ballerina
ses:Template template = {
    templateName: "OrderConfirmation",
    subjectPart: "Order Confirmation - {{orderId}}",
    htmlPart: "<h1>Hello {{customerName}}</h1><p>Your order {{orderId}} for {{productName}} has been confirmed.</p><p>Total: ${{totalAmount}}</p>",
    textPart: "Hello {{customerName}}, Your order {{orderId}} has been confirmed. Total: ${{totalAmount}}"
};

check sesClient->createTemplate(template);
```

### Update Template

```ballerina
ses:Template updatedTemplate = {
    templateName: "OrderConfirmation",
    subjectPart: "Order Confirmed - {{orderId}}",
    htmlPart: "<h1>Hi {{customerName}}</h1><p>Order {{orderId}} is confirmed. Total: ${{totalAmount}}</p>",
    textPart: "Hi {{customerName}}, Order {{orderId}} confirmed. Total: ${{totalAmount}}"
};

check sesClient->updateTemplate(updatedTemplate);
```

### Get Template

```ballerina
ses:Template tmpl = check sesClient->getTemplate("OrderConfirmation");
io:println("Template subject: ", tmpl.subjectPart);
```

### List Templates

```ballerina
ses:Template[] templates = check sesClient->listTemplates();
foreach ses:Template t in templates {
    io:println("Template: ", t.templateName);
}
```

### Delete Template

```ballerina
check sesClient->deleteTemplate("OrderConfirmation");
```

### Send Templated Email

Send an email using a pre-defined template with dynamic data.

```ballerina
ses:TemplatedEmail templatedEmail = {
    sender: "noreply@example.com",
    toAddresses: ["customer@example.com"],
    templateName: "OrderConfirmation",
    templateData: "{\"customerName\": \"Alice\", \"orderId\": \"ORD-001\", \"productName\": \"Widget Pro\", \"totalAmount\": \"49.99\"}"
};

_ = check sesClient->sendTemplatedEmail(templatedEmail);
```

## Identity Operations

### Verify Email Identity

Start the verification process for an email address.

```ballerina
check sesClient->verifyEmailIdentity("new-sender@example.com");
io:println("Verification email sent. Check inbox to confirm.");
```

### List Identities

List all verified email addresses and domains.

```ballerina
ses:Identity[] identities = check sesClient->listIdentities();
foreach ses:Identity identity in identities {
    io:println("Identity: ", identity);
}
```

### Delete Identity

Remove a verified identity.

```ballerina
check sesClient->deleteIdentity("old-sender@example.com");
```

## Error Handling

```ballerina
import ballerina/log;

do {
    ses:Email email = {
        sender: "noreply@example.com",
        subject: "Test",
        toAddresses: ["recipient@example.com"],
        textBody: "Test message"
    };
    _ = check sesClient->sendEmail(email);
    log:printInfo("Email sent successfully");
} on fail error e {
    log:printError("Failed to send email", 'error = e);
}
```

### Common Error Scenarios

| Error | Cause | Resolution |
|---|---|---|
| `MessageRejected` | Sender address not verified | Verify the sender in SES console |
| `MailFromDomainNotVerifiedException` | Domain not verified | Complete domain verification |
| `TemplateDoesNotExistException` | Template name not found | Create the template first |
| `AccountSendingPausedException` | Sending quota exceeded or reputation issue | Check SES dashboard |
| `ConfigurationSetDoesNotExistException` | Invalid configuration set | Verify configuration set name |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
