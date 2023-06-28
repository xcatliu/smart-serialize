/**
 * 序列化任意一个对象
 */
function serialize(obj, options = {}) {
  const {
    space,
    useCircularPath,
    removeFunction,
    removeCircular,
    removeNull,
    removeUndefined,
    removeEmpty,
    removeKeyFilter,
    removePathFilter,
    printToConsole,
    copyToClipboard,
  } = {
    space: 0,
    useCircularPath: false,
    removeFunction: false,
    removeCircular: false,
    removeNull: false,
    removeUndefined: false,
    removeEmpty: false,
    removeKeyFilter: undefined,
    removePathFilter: undefined,
    printToConsole: true,
    copyToClipboard: true,
    ...options,
  };

  /** 换成对象的路径，方便后续检查是否存在循环引用 */
  const objMap = new Map();
  /**
   * 将一个对象转换成可以安全 stringify 的对象
   */
  function safe(obj, path = "$root", key = '') {
    if (removeKeyFilter && key && removeKeyFilter(key)) {
      return "$remove";
    }
    if (removePathFilter && removePathFilter(path)) {
      return "$remove";
    }

    if (obj === null) {
      if (removeNull) {
        return "$remove";
      }
      return null;
    }
    if (obj === undefined) {
      if (removeUndefined) {
        return "$remove";
      }
      return undefined;
    }
    if (typeof obj === "function") {
      if (removeFunction) {
        return "$remove";
      }
      return "$function";
    }
    // 产生了循环引用
    if (objMap.has(obj)) {
      if (removeCircular) {
        return "$remove";
      }
      if (useCircularPath) {
        return objMap.get(obj);
      }
      return "$circular";
    }
    // 如果是对象或数组，则缓存到 objMap 中，方便后续检查是否存在循环引用
    if (Array.isArray(obj)) {
      objMap.set(obj, path);
      let result = [];
      obj.forEach((value, index) => {
        const newValue = safe(value, `${path}[${index}]`);
        if (newValue === "$remove") {
          // should be removed
        } else {
          result.push(newValue);
        }
      });
      if (removeEmpty && result.length === 0) {
        return "$remove";
      }
      return result;
    }
    if (typeof obj === "object") {
      objMap.set(obj, path);
      let result = {};
      Object.entries(obj).forEach(([key, value]) => {
        const newValue = safe(value, `${path}.${key}`, key);
        if (newValue === "$remove") {
          // should be removed
        } else {
          result[key] = newValue;
        }
      });
      if (removeEmpty && Object.keys(result).length === 0) {
        return "$remove";
      }
      return result;
    }
    // 其他情况直接返回
    return obj;
  }

  let safeObj = safe(obj);

  let stringResult = "";
  if (space === 0) {
    stringResult = JSON.stringify(safeObj);
  } else {
    stringResult = JSON.stringify(safeObj, null, space);
  }

  if (printToConsole) {
    console.log(stringResult);
  }
  if (copyToClipboard) {
    copy(stringResult);
  }

  return stringResult;
}

function copy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}
