import expect from 'expect.js';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import deepcopy from 'lodash/cloneDeep';
import CascadeMultiModal from '../src/CascadeMultiModal';
import { options } from './const';
const { mount, shallow } = Enzyme;

Enzyme.configure({ adapter: new Adapter() });

describe('CascadeMultiModal', () => {
  it('default displayValue', () => {
    const wrapper = shallow(
      <CascadeMultiModal
        options={deepcopy(options)}
        value={['xihu']}
      />
    );
    expect(wrapper.find('.kuma-cascade-multi-model-result-ul-list-content').text())
      .to.be('西湖');
  });
  
  it('delete label', () => {
    const wrapper = shallow(
      <CascadeMultiModal
        options={deepcopy(options)}
        value={['xihu']}
      />
    );
    wrapper.find('.kuma-cascade-multi-model-result-ul-list-remove')
      .at(0).simulate('click');
    expect(wrapper.state('value')).to.eql([]);
  });
 
  it('test onOk', () => {
    class Demo extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          value: [],
        };
      }

      onOk = (valueList, labelList, leafList) => {
        this.setState({ value: leafList.map(item => item.value) });
      }

      render() {
        return (
          <CascadeMultiModal
            options={deepcopy(options)}
            value={this.state.value}
            onOk={this.onOk}
          />
        );
      }
    }
    const wrapper = mount(<Demo />);
    wrapper.find('button').simulate('click');
    const overlay = mount(wrapper.find('Dialog').at(0).props().children);
    overlay.find('.kuma-cascade-multi-content').at(0)
      .find('.kuma-cascade-multi-list-item').at(1)
      .find('s').simulate('click');
    wrapper.find('CascadeMultiModal').instance().onOk();
    expect(wrapper.state('value')).to.eql(['zhonghuamen']);
  });
});