---
title: "Slack - Examples"
description: "Code examples for the ballerinax/slack connector."
---

# Slack Examples

## Example 1: Send Alert Notifications

Post structured alert messages to an operations channel.

```ballerina
import ballerina/io;
import ballerinax/slack;

configurable string token = ?;

public function main() returns error? {
    slack:Client slack = check new ({
        auth: { token }
    });

    slack:ChatPostMessageResponse response = check slack->/chat\.postMessage.post({
        channel: "ops-alerts",
        text: "ALERT: High CPU usage detected on prod-server-01",
        blocks: [
            {
                "type": "header",
                "text": { "type": "plain_text", "text": "Production Alert" }
            },
            {
                "type": "section",
                "fields": [
                    { "type": "mrkdwn", "text": "*Severity:*\nHigh" },
                    { "type": "mrkdwn", "text": "*Server:*\nprod-server-01" },
                    { "type": "mrkdwn", "text": "*CPU Usage:*\n95%" },
                    { "type": "mrkdwn", "text": "*Time:*\n2024-03-15 14:30 UTC" }
                ]
            }
        ]
    });
    io:println("Alert sent: ", response.ts);
}
```

## Example 2: Incident Channel Management

Create a dedicated incident channel and invite responders.

```ballerina
import ballerina/io;
import ballerinax/slack;

configurable string token = ?;

public function main() returns error? {
    slack:Client slack = check new ({
        auth: { token }
    });

    // Create incident channel
    slack:ConversationsCreateResponse channel = check slack->/conversations\.create.post({
        name: "incident-payment-outage-2024",
        is_private: false
    });
    string channelId = channel.channel.id;
    io:println("Incident channel created: ", channelId);

    // Set the topic
    _ = check slack->/conversations\.setTopic.post({
        channel: channelId,
        topic: "Payment gateway outage - Incident Commander: @oncall-lead"
    });

    // Invite on-call team
    _ = check slack->/conversations\.invite.post({
        channel: channelId,
        users: "U01ONCALL,U02BACKEND,U03SRE"
    });

    // Post initial status
    _ = check slack->/chat\.postMessage.post({
        channel: channelId,
        text: "Incident channel created. Payment gateway is returning 503 errors. Investigation in progress."
    });
    io:println("Incident channel set up successfully");
}
```

## Example 3: Automated Daily Summary Report

Collect channel history and post a summary.

```ballerina
import ballerina/io;
import ballerinax/slack;

configurable string token = ?;

public function main() returns error? {
    slack:Client slack = check new ({
        auth: { token }
    });

    // Get conversation history for the standup channel
    slack:ConversationsHistoryResponse history = check slack->/conversations\.history.get(
        channel = "C01STANDUP",
        limit = 50
    );

    int messageCount = history.messages.length();

    // Post summary to management channel
    _ = check slack->/chat\.postMessage.post({
        channel: "management",
        text: string `Daily Standup Summary`,
        blocks: [
            {
                "type": "header",
                "text": { "type": "plain_text", "text": "Daily Standup Summary" }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": string `*Messages today:* ${messageCount}\n*Channel:* #standup`
                }
            }
        ]
    });
    io:println("Summary posted to management channel");
}
```

## Example 4: Notification Service

Build an HTTP service that forwards notifications to Slack.

```ballerina
import ballerina/http;
import ballerinax/slack;

configurable string token = ?;

final slack:Client slackClient = check new ({
    auth: { token }
});

type NotificationPayload record {|
    string channel;
    string message;
    string severity?;
|};

service /notify on new http:Listener(8080) {

    resource function post alert(@http:Payload NotificationPayload payload)
            returns http:Ok|error {
        string icon = payload.severity == "critical" ? "rotating_light" : "warning";

        _ = check slackClient->/chat\.postMessage.post({
            channel: payload.channel,
            text: string `:${icon}: ${payload.message}`
        });
        return http:OK;
    }
}
```

## Config.toml

```toml
# Config.toml
token = "<your-slack-oauth-token>"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
