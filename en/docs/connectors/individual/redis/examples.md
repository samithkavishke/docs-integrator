---
title: "Redis - Examples"
description: "Code examples for the ballerinax/redis connector."
---

# Redis Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/http;
import ballerinax/redis;

configurable string redisHost = "localhost";
configurable int redisPort = 6379;
```

```toml
# Config.toml
redisHost = "localhost"
redisPort = 6379
```

## Example 1: Cache Management

Implement a simple caching layer for API responses:

```ballerina
final redis:Client redis = check new (
    connection = {host: redisHost, port: redisPort}
);

// Cache with TTL
function cacheSet(string key, string value, int ttlSeconds) returns error? {
    check redis->set(key, value);
    check redis->expire(key, ttlSeconds);
}

function cacheGet(string key) returns string?|error {
    return redis->get(key);
}

function cacheInvalidate(string key) returns error? {
    _ = check redis->del([key]);
}

// Usage in a service
service /api on new http:Listener(8080) {

    resource function get products/[int id]() returns json|error {
        string cacheKey = string `product:${id}`;

        // Check cache first
        string? cached = check cacheGet(cacheKey);
        if cached is string {
            return cached.fromJsonString();
        }

        // Cache miss -- fetch from database (simulated)
        json product = {id: id, name: "Widget", price: 29.99};

        // Store in cache for 5 minutes
        check cacheSet(cacheKey, product.toJsonString(), 300);
        return product;
    }
}
```

## Example 2: Session Management

```ballerina
import ballerina/uuid;

final redis:Client redis = check new (
    connection = {host: redisHost, port: redisPort}
);

function createSession(string userId, string email) returns string|error {
    string sessionId = uuid:createType1AsString();
    string sessionKey = string `session:${sessionId}`;

    map<string> sessionData = {
        "userId": userId,
        "email": email,
        "createdAt": "2024-01-15T10:00:00Z"
    };

    check redis->hMSet(sessionKey, sessionData);
    check redis->expire(sessionKey, 7200); // 2 hours
    return sessionId;
}

function getSession(string sessionId) returns map<string>?|error {
    string sessionKey = string `session:${sessionId}`;
    int exists = check redis->exists([sessionKey]);

    if exists == 0 {
        return ();
    }

    // Refresh TTL on access
    check redis->expire(sessionKey, 7200);
    return check redis->hGetAll(sessionKey);
}

function destroySession(string sessionId) returns error? {
    _ = check redis->del([string `session:${sessionId}`]);
}
```

## Example 3: Rate Limiting

Implement a sliding window rate limiter:

```ballerina
final redis:Client redis = check new (
    connection = {host: redisHost, port: redisPort}
);

// Allow maxRequests per windowSeconds for a given client identifier
function checkRateLimit(string clientId,
                         int maxRequests,
                         int windowSeconds) returns boolean|error {
    string key = string `ratelimit:${clientId}`;

    // Increment the counter
    int currentCount = check redis->incr(key);

    // Set expiry on first request in the window
    if currentCount == 1 {
        check redis->expire(key, windowSeconds);
    }

    return currentCount <= maxRequests;
}

// Usage in HTTP middleware
service /api on new http:Listener(8080) {

    resource function get data(http:Request req) returns json|http:TooManyRequests|error {
        string clientIp = check req.getHeader("X-Forwarded-For");
        boolean allowed = check checkRateLimit(clientIp, 100, 60); // 100 req/min

        if !allowed {
            return http:TOO_MANY_REQUESTS;
        }

        return {message: "Success", data: "your-data-here"};
    }
}
```

## Example 4: Task Queue

Implement a simple FIFO task queue using Redis lists:

```ballerina
final redis:Client redis = check new (
    connection = {host: redisHost, port: redisPort}
);

// Producer: enqueue tasks
function enqueueTask(string queueName, string taskPayload) returns error? {
    _ = check redis->rPush(queueName, [taskPayload]);
    io:println("Enqueued task to ", queueName);
}

// Consumer: dequeue and process tasks
function processQueue(string queueName) returns error? {
    while true {
        string? task = check redis->lPop(queueName);
        if task is string {
            io:println("Processing: ", task);
            // Process the task...
        } else {
            // No tasks available, wait briefly
            // In production, use BRPOP for blocking
            break;
        }
    }
}

public function main() returns error? {
    // Enqueue some tasks
    check enqueueTask("email:queue", "send-welcome:user123");
    check enqueueTask("email:queue", "send-receipt:order456");
    check enqueueTask("email:queue", "send-reminder:user789");

    // Process the queue
    check processQueue("email:queue");
}
```

## Example 5: Leaderboard with Sorted Sets

```ballerina
final redis:Client redis = check new (
    connection = {host: redisHost, port: redisPort}
);

function addScore(string leaderboard, string player, float score) returns error? {
    _ = check redis->zAdd(leaderboard, {[player]: score});
}

function getTopPlayers(string leaderboard, int count) returns string[]|error {
    // zRange returns in ascending order; for descending, use negative indices
    return redis->zRange(leaderboard, 0, count - 1);
}

function getPlayerRank(string leaderboard, string player) returns int?|error {
    return redis->zRank(leaderboard, player);
}

function getPlayerScore(string leaderboard, string player) returns float?|error {
    return redis->zScore(leaderboard, player);
}

public function main() returns error? {
    string board = "game:leaderboard";

    // Add player scores
    check addScore(board, "Alice", 2500);
    check addScore(board, "Bob", 1800);
    check addScore(board, "Carol", 3200);
    check addScore(board, "Dave", 2100);

    // Get top 3 players
    string[] topPlayers = check getTopPlayers(board, 3);
    io:println("Top players: ", topPlayers);

    // Get Alice's rank and score
    int? rank = check getPlayerRank(board, "Alice");
    float? score = check getPlayerScore(board, "Alice");
    io:println("Alice - Rank: ", rank, ", Score: ", score);
}
```

## Example 6: Hash-Based User Profiles

```ballerina
final redis:Client redis = check new (
    connection = {host: redisHost, port: redisPort}
);

type UserProfile record {|
    string name;
    string email;
    string department;
    string role;
|};

function saveUserProfile(int userId, UserProfile profile) returns error? {
    string key = string `user:${userId}`;
    map<string> data = {
        "name": profile.name,
        "email": profile.email,
        "department": profile.department,
        "role": profile.role
    };
    check redis->hMSet(key, data);
}

function getUserProfile(int userId) returns UserProfile?|error {
    string key = string `user:${userId}`;
    int exists = check redis->exists([key]);

    if exists == 0 {
        return ();
    }

    map<string> data = check redis->hGetAll(key);
    return {
        name: data.get("name"),
        email: data.get("email"),
        department: data.get("department"),
        role: data.get("role")
    };
}

function updateUserField(int userId, string field, string value) returns error? {
    check redis->hSet(string `user:${userId}`, field, value);
}
```

## Example 7: Error Handling

```ballerina
function safeRedisOp(redis:Client redis) returns error? {
    do {
        check redis->set("key", "value");
        string? result = check redis->get("key");
        io:println("Value: ", result);
    } on fail error e {
        io:println("Redis operation failed: ", e.message());
        // Implement fallback logic here
        return error("Cache unavailable, falling back to database", e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
