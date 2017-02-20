/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import Dialog from 'uxcore-dialog';
import CascadeMulti from './CascadeMulti.jsx';

class CascadeMultiModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      options: props.options,
      visible: false,
      result: {},
    };
    this.data = {
      value: props.value,
      options: props.options,
    };
  }

  onOk() {
    const { value, options } = this.state;
    this.data = {
      value,
      options,
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

  renderDialog() {
    const { prefixCls, locale, title, cascadeSize, width } = this.props;
    const { visible } = this.state;
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

  render() {
    return (
      <div>
        <input
          onClick={() => {
            this.setState({
              visible: true,
            });
          }}
        />
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
