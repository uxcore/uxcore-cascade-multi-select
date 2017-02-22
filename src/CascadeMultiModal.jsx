/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import deepcopy from 'lodash/cloneDeep';
import Button from 'uxcore-button';
import Dialog from 'uxcore-dialog';
import CascadeMulti from './CascadeMulti.jsx';

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
  }

  componentWillMount() {
    const { value, options } = this.props;
    this.initResult(value, options);
  }

  onOk() {
    const { value, options, result } = this.state;
    this.data = {
      value,
      options,
      result,
    };
    this.props.onOk(this.state.result);
    this.setState({ visible: false });
  }

  onCancel() {
    const { value, options } = this.data;
    this.setState({
      visible: false,
      value,
      options,
    }, () => {
      this.props.onCancel();
    });
  }

  onSelect(resa, resb) {
    this.setState({
      value: resa,
      result: {
        resa,
        resb,
      },
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
      resa: keyArr,
      resb: textArr,
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
        title={title}
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
        <CascadeMulti
          {...this.props}
          value={value}
          options={options}
          onSelect={(resa, resb) => {
            this.onSelect(resa, resb);
          }}
          ref={(r) => { this.refCascadeMulti = r; }}
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
    const { prefixCls } = this.props;
    const { expand } = this.state;
    const { resb } = this.data.result;
    if (!resb || !resb.length) { return null; }
    let arr = null;
    if (expand) {
      arr = (
        <span
          className={`${prefixCls}-model-expand`}
          onClick={() => { this.onExpand(false); }}
        >
          收起
        </span>
      );
    } else {
      arr = (
        <span
          className={`${prefixCls}-model-expand`}
          onClick={() => { this.onExpand(true); }}
        >
          展开全部{resb.length}项
        </span>
      );
    }
    return arr;
  }

  renderResultList() {
    const { prefixCls } = this.props;
    const { expand } = this.state;
    const { resa, resb } = this.data.result;
    if (!resb) { return null; }
    const arr = [];
    const style = {};
    if (expand) {
      style.height = 'auto';
    } else {
      style.maxHeight = 76;
    }
    resb.forEach((item, index) => {
      arr.push(
        <li className={`${prefixCls}-model-result-ul-list`} key={resa[index]}>
          <span className={`${prefixCls}-model-result-ul-list-content`}>{item}</span>
          <i
            className={classnames(
              [`${prefixCls}-model-result-ul-list-remove`],
              'kuma-icon kuma-icon-close')
            }
            onClick={() => { this.onDelete(resa[index]); }}
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
    return (
      <div>
        <Button
          type={'outline'}
          onClick={() => {
            this.setState({ visible: true });
          }}
        >
          请选择
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

  title: '级联选择',
  width: 672,
  onOk: () => {},
  onCancel: () => {},
};

CascadeMultiModal.propTypes = {
  className: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  config: React.PropTypes.array,
  options: React.PropTypes.array,
  cascadeSize: React.PropTypes.number,
  value: React.PropTypes.array,
  notFoundContent: React.PropTypes.string,
  allowClear: React.PropTypes.bool,
  locale: React.PropTypes.string,

  title: React.PropTypes.string,
  width: React.PropTypes.number,
  onOk: React.PropTypes.func,
  onCancel: React.PropTypes.func,
};

export default CascadeMultiModal;
