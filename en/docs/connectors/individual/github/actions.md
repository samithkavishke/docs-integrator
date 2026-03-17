---
title: "GitHub - Actions"
description: "Available actions and operations for the ballerinax/github connector."
---

# GitHub Actions

The `ballerinax/github` package provides a REST client with resource methods that map directly to GitHub REST API v2022-11-28 endpoints.

## Client Initialization

```ballerina
import ballerinax/github;

configurable string token = ?;

github:Client github = check new ({
    auth: { token: token }
});
```

## Repository Operations

### List User Repositories

```ballerina
github:Repository[] repos = check github->/user/repos(
    visibility = "all",
    sort = "updated",
    'type = ()
);
```

### Create a Repository

```ballerina
github:User_repos_body body = {
    name: "my-new-repo",
    description: "Created via WSO2 Integrator",
    'private: true,
    auto_init: true
};

github:Repository repo = check github->/user/repos.post(body);
```

### Get a Repository

```ballerina
github:FullRepository repo = check github->/repos/[owner]/[repoName]();
```

### Delete a Repository

```ballerina
check github->/repos/[owner]/[repoName].delete();
```

## Issue Operations

### Create an Issue

```ballerina
github:RepoName_issues_body issueBody = {
    title: "Bug: Login page not loading",
    body: "The login page returns a 500 error when accessed from mobile.",
    labels: ["bug", "high-priority"],
    assignees: ["developer1"]
};

github:Issue issue = check github->/repos/[owner]/[repo]/issues.post(issueBody);
```

### List Issues

```ballerina
github:Issue[] issues = check github->/repos/[owner]/[repo]/issues(
    state = "open",
    labels = "bug",
    sort = "created",
    direction = "desc"
);
```

### Update an Issue

```ballerina
github:Issue updated = check github->/repos/[owner]/[repo]/issues/[issueNumber].patch({
    state: "closed",
    labels: ["bug", "resolved"]
});
```

### Add a Comment to an Issue

```ballerina
github:IssueComment comment = check github->/repos/[owner]/[repo]/issues/[issueNumber]/comments.post({
    body: "This issue has been fixed in PR #42."
});
```

## Pull Request Operations

### Create a Pull Request

```ballerina
github:RepoName_pulls_body prBody = {
    title: "Add user authentication module",
    body: "Implements JWT-based authentication for the API.",
    head: "feature/auth",
    base: "main"
};

github:PullRequest pr = check github->/repos/[owner]/[repo]/pulls.post(prBody);
```

### List Pull Requests

```ballerina
github:PullRequestSimple[] prs = check github->/repos/[owner]/[repo]/pulls(
    state = "open",
    sort = "created",
    direction = "desc"
);
```

### Merge a Pull Request

```ballerina
github:PullRequestMergeResult result = check github->/repos/[owner]/[repo]/pulls/[prNumber]/merge.put({
    merge_method: "squash",
    commit_title: "feat: add user authentication module"
});
```

## Release Operations

### Create a Release

```ballerina
github:RepoName_releases_body releaseBody = {
    tag_name: "v1.2.0",
    name: "Release v1.2.0",
    body: "## Changes\n- Added authentication module\n- Fixed login bug",
    draft: false,
    prerelease: false
};

github:Release release = check github->/repos/[owner]/[repo]/releases.post(releaseBody);
```

### List Releases

```ballerina
github:Release[] releases = check github->/repos/[owner]/[repo]/releases();
```

## User and Organization Operations

### Get Authenticated User

```ballerina
github:PrivateUser|github:PublicUser user = check github->/user();
```

### List Organization Repositories

```ballerina
github:MinimalRepository[] orgRepos = check github->/orgs/[orgName]/repos(
    sort = "updated",
    'type = "all"
);
```

## Error Handling

All connector operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` to handle them:

```ballerina
import ballerina/log;

do {
    github:Issue issue = check github->/repos/[owner]/[repo]/issues/[issueNumber]();
    log:printInfo("Issue title: " + issue.title);
} on fail error e {
    log:printError("GitHub operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
