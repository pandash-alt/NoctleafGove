module.exports = async (params) => {
  const { app, quickAddApi } = params;
  const vars = quickAddApi.variables;

  const TARGET_DAILY_FOLDER = "30_Jouney/Days";

  const filePath = vars.activeFilePath;
  const index = vars.activeEntryIndex;

  let targetFilePath;
  let insertLine = -1;

  // 🧩 情况 1：没有 active tracking → fallback
  if (!filePath || index === undefined) {
    const today = window.moment().format("YYYY-MM-DD");
    targetFilePath = `${TARGET_DAILY_FOLDER}/${today}.md`;

    const file = app.vault.getAbstractFileByPath(targetFilePath);

    if (!file) {
      new Notice(`今日日志不存在：${targetFilePath}`);
      return;
    }

    const content = await app.vault.read(file);
    const lines = content.split("\n");

    insertLine = lines.length;

    vars.insertFilePath = targetFilePath;
    vars.insertLine = insertLine;

    new Notice("未检测到时间跟踪，插入到今日日志末尾");
    return;
  }

  // 🧩 情况 2：有 active tracking
  const file = app.vault.getAbstractFileByPath(filePath);
  if (!file) {
    new Notice("目标文件不存在");
    return;
  }

  const cache = app.metadataCache.getFileCache(file);
  const fm = cache?.frontmatter;

  if (!fm || !fm.timeEntries || !fm.timeEntries[index]) {
    new Notice("timeEntries 数据异常");
    return;
  }

  const entry = fm.timeEntries[index];
  const description = entry.description || "";

  // ✅ 可扩展类型
  const SUPPORTED_TYPES = ["tasks", "head"];
  const typePattern = SUPPORTED_TYPES.join("|");
  const regex = new RegExp(`^@(${typePattern})\\[(.*?)\\]`);
  const match = description.match(regex);

  const content = await app.vault.read(file);
  const lines = content.split("\n");

  // ✅ YAML 边界
  const fmPos = cache?.frontmatterPosition;
  const bodyStartLine = fmPos ? fmPos.end.line + 1 : 0;

  // 🧩 不符合类型 → 文件末尾
  if (!match) {
    insertLine = lines.length;

    vars.insertFilePath = filePath;
    vars.insertLine = insertLine;

    new Notice("未匹配类型，插入到文件末尾");
    return;
  }

  const type = match[1];
  const keyword = match[2];

  // 🧩 只在正文查找
  let foundLine = -1;

  for (let i = bodyStartLine; i < lines.length; i++) {
    if (lines[i].includes(keyword)) {
      foundLine = i;
      break;
    }
  }

  // 🧩 找不到 → 文件末尾
  if (foundLine === -1) {
    insertLine = lines.length;

    vars.insertFilePath = filePath;
    vars.insertLine = insertLine;

    new Notice(`未在正文找到「${keyword}」，插入到文件末尾`);
    return;
  }

  // 🧩 找到 → 插入下一行
  insertLine = foundLine + 1;

  vars.insertFilePath = filePath;
  vars.insertLine = insertLine;

  new Notice(`插入到「${keyword}」所在行下方`);
};