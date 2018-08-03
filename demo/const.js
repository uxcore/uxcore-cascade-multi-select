export const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      description: '美丽富饶的新一线城市',
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
      children: [{
        value: 'baotuquan',
        label: '趵突泉',
      }],
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

// export const options2 = [
//   {
//     "children": [
//       {
//         "children": [
//           { "disabled": false, "label": "d", "value": 287374 },
//           { "disabled": false, "label": "c", "value": 287375 },
//           { "disabled": false, "label": "b", "value": 287376 },
//           { "disabled": false, "label": "a", "value": 287377 }
//         ],
//         "disabled": false,
//         "label": "cj_test1",
//         "value": 1018
//       },
//       {
//         "children": [
//           { "disabled": false, "label": "test3", "value": 287378 }
//         ],
//         "disabled": false,
//         "label": "cj_test_2",
//         "value": 1019
//       }
//     ],
//     "disabled": false,
//     "label": "存己_操作2",
//     "value": 736695
//   },
//   {
//     "children": [
//       {
//         "children": [
//           { "disabled": false, "label": "d", "value": 287383 },
//           { "disabled": false, "label": "c", "value": 287384 },
//           { "disabled": false, "label": "b", "value": 287385 },
//           { "disabled": false, "label": "a", "value": 287386 }
//         ],
//         "disabled": false,
//         "label": "cj_test1",
//         "value": 1018
//       }, {
//         "children": [
//           { "disabled": false, "label": "test3", "value": 287387 }
//         ],
//         "disabled": false,
//         "label": "cj_test_2",
//         "value": 1019
//       }
//     ], "disabled": false, "label": "存己_操作一", "value": 736694
//   }
// ];

export const options2 = [{
  label: '常鸣—操作1',
  value: 1000,
  "disabled": true,
  children: [
    {
      label: 'cj_test1',
      value: 2001,
      "disabled": true,
      children: [
        { "disabled": true, "label": "d", "value": 287374 }
      ]
    }
  ]
}, {
  label: '常鸣—操作2',
  value: 1001,
  children: [
    {
      label: '222',
      value: 2001,
      disabled: true,
      children: [
        { "disabled": true, "label": "d2", "value": 287375 }
      ]
    }
  ]
}];

// 四级联动数据
export const options3 = [
  {
    value: 'anhui',
    label: '安徽',
    children: [{
      value: 'hefei',
      label: '合肥',
      children: [{
        value: 'dashushan',
        label: '大蜀山',
        children: [{
          value: 'shudingfengyun',
          label: '蜀顶风云',
        }, {
          value: 'shanjianyunhai',
          label: '山涧云海',
        }],
      }],
    }],
  }, {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      children: [{
        value: 'xihu',
        label: '西湖',
        children: [{
          value: 'santanyingyue',
          label: '三潭印月',
        }, {
          value: 'duanqiaocanxue',
          label: '断桥残月',
        }, {
          value: 'leifengxizhao',
          label: '雷峰夕照',
        }, {
          value: 'pinghuqiuyue',
          label: '平湖秋月',
        }],
      }],
    }, {
      value: 'ningbo',
      label: '宁波',
      children: [],
    }],
  },
];
