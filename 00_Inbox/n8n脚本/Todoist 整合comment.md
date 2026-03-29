```js
// 1. 获取所有输入数据
const allItems = $input.all();

// 2. 建立索引容器
const projects = {};
const sections = {};
const tasks = {};
const comments = [];

// 3. 根据 type 字段分类存储
for (const item of allItems) {
  const json = item.json;
  // 读取我们定义的“独家标签”
  const type = json.n8n_source_type; 

  if (type === 'project') {
    projects[json.id] = json;
  } 
  else if (type === 'section') {
    sections[json.id] = json;
  } 
  else if (type === 'task') {
    tasks[json.id] = json;
  } 
  else if (type === 'comment') {
    comments.push(json);
  }
}

// 4. 核心处理：遍历评论，反向查找关联信息
const finalReport = [];

for (const comment of comments) {
  // A. 找到关联的任务
  const task = tasks[comment.item_id];
  
  // 如果任务找不到，跳过这条评论
  if (!task) {
    continue; 
  }

  // B. 找到关联的项目
  const project = projects[task.project_id];

  // C. 找到关联的板块
  const section = task.section_id ? sections[task.section_id] : null;

  // D. 组装最终结果
  finalReport.push({
    json: {
      // --- 评论信息 ---
      type: 'Todoist Comment',
      comment_id: comment.id,
      comment_content: comment.content,
      comment_time: comment.posted_at,
      
      // --- 任务信息 ---
      task_id: task.id,
      task_title: task.content,
      task_desc: task.description,
      
      // --- 板块信息 ---
      section_id: section ? section.id : "",
      section_name: section ? section.name : "无板块",
      
      // --- 项目信息 ---
      project_id: project ? project.id : "未知",
      project_name: project ? project.name : "未知项目"
    }
  });
}

// 5. 返回最终报告
return finalReport;
```
