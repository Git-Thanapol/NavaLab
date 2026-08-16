// One-off scaffold script: generates placeholder SVG avatars/covers and
// placeholder Markdown/JSON content so the site has 10 filled member
// profiles to design/test against before real data is entered via the CMS.
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as yaml from 'js-yaml';

const root = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(root, '..');

const NAVY_TONES = ['#1A2338', '#22304F', '#0E7C86', '#2C3A5C', '#173042'];

function slugify(en) {
  return en
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function initials(en) {
  return en
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function memberAvatarSvg(name, tone) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="${tone}"/>
  <circle cx="400" cy="430" r="230" fill="#ffffff" fill-opacity="0.06"/>
  <text x="400" y="460" font-family="Inter, Arial, sans-serif" font-size="180" font-weight="700" fill="#ffffff" fill-opacity="0.9" text-anchor="middle" dominant-baseline="middle">${initials(name)}</text>
</svg>`;
}

function coverSvg(title, tone, seed) {
  const x2 = 300 + (seed % 5) * 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <rect width="1200" height="800" fill="${tone}"/>
  <path d="M0 650 C ${x2} 500 ${1200 - x2} 750 1200 600 L1200 800 L0 800 Z" fill="#ffffff" fill-opacity="0.06"/>
  <circle cx="${140 + seed * 30}" cy="180" r="90" fill="#ffffff" fill-opacity="0.08"/>
</svg>`;
}

const members = [
  {
    name: { th: 'นารา ไชยสิทธิ์', en: 'Nara Chaiyasit' },
    role: { th: 'ผู้ก่อตั้ง และหัวหน้าฝ่ายพลศาสตร์ของไหลทางทะเล', en: 'Founder & Lead, Marine Hydrodynamics' },
    bioShort: {
      th: 'ผู้ก่อตั้ง NavaLab เชี่ยวชาญด้านพลศาสตร์ของไหลและการออกแบบตัวเรือประสิทธิภาพสูง',
      en: 'Founder of NavaLab, specializing in hydrodynamics and high-efficiency hull design.',
    },
    bio: {
      th: 'นาราทำงานด้านพลศาสตร์ของไหลทางทะเลมากว่า 12 ปี ก่อตั้ง NavaLab เพื่อรวมนักวิจัยไทยที่สนใจเทคโนโลยีทางทะเลให้ทำงานร่วมกันอย่างเป็นระบบ สนใจเป็นพิเศษเรื่องการลดแรงต้านตัวเรือและการจำลองพลศาสตร์ของไหลด้วยคอมพิวเตอร์ (CFD)',
      en: 'Nara has worked in marine hydrodynamics for over 12 years and founded NavaLab to bring Thai maritime researchers together under one collaborative roof. Particular interest in hull drag reduction and computational fluid dynamics (CFD).',
    },
    expertise: {
      th: ['พลศาสตร์ของไหลเชิงคำนวณ (CFD)', 'การออกแบบตัวเรือ', 'การลดแรงต้าน'],
      en: ['Computational Fluid Dynamics', 'Hull Form Design', 'Drag Reduction'],
    },
    education: [
      { degree: { th: 'ปริญญาเอก', en: 'Ph.D.' }, field: { th: 'วิศวกรรมต่อเรือ', en: 'Naval Architecture' }, institution: { th: 'มหาวิทยาลัยเทคโนโลยีทางทะเล', en: 'Maritime Institute of Technology' }, year: 2016 },
    ],
    research: {
      current: [{ title: { th: 'ตัวเรือประหยัดพลังงานสำหรับเรือประมงพื้นบ้าน', en: 'Fuel-efficient hulls for small-scale fishing vessels' }, summary: { th: 'พัฒนารูปทรงตัวเรือที่ลดแรงต้านสำหรับเรือประมงขนาดเล็ก', en: 'Developing low-drag hull shapes for small fishing boats.' } }],
      completed: [{ title: { th: 'แบบจำลอง CFD สำหรับเรือบรรทุกสินค้าชายฝั่ง', en: 'CFD modeling for coastal cargo vessels' }, summary: { th: 'จำลองการไหลรอบตัวเรือเพื่อหาจุดปรับปรุงประสิทธิภาพเชื้อเพลิง', en: 'Simulated flow around hulls to identify fuel-efficiency gains.' }, year: 2022 }],
    },
    publications: [
      { title: 'Drag reduction strategies for coastal fishing vessels', authors: 'Chaiyasit, N. et al.', venue: 'Journal of Marine Engineering', year: 2023 },
    ],
    links: { email: 'nara@navalab.org' },
    featured: true,
  },
  {
    name: { th: 'กฤษดา วงศ์สุวรรณ', en: 'Kritsada Wongsuwan' },
    role: { th: 'วิศวกรต่อเรือ', en: 'Naval Architecture Researcher' },
    bioShort: {
      th: 'สนใจโครงสร้างตัวเรือและวัสดุน้ำหนักเบาสำหรับเรือรุ่นใหม่',
      en: 'Focused on hull structures and lightweight materials for next-generation vessels.',
    },
    bio: {
      th: 'กฤษดาศึกษาโครงสร้างตัวเรือและการเลือกใช้วัสดุที่เหมาะสมกับสภาพทะเลไทย ทำงานร่วมกับอู่ต่อเรือท้องถิ่นเพื่อทดสอบต้นแบบจริง',
      en: 'Kritsada studies hull structures and material selection suited to Thai sea conditions, working with local shipyards to test real prototypes.',
    },
    expertise: { th: ['โครงสร้างตัวเรือ', 'วัสดุน้ำหนักเบา', 'การวิเคราะห์ความแข็งแรง'], en: ['Hull Structures', 'Lightweight Materials', 'Structural Analysis'] },
    education: [{ degree: { th: 'ปริญญาโท', en: 'M.Eng.' }, field: { th: 'วิศวกรรมต่อเรือ', en: 'Naval Architecture' }, institution: { th: 'จุฬาลงกรณ์มหาวิทยาลัย', en: 'Chulalongkorn University' }, year: 2019 }],
    research: {
      current: [{ title: { th: 'วัสดุคอมโพสิตสำหรับเรือประมงขนาดเล็ก', en: 'Composite materials for small fishing boats' }, summary: { th: 'ทดสอบวัสดุทางเลือกที่ทนทานและเบากว่าไม้', en: 'Testing durable, lighter alternatives to timber hulls.' } }],
      completed: [],
    },
    publications: [],
    links: { email: 'kritsada@navalab.org' },
    featured: false,
  },
  {
    name: { th: 'ปิยวรรณ สุขสวัสดิ์', en: 'Piyawan Suksawat' },
    role: { th: 'หัวหน้าฝ่ายหุ่นยนต์ทางทะเล', en: 'Lead, Marine Robotics' },
    bioShort: { th: 'ออกแบบยานใต้น้ำอัตโนมัติสำหรับสำรวจแนวปะการัง', en: 'Designs autonomous underwater vehicles for reef surveying.' },
    bio: {
      th: 'ปิยวรรณพัฒนายานใต้น้ำไร้คนขับ (AUV) ที่ใช้สำรวจระบบนิเวศแนวปะการังในน่านน้ำไทย เน้นการออกแบบที่ต้นทุนต่ำและซ่อมบำรุงง่ายสำหรับชุมชนชายฝั่ง',
      en: 'Piyawan develops autonomous underwater vehicles (AUVs) for surveying reef ecosystems in Thai waters, with an emphasis on low-cost, community-maintainable designs.',
    },
    expertise: { th: ['ยานใต้น้ำอัตโนมัติ', 'ระบบควบคุมหุ่นยนต์', 'การสำรวจใต้ทะเล'], en: ['Autonomous Underwater Vehicles', 'Robotics Control Systems', 'Subsea Survey'] },
    education: [{ degree: { th: 'ปริญญาเอก', en: 'Ph.D.' }, field: { th: 'วิศวกรรมหุ่นยนต์', en: 'Robotics Engineering' }, institution: { th: 'สถาบันเทคโนโลยีพระจอมเกล้า', en: 'King Mongkut\'s Institute of Technology' }, year: 2020 }],
    research: {
      current: [{ title: { th: 'AUV ต้นทุนต่ำสำหรับสำรวจแนวปะการัง', en: 'Low-cost AUV for reef monitoring' }, summary: { th: 'พัฒนายานสำรวจที่ชุมชนท้องถิ่นดูแลต่อได้เอง', en: 'Building survey vehicles local communities can maintain themselves.' } }],
      completed: [{ title: { th: 'ต้นแบบยานใต้น้ำรุ่นแรก', en: 'First-generation AUV prototype' }, summary: { th: 'ทดสอบภาคสนามบริเวณอ่าวไทยตอนใน', en: 'Field-tested in the inner Gulf of Thailand.' }, year: 2021 }],
    },
    publications: [{ title: 'Low-cost AUV design for coral reef monitoring', authors: 'Suksawat, P., Chaiyasit, N.', venue: 'Marine Robotics Review', year: 2022, url: 'https://example.org/publication' }],
    links: { email: 'piyawan@navalab.org' },
    featured: true,
  },
  {
    name: { th: 'ธนกร บุญมี', en: 'Thanakorn Boonmee' },
    role: { th: 'นักวิจัยด้านการสำรวจระยะไกล', en: 'Ocean Remote Sensing Researcher' },
    bioShort: { th: 'ใช้ภาพถ่ายดาวเทียมติดตามคุณภาพน้ำชายฝั่ง', en: 'Uses satellite imagery to monitor coastal water quality.' },
    bio: {
      th: 'ธนกรทำงานกับข้อมูลภาพถ่ายดาวเทียมและเซนเซอร์ระยะไกลเพื่อติดตามคุณภาพน้ำและการเปลี่ยนแปลงชายฝั่งของไทยแบบต่อเนื่อง',
      en: 'Thanakorn works with satellite imagery and remote sensors to continuously track water quality and coastline change along the Thai coast.',
    },
    expertise: { th: ['การสำรวจระยะไกล', 'ภาพถ่ายดาวเทียม', 'การติดตามคุณภาพน้ำ'], en: ['Remote Sensing', 'Satellite Imagery', 'Water Quality Monitoring'] },
    education: [{ degree: { th: 'ปริญญาโท', en: 'M.Sc.' }, field: { th: 'สมุทรศาสตร์', en: 'Oceanography' }, institution: { th: 'มหาวิทยาลัยเกษตรศาสตร์', en: 'Kasetsart University' }, year: 2018 }],
    research: { current: [{ title: { th: 'ติดตามคุณภาพน้ำอ่าวไทยด้วยดาวเทียม', en: 'Satellite water-quality tracking in the Gulf of Thailand' }, summary: { th: 'สร้างแดชบอร์ดติดตามค่าคุณภาพน้ำรายสัปดาห์', en: 'Building a weekly water-quality tracking dashboard.' } }], completed: [] },
    publications: [],
    links: { email: 'thanakorn@navalab.org' },
    featured: false,
  },
  {
    name: { th: 'สุภาภรณ์ รัตนกุล', en: 'Supaporn Rattanakul' },
    role: { th: 'หัวหน้าฝ่ายวิศวกรรมชายฝั่ง', en: 'Lead, Coastal Engineering' },
    bioShort: { th: 'ศึกษาการกัดเซาะชายฝั่งและแนวทางป้องกันที่สอดคล้องกับธรรมชาติ', en: 'Studies coastal erosion and nature-based protection approaches.' },
    bio: {
      th: 'สุภาภรณ์เชี่ยวชาญด้านวิศวกรรมชายฝั่ง เน้นแนวทางป้องกันการกัดเซาะที่ทำงานร่วมกับระบบนิเวศ เช่น แนวป่าชายเลนเทียม แทนโครงสร้างคอนกรีตแบบดั้งเดิม',
      en: 'Supaporn specializes in coastal engineering, favoring erosion-control approaches that work with natural ecosystems — such as engineered mangrove buffers — over traditional concrete structures.',
    },
    expertise: { th: ['วิศวกรรมชายฝั่ง', 'การกัดเซาะชายฝั่ง', 'แนวทางแก้ปัญหาเชิงธรรมชาติ'], en: ['Coastal Engineering', 'Erosion Control', 'Nature-based Solutions'] },
    education: [{ degree: { th: 'ปริญญาเอก', en: 'Ph.D.' }, field: { th: 'วิศวกรรมชายฝั่ง', en: 'Coastal Engineering' }, institution: { th: 'มหาวิทยาลัยเทคโนโลยีทางทะเล', en: 'Maritime Institute of Technology' }, year: 2017 }],
    research: {
      current: [{ title: { th: 'แนวกันคลื่นจากป่าชายเลนเทียม', en: 'Engineered mangrove wave barriers' }, summary: { th: 'ทดสอบแนวป่าชายเลนปลูกใหม่เพื่อลดพลังงานคลื่น', en: 'Testing replanted mangrove buffers to dissipate wave energy.' } }],
      completed: [{ title: { th: 'แผนที่ความเสี่ยงการกัดเซาะชายฝั่งอ่าวไทย', en: 'Erosion risk mapping of the Gulf of Thailand coastline' }, summary: { th: 'จัดทำแผนที่ความเสี่ยงระดับจังหวัด', en: 'Produced province-level erosion risk maps.' }, year: 2021 }],
    },
    publications: [{ title: 'Nature-based erosion control along the Gulf of Thailand', authors: 'Rattanakul, S.', venue: 'Coastal Engineering Journal', year: 2021, doi: '10.1000/example.doi' }],
    links: { email: 'supaporn@navalab.org' },
    featured: true,
  },
  {
    name: { th: 'เอกพล ศรีสุวรรณ', en: 'Ekkapol Srisuwan' },
    role: { th: 'นักวิจัยด้านวัสดุทางทะเล', en: 'Marine Materials Researcher' },
    bioShort: { th: 'ศึกษาการกัดกร่อนและสารเคลือบป้องกันสำหรับโครงสร้างเหล็กในทะเล', en: 'Studies corrosion and protective coatings for marine steel structures.' },
    bio: {
      th: 'เอกพลวิจัยพฤติกรรมการกัดกร่อนของโลหะในน้ำทะเลไทย และพัฒนาสารเคลือบป้องกันที่เหมาะกับสภาพภูมิอากาศเขตร้อน',
      en: 'Ekkapol researches corrosion behavior of metals in Thai seawater and develops protective coatings suited to tropical conditions.',
    },
    expertise: { th: ['การกัดกร่อนของโลหะ', 'สารเคลือบป้องกัน', 'วัสดุศาสตร์ทางทะเล'], en: ['Metal Corrosion', 'Protective Coatings', 'Marine Materials Science'] },
    education: [{ degree: { th: 'ปริญญาโท', en: 'M.Eng.' }, field: { th: 'วิศวกรรมวัสดุ', en: 'Materials Engineering' }, institution: { th: 'มหาวิทยาลัยสงขลานครินทร์', en: 'Prince of Songkla University' }, year: 2019 }],
    research: { current: [{ title: { th: 'สารเคลือบป้องกันสนิมอายุยาว', en: 'Long-life anti-corrosion coatings' }, summary: { th: 'ทดสอบสูตรเคลือบใหม่ในสภาพน้ำทะเลจริง', en: 'Field-testing new coating formulas in real seawater conditions.' } }], completed: [] },
    publications: [],
    links: { email: 'ekkapol@navalab.org' },
    featured: false,
  },
  {
    name: { th: 'วริศรา เพชรรัตน์', en: 'Warisara Phetcharat' },
    role: { th: 'นักวิจัยด้านคลื่นเสียงใต้น้ำ', en: 'Underwater Acoustics Researcher' },
    bioShort: { th: 'พัฒนาระบบโซนาร์ต้นทุนต่ำสำหรับสำรวจฝูงปลา', en: 'Develops low-cost sonar systems for fish-stock surveys.' },
    bio: {
      th: 'วริศราศึกษาคลื่นเสียงใต้น้ำเพื่อพัฒนาระบบโซนาร์ราคาประหยัดที่ชาวประมงรายย่อยเข้าถึงได้ ใช้สำรวจฝูงปลาและประเมินปริมาณสัตว์น้ำ',
      en: 'Warisara studies underwater acoustics to build affordable sonar systems accessible to small-scale fishers, used for fish-stock surveying and assessment.',
    },
    expertise: { th: ['คลื่นเสียงใต้น้ำ', 'ระบบโซนาร์', 'การประเมินปริมาณสัตว์น้ำ'], en: ['Underwater Acoustics', 'Sonar Systems', 'Fish Stock Assessment'] },
    education: [{ degree: { th: 'ปริญญาเอก', en: 'Ph.D.' }, field: { th: 'วิศวกรรมไฟฟ้า', en: 'Electrical Engineering' }, institution: { th: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี', en: 'King Mongkut\'s University of Technology Thonburi' }, year: 2018 }],
    research: {
      current: [{ title: { th: 'โซนาร์พกพาสำหรับเรือประมงขนาดเล็ก', en: 'Portable sonar for small fishing boats' }, summary: { th: 'ออกแบบอุปกรณ์ราคาย่อมเยาสำหรับเรือประมงพื้นบ้าน', en: 'Designing affordable devices for small-scale fishing boats.' } }],
      completed: [],
    },
    publications: [{ title: 'Affordable sonar for small-scale fisheries', authors: 'Phetcharat, W.', venue: 'Acoustics in Fisheries Conference', year: 2023 }],
    links: { email: 'warisara@navalab.org' },
    featured: false,
  },
  {
    name: { th: 'ชานินทร์ ผดุงสิน', en: 'Chanin Padungsin' },
    role: { th: 'นักวิจัยด้านระบบขับเคลื่อนเรือ', en: 'Ship Propulsion Researcher' },
    bioShort: { th: 'ศึกษาระบบขับเคลื่อนไฟฟ้าและไฮบริดสำหรับเรือขนาดเล็ก', en: 'Studies electric and hybrid propulsion for small vessels.' },
    bio: {
      th: 'ชานินทร์วิจัยระบบขับเคลื่อนไฟฟ้าและไฮบริดที่เหมาะกับเรือประมงและเรือโดยสารขนาดเล็ก เพื่อลดต้นทุนเชื้อเพลิงและมลพิษทางน้ำ',
      en: 'Chanin researches electric and hybrid propulsion systems suited to small fishing and passenger vessels, aiming to cut fuel costs and water pollution.',
    },
    expertise: { th: ['ระบบขับเคลื่อนไฟฟ้า', 'ระบบไฮบริด', 'ประสิทธิภาพพลังงาน'], en: ['Electric Propulsion', 'Hybrid Systems', 'Energy Efficiency'] },
    education: [{ degree: { th: 'ปริญญาโท', en: 'M.Eng.' }, field: { th: 'วิศวกรรมเครื่องกล', en: 'Mechanical Engineering' }, institution: { th: 'มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ', en: 'King Mongkut\'s University of Technology North Bangkok' }, year: 2020 }],
    research: { current: [{ title: { th: 'เรือโดยสารไฟฟ้าต้นแบบ', en: 'Prototype electric passenger boat' }, summary: { th: 'สร้างต้นแบบเรือโดยสารไฟฟ้าสำหรับคลองในเมือง', en: 'Building a prototype electric boat for urban canal transit.' } }], completed: [] },
    publications: [],
    links: { email: 'chanin@navalab.org' },
    featured: false,
  },
  {
    name: { th: 'กัญญารัตน์ อินทรสมบัติ', en: 'Kanyarat Intharasombat' },
    role: { th: 'นักวิจัยด้านนโยบายทางทะเล', en: 'Marine Policy Researcher' },
    bioShort: { th: 'เชื่อมงานวิจัยทางเทคนิคเข้ากับนโยบายและความยั่งยืน', en: 'Bridges technical research with policy and sustainability.' },
    bio: {
      th: 'กัญญารัตน์ทำงานเชื่อมโยงงานวิจัยเชิงเทคนิคของกลุ่มเข้ากับนโยบายภาครัฐและแนวทางความยั่งยืน เพื่อให้ผลงานวิจัยถูกนำไปใช้จริงในระดับชุมชนและนโยบาย',
      en: 'Kanyarat connects the group\'s technical research with government policy and sustainability frameworks, helping findings translate into real community and policy impact.',
    },
    expertise: { th: ['นโยบายทางทะเล', 'ความยั่งยืน', 'การจัดการชายฝั่ง'], en: ['Marine Policy', 'Sustainability', 'Coastal Management'] },
    education: [{ degree: { th: 'ปริญญาโท', en: 'M.Sc.' }, field: { th: 'นโยบายสิ่งแวดล้อม', en: 'Environmental Policy' }, institution: { th: 'มหาวิทยาลัยธรรมศาสตร์', en: 'Thammasat University' }, year: 2019 }],
    research: { current: [{ title: { th: 'แนวทางนโยบายประมงยั่งยืน', en: 'Sustainable fisheries policy framework' }, summary: { th: 'จัดทำข้อเสนอแนะนโยบายร่วมกับชุมชนชายฝั่ง', en: 'Drafting policy recommendations with coastal communities.' } }], completed: [] },
    publications: [],
    links: { email: 'kanyarat@navalab.org' },
    featured: false,
  },
  {
    name: { th: 'ภานุวัฒน์ ทองชัย', en: 'Panuwat Thongchai' },
    role: { th: 'นักวิจัยด้านระบบท่าเรือและโลจิสติกส์', en: 'Port & Logistics Systems Researcher' },
    bioShort: { th: 'วิเคราะห์ประสิทธิภาพท่าเรือและห่วงโซ่โลจิสติกส์ทางทะเล', en: 'Analyzes port efficiency and maritime logistics chains.' },
    bio: {
      th: 'ภานุวัฒน์ศึกษาการไหลของสินค้าผ่านท่าเรือไทยและเสนอแนวทางปรับปรุงประสิทธิภาพด้วยข้อมูลและแบบจำลองการจราจรทางน้ำ',
      en: 'Panuwat studies cargo flow through Thai ports and proposes efficiency improvements using data and maritime traffic modeling.',
    },
    expertise: { th: ['ระบบท่าเรือ', 'โลจิสติกส์ทางทะเล', 'การวิเคราะห์ข้อมูลจราจรทางน้ำ'], en: ['Port Systems', 'Maritime Logistics', 'Traffic Data Analysis'] },
    education: [{ degree: { th: 'ปริญญาโท', en: 'M.Eng.' }, field: { th: 'วิศวกรรมขนส่ง', en: 'Transportation Engineering' }, institution: { th: 'จุฬาลงกรณ์มหาวิทยาลัย', en: 'Chulalongkorn University' }, year: 2018 }],
    research: { current: [{ title: { th: 'แบบจำลองการจราจรทางน้ำท่าเรือแหลมฉบัง', en: 'Traffic modeling for Laem Chabang port' }, summary: { th: 'จำลองการไหลของเรือเพื่อลดเวลารอ', en: 'Simulating vessel flow to reduce wait times.' } }], completed: [] },
    publications: [],
    links: { email: 'panuwat@navalab.org' },
    featured: false,
  },
];

const projects = [
  {
    title: { th: 'AUV สำรวจแนวปะการังต้นทุนต่ำ', en: 'Low-cost Reef Survey AUV' },
    summary: {
      th: 'ยานใต้น้ำอัตโนมัติราคาประหยัดสำหรับสำรวจสุขภาพแนวปะการังในน่านน้ำไทย',
      en: 'An affordable autonomous underwater vehicle for surveying reef health in Thai waters.',
    },
    status: 'ongoing',
    year: 2024,
    members: ['piyawan-suksawat', 'nara-chaiyasit'],
    featured: true,
  },
  {
    title: { th: 'ตัวเรือประหยัดพลังงานสำหรับเรือประมง', en: 'Fuel-efficient Hulls for Fishing Vessels' },
    summary: {
      th: 'ออกแบบรูปทรงตัวเรือใหม่เพื่อลดการใช้เชื้อเพลิงของเรือประมงพื้นบ้าน',
      en: 'Redesigning hull forms to cut fuel use for small-scale fishing vessels.',
    },
    status: 'ongoing',
    year: 2024,
    members: ['nara-chaiyasit', 'kritsada-wongsuwan'],
    featured: true,
  },
  {
    title: { th: 'แนวกันคลื่นจากป่าชายเลนเทียม', en: 'Engineered Mangrove Wave Barriers' },
    summary: {
      th: 'แนวทางป้องกันการกัดเซาะชายฝั่งด้วยการปลูกป่าชายเลนเชิงวิศวกรรม',
      en: 'A nature-based coastal protection approach using engineered mangrove buffers.',
    },
    status: 'ongoing',
    year: 2023,
    members: ['supaporn-rattanakul'],
    featured: true,
  },
  {
    title: { th: 'แผนที่ความเสี่ยงการกัดเซาะชายฝั่งอ่าวไทย', en: 'Gulf of Thailand Erosion Risk Map' },
    summary: {
      th: 'แผนที่ความเสี่ยงการกัดเซาะระดับจังหวัดสำหรับหน่วยงานท้องถิ่น',
      en: 'Province-level erosion risk mapping for local government use.',
    },
    status: 'completed',
    year: 2021,
    members: ['supaporn-rattanakul'],
    featured: false,
  },
];

const news = [
  {
    title: { th: 'NavaLab เปิดตัวยานใต้น้ำต้นแบบรุ่นที่สอง', en: 'NavaLab Unveils Second-generation AUV Prototype' },
    date: '2026-06-12',
    excerpt: {
      th: 'ทีมวิจัยหุ่นยนต์ทางทะเลทดสอบยานใต้น้ำรุ่นใหม่บริเวณอ่าวไทยตอนใน',
      en: 'The marine robotics team field-tested its newest AUV in the inner Gulf of Thailand.',
    },
    body: {
      th: 'ทีมวิจัยหุ่นยนต์ทางทะเลของ NavaLab ทดสอบยานใต้น้ำอัตโนมัติ (AUV) รุ่นที่สองในภาคสนามบริเวณอ่าวไทยตอนใน โดยรุ่นใหม่นี้ปรับปรุงระบบนำทางและอายุแบตเตอรี่ให้ยาวนานขึ้นกว่ารุ่นแรกอย่างมาก\n\nทีมวางแผนขยายการทดสอบไปยังพื้นที่แนวปะการังเพิ่มเติมในช่วงครึ่งปีหลัง และจะเปิดเผยผลการสำรวจให้หน่วยงานท้องถิ่นนำไปใช้ประกอบการดูแลระบบนิเวศต่อไป',
      en: "NavaLab's marine robotics team field-tested its second-generation autonomous underwater vehicle (AUV) in the inner Gulf of Thailand. The new model brings substantial improvements to navigation and battery life over its predecessor.\n\nThe team plans to expand testing to additional reef sites later this year and will share survey results with local authorities to support ongoing ecosystem management.",
    },
  },
  {
    title: { th: 'ร่วมประชุมวิชาการทางทะเลระดับภูมิภาค', en: 'NavaLab at the Regional Maritime Research Conference' },
    date: '2026-04-03',
    excerpt: {
      th: 'สมาชิกกลุ่มนำเสนองานวิจัยด้านพลศาสตร์ของไหลและวิศวกรรมชายฝั่ง',
      en: 'Members presented research on hydrodynamics and coastal engineering.',
    },
    body: {
      th: 'สมาชิก NavaLab เข้าร่วมนำเสนอผลงานวิจัยในการประชุมวิชาการทางทะเลระดับภูมิภาค ครอบคลุมหัวข้อพลศาสตร์ของไหล การออกแบบตัวเรือ และแนวทางป้องกันการกัดเซาะชายฝั่งด้วยป่าชายเลนเทียม\n\nงานประชุมครั้งนี้เปิดโอกาสให้ทีมได้แลกเปลี่ยนความรู้กับนักวิจัยจากประเทศเพื่อนบ้าน และต่อยอดความร่วมมือด้านเทคโนโลยีทางทะเลในภูมิภาคต่อไป',
      en: 'NavaLab members presented research at the regional maritime research conference, covering hydrodynamics, hull design, and nature-based coastal erosion control using engineered mangroves.\n\nThe conference gave the team an opportunity to exchange knowledge with researchers from neighboring countries and build on regional collaboration in maritime technology.',
    },
  },
  {
    title: { th: 'เปิดรับนักวิจัยใหม่ร่วมทีมปี 2026', en: 'Now Recruiting: Join NavaLab in 2026' },
    date: '2026-02-20',
    excerpt: {
      th: 'NavaLab เปิดรับนักวิจัยรุ่นใหม่ที่สนใจเทคโนโลยีทางทะเล ร่วมงานกับทีมสหสาขาวิชา',
      en: 'NavaLab is recruiting new researchers interested in maritime technology to join our multidisciplinary team.',
    },
    body: {
      th: 'NavaLab เปิดรับสมัครนักวิจัยรุ่นใหม่เข้าร่วมทีมในปี 2026 โดยเปิดรับทุกสาขาที่เกี่ยวข้องกับเทคโนโลยีทางทะเล ไม่ว่าจะเป็นพลศาสตร์ของไหล หุ่นยนต์ทางทะเล วิศวกรรมชายฝั่ง หรือวัสดุศาสตร์\n\nผู้สนใจสามารถติดต่อทีมผ่านช่องทางอีเมลของกลุ่มเพื่อสอบถามรายละเอียดเพิ่มเติม',
      en: 'NavaLab is recruiting new researchers to join the team in 2026, open to all fields related to maritime technology — hydrodynamics, marine robotics, coastal engineering, or materials science.\n\nInterested candidates can reach out through the group email for more details.',
    },
  },
];

function frontmatter(obj) {
  return `---\n${yaml.dump(obj, { lineWidth: 120 })}---\n`;
}

// members
members.forEach((m, i) => {
  const slug = slugify(m.name.en);
  const tone = NAVY_TONES[i % NAVY_TONES.length];
  const svgPath = path.join(siteRoot, 'src/assets/placeholders/members', `${slug}.svg`);
  writeFileSync(svgPath, memberAvatarSvg(m.name.en, tone));

  const data = {
    order: i + 1,
    name: m.name,
    role: m.role,
    photo: `../../assets/placeholders/members/${slug}.svg`,
    bioShort: m.bioShort,
    bio: m.bio,
    expertise: m.expertise,
    education: m.education,
    research: m.research,
    publications: m.publications,
    links: m.links,
    featured: m.featured,
  };

  const mdPath = path.join(siteRoot, 'src/content/members', `${slug}.md`);
  writeFileSync(mdPath, frontmatter(data));
});

// projects
projects.forEach((p, i) => {
  const slug = slugify(p.title.en);
  const tone = NAVY_TONES[(i + 2) % NAVY_TONES.length];
  const svgPath = path.join(siteRoot, 'src/assets/placeholders/projects', `${slug}.svg`);
  writeFileSync(svgPath, coverSvg(p.title.en, tone, i));

  const data = {
    title: p.title,
    summary: p.summary,
    cover: `../../assets/placeholders/projects/${slug}.svg`,
    status: p.status,
    year: p.year,
    members: p.members,
    featured: p.featured,
  };

  const mdPath = path.join(siteRoot, 'src/content/projects', `${slug}.md`);
  writeFileSync(mdPath, frontmatter(data));
});

// news
news.forEach((n, i) => {
  const slug = slugify(n.title.en);
  const tone = NAVY_TONES[(i + 1) % NAVY_TONES.length];
  const svgPath = path.join(siteRoot, 'src/assets/placeholders/news', `${slug}.svg`);
  writeFileSync(svgPath, coverSvg(n.title.en, tone, i + 3));

  const data = {
    title: n.title,
    date: n.date,
    cover: `../../assets/placeholders/news/${slug}.svg`,
    excerpt: n.excerpt,
    body: n.body,
  };

  const mdPath = path.join(siteRoot, 'src/content/news', `${slug}.md`);
  writeFileSync(mdPath, frontmatter(data));
});

// site singleton
const homeData = {
  heroHeading: {
    th: 'เข้าใจทะเล ด้วยเทคโนโลยีและงานวิจัย',
    en: 'Understanding the Sea Through Technology and Research',
  },
  heroSub: {
    th: 'NavaLab คือชุมชนนักวิจัยเทคโนโลยีทางทะเลที่รวมผู้เชี่ยวชาญหลากสาขาไว้ด้วยกัน ตั้งแต่พลศาสตร์ของไหล หุ่นยนต์ใต้น้ำ ไปจนถึงนโยบายชายฝั่ง',
    en: 'NavaLab is a community of maritime technology researchers spanning hydrodynamics, underwater robotics, and coastal policy.',
  },
  visionStatement: {
    th: 'เรามุ่งพัฒนาความรู้และเทคโนโลยีทางทะเลของไทยให้แข่งขันได้ในระดับสากล พร้อมส่งต่อองค์ความรู้กลับสู่ชุมชนชายฝั่ง',
    en: 'We work to advance Thai maritime technology to a globally competitive standard, while channeling that knowledge back to coastal communities.',
  },
  expertiseAreas: [
    { title: { th: 'พลศาสตร์ของไหล', en: 'Hydrodynamics' }, description: { th: 'การออกแบบตัวเรือและจำลองการไหลด้วยคอมพิวเตอร์', en: 'Hull design and computational flow simulation.' } },
    { title: { th: 'หุ่นยนต์ทางทะเล', en: 'Marine Robotics' }, description: { th: 'ยานใต้น้ำอัตโนมัติและระบบสำรวจ', en: 'Autonomous underwater vehicles and survey systems.' } },
    { title: { th: 'วิศวกรรมชายฝั่ง', en: 'Coastal Engineering' }, description: { th: 'การป้องกันการกัดเซาะและแนวทางเชิงธรรมชาติ', en: 'Erosion control and nature-based approaches.' } },
    { title: { th: 'วัสดุทางทะเล', en: 'Marine Materials' }, description: { th: 'การกัดกร่อนและสารเคลือบป้องกัน', en: 'Corrosion behavior and protective coatings.' } },
    { title: { th: 'คลื่นเสียงใต้น้ำ', en: 'Underwater Acoustics' }, description: { th: 'ระบบโซนาร์และการประเมินปริมาณสัตว์น้ำ', en: 'Sonar systems and stock assessment.' } },
    { title: { th: 'นโยบายทางทะเล', en: 'Marine Policy' }, description: { th: 'เชื่อมงานวิจัยสู่นโยบายและความยั่งยืน', en: 'Connecting research to policy and sustainability.' } },
  ],
  contactEmail: 'contact@navalab.org',
  socials: {
    linkedin: 'https://www.linkedin.com/company/navalab-th',
  },
};

writeFileSync(
  path.join(siteRoot, 'src/content/site/home.json'),
  JSON.stringify({ home: homeData }, null, 2) + '\n'
);

console.log(`Generated ${members.length} members, ${projects.length} projects, ${news.length} news items.`);
