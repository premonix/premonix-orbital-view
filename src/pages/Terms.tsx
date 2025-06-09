
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-starlink-dark text-starlink-white">
      <Helmet>
        <title>Terms of Service | PREMONIX - Global Threat Intelligence</title>
        <meta name="description" content="Terms of Service for PREMONIX Global Threat Intelligence Platform" />
      </Helmet>
      
      <Navigation />
      
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="glass-panel border border-starlink-grey/20 p-8">
            <h1 className="text-4xl font-bold text-starlink-white mb-8">Terms of Service</h1>
            
            <div className="space-y-6 text-starlink-grey-light">
              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Agreement to Terms</h2>
                <p>
                  By accessing and using PREMONIX, you agree to be bound by these Terms of Service. 
                  If you do not agree to these terms, please do not use our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Service Description</h2>
                <p className="mb-4">
                  PREMONIX provides global threat intelligence, risk assessment, and security analytics services. 
                  Our platform offers:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Real-time threat monitoring and alerts</li>
                  <li>Risk assessment tools and analytics</li>
                  <li>Sector-specific intelligence reports</li>
                  <li>Resilience planning and response tools</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">User Responsibilities</h2>
                <p className="mb-4">Users agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide accurate account information</li>
                  <li>Use the service for legitimate security purposes only</li>
                  <li>Not share account credentials with unauthorized parties</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Not attempt to compromise platform security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Subscription and Billing</h2>
                <p>
                  Paid subscriptions are billed according to your selected plan. Charges are non-refundable 
                  except as required by law. You may cancel your subscription at any time through your 
                  account settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Intellectual Property</h2>
                <p>
                  All content, features, and functionality of PREMONIX are owned by us and protected by 
                  copyright, trademark, and other intellectual property laws. Users may not reproduce, 
                  distribute, or create derivative works without permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibent text-starlink-white mb-4">Limitation of Liability</h2>
                <p>
                  PREMONIX provides threat intelligence on an "as is" basis. While we strive for accuracy, 
                  we cannot guarantee the completeness or timeliness of all threat data. Users are responsible 
                  for their own security decisions and implementations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Termination</h2>
                <p>
                  We reserve the right to terminate or suspend accounts that violate these terms or 
                  engage in harmful activities. Users may terminate their accounts at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Changes to Terms</h2>
                <p>
                  We may update these terms periodically. Continued use of the platform after changes 
                  constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Contact Information</h2>
                <p>
                  For questions about these terms, contact us at legal@premonix.io or through our 
                  contact page.
                </p>
              </section>

              <div className="mt-8 pt-6 border-t border-starlink-grey/20">
                <p className="text-sm text-starlink-grey">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Terms;
