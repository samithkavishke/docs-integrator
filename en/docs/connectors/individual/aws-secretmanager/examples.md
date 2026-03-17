---
title: "AWS Secrets Manager - Examples"
description: "Code examples for the ballerinax/aws.secretmanager connector."
---

# AWS Secrets Manager Examples

## Example 1: Dynamic Database Connection Using Secrets

Retrieve database credentials from Secrets Manager and establish a connection.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.secretmanager;
import ballerinax/mysql;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string dbSecretName = ?;

type DatabaseCredentials record {
    string host;
    int port;
    string username;
    string password;
    string database;
};

final secretmanager:Client smClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

function getDatabaseClient() returns mysql:Client|error {
    secretmanager:GetSecretValueResponse secretResp =
        check smClient->getSecretValue(dbSecretName);

    string secretStr = secretResp.secretString ?: "";
    DatabaseCredentials creds = check secretStr.fromJsonStringWithType();

    mysql:Client dbClient = check new (
        host = creds.host,
        port = creds.port,
        user = creds.username,
        password = creds.password,
        database = creds.database
    );

    log:printInfo("Database connection established using secrets");
    return dbClient;
}

public function main() returns error? {
    mysql:Client db = check getDatabaseClient();
    io:println("Database client initialized from Secrets Manager");
    check db.close();
}
```

**Config.toml:**

```toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
dbSecretName = "prod/database/mysql-credentials"
```

## Example 2: Secrets Management REST API

An admin service for managing secrets through a REST interface.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

final secretmanager:Client smClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

service /secrets on new http:Listener(8080) {

    // List all secrets (metadata only)
    resource function get .() returns json|error {
        secretmanager:SecretList secrets = check smClient->listSecrets();
        json[] secretList = [];
        foreach secretmanager:SecretEntry s in secrets.secretList {
            secretList.push({
                name: s.name,
                arn: s.arn,
                description: s.description,
                lastChangedDate: s.lastChangedDate
            });
        }
        return {secrets: secretList};
    }

    // Create a new secret
    resource function post .(record {
        string name;
        string value;
        string description?;
    } payload) returns json|error {
        secretmanager:CreateSecretResponse result = check smClient->createSecret({
            name: payload.name,
            secretString: payload.value,
            description: payload.description ?: ""
        });

        log:printInfo("Secret created", name = payload.name);
        return {status: "created", arn: result.arn};
    }

    // Get a secret's metadata (not the value for security)
    resource function get [string secretName]/info() returns json|error {
        secretmanager:DescribeSecretResponse info =
            check smClient->describeSecret(secretName);
        return {
            name: info.name,
            arn: info.arn,
            description: info.description,
            lastChangedDate: info.lastChangedDate,
            lastAccessedDate: info.lastAccessedDate
        };
    }

    // Update a secret value
    resource function put [string secretName](
            record {string value;} payload) returns json|error {
        check smClient->putSecretValue({
            secretId: secretName,
            secretString: payload.value
        });

        log:printInfo("Secret updated", name = secretName);
        return {status: "updated", name: secretName};
    }

    // Delete a secret
    resource function delete [string secretName](
            int recoveryDays = 30) returns json|error {
        check smClient->deleteSecret(secretName,
            recoveryWindowInDays = recoveryDays);

        log:printInfo("Secret deleted", name = secretName,
            recoveryDays = recoveryDays);
        return {status: "deleted", name: secretName,
            recoveryWindowDays: recoveryDays};
    }
}
```

## Example 3: Multi-Environment Secret Resolver

Resolve secrets based on the current deployment environment.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;
configurable string environment = "dev"; // dev, staging, prod

final secretmanager:Client smClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

// Cache for resolved secrets
map<string> secretCache = {};

function resolveSecret(string secretKey) returns string|error {
    string fullSecretName = string `${environment}/${secretKey}`;

    if secretCache.hasKey(fullSecretName) {
        return secretCache.get(fullSecretName);
    }

    do {
        secretmanager:GetSecretValueResponse resp =
            check smClient->getSecretValue(fullSecretName);
        string value = resp.secretString ?: "";
        secretCache[fullSecretName] = value;
        log:printInfo("Secret resolved", key = fullSecretName);
        return value;
    } on fail error e {
        log:printError("Failed to resolve secret",
            key = fullSecretName, 'error = e);
        return e;
    }
}

public function main() returns error? {
    // Resolve environment-specific secrets
    string dbPassword = check resolveSecret("database/password");
    string apiKey = check resolveSecret("api/external-service-key");
    string jwtSecret = check resolveSecret("auth/jwt-signing-key");

    io:println("All secrets resolved for environment: ", environment);
    io:println("Database password length: ", dbPassword.length());
    io:println("API key length: ", apiKey.length());
    io:println("JWT secret length: ", jwtSecret.length());
}
```

**Config.toml (production):**

```toml
accessKeyId = "<YOUR_AWS_ACCESS_KEY_ID>"
secretAccessKey = "<YOUR_AWS_SECRET_ACCESS_KEY>"
region = "us-east-1"
environment = "prod"
```

## Example 4: Secret Rotation Setup

Set up automatic rotation for database credentials.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

final secretmanager:Client smClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});

public function main() returns error? {
    string secretName = "prod/database/credentials";

    // Create the secret if it does not exist
    do {
        _ = check smClient->describeSecret(secretName);
        log:printInfo("Secret already exists", name = secretName);
    } on fail error _e {
        _ = check smClient->createSecret({
            name: secretName,
            secretString: "{\"username\": \"dbadmin\", \"password\": \"initialPass123\"}",
            description: "Production database credentials with auto-rotation",
            tags: [
                {key: "Environment", value: "Production"},
                {key: "AutoRotate", value: "true"},
                {key: "RotationDays", value: "30"}
            ]
        });
        log:printInfo("Secret created", name = secretName);
    }

    // Configure rotation
    check smClient->rotateSecret({
        secretId: secretName,
        rotationLambdaARN: "arn:aws:lambda:us-east-1:123456789012:function:RotateDBSecret",
        rotationRules: {
            automaticallyAfterDays: 30
        }
    });

    log:printInfo("Rotation configured for 30-day cycle");

    // Verify the secret can be retrieved
    secretmanager:GetSecretValueResponse resp =
        check smClient->getSecretValue(secretName);
    io:println("Secret verified. Version: ", resp.versionId);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
