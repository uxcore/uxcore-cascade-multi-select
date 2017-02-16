const locale = {
  'zh-cn': {
    noData: '没有数据',
    selected: '已选择',
    clean: '清空',
    haveAll: '已全选',
    all: '全部',
    placeholder: '请选择',
    delete: '删除',
  },
  'en-us': {
    noData: 'No Data',
    selected: 'Selected',
    clean: 'Clean',
    haveAll: 'Have All',
    all: 'All',
    placeholder: 'Please Select',
    delete: 'Delete',
  },
};

export default (key) => {
  if (locale[key]) {
    return locale[key];
  }
  return locale['zh-cn'];
};
