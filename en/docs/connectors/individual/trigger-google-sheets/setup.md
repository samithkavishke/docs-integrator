---
title: "Google Sheets Trigger - Setup"
description: "How to set up and configure the ballerinax/trigger.google.sheets connector."
---

# Google Sheets Trigger Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Google account with access to Google Sheets
- A publicly accessible URL (use ngrok for development)

## Installation

```ballerina
import ballerinax/trigger.google.sheets as sheets;
```

```toml
[[dependency]]
org = "ballerinax"
name = "trigger.google.sheets"
version = "0.10.0"
```

## Google Apps Script setup

This trigger uses Google Apps Script installable triggers to detect spreadsheet changes.

### Step 1: Open your Google Sheet

1. Open the target spreadsheet
2. Navigate to **Extensions** > **Apps Script**

### Step 2: Add the trigger script

Replace the contents of `Code.gs` with the Apps Script that sends edit events to your Ballerina service endpoint. The script uses `UrlFetchApp.fetch()` to POST event data (spreadsheet ID, worksheet name, range, new values, event type) to your service URL.

### Step 3: Set up installable triggers

1. In the Apps Script editor, go to **Triggers** in the left menu
2. Click **Add Trigger**
3. Select `atEdit` function, `From spreadsheet`, `On edit`
4. Add another trigger: `atChange` function, `From spreadsheet`, `On change`
5. Authorize the script when prompted

### Step 4: Configure the callback URL

Replace the `BASE_URL` in the Apps Script with your public service URL (e.g., `https://your-domain.ngrok.io/`).

## Configuration

```ballerina
listener sheets:Listener sheetsListener = new (listenOn = 8090);
```

## Verify the setup

1. Run your Ballerina service: `bal run`
2. Edit a cell in the Google Sheet
3. Check your service logs for the event

## Next steps

- [Triggers Reference](triggers) -- Available event types
- [Examples](examples) -- Code examples
