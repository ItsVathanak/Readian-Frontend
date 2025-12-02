# Age Guard Testing Guide

## Quick Test Scenarios

### Test 1: Non-Logged-In User + Adult Book ❌

**Steps:**
1. Log out (or use incognito mode)
2. Navigate to an adult book detail page
3. Click on any chapter to read

**Expected Result:**
- User is blocked by AgeGuard
- See modal: "Age Restricted Content"
- Message: "You must be signed in and 18 years or older to access this content"
- Button: "Sign In to Continue"
- Clicking button redirects to `/signin` with return path

**Backend Response (if API called directly):**
```json
{
  "status": "error",
  "code": "AUTHENTICATION_REQUIRED",
  "message": "You must be logged in to access adult content."
}
```

---

### Test 2: Non-Logged-In User + Kids/Teen Book ✅

**Steps:**
1. Log out (or use incognito mode)
2. Navigate to a kids or teen book
3. Click on any chapter to read

**Expected Result:**
- User can access and read freely
- No age guard blocking
- Only subscription guard checks apply (if book is premium/ongoing)

---

### Test 3: Logged-In User (No Age Set) + Adult Book ⚠️

**Steps:**
1. Sign in with account that has no age set
2. Navigate to an adult book
3. Click on any chapter

**Expected Result:**
- User is blocked by AgeGuard
- See modal: "Age Verification Required"
- Message: "To access adult content, please add your age to your profile"
- Button: "Go to Settings"
- Clicking button redirects to `/settings`

---

### Test 4: Logged-In User (Under 18) + Adult Book ❌

**Steps:**
1. Sign in with account where age < 18
2. Navigate to an adult book
3. Click on any chapter

**Expected Result:**
- User is blocked by AgeGuard
- See modal: "Access Denied"
- Message: "You must be 18 years or older to access this content"
- Shows user's current age
- Button: "Browse Other Books"
- Clicking button redirects to `/browse`

**Backend Response (if API called directly):**
```json
{
  "status": "error",
  "code": "AGE_RESTRICTED",
  "message": "You must be 18 years or older to access adult content."
}
```

---

### Test 5: Logged-In User (18+) + Adult Book ✅

**Steps:**
1. Sign in with account where age >= 18
2. Navigate to an adult book
3. Click on any chapter

**Expected Result:**
- ✅ User can read directly
- No age guard modal
- No redundant confirmation popup
- Seamless reading experience
- Only subscription guard checks apply (if book is premium/ongoing)

---

### Test 6: Direct API Access (Postman/curl)

**Test 6a: Get Adult Chapter - Not Authenticated**
```bash
curl -X GET "http://localhost:3000/api/books/{bookId}/chapters/1"
```

**Expected Response:**
```json
{
  "status": "error",
  "code": "AUTHENTICATION_REQUIRED",
  "message": "You must be logged in to access adult content."
}
```

**Test 6b: Get Adult Chapter - User Under 18**
```bash
curl -X GET "http://localhost:3000/api/books/{bookId}/chapters/1" \
  -H "Authorization: Bearer {token}"
```

**Expected Response:**
```json
{
  "status": "error",
  "code": "AGE_RESTRICTED",
  "message": "You must be 18 years or older to access adult content."
}
```

**Test 6c: Get Adult Chapter - User 18+**
```bash
curl -X GET "http://localhost:3000/api/books/{bookId}/chapters/1" \
  -H "Authorization: Bearer {token}"
```

**Expected Response:**
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

## Testing Checklist

### Frontend Tests
- [ ] Non-logged-in user blocked from adult content
- [ ] Non-logged-in user can read kids/teen content
- [ ] User without age sees settings prompt
- [ ] User under 18 sees age restriction
- [ ] User 18+ can read without popups
- [ ] Sign-in modal preserves return path
- [ ] All modals have correct styling and icons
- [ ] Navigation works correctly from all modals

### Backend Tests
- [ ] API blocks unauthenticated requests to adult chapters
- [ ] API blocks users under 18 from adult chapters
- [ ] API allows 18+ users to access adult chapters
- [ ] API allows anyone to access kids/teen chapters
- [ ] Proper error codes returned for each scenario
- [ ] Chapter list endpoint also protected
- [ ] Chapter detail endpoint protected

### Integration Tests
- [ ] User journey: Browse → Adult Chapter → Sign-in → Read
- [ ] User journey: Browse → Kids Chapter → Read (no login)
- [ ] Direct URL access to adult chapter blocked
- [ ] Refresh page maintains protection
- [ ] Back button works correctly after blocking
- [ ] Multiple adult books tested
- [ ] Edge cases: missing contentType field

---

## Test Data Setup

### Required Test Accounts

1. **No Age Account**
   - Email: test-noage@example.com
   - Age: null/undefined
   - Use for: Test scenario 3

2. **Minor Account**
   - Email: test-minor@example.com
   - Age: 15
   - Use for: Test scenario 4

3. **Adult Account**
   - Email: test-adult@example.com
   - Age: 25
   - Use for: Test scenario 5

### Required Test Books

1. **Adult Book**
   - contentType: "adult"
   - At least 3 chapters
   - Use for: All adult content tests

2. **Kids Book**
   - contentType: "kids"
   - At least 2 chapters
   - Use for: Non-restricted access tests

3. **Teen Book**
   - contentType: "teen"
   - At least 2 chapters
   - Use for: Non-restricted access tests

---

## Expected Behavior Summary

| User Status | Content Type | Can Access | Notes |
|------------|--------------|------------|-------|
| Not logged in | adult | ❌ No | Redirect to sign-in |
| Not logged in | kids/teen | ✅ Yes | Free access |
| Logged in, no age | adult | ❌ No | Redirect to settings |
| Logged in, < 18 | adult | ❌ No | Show age restriction |
| Logged in, < 18 | kids/teen | ✅ Yes | Free access |
| Logged in, ≥ 18 | adult | ✅ Yes | Direct access |
| Logged in, ≥ 18 | kids/teen | ✅ Yes | Free access |

---

## Common Issues to Check

1. **Modal not appearing**: Check if AgeGuard is properly imported and wrapped
2. **Still seeing confirmation popup**: Ensure AgeGuard.jsx was updated correctly
3. **Backend still allows access**: Verify checkAgeRestriction middleware is in route
4. **Wrong error message**: Check backend error codes match frontend expectations
5. **Infinite redirect loop**: Verify return path logic in sign-in flow

---

## Success Criteria

✅ All test scenarios pass
✅ No console errors in browser
✅ Proper error handling for all edge cases
✅ Smooth UX for verified adult users
✅ Clear messaging for blocked users
✅ Backend protection independent of frontend
✅ No security bypasses via direct API access

---

## Next Steps After Testing

1. Document any bugs found
2. Test edge cases with missing contentType
3. Test with different book statuses (ongoing/finished)
4. Verify interaction with subscription guard
5. Load testing with multiple users
6. Security audit of age verification flow

