# Active endpoints guide + the expected body formats to test

- Hello
```
Method: GET
Endpoint: `/api/hello`
Headers: None
Body: None
```

- Test JWT ticket
```
Method: GET
Endpoint: `/api/test`
Headers:
    - Authorization: `Bearer <encrypted ticket>`
Body: None
```

- Requests to AUTH module
```
Method: As required per auth endpoint
Endpoint: `/api/auth/**`
Headers:
    - Authorization : `Bearer <encrypted ticket>`
Body: As required per auth endpoint

! - /api/auth/login & /api/auth/register do *NOT* require authorization header
```

- Requests to SCHEDULER module
```
Method: As required per scheduler endpoint
Endpoint: `/api/scheduler/**`
Headers:
    - Authorization : `Bearer <encrypted ticket>`
Body: As required per scheduler endpoint
```

- Requests to STATISTICS module
```
Method: As required per stats endpoint
Endpoint: `/api/stats/**`
Headers:
    - Authorization : `Bearer <encrypted ticket>`
Body: As required per stats endpoint
```
