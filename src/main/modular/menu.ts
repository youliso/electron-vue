import {
  BrowserWindow,
  ipcMain,
  Menu,
  nativeImage,
  MenuItem,
  MenuItemConstructorOptions
} from 'electron';
import { join } from 'path';
import ico from '@/lib/assets/icon/tray.png';
import testIcon from '@/lib/assets/icon/test.png';

export class Menus {
  constructor() {}

  /**
   * 监听
   */
  on() {
    ipcMain.on('menu-show', (event) => {
      const template: Array<MenuItemConstructorOptions | MenuItem> = [
        {
          label: 'Menu Item 1',
          icon: nativeImage.createFromPath(join(__dirname, `./${testIcon}`)),
          click: () => {
            event.sender.send('menu-back', 'menu-item-1');
          }
        },
        { label: 'Menu Item 2', type: 'checkbox', checked: true }
      ];
      const menu = Menu.buildFromTemplate(template);
      menu.popup({
        window: BrowserWindow.fromWebContents(event.sender)
      });
    });
  }
}
