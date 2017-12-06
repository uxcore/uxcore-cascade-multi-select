/**
 * 获取选中的disabled节点
 * @param {*} dataList
 * @param {*} value
 * @param {bool} isLeafNode 无需校验value
 */
export function getDisabledValueLabel(dataList, value) {
  const disabledNodes = [];
  const leafNodes = [];

  /**
   * @param {*} list
   * @param {*} isNoNeedCheck 父级是被选中，则子级默认为选中状态
   * @param {*} isLeafNode 当为true时，直接进入为「筛选叶子节点的」方法
   */
  function recursion(list, isNoNeedCheck = false, isLeafNode = false) {
    list.forEach(item => {
      const isChecked = value.indexOf(item.value) > -1 || isNoNeedCheck;
      const hasChildren = item.children && item.children.length;
      const disabled = item.disabled;
      if (isLeafNode) {
        if (hasChildren) {
          recursion(item.children, false, isLeafNode);
        } else {
          leafNodes.push(item);
        }
        return;
      }
      if (isChecked && disabled) {
        disabledNodes.push(item);
        if (hasChildren) {
          recursion(item.children, false, true);
        } else {
          leafNodes.push(item);
        }
      } else if (hasChildren) {
        recursion(item.children, isChecked, false);
      }
    });
  }

  recursion(dataList);

  return {
    disabledNodes, leafNodes,
  };
}
