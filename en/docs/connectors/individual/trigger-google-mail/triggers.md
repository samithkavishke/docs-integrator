---
title: "Gmail Trigger - Triggers"
description: "Available trigger events and payload types for the ballerinax/trigger.google.mail connector."
---

# Gmail Trigger - Available Events

The `ballerinax/trigger.google.mail` listener uses the Gmail API v1 with Google Cloud Pub/Sub to push mailbox change notifications. The listener detects new messages, label changes, stars, threads, and attachments.

## Listener initialization

The listener requires OAuth 2.0 credentials, a Cloud Pub/Sub project, and a public callback endpoint. The listener listens on the specified port and registers a Pub/Sub watch on the user's mailbox.

```ballerina
import ballerinax/trigger.google.mail as mail;

mail:ListenerConfig config = {
    clientId: "<CLIENT_ID>",
    clientSecret: "<CLIENT_SECRET>",
    refreshUrl: "https://oauth2.googleapis.com/token",
    refreshToken: "<REFRESH_TOKEN>",
    pushEndpoint: "https://your-domain.ngrok.io",
    project: "<GCP_PROJECT_ID>"
};

listener mail:Listener gmailListener = new (config, 8090);
```

### Configuration fields

| Field | Type | Description |
|---|---|---|
| `clientId` | `string` | OAuth 2.0 client ID from Google Cloud Console |
| `clientSecret` | `string` | OAuth 2.0 client secret |
| `refreshUrl` | `string` | Token refresh URL (use `https://oauth2.googleapis.com/token`) |
| `refreshToken` | `string` | OAuth 2.0 refresh token |
| `pushEndpoint` | `string` | Publicly accessible HTTPS URL for Pub/Sub push notifications |
| `project` | `string` | Google Cloud Platform project ID (the project where Pub/Sub is enabled) |

Externalize credentials via `Config.toml`:

```toml
# Config.toml
[config]
clientId = "<CLIENT_ID>"
clientSecret = "<CLIENT_SECRET>"
refreshUrl = "https://oauth2.googleapis.com/token"
refreshToken = "<REFRESH_TOKEN>"
pushEndpoint = "https://abc123.ngrok.io"
project = "my-gcp-project-id"
```

## Service type: `GmailService`

Implement the `mail:GmailService` to handle all seven event types. All remote functions must be defined.

```ballerina
service mail:GmailService on gmailListener {

    remote function onNewEmail(mail:Message message) returns error? {
        // A new email was received
    }

    remote function onNewThread(mail:MailThread thread) returns error? {
        // A new conversation thread was started
    }

    remote function onEmailLabelAdded(mail:ChangedLabel changedLabel) returns error? {
        // A label was added to an email
    }

    remote function onEmailLabelRemoved(mail:ChangedLabel changedLabel) returns error? {
        // A label was removed from an email
    }

    remote function onEmailStarred(mail:Message message) returns error? {
        // An email was starred
    }

    remote function onEmailStarRemoved(mail:Message message) returns error? {
        // A star was removed from an email
    }

    remote function onNewAttachment(mail:MailAttachment attachment) returns error? {
        // A new email with an attachment was received
    }
}
```

## Event: `onNewEmail`

Fires when a new email is received in the mailbox. The payload is a `mail:Message` record.

```ballerina
remote function onNewEmail(mail:Message message) returns error? {
    log:printInfo("New email received",
        subject = message?.subject.toString(),
        sender = message?.'from.toString());
}
```

## Event: `onNewThread`

Fires when a new email thread (conversation) is started. The payload is a `mail:MailThread` record.

## Event: `onEmailLabelAdded` / `onEmailLabelRemoved`

Fires when a label is added to or removed from an email. The payload is a `mail:ChangedLabel` record containing the message ID and the changed label information.

```ballerina
remote function onEmailLabelAdded(mail:ChangedLabel changedLabel) returns error? {
    log:printInfo("Label added to email", payload = changedLabel.toString());
}
```

## Event: `onEmailStarred` / `onEmailStarRemoved`

Fires when a star is added to or removed from an email. The payload is a `mail:Message` record.

## Event: `onNewAttachment`

Fires when an email with a new attachment is received. The payload is a `mail:MailAttachment` record containing attachment metadata.

```ballerina
remote function onNewAttachment(mail:MailAttachment attachment) returns error? {
    log:printInfo("New attachment received", payload = attachment.toString());
}
```

## Payload types summary

| Payload type | Used by | Description |
|---|---|---|
| `mail:Message` | `onNewEmail`, `onEmailStarred`, `onEmailStarRemoved` | Email message details |
| `mail:MailThread` | `onNewThread` | Email thread/conversation details |
| `mail:ChangedLabel` | `onEmailLabelAdded`, `onEmailLabelRemoved` | Label change information |
| `mail:MailAttachment` | `onNewAttachment` | Attachment metadata |

## Error handling

```ballerina
remote function onNewEmail(mail:Message message) returns error? {
    do {
        string subject = (message?.subject ?: "No Subject").toString();
        log:printInfo("Processing email", subject = subject);
    } on fail error e {
        log:printError("Failed to process email", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
