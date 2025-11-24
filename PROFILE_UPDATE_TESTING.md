# Profile Update Testing Guide

## How to Test the Profile Update Feature

### Prerequisites
1. Backend server running at the configured API endpoint
2. Frontend application running (npm run dev)
3. User account created and logged in

### Test Scenarios

#### Test 1: Update Name Only
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Change the name field to "Test User Updated"
4. Click "Save"
5. **Expected**: Success toast appears, modal closes, name updates in profile view

**Request Body Sent:**
```json
{
  "name": "Test User Updated"
}
```

#### Test 2: Update Bio Only
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Add/edit bio text: "I love reading fantasy novels"
4. Click "Save"
5. **Expected**: Success toast appears, modal closes, bio updates in profile view

**Request Body Sent:**
```json
{
  "bio": "I love reading fantasy novels"
}
```

#### Test 3: Update Age Only
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Set age to "25"
4. Click "Save"
5. **Expected**: Success toast appears, modal closes, age updates in profile view

**Request Body Sent:**
```json
{
  "age": 25
}
```

#### Test 4: Update All Fields
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Change name to "John Doe"
4. Change age to "30"
5. Change bio to "Author and reader"
6. Click "Save"
7. **Expected**: Success toast appears, modal closes, all fields update

**Request Body Sent:**
```json
{
  "name": "John Doe",
  "bio": "Author and reader",
  "age": 30
}
```

#### Test 5: Upload Profile Image Only
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Click "Upload Photo"
4. Select an image file
5. **Expected**: Image preview shows in modal
6. Click "Save"
7. **Expected**: Profile image updates after save

**API Calls:**
1. No call to `/api/users/me` (no data changed)
2. Call to `/api/users/me/profile-image` with FormData

#### Test 6: Update Fields + Profile Image
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Change name to "Jane Smith"
4. Upload a new profile image
5. Click "Save"
6. **Expected**: Both profile data and image update

**API Calls:**
1. First: `PATCH /api/users/me` with `{ "name": "Jane Smith" }`
2. Second: `PATCH /api/users/me/profile-image` with FormData

#### Test 7: Empty Form Submission
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Clear name field (leave empty)
4. Click "Save"
5. **Expected**: No API call made (empty data object)

#### Test 8: Invalid Age Input
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Try entering negative age or age > 150
4. Click "Save"
5. **Expected**: Browser validation prevents submission

#### Test 9: Cancel Edit
1. Navigate to Profile page
2. Click "Edit Profile" button
3. Make some changes
4. Click "X" or click outside modal
5. **Expected**: Modal closes, changes not saved

#### Test 10: Error Handling
1. Stop backend server
2. Navigate to Profile page
3. Click "Edit Profile" button
4. Make changes and click "Save"
5. **Expected**: Error toast appears with appropriate message

## Browser Console Checks

### Successful Update
Check browser console for:
- Network request to `PATCH /api/users/me`
- Request payload matches expected format
- Response status 200
- Response contains updated user data

### Successful Image Upload
Check browser console for:
- Network request to `PATCH /api/users/me/profile-image`
- Request content-type: `multipart/form-data`
- Response status 200
- Response contains updated user with new image URL

## Network Request Verification

### Profile Update Request
```
Method: PATCH
URL: /api/users/me
Headers:
  - Authorization: Bearer <access_token>
  - Content-Type: application/json
Body:
{
  "name": "Updated Name",
  "bio": "Updated Bio",
  "age": 25
}
```

### Image Upload Request
```
Method: PATCH
URL: /api/users/me/profile-image
Headers:
  - Authorization: Bearer <access_token>
  - Content-Type: multipart/form-data
Body: FormData
  - avatar: [File object]
```

## Common Issues & Solutions

### Issue 1: Fields not updating
**Check:**
- Browser console for API errors
- Network tab for request/response
- Verify backend is running
- Check auth token is valid

### Issue 2: Image not uploading
**Check:**
- File type is image (jpg, png, etc.)
- File size within limits
- Network tab shows multipart/form-data
- Backend image upload endpoint is working

### Issue 3: Old data persists after update
**Check:**
- Auth context is being updated
- Component re-renders after update
- User object structure matches backend response

## Expected API Responses

### Success Response (Profile Update)
```json
{
  "success": true,
  "message": "Your profile has been updated.",
  "data": {
    "_id": "673d4e5f6g7h8i9j0k1l",
    "name": "Updated Name",
    "email": "user@example.com",
    "bio": "Updated Bio",
    "age": 25,
    "role": "READER",
    "subscriptionStatus": "active",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  }
}
```

### Success Response (Image Upload)
```json
{
  "success": true,
  "message": "Profile image updated successfully.",
  "data": {
    "_id": "673d4e5f6g7h8i9j0k1l",
    "name": "User Name",
    "profileImage": "https://storage.example.com/profile-images/user123.jpg",
    // ... other user fields
  }
}
```

### Error Response (Validation)
```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "age: Number must be less than or equal to 150"
}
```

### Error Response (Unauthorized)
```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Please authenticate to access this resource."
}
```

## Performance Checks

1. **Modal Load Time**: Should open instantly
2. **Form Submission**: Should complete in < 2 seconds
3. **Image Upload**: Should complete in < 5 seconds (depending on image size)
4. **UI Updates**: Should be immediate after API response

## Accessibility Checks

1. All form fields have proper labels
2. Modal can be closed with Escape key
3. Form can be submitted with Enter key
4. Error messages are clearly displayed
5. Loading states are indicated

## Final Verification

After all tests pass, verify:
- [ ] Profile updates persist after page refresh
- [ ] Profile updates are visible in navbar (if applicable)
- [ ] Profile image displays correctly throughout app
- [ ] No console errors during any operation
- [ ] All API requests use correct format
- [ ] Error handling works properly
- [ ] Success messages are user-friendly

