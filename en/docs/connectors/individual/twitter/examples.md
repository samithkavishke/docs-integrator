---
title: "Twitter/X - Examples"
description: "Code examples for the ballerinax/twitter connector."
---

# Twitter/X Examples

## Example 1: Post a Tweet and Track Engagement

Post a tweet and retrieve its engagement metrics after a period.

```ballerina
import ballerina/io;
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

public function main() returns error? {
    twitter:Client tw = check new ({
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    // Post a tweet
    twitter:TweetCreateResponse tweet = check tw->createTweet(
        payload = {
            text: "We just released v2.0 of our integration platform! Check out the new features at https://example.com/release #integration #api"
        }
    );

    string tweetId = tweet?.data?.id ?: "";
    io:println("Tweet posted with ID: ", tweetId);

    // Retrieve the tweet with engagement metrics
    twitter:Get2TweetsIdResponse tweetDetails = check tw->findTweetById(
        id = tweetId,
        tweet\.fields = ["public_metrics", "created_at"]
    );

    io:println("Tweet details: ", tweetDetails?.data);
}
```

```toml
# Config.toml
clientId = "<your-client-id>"
clientSecret = "<your-client-secret>"
refreshToken = "<your-refresh-token>"
refreshUrl = "https://api.twitter.com/2/oauth2/token"
```

## Example 2: Brand Mention Monitoring

Search for brand mentions and collect them for analysis.

```ballerina
import ballerina/io;
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

type MentionSummary record {|
    string tweetId;
    string text;
    string authorId;
    string createdAt;
    int likeCount;
    int retweetCount;
|};

public function main() returns error? {
    twitter:Client tw = check new ({
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    // Search for brand mentions excluding retweets
    twitter:Get2TweetsSearchRecentResponse results = check tw->tweetsRecentSearch(
        query = "(WSO2 OR @wso2) -is:retweet lang:en",
        max_results = 100,
        tweet\.fields = ["created_at", "public_metrics", "author_id"]
    );

    MentionSummary[] mentions = [];
    twitter:Tweet[]? tweets = results?.data;

    if tweets is twitter:Tweet[] {
        foreach twitter:Tweet t in tweets {
            mentions.push({
                tweetId: t?.id ?: "",
                text: t?.text ?: "",
                authorId: t?.author_id ?: "",
                createdAt: t?.created_at ?: "",
                likeCount: t?.public_metrics?.like_count ?: 0,
                retweetCount: t?.public_metrics?.retweet_count ?: 0
            });
        }
    }

    io:println("Found ", mentions.length(), " brand mentions");
    foreach MentionSummary m in mentions {
        io:println(string `  [${m.createdAt}] ${m.text} (Likes: ${m.likeCount}, RTs: ${m.retweetCount})`);
    }
}
```

## Example 3: Automated Social Media Service

A REST API that receives content from internal systems and posts it to Twitter.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

final twitter:Client twClient = check new ({
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: refreshUrl
    }
});

type TweetRequest record {|
    string content;
    string? replyToId;
|};

type SearchRequest record {|
    string query;
    int maxResults = 25;
|};

service /api/v1/social on new http:Listener(8090) {

    resource function post tweet(TweetRequest input)
            returns http:Created|http:InternalServerError {
        do {
            twitter:TweetCreateData payload = {
                text: input.content
            };

            if input.replyToId is string {
                payload.reply = {
                    in_reply_to_tweet_id: <string>input.replyToId
                };
            }

            twitter:TweetCreateResponse tweet = check twClient->createTweet(
                payload = payload
            );

            string tweetId = tweet?.data?.id ?: "";
            log:printInfo("Tweet posted", tweetId = tweetId);
            return <http:Created>{
                body: {id: tweetId, message: "Tweet posted successfully"}
            };
        } on fail error e {
            log:printError("Failed to post tweet", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to post tweet"}
            };
        }
    }

    resource function post search(SearchRequest input)
            returns json|http:InternalServerError {
        do {
            twitter:Get2TweetsSearchRecentResponse results = check twClient->tweetsRecentSearch(
                query = input.query,
                max_results = input.maxResults,
                tweet\.fields = ["created_at", "public_metrics", "author_id"]
            );

            return results.toJson();
        } on fail error e {
            log:printError("Search failed", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Twitter search failed"}
            };
        }
    }
}
```

## Example 4: User Analytics Dashboard Data

Collect follower and engagement data for multiple user accounts.

```ballerina
import ballerina/io;
import ballerinax/twitter;

configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string refreshToken = ?;
configurable string refreshUrl = ?;

type UserAnalytics record {|
    string username;
    string name;
    int followers;
    int following;
    int tweetCount;
|};

public function main() returns error? {
    twitter:Client tw = check new ({
        auth: {
            clientId: clientId,
            clientSecret: clientSecret,
            refreshToken: refreshToken,
            refreshUrl: refreshUrl
        }
    });

    string[] usernames = ["wso2", "balaboratory"];
    UserAnalytics[] analytics = [];

    foreach string username in usernames {
        twitter:Get2UsersByUsernameUsernameResponse user = check tw->findUserByUsername(
            username = username,
            user\.fields = ["name", "public_metrics", "description"]
        );

        if user?.data is twitter:User {
            twitter:User u = <twitter:User>user?.data;
            analytics.push({
                username: u?.username ?: "",
                name: u?.name ?: "",
                followers: u?.public_metrics?.followers_count ?: 0,
                following: u?.public_metrics?.following_count ?: 0,
                tweetCount: u?.public_metrics?.tweet_count ?: 0
            });
        }
    }

    io:println("=== User Analytics Report ===");
    foreach UserAnalytics a in analytics {
        io:println(string `@${a.username} (${a.name})`);
        io:println(string `  Followers: ${a.followers} | Following: ${a.following} | Tweets: ${a.tweetCount}`);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
