---
title: "Gmail Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.google.mail connector."
---

# Gmail Trigger Examples

## Example 1: Log all incoming emails

A minimal listener that logs every new email received in the mailbox. This is the simplest way to verify that the Gmail trigger is set up correctly.

```ballerina
import ballerina/log;
import ballerinax/trigger.google.mail as mail;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string pushEndpoint = ?;
configurable string project = ?;

mail:ListenerConfig config = {
    clientId: clientId,
    clientSecret: clientSecret,
    refreshUrl: "https://oauth2.googleapis.com/token",
    refreshToken: refreshToken,
    pushEndpoint: pushEndpoint,
    project: project
};

listener mail:Listener gmailListener = new (config, 8090);

service mail:GmailService on gmailListener {

    remote function onNewEmail(mail:Message message) returns error? {
        log:printInfo("New email received",
            subject = message?.subject.toString(),
            sender = message?.'from.toString());
    }

    remote function onNewThread(mail:MailThread thread) returns error? {
        log:printInfo("New thread started");
    }

    remote function onEmailLabelAdded(mail:ChangedLabel changedLabel) returns error? {
        return;
    }

    remote function onEmailLabelRemoved(mail:ChangedLabel changedLabel) returns error? {
        return;
    }

    remote function onEmailStarred(mail:Message message) returns error? {
        return;
    }

    remote function onEmailStarRemoved(mail:Message message) returns error? {
        return;
    }

    remote function onNewAttachment(mail:MailAttachment attachment) returns error? {
        return;
    }
}
```

**Config.toml:**

```toml
clientId = "<YOUR_CLIENT_ID>"
clientSecret = "<YOUR_CLIENT_SECRET>"
refreshToken = "<YOUR_REFRESH_TOKEN>"
pushEndpoint = "https://abc123.ngrok.io"
project = "my-gcp-project-id"
```

## Example 2: Forward new emails to a REST API

This example captures incoming emails and forwards selected details to a downstream webhook (for example, a ticketing system or CRM).

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.google.mail as mail;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string pushEndpoint = ?;
configurable string project = ?;
configurable string webhookUrl = ?;

mail:ListenerConfig config = {
    clientId: clientId,
    clientSecret: clientSecret,
    refreshUrl: "https://oauth2.googleapis.com/token",
    refreshToken: refreshToken,
    pushEndpoint: pushEndpoint,
    project: project
};

listener mail:Listener gmailListener = new (config, 8090);

final http:Client webhookClient = check new (webhookUrl);

service mail:GmailService on gmailListener {

    remote function onNewEmail(mail:Message message) returns error? {
        json emailEvent = {
            event: "new_email",
            subject: message?.subject,
            sender: message?.'from
        };
        http:Response resp = check webhookClient->post("/email-events", emailEvent);
        log:printInfo("Email forwarded to webhook",
            statusCode = resp.statusCode);
    }

    remote function onNewThread(mail:MailThread thread) returns error? { return; }
    remote function onEmailLabelAdded(mail:ChangedLabel changedLabel) returns error? { return; }
    remote function onEmailLabelRemoved(mail:ChangedLabel changedLabel) returns error? { return; }
    remote function onEmailStarred(mail:Message message) returns error? { return; }
    remote function onEmailStarRemoved(mail:Message message) returns error? { return; }
    remote function onNewAttachment(mail:MailAttachment attachment) returns error? { return; }
}
```

## Example 3: Process new attachments

This example focuses on the `onNewAttachment` event, logging attachment metadata when a new email with an attachment arrives.

```ballerina
import ballerina/log;
import ballerinax/trigger.google.mail as mail;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string pushEndpoint = ?;
configurable string project = ?;

mail:ListenerConfig config = {
    clientId: clientId,
    clientSecret: clientSecret,
    refreshUrl: "https://oauth2.googleapis.com/token",
    refreshToken: refreshToken,
    pushEndpoint: pushEndpoint,
    project: project
};

listener mail:Listener gmailListener = new (config, 8090);

service mail:GmailService on gmailListener {

    remote function onNewEmail(mail:Message message) returns error? { return; }
    remote function onNewThread(mail:MailThread thread) returns error? { return; }
    remote function onEmailLabelAdded(mail:ChangedLabel changedLabel) returns error? { return; }
    remote function onEmailLabelRemoved(mail:ChangedLabel changedLabel) returns error? { return; }
    remote function onEmailStarred(mail:Message message) returns error? { return; }
    remote function onEmailStarRemoved(mail:Message message) returns error? { return; }

    remote function onNewAttachment(mail:MailAttachment attachment) returns error? {
        do {
            log:printInfo("New attachment detected",
                payload = attachment.toString());
        } on fail error e {
            log:printError("Failed to process attachment", 'error = e);
        }
    }
}
```

## Running the examples

1. Enable the Gmail API and Cloud Pub/Sub API in your Google Cloud Console.
2. Create OAuth 2.0 credentials and set up a Pub/Sub topic as described in the [Setup Guide](setup).
3. Expose your local service using ngrok: `ngrok http 8090`
4. Update `Config.toml` with your credentials and the ngrok forwarding URL.
5. Compile and run: `bal run`
6. Send an email to the configured Gmail account to observe the triggered events.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
