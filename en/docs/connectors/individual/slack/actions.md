---
title: "Slack - Actions"
description: "Available actions and operations for the ballerinax/slack connector."
---

# Slack Actions

The `ballerinax/slack` package provides a REST client with resource methods that map to Slack Web API methods.

## Client Initialization

```ballerina
import ballerinax/slack;

configurable string token = ?;

slack:Client slack = check new ({
    auth: { token }
});
```

## Messaging Operations

### Post a Message

```ballerina
slack:ChatPostMessageResponse response = check slack->/chat\.postMessage.post({
    channel: "general",
    text: "Hello from WSO2 Integrator!"
});
```

### Post a Rich Message with Blocks

```ballerina
slack:ChatPostMessageResponse response = check slack->/chat\.postMessage.post({
    channel: "engineering",
    text: "Deployment Complete",
    blocks: [
        {
            "type": "header",
            "text": { "type": "plain_text", "text": "Deployment Successful" }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Service:* order-api\n*Environment:* production\n*Version:* v2.1.0"
            }
        }
    ]
});
```

### Update a Message

```ballerina
slack:ChatUpdateResponse updated = check slack->/chat\.update.post({
    channel: channelId,
    ts: messageTimestamp,
    text: "Updated message content"
});
```

### Delete a Message

```ballerina
slack:ChatDeleteResponse deleted = check slack->/chat\.delete.post({
    channel: channelId,
    ts: messageTimestamp
});
```

### Reply in a Thread

```ballerina
slack:ChatPostMessageResponse reply = check slack->/chat\.postMessage.post({
    channel: channelId,
    text: "This is a threaded reply",
    thread_ts: parentMessageTs
});
```

### Schedule a Message

```ballerina
slack:ChatScheduleMessageResponse scheduled = check slack->/chat\.scheduleMessage.post({
    channel: "general",
    text: "Good morning team!",
    post_at: 1700000000
});
```

## Channel Operations

### List Channels

```ballerina
slack:ConversationsListResponse channels = check slack->/conversations\.list.get(
    types = "public_channel,private_channel"
);
```

### Create a Channel

```ballerina
slack:ConversationsCreateResponse newChannel = check slack->/conversations\.create.post({
    name: "incident-2024-001",
    is_private: true
});
```

### Invite Users to a Channel

```ballerina
slack:ConversationsInviteResponse invite = check slack->/conversations\.invite.post({
    channel: channelId,
    users: "U01ABC,U02DEF"
});
```

### Set Channel Topic

```ballerina
slack:ConversationsSetTopicResponse topic = check slack->/conversations\.setTopic.post({
    channel: channelId,
    topic: "Active incident - Payment gateway down"
});
```

### Archive a Channel

```ballerina
slack:ConversationsArchiveResponse archived = check slack->/conversations\.archive.post({
    channel: channelId
});
```

## User Operations

### List Users

```ballerina
slack:UsersListResponse users = check slack->/users\.list.get();
```

### Look Up User by Email

```ballerina
slack:UsersLookupByEmailResponse user = check slack->/users\.lookupByEmail.get(
    email = "john@example.com"
);
```

### Get User Info

```ballerina
slack:UsersInfoResponse userInfo = check slack->/users\.info.get(
    user = "U01ABCDEF"
);
```

## File Operations

### Upload a File

```ballerina
slack:FilesUploadResponse upload = check slack->/files\.upload.post({
    channels: "general",
    filename: "report.csv",
    title: "Monthly Report",
    content: csvContent
});
```

## Error Handling

All connector operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` to handle them:

```ballerina
import ballerina/log;

do {
    slack:ChatPostMessageResponse res = check slack->/chat\.postMessage.post({
        channel: "general",
        text: "Hello!"
    });
    log:printInfo("Message sent", ts = res.ts);
} on fail error e {
    log:printError("Slack operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
