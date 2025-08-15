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

interface ContactFormConfirmationProps {
  userName?: string;
  userEmail: string;
  subject: string;
  messagePreview: string;
  helpCenterUrl?: string;
}

export const ContactFormConfirmation = ({
  userName,
  userEmail,
  subject,
  messagePreview,
  helpCenterUrl,
}: ContactFormConfirmationProps) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
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
                <Heading style={headerTitle}>We received your message</Heading>
              </Column>
            </Row>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hello {userName || "there"},</Text>
            <Text style={message}>
              Thanks for contacting BeBlocky! This is a quick confirmation that
              we received your message. Our team will get back to you within 24
              hours.
            </Text>

            <Section style={summaryCard}>
              <div style={summaryHeader}>Your submission</div>
              <div style={summaryRow}>
                <span style={summaryLabel}>Email:</span>
                <span style={summaryValue}>{userEmail}</span>
              </div>
              <div style={summaryRow}>
                <span style={summaryLabel}>Subject:</span>
                <span style={summaryValue}>{subject}</span>
              </div>
              <div style={summaryRowCol}>
                <span style={summaryLabel}>Message preview:</span>
                <p style={summaryPreview}>{messagePreview}</p>
              </div>
            </Section>

            <Section style={ctaContainer}>
              {helpCenterUrl && (
                <Button style={ctaButton} href={helpCenterUrl}>
                  Visit Help Center
                </Button>
              )}
            </Section>

            <Text style={message}>
              If you didn't submit this request, please ignore this email.
            </Text>
            <Text style={message}>
              Best regards,
              <br />
              <strong>The BeBlocky Team</strong>
            </Text>
          </Section>

          <Hr style={hr} />

          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to {userEmail} as a confirmation of your
              contact form submission.
            </Text>
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

const summaryCard = {
  background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
  borderRadius: "8px",
  padding: "20px",
  borderLeft: "4px solid #667eea",
  margin: "20px 0",
};

const summaryHeader = {
  fontWeight: 600,
  color: "#1f2937",
  marginBottom: "12px",
};

const summaryRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "6px 0",
  borderBottom: "1px solid #e5e7eb",
};

const summaryRowCol = {
  display: "flex",
  flexDirection: "column" as const,
  gap: "8px",
  paddingTop: "6px",
};

const summaryLabel = {
  fontWeight: 600,
  color: "#374151",
  fontSize: "14px",
};

const summaryValue = {
  color: "#6b7280",
  fontSize: "14px",
};

const summaryPreview = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: 1.6,
  margin: 0,
};

const ctaContainer = {
  textAlign: "center" as const,
  margin: "30px 0 0",
};

const ctaButton = {
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

const footerAddress = {
  fontSize: "12px",
  color: "#9ca3af",
  lineHeight: "1.5",
};

export default ContactFormConfirmation;
