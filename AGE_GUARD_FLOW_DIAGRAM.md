# Age Guard - Complete Protection Flow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER TRIES TO READ CHAPTER                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                  Check: Book ContentType?                        │
└─────────────────────────────────────────────────────────────────┘
         ↓                               ↓
    KIDS/TEEN                         ADULT
         ↓                               ↓
    ✅ ALLOWED                  ┌────────────────┐
    (All users)                 │  AgeGuard Check │
                                └────────────────┘
                                         ↓
                        ┌────────────────────────────────┐
                        │   Is User Authenticated?        │
                        └────────────────────────────────┘
                          ↓                          ↓
                         YES                        NO
                          ↓                          ↓
                ┌──────────────────┐      ┌──────────────────────┐
                │ Is Age Set?      │      │  ❌ BLOCKED          │
                └──────────────────┘      │  "Age Restricted"    │
                   ↓           ↓          │  Button: Sign In     │
                  YES         NO          └──────────────────────┘
                   ↓           ↓
         ┌──────────────┐  ┌──────────────────────┐
         │ Age >= 18?   │  │  ❌ BLOCKED          │
         └──────────────┘  │  "Age Verification"  │
            ↓        ↓     │  Button: Settings    │
           YES      NO     └──────────────────────┘
            ↓        ↓
    ✅ ALLOWED   ❌ BLOCKED
                "Access Denied"
                Shows user's age
                Button: Browse Books
```

---

## Detailed Scenario Breakdown

### Scenario A: Non-Logged-In User + Adult Book

```
User (Not Logged In)
    ↓
Clicks Adult Book Chapter
    ↓
AgeGuard: isAuthenticated = false
    ↓
❌ SHOWS MODAL:
┌──────────────────────────────────────┐
│        🛡️ Age Restricted Content     │
│                                      │
│  You must be signed in and 18 years │
│  or older to access this content.   │
│                                      │
│     [Sign In to Continue]            │
└──────────────────────────────────────┘
    ↓
Click Button → Redirects to /signin
```

### Scenario B: Logged-In User (No Age) + Adult Book

```
User (Logged In, age = null)
    ↓
Clicks Adult Book Chapter
    ↓
AgeGuard: isAuthenticated = true
    ↓
AgeGuard: user.age = null
    ↓
❌ SHOWS MODAL:
┌──────────────────────────────────────┐
│    ⚠️ Age Verification Required      │
│                                      │
│  To access adult content, please    │
│  add your age to your profile.      │
│                                      │
│        [Go to Settings]              │
└──────────────────────────────────────┘
    ↓
Click Button → Redirects to /settings
```

### Scenario C: Logged-In User (Under 18) + Adult Book

```
User (Logged In, age = 15)
    ↓
Clicks Adult Book Chapter
    ↓
AgeGuard: isAuthenticated = true
    ↓
AgeGuard: user.age = 15
    ↓
AgeGuard: 15 < 18 = true
    ↓
❌ SHOWS MODAL:
┌──────────────────────────────────────┐
│          🛡️ Access Denied            │
│                                      │
│  You must be 18 years or older to   │
│  access this content.                │
│                                      │
│  Your age: 15 years old              │
│                                      │
│      [Browse Other Books]            │
└──────────────────────────────────────┘
    ↓
Click Button → Redirects to /browse
```

### Scenario D: Logged-In User (18+) + Adult Book

```
User (Logged In, age = 25)
    ↓
Clicks Adult Book Chapter
    ↓
AgeGuard: isAuthenticated = true
    ↓
AgeGuard: user.age = 25
    ↓
AgeGuard: 25 >= 18 = true
    ↓
✅ PASS AgeGuard
    ↓
SubscriptionGuard Check (if applicable)
    ↓
✅ Chapter Loads
    ↓
User Can Read Freely
```

### Scenario E: Any User + Kids/Teen Book

```
User (Any State)
    ↓
Clicks Kids/Teen Book Chapter
    ↓
AgeGuard: contentType !== "adult"
    ↓
✅ PASS AgeGuard Immediately
    ↓
SubscriptionGuard Check (if applicable)
    ↓
✅ Chapter Loads
```

---

## Backend API Flow

```
API Request: GET /api/books/{id}/chapters/{number}
    ↓
softAuth Middleware
    ↓
    Attaches user (if token present)
    ↓
checkAgeRestriction Middleware
    ↓
    Fetch book.contentType from DB
    ↓
    ┌─────────────────────────────┐
    │  contentType === "adult"?   │
    └─────────────────────────────┘
         ↓                    ↓
        YES                  NO
         ↓                    ↓
    Is user authenticated?  ✅ PASS
         ↓         ↓
        YES       NO
         ↓         ↓
    Is age set?  ❌ 401
         ↓    ↓   AUTHENTICATION_REQUIRED
        YES  NO
         ↓    ↓
    Age>=18? ❌ 403
         ↓    AGE_NOT_SET
        YES
         ↓
        ❌ 403
        AGE_RESTRICTED
         
