import {
    House,
    Reading,
    Tickets,
} from '@element-plus/icons-vue'

export const ROUTE_PATHS = {
    HOME: '/home',
    START: '/Start',
    AGENT: '/Agent',
    VECTOR: '/Vector',
} as const;


export const SIDEBAR_MENU_ITEMS = [
    {name: '开始', routePath: ROUTE_PATHS.START, icon: House, color: '#409EFF', desc: "开始"},
    {name: 'Ai智能体', routePath: ROUTE_PATHS.AGENT, icon: Tickets, color: '#798b5b', desc: "Ai智能体"},
    {name: '知识库', routePath: ROUTE_PATHS.VECTOR, icon: Reading, color: '#857550', desc: "知识库"},
] as const;

