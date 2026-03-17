---
title: "Amazon Redshift"
description: "Overview of the ballerinax/aws.redshift connector for WSO2 Integrator."
---

# Amazon Redshift

| | |
|---|---|
| **Package** | [`ballerinax/aws.redshift`](https://central.ballerina.io/ballerinax/aws.redshift/latest) |
| **Version** | latest |
| **Category** | Databases |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/aws.redshift/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/aws.redshift/latest) |

## Overview

Connect to Amazon Redshift from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/aws.redshift;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "aws.redshift"
version = "latest"
```

## When to Use

Use the Amazon Redshift connector when your integration needs to:

- Read and write data to the database
- Execute parameterized queries and stored procedures
- Perform batch operations for high throughput
- Stream real-time data changes

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/aws.redshift/latest)
