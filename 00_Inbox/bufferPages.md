1. PNCLearning 特性规范与评审（2h）
规范评审：

完成 PNCLearning 特性评审会议；
完成【PH-RH-QC-RM-03】Checklist软件需求技术评审报告；
2. CPTASK-803通信二组方向周期函数整改处理（12h）
上级任务：【CPTASK-799】MainFunction先于初始化任务运行时代码整改（已完成）
问题说明：EthTSyn 原先对 partition 表按变体区分，不同变体使用不同表，导致需要先完成初始化才能根据 partition 表执行后续逻辑；
整改方案：将 partition 表改为多个变体共用一个；
3. ComM 模块 PNC Learning SWS 实现（20h）
Learning Phase 管理：

实现 PNC 学习阶段的激活与去激活功能；
实现学习状态下各 API 返回正确错误码（COMM_E_LEARNING_ACTIVE）；
动态映射 API：

实现 PNC 到 Channel 的动态映射配置、查询与重置功能；
Learning 触发 API：

实现 Nm 层学习请求的转发与处理；
成员关系 API：

实现 PNC 成员关系的更新与同步；
Gateway 转发：

实现 ERA/IRA 报文的跨域转发与 PNC 映射设置；
本周实现：共 27个 SWS 需求
4. StbM 模块问题修复（6h）
【CPT-18211】StbMTimerStartThreshold 配置参数校验问题（已完成）；

问题说明：StbMTimerStartThreshold 应大于 StbM_MainFunctionPeriod，但工具未校验；
【CPT-18228】StbM 配置项命名无限制问题（已完成）；

问题说明：StbMGetRxFreshnessValueFuncName 等配置项命名无限制，配置相同名称仍能通过校验；