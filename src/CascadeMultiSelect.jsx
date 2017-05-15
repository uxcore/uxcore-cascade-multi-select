/**
 * CascadeMultiSelect Component for uxcore
 * @author guyunxiang
 *
 * Copyright 2015-2017, Uxcore Team, Alinw.
 * All rights reserved.
 */
import React from 'react';
import classnames from 'classnames';
import Dropdown from 'uxcore-dropdown';
import Button from 'uxcore-button';
import CascadeMultiPanel from './CascadeMultiPanel';
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
      result: {},
    };
    this.separator = ' , ';
    this.data = {
      value: props.value || props.defaultValue,
      options: props.options,
      displayValue: '',
      result: {},
    };
    this.hasChanged = false;
  }

  componentWillMount() {
    this.onOk = this.onOk.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleStopPropagation = this.handleStopPropagation.bind(this);
  }

  componentDidMount() {
    const { value, defaultValue, options } = this.props;
    const displayValue = this.getInputValue(value, options);
    this.data.displayValue = displayValue;
    this.data.value = value;
    this.setInputValue(value || defaultValue, options);
  }

  componentWillReceiveProps(nextProps) {
    // bugfix: 当 props.value 首先传递进组件之后再传递 options 数据并没有回填
    const { value, options } = nextProps;
    const displayValue = this.getInputValue(value, options);
    this.data.displayValue = displayValue;
    this.data.value = value;
    this.setInputValue(value, options);
  }

  onOk() {
    if (!this.hasChanged) {
      return;
    }
    const { displayValue, value, result } = this.state;
    const { valueList, labelList, leafList } = result;
    this.data.displayValue = displayValue;
    this.data.value = value;
    this.data.result = result;
    this.setState({
      displayValue,
      value,
    }, () => {
      this.props.onOk(valueList, labelList, leafList);
    });
  }

  onCancel() {
    const { value, options, result } = this.data;
    this.setState({
      displayValue: this.getInputValue(value, options),
      value,
      result,
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
      result: {},
    }, () => {
      this.props.onOk([], [], []);
    });
    this.hasChanged = true;
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

  setPanelWidth() {
    const { cascadeSize } = this.props;
    const style = {};
    const reg = /[0-9]+/g;
    const width = this.refUls ?
      getComputedStyle(this.refUls).width.match(reg)[0] :
      150;
    const resultPanelWidth = this.refResultPanel ?
      getComputedStyle(this.refResultPanel).width.match(reg)[0] : 220;
    style.width = 0;
    for (let i = 0; i < cascadeSize; i += 1) {
      style.width += parseInt(width, 0);
    }
    style.width += parseInt(resultPanelWidth, 0) + 2;
    this.resultPanelWidth = parseInt(resultPanelWidth, 0);
    return style;
  }

  handleSelect(valueList, labelList, leafList) {
    const { options } = this.props;
    this.setState({
      displayValue: this.getInputValue(valueList, options),
      value: valueList,
      result: {
        valueList,
        labelList,
        leafList,
      },
    }, () => {
      this.props.onSelect(valueList, labelList, leafList);
    });
    this.hasChanged = true;
  }

  handleItemClick(item, level) {
    this.props.onItemClick(item, level);
  }

  handleStopPropagation(e) {
    const tagName = e.target.tagName;
    if (tagName === 'DIV') {
      e.stopPropagation();
    }
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
    const { className, prefixCls } = this.props;
    const { displayValue, allowClear, disabled, showSubMenu } = this.state;
    const prefixCls2 = 'kuma-cascader';
    return (
      <div
        className={classnames({
          [className]: true,
          [`${prefixCls}-input`]: !disabled,
          [`${prefixCls2}-wrapper`]: true,
          [`${prefixCls2}-disabled`]: disabled,
          [`${prefixCls2}-clearable`]: !disabled && allowClear && displayValue.length > 0,
        })}
      >
        <div className={`${prefixCls2}-text`}>
          <div className={`${prefixCls2}-trigger`}>
            {this.renderInput()}
          </div>
        </div>
        <div
          className={classnames({
            [`${prefixCls2}-arrow`]: true,
            [`${prefixCls2}-arrow-reverse`]: showSubMenu,
          })}
        >
          <i className="kuma-icon kuma-icon-triangle-down" />
        </div>
        {this.renderCloseIcon()}
      </div>
    );
  }

  renderCascadeMultiPanel() {
    const { dropdownClassName, prefixCls } = this.props;
    const { value } = this.state;
    return (
      <div className={classnames([`${prefixCls}-select-panel-content`])}>
        <div className={`${prefixCls}-select-panel-wrap`} style={{ position: 'absolute' }}>
          <CascadeMultiPanel
            {...this.props}
            className={dropdownClassName}
            value={value}
            ref={(r) => { this.CascadeMulti = r; }}
            onSelect={this.handleSelect}
            onItemClick={this.handleItemClick}
          />
          {this.renderFooter()}
        </div>
      </div>
    );
  }

  renderFooter() {
    const { prefixCls, locale } = this.props;
    return (
      <div
        className={classnames(`${prefixCls}-select-footer`)}
        style={this.setPanelWidth()}
        onClick={this.handleStopPropagation}
      >
        <Button
          onClick={this.onOk}
        >
          {i18n(locale).ok}
        </Button>
      </div>
    );
  }

  render() {
    const { disabled, getPopupContainer } = this.props;
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
        getPopupContainer={getPopupContainer}
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
  getPopupContainer: null,
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
  getPopupContainer: React.PropTypes.func,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

CascadeMultiSelect.CascadeMultiPanel = CascadeMultiPanel;
CascadeMultiSelect.CascadeMultiModal = CascadeMultiModal;

module.exports = CascadeMultiSelect;
