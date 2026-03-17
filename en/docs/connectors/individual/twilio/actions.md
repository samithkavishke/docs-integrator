---
title: "Twilio - Actions"
description: "Available actions and operations for the ballerinax/twilio connector."
---

# Twilio Actions

The `ballerinax/twilio` package provides operations for sending SMS messages, making voice calls, and managing Twilio accounts.

## Client Initialization

```ballerina
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;

twilio:Client twilio = check new ({
    auth: {
        accountSId: accountSid,
        authToken: authToken
    }
});
```

## SMS Operations

### sendSms

Send an SMS message.

```ballerina
twilio:SmsResponse smsResult = check twilio->sendSms(
    fromNo = "+15551234567",
    toNo = "+15559876543",
    body = "Your order #12345 has been shipped. Track at: https://track.example.com/12345"
);

io:println("SMS sent. SID: ", smsResult.sid);
io:println("Status: ", smsResult.status);
```

### getMessage

Retrieve details of a sent message by SID.

```ballerina
twilio:MessageResourceResponse message = check twilio->getMessage(messageSid);
io:println("Message status: ", message.status);
io:println("Date sent: ", message.dateSent);
```

### listMessages

List sent and received messages.

```ballerina
twilio:ListMessageResponse messages = check twilio->listMessages(accountSid);
```

## Voice Call Operations

### makeVoiceCall

Initiate an outbound voice call with TwiML instructions.

```ballerina
twilio:VoiceCallResponse callResult = check twilio->makeVoiceCall(
    fromNo = "+15551234567",
    toNo = "+15559876543",
    voiceCallInput = {
        userInput: "http://demo.twilio.com/docs/voice.xml",
        inputType: twilio:VOICE_CALL_INPUT_TYPE_URL
    }
);

io:println("Call initiated. SID: ", callResult.sid);
io:println("Call status: ", callResult.status);
```

### Make a Call with TwiML

```ballerina
string twiml = "<Response><Say voice=\"alice\">Hello! Your appointment is confirmed for tomorrow at 2 PM.</Say></Response>";

twilio:VoiceCallResponse callResult = check twilio->makeVoiceCall(
    fromNo = "+15551234567",
    toNo = "+15559876543",
    voiceCallInput = {
        userInput: twiml,
        inputType: twilio:VOICE_CALL_INPUT_TYPE_TWIML
    }
);
```

## Account Operations

### getAccountInfo

Retrieve account details.

```ballerina
twilio:Account account = check twilio->getAccountInfo(accountSid);
io:println("Account name: ", account.friendlyName);
io:println("Account status: ", account.status);
```

## Error Handling

```ballerina
do {
    twilio:SmsResponse result = check twilio->sendSms(
        fromNo = "+15551234567",
        toNo = "+15559876543",
        body = "Test message"
    );
    io:println("Message sent: ", result.sid);
} on fail error e {
    io:println("Failed to send SMS: ", e.message());
    log:printError("Twilio operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
