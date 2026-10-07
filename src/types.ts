/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Faculty {
  id: string;
  th: string;
  en: string;
}

export interface ProgramItem {
  id: string;
  facultyId: string;
  degreeLevel: "bachelor" | "master" | "doctoral";
  degreeLevelTh: string;
  degreeLevelEn: string;
  degreeTh: string;
  degreeEn: string;
  majorTh: string;
  majorEn: string;
}

export const FACULTIES: Faculty[] = [
  { id: "entrepreneurship", th: "คณะการสร้างเจ้าของธุรกิจและการบริหารกิจการ", en: "School of Entrepreneurship and Management" },
  { id: "digital_media", th: "คณะดิจิทัลมีเดียและศิลปะภาพยนตร์", en: "School of Digital Media and Cinematic Arts" },
  { id: "it", th: "คณะเทคโนโลยีสารสนเทศและนวัตกรรม", en: "School of Information Technology and Innovation" },
  { id: "law", th: "คณะนิติศาสตร์", en: "School of Law" },
  { id: "communication", th: "คณะนิเทศศาสตร์", en: "School of Communication Arts" },
  { id: "business", th: "คณะบริหารธุรกิจ", en: "School of Business Administration" },
  { id: "accounting", th: "คณะบัญชี", en: "School of Accounting" },
  { id: "humanities", th: "คณะมนุษยศาสตร์และการจัดการการท่องเที่ยว", en: "School of Humanities and Tourism Management" },
  { id: "engineering", th: "คณะวิศวกรรมศาสตร์", en: "School of Engineering" },
  { id: "fine_arts", th: "คณะศิลปกรรมศาสตร์", en: "School of Fine and Applied Arts" },
  { id: "economics", th: "คณะเศรษฐศาสตร์และการลงทุน", en: "School of Economics and Investment" },
  { id: "architecture", th: "คณะสถาปัตยกรรมศาสตร์", en: "School of Architecture" },
  { id: "international", th: "วิทยาลัยนานาชาติ", en: "Bangkok University International" },
  { id: "chinese_international", th: "วิทยาลัยนานาชาติจีน", en: "Bangkok University Chinese International" }
];

