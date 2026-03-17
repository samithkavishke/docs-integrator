---
title: "MongoDB - Actions"
description: "Available actions and operations for the ballerinax/mongodb connector."
---

# MongoDB Actions

The `ballerinax/mongodb` connector provides a document-oriented API that differs from SQL connectors. Operations are performed at the **Collection** level after navigating through the Client and Database hierarchy.

## Client Initialization

```ballerina
import ballerinax/mongodb;
import ballerina/io;

configurable string connectionString = ?;

final mongodb:Client mongoClient = check new ({
    connection: connectionString
});
```

## Database and Collection Access

### getDatabase()

Retrieves a database reference from the MongoDB client.

```ballerina
mongodb:Database db = check mongoClient->getDatabase("myapp");
```

### getCollection()

Retrieves a collection reference from a database.

```ballerina
mongodb:Collection users = check db->getCollection("users");
```

### listDatabaseNames()

Lists all database names on the server.

```ballerina
string[] dbNames = check mongoClient->listDatabaseNames();
foreach string name in dbNames {
    io:println("Database: ", name);
}
```

## Document Operations

### insertOne()

Inserts a single document into a collection.

```ballerina
check users->insertOne({
    name: "Alice Smith",
    email: "alice@example.com",
    age: 30,
    department: "Engineering"
});
```

You can also insert typed records:

```ballerina
type User record {|
    string name;
    string email;
    int age;
    string department;
|};

User newUser = {
    name: "Bob Jones",
    email: "bob@example.com",
    age: 28,
    department: "Marketing"
};
check users->insertOne(newUser);
```

### insertMany()

Inserts multiple documents into a collection in a single batch.

```ballerina
check users->insertMany([
    {name: "Carol", email: "carol@example.com", age: 35, department: "Sales"},
    {name: "Dave", email: "dave@example.com", age: 42, department: "Engineering"},
    {name: "Eve", email: "eve@example.com", age: 29, department: "Marketing"}
]);
```

### find()

Queries documents from a collection, returning a stream.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `map<json>?` | Query filter (optional; returns all documents if omitted) |
| `findOptions` | `mongodb:FindOptions?` | Options such as sort, limit, projection |

```ballerina
// Find all documents
stream<record {}, error?> allUsers = check users->find();

// Find with a filter
stream<record {}, error?> engineers = check users->find({
    department: "Engineering"
});

// Find with options (sort, limit, projection)
stream<record {}, error?> topUsers = check users->find(
    {department: "Engineering"},
    {
        sort: {age: -1},
        'limit: 10,
        projection: {name: 1, email: 1, age: 1}
    }
);

check from var user in topUsers
    do {
        io:println(user);
    };
```

### findOne()

Returns a single document matching the filter.

```ballerina
record {}? user = check users->findOne({email: "alice@example.com"});
if user is record {} {
    io:println("Found user: ", user);
} else {
    io:println("User not found");
}
```

### countDocuments()

Returns the count of documents matching a filter.

```ballerina
int count = check users->countDocuments({department: "Engineering"});
io:println("Engineers: ", count);
```

### updateOne()

Updates a single document matching the filter.

**Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `filter` | `map<json>` | Query filter to match the document |
| `update` | `mongodb:Update` | Update operations to apply |

```ballerina
mongodb:UpdateResult result = check users->updateOne(
    {email: "alice@example.com"},
    {set: {department: "Management", age: 31}}
);
io:println("Modified count: ", result.modifiedCount);
```

### updateMany()

Updates multiple documents matching the filter.

```ballerina
mongodb:UpdateResult result = check users->updateMany(
    {department: "Sales"},
    {set: {status: "active"}}
);
io:println("Modified: ", result.modifiedCount);
```

### deleteOne()

Deletes a single document matching the filter.

```ballerina
mongodb:DeleteResult result = check users->deleteOne(
    {email: "alice@example.com"}
);
io:println("Deleted: ", result.deletedCount);
```

### deleteMany()

Deletes all documents matching the filter.

```ballerina
mongodb:DeleteResult result = check users->deleteMany(
    {status: "inactive"}
);
io:println("Deleted: ", result.deletedCount);
```

## Aggregation

### aggregate()

Executes an aggregation pipeline on the collection.

```ballerina
// Group employees by department and calculate average salary
stream<record {}, error?> results = check users->aggregate([
    {
        \`$match\`: {status: "active"}
    },
    {
        \`$group\`: {
            _id: "$department",
            avgAge: {\`$avg\`: "$age"},
            count: {\`$sum\`: 1}
        }
    },
    {
        \`$sort\`: {count: -1}
    }
]);

check from var result in results
    do {
        io:println(result);
    };
```

## Index Management

### createIndex()

Creates an index on the collection.

```ballerina
// Single field index
check users->createIndex({email: 1});

// Compound index
check users->createIndex({department: 1, age: -1});
```

## Error Handling

```ballerina
do {
    check users->insertOne({name: "Alice", email: "alice@example.com"});
} on fail error e {
    if e is mongodb:Error {
        io:println("MongoDB error: ", e.message());
    }
    io:println("Operation failed: ", e.message());
}
```

## Client Lifecycle

Close the client when the application shuts down:

```ballerina
mongoClient->close();
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
