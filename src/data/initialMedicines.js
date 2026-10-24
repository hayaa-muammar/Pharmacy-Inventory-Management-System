/**
 * PharmaCare Expanded Sample Medicine Dataset
 * 52 realistic pharmaceutical records spanning major therapeutic categories.
 * Note: Clearly identified as demonstration data for inventory management.
 */

export const INITIAL_MEDICINES = [
  // 1-15: Original 15 items with their exact verified local photos preserved
  {
    id: "MED-1001",
    name: "Panadol Extra 500mg",
    category: "Analgesic",
    quantity: 85,
    minStock: 20,
    unitPrice: 4.50,
    expiryDate: "2026-11-20", // Expiring soon (<90 days)
    supplier: "GlaxoSmithKline (GSK)",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "Paracetamol & caffeine formulation for fast relief of acute headaches, toothache, and fever."
  },
  {
    id: "MED-1002",
    name: "Flagyl 500mg Metronidazole",
    category: "Antibiotic",
    quantity: 42,
    minStock: 15,
    unitPrice: 6.20,
    expiryDate: "2027-08-25",
    supplier: "Sanofi Aventis",
    image: "iimmgg/IMG_20260119_231818.jpg",
    description: "Oral antimicrobial for treating anaerobic bacterial infections and amoebic dysentery."
  },
  {
    id: "MED-1003",
    name: "Maalox Oral Suspension",
    category: "Antacid",
    quantity: 0, // Out of stock
    minStock: 10,
    unitPrice: 5.75,
    expiryDate: "2027-10-08",
    supplier: "Sanofi",
    image: "iimmgg/IMG_20260119_231836.jpg",
    description: "Aluminium hydroxide & magnesium hydroxide fast-acting antacid for acid indigestion."
  },
  {
    id: "MED-1004",
    name: "Aspirin Protect 100mg",
    category: "NSAID",
    quantity: 24,
    minStock: 10,
    unitPrice: 3.00,
    expiryDate: "2021-02-05", // Expired
    supplier: "Bayer Healthcare",
    image: "iimmgg/IMG_20260119_232151.jpg",
    description: "Low-dose acetylsalicylic acid for secondary prevention of thrombotic cerebrovascular events."
  },
  {
    id: "MED-1005",
    name: "Amoxicillin 250mg Capsules",
    category: "Antibiotic",
    quantity: 0, // Out of stock
    minStock: 20,
    unitPrice: 8.50,
    expiryDate: "2028-01-01",
    supplier: "GlaxoSmithKline (GSK)",
    image: "iimmgg/IMG_20260119_232130.jpg",
    description: "Moderate-spectrum penicillin antibiotic used to treat bacterial respiratory and ENT infections."
  },
  {
    id: "MED-1006",
    name: "Ibuprofen 400mg Film-Coated",
    category: "Pain Relief",
    quantity: 15, // Low stock (minStock = 15)
    minStock: 15,
    unitPrice: 4.00,
    expiryDate: "2022-02-10", // Expired
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_232117.jpg",
    description: "Non-steroidal anti-inflammatory drug for pain, dysmenorrhea, dental aches, and inflammation."
  },
  {
    id: "MED-1007",
    name: "Vitamin C 1000mg Effervescent",
    category: "Supplement",
    quantity: 6, // Low stock (minStock = 15)
    minStock: 15,
    unitPrice: 9.00,
    expiryDate: "2027-05-18",
    supplier: "Nature Made",
    image: "iimmgg/IMG_20260119_232105.jpg",
    description: "High potency ascorbic acid immunity booster tablets with refreshing orange flavor."
  },
  {
    id: "MED-1008",
    name: "Omeprazole 20mg Delayed-Release",
    category: "Gastric",
    quantity: 60,
    minStock: 15,
    unitPrice: 12.00,
    expiryDate: "2027-08-08",
    supplier: "AstraZeneca",
    image: "iimmgg/IMG_20260119_232038.jpg",
    description: "Proton pump inhibitor (PPI) reducing gastric acid for GERD and duodenal ulcer healing."
  },
  {
    id: "MED-1009",
    name: "Insulin Regular 100IU/ml",
    category: "Diabetes",
    quantity: 18,
    minStock: 10,
    unitPrice: 35.00,
    expiryDate: "2027-07-25",
    supplier: "Novo Nordisk",
    image: "iimmgg/IMG_20260119_232023.jpg",
    description: "Short-acting human recombinant insulin injection for glycemic regulation in diabetes mellitus."
  },
  {
    id: "MED-1010",
    name: "Paracetamol 500mg Tablets",
    category: "Pain Relief",
    quantity: 30,
    minStock: 15,
    unitPrice: 2.50,
    expiryDate: "2023-05-05", // Expired
    supplier: "Local Pharma Lab",
    image: "iimmgg/IMG_20260119_232004.jpg",
    description: "Standard antipyretic and analgesic safe for mild fever and tension headaches."
  },
  {
    id: "MED-1011",
    name: "ORS Rehydration Salts Sachets",
    category: "Hydration",
    quantity: 110,
    minStock: 25,
    unitPrice: 1.80,
    expiryDate: "2027-08-27",
    supplier: "WHO Essential Care",
    image: "iimmgg/IMG_20260119_231952.jpg",
    description: "Balanced glucose-electrolyte oral rehydration salts preventing acute diarrheal dehydration."
  },
  {
    id: "MED-1012",
    name: "Iron Complex + Folic Acid",
    category: "Supplement",
    quantity: 4, // Low stock (minStock = 10)
    minStock: 10,
    unitPrice: 7.20,
    expiryDate: "2028-04-01",
    supplier: "Merck Healthcare",
    image: "iimmgg/IMG_20260119_231935.jpg",
    description: "Therapeutic mineral supplement formulated to treat microcytic hypochromic iron deficiency anemia."
  },
  {
    id: "MED-1013",
    name: "Diclofenac Sodium Gel 1%",
    category: "Pain Relief",
    quantity: 0, // Out of stock
    minStock: 10,
    unitPrice: 8.90,
    expiryDate: "2026-12-15", // Expiring soon
    supplier: "Novartis",
    image: "iimmgg/IMG_20260119_231919.jpg",
    description: "Topical NSAID gel for targeted local relief of acute joint strain, osteoarthritis, and sprains."
  },
  {
    id: "MED-1014",
    name: "Hydrocortisone Cream 1%",
    category: "Dermatology",
    quantity: 3, // Low stock (minStock = 10)
    minStock: 10,
    unitPrice: 6.50,
    expiryDate: "2026-11-30", // Expiring soon
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_231906.jpg",
    description: "Low-potency topical corticosteroid for relief of eczema, pruritus, and contact dermatitis."
  },
  {
    id: "MED-1015",
    name: "Claritin Loratadine 10mg",
    category: "Antihistamine",
    quantity: 35,
    minStock: 10,
    unitPrice: 11.40,
    expiryDate: "2027-06-16",
    supplier: "Bayer Healthcare",
    image: "iimmgg/IMG_20260119_231852.jpg",
    description: "Non-sedating selective peripheral H1 receptor blocker for seasonal allergic rhinitis and urticaria."
  },

  // 16-52: Realistic Expanded Hospital & Retail Pharmacy Inventory
  {
    id: "MED-1016",
    name: "Augmentin 1g (Amoxicillin/Clavulanate)",
    category: "Antibiotic",
    quantity: 48,
    minStock: 15,
    unitPrice: 14.50,
    expiryDate: "2027-09-15",
    supplier: "GlaxoSmithKline (GSK)",
    image: "iimmgg/IMG_20260119_232130.jpg",
    description: "Potentiated beta-lactamase inhibitor antibiotic for severe sinus, respiratory, and urinary infections."
  },
  {
    id: "MED-1017",
    name: "Metformin HCl 850mg",
    category: "Diabetes",
    quantity: 140,
    minStock: 30,
    unitPrice: 5.20,
    expiryDate: "2028-03-20",
    supplier: "Merck Healthcare",
    image: "iimmgg/IMG_20260119_232023.jpg",
    description: "First-line oral biguanide antihyperglycemic agent for managing type 2 diabetes mellitus."
  },
  {
    id: "MED-1018",
    name: "Atorvastatin 20mg (Lipitor)",
    category: "Cardiology",
    quantity: 75,
    minStock: 20,
    unitPrice: 16.00,
    expiryDate: "2027-11-10",
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "HMG-CoA reductase inhibitor for reducing LDL cholesterol and cardiovascular risk reduction."
  },
  {
    id: "MED-1019",
    name: "Amlodipine Besylate 5mg",
    category: "Cardiology",
    quantity: 90,
    minStock: 25,
    unitPrice: 6.80,
    expiryDate: "2028-06-12",
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "Long-acting dihydropyridine calcium channel blocker for systemic essential hypertension."
  },
  {
    id: "MED-1020",
    name: "Ciprofloxacin 500mg (Cipro)",
    category: "Antibiotic",
    quantity: 8, // Low stock (minStock = 15)
    minStock: 15,
    unitPrice: 9.30,
    expiryDate: "2027-03-30",
    supplier: "Bayer Healthcare",
    image: "iimmgg/IMG_20260119_232130.jpg",
    description: "Broad-spectrum fluoroquinolone antibiotic effective against gram-negative bacterial strains."
  },
  {
    id: "MED-1021",
    name: "Azithromycin 500mg (Zithromax 3-Day)",
    category: "Antibiotic",
    quantity: 26,
    minStock: 10,
    unitPrice: 13.50,
    expiryDate: "2026-11-28", // Expiring soon
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_232130.jpg",
    description: "Macrolide antibiotic indicated for community-acquired pneumonia, bronchitis, and chlamydia."
  },
  {
    id: "MED-1022",
    name: "Ventolin HFA 100mcg Inhaler",
    category: "Respiratory",
    quantity: 32,
    minStock: 12,
    unitPrice: 18.00,
    expiryDate: "2027-12-05",
    supplier: "GlaxoSmithKline (GSK)",
    image: "iimmgg/IMG_20260119_231852.jpg",
    description: "Salbutamol sulfate bronchodilator aerosol for acute asthma bronchospasm relief."
  },
  {
    id: "MED-1023",
    name: "Symbicort Turbuhaler 160/4.5mcg",
    category: "Respiratory",
    quantity: 0, // Out of stock
    minStock: 8,
    unitPrice: 42.00,
    expiryDate: "2028-02-14",
    supplier: "AstraZeneca",
    image: "iimmgg/IMG_20260119_231852.jpg",
    description: "Budesonide/formoterol maintenance inhaler for moderate-to-severe persistent asthma and COPD."
  },
  {
    id: "MED-1024",
    name: "Losartan Potassium 50mg",
    category: "Cardiology",
    quantity: 65,
    minStock: 15,
    unitPrice: 8.50,
    expiryDate: "2027-10-18",
    supplier: "Merck Healthcare",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "Angiotensin II receptor antagonist (ARB) for treating hypertension and diabetic nephropathy."
  },
  {
    id: "MED-1025",
    name: "Pantoprazole 40mg (Controloc)",
    category: "Gastric",
    quantity: 55,
    minStock: 15,
    unitPrice: 11.20,
    expiryDate: "2028-05-19",
    supplier: "Takeda Pharma",
    image: "iimmgg/IMG_20260119_232038.jpg",
    description: "Proton pump inhibitor indicated for healing erosive esophagitis and Zollinger-Ellison syndrome."
  },
  {
    id: "MED-1026",
    name: "Zyrtec Cetirizine 10mg",
    category: "Antihistamine",
    quantity: 40,
    minStock: 10,
    unitPrice: 10.50,
    expiryDate: "2027-04-12",
    supplier: "Johnson & Johnson",
    image: "iimmgg/IMG_20260119_231852.jpg",
    description: "Second-generation antihistamine relieving allergic perennial rhinitis and chronic urticaria."
  },
  {
    id: "MED-1027",
    name: "Glimepiride 2mg (Amaryl)",
    category: "Diabetes",
    quantity: 5, // Low stock (minStock = 12)
    minStock: 12,
    unitPrice: 7.40,
    expiryDate: "2027-01-10",
    supplier: "Sanofi",
    image: "iimmgg/IMG_20260119_232023.jpg",
    description: "Sulfonylurea medication stimulating pancreatic beta cell insulin secretion in type 2 diabetes."
  },
  {
    id: "MED-1028",
    name: "Januvia Sitagliptin 100mg",
    category: "Diabetes",
    quantity: 22,
    minStock: 10,
    unitPrice: 38.50,
    expiryDate: "2027-09-22",
    supplier: "Merck & Co.",
    image: "iimmgg/IMG_20260119_232023.jpg",
    description: "Dipeptidyl peptidase-4 (DPP-4) inhibitor improving postprandial glucose control."
  },
  {
    id: "MED-1029",
    name: "Celebrex Celecoxib 200mg",
    category: "NSAID",
    quantity: 18,
    minStock: 10,
    unitPrice: 19.80,
    expiryDate: "2026-10-30", // Expiring soon (few days!)
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_232117.jpg",
    description: "Selective COX-2 inhibitor reducing arthritis pain with reduced gastrointestinal ulceration risk."
  },
  {
    id: "MED-1030",
    name: "Prednisolone 5mg Tablets",
    category: "Dermatology",
    quantity: 80,
    minStock: 20,
    unitPrice: 4.80,
    expiryDate: "2028-07-04",
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_231906.jpg",
    description: "Systemic glucocorticoid immunosuppressant for allergic reactions, autoimmune flares, and asthma."
  },
  {
    id: "MED-1031",
    name: "Clotrimazole 1% Topical Cream",
    category: "Dermatology",
    quantity: 25,
    minStock: 10,
    unitPrice: 5.50,
    expiryDate: "2027-08-14",
    supplier: "Bayer Healthcare",
    image: "iimmgg/IMG_20260119_231906.jpg",
    description: "Broad-spectrum imidazole antifungal cream for athlete's foot, jock itch, and ringworm."
  },
  {
    id: "MED-1032",
    name: "Fucidin Sodium Fusidate 2%",
    category: "Dermatology",
    quantity: 14,
    minStock: 10,
    unitPrice: 8.75,
    expiryDate: "2027-11-25",
    supplier: "LEO Pharma",
    image: "iimmgg/IMG_20260119_231906.jpg",
    description: "Targeted topical antibiotic ointment for staphylococcal impetigo and infected folliculitis."
  },
  {
    id: "MED-1033",
    name: "Betadine Antiseptic Solution 10%",
    category: "Dermatology",
    quantity: 45,
    minStock: 15,
    unitPrice: 6.90,
    expiryDate: "2028-09-30",
    supplier: "Mundipharma",
    image: "iimmgg/IMG_20260119_231906.jpg",
    description: "Povidone-iodine broad microbicidal solution for topical wound antisepsis and pre-op prep."
  },
  {
    id: "MED-1034",
    name: "Gaviscon Double Action Liquid",
    category: "Antacid",
    quantity: 38,
    minStock: 12,
    unitPrice: 9.80,
    expiryDate: "2027-06-25",
    supplier: "Reckitt Benckiser",
    image: "iimmgg/IMG_20260119_231836.jpg",
    description: "Sodium alginate protective barrier suspension neutralizing stomach acid and preventing reflux."
  },
  {
    id: "MED-1035",
    name: "Nexium Esomeprazole 40mg",
    category: "Gastric",
    quantity: 50,
    minStock: 15,
    unitPrice: 19.50,
    expiryDate: "2027-12-19",
    supplier: "AstraZeneca",
    image: "iimmgg/IMG_20260119_232038.jpg",
    description: "S-isomer of omeprazole providing sustained gastric suppression for severe gastroesophageal reflux."
  },
  {
    id: "MED-1036",
    name: "Voltaren 50mg Tablets",
    category: "Pain Relief",
    quantity: 70,
    minStock: 20,
    unitPrice: 7.80,
    expiryDate: "2027-07-15",
    supplier: "Novartis",
    image: "iimmgg/IMG_20260119_231919.jpg",
    description: "Enteric-coated diclofenac potassium tablets for acute musculoskeletal and inflammatory pain."
  },
  {
    id: "MED-1037",
    name: "Tramadol HCl 50mg (Controlled)",
    category: "Analgesic",
    quantity: 12, // Low stock (minStock = 15)
    minStock: 15,
    unitPrice: 15.00,
    expiryDate: "2026-11-15", // Expiring soon
    supplier: "Grünenthal",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "Centrally acting synthetic opioid analgesic reserved for moderate to moderately severe pain."
  },
  {
    id: "MED-1038",
    name: "Dexamethasone 0.5mg Tablets",
    category: "Dermatology",
    quantity: 0, // Out of stock
    minStock: 10,
    unitPrice: 3.50,
    expiryDate: "2027-03-11",
    supplier: "Pfizer Inc.",
    image: "iimmgg/IMG_20260119_231906.jpg",
    description: "Potent corticosteroid with minimal mineralocorticoid activity for severe inflammation and edema."
  },
  {
    id: "MED-1039",
    name: "Systane Ultra Lubricant Eye Drops",
    category: "Ophthalmology",
    quantity: 28,
    minStock: 10,
    unitPrice: 12.40,
    expiryDate: "2027-10-05",
    supplier: "Alcon Vision",
    image: "iimmgg/IMG_20260119_231952.jpg",
    description: "Sterile ophthalmic lubrication solution providing extended relief for dry eye syndrome."
  },
  {
    id: "MED-1040",
    name: "Tobrex Tobramycin 0.3% Drops",
    category: "Ophthalmology",
    quantity: 16,
    minStock: 8,
    unitPrice: 9.60,
    expiryDate: "2027-04-18",
    supplier: "Novartis",
    image: "iimmgg/IMG_20260119_231952.jpg",
    description: "Aminoglycoside bactericidal eye drops indicated for external bacterial conjunctivitis."
  },
  {
    id: "MED-1041",
    name: "Calcium Carbonate + Vitamin D3",
    category: "Supplement",
    quantity: 85,
    minStock: 20,
    unitPrice: 8.20,
    expiryDate: "2028-11-10",
    supplier: "Bayer Healthcare",
    image: "iimmgg/IMG_20260119_232105.jpg",
    description: "Dietary mineral bone support formulation preventing osteoporosis and hypocalcemia."
  },
  {
    id: "MED-1042",
    name: "Neurobion Forte (B1, B6, B12)",
    category: "Supplement",
    quantity: 95,
    minStock: 25,
    unitPrice: 6.50,
    expiryDate: "2028-08-30",
    supplier: "Merck Healthcare",
    image: "iimmgg/IMG_20260119_232105.jpg",
    description: "Neurotropic high-dose vitamin B complex tablets for peripheral neuropathy and nerve health."
  },
  {
    id: "MED-1043",
    name: "Zinc Sulfate 50mg Tablets",
    category: "Supplement",
    quantity: 42,
    minStock: 15,
    unitPrice: 4.20,
    expiryDate: "2027-12-01",
    supplier: "Nature Made",
    image: "iimmgg/IMG_20260119_232105.jpg",
    description: "Essential trace mineral dietary supplement aiding immune defense and cellular wound repair."
  },
  {
    id: "MED-1044",
    name: "Saline Nasal Spray 0.9%",
    category: "Respiratory",
    quantity: 64,
    minStock: 15,
    unitPrice: 5.00,
    expiryDate: "2028-05-15",
    supplier: "Sterile Care Ltd",
    image: "iimmgg/IMG_20260119_231952.jpg",
    description: "Isotonic non-medicated saline mist for soothing dry congested nasal passages."
  },
  {
    id: "MED-1045",
    name: "Otrivin Xylometazoline 0.1% Spray",
    category: "Respiratory",
    quantity: 2, // Low stock (minStock = 10)
    minStock: 10,
    unitPrice: 7.10,
    expiryDate: "2027-02-28",
    supplier: "GlaxoSmithKline (GSK)",
    image: "iimmgg/IMG_20260119_231852.jpg",
    description: "Rapid-acting nasal decongestant relieving acute rhinitis and sinus congestion up to 10 hours."
  },
  {
    id: "MED-1046",
    name: "Dolfenac 100mg Suppositories",
    category: "Pain Relief",
    quantity: 20,
    minStock: 10,
    unitPrice: 8.00,
    expiryDate: "2023-08-15", // Expired
    supplier: "PharmaCare Lab",
    image: "iimmgg/IMG_20260119_231919.jpg",
    description: "Rectal diclofenac suppositories for rapid post-operative analgesia and severe colic pain."
  },
  {
    id: "MED-1047",
    name: "Spasfon Phloroglucinol Tablets",
    category: "Gastric",
    quantity: 44,
    minStock: 15,
    unitPrice: 6.70,
    expiryDate: "2027-06-30",
    supplier: "Teva Pharmaceuticals",
    image: "iimmgg/IMG_20260119_232038.jpg",
    description: "Pure antispasmodic targeting smooth muscle cramps in gastrointestinal, renal, and biliary colic."
  },
  {
    id: "MED-1048",
    name: "Loperamide 2mg (Imodium)",
    category: "Gastric",
    quantity: 52,
    minStock: 15,
    unitPrice: 6.00,
    expiryDate: "2027-11-18",
    supplier: "Johnson & Johnson",
    image: "iimmgg/IMG_20260119_232038.jpg",
    description: "Opioid-receptor agonist slowing intestinal motility for acute non-specific traveler's diarrhea."
  },
  {
    id: "MED-1049",
    name: "Warfarin Sodium 5mg (Coumadin)",
    category: "Cardiology",
    quantity: 35,
    minStock: 10,
    unitPrice: 11.80,
    expiryDate: "2027-05-30",
    supplier: "Bristol Myers Squibb",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "Vitamin K antagonist oral anticoagulant for systemic deep vein thrombosis and atrial fibrillation."
  },
  {
    id: "MED-1050",
    name: "Plavix Clopidogrel 75mg",
    category: "Cardiology",
    quantity: 0, // Out of stock
    minStock: 15,
    unitPrice: 24.50,
    expiryDate: "2027-10-12",
    supplier: "Sanofi",
    image: "iimmgg/IMG_20260119_231802.jpg",
    description: "P2Y12 adenosine diphosphate receptor inhibitor preventing atherothrombotic vascular events."
  },
  {
    id: "MED-1051",
    name: "Klaricid Clarithromycin 500mg",
    category: "Antibiotic",
    quantity: 19,
    minStock: 10,
    unitPrice: 18.20,
    expiryDate: "2024-04-10", // Expired
    supplier: "Abbott Laboratories",
    image: "iimmgg/IMG_20260119_232130.jpg",
    description: "Semisynthetic macrolide antibiotic for eradication of Helicobacter pylori and pharyngitis."
  },
  {
    id: "MED-1052",
    name: "Multivitamin Complete Formula",
    category: "Supplement",
    quantity: 125,
    minStock: 25,
    unitPrice: 14.00,
    expiryDate: "2028-12-31",
    supplier: "Centrum Healthcare",
    image: "iimmgg/IMG_20260119_232105.jpg",
    description: "Broad-spectrum daily dietary supplement providing 24 essential vitamins and vital trace minerals."
  }
];

