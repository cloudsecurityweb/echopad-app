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
              Fix what slows you down
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Choose what you need—charting, phones, admin, or no-shows. Each solution works with your existing systems and most practices are live in about 30 days. We handle setup; no IT required.
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
                  Spend less time on admin, more on patients
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3 glass-card p-4 rounded-xl hover-lift shadow-sm">
              <i className="bi bi-graph-up-arrow text-green-500 text-2xl flex-shrink-0"></i>
              <div>
                <strong className="block text-gray-900 mb-0.5 text-sm md:text-base">
                  Increase revenue by 15–20%
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
                  Less burnout for providers and staff
                </span>
              </div>
            </div>
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
