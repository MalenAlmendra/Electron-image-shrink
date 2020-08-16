const {app, BrowserWindow, Menu, ipcMain,shell}=require('electron')

const path=require('path')
const os=require('os')
const imagemin=require('imagemin')
const imageminMozjpeg=require('imagemin-mozjpeg')
const imageminPngquant=require('imagemin-pngquant')
const slash=require('slash')
const log=require('electron-log')



//Set enviroment
process.env.NODE_ENV='production'

const isDev=process.env.NODE_ENV!=='production'?true:false
const isMac=process.platform==='darwin'?true:false

//Set enviroment

//WINDOWS
let win,
    aboutWin

const createMainWindow=()=>{
    win=new BrowserWindow({
        title:'ImageShrink',
        width:isDev?800:500,
        height:600,
        webPreferences:{
            worldSafeExecuteJavaScript:true,
            nodeIntegration:true
        },
        icon:__dirname+'/assets/icons/icon.ico',
        resizable: isDev ? true : false
    })
    if(isDev){
        win.webContents.openDevTools()
    }

    win.loadFile('app/index.html')
}
const createAboutWindow=()=>{
    aboutWin=new BrowserWindow({
        title:'About ImageShrink',
        width:300,
        height:300,
        webPreferences:{
            worldSafeExecuteJavaScript:true,
            nodeIntegration:true
        },
        icon:__dirname+'/assets/icons/icon.ico',
        resizable:false
    })

    

    aboutWin.loadFile('app/about.html')
}
//WINDOWS

ipcMain.on('image:minimize',(e, opt)=>{
    opt.dest=path.join(os.homedir(),'imageshrink')
    shrinkImage(opt)

})

const shrinkImage=async({imgPath, quality, dest})=>{
    try{
        const pngQuality=quality/100;
        const files=await imagemin([slash(imgPath)],{
            destination:dest,
            plugins:[
                imageminMozjpeg({quality}),
                imageminPngquant({quality:[pngQuality,pngQuality]})
            ]
        })
        log.info(files)
        shell.openPath(dest)

        win.webContents.send('image:done',)
    }catch(err){
        log.error(err)
    }
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

    win.on('ready',()=>{
        win=null
    })
    
})

const menu=[
    ...(isMac?[{
        label:app.name,
        submenu:[
            {
                label:'About',
                click:createAboutWindow
            }
        ]
    }]:[{
        label:'About',
        submenu:[
            {
                label:'About',
                click:createAboutWindow
            }
        ]
    }]),
    {
        role:'fileMenu'
    },
    ...(isDev?[
        {
            label:'Developer',
            submenu:[
                {role:'reload'},
                {role:'forcereload'},
                {type:'separator'},
                {role:'toggledevtools'},
            ]
        }
    ]:[])
]