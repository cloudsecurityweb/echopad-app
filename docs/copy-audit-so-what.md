# So What Test: Copy Audit — Before/After

Every change reframes copy to lead with physician/clinical outcome. Technical details are secondary (How it works or collapsed).

| Page | Section | Location | Before | After | Notes |
|------|---------|----------|--------|-------|-------|
| products.js | AI Scribe metrics | frontend/src/data/products.js | `{ value: 'Real-time', label: 'Note generation' }` | `{ value: 'Done before you leave', label: 'Note ready' }` | Lead with outcome |
| products.js | Insights longDescription | frontend/src/data/products.js | Aggregate multi-payer data nationwide to identify underpayments... platform | See where you're underpaid—across payers and regions. Benchmark against peers and optimize outcomes. We aggregate multi-payer data nationwide so you have one place to act. | Outcome first |
| products.js | Insights features | frontend/src/data/products.js | Multi-payer data aggregation | See where you're underpaid across payers | Outcome first |
| products.js | Insights features | frontend/src/data/products.js | Revenue leakage analysis | Spot revenue you're leaving on the table | Outcome first |
| products.js | Aperio usp | frontend/src/data/products.js | Reduce referral leakage by 45% | Fewer patients fall through the cracks | Outcome first |
| products.js | Aperio metrics | frontend/src/data/products.js | Reduction in referral leakage | Fewer lost referrals | Outcome first |
| products.js | AI Receptionist usp | frontend/src/data/products.js | Handle 100+ calls simultaneously, 24/7 | Never miss a call—24/7 scheduling and triage | Outcome first |

## Homepage sections

| Page | Section | Location | Before | After | Notes |
|------|---------|----------|--------|-------|-------|
| Hero | Badge | Hero.jsx | AI-Powered Healthcare Automation | Notes done before the patient leaves. Fewer no-shows. Less admin. | Outcome first |
| Hero | H1 | Hero.jsx | AI Agents That Automate Your Entire Clinical Workflow | Spend Less Time on Charts and Admin, More Time with Patients | Outcome first |
| Hero | Subtitle | Hero.jsx | Transform documentation, scheduling... Modular AI agents | Your note is done before you leave the room. Phones get answered 24/7. Fewer no-shows. Deploy one tool or the full suite—each plugs into your EHR. | Outcome first |
| Platform | Heading | Platform.jsx | Unified, EHR-Agnostic Platform | Works with Your EHR. One Place for Documentation, Scheduling, and Admin. | No platform lead |
| Platform | Subtitle | Platform.jsx | One secure platform... | Your data is secure. Integrate with your EHR... | Outcome first |
| Platform | Card | Platform.jsx | EHR-Agnostic Integration | Works with Your EHR (How: HL7/FHIR...) | Outcome first |
| Platform | Card | Platform.jsx | Enterprise Security & Compliance | Your Data Is Protected | Outcome first |
| Platform | Card | Platform.jsx | Real-Time Processing | Your Note Is Ready When You Are | Outcome first |
| Platform | Card | Platform.jsx | Scalable Architecture | Grows with You | Outcome first |
| Platform | Card | Platform.jsx | Advanced AI Models | Accurate, Medical-Grade Documentation | Outcome first |
| ROI | Metric | ROI.jsx | Reduction in administrative overhead | 60% less time on admin | Outcome first |
| ROI | Metric | ROI.jsx | Improvement in patient throughput efficiency | See more patients without burning out | Outcome first |
| AgentsOverview | Pill subline | AgentsOverview.jsx | Cut administrative overhead dramatically | Spend less time on admin, more on patients | Outcome first |
| AgentsOverview | Insights card | AgentsOverview.jsx | Healthcare financial intelligence and benchmarking... | See where you're underpaid—across payers and all 50 states. | Outcome first |
| AgentsOverview | AI Receptionist card | AgentsOverview.jsx | 24/7 call handling, appointment scheduling... | Never miss a call. 24/7 scheduling and patient triage. | Outcome first |
| AgentsOverview | Aperio card | AgentsOverview.jsx | Streamline referral management and care coordination. | Fewer patients fall through the cracks. Referrals get completed, not lost. | Outcome first |

## Product pages

