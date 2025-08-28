# Role Conversion System

This document describes the role conversion system that handles converting users from student to parent roles during sign-up.

## Overview

The role conversion system ensures that when a user signs up as a parent, the system:

1. Creates the user with the default "student" role
2. Updates the user role to "parent"
3. Finds and deletes any existing student instance
4. Creates a new parent instance

## Files

### `lib/api/role-conversion.ts`

Contains the main role conversion logic:

- `convertStudentToParent(userId: string)`: Handles the complete conversion process
- `handleParentSignUp(userId: string)`: Entry point for parent sign-up flow
- `callRoleConversionAPI(targetRole)`: API wrapper for role conversion

### `lib/api/student.ts`

Added `deleteStudent(studentId: string)` method to handle student instance deletion.

### `app/api/role-conversion/route.ts`

API endpoint for role conversion requests.

## Flow

### Sign-up Flow (Parent Role)

1. User selects "Parent" role during sign-up
2. User account is created with default "student" role
3. `handleParentSignUp()` is called which:
   - Checks current user role
   - If role is "student": calls `convertStudentToParent()`
   - If role is "parent": creates parent instance directly
4. `convertStudentToParent()` performs:
   - Updates user role to "parent"
   - Finds student instance by userId
   - Deletes student instance
   - Creates parent instance

### API Endpoint

- **POST** `/api/role-conversion`
- **Body**: `{ targetRole: "parent" | "student" }`
- **Response**: `{ success: boolean, message: string, parentId?: string }`

## Error Handling

The system includes comprehensive error handling:

- Network errors
- API errors (404, 500, etc.)
- Missing user instances
- Invalid roles

## Usage

### In Sign-up Page

```typescript
import { handleParentSignUp } from "@/lib/api/role-conversion";

// During sign-up flow
const result = await handleParentSignUp(userId);
if (result.success) {
  toast.success(result.message);
} else {
  toast.warning(result.message);
}
```

### Via API

```typescript
import { callRoleConversionAPI } from "@/lib/api/role-conversion";

const result = await callRoleConversionAPI("parent");
```

## Security

- All operations require authentication
- User can only convert their own role
- Role validation ensures only valid roles are accepted
- Comprehensive logging for debugging and monitoring
