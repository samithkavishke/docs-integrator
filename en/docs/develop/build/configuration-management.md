---
sidebar_position: 9
title: Configuration Management
description: Manage environment-specific configuration with Config.toml, env vars, and secrets.
---

# Configuration Management

Configure your integrations differently for each environment -- development, testing, and production. Ballerina's `configurable` variables and `Config.toml` files provide a clean separation between code and configuration.

## Configurable Variables

Declare configurable variables in your Ballerina code. These can be overridden at runtime through configuration files or environment variables.

```ballerina
// With default values (optional in Config.toml)
configurable string dbHost = "localhost";
configurable int dbPort = 3306;
configurable string dbName = "mydb";

// Required values (must be provided in Config.toml)
configurable string dbPassword = ?;
configurable string apiKey = ?;

// Complex types
configurable string[] allowedOrigins = ["http://localhost:3000"];
configurable int maxRetries = 3;
configurable decimal timeoutSeconds = 30.0;
configurable boolean enableDebugLogging = false;
```

The `?` syntax marks a variable as required -- the application will not start if the value is not provided.

## Config.toml Overview

The `Config.toml` file supplies values for configurable variables at runtime. Place it in the project root or specify its path at startup.

```toml
# Config.toml

# Simple values
dbHost = "db.production.example.com"
dbPort = 5432
dbName = "integrations_prod"
dbPassword = "secure-password-here"
apiKey = "sk-prod-abc123"

# Arrays
allowedOrigins = ["https://app.example.com", "https://admin.example.com"]

# Numeric and boolean
maxRetries = 5
timeoutSeconds = 60.0
enableDebugLogging = false
```

### Module-Scoped Configuration

When your project has multiple modules, prefix variables with the module name.

```toml
# Config.toml for multi-module project
[myorg.order_service]
dbHost = "orders-db.example.com"
dbPort = 5432

[myorg.notification_service]
smtpHost = "smtp.example.com"
smtpPort = 587
```

## Environment-Specific Configurations

Maintain separate configuration files for each environment.

### Project Structure

```
my-integration/
  Ballerina.toml
  Config.toml              # Default / development config
  Config-staging.toml      # Staging overrides
  Config-prod.toml         # Production overrides
  main.bal
```

### Development Config

```toml
# Config.toml (development)
dbHost = "localhost"
dbPort = 3306
dbPassword = "dev-password"
apiKey = "sk-dev-test-key"
enableDebugLogging = true
maxRetries = 1
```

### Production Config

```toml
# Config-prod.toml (production)
dbHost = "db.production.example.com"
dbPort = 5432
dbPassword = "secure-prod-password"
apiKey = "sk-prod-live-key"
enableDebugLogging = false
maxRetries = 5
timeoutSeconds = 60.0
allowedOrigins = ["https://app.example.com"]
```

### Running with a Specific Configuration

Specify the configuration file at runtime:

```bash
# Development (uses default Config.toml)
bal run

# Staging
BAL_CONFIG_FILES=Config-staging.toml bal run

# Production
BAL_CONFIG_FILES=Config-prod.toml bal run
```

## Environment Variables

Override configurable variables with environment variables. This is useful for container deployments where configuration is injected through the environment.

```bash
# Environment variables override Config.toml values
export BAL_CONFIG_VAR_dbPassword="from-env-password"
export BAL_CONFIG_VAR_apiKey="from-env-api-key"
bal run
```

The precedence order (highest to lowest) is:

1. Command-line arguments
2. Environment variables
3. Config.toml values
4. Default values in code

## Handling Secrets and Sensitive Values

Never commit secrets to version control. Use these approaches for managing sensitive configuration.

### Required Variables Without Defaults

```ballerina
// These must be provided externally -- no defaults in code
configurable string dbPassword = ?;
configurable string jwtSecret = ?;
configurable string encryptionKey = ?;
```

### Record-Based Configuration

Group related configuration into records for better organization.

```ballerina
type DatabaseConfig record {|
    string host;
    int port;
    string name;
    string username;
    string password;
|};

type SmtpConfig record {|
    string host;
    int port;
    string username;
    string password;
|};

configurable DatabaseConfig database = ?;
configurable SmtpConfig smtp = ?;
```

The corresponding `Config.toml`:

```toml
[database]
host = "db.example.com"
port = 5432
name = "integrations"
username = "app_user"
password = "secure-password"

[smtp]
host = "smtp.example.com"
port = 587
username = "notifications@example.com"
password = "smtp-password"
```

## Best Practices

1. **Never hardcode secrets** -- Always use `configurable` variables with `= ?` for sensitive values.
2. **Use record types** for related configuration groups to keep `Config.toml` organized.
3. **Provide sensible defaults** for non-sensitive development values so developers can run locally without extra setup.
4. **Document required variables** -- List all configurable variables and their purpose in your project documentation.
5. **Validate configuration early** -- Check that required values are valid at startup rather than failing at runtime.
6. **Use environment variables in CI/CD** -- Inject secrets through the deployment pipeline rather than configuration files.

## What's Next

- [Working with Ballerina Pro-Code](ballerina-pro-code.md) -- Advanced coding patterns
- [Deploy & Operate: Environments](/docs/deploy-operate/deploy/environments) -- Production config management
