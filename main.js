const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const Excel = require('exceljs')
const path = require('path');

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win
// ipcMain.on('asynchronous-message', (event, arg) => {
//     console.log(arg) // prints "ping"
//     event.reply('asynchronous-reply', 'pong')
// })


function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // 加载index.html文件
    win.loadFile('index.html')

    // 打开开发者工具
    // win.webContents.openDevTools({
    //     mode: "detach",
    // })

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })
    globalShortcut.register('f5', function () {
        console.log('f5 is pressed')
        win.reload()
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)
ipcMain.on('synchronous-message', (event, arg) => {
    readStudents()
})
// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

function readStudents() {
    // read from a file
    var workbook = new Excel.Workbook();
    workbook.xlsx.readFile('students.xlsx')
        .then(function () {
            const classList = [];
            workbook.eachSheet(function (worksheet, sheetId) {
                const students = [];
                worksheet.eachRow(function (row, rowNumber) {
                    students.push({
                        name: row.getCell(1).value
                    })
                });
                const classItem = {
                    className: worksheet.name,
                    students
                }
                classList.push(classItem);
            });
            win.webContents.send('readStudentsDone', classList)
        });
}
// readStudents()