import { FC, useState } from 'react';
import DOC from '../../resuse-components/doc.tsx';
import {Code} from './../../npm/aio-components';
//@ts-ignore
import src0 from './images/0.png';
//@ts-ignore
import src1 from './images/1.png';
//@ts-ignore
import src2 from './images/2.png';
//@ts-ignore
import src3 from './images/3.png';
//@ts-ignore
import src4 from './images/4.png';
//@ts-ignore
import src5 from './images/5.png';
//@ts-ignore
import src6 from './images/6.png';
export default function DOC_AIOCordova(props: any) {
    return (
        <DOC
            name={props.name} goToHome={props.goToHome}
            nav={{
                items: () => [
                    { text: 'folders structure', id: 'fs', render: () => <FoldersStructure /> },
                    { text: 'root package.json', id: 'rp', render: () => <RootPackageJson /> },
                    { text: 'create cordova', id: 'cc', render: () => <CreateCordova /> },
                    { text: 'create react', id: 'cr', render: () => <CreateReact /> },
                    { text: 'react index.html', id: 'rih', render: () => <ReactIndexHtml /> },
                    { text: 'react App.tsx', id: 'rat', render: () => <ReactAppTsx /> },
                    { text: 'Environment Variables', id: 'enva', render: () => <EnvVar /> },
                    { text: 'Cordova Plugins', id: 'cp', render: () => <CordovaPlugins /> },
                    { text: '.gitignore', id: 'gi', render: () => <GitIgnore /> },
                ]
            }}
        />
    )
}

const FoldersStructure: FC = () => {
    return (
        <div className="example">
            <img src={src0} alt='' />
        </div>
    )
}
const RootPackageJson: FC = () => {
    return (
        <div className="example">
            {
                Code(`
{
    "name": "my-app",
    "version": "1.0.0",
    "description": "A full-stack React and Cordova project",
    "main": "index.js",
    "scripts": {
        "react:build": "cd react && npm run build",
        "sync:build": "rimraf cordova/www && xcopy react\\build cordova\\www /E /H /C /I",
        "cordova:build": "cd cordova && cordova build android",
        "move:apk": "xcopy cordova\\platforms\\android\\app\\build\\outputs\\apk\\debug\\app-debug.apk . /Y",
        "build": "npm run react:build && npm run sync:build && npm run cordova:build && npm run move:apk",
        "start": "cd react && npm start"
    },
    "author": "Your Name",
    "license": "ISC",
    "dependencies": {},
    "devDependencies": {
        "rimraf": "^5.0.0"
    }
}
                `)
            }
        </div>
    )
}
const CreateCordova: FC = () => {
    return (
        <div className="example">
            <div className="fs-16- bold">In cordova folder terminal</div>
            <div className="h-60">
                {Code(`cordova create myApp com.example.myapp MyApp`)}
            </div>
            <div className="h-60">
                {Code(`cordova platform add android`)}
            </div>

        </div>
    )
}
const CreateReact: FC = () => {
    return (
        <div className="example">
            <div className="fs-16- bold">In react folder terminal</div>
            <div className="h-60">
                {Code(`npx create-react-app myapp --template typescript`)}
            </div>
        </div>
    )
}
const ReactIndexHtml: FC = () => {
    return (
        <div className="example">
            <div className="fs-16- bold">In react/public/index.html</div>
            <div>
                {Code(`
<body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script src="cordova.js"></script>
</body>

                `)}
            </div>
        </div>
    )
}

const ReactAppTsx: FC = () => {
    return (
        <div className="example">
            <div className="fs-16- bold">In react/public/index.html</div>
            <div className="msf">
                {Code(`
type I_os = 'Macintosh' | 'MacIntel' | 'MacPPC' | 'Mac68K' | 'Win32' | 'Win64' | 'Windows' | 'WinCE' | 'iPhone' | 'iPad' | 'iPod' | 'macOS' | 'iOS' | 'Windows' | 'Android' | 'Linux' | 'Unknown'
export const DetectOS = ():I_os => {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator.platform;
    const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
    const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
    const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
    let os: any = null;
    if (macosPlatforms.includes(platform)) { os = 'macOS'; }
    else if (iosPlatforms.includes(platform)) { os = 'iOS'; }
    else if (windowsPlatforms.includes(platform)) { os = 'Windows'; }
    else if (/Android/.test(userAgent)) { os = 'Android'; }
    else if (/Linux/.test(platform)) { os = 'Linux'; }
    else { os = 'Unknown'; }
    return os;
}    
                `)}
            </div>
            <div>
                {Code(`
const App: FC = () => {
  const [os] = useState(DetectOS())
  const [loading, setLoading] = useState<boolean>(true)
  let [aioCordova] = useState<AIOCordova>()
  const setAioCordova = () => {
    if (os !== 'Android') { return }
    aioCordova = new AIOCordova({
      backButton: (e, self) => {
        if (window.confirm("آیا می‌خواهید از برنامه خارج شوید؟")) {
          self.exitApp();
        }
      }
    })
  }
  async function onDeviceReady() {
    setAioCordova()
    //delay for load cordova
    setTimeout(() => setLoading(false), 3000)
  }
  useEffect(() => {
    if (os === 'Android') { document.addEventListener('deviceready', onDeviceReady, false) }
    else { onDeviceReady() }
  }, [])
  if (loading) {return <Loading />}
  return os === 'Windows' ? <WindowsApp /> : <MobileApp aioCordova={aioCordova as AIOCordova} />
}
export default App


                `)}
            </div>
        </div>
    )
}
const EnvVar: FC = () => {
    return (
        <div className="example">
            <img src={src1} alt='' />
            <img src={src2} alt='' />
            <img src={src3} alt='' />
            <img src={src4} alt='' />
            <img src={src5} alt='' />
            <img src={src6} alt='' />
        </div>
    )
}

const CordovaPlugins: FC = () => {
    return (
        <div className="example">
            <div className="fs-16- bold">In cordova folder terminal</div>
            <div className="">
                {Code(`
cordova plugin add cordova-plugin-tts@latest
cordova plugin add cordova-sqlite-storage
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-mlkit
                `)}
            </div>
        </div>
    )
}

const GitIgnore: FC = () => {
    return (
        <div className="example">
            <div className="fs-16- bold">.gitignore in root</div>
            <div className="">
                {Code(`
# فایل‌های Node.js
node_modules/
npm-debug.log
yarn.lock

# فایل‌های React بیلد شده
react/build/
react/node_modules/

# فایل‌های Cordova
cordova/platforms/

# سایر موارد غیرضروری
.DS_Store
*.log
*.env
.idea/
.vscode/
                `)}
            </div>
        </div>
    )
}



