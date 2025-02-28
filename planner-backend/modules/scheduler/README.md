# Active endpoints guide + the expected body formats to test

All requests in this module **REQUIRE** the Authorization header by default

```
{ Authorization: "Bearer <yourJWTticket>" }
```

- Login
```
Method: POST
Endpoint: `/api/scheduler/shift-proposals/create`
Headers: check top of file
Body:
{
    "employeeId": 3,
    "proposedTitle": "Test Shift I",
    "proposedStartTime": "2025-02-26T03:00:00.000Z",
    "proposedEndTime": "2025-02-26T10:00:00.000Z",
    "status": "PROPOSED"
}
```

- Get Shift Proposals:
```
Method: GET
Endpoint: `/api/scheduler/shift-proposals`
Headers: check top of file
Body: None

!!! Requires Role_Admin or Role_ShiftSupervisor for access
```

- Approve Shift Proposal:
```
Method: PUT
Endpoint: `/api/scheduler/shift-proposals/{$proposal_id}/accept`
Headers: check top of file
Body: None

!!! Requires Role_Admin or Role_ShiftSupervisor for access
```