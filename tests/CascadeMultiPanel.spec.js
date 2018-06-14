import expect from 'expect.js';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import deepcopy from 'lodash/cloneDeep';
import CascadeMultiPanel from '../src/CascadeMultiPanel';
import { options } from './const';
const { mount, shallow } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('CascadeMultiPanel', () => {
  it('default render Panel', () => {
    const wrapper = shallow(
      <CascadeMultiPanel
        options={deepcopy(options)}
        value={['xihu', 'test']}
      />
    );
    expect(wrapper.find('.kuma-cascade-multi-content').at(2)
      .find('.kuma-cascade-multi-list-item-active')
      .prop('title'))
      .to.be('西湖');
  });

  it('change list when item is Clicked', () => {
    const wrapper = mount(
      <CascadeMultiPanel
        options={deepcopy(options)}
        value={['hangzhou']}
      />
    );
    const lists = wrapper.find('.kuma-cascade-multi-content');
    const clickItem = lists.at(0).find('.kuma-cascade-multi-list-item').at(1);
    clickItem.simulate('click');
    expect(wrapper.find('.kuma-cascade-multi-content').at(0).find('.kuma-cascade-multi-list-item')
      .at(1)
      .prop('className')
      .indexOf('active'))
      .to.be.greaterThan(-1);
    expect(wrapper.find('.kuma-cascade-multi-content').at(1)
      .find('.kuma-cascade-multi-list-item-active')
      .at(0)
      .prop('title')).to.be('南京');
  });

  it('trigger ResultPanel node', () => {
    const wrapper = mount(
      <CascadeMultiPanel
        options={deepcopy(options)}
        value={['hangzhou']}
      />
    );
    wrapper.find('.tree-node-ul-li-open').at(0).simulate('click');
    expect(wrapper.find('.tree-node-ul').length).to.be(1);
  });

  it('keywords search feature will be ok', () => {
    const wrapper = mount(
      <CascadeMultiPanel
        config={[{ showSearch: true }]}  
        options={deepcopy(options)}
      />
    );
    wrapper.find('.kuma-input-small-size').at(0).value = '浙江';
    setTimeout(() => {
      expect(wrapper.find('.kuma-cascade-multi-content').at(0).find('.kuma-cascade-multi-list-item').length).to.be(1);
    }, 300);
  });
});
