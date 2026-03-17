---
title: "Azure Data Lake - Setup"
description: "How to set up and configure the ballerinax/azure.datalake connector."
---

# Azure Data Lake Setup

## Prerequisites

- WSO2 Integrator: BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- An Azure account with an active subscription
- Appropriate Azure service permissions

## Installation

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **Azure Data Lake**
4. Follow the connection wizard to enter credentials

### Using Code

Add the import to your Ballerina file:

```ballerina
import ballerinax/azure.datalake;
```

Add the dependency to `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "azure.datalake"
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

For detailed configuration options, see the [API documentation](https://central.ballerina.io/ballerinax/azure.datalake/latest).

## Verify the Setup

After configuring, run your integration to verify the connection:

```bash
bal run
```

Check the console output for any connection errors. If you see authentication failures, verify your credentials in `Config.toml`.

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples
