---
title: "Azure Cosmos DB - Examples"
description: "Code examples for the ballerinax/azure_cosmosdb connector."
---

# Azure Cosmos DB Examples

## Example 1: Product Catalog API

Build a product catalog service backed by Cosmos DB.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/uuid;
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

const string DATABASE = "ecommerce";
const string CONTAINER = "products";

final cosmosdb:DataPlaneClient cosmosClient = check new ({
    baseUrl: baseUrl,
    primaryKeyOrResourceToken: primaryKey
});

type Product record {
    string name;
    string category;
    decimal price;
    string description;
    boolean inStock;
};

service /catalog on new http:Listener(8080) {

    resource function post products(Product product) returns json|error {
        string productId = uuid:createType1AsString();
        json doc = {
            "id": productId,
            "category": product.category,
            "name": product.name,
            "price": product.price,
            "description": product.description,
            "inStock": product.inStock
        };

        _ = check cosmosClient->createDocument(
            DATABASE, CONTAINER, doc, product.category);

        log:printInfo("Product created", productId = productId);
        return {id: productId, status: "created"};
    }

    resource function get products(string? category, decimal? minPrice)
            returns json|error {
        string query = "SELECT * FROM products p WHERE 1=1";
        cosmosdb:QueryParameter[] params = [];

        if category is string {
            query += " AND p.category = @category";
            params.push({name: "@category", value: category});
        }
        if minPrice is decimal {
            query += " AND p.price >= @minPrice";
            params.push({name: "@minPrice", value: minPrice.toString()});
        }

        cosmosdb:QueryResult result = check cosmosClient->queryDocuments(
            DATABASE, CONTAINER,
            {query: query, parameters: params}
        );

        return {products: result.documents, count: result.documents.length()};
    }

    resource function get products/[string productId](string category)
            returns json|error {
        cosmosdb:Document doc = check cosmosClient->getDocument(
            DATABASE, CONTAINER, productId, category);
        return doc;
    }

    resource function put products/[string productId](Product product)
            returns json|error {
        json updatedDoc = {
            "id": productId,
            "category": product.category,
            "name": product.name,
            "price": product.price,
            "description": product.description,
            "inStock": product.inStock
        };

        _ = check cosmosClient->replaceDocument(
            DATABASE, CONTAINER, productId, updatedDoc, product.category);

        return {id: productId, status: "updated"};
    }

    resource function delete products/[string productId](string category)
            returns json|error {
        check cosmosClient->deleteDocument(
            DATABASE, CONTAINER, productId, category);
        return {id: productId, status: "deleted"};
    }
}
```

**Config.toml:**

```toml
baseUrl = "https://my-cosmos.documents.azure.com:443/"
primaryKey = "<YOUR_PRIMARY_KEY>"
```

## Example 2: User Session Store

Manage user sessions with TTL-based expiration.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

const string DATABASE = "app-data";
const string SESSIONS_CONTAINER = "sessions";
const int SESSION_TTL = 3600; // 1 hour

final cosmosdb:DataPlaneClient cosmosClient = check new ({
    baseUrl: baseUrl,
    primaryKeyOrResourceToken: primaryKey
});

service /sessions on new http:Listener(8080) {

    // Create a new session
    resource function post .(record {string userId; json data?;} payload)
            returns json|error {
        string sessionId = uuid:createType1AsString();
        string timestamp = time:utcToString(time:utcNow());

        json sessionDoc = {
            "id": sessionId,
            "userId": payload.userId,
            "data": payload.data ?: {},
            "createdAt": timestamp,
            "lastAccessed": timestamp,
            "ttl": SESSION_TTL
        };

        _ = check cosmosClient->createDocument(
            DATABASE, SESSIONS_CONTAINER, sessionDoc, payload.userId);

        log:printInfo("Session created",
            sessionId = sessionId, userId = payload.userId);
        return {sessionId: sessionId, expiresIn: SESSION_TTL};
    }

    // Get session data
    resource function get [string sessionId](string userId) returns json|error {
        cosmosdb:Document session = check cosmosClient->getDocument(
            DATABASE, SESSIONS_CONTAINER, sessionId, userId);

        // Update last accessed time
        string now = time:utcToString(time:utcNow());
        json updatedSession = check session.mergeJson({"lastAccessed": now});
        _ = check cosmosClient->replaceDocument(
            DATABASE, SESSIONS_CONTAINER, sessionId, updatedSession, userId);

        return session;
    }

    // Delete session (logout)
    resource function delete [string sessionId](string userId) returns json|error {
        check cosmosClient->deleteDocument(
            DATABASE, SESSIONS_CONTAINER, sessionId, userId);
        log:printInfo("Session terminated", sessionId = sessionId);
        return {status: "terminated", sessionId: sessionId};
    }

    // List active sessions for a user
    resource function get user/[string userId]() returns json|error {
        cosmosdb:QueryResult result = check cosmosClient->queryDocuments(
            DATABASE, SESSIONS_CONTAINER, {
                query: "SELECT * FROM sessions s WHERE s.userId = @userId ORDER BY s.lastAccessed DESC",
                parameters: [{name: "@userId", value: userId}]
            }
        );
        return {userId: userId, activeSessions: result.documents};
    }
}
```

## Example 3: Event Sourcing with Change Feed

Store domain events in Cosmos DB for event sourcing.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerina/uuid;
import ballerinax/azure_cosmosdb as cosmosdb;

configurable string baseUrl = ?;
configurable string primaryKey = ?;

const string DATABASE = "event-store";
const string EVENTS_CONTAINER = "events";

final cosmosdb:DataPlaneClient cosmosClient = check new ({
    baseUrl: baseUrl,
    primaryKeyOrResourceToken: primaryKey
});

type DomainEvent record {
    string aggregateId;
    string eventType;
    json payload;
};

service /events on new http:Listener(8080) {

    // Append a domain event
    resource function post .(DomainEvent event) returns json|error {
        string eventId = uuid:createType1AsString();
        string timestamp = time:utcToString(time:utcNow());

        json eventDoc = {
            "id": eventId,
            "aggregateId": event.aggregateId,
            "eventType": event.eventType,
            "payload": event.payload,
            "timestamp": timestamp,
            "version": 1
        };

        _ = check cosmosClient->createDocument(
            DATABASE, EVENTS_CONTAINER, eventDoc, event.aggregateId);

        log:printInfo("Event stored",
            eventId = eventId, eventType = event.eventType);
        return {eventId: eventId, timestamp: timestamp};
    }

    // Replay events for an aggregate
    resource function get replay/[string aggregateId]() returns json|error {
        cosmosdb:QueryResult result = check cosmosClient->queryDocuments(
            DATABASE, EVENTS_CONTAINER, {
                query: "SELECT * FROM events e WHERE e.aggregateId = @aggId ORDER BY e.timestamp ASC",
                parameters: [{name: "@aggId", value: aggregateId}]
            }
        );

        return {
            aggregateId: aggregateId,
            eventCount: result.documents.length(),
            events: result.documents
        };
    }

    // Get events by type
    resource function get byType/[string eventType]() returns json|error {
        cosmosdb:QueryResult result = check cosmosClient->queryDocuments(
            DATABASE, EVENTS_CONTAINER, {
                query: "SELECT * FROM events e WHERE e.eventType = @type ORDER BY e.timestamp DESC",
                parameters: [{name: "@type", value: eventType}]
            }
        );
        return {eventType: eventType, events: result.documents};
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
