module.exports = async (params) => {
  const { app, quickAddApi } = params;

  try {
    // ✅ 初始化 variables（关键修复）
    if (!quickAddApi.variables) {
      quickAddApi.variables = {};
    }

    const TARGET_FOLDER = "TaskNotes/Tasks";

    const files = app.vault.getMarkdownFiles()
      .filter(f => f.path.startsWith(TARGET_FOLDER));

    if (!files.length) {
      new Notice("目标路径下没有文件");
      return;
    }

    let activeMatches = [];

    for (const file of files) {
      const cache = app.metadataCache.getFileCache(file);
      const frontmatter = cache?.frontmatter;

      if (!frontmatter || !frontmatter.timeEntries) continue;

      const entries = frontmatter.timeEntries;

      if (!Array.isArray(entries)) continue;

      entries.forEach((entry, index) => {
        const hasStart = !!entry.startTime;
        const noEnd = !entry.endTime;

        if (hasStart && noEnd) {
          activeMatches.push({
            file,
            index
          });
        }
      });
    }

    if (activeMatches.length === 0) {
      new Notice("没有正在进行的时间跟踪");
      return;
    }

    if (activeMatches.length > 1) {
      new Notice("存在多个正在进行的时间跟踪，请先处理");
      return;
    }

    const match = activeMatches[0];

    quickAddApi.variables.activeFilePath = match.file.path;
    quickAddApi.variables.activeEntryIndex = match.index;

    new Notice(`已定位页面: ${match.file.name}`);

  } catch (error) {
    console.error(error);
    new Notice("检测时间跟踪时出错");
  }
};