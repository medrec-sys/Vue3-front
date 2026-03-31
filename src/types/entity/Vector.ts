/**
* 向量库实体
*/
export interface Vector {
/** 主键ID */
id: number;
/** 向量库名称 */
name: string;
/** 描述 */
description?: string;
/** 维度 */
dim: number;
/** 索引名称（前端忽略） */
indexName: string;
/** 前缀（前端忽略） */
prefix: string;
/** 创建人ID */
createBy: number;
/** 创建时间 */
createTime: Date | string;
}