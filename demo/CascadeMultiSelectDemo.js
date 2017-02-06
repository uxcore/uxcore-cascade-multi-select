/**
 * CascadeMultiSelect Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeMultiSelect = require('../src');

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州',
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
      label: '义务',
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

const options2 = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{
      value: 'hangzhou',
      label: '杭州杭州杭州杭州杭州杭州杭州杭州杭州杭州',
      children: [{
        value: 'xihu',
        label: '西湖'
      },{
        value: 'bingjiang',
        label: '滨江'
      }],
    },{
      value: 'ningbo',
      label: '宁波',
      children: [{
        value: 'zhoushan',
        label: '舟山',
      }],
    },{
      value: 'yiwu',
      label: '义务',
      children: [{
        value: 'jinhua',
        label: '金华',
      }],
    },{
      value: 'changxing',
      label: '长兴',
      children: []
    },{
      value: 'jiaxing',
      label: '嘉兴',
      children: []
    },{
      value: 'wenzhou',
      label: '温州',
      children: []
    },{
      value: 'lishui',
      label: '丽水',
      children: []
    },{
      value: 'linan',
      label: '临安',
      children: []
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
  },{
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
  }
];

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <div style={{ marginLeft: 20 }}>
        </div>
        <div style={{ position: 'relative', margin: '15px', height: 350 }}>
          <CascadeMultiSelect
            options={options}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <p>数据回填</p>
          <p>readOnly模式</p>
          <p>locale('en-us')</p>
        </div>
        <div style={{ position: 'relative', margin: '15px', height: 350 }}>
          <CascadeMultiSelect
            options={options2}
            value={['xihu', 'ningbo', 'anhui']}
            readOnly
            locale={'en-us'}
          />
        </div>
      </div>
    );
  }
}

module.exports = Demo;
