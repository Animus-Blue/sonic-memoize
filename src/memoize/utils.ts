function getParameterCount(func) {
  var stringRepresentation = func
    .toString()
    .replace(/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm, "");
  let parameterList;
  if (stringRepresentation.startsWith("function")) {
    parameterList = stringRepresentation.match(/function\s.*?\(([^)]*)\)/)![1];
  } else {
    parameterList = stringRepresentation.match(/.*?\(([^)]*)\)/)![1];
  }
  if (/\.{3}/.test(parameterList)) {
    throw new Error("Rest parameters are not supported");
  }
  return parameterList.split(",").length;
}

export { getParameterCount };
