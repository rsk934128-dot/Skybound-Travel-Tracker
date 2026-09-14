import { DestinationVisaInfo } from './types';

export const VISA_CATEGORIES_CONFIG = {
  'visa-free': {
    labelEn: 'Visa-Free',
    labelBn: 'ভিসা মুক্ত (Visa-Free)',
    colorClass: 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/40',
    badgeBg: 'bg-emerald-500',
    textHighlight: 'text-emerald-600 dark:text-emerald-400',
    dotColor: 'bg-emerald-500',
    symbol: '🟢',
    descriptionBn: 'কোনো ভিসা ছাড়াই শুধুমাত্র বৈধ পাসপোর্ট ও রিটার্ন টিকেট নিয়ে সরাসরি প্রবেশ করা যাবে।'
  },
  'visa-on-arrival': {
    labelEn: 'Visa on Arrival (VoA)',
    labelBn: 'ভিসা অন অ্যারাইভাল (VoA)',
    colorClass: 'bg-amber-500/15 text-amber-800 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40',
    badgeBg: 'bg-amber-500',
    textHighlight: 'text-amber-600 dark:text-amber-400',
    dotColor: 'bg-amber-500',
    symbol: '🟡',
    descriptionBn: 'গন্তব্য দেশের আন্তর্জাতিক বিমানবন্দরে নামার পর ইমিগ্রেশন কাউন্টার থেকে সরাসরি ভিসা সংগ্রহ করা যায়।'
  },
  'eta-evisa': {
    labelEn: 'eVisa / ETA',
    labelBn: 'ই-ভিসা / ইটিএ (eVisa)',
    colorClass: 'bg-sky-500/15 text-sky-800 border-sky-500/30 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/40',
    badgeBg: 'bg-sky-500',
    textHighlight: 'text-sky-600 dark:text-sky-400',
    dotColor: 'bg-sky-500',
    symbol: '🔵',
    descriptionBn: 'অনলাইনে ফর্ম পূরণ করে এবং ফি জমা দিয়ে ১-৩ দিনের মধ্যে সহজে ইলেকট্রনিক ভিসা অনুমোদন পাওয়া যায়।'
  },
  'visa-required': {
    labelEn: 'Visa Required (Advance)',
    labelBn: 'ভিসা প্রয়োজন (পূর্বে আবেদন আবশ্যক)',
    colorClass: 'bg-rose-500/15 text-rose-800 border-rose-500/30 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/40',
    badgeBg: 'bg-rose-500',
    textHighlight: 'text-rose-600 dark:text-rose-400',
    dotColor: 'bg-rose-500',
    symbol: '🔴',
    descriptionBn: 'ভ্রমণের আগেই সংশ্লিষ্ট দেশের দূতাবাস বা কনস্যুলেটে কাগজপত্রসহ আনুষ্ঠানিক আবেদন করতে হবে।'
  }
};

export const DESTINATION_PHOTOS: Record<string, string> = {
  'BT': 'https://images.unsplash.com/photo-1578592395453-933df9119106?auto=format&fit=crop&w=800&q=80', // Bhutan Paro
  'ID': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80', // Indonesia Bali
  'MV': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=800&q=80', // Maldives
  'NP': 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80', // Nepal
  'LK': 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80', // Sri Lanka
  'TH': 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=800&q=80', // Thailand
  'MY': 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=800&q=80', // Malaysia
  'SG': 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', // Singapore
  'AE': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', // UAE Dubai
  'QA': 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=800&q=80', // Qatar Doha
  'SA': 'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?auto=format&fit=crop&w=800&q=80', // Saudi Arabia
  'TR': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80', // Turkey
  'GB': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', // UK London
  'US': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80', // USA New York
  'CA': 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80', // Canada Banff
  'VU': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', // Vanuatu
  'FJ': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', // Fiji
  'KE': 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80', // Kenya Safari
  'IN': 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80', // India Taj Mahal
  'VN': 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80', // Vietnam Ha Long Bay
};

