#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const maintenanceConfigPath = path.join(
  __dirname,
  "../lib/config/maintenance.ts"
);

function toggleMaintenanceMode() {
  try {
    // Read the current maintenance config
    let content = fs.readFileSync(maintenanceConfigPath, "utf8");

    // Check current state
    const isCurrentlyEnabled = content.includes("enabled: true");

    // Toggle the state
    if (isCurrentlyEnabled) {
      content = content.replace("enabled: true", "enabled: false");
      console.log("✅ Maintenance mode DISABLED");
    } else {
      content = content.replace("enabled: false", "enabled: true");
      console.log("🔧 Maintenance mode ENABLED");
    }

    // Write back to file
    fs.writeFileSync(maintenanceConfigPath, content, "utf8");

    console.log("📝 Maintenance config updated successfully!");
    console.log("🔄 Restart your development server to apply changes.");
  } catch (error) {
    console.error("❌ Error toggling maintenance mode:", error.message);
    process.exit(1);
  }
}

function showStatus() {
  try {
    const content = fs.readFileSync(maintenanceConfigPath, "utf8");
    const isEnabled = content.includes("enabled: true");

    console.log(
      `📊 Maintenance mode is currently: ${isEnabled ? "🔧 ENABLED" : "✅ DISABLED"}`
    );

    if (isEnabled) {
      console.log("\n💡 To disable maintenance mode, run:");
      console.log("   npm run maintenance:off");
      console.log("   or");
      console.log("   node scripts/toggle-maintenance.js");
    } else {
      console.log("\n💡 To enable maintenance mode, run:");
      console.log("   npm run maintenance:on");
      console.log("   or");
      console.log("   node scripts/toggle-maintenance.js");
    }
  } catch (error) {
    console.error("❌ Error reading maintenance status:", error.message);
    process.exit(1);
  }
}

// Handle command line arguments
const command = process.argv[2];

switch (command) {
  case "status":
    showStatus();
    break;
  case "on":
    // Force enable
    try {
      let content = fs.readFileSync(maintenanceConfigPath, "utf8");
      content = content.replace("enabled: false", "enabled: true");
      fs.writeFileSync(maintenanceConfigPath, content, "utf8");
      console.log("🔧 Maintenance mode ENABLED");
    } catch (error) {
      console.error("❌ Error enabling maintenance mode:", error.message);
    }
    break;
  case "off":
    // Force disable
    try {
      let content = fs.readFileSync(maintenanceConfigPath, "utf8");
      content = content.replace("enabled: true", "enabled: false");
      fs.writeFileSync(maintenanceConfigPath, content, "utf8");
      console.log("✅ Maintenance mode DISABLED");
    } catch (error) {
      console.error("❌ Error disabling maintenance mode:", error.message);
    }
    break;
  default:
    toggleMaintenanceMode();
    break;
}


