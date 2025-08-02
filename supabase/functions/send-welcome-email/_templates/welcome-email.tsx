import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
  Button,
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  userName: string
  userEmail: string
  loginUrl: string
  dashboardUrl: string
}

export const WelcomeEmail = ({
  userName,
  userEmail,
  loginUrl,
  dashboardUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to PREMONIX - Your Threat Intelligence Dashboard</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={h1}>Welcome to PREMONIX</Heading>
          <Text style={subtitle}>Your AI-Powered Threat Intelligence Platform</Text>
        </Section>

        <Section>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Welcome to PREMONIX! You've successfully joined thousands of individuals and organizations 
            who rely on our AI-powered threat intelligence to stay ahead of emerging risks.
          </Text>
          
          <Text style={text}>
            <strong>What you can do now:</strong>
          </Text>
          
          <ul style={list}>
            <li style={listItem}>📡 Monitor real-time threat signals from 10,000+ global sources</li>
            <li style={listItem}>🎯 Set up personalized alerts for your location and interests</li>
            <li style={listItem}>🛡️ Access the Resilience Toolkit for crisis preparedness</li>
            <li style={listItem}>📊 View interactive threat maps and analytics</li>
          </ul>

          <Section style={buttonContainer}>
            <Button
              href={dashboardUrl}
              style={button}
            >
              Access Your Dashboard
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={text}>
            <strong>Quick Start Tips:</strong>
          </Text>
          
          <Text style={text}>
            1. <strong>Customize Your Alerts:</strong> Visit your dashboard to set location preferences and threat categories
          </Text>
          
          <Text style={text}>
            2. <strong>Explore the Threat Map:</strong> See live threat activity across the globe
          </Text>
          
          <Text style={text}>
            3. <strong>Build Your Resilience Kit:</strong> Use our tools to create personalized preparedness plans
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Questions? Reply to this email or visit our{' '}
            <Link href={`${loginUrl.split('/dashboard')[0]}/contact`} style={link}>
              support center
            </Link>
          </Text>
          
          <Text style={footer}>
            Stay vigilant,<br />
            The PREMONIX Team
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#0a0a0f',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
}

const header = {
  textAlign: 'center' as const,
  marginBottom: '40px',
}

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0 0 8px',
  padding: '0',
}

const subtitle = {
  color: '#3b82f6',
  fontSize: '18px',
  margin: '0',
  fontWeight: '500',
}

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const list = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  paddingLeft: '20px',
}

const listItem = {
  margin: '8px 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
}

const button = {
  backgroundColor: '#3b82f6',
  borderRadius: '6px',
  color: '#0a0a0f',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
}

const link = {
  color: '#3b82f6',
  textDecoration: 'underline',
}

const hr = {
  borderColor: '#334155',
  margin: '32px 0',
}

const footer = {
  color: '#94a3b8',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
}