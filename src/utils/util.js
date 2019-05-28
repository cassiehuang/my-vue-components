export function getPropByPath(obj, path, strict) {
  let tempObj = obj;
  path = path.replace(/:/, '.');
  path = path.replace(/\[(w+)\]/, '.$1');
  path = path.replace(/^\./, '');


  // strict = true,严格路径找到，否则报错
  // strict= false,只要找到不能对象
  let keyArr = path.split('.');
  let i = 0;
  for (let len = keyArr.length; i < len - 1; ++i) {
    if (!tempObj && !strict) break;

    let key = keyArr[i];
    if (key in tempObj) {
      tempObj = tempObj[key];
    } else {
      if (strict) {
        throw new Error('place transfer a valid pop to form item!');
      }
      break;
    }
  }
  return {
    o: tempObj,
    k: keyArr[i],
    v: tempObj ? tempObj[keyArr[i]] : null
  }
}

export function noop() {};