export const BU_PROGRAMS: ProgramItem[] = [
  // 1. คณะการสร้างเจ้าของธุรกิจและการบริหารกิจการ
  {
    id: "sem_b_ent",
    facultyId: "entrepreneurship",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการเป็นเจ้าของธุรกิจ",
    majorEn: "Entrepreneurship"
  },
  {
    id: "sem_b_ent_intl",
    facultyId: "entrepreneurship",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการเป็นเจ้าของธุรกิจ (หลักสูตรนานาชาติ)",
    majorEn: "Entrepreneurship (International Program)"
  },
  {
    id: "sem_m_ent",
    facultyId: "entrepreneurship",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรการจัดการมหาบัณฑิต",
    degreeEn: "Master of Management",
    majorTh: "สาขาวิชาความเป็นผู้ประกอบการ",
    majorEn: "Entrepreneurship and Emerging Enterprises"
  },

  // 2. คณะดิจิทัลมีเดียและศิลปะภาพยนตร์
  {
    id: "dmc_b_film",
    facultyId: "digital_media",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาภาพยนตร์",
    majorEn: "Film"
  },
  {
    id: "dmc_b_dm",
    facultyId: "digital_media",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาสื่อดิจิทัล",
    majorEn: "Digital Media"
  },
  {
    id: "dmc_b_film_intl",
    facultyId: "digital_media",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการผลิตและธุรกิจภาพยนตร์ ซีรีส์ และเนื้อหาสากล (หลักสูตรนานาชาติ)",
    majorEn: "Film, Series and Global Content Production and Business (International Program)"
  },
  {
    id: "dmc_b_vp",
    facultyId: "digital_media",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปบัณฑิต",
    degreeEn: "Bachelor of Fine Arts",
    majorTh: "สาขาวิชาการผลิตเสมือนและการออกแบบประสบการณ์โลกเสมือนจริง",
    majorEn: "Virtual Production and Immersive Experience Design"
  },

  // 3. คณะเทคโนโลยีสารสนเทศและนวัตกรรม
  {
    id: "it_b_cs",
    facultyId: "it",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิทยาศาสตรบัณฑิต",
    degreeEn: "Bachelor of Science",
    majorTh: "สาขาวิชาวิทยาการคอมพิวเตอร์",
    majorEn: "Computer Science"
  },
  {
    id: "it_b_it",
    facultyId: "it",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิทยาศาสตรบัณฑิต",
    degreeEn: "Bachelor of Science",
    majorTh: "สาขาวิชาเทคโนโลยีสารสนเทศ",
    majorEn: "Information Technology"
  },
  {
    id: "it_b_game",
    facultyId: "it",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิทยาศาสตรบัณฑิต",
    degreeEn: "Bachelor of Science",
    majorTh: "สาขาวิชาเกมและสื่อเชิงโต้ตอบ",
    majorEn: "Games and Interactive Media"
  },
  {
    id: "it_m_ds",
    facultyId: "it",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรวิทยาศาสตรมหาบัณฑิต",
    degreeEn: "Master of Science",
    majorTh: "สาขาวิชาเทคโนโลยีสารสนเทศและวิทยาการข้อมูล",
    majorEn: "Information Technology and Data Science"
  },

  // 4. คณะนิติศาสตร์
  {
    id: "law_b_law",
    facultyId: "law",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิติศาสตรบัณฑิต",
    degreeEn: "Bachelor of Laws",
    majorTh: "สาขาวิชานิติศาสตร์",
    majorEn: "Law Program"
  },
  {
    id: "law_m_law",
    facultyId: "law",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรนิติศาสตรมหาบัณฑิต",
    degreeEn: "Master of Laws",
    majorTh: "สาขาวิชานิติศาสตร์",
    majorEn: "Laws Program"
  },

  // 5. คณะนิเทศศาสตร์
  {
    id: "comm_b_cnm",
    facultyId: "communication",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาการสื่อสารและสื่อใหม่",
    majorEn: "Communication and New Media"
  },
  {
    id: "comm_b_broadcasting",
    facultyId: "communication",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาวิทยุกระจายเสียง วิทยุโทรทัศน์ และ การผลิตสื่อสตรีมมิ่ง",
    majorEn: "Broadcasting and Streaming Media Production"
  },
  {
    id: "comm_b_creative",
    facultyId: "communication",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาการผลิตเนื้อหาสร้างสรรค์และประสบการณ์ดิจิทัล",
    majorEn: "Creative Content Production and Digital Experience"
  },
  {
    id: "comm_b_pa",
    facultyId: "communication",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปบัณฑิต",
    degreeEn: "Bachelor of Fine Arts",
    majorTh: "สาขาวิชาศิลปะการแสดง",
    majorEn: "Performing Arts"
  },
  {
    id: "comm_b_event",
    facultyId: "communication",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการผลิตอีเว้นท์ และการจัดการนิทรรศการและการประชุม",
    majorEn: "Event Production and MICE Management"
  },
  {
    id: "comm_b_influencer",
    facultyId: "communication",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาการสร้างสรรค์และการสร้างแบรนด์อินฟลูเอนเซอร์ระดับสากล",
    majorEn: "Global Creator and Influencer Branding"
  },
  {
    id: "comm_m_brand",
    facultyId: "communication",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรนิเทศศาสตรมหาบัณฑิต",
    degreeEn: "Master of Communication Arts",
    majorTh: "สาขาวิชาการบริหารแบรนด์และการสื่อสารเชิงกลยุทธ์",
    majorEn: "Strategic Brand and Communication Management"
  },
  {
    id: "comm_m_gc_intl",
    facultyId: "communication",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรนิเทศศาสตรมหาบัณฑิต",
    degreeEn: "Master of Communication Arts",
    majorTh: "สาขาวิชาการสื่อสารสากล (หลักสูตรนานาชาติ)",
    majorEn: "Global Communication (International Program)"
  },
  {
    id: "comm_m_dmc",
    facultyId: "communication",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรนิเทศศาสตรมหาบัณฑิต",
    degreeEn: "Master of Communication Arts",
    majorTh: "สาขาวิชาการสื่อสารการตลาดดิจิทัล",
    majorEn: "Digital Marketing Communications"
  },
  {
    id: "comm_d_gc_intl",
    facultyId: "communication",
    degreeLevel: "doctoral",
    degreeLevelTh: "ระดับปริญญาเอก",
    degreeLevelEn: "Doctoral",
    degreeTh: "หลักสูตรนิเทศศาสตรดุษฎีบัณฑิต",
    degreeEn: "Doctor of Communication Arts",
    majorTh: "สาขาวิชาการสื่อสารสากล (หลักสูตรนานาชาติ)",
    majorEn: "Global Communication (International Program)"
  },
  {
    id: "comm_d_brand",
    facultyId: "communication",
    degreeLevel: "doctoral",
    degreeLevelTh: "ระดับปริญญาเอก",
    degreeLevelEn: "Doctoral",
    degreeTh: "หลักสูตรนิเทศศาสตรดุษฎีบัณฑิต",
    degreeEn: "Doctor of Communication Arts",
    majorTh: "สาขาวิชาการบริหารแบรนด์และการสื่อสารเชิงกลยุทธ์",
    majorEn: "Strategic Brand and Communication Management"
  },

  // 6. คณะบริหารธุรกิจ
  {
    id: "bus_b_mkt",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการตลาด",
    majorEn: "Marketing"
  },
  {
    id: "bus_b_fin",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการเงิน",
    majorEn: "Finance"
  },
  {
    id: "bus_b_mgmt",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการจัดการ",
    majorEn: "Management"
  },
  {
    id: "bus_b_ibm",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการจัดการธุรกิจระหว่างประเทศ",
    majorEn: "International Business Management"
  },
  {
    id: "bus_b_log",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการจัดการโลจิสติกส์และโซ่อุปทาน",
    majorEn: "Logistics and Supply Chain Management"
  },
  {
    id: "bus_b_fip",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการวางแผนการเงินและการลงทุน",
    majorEn: "Financial and Investment Planning"
  },
  {
    id: "bus_b_dmkt",
    facultyId: "business",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการตลาดดิจิทัล",
    majorEn: "Digital Marketing"
  },
  {
    id: "bus_m_mba_th",
    facultyId: "business",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรบริหารธุรกิจมหาบัณฑิต",
    degreeEn: "Master of Business Administration",
    majorTh: "สาขาวิชาบริหารธุรกิจ (หลักสูตรภาษาไทย)",
    majorEn: "Business Administration"
  },
  {
    id: "bus_m_mba_en",
    facultyId: "business",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรบริหารธุรกิจมหาบัณฑิต",
    degreeEn: "Master of Business Administration",
    majorTh: "สาขาวิชาบริหารธุรกิจ (หลักสูตรภาษาอังกฤษ)",
    majorEn: "Business Administration (English Program)"
  },
  {
    id: "bus_m_inno_intl",
    facultyId: "business",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรบริหารธุรกิจมหาบัณฑิต",
    degreeEn: "Master of Business Administration",
    majorTh: "สาขาวิชาการจัดการนวัตกรรม (หลักสูตรนานาชาติ)",
    majorEn: "Innovation Management (International Program)"
  },
  {
    id: "bus_m_emit",
    facultyId: "business",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรบริหารธุรกิจมหาบัณฑิต",
    degreeEn: "Master of Business Administration",
    majorTh: "สาขาวิชาการจัดการศึกษาผ่านระบบเทคโนโลยีสารสนเทศ",
    majorEn: "Educational Management through Information Technology"
  },

  // 7. คณะบัญชี
  {
    id: "acc_b_acc",
    facultyId: "accounting",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบัญชีบัณฑิต",
    degreeEn: "Bachelor of Accounting",
    majorTh: "สาขาวิชาบัญชี",
    majorEn: "Accounting Program"
  },

  // 8. คณะมนุษยศาสตร์และการจัดการการท่องเที่ยว
  {
    id: "hum_b_eng",
    facultyId: "humanities",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาภาษาอังกฤษ",
    majorEn: "English"
  },
  {
    id: "hum_b_cruise",
    facultyId: "humanities",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการจัดการการท่องเที่ยวและเรือสำราญ",
    majorEn: "Tourism and Cruise Management"
  },
  {
    id: "hum_b_hotel",
    facultyId: "humanities",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการจัดการการโรงแรม",
    majorEn: "Hotel Management"
  },
  {
    id: "hum_b_airline",
    facultyId: "humanities",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการจัดการธุรกิจสายการบิน",
    majorEn: "Airline Business Management"
  },
  {
    id: "hum_m_inno_intl",
    facultyId: "humanities",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรศิลปศาสตรมหาบัณฑิต",
    degreeEn: "Master of Arts",
    majorTh: "สาขาวิชานวัตกรรมการจัดการการท่องเที่ยวและการบริการ",
    majorEn: "Tourism and Hospitality Management Innovation (International Program)"
  },
  {
    id: "hum_b_culinary",
    facultyId: "humanities",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาศิลปะการประกอบอาหารและการจัดการการบริการธุรกิจร้านอาหาร",
    majorEn: "Culinary Arts and Restaurant Service Management"
  },

  // 9. คณะวิศวกรรมศาสตร์
  {
    id: "eng_b_ee",
    facultyId: "engineering",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิศวกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Engineering",
    majorTh: "สาขาวิชาวิศวกรรมไฟฟ้า",
    majorEn: "Electrical Engineering"
  },
  {
    id: "eng_b_cre",
    facultyId: "engineering",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิศวกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Engineering",
    majorTh: "สาขาวิชาวิศวกรรมคอมพิวเตอร์และหุ่นยนต์",
    majorEn: "Computer and Robotics Engineering"
  },
  {
    id: "eng_b_mee",
    facultyId: "engineering",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิศวกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Engineering",
    majorTh: "สาขาวิชาวิศวกรรมมัลติมีเดียและเอ็นเตอร์เทนเมนต์",
    majorEn: "Multimedia and Entertainment Engineering"
  },
  {
    id: "eng_b_ai_ds",
    facultyId: "engineering",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิศวกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Engineering",
    majorTh: "สาขาวิชาวิศวกรรมปัญญาประดิษฐ์และวิทยาการข้อมูล",
    majorEn: "Artificial Intelligence Engineering and Data Science"
  },
  {
    id: "eng_m_ece_intl",
    facultyId: "engineering",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรวิศวกรรมศาสตรมหาบัณฑิต",
    degreeEn: "Master of Engineering",
    majorTh: "สาขาวิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ (หลักสูตรนานาชาติ)",
    majorEn: "Electrical & Computer Engineering (International Program)"
  },
  {
    id: "eng_d_ece_intl",
    facultyId: "engineering",
    degreeLevel: "doctoral",
    degreeLevelTh: "ระดับปริญญาเอก",
    degreeLevelEn: "Doctoral",
    degreeTh: "หลักสูตรวิศวกรรมศาสตรดุษฎีบัณฑิต",
    degreeEn: "D.Eng. in Electrical and Computer Engineering",
    majorTh: "สาขาวิชาวิศวกรรมไฟฟ้าและคอมพิวเตอร์ (หลักสูตรนานาชาติ)",
    majorEn: "Electrical and Computer Engineering (International Program)"
  },

  // 10. คณะศิลปกรรมศาสตร์
  {
    id: "fa_b_cmd",
    facultyId: "fine_arts",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Fine and Applied Arts",
    majorTh: "สาขาวิชาการออกแบบนิเทศศิลป์",
    majorEn: "Communication Design"
  },
  {
    id: "fa_b_fashion",
    facultyId: "fine_arts",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Fine and Applied Arts",
    majorTh: "สาขาวิชาการออกแบบแฟชั่น",
    majorEn: "Fashion Design"
  },
  {
    id: "fa_b_art_design",
    facultyId: "fine_arts",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Fine and Applied Arts",
    majorTh: "สาขาวิชาศิลปะและการออกแบบ",
    majorEn: "Art and Design"
  },

  // 11. คณะเศรษฐศาสตร์และการลงทุน
  {
    id: "econ_b_econ",
    facultyId: "economics",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรเศรษฐศาสตรบัณฑิต",
    degreeEn: "Bachelor of Economics",
    majorTh: "สาขาวิชาเศรษฐศาสตร์",
    majorEn: "Economics Program"
  },

  // 12. คณะสถาปัตยกรรมศาสตร์
  {
    id: "arch_b_arch5",
    facultyId: "architecture",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรสถาปัตยกรรมศาสตรบัณฑิต",
    degreeEn: "Bachelor of Architecture",
    majorTh: "สาขาวิชาสถาปัตยกรรม (หลักสูตร 5 ปี)",
    majorEn: "Architecture Program"
  },
  {
    id: "arch_b_interior",
    facultyId: "architecture",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปบัณฑิต",
    degreeEn: "Bachelor of Fine Arts",
    majorTh: "สาขาวิชาสถาปัตยกรรมภายใน",
    majorEn: "Interior Architecture"
  },
  {
    id: "arch_m_arch",
    facultyId: "architecture",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรสถาปัตยกรรมศาสตรมหาบัณฑิต",
    degreeEn: "Master of Architecture",
    majorTh: "สาขาวิชาสถาปัตยกรรม",
    majorEn: "Architecture Program"
  },

  // 13. วิทยาลัยนานาชาติ
  {
    id: "intl_b_mkt",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาการตลาด (หลักสูตรนานาชาติ)",
    majorEn: "Marketing (International Program)"
  },
  {
    id: "intl_b_ba",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาบริหารธุรกิจ (หลักสูตรนานาชาติ)",
    majorEn: "Business Administration (International Program)"
  },
  {
    id: "intl_b_imp",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาการผลิตสื่อนวัตกรรม (หลักสูตรนานาชาติ)",
    majorEn: "Innovative Media Production (International Program)"
  },
  {
    id: "intl_b_mc",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรนิเทศศาสตรบัณฑิต",
    degreeEn: "Bachelor of Communication Arts",
    majorTh: "สาขาวิชาสื่อและการสื่อสาร (หลักสูตรนานาชาติ)",
    majorEn: "Media and Communication (International Program)"
  },
  {
    id: "intl_b_be",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาภาษาอังกฤษธุรกิจ (หลักสูตรนานาชาติ)",
    majorEn: "Business English (International Program)"
  },
  {
    id: "intl_b_ithm",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการจัดการท่องเที่ยวและการบริการนานาชาติ (หลักสูตรนานาชาติ)",
    majorEn: "International Tourism and Hospitality Management (International Program)"
  },
  {
    id: "intl_b_cad",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาศิลปะการประกอบและออกแบบอาหาร (หลักสูตรนานาชาติ)",
    majorEn: "Culinary Arts and Design (International Program)"
  },
  {
    id: "intl_b_ccd",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาการออกแบบนิเทศศิลป์เชิงสร้างสรรค์ (หลักสูตรนานาชาติ)",
    majorEn: "Creative Communication Design (International Program)"
  },
  {
    id: "intl_m_kmi",
    facultyId: "international",
    degreeLevel: "master",
    degreeLevelTh: "ระดับปริญญาโท",
    degreeLevelEn: "Master",
    degreeTh: "หลักสูตรบริหารธุรกิจมหาบัณฑิต",
    degreeEn: "Master of Business Administration",
    majorTh: "สาขาวิชาการจัดการความรู้และนวัตกรรม (หลักสูตรนานาชาติ)",
    majorEn: "Knowledge Management and Innovation Management (International Program)"
  },
  {
    id: "intl_d_kmi",
    facultyId: "international",
    degreeLevel: "doctoral",
    degreeLevelTh: "ระดับปริญญาเอก",
    degreeLevelEn: "Doctoral",
    degreeTh: "หลักสูตรปรัชญาดุษฎีบัณฑิต",
    degreeEn: "Ph.D. in Knowledge Management and Innovation Management",
    majorTh: "สาขาวิชาการจัดการความรู้และนวัตกรรม (หลักสูตรนานาชาติ)",
    majorEn: "Knowledge Management and Innovation Management (International Program)"
  },
  {
    id: "intl_b_cs",
    facultyId: "international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรวิทยาศาสตรบัณฑิต",
    degreeEn: "Bachelor of Science",
    majorTh: "สาขาวิชาวิทยาการคอมพิวเตอร์ (หลักสูตรนานาชาติ)",
    majorEn: "Computer Science (International Program)"
  },

  // 14. วิทยาลัยนานาชาติจีน
  {
    id: "cintl_b_bc",
    facultyId: "chinese_international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรศิลปศาสตรบัณฑิต",
    degreeEn: "Bachelor of Arts",
    majorTh: "สาขาวิชาภาษาจีนธุรกิจ",
    majorEn: "Business Chinese"
  },
  {
    id: "cintl_b_bap",
    facultyId: "chinese_international",
    degreeLevel: "bachelor",
    degreeLevelTh: "ระดับปริญญาตรี",
    degreeLevelEn: "Bachelor",
    degreeTh: "หลักสูตรบริหารธุรกิจบัณฑิต",
    degreeEn: "Bachelor of Business Administration",
    majorTh: "สาขาวิชาบริหารธุรกิจบัณฑิต (หลักสูตรสองภาษา)",
    majorEn: "Business Administration Program (Bilingual Program)"
  }
];

