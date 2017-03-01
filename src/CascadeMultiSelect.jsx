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
import Button from 'uxcore-button';
import CascadeMulti from './CascadeMulti';
import CascadeMultiModal from './CascadeMultiModal';
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
    this.data = {
      value: props.value || props.defaultValue,
      options: props.options,
      displayValue: '',
    };
  }

  componentWillMount() {
    this.onOk = this.onOk.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
  }

  componentDidMount() {
    const { value, defaultValue, options } = this.props;
    this.setInputValue(value || defaultValue, options);
  }

  componentWillReceiveProps(nextProps) {
    // bugfix: 当 props.value 首先传递进组件之后再传递 options 数据并没有回填
    const { value, options } = nextProps;
    this.setInputValue(value, options);
  }

  onOk() {
    const { displayValue, value } = this.state;
    this.data.displayValue = displayValue;
    this.data.value = value;
    this.setState({
      displayValue,
      value,
    }, () => {
      this.props.onOk(value);
    });
  }

  onCancel() {
    const { value, options } = this.data;
    this.setState({
      displayValue: this.getInputValue(value, options),
      value,
    }, () => {
      this.props.onCancel();
    });
  }

  onCleanSelect() {
    this.data.displayValue = '';
    this.data.value = [];
    this.setState({
      value: [],
      displayValue: '',
    }, () => {
      this.props.onOk([]);
    });
  }

  onDropDownVisibleChange(visible) {
    const { disabled } = this.props;
    if (!disabled) {
      this.setState({ showSubMenu: visible });
    }
    if (!visible) {
      this.onCancel();
    }
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
          return dataList[i].children && dataList[i].children.length ?
            `${dataList[i].label} (${i18n(this.props.locale).all})` :
            dataList[i].label;
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
    this.setState({ displayValue, value });
  }

  handleSelect(resa, resb) {
    const { options } = this.props;
    this.setState({
      displayValue: this.getInputValue(resa, options),
      value: resa,
    }, () => {
      this.props.onSelect(resa, resb);
    });
  }

  handleItemClick(item, level) {
    this.props.onItemClick(item, level);
  }

  renderInput() {
    const { prefixCls, placeholder, locale } = this.props;
    const { disabled } = this.state;
    const { displayValue } = this.data;
    return (
      <div>
        {
          !displayValue.length ?
            <div className="kuma-cascader-placeholder">
              {placeholder || i18n(locale).placeholder}
            </div> :
            <div className={classnames([`${prefixCls}-text-result`])}>
              <input
                className={classnames({
                  [`${prefixCls}-text-result-input`]: true,
                  [`${prefixCls}-text-result-input-disabled`]: disabled,
                })}
                value={displayValue}
                onChange={() => {}}
              />
            </div>
        }
      </div>
    );
  }

  renderCloseIcon() {
    const { disabled } = this.state;
    if (disabled) { return null; }
    return (
      <div className={'kuma-cascader-close-wrap'}>
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
    const { className } = this.props;
    const { displayValue, allowClear, disabled, showSubMenu } = this.state;
    const prefixCls = 'kuma-cascader';
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
            {this.renderInput()}
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

  renderCascadeMultiPanel() {
    const { dropdownClassName } = this.props;
    const { value } = this.state;
    return (
      <div>
        <CascadeMulti
          {...this.props}
          className={dropdownClassName}
          value={value}
          ref={(r) => { this.CascadeMulti = r; }}
          onSelect={this.handleSelect}
          onItemClick={this.handleItemClick}
        />
        {this.renderFooter()}
      </div>
    );
  }

  renderFooter() {
    const { prefixCls, locale } = this.props;
    return (
      <div className={classnames(`${prefixCls}-select-footer`)}>
        <Button
          onClick={this.onOk}
        >
          {i18n(locale).ok}
        </Button>
      </div>
    );
  }

  render() {
    const { disabled } = this.props;
    if (disabled) {
      return this.renderContent();
    }
    const CascadeMultiComponent = this.renderCascadeMultiPanel();
    return (
      <Dropdown
        overlay={CascadeMultiComponent}
        trigger={['click']}
        onVisibleChange={(visible) => {
          this.onDropDownVisibleChange(visible);
        }}
      >
        {this.renderContent()}
      </Dropdown>
    );
  }
}

CascadeMultiSelect.defaultProps = {
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
  onItemClick: () => {},

  placeholder: '',
  disabled: false,
  defaultValue: [],
  dropdownClassName: '',
  onOk: () => {},
  onCancel: () => {},
};

CascadeMultiSelect.propTypes = {
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

  placeholder: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  defaultValue: React.PropTypes.array,
  dropdownClassName: React.PropTypes.string,
  onOk: React.PropTypes.func,
  onCancel: React.PropTypes.func,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

CascadeMultiSelect.CascadeMultiPanel = CascadeMulti;
CascadeMultiSelect.CascadeMultiModal = CascadeMultiModal;

module.exports = CascadeMultiSelect;
