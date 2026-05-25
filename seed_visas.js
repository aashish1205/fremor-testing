import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_ANON_KEY;

if (!url || !key) {
    console.error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
    process.exit(1);
}

const supabase = createClient(url, key);

const defaultDocuments = [
  "First and last page of the passport (minimum 6 months validity)",
  "Photo with white background (size 3.5 x 4.5 cm)",
  "Onward and Return Flight Ticket",
  "Accommodation Voucher / Hotel Booking Confirmation",
  "Bank statement of last 3 months with sufficient balance"
];

const defaultImportantInfo = [
  {
    title: "Passport Validity",
    desc: "Your passport must be valid for at least 6 months from the date of travel and must have at least 2 blank pages for visa stamping."
  },
  {
    title: "Financial Proof",
    desc: "You may need to provide bank statements for the last 3-6 months showing sufficient funds to cover your trip expenses."
  }
];

const defaultFaqs = [
  { category: "Important Information", q: "What documents do I need for a visa?", a: "You typically need a valid passport, photographs, flight bookings, hotel reservations, bank statements, and travel insurance." },
  { category: "Important Information", q: "How long does processing take?", a: "Standard processing varies by country. Please check the processing time for your specific destination on the detail page." },
  { category: "Processing Time", q: "What is the standard processing time?", a: "The processing time is calculated in working days or calendar days from the date of documents submission." },
  { category: "Re-application", q: "What if my visa is rejected?", a: "You can re-apply after addressing the reasons for rejection. A fresh application fee will apply." },
  { category: "Visa Extension", q: "Can I extend my visa?", a: "Extension policies vary by country. Contact our support team for specific information." }
];