export const getProgramsByFaculty = (facultyId: string): ProgramItem[] => {
  if (!facultyId) return [];
  const matchedFac = FACULTIES.find(
    (f) => f.id === facultyId || f.th === facultyId || f.en === facultyId
  );
  const targetId = matchedFac ? matchedFac.id : facultyId;
  return BU_PROGRAMS.filter((p) => p.facultyId === targetId);
};

export interface Question {
  id: string;
  order: number;
  orderLabel?: string;
  groupTitleTh?: string;
  groupTitleEn?: string;
  aspectTh: string;
  aspectEn: string;
  textTh: string;
  textEn: string;
  descriptionTh?: string;
  descriptionEn?: string;
}

// 18 Standard Questions
export const DEFAULT_QUESTIONS: Question[] = [
  // ด้านที่ 1 ด้านการจัดการศึกษา (Educational Management)
  {
    id: "q1",
    order: 1,
    orderLabel: "1",
    aspectTh: "ด้านการจัดการศึกษา",
    aspectEn: "Educational Management",
    textTh: "คุณภาพหลักสูตร",
    textEn: "Curriculum Quality",
    descriptionTh: "เนื้อหาวิชามีความเหมาะสม ทันสมัย สอดคล้องกับผลลัพธ์การเรียนรู้ของหลักสูตร มีการจัดลำดับความรู้เป็นระบบ เอื้อต่อการเรียนรู้ของผู้เรียน และสามารถนำไปประยุกต์ใช้ในชีวิตประจำวันและการประกอบอาชีพในอนาคตได้",
    descriptionEn: "The course content is appropriate, up to date, aligned with the program learning outcomes, systematically structured, facilitates students’ learning, and can be applied to daily life and future careers."
  },
  {
    id: "q2",
    order: 2,
    orderLabel: "2",
    aspectTh: "ด้านการจัดการศึกษา",
    aspectEn: "Educational Management",
    textTh: "การจัดการเรียนการสอน",
    textEn: "Teaching and Learning Management",
    descriptionTh: "วิธีการจัดการเรียนการสอนและเทคนิคการถ่ายทอดความรู้ที่เหมาะสมกับลักษณะผู้เรียนและเนื้อหาวิชา มีการใช้สื่อหรือเทคโนโลยีอย่างเหมาะสม กระตุ้นการมีส่วนร่วมของนักศึกษา และช่วยให้ผู้เรียนบรรลุผลลัพธ์การเรียนรู้ได้อย่างมีประสิทธิภาพ",
    descriptionEn: "The teaching methods and instructional techniques are appropriate to the nature of learners and the subject content, make effective use of media and technology, encourage student participation, and enable learners to achieve the intended learning outcomes effectively."
  },
  // ข้อ 3: การส่งเสริมและพัฒนานักศึกษาตามอัตลักษณ์ของมหาวิทยาลัย (4 ข้อย่อย)
  {
    id: "q3_1",
    order: 3.1,
    orderLabel: "3.1",
    groupTitleTh: "3. การส่งเสริมและพัฒนานักศึกษาตามอัตลักษณ์ของมหาวิทยาลัย",
    groupTitleEn: "3. Fostering and Developing Students in Line with University Identity",
    aspectTh: "ด้านการจัดการศึกษา",
    aspectEn: "Educational Management",
    textTh: "ด้านความคิดสร้างสรรค์",
    textEn: "Creativity",
    descriptionTh: "หมายถึง การส่งเสริมให้นักศึกษามีความคิดสร้างสรรค์มีความคิดริเริ่มและกล้าแสดงออก",
    descriptionEn: "Refers to encouraging students to be creative, initiative-taking, and confident in expressing themselves."
  },
  {
    id: "q3_2",
    order: 3.2,
    orderLabel: "3.2",
    groupTitleTh: "3. การส่งเสริมและพัฒนานักศึกษาตามอัตลักษณ์ของมหาวิทยาลัย",
    groupTitleEn: "3. Fostering and Developing Students in Line with University Identity",
    aspectTh: "ด้านการจัดการศึกษา",
    aspectEn: "Educational Management",
    textTh: "ด้านจิตวิญญาณความเป็นผู้ประกอบการ",
    textEn: "Entrepreneurial Spirit",
    descriptionTh: "หมายถึง การส่งเสริมให้นักศึกษามีจิตวิญญาณของความเป็นผู้ประกอบการ คิด ประพฤติ และปฏิบัติเสมือนเป็นเจ้าของกิจการ กระตือรือร้น ใฝ่รู้ มองหาโอกาส มุ่งมั่นสร้างความเติบโตให้องค์กร ใช้จ่ายอย่างคุ้มค่า",
    descriptionEn: "Refers to fostering an entrepreneurial mindset—thinking, behaving, and acting like a business owner, being enthusiastic, eager to learn, seeking opportunities, committed to organizational growth, and spending cost-effectively."
  },
  {
    id: "q3_3",
    order: 3.3,
    orderLabel: "3.3",
    groupTitleTh: "3. การส่งเสริมและพัฒนานักศึกษาตามอัตลักษณ์ของมหาวิทยาลัย",
    groupTitleEn: "3. Fostering and Developing Students in Line with University Identity",
    aspectTh: "ด้านการจัดการศึกษา",
    aspectEn: "Educational Management",
    textTh: "ด้านความเป็นสากล",
    textEn: "Global Mindset / Internationalization",
    descriptionTh: "หมายถึง การส่งเสริมให้นักศึกษามีทักษะการสื่อสารในระดับสากล เปิดรับความหลากหลายทางวัฒนธรรม และเข้าใจบริบทและการเปลี่ยนแปลง ของโลก",
    descriptionEn: "Refers to encouraging students to develop international communication skills, embrace cultural diversity, and understand global contexts and transformations."
  },
  {
    id: "q3_4",
    order: 3.4,
    orderLabel: "3.4",
    groupTitleTh: "3. การส่งเสริมและพัฒนานักศึกษาตามอัตลักษณ์ของมหาวิทยาลัย",
    groupTitleEn: "3. Fostering and Developing Students in Line with University Identity",
    aspectTh: "ด้านการจัดการศึกษา",
    aspectEn: "Educational Management",
    textTh: "ด้านการใช้เทคโนโลยี",
    textEn: "Technology Utilization",
    descriptionTh: "หมายถึง การส่งเสริมให้นักศึกษามีความรอบรู้ และสามารถเลือกใช้เทคโนโลยีได้อย่างเหมาะสม มีประสิทธิภาพ และรู้เท่าทัน เพื่อการสื่อสาร การค้นคว้าข้อมูล และการประยุกต์ใช้ในการเรียนรู้และการทำงาน",
    descriptionEn: "Refers to equipping students with technological literacy to select and use technology appropriately, efficiently, and critically for communication, research, learning, and workplace application."
  },
  // ด้านที่ 2 ด้านการบริการนักศึกษา (Student Support Services)
  {
    id: "q4",
    order: 4,
    orderLabel: "4",
    aspectTh: "ด้านการบริการนักศึกษา",
    aspectEn: "Student Support Services",
    textTh: "การให้คำแนะนำหรือคำปรึกษาทางวิชาการ เช่น ด้านการเรียนการสอน เป็นต้น",
    textEn: "Academic Guidance or Counseling (e.g., Teaching and Learning)",
    descriptionTh: "หมายถึง การดูแล การช่วยเหลือ การติดตามความก้าวหน้า และการให้ข้อมูลที่เกี่ยวกับการเรียน การลงทะเบียน การแก้ไขปัญหาทางการเรียน ภาระงาน และการวางแผนการศึกษา เพื่อสนับสนุนให้นักศึกษาสามารถเรียนได้อย่างราบรื่นและประสบความสำเร็จตามเป้าหมายของหลักสูตร",
    descriptionEn: "Refers to supervision, assistance, progress monitoring, and the provision of information related to study plans, course registration, academic problem-solving, workload, and educational planning to help students study smoothly and achieve the program’s learning goals."
  },
  {
    id: "q5",
    order: 5,
    orderLabel: "5",
    aspectTh: "ด้านการบริการนักศึกษา",
    aspectEn: "Student Support Services",
    textTh: "การให้คำแนะนำหรือคำปรึกษาในเรื่องการปรับตัว/การใช้ชีวิตในมหาวิทยาลัย",
    textEn: "Counseling on Adjustment and University Life",
    descriptionTh: "หมายถึง การให้การดูแล ช่วยเหลือ และให้ข้อมูลที่เกี่ยวกับการปรับตัวด้านการเรียน การใช้ชีวิต การบริหารเวลา การแก้ปัญหา และการเข้าสังคม เพื่อช่วยให้นักศึกษาสามารถใช้ชีวิตในมหาวิทยาลัยได้อย่างราบรื่นและมีความสุข",
    descriptionEn: "Refers to support, assistance, and provision of information concerning academic and social adjustment, time management, problem-solving, and social integration, to help students adapt well and enjoy university life."
  },
  {
    id: "q6",
    order: 6,
    orderLabel: "6",
    aspectTh: "ด้านการบริการนักศึกษา",
    aspectEn: "Student Support Services",
    textTh: "ข้อมูลการให้บริการต่าง ๆ ของหน่วยงานภายในคณะหรือมหาวิทยาลัย",
    textEn: "Information on Student Services Provided by Faculty or University Offices",
    descriptionTh: "หมายถึง ข้อมูลด้านการรับนักศึกษา ทุนการศึกษา/การกู้ยืมเงินเพื่อการศึกษา ข้อมูลด้านการฝึกงาน การพัฒนาบุคลิกภาพ/ทักษะด้านภาษา/การสื่อสาร แหล่งงาน และกิจกรรม BU Job Fair ข้อมูลข่าวสารความเคลื่อนไหวภายในและภายนอกมหาวิทยาลัย และข้อมูลด้านกิจกรรมพิเศษนอกหลักสูตร",
    descriptionEn: "Refers to information on student admission, scholarships /educational loans, internship opportunities, personality development/language and communication skills, career opportunities, and BU Job Fair activities, as well as news and updates within and outside the university, and information on extracurricular activities."
  },
  {
    id: "q7",
    order: 7,
    orderLabel: "7",
    aspectTh: "ด้านการบริการนักศึกษา",
    aspectEn: "Student Support Services",
    textTh: "การให้บริการของเจ้าหน้าที่ให้บริการแก่นักศึกษา",
    textEn: "Services Provided by Student Affairs Staff",
    descriptionTh: "หมายถึง การอำนวยความสะดวก การสื่อสาร และการให้ความช่วยเหลือนักศึกษาด้วยความสุภาพ และความเต็มใจของเจ้าหน้าที่ที่ให้บริการ",
    descriptionEn: "Refers to the assistance, communication, courtesy, and willingness of staff in providing services to students."
  },
  // ด้านที่ 3 ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้ (Facilities and Infrastructure)
  {
    id: "q8",
    order: 8,
    orderLabel: "8",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "ห้องเรียนและอุปกรณ์ในห้องเรียนเพียงพอและเหมาะสม",
    textEn: "Classrooms and equipment are sufficient and appropriate"
  },
  {
    id: "q9",
    order: 9,
    orderLabel: "9",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "ห้องปฏิบัติการ (Labs) เพียงพอและมีความปลอดภัย",
    textEn: "Laboratories are sufficient and safe."
  },
  {
    id: "q10",
    order: 10,
    orderLabel: "10",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "อุปกรณ์ที่ใช้ในห้องปฏิบัติการ (Labs) เพียงพอและทันสมัย",
    textEn: "Laboratory equipment is sufficient and up to date."
  },
  {
    id: "q11",
    order: 11,
    orderLabel: "11",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "ห้องสมุดมีหนังสือ E-book และสื่อการเรียนรู้ที่เพียงพอและทันสมัย",
    textEn: "The library has an adequate and up-to-date collection of books, e-books, and learning media."
  },
  {
    id: "q12",
    order: 12,
    orderLabel: "12",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "คอมพิวเตอร์มีจำนวนเพียงพอและทันสมัย",
    textEn: "Computers are sufficient in number and up to date."
  },
  {
    id: "q13",
    order: 13,
    orderLabel: "13",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "จุดเชื่อมต่ออินเตอร์เน็ต และสัญญาณ WIFI มีความเสถียรและครอบคลุม",
    textEn: "The internet connection and Wi-Fi signal are stable and widely available."
  },
  {
    id: "q14",
    order: 14,
    orderLabel: "14",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "สิ่งอำนวยความสะดวก เช่น สนามกีฬา ลานนันทนาการ และสถานที่พักผ่อน เพียงพอและเหมาะสม",
    textEn: "Facilities such as sports fields, recreation areas, and rest spaces are sufficient and appropriate."
  },
  {
    id: "q15",
    order: 15,
    orderLabel: "15",
    aspectTh: "ด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    aspectEn: "Facilities and Infrastructure",
    textTh: "การให้บริการของเจ้าหน้าที่ให้บริการด้านสิ่งอำนวยความสะดวกและสิ่งสนับสนุนการเรียนรู้",
    textEn: "Services Provided by facility and infrastructure Staff",
    descriptionTh: "หมายถึง ความสะดวก การสื่อสาร และความเต็มใจของเจ้าหน้าที่ที่ให้บริการด้านสิ่งอำนวยความสะดวกและสนับสนุนการเรียนรู้",
    descriptionEn: "Refers to the convenience, communication, and willingness of staff in providing facility and learning support services."
  }
];

