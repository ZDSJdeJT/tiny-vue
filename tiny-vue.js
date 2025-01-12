import { h, mount, patch } from "./vdom.js";
import { reactive } from "./reactivity.js";
import { watchEffect } from "./deps.js";

export { h, reactive, watchEffect };

export const mountApp = (cmp, container) => {
  let isMounted = false;
  let prevVdom;
  watchEffect(() => {
    if (isMounted) {
      const newVdom = cmp.render();
      patch(prevVdom, newVdom);
      prevVdom = newVdom;
      return;
    }
    prevVdom = cmp.render();
    mount(prevVdom, container);
    isMounted = true;
  });
};
