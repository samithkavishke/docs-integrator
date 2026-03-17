---
title: "Azure Key Vault"
description: "Overview of the ballerinax/azure.keyvault connector for WSO2 Integrator."
---

# Azure Key Vault

| | |
|---|---|
| **Package** | [`ballerinax/azure.keyvault`](https://central.ballerina.io/ballerinax/azure.keyvault/latest) |
| **Version** | 1.6.0 |
| **Category** | Cloud Services - Security |
| **Ballerina Central** | [View on Central](https://central.ballerina.io/ballerinax/azure.keyvault/1.6.0) |
| **API Docs** | [API Reference](https://central.ballerina.io/ballerinax/azure.keyvault/1.6.0#functions) |

## Overview

The `ballerinax/azure.keyvault` connector provides programmatic access to Azure Key Vault from WSO2 Integrator. Azure Key Vault is a cloud service for securely storing and accessing secrets, encryption keys, and certificates. This connector enables you to manage secrets, keys, and certificates through the Azure Key Vault REST API v7.0.

## Key Capabilities

- **Secret Management** -- Create, read, update, delete, and list secrets
- **Key Management** -- Create, import, and manage cryptographic keys
- **Certificate Management** -- Store and manage X.509 certificates
- **Secret Versioning** -- Access specific versions of secrets and keys
- **Soft Delete and Recovery** -- Recover or purge deleted vault objects

## Use Cases

| Scenario | Description |
|---|---|
| Credential Management | Store and retrieve API keys, connection strings, and passwords |
| Configuration Security | Centralize sensitive configuration values outside application code |
| Key Rotation | Automate rotation of encryption keys and secrets |
| Certificate Lifecycle | Manage TLS/SSL certificates for services and applications |
| Cross-Service Secrets | Share secrets securely between integration services |

## Quick Start

```toml
[[dependency]]
org = "ballerinax"
name = "azure.keyvault"
version = "1.6.0"
```

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

// Retrieve a secret
keyvault:Secret secret = check vaultClient->getSecret("my-database-password");
```

## Compatibility

| Component | Version |
|---|---|
| Ballerina Language | Swan Lake 2201.4.1+ |
| Azure Key Vault REST API | v7.0 |
| WSO2 Integrator | Latest |

## Related Resources

- [Setup Guide](setup) -- Configure Azure AD and Key Vault access
- [Actions Reference](actions) -- All available operations
- [Examples](examples) -- Complete code examples
- [Ballerina Central Package Page](https://central.ballerina.io/ballerinax/azure.keyvault/1.6.0)
- [Azure Key Vault Documentation](https://learn.microsoft.com/en-us/azure/key-vault/)
