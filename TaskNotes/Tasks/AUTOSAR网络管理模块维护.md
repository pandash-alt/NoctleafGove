---
title: AUTOSAR网络管理模块维护
status: open
priority: normal
dateCreated: 2026-03-30T16:47:57.387+08:00
dateModified: 2026-03-31T18:03:19.962+08:00
tags:
  - task
projects:
  - "[[AUTOSAR 网络管理]]"
timeEntries:
  - startTime: 2026-03-30T10:07:03.474Z
    description: "@tasks[a9untl] 检查需求实现准备答复魏银"
    endTime: 2026-03-30T10:23:56.338Z
  - startTime: 2026-03-31T06:10:27.226Z
    description: 支持测试了解 TCPP-5669/TCPP-5673 背景和目的
    endTime: 2026-03-31T06:27:57.205Z
  - startTime: 2026-03-31T06:28:19.261Z
    description: 支持交付了解 DBC 文件网络管理要求
    endTime: 2026-03-31T06:37:53.768Z
  - startTime: 2026-03-31T06:48:05.673Z
    description: 测试上报 ComM 配置校验问题关于 managing 和 managed
    endTime: 2026-03-31T07:04:18.507Z
  - startTime: 2026-03-31T07:15:00.000Z
    description: "@tasks[xqjlkn] 确认iup"
    endTime: 2026-03-31T08:13:19.748Z
  - startTime: 2026-03-31T09:51:00.000Z
    description: Work session
    endTime: 2026-03-31T10:03:19.962Z
---

## 问题单处理
- [ ] #TODO #bugFix LinSMSchedule 多变体配置生成缺陷问题 ⏫ ➕ 2026-03-30


## 其他
- [x] #TODO TCPP-511: 需求和实现确认 🆔 a9untl ➕ 2026-03-30 ✅ 2026-03-30
[Timelog::2026-03-30 18:21 - @desc(确认该配置时梁老板自定义，通过结合 TCPP-512 的配置限制实现 INTERNAL 的状态机。两个校验等价于 ComM 模块几条判断条件)]
- [ ] #TODO 星宇项目开源版本工具网络管理模块编译错误 ➕ 2026-03-30
	- [x] #TODO 工具需求更新，新建 TCPP 向工具组输入 ➕ 2026-03-30 ✅ 2026-03-30
	- [Timelog::2026-03-30 18:26 - @desc(TCPP-6155)]
	- [x] #TODO 验证2026-03-30需求对应的工具改动 🆔 xqjlkn ➕ 2026-03-31 ✅ 2026-03-31
	- [Timelog::2026-03-31 15:57:37 - @desc(确认工具改动能够通过编译，但是设计一丁点 ComM 改动确认都需要同步到哪些分支)]




---
[Timelog::2026-03-31 18:02:11 - @desc(支持测试: Carwakeup 回调传出的通道号错误，确认是单元测试代码问题，测试去修改他们的代码)]
