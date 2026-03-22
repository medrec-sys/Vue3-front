/**
 * 知识库实体
 */
export interface Knowledge {
    /** 主键ID */
    id?: number;
    /** 知识名称 */
    name?: string;
    /** 存储路径 */
    path?: string;
    /** 向量库ID */
    vectorId?: number;
    /** 分块数量 */
    chunk?: number;
    /** 创建人ID */
    createBy?: number;
    /** 创建时间 */
    createTime?: Date | string;
}