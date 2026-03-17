---
title: "ActiveCampaign - Examples"
description: "Code examples for the ballerinax/activecampaign connector."
---

# ActiveCampaign Examples

## Example 1: Contact Sync and Automation Trigger

Sync contacts from an external source and add them to a nurturing automation.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

type ExternalContact record {|
    string email;
    string firstName;
    string lastName;
    string company;
    string source;
|};

public function main() returns error? {
    activecampaign:Client ac = check new ({
        baseUrl: apiUrl,
        auth: { token: apiKey }
    });

    ExternalContact[] newContacts = [
        {email: "alice@example.com", firstName: "Alice", lastName: "Wang", company: "TechCorp", source: "webinar"},
        {email: "bob@example.com", firstName: "Bob", lastName: "Garcia", company: "DataInc", source: "ebook"},
        {email: "carol@example.com", firstName: "Carol", lastName: "Patel", company: "CloudCo", source: "webinar"}
    ];

    int automationId = 5; // Nurturing automation ID
    int webinarListId = 3;

    foreach ExternalContact c in newContacts {
        // Sync contact (creates or updates)
        json synced = check ac->syncContact({
            "contact": {
                "email": c.email,
                "firstName": c.firstName,
                "lastName": c.lastName
            }
        });

        string contactId = (check synced.contact.id).toString();
        log:printInfo("Contact synced", email = c.email, contactId = contactId);

        // Add to nurturing automation
        _ = check ac->addContactToAutomation({
            "contactAutomation": {
                "contact": contactId,
                "automation": automationId.toString()
            }
        });

        // Add to webinar list if source is webinar
        if c.source == "webinar" {
            _ = check ac->addContactToList({
                "contactList": {
                    "list": webinarListId.toString(),
                    "contact": contactId,
                    "status": 1
                }
            });
        }
    }

    io:println(string `Processed ${newContacts.length()} contacts`);
}
```

## Example 2: Lead Scoring API

Expose an API that captures lead activities and updates deals in ActiveCampaign.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

final activecampaign:Client acClient = check new ({
    baseUrl: apiUrl,
    auth: { token: apiKey }
});

type ActivityEvent record {|
    string email;
    string eventType;
    string? dealTitle;
    int? dealValue;
|};

service /api/activities on new http:Listener(8090) {

    resource function post .(ActivityEvent event) returns http:Ok|http:InternalServerError {
        do {
            // Sync the contact
            json contact = check acClient->syncContact({
                "contact": {
                    "email": event.email
                }
            });
            string contactId = (check contact.contact.id).toString();

            // Add tag based on event type
            string tagName = mapEventToTag(event.eventType);
            json tag = check acClient->createTag({
                "tag": {
                    "tag": tagName,
                    "tagType": "contact"
                }
            });

            // Create a deal if event warrants it
            if event.eventType == "demo_request" && event?.dealTitle is string {
                _ = check acClient->createDeal({
                    "deal": {
                        "title": <string>event?.dealTitle,
                        "value": event?.dealValue ?: 10000,
                        "currency": "usd",
                        "contact": contactId,
                        "pipeline": "1",
                        "stage": "1"
                    }
                });
                log:printInfo("Deal created for demo request", email = event.email);
            }

            return <http:Ok>{body: {message: "Activity processed"}};
        } on fail error e {
            log:printError("Activity processing failed", 'error = e);
            return <http:InternalServerError>{body: {message: e.message()}};
        }
    }
}

function mapEventToTag(string eventType) returns string {
    match eventType {
        "page_visit" => { return "Website Visitor"; }
        "ebook_download" => { return "Content Engaged"; }
        "webinar_attended" => { return "Webinar Attendee"; }
        "demo_request" => { return "Sales Qualified"; }
        _ => { return "Active Lead"; }
    }
}
```

## Example 3: Bulk Contact Import with Tags

Import a batch of contacts and apply segmentation tags.

```ballerina
import ballerina/io;
import ballerina/log;
import ballerinax/activecampaign;

configurable string apiUrl = ?;
configurable string apiKey = ?;

public function main() returns error? {
    activecampaign:Client ac = check new ({
        baseUrl: apiUrl,
        auth: { token: apiKey }
    });

    // Create segmentation tags
    map<string> tagIds = {};
    string[] tagNames = ["Enterprise", "Mid-Market", "SMB"];

    foreach string tagName in tagNames {
        json tag = check ac->createTag({
            "tag": {
                "tag": tagName,
                "tagType": "contact"
            }
        });
        tagIds[tagName] = (check tag.tag.id).toString();
    }

    // Import contacts with segments
    map<string>[] contacts = [
        {"email": "cto@bigcorp.com", "firstName": "Sarah", "lastName": "Chen", "segment": "Enterprise"},
        {"email": "vp@midsize.com", "firstName": "James", "lastName": "Park", "segment": "Mid-Market"},
        {"email": "owner@startup.com", "firstName": "Lisa", "lastName": "Ray", "segment": "SMB"}
    ];

    int successCount = 0;
    foreach map<string> c in contacts {
        do {
            json synced = check ac->syncContact({
                "contact": {
                    "email": c["email"],
                    "firstName": c["firstName"],
                    "lastName": c["lastName"]
                }
            });

            string contactId = (check synced.contact.id).toString();
            string segment = c["segment"] ?: "SMB";
            string? tagId = tagIds[segment];

            if tagId is string {
                _ = check ac->addTagToContact({
                    "contactTag": {
                        "contact": contactId,
                        "tag": tagId
                    }
                });
            }

            successCount += 1;
        } on fail error e {
            log:printError("Failed to import contact", email = c["email"], 'error = e);
        }
    }

    io:println(string `Import complete: ${successCount}/${contacts.length()} contacts`);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