export interface StudentResponse {
  id?: string;
  studentEmail: string;
  studentFacultyTh: string;
  studentFacultyEn: string;
  studentProgram?: string;
  part1Ratings: { [questionId: string]: number }; // rating 1-5
  part2ReceivedInfo: string[];
  part2ReceivedInfoOther?: string;
  part2Recommend: string; // "Yes" or "No"
  part2RecommendReasons?: string[];
  part2RecommendNoReason?: string;
  part2Adhere: string; // "Yes" or "No"
  part2AdhereReasons?: string[];
  part2AdhereNoReason?: string;
  part2ComplaintSubmitted: string; // "Yes" or "No"
  part2ComplaintDetail?: string;
  part2ComplaintSatisfaction: number; // 0-5
  part2ComplaintChannels?: string[];
  part2ComplaintChannelOther?: string;
  part2LoveLoyaltyProud: number; // 1-5
  part2LoveLoyaltyCooperate: number; // 1-5
  part2LoveLoyaltySustain: number; // 1-5
  part2ImproveSuggestions: string[];
  part2ImproveSuggestionOther?: string;
  createdAt: any; // Date | Timestamp
}

export const RECEIVED_INFO_OPTIONS = [
  { id: "info_1", th: "รายละเอียดหลักสูตรและแผนการเรียน", en: "Course Curriculum and Study Plan" },
  { id: "info_2", th: "ปรัชญาการศึกษา : Practical University", en: "Educational Philosophy : Practical University" },
  { id: "info_3", th: "ผลลัพธ์การเรียนรู้และเกณฑ์การวัดประเมินผล", en: "Program Learning Outcomes and Assessment Criteria" },
  { id: "info_4", th: "ระยะเวลาการศึกษาตลอดหลักสูตร/เกณฑ์การสำเร็จการศึกษา", en: "Course Duration/Criteria for Graduation" },
  { id: "info_5", th: "การแนะแนวทางเลือกในการประกอบอาชีพ", en: "Career guidance and information on career paths" },
];

