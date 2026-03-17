---
title: Authentication Methods
description: OAuth 2.0, API Key, JWT, mTLS, and custom authentication for connectors.
---

# Authentication Methods

Configure authentication for your connector connections. Ballerina provides built-in support for all standard authentication mechanisms.

## OAuth 2.0

### Client Credentials Flow

Used for server-to-server integrations where no user context is needed:

```ballerina
import ballerina/http;
import ballerina/oauth2;

http:Client apiClient = check new ("https://api.example.com", {
    auth: {
        tokenUrl: "https://auth.example.com/oauth2/token",
        clientId: clientId,
        clientSecret: clientSecret,
        scopes: ["read", "write"]
    }
});
```

### Refresh Token Flow

Used when you have an initial refresh token (common with Salesforce, Google, Microsoft):

```ballerina
import ballerinax/salesforce;

salesforce:Client sf = check new ({
    baseUrl: "https://myorg.salesforce.com",
    auth: {
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://login.salesforce.com/services/oauth2/token"
    }
});
```

Ballerina automatically refreshes the access token when it expires — no manual token management needed.

### Authorization Code Flow

For applications that need user consent (less common in integration scenarios):

```ballerina
http:Client apiClient = check new ("https://api.example.com", {
    auth: {
        tokenUrl: "https://auth.example.com/oauth2/token",
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
        refreshUrl: "https://auth.example.com/oauth2/token"
    }
});
```

## API Key Authentication

### Header-Based API Key

```ballerina
http:Client api = check new ("https://api.example.com", {
    auth: {token: apiKey}  // Adds Authorization: Bearer <apiKey>
});

// Or use a custom header
final http:Client api = check new ("https://api.example.com");

json result = check api->get("/data", {"X-API-Key": apiKey});
```

### Query Parameter API Key

```ballerina
json result = check api->get("/data?api_key=" + apiKey);
```

## Basic Authentication

```ballerina
http:Client api = check new ("https://api.example.com", {
    auth: {
        username: username,
        password: password
    }
});
```

## JWT Authentication

### Validating Incoming JWTs (Service)

```ballerina
import ballerina/jwt;

listener http:Listener secureListener = new (9090, {
    secureSocket: {
        key: {certFile: "/certs/server.crt", keyFile: "/certs/server.key"}
    }
});

@http:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                issuer: "https://auth.example.com",
                audience: "my-integration",
                signatureConfig: {
                    jwksConfig: {
                        url: "https://auth.example.com/.well-known/jwks.json"
                    }
                }
            }
        }
    ]
}
service /api on secureListener {
    resource function get data() returns json {
        return {message: "Authenticated"};
    }
}
```

### Generating Outgoing JWTs (Client)

```ballerina
http:Client api = check new ("https://api.example.com", {
    auth: {
        username: clientId,
        issuer: "my-integration",
        audience: ["api.example.com"],
        keyId: "my-key-id",
        jwtId: "unique-jwt-id",
        customClaims: {"role": "admin"},
        expTime: 3600,
        signatureConfig: {
            config: {
                keyFile: "/certs/private.key"
            }
        }
    }
});
```

## Mutual TLS (mTLS)

```ballerina
// Client with mutual TLS
http:Client secureClient = check new ("https://api.example.com", {
    secureSocket: {
        key: {
            certFile: "/certs/client.crt",
            keyFile: "/certs/client.key"
        },
        cert: "/certs/ca.crt"
    }
});

// Service requiring client certificates
listener http:Listener mtlsListener = new (9443, {
    secureSocket: {
        key: {certFile: "/certs/server.crt", keyFile: "/certs/server.key"},
        mutualSsl: {
            verifyClient: http:REQUIRE,
            cert: "/certs/client-ca.crt"
        }
    }
});
```

## Storing Credentials Securely

### Config.toml (Development)

```toml
# Config.toml — never commit to version control
dbPassword = "my-secret-password"
apiKey = "sk-abc123..."
clientSecret = "oauth-client-secret"
```

### Environment Variables

```ballerina
import ballerina/os;

configurable string apiKey = os:getEnv("API_KEY");
```

### Kubernetes Secrets

```toml
# Config.toml mounted from a Kubernetes Secret
[ballerina.cloud]
    [ballerina.cloud.config.envs]
        DB_PASSWORD = {config_name = "db-secret", data = "password"}
```

## Best Practices

1. **Use `configurable` variables** for all credentials — never hardcode secrets in source code.
2. **Prefer OAuth 2.0 client credentials** for server-to-server integrations.
3. **Use mTLS** for high-security service-to-service communication.
4. **Rotate credentials** regularly and use short-lived tokens where possible.
5. **Store secrets in vault services** (HashiCorp Vault, AWS Secrets Manager) in production.

## What's Next

- [Connection Configuration](configuration.md) — Set up and manage connections
- [Error Handling per Connector](error-handling.md) — Handle authentication errors gracefully
