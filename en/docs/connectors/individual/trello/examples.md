---
title: "Trello - Examples"
description: "Code examples for the ballerinax/trello connector."
---

# Trello Examples

## Example 1: Set Up a Sprint Board

Create a new board with standard sprint columns and initial cards.

```ballerina
import ballerina/io;
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;

public function main() returns error? {
    trello:Client trello = check new ({
        auth: { token: token }
    });

    // Create the sprint board
    trello:Board board = check trello->/boards.post(
        name = "Sprint 23 - Order Service",
        defaultLists = false,
        key = key,
        token = token
    );
    io:println("Board created: ", board.id);

    // Create columns
    string[] columns = ["Backlog", "To Do", "In Progress", "In Review", "Done"];
    foreach string col in columns {
        _ = check trello->/lists.post(
            name = col,
            idBoard = board.id,
            key = key,
            token = token
        );
    }
    io:println("Sprint board set up with columns");
}
```

## Example 2: Create Cards from Task List

Bulk-create cards from a list of tasks.

```ballerina
import ballerina/io;
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;
configurable string listId = ?;

type Task record {|
    string name;
    string description;
    string dueDate;
|};

public function main() returns error? {
    trello:Client trello = check new ({
        auth: { token: token }
    });

    Task[] tasks = [
        { name: "Design API schema", description: "Define OpenAPI spec for order service", dueDate: "2024-04-10T17:00:00.000Z" },
        { name: "Implement order endpoint", description: "POST /orders with validation", dueDate: "2024-04-12T17:00:00.000Z" },
        { name: "Add integration tests", description: "Test order creation flow end-to-end", dueDate: "2024-04-14T17:00:00.000Z" }
    ];

    foreach Task task in tasks {
        trello:Card card = check trello->/cards.post(
            name = task.name,
            desc = task.description,
            idList = listId,
            due = task.dueDate,
            key = key,
            token = token
        );
        io:println("Created card: ", card.name);
    }
}
```

## Example 3: Move Cards Between Lists

Move completed cards from "In Progress" to "Done".

```ballerina
import ballerina/io;
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;
configurable string boardId = ?;

public function main() returns error? {
    trello:Client trello = check new ({
        auth: { token: token }
    });

    // Get all lists on the board
    trello:TrelloList[] lists = check trello->/boards/[boardId]/lists(key = key, token = token);

    string? doneListId = ();
    foreach trello:TrelloList list in lists {
        if list.name == "Done" {
            doneListId = list.id;
        }
    }

    string targetList = doneListId ?: "";

    // Get cards from In Progress that are due today or past due
    trello:Card[] cards = check trello->/boards/[boardId]/cards(key = key, token = token);
    foreach trello:Card card in cards {
        // Move cards marked as complete to Done
        if card.dueComplete == true && card.idList != targetList {
            _ = check trello->/cards/[card.id].put(
                idList = targetList,
                key = key,
                token = token
            );
            io:println("Moved card to Done: ", card.name);
        }
    }
}
```

## Example 4: Board Status Report Service

HTTP service that returns board status as JSON.

```ballerina
import ballerina/http;
import ballerinax/trello;

configurable string key = ?;
configurable string token = ?;
configurable string boardId = ?;

final trello:Client trelloClient = check new ({
    auth: { token: token }
});

type ListSummary record {|
    string name;
    int cardCount;
|};

service /api on new http:Listener(8080) {

    resource function get board/status() returns ListSummary[]|error {
        trello:TrelloList[] lists = check trelloClient->/boards/[boardId]/lists(
            key = key,
            token = token
        );

        ListSummary[] summary = [];
        foreach trello:TrelloList list in lists {
            trello:Card[] cards = check trelloClient->/lists/[list.id]/cards(
                key = key,
                token = token
            );
            summary.push({ name: list.name, cardCount: cards.length() });
        }
        return summary;
    }
}
```

## Config.toml

```toml
# Config.toml
key = "<your-trello-api-key>"
token = "<your-trello-token>"
boardId = "<your-board-id>"
listId = "<your-list-id>"
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
