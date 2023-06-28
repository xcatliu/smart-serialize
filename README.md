# smart-serialize

Serialize any object, stringify, print to console, and write to clipboard

当我们想要研究某个网站，找到了 window 上的一个变量，此时想要查看它的全貌，直接使用 `JSON.stringify` 是不行的，因为它大概率包含一些循环引用，还有很多无法序列化的内容，此时可以用这个脚本过滤掉循环引用和一些无法序列化的内容。

## 使用方法

将代码 [serialize.js](./serialize.js) 直接复制到浏览器控制台中使用。

```js
serialize(window.someVariable, {
  space: 2,
  useCircularPath: true,
  removeKeyFilter: (key) => key.startsWith('_'),
});
```

## 参数

参数 | 描述 | 类型 | 默认值
--- | --- | --- | ---
`space` | 缩进空格数，`0` 则会输出为单行字符串 | `number` | `0`
`useCircularPath` | 遇到循环引用时，是否输出引用路径。选是会将循环引用转为路径字符串 `$root.foo.bar`，选否则会转为 `$circular` | `boolean` | `false`
`removeFunction` | 是否删除所有函数 | `boolean` | `false`
`removeCircular` | 是否删除循环引用 | `boolean` | `false`
`removeNull` | 是否删除 `null` | `boolean` | `false`
`removeUndefined` | 是否删除 `undefined` | `boolean` | `false`
`removeEmpty` | 是否删除空对象和空数组 | `boolean` | `false`
`removeKeyFilter` | 删除符合条件的 key | `function` | `undefined`
`removePathFilter` | 删除符合条件的 path | `function` | `undefined`
`printToConsole` | 是否打印到控制台 | `boolean` | `true`
`copyToClipboard` | 是否复制到粘贴板 | `boolean` | `true`
