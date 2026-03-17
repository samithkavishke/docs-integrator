---
title: "Gmail - Actions"
description: "Available actions and operations for the ballerinax/googleapis.gmail connector."
---

# Gmail Actions

The `ballerinax/googleapis.gmail` package provides a client with operations to send emails, read messages, manage labels, and handle drafts through the Gmail API v1.

## Client Initialization

```ballerina
import ballerinax/googleapis.gmail;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

gmail:Client gmailClient = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});
```

## Send Email Operations

### Send Plain Text Email

Send a simple plain text email message.

```ballerina
gmail:MessageRequest message = {
    to: ["recipient@example.com"],
    subject: "Meeting Reminder",
    bodyInText: "Don't forget our meeting tomorrow at 10 AM."
};
gmail:Message result = check gmailClient->sendMessage(message);
```

### Send HTML Email

Send an email with HTML body content.

```ballerina
gmail:MessageRequest message = {
    to: ["recipient@example.com"],
    subject: "Monthly Report",
    bodyInHtml: "<h1>Monthly Report</h1><p>Please find the summary below.</p>"
};
gmail:Message result = check gmailClient->sendMessage(message);
```

### Send Email with CC and BCC

```ballerina
gmail:MessageRequest message = {
    to: ["primary@example.com"],
    cc: ["manager@example.com"],
    bcc: ["archive@example.com"],
    subject: "Project Update",
    bodyInText: "The project is on track for delivery."
};
gmail:Message result = check gmailClient->sendMessage(message);
```

### Send Email with Attachment

Send an email with a file attachment.

```ballerina
gmail:MessageRequest message = {
    to: ["recipient@example.com"],
    subject: "Invoice Attached",
    bodyInText: "Please find the invoice attached.",
    attachments: [
        {
            name: "invoice.pdf",
            mimeType: "application/pdf",
            content: pdfBytes
        }
    ]
};
gmail:Message result = check gmailClient->sendMessage(message);
```

## Message Read Operations

### List Messages

List messages matching a search query.

```ballerina
gmail:ListMessagesResponse messageList = check gmailClient->listMessages(
    q = "is:unread subject:invoice"
);
```

### Get Message

Read a specific message by its ID.

```ballerina
gmail:Message message = check gmailClient->getMessage(messageId);
string subject = message.headerSubject ?: "";
string 'from = message.headerFrom ?: "";
```

### Get Attachment

Download a specific attachment from a message.

```ballerina
gmail:Attachment attachment = check gmailClient->getAttachment(messageId, attachmentId);
byte[] fileContent = attachment.data;
```

### Search Messages

Search for messages using Gmail search syntax.

```ballerina
gmail:ListMessagesResponse results = check gmailClient->listMessages(
    q = "from:sender@example.com after:2024/01/01 has:attachment"
);
```

## Message Actions

### Modify Message Labels

Add or remove labels from a message.

```ballerina
gmail:Message modified = check gmailClient->modifyMessage(messageId, {
    addLabelIds: ["STARRED"],
    removeLabelIds: ["UNREAD"]
});
```

### Trash Message

Move a message to trash.

```ballerina
check gmailClient->trashMessage(messageId);
```

### Untrash Message

Restore a message from trash.

```ballerina
check gmailClient->untrashMessage(messageId);
```

### Delete Message

Permanently delete a message (cannot be undone).

```ballerina
check gmailClient->deleteMessage(messageId);
```

## Thread Operations

### List Threads

List email threads.

```ballerina
gmail:ListThreadsResponse threads = check gmailClient->listThreads(
    q = "subject:project-alpha"
);
```

### Get Thread

Read a complete email thread.

```ballerina
gmail:MailThread thread = check gmailClient->getThread(threadId);
```

### Trash Thread

Move an entire thread to trash.

```ballerina
check gmailClient->trashThread(threadId);
```

## Draft Operations

### Create Draft

Create a draft email message.

```ballerina
gmail:MessageRequest draftContent = {
    to: ["recipient@example.com"],
    subject: "Draft: Quarterly Review",
    bodyInText: "This is a draft for the quarterly review email."
};
gmail:Draft draft = check gmailClient->createDraft(draftContent);
```

### List Drafts

List all draft messages.

```ballerina
gmail:ListDraftsResponse drafts = check gmailClient->listDrafts();
```

### Send Draft

Send a previously created draft.

```ballerina
gmail:Message sent = check gmailClient->sendDraft(draftId);
```

## Label Operations

### Create Label

Create a custom label.

```ballerina
gmail:Label newLabel = check gmailClient->createLabel({
    name: "Integration/Alerts",
    labelListVisibility: "labelShow",
    messageListVisibility: "show"
});
```

### List Labels

List all labels in the mailbox.

```ballerina
gmail:Label[] labels = check gmailClient->listLabels();
```

### Delete Label

Delete a custom label.

```ballerina
check gmailClient->deleteLabel(labelId);
```

## Error Handling

```ballerina
import ballerina/log;

do {
    gmail:Message msg = check gmailClient->getMessage(messageId);
    log:printInfo("Message retrieved", subject = msg.headerSubject);
} on fail error e {
    log:printError("Failed to read message", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Reference on Ballerina Central](https://central.ballerina.io/ballerinax/googleapis.gmail/4.2.0)
