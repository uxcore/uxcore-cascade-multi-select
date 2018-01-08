import deepcopy from 'lodash/cloneDeep';

/**
 * 获取选中的disabled节点
 * @param {*} dataList
 * @param {*} value
 */
export function getDisabledValueLabel(dataList, value) {
  const disabledNodes = [];
  let leafNodes = [];

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
  leafNodes = leafNodes.map(item =>
    ({
      value: item.value,
      label: item.label,
    })
  );

  return {
    disabledNodes, leafNodes,
  };
}

const getCheckedIndexs = (dataList, values) => {
  const result = [];
  function recursion(data, level = '0') {
    data.forEach((item, i) => {
      const index = `${level}-${i}`;
      item.pos = index; // eslint-disable-line
      if (values.indexOf(item.value) > -1) {
        result.push(index);
      } else if (item.children && item.children.length) {
        recursion(item.children, index);
      }
    });
  }
  recursion(dataList);
  return result;
};

function checkStr(values, str) {
  return values.some((value) => value.indexOf(str) === 0);
}

export const getCascadeSelected = (data, values) => {
  const ret = deepcopy(data);
  const checkedIndex = getCheckedIndexs(ret, values);
  function recursion(dataList) {
    for (let i = 0; i < dataList.length;) {
      if (!checkStr(checkedIndex, dataList[i].pos)) {
        dataList.splice(i, 1);
        continue;
      }
      if (dataList[i].children && dataList[i].children.length) {
        recursion(dataList[i].children);
      }
      i += 1;
    }
  }

  recursion(ret);
  return ret;
};

export const getWidthStyle = (dom, defaultWidth) => {
  const reg = /[0-9]+/g;
  if (dom) {
    const width = getComputedStyle(dom).width;
    if (width) {
      return width.match(reg)[0];
    }
  }
  return defaultWidth;
};
