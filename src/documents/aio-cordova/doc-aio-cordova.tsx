import { FC, useState } from 'react';
import DOC from '../../resuse-components/Doc/index';
import { Code } from './../../npm/aio-components';
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
            items={[
                { text: 'folders structure', value: 'fs', render: () => <FoldersStructure /> },
                { text: 'root package.json', value: 'rp', render: () => <RootPackageJson /> },
                { text: 'create cordova', value: 'cc', render: () => <CreateCordova /> },
                { text: 'create react', value: 'cr', render: () => <CreateReact /> },
                { text: 'react index.html', value: 'rih', render: () => <ReactIndexHtml /> },
                { text: 'react App.tsx', value: 'rat', render: () => <ReactAppTsx /> },
                { text: 'Environment Variables', value: 'enva', render: () => <EnvVar /> },
                { text: 'Cordova Plugins', value: 'cp', render: () => <CordovaPlugins /> },
                { text: '.gitignore', value: 'gi', render: () => <GitIgnore /> },
            ]}
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
            <div>
                {Code(`
import { AIOCordovaComponent } from "aio-cordova";
const App: FC = () => {
  return (
    <AIOCordovaComponent
      startWindows={() => <WindowsApp />}
      startAndroid={(aioCordova) => <MobileApp aioCordova={aioCordova} />}
    />
  )
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



