---
title: "Jira - Actions"
description: "Available actions and operations for the ballerinax/jira connector."
---

# Jira Actions

The `ballerinax/jira` package provides a REST client with resource methods that map to Jira REST API v3 endpoints.

## Client Initialization

```ballerina
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

jira:Client jira = check new ({
    auth: { username, password: apiToken }
}, serviceUrl);
```

## Issue Operations

### Create an Issue

```ballerina
jira:CreatedIssue issue = check jira->/rest/api/'3/issue.post({
    fields: {
        project: { key: "PROJ" },
        summary: "Payment gateway timeout on large orders",
        description: {
            'type: "doc",
            version: 1,
            content: [
                {
                    'type: "paragraph",
                    content: [
                        { 'type: "text", text: "Orders over $500 trigger a timeout error in the payment service." }
                    ]
                }
            ]
        },
        issuetype: { name: "Bug" },
        priority: { name: "High" },
        assignee: { accountId: "5b10ac8d82e05b22cc7d4ef5" }
    }
});
```

### Get an Issue

```ballerina
jira:IssueBean issue = check jira->/rest/api/'3/issue/[issueIdOrKey]();
```

### Update an Issue

```ballerina
check jira->/rest/api/'3/issue/[issueIdOrKey].put({
    fields: {
        summary: "Updated summary",
        priority: { name: "Critical" }
    }
});
```

### Delete an Issue

```ballerina
check jira->/rest/api/'3/issue/[issueIdOrKey].delete();
```

### Search Issues with JQL

```ballerina
jira:SearchResults results = check jira->/rest/api/'3/search.get(
    jql = "project = PROJ AND status = 'In Progress' ORDER BY priority DESC",
    maxResults = 50
);
```

### Transition an Issue

```ballerina
// First, get available transitions
jira:Transitions transitions = check jira->/rest/api/'3/issue/[issueIdOrKey]/transitions();

// Then perform the transition
check jira->/rest/api/'3/issue/[issueIdOrKey]/transitions.post({
    transition: { id: "31" }
});
```

### Add a Comment

```ballerina
jira:Comment comment = check jira->/rest/api/'3/issue/[issueIdOrKey]/comment.post({
    body: {
        'type: "doc",
        version: 1,
        content: [
            {
                'type: "paragraph",
                content: [
                    { 'type: "text", text: "Fix deployed to staging. Ready for QA review." }
                ]
            }
        ]
    }
});
```

### Assign an Issue

```ballerina
check jira->/rest/api/'3/issue/[issueIdOrKey]/assignee.put({
    accountId: "5b10ac8d82e05b22cc7d4ef5"
});
```

## Project Operations

### List Projects

```ballerina
jira:PageBeanProject projects = check jira->/rest/api/'3/project();
```

### Get a Project

```ballerina
jira:Project project = check jira->/rest/api/'3/project/[projectIdOrKey]();
```

## User Operations

### Search Users

```ballerina
jira:User[] users = check jira->/rest/api/'3/user/search(
    query = "john"
);
```

### Get Current User

```ballerina
jira:User me = check jira->/rest/api/'3/myself();
```

## Error Handling

```ballerina
import ballerina/log;

do {
    jira:IssueBean issue = check jira->/rest/api/'3/issue/["PROJ-123"]();
    log:printInfo("Issue: " + issue.fields["summary"].toString());
} on fail error e {
    log:printError("Jira operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
