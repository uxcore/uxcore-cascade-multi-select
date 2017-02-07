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

const option3 = [
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

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value2: ['xihu'],
      inputVal: '',
      showing: false,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value2: ['bingjiang', 'ningbo', 'anhui', 'shandong'],
      });
    }, 3000);
  }

  handleSelect(resa, resb) {
    this.setState({
      inputVal: resb.join(),
    });
  }

  render() {
    const styleSheet = {
      cascade3: {
        position: 'relative',
        zIndex: 1000,
      },
    };
    const { showing } = this.state;
    styleSheet.cascade3.display = showing ? 'block' : 'none';
    return (
      <div>
        <div style={{ margin: 15 }}>
          包含input展示效果
        </div>
        <div style={{ margin: 15 }}>
          <div>
            <input
              className="kuma-input"
              value={this.state.inputVal}
              onFocus={() => {
                this.setState({
                  showing: !showing,
                });
              }}
            />
          </div>
          <div style={styleSheet.cascade3}>
            <CascadeMultiSelect
              options={option3}
              cascadeSize={2}
              onSelect={(resa, resb) => {
                this.handleSelect(resa, resb);
              }}
              onClick={() => {
                this.setState({
                  showing: true,
                });
              }}
            />
          </div>
        </div>
        <div style={{ margin: 15 }}>
          默认展示
        </div>
        <div style={{ position: 'relative', margin: '15px', height: 350 }}>
          <CascadeMultiSelect
            options={options}
            onSelect={(resa, resb) => { console.log(resa, resb); }}
          />
        </div>
        <div style={{ marginLeft: 20 }}>
          <p>数据回填 (async)</p>
          <p>readOnly模式 (不可修改选中与清空)</p>
          <p>locale ('en-us')</p>
        </div>
        <div style={{ position: 'relative', margin: '15px', height: 350 }}>
          <CascadeMultiSelect
            options={options2}
            value={this.state.value2}
            readOnly
            locale={'en-us'}
          />
        </div>
      </div>
    );
  }
}

module.exports = Demo;