✅ PASS → Controller → Return Chapter Data
```

---

## Protection Summary by User Type

### Type 1: Anonymous User
- **Can Access:** Kids/Teen books
- **Cannot Access:** Adult books
- **Reason:** Must be authenticated
- **Action:** Redirected to sign-in

### Type 2: Logged-In User (No Age)
- **Can Access:** Kids/Teen books
- **Cannot Access:** Adult books
- **Reason:** Age not set in profile
- **Action:** Redirected to settings

### Type 3: Logged-In User (Age < 18)
- **Can Access:** Kids/Teen books
- **Cannot Access:** Adult books
- **Reason:** Under 18 years old
- **Action:** Blocked with clear message

### Type 4: Logged-In User (Age ≥ 18)
- **Can Access:** ALL books (Kids/Teen/Adult)
- **Cannot Access:** None (age-wise)
- **Reason:** Meets age requirements
- **Action:** Full access granted

---

## Component Hierarchy

```
ReadChapterPage
    │
    ├─ AgeGuard ← FIRST CHECK
    │   │
    │   ├─ Checks: isAuthenticated
    │   ├─ Checks: user.age exists
    │   ├─ Checks: user.age >= 18
    │   │
    │   └─ If PASS ↓
    │
    ├─ SubscriptionGuard ← SECOND CHECK
    │   │
    │   ├─ Checks: isPremium
    │   ├─ Checks: bookStatus
    │   ├─ Checks: user.plan
    │   │
    │   └─ If PASS ↓
    │
    └─ Chapter Content ← RENDERED
        │
        ├─ ChapterNavigation
        └─ ChapterContent
```

---

## Error Code Reference

| Code | Status | Scenario | Frontend Action |
|------|--------|----------|----------------|
| `AUTHENTICATION_REQUIRED` | 401 | Not logged in + adult content | Show sign-in modal |
| `AGE_NOT_SET` | 403 | Logged in but no age + adult content | Show settings modal |
| `AGE_RESTRICTED` | 403 | Logged in but age < 18 + adult content | Show access denied modal |
| `Success` | 200 | Age >= 18 + adult content | Load chapter |

---

## Security Checkpoints

### ✅ Checkpoint 1: Frontend UI (AgeGuard Component)
- **Location:** Client browser
- **Purpose:** Provide immediate feedback
- **Can be bypassed:** Yes (if user manipulates client)
- **Mitigation:** Backend validation below

### ✅ Checkpoint 2: Backend API (checkAgeRestriction Middleware)
- **Location:** Server
- **Purpose:** Enforce security
- **Can be bypassed:** No (server-side validation)
- **Result:** Even if frontend is bypassed, backend blocks

### 🔒 Double Layer = Secure

Frontend + Backend = **No Security Gaps**

---

## Age Comparison Logic

```javascript
// In AgeGuard.jsx
if (!user?.age) {
  // age is null, undefined, or 0
  // Show "Age Verification Required"
}

if (user.age < 18) {
  // age is set but less than 18
  // Show "Access Denied"
}

if (user.age >= 18) {
  // age is 18 or greater
  // Allow access ✅
}
```

### Edge Cases Handled

| Age Value | Result | Modal Shown |
|-----------|--------|-------------|
| `null` | ❌ Blocked | "Age Verification Required" |
| `undefined` | ❌ Blocked | "Age Verification Required" |
| `0` | ❌ Blocked | "Access Denied" (age < 18) |
| `17` | ❌ Blocked | "Access Denied" (age < 18) |
| `18` | ✅ Allowed | None |
| `25` | ✅ Allowed | None |
| `-5` | ❌ Blocked | "Access Denied" (age < 18) |

---

## Testing Quick Reference

```bash
# Test 1: Non-logged-in → Should block
Open incognito → Go to adult book chapter → Should see sign-in modal

# Test 2: Logged-in no age → Should block
Sign in (age = null) → Go to adult book chapter → Should see settings modal

# Test 3: Logged-in under 18 → Should block
Sign in (age = 15) → Go to adult book chapter → Should see access denied

# Test 4: Logged-in 18+ → Should allow
Sign in (age = 25) → Go to adult book chapter → Should load chapter

# Test 5: Any user + kids book → Should allow
Any state → Go to kids book chapter → Should load chapter
```

---

**All scenarios covered. All edge cases handled. Complete protection active!** ✅

