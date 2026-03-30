```dataviewjs
// ================= 配置区域 =================
const CONFIG = {
    TARGET_FOLDER: 'TaskNotes/Tasks', // 目标文件夹路径
    FILTER_DATE: '2026-03-30',        // 筛选日期
    TIMEZONE: 'Asia/Shanghai',
    TIME_FORMAT: 'HH:mm',
};
// =============================================

// 1. 基础校验
if (!CONFIG.TARGET_FOLDER || !CONFIG.FILTER_DATE) {
    dv.paragraph("❌ 请检查顶部的 CONFIG 配置，确保 TARGET_FOLDER 和 FILTER_DATE 已填写。");
} else {
    // 2. 初始化
    let allEntries = [];
    const targetDate = dv.date(CONFIG.FILTER_DATE).startOf('day');
    const targetDateEnd = targetDate.endOf('day');
    
    // 获取目标文件夹下的所有文件
    const pages = dv.pages(`"${CONFIG.TARGET_FOLDER}"`).where(p => p.file.ext === "md");

    // 3. 扫描文件
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
                        
                        // ✅ 查找原文作为描述
                        let sourceLine = "未找到源行";
                        try {
                            const file = app.vault.getFileByPath(page.file.path);
                            if (file) {
                                const content = await app.vault.read(file);
                                const lines = content.split('\n');
                                for (let line of lines) {
                                    // 匹配 id
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
                            description: sourceLine, // ✅ 原文放入描述列
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

                    // 3. 普通条目 (无标签)
                    allEntries.push({
                        timeObj: start,
                        timeDisplay: timeStr,
                        brief: "",
                        type: 'normal',
                        description: desc || "无具体记录内容", // ✅ 兜底默认值
                        source: page.file
                    });
                }
            }
        }

        // --- B. 处理行内 Timelog ---
        // 格式：[Timelog::2026-03-30 17:10 - @desc(...)]
        const timelogRegex = /\[Timelog::\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s*-\s*@desc\((.*?)\)\]/;
        
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
                        
                        if (logDate !== CONFIG.FILTER_DATE) continue;

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

    // 4. 排序
    allEntries.sort((a, b) => a.timeObj - b.timeObj);

    // 5. 表格渲染
    if (allEntries.length === 0) {
        dv.paragraph(`ℹ️ **${CONFIG.FILTER_DATE}** 暂无记录`);
    } else {
        dv.header(3, "时间记录表");
        dv.table(
            ["时间信息 + 简要", "描述", "来源"], 
            allEntries.map(item => {
                // 第一列：时间 + 简要
                let col1 = `**${item.timeDisplay}**`;
                if (item.brief) {
                    col1 += `<br><small>${item.brief}</small>`;
                }

                // 第二列：描述 (核心修改点)
                let col2 = item.description;
                // 如果是 Task，给原文加个引用样式，方便阅读
                if (item.type === 'task') {
                    col2 = `> ${col2}`;
                }

                // 第三列：来源链接
                let col3 = dv.fileLink(item.source.path, false, "📄 来源");

                return [col1, col2, col3];
            })
        );
    }
}
```
