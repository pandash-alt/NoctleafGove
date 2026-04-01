---
title: AUTOSAR时间同步模块维护
status: open
priority: normal
scheduled: 2026-03-30
dateCreated: 2026-03-30T16:47:46.301+08:00
dateModified: 2026-04-01T17:05:31.994+08:00
tags:
  - task
projects:
  - "[[AUTOSAR 时间同步]]"
timeEntries:
  - startTime: 2026-03-30T08:51:50.224Z
    description: "@tasks[ca21eh] 检视梁老板的修改"
    endTime: 2026-03-30T09:20:00.000Z
  - startTime: 2026-03-30T13:46:03.786Z
    description: "@head[问题单处理] ABC"
    endTime: 2026-03-30T13:46:07.570Z
  - startTime: 2026-04-01T08:50:00.000Z
    description: TC4D9 时间同步运行挂死 EthTSyn 仅能发出 SYNC 报文
    endTime: 2026-04-01T09:05:31.994Z
---

## 代码检视
- [x] #TODO [Delay initialization of clock identity until link is up](https://gitlab.i-soft.com.cn/prd/r23_bsw/-/merge_requests/5220) 🆔 ca21eh ➕ 2026-03-30 📅 2026-03-30 ✅ 2026-04-01
[Timelog::2026-03-30 17:10 - @desc(代码改动不在初始化时调用 EthIf 接口去获取 MAC 地址，而是在数据链路层连接后获取，改动没有问题，但是为什么需要获取 MAC 地址而不是直接使用自己的静态配置)]
## 问题单处理


## 其他
- [ ] #TODO V3.0 阶段时间同步模块评审文档材料补充 ⏫ ➕ 2026-03-30


---
[Timelog::2026-04-01 17:04:51 - @desc(TC4D9 时间同步挂死问题，测试方直接调整中断堆栈修复) @mood(🛑 想要逃离)]
