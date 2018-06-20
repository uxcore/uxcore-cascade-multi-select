/**
 * CascadeMultiSelect Component Demo for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import CascadeMultiSelect from '../src';

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

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
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
                const newData = this.state.dynamicData.concat([]);
                newData[0].children[0].children[0].children = [{ value: 5, label: 'five' }];
                this.setState({ dynamicData: newData }, () => {
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
