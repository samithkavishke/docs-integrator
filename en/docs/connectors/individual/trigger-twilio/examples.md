---
title: "Twilio Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.twilio connector."
---

# Twilio Trigger Examples

## Example 1: Log SMS delivery status changes

A basic listener that logs every SMS status change event. Useful for monitoring message delivery in development.

```ballerina
import ballerina/log;
import ballerinax/trigger.twilio;

listener twilio:Listener twilioListener = new (8090);

service twilio:SmsStatusService on twilioListener {

    remote function onAccepted(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS accepted", payload = event.toString());
    }

    remote function onQueued(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS queued", payload = event.toString());
    }

    remote function onSending(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS sending", payload = event.toString());
    }

    remote function onSent(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS sent", payload = event.toString());
    }

    remote function onReceiving(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS receiving", payload = event.toString());
    }

    remote function onReceived(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS received", payload = event.toString());
    }

    remote function onDelivered(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printInfo("SMS delivered", payload = event.toString());
    }

    remote function onUndelivered(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printWarn("SMS undelivered", payload = event.toString());
    }

    remote function onFailed(twilio:SmsStatusChangeEventWrapper event) returns error? {
        log:printError("SMS failed", payload = event.toString());
    }
}
```

## Example 2: Forward incoming SMS to a webhook

This example captures incoming SMS messages and forwards them to an external webhook endpoint for processing (e.g., a chatbot, ticketing system, or survey platform).

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.twilio;

configurable string webhookUrl = ?;

listener twilio:Listener twilioListener = new (8090);

final http:Client webhookClient = check new (webhookUrl);

service twilio:SmsStatusService on twilioListener {

    remote function onReceived(twilio:SmsStatusChangeEventWrapper event) returns error? {
        json smsPayload = {
            event: "sms_received",
            data: event.toJson()
        };
        http:Response resp = check webhookClient->post("/sms-events", smsPayload);
        log:printInfo("Incoming SMS forwarded",
            statusCode = resp.statusCode);
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

**Config.toml:**

```toml
webhookUrl = "https://api.example.com"
```

## Example 3: Track voice call status with error handling

This example listens for voice call status events, logging successful calls and alerting on failed or unanswered calls.

```ballerina
import ballerina/log;
import ballerinax/trigger.twilio;

listener twilio:Listener twilioListener = new (8090);

service twilio:CallStatusService on twilioListener {

    remote function onQueued(twilio:CallStatusEventWrapper event) returns error? {
        log:printInfo("Call queued", call = event.toString());
    }

    remote function onRinging(twilio:CallStatusEventWrapper event) returns error? {
        log:printInfo("Call ringing", call = event.toString());
    }

    remote function onInProgress(twilio:CallStatusEventWrapper event) returns error? {
        log:printInfo("Call in progress", call = event.toString());
    }

    remote function onCompleted(twilio:CallStatusEventWrapper event) returns error? {
        log:printInfo("Call completed successfully", call = event.toString());
    }

    remote function onBusy(twilio:CallStatusEventWrapper event) returns error? {
        log:printWarn("Call busy", call = event.toString());
    }

    remote function onNoAnswer(twilio:CallStatusEventWrapper event) returns error? {
        log:printWarn("No answer on call", call = event.toString());
    }

    remote function onCanceled(twilio:CallStatusEventWrapper event) returns error? {
        log:printWarn("Call canceled", call = event.toString());
    }

    remote function onFailed(twilio:CallStatusEventWrapper event) returns error? {
        do {
            log:printError("Call failed", call = event.toString());
            // Implement alerting or retry logic
        } on fail error e {
            log:printError("Error processing failed call event", 'error = e);
        }
    }
}
```

## Running the examples

1. Purchase a Twilio phone number from the [Twilio Console](https://www.twilio.com/console).
2. Expose your local service using ngrok:

   ```bash
   ngrok http 8090
   ```

3. Configure the Twilio webhook URLs:
   - For SMS: Go to **Messaging > Services** in Twilio Console, set the request URL to your ngrok URL.
   - For Voice: Go to **Phone Numbers > Manage > Active Numbers**, set the webhook URL under **Voice & Fax > A CALL COMES IN**.
4. Compile and run:

   ```bash
   bal run
   ```

5. Send an SMS or make a call to your Twilio number to trigger the events.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
