export interface AirportLounge {
  id: string;
  name: string;
  terminal: string;
  location: string;
  operatingHours: string;
  accessEligibility: string[];
  eligibleCardsBn: string[];
  amenitiesBn: string[];
  hasShower: boolean;
  hasBuffet: boolean;
  hasPrayerRoom: boolean;
  notesBn?: string;
}

export interface AirportTerminal {
  id: string;
  name: string;
  nameBn: string;
  descriptionBn: string;
  airlineUsageBn: string;
  gateRange: string;
  levels: {
    levelNameBn: string;
    facilitiesBn: string[];
  }[];
  checkInCounters: string;
  baggageBelts: string;
  isNewTerminal?: boolean;
}

export interface AirportService {
  category: 'sim' | 'exchange' | 'transport' | 'wrap' | 'prayer' | 'medical';
  categoryLabelBn: string;
  nameBn: string;
  locationBn: string;
  detailsBn: string;
}

export interface AirportHub {
  iata: string;
  icao: string;
  name: string;
  nameBn: string;
  city: string;
  country: string;
  flagEmoji: string;
  terminals: AirportTerminal[];
  lounges: AirportLounge[];
  departureStepsBn: {
    stepNo: number;
    titleBn: string;
    descriptionBn: string;
    recommendedTimeBeforeFlight: string;
  }[];
  arrivalStepsBn: {
    stepNo: number;
    titleBn: string;
    descriptionBn: string;
  }[];
  services: AirportService[];
  groundTransportBn: {
    typeBn: string;
    costEstimateBn: string;
    locationBn: string;
    tipsBn: string;
  }[];
}