export const RECOMMEND_REASONS = [
  { id: "rec_1", th: "มหาวิทยาลัยมีชื่อเสียงได้รับการยอมรับอย่างกว้างขวาง", en: "The university has a widely recognized reputation" },
  { id: "rec_2", th: "การเรียนการสอนทันสมัยและมีคุณภาพ", en: "Modern and high-quality teaching and learning" },
  { id: "rec_3", th: "หลักสูตรการเรียนการสอนทันสมัยและมีคุณภาพ", en: "Up-to-date and well-designed curriculum" },
  { id: "rec_4", th: "อาจารย์ผู้สอนมีความสามารถในการถ่ายทอดความรู้", en: "Competent and knowledgeable instructors" },
  { id: "rec_5", th: "อุปกรณ์การเรียนการสอนทันสมัยครบครัน", en: "Well-equipped and modern teaching facilities" },
  { id: "rec_6", th: "เป็นอีกหนึ่งทางเลือกในการศึกษาต่อ", en: "The university provides a good alternative for higher education" },
  { id: "rec_7", th: "สภาพแวดล้อมและบรรยากาศภายในมหาวิทยาลัย ดีประทับใจ", en: "Pleasant campus environment and atmosphere" },
  { id: "rec_8", th: "มหาวิทยาลัยมีความพร้อมในทุกด้าน", en: "The university is well-prepared in all aspects" },
  { id: "rec_9", th: "มีคณะ/สาขาวิชาให้เลือกเรียนหลากหลาย", en: "A wide range of faculties and programs to choose from" },
  { id: "rec_10", th: "มหาวิทยาลัยสอนให้กล้าคิดกล้าแสดงออก", en: "The university encourages creativity and self-expression" },
  { id: "rec_11", th: "การจัดการเรียนการสอนที่เน้นการปฏิบัติจริง", en: "Practical-oriented teaching and learning methods" },
  { id: "rec_12", th: "มหาวิทยาลัยมีความทันสมัยเป็นสากล", en: "The university is modern and internationally oriented" },
  { id: "rec_13", th: "อาจารย์ผู้สอนสอนเข้าใจได้ง่าย และใจดี", en: "Friendly and easy-to-understand lecturers" },
  { id: "rec_14", th: "ค่าบำรุงการศึกษา/ค่าเล่าเรียนมีความเหมาะสม", en: "Reasonable tuition and fees" },
  { id: "rec_15", th: "มหาวิทยาลัยส่งเสริมความคิดสร้างสรรค์", en: "The university promotes creativity" },
  { id: "rec_16", th: "คณะนิเทศศาสตร์มีชื่อเสียงโด่งดัง", en: "The Communication Arts Faculty has a strong reputation" },
  { id: "rec_17", th: "ได้รับการรับรองในเรื่องมาตรฐานหลักสูตรจากทางสำนักงานปลัดกระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม", en: "Accredited by the Ministry of Higher Education, Science, Research, and Innovation" }
];

