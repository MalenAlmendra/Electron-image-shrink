const {app, BrowserWindow, Menu, globalShortcut}=require('electron')

//set enviroment
process.env.NODE_ENV='development'

const isDev=process.env.NODE_ENV!=='production'?true:false
const isMac=process.platform==='darwin'?true:false

let win

const createMainWindow=()=>{
    win=new BrowserWindow({
        title:'ImageShrink',
        width:500,
        height:600,
        webPreferences:{
            worldSafeExecuteJavaScript:true,
            nodeIntegration:true
        },
        icon:'./assets/icons/photo.ico',
        resizable: isDev ? true : false
    })

    win.loadFile('./app/index.html')
}

app.on('window-all-closed',()=>{
    if(!isMac){
        app.quit()
    }
})

app.on('activate', ()=>{
    if(BrowserWindow.getAllWindows().length===0){
        createMainWindow()
    }
})

app.on('ready',()=>{
    createMainWindow()

    //create a menu template
    const mainMenu=Menu.buildFromTemplate(menu)
    Menu.setApplicationMenu(mainMenu)

    globalShortcut.register('CmdOrCtrl+R', ()=>win.reload())
    globalShortcut.register(isMac?'Command+Alt+I':'Ctrl+Shift+I', ()=>win.toggleDevTools())


    win.on('ready',()=>{
        win=null
    })
    
})

const menu=[
    ...(isMac?[{role:'appMenu'}]:[]),
    {
        label:'File',
        submenu:[
            {
                label:'Quit',
                
                accelerator:'CmdOrCtrl+W',
                click:()=>app.quit()
                
            }
        ]
    }
]