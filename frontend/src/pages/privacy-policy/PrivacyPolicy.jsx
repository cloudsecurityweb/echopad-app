import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';

function PrivacyPolicy() {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  return (
    <>
      <Navigation />
      <main>
        {/* Privacy Policy Content */}
        <section className="pt-32 pb-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 md:p-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
                <p className="text-gray-600 mb-8">
                  <strong>Effective Date:</strong> January 1, 2025<br />
                  <strong>Last Updated:</strong> January 1, 2025
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 mb-8 rounded-lg">
                  <p className="text-yellow-900 m-0">
                    <strong>Binding Agreement:</strong> This Privacy Policy constitutes a legally binding agreement between you and Cloud Security Web LLC. By accessing, browsing, or using the Echopad AI platform and services in any manner, you explicitly acknowledge that you have read, understood, and unconditionally agree to be bound by all terms, conditions, and provisions contained herein. If you do not agree to these terms in their entirety, you must immediately cease all use of our services and exit our website.
                  </p>
                </div>

                <div className="prose prose-lg max-w-none">
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introduction and Scope</h2>
                  <p className="text-gray-700 mb-4">
                    Cloud Security Web LLC ("Company," "we," "our," or "us"), operating as Echopad AI, provides cutting-edge healthcare artificial intelligence services and software solutions. This Privacy Policy governs all information collection, processing, use, disclosure, retention, and protection practices related to our website, platform, applications, services, and all associated products (collectively, the "Services").
                  </p>
                  <p className="text-gray-700 mb-6">
                    <strong>Important Legal Notice:</strong> This Privacy Policy forms an integral part of our Terms of Service and must be read in conjunction with all other policies, agreements, and legal documents governing your use of our Services. Your use of our Services constitutes your acceptance of all our policies without limitation or qualification.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Information Collection</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.1 Information You Voluntarily Provide</h3>
                  <p className="text-gray-700 mb-3">
                    When you interact with our Services, we collect and retain all information you provide to us, including but not limited to:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li><strong>Contact and Account Information:</strong> Full legal name, email addresses, telephone numbers, physical mailing addresses, job titles, organizational affiliations, professional credentials, and any other identifying information you provide</li>
                    <li><strong>Technical and System Information:</strong> EHR system details, IT infrastructure information, software versions, network configurations, and technical specifications</li>
                    <li><strong>Business Information:</strong> Company size, number of providers, patient volume, specialty areas, operational workflows, and business metrics</li>
                    <li><strong>Communication Content:</strong> All messages, inquiries, feedback, support requests, survey responses, and any other communications you send to us</li>
                    <li><strong>Professional Data:</strong> Professional licenses, certifications, employment history, and credentials</li>
                    <li><strong>Financial Information:</strong> Billing details, payment information, transaction history, and related financial data</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Consent and Authorization:</strong> By providing any information to us, you grant Cloud Security Web LLC a perpetual, irrevocable, worldwide, royalty-free license to use, process, store, and analyze such information for any legitimate business purpose.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.2 Protected Health Information (PHI)</h3>
                  <p className="text-gray-700 mb-3">
                    For healthcare customers operating under Business Associate Agreements (BAA), we may process, store, and analyze PHI as necessary to provide our Services. All PHI handling complies with HIPAA Privacy, Security, and Breach Notification Rules. However, you acknowledge and agree that:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>You, as the covered entity or business associate, bear primary responsibility for ensuring HIPAA compliance in your use of our Services</li>
                    <li>We process PHI solely on your behalf and at your direction</li>
                    <li>You are responsible for obtaining all necessary patient authorizations and consents</li>
                    <li>You indemnify and hold harmless Cloud Security Web LLC from any claims arising from your handling or use of PHI</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">2.3 Automatically Collected Information</h3>
                  <p className="text-gray-700 mb-3">
                    We automatically collect extensive technical and usage data when you access or use our Services:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li><strong>Device Data:</strong> Device identifiers, hardware models, operating system versions, browser types and versions, device settings, and unique device tokens</li>
                    <li><strong>Usage Analytics:</strong> Pages viewed, features accessed, time spent, click patterns, navigation paths, session duration, frequency of use, and interaction sequences</li>
                    <li><strong>Network Information:</strong> IP addresses, internet service provider, geographic location data (including GPS coordinates if permitted), network connection type, and bandwidth usage</li>
                    <li><strong>Log Files:</strong> Comprehensive server logs including timestamps, error reports, system events, and debugging information</li>
                    <li><strong>Performance Metrics:</strong> Response times, loading speeds, error rates, and system performance indicators</li>
                    <li><strong>Cookies and Tracking:</strong> All cookie data, web beacons, pixel tags, local storage data, and similar tracking technologies</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Automatic Collection:</strong> This data collection occurs automatically and continuously whenever you interact with our Services, regardless of whether you have created an account or are merely visiting our website.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. How We Use Your Information</h2>
                  <p className="text-gray-700 mb-4">
                    Cloud Security Web LLC reserves the right to use all collected information for any lawful business purpose, including without limitation:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.1 Service Provision and Improvement</h3>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Providing, maintaining, improving, and enhancing all aspects of our Services</li>
                    <li>Developing new features, products, and service offerings</li>
                    <li>Personalizing and customizing your user experience</li>
                    <li>Processing transactions and managing accounts</li>
                    <li>Providing technical support and customer service</li>
                    <li>Training and improving our artificial intelligence and machine learning models</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.2 Business Operations</h3>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Conducting market research, analytics, and business intelligence</li>
                    <li>Generating aggregated reports and statistics for internal and external use</li>
                    <li>Benchmarking and comparative analysis</li>
                    <li>Quality assurance and performance monitoring</li>
                    <li>Financial reporting and accounting</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.3 Marketing and Communications</h3>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>Sending promotional materials, newsletters, and service updates</li>
                    <li>Conducting targeted marketing campaigns</li>
                    <li>Analyzing marketing effectiveness</li>
                    <li>Building customer profiles and segments</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Marketing Opt-Out:</strong> While you may request to opt out of marketing communications, we reserve the right to continue sending transactional, service-related, and administrative messages.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">3.4 Legal and Security</h3>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Ensuring compliance with legal obligations and regulations</li>
                    <li>Protecting against fraud, abuse, and unauthorized access</li>
                    <li>Enforcing our Terms of Service and other policies</li>
                    <li>Responding to legal processes and governmental requests</li>
                    <li>Protecting our rights, property, and safety</li>
                    <li>Investigating and prosecuting violations of our policies</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Information Sharing and Disclosure</h2>
                  <p className="text-gray-700 mb-4">
                    Cloud Security Web LLC may share your information with third parties under various circumstances:
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.1 Service Providers and Vendors</h3>
                  <p className="text-gray-700 mb-6">
                    We engage third-party companies and individuals to facilitate our Services, including cloud hosting providers, data storage services, analytics platforms, customer relationship management systems, payment processors, and marketing services. These service providers may have access to your information solely to perform specific tasks on our behalf.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.2 Business Partners</h3>
                  <p className="text-gray-700 mb-6">
                    We may share information with EHR vendors, healthcare technology partners, integration partners, and other collaborators necessary for providing seamless service integration and enhanced functionality.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.3 Corporate Transactions</h3>
                  <p className="text-gray-700 mb-6">
                    In the event of any merger, acquisition, reorganization, sale of assets, bankruptcy, or similar corporate transaction, your information may be transferred as part of the transaction. You acknowledge and consent to any such transfer, and you agree that any successor entity may continue to process your information as described in this Privacy Policy.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.4 Legal and Regulatory Requirements</h3>
                  <p className="text-gray-700 mb-3">
                    We may disclose your information when required by law, legal process, litigation, governmental request, regulatory authority, or when we believe in good faith that disclosure is necessary to:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Comply with legal obligations</li>
                    <li>Protect and defend our rights and property</li>
                    <li>Prevent fraud or illegal activity</li>
                    <li>Protect the safety of users or the public</li>
                    <li>Respond to emergencies or urgent situations</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">4.5 Aggregated and De-Identified Data</h3>
                  <p className="text-gray-700 mb-6">
                    We may freely share aggregated, de-identified, or anonymized data that cannot reasonably be used to identify you. Such data may be used for research, benchmarking, publications, marketing materials, and any other lawful purpose without restriction.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Data Retention</h2>
                  <p className="text-gray-700 mb-3">
                    <strong>Retention Rights:</strong> Cloud Security Web LLC retains all collected information for as long as necessary to fulfill the purposes described in this Privacy Policy, comply with legal obligations, resolve disputes, enforce agreements, and protect our legitimate business interests. Specific retention periods include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li><strong>Account Information:</strong> Duration of account plus minimum 7 years following account closure</li>
                    <li><strong>PHI:</strong> As required by HIPAA (minimum 6 years) or longer if required by state law or contractual obligations</li>
                    <li><strong>Transaction Records:</strong> Minimum 7 years as required for financial and tax compliance</li>
                    <li><strong>Communications:</strong> Indefinitely unless deletion is specifically requested and legally permissible</li>
                    <li><strong>Usage Data and Logs:</strong> Minimum 3 years for security and analytical purposes</li>
                    <li><strong>Backup Systems:</strong> Data in backup systems may be retained for extended periods as part of our disaster recovery protocols</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Important Notice:</strong> Even after you request deletion, we may retain information where legally required, reasonably necessary for legitimate business operations, or where complete deletion is technically infeasible. Residual copies may persist in backup systems and archives.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Data Security</h2>
                  <p className="text-gray-700 mb-3">
                    Cloud Security Web LLC implements reasonable administrative, technical, and physical safeguards designed to protect information from unauthorized access, alteration, disclosure, or destruction. These measures include:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>AES-256 encryption for data at rest and TLS 1.2+ encryption for data in transit</li>
                    <li>Multi-factor authentication and role-based access controls</li>
                    <li>Regular security audits, penetration testing, and vulnerability assessments</li>
                    <li>SOC 2 Type II compliance and annual independent security reviews</li>
                    <li>Employee training and background checks</li>
                    <li>Comprehensive incident response and disaster recovery plans</li>
                    <li>Network segmentation and intrusion detection systems</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Security Disclaimer:</strong> HOWEVER, YOU ACKNOWLEDGE AND AGREE THAT NO SECURITY MEASURES ARE PERFECT OR IMPENETRABLE. CLOUD SECURITY WEB LLC MAKES NO WARRANTIES OR GUARANTEES REGARDING THE SECURITY OF YOUR INFORMATION. YOU ASSUME ALL RISKS ASSOCIATED WITH PROVIDING INFORMATION TO US AND USING OUR SERVICES. WE SHALL NOT BE LIABLE FOR ANY UNAUTHORIZED ACCESS, HACKING, DATA BREACHES, OR OTHER SECURITY INCIDENTS.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Your Rights and Choices</h2>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.1 Access and Correction</h3>
                  <p className="text-gray-700 mb-3">
                    You may request access to your personal information or request corrections to inaccurate data. However, we reserve the right to:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Verify your identity before providing access (which may require substantial documentation)</li>
                    <li>Charge reasonable fees for access requests that are excessive, repetitive, or burdensome</li>
                    <li>Deny requests that are unreasonable, technically infeasible, or would compromise others' privacy</li>
                    <li>Take up to 90 days to respond to requests</li>
                    <li>Provide information in the format we deem appropriate</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.2 Data Deletion Requests</h3>
                  <p className="text-gray-700 mb-3">
                    You may request deletion of your personal information, but please understand that:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>We are not required to delete data needed for legal compliance, fraud prevention, security purposes, or legitimate business operations</li>
                    <li>Deletion may result in loss of access to Services and all associated data</li>
                    <li>Some information may remain in backup systems for extended periods</li>
                    <li>Aggregated or de-identified data is not subject to deletion requests</li>
                    <li>We may retain metadata and log files even after deletion</li>
                  </ul>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.3 Marketing Communications</h3>
                  <p className="text-gray-700 mb-6">
                    You may opt out of promotional emails using the unsubscribe mechanism. However, opting out does not apply to transactional, service-related, administrative, legal, or security communications, which we may continue sending indefinitely.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.4 Cookies and Tracking</h3>
                  <p className="text-gray-700 mb-6">
                    You may disable cookies through browser settings, but this may significantly impair functionality and result in inability to use certain features or access parts of our Services.
                  </p>

                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">7.5 Limitations on Rights</h3>
                  <p className="text-gray-700 mb-6">
                    <strong>Important:</strong> All rights described above are subject to significant limitations and exceptions. We reserve the right to deny any request if we determine it is not legally required, unduly burdensome, technically infeasible, or contrary to our legitimate business interests.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. HIPAA Compliance</h2>
                  <p className="text-gray-700 mb-3">
                    For customers operating under Business Associate Agreements:
                  </p>
                  <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                    <li>We implement HIPAA-compliant safeguards for PHI processing</li>
                    <li>We provide Business Associate Agreements as required</li>
                    <li>We report breaches in accordance with HIPAA requirements</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Customer Obligations:</strong> You acknowledge that YOU are primarily responsible for HIPAA compliance in your practice. You must obtain all required patient authorizations, maintain proper policies and procedures, train your workforce, and ensure appropriate use of our Services. You indemnify Cloud Security Web LLC for any violations arising from your practices or use of our Services.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. International Data Transfers</h2>
                  <p className="text-gray-700 mb-3">
                    Our Services are operated from the United States. By using our Services, you consent to the transfer, storage, and processing of your information in the United States and other countries where our service providers operate. You acknowledge that:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Data protection laws in the United States may differ from and provide less protection than laws in your jurisdiction</li>
                    <li>Your information may be subject to access by law enforcement and government agencies in the United States</li>
                    <li>We make no representations that our Services comply with data protection laws in your jurisdiction</li>
                    <li>You waive any claims arising from data transfers or differences in legal protection</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Children's Privacy</h2>
                  <p className="text-gray-700 mb-6">
                    Our Services are NOT intended for individuals under 18 years of age. We do not knowingly collect information from minors. If we discover that a minor has provided information, we may delete it without notice. Parents or guardians who believe a minor has provided information should contact us immediately.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Third-Party Services and Links</h2>
                  <p className="text-gray-700 mb-6">
                    Our Services may contain links to third-party websites, services, or content. We have no control over and assume no responsibility for third-party practices. Your interactions with third parties are governed solely by their terms and privacy policies. We strongly encourage you to review their policies before providing any information. Cloud Security Web LLC disclaims all liability for third-party services.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Changes to Privacy Policy</h2>
                  <p className="text-gray-700 mb-3">
                    <strong>Modification Rights:</strong> Cloud Security Web LLC reserves the absolute right to modify, update, or replace this Privacy Policy at any time, for any reason, without prior notice. Changes become effective immediately upon posting to our website with an updated "Last Updated" date.
                  </p>
                  <p className="text-gray-700 mb-3">
                    <strong>Your Responsibility:</strong> It is YOUR responsibility to review this Privacy Policy periodically. Continued use of our Services after changes constitutes your binding acceptance of the modified Privacy Policy. We are under no obligation to notify you of changes individually.
                  </p>
                  <p className="text-gray-700 mb-6">
                    <strong>No Grandfathering:</strong> All changes apply to all users and all information, including information collected prior to the change. There is no "grandfathering" of previous policies.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. California Privacy Rights (CCPA)</h2>
                  <p className="text-gray-700 mb-3">
                    California residents may have certain rights under the California Consumer Privacy Act (CCPA), subject to significant exceptions:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li><strong>Right to Know:</strong> You may request disclosure of categories and specific pieces of personal information collected (subject to verification and exceptions)</li>
                    <li><strong>Right to Delete:</strong> You may request deletion (subject to numerous exceptions for legal compliance, fraud prevention, and business operations)</li>
                    <li><strong>Right to Opt-Out:</strong> We do not sell personal information in the traditional sense</li>
                    <li><strong>Non-Discrimination:</strong> We will not discriminate against you for exercising CCPA rights, but we may charge different prices or provide different service levels based on the value of your information</li>
                  </ul>
                  <p className="text-gray-700 mb-6">
                    <strong>Important Limitations:</strong> Most CCPA rights do not apply to PHI covered by HIPAA, employment information, or business-to-business communications. We reserve the right to verify identity extensively before responding to requests and may charge reasonable fees for burdensome requests.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">14. European Privacy Rights (GDPR)</h2>
                  <p className="text-gray-700 mb-3">
                    If you are located in the European Economic Area, you may have certain rights under GDPR. However, please note that:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>Our Services are based in the United States and primarily serve US customers</li>
                    <li>We do not specifically target EEA residents</li>
                    <li>All rights are subject to significant limitations and exceptions</li>
                    <li>We may refuse requests that are manifestly unfounded or excessive</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">15. Limitations of Liability</h2>
                  <p className="text-gray-700 mb-3">
                    <strong>CRITICAL NOTICE:</strong> TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
                  </p>
                  <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700">
                    <li>CLOUD SECURITY WEB LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM OR RELATED TO THIS PRIVACY POLICY OR OUR DATA PRACTICES</li>
                    <li>WE MAKE NO WARRANTIES REGARDING DATA SECURITY, ACCURACY, OR AVAILABILITY</li>
                    <li>YOU ASSUME ALL RISKS ASSOCIATED WITH PROVIDING INFORMATION TO US</li>
                    <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID TO US IN THE PRECEDING 12 MONTHS</li>
                    <li>SOME JURISDICTIONS DO NOT ALLOW LIMITATIONS ON LIABILITY, BUT WE ASSERT THEM TO THE FULLEST EXTENT LEGALLY PERMISSIBLE</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">16. Dispute Resolution and Governing Law</h2>
                  <p className="text-gray-700 mb-6">
                    This Privacy Policy is governed by the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes arising from this Privacy Policy shall be resolved through binding arbitration in accordance with the procedures specified in our Terms of Service. You waive any right to class actions, jury trials, or pursuing claims in any other forum.
                  </p>

                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">17. Contact Information and Support</h2>
                  <p className="text-gray-700 mb-4">
                    For questions, requests, or concerns regarding this Privacy Policy or our data practices, you may contact us at:
                  </p>
                  <div className="bg-gray-50 p-6 rounded-lg mb-4">
                    <p className="m-0 text-gray-700">
                      <strong>Cloud Security Web LLC</strong><br />
                      Attn: Privacy Officer - Echopad AI<br />
                      Email: <a href="mailto:contact@cloudsecurityweb.com" className="text-blue-600 hover:underline">contact@cloudsecurityweb.com</a><br />
                      Website: <a href="https://cloudsecurityweb.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cloudsecurityweb.com</a>
                    </p>
                  </div>
                  <p className="text-gray-700 mb-6">
                    <strong>Response Time:</strong> We will make commercially reasonable efforts to respond to inquiries within 30-90 business days, though we are under no legal obligation to respond to all inquiries. We reserve the right to verify your identity, charge fees for excessive requests, and deny requests at our discretion.
                  </p>

                  <div className="bg-red-50 border-l-4 border-red-500 p-6 mt-12 rounded-lg">
                    <p className="text-red-900 m-0">
                      <strong>Final Acknowledgment and Agreement:</strong> BY USING ECHOPAD AI SERVICES, YOU EXPRESSLY ACKNOWLEDGE THAT YOU HAVE READ THIS ENTIRE PRIVACY POLICY, UNDERSTAND IT COMPLETELY, AND UNCONDITIONALLY AGREE TO BE BOUND BY ALL ITS TERMS, CONDITIONS, LIMITATIONS, AND PROVISIONS. YOU ACKNOWLEDGE THAT THIS PRIVACY POLICY MAY CHANGE AT ANY TIME WITHOUT NOTICE AND THAT YOUR CONTINUED USE CONSTITUTES ACCEPTANCE OF ANY CHANGES. IF YOU DO NOT AGREE WITH THIS PRIVACY POLICY IN ITS ENTIRETY, YOUR SOLE REMEDY IS TO IMMEDIATELY CEASE ALL USE OF OUR SERVICES.
                    </p>
                  </div>

                  <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Need Help Understanding Your Privacy Rights?</h4>
                    <p className="text-gray-700 mb-4">
                      If you have questions about this Privacy Policy or need assistance with privacy-related requests, our support team is here to help.
                    </p>
                    <a
                      href="#"
                      onClick={(e) => handleIntercomClick(e, 'request-demo')}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <i className="bi bi-chat-dots"></i>
                      Contact Support Team
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;


