
const Footer = () => {
  const footerSections = [
    {
      title: 'About',
      links: ['Our Mission', 'Technology', 'Team', 'Careers']
    },
    {
      title: 'Data Sources',
      links: ['Government APIs', 'Satellite Data', 'News Analysis', 'Social Signals']
    },
    {
      title: 'Privacy',
      links: ['Privacy Policy', 'Data Usage', 'Security', 'Compliance']
    },
    {
      title: 'Terms',
      links: ['Terms of Service', 'API Terms', 'Licensing', 'Support']
    },
    {
      title: 'Contact',
      links: ['Sales', 'Support', 'Press', 'Partnerships']
    }
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-20">
      <div className="glass-panel border-t border-starlink-grey/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-starlink-blue rounded-sm flex items-center justify-center">
                <span className="text-starlink-dark font-bold text-sm">P</span>
              </div>
              <span className="text-starlink-grey-light text-sm">© 2024 PREMONIX</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {footerSections.map((section) => (
                <div key={section.title} className="flex items-center space-x-1">
                  <span className="text-starlink-grey text-xs font-medium">{section.title}</span>
                  <div className="w-1 h-1 bg-starlink-grey/50 rounded-full" />
                </div>
              ))}
            </div>
            
            <div className="text-starlink-grey-light text-xs">
              Global Threat Intelligence Platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
