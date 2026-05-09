/** Demo crop report (.md) — load in Farm Planner to generate or preview a timetable. */
export const SAMPLE_CROP_REPORT = `# Sample wheat crop analysis (demo)

**Detected issue:** Yellow rust (stripe rust) — moderate severity  
**Confidence:** ~88%  
**Notes:** Upper leaves show yellow-orange pustules; humid mornings favour spread.

### Treatment (summary)
- Apply recommended fungicide early morning; repeat per label if moisture persists.
- Improve airflow; avoid excess nitrogen without balancing potassium.

### Fertilizer Recommendations
- Top-dress controlled nitrogen only after fungicide window.
- Add potassium sulphate if deficiency signs appear.

### Irrigation
- Prefer drip or furrow; avoid prolonged leaf wetness.
`.trim();

/** Pre-built 7-day timetable (Markdown) — instant demo plan in planner UI. */
export const SAMPLE_FARM_TIMETABLE = `
# 7-Day Farm Timetable (Sample Plan)

### Day 1: Immediate scouting & spray window
- **06:00 AM - 07:30 AM:** 💧 Light irrigation if soil moisture is below 40% field capacity.
- **07:30 AM - 09:00 AM:** 👁️ Scout lower canopy for new lesions; photograph hotspots for records.
- **05:00 PM - 06:00 PM:** 🛡️ Apply preventive fungicide spray if humidity stays high (follow label rates).

### Day 2: Nutrition support
- **06:30 AM - 08:00 AM:** 💧 Drip irrigation to maintain steady moisture without leaf wetness overnight.
- **08:30 AM - 10:00 AM:** 🧪 Foliar micronutrient spray (chelated Zn/Mn) if deficiency symptoms noted.

### Day 3: Observation & soil check
- **All Day:** 👁️ Monitor rust progression; flag patches spreading upward.
- **06:00 AM - 07:00 AM:** 💧 Short irrigation pulse only if topsoil is dry 2 cm depth.

### Day 4: Reinforcement spray
- **06:00 AM - 07:30 AM:** 🛡️ Alternate-mode fungicide rotation (systemic + contact) per agronomist advice.
- **04:00 PM - 05:00 PM:** 👁️ Edge-field scouting for weed competition affecting airflow.

### Day 5: Balanced fertility
- **07:00 AM - 09:00 AM:** 🧪 Side-dress potassium if tissue tests or visuals suggest low K.
- **06:00 PM - 07:00 PM:** 💧 Irrigation cut-off early evening to keep leaves dry overnight.

### Day 6: Pest watch
- **Morning:** 👁️ Check for aphid buildup near rust lesions.
- **Afternoon:** 💧 Maintain moisture; avoid overhead watering completely.

### Day 7: Review & plan next week
- **06:00 AM - 08:00 AM:** 💧 Deep watering if forecast shows dry spell.
- **05:00 PM - 06:00 PM:** 🛡️ Organic neem-based spray as supplementary protection if approved for crop stage.
`.trim();
