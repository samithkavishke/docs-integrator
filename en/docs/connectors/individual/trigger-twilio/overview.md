---
title: "Twilio Trigger"
description: "Overview of the ballerinax/trigger.twilio connector for WSO2 Integrator."
---

# Twilio Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.twilio`](https://central.ballerina.io/ballerinax/trigger.twilio/latest) |
| **Version** | 0.10.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.twilio/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.twilio/latest#functions) |

## Overview

The `ballerinax/trigger.twilio` module provides a listener that receives SMS and voice call status change events from Twilio. When an incoming message arrives or a call status changes, Twilio sends an HTTP callback (webhook) to your Ballerina service, which the listener processes and dispatches to the appropriate remote function.

This module supports the [Twilio Basic API 2010-04-01](https://www.twilio.com/docs/all).

### Supported service types and events

**SmsStatusService** -- SMS message status events:

| Remote function | Description |
|---|---|
| `onAccepted` | SMS accepted by Twilio for delivery |
| `onQueued` | SMS queued for sending |
| `onSending` | SMS is being sent |
| `onSent` | SMS successfully sent |
| `onReceiving` | Incoming SMS is being received |
| `onReceived` | Incoming SMS received |
| `onDelivered` | SMS delivered to the recipient |
| `onUndelivered` | SMS could not be delivered |
| `onFailed` | SMS delivery failed |

**CallStatusService** -- Voice call status events:

| Remote function | Description |
|---|---|
| `onQueued` | Call is queued |
| `onRinging` | Call is ringing |
| `onInProgress` | Call is in progress |
| `onCompleted` | Call completed successfully |
| `onBusy` | Called party was busy |
| `onNoAnswer` | No answer from the called party |
| `onCanceled` | Call was cancelled |
| `onFailed` | Call failed |

### Common use cases

- **SMS notification tracking** -- Monitor delivery status of outbound SMS messages and retry failed deliveries.
- **Inbound SMS processing** -- Receive and parse incoming text messages to trigger workflows (e.g., survey responses, support requests).
- **Call center integration** -- Track call status changes and update a CRM or ticketing system in real time.
- **Two-factor authentication** -- Verify SMS delivery for OTP codes and handle failure scenarios.
- **Alerting and escalation** -- Detect failed calls or undelivered messages and trigger escalation procedures.

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.twilio"
version = "0.10.0"
```

```ballerina
import ballerinax/trigger.twilio;
import ballerina/log;

listener twilio:Listener twilioListener = new (8090);

service twilio:SmsStatusService on twilioListener {

    remote function onReceived(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS received", payload = event.toString());
    }

    remote function onAccepted(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onQueued(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onSending(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onSent(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onReceiving(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onDelivered(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onUndelivered(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
    remote function onFailed(twilio:SmsStatusChangeEventWrapper event) returns error? { return; }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.twilio/latest)
