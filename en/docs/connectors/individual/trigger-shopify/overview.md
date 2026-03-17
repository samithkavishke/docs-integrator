---
title: "Shopify Trigger"
description: "Overview of the ballerinax/trigger.shopify connector for WSO2 Integrator."
---

# Shopify Trigger

| | |
|---|---|
| **Package** | [`ballerinax/trigger.shopify`](https://central.ballerina.io/ballerinax/trigger.shopify/latest) |
| **Version** | 1.6.0 |
| **Category** | Triggers |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/trigger.shopify/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/trigger.shopify/latest#functions) |

## Overview

The `ballerinax/trigger.shopify` module provides a listener that receives [Shopify webhook notifications](https://shopify.dev/apps/webhooks). After subscribing to a webhook topic, your Ballerina service automatically receives events when specific actions occur in a Shopify store, eliminating the need for periodic API polling.

The listener validates incoming webhook payloads using the Shopify API secret key (HMAC-SHA256 verification) to ensure only authentic Shopify notifications are processed.

### Supported service types and events

**OrdersService** -- Order lifecycle events:

| Remote function | Description |
|---|---|
| `onOrdersCreate` | A new order is placed |
| `onOrdersCancelled` | An order is cancelled |
| `onOrdersFulfilled` | An order is fully fulfilled |
| `onOrdersPaid` | An order is paid |
| `onOrdersPartiallyFulfilled` | An order is partially fulfilled |
| `onOrdersUpdated` | An order is updated |

**ProductsService** -- Product catalog events:

| Remote function | Description |
|---|---|
| `onProductsCreate` | A new product is created |
| `onProductsUpdate` | A product is updated |
| `onProductsDelete` | A product is deleted |

**CustomersService** -- Customer account events:

| Remote function | Description |
|---|---|
| `onCustomersCreate` | A new customer account is created |
| `onCustomersUpdate` | A customer account is updated |
| `onCustomersDelete` | A customer account is deleted |

### Common use cases

- **Order fulfillment automation** -- Route new orders to a warehouse management system or third-party logistics (3PL) provider.
- **Inventory sync** -- Detect product updates and sync inventory levels to external ERP or accounting systems.
- **Customer data integration** -- Mirror Shopify customer records to a CRM (Salesforce, HubSpot) for unified customer views.
- **Abandoned cart recovery** -- Trigger email or SMS campaigns when checkout events occur.
- **Analytics and reporting** -- Stream order and product events to a data warehouse for real-time analytics.

## Quick start

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.shopify"
version = "1.6.0"
```

```ballerina
import ballerinax/trigger.shopify;
import ballerina/log;

shopify:ListenerConfig listenerConfig = {
    apiSecretKey: "<SHOPIFY_API_SECRET_KEY>"
};

listener shopify:Listener shopifyListener = new (listenerConfig, 8090);

service shopify:OrdersService on shopifyListener {
    remote function onOrdersCreate(shopify:OrderEvent event) returns error? {
        log:printInfo("New order received", orderId = event.toString());
    }

    remote function onOrdersCancelled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersFulfilled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersPaid(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersPartiallyFulfilled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersUpdated(shopify:OrderEvent event) returns error? { return; }
}
```

## Related resources

- [Setup Guide](setup)
- [Triggers Reference](triggers)
- [Examples](examples)
- [Ballerina Central Package](https://central.ballerina.io/ballerinax/trigger.shopify/latest)
