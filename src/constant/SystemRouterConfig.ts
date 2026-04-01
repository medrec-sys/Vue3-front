import {
    House,
    Reading,
    Tickets,
    ChatLineSquare,
    Search
} from '@element-plus/icons-vue'

export const ROUTE_PATHS = {
    HOME: '/home',
    START: '/Start',
    AGENT: '/Agent',
    VECTOR: '/Vector',
    CHAT: '/chat',
    SEARCH: '/search'
} as const;


export const SIDEBAR_MENU_ITEMS = [
    {name: '开始', routePath: ROUTE_PATHS.START, icon: House, color: '#409EFF', desc: "开始"},
    {name: 'Ai智能体', routePath: ROUTE_PATHS.AGENT, icon: Tickets, color: '#798b5b', desc: "Ai智能体"},
    {name: '知识库', routePath: ROUTE_PATHS.VECTOR, icon: Reading, color: '#857550', desc: "知识库"},
    {name: '对话窗口', routePath: ROUTE_PATHS.CHAT, icon: ChatLineSquare, color: '#5b7b8b', desc: "聊天窗口"},
    {name: '知识库检索', routePath: ROUTE_PATHS.SEARCH, icon: Search, color: '#1c2f3a', desc: "知识库检索"},
] as const;

