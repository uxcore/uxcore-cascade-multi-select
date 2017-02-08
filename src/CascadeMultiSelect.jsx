/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2016, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import Dropdown from 'uxcore-dropdown';
import CascadeMulti from './CascadeMulti.jsx';
import i18n from './locale';

class CascadeMultiSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      defaultValue: props.defaultValue,
      displayValue: '',
      allowClear: props.allowClear,
      disabled: props.disabled,
      showSubMenu: false,
    };
    this.separator = ' , ';
  }

  componentDidMount() {
    const { value, defaultValue, options } = this.props;
    this.setInputValue(value || defaultValue, options);
  }

  componentWillReceiveProps(nextProps) {
    const { value, options } = nextProps;
    this.setInputValue(value, options);
  }

  onCleanSelect() {
    this.CascadeMulti.onCleanSelect();
  }

  getInputValue(value, dataList) {
    const arr = [];
    if (value && value.length) {
      for (let i = 0; i < value.length; i += 1) {
        arr.push(this.getValueLabel(dataList, value[i]));
      }
    }
    return arr.join(this.separator);
  }

  getValueLabel(dataList, key) {
    let back = '';
    if (dataList && dataList.length) {
      for (let i = 0; i < dataList.length; i += 1) {
        if (dataList[i].value === key) {
          return dataList[i].label;
        }
        if (dataList[i].children) {
          const res = this.getValueLabel(dataList[i].children, key);
          back = res || back;
        }
      }
    }
    return back;
  }

  setInputValue(value, dataList) {
    const displayValue = this.getInputValue(value, dataList);
    this.setState({ displayValue });
  }

  handleSelect(resa, resb) {
    this.setState({
      value: resa,
      displayValue: resb.join(this.separator),
    });
    this.props.onSelect(resa, resb);
  }

  renderCloseIcon() {
    const { disabled } = this.state;
    if (disabled) { return null; }
    const prefixCls = 'kuma-cascader';
    return (
      <div className={`${prefixCls}-close-wrap`}>
        <i
          className="kuma-icon kuma-icon-error"
          onClick={() => {
            this.onCleanSelect();
          }}
        />
      </div>
    );
  }

  renderContent() {
    const { placeholder, className, locale } = this.props;
    const { displayValue, allowClear, disabled, showSubMenu } = this.state;
    const prefixCls = 'kuma-cascader';
    const placeholderText = placeholder || i18n(locale).placeholder;
    return (
      <div
        className={classnames({
          [className]: true,
          [`${prefixCls}-wrapper`]: true,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-clearable`]: !disabled && allowClear && displayValue.length > 0,
        })}
      >
        <div className={`${prefixCls}-text`}>
          <div className={`${prefixCls}-trigger`}>
            {
              placeholderText && !displayValue.length ?
                <div className={`${prefixCls}-placeholder`}>
                  {placeholderText}
                </div> :
                null
            }
            {displayValue}
          </div>
        </div>
        <div
          className={classnames({
            [`${prefixCls}-arrow`]: true,
            [`${prefixCls}-arrow-reverse`]: showSubMenu,
          })}
        >
          <i className="kuma-icon kuma-icon-triangle-down" />
        </div>
        {this.renderCloseIcon()}
      </div>
    );
  }

  render() {
    const { disabled } = this.props;
    if (disabled) {
      return this.renderContent();
    }
    const CascadeMultiComponent = (
      <div>
        <CascadeMulti
          { ...this.props }
          ref={(r) => { this.CascadeMulti = r; }}
          onSelect={(resa, resb) => {
            this.handleSelect(resa, resb);
          }}
        />
      </div>
    );
    return (
      <Dropdown
        overlay={CascadeMultiComponent}
        trigger={['click']}
      >
        {this.renderContent()}
      </Dropdown>
    );
  }
}

CascadeMultiSelect.defaultProps = {
  className: '',
  prefixCls: 'kuma-cascade-multi',
  options: [],
  cascadeSize: 3,
  value: [],
  readOnly: false,
  noDataContent: '',
  allowClear: true,
  locale: 'zh-cn',
  onSelect: () => {},

  placeholder: '',
  disabled: false,
  defaultValue: [],
};

CascadeMultiSelect.propTypes = {
  className: React.PropTypes.string,
  prefixCls: React.PropTypes.string,
  options: React.PropTypes.array,
  cascadeSize: React.PropTypes.number,
  value: React.PropTypes.array,
  noDataContent: React.PropTypes.string,
  allowClear: React.PropTypes.bool,
  readOnly: React.PropTypes.bool,
  locale: React.PropTypes.string,
  onSelect: React.PropTypes.func,

  placeholder: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  defaultValue: React.PropTypes.array,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

module.exports = CascadeMultiSelect;
