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

  componentWillReceiveProps(nextProps) {
    const { value, options } = nextProps;
    if (value && value.length) {
      this.setData(value, options || this.state.dataList);
    }
  }

  onTriggerNode(e, data) {
    const { dataList } = this.state;
    if (e.cancelBubble) {
      e.cancelBubble = true;
    } else {
      e.stopPropagation();
    }
    data.expand = !data.expand;
    this.setState({ dataList });
  }

  onCleanSelect() {
    const { readOnly } = this.props;
    const { dataList } = this.state;
    if (readOnly) { return; }
    if (dataList) {
      this.cleanResult(dataList);
    }
    this.setState({ dataList });
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
    this.setState({ dataList }, () => {
      const arr = [];
      this.textArr = [];
      this.getSelectResult(dataList, arr, this.textArr);
      this.props.onSelect(arr, this.textArr);
    });
  }

  setData(data, dataList) {
    if (dataList && dataList.length) {
      for (let i = 0, len = data.length; i < len; i += 1) {
        const treeNodeObj = this.getTreeNodeData(dataList, data[i]);
        const { parentNode, itemNode } = treeNodeObj;
        itemNode.checked = true;
        if (itemNode.children) {
          this.setChildrenChecked(itemNode.children, true);
        }
        if (parentNode) {
          const halfChecked = this.handleBotherNoChecked(parentNode.children);
          if (halfChecked) {
            parentNode.halfChecked = true;
          }
        }
      }
    }
    this.setState({ dataList });
  }

  getSelectResult(dataList, arr, textArr) {
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked) {
          arr.push(item.value);
          textArr.push(item.label);
        }
        if (item.halfChecked) {
          this.getSelectResult(item.children, arr, textArr);
        }
      });
    }
  }

  setResultTree() {
    const { prefixCls } = this.props;
    const { dataList } = this.state;
    return (
      <div className={classnames([`${prefixCls}-result-tree`])}>
        {this.renderTreeNode(dataList, 0)}
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

  getTreeNodeData(dataList, key, parentNode = null) {
    let back = null;
    if (!key) { return null; }
    if (dataList && dataList.length) {
      for (let i = 0, len = dataList.length; i < len; i += 1) {
        if (dataList[i].value === key) {
          return {
            parentNode,
            itemNode: dataList[i],
          };
        }
        if (dataList[i].children) {
          const item = this.getTreeNodeData(dataList[i].children, key, dataList[i]);
          back = item || back;
        }
      }
    }
    return back;
  }

  setFatherCheckState(halfChecked, level, checked) {
    const { dataList, selectArray } = this.state;
    const treeNodeObj = this.getTreeNodeData(dataList, selectArray[level - 1]);
    const { itemNode } = treeNodeObj;
    itemNode.checked = halfChecked ? false : checked;
    itemNode.halfChecked = halfChecked;
    if (level - 1) {
      this.eachBotherCheckState(itemNode, level - 1, checked);
    }
  }

  eachBotherCheckState(data, level, checked) {
    const { dataList, selectArray } = this.state;
    const treeNodeObj = this.getTreeNodeData(dataList, selectArray[level - 1]);
    const listArray = treeNodeObj.itemNode.children;
    let halfChecked = false;
    if (listArray) {
      for (let i = 0, len = listArray.length; i < len; i += 1) {
        if (!!listArray[i].checked !== checked) {
          halfChecked = true;
          break;
        }
        if (!!listArray[i].halfChecked) {
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
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        item.checked = false;
        item.halfChecked = false;
        if (item.children) {
          this.cleanResult(item.children);
        }
      });
    }
  }

  renderTreeNode(dataList, level) {
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
              {this.renderExpand(item)}
              <span className={'tree-node-ul-li-span'}>
                {item.label}
                {
                  !level && item.checked ?
                    <span className="tree-node-ul-li-all">{i18n(this.props.locale).all}</span> : ''
                }
              </span>
              {
                item.children && !item.expand ? this.renderTreeNode(item.children, level + 1) : null
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

  renderExpand(data) {
    let arr = [];
    if (data.children) {
      if (!data.expand) {
        arr = <i className="kuma-icon kuma-icon-triangle-down"></i>;
      } else {
        arr = <i className="kuma-icon kuma-icon-triangle-right"></i>;
      }
    } else {
      arr = <span style={{ width: 15, display: 'inline-block' }}></span>;
    }
    return arr;
  }

  renderUlList(level) {
    const t = this;
    const { className, prefixCls, noDataContent, locale } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) { return null; }
    const treeNodeObj = t.getTreeNodeData(dataList, selectArray[level - 1]);
    const listArray = level ? treeNodeObj.itemNode.children : dataList;
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
    const arr = [];
    const { className, prefixCls } = this.props;
    const { selectArray } = this.state;
    dataList.forEach(item => {
      if (!selectArray[level]) {
        selectArray[level] = item.value;
      }
      arr.push(
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
    return arr;
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
    const arr = [];
    for (let i = 0; i < depthSize; i += 1) {
      arr.push(this.renderUlList(i));
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
  onSelect: (resa, resb) => { console.log(resa, resb); },
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
