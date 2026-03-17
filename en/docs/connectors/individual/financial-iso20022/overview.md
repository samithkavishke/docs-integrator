---
title: "ISO 20022"
description: "Overview of the ballerinax/financial.iso20022 connector for WSO2 Integrator."
---

# ISO 20022

| | |
|---|---|
| **Package** | [`ballerinax/financial.iso20022`](https://central.ballerina.io/ballerinax/financial.iso20022/latest) |
| **Version** | latest |
| **Category** | Data Formats |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/financial.iso20022/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/financial.iso20022/latest) |

## Overview

Connect to ISO 20022 from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/financial.iso20022;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "financial.iso20022"
version = "latest"
```

## When to Use

Use the ISO 20022 connector when your integration needs to:

- Parse and generate financial messages
- Convert between financial message formats
- Integrate with banking and payment systems
- Process financial transactions

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/financial.iso20022/latest)
