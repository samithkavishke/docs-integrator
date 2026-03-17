---
title: "Google Sheets - Examples"
description: "Code examples for the ballerinax/googleapis.sheets connector."
---

# Google Sheets Examples

## Example 1: Daily Sales Report Generator

Automatically populate a spreadsheet with daily sales data from an API.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/time;
import ballerinax/googleapis.sheets;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string spreadsheetId = ?;

final sheets:Client sheetsClient = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

type SaleRecord record {|
    string product;
    int quantity;
    decimal revenue;
    string region;
|};

service /reports on new http:Listener(8080) {

    resource function post daily(@http:Payload SaleRecord[] sales) returns json|error {
        time:Civil now = time:utcToCivil(time:utcNow());
        string sheetName = string `${now.year}-${now.month}-${now.day}`;

        // Create a new sheet for today
        do {
            _ = check sheetsClient->addSheet(spreadsheetId, sheetName);
        } on fail error e {
            log:printInfo("Sheet already exists, appending data");
        }

        // Set header row
        check sheetsClient->setRange(spreadsheetId, sheetName,
            [["Product", "Quantity", "Revenue", "Region"]], "A1");

        // Append each sale as a row
        foreach SaleRecord sale in sales {
            check sheetsClient->appendRow(spreadsheetId, sheetName,
                [sale.product, sale.quantity, sale.revenue, sale.region]);
        }

        log:printInfo("Sales report updated", date = sheetName, records = sales.length());
        return {status: "success", sheet: sheetName, records: sales.length()};
    }
}
```

```toml
# Config.toml
refreshToken = "<your-refresh-token>"
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
spreadsheetId = "<your-spreadsheet-id>"
```

## Example 2: Configuration Reader

Read application configuration values from a Google Sheet, enabling non-technical users to manage settings.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/googleapis.sheets;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string configSpreadsheetId = ?;

type AppConfig record {|
    string key;
    string value;
    string description;
|};

public function main() returns error? {
    sheets:Client sheetsClient = check new ({
        auth: {
            refreshToken: refreshToken,
            clientId: clientId,
            clientSecret: clientSecret
        }
    });

    // Read configuration from the "Settings" sheet
    sheets:Range range = check sheetsClient->getRange(
        configSpreadsheetId, "Settings", "A2:C100");

    map<string> configMap = {};
    foreach (string|int|float)[] row in range.values {
        if row.length() >= 2 {
            string key = row[0].toString();
            string value = row[1].toString();
            configMap[key] = value;
        }
    }

    io:println("Loaded configuration entries: ", configMap.length());
    io:println("API endpoint: ", configMap["api_endpoint"] ?: "not set");
    io:println("Max retries: ", configMap["max_retries"] ?: "3");
}
```

## Example 3: Inventory Tracker Service

An HTTP service that reads and updates inventory counts in a shared spreadsheet.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/googleapis.sheets;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string inventorySheetId = ?;

final sheets:Client sheetsClient = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

service /inventory on new http:Listener(8080) {

    // Get all inventory items
    resource function get items() returns json|error {
        sheets:Range range = check sheetsClient->getRange(
            inventorySheetId, "Inventory", "A1:E100");

        json[] items = [];
        (string|int|float)[][] values = range.values;

        if values.length() < 2 {
            return items;
        }

        // First row is headers
        foreach int i in 1 ..< values.length() {
            (string|int|float)[] row = values[i];
            if row.length() >= 4 {
                items.push({
                    sku: row[0].toString(),
                    name: row[1].toString(),
                    quantity: row[2],
                    price: row[3]
                });
            }
        }
        return items;
    }

    // Update stock for a specific item
    resource function put [string sku](int quantity) returns json|error {
        sheets:Range range = check sheetsClient->getRange(
            inventorySheetId, "Inventory", "A2:A100");

        int rowIndex = -1;
        foreach int i in 0 ..< range.values.length() {
            if range.values[i][0].toString() == sku {
                rowIndex = i + 2; // +2 for 1-based index and header row
                break;
            }
        }

        if rowIndex == -1 {
            return {status: "error", message: "SKU not found"};
        }

        string cell = string `C${rowIndex}`;
        check sheetsClient->setCell(inventorySheetId, "Inventory", cell, quantity);
        log:printInfo("Inventory updated", sku = sku, quantity = quantity);
        return {status: "updated", sku: sku, quantity: quantity};
    }
}
```

## Example 4: Spreadsheet Creation and Bulk Data Population

Create a new spreadsheet and populate it with structured data for reporting.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/googleapis.sheets;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

public function main() returns error? {
    sheets:Client sheetsClient = check new ({
        auth: {
            refreshToken: refreshToken,
            clientId: clientId,
            clientSecret: clientSecret
        }
    });

    // Create a new spreadsheet
    sheets:Spreadsheet spreadsheet = check sheetsClient->createSpreadsheet("Q1 Performance Report");
    string spreadsheetId = spreadsheet.spreadsheetId;
    io:println("Created spreadsheet: ", spreadsheetId);

    // Add department sheets
    string[] departments = ["Engineering", "Sales", "Marketing"];
    foreach string dept in departments {
        _ = check sheetsClient->addSheet(spreadsheetId, dept);

        // Set headers
        check sheetsClient->setRange(spreadsheetId, dept,
            [["Employee", "Target", "Actual", "Completion %"]], "A1");

        log:printInfo("Sheet created", department = dept);
    }

    // Populate Engineering data
    (string|int|float)[][] engData = [
        ["Alice", 100, 95, 95.0],
        ["Bob", 120, 118, 98.3],
        ["Charlie", 80, 82, 102.5]
    ];
    check sheetsClient->setRange(spreadsheetId, "Engineering", engData, "A2");

    io:println("Report spreadsheet populated successfully");
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
