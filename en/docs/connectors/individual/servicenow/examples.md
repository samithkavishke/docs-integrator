---
title: "ServiceNow - Examples"
description: "Code examples for the ballerinax/servicenow connector."
---

# ServiceNow Examples

## Example 1: Incident Management API

Expose a REST API for creating and managing ServiceNow incidents from external monitoring systems.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

final servicenow:Client snClient = check new ({
    baseUrl: instanceUrl,
    auth: { username, password }
});

type AlertInput record {|
    string summary;
    string description;
    string severity;
    string source;
    string? assignmentGroup;
|};

service /api/alerts on new http:Listener(8090) {

    resource function post incidents(AlertInput alert) returns http:Created|http:InternalServerError {
        do {
            string urgency = mapSeverityToUrgency(alert.severity);

            json incident = check snClient->createRecord("incident", {
                "short_description": alert.summary,
                "description": string `Source: ${alert.source}\n${alert.description}`,
                "urgency": urgency,
                "impact": urgency,
                "category": "software",
                "assignment_group": alert?.assignmentGroup ?: "IT Support"
            });

            string number = (check incident.number).toString();
            string sysId = (check incident.sys_id).toString();
            log:printInfo("Incident created", number = number);

            return <http:Created>{
                body: { number: number, sysId: sysId, message: "Incident created" }
            };
        } on fail error e {
            log:printError("Failed to create incident", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }

    resource function get incidents(string? state = "1") returns json|http:InternalServerError {
        do {
            json incidents = check snClient->getRecordList("incident",
                sysparmQuery = string `state=${state ?: "1"}`,
                sysparmFields = "number,short_description,priority,state,assigned_to,opened_at",
                sysparmLimit = 100
            );
            return incidents;
        } on fail error e {
            log:printError("Failed to list incidents", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}

function mapSeverityToUrgency(string severity) returns string {
    match severity {
        "critical" => { return "1"; }
        "high" => { return "2"; }
        "medium" => { return "3"; }
        _ => { return "3"; }
    }
}
```

## Example 2: CMDB Asset Synchronization

Synchronize server configuration items between an external asset database and ServiceNow CMDB.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

type ServerAsset record {|
    string hostname;
    string ipAddress;
    string os;
    int ramMB;
    int cpuCount;
    string environment;
|};

public function main() returns error? {
    servicenow:Client sn = check new ({
        baseUrl: instanceUrl,
        auth: { username, password }
    });

    // External asset inventory
    ServerAsset[] assets = [
        {hostname: "PROD-WEB-01", ipAddress: "10.0.1.10", os: "Ubuntu 22.04", ramMB: 16384, cpuCount: 8, environment: "Production"},
        {hostname: "PROD-WEB-02", ipAddress: "10.0.1.11", os: "Ubuntu 22.04", ramMB: 16384, cpuCount: 8, environment: "Production"},
        {hostname: "PROD-DB-01", ipAddress: "10.0.2.10", os: "RHEL 9", ramMB: 65536, cpuCount: 16, environment: "Production"},
        {hostname: "DEV-APP-01", ipAddress: "10.1.1.10", os: "Ubuntu 22.04", ramMB: 8192, cpuCount: 4, environment: "Development"}
    ];

    foreach ServerAsset asset in assets {
        // Check if CI already exists
        json existing = check sn->getRecordList("cmdb_ci_server",
            sysparmQuery = string `name=${asset.hostname}`,
            sysparmLimit = 1
        );

        json[] results = <json[]>(check existing.result);

        if results.length() > 0 {
            string sysId = (check results[0].sys_id).toString();
            _ = check sn->updateRecord("cmdb_ci_server", sysId, {
                "ip_address": asset.ipAddress,
                "os": asset.os,
                "ram": asset.ramMB.toString(),
                "cpu_count": asset.cpuCount.toString()
            });
            log:printInfo("Updated CI", hostname = asset.hostname);
        } else {
            _ = check sn->createRecord("cmdb_ci_server", {
                "name": asset.hostname,
                "ip_address": asset.ipAddress,
                "os": asset.os,
                "ram": asset.ramMB.toString(),
                "cpu_count": asset.cpuCount.toString(),
                "operational_status": "1",
                "environment": asset.environment
            });
            log:printInfo("Created CI", hostname = asset.hostname);
        }
    }

    io:println("CMDB synchronization complete");
}
```

## Example 3: Incident Escalation Automation

Automatically escalate high-priority incidents that have been open too long.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

public function main() returns error? {
    servicenow:Client sn = check new ({
        baseUrl: instanceUrl,
        auth: { username, password }
    });

    // Find P1 incidents open for more than 2 hours without assignment
    json unassignedP1 = check sn->getRecordList("incident",
        sysparmQuery = "priority=1^state=1^assigned_to=^opened_atRELATIVELT@hour@ago@2",
        sysparmFields = "number,short_description,priority,opened_at,assignment_group"
    );

    json[] incidents = <json[]>(check unassignedP1.result);
    io:println(string `Found ${incidents.length()} unassigned P1 incidents`);

    foreach json inc in incidents {
        string sysId = (check inc.sys_id).toString();
        string number = (check inc.number).toString();

        // Escalate the incident
        _ = check sn->updateRecord("incident", sysId, {
            "escalation": "1",
            "work_notes": "Auto-escalated: P1 incident unassigned for over 2 hours",
            "assignment_group": "Incident Management"
        });

        log:printWarn("Incident escalated", number = number);
    }

    io:println("Escalation check complete");
}
```

## Example 4: Change Request Workflow

Create change requests with approvals and track their lifecycle.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/servicenow;

configurable string instanceUrl = ?;
configurable string username = ?;
configurable string password = ?;

type DeploymentRequest record {|
    string applicationName;
    string version;
    string environment;
    string scheduledDate;
    string scheduledEndDate;
    string description;
|};

public function main() returns error? {
    servicenow:Client sn = check new ({
        baseUrl: instanceUrl,
        auth: { username, password }
    });

    DeploymentRequest deployment = {
        applicationName: "Order Management System",
        version: "3.2.1",
        environment: "Production",
        scheduledDate: "2024-04-01 02:00:00",
        scheduledEndDate: "2024-04-01 04:00:00",
        description: "Deploy OMS v3.2.1 with payment gateway updates and security patches"
    };

    // Create change request
    json changeReq = check sn->createRecord("change_request", {
        "short_description": string `Deploy ${deployment.applicationName} v${deployment.version}`,
        "description": deployment.description,
        "type": "standard",
        "risk": "moderate",
        "impact": "2",
        "start_date": deployment.scheduledDate,
        "end_date": deployment.scheduledEndDate,
        "assignment_group": "Release Management",
        "category": "Software"
    });

    string changeNumber = (check changeReq.number).toString();
    string changeSysId = (check changeReq.sys_id).toString();
    io:println("Change Request created: ", changeNumber);

    // Add a change task
    _ = check sn->createRecord("change_task", {
        "change_request": changeSysId,
        "short_description": "Run smoke tests after deployment",
        "assignment_group": "QA Team",
        "planned_start_date": "2024-04-01 03:30:00",
        "planned_end_date": "2024-04-01 04:00:00"
    });

    log:printInfo("Change request and tasks created", changeNumber = changeNumber);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
