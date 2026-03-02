import ProductCard from '../products/ProductCard';
import FullScreenSection from '../layout/FullScreenSection';

const PROBLEM_GROUPS = [
  {
    id: 'charting',
    label: 'Charting & documentation',
    description: 'Less time on notes, more time with patients.',
    products: [
      {
        icon: 'bi-mic-fill',
        title: 'AI Scribe',
        description: 'Your note is done before you leave the room—just talk to your patient, no typing or dictation.',
        link: '/ai-scribe',
        featured: true,
      },
      {
        icon: 'bi-file-earmark-text',
        title: 'AI Document Manager',
        description: 'Turn transcripts into formatted medical notes instantly, ready for your EHR.',
        link: '/ai-docman',
        comingSoon: true,
      },
      {
        icon: 'bi-person-workspace',
        title: 'AI Medical Assistant',
        description: 'Record the full visit and get EHR-ready charts automatically.',
        link: '/ai-medical-assistant',
        comingSoon: true,
      },
      {
        icon: 'bi-graph-up-arrow',
        title: 'Insights',
        description: 'See where you\'re underpaid—across payers and all 50 states.',
        link: '/echopad-insights',
        featured: true,
      },
    ],
  },
  {
    id: 'phones',
    label: 'Phones & scheduling',
    description: 'Stop playing phone tag; free staff from call overload.',
    products: [
      {
        icon: 'bi-headset',
        title: 'AI Receptionist',
        description: 'Never miss a call. 24/7 scheduling and patient triage.',
        link: '/ai-receptionist',
      },
    ],
  },
  {
    id: 'admin',
    label: 'Admin & operations',
    description: 'Automate busywork so your team can focus on patients.',
    products: [
      {
        icon: 'bi-briefcase',
        title: 'AI Admin Assistant',
        description: 'Automate forms, scheduling, emails, and day-to-day workflows.',
        link: '/ai-admin-assistant',
      },
      {
        icon: 'bi-arrow-left-right',
        title: 'Aperio',
        subtitle: 'Referral Tracking and Coordination',
        description: 'Fewer patients fall through the cracks. Referrals get completed, not lost.',
        link: '/aperio',
        featured: true,
      },
    ],
  },
  {
    id: 'patient-engagement',
    label: 'Patient engagement',
    description: 'Fewer no-shows and better follow-through on care.',
    products: [
      {
        icon: 'bi-bell',
        title: 'AI Patient Reminders',
        description: 'Automated reminders for appointments, procedures, medications, and prep.',
        link: '/ai-reminders',
      },
    ],
  },
];

function AgentsOverview() {
  return (
    <>
      <FullScreenSection id="agents" className="bg-white">
        <div className="container mx-auto px-4 w-full">
          <div className="text-center max-w-3xl mx-auto mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 pb-3 border-b border-gray-200">
              Fix what slows you down
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Choose what you need—charting, phones, admin, or no-shows. Each solution works with your existing systems and supports a smooth rollout. We handle setup; no IT required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            <div className="glass-card rounded-xl p-5 md:p-6 hover-lift shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                <i className="bi bi-currency-dollar text-white text-lg"></i>
              </div>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Typical: up to 60% less admin time
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Spend less time on admin and more time with patients
                </span>
                <span className="block text-gray-500 text-[11px] mt-0.5">
                  Based on pilot-practice self-reports
                </span>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 md:p-6 hover-lift shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                <i className="bi bi-graph-up-arrow text-white text-lg"></i>
              </div>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Typical: 15-20% revenue lift
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Recover billable time and reduce no-shows
                </span>
                <span className="block text-gray-500 text-[11px] mt-0.5">
                  Varies by payer mix, volume, and adoption
                </span>
              </div>
            </div>
            <div className="glass-card rounded-xl p-5 md:p-6 hover-lift shadow-sm border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center mb-3 shadow-lg">
                <i className="bi bi-people text-white text-lg"></i>
              </div>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Typical: up to 40% better staff retention
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Less burnout for providers and staff
                </span>
                <span className="block text-gray-500 text-[11px] mt-0.5">
                  Benchmarked across participating practices
                </span>
              </div>
            </div>
          </div>
        </div>
      </FullScreenSection>

    </>
  );
}

export default AgentsOverview;

