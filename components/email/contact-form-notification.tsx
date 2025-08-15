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
  Img,
} from "@react-email/components";

interface ContactFormNotificationProps {
  adminName?: string;
  contactData: {
    name: string;
    email: string;
    category: string;
    subject: string;
    message: string;
    userId?: string;
    userType?: string;
  };
  adminDashboardUrl?: string;
  termsUrl?: string;
}

export const ContactFormNotification = ({
  adminName,
  contactData,
  adminDashboardUrl,
  termsUrl,
}: ContactFormNotificationProps) => {
  const formatCategory = (category: string) => {
    return (
      category.charAt(0).toUpperCase() +
      category.slice(1).replace(/([A-Z])/g, " $1")
    );
  };

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
                    <Img
                      src="https://code.beblocky.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ficon-logo.55ac8515.png&w=96&q=75"
                      alt="BeBlocky Icon"
                      width="48"
                      height="48"
                      style={logoImage}
                    />
                  </div>
                  <div style={logoTextContainer}>
                    <span style={logoText}>BeBlocky</span>
                  </div>
                </div>
                <Heading style={headerTitle}>
                  New Contact Form Submission
                </Heading>
              </Column>
            </Row>
          </Section>

          {/* Content Section */}
          <Section style={content}>
            <Text style={greeting}>Hello {adminName || "Admin"},</Text>

            <Text style={message}>
              A new contact form submission has been received from a user.
              Please review the details below and respond accordingly.
            </Text>

            {/* Contact Details Card */}
            <Section style={contactCard}>
              <div style={contactCardHeader}>
                <svg
                  style={contactCardIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span style={contactCardTitle}>Contact Information</span>
              </div>

              <div style={contactDetails}>
                <div style={contactRow}>
                  <span style={contactLabel}>Name:</span>
                  <span style={contactValue}>{contactData.name}</span>
                </div>
                <div style={contactRow}>
                  <span style={contactLabel}>Email:</span>
                  <span style={contactValue}>
                    <Link
                      href={`mailto:${contactData.email}`}
                      style={emailLink}
                    >
                      {contactData.email}
                    </Link>
                  </span>
                </div>
                <div style={contactRow}>
                  <span style={contactLabel}>Category:</span>
                  <span style={contactValue}>
                    <span style={categoryBadge}>
                      {formatCategory(contactData.category)}
                    </span>
                  </span>
                </div>
                {contactData.userId && (
                  <div style={contactRow}>
                    <span style={contactLabel}>User ID:</span>
                    <span style={contactValue}>{contactData.userId}</span>
                  </div>
                )}
                {contactData.userType && (
                  <div style={contactRow}>
                    <span style={contactLabel}>User Type:</span>
                    <span style={contactValue}>
                      <span style={userTypeBadge}>{contactData.userType}</span>
                    </span>
                  </div>
                )}
              </div>
            </Section>

            {/* Subject and Message */}
            <Section style={messageCard}>
              <div style={messageCardHeader}>
                <svg
                  style={messageCardIcon}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span style={messageCardTitle}>Message Details</span>
              </div>

              <div style={messageContent}>
                <div style={subjectRow}>
                  <span style={subjectLabel}>Subject:</span>
                  <span style={subjectValue}>{contactData.subject}</span>
                </div>
                <div style={messageTextContainer}>
                  <span style={messageLabel}>Message:</span>
                  <div style={messageText}>{contactData.message}</div>
                </div>
              </div>
            </Section>

            {/* Action Buttons */}
            <Section style={ctaContainer}>
              <Button
                style={replyButton}
                href={`mailto:${contactData.email}?subject=Re: ${contactData.subject}`}
              >
                Reply to User
              </Button>
              {adminDashboardUrl && (
                <Button style={dashboardButton} href={adminDashboardUrl}>
                  View in Dashboard
                </Button>
              )}
            </Section>

            {/* Priority Notice */}
            <Section style={priorityNotice}>
              <div style={priorityNoticeHeader}>
                <svg
                  style={priorityNoticeIcon}
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
                <span style={priorityNoticeTitle}>Response Guidelines</span>
              </div>
              <Text style={priorityNoticeText}>
                Please respond to this inquiry within 24 hours. For urgent
                technical issues or billing problems, prioritize these requests.
                Remember to be professional and helpful in your response.
              </Text>
            </Section>

            <Text style={message}>
              This notification was automatically generated by the BeBlocky
              contact form system.
              <br />
              <strong>The BeBlocky Team</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer Section */}
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to notify you of a new contact form
              submission.
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

const logoImage = {
  width: "48px",
  height: "48px",
  objectFit: "contain" as const,
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

const contactCard = {
  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  borderRadius: "8px",
  padding: "24px",
  borderLeft: "4px solid #667eea",
  marginBottom: "24px",
};

const contactCardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
};

const contactCardIcon = {
  width: "20px",
  height: "20px",
  color: "#667eea",
};

const contactCardTitle = {
  fontWeight: "600",
  color: "#1f2937",
  fontSize: "16px",
};

const contactDetails = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
};

const contactRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #e5e7eb",
};

const contactLabel = {
  fontWeight: "600",
  color: "#374151",
  fontSize: "14px",
  minWidth: "80px",
};

const contactValue = {
  color: "#6b7280",
  fontSize: "14px",
  textAlign: "right" as const,
};

const emailLink = {
  color: "#667eea",
  textDecoration: "none",
};

const categoryBadge = {
  background: "#667eea",
  color: "white",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "500",
};

const userTypeBadge = {
  background: "#10b981",
  color: "white",
  padding: "4px 8px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "500",
  textTransform: "capitalize" as const,
};

const messageCard = {
  background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
  borderRadius: "8px",
  padding: "24px",
  borderLeft: "4px solid #f59e0b",
  marginBottom: "24px",
};

const messageCardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "16px",
};

const messageCardIcon = {
  width: "20px",
  height: "20px",
  color: "#d97706",
};

const messageCardTitle = {
  fontWeight: "600",
  color: "#92400e",
  fontSize: "16px",
};

const messageContent = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "16px",
};

const subjectRow = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "4px",
};

const subjectLabel = {
  fontWeight: "600",
  color: "#92400e",
  fontSize: "14px",
};

const subjectValue = {
  color: "#92400e",
  fontSize: "16px",
  fontWeight: "500",
};

const messageTextContainer = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
};

const messageLabel = {
  fontWeight: "600",
  color: "#92400e",
  fontSize: "14px",
};

const messageText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "1.6",
  background: "rgba(255, 255, 255, 0.5)",
  padding: "16px",
  borderRadius: "6px",
  border: "1px solid rgba(217, 119, 6, 0.2)",
};

const ctaContainer = {
  textAlign: "center" as const,
  margin: "40px 0",
  display: "flex",
  gap: "16px",
  justifyContent: "center",
  flexWrap: "wrap" as const,
};

const replyButton = {
  backgroundColor: "#667eea",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  boxShadow: "0 4px 14px 0 rgba(102, 126, 234, 0.4)",
};

const dashboardButton = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  boxShadow: "0 4px 14px 0 rgba(16, 185, 129, 0.4)",
};

const priorityNotice = {
  background: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
  border: "1px solid #3b82f6",
  borderRadius: "8px",
  padding: "20px",
  margin: "30px 0",
};

const priorityNoticeHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
};

const priorityNoticeIcon = {
  width: "24px",
  height: "24px",
  color: "#1d4ed8",
};

const priorityNoticeTitle = {
  fontWeight: "600",
  color: "#1e40af",
  fontSize: "16px",
};

const priorityNoticeText = {
  fontSize: "14px",
  color: "#1e40af",
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

export default ContactFormNotification;