export const BANGLADESH_PASSPORT_VISA_DB: Record<string, DestinationVisaInfo> = {
  // VISA-FREE (🟢)
  'BT': {
    countryCode: 'BT',
    countryName: 'Bhutan',
    countryNameBn: 'ভুটান',
    flagEmoji: '🇧🇹',
    capital: 'Thimphu',
    region: 'South Asia',
    visaCategory: 'visa-free',
    stayDuration: 'Up to 14 days',
    stayDurationBn: 'সর্বোচ্চ ১৪ দিন',
    feeEstimate: 'Sustainable Development Fee (SDF) may apply',
    keyRequirements: ['Valid Passport (6+ months validity)', 'Hotel booking', 'Return flight ticket'],
    keyRequirementsBn: ['পাসপোর্টের মেয়াদ ন্যূনতম ৬ মাস', 'হোটেল বুকিং কনফার্মেশন', 'রিটার্ন এয়ার টিকিট'],
    notes: 'Entry permit issued at Paro airport or Phuentsholing land border.',
    notesBn: 'পারো বিমানবন্দর বা ফুন্টশোলিং স্থলবন্দরে পাসপোর্ট প্রদর্শন করলেই এন্ট্রি পারমিট প্রদান করা হয়।',
    documentsNeeded: ['Valid Passport (min 6 months validity)', 'Return air ticket', 'Confirmed accommodation', 'Travel insurance']
  },
  'ID': {
    countryCode: 'ID',
    countryName: 'Indonesia',
    countryNameBn: 'ইন্দোনেশিয়া',
    flagEmoji: '🇮🇩',
    capital: 'Jakarta',
    region: 'Southeast Asia',
    visaCategory: 'visa-on-arrival',
    stayDuration: '30 days (extendable once for 30 days)',
    stayDurationBn: '৩০ দিন (একবার আরও ৩০ দিন বাড়ানো যায়)',
    feeEstimate: 'IDR 500,000 (~ USD 32 / BDT 3,800)',
    keyRequirements: ['Passport validity > 6 months', 'Return ticket', 'Customs declaration QR code'],
    keyRequirementsBn: ['পাসপোর্টের মেয়াদ ন্যূনতম ৬ মাস', 'ফেরার টিকিট', 'ইলেকট্রনিক কাস্টমস ডিক্লারেশন (ECD)'],
    notes: 'Available online as e-VoA or directly at Jakarta/Bali airport counters.',
    notesBn: 'জাকার্তা বা বালি বিমানবন্দরে সরাসরি কাউন্টারে ফি দিয়ে কিংবা আগে অনলাইনে e-VoA নেওয়া যায়।',
    documentsNeeded: ['Original Passport', 'Return ticket proof', 'Hotel reservation', 'Bank statement or credit card']
  },
  'MV': {
    countryCode: 'MV',
    countryName: 'Maldives',
    countryNameBn: 'মালদ্বীপ',
    flagEmoji: '🇲🇻',
    capital: 'Malé',
    region: 'South Asia',
    visaCategory: 'visa-on-arrival',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন সম্পূর্ণ ফ্রি',
    feeEstimate: 'Free of charge upon arrival',
    keyRequirements: ['Valid passport', 'Resort/hotel reservation', 'Return ticket', 'IMUGA Traveller Declaration (96h prior)'],
    keyRequirementsBn: ['ন্যূনতম ৬ মাসের বৈধ পাসপোর্ট', 'রিসোর্ট বা হোটেল বুকিং', 'রিটার্ন টিকিট', 'ভ্রমণের ৯৬ ঘণ্টার মধ্যে IMUGA অনলাইন ফর্ম'],
    notes: '30-day tourist visa granted free of cost upon arrival at Velana International Airport.',
    notesBn: 'ভেলে আন্তর্জাতিক বিমানবন্দরে পৌঁছানোর পর কোনো ফি ছাড়াই ৩০ দিনের জন্য ভিসা অন অ্যারাইভাল স্ট্যাম্প দেওয়া হয়।',
    documentsNeeded: ['Passport', 'Return flight confirmation', 'Pre-paid hotel voucher', 'IMUGA QR form submission']
  },
  'NP': {
    countryCode: 'NP',
    countryName: 'Nepal',
    countryNameBn: 'নেপাল',
    flagEmoji: '🇳🇵',
    capital: 'Kathmandu',
    region: 'South Asia',
    visaCategory: 'visa-on-arrival',
    stayDuration: '15 / 30 / 90 days',
    stayDurationBn: '১৫ / ৩০ / ৯০ দিন (প্রথম ৩০ দিন সার্ক নাগরিকদের জন্য বিনামূল্যে)',
    feeEstimate: 'First 30 days free per calendar year for SAARC nationals',
    keyRequirements: ['Passport with 6 months validity', 'Online arrival registration kiosk form', 'Passport photo'],
    keyRequirementsBn: ['৬ মাসের মেয়াদযুক্ত পাসপোর্ট', 'বিমানবন্দরের কিওস্ক বা অনলাইনে অ্যারাইভাল ফর্ম', 'পাসপোর্ট সাইজ ছবি'],
    notes: 'SAARC nationals from Bangladesh receive a free 30-day visa once every calendar year.',
    notesBn: 'সার্ক দেশভুক্ত নাগরিক হিসেবে বাংলাদেশী পাসপোর্টধারীরা বছরে প্রথম ভ্রমণের ৩০ দিন সম্পূর্ণ বিনামূল্যে ভিসা পেয়ে থাকেন।',
    documentsNeeded: ['Passport', 'Digital arrival form slip', 'Hotel booking', 'Return ticket']
  },
  'LK': {
    countryCode: 'LK',
    countryName: 'Sri Lanka',
    countryNameBn: 'শ্রীলঙ্কা',
    flagEmoji: '🇱🇰',
    capital: 'Colombo',
    region: 'South Asia',
    visaCategory: 'eta-evisa',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন',
    feeEstimate: 'USD 20-50 (depending on current tourism portal fee)',
    keyRequirements: ['ETA approval letter', 'Passport validity min 6 months', 'Return ticket'],
    keyRequirementsBn: ['ইটিএ বা ই-ভিসা কপি', 'পাসপোর্টের মেয়াদ ৬ মাস', 'রিটার্ন টিকিট'],
    notes: 'Apply online through official Sri Lanka ETA/eVisa portal before boarding.',
    notesBn: 'বিমানে ওঠার আগে শ্রীলঙ্কার অফিসিয়াল ইটিএ পোর্টালে আবেদন করে অনুমোদন নেওয়া বাধ্যতামূলক।',
    documentsNeeded: ['Approved ETA copy', 'Passport', 'Return ticket', 'Sufficient travel funds']
  },
  'TH': {
    countryCode: 'TH',
    countryName: 'Thailand',
    countryNameBn: 'থাইল্যান্ড',
    flagEmoji: '🇹🇭',
    capital: 'Bangkok',
    region: 'Southeast Asia',
    visaCategory: 'eta-evisa',
    stayDuration: '60 days (or advance Sticker/e-Visa)',
    stayDurationBn: '৬০ দিন পর্যন্ত (পূর্বে ই-ভিসা বা স্টিকার ভিসা আবশ্যক)',
    feeEstimate: 'Approx. BDT 5,000 - 6,000',
    keyRequirements: ['Confirmed flight tickets', 'Bank statement (min BDT 60,000/person)', 'Hotel vouchers'],
    keyRequirementsBn: ['কনফার্মড রিটার্ন টিকিট', 'ব্যাংক স্টেটমেন্ট (জনপ্রতি ন্যূনতম ৬০,০০০ টাকা)', 'হোটেল বুকিং', 'পাসপোর্টের কপি'],
    notes: 'Official Thai E-Visa portal or Royal Thai Embassy VFS Global service is used.',
    notesBn: 'থাইল্যান্ড ভ্রমণের পূর্বে ভিএফএস বা অফিসিয়াল থাই ই-ভিসা পোর্টাল থেকে ভিসা সম্পন্ন করতে হয়।',
    documentsNeeded: ['Valid Passport', '6 months Bank statement & Solvency', 'Passport photo 3.5x4.5cm', 'Job NOC or Trade License', 'Return flight itinerary']
  },
  'MY': {
    countryCode: 'MY',
    countryName: 'Malaysia',
    countryNameBn: 'মালয়েশিয়া',
    flagEmoji: '🇲🇾',
    capital: 'Kuala Lumpur',
    region: 'Southeast Asia',
    visaCategory: 'eta-evisa',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন',
    feeEstimate: 'Approx. MYR 105 (~ BDT 3,200)',
    keyRequirements: ['Approved eVisa slip', 'Digital Arrival Card (MDAC) filled 3 days prior', 'Hotel confirmation'],
    keyRequirementsBn: ['অনুমোদিত ই-ভিসা কপি', 'ভ্রমণের ৩ দিন পূর্বে MDAC ডিজিটাল অ্যারাইভাল কার্ড', 'হোটেল বুকিং ও রিটার্ন টিকেট'],
    notes: 'Online eVisa application is quick (usually approved in 48 hours). MDAC mandatory.',
    notesBn: 'অনলাইন মালয়েশিয়া ই-ভিসা খুব সহজে সাধারণত ৪৮ ঘণ্টার মধ্যে পাওয়া যায়। বিমানবন্দরে নামার আগে MDAC পূরণ নিশ্চিত করুন।',
    documentsNeeded: ['Original passport', 'MDAC confirmation', 'Printed eVisa', 'Proof of funds (cash or card)']
  },
  'SG': {
    countryCode: 'SG',
    countryName: 'Singapore',
    countryNameBn: 'সিঙ্গাপুর',
    flagEmoji: '🇸🇬',
    capital: 'Singapore',
    region: 'Southeast Asia',
    visaCategory: 'eta-evisa',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন',
    feeEstimate: 'SGD 30 + Authorized Agent Processing Fee',
    keyRequirements: ['Singapore SG Arrival Card (3 days prior)', 'Authorized agency eVisa submission', 'Bank statement'],
    keyRequirementsBn: ['এসজি অ্যারাইভাল কার্ড (SGAC)', 'অনুমোদিত এজেন্সির মাধ্যমে ই-ভিসা অনুমোদন', 'ব্যাংক স্টেটমেন্ট'],
    notes: 'e-Visa must be applied through Singapore ICA-authorized agents or local Singaporean sponsors.',
    notesBn: 'সিঙ্গাপুর ইমিগ্রেশন (ICA) অনুমোদিত ট্রাভেল এজেন্সির মাধ্যমে ই-ভিসা নিতে হয়।',
    documentsNeeded: ['Valid passport', 'Authorized eVisa printout', 'SG Arrival Card QR code', 'Hotel confirmation']
  },
  'AE': {
    countryCode: 'AE',
    countryName: 'United Arab Emirates (Dubai)',
    countryNameBn: 'সংযুক্ত আরব আমিরাত (দুবাই)',
    flagEmoji: '🇦🇪',
    capital: 'Abu Dhabi',
    region: 'Middle East',
    visaCategory: 'eta-evisa',
    stayDuration: '30 / 60 days',
    stayDurationBn: '৩০ বা ৬০ দিন',
    feeEstimate: 'Approx. AED 350 - 650 (~ BDT 11,000 - 20,000)',
    keyRequirements: ['Passport bio page', 'White background photo', 'Flight booking confirmation'],
    keyRequirementsBn: ['পাসপোর্টের বায়ো পেজ কপি', 'সাদা ব্যাকগ্রাউন্ডের ছবি', 'রিটার্ন এয়ার টিকিট'],
    notes: 'e-Visa can be issued via airlines (Emirates/Flydubai/Air Arabia) or registered travel agents.',
    notesBn: 'এমিরেটস, ফ্লাইদুবাই বা এয়ার এরাবিয়া এয়ারলাইন্স অথবা অনুমোদিত ট্রাভেল এজেন্সির মাধ্যমে খুব সহজে ই-ভিসা পাওয়া যায়।',
    documentsNeeded: ['Color copy of Passport', 'Recent passport photograph', 'Approved e-Visa PDF', 'Confirmed return ticket']
  },
  'QA': {
    countryCode: 'QA',
    countryName: 'Qatar',
    countryNameBn: 'কাতার',
    flagEmoji: '🇶🇦',
    capital: 'Doha',
    region: 'Middle East',
    visaCategory: 'visa-on-arrival',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন',
    feeEstimate: 'Free of charge',
    keyRequirements: ['Valid passport min 6 months', 'Discover Qatar confirmed hotel booking', 'Return ticket', 'Valid credit card'],
    keyRequirementsBn: ['ন্যূনতম ৬ মাসের পাসপোর্ট', 'ডিসকভার কাতার অনুমোদিত হোটেল বুকিং', 'রিটার্ন ফ্লাইট টিকিট', 'বৈধ ক্রেডিট/ডেবিট কার্ড'],
    notes: 'Hotel booking MUST be booked exclusively through the official Discover Qatar portal to get VoA.',
    notesBn: 'ভিসা অন অ্যারাইভাল পেতে অবশ্যই ডিসকভার কাতার ওয়েবসাইট থেকে হোটেল বুকিং থাকতে হবে।',
    documentsNeeded: ['Passport', 'Discover Qatar Hotel voucher', 'Return airline ticket', 'Mandatory travel health insurance']
  },
  'SA': {
    countryCode: 'SA',
    countryName: 'Saudi Arabia',
    countryNameBn: 'সৌদি আরব',
    flagEmoji: '🇸🇦',
    capital: 'Riyadh',
    region: 'Middle East',
    visaCategory: 'eta-evisa',
    stayDuration: '90 days (Umrah / Tourist / Visit)',
    stayDurationBn: '৯০ দিন (উমরাহ / পর্যটন / ট্রানজিট)',
    feeEstimate: 'Approx. SAR 390 - 535 (~ BDT 12,000 - 17,000)',
    keyRequirements: ['Nusuk portal / eVisa platform approval', 'Passport valid 6 months', 'Medical insurance included'],
    keyRequirementsBn: ['নুসুক (Nusuk) অ্যাপ বা সৌদি ভিসা প্ল্যাটফর্মে আবেদন', '৬ মাসের মেয়াদযুক্ত পাসপোর্ট', 'ভিসা ফিতে মেডিকেল ইন্স্যুরেন্স অন্তর্ভুক্ত'],
    notes: 'Holders of valid US, UK, or Schengen visas can also get instant Visa on Arrival in Saudi Arabia.',
    notesBn: 'ইউএসএ, ইউকে বা শেনজেন ভিসা ব্যবহার করা থাকলে সৌদি বিমানবন্দরে সরাসরি ভিসা অন অ্যারাইভাল পাওয়া যায়। অথবা নুসুক অ্যাপে উমরাহ ভিসা নেওয়া যায়।',
    documentsNeeded: ['Passport copy', 'Approved eVisa printout', 'Return ticket', 'Nusuk appointment QR code for Umrah']
  },
  'TR': {
    countryCode: 'TR',
    countryName: 'Turkey',
    countryNameBn: 'তুরস্ক',
    flagEmoji: '🇹🇷',
    capital: 'Ankara',
    region: 'Europe/Asia',
    visaCategory: 'eta-evisa',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন (শেনজেন/ইউএস/ইউকে ভিসা থাকলে তাৎক্ষণিক ই-ভিসা)',
    feeEstimate: 'USD 50 for conditional eVisa, or regular sticker visa fee',
    keyRequirements: ['Supporting document (valid US/UK/Schengen/Ireland visa or residence permit)', 'Passport min 6 months'],
    keyRequirementsBn: ['সহায়ক শর্ত: বৈধ ইউএস/ইউকে/শেনজেন ভিসা অথবা সরাসরি তুর্কি স্টিকার ভিসা আবেদন'],
    notes: 'Bangladeshis with a valid visa from OECD/Schengen/USA/UK qualify for instant online e-Visa via evisa.gov.tr.',
    notesBn: 'যাদের বৈধ শেনজেন, ইউএস বা ইউকে ভিসা আছে তারা সাথে সাথে অনলাইনে তুর্কি ই-ভিসা নিতে পারেন। অন্যদের স্টিকার ভিসা আবেদন করতে হয়।',
    documentsNeeded: ['Original passport', 'Supporting visa copy or sticker visa submission', 'Hotel reservation', 'Return ticket']
  },
  'GB': {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    countryNameBn: 'যুক্তরাজ্য (UK)',
    flagEmoji: '🇬🇧',
    capital: 'London',
    region: 'Europe',
    visaCategory: 'visa-required',
    stayDuration: 'Up to 6 months (Standard Visitor)',
    stayDurationBn: 'সর্বোচ্চ ৬ মাস (স্ট্যান্ডার্ড ভিজিটর)',
    feeEstimate: 'GBP 115 (~ BDT 18,000)',
    keyRequirements: ['Online GOV.UK application', 'VFS Global biometrics appointment', '6 months bank statement', 'Proof of employment & leave'],
    keyRequirementsBn: ['GOV.UK অনলাইনে আবেদন', 'ভিএফএস গ্লোবালে বায়োমেট্রিক ও পাসপোর্ট জমা', '৬ মাসের ব্যাংক স্টেটমেন্ট', 'কর্মসংস্থান ও আয়ের প্রমাণপত্র'],
    notes: 'Strict financial criteria and documentation required prior to travel.',
    notesBn: 'ভ্রমণের আগে বিস্তারিত আর্থিক স্বচ্ছলতার প্রমাণ এবং ছুটির অনুমোদনসহ ভিএফএস এর মাধ্যমে আবেদন আবশ্যক।',
    documentsNeeded: ['Current Passport & previous passports', 'Bank statements (6 months)', 'Employment letter / NOC', 'Tax returns', 'Travel itinerary']
  },
  'US': {
    countryCode: 'US',
    countryName: 'United States',
    countryNameBn: 'যুক্তরাষ্ট্র (USA)',
    flagEmoji: '🇺🇸',
    capital: 'Washington, D.C.',
    region: 'North America',
    visaCategory: 'visa-required',
    stayDuration: 'Up to 6 months per entry (B1/B2)',
    stayDurationBn: 'সাধারণত প্রতি এন্ট্রিতে সর্বোচ্চ ৬ মাস',
    feeEstimate: 'USD 185 (~ BDT 22,000)',
    keyRequirements: ['DS-160 online form', 'In-person Embassy interview in Dhaka', 'Strong financial & family ties to Bangladesh'],
    keyRequirementsBn: ['DS-160 অনলাইন ফর্ম পূরণ', 'ঢাকাস্থ মার্কিন দূতাবাসে সশরীরে ইন্টারভিউ', 'দেশে ফেরার পারিবারিক ও ব্যবসায়িক সম্পর্কের প্রমাণ'],
    notes: 'Interview appointment booking required through official US travel docs portal.',
    notesBn: 'দূতাবাসে ইন্টারভিউয়ের মাধ্যমে ভিসা অনুমোদন নিতে হয়।',
    documentsNeeded: ['Valid Passport', 'DS-160 Confirmation Page', 'Interview Appointment Letter', 'Financial & Property documents']
  },
  'CA': {
    countryCode: 'CA',
    countryName: 'Canada',
    countryNameBn: 'কানাডা',
    flagEmoji: '🇨🇦',
    capital: 'Ottawa',
    region: 'North America',
    visaCategory: 'visa-required',
    stayDuration: 'Up to 6 months per visit (Temporary Resident Visa)',
    stayDurationBn: 'সর্বোচ্চ ৬ মাস',
    feeEstimate: 'CAD 100 + CAD 85 Biometrics (~ BDT 16,000)',
    keyRequirements: ['IRCC online portal application', 'VFS biometrics collection', 'Proof of funds', 'Ties to home country'],
    keyRequirementsBn: ['IRCC পোর্টালে অনলাইন আবেদন', 'ভিএফএস এ বায়োমেট্রিক প্রদান', 'ব্যাংক স্টেটমেন্ট ও তহবিল প্রমাণ', 'দেশে প্রত্যাবর্তনের প্রমাণ'],
    notes: 'Processed through IRCC Canada portal. Valid for up to 10 years or until passport expiry.',
    notesBn: 'কানাডা ইমিগ্রেশনের অনলাইন পোর্টালে আবেদন করে বায়োমেট্রিক দিতে হয়।',
    documentsNeeded: ['Passport', 'Financial records', 'Detailed travel plan', 'Family ties documents']
  },
  'VU': {
    countryCode: 'VU',
    countryName: 'Vanuatu',
    countryNameBn: 'ভানুয়াতু',
    flagEmoji: '🇻🇺',
    capital: 'Port Vila',
    region: 'Oceania',
    visaCategory: 'visa-free',
    stayDuration: '30 days',
    stayDurationBn: '৩০ দিন সম্পূর্ণ ফ্রি',
    feeEstimate: 'Free of charge',
    keyRequirements: ['Passport with 6 months validity', 'Return ticket', 'Proof of sufficient funds'],
    keyRequirementsBn: ['৬ মাসের পাসপোর্ট', 'রিটার্ন বিমান টিকিট', 'পর্যাপ্ত ব্যয়ের সামর্থ্য'],
    notes: 'Visa-free entry for Bangladeshi travelers for tourism purposes.',
    notesBn: 'বাংলাদেশী নাগরিকদের জন্য সম্পূর্ণ ভিসা-মুক্ত দ্বীপ রাষ্ট্র।',
    documentsNeeded: ['Passport', 'Return ticket', 'Hotel booking voucher']
  },
  'FJ': {
    countryCode: 'FJ',
    countryName: 'Fiji',
    countryNameBn: 'ফিজি',
    flagEmoji: '🇫🇯',
    capital: 'Suva',
    region: 'Oceania',
    visaCategory: 'visa-free',
    stayDuration: '120 days (4 months)',
    stayDurationBn: '১২০ দিন (৪ মাস পর্যন্ত)',
    feeEstimate: 'Free of charge on arrival',
    keyRequirements: ['Passport with 6 months validity', 'Return air ticket', 'Confirmed hotel reservation'],
    keyRequirementsBn: ['৬ মাসের মেয়াদযুক্ত পাসপোর্ট', 'ফেরার টিকিট', 'কনফার্মড হোটেল বুকিং'],
    notes: 'Visitors permit issued automatically on arrival for up to 4 months.',
    notesBn: 'ফিজি বিমানবন্দরে নামার সাথে সাথে ৪ মাসের ভিজিটর পারমিট কোনো ফি ছাড়াই দেওয়া হয়।',
    documentsNeeded: ['Valid Passport', 'Confirmed return ticket', 'Proof of accommodation']
  },
  'KE': {
    countryCode: 'KE',
    countryName: 'Kenya',
    countryNameBn: 'কেনিয়া',
    flagEmoji: '🇰🇪',
    capital: 'Nairobi',
    region: 'Africa',
    visaCategory: 'eta-evisa',
    stayDuration: '90 days',
    stayDurationBn: '৯০ দিন',
    feeEstimate: 'USD 30 (Electronic Travel Authorisation - ETA)',
    keyRequirements: ['Approved Kenya ETA letter', 'Valid passport', 'Yellow fever vaccination card if applicable'],
    keyRequirementsBn: ['অনলাইন কেনিয়া ইটিএ অনুমোদন', 'বৈধ পাসপোর্ট', 'প্রয়োজনে ইয়েলো ফিভার ভ্যাকসিন কার্ড'],
    notes: 'Kenya has replaced traditional visas with the digital ETA system.',
    notesBn: 'কেনিয়া সম্পূর্ণ ভিসা পদ্ধতি তুলে দিয়ে ডিজিটাল ইটিএ (ETA) চালু করেছে।',
    documentsNeeded: ['Passport copy', 'Kenya ETA approval letter', 'Hotel booking', 'Return flight']
  },
  'IN': {
    countryCode: 'IN',
    countryName: 'India',
    countryNameBn: 'ভারত',
    flagEmoji: '🇮🇳',
    capital: 'New Delhi',
    region: 'South Asia',
    visaCategory: 'visa-required',
    stayDuration: 'Up to 1 year multiple entry (Tourist/Medical)',
    stayDurationBn: 'সাধারণত ১ বছর মাল্টিপল এন্ট্রি',
    feeEstimate: 'BDT 800 (IVAC Processing fee)',
    keyRequirements: ['Online IVAC application form', 'Utility bill for address proof', 'Bank statement (min BDT 20,000) or Dollar endorsement', 'Active profession proof'],
    keyRequirementsBn: ['অনলাইন IVAC ফর্ম', 'ঠিকানার প্রমাণ হিসেবে ইউটিলিটি বিল', 'ব্যাংক স্টেটমেন্ট বা ১৫০ ডলার এনডোর্সমেন্ট', 'পেশাগত আইডি বা ট্রেড লাইসেন্স'],
    notes: 'Apply online and submit passport to nearest IVAC center in Bangladesh.',
    notesBn: 'অনলাইনে ফর্ম পূরণ করে নিকটস্থ আইভ্যাক (IVAC) সেন্টারে পাসপোর্ট জমা দিতে হয়।',
    documentsNeeded: ['Original passport & previous passports', 'IVAC Form printout', 'Utility bill', 'Bank statement or Endorsement', 'Company NOC/Student ID']
  },
  'VN': {
    countryCode: 'VN',
    countryName: 'Vietnam',
    countryNameBn: 'ভিয়েতনাম',
    flagEmoji: '🇻🇳',
    capital: 'Hanoi',
    region: 'Southeast Asia',
    visaCategory: 'eta-evisa',
    stayDuration: '30 / 90 days',
    stayDurationBn: '৩০ বা ৯০ দিন (একক বা একাধিক প্রবেশ)',
    feeEstimate: 'USD 25 - 50',
    keyRequirements: ['Official Vietnam Immigration e-Visa portal application', 'Passport valid 6 months', 'Portrait photo'],
    keyRequirementsBn: ['অফিসিয়াল ভিয়েতনাম ই-ভিসা পোর্টালে আবেদন', '৬ মাসের পাসপোর্ট', 'পাসপোর্ট সাইজ ছবি'],
    notes: 'Available online directly for Bangladeshi citizens via Vietnam National Web Portal on Immigration.',
    notesBn: 'অফিসিয়াল সরকারি ওয়েবসাইটে আবেদন করে ৩ কর্মদিবসের মধ্যে পিডিএফ ই-ভিসা সংগ্রহ করা যায়।',
    documentsNeeded: ['Passport scan', 'Digital photo', 'Printed eVisa approval', 'Return ticket']
  }
};

