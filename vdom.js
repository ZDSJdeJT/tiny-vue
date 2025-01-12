import { getEventPropKey, isEventProp } from "./utils.js";

export const h = (tag, props, children) => ({
  tag,
  props,
  children,
});

export const mount = (vnode, container) => {
  const el = vnode.el = document.createElement(vnode.tag);
  // props
  if (vnode.props) {
    for (const key in vnode.props) {
      const value = vnode.props[key];
      if (isEventProp(key)) {
        el.addEventListener(getEventPropKey(key), value);
      } else {
        el.setAttribute(key, value);
      }
    }
  }
  // children
  if (vnode.children) {
    if (typeof vnode.children === "string") {
      el.textContent = vnode.children;
    } else {
      vnode.children.forEach((child) => {
        mount(child, el);
      });
    }
  }
  container.appendChild(el);
};

export const patch = (n1, n2) => {
  if (n1.tag === n2.tag) {
    const el = n2.el = n1.el;
    // props
    const oldProps = n1.props ?? Object.create(null);
    const newProps = n2.props ?? Object.create(null);
    for (const key in newProps) {
      const oldValue = oldProps[key];
      const newValue = newProps[key];
      if (newValue !== oldValue) {
        if (isEventProp(key)) {
          const eventPropKey = getEventPropKey(key);
          if (oldValue) {
            el.removeEventListener(eventPropKey, oldValue);
          }
          el.addEventListener(eventPropKey, newValue);
        } else {
          el.setAttribute(key, newValue);
        }
      }
    }
    for (const key in oldProps) {
      if (!(Reflect.has(newProps, key))) {
        if (isEventProp(key)) {
          el.removeEventListener(getEventPropKey(key), oldProps[key]);
        } else {
          el.removeAttribute(key);
        }
      }
    }
    // children
    const oldChildren = n1.children;
    const newChildren = n2.children;
    if (typeof newChildren === "string") {
      if (typeof oldChildren === "string") {
        if (newChildren !== oldChildren) {
          el.textContent = newChildren;
        }
      } else {
        el.textContent = newChildren;
      }
    } else {
      if (typeof oldChildren === "string") {
        el.innerHTML = "";
        newChildren.forEach((child) => {
          mount(child, el);
        });
      } else {
        const commonLength = Math.min(oldChildren.length, newChildren.length);
        for (let i = 0; i < commonLength; i++) {
          patch(oldChildren[i], newChildren[i]);
        }
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach((child) => {
            mount(child, el);
          });
        } else if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildren.length).forEach((child) => {
            el.removeChild(child.el);
          });
        }
      }
    }
  } else {
    // replace
    const oldParentNode = n1.el.parentNode;
    oldParentNode.removeChild(n1.el);
    mount(n2, oldParentNode);
  }
};
