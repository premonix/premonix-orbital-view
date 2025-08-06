
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock, MessageSquare, Users, Shield, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    organization: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('contact-form-submission', {
        body: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          organization: formData.organization,
          subject: formData.subject,
          message: formData.message
        }
      });

      if (error) throw error;

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        organization: '',
        subject: '',
        message: ''
      });

    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error sending message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Support",
      description: "General inquiries and support",
      contact: "support@premonix.com",
      availability: "24/7 response within 4 hours"
    },
    {
      icon: Phone,
      title: "Emergency Hotline",
      description: "Critical threat alerts and incidents",
      contact: "+1 (555) 123-4567",
      availability: "24/7 immediate response"
    },
    {
      icon: Users,
      title: "Enterprise Sales",
      description: "Custom solutions and partnerships",
      contact: "sales@premonix.com",
      availability: "Business hours: 9AM-6PM EST"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Real-time assistance and guidance",
      contact: "Available on all platform pages",
      availability: "24/7 with AI, human agents 9AM-9PM EST"
    }
  ];

  const offices = [
    {
      location: "Washington, D.C.",
      address: "1600 Intelligence Ave, Suite 500\nWashington, D.C. 20005",
      focus: "Government Relations & Policy"
    },
    {
      location: "San Francisco, CA",
      address: "One Market Plaza, Suite 2000\nSan Francisco, CA 94105",
      focus: "Technology & Engineering"
    },
    {
      location: "Pontyclun, UK",
      address: "Unit 12 Green Park\nCoedcae Lane Industrial Estate\nPontyclun, Mid Glamorgan, UK CF72 9GP",
      focus: "European Operations & Headquarters"
    }
  ];

  return (
    <div className="min-h-screen bg-starlink-dark text-starlink-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30 px-4 py-2 text-sm font-medium mb-8">
            Contact PREMONIX
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold mb-6">
            Get in Touch with
            <br />
            <span className="text-starlink-blue">Our Team</span>
          </h1>
          
          <p className="text-xl text-starlink-grey-light leading-relaxed">
            Whether you need support, have questions about our platform, or want to explore 
            enterprise solutions, we're here to help 24/7.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 px-6 bg-starlink-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">How to Reach Us</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Multiple ways to connect with our team based on your needs and urgency level.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <div className="w-12 h-12 bg-starlink-blue/20 rounded-lg flex items-center justify-center mb-4">
                    <method.icon className="w-6 h-6 text-starlink-blue" />
                  </div>
                  <CardTitle className="text-starlink-white text-lg">{method.title}</CardTitle>
                  <CardDescription className="text-starlink-grey-light">
                    {method.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-starlink-blue font-medium">{method.contact}</div>
                  <div className="text-sm text-starlink-grey-light flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {method.availability}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Send us a Message</h2>
            <p className="text-xl text-starlink-grey-light">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>
          
          <Card className="glass-panel border-starlink-grey/30">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-starlink-white">First Name</Label>
                    <Input 
                      id="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-starlink-white">Last Name</Label>
                    <Input 
                      id="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-starlink-white">Email Address</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="organization" className="text-starlink-white">Organization (Optional)</Label>
                  <Input 
                    id="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                    placeholder="Enter your organization name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="subject" className="text-starlink-white">Subject</Label>
                  <Input 
                    id="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                    placeholder="What can we help you with?"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="message" className="text-starlink-white">Message</Label>
                  <Textarea 
                    id="message"
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-starlink-slate/20 border-starlink-grey/30 text-starlink-white"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-starlink-blue hover:bg-starlink-blue-bright text-starlink-dark font-medium"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-16 px-6 bg-starlink-slate/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Locations</h2>
            <p className="text-xl text-starlink-grey-light max-w-3xl mx-auto">
              Global presence with offices strategically located for optimal threat monitoring coverage.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="glass-panel border-starlink-grey/30">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-starlink-blue/20 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-starlink-blue" />
                    </div>
                    <CardTitle className="text-starlink-white text-xl">{office.location}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-starlink-grey-light whitespace-pre-line">
                    {office.address}
                  </div>
                  <div className="text-starlink-blue font-medium text-sm">
                    {office.focus}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Notice */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-panel border-starlink-orange/30 bg-starlink-orange/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-starlink-orange/20 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-starlink-orange" />
              </div>
              <h3 className="text-2xl font-bold text-starlink-white mb-4">Security & Privacy</h3>
              <p className="text-starlink-grey-light mb-6">
                All communications are encrypted and handled with the highest security standards. 
                For sensitive matters, please use our secure portal or encrypted email options.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge className="bg-starlink-orange/20 text-starlink-orange border-starlink-orange/30">
                  End-to-End Encryption
                </Badge>
                <Badge className="bg-starlink-blue/20 text-starlink-blue border-starlink-blue/30">
                  SOC 2 Compliant
                </Badge>
                <Badge className="bg-starlink-red/20 text-starlink-red border-starlink-red/30">
                  Zero-Log Policy
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
