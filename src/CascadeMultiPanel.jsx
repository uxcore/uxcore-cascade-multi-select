/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
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
    // if (value === this.props.value && options === this.props.options) {
    //   return;
    // }
    // if (value) {
    //   this.setData(value, options);
    // }
    this.setData(value, options);
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
      }, level + 1, selectArray);
    }
    this.setState({ selectArray });
  }

  /**
   * 选中/取消选项事件
   */
  onItemChecked(item, level) {
    const { dataList } = this.state;
    const treeNodeObj = this.getTreeNodeData(dataList, item.value);
    const { itemNode } = treeNodeObj;
    itemNode.checked = !itemNode.checked;
    itemNode.halfChecked = false;
    // 设置子集全部选中
    if (itemNode.children) {
      itemNode.children = this.setChildrenChecked(itemNode.children, itemNode.checked);
    }
    // 设置父级选中状态
    if (level) {
      this.setFatherCheckState(itemNode, itemNode.checked);
    }
    this.setState({ dataList }, () => {
      this.setSelectResult();
    });
  }

  /**
   * 清空结果事件
   */
  onCleanSelect() {
    const { dataList } = this.state;
    this.setState({
      dataList: this.setCleanResult(dataList),
    }, this.props.onSelect([], [], []));
  }

  /**
   * 展开/收起结果列
   */
  onTriggerNode(item) {
    const { dataList } = this.state;
    const treeNodeObj = this.getTreeNodeData(dataList, item.value);
    const { itemNode } = treeNodeObj;
    itemNode.expand = !itemNode.expand;
    this.setState({ dataList });
  }

  /**
   * 删除选项事件
   */
  onDeleteItem(item, level) {
    const { dataList } = this.state;
    const treeNodeObj = this.getTreeNodeData(dataList, item.value);
    const { itemNode } = treeNodeObj;
    itemNode.checked = false;
    itemNode.halfChecked = false;
    if (itemNode.children) {
      itemNode.children = this.setChildrenChecked(itemNode.children, false);
    }
    if (level) {
      this.setFatherCheckState(itemNode, false);
    }
    this.setSelectResult();
  }

  /**
   * 获取选中的结果
   * @param dataList 组件选项列表
   * @param arr 存放结果 value 的数组
   * @param textArr 存放结果 label 的数组
   * @param back 存放选中的级联结构
   */
  getSelectResult(dataList, arr, textArr, back = []) {
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked) {
          arr.push(item.value);
          textArr.push(item.label);
          back.push(item);
        }
        if (item.halfChecked) {
          const backItem = {
            label: item.label,
            value: item.value,
            children: [],
          };
          backItem.children = this.getSelectResult(item.children, arr, textArr, backItem.children);
          back.push(backItem);
        }
      });
    }
    return back;
  }

  getAllLeafNode(dataList = []) {
    let back = [];
    dataList.forEach(item => {
      if ((item.checked || item.halfChecked) && item.children && item.children.length) {
        back = back.concat(this.getAllLeafNode(item.children));
      } else if (item.checked) {
        back.push({
          value: item.value,
          label: item.label,
        });
      }
    });
    return back;
  }

  /**
   * 获取选中的数量
   */
  getNums(dataList) {
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked || item.halfChecked) {
          this.selectNums += 1;
          if (item.children) {
            this.getNums(item.children);
          } else {
            this.handleSelectNums += 1;
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
   * @param from 从哪里调用
   */
  setData(value, options, callFrom = 'default') {
    let dataList = deepcopy(options);
    if (dataList && dataList.length) {
      dataList = this.setCleanResult(dataList);
      for (let i = 0, len = value.length; i < len; i += 1) {
        const treeNodeObj = this.getTreeNodeData(dataList, value[i]);
        if (treeNodeObj) {
          const { parentNode, itemNode } = treeNodeObj;
          itemNode.checked = true;
          if (itemNode.children) {
            itemNode.children = this.setChildrenChecked(itemNode.children, true);
          }
          if (parentNode) {
            this.setFatherCheckState(itemNode, true, dataList);
          }
        }
      }
    }

    if (callFrom === 'default') {
      this.setState({ dataList });
    }

    return dataList;
  }

  /**
   * 设置children选中/取消状态
   * @param childrenList 子集
   * @param checked 设置的状态
   */
  setChildrenChecked(dataList, checked) {
    const childrenList = deepcopy(dataList);
    if (childrenList && childrenList.length) {
      for (let i = 0; i < childrenList.length; i++) {
        const item = childrenList[i];
        item.checked = checked;
        item.halfChecked = false;
        if (item.children) {
          item.children = this.setChildrenChecked(item.children, checked);
        }
      }
    }
    return childrenList;
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
      this.setFatherCheckState(parentNode, checked, dataList);
    }
  }

  /**
   * 设置选中的结果
   */
  setSelectResult() {
    const arr = [];
    this.textArr = [];
    this.leafArr = this.getAllLeafNode(this.state.dataList);
    const cascadeSelected = this.getSelectResult(this.state.dataList, arr, this.textArr);
    this.props.onSelect(arr, this.textArr, this.leafArr, cascadeSelected);
  }

  /**
   * 清空
   */
  setCleanResult(dataList) {
    const listArray = deepcopy(dataList);
    if (listArray && listArray.length) {
      for (let i = 0; i < listArray.length; i++) {
        const item = listArray[i];
        item.checked = false;
        item.halfChecked = false;
        if (item.children) {
          item.children = this.setCleanResult(item.children);
        }
      }
    }
    return listArray;
  }

  /**
   * 设置组件宽度样式，兼容名称过长时显示效果等
   */
  setPanelWidth() {
    const reg = /[0-9]+/g;
    const resultPanelWidth = this.refResultPanel ?
      getComputedStyle(this.refResultPanel).width.match(reg)[0] : 220;
    this.resultPanelWidth = parseInt(resultPanelWidth, 0);
  }

  /**
   * 渲染对应级的选项面板
   */
  renderUlList(level) {
    const t = this;
    const { prefixCls, notFoundContent, locale } = this.props;
    const { dataList, selectArray } = this.state;
    if (!dataList.length) {
      return (
        <ul
          key={level}
          className={classnames({
            'use-svg': true,
            [`${prefixCls}-content`]: true,
          })}
          ref={(r) => { this.refUls = r; }}
        />
      );
    }
    const treeNodeObj = t.getTreeNodeData(dataList, selectArray[level - 1]);
    const childrenList = (
      treeNodeObj &&
      treeNodeObj.itemNode &&
      treeNodeObj.itemNode.children &&
      treeNodeObj.itemNode.children.length
    ) ? treeNodeObj.itemNode.children : [];
    const listArray = level ? childrenList : dataList;
    const noDataText = notFoundContent || i18n(locale).noData;
    return (
      <ul
        key={level}
        className={classnames({
          'use-svg': true,
          [`${prefixCls}-content`]: true,
        })}
        ref={(r) => { this.refUls = r; }}
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
    const { prefixCls, config } = this.props;
    const { selectArray } = this.state;
    const arr = [];
    // 设置当前级是否开启 checkbox
    const checkable = !(config[level] && config[level].checkable === false);
    dataList.forEach((item) => {
      // 默认选择第一项
      // if (!selectArray[level]) {
        // selectArray[level] = item.value;
      // }
      arr.push(
        <li
          key={item.value}
          className={classnames({
            [`${prefixCls}-list-item`]: !!prefixCls,
            [`${prefixCls}-checked`]: item.checked && !item.disabled,
            [`${prefixCls}-list-item-active`]: selectArray[level] === item.value,
          })}
          title={item.label}
          onClick={() => { this.onItemClick(item, level); }}
        >
          <label
            className={classnames([`${prefixCls}-item-label`])}
          >
            {
              checkable ? <s
                className={classnames({
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
    const { prefixCls, allowClear, locale } = this.props;
    return (
      <div
        className={classnames([`${prefixCls}-result`])}
        ref={(r) => { this.refResultPanel = r; }}
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
    // 记录所有选中的叶子节点
    this.handleSelectNums = 0;
    // 记录所有选中的节点
    this.selectNums = 0;
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
    return (
      <div
        className={classnames([`${prefixCls}-result-tree`])}
      >
        {this.renderTreeListNode(dataList, 0)}
      </div>
    );
  }

  /**
   * 渲染已选择结果 TreeListNode
   */
  renderTreeListNode(dataList, level) {
    const { cascadeSize } = this.props;
    const arr = [];
    if (dataList && dataList.length) {
      dataList.forEach((item) => {
        if (item.checked || item.halfChecked) {
          // 设置 label 的宽度
          const style = { maxWidth: 0 };
          // 86 = marginLeft（15） + 箭头icon占位宽度（21） + "删除"按钮的宽度（30） + marginRight（20）
          style.maxWidth = this.resultPanelWidth - 86 - (level * 15);
          // 56 = "已选择"文字宽度
          style.maxWidth -= level < cascadeSize - 1 && item.checked ? 56 : 0;
          arr.push(
            <li
              className={classnames('tree-node-ul-li', {
                'tree-node-ul-li-open': !item.expand,
                'tree-node-ul-li-close': item.expand,
              })}
              ref={(r) => { this.refResultUl = r; }}
              title={item.label}
              key={item.value}
              onClick={(e) => {
                e.stopPropagation();
                this.onTriggerNode(item);
              }}
            >
              <div
                className={classnames('tree-node-ul-li-div')}
                style={{ paddingLeft: (level + 1) * 15 }}
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
                    level < cascadeSize - 1 && item.checked && item.children && item.children.length ?
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
              </div>
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
      <ul
        className={classnames('tree-node-ul')}
      >
        {arr}
      </ul>
    );
  }

  /**
   * 渲染结果列表展开/收缩按钮
   */
  renderExpand(item) {
    let arr = [];
    if (item.children && item.children.length) {
      arr = !item.expand ? <i className="kuma-icon kuma-icon-triangle-down" /> :
        <i className="kuma-icon kuma-icon-triangle-right" />;
    } else {
      // 21 = kuma-icon的占位宽度
      arr = <span style={{ width: 21, display: 'inline-block' }} />;
    }
    return arr;
  }

  render() {
    const { className, prefixCls, cascadeSize, mode } = this.props;
    const arr = [];
    let minWidth = 0;
    for (let i = 0; i < cascadeSize; i += 1) {
      arr.push(this.renderUlList(i));
      minWidth = 150 * cascadeSize + 222;
    }
    this.setPanelWidth();
    const back = (
      <div
        className={classnames({
          [className]: !!className,
        }, [`${prefixCls}`])}
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{ minWidth }}
      >
        {arr}
        {this.renderResult()}
      </div>
    );

    if (mode === 'independent') {
      return <div style={{ overflow: 'hidden' }}>{back}</div>;
    }

    return back;
  }

}

CascadeMulti.defaultProps = {
  className: '',
  prefixCls: 'kuma-cascade-multi',
  config: [],
  options: [],
  cascadeSize: 3,
  value: [],
  notFoundContent: '',
  allowClear: true,
  locale: 'zh-cn',
  onSelect: () => {},
  onItemClick: () => { },
  mode: 'independent',
};

CascadeMulti.propTypes = {
  className: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  config: React.PropTypes.array,
  options: React.PropTypes.array,
  cascadeSize: React.PropTypes.number,
  value: React.PropTypes.array,
  notFoundContent: React.PropTypes.string,
  allowClear: React.PropTypes.bool,
  locale: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  onItemClick: React.PropTypes.func,
  mode: React.PropTypes.oneOf(['independent', 'mix']),
};

CascadeMulti.displayName = 'CascadeMulti';

module.exports = CascadeMulti;
