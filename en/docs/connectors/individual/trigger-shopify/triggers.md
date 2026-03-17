---
title: "Shopify Trigger - Triggers"
description: "Available trigger events, service types, and payload types for the ballerinax/trigger.shopify connector."
---

# Shopify Trigger - Available Events

The `ballerinax/trigger.shopify` listener receives Shopify webhook notifications and dispatches them to your Ballerina service. The listener validates incoming requests with HMAC-SHA256 signature verification using the Shopify API secret key.

## Listener initialization

Create the listener with the Shopify API secret key and an optional port (defaults to 8090).

```ballerina
import ballerinax/trigger.shopify;

shopify:ListenerConfig listenerConfig = {
    apiSecretKey: "<SHOPIFY_API_SECRET_KEY>"
};

listener shopify:Listener shopifyListener = new (listenerConfig, 8090);
```

The API secret key can be found under **Webhooks** in the Shopify admin dashboard (for dashboard-created webhooks) or under **API credentials** in the Shopify App settings (for programmatically created webhooks).

Externalize the configuration via `Config.toml`:

```toml
# Config.toml
[listenerConfig]
apiSecretKey = "<SHOPIFY_API_SECRET_KEY>"
```

## Service type: `OrdersService`

Handles order lifecycle events. All six remote functions must be implemented.

```ballerina
service shopify:OrdersService on shopifyListener {

    remote function onOrdersCreate(shopify:OrderEvent event) returns error? {
        // A new order was placed in the store
    }

    remote function onOrdersCancelled(shopify:OrderEvent event) returns error? {
        // An order was cancelled
    }

    remote function onOrdersFulfilled(shopify:OrderEvent event) returns error? {
        // An order was fully fulfilled
    }

    remote function onOrdersPaid(shopify:OrderEvent event) returns error? {
        // An order payment was completed
    }

    remote function onOrdersPartiallyFulfilled(shopify:OrderEvent event) returns error? {
        // An order was partially fulfilled
    }

    remote function onOrdersUpdated(shopify:OrderEvent event) returns error? {
        // An order was updated (metadata, tags, notes, etc.)
    }
}
```

### Order event details

| Event | Webhook topic | Description |
|---|---|---|
| `onOrdersCreate` | `orders/create` | Fires when a customer completes checkout |
| `onOrdersCancelled` | `orders/cancelled` | Fires when a merchant cancels an order |
| `onOrdersFulfilled` | `orders/fulfilled` | Fires when all line items are fulfilled |
| `onOrdersPaid` | `orders/paid` | Fires when the payment is captured |
| `onOrdersPartiallyFulfilled` | `orders/partially_fulfilled` | Fires when some but not all items are fulfilled |
| `onOrdersUpdated` | `orders/updated` | Fires on any order attribute change |

## Service type: `ProductsService`

Handles product catalog events.

```ballerina
service shopify:ProductsService on shopifyListener {

    remote function onProductsCreate(shopify:ProductEvent event) returns error? {
        // A new product was added to the store
    }

    remote function onProductsUpdate(shopify:ProductEvent event) returns error? {
        // A product was updated
    }

    remote function onProductsDelete(shopify:ProductEvent event) returns error? {
        // A product was removed from the store
    }
}
```

## Service type: `CustomersService`

Handles customer account events.

```ballerina
service shopify:CustomersService on shopifyListener {

    remote function onCustomersCreate(shopify:CustomerEvent event) returns error? {
        // A new customer account was created
    }

    remote function onCustomersUpdate(shopify:CustomerEvent event) returns error? {
        // A customer account was updated
    }

    remote function onCustomersDelete(shopify:CustomerEvent event) returns error? {
        // A customer account was deleted
    }
}
```

## Payload types

| Type | Used by | Description |
|---|---|---|
| `shopify:OrderEvent` | `OrdersService` | Contains order details including line items, customer info, and financial status |
| `shopify:ProductEvent` | `ProductsService` | Contains product details including title, variants, and images |
| `shopify:CustomerEvent` | `CustomersService` | Contains customer details including name, email, and addresses |

## Multiple services on one listener

You can attach multiple service types to the same listener to handle different webhook topics:

```ballerina
service shopify:OrdersService on shopifyListener {
    remote function onOrdersCreate(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersCancelled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersFulfilled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersPaid(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersPartiallyFulfilled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersUpdated(shopify:OrderEvent event) returns error? { return; }
}

service shopify:ProductsService on shopifyListener {
    remote function onProductsCreate(shopify:ProductEvent event) returns error? { return; }
    remote function onProductsUpdate(shopify:ProductEvent event) returns error? { return; }
    remote function onProductsDelete(shopify:ProductEvent event) returns error? { return; }
}
```

## Error handling

```ballerina
remote function onOrdersCreate(shopify:OrderEvent event) returns error? {
    do {
        log:printInfo("Processing new order", order = event.toString());
        // Business logic
    } on fail error e {
        log:printError("Failed to process order", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
