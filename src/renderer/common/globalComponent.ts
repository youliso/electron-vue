import { domCreateElement } from '@/renderer/common/dom';

class GlobalComponent {
  private static instance: GlobalComponent;
  private el: HTMLElement;

  public components: { [key: string]: Component } = {};

  static getInstance() {
    if (!GlobalComponent.instance) GlobalComponent.instance = new GlobalComponent();
    return GlobalComponent.instance;
  }

  constructor() {
    this.el = domCreateElement('div', 'global components');
    document.body.appendChild(this.el);
  }

  render(key: string, component: Component) {
    for (const css of component.styles) css.use();
    component.onLoad();
    const el = domCreateElement('div', key.toLowerCase());
    const cl = component.render();
    if (Array.isArray(cl)) for (const v of cl) el.appendChild(v);
    else el.appendChild(cl);
    component.$currentName = 'global';
    component.$name = key;
    component.$el = el;
    component.onReady();
    this.components[key] = component;
    this.el.appendChild(el);
  }

  get(key?: string) {
    return key ? this.components[key] : this.components;
  }

  unRender(key?: string) {
    if (key) {
      const component = this.components[key];
      component.onUnmounted();
      for (const css of component.styles) css.unuse();
      this.el.removeChild(component.$el);
    } else {
      for (const componentKey in this.components) {
        const component = this.components[componentKey];
        component.onUnmounted();
        for (const css of component.styles) css.unuse();
        this.el.removeChild(component.$el);
      }
    }
  }
}

export default GlobalComponent.getInstance();
