---
title: "MongoDB - Examples"
description: "Code examples for the ballerinax/mongodb connector."
---

# MongoDB Examples

## Common Setup

```ballerina
import ballerina/io;
import ballerina/http;
import ballerinax/mongodb;

configurable string connectionString = ?;
configurable string databaseName = "myapp";
```

```toml
# Config.toml
connectionString = "mongodb://localhost:27017"
databaseName = "myapp"
```

## Example 1: CRUD Operations

```ballerina
type Product record {|
    string name;
    string category;
    decimal price;
    int stock;
    string[] tags;
|};

public function main() returns error? {
    mongodb:Client mongoClient = check new ({
        connection: connectionString
    });

    mongodb:Database db = check mongoClient->getDatabase(databaseName);
    mongodb:Collection products = check db->getCollection("products");

    // CREATE -- Insert a single product
    check products->insertOne({
        name: "Wireless Headphones",
        category: "Electronics",
        price: 79.99,
        stock: 150,
        tags: ["audio", "wireless", "bluetooth"]
    });

    // CREATE -- Insert multiple products
    check products->insertMany([
        {name: "USB-C Hub", category: "Electronics", price: 34.99, stock: 300,
         tags: ["accessories", "usb"]},
        {name: "Laptop Stand", category: "Accessories", price: 49.99, stock: 200,
         tags: ["ergonomic", "desk"]}
    ]);

    // READ -- Find all electronics
    stream<Product, error?> electronics = check products->find(
        {category: "Electronics"}
    );
    check from Product p in electronics
        do {
            io:println(string `${p.name}: $${p.price}`);
        };

    // READ -- Find one product by name
    record {}? headphones = check products->findOne(
        {name: "Wireless Headphones"}
    );
    io:println("Found: ", headphones);

    // UPDATE -- Update price
    mongodb:UpdateResult updateResult = check products->updateOne(
        {name: "Wireless Headphones"},
        {set: {price: 69.99, stock: 140}}
    );
    io:println("Modified: ", updateResult.modifiedCount);

    // DELETE -- Remove a product
    mongodb:DeleteResult deleteResult = check products->deleteOne(
        {name: "Laptop Stand"}
    );
    io:println("Deleted: ", deleteResult.deletedCount);

    mongoClient->close();
}
```

## Example 2: Aggregation Pipeline

```ballerina
function getSalesSummary(mongodb:Collection sales) returns error? {
    // Aggregate sales by category with totals
    stream<record {}, error?> results = check sales->aggregate([
        {
            \`$match\`: {
                status: "completed"
            }
        },
        {
            \`$group\`: {
                _id: "$category",
                totalRevenue: {\`$sum\`: "$amount"},
                orderCount: {\`$sum\`: 1},
                avgOrderValue: {\`$avg\`: "$amount"}
            }
        },
        {
            \`$sort\`: {totalRevenue: -1}
        },
        {
            \`$limit\`: 10
        }
    ]);

    check from var row in results
        do {
            io:println(row);
        };
}
```

## Example 3: REST API with MongoDB

```ballerina
type Movie record {|
    string title;
    int year;
    string genre;
    decimal rating;
    string? director;
|};

type MovieInput record {|
    string title;
    int year;
    string genre;
    decimal rating;
    string? director = ();
|};

final mongodb:Client mongoClient = check new ({
    connection: connectionString
});
final mongodb:Database db = check mongoClient->getDatabase(databaseName);
final mongodb:Collection movies = check db->getCollection("movies");

service /api on new http:Listener(8080) {

    resource function get movies(string? genre, int 'limit = 20)
            returns Movie[]|error {
        map<json>? filter = genre is string ? {genre: genre} : ();
        stream<Movie, error?> movieStream = check movies->find(
            filter,
            {sort: {rating: -1}, 'limit: 'limit}
        );
        return from Movie m in movieStream select m;
    }

    resource function get movies/[string title]()
            returns record {}|http:NotFound|error {
        record {}? movie = check movies->findOne({title: title});
        if movie is () {
            return http:NOT_FOUND;
        }
        return movie;
    }

    resource function post movies(MovieInput input) returns http:Created|error {
        check movies->insertOne(input);
        return http:CREATED;
    }

    resource function put movies/[string title](MovieInput input)
            returns record {|string message;|}|error {
        mongodb:UpdateResult result = check movies->updateOne(
            {title: title},
            {set: input}
        );
        return {message: string `Updated ${result.modifiedCount} document(s)`};
    }

    resource function delete movies/[string title]()
            returns http:NoContent|error {
        _ = check movies->deleteOne({title: title});
        return http:NO_CONTENT;
    }
}
```

## Example 4: Bulk Data Import

```ballerina
type CsvRecord record {|
    string name;
    string email;
    string department;
    string join_date;
|};

function importEmployees(mongodb:Collection employees,
                          CsvRecord[] records) returns error? {
    // Convert CSV records to MongoDB documents with additional fields
    map<json>[] documents = from var rec in records
        select {
            name: rec.name,
            email: rec.email,
            department: rec.department,
            joinDate: rec.join_date,
            status: "active",
            importedAt: "2024-01-15T10:00:00Z"
        };

    check employees->insertMany(documents);
    io:println(string `Imported ${documents.length()} employees`);
}
```

## Example 5: Index Management

```ballerina
function setupIndexes(mongodb:Collection users) returns error? {
    // Create a unique index on email
    check users->createIndex({email: 1});

    // Create a compound index for common queries
    check users->createIndex({department: 1, status: 1});

    // Create a text index for search
    check users->createIndex({name: "text", bio: "text"});

    io:println("Indexes created successfully");
}
```

## Example 6: MongoDB Atlas Connection

```ballerina
configurable string atlasConnectionString = ?;

public function main() returns error? {
    mongodb:Client atlasClient = check new ({
        connection: atlasConnectionString
    });

    mongodb:Database db = check atlasClient->getDatabase("production");
    mongodb:Collection orders = check db->getCollection("orders");

    int totalOrders = check orders->countDocuments({});
    io:println("Total orders in Atlas: ", totalOrders);

    atlasClient->close();
}
```

```toml
# Config.toml
atlasConnectionString = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
```

## Example 7: Error Handling

```ballerina
function safeInsert(mongodb:Collection collection,
                     map<json> document) returns error? {
    do {
        check collection->insertOne(document);
        io:println("Document inserted successfully");
    } on fail error e {
        if e is mongodb:Error {
            io:println("MongoDB error: ", e.message());
            // Check for duplicate key error
            if e.message().includes("E11000") {
                io:println("Duplicate document detected, skipping");
                return;
            }
        }
        return error("Failed to insert document", e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
