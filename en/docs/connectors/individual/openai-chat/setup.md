---
title: "OpenAI Chat - Setup"
description: "How to set up and configure the ballerinax/openai.chat connector."
---

# OpenAI Chat Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An OpenAI account with API access at [platform.openai.com](https://platform.openai.com)
- A valid OpenAI API key

## Step 1: Obtain an OpenAI API Key

1. Navigate to the [OpenAI Platform Dashboard](https://platform.openai.com).
2. Sign up or log in to your account.
3. Go to **Dashboard > API keys** in the left sidebar.
4. Click **Create new secret key**.
5. Give the key a descriptive name (e.g., "WSO2 Integration") and click **Create secret key**.
6. Copy and securely store the generated API key. You will not be able to view it again after closing the dialog.

:::caution
Never commit your API key to version control. Always use `Config.toml` or environment variables to manage secrets.
:::

## Step 2: Install the Connector

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code.
2. Add a new **Connection** node.
3. Search for **OpenAI Chat** in the connector list.
4. Follow the connection wizard to enter your API key.

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/openai.chat;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "openai.chat"
version = "4.0.1"
```

## Step 3: Configure the Connection

### Basic Configuration with Config.toml

Define a configurable variable for the API token in your Ballerina code:

```ballerina
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});
```

Create a `Config.toml` file in your project root:

```toml
# Config.toml
token = "<your-openai-api-key>"
```

### Using Environment Variables

For production deployments, use environment variables instead of `Config.toml`:

```toml
# Config.toml
token = "${OPENAI_API_KEY}"
```

Set the environment variable before running:

```bash
export OPENAI_API_KEY="sk-..."
bal run
```

### Advanced Client Configuration

You can customize the HTTP client behavior with additional connection settings:

```ballerina
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
},
    serviceUrl = "https://api.openai.com/v1"
);
```

### Organization and Project Headers

If you belong to multiple OpenAI organizations, specify the organization and project:

```ballerina
import ballerinax/openai.chat;

configurable string token = ?;
configurable string orgId = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});
```

## Step 4: Verify the Setup

Create a simple test to verify the connection:

```ballerina
import ballerina/io;
import ballerinax/openai.chat;

configurable string token = ?;

final chat:Client openAIChat = check new ({
    auth: {
        token
    }
});

public function main() returns error? {
    chat:CreateChatCompletionRequest request = {
        model: "gpt-4o-mini",
        messages: [
            {
                "role": "user",
                "content": "Say hello in one word."
            }
        ],
        max_tokens: 5
    };

    chat:CreateChatCompletionResponse response =
        check openAIChat->/chat/completions.post(request);

    string? content = response.choices[0].message.content;
    io:println("Connection verified. Response: ", content);
}
```

Run the application:

```bash
bal run
```

If the setup is correct, you will see a response printed to the console.

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `401 Unauthorized` | Verify your API key is correct and has not expired. Check `Config.toml`. |
| `429 Too Many Requests` | You have exceeded rate limits. Implement retry logic or reduce request frequency. |
| `Connection timeout` | Check your network connectivity and firewall rules for outbound HTTPS. |
| `Insufficient quota` | Verify your OpenAI billing is set up and your usage has not exceeded the plan limits. |
| `Model not found` | Ensure the model name is valid (e.g., `gpt-4o-mini`, `gpt-4o`). |

## Security Best Practices

- Store API keys in `Config.toml` or environment variables, never in source code
- Use separate API keys for development, staging, and production environments
- Set usage limits in the OpenAI dashboard to prevent unexpected charges
- Rotate API keys periodically and revoke unused keys
- Use project-scoped keys when possible for finer access control

## Next Steps

- [Actions Reference](actions) -- Explore available operations
- [Examples](examples) -- See production-ready code samples
