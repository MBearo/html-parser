import './style.css'
import typescriptLogo from './typescript.svg'
import { setupCounter } from './counter'
import Parser from './parser'
import {tokenize} from './demo'
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`

setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

const htmlDemo = `<!-- 这是注释 -->
  <div 
    title="this is {{ffff}}" 
    s-if="{{ {title:f, value:3}}}"
    on-click="capture:mainClick"
    on-tap="mainClick(title)"
  >
    111{{xxxx | lll|filter2}}
     {{1+2-3*4/5}} {{n1>n2}} {{!n2}} {{!!n3}} {{a*(b+c)}} {{max(n1,n2)}}  {{xxx||fff}}
  </div>
`
const parser = new Parser(htmlDemo)
parser.parse()
console.log('parser',parser)
console.log(tokenize(htmlDemo)) 