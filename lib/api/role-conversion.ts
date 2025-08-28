import { userApi } from "./user";
import { studentApi } from "./student";
import { parentApi } from "./parent";
import { toast } from "sonner";

export interface RoleConversionResult {
  success: boolean;
  message: string;
  parentId?: string;
}

/**
 * Handles the conversion of a user from student role to parent role
 * This function:
 * 1. Updates the user role from "student" to "parent"
 * 2. Finds and deletes the existing student instance
 * 3. Creates a new parent instance
 */
export async function convertStudentToParent(
  userId: string
): Promise<RoleConversionResult> {
  console.log(
    "🔄 [Role Conversion] Starting student to parent conversion for userId:",
    userId
  );

  try {
    // Step 1: Update user role from "student" to "parent"
    console.log("🔄 [Role Conversion] Step 1: Updating user role to parent");
    await userApi.updateUser(userId, { role: "parent" });
    console.log("✅ [Role Conversion] User role updated successfully");

    // Step 2: Find the existing student instance
    console.log(
      "🔄 [Role Conversion] Step 2: Finding existing student instance"
    );
    let studentInstance;
    try {
      studentInstance = await studentApi.getStudentByUserId(userId);
      console.log(
        "✅ [Role Conversion] Found student instance:",
        studentInstance._id
      );
    } catch (error) {
      console.warn(
        "⚠️ [Role Conversion] No student instance found, proceeding with parent creation"
      );
      // If no student instance exists, we can proceed directly to parent creation
    }

    // Step 3: Delete the student instance if it exists
    if (studentInstance) {
      console.log("🔄 [Role Conversion] Step 3: Deleting student instance");
      await studentApi.deleteStudent(studentInstance._id);
      console.log("✅ [Role Conversion] Student instance deleted successfully");
    }

    // Step 4: Create parent instance
    console.log("🔄 [Role Conversion] Step 4: Creating parent instance");
    const parentInstance = await parentApi.createParentFromUser(userId);
    console.log(
      "✅ [Role Conversion] Parent instance created successfully:",
      parentInstance._id
    );

    const result: RoleConversionResult = {
      success: true,
      message: "Successfully converted from student to parent role",
      parentId: parentInstance._id,
    };

    console.log("🎉 [Role Conversion] Conversion completed successfully");
    return result;
  } catch (error) {
    console.error("❌ [Role Conversion] Conversion failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    // Try to provide specific error messages
    let userFriendlyMessage =
      "Failed to convert account role. Please try again.";

    if (errorMessage.includes("404")) {
      userFriendlyMessage = "Account not found. Please contact support.";
    } else if (errorMessage.includes("500")) {
      userFriendlyMessage = "Server error. Please try again later.";
    } else if (
      errorMessage.includes("Unauthorized") ||
      errorMessage.includes("401")
    ) {
      userFriendlyMessage = "Authentication failed. Please sign in again.";
    }

    const result: RoleConversionResult = {
      success: false,
      message: userFriendlyMessage,
    };

    return result;
  }
}

/**
 * Handles the complete sign-up flow for parent role
 * This ensures proper role conversion if the user was initially created as a student
 */
export async function handleParentSignUp(
  userId: string
): Promise<RoleConversionResult> {
  console.log("🎯 [Parent SignUp] Handling parent sign-up for userId:", userId);

  try {
    // First, check the current user role
    const user = await userApi.getUserById(userId);
    console.log("🎯 [Parent SignUp] Current user role:", user.role);

    if (user.role === "parent") {
      // User is already a parent, just create the parent instance
      console.log(
        "🎯 [Parent SignUp] User is already parent role, creating parent instance"
      );
      const parentInstance = await parentApi.createParentFromUser(userId);

      return {
        success: true,
        message: "Parent profile created successfully",
        parentId: parentInstance._id,
      };
    } else if (user.role === "student") {
      // User is a student, need to convert to parent
      console.log(
        "🎯 [Parent SignUp] User is student role, converting to parent"
      );
      return await convertStudentToParent(userId);
    } else {
      // Unknown role
      console.error("🎯 [Parent SignUp] Unknown user role:", user.role);
      return {
        success: false,
        message: "Invalid user role. Please contact support.",
      };
    }
  } catch (error) {
    console.error("❌ [Parent SignUp] Failed to handle parent sign-up:", error);
    return {
      success: false,
      message: "Failed to set up parent account. Please try again.",
    };
  }
}

/**
 * API function to call the role conversion endpoint
 * This can be used from the sign-in page or anywhere else in the frontend
 */
export async function callRoleConversionAPI(
  targetRole: "parent" | "student"
): Promise<RoleConversionResult> {
  try {
    console.log(
      "🔄 [Role Conversion API] Calling role conversion endpoint for role:",
      targetRole
    );

    const response = await fetch("/api/role-conversion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ targetRole }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ [Role Conversion API] Failed:", data.error);
      return {
        success: false,
        message: data.error || "Failed to convert role",
      };
    }

    console.log("✅ [Role Conversion API] Success:", data);
    return {
      success: true,
      message: data.message,
      parentId: data.parentId,
    };
  } catch (error) {
    console.error("❌ [Role Conversion API] Network error:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
}

/**
 * Function to handle role conversion during sign-in
 * This can be called if a user needs to convert their role after signing in
 */
export async function handleSignInRoleConversion(
  userId: string,
  targetRole: "parent" | "student"
): Promise<RoleConversionResult> {
  console.log(
    "🔐 [SignIn Role Conversion] Handling role conversion during sign-in:",
    { userId, targetRole }
  );

  try {
    if (targetRole === "parent") {
      return await handleParentSignUp(userId);
    } else {
      // For student role conversion, we would implement similar logic
      return {
        success: false,
        message: "Student role conversion not implemented yet",
      };
    }
  } catch (error) {
    console.error("❌ [SignIn Role Conversion] Failed:", error);
    return {
      success: false,
      message: "Failed to convert role during sign-in",
    };
  }
}
