---
sidebar_position: 1
title: Built-in Try-It Tool
description: Send test requests to running services directly from the IDE.
---

# Built-in Try-It Tool

The Try-It tool lets you send HTTP requests to your running services without leaving VS Code. It auto-detects your service endpoints and provides a graphical interface for composing requests, setting headers, and inspecting responses.

## Opening the Try-It Tool

There are several ways to launch Try-It in VS Code:

1. **CodeLens link** -- When you open a Ballerina service file, a **Try It** CodeLens link appears above each service definition. Click it to open the Try-It panel for that service.
2. **Command Palette** -- Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on macOS) and search for **Ballerina: Try It** to launch the tool.
3. **Editor context menu** -- Right-click inside a service definition and select **Try It** from the context menu.

:::note
Your service must be running before you can send requests. Start the service by clicking **Run** in VS Code or executing `bal run` in the terminal.
:::

## Sending Requests to HTTP Services

Once the Try-It panel opens, it lists all resource functions defined in your service. Select an endpoint to compose a request.

### Selecting an Endpoint

The tool reads your service definition and presents each resource function as a selectable endpoint. For a service like:

```ballerina
import ballerina/http;

service /api on new http:Listener(9090) {

    resource function get orders() returns json[] {
        return [{orderId: "ORD-001", status: "pending"}];
    }

    resource function post orders(http:Request req) returns json|error {
        json payload = check req.getJsonPayload();
        return {orderId: "ORD-002", status: "created"};
    }

    resource function get orders/[string id]() returns json {
        return {orderId: id, status: "completed"};
    }
}
```

The Try-It panel displays three endpoints: `GET /api/orders`, `POST /api/orders`, and `GET /api/orders/{id}`.

### Setting Path Parameters

For endpoints with path parameters (such as `/api/orders/{id}`), the Try-It tool displays input fields where you fill in each parameter value before sending the request.

### Configuring Headers

Add custom request headers using the **Headers** section in the Try-It panel. Common use cases include:

- `Authorization` -- Bearer tokens or basic auth credentials for secured endpoints.
- `Content-Type` -- Override the default content type when needed.
- Custom headers required by your service logic.

### Composing the Request Body

For `POST`, `PUT`, and `PATCH` methods, the Try-It tool provides a body editor. The tool auto-generates a sample payload based on your resource function's parameter types.

```json
{
    "itemName": "Laptop Stand",
    "quantity": 2,
    "unitPrice": 29.99
}
```

Edit the generated payload to match your test scenario, then click **Send**.

### Adding Query Parameters

For endpoints that accept query parameters, the Try-It tool displays dedicated input fields. For example, a resource function `resource function get orders(string? status)` shows a `status` field in the panel.

## Viewing Responses

After sending a request, the response panel displays:

- **Status code** -- The HTTP status code (e.g., `200 OK`, `404 Not Found`).
- **Response body** -- Formatted JSON, XML, or plain text output with syntax highlighting.
- **Response headers** -- All headers returned by the service.
- **Elapsed time** -- How long the request took, useful for spotting performance issues.

## Testing with Different Content Types

The Try-It tool supports multiple content types for request bodies:

| Content Type                  | Use Case                          |
|-------------------------------|-----------------------------------|
| `application/json`            | JSON payloads (default)           |
| `application/xml`             | XML message payloads              |
| `application/x-www-form-urlencoded` | Form submissions           |
| `multipart/form-data`         | File uploads with form fields     |
| `text/plain`                  | Plain text messages               |

Select the appropriate content type from the dropdown before composing your request body.

## Testing Event-Driven Integrations

For services that use WebSocket or other event-driven patterns, the Try-It tool allows you to simulate events. Connect to a WebSocket endpoint and send messages directly from the panel to verify your event handler logic processes messages correctly.

## Testing Automations

WSO2 Integrator automations (scheduled tasks and event-triggered flows) can be tested by triggering them manually:

1. Open the automation source file in VS Code.
2. Click the **Run** CodeLens above the automation definition.
3. The automation executes once immediately, and you can inspect the output in the terminal or debug console.

This avoids waiting for a scheduled trigger during development.

## Tips for Effective Try-It Testing

- **Start your service first** -- Try-It cannot send requests to a service that is not running.
- **Use the auto-generated payloads** as a starting point and modify specific fields for your test scenario.
- **Test error paths** -- Send malformed payloads or missing required fields to verify your error handling.
- **Check response headers** -- Verify that your service returns correct `Content-Type`, caching, and CORS headers.
- **Combine with debugging** -- Set breakpoints in your service code, then send a request via Try-It to step through the execution.

## What's Next

- [Unit Testing](unit-testing.md) -- Automated test suites with assertions
- [Debugging in VS Code](debugging.md) -- Step through code while testing with Try-It
