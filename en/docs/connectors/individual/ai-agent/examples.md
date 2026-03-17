---
title: "AI Agent Framework - Examples"
description: "Code examples for the ballerinax/ai.agent connector."
---

# AI Agent Framework Examples

## Example 1: Simple Function Calling Agent

Build an agent with a single tool that retrieves product information.

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

isolated function getProductInfo(
    record {|string productId;|} params
) returns json|error {
    // Simulated product lookup
    map<json> products = {
        "P001": {"name": "Wireless Keyboard", "price": 49.99, "stock": 150},
        "P002": {"name": "USB-C Hub", "price": 34.99, "stock": 75},
        "P003": {"name": "Monitor Stand", "price": 89.99, "stock": 30}
    };
    json? product = products[params.productId];
    if product is () {
        return error("Product not found: " + params.productId);
    }
    return product;
}

public function main() returns error? {
    agent:Tool productTool = {
        name: "get_product_info",
        description: "Look up product details by product ID (e.g., P001, P002, P003)",
        parameters: {
            properties: {
                productId: {
                    'type: agent:STRING,
                    description: "The product identifier"
                }
            }
        },
        caller: getProductInfo
    };

    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:FunctionCallAgent myAgent = check new (model, productTool);

    string response = check myAgent->run(
        "What is the price and stock level for product P002?"
    );
    io:println(response);
}
```

## Example 2: Multi-Tool Agent

Create an agent with multiple tools for a customer support scenario.

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

isolated function lookupCustomer(
    record {|string email;|} params
) returns json|error {
    return {
        "name": "Alice Johnson",
        "email": params.email,
        "tier": "Gold",
        "accountId": "ACC-12345"
    };
}

isolated function getOrderHistory(
    record {|string accountId;|} params
) returns json|error {
    return [
        {"orderId": "ORD-001", "date": "2024-03-01", "total": 149.99, "status": "Delivered"},
        {"orderId": "ORD-002", "date": "2024-03-10", "total": 89.50, "status": "Shipped"}
    ];
}

isolated function createSupportTicket(
    record {|string accountId; string subject; string priority;|} params
) returns json|error {
    return {
        "ticketId": "TKT-9876",
        "accountId": params.accountId,
        "subject": params.subject,
        "priority": params.priority,
        "status": "Open"
    };
}

public function main() returns error? {
    agent:Tool customerTool = {
        name: "lookup_customer",
        description: "Find customer information by email address",
        parameters: {
            properties: {
                email: {'type: agent:STRING, description: "Customer email"}
            }
        },
        caller: lookupCustomer
    };

    agent:Tool orderTool = {
        name: "get_order_history",
        description: "Retrieve order history for a customer account",
        parameters: {
            properties: {
                accountId: {'type: agent:STRING, description: "Customer account ID"}
            }
        },
        caller: getOrderHistory
    };

    agent:Tool ticketTool = {
        name: "create_support_ticket",
        description: "Create a new support ticket for a customer",
        parameters: {
            properties: {
                accountId: {'type: agent:STRING, description: "Customer account ID"},
                subject: {'type: agent:STRING, description: "Ticket subject"},
                priority: {'type: agent:STRING, description: "Priority: low, medium, high"}
            }
        },
        caller: createSupportTicket
    };

    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:FunctionCallAgent myAgent = check new (
        model, customerTool, orderTool, ticketTool
    );

    string response = check myAgent->run(
        "Look up the customer with email alice@example.com, check their recent " +
        "orders, and create a high-priority support ticket about a missing delivery."
    );
    io:println(response);
}
```

## Example 3: HTTP API Tools with ToolKit

Use HTTP tools to integrate the agent with an external REST API.

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;
configurable string apiServiceUrl = ?;
configurable string apiToken = ?;

