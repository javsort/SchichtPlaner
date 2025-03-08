# Active endpoints guide + the expected body formats to test
- Login
```
Method: POST
Endpoint: `/api/auth/login`
Headers: None
Body:
{
    "email": "admin@example.com",
    "password": "admin123"
}
```

- Get Users by Id:
```
Method: GET
Endpoint: `/api/auth/users/${id}`
Headers:
    - Authorization : `Bearer <encrypted ticket>`
Body: None
```

- Delete user by Id:
```
Method: DELETE
Endpoint: `/api/auth/users/${id}`
Headers:
    - Authorization : `Bearer <encrypted ticket>`
Body: None
```