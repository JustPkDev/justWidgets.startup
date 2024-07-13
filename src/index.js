const { app, BrowserWindow, ipcMain, Menu, Tray } = require('electron');
const AutoLaunch = require('auto-launch');
const path = require('node:path');
const fs = require('fs');

//
if (require('electron-squirrel-startup')) {
  app.quit();
}

// main icon
const icon = path.join(__dirname, '/assets/just-widgets-(startup).png');

// widget window
const createWidgetWindow = (w = 200, h = 200, x = 0, y = 0, movable = true,
  resizable = false,  transparent = false, file = '') => {
  const widget = new BrowserWindow({
    x: x,
    y: y,
    width: w,
    height: h,
    movable: movable,
    resizable: resizable,
    transparent: transparent,
    frame: false,
    icon: icon,
    title: "Just Widgets (startup)",
    skipTaskbar: true,
    webPreferences: {
      devTools: false,
    }
  });
  widget.webContents.loadFile(file);

  return widget;
}

// error window
const createErrorWindow = (err = '') => {
  const error = new BrowserWindow({
    width: 400,
    height: 150,
    frame: false,
    resizable: false,
    transparent: true,
    icon: icon,
    webPreferences: {
      devTools: false,
      preload: path.join(__dirname, '/error/preload.js')
    }
  });
  error.webContents.loadFile(path.join(__dirname, '/error/error.html'));

  // sending error
  error.webContents.send('error', err);

  // closing the window
  ipcMain.on('close', (e, a) => {
    error.close();
  });

  return error;
}

// when start
app.whenReady().then(() => {

    // auto launch
    const auto = new AutoLaunch({
      name: 'Just widgets (startup)',
      path: process.execPath
    });

    auto.isEnabled().then(isE => {
      if(!isE) auto.enable();
    }).catch(e => {
      console.log(e);
    })

    // tray and menu
    const _tray = new Tray(icon);
    const _menu = Menu.buildFromTemplate([
      {'label': 'refresh', 'type': 'normal', 'click': () => {
        app.relaunch()
        app.quit();
      }},
      {'label': 'exit', 'type': 'normal', 'click': () => {
        app.quit();
        auto.disable();
      }}
    ]);

    _tray.setTitle('Just Widgets (startup)');
    _tray.setToolTip('Just Widgets (startup)');
    _tray.setContextMenu(_menu);


    // app startup
    const widgets_dir_exist = fs.existsSync('./widgets');
    if(widgets_dir_exist) {
      const widgets_file_exist = fs.existsSync('./widgets/widgets.json');
      if(widgets_file_exist) {
        fs.readFile('./widgets/widgets.json', 'utf-8', (err, data) => {
          const _arr = JSON.parse(data);
          if(typeof _arr == 'object' && _arr.length > 0 && !err) {
            _arr.forEach(v => {
              fs.readFile('./widgets' + v, 'utf-8', (er, __d) => {
                if(er) {
                  createErrorWindow('no file found widgets' + v + '.');
                } else {
                  const _widget_data = JSON.parse(__d);
                  if(fs.existsSync('./widgets' + _widget_data?.file)) {
                    createWidgetWindow(_widget_data?.width, _widget_data?.height,
                      _widget_data?.x, _widget_data?.y, _widget_data?.movable, _widget_data?.resizable,
                      _widget_data?.transparent, './widgets' + _widget_data?.file
                    )

                  } else {
                    createErrorWindow('no file found widgets' + _widget_data?.file + '.');
                  }
                }
              });
            });
          } else {
            createErrorWindow('no widgets found in widgets.json.')
          }
        });
      } else {
        createErrorWindow('widgets.json file not found in widgets directory.')
      }
    } else {
      createErrorWindow('widgets directory not found.');
    }
});

// when quit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});




