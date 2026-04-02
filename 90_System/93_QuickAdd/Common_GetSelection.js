module.exports = async (params) => {
  const { app, quickAddApi } = params;

  try {
    if (!quickAddApi.variables) {
      quickAddApi.variables = {};
    }

    const view = app.workspace.getActiveViewOfType(Object);

    if (!view || !view.editor) {
      new Notice("没有可用的编辑器");
      return;
    }

    const editor = view.editor;

    const selectedText = editor.getSelection();

    if (!selectedText || selectedText.trim() === "") {
      new Notice("没有选中任何文本");
      return;
    }

    quickAddApi.variables.selectedText = selectedText.trim();

    new Notice(`捕获内容: ${selectedText.trim()}`);

  } catch (error) {
    console.error(error);
    new Notice("获取选区时出错");
  }
};