---
title: "SendGrid"
description: "Overview of the ballerinax/sendgrid connector for WSO2 Integrator."
---

# SendGrid

| | |
|---|---|
| **Package** | [`ballerinax/sendgrid`](https://central.ballerina.io/ballerinax/sendgrid/latest) |
| **Version** | 1.5.1 |
| **Category** | Communication |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/sendgrid/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/sendgrid/latest#functions) |

## Overview

SendGrid (now Twilio SendGrid) is a cloud-based email delivery platform that provides reliable transactional and marketing email services. The `ballerinax/sendgrid` connector enables WSO2 Integrator applications to send emails, manage templates, and handle email delivery through the SendGrid Web API v3.

The connector supports:

- **Email Sending** - Send transactional and marketing emails with HTML/plain text content
- **Template Management** - Use dynamic transactional templates for consistent branding
- **Personalization** - Send personalized emails to multiple recipients with dynamic data
- **Attachments** - Include file attachments in outbound emails
- **Categories and Tracking** - Tag emails with categories for analytics

## Key Capabilities

| Capability | Description |
|---|---|
| Transactional Email | Send order confirmations, receipts, and notifications |
| Template Engine | Use SendGrid dynamic templates with variable substitution |
| Bulk Sending | Send personalized emails to multiple recipients |
| Attachment Support | Attach files (PDF, images, documents) to emails |
| Delivery Tracking | Track email delivery, opens, and clicks via categories |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "sendgrid"
version = "1.5.1"
```

```ballerina
import ballerinax/sendgrid;

configurable string apiKey = ?;

sendgrid:ConnectionConfig config = {
    auth: {
        token: apiKey
    }
};

sendgrid:Client sendgrid = check new (config);
```

## Use Cases

| Use Case | Description |
|---|---|
| Order Confirmations | Send transactional emails when orders are placed |
| Password Reset | Send password reset links with secure tokens |
| Notification Emails | Alert users about account activity or system events |
| Marketing Campaigns | Send templated marketing emails to subscriber lists |
| Report Delivery | Email generated reports as attachments |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [SendGrid API Documentation](https://docs.sendgrid.com/api-reference)
