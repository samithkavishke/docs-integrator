---
title: "Snowflake - Setup"
description: "How to set up and configure the ballerinax/snowflake connector."
---

# Snowflake Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A Snowflake account (sign up at [snowflake.com](https://signup.snowflake.com/))

## Step 1: Add Dependencies

### Import the Snowflake Package

```ballerina
import ballerinax/snowflake;
import ballerinax/snowflake.driver as _;
import ballerina/sql;
```

The `snowflake.driver` import bundles the Snowflake JDBC driver.

:::note
The Snowflake JDBC driver has a known compatibility issue with Java 16+. If you are using Java 16 or above, export the following environment variable before running:

```bash
export JDK_JAVA_OPTIONS="--add-opens java.base/java.nio=ALL-UNNAMED"
```

Additionally, set the `JDBC_QUERY_RESULT_FORMAT` property to `JSON` in your Snowflake options.
:::

## Step 2: Create a Warehouse and Database

1. Log in to the [Snowflake web interface](https://app.snowflake.com/)
2. Navigate to **Admin** > **Warehouses** and create a warehouse (or use an existing one)
3. Navigate to **Data** > **Databases** and create a database
4. Optionally, set a default warehouse in your user profile

## Step 3: Configure the Connection

### Password Authentication (Recommended for Getting Started)

```ballerina
configurable string accountIdentifier = ?;
configurable string user = ?;
configurable string password = ?;

snowflake:Client sfClient = check new (accountIdentifier, user, password);
```

```toml
# Config.toml
accountIdentifier = "xy12345.us-east-1"
user = "my_user"
password = "my_secure_password"
```

The `accountIdentifier` is the portion of your Snowflake URL before `.snowflakecomputing.com`. For example, if your URL is `xy12345.us-east-1.snowflakecomputing.com`, the account identifier is `xy12345.us-east-1`.

### With Warehouse, Database, and Schema

```ballerina
snowflake:Options sfOptions = {
    properties: {
        "warehouse": "COMPUTE_WH",
        "db": "MY_DATABASE",
        "schema": "PUBLIC"
    }
};

snowflake:Client sfClient = check new (
    accountIdentifier, user, password, sfOptions
);
```

### Key-Pair Authentication

For production environments, key-pair authentication provides stronger security.

1. Generate an RSA key pair:

```bash
openssl genrsa 2048 | openssl pkcs8 -topk8 -v2 aes256 -inform PEM -out key-aes256.p8
openssl rsa -in key-aes256.p8 -pubout -out key-aes256.pub
```

2. Assign the public key to a Snowflake user:

```sql
ALTER USER my_user SET RSA_PUBLIC_KEY='MIIBIjANBgkqh...';
```

3. Configure the Ballerina client:

```ballerina
configurable string accountIdentifier = ?;
configurable string user = ?;
configurable string privateKeyPath = ?;
configurable string privateKeyPassphrase = ?;

snowflake:AuthConfig authConfig = {
    user: user,
    privateKeyPath: privateKeyPath,
    privateKeyPassphrase: privateKeyPassphrase
};

snowflake:Options sfOptions = {
    properties: {
        "warehouse": "COMPUTE_WH",
        "db": "MY_DATABASE"
    }
};

snowflake:AdvancedClient sfClient = check new (
    accountIdentifier, authConfig, sfOptions
);
```

```toml
# Config.toml
accountIdentifier = "xy12345.us-east-1"
user = "my_user"
privateKeyPath = "./keys/key-aes256.p8"
privateKeyPassphrase = "my_passphrase"
```

### Java 16+ Workaround

```ballerina
snowflake:Options sfOptions = {
    properties: {
        "JDBC_QUERY_RESULT_FORMAT": "JSON",
        "warehouse": "COMPUTE_WH",
        "db": "MY_DATABASE"
    }
};
```

## Step 4: Verify the Connection

```ballerina
public function main() returns error? {
    snowflake:Client sfClient = check new (accountIdentifier, user, password);

    string version = check sfClient->queryRow(`SELECT CURRENT_VERSION()`);
    io:println("Snowflake version: ", version);

    check sfClient.close();
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Account identifier is invalid` | Verify your account identifier matches the Snowflake URL |
| `Incorrect username or password` | Check credentials in `Config.toml` |
| `Warehouse not found` | Ensure the warehouse exists and the user has access |
| `Database not found` | Verify database name and user permissions |
| `Java module access error` | Set `JDK_JAVA_OPTIONS` for Java 16+ compatibility |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
