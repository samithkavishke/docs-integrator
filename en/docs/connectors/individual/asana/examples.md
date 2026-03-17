---
title: "Asana - Examples"
description: "Code examples for the ballerinax/asana connector."
---

# Asana Examples

## Example 1: Create a Project with Tasks

Set up a new project with sections and initial tasks.

```ballerina
import ballerina/io;
import ballerinax/asana;

configurable string token = ?;
configurable string workspaceGid = ?;

public function main() returns error? {
    asana:Client asana = check new ({
        auth: { token: token }
    });

    // Create the project
    asana:Inline_response_201_1 project = check asana->/projects.post({
        data: {
            name: "Website Redesign",
            workspace: workspaceGid,
            notes: "Complete redesign of the company website",
            default_view: "board"
        }
    });
    string projectGid = project.data.gid;
    io:println("Project created: ", projectGid);

    // Add sections
    string[] sectionNames = ["Backlog", "In Progress", "Review", "Done"];
    foreach string name in sectionNames {
        _ = check asana->/projects/[projectGid]/sections.post({
            data: { name: name }
        });
    }
    io:println("Sections created");

    // Create initial tasks
    _ = check asana->/tasks.post({
        data: {
            name: "Design new homepage mockup",
            projects: [projectGid],
            assignee: "designer@company.com",
            due_on: "2024-04-20",
            notes: "Create responsive mockups for desktop and mobile"
        }
    });
    io:println("Initial tasks created");
}
```

## Example 2: GitHub Issue to Asana Task Sync

Create Asana tasks from incoming GitHub issue data.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/asana;

configurable string token = ?;
configurable string projectGid = ?;

final asana:Client asanaClient = check new ({
    auth: { token: token }
});

type GitHubIssue record {|
    string title;
    string body;
    string[] labels;
    string assignee?;
|};

service /webhook on new http:Listener(8080) {

    resource function post github(@http:Payload GitHubIssue issue) returns http:Ok|error {
        string labels = string:'join(", ", ...issue.labels);

        asana:Inline_response_201 task = check asanaClient->/tasks.post({
            data: {
                name: string `[GitHub] ${issue.title}`,
                notes: string `${issue.body}\n\nLabels: ${labels}`,
                projects: [projectGid]
            }
        });
        log:printInfo("Asana task created", gid = task.data.gid);
        return http:OK;
    }
}
```

## Example 3: Daily Task Report

Generate a summary of incomplete tasks for a project.

```ballerina
import ballerina/io;
import ballerinax/asana;

configurable string token = ?;
configurable string projectGid = ?;

public function main() returns error? {
    asana:Client asana = check new ({
        auth: { token: token }
    });

    // Get all incomplete tasks in the project
    asana:Inline_response_200_17 tasks = check asana->/tasks(
        project = projectGid,
        completed_since = "now"
    );

    io:println("=== Daily Task Report ===");
    io:println("Open tasks: ", tasks.data.length());

    foreach var task in tasks.data {
        asana:Inline_response_201 detail = check asana->/tasks/[task.gid]();
        string assignee = detail.data?.assignee?.name ?: "Unassigned";
        string dueDate = detail.data?.due_on ?: "No due date";
        io:println(string `  - ${detail.data.name} [${assignee}] Due: ${dueDate}`);
    }
}
```

## Example 4: Bulk Task Creation from CSV Data

Create multiple tasks from structured data.

```ballerina
import ballerina/io;
import ballerinax/asana;

configurable string token = ?;
configurable string projectGid = ?;

type TaskRecord record {|
    string name;
    string assignee;
    string dueDate;
    string notes;
|};

public function main() returns error? {
    asana:Client asana = check new ({
        auth: { token: token }
    });

    TaskRecord[] taskRecords = [
        { name: "Set up CI pipeline", assignee: "devops@company.com", dueDate: "2024-04-10", notes: "Configure GitHub Actions" },
        { name: "Write API documentation", assignee: "tech-writer@company.com", dueDate: "2024-04-12", notes: "Document REST endpoints" },
        { name: "Security audit", assignee: "security@company.com", dueDate: "2024-04-15", notes: "Run OWASP ZAP scan" }
    ];

    foreach TaskRecord rec in taskRecords {
        asana:Inline_response_201 task = check asana->/tasks.post({
            data: {
                name: rec.name,
                projects: [projectGid],
                assignee: rec.assignee,
                due_on: rec.dueDate,
                notes: rec.notes
            }
        });
        io:println("Created task: ", task.data.name);
    }
    io:println("All tasks created successfully");
}
```

## Config.toml

```toml
# Config.toml
token = "<your-asana-pat>"
workspaceGid = "<your-workspace-gid>"
projectGid = "<your-project-gid>"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
