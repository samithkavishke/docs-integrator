---
title: "Slack Trigger - Triggers"
description: "Available triggers for the ballerinax/trigger.slack connector."
---

# Slack Trigger Events

The `ballerinax/trigger.slack` module provides typed service interfaces for different Slack event categories.

## Listener setup

```ballerina
import ballerinax/trigger.slack;

configurable string verificationToken = ?;

listener slack:Listener slackListener = new ({ verificationToken });
```

## Available service types

### UserChangeService

Listen to user profile changes:

```ballerina
service slack:UserChangeService on slackListener {
    isolated remote function onUserChange(slack:GenericEventWrapper event)
            returns error? {
        log:printInfo("User changed", event = event.toString());
    }
}
```

### MessageService

Listen to messages in channels:

```ballerina
service slack:MessageService on slackListener {
    isolated remote function onMessage(slack:GenericEventWrapper event)
            returns error? {
        log:printInfo("Message received");
    }
}
```

### ChannelService

Listen to channel lifecycle events:

```ballerina
service slack:ChannelService on slackListener {
    isolated remote function onChannelCreated(slack:GenericEventWrapper event)
            returns error? {
        log:printInfo("Channel created");
    }
}
```

## Event payload

All events are delivered as `slack:GenericEventWrapper` which contains the raw Slack event payload including:

- Event type and subtype
- User ID of the actor
- Channel information
- Timestamp
- Event-specific data

## Error handling

```ballerina
service slack:UserChangeService on slackListener {
    isolated remote function onUserChange(slack:GenericEventWrapper event)
            returns error? {
        do {
            check processUserChange(event);
        } on fail error e {
            log:printError("Event processing failed", 'error = e);
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
