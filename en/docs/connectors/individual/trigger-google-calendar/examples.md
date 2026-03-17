---
title: "Google Calendar Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.google.calendar connector."
---

# Google Calendar Trigger Examples

## Example 1: Log all calendar event changes

A basic listener that logs every calendar event creation, update, and deletion. Useful for verifying the trigger setup during development.

```ballerina
import ballerina/log;
import ballerinax/trigger.google.calendar as calendar;

configurable string calendarId = "primary";
configurable string address = ?;
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

listener calendar:Listener calendarListener = new (listenerConfig = {
    calendarId: calendarId,
    address: address,
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

service calendar:CalendarService on calendarListener {

    remote function onNewEvent(calendar:Event payload) returns error? {
        log:printInfo("New event created",
            eventId = payload?.id.toString(),
            summary = payload?.summary.toString(),
            startTime = payload?.start.toString());
    }

    remote function onEventUpdate(calendar:Event payload) returns error? {
        log:printInfo("Event updated",
            eventId = payload?.id.toString(),
            summary = payload?.summary.toString(),
            status = payload?.status.toString());
    }

    remote function onEventDelete(calendar:Event payload) returns error? {
        log:printInfo("Event deleted",
            eventId = payload?.id.toString());
    }
}
```

**Config.toml:**

```toml
calendarId = "primary"
address = "https://abc123.ngrok.io"
refreshToken = "<YOUR_REFRESH_TOKEN>"
clientId = "<YOUR_CLIENT_ID>"
clientSecret = "<YOUR_CLIENT_SECRET>"
```

## Example 2: Send a Slack-style notification for new meetings

This example listens for new calendar events and sends the event details to a webhook URL (such as Slack or Microsoft Teams) to notify a channel about upcoming meetings.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.google.calendar as calendar;

configurable string calendarId = "primary";
configurable string address = ?;
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string webhookUrl = ?;

listener calendar:Listener calendarListener = new (listenerConfig = {
    calendarId: calendarId,
    address: address,
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

final http:Client webhookClient = check new (webhookUrl);

service calendar:CalendarService on calendarListener {

    remote function onNewEvent(calendar:Event payload) returns error? {
        string summary = (payload?.summary ?: "Untitled Event").toString();
        string location = (payload?.location ?: "No location").toString();
        string startTime = (payload?.start ?: "TBD").toString();

        json notification = {
            text: string `New meeting: ${summary} at ${location} starting ${startTime}`
        };

        http:Response resp = check webhookClient->post("/", notification);
        log:printInfo("Notification sent",
            statusCode = resp.statusCode,
            event = summary);
    }

    remote function onEventUpdate(calendar:Event payload) returns error? {
        return;
    }

    remote function onEventDelete(calendar:Event payload) returns error? {
        return;
    }
}
```

## Example 3: Sync calendar deletions to an external system

When a calendar event is deleted, this example notifies an external scheduling system so it can remove the corresponding entry.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.google.calendar as calendar;

configurable string calendarId = "primary";
configurable string address = ?;
configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string schedulingApiUrl = ?;

listener calendar:Listener calendarListener = new (listenerConfig = {
    calendarId: calendarId,
    address: address,
    auth: {
        refreshUrl: "https://oauth2.googleapis.com/token",
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

final http:Client schedulingClient = check new (schedulingApiUrl);

service calendar:CalendarService on calendarListener {

    remote function onNewEvent(calendar:Event payload) returns error? {
        return;
    }

    remote function onEventUpdate(calendar:Event payload) returns error? {
        return;
    }

    remote function onEventDelete(calendar:Event payload) returns error? {
        do {
            string eventId = (payload?.id ?: "").toString();
            if eventId == "" {
                log:printWarn("Received delete event with no ID");
                return;
            }
            http:Response resp = check schedulingClient->delete(
                string `/events/${eventId}`);
            log:printInfo("Synced event deletion",
                eventId = eventId,
                statusCode = resp.statusCode);
        } on fail error e {
            log:printError("Failed to sync deletion", 'error = e);
        }
    }
}
```

## Running the examples

1. Set up OAuth 2.0 credentials as described in the [Setup Guide](setup).
2. Expose your local service using ngrok: `ngrok http 8090`
3. Copy the ngrok HTTPS forwarding URL into `Config.toml` as the `address`.
4. Compile and run: `bal run`
5. Create, edit, or delete a calendar event to see events dispatched.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
