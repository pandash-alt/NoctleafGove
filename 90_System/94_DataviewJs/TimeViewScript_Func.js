// ================= 通用配置 =================
const CONFIG = {
    TARGET_FOLDER: 'TaskNotes/Tasks', // 你的任务文件夹路径
    TIMEZONE: 'Asia/Shanghai',
    TIME_FORMAT: 'HH:mm',
};
// =============================================
// 定义渲染函数
async function renderTimeline(dv, targetDateStr) {
    // 1. 初始化
    let allEntries = [];
    const targetDate = dv.date(targetDateStr).startOf('day');
    const targetDateEnd = targetDate.endOf('day');
    
    // 获取目标文件夹下的所有文件
    const pages = dv.pages(`"${CONFIG.TARGET_FOLDER}"`).where(p => p.file.ext === "md");

    // 2. 扫描文件
    for (let page of pages) {
        
        // --- A. 处理 YAML timeEntries ---
        if (page.timeEntries) {
            for (let entry of page.timeEntries) {
                const start = dv.date(entry.startTime).setZone(CONFIG.TIMEZONE);
                
                if (start >= targetDate && start <= targetDateEnd) {
                    const end = entry.endTime ? dv.date(entry.endTime).setZone(CONFIG.TIMEZONE) : null;
                    
                    // 计算时长
                    let durationText = "";
                    if (end) {
                        const minutes = Math.round(end.diff(start, 'minutes').minutes);
                        durationText = ` (⏱️ ${minutes}分钟)`;
                    }

                    const timeStr = `${start.toFormat(CONFIG.TIME_FORMAT)} - ${end ? end.toFormat(CONFIG.TIME_FORMAT) : '结束'}`;
                    const desc = entry.description || "";

                    // 1. 解析 @tasks
                    const taskMatch = desc.match(/@tasks\[(.*?)\]\s*(.*)/);
                    if (taskMatch) {
                        const taskId = taskMatch[1].trim();
                        const taskBrief = taskMatch[2].trim();
                        
                        // 查找原文
                        let sourceLine = "未找到源行";
                        try {
                            const file = app.vault.getFileByPath(page.file.path);
                            if (file) {
                                const content = await app.vault.read(file);
                                const lines = content.split('\n');
                                for (let line of lines) {
                                    if (line.includes(`id ${taskId}`) || line.includes(`🆔 ${taskId}`)) {
                                        sourceLine = line.trim();
                                        break;
                                    }
                                }
                            }
                        } catch (e) {
                            sourceLine = "读取文件错误";
                        }

                        allEntries.push({
                            timeObj: start,
                            timeDisplay: `${timeStr}${durationText}`,
                            brief: taskBrief,
                            type: 'task',
                            description: sourceLine,
                            source: page.file
                        });
                        continue;
                    }

                    // 2. 解析 @head
                    const headMatch = desc.match(/@head\[(.*?)\]\s*(.*)/);
                    if (headMatch) {
                        const headBrief = headMatch[1].trim();
                        const headDesc = headMatch[2].trim();
                        allEntries.push({
                            timeObj: start,
                            timeDisplay: timeStr,
                            brief: headBrief,
                            type: 'head',
                            description: headDesc,
                            source: page.file
                        });
                        continue;
                    }

                    // 3. 普通条目
                    allEntries.push({
                        timeObj: start,
                        timeDisplay: timeStr,
                        brief: "",
                        type: 'normal',
                        description: desc || "无具体记录内容",
                        source: page.file
                    });
                }
            }
        }

        // --- B. 处理行内 Timelog ---
        // const timelogRegex = /\[Timelog::\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*@desc\((.*?)\)\]/;
        const timelogRegex = /\[Timelog::\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*@desc\((.*?)\)(.*?)\]/;
        
        try {
            const file = app.vault.getFileByPath(page.file.path);
            if (file) {
                const content = await app.vault.read(file);
                const lines = content.split('\n');
                
                for (let line of lines) {
                    const match = line.match(timelogRegex);
                    if (match) {
                        const logDate = match[1];
                        const timeStr = match[2];
                        const descText = match[3];
                        
                        if (logDate !== targetDateStr) continue;

                        const fullTimeStr = `${logDate}T${timeStr}:00`;
                        const timeObj = dv.date(fullTimeStr).setZone(CONFIG.TIMEZONE);

                        allEntries.push({
                            timeObj: timeObj,
                            timeDisplay: `🕒 ${timeStr}`,
                            brief: "",
                            type: 'log',
                            description: descText,
                            source: page.file
                        });
                    }
                }
            }
        } catch (e) {
            console.error("读取文件失败:", page.file.path);
        }
    }

    // 3. 排序
    allEntries.sort((a, b) => a.timeObj - b.timeObj);

    // 4. 渲染
    if (allEntries.length === 0) {
        dv.paragraph(`ℹ️ **${targetDateStr}** 暂无记录`);
    } else {
        dv.header(3, "时间记录表");
        dv.table(
            ["时间信息 + 简要", "描述", "来源"], 
            allEntries.map(item => {
                // 第一列
                let col1 = `**${item.timeDisplay}**`;
                if (item.brief) {
                    col1 += `<br><small>${item.brief}</small>`;
                }

                // 第二列
                let col2 = item.description;
                if (item.type === 'task') {
                    col2 = `> ${col2}`;
                }

                // 第三列
                let col3 = dv.fileLink(item.source.path, false, "📄 来源");

                return [col1, col2, col3];
            })
        );
    }
}

// 导出函数，供其他文件调用
module.exports = { renderTimeline };