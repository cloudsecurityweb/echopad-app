import ProductCard from '../products/ProductCard';
import FullScreenSection from '../layout/FullScreenSection';

const PROBLEM_GROUPS = [
  {
    id: 'charting',
    label: 'Charting & documentation',
    description: 'Spend less time on notes and more time with patients.',
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
        description: 'Healthcare financial intelligence and benchmarking across all 50 states.',
        link: '/echopad-insights',
        featured: true,
      },
    ],
  },
  {
    id: 'phones',
    label: 'Phones & scheduling',
    description: 'Stop playing phone tag and free staff from call overload.',
    products: [
      {
        icon: 'bi-headset',
        title: 'AI Receptionist',
        description: '24/7 call handling, appointment scheduling, and patient triage.',
        link: '/ai-receptionist',
      },
    ],
  },
  {
    id: 'admin',
    label: 'Admin & operations',
    description: 'Automate the busywork so your team can focus on patient care.',
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
        description: 'Streamline referral management and care coordination.',
        link: '/aperio',
        featured: true,
      },
    ],
  },
  {
    id: 'patient-engagement',
    label: 'Patient engagement',
    description: 'Reduce no-shows and keep patients on track with care.',
    products: [
      {
        icon: 'bi-bell',
        title: 'AI Patient Reminders',
        description: 'Automated reminders for appointments, procedures, medications, and follow-ups.',
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
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Solve what slows you down
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Pick the tools that fix your biggest pain points—charting, phones, admin, or
              no-shows. Each one plugs into your EHR and can go live in about 30 days. No tech
              team required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-currency-dollar text-cyan-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Reduce costs by 60%
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Cut administrative overhead dramatically
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-graph-up-arrow text-green-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Increase revenue by 15-20%
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Recover billable time and reduce no-shows
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-people text-purple-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Improve retention by 40%
                </strong>
                <span className="text-gray-600 text-xs md:text-sm">
                  Reduce provider and staff burnout
                </span>
              </div>
            </div>
          </div>

          <div className="max-w-2xl mx-auto mt-8 text-center">
            <h3 className="text-base font-semibold text-gray-800 mb-2">How to get started</h3>
            <p className="text-sm text-gray-600">
              Choose one tool for your biggest pain point—charting, calls, or no-shows—or add
              more over time. Each integrates with your EHR. Start with a free trial or schedule
              a 15-minute demo.
            </p>
          </div>
        </div>
      </FullScreenSection>

      <FullScreenSection id="agents-by-problem" className="bg-gray-50" centered={false} scrollable>
        <div className="container mx-auto px-4 py-6 w-full max-w-5xl">
          {PROBLEM_GROUPS.map((group) => (
            <section key={group.id} className="mb-10 last:mb-0">
              <div className="mb-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">{group.label}</h3>
                <p className="text-sm text-gray-600 mt-0.5">{group.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.products.map((product, index) => (
                  <ProductCard key={`${group.id}-${index}`} {...product} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </FullScreenSection>
    </>
  );
}

export default AgentsOverview;
