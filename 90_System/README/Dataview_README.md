
## TimeViewScript
前提信息来自: [[90_System/README/ForVault#时间追踪架构|ForVault]]
`TimeViewScript_Full` 和 `TimeViewScript_Func` 用作整合显示 **某天** 的时间追踪（来自 **TaskNotes**）和 **Timelogs**
### TimeViewScript_Full
```javascript
// ================= 配置区域 =================
const CONFIG = {
    TARGET_FOLDER: 'TaskNotes/Tasks', // 目标文件夹路径
    FILTER_DATE: '2026-03-30',        // 筛选日期
    TIMEZONE: 'Asia/Shanghai',        // 时区
    TIME_FORMAT: 'HH:mm', // 待检视代码
};
// =============================================
```

- 时间追踪的整合：
TaskNotes 插件提供的时间追踪记录在相应页面 yaml 属性段：**timeEntries**，包含 **startTime**、**description**、**endTime**，选中所有 startTime 在指定日期的 timeEntries 后提取该数据，并根据 **description** 进行二次操作。

| description     | 操作                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| @tasks[ABC] EFG | tasks 标识 代表本页面中一定存在 **tasks 插件** 创建的代办项，并为该代办生成了唯一的 Id（tasks 插件本身功能）为 ‘ABC’。代办原文视为{正文描述}，‘EFG’视为{简要} |
| @head[ABC] EFG  | head 标识 代表本页面中一定存在某阶**标题行**。‘EFG’ 视为{正文描述}，‘ABC’视为{简要}                                               |
| EFG             | 缺省直接把 ‘EFG’ 视为{正文描述}                                                                                 |

- Timelog整合:
如下格式，解析时间戳，并且 @desc() 中信息作为{正文描述}
```txt
[Timelog::2026-04-01 11:05:39 - @desc(已经提交MR，等待门禁情况。因为增加了 BswM 的无条件回调，不确定单元测试代码是否报错) @mood(🛑 想要逃离)]
```

- 脚本整合数据后渲染架构：

| 列1                | 列2     | 列3     |
| ----------------- | ------ | ------ |
| {时间戳}<br>{简要（可选）} | {正文描述} | {原文追溯} |
所有整合后的数据按照时间戳排序，timeEntries 以 startTime 的时刻参与排序，并且{时间戳}部分会以时间段形式显示
### TimeViewScript_Func

`TimeViewScript_Full`脚本整体过长，不适合直接写进每日的 page 中，封装主体功能为 `TimeViewScript_Func.js` ，通过以下 dataviewjs 代码传入时间信息直接调用
```txt
// 加载外部脚本并渲染时间轴
const s = app.vault.getFileByPath("90_System/94_DataviewJs/TimeViewScript_Func.js");
if (s) {
    try {
        eval(await app.vault.read(s) + "\nwindow.f=renderTimeline");
        await window.f(dv, "2026-03-31");
    } catch (e) {
        dv.paragraph("❌ 时间轴脚本加载失败：" + e.message);
    }
} else {
    dv.paragraph("❌ 找不到脚本文件：90_System/94_DataviewJs/TimeViewScript_Func.js");
}
```
