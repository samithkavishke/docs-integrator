---
sidebar_position: 3
title: XML Processing
description: Parse, construct, transform, and validate XML data.
---

# XML Processing

Work with XML data -- common in enterprise and legacy system integrations. Ballerina provides `xml` as a first-class type with native literal syntax, navigation, iteration, and conversion capabilities.

## XML Literals and Construction

Create XML values directly in Ballerina code using backtick templates. The `xml` type covers elements, text nodes, comments, and processing instructions.

```ballerina
import ballerina/io;

public function main() {
    // XML element
    xml greeting = xml `<greeting>Hello, World!</greeting>`;

    // Nested elements
    xml order = xml `<order id="ORD-100">
        <customer>Acme Corp</customer>
        <items>
            <item sku="WDG-01" qty="5"/>
            <item sku="GDG-02" qty="2"/>
        </items>
    </order>`;

    // XML with embedded expressions
    string name = "Globex Inc";
    int quantity = 10;
    xml dynamic = xml `<shipment>
        <recipient>${name}</recipient>
        <units>${quantity}</units>
    </shipment>`;

    io:println(dynamic);
}
```

### XML text and comments

```ballerina
// Text node
xml text = xml `Hello, World!`;

// Comment
xml comment = xml `<!--Processing complete-->`;

// Processing instruction
xml pi = xml `<?xml-stylesheet type="text/xsl" href="style.xsl"?>`;
```

## Navigating XML

Access child elements, attributes, and text content using Ballerina's XML navigation methods.

```ballerina
import ballerina/io;

public function main() {
    xml catalog = xml `<catalog>
        <product id="P1" category="electronics">
            <name>Widget</name>
            <price>29.99</price>
        </product>
        <product id="P2" category="tools">
            <name>Gadget</name>
            <price>49.99</price>
        </product>
    </catalog>`;

    // Get child elements by name
    xml products = catalog/<product>;

    // Get all children
    xml children = catalog/*;

    // Access element text content
    xml firstProduct = (catalog/<product>)[0];
    string productName = (firstProduct/<name>).data();
    io:println(productName); // Widget

    // Access attributes
    string? id = (firstProduct).getAttributes()["id"];
    io:println(id); // P1

    // Filter descendants
    xml names = catalog/**/<name>;
    io:println(names);
    // <name>Widget</name><name>Gadget</name>
}
```

## XML Namespaces

Handle namespaced XML using `xmlns` declarations in Ballerina.

```ballerina
public function main() {
    xmlns "http://example.com/orders" as ord;
    xmlns "http://example.com/common" as cmn;

    xml nsOrder = xml `<ord:order>
        <cmn:customer>Acme Corp</cmn:customer>
        <ord:total>1500.00</ord:total>
    </ord:order>`;

    // Navigate namespaced elements
    xml customer = nsOrder/<cmn:customer>;
}
```

## Iterating Over XML

Use `foreach` or query expressions to process XML sequences.

```ballerina
import ballerina/io;

public function main() {
    xml items = xml `<items>
        <item><sku>A1</sku><qty>3</qty></item>
        <item><sku>B2</sku><qty>7</qty></item>
        <item><sku>C3</sku><qty>1</qty></item>
    </items>`;

    // Iterate with foreach
    foreach xml item in items/<item> {
        string sku = (item/<sku>).data();
        string qty = (item/<qty>).data();
        io:println(string `SKU: ${sku}, Quantity: ${qty}`);
    }

    // Filter with query expressions
    xml highQty = from xml item in items/<item>
        let string qtyStr = (item/<qty>).data()
        let int qty = check int:fromString(qtyStr)
        where qty > 2
        select item;
}
```

## XML Mutation

Modify XML structures by setting children or attributes.

```ballerina
public function main() {
    xml doc = xml `<order><status>pending</status></order>`;

    // Replace children
    doc.setChildren(xml `<status>completed</status><updatedAt>2025-01-15</updatedAt>`);
}
```

## XML to Record Conversion

Use the `ballerina/data.xmldata` module to convert XML into typed Ballerina records for safer manipulation.

```ballerina
import ballerina/data.xmldata;
import ballerina/io;

type PurchaseOrder record {|
    string orderDate;
    ShipTo shipTo;
    Item[] item;
|};

type ShipTo record {|
    string name;
    string street;
    string city;
|};

type Item record {|
    @xmldata:Attribute
    string partNum;
    string productName;
    int quantity;
    decimal price;
|};

public function main() returns error? {
    xml po = xml `<PurchaseOrder orderDate="2025-03-15">
        <shipTo>
            <name>Acme Corp</name>
            <street>123 Main St</street>
            <city>Springfield</city>
        </shipTo>
        <item partNum="WDG-01">
            <productName>Widget</productName>
            <quantity>10</quantity>
            <price>29.99</price>
        </item>
    </PurchaseOrder>`;

    PurchaseOrder order = check xmldata:parseAsType(po);
    io:println(order.shipTo.name); // Acme Corp
}
```

## Record to XML Conversion

Convert Ballerina records back to XML using `xmldata:toXml()`.

```ballerina
import ballerina/data.xmldata;

type Invoice record {|
    string invoiceId;
    string customer;
    decimal total;
|};

public function main() returns error? {
    Invoice inv = {
        invoiceId: "INV-2001",
        customer: "Globex Inc",
        total: 1500.00
    };

    xml invoiceXml = check xmldata:toXml(inv);
    // Produces: <Invoice><invoiceId>INV-2001</invoiceId>...
}
```

## XML to JSON Conversion

Convert between XML and JSON using `xmldata:toJson()` and `xmldata:fromJson()`.

```ballerina
import ballerina/data.xmldata;
import ballerina/io;

public function main() returns error? {
    xml source = xml `<customer>
        <name>Acme Corp</name>
        <email>info@acme.com</email>
    </customer>`;

    // XML to JSON via record conversion
    record {string name; string email;} cust = check xmldata:parseAsType(source);
    json customerJson = cust.toJson();
    io:println(customerJson);

    // JSON to XML
    xml result = check xmldata:fromJson(customerJson);
    io:println(result);
}
```

## Best Practices

- **Use typed records** for XML processing whenever the schema is known -- this catches mapping errors at compile time
- **Prefer `data.xmldata` over manual navigation** for complex documents to reduce boilerplate
- **Handle namespaces explicitly** -- declare `xmlns` bindings at the top of functions that work with namespaced XML
- **Use query expressions** for filtering and transforming XML sequences instead of manual loops

## What's Next

- [CSV & Flat File Processing](csv-flat-file.md) -- Tabular data formats
