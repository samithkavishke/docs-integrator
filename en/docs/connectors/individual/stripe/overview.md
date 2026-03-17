---
title: "Stripe"
description: "Overview of the ballerinax/stripe connector for WSO2 Integrator."
---

# Stripe

| | |
|---|---|
| **Package** | [`ballerinax/stripe`](https://central.ballerina.io/ballerinax/stripe/latest) |
| **Version** | latest |
| **Category** | E-Commerce & Finance |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/stripe/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/stripe/latest) |

## Overview

Connect to Stripe from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/stripe;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "stripe"
version = "latest"
```

## When to Use

Use the Stripe connector when your integration needs to:

- Parse and generate financial messages
- Convert between financial message formats
- Integrate with banking and payment systems
- Process financial transactions

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/stripe/latest)
