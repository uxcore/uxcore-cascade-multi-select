/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import i18n from './locale';

class CascadeMultiSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataList: props.options,
      selectArray: [],
    };
  }

  componentDidMount() {
    const { value } = this.props;
    const { dataList } = this.state;
    if (value && value.length) {
      this.setData(value, dataList);
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
    const { readOnly } = this.props;
    const { dataList } = this.state;
    if (readOnly) { return; }
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
    const { readOnly } = this.props;
    const { dataList } = this.state;
    if (readOnly) { return; }
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
        const parentNode = this.getParentNode(dataList, data[i]);
        if (parentNode) {
          const botherNodeList = parentNode.children;
          const halfChecked = this.handleBotherNoChecked(botherNodeList);
          if (halfChecked) {
            parentNode.halfChecked = true;
          }
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
                  <span style={{ width: 15, display: 'inline-block' }}></span>
              }
              <span className={'tree-node-ul-li-span'}>
                {
                  item.label
                }
                {
                  !level && item.checked ?
                    <span className="tree-node-ul-li-all">{i18n(this.props.locale).all}</span> : ''
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
    if (!this.handleSelectNums) { return null; }
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
          back = item || back;
        }
      }
    }
    return back;
  }

  getParentNode(data, key, parentNode = null) {
    let back = null;
    if (!key) { return null; }
    if (data && data.length) {
      for (let i = 0, len = data.length; i < len; i += 1) {
        if (data[i].value === key) {
          return parentNode;
        }
        if (data[i].children) {
          const item = this.getParentNode(data[i].children, key, data[i]);
          back = item || back;
        }
      }
    }
    return back;
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

  handleBotherNoChecked(botherList) {
    let halfChecked = false;
    if (botherList && botherList.length) {
      for (let i = 0, len = botherList.length; i < len; i += 1) {
        if (!botherList[i].checked) {
          halfChecked = true;
          break;
        }
      }
    }
    return halfChecked;
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
    const { className, prefixCls, noDataContent, locale } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) { return null; }
    const listArray = level ? t.getChildrenNode(dataList, selectArray[level - 1]) : dataList;
    const noDataText = noDataContent || i18n(locale).noData;
    return (
      <ul
        key={level}
        className={classnames({
          className: !!className,
          [`${prefixCls}-content`]: true,
        }, 'use-svg')}
      >
        {
          selectArray[level - 1] && !listArray.length ?
            <span className={classnames([`${prefixCls}-list-noData`])}>{noDataText}</span> :
            t.renderListItems(listArray, level)
        }
      </ul>
    );
  }

  renderListItems(dataList, level) {
    const t = this;
    const { className, prefixCls } = this.props;
    return dataList.map(item => {
      return (
        <li
          key={item.value}
          className={classnames({
            className: !!className,
            [`${prefixCls}-list-item`]: !!prefixCls,
            [`${prefixCls}-checked`]: item.checked && !item.disabled,
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
                'kuma-tree-checkbox-checked': item.checked && !item.halfChecked,
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
    const { prefixCls, allowClear, locale } = this.props;
    return (
      <div
        className={classnames([`${prefixCls}-result`])}
      >
        <div className={classnames([`${prefixCls}-result-title`])}>
          {i18n(locale).selected} {this.setResultNums()}
          {
            allowClear ?
              <span
                className={classnames([`${prefixCls}-result-clean`])}
                onClick={() => { this.onCleanSelect(); }}
              >
                {i18n(locale).clean}
              </span> :
              null
          }
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
          className: !!className,
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
  value: [],
  readOnly: false,
  noDataContent: '',
  allowClear: true,
  locale: 'zh-cn',
  onSelect: (res) => { console.log(res); },
};

CascadeMultiSelect.propTypes = {
  className: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  config: React.PropTypes.array,
  options: React.PropTypes.array,
  cascadeSize: React.PropTypes.number,
  value: React.PropTypes.array,
  noDataContent: React.PropTypes.string,
  allowClear: React.PropTypes.bool,
  readOnly: React.PropTypes.bool,
  locale: React.PropTypes.string,
  onSelect: React.PropTypes.func,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

module.exports = CascadeMultiSelect;
