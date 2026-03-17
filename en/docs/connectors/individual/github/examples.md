---
title: "GitHub - Examples"
description: "Code examples for the ballerinax/github connector."
---

# GitHub Examples

## Example 1: Initialize a New Project

Create a new repository, add a README, and invite collaborators.

```ballerina
import ballerina/io;
import ballerinax/github;

configurable string token = ?;

public function main() returns error? {
    github:Client github = check new ({
        auth: { token: token }
    });

    // Create a new private repository with auto-init
    github:Repository repo = check github->/user/repos.post({
        name: "my-integration-project",
        description: "WSO2 Integrator project for order processing",
        'private: true,
        auto_init: true
    });
    io:println("Repository created: ", repo.html_url);

    // Add a collaborator
    check github->/repos/[repo.owner.login]/[repo.name]/collaborators/["teammate1"].put({
        permission: "push"
    });
    io:println("Collaborator invited successfully");
}
```

## Example 2: Create and Assign Issues

Automate issue creation with labels and assignments.

```ballerina
import ballerina/io;
import ballerinax/github;

configurable string token = ?;
configurable string owner = ?;
configurable string repo = ?;

public function main() returns error? {
    github:Client github = check new ({
        auth: { token: token }
    });

    // Create a bug report issue
    github:Issue issue = check github->/repos/[owner]/[repo]/issues.post({
        title: "Fix: Payment processing timeout",
        body: "## Description\nPayment gateway times out after 30 seconds.\n\n## Steps to Reproduce\n1. Submit order over $500\n2. Observe timeout error",
        labels: ["bug", "high-priority", "payments"],
        assignees: ["dev-lead"]
    });
    io:println("Issue created: #", issue.number);

    // Add a follow-up comment
    _ = check github->/repos/[owner]/[repo]/issues/[issue.number]/comments.post({
        body: "Investigating this issue. ETA for fix: 2 days."
    });
    io:println("Comment added to issue #", issue.number);
}
```

## Example 3: Pull Request Automation

Create a pull request and manage its lifecycle.

```ballerina
import ballerina/io;
import ballerinax/github;

configurable string token = ?;
configurable string owner = ?;
configurable string repo = ?;

public function main() returns error? {
    github:Client github = check new ({
        auth: { token: token }
    });

    // Create a pull request
    github:PullRequest pr = check github->/repos/[owner]/[repo]/pulls.post({
        title: "feat: add retry logic to payment service",
        body: "## Summary\nAdds exponential backoff retry for payment gateway calls.\n\n## Testing\n- Unit tests added\n- Integration tests pass",
        head: "feature/payment-retry",
        base: "main"
    });
    io:println("PR created: #", pr.number);

    // Request a review
    _ = check github->/repos/[owner]/[repo]/pulls/[pr.number]/requested_reviewers.post({
        reviewers: ["senior-dev"]
    });
    io:println("Review requested on PR #", pr.number);
}
```

## Example 4: Release Management

Automate release creation with changelogs.

```ballerina
import ballerina/io;
import ballerinax/github;

configurable string token = ?;
configurable string owner = ?;
configurable string repo = ?;

public function main() returns error? {
    github:Client github = check new ({
        auth: { token: token }
    });

    // Create a new release
    github:Release release = check github->/repos/[owner]/[repo]/releases.post({
        tag_name: "v2.1.0",
        name: "v2.1.0 - Payment Retry & Bug Fixes",
        body: string `## What's Changed
- Added exponential backoff retry for payment gateway
- Fixed timeout issue for large orders
- Updated dependencies to latest versions

## Contributors
@dev-lead @senior-dev`,
        draft: false,
        prerelease: false,
        generate_release_notes: true
    });
    io:println("Release published: ", release.html_url);
}
```

## Example 5: Repository Monitoring Service

Create an HTTP service that monitors repository activity.

```ballerina
import ballerina/http;
import ballerinax/github;

configurable string token = ?;
configurable string owner = ?;
configurable string repo = ?;

final github:Client github = check new ({
    auth: { token: token }
});

service /api on new http:Listener(8080) {

    resource function get issues() returns github:Issue[]|error {
        return github->/repos/[owner]/[repo]/issues(
            state = "open",
            sort = "updated",
            direction = "desc"
        );
    }

    resource function get pulls() returns github:PullRequestSimple[]|error {
        return github->/repos/[owner]/[repo]/pulls(state = "open");
    }

    resource function get releases/latest() returns github:Release|error {
        return github->/repos/[owner]/[repo]/releases/latest();
    }
}
```

## Config.toml

```toml
# Config.toml
token = "<your-github-pat>"
owner = "my-org"
repo = "my-repo"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
