---
title: "ISO 20022 - Actions"
description: "Available operations for the ballerinax/financial.iso20022 module."
---

# ISO 20022 Actions

The `ballerinax/financial.iso20022` module provides Ballerina record types and functions for parsing and generating ISO 20022 financial messages.

## Parsing Messages

```ballerina
import ballerinax/financial.iso20022;

public function main() returns error? {
    string rawMessage = "..."; // Raw ISO 20022 XML message
    
    // Parse the message into a typed Ballerina record
    // The module provides specific record types for each message type
    // e.g., pain.001, pacs.008, camt.053
}
```

## Generating Messages

```ballerina
import ballerinax/financial.iso20022;

public function main() returns error? {
    // Create a typed message record
    // Serialize to ISO 20022 XML format
}
```

## Supported Message Types

### Common ISO 20022 Types

| Message Type | Description |
|---------|-------------|
| pain.001 | Customer Credit Transfer Initiation |
| pacs.008 | FI to FI Customer Credit Transfer |
| camt.053 | Bank to Customer Statement |
| camt.054 | Bank to Customer Debit Credit Notification |

For the full list, see the [API documentation](https://central.ballerina.io/ballerinax/financial.iso20022/latest).

## Error Handling

```ballerina
do {
    // Parse or generate message
} on fail error e {
    log:printError("Message processing failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
