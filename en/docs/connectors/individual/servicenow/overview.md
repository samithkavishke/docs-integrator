---
title: "ServiceNow"
description: "Overview of the ballerinax/servicenow connector for WSO2 Integrator."
---

# ServiceNow

| | |
|---|---|
| **Package** | [`ballerinax/servicenow`](https://central.ballerina.io/ballerinax/servicenow/latest) |
| **Version** | 1.5.1 |
| **Category** | CRM & Sales |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/servicenow/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/servicenow/latest#functions) |

## Overview

ServiceNow is an enterprise IT service management (ITSM) platform that provides cloud-based workflow automation for IT operations, customer service, and business processes. The `ballerinax/servicenow` connector enables WSO2 Integrator applications to interact with the ServiceNow Table API and other REST APIs, supporting incident management, CMDB operations, and custom table interactions.

The connector supports:

- **Table API** - Perform CRUD operations on any ServiceNow table
- **Incident Management** - Create, update, and query incidents
- **CMDB** - Access Configuration Management Database records
- **Service Catalog** - Interact with service catalog items and requests
- **Custom Tables** - Full support for custom application tables

## Key Capabilities

| Capability | Description |
|---|---|
| Table CRUD | Create, read, update, and delete records in any ServiceNow table |
| Query Builder | Filter records using encoded queries and sysparm parameters |
| Incident Lifecycle | Manage incidents from creation to resolution |
| CMDB Operations | Access and update configuration items |
| Attachment Support | Upload and retrieve file attachments on records |
| Pagination | Navigate through large result sets with offset and limit |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "servicenow"
version = "1.5.1"
```

```ballerina
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

servicenow:ConnectionConfig snConfig = {
    baseUrl: instanceUrl,
    auth: {
        username: username,
        password: password
    }
};

servicenow:Client serviceNow = check new (snConfig);
```

## Use Cases

| Use Case | Description |
|---|---|
| Incident Automation | Automatically create incidents from monitoring alerts |
| CMDB Sync | Synchronize configuration items with external asset databases |
| Change Management | Automate change request workflows |
| Service Catalog | Programmatically submit service catalog requests |
| Reporting | Extract incident and SLA data for external dashboards |

## Related Resources

- [Setup Guide](setup)
- [Actions Reference](actions)
- [Examples](examples)
- [ServiceNow Table API Documentation](https://developer.servicenow.com/dev.do#!/reference/api/latest/rest/c_TableAPI)
