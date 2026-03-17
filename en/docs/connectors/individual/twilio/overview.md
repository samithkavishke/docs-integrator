---
title: "Twilio"
description: "Overview of the ballerinax/twilio connector for WSO2 Integrator."
---

# Twilio

| | |
|---|---|
| **Package** | [`ballerinax/twilio`](https://central.ballerina.io/ballerinax/twilio/latest) |
| **Version** | 5.0.1 |
| **Category** | Communication |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/twilio/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/twilio/latest#functions) |

## Overview

Twilio is a cloud communications platform that enables developers to programmatically make and receive phone calls, send and receive text messages, and perform other communication functions. The `ballerinax/twilio` connector supports the Twilio Basic API version 2010-04-01, enabling SMS messaging, voice call management, and account operations within WSO2 Integrator applications.

The connector supports:

- **SMS Messaging** - Send and receive SMS and MMS messages
- **Voice Calls** - Initiate outbound voice calls with TwiML instructions
- **Account Management** - Manage Twilio accounts and subaccounts
- **Message History** - Query sent and received message logs
- **Phone Numbers** - Manage Twilio phone numbers

## Key Capabilities

| Capability | Description |
|---|---|
| Send SMS | Send text messages to any phone number worldwide |
| Voice Calls | Initiate outbound calls with TwiML or URL-based instructions |
| Message Status | Check delivery status of sent messages |
| Account Info | Retrieve account details and balance information |
| Number Management | List and manage Twilio phone numbers |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "twilio"
version = "5.0.1"
```

```ballerina
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;

twilio:ConnectionConfig twilioConfig = {
    auth: {
        accountSId: accountSid,
        authToken: authToken
    }
};

twilio:Client twilio = check new (twilioConfig);
```

## Use Cases

| Use Case | Description |
|---|---|
| Order Notifications | Send SMS confirmations for orders and deliveries |
| Two-Factor Auth | Send OTP codes for authentication workflows |
| Appointment Reminders | Automated SMS reminders for scheduled events |
| Alert System | Send SMS alerts from monitoring and alerting systems |
| Voice IVR | Build interactive voice response systems |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [Twilio API Documentation](https://www.twilio.com/docs/usage/api)
