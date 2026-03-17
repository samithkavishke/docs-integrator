---
title: "Slack Trigger - Examples"
description: "Code examples for the ballerinax/trigger.slack trigger."
---

# Slack Trigger Examples

## Basic Event Listener

```ballerina
import ballerina/log;
import ballerina/http;
import ballerinax/trigger.slack;

configurable string webhookSecret = ?;
configurable int port = 8090;

service on new slack:Listener(port, webhookSecret) {

    remote function onEvent(json payload) returns error? {
        log:printInfo("Event received", payload = payload.toJsonString());
        // Process the event
    }
}
```

## Event Processing with HTTP Callback

```ballerina
import ballerina/log;
import ballerina/http;
import ballerinax/trigger.slack;

configurable string webhookSecret = ?;
configurable string callbackUrl = ?;

final http:Client callbackClient = check new (callbackUrl);

service on new slack:Listener(8090, webhookSecret) {

    remote function onEvent(json payload) returns error? {
        // Forward event to another service
        http:Response resp = check callbackClient->post("/events", payload);
        log:printInfo("Forwarded event", status = resp.statusCode);
    }
}
```

## Configuration

```toml
# Config.toml
webhookSecret = "<your-secret>"
port = 8090
callbackUrl = "http://localhost:9090"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
