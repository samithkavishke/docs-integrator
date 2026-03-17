---
title: "SAP JCo"
description: "Overview of the ballerinax/sap.jco connector for WSO2 Integrator."
---

# SAP JCo

| | |
|---|---|
| **Package** | [`ballerinax/sap.jco`](https://central.ballerina.io/ballerinax/sap.jco/latest) |
| **Version** | latest |
| **Category** | Enterprise |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/sap.jco/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/sap.jco/latest) |

## Overview

Connect to SAP JCo from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/sap.jco;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "sap.jco"
version = "latest"
```

## When to Use

Use the SAP JCo connector when your integration needs to:

- Sync data between enterprise systems
- Automate business processes and workflows
- Manage records and entities programmatically
- Build real-time integrations with enterprise platforms

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/sap.jco/latest)
