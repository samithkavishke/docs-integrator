---
title: "Jira - Setup"
description: "How to set up and configure the ballerinax/jira connector."
---

# Jira Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Atlassian account with Jira Cloud access
- An API token for authentication

## Step 1: Create an Atlassian Account

If you do not have an Atlassian account, sign up at [atlassian.com](https://id.atlassian.com/signup).

## Step 2: Create an API Token

1. Log in to your Atlassian account.
2. Navigate to **Account Settings** > **Security** > **Create and manage API tokens**.
3. Click **Create API token**.
4. Provide a descriptive label (e.g., "WSO2 Integrator").
5. Click **Create** and copy the generated token. Store it securely.

## Step 3: Identify Your Jira Instance URL

Your Jira Cloud instance URL follows the pattern: `https://your-organization.atlassian.net`

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Jira**.
4. Enter your email, API token, and Jira instance URL.

### Using Code

```ballerina
import ballerinax/jira;
```

```toml
[[dependency]]
org = "ballerinax"
name = "jira"
version = "2.0.1"
```

## Configuration

Jira Cloud uses Basic Authentication with your email and API token:

```ballerina
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

jira:ConnectionConfig config = {
    auth: {
        username: username,
        password: apiToken
    }
};

jira:Client jira = check new (config, serviceUrl);
```

### Config.toml

```toml
# Config.toml
username = "your-email@example.com"
apiToken = "<your-atlassian-api-token>"
serviceUrl = "https://your-org.atlassian.net"
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

public function main() returns error? {
    jira:Client jira = check new ({
        auth: { username, password: apiToken }
    }, serviceUrl);

    // Get all projects
    jira:PageBeanProject projects = check jira->/rest/api/'3/project();
    io:println("Connected successfully. Found projects.");
}
```

Run the verification:

```bash
bal run
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify your email and API token are correct |
| `403 Forbidden` | Check that you have the required project permissions |
| `404 Not Found` | Confirm the service URL and issue key are correct |
| `400 Bad Request` | Validate required fields (project key, issue type, summary) |
| Rate limit exceeded | Jira Cloud allows ~10 requests/second. Add retry logic. |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
