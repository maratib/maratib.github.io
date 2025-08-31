---
title: RESTful Web Services
slug: guides/microservices/rest-full-services
description: RESTful Web Services
sidebar:
  order: 0
---

### 🔹 REST (`Representational` State Transfer)

* REST is an **architectural style** for building lightweight web services.
* REST APIs expose **resources** over HTTP using **standard verbs (GET, POST, PUT, DELETE)** and **URIs**.
* REST is often used to implement SOA or microservices in modern systems.

---

### 🔹 REST Principles (Constraints)

1. **Client-Server** separation
2. **Stateless** requests
3. **Cacheable** responses
4. **Uniform Interface** (resources via URIs, verbs for actions)
5. **Layered System** (intermediaries allowed)
6. **Resource-based** (everything is a resource, not a method)

---

### 🔹 HTTP Methods in REST

| Method      | Usage                       | Example           |
| ----------- | --------------------------- | ----------------- |
| **GET**     | Retrieve a resource         | `GET /users/1`    |
| **POST**    | Create a new resource       | `POST /users`     |
| **PUT**     | Update/replace a resource   | `PUT /users/1`    |
| **PATCH**   | Partially update a resource | `PATCH /users/1`  |
| **DELETE**  | Remove a resource           | `DELETE /users/1` |
| **OPTIONS** | List available operations   | `OPTIONS /users`  |
| **HEAD**    | Same as GET, but no body    | `HEAD /users/1`   |

---

### 🔹 Common HTTP Status Codes

**✅ Success (2xx)**

* `200 OK` → Success (GET/PUT/DELETE).
* `201 Created` → Resource created (POST).
* `202 Accepted` → Async processing.
* `204 No Content` → Success, no body.

**⚠️ Client Errors (4xx)**

* `400 Bad Request` → Invalid input.
* `401 Unauthorized` → Auth required/failed.
* `402 Payment Required` → Payment Required. 
* `403 Forbidden` → No permission.
* `404 Not Found` → Resource not found.
* `405 Method Not Allowed` → Wrong HTTP method.
* `409 Conflict` → Duplicate or state conflict.
* `422 Unprocessable Entity` → Validation error.
* `429 Too Many Requests` → Rate-limited.

**🚨 Server Errors (5xx)**

* `500 Internal Server Error` → Generic failure.
* `502 Bad Gateway` → Invalid upstream response.
* `503 Service Unavailable` → Temporary downtime.
* `504 Gateway Timeout` → Upstream timed out.

---

### 🔹 REST Best Practices

* Use **nouns, not verbs** in URIs → `/users/1/orders` instead of `/getUserOrders`.
* Use **plural resource names** → `/products` not `/product`.
* Support **pagination/filtering** → `/products?page=2&limit=20`.
* Return **structured error messages** (with code, message, details).
* Use **versioning** → `/api/v1/users`.
* Secure with **HTTPS, OAuth2, JWT**.

---

### 🔹 Example REST API
<table>
<tr><td valign="top">

```http
Request:
POST /users
Content-Type: application/json

{
  "name": "Alice",
  "email": "alice@example.com"
}
```
</td><td valign="top">

```http
Response:
201 Created
Location: /users/101
{
  "id": 101,
  "name": "Alice",
  "email": "alice@example.com"
}
```
<td></tr>
</table>

### 🔹 Common Interview Qs on REST


**Difference between PUT and PATCH?**
- `PUT` replaces the entire resource, `PATCH` updates only specific fields.

**Why is POST not idempotent?**
- Multiple `POST` requests can create multiple resources, unlike `PUT`.

**How to secure REST APIs?**
- Use HTTPS, OAuth2, JWT, API keys, rate limiting.

**Why do we use 201 Created instead of 200 for POST?**
- 201 explicitly tells the client a resource was created, and usually includes Location header with new resource URI.

**What’s the difference between 401 and 403?**
- 401 Unauthorized = authentication missing/invalid.
- 403 Forbidden = authentication is fine, but user lacks permission.

**Why is PUT idempotent but POST is not?**
- Repeating PUT /users/1 with same data updates the same resource → same result. 
- Repeating POST /users may create multiple users → different result.

