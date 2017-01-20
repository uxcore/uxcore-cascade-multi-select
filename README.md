## uxcore-cascade-multi-select

React cascade multi select

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

## API

## Props

| 选项 | 描述 | 类型 | 必填  | 默认值 |
|---|---|---|---|---|
| className | 自定义类名 | String | `false` | ""
| prefixCls | 默认的类名前缀 | String | `false`| "uxcore-multi-cascade-select"
| config/options | 每一列的配置项/横向级联的数据 | Array | `true` | []，如不指定config,则必须指定options
| value | 可由外部控制的值 | Array | `false` | null
| defaultValue | 初始默认的值 | Array | `false` | []
| placeholder | 占位符 | String | `false` | 'Please Select' or '请选择'
| allowClear | 是否允许清空 | bool | `false` | true
| multiple | 是否启用多选 | bool | `false` | true
| disabled | 是否禁用 | bool | `false` | false
| readOnly | 只读模式 | bool | `false` | false
| onSelect | 选中选项的回调函数 | function | `false` | 注释 (1) |
| beforeSearch | 请求接口前的参数兼容函数 | function | `false` | 注释 (2) |
| afterSearch | 获取接口后的数据兼容函数 | function | `false` | 注释 (3) |
| locale | zh-cn or en-us | String | `false` | 'zh-cn'

### Props.config

| 选项 | 描述 | 类型 | 必填  | 默认值 |
|---|---|---|---|---|
| width | 指定当前列的宽度 | number | `false` | 200
| url | 请求数据的接口地址 | String | `true` | ''
| checkAble | 当前列是否可选择 | bool | `false` | false
| beforeSearch | 请求接口前的参数兼容函数 | function | `false` | 注释 (2)，如果每一列的beforeSearch函数都一样，可以定义在Props下的beforeSearch中 |
| afterSearch | 获取接口后的数据兼容函数 | function | `false` | 注释 (3)，同上 |

```javascript
const config = [{
  width: 200,
  url: '/mock/query/firstLevel.json',
  checkAble: false,
  beforeSearch: (url, level, key) => {
    return url + '?key=' + key;
  },
  afterSearch: (response, level) => {
    const arr = [];
    response.forEach(item => {
      arr.push({
        value: item.key,
        label: item.name
      });
    });
    return arr;
  }
}]
```

### Props.options

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

### 注释

#### confirm (1)

```javascript
/*
 * keyArray 已选择的最底层key数组
 * textArray 已选择的最底层text数组
 * cascadeSelectedData 完整的数据结构数据
 */
(keyArray, textArray, cascadeSelectedData) => {}
```

#### beforeSearch (2)

```javascript
(url, level, key) => url + '?key=' + key;
```

#### afterSearch (3)

```javascript
(response, level) => {
  return [{
    value: 'KEY',
    label: 'VALUE'
  }]
}
```
