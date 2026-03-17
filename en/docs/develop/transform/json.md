---
sidebar_position: 2
title: JSON Processing
description: Parse, construct, transform, and validate JSON data.
---

# JSON Processing

Work with JSON data -- the most common format in modern integrations. Ballerina treats `json` as a built-in union type (`()|boolean|int|float|decimal|string|json[]|map<json>`) with first-class language support for construction, access, and transformation.

## Creating JSON Values

Construct JSON directly using Ballerina literals. The `json` type accepts null, booleans, numbers, strings, arrays, and maps.

```ballerina
import ballerina/io;

public function main() {
    // Scalar values
    json name = "Acme Corp";
    json count = 42;
    json active = true;
    json empty = null;

    // JSON object
    json customer = {
        "id": 1001,
        "name": "Acme Corp",
        "active": true,
        "tags": ["enterprise", "priority"]
    };

    // Nested structures
    json order = {
        "orderId": "ORD-5001",
        "customer": customer,
        "items": [
            {"sku": "WDG-01", "qty": 5, "price": 29.99},
            {"sku": "GDG-02", "qty": 2, "price": 49.99}
        ]
    };

    io:println(order.toJsonString());
}
```

## Accessing JSON Values

Access JSON fields with field access or index notation. Since `json` is dynamically shaped, most access operations return `json` and may require type narrowing.

```ballerina
public function main() returns error? {
    json payload = {
        "order": {
            "id": "ORD-100",
            "customer": "Globex Inc",
            "items": [
                {"sku": "A1", "qty": 3},
                {"sku": "B2", "qty": 7}
            ]
        }
    };

    // Field access (returns json|error)
    json orderId = check payload.order.id;

    // Optional access -- returns () on missing keys instead of error
    json? notes = check payload.order?.notes;

    // Array element access
    json firstItem = check payload.order.items[0];

    // Type narrowing with check
    string customer = check payload.order.customer;
}
```

## Parsing JSON from Strings

Parse external JSON payloads received as strings, bytes, or streams using `value:fromJsonString()` or the `ballerina/data.jsondata` module.

```ballerina
import ballerina/io;

public function main() returns error? {
    string raw = string `{"name": "Widget", "price": 29.99, "inStock": true}`;

    // Parse into json value
    json parsed = check raw.fromJsonString();
    string name = check parsed.name;
    io:println(name); // Widget
}
```

## Type-Safe JSON with `ballerina/data.jsondata`

The `ballerina/data.jsondata` module provides type-safe conversion from JSON to Ballerina records. Define a record type matching your expected structure and parse directly into it.

```ballerina
import ballerina/data.jsondata;
import ballerina/io;

type Product record {|
    string name;
    decimal price;
    boolean inStock;
    string? category;
|};

public function main() returns error? {
    string jsonStr = string `{
        "name": "Widget",
        "price": 29.99,
        "inStock": true,
        "category": "hardware"
    }`;

    // Parse string directly into a typed record
    Product product = check jsondata:parseString(jsonStr);
    io:println(product.name);   // Widget
    io:println(product.price);  // 29.99
}
```

### Parsing JSON arrays

```ballerina
type OrderItem record {|
    string sku;
    int quantity;
    decimal unitPrice;
|};

public function main() returns error? {
    string itemsJson = string `[
        {"sku": "A1", "quantity": 3, "unitPrice": 10.00},
        {"sku": "B2", "quantity": 1, "unitPrice": 25.50}
    ]`;

    OrderItem[] items = check jsondata:parseString(itemsJson);
}
```

### Field name remapping

Use the `@jsondata:Name` annotation to map JSON keys that do not match Ballerina field naming conventions.

```ballerina
import ballerina/data.jsondata;

type ApiResponse record {|
    @jsondata:Name {value: "total_count"}
    int totalCount;
    @jsondata:Name {value: "next_page"}
    string? nextPage;
|};
```

## Common Transformations

Restructure JSON data by converting to records, transforming, and converting back.

```ballerina
import ballerina/data.jsondata;

type SourceContact record {|
    string first_name;
    string last_name;
    string email_address;
|};

type TargetContact record {|
    string fullName;
    string email;
|};

public function transform(json input) returns json|error {
    SourceContact src = check jsondata:parseAsType(input);
    TargetContact target = {
        fullName: src.first_name + " " + src.last_name,
        email: src.email_address
    };
    return target.toJson();
}
```

## Merging JSON Objects

Combine multiple JSON objects using the spread operator or map merge.

```ballerina
public function main() {
    map<json> defaults = {"timeout": 30, "retries": 3, "logLevel": "INFO"};
    map<json> overrides = {"timeout": 60, "logLevel": "DEBUG"};

    // Merge -- overrides take precedence
    map<json> config = {...defaults, ...overrides};
    // Result: {"timeout": 60, "retries": 3, "logLevel": "DEBUG"}
}
```

## Edge Cases

### Null handling

Use optional types and the Elvis operator to handle missing or null values.

```ballerina
public function main() returns error? {
    json payload = {"name": "Test", "description": null};

    // Optional access returns () for null
    json? desc = check payload?.description;

    // Elvis operator for defaults
    string description = desc is string ? desc : "No description provided";
}
```

### Large JSON payloads

For large payloads, use `jsondata:parseStream()` to process byte streams without loading the entire content into memory.

## What's Next

- [XML Processing](xml.md) -- Work with XML data
- [Type System & Records](type-system.md) -- Type-safe data handling
