## uxcore-cascade-multi-select

级联多选组件，推荐所有层级的每一个候选 option 的 key 都是不重复的。

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]
[![Dependency Status][dep-image]][dep-url]
[![devDependency Status][devdep-image]][devdep-url]
[![NPM downloads][downloads-image]][npm-url]

[![Sauce Test Status][sauce-image]][sauce-url]

[npm-image]: http://img.shields.io/npm/v/uxcore-cascade-multi-select.svg?style=flat-square
[npm-url]: http://npmjs.org/package/uxcore-cascade-multi-select
[travis-image]: https://img.shields.io/travis/uxcore/uxcore-cascade-multi-select.svg?style=flat-square
[travis-url]: https://travis-ci.org/uxcore/uxcore-cascade-multi-select
[coveralls-image]: https://img.shields.io/coveralls/uxcore/uxcore-cascade-multi-select.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/uxcore/uxcore-cascade-multi-select?branch=master
[dep-image]: http://img.shields.io/david/uxcore/uxcore-cascade-multi-select.svg?style=flat-square
[dep-url]: https://david-dm.org/uxcore/uxcore-cascade-multi-select
[devdep-image]: http://img.shields.io/david/dev/uxcore/uxcore-cascade-multi-select.svg?style=flat-square
[devdep-url]: https://david-dm.org/uxcore/uxcore-cascade-multi-select#info=devDependencies
[downloads-image]: https://img.shields.io/npm/dm/uxcore-cascade-multi-select.svg
[sauce-image]: https://saucelabs.com/browser-matrix/uxcore-cascade-multi-select.svg
[sauce-url]: https://saucelabs.com/u/uxcore-cascade-multi-select


### Development

```sh
git clone https://github.com/uxcore/uxcore-cascade-multi-select
cd uxcore-cascade-multi-select
npm install
npm run server
```

if you'd like to save your install time，you can use uxcore-tools globally.

```sh
npm install uxcore-tools -g
git clone https://github.com/uxcore/uxcore-cascade-multi-select
cd uxcore-cascade-multi-select
npm install
npm run dep
npm run start
```

### Test Case

```sh
npm run test
```

### Coverage

```sh
npm run coverage
```

## Demo

http://uxcore.github.io/components/cascade-multi-select

## Contribute

