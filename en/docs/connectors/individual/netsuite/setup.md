---
title: "Oracle NetSuite - Setup"
description: "How to set up and configure the ballerinax/netsuite connector."
---

# Oracle NetSuite Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Oracle NetSuite account with Web Services enabled
- A NetSuite integration record with Token-Based Authentication (TBA)

## Step 1: Enable Web Services

1. Log in to NetSuite as an Administrator.
2. Navigate to **Setup** > **Company** > **Enable Features**.
3. Click the **SuiteCloud** tab.
4. Under **SuiteTalk (Web Services)**, check **Web Services**.
5. Click **Save**.

## Step 2: Create an Integration Record

1. Navigate to **Setup** > **Integration** > **Manage Integrations** > **New**.
2. Enter a name (e.g., "WSO2 Integrator").
3. Under **Authentication**, check **Token-Based Authentication**.
4. Uncheck **TBA: Authorization Flow** if not needed.
5. Click **Save**.
6. Copy the **Consumer Key** and **Consumer Secret** displayed on the confirmation page.

:::warning
The Consumer Key and Consumer Secret are only displayed once. Store them securely immediately.
:::

## Step 3: Create an Access Token

1. Navigate to **Setup** > **Users/Roles** > **Access Tokens** > **New**.
2. Select the **Application Name** (the integration you created).
3. Select the **User** and **Role** for API access.
4. Click **Save**.
5. Copy the **Token ID** and **Token Secret**.

## Step 4: Find Your Account ID

1. Navigate to **Setup** > **Company** > **Company Information**.
2. Your **Account ID** is displayed at the top of the page (e.g., `1234567` or `TSTDRV1234567` for sandbox).

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **NetSuite**.
4. Enter your Account ID, Consumer Key/Secret, and Token ID/Secret.

### Using Code

```ballerina
import ballerinax/netsuite;
```

```toml
[[dependency]]
org = "ballerinax"
name = "netsuite"
version = "3.3.0"
```

## Configuration

### Token-Based Authentication

```ballerina
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

netsuite:ConnectionConfig nsConfig = {
    accountId: accountId,
    consumerId: consumerId,
    consumerSecret: consumerSecret,
    token: token,
    tokenSecret: tokenSecret
};

netsuite:Client netsuite = check new (nsConfig);
```

```toml
# Config.toml
accountId = "<your-account-id>"
consumerId = "<your-consumer-key>"
consumerSecret = "<your-consumer-secret>"
token = "<your-token-id>"
tokenSecret = "<your-token-secret>"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/netsuite;

configurable string accountId = ?;
configurable string consumerId = ?;
configurable string consumerSecret = ?;
configurable string token = ?;
configurable string tokenSecret = ?;

public function main() returns error? {
    netsuite:Client ns = check new ({
        accountId: accountId,
        consumerId: consumerId,
        consumerSecret: consumerSecret,
        token: token,
        tokenSecret: tokenSecret
    });

    // Test with a simple customer lookup
    netsuite:RecordRef ref = {
        internalId: "1",
        'type: "customer"
    };
    netsuite:ReadResponse response = check ns->getRecord(ref);
    io:println("Connection successful: ", response);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `INVALID_LOGIN_ATTEMPT` | Verify all five TBA credentials (Account ID, Consumer Key/Secret, Token/Secret) |
| `INSUFFICIENT_PERMISSION` | Ensure the role assigned to the token has required permissions |
| `WEB_SERVICES_NOT_ENABLED` | Enable Web Services in Setup > Company > Enable Features > SuiteCloud |
| `SSS_REQUEST_LIMIT_EXCEEDED` | NetSuite governance limits exceeded. Implement throttling. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
