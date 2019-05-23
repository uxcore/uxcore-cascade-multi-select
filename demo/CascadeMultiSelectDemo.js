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

const dynamicData = [
  {
    value: 1,
    label: 'one',
    children: [
      {
        value: 2,
        label: 'two',
        children: [{
          value: 3,
          label: 'three',
          children: [{
            value: 4,
            label: 'four',
          }],
        }],
      },
    ],
  },
];

const {
  CascadeMultiPanel,
  CascadeMultiModal,
} = CascadeMultiSelect;

const size = '';

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      demo1: ['zhejiang'],
      demo2: [],
      demo3: ['xihu'],
      demo4: ['bingjiang', 'ningbo', 'jiangsu'],
      demo5: ['bingjiang', 'ningbo', 'anhui', 'shandong'],
      demo6: ['xihu', 'bingjiang', 'shandong'],
      demo7: [],
      demo8: [],
      demo9: [287374],
      demo10: ['bingjiang', 'ningbo', 'anhui', 'shandong', 'jiangsu', 'longname-0'],
      asyncOptions6: options,
      dynamicData,
      dynamicOptions: [],
      size,
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
            isCleanDisabledLabel={false}
            options={options}
            onOk={(valueList, labelList, leafList, cascadeSelected) => {
              console.log(valueList, labelList, leafList, cascadeSelected);
              this.setState({ demo1: leafList.map(item => item.value) });
            }}
            value={this.state.demo1}
            beforeRender={(value, opts) => {
              let back = '';
              function recursion(list) {
                list.forEach(item => {
                  if (item.checked) {
                    back += `${item.label}, `;
                  } else if (item.children && item.children.length) {
                    recursion(item.children);
                  }
                });
              }
              recursion(opts);

              return back.substring(0, back.length - 2);
            }}
          />
        </div>

        <hr />

        <div style={{ margin: 15 }}>
          <h3>尺寸 large</h3>
        </div>
        <div style={{ margin: 15, width: 200 }}>
          <CascadeMultiSelect
            className={'ucms-input'}
            dropdownClassName={'ucms-drop'}
            isCleanDisabledLabel={false}
            options={options}
            size={'large'}
          />
        </div>

        <hr />

        <div style={{ margin: 15 }}>
          <h3>尺寸 middle</h3>
        </div>
        <div style={{ margin: 15, width: 200 }}>
          <CascadeMultiSelect
            className={'ucms-input'}
            dropdownClassName={'ucms-drop'}
            isCleanDisabledLabel={false}
            options={options}
            size={'middle'}
          />
        </div>

        <hr />

        <div style={{ margin: 15 }}>
          <h3>尺寸 small</h3>
        </div>
        <div style={{ margin: 15, width: 200 }}>
          <CascadeMultiSelect
            className={'ucms-input'}
            dropdownClassName={'ucms-drop'}
            isCleanDisabledLabel={false}
            options={options}
            size={'small'}
          />
        </div>

        <hr />

        <div style={{ margin: 15 }}>
          <h3>动态</h3>
        </div>
        <div style={{ margin: 15, width: 200 }}>
          <CascadeMultiSelect
            options={this.state.dynamicOptions}
            onOk={(...params) => console.log('onOk', params)}
            onChange={(...params) => console.log('onChange', params)}
            cascadeSize={4}
            size={'middle'}
            value={[4]}
          />
          <br/>
          <button
            onClick={() => {
              // this.state.dynamicData[0].children[0].children[0].children = [{ value: 5, label: 'five' }];
              this.setState({ dynamicOptions: dynamicData }, () => {
                // console.log(this.state.dynamicData);
              });
            }}
          >
            改变 options
          </button>
        </div>

        <hr />

        <div style={{ margin: 15 }}>
          <h3>隐藏清空</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options}
            allowClear={false}
            value={this.state.demo2}
            size={'small'}
            onOk={(valueList) => {
              this.setState({ demo2: valueList });
            }}
          />
        </div>

        <hr />

        <div style={{ margin: 15 }}>
          <h3>启用搜索</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            config={[
              {
                showSearch: true
              },
              {
                checkable: true
              },
              {
                checkable: true
              }
            ]}
            options={options}
            allowClear={false}
            value={this.state.demo2}
            size={'small'}
            onOk={(valueList) => {
              this.setState({ demo2: valueList });
            }}
          />
        </div>

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>禁用 (不可展开面板)</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <h4>disabled</h4>
          <CascadeMultiSelect
            options={options}
            value={this.state.demo3}
            size={'small'}
            disabled
          />
          <h4>readOnly</h4>
          <CascadeMultiSelect
            options={options}
            value={this.state.demo3}
            readOnly
          />
        </div>

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>禁选前两级 (设置前两级 checkable: false)</h3>
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
            options={options}
            value={this.state.demo1}
            size={'small'}
            onOk={(valueList) => {
              this.setState({ demo1: valueList });
            }}
          />
        </div>

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>数据异步 （手动异步数据）</h3>
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
            >init</button> <button
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
            size={'small'}
            onItemClick={(item) => {
              if (item.value === 'xihu') {
                this.setState({
                  asyncOptions6: options2,
                  demo6: []
                });
              }
            }}
            onOk={(valueList) => {
              this.setState({ demo6: valueList });
            }}
            keyCouldDuplicated
          />
        </div>

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>不定级（四级）</h3>
        </div>
        <div style={{ position: 'relative', margin: 15 }}>
          <CascadeMultiSelect
            options={options3}
            value={this.state.demo7}
            cascadeSize={4}
            size={'small'}
            onOk={(valueList) => {
              console.log(valueList);
              this.setState({ demo7: valueList });
            }}
          />
        </div>

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>单选 (通过禁用所有级 + Props.onItemClick 实现)</h3>
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
            size={'small'}
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

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>只使用面板</h3>
        </div>
        <div style={{ position: 'relative', margin: 15, overflow: 'hidden' }}>
          <CascadeMultiPanel
            options={options2}
            value={this.state.demo9}
            size={'small'}
            onSelect={(valueList, labelList, leafList) => {
              console.log(leafList);
              this.setState({
                demo9: valueList,
              });
            }}
            className={'ucms-panel'}
            keyCouldDuplicated
          />
        </div>

        <hr />

        <div style={{ marginLeft: 20 }}>
          <h3>弹框模式</h3>
        </div>
        <div style={{ position: 'relative', margin: 15, width: 300 }}>
          <CascadeMultiModal
            className={'ucms-modal'}
            options={options2}
            isCleanDisabledLabel
            value={this.state.demo10}
            size={'small'}
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
