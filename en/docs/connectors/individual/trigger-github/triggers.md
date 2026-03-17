---
title: "GitHub Trigger - Triggers"
description: "Available triggers for the ballerinax/trigger.github connector."
---

# GitHub Trigger Events

The `ballerinax/trigger.github` module provides a webhook Listener with multiple service types for different event categories.

## Listener setup

```ballerina
import ballerinax/trigger.github;

listener github:Listener webhookListener = new (listenOn = 8090);
```

## Available service types and events

### PushService

```ballerina
service github:PushService on webhookListener {
    remote function onPush(github:PushEvent payload) returns error? {
        log:printInfo("Push", ref = payload.ref,
            commits = payload.commits.length());
    }
}
```

### IssuesService

```ballerina
service github:IssuesService on webhookListener {
    remote function onOpened(github:IssuesEvent payload) returns error? {
        log:printInfo("Issue opened", title = payload.issue.title);
    }
    remote function onClosed(github:IssuesEvent payload) returns error? {
        return;
    }
    remote function onLabeled(github:IssuesEvent payload) returns error? {
        return;
    }
    remote function onAssigned(github:IssuesEvent payload) returns error? {
        return;
    }
    remote function onUnassigned(github:IssuesEvent payload) returns error? {
        return;
    }
    remote function onUnlabeled(github:IssuesEvent payload) returns error? {
        return;
    }
    remote function onReopened(github:IssuesEvent payload) returns error? {
        return;
    }
}
```

### PullRequestService

```ballerina
service github:PullRequestService on webhookListener {
    remote function onOpened(github:PullRequestEvent payload) returns error? {
        log:printInfo("PR opened", title = payload.pull_request.title);
    }
    remote function onClosed(github:PullRequestEvent payload) returns error? {
        return;
    }
    remote function onReopened(github:PullRequestEvent payload) returns error? {
        return;
    }
    remote function onLabeled(github:PullRequestEvent payload) returns error? {
        return;
    }
    remote function onAssigned(github:PullRequestEvent payload) returns error? {
        return;
    }
    remote function onReviewRequested(github:PullRequestEvent payload) returns error? {
        return;
    }
}
```

### ReleaseService

```ballerina
service github:ReleaseService on webhookListener {
    remote function onPublished(github:ReleaseEvent payload) returns error? {
        log:printInfo("Release published", tag = payload.release.tag_name);
    }
}
```

## Event payload types

- `github:PushEvent` -- Repository, commits, ref, pusher
- `github:IssuesEvent` -- Issue details, action, assignees, labels
- `github:PullRequestEvent` -- PR details, action, review, head/base branches
- `github:ReleaseEvent` -- Release details, tag, assets

## Error handling

```ballerina
service github:PushService on webhookListener {
    remote function onPush(github:PushEvent payload) returns error? {
        do {
            check processPush(payload);
        } on fail error e {
            log:printError("Push processing failed", 'error = e);
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
