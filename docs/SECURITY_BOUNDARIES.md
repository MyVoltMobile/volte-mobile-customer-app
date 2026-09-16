# VoLTE Mobile Customer App — Security Boundaries

## Native application boundary

The VoLTE Mobile customer application is a native Android and iOS
application built with React Native and Expo.

The application must never contain or expose server-side private
credentials.

## Prohibited in the customer application

The native application must never contain:

- Supabase service-role credentials
- Stripe secret keys
- Scotia/Fiserv shared secrets or private credentials
- private database credentials
- private storage credentials
- unrestricted server administration credentials
- Finance Queue staff authority
- arbitrary customer IDs used as authentication or ownership proof

## Customer identity model

When authentication is connected in a later controlled phase:

1. Supabase Auth establishes the signed-in user.
2. The application sends the authenticated access token to approved
   VoLTE Mobile customer APIs.
3. The server verifies the token.
4. The server resolves the canonical ERP customer.
5. The server verifies the customer's auth ownership.
6. Server-side authorities access ERP, Finance, payment, inventory,
   document and storage systems.

The native application must not independently recreate those authorities.

## Finance

The existing Finance Engine and Finance Queue remain authoritative.

Customer-facing finance functionality must use a dedicated,
customer-authenticated API facade.

Finance Queue staff endpoints must never be called directly from the
native customer application.

## Documents

Finance documents remain in the existing secured backend and storage
authority.

The customer application must not receive unrestricted storage access or
raw storage paths.

Future document access must use customer-authenticated server endpoints
that prove ownership before upload, listing or signed retrieval.

## Payments

Payment-provider secrets and transaction authority remain server-side.

Future native payment initiation must occur through an authenticated
customer API.

Hosted payment callbacks and payment finalization remain server
responsibilities.

## Current integration state

This foundation contains:

- no Supabase connection
- no customer API connection
- no Finance Engine connection
- no payment connection
- no support backend connection
- no push notification connection
- no personalized-offer authority
