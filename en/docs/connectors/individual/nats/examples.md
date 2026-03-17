---
title: "NATS - Examples"
description: "Code examples for the ballerinax/nats connector."
---

# NATS Examples

## Example 1: Pub/Sub event notification

### Publisher

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/nats;

final nats:Client natsClient = check new (nats:DEFAULT_URL);

service /api on new http:Listener(8080) {
    resource function post events(record {|string eventType; string data;|} event)
            returns http:Accepted|http:InternalServerError {
        do {
            check natsClient->publishMessage({
                content: event.toJsonString().toBytes(),
                subject: "events." + event.eventType
            });
            log:printInfo("Event published", eventType = event.eventType);
            return http:ACCEPTED;
        } on fail error e {
            log:printError("Publish failed", 'error = e);
            return http:INTERNAL_SERVER_ERROR;
        }
    }
}
```

### Subscriber

```ballerina
import ballerina/log;
import ballerinax/nats;

@nats:ServiceConfig {
    subject: "events.>"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onMessage(nats:AnydataMessage message) {
        string|error content = string:fromBytes(<byte[]>message.content);
        if content is string {
            log:printInfo("Event received",
                subject = message.subject,
                content = content);
        }
    }
}
```

## Example 2: Request-reply service

```ballerina
import ballerina/log;
import ballerinax/nats;

// Time service that responds to requests
@nats:ServiceConfig {
    subject: "services.time"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onRequest(nats:AnydataMessage message) returns string? {
        log:printInfo("Time request received");
        return "2024-06-15T10:30:00Z";
    }
}
```

### Client requesting time

```ballerina
import ballerina/log;
import ballerinax/nats;

public function main() returns error? {
    nats:Client client = check new (nats:DEFAULT_URL);

    nats:AnydataMessage reply = check client->requestMessage({
        content: "get-time".toBytes(),
        subject: "services.time"
    }, 5);

    string time = check string:fromBytes(<byte[]>reply.content);
    log:printInfo("Server time: " + time);
}
```

## Example 3: Queue group workers

Load-balance processing across multiple instances:

```ballerina
import ballerina/log;
import ballerinax/nats;

// Multiple instances share the "task-workers" queue group.
// Each message is delivered to exactly one worker.
@nats:ServiceConfig {
    subject: "tasks.process",
    queueGroup: "task-workers"
}
service nats:Service on new nats:Listener(nats:DEFAULT_URL) {
    remote function onMessage(nats:AnydataMessage message) {
        string|error content = string:fromBytes(<byte[]>message.content);
        if content is string {
            log:printInfo("Worker processing task", content = content);
        }
    }
}
```

## Example 4: Secure NATS connection

```ballerina
import ballerina/log;
import ballerinax/nats;

configurable string natsUrl = ?;
configurable string certPath = ?;
configurable string keyPath = ?;
configurable string certPassword = ?;
configurable string keyPassword = ?;

nats:SecureSocket secured = {
    cert: { path: certPath, password: certPassword },
    key: { path: keyPath, password: keyPassword }
};

public function main() returns error? {
    nats:Client secureClient = check new (natsUrl, secureSocket = secured);

    check secureClient->publishMessage({
        content: "Secure message".toBytes(),
        subject: "secure.topic"
    });

    log:printInfo("Secure message sent");
    check secureClient->close();
}
```

## Example 5: Config.toml

```toml
# Config.toml
natsUrl = "nats://nats-server:4222"
certPath = "/certs/truststore.p12"
keyPath = "/certs/keystore.p12"
certPassword = "changeit"
keyPassword = "changeit"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
