---
title: "Google Sheets - Actions"
description: "Available actions and operations for the ballerinax/googleapis.sheets connector."
---

# Google Sheets Actions

The `ballerinax/googleapis.sheets` package provides a client with operations to create, read, write, and manage Google Sheets spreadsheets.

## Client Initialization

```ballerina
import ballerinax/googleapis.sheets;

configurable string refreshToken = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

sheets:Client sheetsClient = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});
```

## Spreadsheet Operations

### Create Spreadsheet

Create a new spreadsheet.

```ballerina
sheets:Spreadsheet spreadsheet = check sheetsClient->createSpreadsheet("Sales Report Q1");
string spreadsheetId = spreadsheet.spreadsheetId;
```

### Open Spreadsheet by ID

Open an existing spreadsheet by its ID.

```ballerina
sheets:Spreadsheet spreadsheet = check sheetsClient->openSpreadsheetById("1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms");
```

### Open Spreadsheet by URL

Open an existing spreadsheet by its full URL.

```ballerina
sheets:Spreadsheet spreadsheet = check sheetsClient->openSpreadsheetByUrl(
    "https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms/edit"
);
```

### Rename Spreadsheet

Rename an existing spreadsheet.

```ballerina
check sheetsClient->renameSpreadsheet("1BxiMVs0XRA...", "Updated Sales Report");
```

## Sheet (Worksheet) Operations

### Add Sheet

Add a new worksheet to a spreadsheet.

```ballerina
sheets:Sheet sheet = check sheetsClient->addSheet("1BxiMVs0XRA...", "January");
```

### Get Sheet by Name

Retrieve a specific worksheet by its name.

```ballerina
sheets:Sheet sheet = check sheetsClient->getSheetByName("1BxiMVs0XRA...", "January");
```

### Remove Sheet

Remove a worksheet from a spreadsheet.

```ballerina
check sheetsClient->removeSheet("1BxiMVs0XRA...", sheetId);
```

### Rename Sheet

Rename an existing worksheet.

```ballerina
check sheetsClient->renameSheet("1BxiMVs0XRA...", "Sheet1", "Overview");
```

## Cell Operations

### Set Cell Value

Write a value to a specific cell.

```ballerina
check sheetsClient->setCell("1BxiMVs0XRA...", "Sheet1", "A1", "Revenue");
```

### Get Cell Value

Read the value from a specific cell.

```ballerina
sheets:Cell cell = check sheetsClient->getCell("1BxiMVs0XRA...", "Sheet1", "A1");
string|int|float value = cell.value;
```

### Clear Cell

Clear the contents of a specific cell.

```ballerina
check sheetsClient->clearCell("1BxiMVs0XRA...", "Sheet1", "A1");
```

## Row Operations

### Append Row

Append a row of data at the end of a sheet.

```ballerina
check sheetsClient->appendRow("1BxiMVs0XRA...", "Sheet1",
    ["Widget A", 150, 29.99, "In Stock"]);
```

### Get Row

Read a specific row by its row number.

```ballerina
sheets:Row row = check sheetsClient->getRow("1BxiMVs0XRA...", "Sheet1", 1);
```

### Delete Rows

Delete one or more rows from a sheet.

```ballerina
check sheetsClient->deleteRows("1BxiMVs0XRA...", sheetId, startIndex = 5, count = 3);
```

## Column Operations

### Append Column

Append a column of data to the next available column.

```ballerina
check sheetsClient->appendColumn("1BxiMVs0XRA...", "Sheet1",
    ["Header", "Value1", "Value2", "Value3"]);
```

### Get Column

Read values from a specific column by letter.

```ballerina
sheets:Column column = check sheetsClient->getColumn("1BxiMVs0XRA...", "Sheet1", "A");
```

## Range Operations

### Set Range

Write values to a rectangular range.

```ballerina
(string|int|float)[][] data = [
    ["Product", "Quantity", "Price"],
    ["Widget A", 150, 29.99],
    ["Widget B", 200, 49.99],
    ["Widget C", 75, 19.99]
];
check sheetsClient->setRange("1BxiMVs0XRA...", "Sheet1", data, "A1");
```

### Get Range

Read values from a rectangular range.

```ballerina
sheets:Range range = check sheetsClient->getRange("1BxiMVs0XRA...", "Sheet1", "A1:D10");
(string|int|float)[][] values = range.values;
```

### Clear Range

Clear all values in a range.

```ballerina
check sheetsClient->clearRange("1BxiMVs0XRA...", "Sheet1", "A1:D10");
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` for localized handling:

```ballerina
import ballerina/log;

do {
    sheets:Cell cell = check sheetsClient->getCell("spreadsheetId", "Sheet1", "A1");
    log:printInfo("Cell value retrieved", value = cell.value);
} on fail error e {
    log:printError("Failed to read cell", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Reference on Ballerina Central](https://central.ballerina.io/ballerinax/googleapis.sheets/3.5.1)
