# Age Guard - Logged-In User Testing Guide

## ✅ COMPLETE PROTECTION IMPLEMENTED

**Date:** December 2, 2025

---

## Protection Summary

The Age Guard now protects adult content from:
1. ❌ **Non-logged-in users** - Redirected to sign-in
2. ❌ **Logged-in users without age set** - Redirected to settings
3. ❌ **Logged-in users under 18** - Blocked with age restriction message
4. ✅ **Logged-in users 18+** - Allowed access

---

## Test Scenarios for Logged-In Users

### Scenario 1: Logged-In User WITHOUT Age Set ⚠️

**Setup:**
1. Create or use test account with `age: null` or `age: undefined`
2. Sign in to the account

**Test Steps:**
1. Navigate to an adult book detail page
2. Click on any chapter to read
3. Try to access chapter URL directly

**Expected Result:**
```
┌────────────────────────────────────────┐
│  ⚠️ Age Verification Required          │
│                                        │
│  To access adult content, please add   │
│  your age to your profile.             │
│                                        │
│  [Go to Settings] ← Button             │
└────────────────────────────────────────┘
```

**Backend Response (if API called directly):**
```json
{
  "status": "error",
  "code": "AGE_NOT_SET",
  "message": "Please set your age in your profile to access this content."
}
```

---

### Scenario 2: Logged-In User UNDER 18 ❌

**Setup:**
1. Create or use test account with `age: 15` (or any age < 18)
2. Sign in to the account

**Test Steps:**
1. Navigate to an adult book detail page
2. Click on any chapter to read
3. Try to access chapter URL directly

**Expected Result:**
```
┌────────────────────────────────────────┐
│  🛡️ Access Denied                      │
│                                        │
│  You must be 18 years or older to     │
│  access this content.                  │
│                                        │
│  Your age: 15 years old                │
│                                        │
│  [Browse Other Books] ← Button         │
└────────────────────────────────────────┘
```

**Backend Response (if API called directly):**
```json
{
  "status": "error",
  "code": "AGE_RESTRICTED",
  "message": "You must be 18 years or older to access adult content."
}
```

---

### Scenario 3: Logged-In User EXACTLY 18 ✅

**Setup:**
1. Create or use test account with `age: 18`
2. Sign in to the account

**Test Steps:**
1. Navigate to an adult book detail page
2. Click on any chapter to read

**Expected Result:**
- ✅ Chapter loads immediately
- ✅ No age guard modal appears
- ✅ No confirmation popup
- ✅ User can read freely

**Backend Response:**
```json
{
  "status": "success",
  "data": {
    "chapterNumber": 1,
    "title": "Chapter Title",
    "content": "...",
    ...
  }
}
```

---

### Scenario 4: Logged-In User OVER 18 ✅

**Setup:**
1. Create or use test account with `age: 25` (or any age > 18)
2. Sign in to the account

**Test Steps:**
1. Navigate to an adult book detail page
2. Click on any chapter to read
3. Navigate between chapters

**Expected Result:**
- ✅ Chapter loads immediately
- ✅ No age guard modal appears
- ✅ No confirmation popup
- ✅ User can read freely
- ✅ Can navigate between chapters seamlessly

---

### Scenario 5: Edge Case - User Age is 0 ❌

**Setup:**
1. Create test account with `age: 0`
2. Sign in to the account

**Test Steps:**
1. Navigate to an adult book detail page
2. Click on any chapter to read

**Expected Result:**
- ❌ User is blocked (age < 18)
- Shows "Access Denied" modal
- Your age: 0 years old

---

### Scenario 6: Edge Case - User Age is Negative ❌

**Setup:**
1. Create test account with `age: -5`
2. Sign in to the account

**Test Steps:**
1. Navigate to an adult book detail page
2. Click on any chapter to read

**Expected Result:**
- ❌ User is blocked (age < 18)
- Shows "Access Denied" modal

---

## Non-Adult Content Access

### Scenario 7: Any User + Kids/Teen Books ✅

**For ALL users (logged in or not, any age):**

**Test Steps:**
1. Navigate to a kids or teen book
2. Click on any chapter to read

**Expected Result:**
- ✅ Everyone can access
- ✅ No age guard blocking
- ✅ Only subscription guard applies (if premium/ongoing)

---

## Backend API Testing

### Test with Postman/curl

**Test 1: No Auth + Adult Book**
```bash
curl -X GET "http://localhost:3000/api/books/{adultBookId}/chapters/1"
```
Expected: `401 - AUTHENTICATION_REQUIRED`

