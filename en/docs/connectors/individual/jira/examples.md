---
title: "Jira - Examples"
description: "Code examples for the ballerinax/jira connector."
---

# Jira Examples

## Example 1: Create a Bug from Monitoring Alert

Automatically create Jira bugs from system monitoring alerts.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

final jira:Client jiraClient = check new ({
    auth: { username, password: apiToken }
}, serviceUrl);

type MonitoringAlert record {|
    string service;
    string severity;
    string message;
    string timestamp;
|};

service /webhook on new http:Listener(8080) {

    resource function post alert(@http:Payload MonitoringAlert alert) returns http:Ok|error {
        jira:CreatedIssue issue = check jiraClient->/rest/api/'3/issue.post({
            fields: {
                project: { key: "OPS" },
                summary: string `[${alert.severity}] ${alert.service}: ${alert.message}`,
                description: {
                    'type: "doc",
                    version: 1,
                    content: [
                        {
                            'type: "paragraph",
                            content: [
                                { 'type: "text", text: string `Alert from ${alert.service} at ${alert.timestamp}. Details: ${alert.message}` }
                            ]
                        }
                    ]
                },
                issuetype: { name: "Bug" },
                priority: { name: alert.severity == "critical" ? "Highest" : "High" }
            }
        });
        log:printInfo("Jira issue created", key = issue.key);
        return http:OK;
    }
}
```

## Example 2: Sprint Status Report

Generate a sprint progress report using JQL queries.

```ballerina
import ballerina/io;
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;
configurable string projectKey = ?;

public function main() returns error? {
    jira:Client jira = check new ({
        auth: { username, password: apiToken }
    }, serviceUrl);

    // Get issues by status
    string[] statuses = ["To Do", "In Progress", "In Review", "Done"];

    io:println("=== Sprint Status Report ===");
    io:println("Project: ", projectKey);

    foreach string status in statuses {
        string jql = string `project = ${projectKey} AND status = '${status}' AND sprint in openSprints()`;
        jira:SearchResults results = check jira->/rest/api/'3/search.get(
            jql = jql,
            maxResults = 100
        );
        io:println(string `${status}: ${results.total ?: 0} issues`);
    }
}
```

## Example 3: Bulk Issue Creation

Create multiple issues from structured data for a new sprint.

```ballerina
import ballerina/io;
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

type SprintTask record {|
    string summary;
    string issueType;
    string priority;
    string assigneeId;
|};

public function main() returns error? {
    jira:Client jira = check new ({
        auth: { username, password: apiToken }
    }, serviceUrl);

    SprintTask[] tasks = [
        { summary: "Set up staging environment", issueType: "Task", priority: "High", assigneeId: "acc123" },
        { summary: "Implement order validation", issueType: "Story", priority: "High", assigneeId: "acc456" },
        { summary: "Write API documentation", issueType: "Task", priority: "Medium", assigneeId: "acc789" }
    ];

    foreach SprintTask task in tasks {
        jira:CreatedIssue issue = check jira->/rest/api/'3/issue.post({
            fields: {
                project: { key: "PROJ" },
                summary: task.summary,
                issuetype: { name: task.issueType },
                priority: { name: task.priority },
                assignee: { accountId: task.assigneeId }
            }
        });
        io:println("Created: ", issue.key, " - ", task.summary);
    }
}
```

## Example 4: Issue Dashboard Service

Expose Jira data through an HTTP API for dashboards.

```ballerina
import ballerina/http;
import ballerinax/jira;

configurable string username = ?;
configurable string apiToken = ?;
configurable string serviceUrl = ?;

final jira:Client jiraClient = check new ({
    auth: { username, password: apiToken }
}, serviceUrl);

type IssueSummary record {|
    string key;
    string summary;
    string status;
    string priority;
|};

service /api on new http:Listener(8080) {

    resource function get issues(string project, string? status) returns IssueSummary[]|error {
        string jql = status is string
            ? string `project = ${project} AND status = '${status}'`
            : string `project = ${project}`;

        jira:SearchResults results = check jiraClient->/rest/api/'3/search.get(
            jql = jql,
            maxResults = 50
        );

        IssueSummary[] summaries = [];
        foreach jira:IssueBean issue in results.issues ?: [] {
            summaries.push({
                key: issue.key ?: "",
                summary: (issue.fields["summary"] ?: "").toString(),
                status: (issue.fields["status"] ?: "").toString(),
                priority: (issue.fields["priority"] ?: "").toString()
            });
        }
        return summaries;
    }
}
```

## Config.toml

```toml
# Config.toml
username = "your-email@example.com"
apiToken = "<your-atlassian-api-token>"
serviceUrl = "https://your-org.atlassian.net"
projectKey = "PROJ"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
