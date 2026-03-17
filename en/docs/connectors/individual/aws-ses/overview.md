---
title: "Amazon SES"
description: "Overview of the ballerinax/aws.ses connector for WSO2 Integrator."
---

# Amazon SES

| | |
|---|---|
| **Package** | [`ballerinax/aws.ses`](https://central.ballerina.io/ballerinax/aws.ses/latest) |
| **Version** | 2.1.0 |
| **Category** | Cloud Services - Messaging |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.ses/2.1.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.ses/2.1.0#functions) |

## Overview

The `ballerinax/aws.ses` connector provides programmatic access to Amazon Simple Email Service (SES) from WSO2 Integrator. Amazon SES is a cloud-based email sending service designed for sending transactional, marketing, and notification emails. This connector enables you to send emails, manage email identities, create and use email templates, and handle bounce/complaint notifications.

## Key Capabilities

- **Send Email** -- Send formatted or raw emails to single or multiple recipients
- **Email Templates** -- Create, update, and use email templates with dynamic substitution
- **Identity Management** -- Verify and manage email addresses and domains
- **Bulk Sending** -- Send templated emails to multiple recipients efficiently
- **HTML and Text** -- Support for both HTML and plain-text email bodies

## Use Cases

| Scenario | Description |
|---|---|
| Transactional Email | Send order confirmations, password resets, and receipts |
| Alert Notifications | Deliver system alerts and monitoring notifications |
| Bulk Campaigns | Send templated marketing emails to subscriber lists |
| Workflow Notifications | Trigger emails on integration workflow events |
| Report Distribution | Email generated reports to stakeholders |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "aws.ses"
version = "2.1.0"
```

```ballerina
import ballerinax/aws.ses;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

ses:ConnectionConfig sesConfig = {
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
};

ses:Client sesClient = check new (sesConfig);
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.3.0+ |
| Amazon SES API | v2 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure credentials and permissions
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/aws.ses/2.1.0)
- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
