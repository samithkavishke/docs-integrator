---
title: "Trello - Actions"
description: "Available actions and operations for the ballerinax/trello connector."
---

# Trello Actions

The `ballerinax/trello` package provides a REST client with resource methods that map to Trello REST API endpoints.

## Client Initialization

```ballerina
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;

trello:Client trello = check new ({
    auth: { token: token }
});
```

## Board Operations

### Get All Boards

```ballerina
trello:Board[] boards = check trello->/members/me/boards(key = key, token = token);
```

### Create a Board

```ballerina
trello:Board board = check trello->/boards.post(
    name = "Sprint 23",
    defaultLists = false,
    key = key,
    token = token
);
```

### Get a Board

```ballerina
trello:Board board = check trello->/boards/[boardId](key = key, token = token);
```

### Update a Board

```ballerina
trello:Board updated = check trello->/boards/[boardId].put(
    name = "Sprint 23 - Updated",
    desc = "Updated sprint board description",
    key = key,
    token = token
);
```

## List Operations

### Create a List

```ballerina
trello:TrelloList list = check trello->/lists.post(
    name = "To Do",
    idBoard = boardId,
    key = key,
    token = token
);
```

### Get Lists on a Board

```ballerina
trello:TrelloList[] lists = check trello->/boards/[boardId]/lists(key = key, token = token);
```

### Archive a List

```ballerina
_ = check trello->/lists/[listId].put(
    closed = true,
    key = key,
    token = token
);
```

## Card Operations

### Create a Card

```ballerina
trello:Card card = check trello->/cards.post(
    name = "Implement login page",
    desc = "Build the responsive login page with OAuth support",
    idList = listId,
    due = "2024-04-15T17:00:00.000Z",
    key = key,
    token = token
);
```

### Get a Card

```ballerina
trello:Card card = check trello->/cards/[cardId](key = key, token = token);
```

### Update a Card

```ballerina
trello:Card updated = check trello->/cards/[cardId].put(
    name = "Updated card title",
    idList = newListId,
    key = key,
    token = token
);
```

### Delete a Card

```ballerina
check trello->/cards/[cardId].delete(key = key, token = token);
```

### Add a Comment to a Card

```ballerina
trello:Action comment = check trello->/cards/[cardId]/actions/comments.post(
    text = "Started working on this task.",
    key = key,
    token = token
);
```

### Add a Label to a Card

```ballerina
check trello->/cards/[cardId]/idLabels.post(
    value = labelId,
    key = key,
    token = token
);
```

## Checklist Operations

### Create a Checklist on a Card

```ballerina
trello:Checklist checklist = check trello->/checklists.post(
    idCard = cardId,
    name = "Acceptance Criteria",
    key = key,
    token = token
);
```

### Add a Checklist Item

```ballerina
trello:CheckItem item = check trello->/checklists/[checklistId]/checkItems.post(
    name = "Unit tests pass",
    key = key,
    token = token
);
```

## Member Operations

### Get Board Members

```ballerina
trello:Member[] members = check trello->/boards/[boardId]/members(key = key, token = token);
```

### Add a Member to a Card

```ballerina
check trello->/cards/[cardId]/idMembers.post(
    value = memberId,
    key = key,
    token = token
);
```

## Error Handling

```ballerina
import ballerina/log;

do {
    trello:Card card = check trello->/cards/[cardId](key = key, token = token);
    log:printInfo("Card: " + card.name);
} on fail error e {
    log:printError("Trello operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
