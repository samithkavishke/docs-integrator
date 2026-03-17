---
title: "Twitter/X"
description: "Overview of the ballerinax/twitter connector for WSO2 Integrator."
---

# Twitter/X

| | |
|---|---|
| **Package** | [`ballerinax/twitter`](https://central.ballerina.io/ballerinax/twitter/latest) |
| **Version** | 5.0.0 |
| **Category** | Social & Other |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/twitter/latest) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/twitter/latest#functions) |

## Overview

Twitter (now X) is a widely-used social networking platform enabling users to post and interact with short-form messages known as tweets. The `ballerinax/twitter` connector enables WSO2 Integrator applications to interact with the [Twitter API v2](https://developer.x.com/en/docs/twitter-api), providing capabilities for posting tweets, searching content, managing users, and retrieving timelines.

The connector supports the following functional areas:

- **Tweet Management** - Create, delete, and retrieve tweets and replies
- **Search** - Search for tweets using Twitter's full-archive and recent search endpoints
- **User Management** - Look up user profiles and manage follow relationships
- **Timelines** - Retrieve user timelines and reverse chronological home timelines
- **Likes and Retweets** - Like, unlike, retweet, and undo retweets
- **Bookmarks** - Save and manage bookmarked tweets

## Key Capabilities

- **OAuth 2.0 PKCE Authentication** - Secure user-context authentication with granular scope control
- **Tweet Composition** - Post tweets with text, media, polls, and reply controls
- **Advanced Search** - Full-text search with operators, filters, and date ranges
- **User Lookup** - Retrieve detailed user profiles by ID or username
- **Engagement Tracking** - Monitor likes, retweets, and reply counts on tweets
- **Rate Limit Awareness** - Built-in support for handling Twitter API rate limits

## Quick Start

Add the dependency to your `Ballerina.toml`:

```toml
[[dependency]]
org = "ballerinax"
name = "twitter"
version = "5.0.0"
```

Import and initialize the connector:

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

Post a tweet:

```ballerina
import ballerina/io;

twitter:TweetCreateResponse tweet = check twitter->createTweet(
    payload = {
        text: "Hello from WSO2 Integrator! #ballerina #integration"
    }
);

io:println("Tweet posted with ID: ", tweet?.data?.id);
```

## Use Cases

| Use Case | Description |
|---|---|
| Social Media Automation | Schedule and post tweets based on business events or content calendars |
| Brand Monitoring | Search for brand mentions and keywords to track public sentiment |
| Customer Support | Monitor mentions and direct messages for customer inquiries |
| Content Aggregation | Collect and curate tweets by topic or hashtag for dashboards |
| Notification Broadcasting | Post automated updates about system status, releases, or alerts |
| Influencer Analytics | Track engagement metrics across user profiles and tweet performance |

## Related Resources

- [Setup Guide](setup) - Configure Twitter Developer App and OAuth 2.0
- [Actions Reference](actions) - Complete list of available operations
- [Examples](examples) - End-to-end code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/twitter/latest)
- [Twitter API v2 Documentation](https://developer.x.com/en/docs/twitter-api)