export const ADHERE_REASONS = [
  { id: "adh_1", th: "สิ่งอำนวยความสะดวกในด้านต่าง ๆ ครบครัน", en: "Complete and adequate facilities" },
  { id: "adh_2", th: "หลักสูตรการเรียนการสอนที่มีคุณภาพครบถ้วน", en: "Comprehensive curriculum and teaching programs" },
  { id: "adh_3", th: "ปฏิบัติทุกด้านตามที่เคยประชาสัมพันธ์ไว้", en: "Implementation in all aspects as previously publicized" },
  { id: "adh_4", th: "ข้อมูลข่าวสารตรงตามที่เคยประชาสัมพันธ์เสม็ด", en: "Information consistent with previous publicity" },
  { id: "adh_5", th: "อุปกรณ์การเรียนการสอนครบครันและทันสมัย", en: "Modern and well-equipped instructional materials and equipment" },
  { id: "adh_6", th: "การบริการทางด้านการศึกษาและฝ่ายวิชาการ", en: "Educational services and academic support" },
  { id: "adh_7", th: "การประชาสัมพันธ์ข้อมูลข่าวสารผ่านช่องทางต่าง ๆ เช่น เว็บไซต์มหาวิทยาลัย Facebook อีเมลนักศึกษา", en: "Information dissemination through various channels (Website, Facebook, Email)" },
  { id: "adh_8", th: "มีการชี้แจงวัตถุประสงค์รายวิชา/โครงสร้างหลักสูตรที่ศึกษา", en: "Clear explanation of course objectives and curriculum structure" },
  { id: "adh_9", th: "ปฏิบัติเพียงบางด้านที่เคยประชาสัมพันธ์", en: "Implementation in only some aspects, as previously publicized" },
  { id: "adh_10", th: "อาจารย์ผู้สอนมีความสามารถในการถ่ายทอดความรู้ได้เป็นอย่างดี", en: "Instructors’ teaching competence and skill" },
  { id: "adh_11", th: "ความเอาใจใส่ดูแลนักศึกษาของทางมหาวิทยาลัย", en: "Care and attention dedicated to students" },
  { id: "adh_12", th: "การลงมือฝึกปฏิบัติจริงของนักศึกษา", en: "Hands-on practice and practical experience" },
  { id: "adh_13", th: "ระบบการให้คำปรึกษาและช่วยเหลือนักศึกษา", en: "Student counseling and support system" },
  { id: "adh_14", th: "เจ้าหน้าที่มีความสุภาพเรียบร้อย เต็มใจให้บริการแก่นักศึกษา", en: "Polite and service-minded staff" },
  { id: "adh_15", th: "มีการพัฒนามหาวิทยาลัยอย่างต่อเนื่องตลอดเวลา", en: "Continuous and noticeable university development" },
  { id: "adh_16", th: "การปรับปรุงระบบต่าง ๆ ภายในมหาวิทยาลัย เช่น URSA BU Mobile ระบบการลงทะเบียน", en: "Improvement of internal systems such as URSA, BU Mobile, and registration systems" },
  { id: "adh_17", th: "ได้เรียนตรงตามวิชาที่ลงทะเบียนเรียนไว้จริงๆ", en: "Courses delivered exactly as registered" },
  { id: "adh_18", th: "กิจกรรมสำหรับนักศึกษาให้เลือกหลากหลายตรงใจ", en: "A variety of student activities to choose from" },
  { id: "adh_19", th: "ทุนการศึกษา/สวัสดิการนักศึกษาที่ตรงใจและเหมาะสม", en: "Scholarships and student welfare services" },
  { id: "adh_20", th: "สภาพแวดล้อมและบรรยากาศภายในมหาวิทยาลัยที่น่าเรียนรู้", en: "Pleasant and supportive campus environment" }
];

