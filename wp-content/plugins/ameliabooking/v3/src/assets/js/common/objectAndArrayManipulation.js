function usePopulateMultiDimensionalObject (needle, haystack, customFunction) {
  let stack = []
  function loop(haystack, stack) {
    for (let [location, v] of Object.entries(haystack)) {
      stack.push(location);
      if (location === needle) {
        customFunction(v)
        break;
      } else if (typeof v === 'object') {
        loop(v, stack);
      }
    }
  }
  loop(haystack, stack);
}

function useOverrideValuesOfOneObjectWithAnother (needle, haystack, target, customFunction) {
  let stack = []
  function loop(stack, haystack, target) {
    for (let [location, v] of Object.entries(haystack)) {
      stack.push(location);
      if (location === needle) {
        customFunction(haystack, target)
        break;
      } else if (typeof v === 'object' && v !== null) {
        loop(stack, v, target[location]);
      }
    }
  }
  loop(stack, haystack, target);
}

export { usePopulateMultiDimensionalObject , useOverrideValuesOfOneObjectWithAnother}