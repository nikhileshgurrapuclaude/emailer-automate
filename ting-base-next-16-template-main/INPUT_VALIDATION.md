# INPUT_VALIDATION.md: Input Validation Rules & Conventions

This file tells Claude Code / Cursor how to create input fields in this repository.
Read it fully before writing, editing, or refactoring any code.

## Field Mandatory restrictions

-Name / Full Name Maximum 32 characters. Allow letters (A--Z, a--z), Unicode letters, spaces, apostrophes (') and hyphens (-).

-Username 3--32 characters. Allow letters, numbers and underscore (\_).Enforce uniqueness on the server.

-Email Maximum 100 characters. Validate email format on the server and verify ownership when required

-Phone Number Maximum 15 digits, with an optional leading +. Normalize and validate on the server.

-Password Use an approved minimum and maximum length. Allow special characters and spaces. Never store plaintext passwords or log them.

-Address Maximum 255 characters per field. Allow letters, numbers, spaces and normal address punctuation.

-Title / Subject Maximum 50 characters. Allow normal text and punctuation.

-Message / Description / Comments Maximum 250 characters. Accept normal text and punctuation; prevent executable HTML and script injection.

-Search Query Maximum 80 characters. Treat input as data and use safe database queries.

-Integer / Quantity / Age Accept only valid integers within the defined business range. Reject
invalid formats and out-of-range values.

-Decimal / Amount / Price Validate numeric format, precision and range. Calculate prices, totals, fees and discounts on the server.

-Date / Time Accept only approved formats and validate dates, time zones and business rules on the server.

-Dropdown / Radio / Checkbox Accept only predefined, server-approved values. Never trust client-submitted selections without validation.

-URL / Redirect Destination Validate URL format and allow only approved redirect destinations. Protect server-side URL fetching against SSRF.

-File Upload Allow only approved file types. Validate file content, size and count; generate safe filenames; store files privately and check download permissions.

-Hidden Fields / IDs / Roles / Never trust client-provided Tenant IDs ownership, role, permission, price or tenant values. Validate authorization and ownership on the server.

-API / JSON Fields Validate data types and request structure, enforce body-size limits and reject or safely ignore unexpected fields.

## Mandatory rules for every form

-Server-side validation: validate every submitted field on the backend.

-XSS prevention: never render user input as HTML/JS; use context-aware output encoding. Sanitize with an approved allowlist sanitizer only when rich text is required.

-Injection prevention: use parameterized SQL or safe ORM methods; prevent NoSQL, command and template injection and path traversal.

-Mass-assignment protection: accept only approved writable fields; protect roles, permissions, ownership and tenant IDs.

-Authentication and authorization: enforce permissions, record ownership and tenant isolation.

-CSRF and session security: protect cookie-authenticated state-changing requests; use secure cookies.

-Business-logic validation: verify workflow state, prevent duplicate critical operations, calculate sensitive values on the server.

-Safe errors and logging: never expose stack traces, SQL errors, internal paths, passwords, tokens or cookies; redact sensitive values from logs.

-Do not strip characters blindly. Validate input for its purpose, store it safely, and encode it at the output context.
