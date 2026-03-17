---
title: "Twitter/X - Actions"
description: "Available actions and operations for the ballerinax/twitter connector."
---

# Twitter/X Actions

The `ballerinax/twitter` package provides a client for interacting with the Twitter API v2, supporting tweet management, user lookup, search, and engagement operations.

## Client Initialization

```ballerina
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

twitter:Client twitter = check new ({
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});
```

## Tweet Operations

### createTweet

Create a new tweet.

```ballerina
twitter:TweetCreateResponse tweet = check twitter->createTweet(
    payload = {
        text: "Announcing our new integration platform! #WSO2 #Ballerina"
    }
);

string? tweetId = tweet?.data?.id;
io:println("Tweet posted: ", tweetId);
```

### createTweet (with reply)

Post a tweet as a reply to another tweet.

```ballerina
twitter:TweetCreateResponse reply = check twitter->createTweet(
    payload = {
        text: "Thanks for reaching out! Our team will follow up shortly.",
        reply: {
            in_reply_to_tweet_id: "1234567890123456789"
        }
    }
);
```

### createTweet (with poll)

Create a tweet with a poll.

```ballerina
twitter:TweetCreateResponse pollTweet = check twitter->createTweet(
    payload = {
        text: "What integration pattern do you use most?",
        poll: {
            options: ["Request-Reply", "Pub-Sub", "Scatter-Gather", "Saga"],
            duration_minutes: 1440
        }
    }
);
```

### deleteTweet

Delete a tweet by ID.

```ballerina
twitter:TweetDeleteResponse deleted = check twitter->deleteTweet(
    id = "1234567890123456789"
);
```

### findTweetById

Retrieve a specific tweet by ID with optional field expansions.

```ballerina
twitter:Get2TweetsIdResponse tweet = check twitter->findTweetById(
    id = "1234567890123456789",
    tweet\.fields = ["created_at", "public_metrics", "author_id"]
);
```

## Search Operations

### tweetsRecentSearch

Search for tweets from the last 7 days.

```ballerina
twitter:Get2TweetsSearchRecentResponse results = check twitter->tweetsRecentSearch(
    query = "#ballerina lang:en -is:retweet",
    max_results = 50,
    tweet\.fields = ["created_at", "public_metrics", "author_id"]
);
```

### tweetsFullarchiveSearch

Search the complete tweet archive (Academic Research access required).

```ballerina
twitter:Get2TweetsSearchAllResponse archiveResults = check twitter->tweetsFullarchiveSearch(
    query = "WSO2 integration",
    start_time = "2024-01-01T00:00:00Z",
    end_time = "2025-01-01T00:00:00Z",
    max_results = 100
);
```

## User Operations

### findMyUser

Retrieve the authenticated user's profile.

```ballerina
twitter:Get2UsersMeResponse me = check twitter->findMyUser(
    user\.fields = ["name", "username", "description", "public_metrics"]
);

io:println("User: ", me?.data?.username);
```

### findUserByUsername

Look up a user by their username.

```ballerina
twitter:Get2UsersByUsernameUsernameResponse user = check twitter->findUserByUsername(
    username = "balaboratory",
    user\.fields = ["description", "public_metrics", "created_at"]
);
```

### findUserById

Look up a user by their numeric ID.

```ballerina
twitter:Get2UsersIdResponse user = check twitter->findUserById(
    id = "1234567890",
    user\.fields = ["name", "username", "public_metrics"]
);
```

## Timeline Operations

### usersIdTweets

Retrieve tweets from a user's timeline.

```ballerina
twitter:Get2UsersIdTweetsResponse timeline = check twitter->usersIdTweets(
    id = "1234567890",
    max_results = 25,
    tweet\.fields = ["created_at", "public_metrics"]
);
```

### usersIdMentions

Retrieve tweets that mention a specific user.

```ballerina
twitter:Get2UsersIdMentionsResponse mentions = check twitter->usersIdMentions(
    id = "1234567890",
    max_results = 50
);
```

## Engagement Operations

### usersIdLike

Like a tweet.

```ballerina
twitter:UsersLikesCreateResponse liked = check twitter->usersIdLike(
    id = "authenticated-user-id",
    payload = {
        tweet_id: "1234567890123456789"
    }
);
```

### usersIdRetweets

Retweet a tweet.

```ballerina
twitter:UsersRetweetsCreateResponse retweeted = check twitter->usersIdRetweets(
    id = "authenticated-user-id",
    payload = {
        tweet_id: "1234567890123456789"
    }
);
```

## Follow Operations

### usersIdFollow

Follow a user.

```ballerina
twitter:UsersFollowingCreateResponse followed = check twitter->usersIdFollow(
    id = "authenticated-user-id",
    payload = {
        target_user_id: "target-user-id"
    }
);
```

### usersIdFollowers

Get followers of a user.

```ballerina
twitter:Get2UsersIdFollowersResponse followers = check twitter->usersIdFollowers(
    id = "1234567890",
    max_results = 100,
    user\.fields = ["name", "username"]
);
```

## Bookmark Operations

### postUsersIdBookmarks

Bookmark a tweet.

```ballerina
twitter:BookmarkMutationResponse bookmarked = check twitter->postUsersIdBookmarks(
    id = "authenticated-user-id",
    payload = {
        tweet_id: "1234567890123456789"
    }
);
```

### getUsersIdBookmarks

Retrieve bookmarked tweets.

```ballerina
twitter:Get2UsersIdBookmarksResponse bookmarks = check twitter->getUsersIdBookmarks(
    id = "authenticated-user-id",
    max_results = 50
);
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use structured error handling:

```ballerina
do {
    twitter:TweetCreateResponse tweet = check twitter->createTweet(
        payload = { text: "Hello, world!" }
    );
    io:println("Tweet posted: ", tweet?.data?.id);
} on fail error e {
    io:println("Error: ", e.message());
    log:printError("Twitter operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/twitter/latest#clients)