// Populate destination image links
Object.entries(DESTINATION_PHOTOS).forEach(([code, url]) => {
  if (BANGLADESH_PASSPORT_VISA_DB[code]) {
    BANGLADESH_PASSPORT_VISA_DB[code].destinationImage = url;
  }
});

export const AIRLINE_DATABASE: Record<string, { name: string; country: string; flag: string }> = {
  'BG': { name: 'Biman Bangladesh Airlines', country: 'Bangladesh', flag: '🇧🇩' },
  'BBC': { name: 'Biman Bangladesh Airlines', country: 'Bangladesh', flag: '🇧🇩' },
  'BS': { name: 'US-Bangla Airlines', country: 'Bangladesh', flag: '🇧🇩' },
  'UBG': { name: 'US-Bangla Airlines', country: 'Bangladesh', flag: '🇧🇩' },
  'VQ': { name: 'Novoair', country: 'Bangladesh', flag: '🇧🇩' },
  'NVQ': { name: 'Novoair', country: 'Bangladesh', flag: '🇧🇩' },
  'EK': { name: 'Emirates', country: 'United Arab Emirates', flag: '🇦🇪' },
  'UAE': { name: 'Emirates', country: 'United Arab Emirates', flag: '🇦🇪' },
  'QR': { name: 'Qatar Airways', country: 'Qatar', flag: '🇶🇦' },
  'QTR': { name: 'Qatar Airways', country: 'Qatar', flag: '🇶🇦' },
  'TG': { name: 'Thai Airways', country: 'Thailand', flag: '🇹🇭' },
  'THA': { name: 'Thai Airways', country: 'Thailand', flag: '🇹🇭' },
  'MH': { name: 'Malaysia Airlines', country: 'Malaysia', flag: '🇲🇾' },
  'MAS': { name: 'Malaysia Airlines', country: 'Malaysia', flag: '🇲🇾' },
  'SQ': { name: 'Singapore Airlines', country: 'Singapore', flag: '🇸🇬' },
  'SIA': { name: 'Singapore Airlines', country: 'Singapore', flag: '🇸🇬' },
  'SV': { name: 'Saudia', country: 'Saudi Arabia', flag: '🇸🇦' },
  'SVA': { name: 'Saudia', country: 'Saudi Arabia', flag: '🇸🇦' },
  'AI': { name: 'Air India', country: 'India', flag: '🇮🇳' },
  'AIC': { name: 'Air India', country: 'India', flag: '🇮🇳' },
  '6E': { name: 'IndiGo', country: 'India', flag: '🇮🇳' },
  'IGO': { name: 'IndiGo', country: 'India', flag: '🇮🇳' },
  'FZ': { name: 'flydubai', country: 'United Arab Emirates', flag: '🇦🇪' },
  'FDB': { name: 'flydubai', country: 'United Arab Emirates', flag: '🇦🇪' },
  'TK': { name: 'Turkish Airlines', country: 'Turkey', flag: '🇹🇷' },
  'THY': { name: 'Turkish Airlines', country: 'Turkey', flag: '🇹🇷' },
  'BA': { name: 'British Airways', country: 'United Kingdom', flag: '🇬🇧' },
  'BAW': { name: 'British Airways', country: 'United Kingdom', flag: '🇬🇧' }
};

