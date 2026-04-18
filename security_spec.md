# Security Specification for Nadekha Bangladesh

## 1. Data Invariants
- An application must belong to a valid user.
- A guide profile is linked to a user who has an approved application.
- A booking must involve a valid guide and a valid traveler.
- Status transitions for applications and bookings are restricted.

## 2. The "Dirty Dozen" Payloads (Red Team Test Cases)
1. **Identity Spoofing**: Attempting to create an application with someone else's `userId`.
2. **State Shortcutting**: Attempting to set application status to `approved` on creation.
3. **Ghost Field**: Adding `isAdmin: true` to a user profile payload.
4. **Path Variable Poisoning**: Using a 2KB string as a `userId` in the path.
5. **Unauthorized Read**: Traveler attempting to read another traveler's NID URLs in `applications`.
6. **Privilege Escalation**: Guide attempting to update their own `rating` or `reviews`.
7. **Terminal State Break**: Attempting to change a `completed` booking status.
8. **PII Leak**: A non-owner attempting a blanket list of `applications` to see phone numbers.
9. **Resource Exhaustion**: Sending a `villagePhotos` array with 10,000 items.
10. **Orphaned Record**: Creating a booking for a `guideId` that doesn't exist.
11. **Spoofed Identity (Email)**: Using a non-verified email token to gain admin access (if email admin rule is used).
12. **Shadow Field Injection**: Updating a booking but injecting an `amountRefunded` field.

## 3. Conflict Report & Mitigation Audit

| Collection | Identity Spoofing | State Shortcutting | Resource Poisoning | Mitigation Logic |
| :--- | :--- | :--- | :--- | :--- |
| **users** | Blocked | Blocked | Blocked | `isOwner(userId)`, `isValidUser`, `isValidId` |
| **applications** | Blocked | Blocked | Blocked | `incoming().userId == request.auth.uid`, `status == 'pending'`, `isValidId` |
| **guides** | Blocked | N/A | Blocked | `isAdmin()`, `isValidGuide`, `isValidId` |
| **bookings** | Blocked | Blocked | Blocked | `travelerId == request.auth.uid`, `status == 'pending'`, `isValidId` |

### Mitigation Details:
- **Identity Spoofing**: All document creations enforce that the owner ID field matches `request.auth.uid`. Updates verify that owner fields are immutable.
- **State Shortcutting**: All entities with a `status` field strictly enforce an initial state (e.g., `pending`) on creation and require `isAdmin()` or specific logic for transitions.
- **Resource Poisoning**: Every string field has a `.size()` limit. All IDs are validated via `isValidId()`.

## 4. Test Runner Invariants
- `allow read: if isOwner() || isAdmin()` for PII collections.
...
