---
title: "Google Sheets Trigger - Triggers"
description: "Available trigger events and payload types for the ballerinax/trigger.google.sheets connector."
---

# Google Sheets Trigger - Available Events

The `ballerinax/trigger.google.sheets` listener reacts to spreadsheet edit events delivered via Google Apps Script installable triggers. When a user appends or updates a row in a Google Sheet, the Apps Script posts event data to your Ballerina service.

## Listener initialization

The listener accepts a `ListenerConfig` record that identifies the target spreadsheet. The listener starts an HTTP server on the specified port to receive callbacks from Google Apps Script.

```ballerina
import ballerinax/trigger.google.sheets as sheets;

configurable sheets:ListenerConfig userInput = {
    spreadsheetId: "<SPREADSHEET_ID>"
};

listener sheets:Listener sheetListener = new (userInput);
```

Provide the spreadsheet ID through `Config.toml`:

```toml
# Config.toml
[userInput]
spreadsheetId = "1rqmQttRXGYSYJheibCpVCYXBa4jmggrEXpcgH2ahk94"
```

You can also supply just the port number directly:

```ballerina
listener sheets:Listener sheetListener = new (listenOn = 8090);
```

## Service type: `SheetRowService`

Implement the `sheets:SheetRowService` to handle row-level spreadsheet events.

```ballerina
service sheets:SheetRowService on sheetListener {

    remote function onAppendRow(sheets:GSheetEvent payload) returns error? {
        // Triggered when a new row is appended
    }

    remote function onUpdateRow(sheets:GSheetEvent payload) returns error? {
        // Triggered when an existing row is updated
    }
}
```

## Event: `onAppendRow`

Fires when a new row is appended to the spreadsheet. This is detected by comparing the current last row with the previously recorded last row.

| Field | Type | Description |
|---|---|---|
| `spreadsheetId` | `string` | The unique identifier of the spreadsheet |
| `spreadsheetName` | `string` | The name of the spreadsheet |
| `worksheetId` | `int` | The numeric ID of the worksheet |
| `worksheetName` | `string` | The name of the worksheet tab |
| `rangeUpdated` | `string` | The A1 notation of the updated range (e.g., `A5:D5`) |
| `startingRowPosition` | `int` | Row number where the change started |
| `startingColumnPosition` | `int` | Column number where the change started |
| `endRowPosition` | `int` | Last row of the changed range |
| `endColumnPosition` | `int` | Last column of the changed range |
| `newValues` | `json` | A 2D array of the newly entered values |
| `lastRowWithContent` | `int` | The last row in the sheet that contains data |
| `lastColumnWithContent` | `int` | The last column in the sheet that contains data |
| `previousLastRow` | `int` | The last row count before this edit |
| `eventType` | `string` | Either `"appendRow"` or `"updateRow"` |
| `eventData` | `json?` | The raw Apps Script event object |

## Event: `onUpdateRow`

Fires when an existing row is modified (not a new append). The payload type is identical to `onAppendRow` -- the same `GSheetEvent` record is used.

```ballerina
remote function onUpdateRow(sheets:GSheetEvent payload) returns error? {
    string range = payload.rangeUpdated;
    string sheet = payload.worksheetName;
    log:printInfo("Row updated in sheet", worksheetName = sheet, range = range);
}
```

## `GSheetEvent` record

The full record definition for the event payload:

```ballerina
public type GSheetEvent record {
    string spreadsheetId;
    string spreadsheetName;
    int worksheetId;
    string worksheetName;
    string rangeUpdated;
    int startingRowPosition;
    int startingColumnPosition;
    int endRowPosition;
    int endColumnPosition;
    json newValues;
    int lastRowWithContent;
    int lastColumnWithContent;
    int previousLastRow;
    string eventType;
    json? eventData;
};
```

## Error handling

Both remote functions return `error?`. Use a `do`/`on fail` block for structured error handling:

```ballerina
remote function onAppendRow(sheets:GSheetEvent payload) returns error? {
    do {
        json values = payload.newValues;
        // Process the new row data
        log:printInfo("New row values", data = values.toString());
    } on fail error e {
        log:printError("Failed to process appended row", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
