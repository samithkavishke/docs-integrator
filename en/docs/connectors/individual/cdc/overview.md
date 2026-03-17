---
title: "Change Data Capture"
description: "Overview of the ballerinax/cdc connector for WSO2 Integrator."
---

# Change Data Capture

| | |
|---|---|
| **Package** | [`ballerinax/cdc`](https://central.ballerina.io/ballerinax/cdc/latest) |
| **Version** | latest |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/cdc/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/cdc/latest) |

## Overview

Connect to Change Data Capture from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/cdc;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "cdc"
version = "latest"
```

## When to Use

Use the Change Data Capture connector when your integration needs to:

- Read and write data to the database
- Execute parameterized queries and stored procedures
- Perform batch operations for high throughput
- Stream real-time data changes

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/cdc/latest)
