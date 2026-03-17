---
title: "Gmail - Examples"
description: "Code examples for the ballerinax/googleapis.gmail connector."
---

# Gmail Examples

## Example 1: Automated Email Notification Service

Send templated email notifications from an HTTP service endpoint.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/googleapis.gmail;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

final gmail:Client gmailClient = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

type NotificationRequest record {|
    string recipientEmail;
    string recipientName;
    string eventType;
    string message;
|};

service /notify on new http:Listener(8080) {

    resource function post email(@http:Payload NotificationRequest request) returns json|error {
        string htmlBody = string `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Notification: ${request.eventType}</h2>
                <p>Hello ${request.recipientName},</p>
                <p>${request.message}</p>
                <p>Best regards,<br/>Automated System</p>
            </div>`;

        gmail:MessageRequest message = {
            to: [request.recipientEmail],
            subject: string `[Alert] ${request.eventType}`,
            bodyInHtml: htmlBody
        };

        gmail:Message result = check gmailClient->sendMessage(message);
        log:printInfo("Email sent", recipient = request.recipientEmail, messageId = result.id);
        return {status: "sent", messageId: result.id};
    }
}
```

```toml
# Config.toml
refreshToken = "<your-refresh-token>"
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
```

## Example 2: Inbox Monitoring and Processing

Read unread emails, process them based on content, and apply labels.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/googleapis.gmail;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

public function main() returns error? {
    gmail:Client gmailClient = check new ({
        auth: {
            refreshToken: refreshToken,
            clientId: clientId,
            clientSecret: clientSecret
        }
    });

    // Search for unread messages with attachments
    gmail:ListMessagesResponse messageList = check gmailClient->listMessages(
        q = "is:unread has:attachment"
    );

    gmail:Message[]? messages = messageList.messages;
    if messages is () || messages.length() == 0 {
        io:println("No unread messages with attachments found");
        return;
    }

    foreach gmail:Message msgRef in messages {
        // Get full message details
        gmail:Message message = check gmailClient->getMessage(msgRef.id);

        string subject = message.headerSubject ?: "(no subject)";
        string sender = message.headerFrom ?: "unknown";
        io:println("Processing: ", subject, " from ", sender);

        // Mark as read by removing UNREAD label
        _ = check gmailClient->modifyMessage(message.id, {
            removeLabelIds: ["UNREAD"]
        });

        log:printInfo("Message processed", subject = subject, sender = sender);
    }

    io:println("Processed messages: ", messages.length());
}
```

## Example 3: Email Report Distribution

Generate and send a report email with an attachment to a distribution list.

```ballerina
import ballerina/log;
import ballerina/time;
import ballerinax/googleapis.gmail;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

public function main() returns error? {
    gmail:Client gmailClient = check new ({
        auth: {
            refreshToken: refreshToken,
            clientId: clientId,
            clientSecret: clientSecret
        }
    });

    // Build CSV report content
    string csvContent = "Department,Revenue,Expenses,Profit\n" +
        "Engineering,500000,350000,150000\n" +
        "Sales,800000,200000,600000\n" +
        "Marketing,300000,250000,50000\n";

    time:Civil now = time:utcToCivil(time:utcNow());
    string reportDate = string `${now.year}-${now.month}-${now.day}`;

    string[] recipients = [
        "cfo@example.com",
        "cto@example.com",
        "coo@example.com"
    ];

    gmail:MessageRequest message = {
        to: recipients,
        subject: string `Financial Summary - ${reportDate}`,
        bodyInHtml: string `
            <h2>Daily Financial Summary</h2>
            <p>Please find attached the financial summary for ${reportDate}.</p>
            <p>This is an automated report from the integration system.</p>`,
        attachments: [
            {
                name: string `financial-summary-${reportDate}.csv`,
                mimeType: "text/csv",
                content: csvContent.toBytes()
            }
        ]
    };

    gmail:Message result = check gmailClient->sendMessage(message);
    log:printInfo("Report distributed",
        messageId = result.id,
        recipients = recipients.length()
    );
}
```

## Example 4: Draft Management Workflow

Create, list, and manage email drafts for a review workflow.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/googleapis.gmail;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

public function main() returns error? {
    gmail:Client gmailClient = check new ({
        auth: {
            refreshToken: refreshToken,
            clientId: clientId,
            clientSecret: clientSecret
        }
    });

    // Create a draft for review
    gmail:MessageRequest draftContent = {
        to: ["partner@example.com"],
        subject: "Partnership Proposal - Q2 2024",
        bodyInHtml: string `
            <h2>Partnership Proposal</h2>
            <p>We would like to propose a strategic partnership...</p>
            <p><em>This draft requires management approval before sending.</em></p>`
    };

    gmail:Draft draft = check gmailClient->createDraft(draftContent);
    io:println("Draft created with ID: ", draft.id);

    // List all current drafts
    gmail:ListDraftsResponse draftList = check gmailClient->listDrafts();
    gmail:Draft[]? drafts = draftList.drafts;
    if drafts is gmail:Draft[] {
        io:println("Total drafts: ", drafts.length());
    }

    // After approval, send the draft
    gmail:Message sent = check gmailClient->sendDraft(draft.id);
    log:printInfo("Draft sent", messageId = sent.id);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
