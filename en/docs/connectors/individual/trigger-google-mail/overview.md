---
title: "Gmail Trigger"
description: "Overview of the ballerinax/trigger.google.mail connector for WSO2 Integrator."
---

# Gmail Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.google.mail`](https://central.ballerina.io/ballerinax/trigger.google.mail/latest) |
| **Version** | 0.11.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.google.mail/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.google.mail/latest#functions) |

## Overview

The `ballerinax/trigger.google.mail` module provides a listener that detects changes in a Gmail mailbox and dispatches events to your Ballerina service. It uses the [Gmail API v1](https://developers.google.com/gmail/api) combined with Google Cloud Pub/Sub to deliver push notifications when new emails arrive, labels change, or attachments are received.

The listener watches the authenticated user's mailbox via Pub/Sub and triggers remote functions for each type of change detected.

### Supported events

| Event | Remote function | Description |
|---|---|---|
| New email | `onNewEmail` | A new email message is received |
| New thread | `onNewThread` | A new email thread (conversation) is started |
| Label added | `onEmailLabelAdded` | A label is added to an email message |
| Label removed | `onEmailLabelRemoved` | A label is removed from an email message |
| Email starred | `onEmailStarred` | A star is added to an email message |
| Star removed | `onEmailStarRemoved` | A star is removed from an email message |
| New attachment | `onNewAttachment` | An email with a new attachment is received |

### Common use cases

- **Automated email processing** -- Parse incoming emails to extract order confirmations, support tickets, or invoices and route them to the appropriate system.
- **Lead capture** -- Detect new emails from potential customers and create records in a CRM such as Salesforce or HubSpot.
- **Attachment processing** -- Automatically download and process attachments (PDFs, spreadsheets) from incoming emails.
- **Email classification** -- Monitor label changes to track email triage workflows and generate metrics on response times.
- **Notification relay** -- Forward important emails to Slack, Microsoft Teams, or SMS via Twilio.

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.google.mail"
version = "0.11.0"
```

```ballerina
import ballerinax/trigger.google.mail as mail;
import ballerina/log;

mail:ListenerConfig config = {
    clientId: "<CLIENT_ID>",
    clientSecret: "<CLIENT_SECRET>",
    refreshUrl: "https://oauth2.googleapis.com/token",
    refreshToken: "<REFRESH_TOKEN>",
    pushEndpoint: "https://your-domain.ngrok.io",
    project: "<GCP_PROJECT_ID>"
};

listener mail:Listener gmailListener = new (config, 8090);

service mail:GmailService on gmailListener {

    remote function onNewEmail(mail:Message message) returns error? {
        log:printInfo("New email received",
            subject = message?.subject.toString());
    }

    remote function onNewThread(mail:MailThread thread) returns error? { return; }
    remote function onEmailLabelAdded(mail:ChangedLabel changedLabel) returns error? { return; }
    remote function onEmailLabelRemoved(mail:ChangedLabel changedLabel) returns error? { return; }
    remote function onEmailStarred(mail:Message message) returns error? { return; }
    remote function onEmailStarRemoved(mail:Message message) returns error? { return; }
    remote function onNewAttachment(mail:MailAttachment attachment) returns error? { return; }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.google.mail/latest)
