---
title: "Azure Key Vault - Actions"
description: "Available actions and operations for the ballerinax/azure.keyvault connector."
---

# Azure Key Vault Actions

The `ballerinax/azure.keyvault` package provides a client with operations to manage secrets, keys, and certificates in Azure Key Vault.

## Client Initialization

```ballerina
import ballerinax/azure.keyvault;

configurable string vaultUrl = ?;
configurable string tenantId = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

keyvault:Client vaultClient = check new ({
    vaultUrl: vaultUrl,
    tenantId: tenantId,
    clientId: clientId,
    clientSecret: clientSecret
});
```

## Secret Operations

### Set Secret

Create or update a secret in the vault.

```ballerina
keyvault:Secret result = check vaultClient->setSecret("db-password", "s3cur3P@ssw0rd!");
```

### Get Secret

Retrieve the latest version of a secret.

```ballerina
keyvault:Secret secret = check vaultClient->getSecret("db-password");
string secretValue = secret.value;
```

### Get Secret by Version

Retrieve a specific version of a secret.

```ballerina
keyvault:Secret secret = check vaultClient->getSecret("db-password", version = "a1b2c3d4");
```

### List Secrets

List all secrets in the vault (returns metadata, not values).

```ballerina
keyvault:SecretList secrets = check vaultClient->listSecrets();
foreach keyvault:SecretItem item in secrets.value {
    // item.id contains the secret identifier
}
```

### Update Secret Attributes

Update metadata and attributes of a secret without changing its value.

```ballerina
keyvault:SecretAttributes attributes = {
    enabled: true,
    expires: "2025-12-31T23:59:59Z"
};
check vaultClient->updateSecretAttributes("db-password", attributes);
```

### Delete Secret

Delete a secret from the vault (moves to soft-delete if enabled).

```ballerina
keyvault:DeletedSecret deleted = check vaultClient->deleteSecret("db-password");
```

### Recover Deleted Secret

Recover a soft-deleted secret back into the vault.

```ballerina
keyvault:Secret recovered = check vaultClient->recoverDeletedSecret("db-password");
```

### Purge Deleted Secret

Permanently remove a soft-deleted secret (irreversible).

```ballerina
check vaultClient->purgeDeletedSecret("db-password");
```

## Key Operations

### Create Key

Create a new cryptographic key in the vault.

```ballerina
keyvault:KeyCreateParameters params = {
    kty: "RSA",
    keySize: 2048
};
keyvault:Key key = check vaultClient->createKey("encryption-key", params);
```

### Get Key

Retrieve a key from the vault.

```ballerina
keyvault:Key key = check vaultClient->getKey("encryption-key");
```

### List Keys

List all keys in the vault.

```ballerina
keyvault:KeyList keys = check vaultClient->listKeys();
foreach keyvault:KeyItem item in keys.value {
    // item.kid contains the key identifier
}
```

### Delete Key

Delete a key from the vault.

```ballerina
keyvault:DeletedKey deleted = check vaultClient->deleteKey("encryption-key");
```

## Certificate Operations

### Get Certificate

Retrieve a certificate from the vault.

```ballerina
keyvault:Certificate cert = check vaultClient->getCertificate("tls-cert");
```

### List Certificates

List all certificates in the vault.

```ballerina
keyvault:CertificateList certs = check vaultClient->listCertificates();
foreach keyvault:CertificateItem item in certs.value {
    // item.id contains the certificate identifier
}
```

### Delete Certificate

Delete a certificate from the vault.

```ballerina
keyvault:DeletedCertificate deleted = check vaultClient->deleteCertificate("tls-cert");
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use `check` to propagate errors or `do/on fail` for localized handling:

```ballerina
import ballerina/log;

do {
    keyvault:Secret secret = check vaultClient->getSecret("my-secret");
    log:printInfo("Secret retrieved successfully");
} on fail error e {
    log:printError("Failed to retrieve secret", 'error = e);
}
```

### Common Error Scenarios

| Error | Cause |
|---|---|
| `SecretNotFound` | The specified secret name does not exist |
| `Unauthorized` (401) | Invalid or expired Azure AD credentials |
| `Forbidden` (403) | Insufficient access policy permissions |
| `Conflict` (409) | Secret is in a deleted state and needs recovery or purge |

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [API Reference on Ballerina Central](https://central.ballerina.io/ballerinax/azure.keyvault/1.6.0)
