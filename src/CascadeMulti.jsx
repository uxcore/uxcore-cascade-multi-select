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
    const { value, options } = this.props;
    if (value) {
      this.setData(value, options);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { value, options } = nextProps;
    if (
      value === this.props.value &&
      options === this.props.options
    ) {
      return;
    }
    if (value) {
      this.setData(value, options);
    }
  }

  /**
   * 选项列表点击事件
   */
  onItemClick(data, level) {
    const { selectArray } = this.state;
    if (data.value !== selectArray[level]) {
      selectArray.splice(level + 1);
    }
    selectArray[level] = data.value;
    if (this.props.onItemClick) {
      this.props.onItemClick({
        value: data.value,
        label: data.label,
        children: data.children,
      });
    }
    this.setState({ selectArray });
  }

  /**
   * 选中/取消选项事件
   */
  onItemChecked(item, level) {
    const { readOnly } = this.props;
    const { dataList } = this.state;
    if (readOnly) { return; }
    item.checked = !item.checked;
    item.halfChecked = false;
    // 设置子集全部选中
    if (item.children) {
      this.setChildrenChecked(item.children, item.checked);
    }
    // 设置父级选中状态
    if (level) {
      this.setFatherCheckState(item, item.checked);
    }
    this.setState({ dataList }, this.setSelectResult());
  }

  /**
   * 清空结果事件
   */
  onCleanSelect() {
    const { readOnly } = this.props;
    const { dataList } = this.state;
    if (readOnly) { return; }
    if (dataList) {
      this.setCleanResult(dataList);
    }
    this.setState({ dataList }, this.setSelectResult());
  }

  /**
   * 展开/收起结果列
   */
  onTriggerNode(data) {
    const { dataList } = this.state;
    data.expand = !data.expand;
    this.setState({ dataList });
  }

  /**
   * 删除选项事件
   */
  onDeleteItem(item, level) {
    const { readOnly } = this.props;
    if (readOnly) { return; }
    item.checked = false;
    item.halfChecked = false;
    if (item.children) {
      this.setChildrenChecked(item.children, false);
    }
    if (level) {
      this.setFatherCheckState(item, false);
    }
    this.setSelectResult();
  }

  /**
   * 获取选中的结果
   * @param dataList 组件选项列表
   * @param arr 存放结果 value 的数组
   * @param textArr 存放结果 label 的数组
   */
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

  /**
   * 获取选中的数量
   */
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

  /**
   * 根据传入的 key 获取其节点，父节点
   * @param dataList 组件的 options
   * @param key 要查询的 item.value
   * @param parentNode 父节点（方法自用）
   */
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

  /**
   * 获取兄弟节点指定选中状态
   * @param botherList 兄弟节点列表
   * @param state 查询的选中状态
   * @return 兄弟节点中包含对应状态结果 boolean
   */
  getBotherCheckedState(botherList, state) {
    let handleCheckedState = false;
    if (botherList && botherList.length) {
      for (let i = 0, len = botherList.length; i < len; i += 1) {
        // 查询是否存在选中
        if (state) {
          if (botherList[i].checked || botherList[i].halfChecked) {
            handleCheckedState = true;
            break;
          }
        } else {
          // 查询是否存在未选中
          // 要么未选中，要么半选中状态
          if (
            !botherList[i].checked && !botherList[i].halfChecked ||
            !botherList[i].checked && botherList[i].halfChecked
          ) {
            handleCheckedState = true;
            break;
          }
        }
      }
    }
    return handleCheckedState;
  }

  /**
   * 外部设置组件的 value
   * @param value 设置的结果
   * @param options 选项列表
   */
  setData(value, options) {
    if (options && options.length) {
      this.setCleanResult(options);
      for (let i = 0, len = value.length; i < len; i += 1) {
        const treeNodeObj = this.getTreeNodeData(options, value[i]);
        const { parentNode, itemNode } = treeNodeObj;
        itemNode.checked = true;
        if (itemNode.children) {
          this.setChildrenChecked(itemNode.children, true);
        }
        if (parentNode) {
          this.setFatherCheckState(itemNode, true, options);
        }
      }
    }
    this.setState({ dataList: options }, () => {
      if (!this.dataErrorState) {
        this.checkNoDataError();
      } else {
        this.dataErrorState = false;
      }
      const arr = [];
      this.textArr = [];
      this.getSelectResult(this.state.dataList, arr, this.textArr);
    });
  }

  /**
   * 设置children选中/取消状态
   * @param childrenList 子集
   * @param checked 设置的状态
   */
  setChildrenChecked(childrenList, checked) {
    if (childrenList && childrenList.length) {
      childrenList.forEach((item) => {
        item.checked = checked;
        item.halfChecked = false;
        if (item.children) {
          this.setChildrenChecked(item.children, checked);
        }
      });
    }
  }

  /**
   * 设置父亲节点的选中/半选中状态
   * @param item 当前节点
   * @param checked 设置状态
   */
  setFatherCheckState(item, checked, dataList = this.state.dataList) {
    const treeNodeObj = this.getTreeNodeData(dataList, item.value);
    const { parentNode } = treeNodeObj;
    if (parentNode) {
      const halfChecked = this.getBotherCheckedState(parentNode.children, !checked);
      if (halfChecked) {
        parentNode.checked = !halfChecked;
        parentNode.halfChecked = halfChecked;
      } else {
        parentNode.checked = checked;
        parentNode.halfChecked = false;
      }
      this.setFatherCheckState(parentNode, checked);
    }
  }

  /**
   * 设置选中的结果
   */
  setSelectResult() {
    const arr = [];
    this.textArr = [];
    this.getSelectResult(this.state.dataList, arr, this.textArr);
    this.props.onSelect(arr, this.textArr);
  }

  /**
   * 清空
   */
  setCleanResult(dataList) {
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        item.checked = false;
        item.halfChecked = false;
        if (item.children) {
          this.setCleanResult(item.children);
        }
      });
    }
  }

  /**
   * 检查数据是否异常
   * 某些异步情况下设置了value，第一级却没有check的情况
   * 重新setData修复数据异常
   */
  checkNoDataError() {
    const { dataList } = this.state;
    const { value } = this.props;
    let sum = 0;
    for (let i = 0; i < dataList.length; i++) {
      if (!dataList[i].checked && !dataList[i].halfChecked) {
        sum += 1;
      }
    }
    if (value && value.length) {
      if (sum === dataList.length) {
        this.dataErrorState = true;
      } else {
        this.dataErrorState = false;
      }
    }
    if (this.dataErrorState) {
      console.debug('found data exception, repairing data ...');
      this.setData(value, dataList);
      console.debug('success.');
    }
  }

  /**
   * 渲染对应级的选项面板
   */
  renderUlList(level) {
    const t = this;
    const { className, prefixCls, noDataContent, locale } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) { return null; }
    const treeNodeObj = t.getTreeNodeData(dataList, selectArray[level - 1]);
    const childrenList = (
      treeNodeObj &&
      treeNodeObj.itemNode &&
      treeNodeObj.itemNode.children.length
    ) ? treeNodeObj.itemNode.children : [];
    const listArray = level ? childrenList : dataList;
    const noDataText = noDataContent || i18n(locale).noData;
    return (
      <ul
        key={level}
        className={classnames({
          className: !!className,
          'use-svg': true,
          [`${prefixCls}-content`]: true,
        })}
      >
        {
          selectArray[level - 1] && !listArray.length ?
            <span className={classnames([`${prefixCls}-list-noData`])}>{noDataText}</span> :
            t.renderListItems(listArray, level)
        }
      </ul>
    );
  }

  /**
   * 渲染对应级的 ListItem
   */
  renderListItems(dataList, level) {
    const { className, prefixCls, config } = this.props;
    const { selectArray } = this.state;
    const arr = [];
    // 设置当前级是否开启 checkbox
    const checkable = !(config[level] && config[level].checkable === false);
    dataList.forEach((item) => {
      // 默认选择第一项
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
          onClick={() => { this.onItemClick(item, level); }}
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
                onClick={() => { this.onItemChecked(item, level); }}
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

  /**
   * 渲染结果面板
   */
  renderResult() {
    const { prefixCls, allowClear, locale, resultPanelWidth } = this.props;
    return (
      <div
        className={classnames([`${prefixCls}-result`])}
        style={{ width: resultPanelWidth }}
      >
        <div className={classnames([`${prefixCls}-result-title`])}>
          {i18n(locale).selected} {this.renderResultNums()}
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
        {this.renderResultTree()}
      </div>
    );
  }

  /**
   * 渲染已选中节点数量
   */
  renderResultNums() {
    const { dataList } = this.state;
    this.handleSelectNums = 0;
    this.getNums(dataList);
    return (
      <span>({this.handleSelectNums})</span>
    );
  }

  /**
   * 渲染已选择结果 TreeList
   */
  renderResultTree() {
    const { prefixCls } = this.props;
    const { dataList } = this.state;
    const style = {};
    if (this.handleSelectNums < 10) {
      style.marginRight = 2;
    }
    return (
      <div
        className={classnames([`${prefixCls}-result-tree`])}
        style={style}
      >
        {this.renderTreeListNode(dataList, 0)}
      </div>
    );
  }

  /**
   * 渲染已选择结果 TreeListNode
   */
  renderTreeListNode(dataList, level) {
    const { resultPanelWidth, cascadeSize } = this.props;
    const arr = [];
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked || item.halfChecked) {
          // 设置 label 的宽度
          const style = {};
          // 86 = marginLeft（15） + 箭头icon占位宽度（21） + "删除"按钮的宽度（30） + marginRight（20）
          style.maxWidth = resultPanelWidth - 86 - (level * 15);
          // 56 = "已选择"文字宽度
          style.maxWidth -= level < cascadeSize - 1 && item.checked ? 56 : 0;
          arr.push(
            <li
              className={classnames('tree-node-ul-li', {
                'tree-node-ul-li-open': !item.expand,
                'tree-node-ul-li-close': item.expand,
              })}
              title={item.label}
              key={item.value}
              onClick={(e) => {
                e.stopPropagation();
                this.onTriggerNode(item);
              }}
            >
              {
                this.renderExpand(item)
              }
              <span className={classnames('tree-node-ul-li-span')}>
                {
                  <span
                    className="tree-node-ul-li-span-label"
                    style={style}
                  >
                    {item.label}
                  </span>
                }
                {
                  level < cascadeSize - 1 && item.checked ?
                    <span className="tree-node-ul-li-all">
                      {i18n(this.props.locale).haveAll}
                    </span> :
                    null
                }
                {
                  <span
                    className="tree-node-ul-li-del"
                    onClick={(e) => {
                      e.stopPropagation();
                      this.onDeleteItem(item, level);
                    }}
                  >
                    {i18n(this.props.locale).delete}
                  </span>
                }
              </span>
              {
                item.children && !item.expand ?
                  this.renderTreeListNode(item.children, level + 1) :
                  null
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

  /**
   * 渲染结果列表展开/收缩按钮
   */
  renderExpand(item) {
    let arr = [];
    if (item.children) {
      arr = !item.expand ? <i className="kuma-icon kuma-icon-triangle-down" /> :
        <i className="kuma-icon kuma-icon-triangle-right" />;
    } else {
      // 21 = kuma-icon的占位宽度
      arr = <span style={{ width: 21, display: 'inline-block' }} />;
    }
    return arr;
  }

  render() {
    const { className, prefixCls, cascadeSize, config, resultPanelWidth } = this.props;
    const arr = [];
    const style = { width: 0 };
    for (let i = 0; i < cascadeSize; i += 1) {
      arr.push(this.renderUlList(i));
      // 设置选项列表的面板宽度
      style.width += parseInt(config[i] && config[i].width ? config[i].width : 150, 0);
    }
    // 设置结果列表面板宽度
    style.width += resultPanelWidth + 2;
    return (
      <div
        className={classnames({
          className: !!className,
        }, [`${prefixCls}`])}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
        }}
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
  onItemClick: React.PropTypes.func,
};

CascadeMulti.displayName = 'CascadeMulti';

module.exports = CascadeMulti;
