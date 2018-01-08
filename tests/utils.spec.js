import expect from 'expect.js';
import { getDisabledValueLabel, getCascadeSelected } from '../src/utils';
import { options } from './const';

describe('utils function', () => {
  it('getDisabledValueLabel: return correct disabledNodes and leafNodes', () => {
    const leafNodes = [{ value: 'baotuquan', label: '趵突泉' }];
    const result = {
      disabledNodes: [{
        value: 'jinan',
        label: '济南',
        disabled: true,
        children: leafNodes,
      }],
      leafNodes,
    };
    expect(getDisabledValueLabel(options, 'jinan')).to.eql(result);
  });

  it('getCascadeSelected: return CascadeSelected Array', () => {
    expect(getCascadeSelected(options, 'shandong')[0].value).to.be('shandong');
  });
});

