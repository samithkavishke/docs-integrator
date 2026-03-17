---
title: "Google Calendar Trigger"
description: "Overview of the ballerinax/trigger.google.calendar connector for WSO2 Integrator."
---

# Google Calendar Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.google.calendar`](https://central.ballerina.io/ballerinax/trigger.google.calendar/latest) |
| **Version** | 0.12.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.google.calendar/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.google.calendar/latest#functions) |

## Overview

The `ballerinax/trigger.google.calendar` module provides a listener that receives events when calendar entries are created, updated, or deleted in Google Calendar. It uses the [Google Calendar API v3](https://developers.google.com/calendar/api/v3/reference) push notifications to deliver real-time change events to your Ballerina service.

The listener registers a watch channel with Google Calendar, and Google pushes change notifications to your service's callback URL. The listener then fetches the detailed event data and dispatches it to the appropriate remote function.

### Supported events

| Event | Remote function | Description |
|---|---|---|
| New event | `onNewEvent` | A new calendar event is created |
| Event updated | `onEventUpdate` | An existing calendar event is modified |
| Event deleted | `onEventDelete` | A calendar event is deleted or cancelled |

### Common use cases

- **Meeting room booking** -- Automatically provision resources or send notifications when meetings are created on a shared calendar.
- **Scheduling integrations** -- Sync Google Calendar events to external project management tools (Jira, Asana) or CRM systems (Salesforce).
- **Attendance tracking** -- Detect event updates (accepted, declined, tentative) and log attendance data for reporting.
- **Automated reminders** -- Send custom notifications via email, SMS, or Slack when calendar events are created or updated.
- **Conflict detection** -- Monitor calendars for overlapping events and alert organizers about scheduling conflicts.

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.google.calendar"
version = "0.12.0"
```

```ballerina
import ballerinax/trigger.google.calendar as calendar;
import ballerina/log;

listener calendar:Listener calendarListener = new (listenerConfig = {
    calendarId: "primary",
    address: "https://your-domain.ngrok.io",
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: "<REFRESH_TOKEN>",
        clientId: "<CLIENT_ID>",
        clientSecret: "<CLIENT_SECRET>"
    }
});

service calendar:CalendarService on calendarListener {
    remote function onNewEvent(calendar:Event payload) returns error? {
        log:printInfo("New event created", summary = payload?.summary.toString());
    }

    remote function onEventUpdate(calendar:Event payload) returns error? {
        log:printInfo("Event updated", summary = payload?.summary.toString());
    }

    remote function onEventDelete(calendar:Event payload) returns error? {
        log:printInfo("Event deleted");
    }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.google.calendar/latest)
