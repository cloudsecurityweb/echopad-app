import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import usePageTitle from '../../hooks/usePageTitle';

function TermsOfService() {
  const PageTitle = usePageTitle('Terms of Service');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      {PageTitle}
      <Navigation />
      <main className="flex-1">
        {/* Terms of Service Content */}
        <section className="pt-32 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
                <p className="text-gray-600 mb-8">
                  <strong>Effective Date:</strong> January 1, 2025<br />
                  <strong>Last Updated:</strong> January 1, 2025
                </p>

                <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg">
                  <p className="text-red-900 m-0">
                    <strong>IMPORTANT - READ CAREFULLY:</strong> These Terms of Service ("Terms") constitute a legally binding agreement between you and Cloud Security Web LLC. By accessing or using Echopad AI services, you agree to be bound by these Terms. If you do not agree, DO NOT use our services.
                  </p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 mb-4">
                    By accessing, browsing, or using Echopad AI services ("Services") provided by Cloud Security Web LLC ("Company," "we," "us," or "our"), you ("Customer," "you," or "your") acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any additional terms referenced herein.
                  </p>
                  <p className="text-gray-700 mb-6">
                    <strong>Binding Agreement:</strong> These Terms create a binding legal agreement. If you are entering into these Terms on behalf of an organization, you represent and warrant that you have authority to bind that organization.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Description of Services</h2>
                  <p className="text-gray-700 mb-3">
                    Echopad AI provides healthcare AI agent platform services including, but not limited to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>Clinical documentation assistance</li>
                    <li>Patient engagement automation</li>
                    <li>Administrative workflow optimization</li>
                    <li>Medical coding assistance</li>
                    <li>Triage and scheduling automation</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Service Modifications:</strong> We reserve the right to modify, suspend, or discontinue any part of the Services at any time, with or without notice, and without liability to you.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. User Accounts and Registration</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Account Creation</h3>
                  <p className="text-gray-700 mb-3">
                    To access certain features, you must create an account and provide accurate, complete information. You are responsible for:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Maintaining the confidentiality of your account credentials</li>
                    <li>All activities that occur under your account</li>
                    <li>Promptly notifying us of any unauthorized access</li>
                    <li>Ensuring compliance with these Terms by all users under your account</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Account Eligibility</h3>
                  <p className="text-gray-700 mb-6">
                    You must be at least 18 years old and legally capable of entering into binding contracts. You represent that all information provided is accurate and complete.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Permitted Use and Restrictions</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Permitted Use</h3>
                  <p className="text-gray-700 mb-6">
                    You may use the Services solely for lawful purposes in accordance with these Terms and applicable healthcare regulations.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Prohibited Conduct</h3>
                  <p className="text-gray-700 mb-3">
                    You agree NOT to:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on intellectual property rights</li>
                    <li>Transmit malicious code, viruses, or harmful content</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Reverse engineer, decompile, or disassemble our Services</li>
                    <li>Use Services to compete with or create competing products</li>
                    <li>Remove or modify any copyright, trademark, or proprietary notices</li>
                    <li>Use Services in any manner that could damage, disable, or impair our systems</li>
                    <li>Share, resell, or sublicense access to Services</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Fees and Payment</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.1 Subscription Fees</h3>
                  <p className="text-gray-700 mb-6">
                    Services are provided on a subscription basis at the rates specified in your service agreement. Fees are non-refundable except as required by law or explicitly stated in writing.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.2 Payment Terms</h3>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Fees are due in advance according to your billing cycle</li>
                    <li>You authorize us to charge your payment method on file</li>
                    <li>Late payments may incur interest at 1.5% per month or the maximum permitted by law</li>
                    <li>We may suspend Services for non-payment after 10 days' notice</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">5.3 Fee Changes</h3>
                  <p className="text-gray-700 mb-6">
                    We reserve the right to modify fees with 30 days' notice. Continued use after fee changes constitutes acceptance.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Intellectual Property Rights</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.1 Our Property</h3>
                  <p className="text-gray-700 mb-6">
                    All Services, including software, technology, content, trademarks, and documentation, are owned by Cloud Security Web LLC and protected by U.S. and international intellectual property laws. No ownership rights are transferred to you.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.2 Limited License</h3>
                  <p className="text-gray-700 mb-6">
                    Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Services solely for your internal business purposes.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">6.3 Customer Data</h3>
                  <p className="text-gray-700 mb-6">
                    You retain ownership of data you input into Services ("Customer Data"). You grant us a worldwide, royalty-free license to use Customer Data solely to provide Services and improve our platform.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. HIPAA Compliance and Healthcare Regulations</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Business Associate Agreement</h3>
                  <p className="text-gray-700 mb-6">
                    For customers who are HIPAA-covered entities, a separate Business Associate Agreement (BAA) must be executed. Services involving PHI are not authorized until a BAA is in place.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Your Responsibilities</h3>
                  <p className="text-gray-700 mb-3">
                    You are solely responsible for:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Ensuring your use complies with HIPAA and other healthcare regulations</li>
                    <li>Obtaining necessary patient consents</li>
                    <li>Implementing appropriate safeguards</li>
                    <li>Training your staff on proper use</li>
                    <li>Conducting required risk assessments</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Not Medical Advice</h3>
                  <p className="text-gray-700 mb-6">
                    <strong>IMPORTANT:</strong> Our Services provide tools and assistance but do NOT constitute medical advice. All clinical decisions remain the responsibility of qualified healthcare professionals. We are not liable for medical decisions or patient outcomes.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Data Security and Privacy</h2>
                  <p className="text-gray-700 mb-3">
                    We implement reasonable security measures as described in our Privacy Policy. However:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>You acknowledge that no security is completely foolproof</li>
                    <li>You are responsible for your own security practices</li>
                    <li>We are not liable for unauthorized access beyond our reasonable control</li>
                    <li>You must promptly report any security concerns</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Service Availability and Support</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.1 Uptime</h3>
                  <p className="text-gray-700 mb-6">
                    We strive for 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance windows may occur with reasonable notice.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.2 Support</h3>
                  <p className="text-gray-700 mb-6">
                    Support is provided according to your service tier. We will use commercially reasonable efforts to respond but make no guarantees regarding response times except as specified in writing.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">9.3 System Requirements</h3>
                  <p className="text-gray-700 mb-6">
                    You are responsible for maintaining compatible systems, internet connectivity, and browsers needed to access Services.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Term and Termination</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.1 Term</h3>
                  <p className="text-gray-700 mb-6">
                    These Terms remain in effect until terminated by either party.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.2 Termination by Customer</h3>
                  <p className="text-gray-700 mb-6">
                    You may terminate by providing written notice according to your service agreement. You remain responsible for all fees through the end of your billing period.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.3 Termination by Us</h3>
                  <p className="text-gray-700 mb-3">
                    We may suspend or terminate your access immediately if:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>You violate these Terms</li>
                    <li>You fail to pay fees when due</li>
                    <li>Your use poses security or legal risks</li>
                    <li>Required by law</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">10.4 Effects of Termination</h3>
                  <p className="text-gray-700 mb-3">
                    Upon termination:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Your access rights immediately cease</li>
                    <li>You must pay all outstanding fees</li>
                    <li>We may delete your data after 30 days (subject to legal retention requirements)</li>
                    <li>Sections that by their nature should survive will continue to apply</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. WARRANTIES AND DISCLAIMERS</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.1 LIMITED WARRANTY</h3>
                  <p className="text-gray-700 mb-6">
                    WE WARRANT THAT SERVICES WILL SUBSTANTIALLY CONFORM TO THEIR DOCUMENTATION UNDER NORMAL USE. THIS IS YOUR SOLE AND EXCLUSIVE WARRANTY.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">11.2 DISCLAIMER</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>EXCEPT AS EXPRESSLY STATED ABOVE, SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong>
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>IMPLIED WARRANTIES OF MERCHANTABILITY</li>
                    <li>FITNESS FOR A PARTICULAR PURPOSE</li>
                    <li>NON-INFRINGEMENT</li>
                    <li>ACCURACY OR RELIABILITY OF CONTENT</li>
                    <li>UNINTERRUPTED OR ERROR-FREE OPERATION</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>WE DO NOT WARRANT THAT SERVICES WILL MEET YOUR REQUIREMENTS OR THAT DEFECTS WILL BE CORRECTED.</strong>
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. LIMITATION OF LIABILITY</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.1 EXCLUSION OF DAMAGES</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL CLOUD SECURITY WEB LLC, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY:</strong>
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                    <li>LOSS OF PROFITS, REVENUE, DATA, OR GOODWILL</li>
                    <li>BUSINESS INTERRUPTION</li>
                    <li>COST OF SUBSTITUTE SERVICES</li>
                    <li>MEDICAL MALPRACTICE OR PATIENT HARM</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>WHETHER ARISING FROM CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR OTHERWISE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</strong>
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.2 CAP ON LIABILITY</h3>
                  <p className="text-gray-700 mb-6">
                    <strong>OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THESE TERMS OR SERVICES SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $1,000, WHICHEVER IS LESS.</strong>
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">12.3 Exceptions</h3>
                  <p className="text-gray-700 mb-6">
                    Limitations do not apply to: (a) our gross negligence or willful misconduct; (b) your payment obligations; (c) your indemnification obligations; or (d) matters that cannot be limited by law.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Indemnification</h2>
                  <p className="text-gray-700 mb-3">
                    You agree to indemnify, defend, and hold harmless Cloud Security Web LLC, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Your use or misuse of Services</li>
                    <li>Your violation of these Terms</li>
                    <li>Your violation of any law or regulation</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Medical decisions or patient care</li>
                    <li>Customer Data you provide</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. Dispute Resolution</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.1 Governing Law</h3>
                  <p className="text-gray-700 mb-6">
                    These Terms are governed by the laws of the State of Delaware, without regard to conflict of law principles.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.2 Arbitration</h3>
                  <p className="text-gray-700 mb-3">
                    <strong>MANDATORY ARBITRATION:</strong> Any dispute arising from these Terms shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. Arbitration shall occur in Delaware.
                  </p>
                  <p className="text-gray-700 mb-6">
                    <strong>CLASS ACTION WAIVER:</strong> You agree to arbitrate disputes on an individual basis only. You waive any right to participate in class actions, class arbitrations, or representative actions.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">14.3 Exceptions to Arbitration</h3>
                  <p className="text-gray-700 mb-6">
                    Either party may seek injunctive relief in court for intellectual property infringement or unauthorized access.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. General Provisions</h2>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.1 Modifications to Terms</h3>
                  <p className="text-gray-700 mb-6">
                    We reserve the right to modify these Terms at any time. Changes become effective immediately upon posting. Continued use constitutes acceptance. We are not obligated to provide individual notice of changes.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.2 Assignment</h3>
                  <p className="text-gray-700 mb-6">
                    You may not assign these Terms without our prior written consent. We may assign these Terms to any affiliate or in connection with a merger or sale.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.3 Severability</h3>
                  <p className="text-gray-700 mb-6">
                    If any provision is found unenforceable, it will be modified to the minimum extent necessary, and remaining provisions remain in full effect.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.4 No Waiver</h3>
                  <p className="text-gray-700 mb-6">
                    Our failure to enforce any provision does not constitute a waiver of future enforcement.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.5 Entire Agreement</h3>
                  <p className="text-gray-700 mb-6">
                    These Terms, together with your service agreement and any BAA, constitute the entire agreement and supersede all prior agreements and understandings.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.6 Force Majeure</h3>
                  <p className="text-gray-700 mb-6">
                    We are not liable for failures or delays due to circumstances beyond our reasonable control (natural disasters, acts of government, labor disputes, internet failures, etc.).
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.7 Export Compliance</h3>
                  <p className="text-gray-700 mb-6">
                    You agree to comply with all export and import laws. Services may not be used in embargoed countries or by prohibited persons.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">15.8 Government Users</h3>
                  <p className="text-gray-700 mb-6">
                    If you are a U.S. government entity, Services are "commercial computer software" and "commercial computer software documentation" with restricted rights as defined in applicable regulations.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">16. Contact Information</h2>
                  <p className="text-gray-700 mb-4">
                    For questions about these Terms, contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg mb-6">
                    <p className="m-0 text-gray-700">
                      <strong>Cloud Security Web LLC</strong><br />
                      Attn: Legal Department - Echopad AI<br />
                      Email: <a href="mailto:legal@cloudsecurityweb.com" className="text-blue-600 hover:underline">legal@cloudsecurityweb.com</a><br />
                      Website: <a href="https://cloudsecurityweb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cloudsecurityweb.com</a>
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mt-12 rounded-lg">
                    <p className="text-yellow-900 m-0">
                      <strong>FINAL ACKNOWLEDGMENT:</strong> By using Echopad AI services, you acknowledge that you have read these Terms of Service, understand them, and agree to be legally bound by them. These Terms contain important limitations on our liability and require arbitration of disputes. If you do not agree, you must immediately cease use of our Services.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default TermsOfService;






