---
title: "Google Calendar Trigger - Triggers"
description: "Available trigger events and payload types for the ballerinax/trigger.google.calendar connector."
---

# Google Calendar Trigger - Available Events

The `ballerinax/trigger.google.calendar` listener connects to the Google Calendar API v3, registers a push notification channel, and dispatches calendar change events to your Ballerina service via the `CalendarService` service type.

## Listener initialization

Create the listener by providing the target calendar ID, a publicly accessible callback address, and OAuth 2.0 credentials.

```ballerina
import ballerinax/trigger.google.calendar as calendar;

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
```

### Configuration fields

| Field | Type | Description |
|---|---|---|
| `calendarId` | `string` | The Google Calendar ID to watch. Use `"primary"` for the user's primary calendar |
| `address` | `string` | The publicly accessible HTTPS URL where Google will send push notifications |
| `auth` | `record` | OAuth 2.0 credentials including `refreshUrl`, `refreshToken`, `clientId`, and `clientSecret` |

Externalize credentials via `Config.toml`:

```toml
# Config.toml
[listenerConfig]
calendarId = "primary"
address = "https://abc123.ngrok.io"

[listenerConfig.auth]
refreshUrl = "https://oauth2.googleapis.com/token"
refreshToken = "<REFRESH_TOKEN>"
clientId = "<CLIENT_ID>"
clientSecret = "<CLIENT_SECRET>"
```

## Service type: `CalendarService`

Implement the `calendar:CalendarService` to handle calendar events. All three remote functions must be defined.

```ballerina
service calendar:CalendarService on calendarListener {

    remote function onNewEvent(calendar:Event payload) returns error? {
        // Triggered when a new calendar event is created
    }

    remote function onEventUpdate(calendar:Event payload) returns error? {
        // Triggered when an existing calendar event is updated
    }

    remote function onEventDelete(calendar:Event payload) returns error? {
        // Triggered when a calendar event is deleted or cancelled
    }
}
```

## Event: `onNewEvent`

Fires when a new event is created on the watched calendar. The payload contains the full event details including summary, start/end times, attendees, and location.

```ballerina
remote function onNewEvent(calendar:Event payload) returns error? {
    log:printInfo("New event created",
        summary = payload?.summary.toString(),
        startTime = payload?.start.toString());
}
```

## Event: `onEventUpdate`

Fires when an existing calendar event is modified. Changes include title edits, time modifications, attendee updates, and status changes (confirmed, tentative, cancelled).

```ballerina
remote function onEventUpdate(calendar:Event payload) returns error? {
    log:printInfo("Event updated",
        summary = payload?.summary.toString(),
        status = payload?.status.toString());
}
```

## Event: `onEventDelete`

Fires when a calendar event is deleted or cancelled. The payload may contain limited information for deleted events.

```ballerina
remote function onEventDelete(calendar:Event payload) returns error? {
    log:printInfo("Event deleted",
        eventId = payload?.id.toString());
}
```

## `Event` payload

The `calendar:Event` record represents a Google Calendar event. Key fields include:

| Field | Type | Description |
|---|---|---|
| `id` | `string?` | Unique identifier for the calendar event |
| `summary` | `string?` | Title of the event |
| `description` | `string?` | Description or notes for the event |
| `location` | `string?` | Location of the event |
| `start` | `record {}?` | Start date/time of the event |
| `end` | `record {}?` | End date/time of the event |
| `status` | `string?` | Event status: `confirmed`, `tentative`, or `cancelled` |
| `attendees` | `record {}[]?` | List of event attendees |
| `organizer` | `record {}?` | The event organizer |
| `created` | `string?` | Creation timestamp |
| `updated` | `string?` | Last modification timestamp |

## Error handling

Each remote function returns `error?`. Use structured error handling with `do`/`on fail`:

```ballerina
remote function onNewEvent(calendar:Event payload) returns error? {
    do {
        string summary = (payload?.summary ?: "Untitled").toString();
        log:printInfo("Processing new event", summary = summary);
        // Business logic here
    } on fail error e {
        log:printError("Failed to process calendar event", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
