/**
 * PharmaCare Inventory Management System
 * Initial Seed Data & Available Asset References
 */

const INITIAL_MEDICINES = [
    {
        id: "MED-1001",
        name: "Panadol Extra 500mg",
        category: "Analgesic",
        quantity: 85,
        minStock: 20,
        unitPrice: 4.50,
        expiryDate: "2026-11-20", // Expiring soon relative to 2026-10-19
        supplier: "GlaxoSmithKline (GSK)",
        image: "iimmgg/IMG_20260119_231802.jpg",
        description: "Paracetamol and caffeine for fast relief of acute headaches, toothache, and pain."
    },
    {
        id: "MED-1002",
        name: "Flagyl 500mg",
        category: "Antibiotic",
        quantity: 42,
        minStock: 15,
        unitPrice: 6.20,
        expiryDate: "2027-08-25",
        supplier: "Sanofi Aventis",
        image: "iimmgg/IMG_20260119_231818.jpg",
        description: "Metronidazole oral antibiotic for treating anaerobic bacterial and protozoal infections."
    },
    {
        id: "MED-1003",
        name: "Maalox Oral Suspension",
        category: "Antacid",
        quantity: 0,
        minStock: 10,
        unitPrice: 5.75,
        expiryDate: "2027-10-08",
        supplier: "Sanofi",
        image: "iimmgg/IMG_20260119_231836.jpg",
        description: "Aluminium hydroxide and magnesium hydroxide antacid for acid indigestion and heartburn."
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
        description: "Low-dose acetylsalicylic acid used for cardiovascular prophylaxis and antiplatelet therapy."
    },
    {
        id: "MED-1005",
        name: "Amoxicillin 250mg",
        category: "Antibiotic",
        quantity: 0,
        minStock: 20,
        unitPrice: 8.50,
        expiryDate: "2028-01-01",
        supplier: "GlaxoSmithKline (GSK)",
        image: "iimmgg/IMG_20260119_232130.jpg",
        description: "Broad-spectrum penicillin antibiotic used to treat bacterial ear, chest, and throat infections."
    },
    {
        id: "MED-1006",
        name: "Ibuprofen 400mg",
        category: "Pain Relief",
        quantity: 15,
        minStock: 15,
        unitPrice: 4.00,
        expiryDate: "2022-02-10", // Expired
        supplier: "Pfizer Inc.",
        image: "iimmgg/IMG_20260119_232117.jpg",
        description: "Nonsteroidal anti-inflammatory drug (NSAID) for relief of arthritis, muscular pain, and fever."
    },
    {
        id: "MED-1007",
        name: "Vitamin C 1000mg Effervescent",
        category: "Supplement",
        quantity: 5, // Low stock (min 15)
        minStock: 15,
        unitPrice: 9.00,
        expiryDate: "2027-05-18",
        supplier: "Nature Made",
        image: "iimmgg/IMG_20260119_232105.jpg",
        description: "High potency ascorbic acid immunity booster tablets with refreshing citrus flavor."
    },
    {
        id: "MED-1008",
        name: "Omeprazole 20mg",
        category: "Gastric",
        quantity: 60,
        minStock: 15,
        unitPrice: 12.00,
        expiryDate: "2027-08-08",
        supplier: "AstraZeneca",
        image: "iimmgg/IMG_20260119_232038.jpg",
        description: "Proton pump inhibitor (PPI) reducing stomach acid for GERD and peptic ulcer treatment."
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
        description: "Short-acting human biosynthetic insulin injection for glycemic control in diabetes mellitus."
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
        description: "Essential antipyretic and pain reliever suitable for patients sensitive to aspirin."
    },
    {
        id: "MED-1011",
        name: "ORS Rehydration Salts",
        category: "Hydration",
        quantity: 110,
        minStock: 25,
        unitPrice: 1.80,
        expiryDate: "2027-08-27",
        supplier: "WHO Essential Care",
        image: "iimmgg/IMG_20260119_231952.jpg",
        description: "Electrolyte powder sachets for rapid oral rehydration therapy in dehydration and diarrheal illness."
    },
    {
        id: "MED-1012",
        name: "Iron Complex + Folic Acid",
        category: "Supplement",
        quantity: 3, // Low stock (min 10)
        minStock: 10,
        unitPrice: 7.20,
        expiryDate: "2028-04-01",
        supplier: "Merck Healthcare",
        image: "iimmgg/IMG_20260119_231935.jpg",
        description: "Ferrous fumarate nutritional supplement formulated to treat and prevent iron deficiency anemia."
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
        description: "Topical anti-inflammatory gel for localized relief of joint pain, sprains, and sports injuries."
    },
    {
        id: "MED-1014",
        name: "Hydrocortisone Cream 1%",
        category: "Dermatology",
        quantity: 4, // Low stock (min 10)
        minStock: 10,
        unitPrice: 6.50,
        expiryDate: "2026-11-30", // Expiring soon
        supplier: "Pfizer Inc.",
        image: "iimmgg/IMG_20260119_231906.jpg",
        description: "Mild corticosteroid topical cream for eczema, dermatitis, insect bites, and skin itching."
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
        description: "Non-drowsy 24-hour allergy relief for allergic rhinitis, sneezing, watery eyes, and hives."
    }
];

const AVAILABLE_MEDICINE_IMAGES = [
    { label: "Panadol", path: "iimmgg/IMG_20260119_231802.jpg" },
    { label: "Flagyl", path: "iimmgg/IMG_20260119_231818.jpg" },
    { label: "Maalox", path: "iimmgg/IMG_20260119_231836.jpg" },
    { label: "Claritin", path: "iimmgg/IMG_20260119_231852.jpg" },
    { label: "Hydrocortisone", path: "iimmgg/IMG_20260119_231906.jpg" },
    { label: "Diclofenac", path: "iimmgg/IMG_20260119_231919.jpg" },
    { label: "Iron", path: "iimmgg/IMG_20260119_231935.jpg" },
    { label: "ORS", path: "iimmgg/IMG_20260119_231952.jpg" },
    { label: "Paracetamol", path: "iimmgg/IMG_20260119_232004.jpg" },
    { label: "Insulin", path: "iimmgg/IMG_20260119_232023.jpg" },
    { label: "Omeprazole", path: "iimmgg/IMG_20260119_232038.jpg" },
    { label: "Vitamin C", path: "iimmgg/IMG_20260119_232105.jpg" },
    { label: "Ibuprofen", path: "iimmgg/IMG_20260119_232117.jpg" },
    { label: "Amoxicillin", path: "iimmgg/IMG_20260119_232130.jpg" },
    { label: "Aspirin", path: "iimmgg/IMG_20260119_232151.jpg" }
];

const PREDEFINED_CATEGORIES = [
    "Analgesic",
    "Antibiotic",
    "Antacid",
    "Antihistamine",
    "Dermatology",
    "Diabetes",
    "Gastric",
    "Hydration",
    "NSAID",
    "Pain Relief",
    "Supplement"
];
