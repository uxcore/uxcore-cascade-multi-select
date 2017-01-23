/**
 * CascadeMultiSelect Component Demo for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeMultiSelect = require('../src');

const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖'
    }],
  },{
    value: 'nanjin',
    label: '南京',
    children: [{
      value: 'zhonghua',
      label: '中华',
    }],
  },{
    value: 'hefe',
    label: '合肥',
    children: [{
      value: 'dashusha',
      label: '大蜀山',
    }],
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
}];

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <CascadeMultiSelect
          options={options}
        />
      </div>
    );
  }
}

module.exports = Demo;
