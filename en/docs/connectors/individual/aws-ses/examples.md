---
title: "Amazon SES - Examples"
description: "Code examples for the ballerinax/aws.ses connector."
---

# Amazon SES Examples

## Example 1: Transactional Email Service

An HTTP service that sends order confirmation emails using SES templates.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string senderEmail = ?;

final ses:Client sesClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

type OrderConfirmation record {
    string customerEmail;
    string customerName;
    string orderId;
    string productName;
    decimal totalAmount;
};

service /notifications on new http:Listener(8080) {

    resource function post orderConfirmation(
            OrderConfirmation confirmation) returns json|error {
        ses:Email email = {
            sender: senderEmail,
            subject: string `Order Confirmation - ${confirmation.orderId}`,
            toAddresses: [confirmation.customerEmail],
            htmlBody: string `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h1 style="color: #2c3e50;">Order Confirmed</h1>
                    <p>Hello ${confirmation.customerName},</p>
                    <p>Your order <strong>${confirmation.orderId}</strong> has been confirmed.</p>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="background-color: #f8f9fa;">
                            <td style="padding: 10px;">Product</td>
                            <td style="padding: 10px;">${confirmation.productName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px;"><strong>Total</strong></td>
                            <td style="padding: 10px;"><strong>$${confirmation.totalAmount}</strong></td>
                        </tr>
                    </table>
                    <p>Thank you for your purchase!</p>
                </div>`,
            textBody: string `Order ${confirmation.orderId} confirmed. Product: ${confirmation.productName}. Total: $${confirmation.totalAmount}`
        };

        ses:MessageId messageId = check sesClient->sendEmail(email);
        log:printInfo("Order confirmation sent",
            orderId = confirmation.orderId, messageId = messageId);

        return {status: "sent", messageId: messageId};
    }

    resource function post passwordReset(
            record {string email; string resetLink;} payload
    ) returns json|error {
        ses:Email email = {
            sender: senderEmail,
            subject: "Password Reset Request",
            toAddresses: [payload.email],
            htmlBody: string `
                <div style="font-family: Arial, sans-serif;">
                    <h2>Password Reset</h2>
                    <p>Click the link below to reset your password:</p>
                    <a href="${payload.resetLink}" style="padding: 10px 20px; background: #3498db; color: white; text-decoration: none;">Reset Password</a>
                    <p>This link expires in 24 hours.</p>
                </div>`,
            textBody: string `Reset your password: ${payload.resetLink}`
        };

        ses:MessageId msgId = check sesClient->sendEmail(email);
        return {status: "sent", messageId: msgId};
    }
}
```

**Config.toml:**

```toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
senderEmail = "noreply@example.com"
```

## Example 2: Template-Based Bulk Email Sender

Set up templates and send bulk emails to a list of recipients.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string senderEmail = ?;

final ses:Client sesClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

// Initialize templates on startup
function initTemplates() returns error? {
    ses:Template welcomeTemplate = {
        templateName: "WelcomeEmail",
        subjectPart: "Welcome to Our Platform, {{name}}!",
        htmlPart: "<h1>Welcome, {{name}}!</h1><p>Your account has been created. Get started at <a href='{{dashboardUrl}}'>your dashboard</a>.</p>",
        textPart: "Welcome, {{name}}! Your account is ready. Visit: {{dashboardUrl}}"
    };

    do {
        check sesClient->createTemplate(welcomeTemplate);
        log:printInfo("Welcome template created");
    } on fail error e {
        log:printWarn("Template may already exist", 'error = e);
    }
}

type Subscriber record {
    string email;
    string name;
    string dashboardUrl;
};

public function main() returns error? {
    check initTemplates();

    Subscriber[] subscribers = [
        {email: "alice@example.com", name: "Alice", dashboardUrl: "https://app.example.com/alice"},
        {email: "bob@example.com", name: "Bob", dashboardUrl: "https://app.example.com/bob"},
        {email: "carol@example.com", name: "Carol", dashboardUrl: "https://app.example.com/carol"}
    ];

    int successCount = 0;
    int failCount = 0;

    foreach Subscriber sub in subscribers {
        do {
            ses:TemplatedEmail templatedEmail = {
                sender: senderEmail,
                toAddresses: [sub.email],
                templateName: "WelcomeEmail",
                templateData: string `{"name": "${sub.name}", "dashboardUrl": "${sub.dashboardUrl}"}`
            };

            _ = check sesClient->sendTemplatedEmail(templatedEmail);
            successCount += 1;
            log:printInfo("Welcome email sent", recipient = sub.email);
        } on fail error e {
            failCount += 1;
            log:printError("Failed to send email",
                recipient = sub.email, 'error = e);
        }
    }

    io:println("Bulk send complete. Success: ", successCount,
        " Failed: ", failCount);
}
```

