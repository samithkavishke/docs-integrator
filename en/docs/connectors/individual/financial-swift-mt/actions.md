---
title: "SWIFT MT Messages - Actions"
description: "Available operations for the ballerinax/financial.swift.mt module."
---

# SWIFT MT Messages Actions

The `ballerinax/financial.swift.mt` module provides Ballerina record types and functions for parsing and generating SWIFT MT financial messages.

## Parsing Messages

```ballerina
import ballerinax/financial.swift.mt;

public function main() returns error? {
    string rawMessage = "..."; // Raw MT message
    
    // Parse the message into a typed Ballerina record
    // The module provides specific record types for each message type
    // e.g., MT103, MT202, MT940
}
```

## Generating Messages

```ballerina
import ballerinax/financial.swift.mt;

public function main() returns error? {
    // Create a typed message record
    // Serialize to SWIFT MT format
}
```

## Supported Message Types

### Common SWIFT MT Types

| MT Type | Description |
|---------|-------------|
| MT103 | Single Customer Credit Transfer |
| MT202 | General Financial Institution Transfer |
| MT940 | Customer Statement Message |
| MT950 | Statement Message |

For the full list, see the [API documentation](https://central.ballerina.io/ballerinax/financial.swift.mt/latest).

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
