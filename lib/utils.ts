import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely converts a date string or Date object to a Date object
 * @param date - The date string or Date object to convert
 * @returns A Date object, or null if the input is invalid
 */
export function toDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;

  try {
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

/**
 * Formats a date string or Date object to a localized date string
 * @param date - The date string or Date object to format
 * @param options - Intl.DateTimeFormatOptions for formatting
 * @returns A formatted date string, or "Invalid date" if the input is invalid
 */
export function formatDate(
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = toDate(date);
  if (!dateObj) return "Invalid date";

  return dateObj.toLocaleDateString(undefined, options);
}

/**
 * Simple encryption for email addresses
 * Uses base64 encoding with a simple substitution cipher and salt
 */
export function encryptEmail(email: string): string {
  if (!email) return "guest";

  // Add a salt to make it more secure
  const salt = "beblocky_2024";
  const saltedEmail = email + salt;

  // Simple encryption: reverse the string and encode to base64
  const reversed = saltedEmail.split("").reverse().join("");
  const encoded = btoa(reversed);

  // Replace some characters to make it URL-safe
  return encoded.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

/**
 * Decrypt email address
 */
export function decryptEmail(encrypted: string): string {
  if (!encrypted || encrypted === "guest") return "guest";

  try {
    // Restore base64 padding and characters
    let restored = encrypted.replace(/-/g, "+").replace(/_/g, "/");

    // Add padding if needed
    while (restored.length % 4) {
      restored += "=";
    }

    const decoded = atob(restored);
    const reversed = decoded.split("").reverse().join("");

    // Remove the salt
    const salt = "beblocky_2024";
    const original = reversed.replace(salt, "");

    return original;
  } catch (error) {
    console.error("Failed to decrypt email:", error);
    return "guest";
  }
}
