---
title: "Slack Trigger"
description: "Overview of the ballerinax/trigger.slack connector for WSO2 Integrator."
---

# Slack Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.slack`](https://central.ballerina.io/ballerinax/trigger.slack/latest) |
| **Version** | latest |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.slack/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.slack/latest) |

## Overview

Connect to Slack Trigger from Ballerina.

## Key Features

- **Type-safe API**: Strongly typed request and response models with compile-time validation
- **Configurable**: All connection parameters configurable via `Config.toml`
- **Error handling**: Ballerina-native error types with `check` and `do/on fail` support
- **Visual Designer**: Drag-and-drop connection setup in the VS Code extension
- **Production-ready**: Built-in support for retry, timeout, and circuit breaker patterns

## Quick Start

Import the package in your Ballerina code:

```ballerina
import ballerinax/trigger.slack;
```

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.slack"
version = "latest"
```

## When to Use

Use the Slack Trigger connector when your integration needs to:

- React to events in real time from external services
- Build event-driven integrations and automations
- Process webhooks and streaming events
- Trigger workflows based on external changes

## Related Resources

- [Setup Guide](setup) -- Installation and configuration
- [Triggers Reference](triggers) -- Available operations
- [Examples](examples) -- Code samples
- [API Documentation](https://central.ballerina.io/ballerinax/trigger.slack/latest)
