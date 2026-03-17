---
title: "ServiceNow - Setup"
description: "How to set up and configure the ballerinax/servicenow connector."
---

# ServiceNow Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A ServiceNow instance (developer, test, or production)
- A ServiceNow user account with appropriate roles (e.g., `itil`, `admin`, or a custom role with API access)

## Step 1: Obtain ServiceNow Instance URL

Your ServiceNow instance URL follows the format: `https://<instance-name>.service-now.com`

For developer instances, sign up at [ServiceNow Developer Portal](https://developer.servicenow.com/).

## Step 2: Configure API Access

1. Log in to your ServiceNow instance as an admin.
2. Navigate to **System Web Services** > **REST** > **REST API Explorer** to verify REST APIs are enabled.
3. Ensure the user account has the necessary roles for the tables you want to access.

## Step 3: Set Up OAuth 2.0 (Optional)

For OAuth-based authentication:

1. Navigate to **System OAuth** > **Application Registry**.
2. Click **New** > **Create an OAuth API endpoint for external clients**.
3. Configure:
   - **Name**: WSO2 Integrator
   - **Redirect URL**: `https://your-app/callback`
4. Note the **Client ID** and **Client Secret**.

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **ServiceNow**.
4. Enter your instance URL and credentials.

### Using Code

```ballerina
import ballerinax/servicenow;
```

```toml
[[dependency]]
org = "ballerinax"
name = "servicenow"
version = "1.5.1"
```

## Configuration

### Basic Authentication

```ballerina
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

servicenow:ConnectionConfig snConfig = {
    baseUrl: instanceUrl,
    auth: {
        username: username,
        password: password
    }
};

servicenow:Client serviceNow = check new (snConfig);
```

```toml
# Config.toml
instanceUrl = "https://your-instance.service-now.com"
username = "admin"
password = "<your-password>"
```

### OAuth 2.0 Authentication

```ballerina
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;

servicenow:ConnectionConfig snConfig = {
    baseUrl: instanceUrl,
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: instanceUrl + "/oauth_token.do"
    }
};

servicenow:Client serviceNow = check new (snConfig);
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

public function main() returns error? {
    servicenow:Client sn = check new ({
        baseUrl: instanceUrl,
        auth: { username, password }
    });

    // Test by querying the incident table
    json incidents = check sn->getRecordList("incident", sysparmLimit = 1);
    io:println("Connection successful. Sample data: ", incidents);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify username/password or OAuth tokens |
| `403 Forbidden` | User lacks required roles for the table |
| `404 Not Found` | Check instance URL and table name |
| ACL restrictions | Request the admin to grant API access to the required tables |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
