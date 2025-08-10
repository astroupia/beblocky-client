import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Link,
  Button,
  Hr,
} from "@react-email/components";

interface PasswordResetEmailProps {
  userName?: string;
  userEmail: string;
  resetLink: string;
  termsUrl?: string;
}

export const PasswordResetEmail = ({
  userName,
  userEmail,
  resetLink,
  termsUrl,
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header Section */}
          <Section style={header}>
            <Row>
              <Column align="center">
                <div style={logoContainer}>
                  <div style={logoIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div style={logoTextContainer}>
                    <span style={logoText}>BeBlocky</span>
                    <span style={betaBadge}>BETA</span>
                  </div>
                </div>
                <Heading style={headerTitle}>Password Reset Request</Heading>
              </Column>
            </Row>
          </Section>

          {/* Content Section */}
          <Section style={content}>
            <Text style={greeting}>Hello {userName},</Text>

            <Text style={message}>
              We received a request to reset your password for your BeBlocky
              account. If you made this request, click the button below to
              create a new password. If you didn't request this, you can safely
              ignore this email.
            </Text>

            {/* CTA Button */}
            <Section style={ctaContainer}>
              <Button style={ctaButton} href={resetLink}>
                Reset My Password
              </Button>
            </Section>

            {/* Info Cards */}
            <Section style={infoCardsContainer}>
              <div style={infoCard}>
                <div style={infoCardHeader}>
                  <svg
                    style={infoCardIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span style={infoCardTitle}>Link Expires Soon</span>
                </div>
                <Text style={infoCardText}>
                  This reset link will expire in 15 minutes for your security.
                </Text>
              </div>

              <div style={infoCard}>
                <div style={infoCardHeader}>
                  <svg
                    style={infoCardIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span style={infoCardTitle}>One-Time Use</span>
                </div>
                <Text style={infoCardText}>
                  This link can only be used once. After resetting your
                  password, it will become invalid.
                </Text>
              </div>

              <div style={infoCard}>
                <div style={infoCardHeader}>
                  <svg
                    style={infoCardIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <span style={infoCardTitle}>Secure Process</span>
                </div>
                <Text style={infoCardText}>
                  Your new password will be encrypted and stored securely in our
                  system.
                </Text>
              </div>
            </Section>

            {/* Security Notice */}
            <Section style={securityNotice}>
              <div style={securityNoticeHeader}>
                <svg
                  style={securityNoticeIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
                <span style={securityNoticeTitle}>Security Reminder</span>
              </div>
              <Text style={securityNoticeText}>
                If you didn't request this password reset, please ignore this
                email or contact our support team immediately. Your account
                security is important to us.
              </Text>
            </Section>

            <Text style={message}>
              If the button above doesn't work, you can copy and paste this link
              into your browser:
              <br />
              <Link href={resetLink} style={linkStyle}>
                {resetLink}
              </Link>
            </Text>

            <Text style={message}>
              Best regards,
              <br />
              <strong>The BeBlocky Team</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer Section */}
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to {userEmail} because you requested a
              password reset for your BeBlocky account.
            </Text>

            <div style={footerLinks}>
              <span style={footerSeparator}>•</span>
              <Link href={termsUrl} style={footerLink}>
                Terms of Service
              </Link>
            </div>

            <Text style={footerAddress}>
              BeBlocky - Coding Education Platform
              <br />
              Addis Ababa, Ethiopia
              <br />© 2024 BeBlocky. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f9fafb",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const header = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "40px 30px",
  textAlign: "center" as const,
  color: "white",
};

const logoContainer = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "20px",
};

const logoIcon = {
  width: "48px",
  height: "48px",
  background: "rgba(255, 255, 255, 0.2)",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
  color: "white",
};

const logoTextContainer = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const logoText = {
  fontSize: "28px",
  fontWeight: "700",
  color: "white",
};

const betaBadge = {
  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
  color: "white",
  fontSize: "10px",
  fontWeight: "600",
  padding: "4px 8px",
  borderRadius: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const headerTitle = {
  fontSize: "24px",
  fontWeight: "600",
  margin: "0",
  color: "white",
};

const content = {
  padding: "40px 30px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "600",
  color: "#1f2937",
  marginBottom: "20px",
};

const message = {
  fontSize: "16px",
  color: "#6b7280",
  marginBottom: "30px",
  lineHeight: "1.7",
};

const ctaContainer = {
  textAlign: "center" as const,
  margin: "40px 0",
};

const ctaButton = {
  backgroundColor: "#667eea",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 32px",
  boxShadow: "0 4px 14px 0 rgba(102, 126, 234, 0.4)",
};

const infoCardsContainer = {
  margin: "30px 0",
};

const infoCard = {
  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  borderRadius: "8px",
  padding: "20px",
  borderLeft: "4px solid #667eea",
  marginBottom: "16px",
};

const infoCardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "8px",
};

const infoCardIcon = {
  width: "20px",
  height: "20px",
  color: "#667eea",
};

const infoCardTitle = {
  fontWeight: "600",
  color: "#1f2937",
  fontSize: "14px",
};

const infoCardText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const securityNotice = {
  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "20px",
  margin: "30px 0",
};

const securityNoticeHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
};

const securityNoticeIcon = {
  width: "24px",
  height: "24px",
  color: "#d97706",
};

const securityNoticeTitle = {
  fontWeight: "600",
  color: "#92400e",
  fontSize: "16px",
};

const securityNoticeText = {
  fontSize: "14px",
  color: "#92400e",
  margin: "0",
  lineHeight: "1.6",
};

const linkStyle = {
  color: "#667eea",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const footer = {
  backgroundColor: "#f9fafb",
  padding: "30px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  marginBottom: "16px",
};

const footerLinks = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  marginBottom: "20px",
  flexWrap: "wrap" as const,
};

const footerLink = {
  color: "#667eea",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "500",
};

const footerSeparator = {
  color: "#9ca3af",
  fontSize: "14px",
};

const footerAddress = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.5",
};

export default PasswordResetEmail;
