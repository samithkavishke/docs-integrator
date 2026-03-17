---
title: "Trello"
description: "Overview of the ballerinax/trello connector for WSO2 Integrator."
---

# Trello

| | |
|---|---|
| **Package** | [`ballerinax/trello`](https://central.ballerina.io/ballerinax/trello/latest) |
| **Version** | 2.0.1 |
| **Category** | Project Management |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trello/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trello/latest#functions) |

## Overview

Trello is a web-based project management and collaboration platform by Atlassian that uses boards, lists, and cards to organize tasks and workflows. The `ballerinax/trello` connector interfaces with [Trello's REST API](https://developer.atlassian.com/cloud/trello/rest/api-group-actions/), enabling programmatic access to Trello resources from WSO2 Integrator applications.

The connector supports:

- **Board Management** - Create, update, and manage Trello boards
- **List Operations** - Create and organize lists within boards
- **Card Management** - Create, move, update, and archive cards
- **Member Management** - Add and remove members from boards and cards
- **Label Operations** - Create and assign labels to cards
- **Checklist Support** - Add checklists and checklist items to cards

## Key Capabilities

| Capability | Description |
|---|---|
| Board CRUD | Create, read, update, and close boards |
| List Management | Create lists, move cards between lists, archive lists |
| Card Operations | Create cards, set due dates, add attachments, move across lists |
| Labels | Create custom labels and assign them to cards |
| Checklists | Add checklists with items to track sub-tasks on cards |
| Member Assignment | Assign team members to boards and cards |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "trello"
version = "2.0.1"
```

```ballerina
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;

trello:ConnectionConfig config = {
    auth: {
        token: token
    }
};

trello:Client trello = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| Task Tracking | Manage development tasks with boards, lists, and cards |
| Sprint Boards | Automate sprint board setup with predefined columns |
| Issue Routing | Create Trello cards from incoming support tickets |
| Status Reporting | Generate status reports from card positions on boards |
| Onboarding | Create templated boards for new hire onboarding checklists |
| Cross-Tool Sync | Sync Trello cards with GitHub issues or Jira tickets |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Trello REST API Documentation](https://developer.atlassian.com/cloud/trello/rest/)
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/trello/latest)