export const COMPLAINT_CHANNELS = [
  { id: "chan_1", th: "ยื่นเรื่องร้องเรียนด้วยตนเอง", en: "Via my own submission of the complaint" },
  { id: "chan_2", th: "Line BU One Stop / BU Safe (Via Line: @bu1stop / BU Safe)", en: "Via Line BU One Stop: @bu1stop / BU Safe" },
  { id: "chan_3", th: "อีเมล์ (e-mail) (Via BU e-mail: Info@bu.ac.th)", en: "Via BU e-mail: Info@bu.ac.th" },
  { id: "chan_4", th: "Facebook มหาวิทยาลัยกรุงเทพ", en: "Via Facebook of Bangkok University" },
  { id: "chan_5", th: "BU Contact Center", en: "Via BU Contact Center" }
];

export const IMPROVE_SUGGESTIONS = [
  { id: "imp_1", th: "ควรปรับลดค่าบำรุงการศึกษา/ค่าเล่าเรียน", en: "Reduce tuition and related fees." },
  { id: "imp_2", th: "ควรจัดตารางเวลาเดินรถรับส่งภายในมหาวิทยาลัยให้สะดวกรวดเร็ว", en: "Improve shuttle bus schedule for greater convenience." },
  { id: "imp_3", th: "ควรปรับปรุงคุณภาพของอาจารย์ผู้สอน", en: "Enhance the quality of instructors." },
  { id: "imp_4", th: "ควรมีการพัฒนามหาวิทยาลัยอย่างสม่ำเสมอ", en: "Continuously develop the university." },
  { id: "imp_5", th: "ควรปรับปรุงระบบการลงทะเบียนเรียน เช่น เพิ่ม/ถอนรายวิชา ลงทะเบียนล่าช้า เพิ่มจำนวนห้องเรียน แจ้งรายชื่ออาจารย์ผู้สอนประจำแต่ละวิชา", en: "Improve the registration system (e.g. add/drop, late reg, classroom allocation, instructor list announcements)." },
  { id: "imp_6", th: "ควรจัดการเรียนการสอนแบบผสมผสานระหว่างออนไลน์และออนไซต์ตามความเหมาะสม", en: "Implement blended learning (online and on-site) appropriately." },
  { id: "imp_7", th: "ควรปรับปรุงการประชาสัมพันธ์ข้อมูลข่าวสารต่าง ๆ ให้มีความถูกต้องและทั่วถึง", en: "Improve accuracy and accessibility of university announcements." },
  { id: "imp_8", th: "ควรเพิ่ม/ปรับปรุงสิ่งอำนวยความสะดวก เช่น ลิฟต์ และบันไดเลื่อน ห้องพักผ่อน", en: "Upgrade facilities such as elevators and rest areas." },
  { id: "imp_9", th: "ควรเพิ่ม/พัฒนาพื้นที่จอดรถและทำหลังคาบังแดดสำหรับที่จอดรถ", en: "Expand and improve parking areas with shaded roofing." },
  { id: "imp_10", th: "ควรรับฟังความคิดเห็นของนักศึกษาและนำไปปรับปรุงแก้ไข", en: "Collect and consider student feedback for improvement." },
  { id: "imp_11", th: "ควรปรับปรุงอุปกรณ์การเรียนการสอนให้ทันสมัยและเพียงพอต่อการใช้งาน", en: "Upgrade teaching equipment to be modern and sufficient." },
  { id: "imp_12", th: "ควรปรับปรุงระบบต่าง ๆ ภายในมหาวิทยาลัย", en: "Improve university internal systems." },
  { id: "imp_13", th: "ควรปรับปรุงการให้บริการของบุคลากร", en: "Improve service quality of administrative staff." },
  { id: "imp_14", th: "ควรแก้ไขปัญหาเกรดออกช้า", en: "Resolve issues regarding delayed grade releases." },
  { id: "imp_15", th: "ควรพัฒนามาตรฐานของมหาวิทยาลัย", en: "Enhance the overall university standards." }
];
