import {asyncTaskApi} from "@/api/asyncTaskApi";
import { ElNotification} from "element-plus";
import type {Task} from "@/types/dto/Task";

export class TaskUtil {
    private static key : string = 'medrec_task_list';
    private static timerKey : string = 'medrec_task_timer';
    private static taskList : string[] = [];
    public static taskMap : Map<string, Task> = new Map();
    private static timer: number;
    public static startPolling() {
        const timer  = localStorage.getItem(TaskUtil.timerKey)
        if (timer !== null) {
            TaskUtil.timer = Number(timer);
            TaskUtil.stopPolling()
        }

        TaskUtil.loadFromLocal();
        TaskUtil.initTimer();
        localStorage.setItem(TaskUtil.timerKey, TaskUtil.timer.toString())
    }

    public static stopPolling() {
        clearInterval(TaskUtil.timer);
    }

    public static addTask(taskId : string) {
        if (!taskId) return;
        if (TaskUtil.taskList.includes(taskId)) return;  // 去重

        TaskUtil.taskList.push(taskId);
        TaskUtil.saveToLocal();
    }

    public static removeTask(taskId : string) {
        const index = TaskUtil.taskList.indexOf(taskId);
        if (index !== -1) {
            TaskUtil.taskList.splice(index, 1);
            TaskUtil.saveToLocal();
        }
    }

    public static saveToLocal() {
        localStorage.setItem(TaskUtil.key, JSON.stringify(TaskUtil.taskList))
    }

    public static loadFromLocal() {
        const list = localStorage.getItem(TaskUtil.key)
        if (list === null)  {
            TaskUtil.taskList = [];
            return;
        } else {
            TaskUtil.taskList = JSON.parse(list);
        }
    }

    private static initTimer() {
        TaskUtil.timer = window.setInterval(() => {
            TaskUtil.polling();
        }, 1000 * 10);
    }

    private static polling() {
        TaskUtil.taskList.forEach(taskId => {
            asyncTaskApi.getTask(taskId).then(result => {
                const res = result.data

                if (res.code !== 1) {
                    return
                }

                const task = res.data

                if (task === null) {
                    TaskUtil.removeTask(taskId)
                    TaskUtil.taskMap.delete(taskId)
                    return;
                }

                if (task.code === 1) {
                    ElNotification.success({
                        title: '任务完成' as any,
                        message: task.description as any,
                        duration: 5000 as any
                    })
                    TaskUtil.removeTask(taskId)
                    TaskUtil.taskMap.delete(taskId)
                } else if (task.code === -1) {
                    ElNotification.warning({
                        title: '任务失败' as any,
                        message: task.description + task.status as any,
                        duration: 5000 as any
                    })
                    TaskUtil.removeTask(taskId)
                    TaskUtil.taskMap.delete(taskId)
                } else if (task.code === 0) {
                    TaskUtil.taskMap.set(taskId, task)
                }
            })
        })
    }
}