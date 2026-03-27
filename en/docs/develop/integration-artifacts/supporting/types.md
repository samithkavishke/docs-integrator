---
title: Types
description: Define shared data structures with record types, enums, service classes, union types, and array types for type-safe integrations.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Types

Type artifacts define the data structures used throughout your integration. They ensure type safety across services, event handlers, and transformations. Define types in dedicated `.bal` files and reuse them across all artifacts in your project.

## Adding a type

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Types listed](/img/develop/integration-artifacts/supporting/types/step-1.png)

2. Click **+** next to **Types** in the sidebar (or click **+ Add Type** from the Types canvas).

3. In the **New Type** panel, choose **Create from scratch** or **Import**.

   ![New Type creation form showing Kind and Name fields](/img/develop/integration-artifacts/supporting/types/step-2.png)

   | Field | Description |
   |---|---|
   | **Kind** | The type kind: **Record**, **Enum**, **Service Class**, **Union**, or **Array**. |
   | **Name** | A unique name for the type (for example, `OrderRequest`). |

   The remaining fields change based on the selected **Kind**. See [Type kinds](#type-kinds) for the options available for each type.

4. Click **Save**. The type is added to your project and appears in the type diagram.

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// types.bal

type OrderRequest record {|
    string customerId;
    LineItem[] items;
    Address shippingAddress;
    string? couponCode;
|};

type LineItem record {|
    string productId;
    string productName;
    int quantity;
    decimal unitPrice;
|};

type Address record {|
    string street;
    string city;
    string state;
    string zipCode;
    string country;
|};
```

</TabItem>
</Tabs>

## Type diagram

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

Click **View Type Diagram** (or the diagram icon) next to **Types** in the sidebar to open the visual type diagram. The canvas renders all types in your project as nodes, with arrows showing relationships between record types and their nested fields.

![Type diagram canvas showing the visual representation of types in the project](/img/develop/integration-artifacts/supporting/types/step-3.png)

Use the toolbar buttons at the bottom left to zoom in, zoom out, fit the diagram to the screen, or export it as an image.

</TabItem>
<TabItem value="code" label="Ballerina Code">

Type relationships are expressed through field type references. A record that contains another record as a field creates an implicit association in the diagram:

```ballerina
type OrderRequest record {|
    string customerId;
    LineItem[] items;      // references LineItem
    Address shippingAddress; // references Address
|};
```

</TabItem>
</Tabs>

## Type kinds

### Records

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

Select **Record** from the **Kind** dropdown to define a structured type with named fields.

![Record type form showing fields and advanced options](/img/develop/integration-artifacts/supporting/types/record-form.png)

**Fields** — click **+** to add fields. Each field has:

| Option | Description |
|---|---|
| **Name** | The field name. |
| **Type** | The field type (for example, `string`, `int`, or a custom record type). |
| **{ }** | Toggle JSON literal representation for the field. |
| **?** | Mark the field as optional (nullable). |
| **Default Value** | Expand the field to set a default value. |
| **Description** | Expand the field to add a description. |
| **Readonly** | Expand the field to mark it as readonly. |

**Advanced Options**:

| Option | Description |
|---|---|
| **Allow Additional Fields** | Makes it an open record that accepts extra fields beyond those defined. |
| **Is Readonly Type** | Marks the entire record as immutable. |
| **Accessible by Other Integrations** | Exports the type for use in other integration projects. |

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// Closed record — no extra fields permitted
type OrderRequest record {|
    string customerId;
    LineItem[] items;
    Address shippingAddress;
    string? couponCode;
|};
```

</TabItem>
</Tabs>

### Enums

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

Select **Enum** from the **Kind** dropdown to define a fixed set of string values.

![Enum type form showing members](/img/develop/integration-artifacts/supporting/types/enum-form.png)

**Members** — click **+** to add members. Each member has:

| Option | Description |
|---|---|
| **Member name** | The enum member name (for example, `PENDING`). |
| **Constant Expression** | Expand the member to set a custom string value for the enum member. |

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
enum OrderStatus {
    PENDING,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
```

</TabItem>
</Tabs>

### Unions

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

Select **Union** from the **Kind** dropdown to allow a value to be one of several types.

![Union type form showing members and advanced options](/img/develop/integration-artifacts/supporting/types/union-form.png)

**Members** — click **+** to add member types. Each member has:

| Option | Description |
|---|---|
| **Enter type** | The type to include in the union (for example, `CreditCard`, `string`). |

**Advanced Options**:

| Option | Description |
|---|---|
| **Is Readonly Type** | Marks the union as immutable. |
| **Accessible by Other Integrations** | Exports the type for use in other integration projects. |

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
type PaymentMethod CreditCard|BankTransfer|DigitalWallet;

type CreditCard record {|
    string cardNumber;
    string expiryDate;
    string cvv;
|};

type BankTransfer record {|
    string bankName;
    string accountNumber;
    string routingNumber;
|};

type DigitalWallet record {|
    string provider;
    string walletId;
|};
```

</TabItem>
</Tabs>

### Service classes

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

Select **Service Class** from the **Kind** dropdown to define a class with service-specific behavior. Service classes are used for GraphQL object types.

![Service Class type form showing resource methods](/img/develop/integration-artifacts/supporting/types/service-class-form.png)

**Resource Methods** — click **+** to add methods. Each method has:

| Option | Description |
|---|---|
| **Name** | The resource method name. |
| **Return type** | The return type of the method (for example, `string`, `error?`). |
| **+ Add Parameter** | Expand the method to add parameters, each with a Parameter Name, Parameter Type, and optional Default Value. |

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
service class NotificationService {
    private final string endpoint;

    function init(string endpoint) {
        self.endpoint = endpoint;
    }

    remote function sendNotification(string message) returns error? {
        // notification logic
    }
}
```

</TabItem>
</Tabs>

### Arrays

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

Select **Array** from the **Kind** dropdown to define a named array type.

![Array type form showing type and size fields](/img/develop/integration-artifacts/supporting/types/array-form.png)

| Option | Description |
|---|---|
| **Type of the Array** (required) | The element type of the array (for example, `string`, `LineItem`). |
| **Size of the Array** | Optional fixed size constraint for the array. |

**Advanced Options**:

| Option | Description |
|---|---|
| **Is Readonly Type** | Marks the array as immutable. |
| **Accessible by Other Integrations** | Exports the type for use in other integration projects. |

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
type OrderItems LineItem[];

type LineItem record {|
    string productId;
    string productName;
    int quantity;
    decimal unitPrice;
|};
```

</TabItem>
</Tabs>

## Best practices

| Practice | Description |
|---|---|
| **Closed records** | Use `record {\| ... \|}` to restrict fields to only those defined |
| **Dedicated files** | Keep type definitions in separate `types.bal` files |
| **Descriptive names** | Name types after their domain concept (for example, `OrderRequest`, not `Data`) |
| **Reuse across artifacts** | Define types once and import them in services, event handlers, and functions |
