let activeEffect;

export class Dep {
  subscribers = new Set();

  depend() {
    if (activeEffect) {
      this.subscribers.add(activeEffect);
    }
  }

  notify() {
    this.subscribers.forEach((effect) => {
      effect();
    });
  }
}

export const watchEffect = (effect) => {
  activeEffect = effect;
  effect();
  activeEffect = null;
};
