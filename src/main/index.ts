import type { BrowserWindowConstructorOptions } from 'electron';
import type { Customize } from '@youliso/electronic/types';
import {
  machineOn,
  appAfterOn,
  appSingleInstanceLock,
  appProtocolRegister,
  storeInstance,
  shortcutInstance,
  windowInstance
} from '@youliso/electronic/main';
import { Update } from '@youliso/electronic/main/update';
import { readFileSync } from 'fs';
import { join } from 'path';
import { app, Menu, nativeImage, Tray } from 'electron';
import updateCfg from '@/cfg/update.json';
import logo from '@/assets/icon/logo.png';
import { resourcesOn } from './modular/resources';

// 初始渲染进程参数
let customize: Customize = {
  title: 'electron-template',
  route: '/home'
};

// 初始窗口参数
let browserWindowOptions: BrowserWindowConstructorOptions = {
  width: 800,
  height: 600,
  frame: true,
  show: false,
  webPreferences: {
    devTools: true
  }
};

// 设置窗口管理默认参数
if (!app.isPackaged) {
  // 调试模式
  if (browserWindowOptions.webPreferences) {
    browserWindowOptions.webPreferences.devTools = true;
  } else {
    browserWindowOptions.webPreferences = {
      devTools: true
    };
  }
  try {
    windowInstance.setDefaultCfg({
      defaultLoadType: 'url',
      defaultUrl: `http://localhost:${readFileSync(join('.port'), 'utf8')}`,
      defaultPreload: join(__dirname, './preload.js')
    });
  } catch (e) {
    throw 'not found .port';
  }
} else {
  windowInstance.setDefaultCfg({
    defaultLoadType: 'file',
    defaultUrl: join(__dirname, './index.html'),
    defaultPreload: join(__dirname, './preload.js')
  });
}

// 单例
appSingleInstanceLock({
  additionalData: { type: 'new' },
  isFocusMainWin: true,
  customize,
  browserWindowOptions
});

// 注册协议
appProtocolRegister();

// 关闭所有窗口退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.whenReady().then(async () => {
  app.on('activate', () => {
    if (windowInstance.getAll().length === 0) {
      const win = windowInstance.create(customize, browserWindowOptions);
      win && windowInstance.load(win);
    }
  });
  // 应用基础监听
  appAfterOn();

  // 模块监听
  machineOn();
  resourcesOn();
  storeInstance.on();
  windowInstance.on();
  shortcutInstance.on();

  // 创建托盘
  const tray = new Tray(nativeImage.createFromPath(logo as string));
  tray.setToolTip(app.getName());
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: 'Exit',
        click: () => {
          app.quit();
        }
      }
    ])
  );
  tray.on('click', () => windowInstance.func('show'));

  // 创建更新
  const update = new Update(
    { provider: updateCfg.provider as any, url: updateCfg.url },
    'scripts/dev-update.yml',
    updateCfg.dirname
  );
  
  // 创建窗口
  windowInstance.new(customize, browserWindowOptions, { openDevTools: !app.isPackaged });
});