**Test 2: Logged In (Age Not Set) + Adult Book**
```bash
curl -X GET "http://localhost:3000/api/books/{adultBookId}/chapters/1" \
  -H "Authorization: Bearer {token_no_age}"
```
Expected: `403 - AGE_NOT_SET`

**Test 3: Logged In (Age < 18) + Adult Book**
```bash
curl -X GET "http://localhost:3000/api/books/{adultBookId}/chapters/1" \
  -H "Authorization: Bearer {token_minor}"
```
Expected: `403 - AGE_RESTRICTED`

**Test 4: Logged In (Age ≥ 18) + Adult Book**
```bash
curl -X GET "http://localhost:3000/api/books/{adultBookId}/chapters/1" \
  -H "Authorization: Bearer {token_adult}"
```
Expected: `200 - Success with chapter data`

---

## Test Data Setup

### Required Test Accounts

Create these test accounts for comprehensive testing:

```javascript
// Account 1: No age set
{
  email: "test-noage@example.com",
  password: "Test123!",
  age: null  // or undefined
}

// Account 2: Minor (under 18)
{
  email: "test-minor@example.com",
  password: "Test123!",
  age: 15
}

// Account 3: Exactly 18
{
  email: "test-18@example.com",
  password: "Test123!",
  age: 18
}

// Account 4: Adult (over 18)
{
  email: "test-adult@example.com",
  password: "Test123!",
  age: 25
}

// Account 5: Edge case - zero age
{
  email: "test-zero@example.com",
  password: "Test123!",
  age: 0
}
```

### Required Test Books

```javascript
// Adult Book
{
  title: "Adult Content Test Book",
  contentType: "adult",
  chapters: [
    { chapterNumber: 1, title: "Chapter 1" },
    { chapterNumber: 2, title: "Chapter 2" },
    { chapterNumber: 3, title: "Chapter 3" }
  ]
}

// Kids Book
{
  title: "Kids Content Test Book",
  contentType: "kids",
  chapters: [
    { chapterNumber: 1, title: "Chapter 1" }
  ]
}

// Teen Book
{
  title: "Teen Content Test Book",
  contentType: "teen",
  chapters: [
    { chapterNumber: 1, title: "Chapter 1" }
  ]
}
```

---

## Comprehensive Testing Checklist

### Frontend Tests
- [ ] No age user blocked from adult content
- [ ] No age user redirected to settings
- [ ] Under 18 user blocked from adult content
- [ ] Under 18 user shown age in error message
- [ ] 18 year old user can access adult content
- [ ] 18+ user can access adult content
- [ ] 18+ user gets no popup/confirmation
- [ ] All users can access kids/teen content

### Backend Tests
- [ ] API blocks no-age user (403 - AGE_NOT_SET)
- [ ] API blocks under 18 user (403 - AGE_RESTRICTED)
- [ ] API allows 18+ user (200 - Success)
- [ ] API allows kids/teen content for all users
- [ ] Proper error messages returned

### Integration Tests
- [ ] Sign in as no-age user → blocked → go to settings
- [ ] Sign in as minor → blocked → browse other books
- [ ] Sign in as 18+ user → immediate access
- [ ] Direct URL access blocked appropriately
- [ ] Chapter navigation works for allowed users
- [ ] Refresh page maintains protection

### Edge Case Tests
- [ ] Age = 0 blocked
- [ ] Age = 17 blocked
- [ ] Age = 18 allowed
- [ ] Age = null blocked (redirected to settings)
- [ ] Age = undefined blocked (redirected to settings)
- [ ] Negative age blocked

---

## Success Criteria

✅ All test scenarios pass  
✅ Frontend guards work correctly  
✅ Backend protection independent of frontend  
✅ Clear error messages for each scenario  
✅ No security bypasses via direct API access  
✅ Smooth UX for verified adult users  
✅ Appropriate guidance for blocked users  

---

## Common Issues to Check

1. **Logged-in minor still accessing**: Check if AgeGuard is imported and used
2. **Age check not working**: Verify `user.age` is correctly set in context
3. **Backend allowing access**: Verify middleware order in routes
4. **Wrong modal showing**: Check age comparison logic (`user.age < 18`)
5. **Settings redirect not working**: Verify `/settings` route exists

---

## Quick Verification Script

Run this in browser console when logged in:

```javascript
// Check current user's age
const user = JSON.parse(localStorage.getItem('user'));
console.log('User age:', user?.age);
console.log('User role:', user?.role);
console.log('Can access adult content:', user?.age >= 18);
```

---

## Status: READY FOR TESTING

All protection layers are in place for both logged-in and non-logged-in users.

**Key Point:** Logged-in users must be 18+ AND have their age set to access adult content.

