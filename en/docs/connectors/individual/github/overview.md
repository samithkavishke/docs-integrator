---
title: "GitHub"
description: "Overview of the ballerinax/github connector for WSO2 Integrator."
---

# GitHub

| | |
|---|---|
| **Package** | [`ballerinax/github`](https://central.ballerina.io/ballerinax/github/latest) |
| **Version** | 5.1.0 |
| **Category** | Developer Tools |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/github/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/github/latest#functions) |

## Overview

GitHub is a widely used platform for version control and collaboration, allowing developers to work together on projects from anywhere. The `ballerinax/github` connector interfaces with [GitHub's REST API (version 2022-11-28)](https://docs.github.com/en/rest?apiVersion=2022-11-28), enabling programmatic access to GitHub's services from WSO2 Integrator applications.

The connector supports:

- **Repository Management** - Create, update, list, and delete repositories
- **Issue Tracking** - Create, update, assign, and label issues
- **Pull Requests** - Open, review, merge, and manage pull requests
- **Releases** - Create and manage releases and tags
- **User Operations** - Access user profile and repository information
- **Organization Management** - List and manage organization resources

## Key Capabilities

| Capability | Description |
|---|---|
| Repository CRUD | Create private/public repos, update settings, manage collaborators |
| Issue Management | Create issues, assign users, add labels and milestones |
| Pull Request Workflow | Open PRs, request reviews, merge with various strategies |
| Release Automation | Create releases, upload assets, manage tags |
| Search | Search repositories, issues, pull requests, and code |
| Webhooks | Configure repository webhooks for event-driven integrations |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "github"
version = "5.1.0"
```

```ballerina
import ballerinax/github;

configurable string token = ?;

github:ConnectionConfig config = {
    auth: {
        token: token
    }
};

github:Client github = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| CI/CD Automation | Trigger builds, create releases, and manage deployment workflows |
| Issue Triage | Automatically label, assign, and categorize incoming issues |
| Repository Setup | Initialize new projects with README, license, and collaborators |
| Release Management | Automate changelog generation and release publishing |
| Cross-Platform Sync | Sync GitHub issues with Jira, Asana, or other project tools |
| Compliance Auditing | Monitor repository settings, branch protection, and access |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [GitHub REST API Documentation](https://docs.github.com/en/rest)
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/github/latest)
