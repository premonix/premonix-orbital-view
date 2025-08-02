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

interface WeeklyDigestEmailProps {
  userName: string
  weekStarting: string
  totalSignals: number
  topCategories: Array<{
    category: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }>
  criticalEvents: Array<{
    title: string
    location: string
    date: string
  }>
  dashboardUrl: string
  unsubscribeUrl: string
}

export const WeeklyDigestEmail = ({
  userName,
  weekStarting,
  totalSignals,
  topCategories,
  criticalEvents,
  dashboardUrl,
  unsubscribeUrl,
}: WeeklyDigestEmailProps) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈'
      case 'down': return '📉'
      default: return '➡️'
    }
  }

  return (
    <Html>
      <Head />
      <Preview>Your weekly threat intelligence digest - {totalSignals} signals analyzed</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={h1}>📊 Weekly Intelligence Digest</Heading>
            <Text style={subtitle}>Week of {new Date(weekStarting).toLocaleDateString()}</Text>
          </Section>

          <Section>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Here's your weekly threat intelligence summary. This week, we analyzed{' '}
              <strong>{totalSignals.toLocaleString()} signals</strong> from global sources to keep you informed.
            </Text>

            {/* Key Statistics */}
            <Section style={statsContainer}>
              <Heading style={sectionTitle}>📈 This Week's Numbers</Heading>
              
              <div style={statGrid}>
                <div style={statItem}>
                  <div style={statNumber}>{totalSignals.toLocaleString()}</div>
                  <div style={statLabel}>Total Signals</div>
                </div>
                <div style={statItem}>
                  <div style={statNumber}>{criticalEvents.length}</div>
                  <div style={statLabel}>Critical Events</div>
                </div>
                <div style={statItem}>
                  <div style={statNumber}>{topCategories.length}</div>
                  <div style={statLabel}>Active Categories</div>
                </div>
              </div>
            </Section>

            {/* Top Categories */}
            <Section style={sectionContainer}>
              <Heading style={sectionTitle}>🏷️ Top Threat Categories</Heading>
              
              {topCategories.slice(0, 5).map((category, index) => (
                <div key={category.category} style={categoryItem}>
                  <div style={categoryHeader}>
                    <span style={categoryName}>{category.category}</span>
                    <span style={categoryTrend}>
                      {getTrendIcon(category.trend)} {category.count} signals
                    </span>
                  </div>
                  <div style={progressBar}>
                    <div 
                      style={{
                        ...progressFill,
                        width: `${(category.count / Math.max(...topCategories.map(c => c.count))) * 100}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </Section>

            {/* Critical Events */}
            {criticalEvents.length > 0 && (
              <Section style={sectionContainer}>
                <Heading style={sectionTitle}>🚨 Critical Events This Week</Heading>
                
                {criticalEvents.slice(0, 3).map((event, index) => (
                  <div key={index} style={eventItem}>
                    <div style={eventTitle}>{event.title}</div>
                    <div style={eventMeta}>
                      📍 {event.location} • {new Date(event.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
                
                {criticalEvents.length > 3 && (
                  <Text style={moreEvents}>
                    +{criticalEvents.length - 3} more critical events in your dashboard
                  </Text>
                )}
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button href={dashboardUrl} style={button}>
                View Full Analytics Dashboard
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              You're receiving this weekly digest based on your notification preferences.{' '}
              <Link href={`${dashboardUrl}#settings`} style={link}>
                Update preferences
              </Link>{' '}
              or{' '}
              <Link href={unsubscribeUrl} style={link}>
                unsubscribe
              </Link>.
            </Text>
            
            <Text style={footer}>
              Stay informed,<br />
              The PREMONIX Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export default WeeklyDigestEmail

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

const sectionContainer = {
  margin: '32px 0',
}

const sectionTitle = {
  color: '#ffffff',
  fontSize: '20px',
  fontWeight: '600',
  margin: '0 0 16px',
}

const statsContainer = {
  backgroundColor: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const statGrid = {
  display: 'flex',
  justifyContent: 'space-around',
  textAlign: 'center' as const,
}

const statItem = {
  flex: '1',
}

const statNumber = {
  color: '#3b82f6',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 4px',
}

const statLabel = {
  color: '#94a3b8',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  fontWeight: '500',
}

const categoryItem = {
  margin: '12px 0',
}

const categoryHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '6px',
}

const categoryName = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '500',
}

const categoryTrend = {
  color: '#94a3b8',
  fontSize: '14px',
}

const progressBar = {
  backgroundColor: '#334155',
  height: '6px',
  borderRadius: '3px',
  overflow: 'hidden',
}

const progressFill = {
  backgroundColor: '#3b82f6',
  height: '100%',
  borderRadius: '3px',
}

const eventItem = {
  backgroundColor: '#1e293b',
  border: '1px solid #ef4444',
  borderRadius: '6px',
  padding: '16px',
  margin: '12px 0',
}

const eventTitle = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 8px',
}

const eventMeta = {
  color: '#94a3b8',
  fontSize: '14px',
}

const moreEvents = {
  color: '#94a3b8',
  fontSize: '14px',
  fontStyle: 'italic',
  textAlign: 'center' as const,
  margin: '16px 0 0',
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
  fontSize: '12px',
  lineHeight: '18px',
  margin: '16px 0',
}