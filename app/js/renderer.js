const {ipcRenderer}=require('electron')
const path=require('path')
const os=require('os')
const form=document.getElementById('image-form')
const slider=document.getElementById('slider')
const img=document.getElementById('img')
const {toast}=require('materialize-css')


document.getElementById('output-path').innerText=path.join(os.homedir(),'imageshrink')


//Onsubmit
form.addEventListener('submit',(e)=>{
    e.preventDefault()
    const imgPath=img.files[0].path
    const quality=slider.value

    // console.log(imgPath,quality)
    ipcRenderer.send('image:minimize',{imgPath, quality})
})

//On done

ipcRenderer.on('image:done',()=>{
    toast({
        html:`Image resized to ${slider.value}% quality.`
    })
})