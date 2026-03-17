---
title: "Gmail"
description: "Overview of the ballerinax/googleapis.gmail connector for WSO2 Integrator."
---

# Gmail

| | |
|---|---|
| **Package** | [`ballerinax/googleapis.gmail`](https://central.ballerina.io/ballerinax/googleapis.gmail/latest) |
| **Version** | 4.2.0 |
| **Category** | Cloud Services - Email |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/googleapis.gmail/4.2.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/googleapis.gmail/4.2.0#functions) |

## Overview

The `ballerinax/googleapis.gmail` connector provides programmatic access to the Gmail API v1 from WSO2 Integrator. Gmail is a widely-used email service provided by Google, and this connector enables you to send emails, read messages, manage labels, handle drafts, and work with threads and attachments programmatically.

## Key Capabilities

- **Send Emails** -- Compose and send plain text, HTML, and multipart emails
- **Read Messages** -- List, search, and read email messages and threads
- **Attachments** -- Send and download file attachments
- **Label Management** -- Create, update, delete, and assign labels
- **Draft Management** -- Create, update, list, and send draft emails
- **Thread Operations** -- Read and manage email threads
- **Message Actions** -- Modify, trash, untrash, and delete messages

## Use Cases

| Scenario | Description |
|---|---|
| Notification Delivery | Send automated email notifications from integration workflows |
| Email Processing | Read and parse incoming emails to trigger business processes |
| Report Distribution | Email generated reports to stakeholders automatically |
| Alert System | Send alert emails when monitoring thresholds are exceeded |
| Customer Communication | Automate response emails based on form submissions or orders |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "googleapis.gmail"
version = "4.2.0"
```

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

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Gmail API | v1 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure OAuth 2.0 and API access
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/googleapis.gmail/4.2.0)
- [Gmail API Documentation](https://developers.google.com/gmail/api)