| Page | Section | Location | Before | After | Notes |
|------|---------|----------|--------|-------|-------|
| AIScribe | What You See | AIScribe.jsx | ...all in real-time | Your note is ready before you leave the room—no waiting... | Outcome first |
| AIScribe | What's Different | AIScribe.jsx | Audio is processed in real time and not stored, so... | You get documentation without the privacy tradeoff. How: audio is processed in real time and not stored. | Outcome first |
| AIScribe | How It Works step 2 | AIScribe.jsx | AI Processes... Our AI listens in real-time... | Your Note Builds as You Speak... Medical-grade transcription... | Outcome first |
| AIScribe | Zero IT Burden | AIScribe.jsx | Cloud-based deployment requires no infrastructure changes... | Go live without IT—no infrastructure changes or extra resources required. | No infra lead |
| AIScribe | Zero Data Retention | AIScribe.jsx | Audio is processed in real-time and immediately deleted... | Your patients' audio is never stored. How: processed and immediately deleted... | Outcome first |
| Aperio | Hero H1 | Aperio.jsx | AI-Powered Referral Coordination That Closes the Loop | Fewer Patients Fall Through the Cracks—Referrals Get Completed, Not Lost | Outcome first |
| Aperio | Hero subline | Aperio.jsx | Streamline referrals, reduce leakage... | Fewer patients fall through the cracks. Track every referral to completion... | Outcome first |
| Aperio | Stats banner | Aperio.jsx | Average Reduction: 40% Referral Leakage | Fewer Lost Referrals: 40% Reduction on Average | Outcome first |
| Aperio | Why It Matters | Aperio.jsx | Reduce referral leakage and improve care continuity | Fewer patients fall through the cracks—better care continuity | Outcome first |
| Aperio | Real impact metric | Aperio.jsx | Reduction in referral leakage | Fewer lost referrals | Outcome first |
| Aperio | Perfect For You | Aperio.jsx | You lose patients to referral leakage... | You lose patients when referrals drop... | Softer language |
| Aperio | Zero IT Burden | Aperio.jsx | Cloud-based deployment requires no infrastructure... | Go live without IT—no infrastructure changes... | No infra lead |
| Aperio | ROI item | Aperio.jsx | Reduced Referral Leakage | Fewer Lost Referrals | Outcome first |
| EchoPadInsights | Hero paragraph | EchoPadInsights.jsx | Aggregate multi-payer data nationwide... platform | See where you're underpaid—across payers and regions... | Outcome first |
| EchoPadInsights | For Healthcare Leaders | EchoPadInsights.jsx | Insights aggregates nationwide... | See where you're underpaid, get the leverage... | Outcome first |
| EchoPadInsights | What You Get | EchoPadInsights.jsx | Real-time access to multi-payer... | See where you're underpaid... How: we keep data current from payer files. | Outcome first |
| EchoPadInsights | How it works step 1 | EchoPadInsights.jsx | Aggregate Machine-Readable Files (MRFs) | See Real Rates Across Payers... We use publicly available payer files (MRFs)... | Outcome first |
| EchoPadInsights | Platform section H2 | EchoPadInsights.jsx | Comprehensive Revenue Intelligence Platform | Know Exactly Where You're Underpaid | Outcome first |
| EchoPadInsights | Stat | EchoPadInsights.jsx | Real-Time / MRF Data Updates | Your view stays current / Data updates | Outcome first |
| AI Receptionist | Feature | AIReceptionist.jsx | Direct connection... for real-time scheduling | Appointments book straight into Epic, Cerner, Athena—no double entry | Outcome first |
| AI Receptionist | Feature | AIReceptionist.jsx | Works with existing phone infrastructure... | Use your existing phones—no new hardware or IT changes | Outcome first |
| AI Reminders | Feature block | AIReminders.jsx | track compliance in real time... | you see who's coming at a glance... | Outcome first |
| PayerRates | Feature | PayerRates.jsx | Automated refreshes as new payer MRF data arrives... | Your rates stay current as new payer data is published... | Outcome first |
| PayerRates | Feature | PayerRates.jsx | Model different rate scenarios in real-time... | Model different rate scenarios on the spot... | Outcome first |
| PayerRates | Pricing | PayerRates.jsx | Annual platform fee | Annual subscription | No platform lead |
| ProductDetails | AI Scribe What You See | ProductDetails.jsx | ...all in real-time | Your note is ready before you leave the room... | Outcome first |
| ProductDetails | Benchmark | ProductDetails.jsx | Real-time dashboards... | See how you compare... at a glance | Outcome first |
| AnimatedAIScribeDemo | Subtitle | AnimatedAIScribeDemo.jsx | Watch AI transform speech... in real-time | See your note build as you talk | Outcome first |
| AnimatedAIScribeDemo | Step 2 label | AnimatedAIScribeDemo.jsx | AI Transcription in Real-Time | Your Note, as You Speak | Outcome first |
| SignIn | Sidebar | SignIn.jsx | HIPAA-compliant platform with enterprise-grade security... | Your data is secure and HIPAA-compliant. Encrypted and protected. | Outcome first |
| SignUp | Sidebar | SignUp.jsx | HIPAA-compliant platform with enterprise-grade security... | Your data is secure and HIPAA-compliant. Encrypted and protected. | Outcome first |
| Footer | Tagline | Footer.jsx | Healthcare AI platform that reduces provider burnout... | Reduce burnout, cut admin, and get notes done before the patient leaves. | Outcome first |
| index.html | Meta description | index.html | Echopad AI is a HIPAA-compliant healthcare AI platform... | Get your note done before the patient leaves... | Outcome first |
| index.html | featureList | index.html | Real-time transcription | Note ready before you leave the room | Outcome first |
| usePageTitle | Default description | usePageTitle.jsx | Transform your healthcare practice with AI-powered automation... | Get your note done before the patient leaves... | Outcome first |
| EchopadAIScribeDownload | Hero H1 | EchopadAIScribeDownload.jsx | Real-time clinical documentation | Your note, done before you leave the room | Outcome first |
| EchopadAIScribeDownload | Hero subline | EchopadAIScribeDownload.jsx | securely, accurately, and instantly | secure, accurate, and ready before you leave the room | Outcome first |
