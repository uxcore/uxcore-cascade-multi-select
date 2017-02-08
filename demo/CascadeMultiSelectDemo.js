/**
 * CascadeMultiSelect Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeMultiSelect = require('../src');


const options0 = [
  {
    value: 'anhui',
    label: '安徽',
    children: [{
      value: 'hefei',
      label: '合肥',
    }],
  }, {
    value: 'shandong',
    label: '山东',
    children: [{
      value: 'jinan',
      label: '济南',
    }],
  },
];

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      children: [{
        value: 'xihu',
        label: '西湖',
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
    }, {
      value: 'jiaxing',
      label: '嘉兴',
      children: [],
    }, {
      value: 'wenzhou',
      label: '温州',
      children: [],
    }, {
      value: 'lishui',
      label: '丽水',
      children: [],
    }, {
      value: 'linan',
      label: '临安',
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
    value: 'anhui',
    label: '安徽',
    children: [{
      value: 'hefei',
      label: '合肥',
      children: [{
        value: 'dashushan',
        label: '大蜀山',
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
  }
];

const options2 = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州',
      children: [{
        value: 'xihu',
        label: '西湖',
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
    }, {
      value: 'jiaxing',
      label: '嘉兴',
      children: [],
    }, {
      value: 'wenzhou',
      label: '温州',
      children: [],
    }, {
      value: 'lishui',
      label: '丽水',
      children: [],
    }, {
      value: 'linan',
      label: '临安',
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
    value: 'anhui',
    label: '安徽',
    children: [{
      value: 'hefei',
      label: '合肥',
      children: [{
        value: 'dashushan',
        label: '大蜀山',
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
  },
];

class Demo extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div style={{ margin: 15 }}>
          <h3>基本</h3>
        </div>
        <div style={{ margin: 15 }}>
          <CascadeMultiSelect
            options={options}
            onSelect={(resa, resb) => {
              console.log(resa, resb);
            }}
          />
        </div>
        <div style={{ margin: 15 }}>
          <h3>隐藏清空</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options}
            allowClear={false}
            value={['xihu']}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>禁用</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options2}
            value={['xihu']}
            disabled
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>只读</h3>
          <p>(不可修改选中与清空)</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options2}
            value={['bingjiang', 'ningbo', 'anhui', 'shandong']}
            readOnly
          />
        </div>
      </div>
    );
  }
}

module.exports = Demo;
