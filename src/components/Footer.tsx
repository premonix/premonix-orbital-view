
import { Link } from 'react-router-dom';
import { Globe, Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Threat Map', href: '/threat-map' },
        { label: 'Risk Analysis', href: '/risk-by-sector' },
        { label: 'Data Sources', href: '/data-sources' },
        { label: 'Reports', href: '/reports' }
      ]
    },
    {
      title: 'Solutions',
      links: [
        { label: 'Resilience Toolkit', href: '/resilience-toolkit' },
        { label: 'DisruptionOS', href: '/disruption-os' },
        { label: 'Enterprise', href: '/about' },
        { label: 'API Access', href: '/data-sources' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Careers', href: '/about' },
        { label: 'Blog', href: '/about' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Security', href: '/about' },
        { label: 'Compliance', href: '/about' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' }
  ];

  return (
    <footer className="relative mt-24 bg-gradient-to-b from-background to-muted/50">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5" />
      
      <div className="relative">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
            {/* Brand section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">P</span>
                </div>
                <span className="text-xl font-bold text-foreground">PREMONIX</span>
              </Link>
              
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-sm">
                Global threat intelligence platform providing real-time monitoring and AI-powered predictions 
                for emerging risks across military, cyber, economic, and political domains.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4 text-primary" />
                  <span>Global Coverage • 24/7 Monitoring</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Enterprise Security • SOC 2 Compliant</span>
                </div>
              </div>
            </div>

            {/* Footer sections */}
            {footerSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <h4 className="font-semibold text-foreground text-sm uppercase tracking-wider">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link 
                        to={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 text-primary" />
                    <span>contact@premonix.io</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Pontyclun, Mid Glamorgan, UK</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Follow Us</h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-8 h-8 rounded-lg bg-muted hover:bg-primary/10 flex items-center justify-center transition-colors duration-200 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Security & Trust</h4>
                <div className="text-sm text-muted-foreground">
                  <p>ISO 27001 Certified</p>
                  <p>GDPR Compliant</p>
                  <p>SOC 2 Type II</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-muted-foreground">
                  <span>© 2024 PREMONIX. All rights reserved.</span>
                  <span className="hidden md:block">•</span>
                  <span>A wholly owned subsidiary of Cardiff Giant Holdings Limited</span>
                </div>
              
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms
                </Link>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
