// Maintenance mode configuration
export const MAINTENANCE_CONFIG = {
  // Set to true to enable maintenance mode
  enabled: false,

  allowedIPs: [
    // Add your IP addresses here if needed
  ],

  // Optional: Maintenance message customization
  message: {
    title: "Under Maintenance",
    subtitle: "We'll be back soon!",
    description:
      "We're currently performing some maintenance on our site. We'll be back online shortly. Thank you for your patience.",
  },
};

// Helper function to check if maintenance mode is enabled
export const isMaintenanceModeEnabled = (): boolean => {
  // You can also check environment variables here
  return (
    MAINTENANCE_CONFIG.enabled ||
    process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true"
  );
};

// Helper function to check if an IP is allowed to bypass maintenance
export const isIPAllowed = (ip: string): boolean => {
  return MAINTENANCE_CONFIG.allowedIPs.includes(ip);
};

// Helper function to check if a user agent is allowed to bypass maintenance
export const isUserAgentAllowed = (userAgent: string): boolean => {
  return MAINTENANCE_CONFIG.allowedUserAgents.some((allowed) =>
    userAgent.toLowerCase().includes(allowed.toLowerCase())
  );
};
