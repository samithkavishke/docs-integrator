---
title: "Pipedrive - Examples"
description: "Code examples for the ballerinax/pipedrive connector."
---

# Pipedrive Examples

## Example 1: Sales Pipeline Dashboard API

Expose pipeline metrics for external dashboard consumption.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/pipedrive;

configurable string apiToken = ?;

final pipedrive:Client pdClient = check new ({
    auth: { token: apiToken }
});

service /api/pipeline on new http:Listener(8090) {

    resource function get summary() returns json|http:InternalServerError {
        do {
            json deals = check pdClient->getDeals(status = "open");
            json[] dealList = <json[]>(check deals.data);

            decimal totalValue = 0;
            int dealCount = dealList.length();

            foreach json deal in dealList {
                decimal value = check deal.value;
                totalValue += value;
            }

            return {
                totalOpenDeals: dealCount,
                totalPipelineValue: totalValue,
                averageDealValue: dealCount > 0 ? totalValue / <decimal>dealCount : 0
            };
        } on fail error e {
            log:printError("Failed to get pipeline summary", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }

    resource function get deals(string? status = "open") returns json|http:InternalServerError {
        do {
            json deals = check pdClient->getDeals(status = status ?: "open", 'limit = 100);
            return deals;
        } on fail error e {
            log:printError("Failed to get deals", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}
```

## Example 2: Lead-to-Deal Automation

Automatically create deals and activities from inbound leads.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/pipedrive;

configurable string apiToken = ?;

final pipedrive:Client pdClient = check new ({
    auth: { token: apiToken }
});

type LeadInput record {|
    string contactName;
    string email;
    string company;
    string dealTitle;
    decimal estimatedValue;
    string? phone;
    string? notes;
|};

service /api/leads on new http:Listener(8090) {

    resource function post .(LeadInput lead) returns http:Created|http:InternalServerError {
        do {
            // Create organization
            json org = check pdClient->addOrganization({
                "name": lead.company
            });
            int orgId = check org.data.id;

            // Create person linked to organization
            json person = check pdClient->addPerson({
                "name": lead.contactName,
                "email": [lead.email],
                "phone": lead?.phone is string ? [<string>lead?.phone] : [],
                "org_id": orgId
            });
            int personId = check person.data.id;

            // Create deal linked to person and organization
            json deal = check pdClient->addDeal({
                "title": lead.dealTitle,
                "value": lead.estimatedValue,
                "currency": "USD",
                "person_id": personId,
                "org_id": orgId,
                "pipeline_id": 1,
                "stage_id": 1
            });
            int dealId = check deal.data.id;

            // Schedule a follow-up activity
            _ = check pdClient->addActivity({
                "subject": string `Initial call with ${lead.contactName}`,
                "type": "call",
                "deal_id": dealId,
                "person_id": personId,
                "due_date": "2024-03-22",
                "due_time": "10:00",
                "duration": "00:30",
                "note": lead?.notes ?: "Initial discovery call"
            });

            log:printInfo("Lead processed", dealId = dealId, personId = personId);
            return <http:Created>{
                body: { dealId: dealId, personId: personId, orgId: orgId }
            };
        } on fail error e {
            log:printError("Lead processing failed", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}
```

## Example 3: Deal Stage Progression Report

Generate a report of deal movements across pipeline stages.

```ballerina
import ballerina/io;
import ballerinax/pipedrive;

configurable string apiToken = ?;

public function main() returns error? {
    pipedrive:Client pd = check new ({
        auth: { token: apiToken }
    });

    // Get all pipeline stages
    json stages = check pd->getStages(pipelineId = 1);
    json[] stageList = <json[]>(check stages.data);

    io:println("=== Pipeline Stage Report ===");
    io:println("");

    foreach json stage in stageList {
        string stageName = (check stage.name).toString();
        int stageId = check stage.id;

        json deals = check pd->getDeals(
            status = "open",
            stageId = stageId,
            'limit = 500
        );

        json[] dealList = <json[]>(check deals.data);
        decimal totalValue = 0;
        foreach json deal in dealList {
            totalValue += check deal.value;
        }

        io:println(string `Stage: ${stageName}`);
        io:println(string `  Deals: ${dealList.length()}`);
        io:println(string `  Total Value: $${totalValue}`);
        io:println("");
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
