```js
// ==========================================
// 1. 配置区域：在这里定义你的替换规则
// ==========================================
const mappings = [
  // {
  //   sourceKey: 'project_id',       // JSON里的原始字段名
  //   originalValue: '123456',       // 需要被替换的原始值 (ID)
  //   newValue: '官网重构项目',       // 想要变成的新值 (名称)
  //   prefix: 'My_'                  // 固定前缀
  // },
  {
    sourceKey: 'pid',    
    originalValue: '218897646',
    newValue: 'AUTOSAR 时间同步模块维护',
    prefix: 'n8n_isoft_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '216773655',
    newValue: 'AUTOSAR 网络管理模块维护',
    prefix: 'n8n_isoft_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '215866520',
    newValue: '产品研发管理杂项',
    prefix: 'n8n_isoft_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '219034046',
    newValue: '乱七八糟的支持',
    prefix: 'n8n_isoft_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '216762831',
    newValue: '满嘴顺口溜',
    prefix: 'n8n_me_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '216762600',
    newValue: '风雨破敞搭建',
    prefix: 'n8n_me_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '216762085',
    newValue: '高频刺激脑皮层',
    prefix: 'n8n_me_'
  },
  {
    sourceKey: 'pid',    
    originalValue: '219034072',
    newValue: '登神长阶',
    prefix: 'n8n_me_'
  },
  // 你可以在这里继续添加更多规则...
];

// ==========================================
// 2. 执行区域：自动遍历并处理数据
// ==========================================
for (const item of $input.all()) {
  
  // 遍历你定义的每一条规则
  for (const map of mappings) {
    const { sourceKey, originalValue, newValue, prefix } = map;
    
    // 获取当前数据项中该字段的值 (防止字段不存在报错)
    const currentValue = item.json[sourceKey];
    
    // 判断：如果当前值 等于 我们设定的原始值
    if (currentValue == originalValue) {
      
      // 生成新的键名：前缀 + 属性名
      const newKey = `${prefix}${sourceKey}`;
      
      // 插入新的键值对
      item.json[newKey] = newValue;
      
      // (可选) 如果你想顺便把旧字段删掉，可以取消下面这行的注释
      // delete item.json[sourceKey];
    }
  }
}

return $input.all();
```