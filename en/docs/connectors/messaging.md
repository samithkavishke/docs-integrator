---
title: "Messaging Connectors"
description: "Connect to message brokers and event streaming platforms from WSO2 Integrator."
---

# Messaging Connectors

WSO2 Integrator provides connectors for all major messaging and event streaming platforms. Use these to build event-driven integrations, data pipelines, and asynchronous workflows.

## Available Connectors

| Connector | Package | Description |
|-----------|---------|-------------|
| **Apache Kafka** | `ballerinax/kafka` | High-throughput event streaming with producer, consumer, and listener APIs |
| **RabbitMQ** | `ballerinax/rabbitmq` | AMQP messaging with queues, exchanges, and routing |
| **NATS** | `ballerinax/nats` | Lightweight publish-subscribe messaging |
| **NATS JetStream** | `ballerinax/nats.jetstream` | Persistent messaging with NATS JetStream |
| **MQTT** | `ballerinax/mqtt` | IoT-optimized lightweight messaging protocol |
| **JMS** | `ballerinax/java.jms` | Java Message Service for enterprise messaging (ActiveMQ, IBM MQ, etc.) |
| **AWS SQS** | `ballerinax/aws.sqs` | Amazon Simple Queue Service |
| **AWS SNS** | `ballerinax/aws.sns` | Amazon Simple Notification Service |
| **Azure Service Bus** | `ballerinax/azure.servicebus` | Microsoft Azure messaging service |
| **Google Pub/Sub** | `ballerinax/googleapis.pubsub` | Google Cloud Pub/Sub messaging |

## Apache Kafka

### Producer

```ballerina
import ballerinax/kafka;

kafka:Producer producer = check new (kafka:DEFAULT_URL, {
    clientId: "order-producer",
    acks: "all",
    retryCount: 3
});

// Send a message
check producer->send({
    topic: "order-events",
    value: {orderId: "ORD-001", status: "CREATED"}.toJsonString().toBytes()
});
```

### Consumer (Listener)

```ballerina
import ballerinax/kafka;

kafka:ConsumerConfiguration consumerConfig = {
    groupId: "order-processor",
    topics: ["order-events"],
    autoCommit: false,
    offsetReset: "earliest"
};

listener kafka:Listener kafkaListener = new (kafka:DEFAULT_URL, consumerConfig);

service on kafkaListener {
    remote function onConsumerRecord(kafka:Caller caller,
            kafka:BytesConsumerRecord[] records) returns error? {
        foreach var rec in records {
            string value = check string:fromBytes(rec.value);
            // Process message
        }
        check caller->commit();
    }
}
```

### Security (SASL/SSL)

```ballerina
kafka:Producer secureProducer = check new ("broker.example.com:9093", {
    securityProtocol: kafka:PROTOCOL_SASL_SSL,
    auth: <kafka:SaslPlainAuthConfig>{
        username: "producer-user",
        password: "secret"
    },
    secureSocket: {
        cert: {path: "/certs/ca.p12", password: "pass"}
    }
});
```

## RabbitMQ

### Producer

```ballerina
import ballerinax/rabbitmq;

rabbitmq:Client rabbit = check new ("localhost", 5672);

// Declare a queue
check rabbit->queueDeclare("order-queue", {durable: true});

// Publish a message
check rabbit->publishMessage({
    content: "Order created".toBytes(),
    routingKey: "order-queue"
});
```

### Consumer (Listener)

```ballerina
import ballerinax/rabbitmq;

listener rabbitmq:Listener rabbitListener = check new ("localhost", 5672);

@rabbitmq:ServiceConfig {queueName: "order-queue"}
service on rabbitListener {
    remote function onMessage(rabbitmq:BytesMessage message,
            rabbitmq:Caller caller) returns error? {
        string content = check string:fromBytes(message.content);
        // Process message
        check caller->basicAck();
    }
}
```

## NATS

### Publisher

```ballerina
import ballerinax/nats;

nats:Client natsClient = check new ("nats://localhost:4222");

check natsClient->publishMessage({
    subject: "events.order.created",
    content: "Order data".toBytes()
});
```

### Subscriber (Listener)

```ballerina
import ballerinax/nats;

listener nats:Listener natsListener = new ("nats://localhost:4222");

@nats:ServiceConfig {subject: "events.order.*"}
service on natsListener {
    remote function onMessage(nats:BytesMessage message) returns error? {
        string content = check string:fromBytes(message.content);
        // Process message
    }
}
```

## MQTT

```ballerina
import ballerinax/mqtt;

mqtt:Client mqttClient = check new ("tcp://localhost:1883", "sensor-client", {});

// Publish sensor data
check mqttClient->publish("sensors/temperature", {
    payload: {temp: 23.5, unit: "celsius"}.toJsonString().toBytes()
});

// Subscribe via listener
listener mqtt:Listener mqttListener = check new (
    "tcp://localhost:1883", "sensor-subscriber",
    {topics: [{topic: "sensors/#", qos: 1}]}
);

service on mqttListener {
    remote function onMessage(mqtt:Message message) returns error? {
        // Process sensor data
    }
}
```

## JMS (ActiveMQ, IBM MQ)

```ballerina
import ballerinax/java.jms;

jms:Connection connection = check new ({
    initialContextFactory: "org.apache.activemq.jndi.ActiveMQInitialContextFactory",
    providerUrl: "tcp://localhost:61616"
});

jms:Session session = check connection->createSession();
jms:MessageProducer producer = check session.createProducer({
    'type: jms:QUEUE,
    name: "order-queue"
});

jms:TextMessage msg = {content: "Order data"};
check producer->send(msg);
```

## Authentication Methods

| Connector | Supported Auth |
|-----------|---------------|
| **Kafka** | SASL_PLAIN, SASL_SCRAM_SHA_256, SASL_SCRAM_SHA_512, SSL, mTLS |
| **RabbitMQ** | Username/password, SSL/TLS |
| **NATS** | Token, username/password, NKey, credentials file, TLS |
| **MQTT** | Username/password, SSL/TLS, client certificates |
| **JMS** | Provider-specific (JNDI configuration) |

## What's Next

- [Connection Configuration](configuration.md) — Set up messaging connections in the visual designer
- [Database Connectors](databases.md) — Connect to MySQL, PostgreSQL, MongoDB, and more
- [AI & LLM Connectors](ai-llms.md) — Connect to OpenAI, Anthropic, and AI providers
