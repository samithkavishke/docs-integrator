---
title: "ActiveCampaign - Setup"
description: "How to set up and configure the ballerinax/activecampaign connector."
---

# ActiveCampaign Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An ActiveCampaign account (any plan with API access)

## Step 1: Obtain API Key and URL

1. Log in to your ActiveCampaign account.
2. Navigate to **Settings** > **Developer**.
3. Copy the **API URL** (e.g., `https://youraccountname.api-us1.com`) and **API Key**.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **ActiveCampaign**.
4. Enter your API URL and API Key.

### Using Code

```ballerina
import ballerinax/activecampaign;
```

```toml
[[dependency]]
org = "ballerinax"
name = "activecampaign"
version = "1.3.1"
```

## Configuration

```ballerina
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

activecampaign:ConnectionConfig config = {
    baseUrl: apiUrl,
    auth: {
        token: apiKey
    }
};

activecampaign:Client activeCampaign = check new (config);
```

```toml
# Config.toml
apiUrl = "https://youraccountname.api-us1.com"
apiKey = "<your-api-key>"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

public function main() returns error? {
    activecampaign:Client ac = check new ({
        baseUrl: apiUrl,
        auth: { token: apiKey }
    });

    json contacts = check ac->listContacts();
    io:println("Connection successful. Contacts retrieved.");
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `403 Forbidden` | Verify your API key and ensure it has not been regenerated |
| `404 Not Found` | Check that your API URL includes the correct account name |
| Rate limiting | ActiveCampaign allows 5 requests per second. Implement throttling. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
