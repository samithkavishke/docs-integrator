---
title: "Pipedrive - Actions"
description: "Available actions and operations for the ballerinax/pipedrive connector."
---

# Pipedrive Actions

The `ballerinax/pipedrive` package provides operations for managing deals, persons, organizations, and activities in Pipedrive CRM.

## Client Initialization

```ballerina
import ballerinax/pipedrive;

configurable string apiToken = ?;

pipedrive:Client pipedrive = check new ({
    auth: { token: apiToken }
});
```

## Deal Operations

### addDeal

Create a new deal in the pipeline.

```ballerina
json newDeal = check pipedrive->addDeal({
    "title": "Enterprise License - Acme Corp",
    "value": 50000,
    "currency": "USD",
    "person_id": 123,
    "org_id": 456,
    "pipeline_id": 1,
    "stage_id": 1,
    "expected_close_date": "2024-06-30"
});
```

### getDeals

Retrieve all deals with optional filtering.

```ballerina
json deals = check pipedrive->getDeals(
    status = "open",
    'start = 0,
    'limit = 50
);
```

### getDeal

Get a specific deal by ID.

```ballerina
json deal = check pipedrive->getDeal(dealId);
```

### updateDeal

Update an existing deal.

```ballerina
json updated = check pipedrive->updateDeal(dealId, {
    "stage_id": 3,
    "value": 75000,
    "status": "open"
});
```

### deleteDeal

Delete a deal.

```ballerina
check pipedrive->deleteDeal(dealId);
```

## Person Operations

### addPerson

Create a new person (contact).

```ballerina
json person = check pipedrive->addPerson({
    "name": "Jane Smith",
    "email": ["jane.smith@example.com"],
    "phone": ["+1-555-0100"],
    "org_id": 456,
    "visible_to": 3
});
```

### getPersons

List all persons.

```ballerina
json persons = check pipedrive->getPersons('start = 0, 'limit = 100);
```

### updatePerson

Update a person's details.

```ballerina
json updated = check pipedrive->updatePerson(personId, {
    "name": "Jane Smith-Wilson",
    "phone": ["+1-555-0200"]
});
```

### searchPersons

Search persons by name, email, or phone.

```ballerina
json results = check pipedrive->searchPersons(term = "Jane", 'limit = 10);
```

## Organization Operations

### addOrganization

Create a new organization.

```ballerina
json org = check pipedrive->addOrganization({
    "name": "Acme Corporation",
    "address": "100 Main Street, San Francisco, CA"
});
```

### getOrganizations

List organizations.

```ballerina
json orgs = check pipedrive->getOrganizations('start = 0, 'limit = 50);
```

## Activity Operations

### addActivity

Create a new activity (call, meeting, task).

```ballerina
json activity = check pipedrive->addActivity({
    "subject": "Follow-up call with CTO",
    "type": "call",
    "deal_id": dealId,
    "person_id": personId,
    "due_date": "2024-03-20",
    "due_time": "14:00",
    "duration": "00:30",
    "note": "Discuss pricing and contract terms"
});
```

### getActivities

List activities with filters.

```ballerina
json activities = check pipedrive->getActivities(
    'type = "call",
    'start = 0,
    'limit = 50
);
```

### updateActivity

Update an activity.

```ballerina
json updated = check pipedrive->updateActivity(activityId, {
    "done": true,
    "note": "Call completed. Moving to proposal stage."
});
```

## Pipeline Operations

### getPipelines

List all sales pipelines.

```ballerina
json pipelines = check pipedrive->getPipelines();
```

### getStages

Get stages for a pipeline.

```ballerina
json stages = check pipedrive->getStages(pipelineId = 1);
```

## Error Handling

```ballerina
do {
    json deal = check pipedrive->addDeal({
        "title": "New Deal",
        "value": 10000
    });
    io:println("Deal created: ", deal);
} on fail error e {
    log:printError("Pipedrive operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
