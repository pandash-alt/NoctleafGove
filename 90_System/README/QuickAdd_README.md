
## 
前文提要: [[90_System/README/Dataview_README#TimeViewScript|TimeViewScript]]
该脚本为自动插件 `Timelog` 到指定的位: 
1. 首先分析当前正在进行时间追踪的 **TaskNotes** 页面:
	1. 若页面存在则这条 Timelog 确定要插入该页面
	2. 若不存在则插入到当天的日记页面最尾端
	3. 前提要求仅仅存在一个页面正在进行时间追踪，否则同样视为页面不存在
2. 若找到相应的 TaskNotes 页面后分析 **timeEntries.description** 的格式:
	1. 若为`@tasks[ABC] EFG` 则插入到 'ABC' 对应的 **tasks** 插件创建的代办信息的下一行
	2. 若为 `@head[ABC] EFG` 则插入到标题 'ABC' 的下一行
	3. 若非以上两种格式，或者无法解析到 'ABC' 对应的目标，则插入到当前页面的最后一行

## 
前文提要: [[90_System/README/Dataview_README#TimeViewScript|TimeViewScript]]
该脚本为自动填写 **timeEntries.description**: 
1. 检查当前页面是否是 **TaskNotes** 页面
2. 检测当前页面是否正在进行 **时间跟踪**
3. 检测正在进行时间追踪的的 **timeEntries.description** 是否为空
4. 检测当前鼠标是否有已经选中的文本
5. 当满足以上四点情况后，弹出下拉框选择前缀信息，如tasks、head，弹出文本框可选的填入描述信息（对应{简要}）。结合第四步选中的文本整理成完整的 **timeEntries.description** 信息并填入

