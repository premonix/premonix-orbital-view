# PREMONIX Platform

> **Intelligent Threat Monitoring & Organizational Resilience Platform**

PREMONIX is a comprehensive, enterprise-grade threat intelligence and risk monitoring platform that provides real-time geopolitical threat analysis, AI-powered insights, and decision support systems to help organizations build resilience against global disruptions.

---

## 🌟 Overview

PREMONIX transforms how organizations monitor, analyze, and respond to global threats by aggregating data from 10,000+ sources and delivering actionable intelligence through an intuitive, real-time dashboard. Whether you're safeguarding critical infrastructure, managing supply chain risks, or protecting enterprise operations, PREMONIX provides the insights you need to see disruptions before they impact your business.

### Key Capabilities

- **24/7 Real-Time Monitoring**: Continuous threat detection across global regions
- **AI-Powered Analysis**: Machine learning models that identify patterns and predict emerging risks
- **Geospatial Intelligence**: Interactive threat mapping with heat zones and regional analysis
- **Decision Support System (DSS)**: Quantified risk assessments tailored to your organization
- **Multi-Tier Access Control**: Role-based permissions from guest access to enterprise administration
- **Resilience Toolkit**: Crisis response playbooks, business impact assessments, and awareness training

---

## 🚀 Features

### Intelligence & Monitoring

#### Real-Time Threat Feed
- Live stream of global threat signals categorized by type (geopolitical, cyber, natural disasters, etc.)
- Severity-based color coding and filtering
- Confidence scores and source attribution
- Automatic refresh with manual override capability

#### Interactive Threat Map
- MapLibre GL-powered global visualization
- Heat zone overlays showing threat concentration
- Click-to-explore threat details with popup cards
- Region-specific risk scoring
- Custom control panels for layer management

#### AI Threat Analysis
- Automated pattern recognition across threat signals
- Predictive analytics for emerging risks
- Natural language summaries of complex threat landscapes
- Trend analysis and correlation detection

### Decision Support

#### Dynamic Security Score (DSS)
- Sector-specific risk assessments
- Organization size and complexity factoring
- Geographic exposure analysis
- Supply chain vulnerability scoring
- Real-time score updates based on threat landscape changes

#### Executive Briefings
- Daily automated intelligence summaries
- Customizable by region, sector, and threat type
- AI-generated insights and recommendations
- Exportable reports in multiple formats

#### Alert System
- Personalized threat notifications
- Configurable alert thresholds
- Multi-channel delivery (email, in-app, SMS)
- Alert history and analytics

### Resilience Tools

#### Crisis Response Playbooks
- Pre-built response templates for common scenarios
- Customizable action plans
- Role assignment and task tracking
- Communication templates

#### Business Impact Assessment
- Scenario modeling tools
- Revenue impact calculators
- Recovery time objective (RTO) planning
- Dependency mapping

#### Threat Awareness Training
- Interactive learning modules
- Sector-specific training content
- Progress tracking and certification
- Regular content updates

### Administration & Management

#### Multi-Organization Support
- Organization hierarchy management
- Team member provisioning
- Department-level access control
- Usage analytics and reporting

#### Role-Based Access Control (RBAC)
- **Guest**: Limited threat map and feed access
- **Individual**: Full threat intelligence and basic tools
- **Pro**: Advanced analytics and custom alerts
- **Team Member**: Collaboration features
- **Team Admin**: Team management and settings
- **Enterprise Admin**: Full organization control
- **Super User**: Platform-wide administration

#### Audit & Compliance
- Comprehensive audit logs
- User activity tracking
- Data access reports
- Compliance dashboard

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router v6
- **State Management**: React Context + TanStack Query
- **Maps**: MapLibre GL + React Map GL
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth (email, OAuth, magic links)
- **Edge Functions**: Deno-based serverless functions
- **Real-time**: WebSocket subscriptions
- **Storage**: Supabase Storage (when needed)

