---
title: "Cloud Service Connectors"
description: "Connect to AWS, Azure, Google Cloud, and other cloud platform services from WSO2 Integrator."
---

# Cloud Service Connectors

WSO2 Integrator provides connectors for cloud services across AWS, Azure, Google Cloud, and other platforms. These connectors let you integrate cloud-native services directly into your integration flows.

## Amazon Web Services (AWS)

| Connector | Package | Description |
|-----------|---------|-------------|
| **S3** | `ballerinax/aws.s3` | Object storage — buckets, objects, multipart uploads, presigned URLs |
| **SQS** | `ballerinax/aws.sqs` | Simple Queue Service — send, receive, delete messages |
| **SNS** | `ballerinax/aws.sns` | Simple Notification Service — topics, subscriptions, publish |
| **DynamoDB** | `ballerinax/aws.dynamodb` | NoSQL database — tables, items, queries, scans |
| **Lambda** | `ballerinax/aws.lambda` | Serverless function invocation |
| **SES** | `ballerinax/aws.ses` | Simple Email Service — send emails |
| **Marketplace** | `ballerinax/aws.marketplace` | AWS Marketplace metering and entitlement |

### AWS S3 Example

```ballerina
import ballerinax/aws.s3;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;

s3:Client s3Client = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: "us-east-1"
});

// Create a bucket
check s3Client->createBucket("my-integration-data");

// Upload an object
check s3Client->createObject("my-integration-data", "reports/daily.json",
    {content: "report data".toBytes()});

// Download an object
s3:S3Object obj = check s3Client->getObject("my-integration-data", "reports/daily.json");

// List objects
s3:S3Object[] objects = check s3Client->listObjects("my-integration-data",
    prefix = "reports/");
```

## Microsoft Azure

| Connector | Package | Description |
|-----------|---------|-------------|
| **Service Bus** | `ballerinax/azure.servicebus` | Enterprise messaging — queues, topics, subscriptions |
| **Cosmos DB** | `ballerinax/azure.cosmosdb` | Multi-model database — SQL, MongoDB, Cassandra APIs |
| **Event Hubs** | `ballerinax/azure.eventhubs` | Event streaming at scale |
| **OpenAI** | `ballerinax/azure.openai.chat` | Azure-hosted OpenAI GPT models |

### Azure Service Bus Example

```ballerina
import ballerinax/azure.servicebus;

servicebus:MessageSender sender = check new ({
    connectionString: connectionString,
    entityType: servicebus:QUEUE,
    topicOrQueueName: "order-queue"
});

check sender->send({body: "Order created", contentType: "text/plain"});
```

## Google Cloud

| Connector | Package | Description |
|-----------|---------|-------------|
| **Gmail** | `ballerinax/googleapis.gmail` | Send, read, search, label emails |
| **Google Sheets** | `ballerinax/googleapis.sheets` | Read, write, format spreadsheets |
| **Google Calendar** | `ballerinax/googleapis.calendar` | Events, calendars, availability |
| **Google Drive** | `ballerinax/googleapis.drive` | Files, folders, permissions |
| **Google Pub/Sub** | `ballerinax/googleapis.pubsub` | Cloud messaging and event streaming |
| **Firebase** | `ballerinax/firebase.admin` | Firebase Admin SDK — auth, messaging, Firestore |
| **Vertex AI** | `ballerinax/googleapis.vertexai` | Gemini models and ML services |

### Gmail Example

```ballerina
import ballerinax/googleapis.gmail;

gmail:Client gmail = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

gmail:Message msg = check gmail->sendMessage({
    to: ["recipient@example.com"],
    subject: "Integration Report",
    bodyInHtml: "<h1>Daily Report</h1><p>All systems operational.</p>"
});
```

### Google Sheets Example

```ballerina
import ballerinax/googleapis.sheets;

sheets:Client sheets = check new ({
    auth: {
        refreshToken: refreshToken,
        clientId: clientId,
        clientSecret: clientSecret
    }
});

// Append a row
check sheets->appendValue(spreadsheetId, "Sheet1",
    ["2024-01-15", "Order #123", "Completed", "99.99"]);

// Read a range
sheets:Range range = check sheets->getRange(spreadsheetId, "Sheet1", "A1:D10");
```

## Authentication

| Provider | Supported Auth |
|----------|---------------|
| **AWS** | Access key + secret key, IAM role (EC2/ECS), STS assume role |
| **Azure** | Connection string, Azure AD (OAuth 2.0), managed identity |
| **Google Cloud** | OAuth 2.0 (refresh token), service account JSON key |

## What's Next

- [Connection Configuration](configuration.md) — Set up cloud service connections
- [File & Storage Connectors](file-storage.md) — Dedicated file transfer connectors
- [SaaS Connectors](saas.md) — Connect to Salesforce, HubSpot, and more
