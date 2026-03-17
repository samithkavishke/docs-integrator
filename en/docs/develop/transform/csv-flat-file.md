---
sidebar_position: 4
title: CSV & Flat File Processing
description: Parse, transform, and write CSV and flat file data.
---

# CSV & Flat File Processing

Handle tabular data formats -- CSV, TSV, and fixed-width files. The `ballerina/data.csv` module provides type-safe parsing, transformation, and serialization for comma-separated and delimited data.

## Reading CSV into Records

Parse CSV content directly into typed Ballerina records using `csv:parseString()`. Define a record type whose fields match the CSV column headers.

```ballerina
import ballerina/data.csv;
import ballerina/io;

type Employee record {|
    string name;
    string department;
    decimal salary;
    int yearsOfService;
|};

public function main() returns error? {
    string csvData = string `name,department,salary,yearsOfService
Alice,Engineering,95000.00,5
Bob,Sales,72000.00,3
Carol,Engineering,110000.00,8`;

    Employee[] employees = check csv:parseString(csvData);

    foreach Employee emp in employees {
        io:println(string `${emp.name} (${emp.department}): $${emp.salary}`);
    }
}
```

## Reading CSV from Files and Streams

Use `csv:parseBytes()` for byte arrays or `csv:parseStream()` for streaming large files without loading them entirely into memory.

```ballerina
import ballerina/data.csv;
import ballerina/io;

type Transaction record {|
    string date;
    string description;
    decimal amount;
    string category;
|};

public function main() returns error? {
    // Read from file as bytes
    byte[] content = check io:fileReadBytes("transactions.csv");
    Transaction[] transactions = check csv:parseBytes(content);

    // Or stream large files for memory efficiency
    stream<byte[], io:Error?> byteStream = check io:fileReadBlocksAsStream("large-data.csv");
    Transaction[] streamed = check csv:parseStream(byteStream);
}
```

## Selective Column Projection

Use closed record types to select only the columns you need. Columns not represented in the target record are automatically skipped.

```ballerina
import ballerina/data.csv;

// Only extract name and salary from a CSV with many columns
type EmployeeSummary record {|
    string name;
    decimal salary;
|};

public function main() returns error? {
    string csvData = string `name,department,salary,yearsOfService,location
Alice,Engineering,95000.00,5,Seattle
Bob,Sales,72000.00,3,New York`;

    // Only name and salary are extracted
    EmployeeSummary[] summaries = check csv:parseString(csvData);
}
```

## Custom Delimiters and Options

Configure parsing behavior for TSV, pipe-delimited, or other non-standard formats.

```ballerina
import ballerina/data.csv;

type LogEntry record {|
    string timestamp;
    string level;
    string message;
|};

public function main() returns error? {
    // Tab-separated values
    string tsvData = string `timestamp	level	message
2025-03-15T10:00:00Z	INFO	Service started
2025-03-15T10:01:23Z	ERROR	Connection refused`;

    LogEntry[] logs = check csv:parseString(tsvData, {delimiter: "\t"});
}
```

## Headerless CSV

Parse CSV files that have no header row by specifying `headerRows: 0` and using array-based output or mapping by position.

```ballerina
import ballerina/data.csv;

public function main() returns error? {
    string csvData = string `Alice,Engineering,95000
Bob,Sales,72000`;

    // Parse into arrays of strings
    string[][] rows = check csv:parseString(csvData, {headerRows: 0});
}
```

## Writing CSV Output

Convert record arrays to CSV strings using `csv:transform()` and write them to files.

```ballerina
import ballerina/data.csv;
import ballerina/io;

type Product record {|
    string sku;
    string name;
    decimal price;
    int stock;
|};

public function main() returns error? {
    Product[] products = [
        {sku: "WDG-01", name: "Widget", price: 29.99, stock: 150},
        {sku: "GDG-02", name: "Gadget", price: 49.99, stock: 42},
        {sku: "GZM-03", name: "Gizmo", price: 19.99, stock: 0}
    ];

    // Convert records to string arrays for CSV output
    string[][] rows = check csv:transform(products);

    // Write with header
    string csvOutput = "sku,name,price,stock\n";
    foreach string[] row in rows {
        csvOutput += string:'join(",", ...row) + "\n";
    }
    check io:fileWriteString("products.csv", csvOutput);
}
```

## Transforming Between Record Types

Use `csv:transform()` to reshape CSV data from one record type to another.

```ballerina
import ballerina/data.csv;
import ballerina/io;

type RawOrder record {|
    string order_id;
    string customer_name;
    string item_sku;
    string quantity;
    string unit_price;
|};

type ProcessedOrder record {|
    string orderId;
    string customer;
    decimal total;
|};

public function main() returns error? {
    string csvData = string `order_id,customer_name,item_sku,quantity,unit_price
ORD-001,Acme Corp,WDG-01,5,29.99
ORD-002,Globex Inc,GDG-02,2,49.99`;

    RawOrder[] raw = check csv:parseString(csvData);

    // Transform to a different record type
    ProcessedOrder[] processed = from RawOrder r in raw
        let int qty = check int:fromString(r.quantity)
        let decimal price = check decimal:fromString(r.unit_price)
        select {
            orderId: r.order_id,
            customer: r.customer_name,
            total: <decimal>qty * price
        };

    foreach ProcessedOrder ord in processed {
        io:println(string `${ord.orderId}: ${ord.customer} - $${ord.total}`);
    }
}
```

## Edge Cases

### Quoted fields and special characters

The `ballerina/data.csv` module handles RFC 4180 compliant CSV by default, including quoted fields with commas, newlines, and escaped quotes.

### Encoding

Specify byte encoding when reading files with non-UTF-8 content by converting to byte arrays before parsing.

### Large files

Use `csv:parseStream()` or `csv:parseToStream()` for memory-efficient processing of large CSV files. The stream-based API processes records incrementally without loading the entire file.

## What's Next

- [EDI Processing](edi.md) -- Enterprise data interchange formats