export const AIRPORT_HUBS_DB: Record<string, AirportHub> = {
  DAC: {
    iata: 'DAC',
    icao: 'VGHS',
    name: 'Hazrat Shahjalal International Airport',
    nameBn: 'হযরত শাহজালাল আন্তর্জাতিক বিমানবন্দর, ঢাকা',
    city: 'ঢাকা (Dhaka)',
    country: 'বাংলাদেশ (Bangladesh)',
    flagEmoji: '🇧🇩',
    terminals: [
      {
        id: 'T1',
        name: 'Terminal 1 (International)',
        nameBn: 'টার্মিনাল ১ (আন্তর্জাতিক ডিপার্চার ও অ্যারাইভাল)',
        descriptionBn: 'প্রধান আন্তর্জাতিক প্রস্থান ও আগমন টার্মিনাল। বিমান বাংলাদেশ, এমিরাতস, কাতার এয়ারওয়েজ ও আন্তর্জাতিক ফ্লাইট পরিচালিত হয়।',
        airlineUsageBn: 'Biman Bangladesh Airlines, Saudia, Qatar Airways, Emirates, flydubai',
        gateRange: 'Gates 1 – 8',
        checkInCounters: 'রো A থেকে D (গ্রাউন্ড ফ্লোর)',
        baggageBelts: 'বেল্ট ১ – ৪ (নিচতলা আগমন হল)',
        levels: [
          { levelNameBn: 'গ্রাউন্ড ফ্লোর (Ground Floor)', facilitiesBn: ['চেক-ইন কাউন্টার A-D', 'আন্তর্জাতিক অ্যারাইভাল হল', 'লাগেজ বেল্ট ১-৪', 'সিম কার্ড বুথ', 'কাস্টমস গ্রিন চ্যানেল'] },
          { levelNameBn: 'দ্বিতীয় তলা (2nd Floor)', facilitiesBn: ['ইমিগ্রেশন কাউন্টার', 'বোর্ডিং সিকিউরিটি স্ক্যানার', 'বলাকা এক্সিকিউটিভ লাউঞ্জ', 'ইবিএল স্কাইলাউঞ্জ', 'ডিউটি ফ্রি শপ', 'বোর্ডিং গেট ১-৮'] },
        ]
      },
      {
        id: 'T2',
        name: 'Terminal 2 (International)',
        nameBn: 'টার্মিনাল ২ (আন্তর্জাতিক ডিপার্চার)',
        descriptionBn: 'আঞ্চলিক ও আন্তর্জাতিক ক্যারিয়ার যেমন ইন্ডিগো, এয়ার এরাবিয়া, এয়ার এশিয়া, কুয়েত এয়ারওয়েজ ইত্যাদি ব্যবহৃত হয়।',
        airlineUsageBn: 'IndiGo, AirAsia, Air Arabia, Kuwait Airways, Singapore Airlines, Thai Airways',
        gateRange: 'Gates 9 – 16',
        checkInCounters: 'রো E থেকে H',
        baggageBelts: 'বেল্ট ৫ – ৮',
        levels: [
          { levelNameBn: 'গ্রাউন্ড ফ্লোর', facilitiesBn: ['যাত্রী চেক-ইন রো E-H', 'আন্তর্জাতিক অ্যারাইভাল এক্সিট ও ট্যাক্সি বুথ'] },
          { levelNameBn: 'দ্বিতীয় তলা', facilitiesBn: ['আন্তর্জাতিক ডিপার্চার ইমিগ্রেশন', 'সিটি ব্যাংক অ্যামেক্স লাউঞ্জ', 'এমটিবি এয়ার লাউঞ্জ', 'বোর্ডিং গেট ৯-১৬'] },
        ]
      },
      {
        id: 'T3',
        name: 'Terminal 3 (Flagship Mega Terminal)',
        nameBn: 'টার্মিনাল ৩ (আধুনিক মেগা টার্মিনাল - আংশিক চালু/প্রস্তুতি)',
        descriptionBn: 'সর্বাধুনিক আন্তর্জাতিক মেগা টার্মিনাল। স্বয়ংক্রিয় সেলফ চেক-ইন, বায়োমেট্রিক ই-গেট, ৩৭টি ইমিগ্রেশন বুথ এবং বিশ্বমানের কনকোর্স বিশিষ্ট।',
        airlineUsageBn: 'প্রধান আন্তর্জাতিক ফ্ল্যাগশিপ এয়ারলাইন্স ও প্রশস্ত কনকোর্স',
        gateRange: 'Gates 20 – 46 (১২টি নতুন বোর্ডিং ব্রিজ)',
        checkInCounters: '১১৫টি চেক-ইন কাউন্টার (১৫টি সেলফ সার্ভিস কিয়স্কসহ)',
        baggageBelts: '১৬টি হাই-স্পিড কারোসেল বেল্ট',
        isNewTerminal: true,
        levels: [
          { levelNameBn: 'লেভেল ১ (Arrival)', facilitiesBn: ['১৬টি ব্যাগেজ কারোসেল', 'অ্যারাইভাল ডিউটি-ফ্রি মেগামল', 'ই-গেট অ্যারাইভাল ইমিগ্রেশন'] },
          { levelNameBn: 'লেভেল ২ (Departure)', facilitiesBn: ['সেলফ চেক-ইন কিয়স্ক', 'স্মার্ট বায়োমেট্রিক সিকিউরিটি', 'আন্তর্জাতিক বিজনেস ও ফার্স্ট ক্লাস লাউঞ্জ প্লাজা', '১২টি ওয়াইডবডি বোর্ডিং ব্রিজ'] },
          { levelNameBn: 'লেভেল ৩ (Transit & Lounges)', facilitiesBn: ['আন্তর্জাতিক ট্রানজিট হোটেল', 'ভিআইপি ও সিআইপি লাউঞ্জ', 'গ্লোবাল ডাইনিং ফুডকোর্ট'] },
        ]
      },
      {
        id: 'DOM',
        name: 'Domestic Terminal',
        nameBn: 'অভ্যন্তরীণ টার্মিনাল (Domestic)',
        descriptionBn: 'কক্সবাজার, চট্টগ্রাম, সিলেট, যশোর, রাজশাহী, সৈয়দপুর ও বরিশালের অভ্যন্তরীণ রুটের ফ্লাইট।',
        airlineUsageBn: 'Biman Domestic, US-Bangla Airlines, Air Astra, Novoair',
        gateRange: 'Gates D1 – D4',
        checkInCounters: 'কাউন্টার ১ – ১২',
        baggageBelts: 'বেল্ট ১ ও ২',
        levels: [
          { levelNameBn: 'একক ফ্লোর', facilitiesBn: ['ডোমেস্টিক চেক-ইন', 'সিকিউরিটি গেট', 'ওয়েটিং লাউঞ্জ', 'লাগেজ বেল্ট', 'উবার ও সিএনজি পয়েন্ট'] }
        ]
      }
    ],
    lounges: [
      {
        id: 'dac-balaka',
        name: 'Balaka Executive Lounge',
        terminal: 'Terminal 1',
        location: '২য় তলা, সিকিউরিটি ও ইমিগ্রেশন অতিক্রম করার পর (Airside)',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['Priority Pass', 'LoungeKey', 'DragonPass', 'First / Business Class'],
        eligibleCardsBn: [
          'Mastercard World / Titanium (Brac, City, EBL, SCB)',
          'Visa Signature / Infinite',
          'Priority Pass সদস্যপদ'
        ],
        amenitiesBn: ['আনলিমিটেড গরম খাবার ও বুফে', 'হাই-স্পিড ওয়াইফাই', 'শাওয়ার সুবিধা', 'নামাজের কক্ষ', 'ফ্লাইট ডিসপ্লে মনিটর'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: true,
        notesBn: 'ফ্লাইটের সর্বোচ্চ ৩ ঘণ্টা আগে প্রবেশ করা যায়। সাথে ১ জন অতিথি অনুমোদিত কার্ডভেদে ফ্রি হতে পারে।'
      },
      {
        id: 'dac-ebl',
        name: 'EBL Skylounge',
        terminal: 'Terminal 1 & Terminal 2',
        location: '২য় তলা, বোর্ডিং গেট সংলগ্ন',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['EBL Visa Signature', 'EBL Mastercard World', 'EBL Priority'],
        eligibleCardsBn: ['ইস্টার্ন ব্যাংক লিমিটেড (EBL) প্রিমিয়াম ক্রেডিট কার্ড ধারীগণ'],
        amenitiesBn: ['রিফ্রেশমেন্ট বুফে', 'লাক্সারি সোফা বসার ব্যবস্থা', 'ওয়ার্কস্টেশন ও ওয়াইফাই', 'মোবাইল চার্জিং হাব'],
        hasShower: false,
        hasBuffet: true,
        hasPrayerRoom: true,
        notesBn: 'ইবিএল প্রাইওরিটি ও সিগনেচার কার্ডে বিনামূল্যে পরিবারের সদস্যদের সাথে প্রবেশের সুযোগ থাকে।'
      },
      {
        id: 'dac-city-amex',
        name: 'City Bank American Express Lounge',
        terminal: 'Terminal 2',
        location: '২য় তলা, ডিপার্চার কনকোর্স',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['City Bank Amex Platinum Credit Card', 'City Bank Amex Gold'],
        eligibleCardsBn: ['সিটি ব্যাংক আমেরিকান এক্সপ্রেস প্ল্যাটিনাম / গোল্ড ক্রেডিট কার্ড'],
        amenitiesBn: ['গুরমে হট বুফে', 'প্রিমিয়াম কফি লাউঞ্জ', 'শান্ত রিলাক্সেশন জোন', 'ওয়াইফাই ও সংবাদ সাময়িকী'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: true,
        notesBn: 'সিটি ব্যাংক অ্যামেক্স কার্ডের জন্য নির্ধারিত অগ্রাধিকার কাউন্টার ও লাউঞ্জ সার্ভিস।'
      },
      {
        id: 'dac-mtb',
        name: 'MTB Air Lounge',
        terminal: 'Terminal 2',
        location: '২য় তলা, ইন্টারন্যাশনাল ডিপার্চার জোন',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['MTB Visa Signature', 'MTB World Mastercard'],
        eligibleCardsBn: ['মিউচুয়াল ট্রাস্ট ব্যাংক (MTB) প্ল্যাটিনাম ও সিগনেচার কার্ড'],
        amenitiesBn: ['বুফে রিফ্রেশমেন্ট', 'ফ্রি ওয়াইফাই', 'কমফোর্ট লাউঞ্জার', 'নামাজের স্থান'],
        hasShower: false,
        hasBuffet: true,
        hasPrayerRoom: true,
      },
      {
        id: 'dac-biman-maslin',
        name: 'Biman Maslin Business Lounge',
        terminal: 'Terminal 1',
        location: '২য় তলা, এয়ারসাইড এরিয়া',
        operatingHours: '২৪ ঘণ্টা খোলা (বিমান বাংলাদেশ ফ্লাইটের সময়)',
        accessEligibility: ['Biman Business Class', 'Biman Loyalty Gold'],
        eligibleCardsBn: ['বিমান বাংলাদেশ এয়ারলাইন্সের বিজনেস ক্লাস টিকিটধারী'],
        amenitiesBn: ['ঐতিহ্যবাহী বাংলাদেশি ও আন্তর্জাতিক খাবার', 'আরামদায়ক রিক্লাইনার', 'ফ্রি ওয়াইফাই'],
        hasShower: false,
        hasBuffet: true,
        hasPrayerRoom: true,
      }
    ],
    departureStepsBn: [
      {
        stepNo: 1,
        titleBn: 'বিমানবন্দরে পৌঁছানো ও কনকোর্স এন্ট্রি',
        descriptionBn: 'আন্তর্জাতিক ফ্লাইটের জন্য ফ্লাইট ছাড়ার অন্তত ৩ ঘণ্টা আগে টার্মিনাল ১ বা ২-এর ডিপার্চার গেটে পৌঁছান। টিকিট ও পাসপোর্ট দেখিয়ে ভেতরে প্রবেশ করুন।',
        recommendedTimeBeforeFlight: '৩ ঘণ্টা আগে'
      },
      {
        stepNo: 2,
        titleBn: 'প্রাথমিক লাগেজ সিকিউরিটি স্ক্যান',
        descriptionBn: 'টার্মিনাল প্রবেশমুখে বড় লাগেজ এক্স-রে মেশিনে স্ক্যান করান এবং স্ক্যান স্টিকার নিশ্চিত করুন।',
        recommendedTimeBeforeFlight: '২ ঘণ্টা ৪৫ মি. আগে'
      },
      {
        stepNo: 3,
        titleBn: 'এয়ারলাইন্স চেক-ইন ও বোর্ডিং পাস সংগ্রহ',
        descriptionBn: 'আপনার এয়ারলাইন্সের নির্ধারিত কাউন্টারে গিয়ে পাসপোর্ট ও ভিসা দেখিয়ে বোর্ডিং পাস ও লাগেজ ট্যাগ সংগ্রহ করুন।',
        recommendedTimeBeforeFlight: '২ ঘণ্টা ১৫ মি. আগে'
      },
      {
        stepNo: 4,
        titleBn: 'আন্তর্জাতিক ইমিগ্রেশন ও সিল সংগ্রহ',
        descriptionBn: 'দ্বিতীয় তলায় ইমিগ্রেশন কাউন্টারে পাসপোর্ট, বোর্ডিং পাস ও ভিসা প্রদর্শন করুন। বাংলাদেশি ই-পাসপোর্টধারীরা স্বয়ংক্রিয় ই-গেট ব্যবহার করতে পারেন।',
        recommendedTimeBeforeFlight: '১ ঘণ্টা ৪৫ মি. আগে'
      },
      {
        stepNo: 5,
        titleBn: 'হ্যান্ড ব্যাগেজ সিকিউরিটি ও মেটাল ডিটেক্টর',
        descriptionBn: 'ল্যাপটপ, পাওয়ার ব্যাংক ও ধাতব জিনিস ট্রেতে আলাদা রাখুন (১০০ মিলি-র বেশি তরল সাথে নেওয়া যাবে না)।',
        recommendedTimeBeforeFlight: '১ ঘণ্টা ১৫ মি. আগে'
      },
      {
        stepNo: 6,
        titleBn: 'লাউঞ্জ সুবিধা ও বোর্ডিং গেটে উপস্থিতি',
        descriptionBn: 'ডিউটি-ফ্রি কেনাকাটা বা বলাকা লাউঞ্জে রিফ্রেশমেন্ট নিয়ে ফ্লাইট ছাড়ার ৪০ মিনিট আগেই বোর্ডিং গেটে উপস্থিত থাকুন।',
        recommendedTimeBeforeFlight: '৪০ মি. আগে'
      }
    ],
    arrivalStepsBn: [
      {
        stepNo: 1,
        titleBn: 'বিমানের অ্যারাইভাল ব্রিজ দিয়ে প্রবেশ',
        descriptionBn: 'বিমান থেকে নেমে করিডোর দিয়ে নিচতলার আন্তর্জাতিক আগমন হলের দিকে অগ্রসর হোন।'
      },
      {
        stepNo: 2,
        titleBn: 'অ্যারাইভাল ইমিগ্রেশন কাউন্টার',
        descriptionBn: 'বাংলাদেশি নাগরিকদের জন্য নির্ধারিত ডেস্কে পাসপোর্ট উপস্থাপন করুন। অন-অ্যারাইভাল ভিসাপ্রাপ্ত বিদেশি অতিথিদের জন্য আলাদা কাউন্টার রয়েছে।'
      },
      {
        stepNo: 3,
        titleBn: 'লাগেজ বেল্ট থেকে ব্যাগ সংগ্রহ',
        descriptionBn: 'ফ্লাইট নম্বর ডিসপ্লে দেখে নির্দিষ্ট লাগেজ বেল্ট (১ থেকে ৮) থেকে আপনার লাগেজ সংগ্রহ করুন।'
      },
      {
        stepNo: 4,
        titleBn: 'কাস্টমস ডিক্লারেশন ও গ্রিন চ্যানেল',
        descriptionBn: 'শুল্কযোগ্য অতিরিক্ত স্বর্ণ বা ইলেকট্রনিক্স না থাকলে সরাসরি গ্রিন চ্যানেল দিয়ে স্ক্যানার অতিক্রম করে বের হয়ে আসুন।'
      },
      {
        stepNo: 5,
        titleBn: 'সিম কার্ড, ক্যাশ এক্সচেঞ্জ ও ট্যাক্সি কনকোর্স',
        descriptionBn: 'এক্সিট গেটের সাথে গ্রামীণফোন, রবি ও বাংলালিংক সিম কার্ড বুথ এবং প্রি-পেইড বিমানবন্দর ট্যাক্সি ও উবার পিকআপ স্ট্যান্ড রয়েছে।'
      }
    ],
    services: [
      {
        category: 'sim',
        categoryLabelBn: 'সিম কার্ড বুথ',
        nameBn: 'গ্রামীণফোন, রবি ও বাংলালিংক অ্যারাইভাল কিয়স্ক',
        locationBn: 'টার্মিনাল ১ ও ২ অ্যারাইভাল এক্সিট গেট সংলগ্ন',
        detailsBn: 'বিদেশি পাসপোর্ট বা এনআইডি দেখিয়ে তাৎক্ষণিক পর্যটক সিম ও ৪জি ডাটা প্যাক কেনা যায়।'
      },
      {
        category: 'exchange',
        categoryLabelBn: 'মানি এক্সচেঞ্জ ও ব্যাংক',
        nameBn: 'সোনালী ব্যাংক, জনতা ব্যাংক ও অনুমোদিত কারেন্সি বুথ',
        locationBn: 'ডিপার্চার ২য় তলা এবং অ্যারাইভাল ১ ও ২ এক্সিট লাউঞ্জ',
        detailsBn: 'ডলার, ইউরো, রিয়াল ও বাথ এনডোর্সমেন্ট এবং টাকা ক্যাশ রূপান্তরের সরকারি অনুমোদিত বুথ।'
      },
      {
        category: 'wrap',
        categoryLabelBn: 'লাগেজ র‍্যাপিং',
        nameBn: 'সিকিউর লাগেজ প্লাস্টিক র‍্যাপিং কাউন্টার',
        locationBn: 'টার্মিনাল ১ ও ২ ডিপার্চার চেক-ইন হলের প্রবেশমুখে',
        detailsBn: 'ব্যাগ সুরক্ষিত রাখতে প্রতি ব্যাগে আনুমানিক ৩০০ থেকে ৪০০ টাকা ফি প্রযোজ্য।'
      },
      {
        category: 'prayer',
        categoryLabelBn: 'নামাজের কক্ষ',
        nameBn: 'মহিলা ও পুরুষ পৃথক কেন্দ্রীয় নামাজ ঘর',
        locationBn: 'টার্মিনাল ১ ও ২-এর ডিপার্চার ২য় তলা (এয়ারসাইড)',
        detailsBn: 'ওজুখানা ও নামাজের সার্বক্ষণিক সুব্যবস্থা রয়েছে।'
      }
    ],
    groundTransportBn: [
      {
        typeBn: 'প্রি-পেইড এয়ারপোর্ট ট্যাক্সি',
        costEstimateBn: '৳৮০০ – ৳১,৫০০ (ঢাকার ভেতরে)',
        locationBn: 'অ্যারাইভাল এক্সিট গেট ১ ও ২ এর বাইরে',
        tipsBn: 'বিমানবন্দরের পুলিশ নির্ধারিত বুথ থেকে রসিদ নিয়ে নিরাপদ ট্যাক্সি নেওয়া যায়।'
      },
      {
        typeBn: 'উবার / রাইডশেয়ার (Uber / Pathao)',
        costEstimateBn: '৳৫০০ – ৳১,২০০',
        locationBn: 'বিমানবন্দর ওভারব্রিজ বা নির্ধারিত কার পার্কিং ড্রপ জোন',
        tipsBn: 'অ্যাপে পিকআপ লোকেশন টার্মিনাল সিলেক্ট করুন।'
      },
      {
        typeBn: 'বিমানবন্দর রেলওয়ে স্টেশন',
        costEstimateBn: '৳৫০ – ৳২০০',
        locationBn: 'টার্মিনাল থেকে হাঁটা দূরত্বে (গোলচত্বর সংলগ্ন ফুটওভার ব্রিজ দিয়ে)',
        tipsBn: 'কমলাপুর বা উত্তরবঙ্গের আন্তঃনগর ট্রেনে দ্রুত যাওয়ার সবচেয়ে সাশ্রয়ী মাধ্যম।'
      }
    ]
  },
  BKK: {
    iata: 'BKK',
    icao: 'VTBS',
    name: 'Suvarnabhumi Airport',
    nameBn: 'সুবর্ণভূমি বিমানবন্দর, ব্যাংকক',
    city: 'ব্যাংকক (Bangkok)',
    country: 'থাইল্যান্ড (Thailand)',
    flagEmoji: '🇹🇭',
    terminals: [
      {
        id: 'MAIN',
        name: 'Main Terminal Building',
        nameBn: 'প্রধান টার্মিনাল ভবন (Main Terminal)',
        descriptionBn: 'বিশ্বের বৃহত্তম একক টার্মিনালগুলোর একটি। ৭ তলা বিশিষ্ট। লেভেল ৪ ডিপার্চার এবং লেভেল ২ অ্যারাইভাল।',
        airlineUsageBn: 'Thai Airways, Biman, US-Bangla, Emirates, Singapore Airlines, Qatar Airways',
        gateRange: 'Concourses A, B, C, D, E, F, G',
        checkInCounters: 'রো A থেকে W (লেভেল ৪)',
        baggageBelts: 'বেল্ট ১ – ২৩ (লেভেল ২)',
        levels: [
          { levelNameBn: 'লেভেল B (Basement)', facilitiesBn: ['Airport Rail Link (ARL) মেট্রো স্টেশন', 'সুপাররিচ কারেন্সি এক্সচেঞ্জ বুথ', '৭-ইলেভেন'] },
          { levelNameBn: 'লেভেল ১ (Transport)', facilitiesBn: ['পাবলিক ট্যাক্সি কিয়স্ক', 'পাতায়া ও হুয়া হিন বাস কাউন্টার', 'ম্যাজিক ফুড পয়েন্ট (বাজেট ক্যাফে)'] },
          { levelNameBn: 'লেভেল ২ (Arrival)', facilitiesBn: ['ইমিগ্রেশন ও ভিসা অন-অ্যারাইভাল কাউন্টার', 'লাগেজ বেল্ট', 'সিম কার্ড বুথ (AIS, True, Dtac)'] },
          { levelNameBn: 'লেভেল ৪ (Departure)', facilitiesBn: ['আন্তর্জাতিক চেক-ইন রো', 'ভ্যাট রিফান্ড অফিস', 'রয়্যাল সিল্ক ও মিরাকল লাউঞ্জ প্লাজা'] },
        ]
      },
      {
        id: 'SAT1',
        name: 'Satellite Terminal 1 (SAT-1)',
        nameBn: 'স্যাটেলাইট টার্মিনাল ১ (SAT-1)',
        descriptionBn: 'নতুন সম্প্রসারিত স্যাটেলাইট টার্মিনাল। স্বয়ংক্রিয় আন্ডারগ্রাউন্ড এপিএম ট্রেনের মাধ্যমে প্রধান ভবনের সাথে যুক্ত।',
        airlineUsageBn: 'Thai Airways, VietJet, Qatar Airways, Emirates ইত্যাদি',
        gateRange: 'Gates S101 – S128',
        checkInCounters: 'প্রধান ভবনে চেক-ইন',
        baggageBelts: 'প্রধান ভবনে ডেলিভারি',
        isNewTerminal: true,
        levels: [
          { levelNameBn: 'APM ট্রেন স্টেশন', facilitiesBn: ['প্রধান টার্মিনাল থেকে মাত্র ৩ মিনিটের ভূগর্ভস্থ ট্রেন সংযোগ'] },
          { levelNameBn: 'গেট ও ওয়েটিং এরিয়া', facilitiesBn: ['২৮টি আধুনিক বোর্ডিং ব্রিজ', 'মিরাকল লাউঞ্জ SAT-1 শাখা', 'ডিউটি ফ্রি'] },
        ]
      }
    ],
    lounges: [
      {
        id: 'bkk-miracle-d',
        name: 'Miracle Lounge (Concourse D)',
        terminal: 'Main Terminal',
        location: 'Concourse D, লেভেল ৩, গেট D5 এর বিপরীতে',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['Priority Pass', 'LoungeKey', 'DragonPass'],
        eligibleCardsBn: ['Priority Pass', 'Mastercard World', 'Visa Signature'],
        amenitiesBn: ['থাই ও আন্তর্জাতিক হট ফুড', 'প্রাইভেট শাওয়ার রুম', 'বিয়ার ও ওয়াইন বার', 'স্লিপিং রিক্লাইনার'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: false,
      },
      {
        id: 'bkk-thai-silk',
        name: 'Thai Airways Royal Silk Lounge',
        terminal: 'Main Terminal',
        location: 'Concourse E & C',
        operatingHours: 'সকাল ০৫:০০ – রাত ০২:০০',
        accessEligibility: ['Star Alliance Gold', 'Thai Royal Silk Business'],
        eligibleCardsBn: ['স্টার অ্যালায়েন্স গোল্ড মেম্বারশিপ'],
        amenitiesBn: ['ঐতিহ্যবাহী থাই কারি ও প্যাড থাই', 'ব্যবসায়িক ওয়ার্কস্টেশন', 'শাওয়ার'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: false,
      }
    ],
    departureStepsBn: [
      { stepNo: 1, titleBn: 'লেভেল ৪ ডিপার্চারে পৌঁছানো', descriptionBn: 'ফ্লাইটের অন্তত ৩ ঘণ্টা আগে সুবর্ণভূমির লেভেল ৪-এ উপস্থিত হোন।', recommendedTimeBeforeFlight: '৩ ঘণ্টা আগে' },
      { stepNo: 2, titleBn: 'ভ্যাট রিফান্ড স্ট্যাম্পিং (প্রযোজ্য ক্ষেত্রে)', descriptionBn: 'থাইল্যান্ডে শপিং করলে চেক-ইনের আগেই লেভেল ৪-এর কাস্টমস ভ্যাট রিফান্ড ডেস্কে ইনভয়েস যাচাই করান।', recommendedTimeBeforeFlight: '২ ঘণ্টা ৪৫ মি. আগে' },
      { stepNo: 3, titleBn: 'বোর্ডিং পাস ও লাগেজ ড্রপ', descriptionBn: 'ডিসপ্লে স্ক্রিন দেখে নির্ধারিত অ্যালফাবেটিক রো-তে গিয়ে চেক-ইন সম্পন্ন করুন।', recommendedTimeBeforeFlight: '২ ঘণ্টা ১৫ মি. আগে' },
      { stepNo: 4, titleBn: 'পাসপোর্ট কন্ট্রোল ও সিকিউরিটি', descriptionBn: 'এসকেলেটর দিয়ে লেভেল ৫ সিকিউরিটি ও পাসপোর্ট কন্ট্রোল পেরিয়ে কনকোর্সে প্রবেশ করুন।', recommendedTimeBeforeFlight: '১ ঘণ্টা ৩০ মি. আগে' },
      { stepNo: 5, titleBn: 'গেট ও স্যাটেলাইট ট্রেন সংযোগ', descriptionBn: 'যদি গেট S101-S128 হয়, তবে আন্ডারগ্রাউন্ড APM ট্রেনে চেপে SAT-1 টার্মিনালে যান।', recommendedTimeBeforeFlight: '৪৫ মি. আগে' },
    ],
    arrivalStepsBn: [
      { stepNo: 1, titleBn: 'অ্যারাইভাল কনকোর্স ধরে হাঁটা', descriptionBn: 'বিমানের গেট থেকে ইমিগ্রেশন নির্দেশক সাইন অনুসরণ করে এগোন।' },
      { stepNo: 2, titleBn: 'ভিসা অন-অ্যারাইভাল / ইমিগ্রেশন', descriptionBn: 'ভিসা থাকলে সরাসরি পাসপোর্ট কন্ট্রোল ডেস্কে যান; অন-অ্যারাইভালের জন্য VOA ডেস্কে ২,০০০ বাথ ফি জমা দিন।' },
      { stepNo: 3, titleBn: 'ব্যাগেজ ক্লেইম (লেভেল ২)', descriptionBn: 'পাসপোর্ট সিল নিয়ে নিচের তলায় নির্দিষ্ট বেল্ট থেকে লাগেজ নিন।' },
      { stepNo: 4, titleBn: 'এয়ারপোর্ট রেল লিংক মেট্রো (লেভেল B)', descriptionBn: 'বেসমেন্টে গিয়ে ৪৫ বাথ মূল্যের টোকেন নিয়ে সরাসরি ব্যাংকক সিটির ফায়া থাই স্টেশনে যান।' },
    ],
    services: [
      { category: 'sim', categoryLabelBn: 'সিম কার্ড বুথ', nameBn: 'AIS / True 5G Tourist Sim', locationBn: 'লেভেল ২ অ্যারাইভাল হল', detailsBn: '৮ বা ১৫ দিনের আনলিমিটেড ৫জি ট্যুরিস্ট সিম পাওয়া যায়।' },
      { category: 'exchange', categoryLabelBn: 'কারেন্সি এক্সচেঞ্জ', nameBn: 'SuperRich Orange / Green Currency Exchange', locationBn: 'লেভেল B (এয়ারপোর্ট রেল লিংক স্টেশনের পাশে)', detailsBn: 'বিমানবন্দরের সাধারণ ব্যাংকের চেয়ে সুপাররিচে ৫-১০% বেশি বাথ পাওয়া যায়।' },
      { category: 'transport', categoryLabelBn: 'গণপরিবহন', nameBn: 'Airport Rail Link (ARL)', locationBn: 'লেভেল B', detailsBn: 'মাত্র ৪৫ বাথে জ্যামমুক্তভাবে ব্যাংককের কেন্দ্রস্থলে পৌঁছানো যায়।' }
    ],
    groundTransportBn: [
      { typeBn: 'Airport Rail Link (মেট্রো ট্রেন)', costEstimateBn: '฿৪৫ (১৫০ টাকা)', locationBn: 'লেভেল B বেসমেন্ট', tipsBn: 'ব্যাংকক শহরের যানজট এড়িয়ে দ্রুত পৌঁছানোর সেরা মাধ্যম।' },
      { typeBn: 'পাবলিক ট্যাক্সি (Metered Taxi)', costEstimateBn: '฿৩৫০ – ฿৫৫০', locationBn: 'লেভেল ১ গেট ৪ ও ৭', tipsBn: 'কিয়স্ক থেকে সিরিয়াল টিকিট নিয়ে নির্ধারিত লেন থেকে ট্যাক্সি নিন।' }
    ]
  },
  SIN: {
    iata: 'SIN',
    icao: 'WSSS',
    name: 'Singapore Changi Airport',
    nameBn: 'সিঙ্গাপুর চাঙ্গি বিমানবন্দর',
    city: 'সিঙ্গাপুর (Singapore)',
    country: 'সিঙ্গাপুর (Singapore)',
    flagEmoji: '🇸🇬',
    terminals: [
      {
        id: 'JEWEL',
        name: 'Jewel Changi Airport',
        nameBn: 'জুয়েল চাঙ্গি (বিশ্ববিখ্যাত ইনডোর ওয়াটারফল কমপ্লেক্স)',
        descriptionBn: 'টার্মিনাল ১-এর সাথে সরাসরি সংযুক্ত ৪০ মিটার উঁচু এইচএসবিসি রেইন ভর্টেক্স ওয়াটারফল ও ক্যানোপি পার্ক।',
        airlineUsageBn: 'আর্লি চেক-ইন লাউঞ্জ ও আকর্ষণীয় কমপ্লেক্স',
        gateRange: 'T1, T2, T3 এর সাথে সরাসরি স্কাইট্রেন সংযোগ',
        checkInCounters: 'Jewel Early Check-in Lounge',
        baggageBelts: 'টার্মিনালে',
        levels: [
          { levelNameBn: 'লেভেল ১', facilitiesBn: ['HSBC Rain Vortex Waterfall বেস', 'আর্লি চেক-ইন লাউঞ্জ', 'ব্যাগেজ স্টোরেজ'] },
          { levelNameBn: 'লেভেল ৫', facilitiesBn: ['ক্যানোপি পার্ক', 'বাউন্সিং নেট', 'গ্লাস ক্যানোপি ব্রিজ'] }
        ]
      },
      {
        id: 'T3',
        name: 'Terminal 3',
        nameBn: 'টার্মিনাল ৩ (প্রধান আন্তর্জাতিক হাব)',
        descriptionBn: 'সিঙ্গাপুর এয়ারলাইন্স ও প্রধান আন্তর্জাতিক এয়ারলাইন্স। প্রজাপতি বাগান (Butterfly Garden) ও সিনেমাহল বিশিষ্ট।',
        airlineUsageBn: 'Singapore Airlines, Biman Bangladesh, Emirates, Qatar Airways',
        gateRange: 'Gates A1 – A21, B1 – B10',
        checkInCounters: 'রো ১ থেকে ১১',
        baggageBelts: 'বেল্ট ৪১ – ৪৮',
        levels: [
          { levelNameBn: 'লেভেল ২ (ডিপার্চার)', facilitiesBn: ['স্বয়ংক্রিয় বায়োমেট্রিক চেক-ইন', 'বাটারফ্লাই গার্ডেন', 'মারহবা লাউঞ্জ', 'SATS প্রিমিয়ার লাউঞ্জ'] },
          { levelNameBn: 'লেভেল ১ (অ্যারাইভাল)', facilitiesBn: ['ব্যাগেজ ক্লেইম', 'MRT সাবওয়ে স্টেশন সংযোগ'] }
        ]
      }
    ],
    lounges: [
      {
        id: 'sin-sats-t3',
        name: 'SATS Premier Lounge (T3)',
        terminal: 'Terminal 3',
        location: 'লেভেল ৩, ট্রানজিট এরিয়া',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['Priority Pass', 'LoungeKey'],
        eligibleCardsBn: ['Priority Pass', 'Mastercard World', 'Visa Signature'],
        amenitiesBn: ['সিঙ্গাপুরিয়ান লাকসা নুডল বার', 'প্রাইভেট শাওয়ার', 'ম্যাসেজ চেয়ার', 'হাই-স্পিড ওয়াইফাই'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: true
      }
    ],
    departureStepsBn: [
      { stepNo: 1, titleBn: 'জুয়েল চাঙ্গিতে আর্লি চেক-ইন', descriptionBn: 'ফ্লাইটের ৩-১২ ঘণ্টা আগে জুয়েল চাঙ্গিতে লাগেজ জমা দিয়ে ওয়াটারফল ঘুরে দেখতে পারেন।', recommendedTimeBeforeFlight: '৩ ঘণ্টা আগে' },
      { stepNo: 2, titleBn: 'বায়োমেট্রিক স্বয়ংক্রিয় গেট', descriptionBn: 'পাসপোর্ট স্ক্যান করে ফেসিয়াল রিকগনিশনের মাধ্যমে তাৎক্ষণিক ইমিগ্রেশন সম্পন্ন হয়।', recommendedTimeBeforeFlight: '১ ঘণ্টা ৩০ মি. আগে' },
      { stepNo: 3, titleBn: 'বোর্ডিং গেটে সিকিউরিটি স্ক্যান', descriptionBn: 'চাঙ্গিতে প্রতিটি নির্দিষ্ট বোর্ডিং গেটের মুখে সিকিউরিটি এক্স-রে পরীক্ষা করা হয়।', recommendedTimeBeforeFlight: '৪০ মি. আগে' }
    ],
    arrivalStepsBn: [
      { stepNo: 1, titleBn: 'SG Arrival Card ডিজিটাল যাচাই', descriptionBn: 'সিঙ্গাপুরে অবতরণের ৩ দিন আগে পূরণ করা এসজি অ্যারাইভাল কার্ড স্বয়ংক্রিয়ভাবে ম্যাচ হবে।' },
      { stepNo: 2, titleBn: 'অটোমেটেড ইমিগ্রেশন ক্লিয়ারেন্স', descriptionBn: 'বায়োমেট্রিক কিয়স্কে থাম্বপ্রিন্ট ও ক্যামেরা ফেস স্ক্যান করে ১০ সেকেন্ডে ইমিগ্রেশন পার হোন।' },
      { stepNo: 3, titleBn: 'MRT ট্রেনে সরাসরি শহরে যাত্রা', descriptionBn: 'টার্মিনাল ২ ও ৩ এর সংযোগস্থলে চাঙ্গি এয়ারপোর্ট এমআরটি স্টেশন অবস্থিত।' }
    ],
    services: [
      { category: 'transport', categoryLabelBn: 'মেট্রো ট্রেন', nameBn: 'Changi Airport MRT Station (East-West Line)', locationBn: 'T2 ও T3 এর ভূগর্ভস্থ স্টেশন', detailsBn: 'EZ-Link কার্ড বা কনট্যাক্টলেস ব্যাংক কার্ড ট্যাপ করে সরাসরি শহরে যাওয়া যায়।' }
    ],
    groundTransportBn: [
      { typeBn: 'MRT মেট্রো সাবওয়ে', costEstimateBn: 'S$২.৫০ (২০০ টাকা)', locationBn: 'T2 & T3 বেসমেন্ট', tipsBn: 'সবচেয়ে আরামদায়ক ও সাশ্রয়ী পরিবহন।' }
    ]
  },
  KUL: {
    iata: 'KUL',
    icao: 'WMKK',
    name: 'Kuala Lumpur International Airport',
    nameBn: 'কুয়ালালামপুর আন্তর্জাতিক বিমানবন্দর',
    city: 'কুয়ালালামপুর (Kuala Lumpur)',
    country: 'মালয়েশিয়া (Malaysia)',
    flagEmoji: '🇲🇾',
    terminals: [
      {
        id: 'KLIA1',
        name: 'KLIA Terminal 1',
        nameBn: 'টার্মিনাল ১ (KLIA Main & Satellite)',
        descriptionBn: 'মালয়েশিয়া এয়ারলাইন্স, বিমান বাংলাদেশ, ইউএস-বাংলা, এমিরেটস ও আন্তর্জাতিক ফুল-সার্ভিস ক্যারিয়ার।',
        airlineUsageBn: 'Malaysia Airlines, Biman, US-Bangla, Emirates, Singapore Airlines',
        gateRange: 'Contact Pier (Gates G & H), Satellite (Gates C1 – C37)',
        checkInCounters: 'আইল্যান্ড A থেকে M (লেভেল ৫)',
        baggageBelts: 'বেল্ট A থেকে L (লেভেল ৩)',
        levels: [
          { levelNameBn: 'লেভেল ১', facilitiesBn: ['KLIA Ekspres ট্রেন প্ল্যাটফর্ম', 'পাবলিক বাস টার্মিনাল'] },
          { levelNameBn: 'লেভেল ৩ (Arrival)', facilitiesBn: ['ইমিগ্রেশন কাউন্টার', 'লাগেজ বেল্ট', 'কাস্টমস'] },
          { levelNameBn: 'লেভেল ৫ (Departure)', facilitiesBn: ['চেক-ইন কাউন্টার', 'ইমিগ্রেশন', 'প্লাজা প্রিমিয়াম লাউঞ্জ'] }
        ]
      },
      {
        id: 'KLIA2',
        name: 'KLIA Terminal 2',
        nameBn: 'টার্মিনাল ২ (AirAsia & Low-Cost Hub)',
        descriptionBn: 'এয়ারএশিয়া ও বাজেট ক্যারিয়ারের জন্য নিবেদিত বিশাল আন্তর্জাতিক হাব। এর সাথে গেটওয়ে@কেএলআইএ২ শপিংমল সংযুক্ত।',
        airlineUsageBn: 'AirAsia, Scoot, Jetstar',
        gateRange: 'Piers J, K, L, P, Q',
        checkInCounters: 'রো S থেকে Z',
        baggageBelts: 'অ্যারাইভাল হল',
        levels: [
          { levelNameBn: 'gateway@klia2 মল', facilitiesBn: ['ফুডকোর্ট', 'সুপারমার্কেট', 'ক্যাপসুল ট্রানজিট হোটেল'] }
        ]
      }
    ],
    lounges: [
      {
        id: 'kul-plaza-sat',
        name: 'Plaza Premium Lounge (KLIA1 Satellite)',
        terminal: 'KLIA 1',
        location: 'স্যাটেলাইট বিল্ডিং, গেট C11-C17 এর কাছে',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['Priority Pass', 'DragonPass'],
        eligibleCardsBn: ['Priority Pass', 'Mastercard World', 'Visa Signature'],
        amenitiesBn: ['মালয়েশিয়ান চিকেন রাইস ও বুফে', 'শাওয়ার রুম', 'এয়ারফিল্ড ভিউ', 'ওয়াইফাই'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: true
      }
    ],
    departureStepsBn: [
      { stepNo: 1, titleBn: 'টার্মিনাল নিশ্চিতকরণ (KLIA 1 বনাম KLIA 2)', descriptionBn: 'এয়ারএশিয়ার ফ্লাইট হলে KLIA 2 এবং বিমান বাংলাদেশ বা অন্যান্য এয়ারলাইন্স হলে KLIA 1-এ যান।', recommendedTimeBeforeFlight: '৩ ঘণ্টা আগে' },
      { stepNo: 2, titleBn: 'চেক-ইন ও অ্যারোট্রেন/বাস সংযোগ', descriptionBn: 'স্যাটেলাইট গেট (C Gates) হলে প্রধান ভবন থেকে ফ্রি শাটল বাসে চেপে স্যাটেলাইট কনকোর্সে যান।', recommendedTimeBeforeFlight: '২ ঘণ্টা আগে' },
      { stepNo: 3, titleBn: 'বোর্ডিং গেট ও সিকিউরিটি', descriptionBn: 'নির্দিষ্ট গেটে গিয়ে ফ্লাইট ছাড়ার ৩০ মিনিট পূর্বে বোর্ডিং করুন।', recommendedTimeBeforeFlight: '৪৫ মি. আগে' }
    ],
    arrivalStepsBn: [
      { stepNo: 1, titleBn: 'MDAC (Malaysia Digital Arrival Card) স্ক্যান', descriptionBn: 'অনলাইনে পূরণ করা মালয়েশিয়া অ্যারাইভাল কার্ড যাচাই করে ইমিগ্রেশন সিল নিন।' },
      { stepNo: 2, titleBn: 'KLIA Ekspres দ্রুতগতির নন-স্টপ ট্রেন', descriptionBn: 'মাত্র ২৮ মিনিটে সরাসরি কুয়ালালামপুর সেন্ট্রাল (KL Sentral) স্টেশনে পৌঁছে যান।' }
    ],
    services: [
      { category: 'transport', categoryLabelBn: 'এক্সপ্রেস ট্রেন', nameBn: 'KLIA Ekspres High-Speed Train', locationBn: 'KLIA 1 ও 2 এর লেভেল ১', detailsBn: 'প্রতি ১৫-২০ মিনিটে নন-স্টপ ট্রেন ছাড়ে, ভাড়া RM৫৫।' }
    ],
    groundTransportBn: [
      { typeBn: 'KLIA Ekspres সুপারফাস্ট ট্রেন', costEstimateBn: 'RM৫৫ (১,৫০০ টাকা)', locationBn: 'লেভেল ১ স্টেশন প্ল্যাটফর্ম', tipsBn: 'যানজট ছাড়া ২৮ মিনিটে কেএল সেন্ট্রাল পৌঁছানোর দ্রুততম উপায়।' },
      { typeBn: 'Airport Coach বাস সার্ভিস', costEstimateBn: 'RM১২ – RM১৫ (৪০০ টাকা)', locationBn: 'লেভেল ১ বাস টার্মিনাল', tipsBn: 'বাজেট ট্রাভেলারদের জন্য সবচেয়ে কম খরচের বিকল্প।' }
    ]
  },
  DXB: {
    iata: 'DXB',
    icao: 'OMDB',
    name: 'Dubai International Airport',
    nameBn: 'দুবাই আন্তর্জাতিক বিমানবন্দর',
    city: 'দুবাই (Dubai)',
    country: 'সংযুক্ত আরব আমিরাত (UAE)',
    flagEmoji: '🇦🇪',
    terminals: [
      {
        id: 'T1',
        name: 'Terminal 1 (Concourse D)',
        nameBn: 'টার্মিনাল ১ (Concourse D - বিদেশী আন্তর্জাতিক ক্যারিয়ার)',
        descriptionBn: 'বিমান বাংলাদেশ, ইউএস-বাংলা, কাতার এয়ারওয়েজ, ব্রিটিশ এয়ারওয়েজ ইত্যাদি সব নন-এমিরেটস এয়ারলাইন্স।',
        airlineUsageBn: 'Biman Bangladesh Airlines, US-Bangla, Saudia, British Airways',
        gateRange: 'Concourse D (Gates D1 – D32)',
        checkInCounters: 'এরিয়া ১ থেকে ৬',
        baggageBelts: 'টার্মিনাল ১ অ্যারাইভাল',
        levels: [
          { levelNameBn: 'Concourse D', facilitiesBn: ['মারহাবা লাউঞ্জ', 'আহলান লাউঞ্জ', 'বিশাল ডিউটি ফ্রি শপ', 'ট্রানজিট ট্রেন'] }
        ]
      },
      {
        id: 'T3',
        name: 'Terminal 3 (Emirates & flydubai Flagship)',
        nameBn: 'টার্মিনাল ৩ (বিশ্বের অন্যতম বৃহত্তম এয়ারপোর্ট টার্মিনাল)',
        descriptionBn: 'এমিরেটস এয়ারলাইন্সের বিশ্বব্যাপী প্রধান ট্রানজিট হাব। কনকোর্স A, B, C বিশিষ্ট।',
        airlineUsageBn: 'Emirates Airlines, flydubai',
        gateRange: 'Concourse A, B, C (A380 ডাবল ডেকার গেটসহ)',
        checkInCounters: 'রো ১ থেকে ১০',
        baggageBelts: 'টার্মিনাল ৩ আগমন হল',
        levels: [
          { levelNameBn: 'কনকোর্স A, B, C', facilitiesBn: ['এমিরেটস ফার্স্ট ও বিজনেস ক্লাস লাউঞ্জ', 'মারহাবা লাউঞ্জ', 'জেন গার্ডেন'] }
        ]
      }
    ],
    lounges: [
      {
        id: 'dxb-marhaba-d',
        name: 'Marhaba Lounge (Terminal 1, Concourse D)',
        terminal: 'Terminal 1',
        location: 'Concourse D, ডিউটি ফ্রির উপরে',
        operatingHours: '২৪ ঘণ্টা খোলা',
        accessEligibility: ['Priority Pass', 'LoungeKey'],
        eligibleCardsBn: ['Priority Pass', 'Mastercard World', 'Visa Signature / Infinite'],
        amenitiesBn: ['মধ্যপ্রাচ্য ও আন্তর্জাতিক বুফে', 'শাওয়ার', 'ওয়াইফাই', 'রিক্লাইনার'],
        hasShower: true,
        hasBuffet: true,
        hasPrayerRoom: true
      }
    ],
    departureStepsBn: [
      { stepNo: 1, titleBn: 'টার্মিনালে পৌঁছানো', descriptionBn: 'দুবাই মেট্রোর লাল লাইনে চেপে টার্মিনাল ১ বা টার্মিনাল ৩ মেট্রো স্টেশনে নামুন।', recommendedTimeBeforeFlight: '৩ ঘণ্টা আগে' },
      { stepNo: 2, titleBn: 'স্মার্ট গেট ইমিগ্রেশন', descriptionBn: 'রেসিডেন্স বা ভিসা থাকলে সরাসরি স্মার্টগেটে পাসপোর্ট স্ক্যান করে সেকেন্ডে বের হয়ে যান।', recommendedTimeBeforeFlight: '১ ঘণ্টা ৪৫ মি. আগে' },
      { stepNo: 3, titleBn: 'এয়ারপোর্ট ট্রানজিট ট্রেন (Concourse D)', descriptionBn: 'টার্মিনাল ১ চেক-ইন শেষে স্বয়ংক্রিয় ট্রেনে চেপে কনকোর্স D গেটে পৌঁছান।', recommendedTimeBeforeFlight: '১ ঘণ্টা আগে' }
    ],
    arrivalStepsBn: [
      { stepNo: 1, titleBn: 'ফ্রি ১ জিবি ট্যুরিস্ট ই-সিম গ্রহণ', descriptionBn: 'দুবাই ইমিগ্রেশন কাউন্টারে পাসপোর্ট সিল দেওয়ার সাথে সাথে ফ্রি ১ জিবি ডেটাযুক্ত ট্যুরিস্ট সিম দেয়।' },
      { stepNo: 2, titleBn: 'দুবাই মেট্রো রেড লাইন', descriptionBn: 'টার্মিনাল ১ ও ৩ থেকে সরাসরি মেট্রোতে চেপে দুবাই মল, বুর্জ খলিফা বা দেরায় যান।' }
    ],
    services: [
      { category: 'transport', categoryLabelBn: 'দুবাই মেট্রো', nameBn: 'Dubai Metro Red Line Stations', locationBn: 'Terminal 1 & Terminal 3', detailsBn: 'সকাল ০৫:০০ থেকে মধ্যরাত পর্যন্ত শহরজুড়ে সরাসরি মেট্রো চলে।' }
    ],
    groundTransportBn: [
      { typeBn: 'দুবাই মেট্রো (Dubai Metro Red Line)', costEstimateBn: 'AED ৫ – AED ৮ (১৭০–২৭০ টাকা)', locationBn: 'T1 & T3 মেট্রো স্টেশন', tipsBn: 'দুবাই নল কার্ড (Nol Card) কিনে দ্রুত ও কম খরচে শহরে যাওয়ার উপায়।' }
    ]
  }
};
