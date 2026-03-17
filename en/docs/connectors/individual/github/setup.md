---
title: "GitHub - Setup"
description: "How to set up and configure the ballerinax/github connector."
---

# GitHub Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A GitHub account
- A Personal Access Token (PAT) with appropriate scopes

## Step 1: Create a GitHub Account

If you do not already have a GitHub account, sign up at [github.com](https://github.com/).

## Step 2: Generate a Personal Access Token

1. Log in to GitHub and click your profile picture in the top-right corner.
2. Navigate to **Settings** > **Developer settings** > **Personal access tokens**.
3. Click **Generate new token** (classic) or use fine-grained tokens for more control.
4. Provide a descriptive name and select an expiration period.
5. Select the required scopes:
   - `repo` -- Full control of private repositories
   - `read:org` -- Read organization membership
   - `write:discussion` -- Read and write discussions
   - `read:user` -- Read user profile data
6. Click **Generate token** and copy the token immediately (it is shown only once).

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **GitHub**.
4. Enter your Personal Access Token in the connection wizard.

### Using Code

```ballerina
import ballerinax/github;
```

```toml
[[dependency]]
org = "ballerinax"
name = "github"
version = "5.1.0"
```

## Configuration

### Basic Authentication with PAT

```ballerina
import ballerinax/github;

configurable string token = ?;

github:ConnectionConfig config = {
    auth: {
        token: token
    }
};

github:Client github = check new (config);
```

### Config.toml

```toml
# Config.toml
token = "<your-github-personal-access-token>"
```

### OAuth2 Authentication

For applications that require OAuth2 (e.g., acting on behalf of users):

```ballerina
import ballerinax/github;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;

github:ConnectionConfig config = {
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://github.com/login/oauth/access_token"
    }
};

github:Client github = check new (config);
```

## Verify the Setup

```ballerina
import ballerina/io;
import ballerinax/github;

configurable string token = ?;

public function main() returns error? {
    github:Client github = check new ({
        auth: { token: token }
    });

    // List repositories for the authenticated user
    github:Repository[] repos = check github->/user/repos();
    io:println("Connected successfully. Found ", repos.length(), " repositories.");
}
```

Run the verification:

```bash
bal run
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Verify your PAT is correct and has not expired |
| `403 Forbidden` | Check that your token has the required scopes |
| `404 Not Found` | Confirm the repository or resource exists and you have access |
| `422 Unprocessable Entity` | Validate the request payload (e.g., missing required fields) |
| Rate limit exceeded | GitHub allows 5,000 requests/hour for authenticated users. Add retry logic. |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
