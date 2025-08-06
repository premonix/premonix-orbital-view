
import { Helmet } from 'react-helmet-async';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-starlink-dark text-starlink-white">
      <Helmet>
        <title>Privacy Policy | PREMONIX - Global Threat Intelligence</title>
        <meta name="description" content="Privacy Policy for PREMONIX Global Threat Intelligence Platform" />
      </Helmet>
      
      <Navigation />
      
      <main className="flex-1 pt-20 pb-20">
        <div className="max-w-4xl mx-auto px-4 lg:px-6">
          <div className="glass-panel border border-starlink-grey/20 p-8">
            <h1 className="text-4xl font-bold text-starlink-white mb-8">Privacy Policy</h1>
            
            <div className="space-y-6 text-starlink-grey-light">
              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Information We Collect</h2>
                <p className="mb-4">
                  PREMONIX collects information to provide and improve our global threat intelligence services. This includes:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Account information (email, name, company details)</li>
                  <li>Usage data and analytics</li>
                  <li>Device and browser information</li>
                  <li>Threat intelligence queries and preferences</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use your information to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Provide threat intelligence and security services</li>
                  <li>Improve our platform and develop new features</li>
                  <li>Send important updates and security alerts</li>
                  <li>Ensure platform security and prevent misuse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Data Security</h2>
                <p>
                  We implement enterprise-grade security measures to protect your data, including encryption, 
                  secure data centers, and regular security audits. Your threat intelligence data is treated 
                  with the highest level of confidentiality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Data Sharing</h2>
                <p>
                  We do not sell or share your personal information with third parties, except as necessary 
                  to provide our services or as required by law. Threat intelligence data may be anonymized 
                  and aggregated for research purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Your Rights</h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Request deletion of your data</li>
                  <li>Opt out of non-essential communications</li>
                  <li>Export your data</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Contact Us</h2>
                <p>
                  For privacy-related questions or requests, contact us at privacy@premonix.io or through 
                  our contact page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-starlink-white mb-4">Company Information</h2>
                <p className="mb-4">
                  PREMONIX is a wholly owned subsidiary of Cardiff Giant Holdings Limited.
                </p>
                <div className="text-starlink-grey-light">
                  <p><strong>Cardiff Giant Holdings Limited</strong></p>
                  <p>Unit 12 Green Park</p>
                  <p>Coedcae Lane Industrial Estate</p>
                  <p>Pontyclun, Mid Glamorgan</p>
                  <p>United Kingdom, CF72 9GP</p>
                </div>
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

export default Privacy;
