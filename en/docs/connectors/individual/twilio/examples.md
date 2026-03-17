---
title: "Twilio - Examples"
description: "Code examples for the ballerinax/twilio connector."
---

# Twilio Examples

## Example 1: Order Notification Service

Send SMS notifications when orders are placed or shipped.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;
configurable string twilioNumber = ?;

final twilio:Client twilioClient = check new ({
    auth: { accountSId: accountSid, authToken: authToken }
});

type OrderEvent record {|
    string orderId;
    string customerPhone;
    string customerName;
    string eventType;
    string? trackingUrl;
|};

service /api/notifications on new http:Listener(8090) {

    resource function post order(OrderEvent event) returns http:Ok|http:InternalServerError {
        do {
            string message = buildMessage(event);
            twilio:SmsResponse result = check twilioClient->sendSms(
                fromNo = twilioNumber,
                toNo = event.customerPhone,
                body = message
            );

            log:printInfo("SMS sent",
                orderId = event.orderId,
                messageSid = result.sid,
                status = result.status
            );

            return <http:Ok>{
                body: { messageSid: result.sid, status: result.status }
            };
        } on fail error e {
            log:printError("SMS notification failed", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}

function buildMessage(OrderEvent event) returns string {
    match event.eventType {
        "order_placed" => {
            return string `Hi ${event.customerName}! Your order ${event.orderId} has been confirmed. We'll notify you when it ships.`;
        }
        "order_shipped" => {
            string trackingInfo = event?.trackingUrl is string
                ? string ` Track here: ${<string>event?.trackingUrl}`
                : "";
            return string `Hi ${event.customerName}! Your order ${event.orderId} has shipped.${trackingInfo}`;
        }
        "order_delivered" => {
            return string `Hi ${event.customerName}! Your order ${event.orderId} has been delivered. Thank you for your purchase!`;
        }
        _ => {
            return string `Hi ${event.customerName}! Update on your order ${event.orderId}.`;
        }
    }
}
```

## Example 2: Two-Factor Authentication Service

Generate and send OTP codes for authentication.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/random;
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;
configurable string twilioNumber = ?;

final twilio:Client twilioClient = check new ({
    auth: { accountSId: accountSid, authToken: authToken }
});

// In-memory OTP store (use Redis or similar in production)
map<string> otpStore = {};

service /api/auth on new http:Listener(8090) {

    resource function post send\-otp(record {|string phone;|} input)
            returns http:Ok|http:InternalServerError {
        do {
            // Generate 6-digit OTP
            int otp = check random:createIntInRange(100000, 999999);
            string otpString = otp.toString();

            // Store OTP (with expiry in production)
            otpStore[input.phone] = otpString;

            // Send via SMS
            twilio:SmsResponse result = check twilioClient->sendSms(
                fromNo = twilioNumber,
                toNo = input.phone,
                body = string `Your verification code is: ${otpString}. Valid for 5 minutes.`
            );

            log:printInfo("OTP sent", phone = input.phone, messageSid = result.sid);
            return <http:Ok>{body: {message: "OTP sent successfully"}};
        } on fail error e {
            log:printError("Failed to send OTP", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }

    resource function post verify\-otp(record {|string phone; string otp;|} input)
            returns http:Ok|http:Unauthorized {
        string? storedOtp = otpStore[input.phone];
        if storedOtp == input.otp {
            _ = otpStore.remove(input.phone);
            return <http:Ok>{body: {verified: true, message: "OTP verified"}};
        }
        return <http:Unauthorized>{body: {verified: false, message: "Invalid OTP"}};
    }
}
```

## Example 3: Appointment Reminder System

Send automated appointment reminders via SMS and voice.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;
configurable string twilioNumber = ?;

type Appointment record {|
    string patientName;
    string patientPhone;
    string doctorName;
    string dateTime;
    string location;
|};

public function main() returns error? {
    twilio:Client tw = check new ({
        auth: { accountSId: accountSid, authToken: authToken }
    });

    // Upcoming appointments to remind
    Appointment[] appointments = [
        {
            patientName: "Alice Johnson",
            patientPhone: "+15551001001",
            doctorName: "Dr. Smith",
            dateTime: "March 20 at 2:00 PM",
            location: "City Medical Center, Room 204"
        },
        {
            patientName: "Bob Martinez",
            patientPhone: "+15551001002",
            doctorName: "Dr. Chen",
            dateTime: "March 20 at 3:30 PM",
            location: "City Medical Center, Room 108"
        }
    ];

    int sentCount = 0;
    foreach Appointment apt in appointments {
        do {
            // Send SMS reminder
            twilio:SmsResponse smsResult = check tw->sendSms(
                fromNo = twilioNumber,
                toNo = apt.patientPhone,
                body = string `Reminder: ${apt.patientName}, you have an appointment with ${apt.doctorName} on ${apt.dateTime} at ${apt.location}. Reply CONFIRM to confirm or call us to reschedule.`
            );

            log:printInfo("Reminder sent",
                patient = apt.patientName,
                sid = smsResult.sid
            );
            sentCount += 1;
        } on fail error e {
            log:printError("Failed to send reminder",
                patient = apt.patientName,
                'error = e
            );
        }
    }

    io:println(string `Sent ${sentCount}/${appointments.length()} appointment reminders`);
}
```

## Example 4: Monitoring Alert Service

Send SMS and voice alerts for critical system monitoring events.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;
configurable string twilioNumber = ?;

final twilio:Client twilioClient = check new ({
    auth: { accountSId: accountSid, authToken: authToken }
});

type MonitoringAlert record {|
    string severity;
    string service;
    string message;
    string[] recipients;
|};

service /api/alerts on new http:Listener(8090) {

    resource function post .(MonitoringAlert alert) returns http:Ok|http:InternalServerError {
        do {
            int successCount = 0;

            foreach string recipient in alert.recipients {
                // Send SMS for all alerts
                _ = check twilioClient->sendSms(
                    fromNo = twilioNumber,
                    toNo = recipient,
                    body = string `[${alert.severity}] ${alert.service}: ${alert.message}`
                );

                // Also make a voice call for critical alerts
                if alert.severity == "CRITICAL" {
                    string twiml = string `<Response><Say voice="alice">Critical alert for ${alert.service}. ${alert.message}. Please respond immediately.</Say></Response>`;
                    _ = check twilioClient->makeVoiceCall(
                        fromNo = twilioNumber,
                        toNo = recipient,
                        voiceCallInput = {
                            userInput: twiml,
                            inputType: twilio:VOICE_CALL_INPUT_TYPE_TWIML
                        }
                    );
                }
                successCount += 1;
            }

            log:printInfo("Alert sent", service = alert.service, recipients = successCount);
            return <http:Ok>{body: {notified: successCount}};
        } on fail error e {
            log:printError("Alert dispatch failed", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
