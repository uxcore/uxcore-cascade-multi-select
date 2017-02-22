const locale = {
  'zh-cn': {
    noData: '没有数据',
    selected: '已选择',
    clean: '清空',
    haveAll: '已全选',
    all: '全部',
    placeholder: '请选择',
    delete: '删除',
    close: '收起',
    expandAll: '展开全部',
    item: '项',
    title: '级联选择',
  },
  'en-us': {
    noData: 'No Data',
    selected: 'Selected',
    clean: 'Clean',
    haveAll: 'Have All',
    all: 'All',
    placeholder: 'Please Select',
    delete: 'Delete',
    close: 'Close',
    expandAll: 'Expand All ',
    item: ' Item',
    title: 'Cascade Multi Select',
  },
};

export default (key) => {
  if (locale[key]) {
    return locale[key];
  }
  return locale['zh-cn'];
};
