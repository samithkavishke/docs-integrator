---
title: "Slack"
description: "Overview of the ballerinax/slack connector for WSO2 Integrator."
---

# Slack

| | |
|---|---|
| **Package** | [`ballerinax/slack`](https://central.ballerina.io/ballerinax/slack/latest) |
| **Version** | 5.0.0 |
| **Category** | Communication & Collaboration |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/slack/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/slack/latest#functions) |

## Overview

Slack is a collaboration platform for teams, offering real-time messaging, file sharing, and integrations with various tools. The `ballerinax/slack` connector enables WSO2 Integrator applications to interact with the Slack Web API to send messages, manage channels, handle users, and more.

The connector supports:

- **Messaging** - Send, update, and delete messages in channels and direct messages
- **Channel Management** - Create, archive, invite users, and manage channel settings
- **User Management** - Look up users, retrieve profiles, and manage presence
- **File Sharing** - Upload, share, and manage files within Slack
- **Conversations** - List, join, and manage conversations across the workspace

## Key Capabilities

| Capability | Description |
|---|---|
| Post Messages | Send plain text, rich formatted, and Block Kit messages |
| Channel Operations | Create channels, invite users, set topics and purposes |
| User Lookup | Find users by email, ID, or list all workspace members |
| File Management | Upload and share files to channels or direct messages |
| Message Threading | Reply to messages in threads for organized discussions |
| Scheduled Messages | Schedule messages for future delivery |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "slack"
version = "5.0.0"
```

```ballerina
import ballerinax/slack;

configurable string token = ?;

slack:Client slack = check new ({
    auth: {
        token
    }
});
```

## Use Cases

| Use Case | Description |
|---|---|
| Alert Notifications | Send system alerts and monitoring notifications to ops channels |
| CI/CD Updates | Post build and deployment status messages |
| Daily Standups | Generate automated summary reports from channel messages |
| Incident Management | Create incident channels and coordinate response |
| Customer Feedback | Route customer feedback from external systems to Slack |
| Onboarding Automation | Invite new team members to relevant channels |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Slack API Documentation](https://api.slack.com/methods)
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/slack/latest)
