---
title: "Azure Key Vault - Examples"
description: "Code examples for the ballerinax/azure.keyvault connector."
---

# Azure Key Vault Examples

## Example 1: Centralized Secret Management

Store and retrieve application secrets from Azure Key Vault to avoid hardcoding credentials.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure.keyvault;

configurable string vaultUrl = ?;
configurable string tenantId = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

public function main() returns error? {
    keyvault:Client vaultClient = check new ({
        vaultUrl: vaultUrl,
        tenantId: tenantId,
        clientId: clientId,
        clientSecret: clientSecret
    });

    // Store database credentials
    _ = check vaultClient->setSecret("db-host", "prod-db.example.com");
    _ = check vaultClient->setSecret("db-username", "app_user");
    _ = check vaultClient->setSecret("db-password", "s3cur3P@ssw0rd!");
    log:printInfo("Secrets stored successfully");

    // Retrieve secrets to build a connection string
    keyvault:Secret host = check vaultClient->getSecret("db-host");
    keyvault:Secret username = check vaultClient->getSecret("db-username");
    keyvault:Secret password = check vaultClient->getSecret("db-password");

    string connString = string `jdbc:mysql://${host.value}:3306/mydb?user=${username.value}`;
    io:println("Connection string built from vault secrets");
}
```

```toml
# Config.toml
vaultUrl = "https://my-vault.vault.azure.net"
tenantId = "<azure-tenant-id>"
clientId = "<azure-client-id>"
clientSecret = "<azure-client-secret>"
```

## Example 2: Secret Rotation Service

An HTTP service that rotates secrets on demand, creating new versions while keeping history.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerina/random;
import ballerinax/azure.keyvault;

configurable string vaultUrl = ?;
configurable string tenantId = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

final keyvault:Client vaultClient = check new ({
    vaultUrl: vaultUrl,
    tenantId: tenantId,
    clientId: clientId,
    clientSecret: clientSecret
});

service /secrets on new http:Listener(8080) {

    resource function post rotate/[string secretName]() returns json|error {
        // Generate a new random secret value
        string newValue = check generateRandomSecret(32);

        // Setting a secret creates a new version automatically
        keyvault:Secret updated = check vaultClient->setSecret(secretName, newValue);
        log:printInfo("Secret rotated", secretName = secretName);

        return {
            secretName: secretName,
            version: updated.id,
            message: "Secret rotated successfully"
        };
    }

    resource function get [string secretName]() returns json|error {
        keyvault:Secret secret = check vaultClient->getSecret(secretName);
        return {
            secretName: secretName,
            version: secret.id,
            enabled: true
        };
    }
}

function generateRandomSecret(int length) returns string|error {
    string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
    string result = "";
    foreach int i in 0 ..< length {
        int index = check random:createIntInRange(0, chars.length());
        result += chars.substring(index, index + 1);
    }
    return result;
}
```

## Example 3: Multi-Environment Configuration Loader

Load environment-specific secrets from Key Vault at application startup.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure.keyvault;

configurable string vaultUrl = ?;
configurable string tenantId = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;
configurable string environment = "dev";

type AppConfig record {|
    string dbConnectionString;
    string apiKey;
    string smtpPassword;
    string jwtSecret;
|};

public function main() returns error? {
    keyvault:Client vaultClient = check new ({
        vaultUrl: vaultUrl,
        tenantId: tenantId,
        clientId: clientId,
        clientSecret: clientSecret
    });

    // Load environment-prefixed secrets
    string prefix = environment + "-";
    AppConfig config = {
        dbConnectionString: (check vaultClient->getSecret(prefix + "db-connection")).value,
        apiKey: (check vaultClient->getSecret(prefix + "api-key")).value,
        smtpPassword: (check vaultClient->getSecret(prefix + "smtp-password")).value,
        jwtSecret: (check vaultClient->getSecret(prefix + "jwt-secret")).value
    };

    log:printInfo("Configuration loaded from Key Vault", environment = environment);
    io:println("Database host configured: ", config.dbConnectionString.substring(0, 20) + "...");
}
```

## Example 4: Vault Audit and Cleanup

List all secrets, identify expired ones, and clean up unused entries.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/azure.keyvault;

configurable string vaultUrl = ?;
configurable string tenantId = ?;
configurable string clientId = ?;
configurable string clientSecret = ?;

public function main() returns error? {
    keyvault:Client vaultClient = check new ({
        vaultUrl: vaultUrl,
        tenantId: tenantId,
        clientId: clientId,
        clientSecret: clientSecret
    });

    // List all secrets in the vault
    keyvault:SecretList secrets = check vaultClient->listSecrets();
    io:println("Total secrets in vault: ", secrets.value.length());

    foreach keyvault:SecretItem item in secrets.value {
        io:println("Secret: ", item.id);
    }

    // List all keys
    keyvault:KeyList keys = check vaultClient->listKeys();
    io:println("Total keys in vault: ", keys.value.length());

    // List all certificates
    keyvault:CertificateList certs = check vaultClient->listCertificates();
    io:println("Total certificates in vault: ", certs.value.length());

    // Delete a deprecated secret (soft delete)
    do {
        _ = check vaultClient->deleteSecret("deprecated-api-key");
        log:printInfo("Deprecated secret deleted");

        // Purge it permanently
        check vaultClient->purgeDeletedSecret("deprecated-api-key");
        log:printInfo("Deprecated secret purged permanently");
    } on fail error e {
        log:printWarn("Cleanup skipped", 'error = e);
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
