---
title: Custom Connector Development
description: Build custom connectors when pre-built ones are not available.
---

# Custom Connector Development

Build your own connector when a pre-built one is not available for your target system. Ballerina connectors are standard Ballerina packages with a client object that wraps API calls.

## When to Build a Custom Connector

- No existing `ballerinax` package covers the target system
- You need to wrap an internal API with type-safe operations
- You want to simplify a complex API into domain-specific operations
- You need to bundle custom authentication logic

## Connector Architecture

A Ballerina connector consists of:

1. **Client record** — Connection configuration (URL, auth, timeouts)
2. **Client class** — Remote methods for each API operation
3. **Types** — Request/response records for type safety
4. **Error types** — Domain-specific error definitions

```
my-connector/
├── Ballerina.toml       # Package metadata
├── Package.md           # Package documentation
├── client.bal           # Client class with operations
├── types.bal            # Data types and records
├── errors.bal           # Custom error types
├── utils.bal            # Helper functions
└── tests/
    └── client_test.bal  # Tests for all operations
```

## Step 1: Create the Package

```bash
bal new my_connector --template lib
cd my_connector
```

Update `Ballerina.toml`:

```toml
[package]
org = "myorg"
name = "my_connector"
version = "1.0.0"
distribution = "2201.12.0"

[build-options]
observabilityIncluded = true
```

## Step 2: Define Types

```ballerina
// types.bal
public type ConnectionConfig record {|
    string baseUrl;
    string apiKey;
    decimal timeout = 30;
|};

public type Customer record {|
    string id?;
    string name;
    string email;
    string phone?;
|};

public type CustomerList record {|
    Customer[] data;
    int total;
    int page;
|};

public type CreateCustomerResponse record {|
    string id;
    string status;
|};
```

## Step 3: Define Error Types

```ballerina
// errors.bal
public type ConnectorError distinct error;
public type AuthenticationError distinct error<record {|int statusCode;|}>;
public type NotFoundError distinct error<record {|string resourceId;|}>;
public type RateLimitError distinct error<record {|int retryAfter;|}>;
```

## Step 4: Implement the Client

```ballerina
// client.bal
import ballerina/http;
import ballerina/log;

public isolated client class Client {
    private final http:Client httpClient;
    private final string apiKey;

    public function init(ConnectionConfig config) returns error? {
        self.httpClient = check new (config.baseUrl, {
            timeout: config.timeout
        });
        self.apiKey = config.apiKey;
    }

    // List customers
    remote function listCustomers(int page = 1, int pageSize = 20)
            returns CustomerList|ConnectorError {
        CustomerList|error result = self.httpClient->get(
            "/customers?page=" + page.toString() + "&limit=" + pageSize.toString(),
            {"X-API-Key": self.apiKey}
        );
        if result is error {
            return error ConnectorError("Failed to list customers", result);
        }
        return result;
    }

    // Get a single customer
    remote function getCustomer(string id) returns Customer|NotFoundError|ConnectorError {
        Customer|error result = self.httpClient->get(
            "/customers/" + id,
            {"X-API-Key": self.apiKey}
        );
        if result is http:ApplicationResponseError {
            if result.detail().statusCode == 404 {
                return error NotFoundError("Customer not found", resourceId = id);
            }
        }
        if result is error {
            return error ConnectorError("Failed to get customer", result);
        }
        return result;
    }

    // Create a customer
    remote function createCustomer(Customer customer)
            returns CreateCustomerResponse|ConnectorError {
        CreateCustomerResponse|error result = self.httpClient->post(
            "/customers", customer,
            {"X-API-Key": self.apiKey}
        );
        if result is error {
            return error ConnectorError("Failed to create customer", result);
        }
        return result;
    }

    // Delete a customer
    remote function deleteCustomer(string id) returns error? {
        http:Response response = check self.httpClient->delete(
            "/customers/" + id,
            headers = {"X-API-Key": self.apiKey}
        );
        if response.statusCode != 204 {
            return error ConnectorError("Failed to delete customer: HTTP " +
                response.statusCode.toString());
        }
    }
}
```

## Step 5: Write Tests

```ballerina
// tests/client_test.bal
import ballerina/test;

configurable string testApiKey = ?;
configurable string testBaseUrl = ?;

final Client testClient = check new ({
    baseUrl: testBaseUrl,
    apiKey: testApiKey
});

@test:Config {}
function testCreateAndGetCustomer() returns error? {
    // Create
    CreateCustomerResponse created = check testClient->createCustomer({
        name: "Test User",
        email: "test@example.com"
    });
    test:assertTrue(created.id.length() > 0);

    // Get
    Customer customer = check testClient->getCustomer(created.id);
    test:assertEquals(customer.name, "Test User");

    // Cleanup
    check testClient->deleteCustomer(created.id);
}
```

## Step 6: Build and Test

```bash
# Build the package
bal build

# Run tests
bal test

# Generate documentation
bal doc
```

## Step 7: Generate from OpenAPI (Optional)

If the target API has an OpenAPI specification, generate the connector automatically:

```bash
bal openapi -i api-spec.yaml --mode client -o generated/
```

This generates type-safe client code from the spec. See [Create from OpenAPI](create-from-openapi.md) for details.

## What's Next

- [Using Ballerina Libraries](ballerina-libraries.md) — Leverage existing packages
- [Publish to Ballerina Central](publish-to-central.md) — Share your connector
- [Create from OpenAPI](create-from-openapi.md) — Auto-generate from API specs