export const COMMON_FLIGHT_ROUTES = [
  { callsignPrefix: 'BBC047', flight: 'BG-047', airline: 'Biman Bangladesh', from: 'DAC', fromCity: 'Dhaka', to: 'BKK', toCity: 'Bangkok', toCountry: 'Thailand', toCode: 'TH' },
  { callsignPrefix: 'BBC339', flight: 'BG-339', airline: 'Biman Bangladesh', from: 'DAC', fromCity: 'Dhaka', to: 'KUL', toCity: 'Kuala Lumpur', toCountry: 'Malaysia', toCode: 'MY' },
  { callsignPrefix: 'BBC049', flight: 'BG-049', airline: 'Biman Bangladesh', from: 'DAC', fromCity: 'Dhaka', to: 'DXB', toCity: 'Dubai', toCountry: 'United Arab Emirates', toCode: 'AE' },
  { callsignPrefix: 'BBC201', flight: 'BG-201', airline: 'Biman Bangladesh', from: 'DAC', fromCity: 'Dhaka', to: 'LHR', toCity: 'London', toCountry: 'United Kingdom', toCode: 'GB' },
  { callsignPrefix: 'BBC039', flight: 'BG-039', airline: 'Biman Bangladesh', from: 'DAC', fromCity: 'Dhaka', to: 'JED', toCity: 'Jeddah', toCountry: 'Saudi Arabia', toCode: 'SA' },
  { callsignPrefix: 'BBC071', flight: 'BG-071', airline: 'Biman Bangladesh', from: 'DAC', fromCity: 'Dhaka', to: 'KTM', toCity: 'Kathmandu', toCountry: 'Nepal', toCode: 'NP' },
  { callsignPrefix: 'UBG213', flight: 'BS-213', airline: 'US-Bangla', from: 'DAC', fromCity: 'Dhaka', to: 'BKK', toCity: 'Bangkok', toCountry: 'Thailand', toCode: 'TH' },
  { callsignPrefix: 'UBG315', flight: 'BS-315', airline: 'US-Bangla', from: 'DAC', fromCity: 'Dhaka', to: 'SIN', toCity: 'Singapore', toCountry: 'Singapore', toCode: 'SG' },
  { callsignPrefix: 'UBG337', flight: 'BS-337', airline: 'US-Bangla', from: 'DAC', fromCity: 'Dhaka', to: 'MLE', toCity: 'Malé', toCountry: 'Maldives', toCode: 'MV' },
  { callsignPrefix: 'UAE583', flight: 'EK-583', airline: 'Emirates', from: 'DAC', fromCity: 'Dhaka', to: 'DXB', toCity: 'Dubai', toCountry: 'United Arab Emirates', toCode: 'AE' },
  { callsignPrefix: 'QTR639', flight: 'QR-639', airline: 'Qatar Airways', from: 'DAC', fromCity: 'Dhaka', to: 'DOH', toCity: 'Doha', toCountry: 'Qatar', toCode: 'QA' },
  { callsignPrefix: 'SIA433', flight: 'SQ-433', airline: 'Singapore Airlines', from: 'DAC', fromCity: 'Dhaka', to: 'SIN', toCity: 'Singapore', toCountry: 'Singapore', toCode: 'SG' },
  { callsignPrefix: 'MAS197', flight: 'MH-197', airline: 'Malaysia Airlines', from: 'DAC', fromCity: 'Dhaka', to: 'KUL', toCity: 'Kuala Lumpur', toCountry: 'Malaysia', toCode: 'MY' },
  { callsignPrefix: 'THA322', flight: 'TG-322', airline: 'Thai Airways', from: 'DAC', fromCity: 'Dhaka', to: 'BKK', toCity: 'Bangkok', toCountry: 'Thailand', toCode: 'TH' },
  { callsignPrefix: 'THY723', flight: 'TK-723', airline: 'Turkish Airlines', from: 'DAC', fromCity: 'Dhaka', to: 'IST', toCity: 'Istanbul', toCountry: 'Turkey', toCode: 'TR' },
  { callsignPrefix: 'AIC238', flight: 'AI-238', airline: 'Air India', from: 'DAC', fromCity: 'Dhaka', to: 'DEL', toCity: 'New Delhi', toCountry: 'India', toCode: 'IN' },
  { callsignPrefix: 'IGO1934', flight: '6E-1934', airline: 'IndiGo', from: 'DAC', fromCity: 'Dhaka', to: 'CCU', toCity: 'Kolkata', toCountry: 'India', toCode: 'IN' },
];
