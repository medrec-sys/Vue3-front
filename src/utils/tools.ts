import MarkdownIt from 'markdown-it'
import { katex } from '@mdit/plugin-katex'
import 'katex/dist/katex.min.css'


const documentIdPlugin = (md: MarkdownIt) => {
    // 注册自定义 inline 规则
    md.inline.ruler.before('text', 'document-id', (state, silent) => {
        const regex = /^<ID>(.+?)<\/ID>/
        const match = regex.exec(state.src.slice(state.pos))

        if (!match) return false

        if (!silent) {
            const id = match[1]
            const token = state.push('html_inline', '', 0)
            token.content = `<span 
                class="document-id-link" 
                data-id="${id}"
            >🔗</span>`
        }


        state.pos += match[0].length
        return true
    })
}


const markDownIt = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true,
})

    .use(katex, {
        throwOnError: false,        // 公式错了不崩
        strict: false,              // 宽松模式
        displayMode: false,         // 行内公式默认
        output: 'htmlAndMathml',    // 无障碍 + 兼容性
    })
    .use(documentIdPlugin)

export {markDownIt}