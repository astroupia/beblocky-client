# Maintenance Mode

This application includes a maintenance mode feature that allows you to temporarily disable access to the site while performing updates or maintenance.

## How it Works

When maintenance mode is enabled:

- All users (except those with bypass permissions) are redirected to `/maintenance`
- The maintenance page displays a user-friendly message
- Authentication and other middleware checks are bypassed for the maintenance page

## Quick Commands

### Check Status

```bash
npm run maintenance:status
```

### Enable Maintenance Mode

```bash
npm run maintenance:on
```

### Disable Maintenance Mode

```bash
npm run maintenance:off
```

### Toggle Maintenance Mode

```bash
npm run maintenance:toggle
```

## Configuration

The maintenance mode is configured in `lib/config/maintenance.ts`:

```typescript
export const MAINTENANCE_CONFIG = {
  // Set to true to enable maintenance mode
  enabled: false,

  // Optional: Add allowed IPs that can bypass maintenance mode
  allowedIPs: [
    // "192.168.1.1",
    // "10.0.0.1",
  ],

  // Optional: Add allowed user agents (for testing)
  allowedUserAgents: [
    // "bot",
    // "crawler",
  ],

  // Optional: Maintenance message customization
  message: {
    title: "Under Maintenance",
    subtitle: "We'll be back soon!",
    description: "We're currently performing some maintenance...",
  },
};
```

## Environment Variables

You can also control maintenance mode using environment variables:

```bash
# Enable maintenance mode via environment variable
NEXT_PUBLIC_MAINTENANCE_MODE=true
```

## Bypass Options

### IP Address Bypass

Add your IP address to the `allowedIPs` array to bypass maintenance mode:

```typescript
allowedIPs: [
  "192.168.1.100", // Your local IP
  "203.0.113.1",   // Your public IP
],
```

### User Agent Bypass

Add specific user agent strings to allow certain clients to bypass:

```typescript
allowedUserAgents: [
  "bot",
  "crawler",
  "health-check",
],
```

## Usage Workflow

1. **Before Maintenance:**

   ```bash
   npm run maintenance:on
   ```

2. **Perform your maintenance tasks**

3. **After Maintenance:**
   ```bash
   npm run maintenance:off
   ```

## Important Notes

- **Restart Required**: After changing the maintenance configuration, restart your development server for changes to take effect
- **Middleware Priority**: Maintenance mode check happens before authentication checks
- **Public Access**: The `/maintenance` page is always accessible when maintenance mode is enabled
- **API Routes**: API routes are not affected by maintenance mode (they're excluded from middleware)

## Customization

### Styling the Maintenance Page

The maintenance page is located at `app/maintenance/page.tsx` and can be customized with:

- Different colors and styling
- Custom messages
- Additional information or contact details
- Branding elements

### Custom Bypass Logic

You can extend the bypass logic in `lib/config/maintenance.ts` to include:

- Time-based bypasses
- Role-based bypasses
- Custom authentication checks

## Troubleshooting

### Maintenance Mode Not Working

1. Check if the configuration file is properly imported
2. Restart your development server
3. Clear browser cache
4. Check browser console for errors

### Can't Access Site After Disabling

1. Verify the configuration file was updated correctly
2. Restart your development server
3. Check if there are any syntax errors in the maintenance config

### Bypass Not Working

1. Verify your IP address is correct
2. Check if you're behind a proxy or VPN
3. Ensure the user agent string matches exactly


