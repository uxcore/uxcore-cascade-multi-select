/**
 * CascadeMultiSelect Component for uxcore
 * @author changming<changming.zy@alibaba-inc.com>
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
import PropTypes from 'prop-types';
import { polyfill } from 'react-lifecycles-compat';
import i18n from './locale';
import { getDisabledValueLabel, getCascadeSelected, getWidthStyle } from './utils';

class CascadeMulti extends React.Component {
  static getDerivedStateFromProps(props, state) {
    const { value, options, keyCouldDuplicated } = props;
    if (value === state.lastValue && options === state.lastOptions) {
      return null;
    }
    const { dataList, allItemDisabled } =
      CascadeMulti.setData(value, options, keyCouldDuplicated);
    return { dataList, allItemDisabled, lastValue: value, lastOptions: options };
  }

  /**
   * 外部设置组件的 value
   * @param value 设置的结果
   * @param options 选项列表
   * @param from 从哪里调用
   */
  static setData(value, options, keyCouldDuplicated) {
    let dataList = deepcopy(options);
    let allItemDisabled = true;
    if (dataList && dataList.length) {
      const res = CascadeMulti.setCleanResult(dataList, true, keyCouldDuplicated);
      dataList = res.listArray;
      allItemDisabled = res.allItemDisabled;
      for (let i = 0, len = value.length; i < len; i += 1) {
        const $id = value[i];
        const treeNodeObj =
          CascadeMulti.getTreeNodeData(dataList, $id, null, keyCouldDuplicated);
        if (treeNodeObj) {
          const { parentNode, itemNode } = treeNodeObj;
          itemNode.checked = true;
          if (itemNode.children) {
            itemNode.children = CascadeMulti.setChildrenChecked(
              itemNode.children,
              true,
              true,
            );
          }
          if (parentNode) {
            CascadeMulti.setFatherCheckState(itemNode, true, dataList, keyCouldDuplicated);
          }
        }
      }
    }
    return { dataList, allItemDisabled };
  }

  /**
   * 清空
   */
  static setCleanResult(dataList, isCleanDisabledLabel, keyCouldDuplicated) {
    const listArray = deepcopy(dataList);
    let allItemDisabled = true;
    const recursion = (list, rootNum = -1, ancestorNodes = [], isChildrenCheck = false) => {
      if (list && list.length) {
        // 处理 dataList 添加根节点标识，因为除了第一级、根级以外其余级别可能会重复
        for (let i = 0; i < list.length; i++) {
          let newAncestorNodes = [];
          const item = list[i];
          item.halfChecked = false;
          item.rootNum = rootNum === -1 ? i : rootNum;
          item.$id = keyCouldDuplicated ?
            `${item.rootNum}/${item.value}` :
            `${item.value}`; // 如果每一级的 value 有可能会重复时，则使用 rootNum + value 作为 id
          if (!isChildrenCheck) {
            // 当isCleanDisabledLabel=false,被选中且disabled节点需处理父级的halfChecked
            if ((!isCleanDisabledLabel && item.disabled) && item.checked) {
              newAncestorNodes.forEach(ii => {
                ii.halfChecked = true; // eslint-disable-line
              });
              isChildrenCheck = true; // eslint-disable-line
            } else {
              item.checked = false;
            }
          }
          newAncestorNodes = ancestorNodes.concat(item);
          if (item.children) {
            recursion(item.children, item.rootNum, newAncestorNodes, isChildrenCheck);
          }
          if (item.disabled !== true) {
            allItemDisabled = false;
          }
        }
      }
    };

    recursion(listArray);

    return {
      listArray,
      allItemDisabled,
    };
  }

  /**
   * 根据传入的 key 获取其节点，父节点
   * @param dataList 组件的 options
   * @param key 要查询的 item.$id 也有可能是 $item.value
   * @param parentNode 父节点（方法自用）
   */
  static getTreeNodeData(dataList, key, parentNode = null, keyCouldDuplicated) {
    let back = null;
    if (!key) { return null; }
    if (dataList && dataList.length) {
      for (let i = 0, len = dataList.length; i < len; i += 1) {
        let theKey = `${key}`;
        if (keyCouldDuplicated && theKey.indexOf('/') === -1) {
          theKey = `${dataList[i].rootNum}/${key}`;
        }
        if (dataList[i].$id === theKey) {
          return {
            parentNode,
            itemNode: dataList[i],
          };
        }
        if (dataList[i].children) {
          const item =
            CascadeMulti.getTreeNodeData(
              dataList[i].children, theKey, dataList[i], keyCouldDuplicated
            );
          back = item || back;
        }
      }
    }
    return back;
  }

  /**
   * 设置children选中/取消状态
   * @param childrenList 子集
   * @param checked 设置的状态
   */
  static setChildrenChecked(
    dataList,
    checked,
    isCleanDisabledLabel,
    itemDisabledNodes = [],
  ) {
    const childrenList = deepcopy(dataList);
    if (childrenList && childrenList.length) {
      for (let i = 0; i < childrenList.length; i++) {
        const item = childrenList[i];
        if (!isCleanDisabledLabel && item.disabled) {
          if (checked !== item.checked) {
            itemDisabledNodes.push(item);
          }
        } else {
          item.checked = checked;
          item.halfChecked = false;
          if (item.children) {
            item.children = this.setChildrenChecked(
              item.children,
              checked,
              isCleanDisabledLabel,
              itemDisabledNodes
            );
          }
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
  static setFatherCheckState(item, checked, dataList, keyCouldDuplicated) {
    const treeNodeObj =
      CascadeMulti.getTreeNodeData(dataList, item.$id, null, keyCouldDuplicated);
    const { parentNode } = treeNodeObj;
    if (parentNode) {
      const halfChecked = CascadeMulti.getBotherCheckedState(parentNode.children, !checked);
      if (halfChecked) {
        parentNode.checked = !halfChecked;
        parentNode.halfChecked = halfChecked;
      } else {
        parentNode.checked = checked;
        parentNode.halfChecked = false;
      }
      CascadeMulti.setFatherCheckState(parentNode, checked, dataList, keyCouldDuplicated);
    }
  }

  /**
   * 获取兄弟节点指定选中状态
   * @param botherList 兄弟节点列表
   * @param state 查询的选中状态
   * @return 兄弟节点中包含对应状态结果 boolean
   */
  static getBotherCheckedState(botherList, state) {
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

  constructor(props) {
    super(props);
    this.state = {
      dataList: [],
      selectArray: [],
      allItemDisabled: true, // 所有选项都被禁用
    };
    const { value, options, keyCouldDuplicated } = this.props;
    if (value) {
      const { dataList, allItemDisabled } =
        CascadeMulti.setData(value, options, keyCouldDuplicated);
      this.state.dataList = dataList;
      this.state.allItemDisabled = allItemDisabled;
    }
  }

  /**
   * 选项列表点击事件
   */
  onItemClick(data, level) {
    const { selectArray } = this.state;
    if (data.$id !== selectArray[level]) {
      selectArray.splice(level + 1);
    }
    selectArray[level] = data.$id;
    if (this.props.onItemClick) {
      this.props.onItemClick({
        value: data.value,
        label: data.label,
        children: data.children,
        description: data.description,
      }, level + 1, selectArray);
    }
    this.setState({
      selectArray,
      displayDesc: data.description ? `${data.label}: ${data.description}` : null,
    });
  }

  /**
   * 选中/取消选项事件
   */
  onItemChecked(item, level) {
    const { isCleanDisabledLabel, keyCouldDuplicated } = this.props;
    const { dataList } = this.state;
    const treeNodeObj =
      CascadeMulti.getTreeNodeData(dataList, item.$id, null, keyCouldDuplicated);
    const { itemNode } = treeNodeObj;
    itemNode.checked = !itemNode.checked;
    itemNode.halfChecked = false;
    this.itemDisabledNodes = [];
    // 设置子集全部选中
    if (itemNode.children) {
      itemNode.children = CascadeMulti.setChildrenChecked(
        itemNode.children,
        itemNode.checked,
        isCleanDisabledLabel,
        this.itemDisabledNodes
      );
    }
    if (!isCleanDisabledLabel && this.itemDisabledNodes.length > 0) {
      itemNode.checked = false;
      itemNode.halfChecked = true;
      let itemDisabledNode = this.itemDisabledNodes.pop();
      while (itemDisabledNode) {
        CascadeMulti.setFatherCheckState(
          itemDisabledNode, itemDisabledNode.checked, dataList, keyCouldDuplicated
        );
        itemDisabledNode = this.itemDisabledNodes.pop();
      }
    } else if (level) {
      // 设置父级选中状态
      CascadeMulti.setFatherCheckState(itemNode, itemNode.checked, dataList, keyCouldDuplicated);
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
    const { value, isCleanDisabledLabel, keyCouldDuplicated, onSelect } = this.props;
    this.setState({
      dataList: CascadeMulti.setCleanResult(
        dataList, isCleanDisabledLabel, keyCouldDuplicated
      ).listArray,
    }, function afterClean() {
      if (isCleanDisabledLabel) {
        onSelect([], [], []);
      } else {
        const { disabledNodes, leafNodes: leafList } = getDisabledValueLabel(dataList, value);
        const valueList = [];
        const labelList = [];
        disabledNodes.forEach((item) => {
          valueList.push(item.value);
          labelList.push(item.label);
        });
        onSelect(
          valueList, labelList, leafList, getCascadeSelected(this.state.dataList, valueList)
        );
      }
    });
  }

  /**
   * 展开/收起结果列
   */
  onTriggerNode(item) {
    const { dataList } = this.state;
    const { keyCouldDuplicated } = this.props;
    const treeNodeObj =
      CascadeMulti.getTreeNodeData(dataList, item.$id, null, keyCouldDuplicated);
    const { itemNode } = treeNodeObj;
    itemNode.expand = !itemNode.expand;
    this.setState({ dataList });
  }

  /**
   * 删除选项事件
   */
  onDeleteItem(item, level) {
    const { dataList } = this.state;
    const { keyCouldDuplicated, isCleanDisabledLabel } = this.props;
    const treeNodeObj =
      CascadeMulti.getTreeNodeData(dataList, item.$id, null, keyCouldDuplicated);
    const { itemNode } = treeNodeObj;
    itemNode.checked = false;
    itemNode.halfChecked = false;
    if (itemNode.children) {
      itemNode.children = CascadeMulti.setChildrenChecked(
        itemNode.children,
        false,
        isCleanDisabledLabel,
        this.itemDisabledNodes
      );
    }
    if (level) {
      CascadeMulti.setFatherCheckState(itemNode, false, dataList, keyCouldDuplicated);
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
   * 设置组件宽度样式，兼容名称过长时显示效果等
   */
  setPanelWidth() {
    const resultPanelWidth = getWidthStyle(this.refResultPanel, 220);
    this.resultPanelWidth = parseInt(resultPanelWidth, 0);
  }

  /**
   * 渲染对应级的选项面板
   */
  renderUlList(level) {
    const t = this;
    const { prefixCls, notFoundContent, config, locale, keyCouldDuplicated } = this.props;
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
    const treeNodeObj = CascadeMulti.getTreeNodeData(
      dataList,
      selectArray[level - 1],
      null,
      keyCouldDuplicated
    );
    const childrenList = (
      treeNodeObj &&
      treeNodeObj.itemNode &&
      treeNodeObj.itemNode.children &&
      treeNodeObj.itemNode.children.length
    ) ? treeNodeObj.itemNode.children : [];
    const listArray = level ? childrenList : dataList;
    const noDataText = notFoundContent || i18n(locale).noData;
    return (
      <div key={level} className={`${prefixCls}-content`}>
        {
          config[level] && config[level].showSearch ?
            <div style={{ margin: '-5px 5px 5px' }}>
              <input
                className="kuma-input kuma-input-small-size"
                placeholder={i18n(locale).filter}
                onChange={(e) => {
                  const val = e.target.value;
                  const keywords = this.keywords || [];
                  keywords[level] = val;
                  clearTimeout(this.showSearchKeywordsTiming);
                  this.showSearchKeywordsTiming = setTimeout(() => {
                    this.setState({ showSearchKeywords: keywords });
                  }, 200);
                }}
              />
            </div>
            : null
        }
        <ul
          className="use-svg"
          ref={(r) => { this.refUls = r; }}
        >
          {
            selectArray[level - 1] && !listArray.length ?
              <span className={classnames([`${prefixCls}-list-noData`])}>{noDataText}</span> :
              t.renderListItems(listArray, level)
          }
        </ul>
      </div>
    );
  }

  /**
   * 渲染对应级的 ListItem
   */
  renderListItems(dataList, level) {
    const { prefixCls, config, mode } = this.props;
    const { selectArray } = this.state;
    const arr = [];
    // 设置当前级是否开启 checkbox
    const checkable = !(config[level] && config[level].checkable === false);
    dataList.forEach((item) => {
      // 如果只是用面板，则默认选择第一项
      if (mode === 'independent' && !selectArray[level]) {
        selectArray[level] = item.$id;
      }

      const { showSearchKeywords } = this.state;
      if (showSearchKeywords && item.label && item.label.indexOf(showSearchKeywords) === -1) {
        return;
      }

      arr.push(
        <li
          key={item.$id}
          className={classnames({
            [`${prefixCls}-list-item`]: !!prefixCls,
            [`${prefixCls}-checked`]: item.checked && !item.disabled,
            [`${prefixCls}-list-item-active`]: selectArray[level] === item.$id,
          })}
          title={item.label}
          onClick={() => { this.onItemClick(item, level); }}
        >
          <label
            className={classnames({
              [`${prefixCls}-item-label`]: true,
              [`${prefixCls}-item-disabled`]: item.disabled,
            })}
          >
            {
              checkable ? <s
                className={classnames({
                  'kuma-tree-checkbox': true,
                  'kuma-tree-checkbox-indeterminate': item.halfChecked,
                  'kuma-tree-checkbox-checked': item.checked && !item.halfChecked,
                  'kuma-tree-checkbox-checkbox-disabled': item.disabled,
                  'kuma-tree-checkbox-disabled': item.disabled,
                })}
                onClick={() => {
                  if (!item.disabled) {
                    this.onItemChecked(item, level);
                  }
                }}
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
            (allowClear && this.state.allItemDisabled === false) ?
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
    const { cascadeSize, isCleanDisabledLabel } = this.props;
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
          let isDelete = !item.disabled;
          if (!isCleanDisabledLabel) {
            isDelete = item.checked && !item.disabled;
          }
          arr.push(
            <li
              className={classnames('tree-node-ul-li', {
                'tree-node-ul-li-open': !item.expand,
                'tree-node-ul-li-close': item.expand,
              })}
              ref={(r) => { this.refResultUl = r; }}
              title={item.label}
              key={item.$id}
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
                    level < cascadeSize - 1 &&
                      item.checked && item.children && item.children.length ?
                      <span className="tree-node-ul-li-all">
                        {i18n(this.props.locale).haveAll}
                      </span> :
                      null
                  }
                  {
                    !isDelete ? null :
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
      arr = <span style={{ width: '21px', display: 'inline-block' }} />;
    }
    return arr;
  }

  renderDescription() {
    const descStyle = {
      height: '50px',
      overflow: 'hidden',
      padding: '10px 15px',
      borderTop: '1px solid #ddd',
      clear: 'both',
    };
    const { displayDesc } = this.state;
    return displayDesc ? (
      <div style={descStyle}>
        {displayDesc}
      </div>
    ) : null;
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
        style={{ width: minWidth }}
      >
        {arr}
        {this.renderResult()}
        {this.renderDescription()}
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
  onSelect: () => { },
  onItemClick: () => { },
  mode: 'independent',
  keyCouldDuplicated: false,
  isCleanDisabledLabel: false,
};

CascadeMulti.propTypes = {
  className: PropTypes.string,
  prefixCls: PropTypes.string,
  config: PropTypes.array,
  options: PropTypes.array,
  cascadeSize: PropTypes.number,
  value: PropTypes.array,
  notFoundContent: PropTypes.string,
  allowClear: PropTypes.bool,
  locale: PropTypes.string,
  onSelect: PropTypes.func,
  onItemClick: PropTypes.func,
  mode: PropTypes.oneOf(['independent', 'mix']),
  keyCouldDuplicated: PropTypes.bool,
  isCleanDisabledLabel: PropTypes.bool,
};

CascadeMulti.displayName = 'CascadeMulti';
polyfill(CascadeMulti);

module.exports = CascadeMulti;
