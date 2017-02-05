/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
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
    const { selectArray } = this.state;
    if (data.value !== selectArray[level]) {
      selectArray.splice(level + 1);
    }
    selectArray[level] = data.value;
    this.setState({ selectArray });
  }

  // checkbox 选中事件
  onItemChecked(item, level) {
    item.checked = !item.checked;
    item.halfChecked = false;
    if (item.children) {
      this.setChildrenChecked(item.children, item.checked);
    }
    if (level) {
      this.eachBotherCheckState(item, level, item.checked);
    }
    this.setState(this.state);
  }

  // 清空结果
  onCleanSelect() {
    const { dataList } = this.state;
    if (dataList) {
      this.cleanResult(dataList);
    }
    this.setState(this.state);
  }

  // 设置结果tree
  setResultTree() {
    const { prefixCls } = this.props;
    const { dataList } = this.state;
    this.state.handleSelectNums = 0;
    return (
      <div className={classnames([`${prefixCls}-result-tree`])}>
        {this.getTreeNode(dataList)}
      </div>
    );
  }

  // 获取选中的treeNode
  getTreeNode(dataList) {
    const arr = [];
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked || item.halfChecked) {
          this.state.handleSelectNums += 1;
          arr.push(
            <li
              className={classnames('tree-node-ul-li-')}
              title={item.label}
              key={item.value}
            >
              {item.label}
              {item.children ? this.getTreeNode(item.children) : null}
            </li>
          );
        }
      });
    }
    return (
      <ul className={classnames('tree-node-ul')}>
        {arr}
      </ul>
    );
  }

  getNums(dataList) {
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked || item.halfChecked) {
          this.handleSelectNums += 1;
          if (item.children) {
            this.getNums(item.children);
          }
        }
      });
    }
  }

  setResultNums() {
    const { dataList } = this.state;
    this.handleSelectNums = 0;
    this.getNums(dataList);
    if (!this.handleSelectNums) {
      return null;
    }
    return (
      <span>({this.handleSelectNums})</span>
    );
  }

  // 设置children checked
  setChildrenChecked(data, checked) {
    if (data && data.length) {
      data.forEach(item => {
        item.checked = checked;
        item.halfChecked = false;
        if (item.children) {
          this.setChildrenChecked(item.children, checked);
        }
      });
    }
  }

  // 获取指定key的children
  getChildrenNode(data, key) {
    let back = [];
    if (!key) { return []; }
    if (data && data.length) {
      for (let i = 0, len = data.length; i < len; i += 1) {
        const item = data[i];
        if (item.value === key) {
          return item.children;
        }
        if (item.children) {
          const res = this.getChildrenNode(item.children, key);
          back = res.length ? res : back;
        }
      }
    }
    return back;
  }

  // 获取指定节点对象
  getNodeData(data, key) {
    let back = null;
    if (!key) { return null; }
    if (data && data.length) {
      for (let i = 0, len = data.length; i < len; i += 1) {
        if (data[i].value === key) {
          return data[i];
        }
        if (data[i].children) {
          const item = this.getNodeData(data[i].children, key);
          back = item ? item : back;
        }
      }
    }
    return back;
  }

  // 设置父节点选中状态
  setFatherCheckState(halfChecked, level, checked) {
    const { dataList, selectArray } = this.state;
    const dataObj = this.getNodeData(dataList, selectArray[level - 1]);
    dataObj.checked = halfChecked ? false : checked;
    dataObj.halfChecked = halfChecked;
    if (level - 1) {
      this.eachBotherCheckState(dataObj, level - 1, checked);
    }
  }

  // 遍历兄弟节点
  eachBotherCheckState(data, level, checked) {
    const { dataList, selectArray } = this.state;
    const listArray = this.getChildrenNode(dataList, selectArray[level - 1]);
    let halfChecked = false;
    if (listArray) {
      for (let i = 0, len = listArray.length; i < len; i += 1) {
        if (listArray[i].checked !== checked) {
          halfChecked = true;
        }
      }
      this.setFatherCheckState(halfChecked, level, checked);
    }
  }

  // 递归清空结果
  cleanResult(dataList) {
    if (dataList) {
      dataList.forEach((item) => {
        item.checked = false;
        item.halfChecked = false;
        if (item.children) {
          this.cleanResult(item.children);
        }
      });
    }
  }

  renderUlList(level) {
    const t = this;
    const { className, prefixCls } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) { return null; }
    const listArray = level ? t.getChildrenNode(dataList, selectArray[level - 1]) : dataList;
    return (
      <ul
        key={level}
        className={classnames({
          className: !!className,
          [`${prefixCls}-content`]: true,
        }, 'use-svg')}
      >
        {t.renderListItems(listArray, level)}
      </ul>
    );
  }

  renderListItems(dataList, level) {
    const t = this;
    const { className, prefixCls } = this.props;
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
          onClick={() => {
            t.onItemClick(item, level);
          }}
        >
          <label
            className={classnames({
              className: !!className,
            }, [`${prefixCls}-item-label`])}
          >
            <s
              className={classnames({
                className: !!className,
                'kuma-tree-checkbox': true,
                'kuma-tree-checkbox-indeterminate': item.halfChecked,
                'kuma-tree-checkbox-checked': item.checked && !item.halfChecked
              })}
              onClick={() => {
                t.onItemChecked(item, level);
              }}
            />
            {item.label}
          </label>
        </li>
      );
    });
  }

  // 渲染结果列表
  renderResult() {
    const { prefixCls } = this.props;
    return (
      <div
        className={classnames([`${prefixCls}-result`])}
      >
        <div className={classnames([`${prefixCls}-result-title`])}>
          已选择 {this.setResultNums()}
          <span
            className={classnames([`${prefixCls}-result-clean`])}
            onClick={() => {
              this.onCleanSelect();
            }}
          >清空</span>
        </div>
        {this.setResultTree()}
      </div>
    );
  }

  render() {
    const { className, prefixCls, cascadeSize, config } = this.props;
    const depthSize = config.length || cascadeSize;
    let arr = [];
    for (let i = 0; i < depthSize; i += 1) {
      arr.push(
        this.renderUlList(i)
      );
    }
    return (
      <div
        className={classnames({
          className: !!className
        }, [`${prefixCls}`])}
      >
        {arr}
        {this.renderResult()}
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
