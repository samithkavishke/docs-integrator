---
title: "Google Drive Trigger - Setup"
description: "How to set up and configure the ballerinax/trigger.google.drive connector."
---

# Google Drive Trigger Setup

## Prerequisites

- WSO2 Integrator: BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Google Cloud project with appropriate APIs enabled
- OAuth 2.0 credentials or a service account key

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Google Drive Trigger**
4. Follow the connection wizard to enter credentials

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/trigger.google.drive;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.google.drive"
version = "latest"
```

## Configuration

Configure the connector using `configurable` variables in your code and provide values via `Config.toml`:

```ballerina
configurable string token = ?;
```

```toml
# Config.toml
token = "<your-token>"
```

For detailed configuration options, see the [API documentation](https://central.ballerina.io/ballerinax/trigger.google.drive/latest).

## Verify the Setup

After configuring, run your integration to verify the connection:

```bash
bal run
```

Check the console output for any connection errors. If you see authentication failures, verify your credentials in `Config.toml`.

## Next Steps

- [Triggers Reference](triggers) -- Available operations
- [Examples](examples) -- Code examples
