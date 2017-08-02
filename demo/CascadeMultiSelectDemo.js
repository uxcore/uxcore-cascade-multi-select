/**
 * CascadeMultiSelect Component Demo for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import CascadeMultiSelect from '../src';
import {
  options,
  options2,
  options3,
} from './const';

const {
  CascadeMultiPanel,
  CascadeMultiModal,
} = CascadeMultiSelect;

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      demo1: ['shanghai'],
      demo2: [],
      demo3: ['xihu'],
      demo4: ['bingjiang', 'ningbo', 'jiangsu'],
      demo5: ['bingjiang', 'ningbo', 'anhui', 'shandong'],
      demo6: ['xihu', 'bingjiang', 'shandong'],
      demo7: [],
      demo8: [],
      demo9: ['bingjiang', 'ningbo', 'anhui', 'shandong', 'jiangsu', 'longname-0'],
      demo10: ['bingjiang', 'ningbo', 'anhui', 'shandong', 'jiangsu', 'longname-0'],
      asyncOptions6: options,
    };
  }

  render() {
    return (
      <div>
        <div style={{ margin: 15 }}>
          <h3>基本</h3>
        </div>
        <div style={{ margin: 15, width: 200 }}>
          <CascadeMultiSelect
            className={'ucms-input'}
            dropdownClassName={'ucms-drop'}
            options={options}
            onOk={(valueList, labelList, leafList) => {
              console.log(valueList, labelList, leafList);
              // this.setState({ demo1: valueList });
              this.setState({ demo1: leafList.map(item => item.value) });
            }}
            value={this.state.demo1}
            onItemClick={(...params) => console.log(params)}
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
            onOk={(valueList) => {
              this.setState({ demo2: valueList });
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
          <h3>禁选前两级</h3>
          <p>(设置前两级 checkable: false)</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            config={
              [{
                checkable: false,
              }, {
                checkable: false,
              }, {}]
            }
            options={options2}
            value={this.state.demo5}
            onOk={(valueList) => {
              this.setState({ demo5: valueList });
            }}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>数据异步</h3>
          <p>
            （手动异步数据）
          </p>
          <p>
            <button
              type="button"
              className="kuma-button kuma-button-secondary"
              onClick={() => {
                this.setState({
                  demo6: ['xihu', 'bingjiang', 'shandong'],
                  asyncOptions6: options,
                });
              }}
            >init</button>
            &nbsp;
            <button
              type="button"
              className="kuma-button kuma-button-secondary"
              onClick={() => {
                this.setState({
                  demo6: ['xihu'],
                  asyncOptions6: options2,
                });
              }}
            >
              async
            </button>
          </p>
          <p>点击async更新options和value</p>
          <p>点击西湖，更新选项</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={this.state.asyncOptions6}
            value={this.state.demo6}
            onItemClick={(item) => {
              if (item.value === 'xihu') {
                this.setState({
                  asyncOptions6: options2,
                });
              }
            }}
            onOk={(valueList) => {
              this.setState({ demo6: valueList });
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
            onOk={(valueList) => {
              console.log(valueList);
              this.setState({ demo7: valueList });
            }}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>单选</h3>
          <p>通过禁用所有级 + Props.onItemClick 实现</p>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            config={[{
              checkable: false,
            }, {
              checkable: false,
            }, {
              checkable: false,
            }, {
              checkable: false,
            }]}
            options={options3}
            value={this.state.demo8}
            cascadeSize={4}
            onItemClick={(item, level) => {
              console.log(level, item);
              if (level === 4) {
                this.setState({
                  demo8: [item.value],
                });
              }
            }}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>只使用面板</h3>
        </div>
        <div style={{ position: 'relative', margin: 15, overflow: 'hidden' }}>
          <CascadeMultiPanel
            options={options2}
            value={this.state.demo9}
            onSelect={(valueList, labelList, leafList) => {
              console.log(leafList);
              this.setState({
                demo9: valueList,
              });
            }}
            className={'ucms-panel'}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <h3>弹框模式</h3>
        </div>
        <div style={{ position: 'relative', margin: 15, width: 300 }}>
          <CascadeMultiModal
            className={'ucms-modal'}
            options={options2}
            value={this.state.demo10}
            onOk={(valueList, labelList, leafList) => {
              console.log(valueList, labelList, leafList);
              this.setState({ demo10: valueList });
            }}
          />
        </div>
      </div>
    );
  }
}

export default Demo;
