---
title: "Zoom - Examples"
description: "Code examples for the ballerinax/zoom connector."
---

# Zoom Examples

## Example 1: Schedule a Meeting with Registration

Create a scheduled meeting with registration enabled and register attendees.

```ballerina
import ballerina/io;
import ballerinax/zoom;

configurable string token = ?;

public function main() returns error? {
    zoom:Client zm = check new ({
        auth: { token: token }
    });

    // Create a meeting with registration required
    zoom:MeetingCreate201Response meeting = check zm->meetingCreate(
        userId = "me",
        payload = {
            topic: "Product Demo - Enterprise Features",
            'type: 2,
            start_time: "2025-07-20T15:00:00Z",
            duration: 45,
            timezone: "America/New_York",
            agenda: "Live demo of new enterprise integration features",
            settings: {
                approval_type: 0,
                registration_type: 1,
                host_video: true,
                participant_video: false,
                mute_upon_entry: true,
                waiting_room: true,
                auto_recording: "cloud"
            }
        }
    );

    int? meetingId = meeting?.id;
    io:println("Meeting created: ", meetingId);
    io:println("Join URL: ", meeting?.join_url);

    // Register attendees
    if meetingId is int {
        string[] attendeeEmails = [
            "alice@example.com",
            "bob@example.com",
            "charlie@example.com"
        ];

        foreach string email in attendeeEmails {
            zoom:MeetingRegistrantCreate201Response reg = check zm->meetingRegistrantCreate(
                meetingId = meetingId,
                payload = {
                    email: email,
                    first_name: email.substring(0, email.indexOf("@"))
                }
            );
            io:println("Registered: ", email, " -> ", reg?.join_url);
        }
    }
}
```

```toml
# Config.toml
token = "<your-access-token>"
```

## Example 2: Meeting Management REST API

Expose a REST service for managing Zoom meetings from internal systems.

```ballerina
import ballerina/http;
import ballerina/log;
import ballerinax/zoom;

configurable string token = ?;

final zoom:Client zmClient = check new ({
    auth: { token: token }
});

type CreateMeetingRequest record {|
    string topic;
    string startTime;
    int duration;
    string timezone;
    boolean enableRecording = false;
    boolean waitingRoom = true;
|};

service /api/v1 on new http:Listener(8090) {

    resource function post meetings(CreateMeetingRequest input)
            returns http:Created|http:InternalServerError {
        do {
            zoom:MeetingCreate201Response meeting = check zmClient->meetingCreate(
                userId = "me",
                payload = {
                    topic: input.topic,
                    'type: 2,
                    start_time: input.startTime,
                    duration: input.duration,
                    timezone: input.timezone,
                    settings: {
                        waiting_room: input.waitingRoom,
                        auto_recording: input.enableRecording ? "cloud" : "none"
                    }
                }
            );

            log:printInfo("Meeting created", meetingId = meeting?.id);
            return <http:Created>{
                body: {
                    meetingId: meeting?.id,
                    joinUrl: meeting?.join_url,
                    startUrl: meeting?.start_url
                }
            };
        } on fail error e {
            log:printError("Failed to create meeting", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to create Zoom meeting"}
            };
        }
    }

    resource function get meetings()
            returns json|http:InternalServerError {
        do {
            zoom:MeetingList meetings = check zmClient->meetings(
                userId = "me",
                'type = "scheduled"
            );
            return meetings.toJson();
        } on fail error e {
            log:printError("Failed to list meetings", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to list meetings"}
            };
        }
    }

    resource function delete meetings/[int meetingId]()
            returns http:NoContent|http:InternalServerError {
        do {
            check zmClient->meetingDelete(meetingId = meetingId);
            log:printInfo("Meeting deleted", meetingId = meetingId);
            return <http:NoContent>{};
        } on fail error e {
            log:printError("Failed to delete meeting", 'error = e);
            return <http:InternalServerError>{
                body: {message: "Failed to delete meeting"}
            };
        }
    }
}
```

## Example 3: Webinar Setup with Panelists

Create a webinar, add panelists, and set up registration.

```ballerina
import ballerina/io;
import ballerinax/zoom;

configurable string token = ?;

type Panelist record {|
    string name;
    string email;
|};

public function main() returns error? {
    zoom:Client zm = check new ({
        auth: { token: token }
    });

    // Create a webinar
    zoom:WebinarCreate201Response webinar = check zm->webinarCreate(
        userId = "me",
        payload = {
            topic: "API Integration Best Practices 2025",
            'type: 5,
            start_time: "2025-08-15T14:00:00Z",
            duration: 120,
            timezone: "America/Los_Angeles",
            settings: {
                approval_type: 0,
                registration_type: 1,
                auto_recording: "cloud",
                panelists_video: true,
                practice_session: true
            }
        }
    );

    int? webinarId = webinar?.id;
    io:println("Webinar created: ", webinarId);

    // Add panelists
    if webinarId is int {
        Panelist[] panelists = [
            {name: "Dr. Sarah Chen", email: "sarah.chen@example.com"},
            {name: "James Park", email: "james.park@example.com"},
            {name: "Maria Lopez", email: "maria.lopez@example.com"}
        ];

        check zm->webinarPanelistCreate(
            webinarId = <int:Signed32>webinarId,
            payload = {
                panelists: from Panelist p in panelists
                    select {name: p.name, email: p.email}
            }
        );
        io:println("Panelists added successfully");
    }
}
```

## Example 4: Recording Report Extractor

Retrieve cloud recordings for a date range and generate a summary.

```ballerina
import ballerina/io;
import ballerinax/zoom;

configurable string token = ?;

public function main() returns error? {
    zoom:Client zm = check new ({
        auth: { token: token }
    });

    // List all cloud recordings for June 2025
    zoom:RecordingList recordings = check zm->recordingsList(
        userId = "me",
        'from = "2025-06-01",
        to = "2025-06-30"
    );

    io:println("=== Recording Summary - June 2025 ===");
    io:println(string `Total recordings: ${recordings?.total_records ?: 0}`);
    io:println("");

    zoom:RecordingMeeting[]? meetingRecordings = recordings?.meetings;
    if meetingRecordings is zoom:RecordingMeeting[] {
        foreach zoom:RecordingMeeting rec in meetingRecordings {
            io:println(string `Meeting: ${rec?.topic ?: "Untitled"}`);
            io:println(string `  Date: ${rec?.start_time ?: "N/A"}`);
            io:println(string `  Duration: ${rec?.duration ?: 0} minutes`);

            zoom:RecordingFile[]? files = rec?.recording_files;
            if files is zoom:RecordingFile[] {
                foreach zoom:RecordingFile f in files {
                    io:println(string `  File: ${f?.file_type ?: ""} (${f?.file_size ?: 0} bytes)`);
                }
            }
            io:println("");
        }
    }
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Actions Reference](actions)
