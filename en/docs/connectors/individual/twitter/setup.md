---
title: "Twitter/X - Setup"
description: "How to set up and configure the ballerinax/twitter connector."
---

# Twitter/X Setup

## Prerequisites

- WSO2 Integrator with BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Twitter Developer account with an approved project
- A Twitter Developer App configured for OAuth 2.0

## Step 1: Create a Twitter Developer Project

1. Sign in to the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).
2. Navigate to **Projects & Apps** and select an existing project or click **Add Project**.
3. Give your project a name (e.g., "WSO2 Integration") and select the appropriate use case.

## Step 2: Set Up User Authentication

1. In your app settings, scroll down to **User authentication settings** and click **Set up**.
2. Configure the following:
   - **App permissions**: Select **Read and write** (or **Read and write and Direct message** if needed)
   - **Type of App**: Select **Web App, Automated App or Bot**
   - **Callback URI / Redirect URL**: `http://localhost:8080/callback` (for development)
   - **Website URL**: Your organization URL
3. Click **Save**.

## Step 3: Obtain Client Credentials

1. After completing setup, you will receive your **Client ID** and **Client Secret**.
2. Store these values securely. The Client Secret is only shown once.

## Step 4: Obtain OAuth 2.0 Tokens via PKCE Flow

1. Generate a code verifier (a random string of 43-128 characters).
2. Create the code challenge. For the `plain` method, the challenge equals the verifier.
3. Construct the authorization URL:

```
https://twitter.com/i/oauth2/authorize?response_type=code&client_id=<CLIENT_ID>&redirect_uri=<REDIRECT_URI>&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=state&code_challenge=<CODE_CHALLENGE>&code_challenge_method=plain
```

4. Visit the URL and authorize the application.
5. Extract the authorization code from the redirect URL.
6. Exchange the code for tokens:

```bash
curl -X POST "https://api.twitter.com/2/oauth2/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "<CLIENT_ID>:<CLIENT_SECRET>" \
  -d "code=<AUTH_CODE>" \
  -d "grant_type=authorization_code" \
  -d "redirect_uri=<REDIRECT_URI>" \
  -d "code_verifier=<CODE_VERIFIER>"
```

7. The response includes:
   - `access_token` - Short-lived token (2 hours)
   - `refresh_token` - Long-lived token for obtaining new access tokens

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **Twitter** in the connector list.
4. Follow the connection wizard to enter your OAuth credentials.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/twitter;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "twitter"
version = "5.0.0"
```

## Configuration

### OAuth 2.0 Refresh Token Grant (Recommended)

```ballerina
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

twitter:Client twitter = check new ({
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});
```

```toml
# Config.toml
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
refreshToken = "<your-refresh-token>"
refreshUrl = "https://api.twitter.com/2/oauth2/token"
```

### Bearer Token (App-only Authentication)

For read-only operations that do not require user context:

```ballerina
twitter:Client twitter = check new ({
    auth: {
        token: bearerToken
    }
});
```

## Required OAuth 2.0 Scopes

| Scope | Description |
|---|---|
| `tweet.read` | Read tweets, timelines, and search results |
| `tweet.write` | Create and delete tweets |
| `users.read` | Read user profile information |
| `follows.read` | Read follow relationships |
| `follows.write` | Follow and unfollow users |
| `like.read` | Read liked tweets |
| `like.write` | Like and unlike tweets |
| `bookmark.read` | Read bookmarked tweets |
| `bookmark.write` | Create and delete bookmarks |
| `offline.access` | Required for refresh token support |

## Verify the Setup

Test the connection by looking up your authenticated user:

```ballerina
import ballerina/io;
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

public function main() returns error? {
    twitter:Client tw = check new ({
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    twitter:Get2UsersMeResponse me = check tw->findMyUser();
    io:println("Authenticated as: ", me?.data?.username);
}
```

## Troubleshooting

| Error | Solution |
|---|---|
| `401 Unauthorized` | Access token has expired. The connector should auto-refresh; verify your refresh token is valid. |
| `403 Forbidden` | Your app may lack the required scopes. Re-authorize with the correct scope set. |
| `429 Too Many Requests` | Rate limit exceeded. Twitter v2 API has per-endpoint rate limits (e.g., 300 tweets/3 hours). |
| `Unsupported Authentication` | Ensure you are using OAuth 2.0 PKCE, not OAuth 1.0a, for the v2 API. |

## Next Steps

- [Actions Reference](actions) - Available operations
- [Examples](examples) - Code examples
