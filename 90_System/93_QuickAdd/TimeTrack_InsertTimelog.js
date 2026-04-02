module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const vars = quickAddApi.variables;

  const filePath = vars.insertFilePath;
  const line = vars.insertLine;

  if (!filePath || line === undefined) {
    new Notice("未找到插入位置，请先运行前置脚本");
    return;
  }

  // 🧩 1. desc
  let desc = await quickAddApi.inputPrompt("输入描述（可留空）");

  if (desc === null) {
    new Notice("已取消");
    return;
  }

  if (!desc || desc.trim() === "") {
    desc = "未填写描述";
  }

  // 🧩 2. mood
  const mood = await quickAddApi.suggester(
    ["🟢 正常", "🟡 一般", "🔴 紧张", "🛑 想要逃离"],
    ["🟢 正常", "🟡 一般", "🔴 紧张", "🛑 想要逃离"]
  );

  if (!mood) {
    new Notice("已取消");
    return;
  }

  // 🧩 3. 字段构造（核心扩展点）
  const fields = [
    { key: "desc", value: desc },
    { key: "mood", value: mood }
  ];

  // 👉 未来扩展示例：
  // const energy = await quickAddApi.suggester(...);
  // fields.push({ key: "energy", value: energy });

  // 🧩 4. 拼接字段字符串
  const fieldStr = fields
    .filter(f => f.value !== undefined && f.value !== null)
    .map(f => `@${f.key}(${f.value})`)
    .join(" ");

  // 🧩 5. 时间
  const time = window.moment().format("YYYY-MM-DD HH:mm:ss");

  const contentToInsert = `[Timelog::${time} - ${fieldStr}]`;

  // 🧩 6. 写入
  const file = app.vault.getAbstractFileByPath(filePath);

  if (!file) {
    new Notice("目标文件不存在");
    return;
  }

  const content = await app.vault.read(file);
  const lines = content.split("\n");

  const safeLine = Math.min(Math.max(line, 0), lines.length);

  lines.splice(safeLine, 0, contentToInsert);

  await app.vault.modify(file, lines.join("\n"));

  new Notice("Timelog 已插入");
};