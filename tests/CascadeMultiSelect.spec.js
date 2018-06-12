import expect from 'expect.js';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import deepcopy from 'lodash/cloneDeep';
import CascadeMultiSelect from '../src';
import { options } from './const';
const { mount, shallow } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('CascadeMultiSelect', () => {
  it('render displayValue', () => {
    const wrapper = shallow(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['xihu', 'test']}
      />
    );
    expect(wrapper.state('displayValue')).to.be('西湖 , test');
  });

  it('define props.beforeRender', () => {
    const wrapper = shallow(
      <CascadeMultiSelect
        options={deepcopy(options)}
        beforeRender={(value, opts) => {
          let back = '';
          function recursion(list) {
            list.forEach(item => {
              if (item.checked) {
                back += `${item.label}, `;
              } else if (item.children && item.children.length) {
                recursion(item.children);
              }
            });
          }
          recursion(opts);
          return back.substring(0, back.length - 2);
        }}
        value={['hangzhou']}
      />
    );
    expect(wrapper.state('displayValue')).to.be('杭州');
  });

  it('no response click event when CascadeMultiSelect is disabled', () => {
    const wrapper = mount(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['hangzhou']}
        disabled
      />
    );
    wrapper.find('.kuma-cascader-wrapper').simulate('click');
    expect(wrapper.state('showSubMenu')).to.be(false);
  });

  it('render Span only when CascadeMultiSelect is readOnly', () => {
    const wrapper = mount(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['xihu']}
        readOnly
      />
    );
    expect(wrapper.find('span').text()).to.be('西湖');
  });

  it('clear All data', () => {
    const wrapper = mount(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['jiangsu']}
      />
    );
    wrapper.find('.kuma-icon-error').simulate('click');
    expect(wrapper.state('value')).to.be.empty();
  });
  
  it('value should change when onItemClick', () => {
    const wrapper = mount(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['xihu']}
      />
    );

    wrapper.find('.kuma-cascader-wrapper').simulate('click');
    const overlay = mount(wrapper.find('Dropdown').props().overlay);
    overlay.find('.kuma-cascade-multi-content').at(0)
      .find('.kuma-cascade-multi-list-item').at(0)
      .find('s').simulate('click');
    expect(wrapper.state('value')).to.eql(['zhejiang']);
    overlay.find('.kuma-cascade-multi-content').at(0)
    .find('.kuma-cascade-multi-list-item').at(0)
    .find('s').simulate('click');
    expect(wrapper.state('value')).to.eql(['xihu']);    
  });

  it('value should be empty when clean Btn is clicked ', () => {
    const wrapper = mount(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['jiangsu']}
      />
    );
    wrapper.find('.kuma-cascader-wrapper').simulate('click');
    const overlay = mount(wrapper.find('Dropdown').props().overlay);
    overlay.find('.kuma-cascade-multi-content').at(0)
      .find('.kuma-cascade-multi-list-item').at(0)
      .find('s').simulate('click');
    overlay.find('.kuma-cascade-multi-result-clean').simulate('click');
    expect(wrapper.state('value')).to.eql([]);
  });

  it('change displayValue when onOk Btn is clicked', () => {
    class Demo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: ['']
        };
      }

      onOk = (valueList, labelList, leafList) => {
        this.setState({ value: leafList.map(item => item.value) });
      }

      render() {
        return (
          <CascadeMultiSelect
            options={deepcopy(options)}
            value={this.state.value}
            onOk={this.onOk}
          />
        );
      }
    }
    const wrapper = mount(<Demo />);
    wrapper.find('.kuma-cascader-wrapper').simulate('click');
    const overlay = mount(wrapper.find('Dropdown').props().overlay);
    overlay.find('.kuma-cascade-multi-content').at(0)
      .find('.kuma-cascade-multi-list-item').at(1)
      .find('s').simulate('click');
    overlay.find('.kuma-cascade-multi-select-footer').find('button').simulate('click');
    expect(wrapper.state('value')).to.eql(['zhonghuamen']);
  });

  it('test「isCleanDisabledLabel」props', () => {
    const wrapper = mount(
      <CascadeMultiSelect
        options={deepcopy(options)}
        value={['xihu']}
        isCleanDisabledLabel
      />
    );
    wrapper.find('.kuma-cascader-wrapper').simulate('click');
    const overlay = mount(wrapper.find('Dropdown').props().overlay);
    overlay.find('.kuma-cascade-multi-result-clean').simulate('click');    
    expect(wrapper.state('value')).to.eql([]);
  });
});