Yes please! See the [CONTRIBUTING](https://github.com/uxcore/uxcore/blob/master/CONTRIBUTING.md) for details.

## CascadeMultiSelect

## API

## Props

| 选项 | 描述 | 类型 | 必填 | 默认值 |
|---|---|---|---|---|
| prefixCls | 默认的类名前缀 | String | `false`| "kuma-cascade-multi" |
| className | 自定义类名 | String | `false` | "" |
| dropdownClassName | dropdown 部分的定制类名 | String | `false` | "" |
| config | 每一级的特殊配置项，可参考[下方案例](#props.config) | Array | `false` | [] |
| options | 横向级联的数据，可参考[下方案例](#props.options) | Array | `true` | [] |
| value | 可由外部控制的值，可参考[下方案例](#props.value) | Array | `false` | [] |
| defaultValue | 初始默认的值，格式同 value | Array | `false` | [] |
| cascadeSize | 级联层级数 | number | `false` | 3 |
| placeholder | placeholder | string | `false` | 'Please Select' 或 '请选择' |
| notFoundContent | 没有子项级联数据时显示内容 | String | `false` | 'No Data' 或 '没有数据' |
| allowClear | 是否允许清空 | bool | `false` | true |
| disabled | 禁用模式，只能看到被禁掉的输入框 | bool | `false` | false |
| readOnly | 只读模式，只能看到纯文本 | bool | `false` | false |
| locale | 'zh-cn' or 'en-us' | String | `false` | 'zh-cn' |
| onSelect | 选中选项的回调函数 | function | `false` | (valueList, labelList, leafList, cascadeSelected) => {} |
| onItemClick | 点击选项事件，返回选项信息 | function | `false` | (item) => {} |
| onOk | 点击确认按钮回调函数 | function | `false` | (valueList, labelList, leafList, cascadeSelected) => {} |
| onCancel | 取消选择时回调函数，通常不点确定，直接隐藏下拉框也会触发这个函数 | function | `false` | () => {} |
| beforeRender | 处理在input中预显示的内容，具体用法参考下方的案例 | function | `false` | (value, options) => {} |
| keyCouldDuplicated | 是否允许除了第一级和最后一级以外的 id 重复 | bool | `false` | false |
| isCleanDisabledLabel | 已禁用选项是否可被清除 | bool | `false` | false

### props.config

** 示例 **
```javascript
const config = [{
  checkable: false,
  showSearch: true, // 显示过滤项，默认为 false
}, {
  checkable: false, // 设置第二级不可选
}, {
  checkable: false,
}]
```
config 为一个数组，每一项的配置如下：

* checkable: (boolean) 该级是否可选，默认为 true
* showSearch: (boolean) 该级是否展示过滤搜索框，默认为 false

### props.options

| 选项 | 描述 | 类型 | 必填 | 默认值 |
|---|---|---|---|---|
| value | 选项的值 | String | `true`| "" |
| label | 选项的名称 | String | `true` | "" |
| children | 选项的子项集 | Array | `false` | [] |
| disabled | 是否禁止选中 | boolean | `false` | undefined | 

** 示例 **
```javascript
const options = [{
  value: 'zhejiang',
  label: '浙江',
  children: [{
    value: 'hangzhou',
    label: '杭州',
    children: [{
      value: 'xihu',
      label: '西湖',
      disabled: true,
    }],
  }],
}, {
  value: 'jiangsu',
  label: '江苏',
  children: [{
    value: 'nanjing',
    label: '南京',
    children: [{
      value: 'zhonghuamen',
      label: '中华门',
    }],
  }],
}];
```

### props.value

props.value 传递的是 **key 构成的数组**，这里的 key 可以是任意级别，除非当 prop `keyCouldDuplicated` 为 true 时，必须传 **叶子节点的 key 数组**。

```javascript
const value = ['xihu', 'bingjiang'];
```

** 示例 **
```javascript
<CascadeMultiSelect
  options={options}
  value={['xihu', 'nanjing']}
/>
```

### props.beforeRender

```javascript
props.beforeRender = (value, options) => { return '渲染你自己想要的字符串'; }
```

beforeRender 返回一个字符串，用来渲染进展开面板触发器的 input 内容。beforeRender 有两个参数，第一个 value 就是当前所有选中的 value 值数组，比较重要的是 options，options 对应的就是 props.options，并且带有每一个选项的选中状态。比如，对于 `[{ label: 'label1', children: [{ label: 'label1-1' }] }]`，当用户选中了 label1 时，options 的结构为：

```javascript
[{ label: 'label1', checked: true, children: [{ label: 'label1-1', checked: true }] }]
```

你在业务中通过获取 `checked` 的值，就可以知道用户选中了哪些选项，此外，当用户未全选某一级时，还会有 `halfChecked` 属性。

### props.onSelect

```javascript
(valueList, labelList, leafList, cascadeList) => {
  valueList: 选中选项的value列表
  labelList: 选中选项的label列表
  leafList: 选中所有子项的{value, label}列表
  cascadeList: 所有级联结构，如果 item 被选中，则会有一个属性 `checked: true`
}
```
> 注：如果选项的子集全部选中，则返回该选项值

## CascadeMultiPanel

## API

## Props

| 选项 | 描述 | 类型 | 必填 | 默认值 |
|---|---|---|---|---|
| className | 自定义类名 | String | `false` | "" |
| prefixCls | 默认的类名前缀 | String | `false`| "kuma-cascade-multi" |
| config | 配置项 | Array | `false` | [] |
| options | 横向级联的数据 | Array | `true` | [] |
| value | 可由外部控制的值 | Array | `false` | [] |
| cascadeSize | 级联层级数 | number | `false` | 3 |
| notFoundContent | 没有子项级联数据时显示内容 | String | `false` | 'No Data' 或 '没有数据' |
| allowClear | 是否允许清空 | bool | `false` | true |
| locale | 'zh-cn' or 'en-us' | String | `false` | 'zh-cn' |
| onSelect | 选中选项的回调函数 | function | `false` | (valueList, labelList, leafList) => {} |
| onItemClick | 点击选项事件，返回选项信息 | function | `false` | (item) => {} |
| keyCouldDuplicated | 是否允许除了第一级和最后一级以外的 id 重复 | bool | `false` | false |

## CascadeMultiModal

## API

## Props

| 选项 | 描述 | 类型 | 必填 | 默认值 |
|---|---|---|---|---|
| prefixCls | 默认的类名前缀 | String | `false`| "kuma-cascade-multi" |
| className | 自定义类名 | String | `false` | "" |
| config | 配置项 | Array | `false` | [] |
| options | 横向级联的数据 | Array | `true` | [] |
| value | 可由外部控制的值 | Array | `false` | [] |
| cascadeSize | 级联层级数 | number | `false` | 3 |
| notFoundContent | 没有子项级联数据时显示内容 | String | `false` | 'No Data' 或 '没有数据' |
| allowClear | 是否允许清空 | bool | `false` | true |
| locale | 'zh-cn' or 'en-us' | String | `false` | 'zh-cn' |
| onSelect | 选中选项的回调函数 | function | `false` | (valueList, labelList, leafList) => {} |
| onItemClick | 点击选项事件，返回选项信息 | function | `false` | (item, level) => {} |
| title | 标题 | String | `false` | '级联选择' |
| width | dialog 宽度 | Number | `false` | 672 |
| onOk | 成功按钮回调函数 | Function | `false` | (valueList, labelList, leafList) => {} |
| onCancel | 取消的回调函数 | Function | `false` | () => {} |

props 复用 uxcore-cascade-multi-select 的 props.

继承了部分Dialog的props,

### onOk

```javascript
(valueList, labelList, leafList, cascadeList) => {
  valueList: 选中选项的value列表
  labelList: 选中选项的label列表
  leafList: 选中所有子项的{value, label}列表
  cascadeList: 所有级联结构，如果 item 被选中，则会有一个属性 `checked: true`
}
```

## 使用方法

```javascript
import CascadeMultiSelect from 'uxcore-cascade-multi-select';

const {
  CascadeMultiPanel,
  CascadeMultiModal,
} = CascadeMultiSelect;

render() {
  return () {
    <div>
      <CascadeMultiPanel />
      <CascadeMultiSelect />
      <CascadeMultiModal />
    </div>
  }
}
```
