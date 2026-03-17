---
title: "Twilio Trigger - Triggers"
description: "Available trigger events, service types, and payload types for the ballerinax/trigger.twilio connector."
---

# Twilio Trigger - Available Events

The `ballerinax/trigger.twilio` listener receives Twilio webhook callbacks for SMS status changes and voice call status changes. The listener starts an HTTP server and dispatches events to your Ballerina service.

## Listener initialization

The listener requires only a port number. No API credentials are needed in the listener configuration because Twilio sends webhooks directly to your service URL.

```ballerina
import ballerinax/trigger.twilio;

listener twilio:Listener twilioListener = new (8090);
```

You can also pass an `http:Listener` instance:

```ballerina
import ballerina/http;
import ballerinax/trigger.twilio;

listener http:Listener httpListener = new (8090);
listener twilio:Listener twilioListener = new (httpListener);
```

## Service type: `SmsStatusService`

Handles SMS message status change events. All nine remote functions must be implemented. Each receives a `twilio:SmsStatusChangeEventWrapper` payload.

```ballerina
service twilio:SmsStatusService on twilioListener {

    remote function onAccepted(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS was accepted by Twilio for delivery
    }

    remote function onQueued(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS is queued for sending
    }

    remote function onSending(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS is in the process of being sent
    }

    remote function onSent(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS was successfully sent to the carrier
    }

    remote function onReceiving(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // An incoming SMS is being received
    }

    remote function onReceived(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // An incoming SMS was received
    }

    remote function onDelivered(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS was confirmed delivered to the recipient
    }

    remote function onUndelivered(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS could not be delivered
    }

    remote function onFailed(twilio:SmsStatusChangeEventWrapper event) returns error? {
        // SMS delivery failed permanently
    }
}
```

### SMS status flow

The typical SMS lifecycle follows this progression:

```
Accepted -> Queued -> Sending -> Sent -> Delivered
                                     \-> Undelivered
                                     \-> Failed
```

For inbound messages:

```
Receiving -> Received
```

## Service type: `CallStatusService`

Handles voice call status change events. All eight remote functions must be implemented. Each receives a `twilio:CallStatusEventWrapper` payload.

```ballerina
service twilio:CallStatusService on twilioListener {

    remote function onQueued(twilio:CallStatusEventWrapper event) returns error? {
        // Call is queued
    }

    remote function onRinging(twilio:CallStatusEventWrapper event) returns error? {
        // Call is ringing at the recipient's device
    }

    remote function onInProgress(twilio:CallStatusEventWrapper event) returns error? {
        // Call was answered and is in progress
    }

    remote function onCompleted(twilio:CallStatusEventWrapper event) returns error? {
        // Call completed successfully
    }

    remote function onBusy(twilio:CallStatusEventWrapper event) returns error? {
        // Called party line was busy
    }

    remote function onNoAnswer(twilio:CallStatusEventWrapper event) returns error? {
        // No answer from the called party
    }

    remote function onCanceled(twilio:CallStatusEventWrapper event) returns error? {
        // Call was cancelled before it was answered
    }

    remote function onFailed(twilio:CallStatusEventWrapper event) returns error? {
        // Call failed to connect
    }
}
```

### Call status flow

```
Queued -> Ringing -> InProgress -> Completed
                 \-> Busy
                 \-> NoAnswer
                 \-> Canceled
                 \-> Failed
```

## Payload types

| Type | Used by | Description |
|---|---|---|
| `twilio:SmsStatusChangeEventWrapper` | `SmsStatusService` | Contains SMS details such as message SID, from/to numbers, body, and status |
| `twilio:CallStatusEventWrapper` | `CallStatusService` | Contains call details such as call SID, from/to numbers, duration, and status |

## Multiple services on one listener

You can attach both `SmsStatusService` and `CallStatusService` to the same listener:

```ballerina
service twilio:SmsStatusService on twilioListener {
    // SMS event handlers
    remote function onAccepted(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onQueued(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onSending(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onSent(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onReceiving(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onReceived(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onDelivered(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onUndelivered(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onFailed(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
}

service twilio:CallStatusService on twilioListener {
    // Call event handlers
    remote function onQueued(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onRinging(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onInProgress(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onCompleted(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onBusy(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onNoAnswer(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onCanceled(twilio:CallStatusEventWrapper event) returns error? { return; }
    remote function onFailed(twilio:CallStatusEventWrapper event) returns error? { return; }
}
```

## Error handling

```ballerina
remote function onFailed(twilio:SmsStatusChangeEventWrapper event) returns error? {
    do {
        log:printError("SMS delivery failed", payload = event.toString());
        // Implement retry logic or alerting
    } on fail error e {
        log:printError("Error handling SMS failure", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
