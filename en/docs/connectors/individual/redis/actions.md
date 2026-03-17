---
title: "Redis - Actions"
description: "Available actions and operations for the ballerinax/redis connector."
---

# Redis Actions

The `ballerinax/redis` connector provides operations organized by Redis data structure type.

## Client Initialization

```ballerina
import ballerinax/redis;
import ballerina/io;

final redis:Client redis = check new (
    connection = {
        host: "localhost",
        port: 6379
    }
);
```

## String Operations

### set()

Sets a string value for a key.

```ballerina
check redis->set("user:42:name", "Alice Smith");
```

### get()

Gets the value of a key. Returns `()` if the key does not exist.

```ballerina
string? name = check redis->get("user:42:name");
if name is string {
    io:println("Name: ", name);
}
```

### mSet()

Sets multiple key-value pairs at once.

```ballerina
map<string> values = {
    "user:42:name": "Alice",
    "user:42:email": "alice@example.com",
    "user:42:role": "admin"
};
check redis->mSet(values);
```

### mGet()

Gets multiple values by key.

```ballerina
string[] keys = ["user:42:name", "user:42:email", "user:42:role"];
string?[] values = check redis->mGet(keys);
```

### incr() / incrBy() / incrByFloat()

Atomically increments a numeric value.

```ballerina
// Increment by 1
int newCount = check redis->incr("page:views");

// Increment by a specific integer
int result = check redis->incrBy("counter", 5);

// Increment by a float
float newValue = check redis->incrByFloat("price", 0.50);
```

### decr() / decrBy()

Atomically decrements a numeric value.

```ballerina
int remaining = check redis->decr("stock:item42");
int result = check redis->decrBy("credits", 10);
```

### append()

Appends a value to an existing string.

```ballerina
int newLength = check redis->append("log:entry", " | additional data");
```

## Key Management

### del()

Deletes one or more keys.

```ballerina
int deletedCount = check redis->del(["key1", "key2", "key3"]);
io:println("Deleted: ", deletedCount);
```

### exists()

Checks if a key exists.

```ballerina
int count = check redis->exists(["user:42:name"]);
boolean keyExists = count > 0;
```

### expire()

Sets a time-to-live (TTL) on a key in seconds.

```ballerina
check redis->expire("session:token123", 3600); // 1 hour
```

### pExpire()

Sets a TTL in milliseconds.

```ballerina
check redis->pExpire("temp:data", 5000); // 5 seconds
```

### ttl()

Gets the remaining TTL of a key in seconds.

```ballerina
int remainingSeconds = check redis->ttl("session:token123");
io:println("TTL: ", remainingSeconds, " seconds");
```

### keys()

Finds all keys matching a pattern.

```ballerina
string[] userKeys = check redis->keys("user:*:name");
```

### rename()

Renames a key.

```ballerina
check redis->rename("old-key", "new-key");
```

## Hash Operations

### hSet()

Sets a field in a hash.

```ballerina
check redis->hSet("user:42", "name", "Alice");
check redis->hSet("user:42", "email", "alice@example.com");
```

### hGet()

Gets a field value from a hash.

```ballerina
string? name = check redis->hGet("user:42", "name");
```

### hMSet()

Sets multiple fields in a hash at once.

```ballerina
map<string> userData = {
    "name": "Alice",
    "email": "alice@example.com",
    "department": "Engineering"
};
check redis->hMSet("user:42", userData);
```

### hGetAll()

Gets all fields and values from a hash.

```ballerina
map<string> allFields = check redis->hGetAll("user:42");
foreach [string, string] [field, value] in allFields.entries() {
    io:println(field, ": ", value);
}
```

### hDel()

Deletes fields from a hash.

```ballerina
int deleted = check redis->hDel("user:42", ["temporary_field"]);
```

### hExists()

Checks if a field exists in a hash.

```ballerina
boolean exists = check redis->hExists("user:42", "email");
```

### hKeys() / hVals()

Gets all field names or values from a hash.

```ballerina
string[] fields = check redis->hKeys("user:42");
string[] values = check redis->hVals("user:42");
```

## List Operations

### lPush() / rPush()

Pushes elements to the head or tail of a list.

```ballerina
// Push to head (left)
int length = check redis->lPush("queue:tasks", ["task3", "task2", "task1"]);

// Push to tail (right)
int newLen = check redis->rPush("queue:tasks", ["task4"]);
```

### lPop() / rPop()

Pops an element from the head or tail of a list.

```ballerina
string? task = check redis->lPop("queue:tasks");     // Removes from head
string? lastTask = check redis->rPop("queue:tasks");  // Removes from tail
```

### lRange()

Gets a range of elements from a list.

```ballerina
// Get first 10 elements
string[] items = check redis->lRange("queue:tasks", 0, 9);

// Get all elements
string[] allItems = check redis->lRange("queue:tasks", 0, -1);
```

### lLen()

Gets the length of a list.

```ballerina
int length = check redis->lLen("queue:tasks");
```

## Set Operations

### sAdd()

Adds members to a set.

```ballerina
int added = check redis->sAdd("tags:article42", ["ballerina", "integration", "api"]);
```

### sMembers()

Returns all members of a set.

```ballerina
string[] tags = check redis->sMembers("tags:article42");
```

### sIsMember()

Checks if a value is a member of a set.

```ballerina
boolean isMember = check redis->sIsMember("tags:article42", "ballerina");
```

### sRem()

Removes members from a set.

```ballerina
int removed = check redis->sRem("tags:article42", ["obsolete-tag"]);
```

### sCard()

Returns the number of elements in a set.

```ballerina
int count = check redis->sCard("tags:article42");
```

## Sorted Set Operations

### zAdd()

Adds members with scores to a sorted set.

```ballerina
int added = check redis->zAdd("leaderboard", {"Alice": 950.0, "Bob": 870.0, "Carol": 1020.0});
```

### zRange()

Gets members by rank range (ascending).

```ballerina
string[] topPlayers = check redis->zRange("leaderboard", 0, 9);
```

### zScore()

Gets the score of a member.

```ballerina
float? score = check redis->zScore("leaderboard", "Alice");
```

## Error Handling

```ballerina
do {
    check redis->set("key", "value");
} on fail error e {
    io:println("Redis error: ", e.message());
}
```

## Client Lifecycle

```ballerina
redis->close();
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
