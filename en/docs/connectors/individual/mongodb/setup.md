---
title: "MongoDB - Setup"
description: "How to set up and configure the ballerinax/mongodb connector."
---

# MongoDB Setup

## Prerequisites

- WSO2 Integrator / BI (VS Code extension installed)
- Ballerina Swan Lake Update 12 or later
- A running MongoDB server (3.6+) or MongoDB Atlas account

## Step 1: Add Dependencies

### Import the MongoDB Package

```ballerina
import ballerinax/mongodb;
```

No separate driver import is needed -- the MongoDB connector bundles the required driver internally.

## Step 2: Set Up MongoDB

### Option A: Local MongoDB Server

1. Download and install MongoDB Community Edition from the [MongoDB download center](https://www.mongodb.com/try/download/community)
2. Start the MongoDB server:

```bash
mongod --dbpath /data/db
```

3. Verify connectivity:

```bash
mongosh --eval "db.version()"
```

### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster
3. Under **Network Access**, add your IP address (or allow all IPs for development)
4. Under **Database Access**, create a database user
5. Click **Connect** > **Drivers** to get your connection string

## Step 3: Configure the Connection

### Using a Connection String (Recommended)

```ballerina
configurable string connectionString = ?;

mongodb:Client mongoClient = check new ({
    connection: connectionString
});
```

```toml
# Config.toml
# Local MongoDB
connectionString = "mongodb://localhost:27017"

# MongoDB Atlas
# connectionString = "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
```

### Using Connection Parameters

```ballerina
configurable string dbHost = "localhost";
configurable int dbPort = 27017;
configurable string dbUser = ?;
configurable string dbPassword = ?;

mongodb:Client mongoClient = check new ({
    connection: {
        serverAddress: {
            host: dbHost,
            port: dbPort
        },
        auth: <mongodb:ScramSha256AuthCredential>{
            username: dbUser,
            password: dbPassword,
            database: "admin"
        }
    }
});
```

```toml
# Config.toml
dbHost = "localhost"
dbPort = 27017
dbUser = "appUser"
dbPassword = "appPassword123"
```

### Using the Visual Designer

1. Open the **Visual Designer** in VS Code
2. Add a new **Connection** node
3. Search for **MongoDB**
4. Choose between connection string or individual parameters
5. Enter your connection details

## Step 4: Access a Database and Collection

After creating the client, access a database and collection:

```ballerina
mongodb:Database db = check mongoClient->getDatabase("myapp");
mongodb:Collection users = check db->getCollection("users");
```

## Step 5: Verify the Connection

```ballerina
import ballerinax/mongodb;
import ballerina/io;

configurable string connectionString = ?;

public function main() returns error? {
    mongodb:Client mongoClient = check new ({
        connection: connectionString
    });

    mongodb:Database db = check mongoClient->getDatabase("test");
    mongodb:Collection testCollection = check db->getCollection("test");

    // Insert a test document
    check testCollection->insertOne({test: true, timestamp: "2024-01-01"});
    io:println("MongoDB connection successful");

    mongoClient->close();
}
```

```bash
bal run
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Connection refused` | Verify MongoDB is running on the configured host/port |
| `Authentication failed` | Check username, password, and authentication database |
| `Network timeout` | For Atlas, ensure your IP is whitelisted in Network Access |
| `SSL handshake error` | For Atlas, ensure you are using `mongodb+srv://` protocol |
| `Namespace not found` | The database or collection does not exist yet; it will be created on first write |

## Next Steps

- [Actions Reference](actions) -- Available operations
- [Examples](examples) -- Code examples and patterns
