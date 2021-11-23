import { View } from '@//renderer/common/dom';
import indexCss from './scss/index.lazy.scss';
import { init } from './demo';

export default class Music extends View {
  styles = [indexCss];
  onLoad(params?: any) {}

  onActivated() {}

  onDeactivated() {}

  onReady() {}

  onUnmounted() {}

  render() {
    return init();
  }
}
