/**
 * CascadeMultiSelect Component for uxcore
 * @author eternalsky
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
class CascadeMultiSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataList: props.options,
      selectArray: [],
    };
  }

  // li点击事件
  onItemClick(data, level) {
    const t = this;
    const { config, className, prefixCls } = this.props;
    const { selectArray } = this.state;
    if(data.value !== selectArray[level]) {
      selectArray.splice(level + 1)
    }
    selectArray[level] = data.value;
    t.setState({selectArray});
  }

  // checkbox 选中事件
  onItemChecked(item) {
    item.checked = !item.checked;
    if(item.children) {
      this.setChildrenChecked(item.children, item.checked);
    }
    this.setState(this.state);
  };

  // 设置children checked
  setChildrenChecked(data, checked) {
    if(data && data.length) {
      data.forEach(item => {
        item.checked = checked;
        if(item.children) {
          this.setChildrenChecked(item.children, checked);
        }
      });
    }
  }

  // 获取当前选中key的children
  getChildrenNode(data, key) {
    let back = [];
    if(!key) { return []; }
    if(data && data.length) {
      for(let i = 0 , len = data.length; i < len ; i += 1) {
        let item = data[i];
        if (item.value === key) {
          return item.children;
        }
        if (item.children) {
          let res = this.getChildrenNode(item.children, key);
          back = res.length ? res : back;
        }
      }
    }
    return back;
  }

  renderUlList(level) {
    const t = this;
    const { config, className, prefixCls } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) { return null; }
    const listArray = level ? t.getChildrenNode(dataList, selectArray[level - 1]) : dataList;
    return (
      <ul
        key={level}
        className={classnames({
          className: !!className,
          [`${prefixCls}-content`]: true
        })}
      >
        { t.renderListItems(listArray, level) }
      </ul>
    )
  }

  renderListItems(dataList, level) {
    const t = this;
    const { config, className, prefixCls } = this.props;
    const { selectArray } = this.state;
    return dataList.map((item) => {
      return (
        <li
          key={item.value}
          className={classnames({
            className: !!className,
            [`${prefixCls}-list-item`]: !!prefixCls,
            [`${prefixCls}-checked`]: item.checked && !item.disabled
          })}
          title={item.label}
          onClick={()=> {
            t.onItemClick(item, level)
          }}
        >
          <label
            className={classnames({
              className: !!className,
              [`${prefixCls}-item-label`]: true
            })}
          >
            <input
              type="checkbox"
              checked={item.checked}
              className={classnames({
                className: !!className,
                [`${prefixCls}-item-input`]: true,
                'kuma-checkbox': true
              })}
              onChange={() => {
                t.onItemChecked(item, level);
              }}
            />
            <s />
            {item.label}
          </label>
        </li>
      );
    });
  }

  render() {
    const { className, prefixCls, cascadeSize, config, options } = this.props;
    const depthSize = config.length || cascadeSize;
    let arr = [];
    for(let i = 0 ; i < depthSize; i += 1) {
      arr.push(
        this.renderUlList(i)
      )
    }
    return (
      <div
        className={classnames({
          className: !!className,
          [`${prefixCls}`]: true
        })}
      >
        {arr}
      </div>
    );
  }
}

CascadeMultiSelect.defaultProps = {
  className: '',
  prefixCls: 'uxcore-cascade-multi-select',
  config: [],
  options: [],
  cascadeSize: 3,
};


// http://facebook.github.io/react/docs/reusable-components.html
CascadeMultiSelect.propTypes = {
  className: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  config: React.PropTypes.array,
  options: React.PropTypes.array,
  cascadeSize: React.PropTypes.number,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

module.exports = CascadeMultiSelect;
