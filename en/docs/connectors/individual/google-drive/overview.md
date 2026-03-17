---
title: "Google Drive"
description: "Overview of the ballerinax/googleapis.drive connector for WSO2 Integrator."
---

# Google Drive

| | |
|---|---|
| **Package** | [`ballerinax/googleapis.drive`](https://central.ballerina.io/ballerinax/googleapis.drive/latest) |
| **Version** | latest |
| **Category** | Cloud Services |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/googleapis.drive/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/googleapis.drive/latest) |

## Overview

Connect to Google Drive from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/googleapis.drive;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "googleapis.drive"
version = "latest"
```

## When to Use

Use the Google Drive connector when your integration needs to:

- Integrate with cloud platform services
- Manage cloud resources programmatically
- Build serverless and cloud-native integrations
- Automate cloud operations

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/googleapis.drive/latest)
