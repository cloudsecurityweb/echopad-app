/**
 * Script to add sample medical transcriptions for a user
 * Run with: node scripts/addSampleTranscriptions.js
 */

import 'dotenv/config';
import { getContainer } from '../src/config/cosmosClient.js';
import { randomUUID } from 'crypto';

const CONTAINER_NAME = 'transcriptionHistory';

// User details provided
const userId = 'user_286b9e0c-d6ee-43e7-86c3-ef3528e66c85';
const tenantId = 'tenant_b59add0e-2cd5-4f3e-aa17-3ec01fe3e133';

// Sample medical transcriptions
const sampleTranscriptions = [
    {
        text: `PATIENT CONSULTATION - FOLLOW-UP VISIT

Date: February 6, 2026
Patient: John D. (DOB: 03/15/1985)
Provider: Dr. Sarah Mitchell, MD

CHIEF COMPLAINT:
Patient presents for follow-up regarding hypertension management and recent lab results.

HISTORY OF PRESENT ILLNESS:
The patient is a 40-year-old male who was diagnosed with Stage 1 hypertension approximately 3 months ago. He was started on Lisinopril 10mg daily. Today he reports good compliance with medication and has been monitoring his blood pressure at home. Average readings have been around 128/82 mmHg. No headaches, dizziness, or visual changes reported. Patient has implemented dietary modifications including reduced sodium intake and increased physical activity (walking 30 minutes, 4 times per week).

VITAL SIGNS:
- Blood Pressure: 126/80 mmHg
- Heart Rate: 72 bpm
- Temperature: 98.4°F
- Weight: 185 lbs (down 5 lbs from last visit)

ASSESSMENT AND PLAN:
1. Hypertension - Well controlled on current regimen. Continue Lisinopril 10mg daily.
2. Lifestyle modifications - Encourage continued exercise and dietary changes.
3. Follow-up - Return in 3 months for BP check and annual labs.
4. Patient education - Discussed importance of medication adherence and signs of hypertensive urgency.

Dr. Sarah Mitchell, MD
Board Certified Internal Medicine`,
    },
    {
        text: `TELEMEDICINE VISIT - RESPIRATORY SYMPTOMS

Date: February 5, 2026
Patient: Emily R. (DOB: 08/22/1990)
Provider: Dr. Michael Chen, MD

CHIEF COMPLAINT:
"I've had a cough and congestion for about 5 days now."

HISTORY OF PRESENT ILLNESS:
35-year-old female presents via telehealth with upper respiratory symptoms that began 5 days ago. She reports nasal congestion, productive cough with clear to whitish sputum, mild sore throat, and low-grade fever (max 100.2°F yesterday). No shortness of breath, chest pain, or wheezing. She has been taking over-the-counter acetaminophen and using saline nasal spray with some relief. No known sick contacts but works in an office environment. COVID-19 test was negative 2 days ago.

REVIEW OF SYSTEMS:
- Positive: Cough, congestion, sore throat, mild fatigue
- Negative: Chest pain, shortness of breath, body aches, GI symptoms

ASSESSMENT:
Acute viral upper respiratory infection (common cold)

PLAN:
1. Supportive care - Continue OTC remedies, increase fluid intake, rest
2. Honey for cough relief (1-2 teaspoons as needed)
3. Return precautions - Seek care if symptoms worsen, fever persists beyond 3 more days, or develops shortness of breath
4. No antibiotics indicated at this time
5. Follow up if not improved in 7-10 days

Dr. Michael Chen, MD`,
    },
    {
        text: `INITIAL CONSULTATION - DIABETES SCREENING

Date: February 4, 2026
Patient: Robert M. (DOB: 11/03/1978)
Provider: Dr. Amanda Williams, MD, Endocrinology

REASON FOR REFERRAL:
Elevated fasting glucose on routine labs, family history of diabetes.

HISTORY OF PRESENT ILLNESS:
47-year-old male referred by PCP for evaluation of impaired fasting glucose. Recent lab work showed fasting glucose of 118 mg/dL (normal <100). HbA1c was 5.9% (pre-diabetes range). Patient reports increased thirst over past few months but no polyuria. No unintentional weight loss. Family history significant for Type 2 DM in mother and maternal grandmother.

PAST MEDICAL HISTORY:
- Hyperlipidemia (on atorvastatin)
- Obesity (BMI 32)

PHYSICAL EXAMINATION:
- General: Well-appearing, obese male
- Vital Signs: BP 134/86, HR 78, Weight 235 lbs
- Skin: No acanthosis nigricans
- Cardiovascular: Regular rhythm, no murmurs
- Extremities: No edema, pulses intact, sensation intact to monofilament

LABORATORY REVIEW:
- Fasting Glucose: 118 mg/dL
- HbA1c: 5.9%
- Lipid Panel: TC 210, LDL 130, HDL 42, TG 190

ASSESSMENT:
1. Pre-diabetes (IFG and HbA1c criteria)
2. Metabolic syndrome components present

PLAN:
1. Lifestyle intervention - Referral to diabetes education and nutritionist
2. Weight loss goal - 7% body weight over 6 months
3. Exercise prescription - 150 minutes moderate activity per week
4. Consider Metformin if no improvement in 3 months
5. Repeat labs in 3 months (FBG, HbA1c, lipids)
6. Blood pressure monitoring - Consider treatment if persistently elevated

Dr. Amanda Williams, MD
Board Certified Endocrinology`,
    },
    {
        text: `EMERGENCY DEPARTMENT NOTE - CHEST PAIN EVALUATION

Date: February 3, 2026
Patient: Patricia L. (DOB: 06/12/1965)  
Provider: Dr. James Rodriguez, MD, Emergency Medicine

CHIEF COMPLAINT:
"Chest pain for the past 2 hours"

HISTORY OF PRESENT ILLNESS:
60-year-old female presents to ED with substernal chest discomfort that began 2 hours ago while at rest. She describes it as a pressure sensation, 6/10 intensity, radiating to left arm. Associated with mild shortness of breath and diaphoresis. No nausea or vomiting. Symptoms improved partially with 1 sublingual nitroglycerin given by EMS. Past history includes hypertension and hyperlipidemia. She is a former smoker (quit 5 years ago, 20 pack-year history).

VITAL SIGNS ON ARRIVAL:
- BP: 158/95 mmHg
- HR: 92 bpm
- RR: 18
- SpO2: 96% on room air
- Pain: 4/10 (after NTG)

PHYSICAL EXAMINATION:
- General: Anxious, diaphoretic female in mild distress
- Cardiovascular: Tachycardic, regular rhythm, no murmurs, JVP normal
- Lungs: Clear bilaterally, no wheezes or crackles
- Extremities: No edema, pulses 2+ throughout

DIAGNOSTIC WORKUP:
- ECG: Sinus tachycardia, ST depression in V4-V6, no acute ST elevation
- Troponin I (initial): 0.08 ng/mL (mildly elevated, normal <0.04)
- Chest X-ray: No acute cardiopulmonary process

ASSESSMENT:
NSTEMI - Non-ST Elevation Myocardial Infarction

TREATMENT INITIATED:
1. Aspirin 325mg PO given
2. Heparin infusion started per protocol
3. Atorvastatin 80mg given
4. Cardiology consulted - plan for cardiac catheterization in AM
5. Admitted to CCU for monitoring

Dr. James Rodriguez, MD
Emergency Medicine`,
    },
    {
        text: `PEDIATRIC WELL-CHILD VISIT - 4 YEAR CHECK-UP

Date: February 2, 2026
Patient: Sophia T. (DOB: 01/15/2022)
Provider: Dr. Lisa Park, MD, Pediatrics

REASON FOR VISIT:
4-year well-child examination and immunizations.

HISTORY:
Mother reports child is doing well overall. Good appetite, sleeping through the night. Meeting all developmental milestones. Attends preschool 3 days per week with no reported behavioral issues. No recent illnesses. Allergies: NKDA. Medications: None.

DEVELOPMENTAL ASSESSMENT:
- Gross Motor: Hops on one foot, climbs well, kicks ball
- Fine Motor: Draws circle and square, uses scissors, dresses independently
- Language: Speaks in 4-5 word sentences, tells stories, knows colors
- Social: Plays cooperatively, shows empathy, follows rules

PHYSICAL EXAMINATION:
- Weight: 38 lbs (60th percentile)
- Height: 40 inches (55th percentile)
- BMI: 17 (healthy range)
- Vital Signs: HR 98, RR 20, BP 90/58
- General: Active, cooperative, well-nourished child
- HEENT: Normocephalic, TMs clear, throat clear, dentition appropriate
- Cardiovascular: Regular rhythm, no murmurs
- Lungs: Clear to auscultation
- Abdomen: Soft, non-tender
- Musculoskeletal: Normal gait, spine straight
- Skin: No rashes or lesions
- Neurological: Age-appropriate reflexes and coordination

IMMUNIZATIONS GIVEN TODAY:
- DTaP (5th dose)
- IPV (4th dose)
- MMR (2nd dose)
- Varicella (2nd dose)

ANTICIPATORY GUIDANCE:
- Nutrition: Continue balanced diet, limit juice and sweets
- Safety: Car seat, water safety, stranger awareness discussed
- Sleep: 10-13 hours per night recommended
- Screen time: Limit to 1 hour per day of quality content
- Next visit: 5-year check-up before kindergarten

Dr. Lisa Park, MD
Board Certified Pediatrics`,
    },
];

async function addSampleTranscriptions() {
    console.log('Starting to add sample medical transcriptions...\n');

    const container = getContainer(CONTAINER_NAME);
    if (!container) {
        console.error('❌ Cosmos DB container not available. Make sure COSMOS_ENDPOINT and COSMOS_KEY are set.');
        process.exit(1);
    }

    for (let i = 0; i < sampleTranscriptions.length; i++) {
        const transcription = sampleTranscriptions[i];
        const id = `trans_${randomUUID()}`;

        // Create dates spread over the last few days
        const daysAgo = sampleTranscriptions.length - 1 - i;
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        createdAt.setHours(createdAt.getHours() - Math.floor(Math.random() * 8)); // Random time variance

        const doc = {
            id,
            tenantId,
            userId,
            text: transcription.text,
            createdAt: createdAt.toISOString(),
        };

        try {
            await container.items.create(doc);
            console.log(`✅ Created transcription ${i + 1}/${sampleTranscriptions.length}: ${id}`);
        } catch (error) {
            console.error(`❌ Failed to create transcription ${i + 1}:`, error.message);
        }
    }

    console.log('\n✨ Done! Added sample medical transcriptions to transcription history.');
}

// Run the script
addSampleTranscriptions().catch(console.error);
