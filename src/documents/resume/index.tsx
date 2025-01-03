import React, { createContext, FC, ReactNode, useContext, useState } from 'react';
import './App.css';
import Icon from '@mdi/react';
import { mdiCalendar, mdiCellphone, mdiEmail, mdiGithub, mdiHome, mdiLinkedin } from '@mdi/js';
import cordovaSrc from './images/cordova.png';
import npmSrc from './images/npm.png';
import tailwindSrc from './images/tailwind.png';
import profilePictureSrc from './images/profile-picture.jpg';
import experienceLabelSrc from './images/exprerience-label.png';
import raveshmandSrc from './images/203673-325750-m.jpg';
import buruxSrc from './images/burux_logo.jpg';
import boxitSrc from './images/boxit_ir_logo.jpg';
import { AISlider } from './../../npm/aio-input';
import AIODate from './../../npm/aio-date';
const CTX = createContext({} as any)
type I_CTX = { data: I_data }
const Resume: FC = () => {
  const [data] = useState<I_data>(new Data().data)
  const getContext = (): I_CTX => {
    return { data }
  }
  return (
    <CTX.Provider value={getContext()}>
      <div className={`aio-resume flex-row- app-${data.lang === 'fa' ? 'rtl' : 'ltr'}`} style={{ direction: data.lang === 'fa' ? 'rtl' : 'ltr' }}>
        <Side />
        <Body />
      </div>
    </CTX.Provider>
  );
}
export default Resume;
const Side: FC = () => {
  return (
    <div className="app-side gap-12- flex-col-">
      <ProfilePicture />
      <Name />
      <ProfileInfos />
      <Skills />
      <IBeleave />
      <div className="flex-1-"></div>
      <Teams />
    </div>
  )
}
const IBeleave: FC = () => {
  const { data }: I_CTX = useContext(CTX)

  return (
    <div className="flex-col-">
      <div className="side-label">I Beleave</div>
      <div className="fs-14- c-8-">{data.ibeleave}</div>
    </div>
  )

}
const ProfilePicture: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="app-profile-picture">{data.profilePicture}</div>
  )
}
const ProfileInfos: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="flex-col- gap-6- p-l-12-">{data.profileInfos.map((o) => <ProfileInfo info={o} />)}</div>
  )
}
const ProfileInfo: FC<{ info: I_profileInfo }> = ({ info }) => {
  return (
    <div className="flex-row- gap-12- p-h-12- align-v- Lato">
      <div className="gold flex-row- align-h-">{info.icon}</div>
      <div className="c-14- fs-12-">{info.text}</div>
    </div>
  )
}
const Skills: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="flex-col-">
      <div className="side-label">Skills</div>
      <div className="flex-row- wrap- gap-6- p-h-12-">
        {data.skills.map((o) => {
          return <Skill skill={o} />
        })}
      </div>
    </div>
  )
}
const Skill: FC<{ skill: { text: string, value: number } }> = ({ skill }) => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="flex-row-">
      <div className="fs-14- c-1- bg-gold-grd w-fit- p-v-6- p-h-6- br-4- res-skill">{skill.text}</div>
    </div>
  )
}
const English: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="msf">
      <div className="side-label">English</div>
      <div className="msf">
        <AISlider
          start={0} end={100} value={data.english} size={30}
          point={() => ({ html: '' })} reverse={data.lang === 'fa'}
        />
      </div>
    </div>
  )
}
const ExperienceLabel: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  const today = new AIODate().getToday(true)
  const years = today[0] - data.startYear + 1;
  return (
    <div className="experience-label">
      <img src={experienceLabelSrc} alt="" />
      <div className="experience-value">{years}</div>
      <div className="experience-years">{data.lang === 'fa' ? 'سال' : 'Years'}</div>
    </div>
  )
}
const Body: FC = () => {
  return (
    <div className="relative- flex-1- p-24- app-body">
      <Position />
      <div className="h-16-"></div>
      <ExperienceLabel />
      <Summary />
      <Projects />

    </div>
  )
}
const Summary: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="fs-12-">
      <div className="fs-16- bold- m-b-6-">{data.lang === 'fa' ? 'خلاصه' : 'Summary'}</div>
      <div className="msf">{data.summary}</div>
    </div>
  )
}
const Name: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (<div className="app-name">{data.name}</div>)
}
const Position: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (<div className="app-position">{data.position}</div>)
}
const Projects: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="flex-col- p-t-12-">
      <div className="fs-16- bold- m-b-6-">{data.lang === 'fa' ? 'پروژه ها و دستاوردها' : 'Projects and Achievements'}</div>
      <div className="flex-col-">
        {data.projects.map((o) => <Project project={o} />)}
      </div>
    </div>
  )
}
const Project: FC<{ project: I_project }> = ({ project }) => {
  return (
    <div className="flex-col-">
      {project.title}
      <div className="fs-12- c-6-">{project.desc}</div>
    </div>
  )
}
const Teams: FC = () => {
  const { data }: I_CTX = useContext(CTX)
  return (
    <div className="flex-row- align-vh- gap-24- p-24-">
      {data.teams.map((o) => <Team team={o} />)}
    </div>
  )
}
const Team: FC<{ team: I_team }> = ({ team }) => {
  return (
    <div className="team flex-col- align-vh- gap-12-">
      {team.icon}
      <div className="fs-14- c-6- c-14-">{team.name}</div>
    </div>
  )
}
type I_data = {
  startYear: number,
  english: number,
  name: ReactNode,
  position: ReactNode,
  profileInfos: I_profileInfo[],
  skills: { text: string, value: number }[],
  techAndTools: { text: string, icon: ReactNode }[],
  expertises: string[],
  profilePicture: any,
  experienceYears: number,
  lang: I_lang,
  projects: I_project[],
  summary: ReactNode,
  teams: I_team[],
  ibeleave: ReactNode
}
type I_lang = 'en' | 'fa'
type I_project = { title: ReactNode, desc: ReactNode }
type I_profileInfo = { icon: ReactNode, text: ReactNode }
type I_dicKey = 'name' | 'position' | 'address' | 'mobile' | 'email' | 'linkedin' | 'github' | 'bd'
type I_team = { name: ReactNode, icon: ReactNode }
class Data {
  dic: { [key in I_dicKey]: { en: ReactNode, fa: ReactNode } } = {
    name: { en: 'Mohammad Sharif Feiz', fa: 'محمد شریف فیض' },
    position: { en: 'Full Stack FRONT-END Developer', fa: 'Full Stack FRONT-END Developer' },
    address: { en: 'Iran Tehran Vanak', fa: 'تهران , ونک' },
    mobile: { en: '+989123534314', fa: '' },
    email: { en: 'feiz.ms@gmail.com', fa: '' },
    linkedin: { en: 'linkedin.com/in/mohamad-s-feiz-00ab9956', fa: '' },
    github: { en: 'github.com/mohammadFeiz', fa: '' },
    bd: { en: '1985/6/25', fa: '1364/4/4' }
  }
  data: I_data
  lang: I_lang
  constructor() {
    const lang: I_lang = 'en'
    this.lang = lang
    const trans = (key: I_dicKey): ReactNode => {
      return !this.dic[key][lang] ? this.dic[key].en : this.dic[key][lang]
    }

    this.data = {
      startYear: 1394,
      english: 70,
      lang,
      experienceYears: 10,
      teams: [
        { name: 'RAVESHMAND', icon: <img src={raveshmandSrc} /> },
        { name: 'BURUX', icon: <img src={buruxSrc} /> },
        { name: 'BOXIT', icon: <img src={boxitSrc} /> },
      ],
      name: trans('name'),
      position: trans('position'),
      profileInfos: [
        { icon: this.getIcon(mdiHome), text: trans('address') },
        { icon: this.getIcon(mdiCellphone), text: trans('mobile') },
        { icon: this.getIcon(mdiEmail), text: trans('email') },
        { icon: this.getIcon(mdiLinkedin), text: trans('linkedin') },
        { icon: this.getIcon(mdiGithub), text: trans('github') },
        { icon: this.getIcon(mdiCalendar), text: trans('bd') }
      ],
      skills: [
        { text: 'React.js', value: 95 },
        { text: 'TypeScript', value: 95 },
        { text: 'JavaScript (ES5+)', value: 100 },
        { text: 'Next.js', value: 85 },
        { text: 'Express.js', value: 85 },
        { text: 'Node.js', value: 85 },
        { text: 'MongoDB', value: 75 },
        { text: 'SQLite', value: 55 },
        { text: 'OOP', value: 100 },
        { text: 'Apache Cordova', value: 100 },
        { text: 'Figma', value: 100 },
        { text: 'NPM', value: 100 },
        { text: 'ThreeJs', value: 100 },
        { text: 'TailwindCss', value: 100 },
        { text: 'Material Design', value: 100 }
      ],
      techAndTools: [
        { text: 'Apache Cordova', icon: <img src={cordovaSrc} /> },
        { text: 'NPM', icon: <img src={npmSrc} /> },
        { text: 'Tailwind', icon: <img src={tailwindSrc} /> },
        { text: 'Figma', icon: <img src={tailwindSrc} /> },
      ],
      expertises: this.getExperties(),
      profilePicture: <img src={profilePictureSrc} />,
      projects: this.getProjects(),
      summary: this.getSummary(),
      ibeleave: this.getIBeleave()
    }
  }
  getIcon = (path: any): ReactNode => <Icon path={path} size={0.8} />
  getExperties = () => {
    if (this.lang === 'fa') {
      return [
        'توسعه وب اپلیکیشن(Web Application)',
        'توسعه اپلیکیشن‌های پیش‌رونده(PWA)',
        'توسعه اپلیکیشن‌های موبایل هیبریدی(Hybrid Mobile Apps)',
        'توسعه بک‌اند با Express.js',
        'طراحی تجربه کاربری(User Experience Design)'
      ]
    }
    if (this.lang === 'en') {
      return [
        'Web Application',
        'PWA ( Progressive web apps )',
        'Hybrid Mobile Apps',
        'Express.js',
        'User Experience Design'
      ]
    }
    return []
  }
  getProjects = (): I_project[] => {
    const dic: any = {
      pointer: {
        title: <Title texts={['Pointer', this.lang === 'fa' ? 'از سال 1394 تا 1397' : 'From 2015 to 2018']} />,
        fa: (
          <ul className="msf">
            <li><strong>پیاده سازی با vanilla js</strong> ساخت یک اپلیکیشن خیلی بزرگ با جاوا اسکریپت خالص</li>
            <li><strong>مهاجرت به React</strong> تبدیل پروژه از جاوا اسکریپت خام به React</li>
            <li><strong>ساخت کامپوننت های خاص مخصوص به بیزینس</strong> کامپوننت های این پروژه رو بدلیل ux خاصی که داشت تولید کردم و روی npm قرار دادم. یکی از این کامپوننت ها که معادلش در دنیای وب موجود نبود یک کامپوننت چارت بود که نقاط چارت با درگ قابل تغییر بود</li>
            <li><strong>پرفورمنس 1000 کاربر در لحظه</strong> ایجاد یک معماری با ترکیب cache و بیهنه سازی صفحات که سرعت اپلیکیشن رو 300 در صد افزایش داد</li>
            <li><strong>ساخت theme generator</strong> ایجاد قابلیت ساخت theme دلخواه کاربر برای سلیقه های مختلف</li>
            <li><strong>تولید data grid مخصوص</strong> ایجاد یک data grid با قدرت لود 1000 ردیف در یک صفحه با قابلیت <span className="h-bold border">sort</span> <span className="h-bold border">search</span> <span className="h-bold border">groupby</span> <span className="h-bold border">excel</span> <span className="h-bold border">filter</span> <span className="h-bold border">resize</span> <span className="h-bold border">reorder</span></li>

          </ul>

        ),
        en: (
          <ul className="msf">
            <li><strong>Implementation using <span className="h-gold">Vanilla JS</span></strong> Developed a large-scale application using pure JavaScript.</li>
            <li><strong>Transitioned to <span className="h-gold">React</span>.</strong> Migrated this project from pure JavaScript to React.</li>
            <li><strong>Developed custom business-specific components.</strong>Designed and published custom components for this project on npm, tailored to its unique <span className="h-gold">UX</span> requirements. One notable component, a <span className="h-gold">chart with draggable points</span> for real-time adjustments, was created to address a gap in existing web solutions.</li>
            <li><strong>Achieved performance optimization for 1000 concurrent users.</strong>Implemented an architecture combining cache and page optimization, resulting in a <span className="h-gold">300%</span> performance increase for the application.</li>
            <li><strong>Created a theme generator.</strong> Developed a feature that allows users to create <span className="h-gold">custom themes</span> based on their preferences.</li>
            <li><strong>Developed a custom <span className="h-gold">data grid</span>.</strong> Created a custom data grid capable of loading <span className="h-gold">1000</span> rows on a single page, with features such as <span className="h-gold">sorting, searching, grouping, Excel export, filtering, resizing, and reordering</span>.</li>
          </ul>
        )
      },
      Hadafsanj: {
        title: <Title texts={['Hadafsanj', this.lang === 'fa' ? 'از سال 1397 تا 1398' : 'From 2018 to 2019']} />,
        fa: (
          <>
            <ul>
              <li><strong>پیاده سازی با تایپ اسکریپت</strong> در این پروژه برای اولین بار از typescript استفاده کردم</li>
              <li><strong>ایجاد یو ایکس با adobe XD</strong> ساخت یک نسخه کوچک شده از پوینتر با ux بهبود یافته و پیاده سازی از روی prototype</li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul>
              <li><strong>Implemented with TypeScript.</strong> In this project, I used <span className="h-gold">TypeScript</span> for the first time.</li>
              <li><strong>Designed the UX using Adobe XD.</strong> Created a simplified version of the pointer app with improved UX and implemented it based on the <span className="h-gold">prototype</span>.</li>
            </ul>
          </>
        )
      },
      'BURUX Apps': {
        title: <Title texts={[this.lang === 'fa' ? 'مجموعه اپلیکیشن های بروکس' : 'A suite of applications for BURUX Company', this.lang === 'fa' ? '16 تا وب اپلیکیشن' : '16 web applications', this.lang === 'fa' ? 'از سال 1399 تا 1401' : 'From 2020 to 2022']} />,
        fa: (
          <>
            <ul>
              <li><strong>ایجاد npm داخلی</strong> این شرکت قرار بود 16 اپلیکیشن ایجاد کنه که بعضی از ماژول ها بین اینها مشترک بود. پس از طریق npm مجموعه ای برای استفاده اشتراکی بین اپ ها ایجاد شد</li>
              <li><strong>تولید فروشگاه با Spree</strong> ایجاد یک فروشگاه بدون بک اند با یک فریم وورک headless به نام spree</li>
              <li><strong>تولید و نگه داری هم زمان 16 اپلیکیشن</strong> به عنوان تیم لید فرانت به همراه یک کار آموز فرانت و 4 نیروی بک اند 16 اپلیکیشن شرکت رو توسعه می دادم و نگه داری می کردم</li>
              <li><strong>ایجاد سیستم مدیریت cache داخلی کاربران با یک ای پی آی ساده</strong> موفق به تولید فرایندی شدم که از طریق پنل ادمین cache داخلی کاربران قابل مدیریت بود. مثل حذف محصولات کش شده. </li>
              <li><strong>ایجاد یک سوپر کامپوننت فروشگاه ساز</strong> برای جلوگیری از کد های تکراری در اپلیکیشن ها یک سوپر ماژول فروشگاه ساز ایجاد کردم که سبد خرید ها و صفحات پرداخت و محصول رو اتوماتیک ایجاد می کرد</li>
            </ul>
          </>
        ),
        en: (
          <>
            <ul>
              <li><strong>Created an internal npm package</strong> The company was planning to develop 16 applications, some of which shared common modules. To streamline this, an npm package was created for shared use across the applications</li>
              <li><strong>Developed an e-commerce store using Spree</strong> Created a <span className="h-gold">frontend-only e-commerce store</span> using a headless framework called <span className="h-gold">Spree</span></li>
              <li><strong>Simultaneously developed and maintained <span className="h-gold">16</span> applications</strong> As the Frontend Team Lead, I developed and <span className="h-gold">maintained 16 company applications alongside</span> a frontend intern and 4 backend developers</li>
              <li><strong>Created an internal user <span className="h-gold">cache management</span> system with a simple API</strong>I successfully developed a process that allowed the internal user cache to be managed through the admin panel, such as clearing cached products.</li>
              <li><strong>Created a super component for the <span className="h-gold">e-commerce platform</span> builder</strong> To prevent code duplication across applications, I created a super module for the e-commerce platform that automatically generated shopping carts, payment pages, and product pages.</li>
            </ul>
          </>
        ),
      },
      IranFoodGuide: {
        title: <Title texts={['IranFoodGuide', 'free lancer']} />,
        fa: (
          <ul>
            <li><strong>ایجاد اپلیکیشن سفارش غذا</strong> با کامپوننت های قبلی به سرعت یک اپلیکیشن سفارش آنلاین غذا نوشتم</li>
            <li><strong>ایجاد اپلیکشن مدیریت رستوران</strong> پیاده سازی یک ux پیچیده برای مدیریت رستوران</li>
          </ul>
        ),
        en: (
          <ul>
            <li><strong>Developed a food ordering application</strong>Using existing components, I quickly developed an online food ordering application.</li>
            <li><strong>Developed a restaurant management application</strong> Implemented a complex UX for restaurant management.</li>
          </ul>
        )
      },
      Cardex: {
        title: <Title texts={['Cardex', this.lang === 'fa' ? 'شخصی' : 'Personal', 'backend و frontend']} />,
        fa: (
          <ul>
            <li><strong>پیاده سازی 3 اپلیکیشن در یک اپلیکیشن با mode های کاربری مختلف</strong> پیاده سازی یک اپلیکیشن برای 3 نوع کاربر و استفاده از مدیریت state به صورت پیشرفته در راستای این هدف</li>
            <li><strong>ورود به دنیای بک اند و دیتابیس</strong> در این اپلیکیشن صد در صد backend و front رو خودم پیاده کردم با expressjs و nodejs و mongoDB</li>
          </ul>
        ),
        en: (
          <ul>
            <li><strong>Implemented 3 applications within a single app, each with different user modes</strong>Developed an application for 3 different types of users, utilizing advanced state management to achieve this goal.</li>
            <li><strong>Ventured into <span className="h-gold">backend</span> development and <span className="h-gold">database</span> management</strong>In this application, I implemented both the backend and frontend entirely by myself using Express.js, Node.js, and MongoDB.</li>
          </ul>
        ),
      },
      'BOXIT Apps (4 Web Applications)': {
        title: <Title texts={[this.lang === 'fa' ? 'مجموعه اپلیکیشن های BOXIT' : 'A suite of applications for BOXIT Company', '4 web applications', this.lang === 'fa' ? 'از سال 1403' : 'Since 2024']} />,
        fa: (
          <ul>
            <li><strong>بازنویسی و کاهش کد ها به میزان 60 در صد</strong> بازنویسی و ری فکتور اپ های این شرکت و کاهش حجم کد ها به میزان 60 درصد</li>
            <li><strong>تبدیل به تایپ اسکریپت</strong> با بررسی کد ها همه ی تایپ های این پروژه ها رو تعریف کردم و معماری این پروژه ها که به شدت ایراد داشت رو بازنویسی کردم</li>
            <li><strong>ساخت rule engine</strong> برای این شرکت یک ماژول rule engine نوشتم که با یک پنل ساده می تونستن کد داینامیک جاوا ایجاد و deploy کنن</li>
            <li><strong>کامپوننت نقشه و ناوبری اختصاصی برای شرکت</strong> ایجاد یک کامپوننت پیچیده برای بر طرف کردن کلیه نیاز های پروژه ها در راستای نمایش و ناوبری روی نقشه</li>
          </ul>
        ),
        en: (
          <ul>
            <li><strong>Refactored and reduced the code by <span className="h-gold">60%</span></strong>Refactored and restructured the company's apps, reducing the codebase size by 60%.</li>
            <li><strong>Converted to TypeScript</strong> By reviewing the code, I defined all the types for these projects and rewrote their architecture, which had significant flaws.</li>
            <li><strong>Created a <span className="h-gold">rule engine</span></strong> I developed a rule engine module for the company that allowed users to generate dynamic Java code and deploy it through a simple panel.</li>
            <li><strong>Developed a custom map and <span className="h-gold">navigation component</span> for the company.</strong> Created a complex component to address all project needs related to map display and navigation.</li>
          </ul>
        ),
      },
      'BOXIT Puls': {
        title: <Title texts={['BOXIT PULS', 'android', 'backend']} />,
        fa: (
          <ul>
            <li><strong>ورود به دنیای native android</strong> به دلیل محدودیت های pwa یک اپ native برای رانندگان این شرکت نوشتم که از تکنولوژی hybrid بهره می برد</li>
            <li><strong>background sync</strong> موفقیت در ارسال موقعیت رانندگان در background android و ارتباط با سیستم عامل اندروید</li>
          </ul>
        ),
        en: (
          <ul>
            <li><strong>Ventured into the world of native <span className="h-gold">Android development</span></strong> Due to the limitations of PWA, I developed a native app for the company's drivers using hybrid technology.</li>
            <li><strong>background sync</strong> Successfully implemented background location tracking for drivers on Android and established communication with the Android operating system.</li>
          </ul>
        ),
      },
    }
    let res: I_project[] = []
    const keys = Object.keys(dic)
    for (let key of keys) {
      res.push({
        title: dic[key].title ? dic[key].title : key,
        desc: dic[key][this.lang]
      })
    }
    return res
  }
  getSummary = () => {
    if (this.lang === 'fa') {
      return (
        <>
          برنامه‌نویس <span className="h-gold">فول‌استک فرانت‌اند</span> با شروع <span className="h-gold">از سال 1394</span> با تخصص در توسعه اپلیکیشن‌های تعاملی و کاربرپسند با <span className="h-gold">React.js</span> و تکنولوژی‌های مدرن وب. دارای تجربه در طراحی و پیاده‌سازی رابط‌های کاربری بهینه و ریسپانسیو، طراحی تجربه کاربری (UX) پیچیده و همکاری نزدیک با تیم‌های بک‌اند برای ارائه راه‌حل‌های کامل. تجربه توسعه <span className="h-gold">بک‌اند</span> با Express.js و ساخت اپلیکیشن‌های <span className="h-gold">Native</span> با تکنولوژی‌های Hybrid. سابقه <span className="h-gold">مدیریت تیم فرانت‌اند</span> و مشارکت فعال در بیش از <span className="h-gold">30 پروژه</span> متنوع. علاقه‌مند به‌کارگیری ابزارها و تکنیک‌های جدید برای بهبود کیفیت و عملکرد پروژه‌ها و آماده همکاری با <span className="h-gold">تیم‌های پویا و خلاق</span>.
        </>
      )
    }
    return (
      <>
        <span className="h-gold">Full-Stack Frontend Developer</span> with experience <span className="h-gold">starting from 2015</span>, specializing in creating interactive and user-friendly applications using <span className="h-gold">React.js</span> and modern web technologies. Skilled in designing and implementing optimized and responsive user interfaces, crafting complex user experiences (UX), and collaborating closely with backend teams to deliver end-to-end solutions. Experienced in <span className="h-gold">backend development</span> with Express.js and building <span className="h-gold">native applications using hybrid technologies</span>. Proven track record of <span className="h-gold">leading frontend teams</span> and actively contributing to <span className="h-gold">over 30 diverse projects</span>. Passionate about leveraging new tools and techniques to enhance project quality and performance, and eager to collaborate with dynamic and creative teams.
      </>
    )
  }
  getIBeleave = () => {
    return (
      <>
        <ul className='p-l-24- p-r-12- p-t-0- m-0-'>
          <li>that work should be outcome-oriented, and I am committed to delivering the strongest results in the shortest possible time.</li>
          <li>in avoiding unnecessary dependencies, ensuring cleaner and more maintainable code.</li>
          <li>in writing code as if it is the last time I will ever touch it, aiming for perfection and longevity.</li>
          <li>my work holds value only when it contributes to the financial and intellectual growth of the organization.</li>
          <li>in taking full ownership of my work and being accountable for its success.</li>
          <li>that every challenge is an opportunity to innovate and grow.</li>
          <li>in continuous learning and staying adaptable to embrace new technologies.</li>
          <li>I believe that any organization that does not adhere to principles and standards is destined to fail.</li>
          <li>that attention to detail is the foundation of delivering exceptional results.</li>
        </ul>
      </>
    )
  }
}
const Title: FC<{ texts: string[] }> = ({ texts }) => {
  const subtexts = texts.slice(1, texts.length);
  return (
    <div className='flex-row- align-v- gap-6- bg-gold-op p-6-'>
      <div className="bold-">{texts[0]}</div>
      {
        subtexts.map((o) => {
          return <div className="fs-12- op-85-">{`(${o})`}</div>
        })
      }
    </div>
  )
}