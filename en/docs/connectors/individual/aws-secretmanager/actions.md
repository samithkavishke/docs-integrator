---
title: "AWS Secrets Manager - Actions"
description: "Available actions and operations for the ballerinax/aws.secretmanager connector."
---

# AWS Secrets Manager Actions

The `ballerinax/aws.secretmanager` package provides a client for managing secrets in AWS Secrets Manager.

## Client Initialization

```ballerina
import ballerinax/aws.secretmanager;

configurable string accessKeyId = ?;
configurable string secretAccessKey = ?;
configurable string region = ?;

secretmanager:Client smClient = check new ({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});
```

## Secret CRUD Operations

### Create Secret

Create a new secret with a string or binary value.

```ballerina
secretmanager:CreateSecretResponse result = check smClient->createSecret({
    name: "prod/database/credentials",
    secretString: "{\"username\": \"admin\", \"password\": \"s3cur3P@ss\"}"
});
io:println("Secret created. ARN: ", result.arn);
```

**Create with description and tags:**

```ballerina
secretmanager:CreateSecretResponse taggedSecret = check smClient->createSecret({
    name: "prod/api/stripe-key",
    secretString: "sk_live_abc123xyz",
    description: "Production Stripe API key",
    tags: [
        {key: "Environment", value: "Production"},
        {key: "Team", value: "Payments"}
    ]
});
```

### Get Secret Value

Retrieve the current value of a secret.

```ballerina
secretmanager:GetSecretValueResponse secretValue =
    check smClient->getSecretValue("prod/database/credentials");

string? secretString = secretValue.secretString;
if secretString is string {
    io:println("Secret value retrieved");
    // Parse JSON secret
    json credentials = check secretString.fromJsonString();
    string username = check credentials.username;
    string password = check credentials.password;
}
```

**Get a specific version:**

```ballerina
secretmanager:GetSecretValueResponse versionedSecret =
    check smClient->getSecretValue("prod/database/credentials",
        versionId = "a1b2c3d4-5678-90ab-cdef-EXAMPLE11111");
```

### Update Secret Value

Update the value of an existing secret.

```ballerina
check smClient->putSecretValue({
    secretId: "prod/database/credentials",
    secretString: "{\"username\": \"admin\", \"password\": \"n3wS3cur3P@ss\"}"
});
io:println("Secret value updated");
```

### Update Secret Metadata

Update the description or other metadata of a secret.

```ballerina
check smClient->updateSecret({
    secretId: "prod/database/credentials",
    description: "Updated production database credentials"
});
```

### Describe Secret

Get metadata about a secret without retrieving its value.

```ballerina
secretmanager:DescribeSecretResponse info =
    check smClient->describeSecret("prod/database/credentials");
io:println("Name: ", info.name);
io:println("Last Changed: ", info.lastChangedDate);
io:println("Last Accessed: ", info.lastAccessedDate);
```

### Delete Secret

Delete a secret with an optional recovery window.

```ballerina
// Delete with 30-day recovery window (default)
check smClient->deleteSecret("prod/old/credentials");

// Force delete immediately (no recovery)
check smClient->deleteSecret("prod/old/credentials",
    forceDeleteWithoutRecovery = true);

// Delete with custom recovery window (7-30 days)
check smClient->deleteSecret("prod/old/credentials",
    recoveryWindowInDays = 7);
```

## List Operations

### List Secrets

Enumerate all secrets with optional filtering.

```ballerina
secretmanager:SecretList secrets = check smClient->listSecrets();
foreach secretmanager:SecretEntry secret in secrets.secretList {
    io:println("Secret: ", secret.name, " | ARN: ", secret.arn);
}
```

**List with pagination:**

```ballerina
secretmanager:SecretList page = check smClient->listSecrets(maxResults = 10);
foreach secretmanager:SecretEntry s in page.secretList {
    io:println("Secret: ", s.name);
}
```

## Rotation Operations

### Rotate Secret

Trigger an immediate rotation of a secret.

```ballerina
check smClient->rotateSecret({
    secretId: "prod/database/credentials",
    rotationLambdaARN: "arn:aws:lambda:us-east-1:123456789012:function:RotateDBCredentials",
    rotationRules: {
        automaticallyAfterDays: 30
    }
});
io:println("Secret rotation initiated");
```

## Error Handling

```ballerina
import ballerina/log;

do {
    secretmanager:GetSecretValueResponse secret =
        check smClient->getSecretValue("nonexistent/secret");
} on fail error e {
    log:printError("Failed to retrieve secret", 'error = e);
}
```

### Common Error Scenarios

| Error | Cause | Resolution |
|---|---|---|
| `ResourceNotFoundException` | Secret does not exist | Verify secret name or ARN |
| `AccessDeniedException` | Insufficient IAM permissions | Update IAM policy |
| `DecryptionFailureException` | Cannot decrypt with current KMS key | Check KMS key permissions |
| `ResourceExistsException` | Secret with same name already exists | Use a different name or update existing |
| `InvalidRequestException` | Secret is scheduled for deletion | Cancel the deletion or use a different name |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
