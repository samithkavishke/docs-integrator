---
title: "Google Sheets"
description: "Overview of the ballerinax/googleapis.sheets connector for WSO2 Integrator."
---

# Google Sheets

| | |
|---|---|
| **Package** | [`ballerinax/googleapis.sheets`](https://central.ballerina.io/ballerinax/googleapis.sheets/latest) |
| **Version** | 3.5.1 |
| **Category** | Cloud Services - Productivity |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/googleapis.sheets/3.5.1) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/googleapis.sheets/3.5.1#functions) |

## Overview

The `ballerinax/googleapis.sheets` connector provides programmatic access to the Google Sheets API v4 from WSO2 Integrator. Google Sheets is a cloud-based spreadsheet application that allows collaborative editing and data management. This connector enables you to create spreadsheets, read and write cell data, manage worksheets, and perform spreadsheet operations programmatically.

## Key Capabilities

- **Spreadsheet Management** -- Create, open, and rename spreadsheets
- **Sheet Operations** -- Add, remove, and rename worksheets within a spreadsheet
- **Cell Data** -- Read and write values to individual cells or ranges
- **Row Operations** -- Append, read, and delete rows of data
- **Column Operations** -- Add and read column data
- **Range Operations** -- Read and write rectangular ranges of cell data
- **Cell Formatting** -- Clear cell contents and ranges

## Use Cases

| Scenario | Description |
|---|---|
| Report Generation | Populate spreadsheets with automated reports from databases |
| Data Collection | Aggregate form submissions or API data into spreadsheets |
| Configuration Management | Read application configuration from shared spreadsheets |
| Inventory Tracking | Update inventory counts and status in real time |
| Data Export | Export integration results to spreadsheets for stakeholder review |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "googleapis.sheets"
version = "3.5.1"
```

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

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.3.0+ |
| Google Sheets API | v4 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure OAuth 2.0 and API access
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/googleapis.sheets/3.5.1)
- [Google Sheets API Documentation](https://developers.google.com/sheets/api)
