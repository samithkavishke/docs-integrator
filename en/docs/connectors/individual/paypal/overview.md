---
title: "PayPal Orders"
description: "Overview of the ballerinax/paypal.orders connector for WSO2 Integrator."
---

# PayPal Orders

| | |
|---|---|
| **Package** | [`ballerinax/paypal.orders`](https://central.ballerina.io/ballerinax/paypal.orders/latest) |
| **Version** | latest |
| **Category** | E-Commerce & Finance |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/paypal.orders/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/paypal.orders/latest) |

## Overview

Connect to PayPal Orders from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/paypal.orders;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "paypal.orders"
version = "latest"
```

## When to Use

Use the PayPal Orders connector when your integration needs to:

- Parse and generate financial messages
- Convert between financial message formats
- Integrate with banking and payment systems
- Process financial transactions

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/paypal.orders/latest)
