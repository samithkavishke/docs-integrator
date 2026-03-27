---
title: Data Mapper
description: Create reusable data mappers to transform data between different types, with visual drag-and-drop field mapping and auto-mapping.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Data Mapper

Data mapper artifacts define reusable transformations between data structures. Unlike inline data mappers created within a [flow diagram](../../transform/data-mapper.md), data mappers defined here are standalone artifacts that you can reference from multiple services and event handlers across your project.

## Reusable vs. inline data mappers

There are two ways to create a data mapper in WSO2 Integrator:

| Approach | Created from | Scope |
|---|---|---|
| **Reusable data mapper** (this page) | **Data Mappers** section in the sidebar or the **Artifacts** page | Standalone artifact that can be called from any service or event handler in the project. Mark it as **Public** to share across integrations. |
| **Inline data mapper** | Flow diagram within a service or event handler | Scoped to the specific function where it is defined. See [Visual Data Mapper](../../transform/data-mapper.md) for details. |

## Adding a data mapper

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

1. Open the **WSO2 Integrator: BI** sidebar in VS Code.

   ![WSO2 Integrator sidebar showing the project structure with Data Mappers listed](/img/develop/integration-artifacts/supporting/data-mapper/step-1.png)

2. Click **+** next to **Data Mappers** in the sidebar (or navigate to **Artifacts** > **Data Mapper** and click **+ Add Data Mapper**).

3. In the **Create New Data Mapper** form, fill in the following fields:

   ![Create New Data Mapper form showing Name, Inputs, and Output fields](/img/develop/integration-artifacts/supporting/data-mapper/creation-form.png)

   | Field | Description |
   |---|---|
   | **Data Mapper Name** | A unique name for the mapping function (for example, `transform`). Required. |
   | **Public** | Check **Make visible across the workspace** to make this mapper accessible from other integration projects. |
   | **Inputs** | The input variables of the data mapper. Click **+ Add Input** to define one or more source types. Each input has a name and a type (for example, a record type defined in your project). Use the edit and delete icons to modify or remove inputs. |
   | **Output** | The output type that the mapper produces (for example, a record type). Required. |

4. Click **Create**. The visual data mapper canvas opens.

</TabItem>
<TabItem value="code" label="Ballerina Code">

```ballerina
// mappers/order_mapper.bal

type ExternalOrder record {|
    string order_id;
    string customer_ref;
    ExternalLineItem[] line_items;
    string ship_to_address;
    string order_date;
|};

type ExternalLineItem record {|
    string sku;
    string description;
    int qty;
    string unit_price;
|};

function mapToInternalOrder(ExternalOrder ext) returns OrderRequest => {
    customerId: ext.customer_ref,
    items: from ExternalLineItem item in ext.line_items
        select {
            productId: item.sku,
            productName: item.description,
            quantity: item.qty,
            unitPrice: check decimal:fromString(item.unit_price)
        },
    shippingAddress: parseAddress(ext.ship_to_address),
    couponCode: ()
};
```

</TabItem>
</Tabs>

## Data mapper canvas

<Tabs>
<TabItem value="ui" label="Visual Designer" default>

After you create a data mapper, the canvas displays the input fields on the left and the output fields on the right. Connect fields by clicking a source field connector and then clicking the corresponding target field connector. A solid line appears between mapped fields.

![Data mapper canvas showing input fields on the left and output fields on the right with field connections](/img/develop/integration-artifacts/supporting/data-mapper/canvas.png)

### Mapping fields

- Click the circle connector next to an input field, then click the circle connector next to the target output field to create a mapping.
- Select a mapped output field to view or edit its transformation expression in the expression bar above the canvas.
- Click the three-dot menu on an output field for additional options.

### Sub mappings

Click **+ Add Sub Mapping** at the bottom of an input panel to add a sub mapping. Sub mappings let you include additional input sources (such as other record types or function results) in the same data mapper, enabling you to combine data from multiple sources into a single output.

### Toolbar

The canvas toolbar provides the following actions:

| Action | Description |
|---|---|
| **Undo / Redo** | Undo or redo the last mapping change. |
| **Format** | Auto-format the generated mapping code. |
| **Reset** | Reset all mappings in the canvas. |
| **Filter** | Filter input and output fields by name using the search dropdown. |
| **Auto Map** | Automatically map fields between input and output types based on matching field names and compatible types. |
| **Configure** | Open the data mapper configuration to modify inputs, output, or other settings. |

</TabItem>
<TabItem value="code" label="Ballerina Code">

Every visual mapping produces a Ballerina expression-bodied function. You can switch freely between the visual mapper and the code editor — changes in one are reflected in the other.

```ballerina
function transform(ExternalOrder ext) returns OrderRequest => {
    customerId: ext.customer_ref,
    items: from ExternalLineItem item in ext.line_items
        select {
            productId: item.sku,
            productName: item.description,
            quantity: item.qty,
            unitPrice: check decimal:fromString(item.unit_price)
        },
    shippingAddress: parseAddress(ext.ship_to_address),
    couponCode: ()
};
```

</TabItem>
</Tabs>

## Best practices

| Practice | Description |
|---|---|
| **Typed input/output** | Use specific record types for source and target instead of generic types |
| **Reuse across artifacts** | Define data mappers as reusable artifacts when the same transformation is needed in multiple services |
| **Auto Map first** | Use **Auto Map** for initial field matching, then manually adjust remaining fields |
| **Expression mappings** | Use Ballerina expressions for inline transformations (for example, type conversion, string formatting) |
| **Reusable helpers** | Extract common transformations (for example, `parseAddress`) into shared [functions](./functions.md) |
