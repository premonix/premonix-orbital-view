
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
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-3 lg:py-4">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-2 lg:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 lg:w-6 lg:h-6 bg-starlink-blue rounded-sm flex items-center justify-center">
                <span className="text-starlink-dark font-bold text-xs lg:text-sm">P</span>
              </div>
              <span className="text-starlink-grey-light text-xs lg:text-sm">© 2024 PREMONIX</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
              {footerSections.map((section) => (
                <div key={section.title} className="flex items-center space-x-1">
                  <span className="text-starlink-grey text-xs font-medium">{section.title}</span>
                  <div className="w-1 h-1 bg-starlink-grey/50 rounded-full" />
                </div>
              ))}
            </div>
            
            <div className="text-starlink-grey-light text-xs text-center lg:text-left">
              Global Threat Intelligence Platform
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
