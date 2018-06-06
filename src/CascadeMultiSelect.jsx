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
import Dropdown from 'uxcore-dropdown';
import Button from 'uxcore-button';
import CascadeMultiPanel from './CascadeMultiPanel';
import CascadeMultiModal from './CascadeMultiModal';
import i18n from './locale';
import { getDisabledValueLabel, getWidthStyle } from './utils';

const makeOptionsChecked = (value = [], options) => {
  // 没有value则需要设置check为false
  const valueStr = value.map(i => `${i}`);
  for (let i = 0, l = options.length; i < l; i++) {
    const item = options[i];
    const containIdx = valueStr.indexOf(`${item.value}`);
    if (containIdx > -1) {
      item.checked = true;
      valueStr.splice(containIdx, 1);
    } else {
      item.checked = false;
    }
    if (item.children && item.children.length) {
      makeOptionsChecked(valueStr, item.children);
    }
  }
};

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
      size: props.size,
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
    const { value, result } = this.state;
    const displayValue = this.getInputValue(value, this.props.options);
    const { valueList, labelList, leafList, cascadeSelected } = result;
    this.data.displayValue = displayValue;
    this.data.value = value;
    this.data.result = result;
    this.setState({
      displayValue,
      value,
    }, () => {
      this.props.onOk(valueList, labelList, leafList, cascadeSelected);
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
    const { isCleanDisabledLabel, options } = this.props;
    const prevValue = this.state.value;
    let displayValue = '';
    const value = [];
    const labelList = [];
    let leafList = [];
    const result = {};
    if (!isCleanDisabledLabel) {
      const data = getDisabledValueLabel(options, prevValue);
      leafList = data.leafNodes;
      data.disabledNodes.forEach((item) => {
        value.push(item.value);
        labelList.push(item.label);
      });
      result.labelList = labelList;
      result.valueList = value;
      result.leafList = leafList;
      displayValue = this.getInputValue(value, options);
    }
    this.data.displayValue = displayValue;
    this.data.value = value;
    this.setState({
      value,
      displayValue,
      result,
    }, () => {
      this.props.onOk(value, labelList, leafList);
      this.props.onSelect(value, labelList, leafList);
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
    if (this.props.beforeRender) {
      makeOptionsChecked(value, dataList);
      return this.props.beforeRender(value, dataList);
    }

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
    const width = getWidthStyle(this.refUls, 150);
    const resultPanelWidth = getWidthStyle(this.refResultPanel, 220);
    style.width = 0;
    for (let i = 0; i < cascadeSize; i += 1) {
      style.width += parseInt(width, 0);
    }
    style.width += parseInt(resultPanelWidth, 0) + 2;
    this.resultPanelWidth = parseInt(resultPanelWidth, 0);
    return style;
  }

  handleSelect(valueList, labelList, leafList, cascadeSelected) {
    const { options } = this.props;
    this.setState({
      displayValue: this.getInputValue(valueList, options),
      value: valueList,
      result: {
        valueList,
        labelList,
        leafList,
        cascadeSelected,
      },
    }, () => {
      this.props.onSelect(valueList, labelList, leafList, cascadeSelected);
    });
    this.hasChanged = true;
  }

  handleItemClick(...params) {
    this.props.onItemClick(...params);
  }

  handleStopPropagation(e) {
    const tagName = e.target.tagName;
    if (tagName === 'DIV') {
      e.stopPropagation();
    }
  }

  renderInput() {
    const { prefixCls, placeholder, locale, readOnly } = this.props;
    const { disabled } = this.state;
    const { displayValue } = this.data;
    if (readOnly) {
      return <span>{displayValue}</span>;
    }
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
          onClick={(e) => {
            this.onCleanSelect();
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </div>
    );
  }

  renderContent() {
    const { className, prefixCls, size } = this.props;
    const { displayValue, allowClear, disabled, showSubMenu } = this.state;
    const prefixCls2 = 'kuma-cascader';
    return (
      <div
        className={classnames({
          [className]: true,
          [`${prefixCls}-input`]: !disabled,
          [`${prefixCls}-${size}`]: !!size,
          [`${prefixCls2}-wrapper`]: true,
          [`${prefixCls2}-disabled`]: disabled,
          [`${prefixCls2}-clearable`]: !disabled && allowClear && displayValue.length > 0,
        })}
      >
        <div
          className={classnames({
            [`${prefixCls2}-text`]: true,
            [`${prefixCls}-${size}`]: !!size,
          })}
        >
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
      <div className={classnames(`${prefixCls}-select-panel-content`)}>
        <div className={`${prefixCls}-select-panel-wrap`}>
          <CascadeMultiPanel
            {...this.props}
            className={dropdownClassName}
            value={value}
            ref={(r) => { this.CascadeMulti = r; }}
            onSelect={this.handleSelect}
            onItemClick={this.handleItemClick}
            mode="mix"
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
    const { disabled, getPopupContainer, readOnly } = this.props;
    if (readOnly) {
      return this.renderInput();
    }
    if (disabled) {
      return this.renderContent();
    }
    const CascadeMultiComponent = this.renderCascadeMultiPanel();
    return (
      <Dropdown
        overlay={CascadeMultiComponent}
        trigger={['click']}
        minOverlayWidthMatchTrigger={false}
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
  size: 'large',
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

  beforeRender: null,
  readOnly: false,
  keyCouldDuplicated: false,
  isCleanDisabledLabel: false,
};

CascadeMultiSelect.propTypes = {
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

  size: PropTypes.oneOf(['large', 'middle', 'small']),
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.array,
  dropdownClassName: PropTypes.string,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  getPopupContainer: PropTypes.func,

  beforeRender: PropTypes.func,
  readOnly: PropTypes.bool,
  keyCouldDuplicated: PropTypes.bool,
  isCleanDisabledLabel: PropTypes.bool,
};

CascadeMultiSelect.displayName = 'CascadeMultiSelect';

CascadeMultiSelect.CascadeMultiPanel = CascadeMultiPanel;
CascadeMultiSelect.CascadeMultiModal = CascadeMultiModal;

module.exports = CascadeMultiSelect;
