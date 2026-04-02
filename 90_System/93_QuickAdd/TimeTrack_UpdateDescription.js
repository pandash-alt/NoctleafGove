module.exports = async (params) => {
  const { app, quickAddApi } = params;

  try {
    const filePath = quickAddApi.variables.activeFilePath;
    const index = quickAddApi.variables.activeEntryIndex;
    const selectedText = quickAddApi.variables.selectedText;

    if (!filePath || index === undefined || !selectedText) {
      new Notice("缺少必要数据，请先执行前置步骤");
      return;
    }

    const file = app.vault.getAbstractFileByPath(filePath);

    if (!file) {
      new Notice("找不到目标文件");
      return;
    }

    const metaEdit = app.plugins.plugins["metaedit"]?.api;

    if (!metaEdit) {
      new Notice("MetaEdit 插件未启用");
      return;
    }

    const type = await quickAddApi.suggester(
      ["Tasks 创建的 TODO 的 Id", "Markdown 的标题"],
      ["tasks", "head"]
    );

    if (!type) {
      new Notice("已取消");
      return;
    }

    const desc = await quickAddApi.inputPrompt("输入正文描述（可留空）");

    let finalText = `@${type}[${selectedText}]`;

    if (desc && desc.trim() !== "") {
      finalText += ` ${desc.trim()}`;
    }

    const cache = app.metadataCache.getFileCache(file);
    const frontmatter = cache?.frontmatter;

    if (!frontmatter || !frontmatter.timeEntries) {
      new Notice("未找到 timeEntries");
      return;
    }

    const entries = [...frontmatter.timeEntries];

    if (!entries[index]) {
      new Notice("索引无效");
      return;
    }

    entries[index] = {
      ...entries[index],
      description: finalText
    };

    await metaEdit.update("timeEntries", entries, file);

    new Notice(`已更新: ${finalText}`);

  } catch (error) {
    console.error(error);
    new Notice("写入 description 时出错");
  }
};