# Enabled path access through the Logic Gate

- Requests to **AUTH** module
```
- Method: As required per auth endpoint
- Endpoint: `/api/auth/**`
- Headers:
    - Authorization : `Bearer <encrypted ticket>`
- Body: As required per auth endpoint

```
> [!IMPORTANT]
> `/api/auth/login`, `/api/auth/register` & `/api/auth/newcommer` do *NOT* require authorization header (these are for login and registration).

- Requests to **SCHEDULER** module
```
- Method: As required per scheduler endpoint
- Endpoint: `/api/scheduler/**`
- Headers:
    - Authorization : `Bearer <encrypted ticket>`
- Body: As required per scheduler endpoint
```

- Requests to **STATISTICS** module
```
- Method: As required per stats endpoint
- Endpoint: `/api/stats/**`
- Headers:
    - Authorization : `Bearer <encrypted ticket>`
- Body: As required per stats endpoint
```
