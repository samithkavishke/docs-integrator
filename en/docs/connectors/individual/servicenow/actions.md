---
title: "ServiceNow - Actions"
description: "Available actions and operations for the ballerinax/servicenow connector."
---

# ServiceNow Actions

The `ballerinax/servicenow` package provides a client to interact with ServiceNow through the Table API, enabling CRUD operations on any ServiceNow table.

## Client Initialization

```ballerina
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

servicenow:Client serviceNow = check new ({
    baseUrl: instanceUrl,
    auth: { username, password }
});
```

## Table Record Operations

### getRecordList

Retrieve multiple records from a ServiceNow table with optional filters.

```ballerina
// Get all open incidents
json incidents = check serviceNow->getRecordList("incident",
    sysparmQuery = "state=1^priority=1",
    sysparmLimit = 50,
    sysparmOffset = 0,
    sysparmFields = "number,short_description,priority,state,assigned_to"
);
```

### getRecordById

Retrieve a single record by sys_id.

```ballerina
json incident = check serviceNow->getRecordById("incident", "a1b2c3d4e5f6g7h8");
```

### createRecord

Create a new record in a ServiceNow table.

```ballerina
json newIncident = check serviceNow->createRecord("incident", {
    "short_description": "Server disk space critical",
    "description": "Production server DB-01 has reached 95% disk utilization",
    "urgency": "1",
    "impact": "1",
    "category": "hardware",
    "subcategory": "disk",
    "assignment_group": "IT Infrastructure",
    "caller_id": "admin"
});

string sysId = (check newIncident.sys_id).toString();
```

### updateRecord

Update an existing record by sys_id.

```ballerina
json updatedIncident = check serviceNow->updateRecord("incident", sysId, {
    "state": "2",
    "work_notes": "Investigating disk utilization. Running cleanup scripts.",
    "assigned_to": "john.doe"
});
```

### deleteRecord

Delete a record by sys_id.

```ballerina
check serviceNow->deleteRecord("incident", sysId);
```

## Incident-Specific Operations

### Create an Incident

```ballerina
json incident = check serviceNow->createRecord("incident", {
    "short_description": "Application login failure",
    "description": "Users unable to log in to the CRM application since 10:00 AM",
    "urgency": "2",
    "impact": "2",
    "category": "software",
    "subcategory": "login",
    "assignment_group": "Application Support"
});
```

### Resolve an Incident

```ballerina
json resolved = check serviceNow->updateRecord("incident", sysId, {
    "state": "6",
    "close_code": "Solved (Permanently)",
    "close_notes": "Root cause identified and fixed. Authentication service restarted."
});
```

## CMDB Operations

### Query Configuration Items

```ballerina
json servers = check serviceNow->getRecordList("cmdb_ci_server",
    sysparmQuery = "os_domain=Production",
    sysparmFields = "name,ip_address,os,ram,cpu_count,operational_status"
);
```

### Create a Configuration Item

```ballerina
json newCI = check serviceNow->createRecord("cmdb_ci_server", {
    "name": "PROD-WEB-03",
    "ip_address": "10.0.1.50",
    "os": "Linux",
    "ram": "16384",
    "cpu_count": "8",
    "operational_status": "1",
    "environment": "Production"
});
```

## Service Catalog Operations

### List Catalog Items

```ballerina
json catalogItems = check serviceNow->getRecordList("sc_cat_item",
    sysparmQuery = "active=true",
    sysparmFields = "name,short_description,category,price"
);
```

## Change Request Operations

### Create a Change Request

```ballerina
json changeReq = check serviceNow->createRecord("change_request", {
    "short_description": "Deploy v2.5 to production",
    "description": "Deploying application version 2.5 with security patches",
    "type": "standard",
    "risk": "moderate",
    "impact": "2",
    "start_date": "2024-03-20 02:00:00",
    "end_date": "2024-03-20 04:00:00",
    "assignment_group": "Release Management"
});
```

## Error Handling

```ballerina
do {
    json result = check serviceNow->createRecord("incident", {
        "short_description": "Test incident"
    });
    io:println("Created: ", result);
} on fail error e {
    io:println("ServiceNow error: ", e.message());
    log:printError("Operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/servicenow/latest#clients)
