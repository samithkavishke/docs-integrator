---
title: "Protocol Connectors"
description: "Built-in protocol support for HTTP, GraphQL, gRPC, WebSocket, TCP, SOAP, and more."
---

# Protocol Connectors

Ballerina provides built-in library support for networking protocols. These are first-class language features — not external connectors — with dedicated listener and client types, compile-time type checking, and bidirectional code-design sync.

## Available Protocols

| Protocol | Package | Role | Description |
|----------|---------|------|-------------|
| **HTTP** | `ballerina/http` | Client + Service | REST APIs, webhooks, web services, SSE |
| **GraphQL** | `ballerina/graphql` | Client + Service | GraphQL APIs with subscriptions |
| **gRPC** | `ballerina/grpc` | Client + Service | High-performance RPC with Protobuf |
| **WebSocket** | `ballerina/websocket` | Client + Service | Real-time bidirectional messaging |
| **WebSub** | `ballerina/websub` | Subscriber | W3C WebSub event subscriptions |
| **WebSubHub** | `ballerina/websubhub` | Publisher | W3C WebSub event distribution hub |
| **TCP** | `ballerina/tcp` | Client + Listener | Raw TCP socket communication |
| **UDP** | `ballerina/udp` | Client + Listener | Datagram messaging |
| **SOAP** | `ballerina/soap` | Client | SOAP 1.1 and 1.2 web services |
| **Email (SMTP)** | `ballerina/email` | Client | Send email via SMTP |
| **Email (POP3)** | `ballerina/email` | Client + Listener | Receive email via POP3 |
| **Email (IMAP4)** | `ballerina/email` | Client + Listener | Receive email via IMAP |
| **FTP / SFTP** | `ballerina/ftp` | Client + Listener | File transfer protocol |

## HTTP

### Service (Expose an API)

```ballerina
import ballerina/http;

service /api on new http:Listener(9090) {
    resource function get customers() returns Customer[]|error {
        return getCustomersFromDb();
    }

    resource function post customers(Customer customer)
            returns http:Created|http:BadRequest {
        string|error id = insertCustomer(customer);
        if id is error {
            return <http:BadRequest>{body: {message: id.message()}};
        }
        return <http:Created>{body: {id: id}};
    }
}
```

### Client (Call an external API)

```ballerina
final http:Client apiClient = check new ("https://api.example.com", {
    retryConfig: {count: 3, interval: 2, backOffFactor: 2.0},
    circuitBreaker: {
        failureThreshold: 0.5,
        resetTime: 30,
        statusCodes: [500, 502, 503]
    }
});

json response = check apiClient->get("/data");
json postResult = check apiClient->post("/data", {name: "test"});
```

## GraphQL

### Service

```ballerina
import ballerina/graphql;

service /graphql on new graphql:Listener(8080) {
    resource function get customer(int id) returns Customer|error {
        return getCustomerById(id);
    }

    remote function createCustomer(CustomerInput input) returns Customer|error {
        return insertCustomer(input);
    }
}
```

### Client

```ballerina
final graphql:Client gqlClient = check new ("https://api.example.com/graphql");

json response = check gqlClient->execute(
    `query { customer(id: 1) { name email } }`
);
```

## gRPC

### Service

```ballerina
import ballerina/grpc;

@grpc:Descriptor {value: ORDER_SERVICE_DESC}
service "OrderService" on new grpc:Listener(9090) {
    remote function getOrder(string orderId) returns Order|error {
        return getOrderById(orderId);
    }

    remote function createOrder(OrderRequest req) returns Order|error {
        return insertOrder(req);
    }
}
```

### Client

```ballerina
OrderServiceClient orderClient = check new ("http://localhost:9090");
Order order = check orderClient->getOrder("ORD-001");
```

## WebSocket

```ballerina
import ballerina/websocket;

// Server
service /ws on new websocket:Listener(8080) {
    resource function get .() returns websocket:Service {
        return new ChatService();
    }
}

service class ChatService {
    *websocket:Service;

    remote function onTextMessage(websocket:Caller caller,
            string message) returns error? {
        // Broadcast to all clients or process message
        check caller->writeTextMessage("Echo: " + message);
    }
}
```

## Email (SMTP / IMAP)

```ballerina
import ballerina/email;

// Send email
email:SmtpClient smtp = check new ("smtp.example.com", "user", "pass");
check smtp->sendMessage({
    to: "recipient@example.com",
    subject: "Integration Alert",
    body: "Order processing completed."
});

// Receive email (listener)
listener email:ImapListener imapListener = check new ({
    host: "imap.example.com",
    username: "user",
    password: "pass",
    pollingInterval: 60
});

service on imapListener {
    remote function onMessage(email:Message message) {
        // Process incoming email
    }
}
```

## TCP

```ballerina
import ballerina/tcp;

// TCP server
listener tcp:Listener tcpListener = new (3000);

service on tcpListener {
    remote function onConnect(tcp:Caller caller) returns tcp:ConnectionService {
        return new TcpService();
    }
}

service class TcpService {
    *tcp:ConnectionService;

    remote function onBytes(tcp:Caller caller, readonly & byte[] data)
            returns byte[]|tcp:Error? {
        // Process and respond
        return "ACK".toBytes();
    }
}

// TCP client
tcp:Client tcpClient = check new ("localhost", 3000);
check tcpClient->writeBytes("Hello".toBytes());
byte[] response = check tcpClient->readBytes();
```

## Security Features

All protocol connectors support:

- **SSL/TLS** — Server and mutual TLS with certificate configuration
- **OAuth 2.0** — Client credentials, authorization code, refresh token flows
- **JWT** — Token validation and generation
- **Basic Auth** — Username/password authentication
- **API Key** — Header or query parameter-based keys

## What's Next

- [Connection Configuration](configuration.md) — Set up protocol connections
- [Database Connectors](databases.md) — Connect to databases
- [Messaging Connectors](messaging.md) — Connect to message brokers
