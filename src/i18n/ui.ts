export const languages = {
  th: 'ไทย',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'th';

export const ui = {
  th: {
    'site.tagline': 'ชุมชนผู้เชี่ยวชาญด้านเทคโนโลยีทางทะเล',
    'nav.home': 'หน้าแรก',
    'nav.mission': 'พันธกิจ',
    'nav.team': 'ทีมวิจัย',
    'nav.projects': 'โปรเจกต์',
    'nav.news': 'ข่าว',
    'nav.contact': 'ติดต่อ',
    'nav.admin': 'ผู้ดูแลระบบ',
    'hero.eyebrow': 'NavaLab-TH',
    'hero.cta': 'พบกับทีมวิจัย',
    'mission.eyebrow': 'พันธกิจ',
    'mission.heading': 'พันธกิจของเรา',
    'expertise.eyebrow': 'ความเชี่ยวชาญ',
    'expertise.heading': 'สิ่งที่เราเชี่ยวชาญ',
    'research.eyebrow': 'งานวิชาการ',
    'research.heading': 'บทความวิชาการ',
    'research.viewAll': 'ดูบทความทั้งหมด',
    'team.eyebrow': 'สมาชิก',
    'team.heading': 'ทีมนักวิจัยของเรา',
    'team.viewProfile': 'ดูโปรไฟล์',
    'news.eyebrow': 'ความเคลื่อนไหว',
    'news.heading': 'ข่าวและกิจกรรม',
    'news.viewAll': 'ดูข่าวทั้งหมด',
    'contact.eyebrow': 'ร่วมงานกับเรา',
    'contact.heading': 'ติดต่อ NavaLab-TH',
    'contact.body': 'สนใจร่วมงานวิจัย แลกเปลี่ยนความรู้ หรือชวนไปบรรยาย ติดต่อเราได้ทุกช่องทาง',
    'contact.emailCta': 'ส่งอีเมลถึงเรา',
    'profile.eyebrow': 'สมาชิก',
    'profile.expertise': 'ความเชี่ยวชาญ',
    'profile.experience': 'ประสบการณ์ทำงาน',
    'profile.researchCurrent': 'งานวิจัยที่กำลังทำ',
    'profile.researchCompleted': 'งานวิจัยที่ทำสำเร็จแล้ว',
    'profile.publications': 'ผลงานตีพิมพ์',
    'profile.projects': 'โปรเจกต์ที่เกี่ยวข้อง',
    'profile.education': 'ประวัติการศึกษา',
    'profile.contact': 'ติดต่อ',
    'profile.downloadCv': 'ดาวน์โหลด CV',
    'profile.prev': 'สมาชิกคนก่อนหน้า',
    'profile.next': 'สมาชิกคนถัดไป',
    'projects.heading': 'บทความวิชาการ',
    'projects.status.ongoing': 'กำลังดำเนินการ',
    'projects.status.completed': 'สำเร็จแล้ว',
    'projects.members': 'ผู้ร่วมวิจัย',
    'news.heading.page': 'ข่าวและกิจกรรม',
    'footer.rights': 'สงวนลิขสิทธิ์',
  },
  en: {
    'site.tagline': 'Maritime Technology Research Community',
    'nav.home': 'Home',
    'nav.mission': 'Mission',
    'nav.team': 'Research Team',
    'nav.projects': 'Projects',
    'nav.news': 'News',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',
    'hero.eyebrow': 'NavaLab-TH',
    'hero.cta': 'Meet the team',
    'mission.eyebrow': 'Mission',
    'mission.heading': 'Our Mission',
    'expertise.eyebrow': 'Expertise',
    'expertise.heading': 'What we specialize in',
    'research.eyebrow': 'Articles',
    'research.heading': 'Academic Articles',
    'research.viewAll': 'View all articles',
    'team.eyebrow': 'Members',
    'team.heading': 'Our research team',
    'team.viewProfile': 'View profile',
    'news.eyebrow': 'Updates',
    'news.heading': 'News & activities',
    'news.viewAll': 'View all news',
    'contact.eyebrow': 'Work with us',
    'contact.heading': 'Contact NavaLab-TH',
    'contact.body': 'Interested in research collaboration, knowledge exchange, or inviting us to speak? Reach out through any channel.',
    'contact.emailCta': 'Email us',
    'profile.eyebrow': 'Member',
    'profile.expertise': 'Expertise',
    'profile.experience': 'Experience',
    'profile.researchCurrent': 'Current research',
    'profile.researchCompleted': 'Completed research',
    'profile.publications': 'Publications',
    'profile.projects': 'Related projects',
    'profile.education': 'Education',
    'profile.contact': 'Contact',
    'profile.downloadCv': 'Download CV',
    'profile.prev': 'Previous member',
    'profile.next': 'Next member',
    'projects.heading': 'Projects & research',
    'projects.status.ongoing': 'Ongoing',
    'projects.status.completed': 'Completed',
    'projects.members': 'Contributors',
    'news.heading.page': 'News & activities',
    'footer.rights': 'All rights reserved',
  },
} as const;

export type UiKey = keyof (typeof ui)['th'];

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  if (first in ui) return first as Lang;
  return defaultLang;
}

export function localizePath(path: string, lang: Lang): string {
  const clean = path.replace(/^\/(th|en)/, '') || '/';
  if (lang === defaultLang) return clean;
  return `/en${clean === '/' ? '' : clean}`;
}
