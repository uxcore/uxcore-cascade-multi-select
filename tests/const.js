export const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      children: [{
        value: 'xihu',
        label: '西湖',
        disabled: true,
      }, {
        value: 'bingjiang',
        label: '滨江',
      }],
    }, {
      value: 'ningbo',
      label: '宁波',
      children: [{
        value: 'zhoushan',
        label: '舟山',
      }],
    }, {
      value: 'yiwu',
      label: '义乌',
      children: [{
        value: 'jinhua',
        label: '金华',
      }],
    }, {
      value: 'changxing',
      label: '长兴',
      children: [],
    }],
  }, {
    value: 'jiangsu',
    label: '江苏',
    children: [{
      value: 'nanjing',
      label: '南京',
      children: [{
        value: 'zhonghuamen',
        label: '中华门',
      }],
    }],
  }, {
    value: 'shandong',
    label: '山东',
    children: [{
      value: 'jinan',
      label: '济南',
      disabled: true,
      children: [{
        value: 'baotuquan',
        label: '趵突泉',
      }],
    }, {
      value: 'test',
      label: 'test',
    }],
  }, {
    value: 'longname-0',
    label: '名称很长的选项展示效果0',
    children: [{
      value: 'longname-0-0',
      label: '名称很长的选项展示效果0-0',
      children: [{
        value: 'longname-0-0-0',
        label: '名称很长的选项展示效果0-0-0',
      }],
    }],
  },
];

export const optionsWithDescription = [
  {
    value: 'zhejiang',
    label: '浙江',
    description: '这是浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      description: '这是杭州',
      children: [{
        value: 'xihu',
        label: '西湖',
        description: '这是西湖',
        disabled: true,
      }, {
        value: 'bingjiang',
        label: '滨江',
        description: '这是滨江',
      }],
    }],
  }, {
    value: 'jiangsu',
    label: '江苏',
    description: '这是江苏',
    children: [{
      value: 'nanjing',
      label: '南京',
      description: '这是南京',
      children: [{
        value: 'zhonghuamen',
        label: '中华门',
        description: '这是中华门',
      }],
    }],
  }
];
