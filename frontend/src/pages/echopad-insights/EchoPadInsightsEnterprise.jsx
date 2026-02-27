import { useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../../components/layout/Navigation';
import Footer from '../../components/layout/Footer';
import { handleIntercomAction } from '../../utils/intercom';
import usePageTitle from '../../hooks/usePageTitle';

function EchoPadInsightsEnterprise() {
  const PageTitle = usePageTitle('Insights for Enterprise | Echopad');
  const handleIntercomClick = (e, action) => {
    e.preventDefault();
    handleIntercomAction(action);
  };

  useLayoutEffect(() => {
    const html = document.documentElement;
    const originalScrollBehavior = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
    requestAnimationFrame(() => {
      html.style.scrollBehavior = originalScrollBehavior || '';
    });
  }, []);

  const enterprisePersonas = [
    {
      title: 'Hospital Systems & Health Networks',
      icon: 'bi-hospital',
      challenges: [
        'Managing contracts with multiple payers across regions',
        'Identifying underpayments across thousands of CPT codes',
        'Preparing for payer contract renegotiations',
      ],
      solution:
        'Insights provides system-wide visibility into payer performance, helping CFOs identify $500K+ in annual underpayments and negotiate better rates.',
    },
    {
      title: 'Revenue Cycle Management Teams',
      icon: 'bi-cash-coin',
      challenges: [
        'Tracking underpayments across multiple clients',
        'Proving value to leadership with data',
        'Staying current with market rate changes',
      ],
      solution:
        'Show leaders where revenue is being missed and prioritize high-impact contract actions quickly. Real-time MRF benchmarks and custom reporting support the analysis.',
    },
    {
      title: 'Healthcare Consultants & Advisors',
      icon: 'bi-briefcase',
      challenges: [
        'Accessing reliable market benchmark data',
        'Supporting multiple clients with contract negotiations',
        'Providing evidence-based recommendations',
      ],
      solution:
        'White-label reports and nationwide benchmarking data enable consultants to deliver premium advisory services backed by real market intelligence.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {PageTitle}
      <Navigation />
      <main className="flex-1">
        {/* Hero */}
        <section className="px-4 md:px-14 pt-32 pb-16 bg-white">
          <div className="container mx-auto px-4">
            <Link
              to="/echopad-insights"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors mb-6 font-semibold hover:gap-3"
            >
              <i className="bi bi-arrow-left"></i>
              Back to Insights
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Insights for Enterprise
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl">
              Tailored revenue intelligence for hospital systems, RCM teams, and healthcare consultants. Same powerful benchmarking—scaled for your use case.
            </p>
          </div>
        </section>

        {/* Enterprise personas */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {enterprisePersonas.map((persona, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-8 border border-gray-200 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className={`bi ${persona.icon} text-purple-600 text-2xl`}></i>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{persona.title}</h3>
                  </div>
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                      Common challenges
                    </h4>
                    <ul className="space-y-2">
                      {persona.challenges.map((challenge, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <i className="bi bi-x-circle text-red-500 mt-0.5 flex-shrink-0"></i>
                          <span>{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">How EchoPad helps</h4>
                    <p className="text-sm text-gray-700">{persona.solution}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <a
                href="#"
                onClick={(e) => handleIntercomClick(e, 'request-demo')}
                className="inline-flex items-center justify-center gap-3 bg-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <i className="bi bi-calendar-check text-2xl"></i>
                Request Enterprise Demo
              </a>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-gray-600 mb-4">
                Practices or medical groups? Insights is built for you.
              </p>
              <Link
                to="/echopad-insights"
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold"
              >
                View main Insights page
                <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default EchoPadInsightsEnterprise;
