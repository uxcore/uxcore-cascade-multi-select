const locale = {
  'zh-cn': {
    noData: '没有数据',
    selected: '已选择',
    clean: '清空',
    all: '已全选',
  },
  'en-us': {
    noData: 'No Data',
    selected: 'Selected',
    clean: 'Clean',
    all: 'Have All',
  },
};


export default (key) => {
  if (locale[key]) {
    return locale[key];
  }
  return locale['zh-cn'];
};
