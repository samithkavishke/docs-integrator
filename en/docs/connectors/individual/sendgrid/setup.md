---
title: "SendGrid - Setup"
description: "How to set up and configure the ballerinax/sendgrid connector."
---

# SendGrid Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A SendGrid account (free tier or paid)
- A verified sender identity (email address or domain)

## Step 1: Create a SendGrid Account

1. Sign up at [SendGrid](https://signup.sendgrid.com/).
2. Complete email verification and account setup.

## Step 2: Create an API Key

1. Log in to the [SendGrid Dashboard](https://app.sendgrid.com/).
2. Navigate to **Settings** > **API Keys**.
3. Click **Create API Key**.
4. Select **Full Access** or **Restricted Access** with at least **Mail Send** permissions.
5. Copy the generated API key immediately (it is only shown once).

## Step 3: Verify a Sender Identity

1. Navigate to **Settings** > **Sender Authentication**.
2. Either verify a **Single Sender** (for testing) or **Domain Authentication** (for production).
3. Follow the verification steps provided.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **SendGrid**.
4. Enter your API key.

### Using Code

```ballerina
import ballerinax/sendgrid;
```

```toml
[[dependency]]
org = "ballerinax"
name = "sendgrid"
version = "1.5.1"
```

## Configuration

```ballerina
import ballerinax/sendgrid;

configurable string apiKey = ?;

sendgrid:ConnectionConfig config = {
    auth: {
        token: apiKey
    }
};

sendgrid:Client sendgrid = check new (config);
```

```toml
# Config.toml
apiKey = "<your-sendgrid-api-key>"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/sendgrid;

configurable string apiKey = ?;

public function main() returns error? {
    sendgrid:Client sg = check new ({
        auth: { token: apiKey }
    });

    sendgrid:Email email = {
        personalizations: [{ to: [{ email: "test@example.com" }] }],
        'from: { email: "sender@yourdomain.com" },
        subject: "SendGrid Connection Test",
        content: [{ 'type: "text/plain", value: "Connection successful!" }]
    };

    json response = check sg->sendEmail(email);
    io:println("Email sent successfully");
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify your API key is correct and has Mail Send permissions |
| `403 Forbidden` | Sender identity not verified. Complete sender verification. |
| `429 Too Many Requests` | Rate limit exceeded. Free tier: 100 emails/day. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
