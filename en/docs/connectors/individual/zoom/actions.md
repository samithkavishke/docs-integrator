---
title: "Zoom - Actions"
description: "Available actions and operations for the ballerinax/zoom connector."
---

# Zoom Actions

The `ballerinax/zoom` package provides a client for interacting with the Zoom API v2, supporting meetings, webinars, users, and reporting operations.

## Client Initialization

```ballerina
import ballerinax/zoom;

configurable string token = ?;

zoom:Client zoom = check new ({
    auth: {
        token: token
    }
});
```

## Meeting Operations

### meetingCreate

Create a new meeting for a user.

```ballerina
zoom:MeetingCreate201Response meeting = check zoom->meetingCreate(
    userId = "me",
    payload = {
        topic: "Project Review",
        'type: 2,
        start_time: "2025-07-15T14:00:00Z",
        duration: 60,
        timezone: "America/New_York",
        password: "proj2025",
        agenda: "Review Q3 project milestones and deliverables",
        settings: {
            host_video: true,
            participant_video: false,
            mute_upon_entry: true,
            waiting_room: true,
            auto_recording: "cloud"
        }
    }
);

io:println("Join URL: ", meeting?.join_url);
io:println("Meeting ID: ", meeting?.id);
```

### meetings

List all meetings for a user.

```ballerina
zoom:MeetingList meetingList = check zoom->meetings(
    userId = "me",
    'type = "scheduled"
);

io:println("Scheduled meetings: ", meetingList?.total_records);
```

### meeting

Get details of a specific meeting.

```ballerina
zoom:MeetingFullMetadata meetingDetails = check zoom->meeting(
    meetingId = 1234567890
);

io:println("Topic: ", meetingDetails?.topic);
io:println("Start time: ", meetingDetails?.start_time);
```

### meetingUpdate

Update an existing meeting.

```ballerina
check zoom->meetingUpdate(
    meetingId = 1234567890,
    payload = {
        topic: "Updated: Project Review - Extended",
        duration: 90,
        settings: {
            auto_recording: "cloud"
        }
    }
);
```

### meetingDelete

Delete a meeting.

```ballerina
check zoom->meetingDelete(meetingId = 1234567890);
```

### meetingRegistrantCreate

Register an attendee for a meeting.

```ballerina
zoom:MeetingRegistrantCreate201Response registrant = check zoom->meetingRegistrantCreate(
    meetingId = 1234567890,
    payload = {
        email: "attendee@example.com",
        first_name: "Jane",
        last_name: "Smith"
    }
);

io:println("Registration link: ", registrant?.join_url);
```

## Webinar Operations

### webinarCreate

Create a webinar.

```ballerina
zoom:WebinarCreate201Response webinar = check zoom->webinarCreate(
    userId = "me",
    payload = {
        topic: "Integration Best Practices Webinar",
        'type: 5,
        start_time: "2025-08-01T16:00:00Z",
        duration: 90,
        timezone: "America/Chicago",
        settings: {
            approval_type: 0,
            registration_type: 1,
            auto_recording: "cloud",
            panelists_video: true
        }
    }
);

io:println("Webinar ID: ", webinar?.id);
```

### webinars

List webinars for a user.

```ballerina
zoom:WebinarList webinarList = check zoom->webinars(userId = "me");
```

### webinarRegistrantCreate

Register an attendee for a webinar.

```ballerina
zoom:WebinarRegistrantCreate201Response reg = check zoom->webinarRegistrantCreate(
    webinarId = 9876543210,
    payload = {
        email: "participant@example.com",
        first_name: "John",
        last_name: "Doe",
        org: "Acme Corp"
    }
);
```

### webinarPanelistCreate

Add panelists to a webinar.

```ballerina
check zoom->webinarPanelistCreate(
    webinarId = 9876543210,
    payload = {
        panelists: [
            {name: "Dr. Alice Chen", email: "alice@example.com"},
            {name: "Bob Martin", email: "bob@example.com"}
        ]
    }
);
```

## User Operations

### users

List users in the Zoom account.

```ballerina
zoom:UserList userList = check zoom->users(status = "active");
io:println("Active users: ", userList?.total_records);
```

### user

Get details of a specific user.

```ballerina
zoom:UserResponse userInfo = check zoom->user(userId = "me");
io:println("User: ", userInfo?.first_name, " ", userInfo?.last_name);
```

## Recording Operations

### recordingsList

List cloud recordings for a user.

```ballerina
zoom:RecordingList recordings = check zoom->recordingsList(
    userId = "me",
    'from = "2025-06-01",
    to = "2025-06-30"
);
```

### meetingRecordings

Get recordings for a specific meeting.

```ballerina
zoom:RecordingMeeting meetingRecordings = check zoom->meetingRecordings(
    meetingId = "1234567890"
);
```

## Error Handling

All operations return Ballerina's `error` type on failure. Use structured error handling:

```ballerina
do {
    zoom:MeetingCreate201Response meeting = check zoom->meetingCreate(
        userId = "me",
        payload = { topic: "Test", 'type: 1 }
    );
    io:println("Meeting created: ", meeting?.id);
} on fail error e {
    io:println("Error: ", e.message());
    log:printError("Zoom operation failed", 'error = e);
}
```

## Related

- [Overview](overview)
- [Setup Guide](setup)
- [Examples](examples)
- [Full API Reference](https://central.ballerina.io/ballerinax/zoom/latest#clients)