export const AVAILABLE_CATEGORIES = [
  "Analgesic",
  "Antibiotic",
  "Antacid",
  "Antihistamine",
  "Cardiology",
  "Dermatology",
  "Diabetes",
  "Gastric",
  "Hydration",
  "NSAID",
  "Ophthalmology",
  "Pain Relief",
  "Respiratory",
  "Supplement"
];

export const AVAILABLE_IMAGES = [
  { label: "Panadol / White Tablets", path: "iimmgg/IMG_20260119_231802.jpg" },
  { label: "Flagyl / Blister Pack", path: "iimmgg/IMG_20260119_231818.jpg" },
  { label: "Maalox / Antacid Liquid", path: "iimmgg/IMG_20260119_231836.jpg" },
  { label: "Claritin / Allergy Tablets", path: "iimmgg/IMG_20260119_231852.jpg" },
  { label: "Hydrocortisone / Topical Cream", path: "iimmgg/IMG_20260119_231906.jpg" },
  { label: "Diclofenac / Gel Tube", path: "iimmgg/IMG_20260119_231919.jpg" },
  { label: "Iron Complex / Vitamins", path: "iimmgg/IMG_20260119_231935.jpg" },
  { label: "ORS / Rehydration Drops", path: "iimmgg/IMG_20260119_231952.jpg" },
  { label: "Paracetamol / Pain Box", path: "iimmgg/IMG_20260119_232004.jpg" },
  { label: "Insulin / Vials & Pens", path: "iimmgg/IMG_20260119_232023.jpg" },
  { label: "Omeprazole / Gastric Capsules", path: "iimmgg/IMG_20260119_232038.jpg" },
  { label: "Vitamin C / Effervescent Tube", path: "iimmgg/IMG_20260119_232105.jpg" },
  { label: "Ibuprofen / Red Coated", path: "iimmgg/IMG_20260119_232117.jpg" },
  { label: "Amoxicillin / Capsule Pack", path: "iimmgg/IMG_20260119_232130.jpg" },
  { label: "Aspirin / Cardioprotective", path: "iimmgg/IMG_20260119_232151.jpg" }
];