## Example 3: System Alert Notification Service

Send alert emails triggered by system monitoring events.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string alertSender = ?;
configurable string[] alertRecipients = ?;

final ses:Client sesClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

type AlertEvent record {
    string severity; // "critical" | "warning" | "info"
    string 'source;
    string message;
    map<string> metadata?;
};

service /alerts on new http:Listener(9090) {

    resource function post notify(AlertEvent alert) returns json|error {
        string timestamp = time:utcToString(time:utcNow());

        string severityColor = alert.severity == "critical" ? "#e74c3c" :
            alert.severity == "warning" ? "#f39c12" : "#3498db";

        string severityLabel = alert.severity.toUpperAscii();

        string metadataHtml = "";
        if alert.metadata is map<string> {
            map<string> meta = <map<string>>alert.metadata;
            foreach [string, string] [key, value] in meta.entries() {
                metadataHtml += string `<tr><td style="padding: 5px;">${key}</td><td style="padding: 5px;">${value}</td></tr>`;
            }
        }

        ses:Email alertEmail = {
            sender: alertSender,
            subject: string `[${severityLabel}] Alert from ${alert.'source}`,
            toAddresses: alertRecipients,
            htmlBody: string `
                <div style="font-family: monospace; max-width: 700px;">
                    <div style="background: ${severityColor}; color: white; padding: 15px;">
                        <strong>${severityLabel} ALERT</strong> - ${alert.'source}
                    </div>
                    <div style="padding: 15px; background: #f8f9fa;">
                        <p><strong>Time:</strong> ${timestamp}</p>
                        <p><strong>Message:</strong> ${alert.message}</p>
                        ${metadataHtml != "" ? "<table>" + metadataHtml + "</table>" : ""}
                    </div>
                </div>`,
            textBody: string `[${severityLabel}] ${alert.'source}: ${alert.message} at ${timestamp}`
        };

        ses:MessageId msgId = check sesClient->sendEmail(alertEmail);
        log:printInfo("Alert sent",
            severity = alert.severity, messageId = msgId);

        return {status: "alert_sent", messageId: msgId, timestamp: timestamp};
    }
}
```

**Config.toml:**

```toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
alertSender = "alerts@example.com"
alertRecipients = ["oncall@example.com", "devops@example.com"]
```

## Example 4: Email Identity Manager

Programmatically manage verified email identities.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

final ses:Client sesClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

public function main() returns error? {
    // List current identities
    ses:Identity[] identities = check sesClient->listIdentities();
    io:println("Current verified identities:");
    foreach ses:Identity identity in identities {
        io:println("  - ", identity);
    }

    // Verify a new email address
    string newEmail = "new-sender@example.com";
    do {
        check sesClient->verifyEmailIdentity(newEmail);
        io:println("Verification email sent to: ", newEmail);
    } on fail error e {
        log:printError("Failed to initiate verification", 'error = e);
    }

    // Clean up old identities
    string[] toRemove = ["old-sender@example.com"];
    foreach string email in toRemove {
        do {
            check sesClient->deleteIdentity(email);
            io:println("Removed identity: ", email);
        } on fail error e {
            log:printWarn("Could not remove identity",
                email = email, 'error = e);
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
