/**
 * CascadeMultiSelect Component for uxcore
 * @author changming<changming.zy@alibaba-inc.com>
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
import Button from 'uxcore-button';
import Dialog from 'uxcore-dialog';
import CascadeMultiPanel from './CascadeMultiPanel';
import i18n from './locale';

class CascadeMultiModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: props.options,
      visible: false,
      expand: true,
      result: {},
    };
    this.data = {
      value: props.value,
      options: props.options,
      result: {},
    };
    const { value, options } = props;
    this.initResult(value, options);
  }

  onOk() {
    const { value, options, result } = this.state;
    const { valueList, labelList, leafList } = result;
    this.data = {
      value,
      options,
      result,
    };
    this.props.onOk(valueList, labelList, leafList);
    this.setState({ visible: false });
  }

  onCancel() {
    const { value, options, result } = this.data;
    this.setState({
      visible: false,
      value,
      options,
      result,
    }, () => {
      this.props.onCancel();
    });
  }

  onSelect(valueList, labelList, leafList) {
    this.setState({
      value: valueList,
      result: {
        valueList,
        labelList,
        leafList,
      },
    }, () => {
      this.props.onSelect(valueList, labelList, leafList);
    });
  }

  onDelete(key) {
    const { options } = this.props;
    const { value } = this.state;
    const index = value.indexOf(key);
    if (index !== -1) {
      value.splice(index, 1);
    }
    this.initResult(value, options);
    this.setState({ value, options });
  }

  onExpand(expand) {
    this.setState({
      expand,
    });
  }

  getSelectResult(value, dataList, keyArr, textArr) {
    if (dataList && dataList.length) {
      for (let i = 0; i < dataList.length; i++) {
        const item = dataList[i];
        if (!value.length) { return; }
        if (value.indexOf(item.value) !== -1) {
          keyArr.push(item.value);
          textArr.push(item.label);
          value.splice(value.indexOf(item.value), 1);
        }
        if (item.children) {
          this.getSelectResult(value, item.children, keyArr, textArr);
        }
      }
    }
  }

  initResult(value, options) {
    const keyArr = [];
    const textArr = [];
    const valueList = deepcopy(value);
    this.getSelectResult(valueList, options, keyArr, textArr);
    this.data.value = keyArr;
    this.data.result = {
      valueList: keyArr,
      labelList: textArr,
    };
  }

  renderDialog() {
    const { prefixCls, locale, title, cascadeSize, width } = this.props;
    const { visible } = this.state;
    if (!visible) { return null; }
    // 设置 dialog 默认宽度
    const defaultWidth = width || cascadeSize * 150 + 220 + 2;
    return (
      <Dialog
        className={`${prefixCls}-model`}
        title={title || i18n(locale).title}
        visible={visible}
        locale={locale}
        width={defaultWidth}
        onOk={() => {
          this.onOk();
        }}
        onCancel={() => {
          this.onCancel();
        }}
      >
        {this.renderContent()}
      </Dialog>
    );
  }

  renderContent() {
    const { value, options } = this.state;
    return (
      <div>
        <CascadeMultiPanel
          {...this.props}
          value={value}
          options={options}
          onSelect={(valueList, labelList, leafList) => {
            this.onSelect(valueList, labelList, leafList);
          }}
          ref={(r) => { this.refCascadeMulti = r; }}
          mode="mix"
        />
      </div>
    );
  }

  renderResult() {
    const { prefixCls } = this.props;
    return (
      <div
        className={`${prefixCls}-model-result`}
      >
        {this.renderResultList()}
        {this.renderExpand()}
      </div>
    );
  }

  renderExpand() {
    const { prefixCls, locale } = this.props;
    const { expand } = this.state;
    const { labelList } = this.data.result;
    if (!labelList || !labelList.length) { return null; }
    let arr = null;
    if (expand) {
      arr = (
        <span
          className={`${prefixCls}-model-expand`}
          onClick={() => { this.onExpand(false); }}
        >
          {i18n(locale).close}
        </span>
      );
    } else {
      arr = (
        <span
          className={`${prefixCls}-model-expand`}
          onClick={() => { this.onExpand(true); }}
        >
          {i18n(locale).expandAll}
          {labelList.length}
          {i18n(locale).item}
        </span>
      );
    }
    return arr;
  }

  renderResultList() {
    const { prefixCls } = this.props;
    const { expand } = this.state;
    const { valueList, labelList } = this.data.result;
    if (!labelList) { return null; }
    const arr = [];
    const style = {};
    if (expand) {
      style.height = 'auto';
    } else {
      style.maxHeight = 76;
    }
    labelList.forEach((item, index) => {
      arr.push(
        <li className={`${prefixCls}-model-result-ul-list`} key={valueList[index]}>
          <span className={`${prefixCls}-model-result-ul-list-content`}>{item}</span>
          <i
            className={classnames(
              [`${prefixCls}-model-result-ul-list-remove`],
              'kuma-icon kuma-icon-close')
            }
            onClick={() => { this.onDelete(valueList[index]); }}
          ></i>
        </li>
      );
    });
    return (
      <ul
        className={`${prefixCls}-model-result-ul`}
        style={style}
      >
        {arr}
      </ul>
    );
  }

  render() {
    const { locale } = this.props;
    return (
      <div>
        <Button
          type={'outline'}
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          {i18n(locale).placeholder}
        </Button>
        {this.renderResult()}
        {this.renderDialog()}
      </div>
    );
  }

}

CascadeMultiModal.defaultProps = {
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

  title: '',
  width: 0,
  onOk: () => {},
  onCancel: () => {},
};

CascadeMultiModal.propTypes = {
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

  title: PropTypes.string,
  width: PropTypes.number,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
};

export default CascadeMultiModal;
