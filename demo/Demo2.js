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
          children: null,
        }],
      },
    ],
  },
];

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
      dynamicData,
    };
  }

  render() {
    return (
      <div>
        <div style={{ margin: 15 }}>
          <h3>动态</h3>
        </div>
        <div style={{ margin: 15, width: 200 }}>
          <CascadeMultiSelect
            options={this.state.dynamicData}
            onOk={(...params) => console.log('onOk', params)}
            onChange={(...params) => console.log('onChange', params)}
            cascadeSize={4}
            onItemClick={(s, level) => {
              if (level === 3) {
                this.state.dynamicData[0].children[0].children[0].children = [{ value: 5, label: 'five' }];
                this.setState({ dynamicData: this.state.dynamicData }, () => {
                  // console.log(this.state.dynamicData);
                });
              }
            }}
          />
        </div>
      </div>
    );
  }
}

export default Demo;
