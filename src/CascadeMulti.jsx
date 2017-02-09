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

class CascadeMulti extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      dataList: props.options,
      selectArray: [],
    };
  }

  componentDidMount() {
    const { value } = this.props;
    if (value) {
      this.setData(value, this.state.dataList);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldValue = this.props.value;
    const { value, options } = nextProps;
    if (value !== oldValue) {
      this.setData(value, options || this.state.dataList);
    }
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
    this.setState({ dataList }, this.setSelectResult());
  }

  onCleanSelect() {
    const { readOnly } = this.props;
    const { dataList } = this.state;
    if (readOnly) { return; }
    if (dataList) {
      this.cleanResult(dataList);
    }
    this.setState({ dataList }, this.setSelectResult());
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

  setData(data, dataList) {
    if (dataList && dataList.length) {
      this.cleanResult(dataList);
      for (let i = 0, len = data.length; i < len; i += 1) {
        const treeNodeObj = this.getTreeNodeData(dataList, data[i]);
        const { parentNode, itemNode } = treeNodeObj;
        itemNode.checked = true;
        if (itemNode.children) {
          this.setChildrenChecked(itemNode.children, true);
        }
        if (parentNode) {
          this.setParentData(dataList, itemNode);
        }
      }
    }
    this.setState({ dataList }, () => {
      const arr = [];
      this.textArr = [];
      this.getSelectResult(this.state.dataList, arr, this.textArr);
    });
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

  setParentData(dataList, item) {
    if (!item) { return; }
    const treeNodeObj = this.getTreeNodeData(dataList, item.value);
    const { parentNode } = treeNodeObj;
    if (parentNode) {
      const halfChecked = this.handleBotherNoChecked(parentNode.children);
      if (halfChecked) {
        parentNode.halfChecked = true;
        this.setParentData(dataList, parentNode);
      }
    }
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

  setResultNums() {
    const { dataList } = this.state;
    this.handleSelectNums = 0;
    this.getNums(dataList);
    return (
      <span>({this.handleSelectNums})</span>
    );
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

  setSelectResult() {
    const arr = [];
    this.textArr = [];
    this.getSelectResult(this.state.dataList, arr, this.textArr);
    this.props.onSelect(arr, this.textArr);
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

  renderUlList(level) {
    const t = this;
    const { className, prefixCls, noDataContent, locale } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) { return null; }
    const treeNodeObj = t.getTreeNodeData(dataList, selectArray[level - 1]);
    const childrenList = (treeNodeObj &&
      treeNodeObj.itemNode && treeNodeObj.itemNode.children.length) ?
      treeNodeObj.itemNode.children : [];
    const listArray = level ? childrenList : dataList;
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
    const { className, prefixCls, config } = this.props;
    const { selectArray } = this.state;
    const checkable = !(config[level] && config[level].checkable === false);
    dataList.forEach((item) => {
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
            [`${prefixCls}-list-item-active`]: selectArray[level] === item.value,
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
            {
              checkable ? <s
                className={classnames({
                  className: !!className,
                  'kuma-tree-checkbox': true,
                  'kuma-tree-checkbox-indeterminate': item.halfChecked,
                  'kuma-tree-checkbox-checked': item.checked && !item.halfChecked,
                })}
                onClick={() => { t.onItemChecked(item, level); }}
              /> :
              null
            }
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
      <div className={classnames([`${prefixCls}-result`])}>
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
              {
                this.renderExpand(item)
              }
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
      arr = !data.expand ? <i className="kuma-icon kuma-icon-triangle-down" /> :
        <i className="kuma-icon kuma-icon-triangle-right" />;
    } else {
      arr = <span style={{ width: 15, display: 'inline-block' }} />;
    }
    return arr;
  }

  render() {
    const { className, prefixCls, cascadeSize, config, resultPanelWidth } = this.props;
    const arr = [];
    const style = { width: 0 };
    for (let i = 0; i < cascadeSize; i += 1) {
      arr.push(this.renderUlList(i));
      style.width += parseInt(config[i] && config[i].width ? config[i].width : 150, 0);
    }
    style.width += resultPanelWidth + 2;
    return (
      <div
        className={classnames({
          className: !!className,
        }, [`${prefixCls}`])}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={style}
      >
        {arr}
        {this.renderResult()}
      </div>
    );
  }
}

CascadeMulti.defaultProps = {
  className: '',
  prefixCls: 'kuma-cascade-multi',
  config: [],
  options: [],
  cascadeSize: 3,
  value: [],
  readOnly: false,
  noDataContent: '',
  allowClear: true,
  locale: 'zh-cn',
  resultPanelWidth: 220,
  onSelect: () => {},
};

CascadeMulti.propTypes = {
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
  resultPanelWidth: React.PropTypes.number,
  onSelect: React.PropTypes.func,
};

CascadeMulti.displayName = 'CascadeMulti';

module.exports = CascadeMulti;
