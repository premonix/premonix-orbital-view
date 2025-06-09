
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerSections = [
    {
      title: 'About',
      links: [
        { label: 'Our Mission', href: '/about' },
        { label: 'Technology', href: '/about' },
        { label: 'Team', href: '/about' },
        { label: 'Careers', href: '/about' }
      ]
    },
    {
      title: 'Data Sources',
      links: [
        { label: 'Government APIs', href: '/data-sources' },
        { label: 'Satellite Data', href: '/data-sources' },
        { label: 'News Analysis', href: '/data-sources' },
        { label: 'Social Signals', href: '/data-sources' }
      ]
    },
    {
      title: 'Privacy',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Data Usage', href: '/data-sources' },
        { label: 'Security', href: '/about' },
        { label: 'Compliance', href: '/about' }
      ]
    },
    {
      title: 'Terms',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'API Terms', href: '/data-sources' },
        { label: 'Licensing', href: '/about' },
        { label: 'Support', href: '/about' }
      ]
    },
    {
      title: 'Contact',
      links: [
        { label: 'Sales', href: '/about' },
        { label: 'Support', href: '/about' },
        { label: 'Press', href: '/about' },
        { label: 'Partnerships', href: '/about' }
      ]
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20">
      <div className="glass-panel border-t border-starlink-grey/20">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-starlink-blue rounded-sm flex items-center justify-center">
                  <span className="text-starlink-dark font-bold text-xs lg:text-sm">P</span>
                </div>
                <span className="text-starlink-grey-light text-xs lg:text-sm">© 2024 PREMONIX</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {footerSections.map((section) => (
                <div key={section.title} className="flex items-center space-x-1">
                  <Link 
                    to={section.links[0].href}
                    className="text-starlink-grey text-xs font-medium hover:text-starlink-blue transition-colors"
                  >
                    {section.title}
                  </Link>
                  <div className="w-1 h-1 bg-starlink-grey/50 rounded-full" />
                </div>
              ))}
            </div>
            
            <div className="text-starlink-grey-light text-xs text-center lg:text-left">
              Global Threat Intelligence Platform
            </div>
          </div>
          
          <div className="mt-2 pt-2 border-t border-starlink-grey/20">
            <p className="text-starlink-grey text-xs text-center">
              Premonix is a wholly owned subsidiary of Cardiff Giant Holdings Limited
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
