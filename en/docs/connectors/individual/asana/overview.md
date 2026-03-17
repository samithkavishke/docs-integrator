---
title: "Asana"
description: "Overview of the ballerinax/asana connector for WSO2 Integrator."
---

# Asana

| | |
|---|---|
| **Package** | [`ballerinax/asana`](https://central.ballerina.io/ballerinax/asana/latest) |
| **Version** | 3.0.0 |
| **Category** | Project Management |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/asana/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/asana/latest#functions) |

## Overview

Asana is a project management and team collaboration tool that enables teams to organize, track, and manage their work. The `ballerinax/asana` connector interfaces with [Asana's REST API](https://developers.asana.com/reference/rest-api-reference), enabling programmatic access to Asana's services from WSO2 Integrator applications.

The connector supports:

- **Task Management** - Create, update, assign, and complete tasks
- **Project Operations** - Create and manage projects, sections, and milestones
- **Workspace Management** - Access workspace resources and members
- **User Operations** - Look up users and manage team memberships
- **Search** - Search tasks, projects, and other resources across workspaces
- **Custom Fields** - Read and update custom field values on tasks

## Key Capabilities

| Capability | Description |
|---|---|
| Task CRUD | Create, read, update, delete, and complete tasks |
| Project Management | Create projects, organize sections, set milestones |
| Assignee Management | Assign and reassign tasks to team members |
| Due Dates | Set and update due dates and start dates on tasks |
| Tags and Custom Fields | Categorize tasks with tags and custom metadata |
| Subtasks | Create and manage subtask hierarchies |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "asana"
version = "3.0.0"
```

```ballerina
import ballerinax/asana;

configurable string token = ?;

asana:ConnectionConfig config = {
    auth: {
        token: token
    }
};

asana:Client asana = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| Issue-to-Task Sync | Create Asana tasks from GitHub issues or Jira tickets |
| Sprint Planning | Automate sprint board setup with sections and tasks |
| Status Reporting | Generate project status reports from task data |
| Onboarding Workflows | Create templated task lists for new employee onboarding |
| Cross-Tool Integration | Sync Asana tasks with Slack notifications or email |
| Time Tracking | Extract task completion data for time tracking dashboards |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Asana API Documentation](https://developers.asana.com/reference/rest-api-reference)
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/asana/latest)
