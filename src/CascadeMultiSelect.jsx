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

  componentDidMount() {
    const { data } = this.props;
    const { dataList } = this.state;
    if (data && data.length) {
      console.log(data);
      this.setData(data, dataList, 0);
    }
  }

  onTriggerNode(e, data) {
    if (window.event.cancelBubble) {
      window.event.cancelBubble = true;
    } else {
      e.stopPropagation();
    }
    data.expand = !data.expand;
    this.setState(this.state);
  }

  onCleanSelect() {
    const { dataList } = this.state;
    if (dataList) {
      this.cleanResult(dataList);
    }
    this.setState(this.state);
  }

  onItemClick(data, level) {
    const { selectArray } = this.state;
    if (data.value !== selectArray[level]) {
      selectArray.splice(level + 1);
    }
    selectArray[level] = data.value;
    this.setState({ selectArray });
  }

  onItemChecked(item, level) {
    const { dataList } = this.state;
    item.checked = !item.checked;
    item.halfChecked = false;
    if (item.children) {
      this.setChildrenChecked(item.children, item.checked);
    }
    if (level) {
      this.eachBotherCheckState(item, level, item.checked);
    }
    this.setState(this.state, () => {
      const arr = [];
      this.getSelectResult(dataList, arr);
      this.props.onSelect(arr);
    });
  }

  setData(data, dataList) {
    if (dataList && dataList.length) {
      for (let i = 0, len = data.length; i < len; i += 1) {
        const item = this.getNodeData(dataList, data[i]);
        item.checked = true;
        if (item.children) {
          this.setChildrenChecked(item.children, true);
        }
      }
    }
    this.setState(this.state);
  }

  getSelectResult(dataList, arr) {
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked) {
          arr.push(item.value);
        }
        if (item.halfChecked) {
          this.getSelectResult(item.children, arr);
        }
      });
    }
  }

  getTreeNode(dataList, level) {
    const arr = [];
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked || item.halfChecked) {
          arr.push(
            <li
              className={classnames({
                'tree-node-ul-li-open': !item.expand,
                'tree-node-ul-li-close': item.expand,
              })}
              title={item.label}
              key={item.value}
              onClick={(e) => {
                this.onTriggerNode(e, item);
              }}
            >
              {
                item.children ? !item.expand ?
                  <i className="kuma-icon kuma-icon-triangle-down"></i> :
                  <i className="kuma-icon kuma-icon-triangle-right"></i> :
                  <span style={{ width: 6, display: 'inline-block' }}></span>
              }
              <span className={'tree-node-ul-li-span'}>
              {
                item.label
              }
              {
                !level && item.checked ? <span className="tree-node-ul-li-all">已全选</span> : ''
              }
              </span>
              {
                item.children && !item.expand ? this.getTreeNode(item.children, level + 1) : null
              }
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

  setResultTree() {
    const { prefixCls } = this.props;
    const { dataList } = this.state;
    return (
      <div className={classnames([`${prefixCls}-result-tree`])}>
        {this.getTreeNode(dataList, 0)}
      </div>
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

  setChildrenChecked(data, checked) {
    if (data && data.length) {
      data.forEach((item) => {
        item.checked = checked;
        item.halfChecked = false;
        if (item.children) {
          this.setChildrenChecked(item.children, checked);
        }
      });
    }
  }

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

  getParentNode(data, key, parentNode = null) {
    let back = null;
    if (!key) { return null; }
    if (data && data.length) {
      for (let i = 0, len = data.length; i < len; i +=1) {
        if (data[i].value === key) {
          return parentNode;
        }
        if (data[i].children) {
          const item = this.getParentNode(data[i].children, key, data[i]);
          back = item ? item : back;
        }
      }
    }
    return back;
  }

  setFatherCheckState(halfChecked, level, checked) {
    const { dataList, selectArray } = this.state;
    const dataObj = this.getNodeData(dataList, selectArray[level - 1]);
    dataObj.checked = halfChecked ? false : checked;
    dataObj.halfChecked = halfChecked;
    if (level - 1) {
      this.eachBotherCheckState(dataObj, level - 1, checked);
    }
  }

  eachBotherCheckState(data, level, checked) {
    const { dataList, selectArray } = this.state;
    const listArray = this.getChildrenNode(dataList, selectArray[level - 1]);
    let halfChecked = false;
    if (listArray) {
      for (let i = 0, len = listArray.length; i < len; i += 1) {
        if (listArray[i].checked !== checked) {
          halfChecked = true;
          break;
        }
        if (listArray[i].halfChecked) {
          halfChecked = true;
          break;
        }
      }
      this.setFatherCheckState(halfChecked, level, checked);
    }
  }

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
  prefixCls: 'kuma-multi-cascader',
  config: [],
  options: [],
  cascadeSize: 3,
  data: [],
  onSelect: (res) => { console.log(res); },
};

CascadeMultiSelect.propTypes = {
  className: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  config: React.PropTypes.array,
  options: React.PropTypes.array,
  cascadeSize: React.PropTypes.number,
  onSelect: React.PropTypes.func,
  data: React.PropTypes.array,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

module.exports = CascadeMultiSelect;
