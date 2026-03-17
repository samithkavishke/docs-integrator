---
sidebar_position: 1
title: Services
description: Build HTTP, GraphQL, gRPC, WebSocket, and TCP services.
---

# Services

Services are the most common integration artifact in WSO2 Integrator. They expose your integrations over network protocols and accept incoming requests from clients. You can build services visually with the low-code designer or write Ballerina code directly.

## HTTP Services

### Creating an HTTP Service

An HTTP service binds to a listener on a specific port and defines resource functions for each endpoint.

```ballerina
import ballerina/http;

service /api on new http:Listener(8090) {

    resource function get hello() returns string {
        return "Hello from WSO2 Integrator";
    }
}
```

The service path `/api` combined with the resource path means this endpoint is reachable at `http://localhost:8090/api/hello`.

### Defining Resources and Methods

Resource functions map directly to HTTP methods. Use `get`, `post`, `put`, `delete`, or `patch` as the accessor.

```ballerina
service /orders on new http:Listener(8090) {

    resource function get .() returns Order[] {
        return getAllOrders();
    }

    resource function post .(@http:Payload OrderRequest req) returns Order|http:BadRequest {
        return createOrder(req);
    }

    resource function get [string id]() returns Order|http:NotFound {
        return getOrderById(id);
    }

    resource function delete [string id]() returns http:NoContent|http:NotFound {
        return deleteOrder(id);
    }
}
```

### Path Parameters and Query Parameters

Path parameters are declared as part of the resource path. Query parameters are regular function parameters.

```ballerina
// Path parameter: /products/{id}
resource function get products/[string id]() returns Product|http:NotFound {
    return getProduct(id);
}

// Query parameters: /products?category=electronics&limit=10
resource function get products(string? category, int limit = 20) returns Product[] {
    return searchProducts(category, limit);
}
```

### Request and Response Payload Types

Ballerina provides type-safe payload binding. Annotate parameters with `@http:Payload` for request bodies. Return types map to response status codes.

```ballerina
type CustomerRequest record {|
    string name;
    string email;
    string phone?;
|};

type CustomerResponse record {|
    string id;
    string name;
    string email;
    string createdAt;
|};

resource function post customers(@http:Payload CustomerRequest req)
        returns CustomerResponse|http:BadRequest|http:InternalServerError {
    do {
        return check insertCustomer(req);
    } on fail error e {
        return <http:InternalServerError>{body: {message: e.message()}};
    }
}
```

### Headers and CORS Configuration

Access headers from the request and configure CORS at the service level.

```ballerina
@http:ServiceConfig {
    cors: {
        allowOrigins: ["https://app.example.com"],
        allowMethods: ["GET", "POST", "PUT", "DELETE"],
        allowHeaders: ["Content-Type", "Authorization"],
        maxAge: 3600
    }
}
service /api on new http:Listener(8090) {

    resource function get secure(@http:Header string authorization) returns json|http:Unauthorized {
        if !validateToken(authorization) {
            return <http:Unauthorized>{body: {message: "Invalid token"}};
        }
        return {data: "protected resource"};
    }
}
```

### Interceptors

Request and response interceptors let you add cross-cutting logic such as logging, authentication, or header manipulation.

```ballerina
service class LogInterceptor {
    *http:RequestInterceptor;

    resource function 'default [string... path](http:RequestContext ctx, http:Request req)
            returns http:NextService|error? {
        log:printInfo("Request received", method = req.method, path = req.rawPath);
        return ctx.next();
    }
}
```

## GraphQL Services

Build GraphQL APIs using the `graphql` module. Resource functions define the schema automatically.

```ballerina
import ballerina/graphql;

service /graphql on new graphql:Listener(9090) {

    // Query field
    resource function get greeting(string name) returns string {
        return "Hello, " + name;
    }

    // Mutation
    remote function addBook(string title, string author) returns Book|error {
        return check insertBook(title, author);
    }
}
```

## gRPC Services

Define gRPC services using Protocol Buffers and implement them in Ballerina.

```ballerina
import ballerina/grpc;

@grpc:Descriptor {value: ORDER_SERVICE_DESC}
service "OrderService" on new grpc:Listener(9090) {

    remote function getOrder(string orderId) returns Order|error {
        return check fetchOrder(orderId);
    }

    remote function createOrder(OrderRequest request) returns Order|error {
        return check insertOrder(request);
    }
}
```

Generate the Ballerina stub code from your `.proto` file using the `bal grpc --input order_service.proto` command.

## WebSocket Services

WebSocket services handle persistent bidirectional connections.

```ballerina
import ballerina/websocket;

service /chat on new websocket:Listener(9090) {

    resource function get .() returns websocket:Service {
        return new ChatService();
    }
}

service class ChatService {
    *websocket:Service;

    remote function onMessage(websocket:Caller caller, string message) returns error? {
        // Echo the message back to the client
        check caller->writeMessage("Received: " + message);
    }

    remote function onClose(websocket:Caller caller, int statusCode, string reason) {
        log:printInfo("Connection closed", statusCode = statusCode);
    }
}
```

## What's Next

- [Event Handlers](event-handlers.md) -- React to messages from brokers
- [Error Handling](error-handling.md) -- Handle failures gracefully
