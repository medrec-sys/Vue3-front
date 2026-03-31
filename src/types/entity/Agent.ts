/**
 * Agent实体
 */
export interface Agent {
    /** 主键ID */
    id: number;
    /** Agent名称 */
    name: string;
    /** 描述 */
    description: string;
    /** 提示词 */
    prompt: string;
    /** 温度参数 */
    temperature: number;
    /** 最大消息数 */
    maxMessage: number;
    /** TopK参数 */
    topK: number;
    /** 相似度阈值 */
    similarity: number;
    /** 创建人ID */
    createBy: number;
    /** 创建时间 */
    createTime: Date | string;
}