---
title: "Zoom"
description: "Overview of the ballerinax/zoom connector for WSO2 Integrator."
---

# Zoom

| | |
|---|---|
| **Package** | [`ballerinax/zoom`](https://central.ballerina.io/ballerinax/zoom/latest) |
| **Version** | 1.7.1 |
| **Category** | Social & Other |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/zoom/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/zoom/latest#functions) |

## Overview

Zoom is a leading video communications platform providing meetings, webinars, and collaboration tools. The `ballerinax/zoom` connector enables WSO2 Integrator applications to interact with the [Zoom API v2](https://marketplace.zoom.us/docs/api-reference/zoom-api), providing capabilities for managing meetings, webinars, users, and related resources programmatically.

The connector supports the following functional areas:

- **Meetings** - Create, update, list, and delete meetings with full scheduling options
- **Webinars** - Manage webinar events, registrations, and attendee data
- **Users** - Manage user accounts, settings, and permissions
- **Meeting Participants** - Track participant lists, attendance, and in-meeting activity
- **Meeting Recordings** - Access and manage cloud recordings
- **Reports** - Retrieve meeting and webinar usage reports

## Key Capabilities

- **Meeting Scheduling** - Create instant or scheduled meetings with recurring options, passwords, and waiting rooms
- **Webinar Management** - Configure webinar sessions with panelists, registration forms, and Q&A settings
- **Registration Handling** - Manage attendee registrations for meetings and webinars with approval workflows
- **Recording Access** - List, download, and delete cloud recordings per meeting or user
- **User Administration** - Create, update, and deactivate user accounts across your Zoom organization
- **Reporting** - Retrieve detailed usage metrics, participant reports, and operational analytics

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "zoom"
version = "1.7.1"
```

Import and initialize the connector:

```ballerina
import ballerinax/zoom;

configurable string token = ?;

zoom:Client zoom = check new ({
    auth: {
        token: token
    }
});
```

Create a meeting:

```ballerina
import ballerina/io;

zoom:MeetingCreate201Response meeting = check zoom->meetingCreate(
    userId = "me",
    payload = {
        topic: "Weekly Team Standup",
        'type: 2,
        start_time: "2025-07-01T10:00:00Z",
        duration: 30,
        timezone: "America/Los_Angeles"
    }
);

io:println("Meeting created: ", meeting?.join_url);
```

## Use Cases

| Use Case | Description |
|---|---|
| Meeting Automation | Automatically schedule meetings when calendar events or tickets are created |
| Webinar Registration | Integrate registration forms with CRM systems for automated attendee management |
| Attendance Tracking | Monitor meeting participation and generate attendance reports |
| Recording Management | Automatically archive or distribute meeting recordings after sessions end |
| Onboarding Workflows | Create training meetings and webinars as part of employee onboarding |
| Event-driven Scheduling | Trigger meeting creation based on business events from external systems |

## Related Resources

- [Setup Guide](setup) - Configure Zoom app and authentication
- [Actions Reference](actions) - Complete list of available operations
- [Examples](examples) - End-to-end code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/zoom/latest)
- [Zoom API Documentation](https://marketplace.zoom.us/docs/api-reference/zoom-api)
