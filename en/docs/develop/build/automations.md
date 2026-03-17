---
sidebar_position: 3
title: Automations
description: Build scheduled and manually triggered integrations.
---

# Automations

Automations run without an external request. They are triggered by a schedule (cron or frequency) or executed manually. Common use cases include periodic data synchronization, report generation, and cleanup tasks.

## Scheduled Automations

### Frequency-Based Scheduling

Use `task:scheduleJobRecurByFrequency` to run a job at a fixed interval.

```ballerina
import ballerina/io;
import ballerina/lang.runtime;
import ballerina/task;

class SyncJob {
    *task:Job;

    public function execute() {
        error? result = syncData();
        if result is error {
            io:println("Sync failed: ", result.message());
        }
    }
}

public function main() returns error? {
    // Run the sync job every 60 seconds
    task:JobId jobId = check task:scheduleJobRecurByFrequency(new SyncJob(), 60);

    // Keep the process running
    runtime:sleep(86400);
    check task:unscheduleJob(jobId);
}
```

### Cron-Based Scheduling

Use a cron expression for more precise scheduling patterns.

```ballerina
import ballerina/task;
import ballerina/log;

class ReportJob {
    *task:Job;

    public function execute() {
        do {
            json report = check generateDailyReport();
            check sendReportEmail(report);
            log:printInfo("Daily report sent successfully");
        } on fail error e {
            log:printError("Report generation failed", 'error = e);
        }
    }
}

public function main() returns error? {
    // Run every weekday at 8:00 AM
    task:JobId jobId = check task:scheduleJobRecurByFrequency(
        new ReportJob(),
        3600,
        maxCount = 1  // Execute once per schedule trigger
    );
}
```

### Common Scheduling Patterns

| Pattern | Frequency | Description |
|---|---|---|
| Every 30 seconds | `30` | Polling or health checks |
| Every 5 minutes | `300` | Data synchronization |
| Every hour | `3600` | Aggregation tasks |
| Daily | `86400` | Report generation |

## Manual Trigger Automations

### Using the main() Function

The simplest automation is a `main()` function that runs once when executed.

```ballerina
import ballerina/log;
import ballerinax/mysql;

configurable string dbHost = "localhost";
configurable int dbPort = 3306;

public function main() returns error? {
    mysql:Client db = check new (host = dbHost, port = dbPort, database = "mydb");

    // Perform one-time data migration
    log:printInfo("Starting data migration...");
    int migrated = check migrateRecords(db);
    log:printInfo("Migration complete", recordCount = migrated);

    check db.close();
}
```

### API-Triggered Automation

Expose an automation behind an HTTP endpoint so it can be triggered on demand.

```ballerina
import ballerina/http;
import ballerina/task;
import ballerina/log;

task:JobId? activeJobId = ();

service /automation on new http:Listener(8090) {

    resource function post trigger(@http:Payload TriggerRequest req)
            returns http:Accepted|http:InternalServerError {
        do {
            check runAutomation(req.parameters);
            return <http:Accepted>{body: {message: "Automation started"}};
        } on fail error e {
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }

    resource function get status() returns json {
        return {running: activeJobId is task:JobId};
    }
}
```

## Working with Automations

### Execution Context and Parameters

Pass configuration and parameters through configurable variables or the trigger payload.

```ballerina
configurable string environment = "development";
configurable int batchSize = 100;
configurable string[] targetSystems = ["crm", "erp"];

public function main() returns error? {
    log:printInfo("Running automation",
        environment = environment,
        batchSize = batchSize
    );

    foreach string system in targetSystems {
        check syncSystem(system, batchSize);
    }
}
```

### Long-Running Considerations

For automations that process large datasets, use batching and checkpoint patterns.

```ballerina
function processBatch(int offset, int batchSize) returns int|error {
    record {}[] records = check fetchRecords(offset, batchSize);
    if records.length() == 0 {
        return 0;
    }

    foreach record {} rec in records {
        check processRecord(rec);
    }

    // Save checkpoint for restart recovery
    check saveCheckpoint(offset + records.length());
    return records.length();
}

public function main() returns error? {
    int offset = check loadCheckpoint();
    int batchSize = 500;

    while true {
        int processed = check processBatch(offset, batchSize);
        if processed == 0 {
            break;
        }
        offset += processed;
        log:printInfo("Progress", totalProcessed = offset);
    }
}
```

### Combining with Connectors

Automations commonly call APIs, databases, and messaging systems using Ballerina connectors.

```ballerina
import ballerinax/salesforce;
import ballerinax/mysql;
import ballerina/log;

configurable string sfToken = ?;

public function main() returns error? {
    salesforce:Client sf = check new ({auth: {token: sfToken}});
    mysql:Client db = check new (host = "localhost", database = "local_crm");

    // Fetch updated contacts from Salesforce
    salesforce:SoqlResult contacts = check sf->getQueryResult(
        "SELECT Id, Name, Email FROM Contact WHERE LastModifiedDate = TODAY"
    );

    // Upsert into local database
    foreach json contact in contacts.records {
        check db->execute(`INSERT INTO contacts (sf_id, name, email)
            VALUES (${contact.Id}, ${contact.Name}, ${contact.Email})
            ON DUPLICATE KEY UPDATE name = ${contact.Name}, email = ${contact.Email}`);
    }

    log:printInfo("Sync complete", count = contacts.totalSize);
    check db.close();
}
```

## What's Next

- [File Processing](file-processing.md) -- Process files on arrival
- [Configuration Management](configuration-management.md) -- Environment-specific config
