---
title: Publish to Ballerina Central
description: Package and publish your custom connector to Ballerina Central.
---

# Publish to Ballerina Central

Share your custom connector or library with the community by publishing it to [Ballerina Central](https://central.ballerina.io).

## Prerequisites

- A Ballerina Central account — sign up at [central.ballerina.io](https://central.ballerina.io)
- An access token from your Ballerina Central profile
- A complete Ballerina package with documentation and tests

## Step 1: Configure Your Access Token

Log in to [central.ballerina.io](https://central.ballerina.io), go to your profile, and copy your access token. Add it to `Settings.toml` in your home directory:

```toml
# ~/.ballerina/Settings.toml
[central]
accesstoken = "<your-access-token>"
```

## Step 2: Prepare Package Metadata

Update `Ballerina.toml` with complete metadata:

```toml
[package]
org = "myorg"
name = "my_connector"
version = "1.0.0"
distribution = "2201.12.0"
license = ["Apache-2.0"]
authors = ["Your Name"]
keywords = ["integration", "connector", "myservice"]
repository = "https://github.com/myorg/my-connector"
```

## Step 3: Write Package Documentation

Create a `Package.md` file in the project root. This becomes the package page on Central:

```markdown
# My Connector

Connect to MyService from Ballerina.

## Usage

    ```ballerina
    import myorg/my_connector;

    my_connector:Client client = check new ({
        baseUrl: "https://api.myservice.com",
        apiKey: apiKey
    });

    my_connector:Customer customer = check client->getCustomer("123");
    ```

## Features

- Type-safe CRUD operations
- Automatic pagination
- Configurable retry and timeout
```

## Step 4: Build and Validate

```bash
# Build the package
bal build

# Run all tests
bal test

# Generate API documentation
bal doc

# Create the distributable package
bal pack
```

Verify the `.bala` file was created in the `target/` directory.

## Step 5: Publish

```bash
bal push
```

The package is now available at `https://central.ballerina.io/<org>/<name>/<version>`.

## Versioning

Follow [Semantic Versioning](https://semver.org/):

- **Major** (2.0.0) — Breaking API changes
- **Minor** (1.1.0) — New features, backward-compatible
- **Patch** (1.0.1) — Bug fixes, backward-compatible

```bash
# To publish a new version, update Ballerina.toml and push
# version = "1.1.0"
bal push
```

## Pre-Release Versions

Publish pre-release versions for testing:

```toml
[package]
version = "1.1.0-beta.1"
```

## Deprecating Versions

If a version has bugs, deprecate it:

```bash
bal deprecate myorg/my_connector:1.0.0 --message "Use 1.0.1 instead"
```

## Best Practices

1. **Include comprehensive tests** — packages with good test coverage build trust.
2. **Document every public function** — Ballerina's doc generator creates API docs from code comments.
3. **Use semantic versioning strictly** — users depend on version compatibility.
4. **Include examples** — create an `examples/` directory with working samples.
5. **Add keywords** — helps users find your package through search.

## What's Next

- [Custom Connector Development](custom-development.md) — Build more connectors
- [Using Ballerina Libraries](ballerina-libraries.md) — Use community packages