public function main() returns error? {
    agent:HttpTool listProducts = {
        name: "list_products",
        description: "List all available products with optional category filter",
        path: "/api/products",
        method: agent:GET,
        parameters: {
            "category": {
                location: agent:QUERY,
                schema: {
                    'type: agent:STRING,
                    description: "Product category to filter by"
                }
            }
        }
    };

    agent:HttpTool getProduct = {
        name: "get_product",
        description: "Get detailed information about a specific product",
        path: "/api/products/{productId}",
        method: agent:GET,
        parameters: {
            "productId": {
                location: agent:PATH,
                schema: {'type: agent:STRING}
            }
        }
    };

    agent:HttpTool createOrder = {
        name: "create_order",
        description: "Place a new order for a product",
        path: "/api/orders",
        method: agent:POST,
        requestBody: {
            mediaType: "application/json",
            schema: {
                properties: {
                    "productId": {'type: agent:STRING, description: "Product ID"},
                    "quantity": {'type: agent:INTEGER, description: "Order quantity"},
                    "customerEmail": {'type: agent:STRING, description: "Customer email"}
                }
            }
        }
    };

    // Group tools into a toolkit with shared configuration
    agent:HttpServiceToolKit ecommerceToolKit = check new (
        apiServiceUrl,
        [listProducts, getProduct, createOrder],
        {},
        {"Authorization": "Bearer " + apiToken}
    );

    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:FunctionCallAgent myAgent = check new (model, ecommerceToolKit);

    string response = check myAgent->run(
        "Find a laptop in the electronics category and place an order for 2 units for customer@example.com"
    );
    io:println(response);
}
```

## Example 4: OpenAPI-Driven Agent

Automatically build an agent from an OpenAPI specification file.

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

public function main() returns error? {
    // Extract tools from an OpenAPI spec
    string specPath = "./resources/petstore-openapi.json";
    agent:HttpApiSpecification apiSpec =
        check agent:extractToolsFromOpenApiSpecFile(specPath);

    string serviceUrl = apiSpec.serviceUrl ?: "https://petstore.example.com";
    agent:HttpTool[] tools = apiSpec.tools;

    // Create a toolkit with the extracted tools
    agent:HttpServiceToolKit petStoreToolKit = check new (serviceUrl, tools);

    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:FunctionCallAgent myAgent = check new (model, petStoreToolKit);

    string response = check myAgent->run(
        "List all available pets and find one that is a golden retriever"
    );
    io:println(response);
}
```

## Example 5: Agent as an HTTP Service

Expose an AI agent as a REST API endpoint.

```ballerina
import ballerina/http;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

isolated function getInventory(
    record {|string sku;|} params
) returns json|error {
    return {"sku": params.sku, "quantity": 42, "warehouse": "US-East"};
}

final agent:Tool inventoryTool = {
    name: "check_inventory",
    description: "Check inventory levels for a product SKU",
    parameters: {
        properties: {
            sku: {'type: agent:STRING, description: "Product SKU code"}
        }
    },
    caller: getInventory
};

type AgentRequest record {|
    string query;
|};

type AgentResponse record {|
    string answer;
|};

service /api on new http:Listener(8080) {

    resource function post agent(AgentRequest payload) returns AgentResponse|error {
        agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
        agent:FunctionCallAgent myAgent = check new (model, inventoryTool);

        string answer = check myAgent->run(payload.query);
        return {answer};
    }
}
```

## Example 6: ReAct Agent with Reasoning Trace

Use the ReAct agent pattern to see the reasoning process.

```ballerina
import ballerina/io;
import ballerinax/ai.agent;

configurable string openAiApiKey = ?;

isolated function calculateShipping(
    record {|string destination; decimal weight;|} params
) returns json|error {
    decimal rate = params.weight * 2.5d;
    return {"destination": params.destination, "weight": params.weight, "cost": rate};
}

isolated function checkDeliveryTime(
    record {|string destination;|} params
) returns string|error {
    return "Estimated delivery to " + params.destination + ": 3-5 business days";
}

public function main() returns error? {
    agent:Tool shippingTool = {
        name: "calculate_shipping",
        description: "Calculate shipping cost based on destination and weight in kg",
        parameters: {
            properties: {
                destination: {'type: agent:STRING, description: "Shipping destination city"},
                weight: {'type: agent:NUMBER, description: "Package weight in kilograms"}
            }
        },
        caller: calculateShipping
    };

    agent:Tool deliveryTool = {
        name: "check_delivery_time",
        description: "Check estimated delivery time for a destination",
        parameters: {
            properties: {
                destination: {'type: agent:STRING, description: "Destination city"}
            }
        },
        caller: checkDeliveryTime
    };

    // Use ReAct agent for visible reasoning
    agent:ChatGptModel model = check new ({auth: {token: openAiApiKey}});
    agent:ReActAgent myAgent = check new (model, shippingTool, deliveryTool);

    string response = check myAgent->run(
        "I need to ship a 5kg package to Tokyo. What will it cost and how long will it take?"
    );
    io:println(response);
}
```

## Related

- [Overview](overview) -- Agent architecture and concepts
- [Setup Guide](setup) -- Configuration and LLM provider setup
- [Actions Reference](actions) -- Full API reference
