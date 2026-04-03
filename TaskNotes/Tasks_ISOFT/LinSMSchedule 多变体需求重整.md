---
title: LinSMSchedule 多变体需求重整
status: in-progress
priority: normal
scheduled: 2026-04-03
dateCreated: 2026-04-03T11:11:37.380+08:00
dateModified: 2026-04-03T17:49:19.966+08:00
tags:
  - task
projects:
  - "[[TaskNotes/Areas/AUTOSAR 网络管理]]"
timeEntries:
  - startTime: 2026-04-03T02:40:00.000Z
    description: "@tasks[9lsez8]"
    endTime: 2026-04-03T03:20:00.000Z
  - startTime: 2026-04-03T07:54:04.906Z
    description: "@tasks[9lsez8]"
    endTime: 2026-04-03T09:49:19.966Z
---


> [!info] 上下层需求现状
> **BswM** 模块配置项 BswMLinScheduleRef 引用 LinSMSchedule 容器，并且支持多变体
> **LinSM** 模块配置项 LinSMSchedule/LinSMScheduleIndexRef 引用 LinIfScheduleTable 容器，并且支持变体
> **Linif** 模块配置项 LinIfScheduleTable 支持变体**多重性**


- [ ] #TODO 信息调查关于 LinSMSdule 多变体需求 ➕ 2026-04-03 🛫 2026-04-03 🆔 9lsez8 
	- [x] BswM/LinIf 模块
	- [ ] TPS 文档（不涉及LinSM）
	- [ ] AutosarJira

- BswM 配置一个 Action 只能配置一个目标 Schedule 去切换，在不同的变体中该 Action 可以对应不同的 Schedule
- LinSMScheduleIndex 要求与 LinIfScheduleTable 的值一一对应，等价于要求 LinSMScheduleIndexRef 的作用仅仅是提供给工具自动确认 LinSMScheduleIndex 的值
- 