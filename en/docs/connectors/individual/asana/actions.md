---
title: "Asana - Actions"
description: "Available actions and operations for the ballerinax/asana connector."
---

# Asana Actions

The `ballerinax/asana` package provides a REST client with resource methods that map to Asana REST API endpoints.

## Client Initialization

```ballerina
import ballerinax/asana;

configurable string token = ?;

asana:Client asana = check new ({
    auth: { token: token }
});
```

## Task Operations

### Create a Task

```ballerina
asana:Tasks_body taskBody = {
    data: {
        name: "Implement payment retry logic",
        notes: "Add exponential backoff for failed payment attempts",
        workspace: workspaceGid,
        projects: [projectGid],
        assignee: "user@example.com",
        due_on: "2024-04-15"
    }
};

asana:Inline_response_201 task = check asana->/tasks.post(taskBody);
```

### Get a Task

```ballerina
asana:Inline_response_201 task = check asana->/tasks/[taskGid]();
```

### Update a Task

```ballerina
asana:Inline_response_201 updated = check asana->/tasks/[taskGid].put({
    data: {
        name: "Updated task name",
        completed: true
    }
});
```

### Delete a Task

```ballerina
check asana->/tasks/[taskGid].delete();
```

### List Tasks in a Project

```ballerina
asana:Inline_response_200_17 tasks = check asana->/tasks(
    project = projectGid
);
```

### Create a Subtask

```ballerina
asana:Inline_response_201 subtask = check asana->/tasks/[parentTaskGid]/subtasks.post({
    data: {
        name: "Write unit tests",
        assignee: "dev@example.com"
    }
});
```

### Add a Comment to a Task

```ballerina
asana:Inline_response_201_3 story = check asana->/tasks/[taskGid]/stories.post({
    data: {
        text: "Started working on this task. ETA: 2 days."
    }
});
```

## Project Operations

### List Projects

```ballerina
asana:Inline_response_200_9 projects = check asana->/projects(
    workspace = workspaceGid
);
```

### Create a Project

```ballerina
asana:Projects_body projectBody = {
    data: {
        name: "Q2 Sprint 1",
        workspace: workspaceGid,
        notes: "Sprint covering April 1-14",
        default_view: "board"
    }
};

asana:Inline_response_201_1 project = check asana->/projects.post(projectBody);
```

### Get a Project

```ballerina
asana:Inline_response_201_1 project = check asana->/projects/[projectGid]();
```

### Add a Section to a Project

```ballerina
asana:Inline_response_201_2 section = check asana->/projects/[projectGid]/sections.post({
    data: {
        name: "In Progress"
    }
});
```

## Workspace Operations

### List Workspaces

```ballerina
asana:Inline_response_200_21 workspaces = check asana->/workspaces();
```

### Get Workspace Details

```ballerina
asana:Inline_response_200_22 workspace = check asana->/workspaces/[workspaceGid]();
```

## User Operations

### Get Current User

```ballerina
asana:Inline_response_200_20 me = check asana->/users/me();
```

### List Users in a Workspace

```ballerina
asana:Inline_response_200_19 users = check asana->/users(
    workspace = workspaceGid
);
```

## Search Operations

### Search Tasks in a Workspace

```ballerina
asana:Inline_response_200_17 results = check asana->/workspaces/[workspaceGid]/tasks/search(
    text = "payment",
    completed = false
);
```

## Error Handling

```ballerina
import ballerina/log;

do {
    asana:Inline_response_201 task = check asana->/tasks/[taskGid]();
    log:printInfo("Task: " + task.data.name);
} on fail error e {
    log:printError("Asana operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
