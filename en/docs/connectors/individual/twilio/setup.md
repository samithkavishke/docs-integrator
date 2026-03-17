---
title: "Twilio - Setup"
description: "How to set up and configure the ballerinax/twilio connector."
---

# Twilio Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Twilio account (trial or paid)
- A Twilio phone number for sending SMS or making calls

## Step 1: Create a Twilio Account

1. Visit [Twilio](https://www.twilio.com) and click **Try Twilio for Free**.
2. Complete the registration and verify your email and phone number.

## Step 2: Obtain a Twilio Phone Number

1. Access the [Buy a Number](https://console.twilio.com/us1/develop/phone-numbers/manage/search) page.
2. Select the desired country and capabilities (SMS, Voice, MMS).
3. Click **Search** and then **Buy** to provision a phone number.

:::note
Trial accounts can provision one free trial phone number. Upgrade your account to provision additional numbers.
:::

## Step 3: Obtain API Credentials

1. Navigate to the [Twilio Console Dashboard](https://console.twilio.com/).
2. Copy your **Account SID** and **Auth Token** from the dashboard.

Alternatively, use API Keys for more granular control:

1. Go to [API Keys & Tokens](https://console.twilio.com/us1/account/keys-credentials/api-keys).
2. Click **Create API Key**.
3. Copy the **API Key SID** and **API Key Secret**.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Twilio**.
4. Enter your Account SID and Auth Token.

### Using Code

```ballerina
import ballerinax/twilio;
```

```toml
[[dependency]]
org = "ballerinax"
name = "twilio"
version = "5.0.1"
```

## Configuration

### Account SID and Auth Token

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

```toml
# Config.toml
accountSid = "<your-account-sid>"
authToken = "<your-auth-token>"
```

### API Key Authentication

```ballerina
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string apiKeySid = ?;
configurable string apiKeySecret = ?;

twilio:ConnectionConfig twilioConfig = {
    auth: {
        accountSId: accountSid,
        apiKeySid: apiKeySid,
        apiKeySecret: apiKeySecret
    }
};

twilio:Client twilio = check new (twilioConfig);
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/twilio;

configurable string accountSid = ?;
configurable string authToken = ?;

public function main() returns error? {
    twilio:Client tw = check new ({
        auth: {
            accountSId: accountSid,
            authToken: authToken
        }
    });

    twilio:Account account = check tw->getAccountInfo(accountSid);
    io:println("Connected to Twilio. Account status: ", account.status);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `20003 Authentication Error` | Verify Account SID and Auth Token |
| `21608 Unverified Number` | Trial accounts can only send to verified numbers. Add recipients in Console. |
| `21211 Invalid Phone Number` | Ensure phone numbers are in E.164 format (e.g., +15551234567) |
| `20429 Too Many Requests` | Implement rate limiting. Twilio has concurrency limits per account. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
