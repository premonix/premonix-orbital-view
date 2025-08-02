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

interface ThreatAlertEmailProps {
  userName: string
  alerts: Array<{
    id: string
    title: string
    category: string
    severity: 'low' | 'medium' | 'high' | 'critical'
    location: string
    timestamp: string
    description?: string
  }>
  dashboardUrl: string
  unsubscribeUrl: string
}

export const ThreatAlertEmail = ({
  userName,
  alerts,
  dashboardUrl,
  unsubscribeUrl,
}: ThreatAlertEmailProps) => {
  const criticalAlerts = alerts.filter(a => a.severity === 'critical')
  const highAlerts = alerts.filter(a => a.severity === 'high')
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444'
      case 'high': return '#f97316'
      case 'medium': return '#eab308'
      case 'low': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getSeverityBadge = (severity: string) => ({
    backgroundColor: getSeverityColor(severity),
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase' as const,
    display: 'inline-block',
    margin: '0 8px 0 0',
  })

  return (
    <Html>
      <Head />
      <Preview>
        {criticalAlerts.length > 0 
          ? `🚨 ${criticalAlerts.length} Critical Threat Alert${criticalAlerts.length > 1 ? 's' : ''}`
          : `⚠️ ${alerts.length} New Threat Alert${alerts.length > 1 ? 's' : ''}`
        }
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>
              {criticalAlerts.length > 0 ? '🚨 Critical Threat Alert' : '⚠️ Threat Alert'}
            </Heading>
            <Text style={subtitle}>PREMONIX Intelligence Update</Text>
          </Section>

          <Section>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              You have {alerts.length} new threat alert{alerts.length > 1 ? 's' : ''} matching your preferences:
            </Text>

            {alerts.map((alert, index) => (
              <Section key={alert.id} style={alertContainer}>
                <div style={alertHeader}>
                  <span style={getSeverityBadge(alert.severity)}>{alert.severity}</span>
                  <span style={category}>{alert.category}</span>
                </div>
                
                <Heading style={alertTitle}>{alert.title}</Heading>
                
                <Text style={alertMeta}>
                  📍 {alert.location} • ⏰ {new Date(alert.timestamp).toLocaleString()}
                </Text>
                
                {alert.description && (
                  <Text style={alertDescription}>{alert.description}</Text>
                )}
                
                {index < alerts.length - 1 && <Hr style={alertSeparator} />}
              </Section>
            ))}

            <Section style={buttonContainer}>
              <Button href={dashboardUrl} style={button}>
                View Full Details in Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={summaryText}>
              <strong>Alert Summary:</strong><br />
              • Critical: {criticalAlerts.length}<br />
              • High: {highAlerts.length}<br />
              • Medium/Low: {alerts.length - criticalAlerts.length - highAlerts.length}
            </Text>

            <Text style={footer}>
              These alerts were sent based on your notification preferences. You can{' '}
              <Link href={`${dashboardUrl}#alerts`} style={link}>
                update your alert settings
              </Link>{' '}
              or{' '}
              <Link href={unsubscribeUrl} style={link}>
                unsubscribe
              </Link>{' '}
              at any time.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default ThreatAlertEmail

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
  fontSize: '28px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const subtitle = {
  color: '#3b82f6',
  fontSize: '16px',
  margin: '0',
  fontWeight: '500',
}

const text = {
  color: '#e2e8f0',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const alertContainer = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '20px',
  margin: '16px 0',
}

const alertHeader = {
  marginBottom: '12px',
}

const category = {
  color: '#94a3b8',
  fontSize: '14px',
  fontWeight: '500',
}

const alertTitle = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '8px 0',
  lineHeight: '24px',
}

const alertMeta = {
  color: '#94a3b8',
  fontSize: '14px',
  margin: '8px 0',
}

const alertDescription = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '12px 0 0',
}

const alertSeparator = {
  borderColor: '#334155',
  margin: '16px 0',
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

const summaryText = {
  color: '#e2e8f0',
  fontSize: '14px',
  lineHeight: '20px',
  backgroundColor: '#1e293b',
  padding: '16px',
  borderRadius: '6px',
  margin: '16px 0',
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
  fontSize: '12px',
  lineHeight: '18px',
  margin: '16px 0',
}