---
title: "Jira"
description: "Overview of the ballerinax/jira connector for WSO2 Integrator."
---

# Jira

| | |
|---|---|
| **Package** | [`ballerinax/jira`](https://central.ballerina.io/ballerinax/jira/latest) |
| **Version** | 2.0.1 |
| **Category** | Project Management |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/jira/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/jira/latest#functions) |

## Overview

Jira is a project management and issue tracking platform by Atlassian, widely used for agile software development, bug tracking, and workflow management. The `ballerinax/jira` connector interfaces with [Jira REST API v3 (Cloud)](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/), enabling programmatic access to Jira's services from WSO2 Integrator applications.

The connector supports:

- **Issue Management** - Create, update, search, transition, and delete issues
- **Project Operations** - List and manage projects, components, and versions
- **User Management** - Search and manage users, assignees, and reporters
- **Workflow Transitions** - Move issues through workflow states
- **Comments** - Add and manage comments on issues using Atlassian Document Format
- **Search (JQL)** - Execute Jira Query Language searches across issues

## Key Capabilities

| Capability | Description |
|---|---|
| Issue CRUD | Create, read, update, and delete issues of any type |
| JQL Search | Search issues using Jira Query Language |
| Workflow Transitions | Move issues between workflow statuses |
| Comments (ADF) | Add rich-text comments using Atlassian Document Format |
| Attachments | Upload and manage issue attachments |
| Bulk Operations | Create or update multiple issues in a single request |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "jira"
version = "2.0.1"
```

```ballerina
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

jira:ConnectionConfig config = {
    auth: {
        username: username,
        password: apiToken
    }
};

jira:Client jira = check new (config, serviceUrl);
```

## Use Cases

| Use Case | Description |
|---|---|
| Bug Tracking | Automate bug creation from monitoring or support systems |
| Sprint Management | Create and organize sprint issues programmatically |
| Cross-Tool Sync | Sync Jira issues with GitHub, Trello, or Asana |
| Status Reporting | Generate project status reports from JQL queries |
| Incident Management | Auto-create Jira tickets from PagerDuty or OpsGenie alerts |
| Release Tracking | Manage versions and track release progress |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Jira REST API Documentation](https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/)
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/jira/latest)
