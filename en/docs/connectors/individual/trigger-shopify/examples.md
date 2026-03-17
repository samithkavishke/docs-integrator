---
title: "Shopify Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.shopify connector."
---

# Shopify Trigger Examples

## Example 1: Log order lifecycle events

A basic listener that logs every order event from a Shopify store. Use this to verify your webhook setup.

```ballerina
import ballerina/log;
import ballerinax/trigger.shopify;

configurable string apiSecretKey = ?;

shopify:ListenerConfig listenerConfig = {
    apiSecretKey: apiSecretKey
};

listener shopify:Listener shopifyListener = new (listenerConfig, 8090);

service shopify:OrdersService on shopifyListener {

    remote function onOrdersCreate(shopify:OrderEvent event) returns error? {
        log:printInfo("Order created", order = event.toString());
    }

    remote function onOrdersCancelled(shopify:OrderEvent event) returns error? {
        log:printInfo("Order cancelled", order = event.toString());
    }

    remote function onOrdersFulfilled(shopify:OrderEvent event) returns error? {
        log:printInfo("Order fulfilled", order = event.toString());
    }

    remote function onOrdersPaid(shopify:OrderEvent event) returns error? {
        log:printInfo("Order paid", order = event.toString());
    }

    remote function onOrdersPartiallyFulfilled(shopify:OrderEvent event) returns error? {
        log:printInfo("Order partially fulfilled", order = event.toString());
    }

    remote function onOrdersUpdated(shopify:OrderEvent event) returns error? {
        log:printInfo("Order updated", order = event.toString());
    }
}
```

**Config.toml:**

```toml
apiSecretKey = "<YOUR_SHOPIFY_API_SECRET_KEY>"
```

## Example 2: Forward new orders to a fulfillment API

This example captures new order creation events and forwards the order data to an external fulfillment service for processing.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.shopify;

configurable string apiSecretKey = ?;
configurable string fulfillmentApiUrl = ?;

shopify:ListenerConfig listenerConfig = {
    apiSecretKey: apiSecretKey
};

listener shopify:Listener shopifyListener = new (listenerConfig, 8090);

final http:Client fulfillmentClient = check new (fulfillmentApiUrl);

service shopify:OrdersService on shopifyListener {

    remote function onOrdersCreate(shopify:OrderEvent event) returns error? {
        json orderPayload = {
            source: "shopify",
            eventType: "order_created",
            orderData: event.toJson()
        };
        http:Response resp = check fulfillmentClient->post("/orders", orderPayload);
        log:printInfo("Order forwarded to fulfillment",
            statusCode = resp.statusCode);
    }

    remote function onOrdersCancelled(shopify:OrderEvent event) returns error? {
        json cancelPayload = {
            source: "shopify",
            eventType: "order_cancelled",
            orderData: event.toJson()
        };
        _ = check fulfillmentClient->post("/orders/cancel", cancelPayload);
        log:printInfo("Order cancellation forwarded");
    }

    remote function onOrdersFulfilled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersPaid(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersPartiallyFulfilled(shopify:OrderEvent event) returns error? { return; }
    remote function onOrdersUpdated(shopify:OrderEvent event) returns error? { return; }
}
```

**Config.toml:**

```toml
apiSecretKey = "<YOUR_SHOPIFY_API_SECRET_KEY>"
fulfillmentApiUrl = "https://fulfillment.example.com/api"
```

## Example 3: Sync product changes to an external catalog

This example listens for product lifecycle events and syncs create, update, and delete operations to an external product catalog or search index.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.shopify;

configurable string apiSecretKey = ?;
configurable string catalogApiUrl = ?;

shopify:ListenerConfig listenerConfig = {
    apiSecretKey: apiSecretKey
};

listener shopify:Listener shopifyListener = new (listenerConfig, 8090);

final http:Client catalogClient = check new (catalogApiUrl);

service shopify:ProductsService on shopifyListener {

    remote function onProductsCreate(shopify:ProductEvent event) returns error? {
        json payload = {action: "create", product: event.toJson()};
        http:Response resp = check catalogClient->post("/products", payload);
        log:printInfo("Product synced to catalog",
            statusCode = resp.statusCode);
    }

    remote function onProductsUpdate(shopify:ProductEvent event) returns error? {
        json payload = {action: "update", product: event.toJson()};
        http:Response resp = check catalogClient->put("/products", payload);
        log:printInfo("Product update synced",
            statusCode = resp.statusCode);
    }

    remote function onProductsDelete(shopify:ProductEvent event) returns error? {
        log:printInfo("Product deleted from Shopify",
            product = event.toString());
    }
}
```

## Running the examples

1. Obtain your Shopify API secret key from the Shopify admin dashboard.
2. Expose your local service using ngrok:

   ```bash
   ngrok http 8090
   ```

3. Create a webhook subscription in Shopify pointing to your ngrok URL (with a trailing `/`):
   - Navigate to **Settings > Notifications > Webhooks** in the Shopify admin, or
   - Use the [Shopify Admin API](https://shopify.dev/apps/webhooks/configuration/https) to create webhooks programmatically.
4. Update `Config.toml` with your API secret key.
5. Compile and run:

   ```bash
   bal run
   ```

6. Place a test order or create a product in your Shopify store to see events arrive.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
