/**
 * CascadeMultiSelect Component Demo for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */

const React = require('react');
const CascadeMultiSelect = require('../src');

import {
  options,
  options2,
  options3,
} from './const';

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      demo1: [],
      demo2: [],
      demo3: ['xihu'],
      demo4: ['bingjiang', 'ningbo', 'jiangsu'],
      demo5: ['bingjiang', 'ningbo', 'anhui', 'shandong'],
      demo6: ['xihu'],
      asyncOptions6: options,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        demo6: ['hangzhou', 'ningbo', 'anhui', 'shandong'],
        asyncOptions6: options2,
      });
    }, 5000);
  }

  render() {
    return (
      <div style={{ width: 300 }}>
        <div style={{ margin: 15 }}>
          <h3>基本</h3>
        </div>
        <div style={{ margin: 15 }}>
          <CascadeMultiSelect
            options={options}
            onSelect={(resa, resb) => {
              console.log(resa, resb);
              this.setState({ demo1: resa });
            }}
            value={this.state.demo1}
          />
        </div>
        <div style={{ margin: 15 }}>
          <h3>隐藏清空</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options}
            allowClear={false}
            value={this.state.demo2}
            onSelect={(resa) => {
              this.setState({ demo2: resa });
            }}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>禁用</h3>
          <p>(不可展开面板)</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options2}
            value={this.state.demo3}
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
            value={this.state.demo4}
            readOnly
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>禁选第二级</h3>
          <p>(设置第二级 checkable: false)</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            config={
              [{
                checkable: true,
              }, {
                checkable: false,
              }, {}]
            }
            options={options2}
            value={this.state.demo5}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>数据异步</h3>
          <p>(异步设置 options 和 value)</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={this.state.asyncOptions6}
            value={this.state.demo6}
            onSelect={(resa, resb) => {
              console.log(resa, resb);
              this.setState({ demo6: resa });
            }}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>不定级（四级）</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options3}
            value={this.state.demo7}
            cascadeSize={4}
          />
        </div>
      </div>
    );
  }
}

export default Demo;
