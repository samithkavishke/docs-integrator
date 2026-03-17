---
title: "Shopify Admin"
description: "Overview of the ballerinax/shopify.admin connector for WSO2 Integrator."
---

# Shopify Admin

| | |
|---|---|
| **Package** | [`ballerinax/shopify.admin`](https://central.ballerina.io/ballerinax/shopify.admin/latest) |
| **Version** | latest |
| **Category** | E-Commerce & Finance |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/shopify.admin/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/shopify.admin/latest) |

## Overview

Connect to Shopify Admin from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/shopify.admin;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "shopify.admin"
version = "latest"
```

## When to Use

Use the Shopify Admin connector when your integration needs to:

- Parse and generate financial messages
- Convert between financial message formats
- Integrate with banking and payment systems
- Process financial transactions

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/shopify.admin/latest)