const visaData = [
  {
    country_name: "United Arab Emirates",
    country_code: "ae",
    flag_url: "https://flagcdn.com/w40/ae.png",
    visa_type: "E-VISA",
    price: 6950,
    service_fee: 1399,
    processing_time_text: "5 Working Days",
    processing_days_max: 5,
    processing_type: "working_days",
    visas_processed: "150k+",
    landmark_image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&h=350&fit=crop",
    is_featured: true,
    documents: [
      "First and last page of the passport",
      "Photo with white background",
      "Onward and Return Flight Ticket",
      "Accommodation Voucher (if staying at a hotel)",
      "Host's Tenancy Contract and Emirates ID (if staying with friends/family)"
    ],
    important_info: [
      { title: "Stay with Family or Friends", desc: "Applicants must provide a copy of the host's tenancy contract and Emirates ID as proof of accommodation. In case the host owns the property, a copy of the Title Deed is required." },
      { title: "Minors Travel Consent", desc: "It is recommended that minors must be accompanied by their parents or a legal guardian. It is mandatory for minors to travel with the parent with whom his/her visa application has been processed." }
    ],
    faqs: [
      { category: "Important Information", q: "What is OK to Board?", a: "OK to Board is required by certain airlines if your passport issuing country is Bangladesh, China or Pakistan. You need to apply for OK to Board around 72 hours before your flight boarding time." },
      { category: "Important Information", q: "Is the OK to Board fee included in the visa application fee?", a: "This fee is not included in the visa application fee. Fremor can help with this service at an additional cost." },
      { category: "Important Information", q: "Which destinations can I visit with the UAE visa?", a: "The UAE visa grants entry to all 7 emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Fujairah, and Ras Al Khaimah." },
      { category: "Processing Time", q: "How long does it take to get a UAE visa?", a: "The processing time for a UAE visa is typically 3-5 working days from the date of submission of all required documents." },
      { category: "Processing Time", q: "Can I get an urgent visa?", a: "Yes, express processing is available at an additional cost with a turnaround of 24-48 hours." },
      { category: "Re-application", q: "What if my visa gets rejected?", a: "In case of a rejection, you can re-apply after addressing the reasons for rejection. Our team will guide you through the process." },
      { category: "Visa Extension", q: "Can I extend my UAE visa?", a: "Yes, UAE visa can be extended for an additional 30 days. You need to apply for an extension before your current visa expires." }
    ]
  },
  {
    country_name: "Singapore",
    country_code: "sg",
    flag_url: "https://flagcdn.com/w40/sg.png",
    visa_type: "E-VISA",
    price: 3500,
    service_fee: 999,
    processing_time_text: "7 to 10 working days(approx)",
    processing_days_max: 10,
    processing_type: "working_days",
    visas_processed: "25k+",
    landmark_image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Vietnam",
    country_code: "vn",
    flag_url: "https://flagcdn.com/w40/vn.png",
    visa_type: "E-VISA",
    price: 2300,
    service_fee: 899,
    processing_time_text: "5 to 7 workings days(approx)",
    processing_days_max: 7,
    processing_type: "working_days",
    visas_processed: "20k+",
    landmark_image: "https://images.unsplash.com/photo-1557750255-c76072a7aee1?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "China",
    country_code: "cn",
    flag_url: "https://flagcdn.com/w40/cn.png",
    visa_type: "STICKER VISA",
    price: 8500,
    service_fee: 1500,
    processing_time_text: "7 to 10 working days (approx)",
    processing_days_max: 10,
    processing_type: "working_days",
    visas_processed: "12k+",
    landmark_image: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Russia",
    country_code: "ru",
    flag_url: "https://flagcdn.com/w40/ru.png",
    visa_type: "E-VISA",
    price: 9500,
    service_fee: 1800,
    processing_time_text: "4 calendar days",
    processing_days_max: 4,
    processing_type: "calendar_days",
    visas_processed: "8k+",
    landmark_image: "https://images.unsplash.com/photo-1513326796272-4ab140d39e3a?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Japan",
    country_code: "jp",
    flag_url: "https://flagcdn.com/w40/jp.png",
    visa_type: "E-VISA",
    price: 4200,
    service_fee: 999,
    processing_time_text: "7 to 10 working days (approx)",
    processing_days_max: 10,
    processing_type: "working_days",
    visas_processed: "35k+",
    landmark_image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "South Korea",
    country_code: "kr",
    flag_url: "https://flagcdn.com/w40/kr.png",
    visa_type: "E-VISA / STICKER",
    price: 5000,
    service_fee: 1200,
    processing_time_text: "7 to 15 working days (approx)",
    processing_days_max: 15,
    processing_type: "working_days",
    visas_processed: "18k+",
    landmark_image: "https://images.unsplash.com/photo-1538669715315-1311ff928df2?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Sri Lanka",
    country_code: "lk",
    flag_url: "https://flagcdn.com/w40/lk.png",
    visa_type: "ETA / E-VISA",
    price: 2800,
    service_fee: 799,
    processing_time_text: "24 to 72 hrs",
    processing_days_max: 3,
    processing_type: "calendar_days",
    visas_processed: "40k+",
    landmark_image: "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Azerbaijan",
    country_code: "az",
    flag_url: "https://flagcdn.com/w40/az.png",
    visa_type: "E-VISA",
    price: 3200,
    service_fee: 899,
    processing_time_text: "3 to 5 working days (approx)",
    processing_days_max: 5,
    processing_type: "working_days",
    visas_processed: "15k+",
    landmark_image: "https://images.unsplash.com/photo-1541604193435-22419f8546b3?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "United Kingdom",
    country_code: "gb",
    flag_url: "https://flagcdn.com/w40/gb.png",
    visa_type: "STICKER VISA",
    price: 12500,
    service_fee: 2500,
    processing_time_text: "15 to 30 working days (approx)",
    processing_days_max: 30,
    processing_type: "working_days",
    visas_processed: "55k+",
    landmark_image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "United States",
    country_code: "us",
    flag_url: "https://flagcdn.com/w40/us.png",
    visa_type: "INTERVIEW VISA",
    price: 15000,
    service_fee: 3000,
    processing_time_text: "interview – based wait times",
    processing_days_max: 0,
    processing_type: "interview",
    visas_processed: "60k+",
    landmark_image: "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Australia",
    country_code: "au",
    flag_url: "https://flagcdn.com/w40/au.png",
    visa_type: "E-VISA",
    price: 11000,
    service_fee: 2200,
    processing_time_text: "15 to 30 working days",
    processing_days_max: 30,
    processing_type: "working_days",
    visas_processed: "30k+",
    landmark_image: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "New Zealand",
    country_code: "nz",
    flag_url: "https://flagcdn.com/w40/nz.png",
    visa_type: "E-VISA",
    price: 13500,
    service_fee: 2800,
    processing_time_text: "20 to 35 workings days (approx)",
    processing_days_max: 35,
    processing_type: "working_days",
    visas_processed: "10k+",
    landmark_image: "https://images.unsplash.com/photo-1507699622108-4be3a09551ff?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Canada",
    country_code: "ca",
    flag_url: "https://flagcdn.com/w40/ca.png",
    visa_type: "STICKER VISA",
    price: 14000,
    service_fee: 2800,
    processing_time_text: "20 to 70 working days (approx)",
    processing_days_max: 70,
    processing_type: "working_days",
    visas_processed: "25k+",
    landmark_image: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Thailand",
    country_code: "th",
    flag_url: "https://flagcdn.com/w40/th.png",
    visa_type: "E-VISA",
    price: 0,
    service_fee: 199,
    processing_time_text: "5-7 Working Days",
    processing_days_max: 7,
    processing_type: "working_days",
    visas_processed: "120k+",
    landmark_image: "https://images.unsplash.com/photo-1528181304800-259b08848526?w=600&h=350&fit=crop",
    is_featured: true,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Indonesia",
    country_code: "id",
    flag_url: "https://flagcdn.com/w40/id.png",
    visa_type: "EVOA",
    price: 2800,
    service_fee: 899,
    processing_time_text: "5-7 Working Days",
    processing_days_max: 7,
    processing_type: "working_days",
    visas_processed: "15k+",
    landmark_image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  },
  {
    country_name: "Malaysia",
    country_code: "my",
    flag_url: "https://flagcdn.com/w40/my.png",
    visa_type: "E-VISA",
    price: 2500,
    service_fee: 899,
    processing_time_text: "5-7 Working Days",
    processing_days_max: 7,
    processing_type: "working_days",
    visas_processed: "45k+",
    landmark_image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&h=350&fit=crop",
    is_featured: false,
    documents: defaultDocuments,
    important_info: defaultImportantInfo,
    faqs: defaultFaqs
  }
];

