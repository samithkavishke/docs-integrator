---
title: "Google Cloud Pub/Sub - Setup"
description: "How to set up and configure the ballerinax/gcloud.pubsub connector."
---

# Google Cloud Pub/Sub Setup

## Prerequisites

- WSO2 Integrator (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- Google Cloud project with Pub/Sub API enabled
- Service account with Pub/Sub Publisher and Subscriber roles

## Installation

```ballerina
import ballerinax/gcloud.pubsub;
```

```toml
[[dependency]]
org = "ballerinax"
name = "gcloud.pubsub"
version = "0.1.0"
```

## Google Cloud setup

### Step 1: Create a project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown and select **New Project**
3. Enter a project name and click **Create**

### Step 2: Enable the Pub/Sub API

1. Navigate to **APIs & Services** > **Library**
2. Search for "Cloud Pub/Sub API" and click **Enable**

### Step 3: Create a service account

1. Navigate to **IAM & Admin** > **Service Accounts**
2. Click **Create Service Account**
3. Grant the **Pub/Sub Publisher** and **Pub/Sub Subscriber** roles
4. Go to the **Keys** tab, click **Add Key** > **Create new key** > **JSON**
5. Save the downloaded JSON file securely

### Step 4: Create a topic and subscription

1. Navigate to **Pub/Sub** > **Topics** > **Create Topic** (e.g., `my-topic`)
2. Navigate to **Pub/Sub** > **Subscriptions** > **Create Subscription**
3. Select the topic and choose Pull delivery type

## Configuration

### Publisher

```ballerina
configurable string projectId = ?;
configurable string topicName = ?;
configurable string credentialsPath = ?;

pubsub:Publisher publisher = check new (topicName,
    projectId = projectId,
    credentials = { credentialsPath }
);
```

### Listener

```ballerina
configurable string projectId = ?;
configurable string subscriptionName = ?;
configurable string credentialsPath = ?;

listener pubsub:Listener pubsubListener = check new (subscriptionName,
    projectId = projectId,
    credentials = { credentialsPath }
);
```

### Config.toml

```toml
# Config.toml
projectId = "my-gcp-project"
topicName = "my-topic"
subscriptionName = "my-subscription"
credentialsPath = "/path/to/service-account.json"
```

## Verify the setup

```bash
bal run
```

| Error | Cause | Solution |
|-------|-------|----------|
| `Permission denied` | Missing IAM roles | Add Pub/Sub Publisher/Subscriber roles |
| `Project not found` | Wrong project ID | Check `projectId` value |
| `Topic not found` | Topic doesn't exist | Create topic in Google Cloud Console |
| `Invalid credentials` | Bad service account key | Re-download JSON key file |

## Next steps

- [Actions Reference](actions) -- Publisher and listener operations
- [Examples](examples) -- Code examples
