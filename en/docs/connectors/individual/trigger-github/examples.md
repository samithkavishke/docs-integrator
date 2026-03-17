---
title: "GitHub Trigger - Examples"
description: "Code examples for the ballerinax/trigger.github connector."
---

# GitHub Trigger Examples

## Example 1: CI/CD notification on push

```ballerina
import ballerina/log;
import ballerinax/trigger.github;

listener github:Listener webhookListener = new (listenOn = 8090);

service github:PushService on webhookListener {
    remote function onPush(github:PushEvent payload) returns error? {
        log:printInfo("New push detected",
            ref = payload.ref,
            pusher = payload.pusher.name,
            commitCount = payload.commits.length());

        foreach var commit in payload.commits {
            log:printInfo("Commit",
                id = commit.id,
                message = commit.message,
                author = commit.author.name);
        }
        // Trigger CI/CD pipeline
        check triggerBuild(payload.ref);
    }
}

function triggerBuild(string ref) returns error? {
    log:printInfo("Triggering build for ref: " + ref);
}
```

## Example 2: Issue tracking integration

```ballerina
import ballerina/log;
import ballerinax/trigger.github;

listener github:Listener webhookListener = new (listenOn = 8090);

service github:IssuesService on webhookListener {
    remote function onOpened(github:IssuesEvent payload) returns error? {
        log:printInfo("New issue",
            title = payload.issue.title,
            number = payload.issue.number,
            author = payload.issue.user.login);
        // Create ticket in external system
    }

    remote function onClosed(github:IssuesEvent payload) returns error? {
        log:printInfo("Issue closed", number = payload.issue.number);
        // Update external ticket status
    }

    remote function onLabeled(github:IssuesEvent payload) returns error? {
        log:printInfo("Issue labeled", number = payload.issue.number);
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

## Example 3: Pull request review workflow

```ballerina
import ballerina/log;
import ballerinax/trigger.github;

listener github:Listener webhookListener = new (listenOn = 8090);

service github:PullRequestService on webhookListener {
    remote function onOpened(github:PullRequestEvent payload) returns error? {
        log:printInfo("PR opened",
            title = payload.pull_request.title,
            author = payload.pull_request.user.login,
            base = payload.pull_request.base.ref);
    }

    remote function onClosed(github:PullRequestEvent payload) returns error? {
        if payload.pull_request.merged == true {
            log:printInfo("PR merged", title = payload.pull_request.title);
        }
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
        log:printInfo("Review requested",
            pr = payload.pull_request.title);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Triggers Reference](triggers)