### External Integrations
- **AI Services**: OpenAI GPT-4 for threat analysis
- **Email**: Resend for transactional emails
- **Maps**: Mapbox for additional geocoding
- **Threat Intelligence**: Multiple OSINT feeds
- **Payments**: Stripe for subscription management

---

## 📁 Project Structure

```
premonix/
├── src/
│   ├── components/           # React components
│   │   ├── admin/           # Admin console components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── isometric/       # Hero/landing page components
│   │   ├── maps/            # Map-related components
│   │   ├── navigation/      # Navigation components
│   │   ├── resilience/      # Resilience toolkit components
│   │   └── ui/              # shadcn/ui components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # External service integrations
│   │   └── supabase/        # Supabase client & types
│   ├── lib/                 # Utility libraries
│   ├── pages/               # Page components
│   ├── services/            # Business logic services
│   ├── types/               # TypeScript type definitions
│   └── constants/           # Application constants
├── supabase/
│   ├── functions/           # Edge functions
│   └── migrations/          # Database migrations
└── public/                  # Static assets
```

---

## 🏃‍♂️ Getting Started

### Prerequisites

- **Node.js** 18+ and npm (install via [nvm](https://github.com/nvm-sh/nvm))
- **Supabase Account** (for backend services)
- **API Keys** (OpenAI, Mapbox, Resend, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd premonix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory (copy from `.env.example` if available):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Database Setup

The project uses Supabase migrations for database schema management. Migrations are automatically applied when deploying edge functions, but for local development:

```bash
# Link to your Supabase project (first time only)
npx supabase link --project-ref your-project-ref

# Apply migrations
npx supabase db push

# Generate TypeScript types
npx supabase gen types typescript --local > src/integrations/supabase/types.ts
```

### Edge Functions

Edge functions are deployed automatically. To test locally:

```bash
npx supabase functions serve --env-file .env
```

---

## 🗄️ Database Schema

### Core Tables

- **`profiles`**: User profile information
- **`user_roles`**: Role assignments (RBAC)
- **`organizations`**: Organization records
- **`organization_members`**: Organization membership
- **`threat_signals`**: Real-time threat data
- **`user_alerts`**: Personalized alert configurations
- **`user_watchlist`**: Custom threat watchlists
- **`user_dashboard_analytics`**: Usage tracking
- **`dss_assessments`**: Security score assessments
- **`audit_logs`**: System audit trail

### Key Database Functions

- `get_user_role(user_id)`: Retrieve highest user role
- `calculate_initial_dss_score()`: Generate DSS assessment scores
- `assign_admin_role()`: Super user privilege escalation
- `validate_email()`: Email format validation
- `sanitize_text_input()`: XSS protection

---

## 🔐 Security

### Row Level Security (RLS)

All tables implement RLS policies to ensure data isolation:
- Users can only access their own data
- Organization members can access shared organization data
- Admins have elevated permissions within their scope
- Super users have platform-wide access

### Authentication

- Email/password authentication
- Email verification required
- Password reset functionality
- Session management via Supabase Auth
- JWT-based API authentication

### Input Validation

- Client-side validation with Zod schemas
- Server-side sanitization in database functions
- XSS protection on all text inputs
- SQL injection prevention via prepared statements

---

## 🚀 Deployment

### Production Deployment (Lovable)

1. Open the [Lovable Project](https://lovable.dev/projects/c18ae735-c46a-4db9-aa88-3b173e0c81ba)
2. Click **Share** → **Publish**
3. Your app will be deployed to `*.lovable.app`

### Custom Domain

1. Navigate to **Project** → **Settings** → **Domains**
2. Click **Connect Domain**
3. Follow DNS configuration instructions
4. See [Lovable Custom Domain Guide](https://docs.lovable.dev/tips-tricks/custom-domain)

### Self-Hosting

The application can be deployed to any static hosting provider:

```bash
# Build for production
npm run build

# Deploy the 'dist' folder to your hosting provider
```

Compatible with: Vercel, Netlify, Cloudflare Pages, AWS S3 + CloudFront, etc.

---

## 🔧 Development

### Code Editing Options

**1. Lovable Editor** (Recommended for rapid development)
- Visit [Lovable Project](https://lovable.dev/projects/c18ae735-c46a-4db9-aa88-3b173e0c81ba)
- Use AI-powered development
- Changes auto-commit to GitHub

**2. Local IDE**
- Clone repository
- Edit with VS Code, WebStorm, etc.
- Push changes to sync with Lovable

**3. GitHub Codespaces**
- Click **Code** → **Codespaces** → **New codespace**
- Full VS Code environment in browser

**4. Direct GitHub Editing**
- Navigate to file → Click edit button
- Make changes and commit

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding Dependencies

```bash
# Using npm
npm install package-name

# Or let Lovable AI install it
# Just ask: "Install react-query"
```

---

## 🎨 Design System

PREMONIX uses a comprehensive design system built on Tailwind CSS with semantic color tokens:

### Color Tokens (HSL)
- **Primary**: Brand color for key actions
- **Secondary**: Supporting brand color
- **Accent**: Highlight color for emphasis
- **Muted**: Subdued backgrounds
- **Destructive**: Error/danger states

### Component Variants
All UI components support theme-aware variants that automatically adapt to light/dark mode.

### Customization
Edit `src/index.css` and `tailwind.config.ts` to customize the design system.

---

## 📊 Features by User Role

| Feature | Guest | Individual | Pro | Team Member | Team Admin | Enterprise | Super User |
|---------|-------|-----------|-----|-------------|------------|------------|------------|
| Threat Map | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Signal Feed | Limited | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| AI Analysis | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Custom Alerts | ✗ | Basic | ✓ | ✓ | ✓ | ✓ | ✓ |
| DSS Assessment | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Reports | ✗ | Basic | ✓ | ✓ | ✓ | ✓ | ✓ |
| Resilience Tools | Preview | Basic | ✓ | ✓ | ✓ | ✓ | ✓ |
| Team Collaboration | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ | ✓ |
| Organization Mgmt | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ | ✓ |
| Admin Console | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✓ |
| System Monitoring | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ |

---

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow existing code style
   - Add TypeScript types for new code
   - Update tests if applicable

3. **Test your changes**
   ```bash
   npm run dev
   # Test in browser
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use TypeScript for all new code
- Follow React best practices (hooks, functional components)
- Use semantic HTML and ARIA attributes for accessibility
- Implement responsive design (mobile-first)
- Keep components small and focused
- Add JSDoc comments for complex functions

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `test:` Test additions/changes
- `chore:` Build process or auxiliary tool changes

---

## 📝 Environment Variables

Required environment variables for full functionality:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Edge Function Secrets (set in Supabase dashboard)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENAI_API_KEY=your-openai-key
RESEND_API_KEY=your-resend-key
MAPBOX_TOKEN=your-mapbox-token
STRIPE_SECRET_KEY=your-stripe-key
NEWSAPI_KEY=your-newsapi-key
VIRUSTOTAL_API_KEY=your-virustotal-key
```

---

## 📚 Additional Resources

- **Lovable Platform**: [https://lovable.dev](https://lovable.dev)
- **Lovable Documentation**: [https://docs.lovable.dev](https://docs.lovable.dev)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **React Documentation**: [https://react.dev](https://react.dev)
- **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- **shadcn/ui**: [https://ui.shadcn.com](https://ui.shadcn.com)

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 💬 Support

For platform support and inquiries:
- **Email**: support@premonix.ai
- **Issues**: Use GitHub Issues for bug reports
- **Lovable Project**: [https://lovable.dev/projects/c18ae735-c46a-4db9-aa88-3b173e0c81ba](https://lovable.dev/projects/c18ae735-c46a-4db9-aa88-3b173e0c81ba)

---

## 🎯 Roadmap

### Planned Features
- Mobile applications (iOS/Android)
- Advanced predictive modeling
- Integration marketplace
- White-label solutions
- API access for enterprise
- Automated response orchestration
- Enhanced collaboration tools
- Custom threat feed integration

---

Built with ❤️ using [Lovable](https://lovable.dev)
