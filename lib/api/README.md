# API Utilities

This directory contains API client utilities for communicating with the backend services.

## Setup

1. Create a `.env.local` file in the root of your project with the following environment variable:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# For production, use your actual API URL:
# NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

**Important**:

- Do NOT include `/api` in the URL - the API client will handle the endpoint paths
- Make sure your backend is running on the specified port
- The URL should be accessible from your browser

## Available APIs

### Course API (`course.ts`)

Provides methods for:

- `getAllCourses()` - Fetch all courses
- `getCourseById(id)` - Fetch a specific course
- `createCourse(data)` - Create a new course
- `createCourseWithContent(data)` - Create a course with content
- `updateCourse(id, data)` - Update a course
- `deleteCourse(id)` - Delete a course

### Children API (`children.ts`)

Provides methods for:

- `getChildren(parentId)` - Get children for a parent
- `createChild(data)` - Create new child
- `updateChild(id, data)` - Update child profile
- `deleteChild(id)` - Delete child
- `addCourseToChild(childId, courseId)` - Enroll child in course
- `removeCourseFromChild(childId, courseId)` - Remove child from course
- `getAvailableCourses()` - Get available courses

### Progress API (`progress.ts`)

Provides methods for:

- `getStudentProgress(studentId)` - Get all progress for a student
- `getStudentCourseProgress(studentId, courseId)` - Get progress for specific course
- `getAllChildrenProgress(parentId)` - Get progress for all children
- `updateProgress(data)` - Update progress record
- `getProgress(progressId)` - Get specific progress record
- `deleteProgress(progressId)` - Delete progress record
- `getStudentOverallStats(studentId)` - Get overall statistics for a student

### Usage Examples

```typescript
import { courseApi } from "@/lib/api/course";
import { childrenApi } from "@/lib/api/children";
import { progressApi } from "@/lib/api/progress";

// Fetch all courses
const courses = await courseApi.fetchAllCourses();

// Create a new course
const newCourse = await courseApi.createCourse({
  courseTitle: "New Course",
  courseDescription: "Description",
  courseLanguage: "Python",
  subType: "free",
});

// Get children for a parent
const children = await childrenApi.getChildren("parent1");

// Create a new child
const newChild = await childrenApi.createChild({
  name: "John Doe",
  email: "john@example.com",
  grade: 5,
  gender: "male",
});

// Get progress for a student
const progress = await progressApi.getStudentProgress("student1");

// Update progress
await progressApi.updateProgress({
  studentId: "student1",
  courseId: "course1",
  lessonId: "lesson1",
  completed: true,
  score: 95,
  timeSpent: 1800,
});
```

## Error Handling

All API functions include proper error handling and logging. Errors are thrown with descriptive messages that can be caught and handled in your components.
