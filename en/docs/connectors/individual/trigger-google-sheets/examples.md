---
title: "Google Sheets Trigger - Examples"
description: "Complete code examples for the ballerinax/trigger.google.sheets connector."
---

# Google Sheets Trigger Examples

## Example 1: Log every new row appended to a spreadsheet

This example listens for row-append events and logs the new data. It demonstrates the minimum viable listener service.

```ballerina
import ballerina/log;
import ballerinax/trigger.google.sheets as sheets;

configurable sheets:ListenerConfig userInput = {
    spreadsheetId: "1rqmQttRXGYSYJheibCpVCYXBa4jmggrEXpcgH2ahk94"
};

listener sheets:Listener sheetListener = new (userInput);

service sheets:SheetRowService on sheetListener {

    remote function onAppendRow(sheets:GSheetEvent payload) returns error? {
        log:printInfo("New row appended",
            spreadsheetId = payload.spreadsheetId,
            worksheetName = payload.worksheetName,
            range = payload.rangeUpdated,
            newValues = payload.newValues.toString());
    }

    remote function onUpdateRow(sheets:GSheetEvent payload) returns error? {
        // Not handling updates in this example
    }
}
```

**Config.toml:**

```toml
[userInput]
spreadsheetId = "1rqmQttRXGYSYJheibCpVCYXBa4jmggrEXpcgH2ahk94"
```

## Example 2: Forward spreadsheet changes to a REST API

This example captures both append and update events, then forwards the change details to a downstream REST endpoint for further processing.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/trigger.google.sheets as sheets;

configurable sheets:ListenerConfig userInput = {
    spreadsheetId: "<SPREADSHEET_ID>"
};

configurable string downstreamUrl = ?;

listener sheets:Listener sheetListener = new (userInput);

final http:Client downstreamClient = check new (downstreamUrl);

service sheets:SheetRowService on sheetListener {

    remote function onAppendRow(sheets:GSheetEvent payload) returns error? {
        json notification = {
            eventType: "appendRow",
            spreadsheetId: payload.spreadsheetId,
            worksheet: payload.worksheetName,
            range: payload.rangeUpdated,
            values: payload.newValues
        };
        http:Response resp = check downstreamClient->post("/sheet-events", notification);
        log:printInfo("Forwarded append event",
            statusCode = resp.statusCode,
            range = payload.rangeUpdated);
    }

    remote function onUpdateRow(sheets:GSheetEvent payload) returns error? {
        json notification = {
            eventType: "updateRow",
            spreadsheetId: payload.spreadsheetId,
            worksheet: payload.worksheetName,
            range: payload.rangeUpdated,
            values: payload.newValues
        };
        http:Response resp = check downstreamClient->post("/sheet-events", notification);
        log:printInfo("Forwarded update event",
            statusCode = resp.statusCode,
            range = payload.rangeUpdated);
    }
}
```

**Config.toml:**

```toml
[userInput]
spreadsheetId = "<YOUR_SPREADSHEET_ID>"
downstreamUrl = "https://api.example.com"
```

## Example 3: Validate and filter row changes

This example demonstrates event filtering, where only rows from a specific worksheet are processed, and basic data validation is performed on the incoming values.

```ballerina
import ballerina/log;
import ballerinax/trigger.google.sheets as sheets;

configurable sheets:ListenerConfig userInput = {
    spreadsheetId: "<SPREADSHEET_ID>"
};

listener sheets:Listener sheetListener = new (userInput);

service sheets:SheetRowService on sheetListener {

    remote function onAppendRow(sheets:GSheetEvent payload) returns error? {
        // Only process rows from the "Orders" worksheet
        if payload.worksheetName != "Orders" {
            log:printInfo("Ignoring append on non-target sheet",
                worksheet = payload.worksheetName);
            return;
        }

        do {
            json values = payload.newValues;
            log:printInfo("Processing new order row",
                row = payload.startingRowPosition,
                values = values.toString());
        } on fail error e {
            log:printError("Validation failed for appended row",
                'error = e,
                range = payload.rangeUpdated);
        }
    }

    remote function onUpdateRow(sheets:GSheetEvent payload) returns error? {
        if payload.worksheetName != "Orders" {
            return;
        }

        log:printInfo("Order row updated",
            row = payload.startingRowPosition,
            range = payload.rangeUpdated);
    }
}
```

## Running the examples

1. Replace placeholder values in `Config.toml` with your actual spreadsheet ID.
2. Ensure the Google Apps Script trigger is configured as described in the [Setup Guide](setup).
3. If running locally, expose your service using ngrok:

   ```bash
   ngrok http 8090
   ```

4. Update the `BASE_URL` in your Google Apps Script with the ngrok forwarding URL.
5. Compile and run:

   ```bash
   bal run
   ```

6. Edit a cell or append a row in the target Google Sheet to see the events arrive.

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