async function seed() {
  try {
    console.log("Logging in as admin to seed database...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'connect@fremorglobal.com',
      password: 'Admin@123$',
    });

    if (signInError) {
      console.error("Authentication failed. Cannot seed table visas:", signInError.message);
      process.exit(1);
    }

    console.log("Authenticated successfully. Clearing existing visas if any...");
    // Let's fetch existing visas
    const { data: existingVisas, error: selectError } = await supabase
      .from('visas')
      .select('id');
      
    if (selectError) {
      console.error("Error reading visas table. Make sure setup_visas_table.sql is executed first:", selectError.message);
      process.exit(1);
    }

    if (existingVisas && existingVisas.length > 0) {
      console.log(`Found ${existingVisas.length} existing visa records. Deleting them first...`);
      const { error: deleteError } = await supabase
        .from('visas')
        .delete()
        .in('id', existingVisas.map(v => v.id));
        
      if (deleteError) {
        console.error("Failed to delete existing visas:", deleteError.message);
        process.exit(1);
      }
    }

    console.log(`Inserting ${visaData.length} new visa records...`);
    const { data: insertedData, error: insertError } = await supabase
      .from('visas')
      .insert(visaData)
      .select();

    if (insertError) {
      console.error("Error seeding visas:", insertError.message);
    } else {
      console.log(`Successfully seeded ${insertedData.length} visas in the database!`);
    }

  } catch (err) {
    console.error("Failed to seed database:", err);
  }
}

seed();
