import { useEffect, useState } from 'react';
import ProductDetail from './ProductDetail';

function ProductDetails() {
  const aiScribeData = {
    id: 'ai-scribe',
    label: 'AI SCRIBE',
    title: 'Real-Time Clinical Documentation',
    intro: 'Listen to patient conversations and watch as AI instantly converts speech into perfect clinical notes—saving 2+ hours per provider daily.',
    sections: [
      {
        title: 'What You See',
        content: 'As you speak naturally during patient sessions, AI Scribe captures every word, cleans up the grammar, recognizes medical terminology, and structures it into professional documentation—all in real-time.',
      },
      {
        title: 'Key Benefits',
        items: [
          'Reduce provider charting time by up to 70%',
          'Automatically create clear, accurate clinical notes',
          'Recognize and structure medical terminology correctly',
          'Deliver EHR-ready notes within seconds of the visit',
        ],
      },
      {
        title: 'Perfect For',
        content: 'Behavioral health, primary care, and specialty practices where providers spend too much time documenting and not enough time with patients.',
      },
    ],
    visualization: {
      title: 'Behavioral Health Session → Clinical Note',
      steps: [
        {
          title: 'Provider Speaking',
          content: (
            <div>
              <style>{`
                @keyframes wave-product {
                  0%, 100% { height: 8px; }
                  50% { height: var(--peak-height); }
                }
                .wave-bar-product {
                  animation: wave-product var(--duration) ease-in-out infinite;
                  animation-delay: var(--delay);
                }
              `}</style>
              <div className="flex items-center gap-1 mb-2 h-12">
                <div className="flex gap-1 items-center">
                  {[...Array(25)].map((_, i) => {
                    const peakHeights = [16, 24, 32, 36, 32, 24, 18, 14, 20, 30, 38, 34, 28, 20, 16, 24, 34, 40, 36, 28, 24, 20, 28, 32, 24];
                    const duration = 0.6 + (i % 5) * 0.1;
                    const delay = i * 0.03;
                    return (
                      <div
                        key={i}
                        className="wave-bar-product w-1 bg-blue-600 rounded-full"
                        style={{
                          '--peak-height': `${peakHeights[i]}px`,
                          '--duration': `${duration}s`,
                          '--delay': `${delay}s`,
                        }}
                      ></div>
                    );
                  })}
                </div>
              </div>
              <p className="text-sm text-gray-700 italic">
                "Patient reports increased anxiety levels this week. Sleep patterns have improved with the new coping strategies we discussed..."
              </p>
            </div>
          ),
        },
        {
          title: 'AI Transcription',
          content: (
            <div className="bg-gray-900 text-green-400 p-4 rounded font-mono text-sm">
              <span>Patient reports increased anxiety levels this week</span>
              <span className="animate-pulse">|</span>
            </div>
          ),
        },
        {
          title: 'Grammar Corrected & Medical Terms Cleaned',
          content: (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <i className="bi bi-check-circle-fill text-green-600"></i>
                <span className="text-sm font-semibold">Grammar Corrected</span>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                Patient reports increased anxiety levels this week. Sleep patterns have improved with the new coping strategies we discussed. Patient continues to experience moderate generalized anxiety symptoms but demonstrates good engagement with cognitive behavioral therapy techniques. Sleep hygiene has shown measurable improvement since our last session.
              </p>
              <div className="flex flex-wrap gap-2">
                {['anxiety', 'coping strategies', 'generalized anxiety', 'cognitive behavioral therapy', 'sleep hygiene'].map((term, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    {term}
                  </span>
                ))}
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const aiDocManData = {
    id: 'ai-docman',
    label: 'AI DOCUMENT MANAGER',
    title: 'Instant Document Formatting',
    intro: 'Drop in messy transcripts and get back perfectly formatted SOAP notes, H&Ps, and discharge summaries—ready to paste into your EHR.',
    sections: [
      {
        title: 'What You See',
        content: 'Paste any raw transcript, select your template (SOAP note, H&P, discharge summary), and watch AI instantly organize it into professional, compliant medical documentation.',
      },
      {
        title: 'Key Benefits',
        items: [
          'Convert raw transcripts into structured SOAP, H&P, and discharge notes',
          'Save up to 60 minutes per day for medical assistants and scribes',
          'Ensure consistent formatting across all clinical documents',
          'Produce EHR-ready notes without manual editing',
        ],
      },
      {
        title: 'Perfect For',
        content: 'Medical assistants, scribes, and practices that need to quickly convert dictation or notes into properly formatted medical documents.',
      },
    ],
    visualization: {
      title: 'Raw Transcript → Formatted SOAP Note',
      steps: [
        {
          title: 'Raw Transcript Input',
          content: (
            <div className="bg-gray-100 p-4 rounded text-sm text-gray-700">
              patient came in today complaining of chest pain started 2 days ago worse with exertion denies shortness of breath vital signs BP 140/90 pulse 88 regular exam unremarkable EKG normal troponin negative...
            </div>
          ),
        },
        {
          title: 'Template Selection',
          content: (
            <div className="flex gap-2">
              <div className="flex-1 bg-blue-600 text-white p-3 rounded text-center font-medium">
                <i className="bi bi-check-circle-fill mr-2"></i>
                SOAP Note
              </div>
              <div className="flex-1 bg-gray-100 p-3 rounded text-center text-gray-700">H&P</div>
              <div className="flex-1 bg-gray-100 p-3 rounded text-center text-gray-700">Discharge Summary</div>
            </div>
          ),
        },
        {
          title: 'Formatted SOAP Note Output',
          content: (
            <div className="space-y-3 text-sm">
              <div>
                <strong className="block mb-1">SUBJECTIVE:</strong>
                <p className="text-gray-700">Patient presents with chief complaint of chest pain that began 2 days ago. Pain worsens with exertion. Patient denies shortness of breath.</p>
              </div>
              <div>
                <strong className="block mb-1">OBJECTIVE:</strong>
                <p className="text-gray-700">Vital Signs: BP 140/90, Pulse 88 (regular)<br />Physical Exam: Unremarkable<br />Diagnostics: EKG normal, Troponin negative</p>
              </div>
              <div>
                <strong className="block mb-1">ASSESSMENT:</strong>
                <p className="text-gray-700">Atypical chest pain, likely musculoskeletal in origin</p>
              </div>
              <div>
                <strong className="block mb-1">PLAN:</strong>
                <p className="text-gray-700">Follow-up in 1 week. Monitor symptoms. Return if worsening.</p>
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const aiMedicalAssistantData = {
    id: 'ai-medical-assistant',
    label: 'AI MEDICAL ASSISTANT',
    title: 'Complete Visit Documentation',
    intro: 'Capture entire patient encounters and automatically generate comprehensive EHR-ready documentation.',
    sections: [
      {
        title: 'The Challenge',
        content: 'Manual EHR data entry is time-consuming and error-prone. Entering encounter notes, diagnoses, vitals, and history manually takes excessive time and increases documentation errors.',
      },
      {
        title: 'How It Works',
        processSteps: [
          {
            title: 'Record Full Session',
            description: 'Captures complete patient-provider conversation',
          },
          {
            title: 'AI Clinical Analysis',
            description: 'Extracts symptoms, diagnoses, vitals, treatment plans',
          },
          {
            title: 'EHR Data Export',
            description: 'Structured fields ready for direct EHR integration',
          },
        ],
      },
      {
        title: 'Clinical Impact',
        items: [
          'Capture full patient visits and generate complete clinical documentation',
          'Automatically create HPI, assessment, and treatment plans',
          'Reduce missing or incomplete encounter notes',
          'Prepare structured, EHR-ready data for faster chart completion',
        ],
      },
    ],
    visualization: {
      title: 'Patient Visit → Complete EHR Chart',
      steps: [
        {
          title: 'Session Recording',
          content: (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                <span className="font-medium">Recording Session</span>
                <span className="ml-auto text-sm text-gray-500">15:34</span>
              </div>
              <div className="space-y-2 text-sm">
                <div><strong>Provider:</strong> "Tell me about your symptoms"</div>
                <div className="text-gray-600"><strong>Patient:</strong> "I've had a persistent cough for 3 weeks and mild fever"</div>
                <div><strong>Provider:</strong> "Any chest pain or shortness of breath?"</div>
              </div>
            </div>
          ),
        },
        {
          title: 'AI Extracting Clinical Data',
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span>Chief Complaint Identified</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span>Symptoms Catalogued</span>
              </div>
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Diagnosis...</span>
              </div>
            </div>
          ),
        },
        {
          title: 'EHR-Ready Structured Output',
          content: (
            <div className="space-y-3 text-sm">
              <div className="border-b pb-2">
                <div className="font-semibold text-gray-700 mb-1">Chief Complaint</div>
                <div className="text-gray-600">Persistent cough, 3 weeks duration</div>
              </div>
              <div className="border-b pb-2">
                <div className="font-semibold text-gray-700 mb-1">HPI</div>
                <div className="text-gray-600">Patient presents with 3-week history of persistent cough accompanied by mild intermittent fever...</div>
              </div>
              <div className="border-b pb-2">
                <div className="font-semibold text-gray-700 mb-1">Assessment</div>
                <div className="text-gray-600">Suspected upper respiratory infection (J06.9)</div>
              </div>
              <div>
                <div className="font-semibold text-gray-700 mb-1">Plan</div>
                <div className="text-gray-600">Prescribe antibiotic course, follow-up in 1 week</div>
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const aiReceptionistData = {
    id: 'ai-receptionist',
    label: 'AI RECEPTIONIST',
    title: '24/7 Intelligent Call Handling',
    intro: 'Automate appointment scheduling, patient inquiries, and call routing with conversational AI that never sleeps.',
    sections: [
      {
        title: 'The Challenge',
        content: 'High call volumes, scheduling demands, and patient inquiries create bottlenecks and increase staff burnout. 40% of calls go unanswered during peak hours.',
      },
      {
        title: 'How It Works',
        processSteps: [
          {
            title: 'Patient Contacts Clinic',
            description: 'Phone call, SMS, or web message received 24/7',
          },
          {
            title: 'AI Intent Recognition',
            description: 'Understands request and routes appropriately',
          },
          {
            title: 'Automated Response',
            description: 'Books appointment, provides info, or escalates to staff',
          },
        ],
      },
      {
        title: 'Operational Impact',
        items: [
          'Answer patient calls and messages 24/7, including after hours',
          'Reduce missed calls and lost appointment opportunities',
          'Automate appointment scheduling and basic patient requests',
          'Lower front-desk workload and staff burnout',
        ],
      },
    ],
    visualization: {
      title: 'Patient Call → Appointment Booked',
      steps: [
        {
          title: 'Incoming Patient Call',
          content: (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <i className="bi bi-telephone-fill text-blue-600 text-xl animate-pulse"></i>
                </div>
                <div>
                  <div className="font-semibold">Sarah Johnson</div>
                  <div className="text-sm text-gray-500">2:45 PM • After Hours</div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <i className="bi bi-chat-left-quote text-blue-600 mr-2"></i>
                <span className="text-sm text-gray-700">"Hi, I'd like to schedule an appointment with Dr. Smith for next week."</span>
              </div>
            </div>
          ),
        },
        {
          title: 'AI Understanding Request',
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm"><strong>Intent:</strong> Schedule Appointment</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm"><strong>Provider:</strong> Dr. Smith</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm"><strong>Timeframe:</strong> Next week</span>
              </div>
              <div className="bg-blue-50 p-3 rounded mt-3">
                <i className="bi bi-robot text-blue-600 mr-2"></i>
                <span className="text-sm text-gray-700">"I can help you schedule with Dr. Smith. I have availability on Tuesday at 10 AM or Thursday at 2 PM. Which works better?"</span>
              </div>
            </div>
          ),
        },
        {
          title: 'Appointment Confirmed & Booked',
          content: (
            <div>
              <div className="flex items-center gap-2 mb-4 bg-green-50 p-3 rounded">
                <i className="bi bi-calendar-check text-green-600 text-xl"></i>
                <span className="font-semibold text-green-700">Appointment Booked</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <strong>Patient:</strong>
                  <span className="text-gray-600">Sarah Johnson</span>
                </div>
                <div className="flex justify-between">
                  <strong>Provider:</strong>
                  <span className="text-gray-600">Dr. Smith</span>
                </div>
                <div className="flex justify-between">
                  <strong>Date & Time:</strong>
                  <span className="text-gray-600">Tuesday, March 19 at 10:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <strong>Confirmation:</strong>
                  <span className="text-gray-600">SMS sent to patient</span>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 p-3 rounded text-sm">
                <i className="bi bi-bell-fill text-blue-600 mr-2"></i>
                Staff notified • Calendar updated • Reminder scheduled
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const aiAdminAssistantData = {
    id: 'ai-admin-assistant',
    label: 'AI ADMIN ASSISTANT',
    title: 'Automated Operational Workflows',
    intro: 'Eliminate repetitive administrative tasks with intelligent automation that handles forms, emails, and scheduling.',
    sections: [
      {
        title: 'The Challenge',
        content: 'Administrative teams spend hours on repetitive tasks—manual form processing, email management, and scheduling create operational inefficiencies and staff frustration. 60% of admin time is spent on routine tasks.',
      },
      {
        title: 'How It Works',
        processSteps: [
          {
            title: 'Task Received',
            description: 'Email, form submission, or scheduling request',
          },
          {
            title: 'AI Processing',
            description: 'Understands context and determines appropriate action',
          },
          {
            title: 'Automated Completion',
            description: 'Executes task and notifies relevant staff',
          },
        ],
      },
      {
        title: 'Operational Impact',
        items: [
          'Automate referrals, forms, and routine administrative tasks',
          'Reduce time spent on manual data entry and follow-ups',
          'Speed up internal workflows and task completion',
          'Improve coordination between clinical and administrative teams',
        ],
      },
    ],
    visualization: {
      title: 'Referral Email → Processed & Scheduled',
      steps: [
        {
          title: 'Incoming Referral Email',
          content: (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <i className="bi bi-envelope-fill text-blue-600"></i>
                <div>
                  <div className="text-sm"><strong>From:</strong> Dr. Martinez (Cardiology)</div>
                  <div className="text-sm"><strong>Subject:</strong> Patient Referral - Urgent</div>
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                "I'm referring John Smith (DOB: 05/12/1975) for endocrinology consultation. Patient has uncontrolled diabetes and needs urgent evaluation. Please schedule within 2 weeks."
              </div>
            </div>
          ),
        },
        {
          title: 'AI Extracting Key Information',
          content: (
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded">
                <i className="bi bi-person text-blue-600 mb-1 block"></i>
                <strong className="block text-xs mb-1">Patient</strong>
                <span className="text-sm text-gray-700">John Smith</span>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <i className="bi bi-calendar text-blue-600 mb-1 block"></i>
                <strong className="block text-xs mb-1">DOB</strong>
                <span className="text-sm text-gray-700">05/12/1975</span>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <i className="bi bi-stethoscope text-blue-600 mb-1 block"></i>
                <strong className="block text-xs mb-1">Specialty</strong>
                <span className="text-sm text-gray-700">Endocrinology</span>
              </div>
              <div className="bg-blue-50 p-3 rounded">
                <i className="bi bi-exclamation-triangle text-blue-600 mb-1 block"></i>
                <strong className="block text-xs mb-1">Priority</strong>
                <span className="text-sm text-gray-700">Urgent (2 weeks)</span>
              </div>
            </div>
          ),
        },
        {
          title: 'Tasks Automatically Completed',
          content: (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm">Patient record created in system</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm">Appointment scheduled: March 20 at 2:00 PM</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm">Confirmation sent to referring physician</span>
              </div>
              <div className="flex items-center gap-2 text-green-600">
                <i className="bi bi-check-circle-fill"></i>
                <span className="text-sm">Patient notification sent via SMS</span>
              </div>
              <div className="mt-4 bg-blue-50 p-3 rounded text-sm">
                <i className="bi bi-bell-fill text-blue-600 mr-2"></i>
                Admin team notified • Task completed in 12 seconds
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const aiRemindersData = {
    id: 'ai-reminders',
    label: 'AI PATIENT REMINDERS',
    title: 'Personalized Care Coordination',
    intro: 'Automated, intelligent reminders that reduce no-shows and improve patient compliance across the care continuum.',
    sections: [
      {
        title: 'The Challenge',
        content: 'Missed appointments, incomplete prep, and medication non-compliance lead to 30% no-show rates, delayed care, and poor outcomes—impacting revenue and patient satisfaction significantly.',
      },
      {
        title: 'How It Works',
        processSteps: [
          {
            title: 'Appointment Scheduled',
            description: 'System detects upcoming visit or care requirement',
          },
          {
            title: 'AI Personalization',
            description: 'Creates customized reminders with optimal timing',
          },
          {
            title: 'Multi-Channel Delivery',
            description: 'Patient receives and confirms via SMS, email, or voice',
          },
        ],
      },
      {
        title: 'Patient Engagement Impact',
        items: [
          'Reduce no-shows and last-minute cancellations',
          'Send clear appointment and preparation reminders',
          'Improve patient compliance with care instructions',
          'Automatically confirm attendance without staff involvement',
        ],
      },
    ],
    visualization: {
      title: 'Appointment → Reminders → Confirmation',
      steps: [
        {
          title: 'Upcoming Appointment Detected',
          content: (
            <div className="bg-blue-50 p-4 rounded">
              <div className="flex items-center gap-2 mb-3">
                <i className="bi bi-calendar-event text-blue-600"></i>
                <span className="font-semibold">Follow-up Appointment</span>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Patient:</strong> Maria Garcia</div>
                <div><strong>Provider:</strong> Dr. Johnson</div>
                <div><strong>Date & Time:</strong> March 25, 2025 at 2:30 PM</div>
              </div>
            </div>
          ),
        },
        {
          title: 'AI Generating Personalized Reminders',
          content: (
            <div className="space-y-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-chat-dots-fill text-blue-600"></i>
                    <strong className="text-sm">SMS Reminder</strong>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">3 days before</span>
                </div>
                <p className="text-xs text-gray-700">"Hi Maria! Reminder: You have an appointment with Dr. Johnson on March 25 at 2:30 PM. Reply YES to confirm."</p>
              </div>
              <div className="bg-gray-50 p-3 rounded">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <i className="bi bi-envelope-fill text-blue-600"></i>
                    <strong className="text-sm">Email Reminder</strong>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">1 day before</span>
                </div>
                <p className="text-xs text-gray-700">"Your appointment is tomorrow at 2:30 PM. Please bring your insurance card and arrive 15 minutes early."</p>
              </div>
            </div>
          ),
        },
        {
          title: 'Patient Confirmation Received',
          content: (
            <div>
              <div className="flex items-center gap-2 mb-4 bg-green-50 p-3 rounded">
                <i className="bi bi-check-circle-fill text-green-600 text-xl"></i>
                <span className="font-semibold text-green-700">Patient Confirmed Attendance</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-green-600">
                  <i className="bi bi-check2"></i>
                  <div>
                    <strong>SMS Sent</strong>
                    <div className="text-xs text-gray-500">March 22 at 9:00 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <i className="bi bi-check2"></i>
                  <div>
                    <strong>Patient Replied "YES"</strong>
                    <div className="text-xs text-gray-500">March 22 at 9:15 AM</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                  <i className="bi bi-check2"></i>
                  <div>
                    <strong>Confirmation Logged</strong>
                    <div className="text-xs text-gray-500">Status updated in system</div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-blue-50 p-3 rounded text-sm">
                <i className="bi bi-bell-fill text-blue-600 mr-2"></i>
                Clinic notified • No-show risk: LOW • Calendar confirmed
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const benchmarkData = {
    id: 'benchmark',
    label: 'BENCHMARK',
    title: 'Track and Optimize Clinical Performance',
    intro: 'Advanced analytics that benchmark your practice against industry standards and surface clear opportunities for improvement.',
    sections: [
      {
        title: 'What You See',
        content: 'Real-time dashboards comparing your performance to national benchmarks, with drill-downs and automated reporting.',
      },
      {
        title: 'Key Benefits',
        items: [
          'Real-time performance dashboards',
          'Industry benchmark comparisons',
          'Custom KPI tracking',
          'Automated reporting and alerts',
          'Quality improvement insights',
        ],
      },
      {
        title: 'Perfect For',
        content: 'Quality improvement teams, practice administrators, and healthcare networks focused on clinical excellence.',
      },
    ],
    visualization: {
      title: 'Performance Analytics Dashboard',
      steps: [
        {
          title: 'Clinical Quality Metrics',
          content: (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Clinical Quality Metrics</h4>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-xs text-gray-600">Patient Satisfaction</div>
                  <div className="text-xs text-green-600 mt-1">+5% vs benchmark</div>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-600">87%</div>
                  <div className="text-xs text-gray-600">Documentation Quality</div>
                  <div className="text-xs text-blue-600 mt-1">+3% vs benchmark</div>
                </div>
              </div>
            </div>
          ),
        },
        {
          title: 'Benchmark Comparison',
          content: (
            <div className="space-y-3">
              {[
                { metric: 'Wait Time', value: 12, benchmark: 18, unit: 'min' },
                { metric: 'Visit Duration', value: 28, benchmark: 25, unit: 'min' },
                { metric: 'Follow-up Rate', value: 85, benchmark: 78, unit: '%' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{item.value}{item.unit}</span>
                      <span className="text-xs text-gray-500">vs {item.benchmark}{item.unit}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.value > item.benchmark ? 'bg-green-500' : 'bg-blue-500'}`}
                      style={{ width: `${Math.min((item.value / item.benchmark) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: 'Actionable Insights',
          content: (
            <div className="space-y-2 text-sm">
              {[
                'Peak appointment times show 15% higher no-show rates',
                'Documentation completion within 24hrs improved by 18%',
                'Patient satisfaction correlates with provider response time',
              ].map((insight, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <i className="bi bi-lightbulb-fill text-yellow-500 mt-0.5"></i>
                  <span className="text-gray-700">{insight}</span>
                </div>
              ))}
            </div>
          ),
        },
      ],
    },
  };

  const referCareData = {
    id: 'refercare',
    label: 'REFERCARE',
    title: 'Streamline Referral Management',
    intro: 'Intelligent referral tracking that ensures seamless patient handoffs and improves care coordination across providers.',
    sections: [
      {
        title: 'What You See',
        content: 'End-to-end visibility into every referral with automated status updates, patient reminders, and provider notifications.',
      },
      {
        title: 'Key Benefits',
        items: [
          'Automated referral tracking',
          'Provider network integration',
          'Patient follow-up reminders',
          'Referral status notifications',
          'Care coordination workflows',
        ],
      },
      {
        title: 'Perfect For',
        content: 'Multi-specialty practices, primary care networks, and healthcare systems coordinating care across providers.',
      },
    ],
    visualization: {
      title: 'Referral Tracking Dashboard',
      steps: [
        {
          title: 'Active Referrals',
          content: (
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 space-y-3">
              {[
                { patient: 'John Doe', specialty: 'Cardiology', status: 'Scheduled', statusClass: 'bg-green-100 text-green-700' },
                { patient: 'Jane Smith', specialty: 'Orthopedics', status: 'Pending', statusClass: 'bg-yellow-100 text-yellow-700' },
                { patient: 'Bob Johnson', specialty: 'Neurology', status: 'Completed', statusClass: 'bg-blue-100 text-blue-700' },
              ].map((referral, idx) => (
                <div key={idx} className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-gray-900">{referral.patient}</div>
                      <div className="text-sm text-gray-600">{referral.specialty}</div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full font-semibold ${referral.statusClass}`}>
                      {referral.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: 'Referral Timeline',
          content: (
            <div className="space-y-3">
              {[
                { step: 'Referral Created', time: '9:00 AM', icon: 'bi-file-earmark-plus', done: true },
                { step: 'Provider Notified', time: '9:05 AM', icon: 'bi-bell', done: true },
                { step: 'Patient Contacted', time: '10:30 AM', icon: 'bi-telephone', done: true },
                { step: 'Appointment Scheduled', time: '2:15 PM', icon: 'bi-calendar-check', done: false },
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.done ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <i className={`bi ${item.icon} ${item.done ? 'text-green-600' : 'text-gray-400'} text-sm`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{item.step}</div>
                    <div className="text-xs text-gray-500">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          ),
        },
        {
          title: 'Network Performance',
          content: (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">156</div>
                  <div className="text-xs text-gray-600">Referrals This Month</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-xs text-gray-600">Completion Rate</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <i className="bi bi-star-fill text-yellow-500"></i>
                  <span>Top specialty: Cardiology (92% completion)</span>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
  };

  const products = [
    aiScribeData,
    benchmarkData,
    referCareData,
    aiDocManData,
    aiMedicalAssistantData,
    aiReceptionistData,
    aiAdminAssistantData,
    aiRemindersData,
  ];
  const totalSlides = products.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      return undefined;
    }

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [isPaused, totalSlides]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="collapsible-sections-container bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">
            Products
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore the Echopad Suite
          </h2>
          <div className="text-xs text-gray-500 mt-2">
            {activeIndex + 1} / {totalSlides}
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous product"
            className="hidden md:flex items-center justify-center absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-4 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-2xl hover:shadow-blue-500/50 transition-all cursor-pointer z-10 hover:scale-110"
          >
            <i className="bi bi-arrow-left text-2xl font-bold"></i>
          </button>
          <div
            key={products[activeIndex].id}
            className="animate-fade-in-scale"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ProductDetail {...products[activeIndex]} />
          </div>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next product"
            className="hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-2xl hover:shadow-blue-500/50 transition-all cursor-pointer z-10 hover:scale-110"
          >
            <i className="bi bi-arrow-right text-2xl font-bold"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
