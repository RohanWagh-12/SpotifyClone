document.addEventListener("DOMContentLoaded", (event) => {

// console.log("Javascript is Here")
let currentSong ;
let songs;
let checkSong
let currentFolder
let currentSongTime , currentSongDuration
let seekBarFolderName = "Attack on Titan"

const container = document.querySelector('.seekBarNameandFolderName');
const scrollText = document.querySelector('.seekBarSongName');
let scrollTextWidth = scrollText.offsetWidth
// Function to check if text overflows
function checkOverflow() {
  if (scrollText.offsetWidth > container.offsetWidth) {
    // Apply animation only if text overflows
    scrollText.style.animation = 'none';
    // Trigger a reflow/repaint so the browser re-applies the animation
    void scrollText.offsetWidth;
    // Apply the animation again
    scrollText.style.cssText = 'animation:marquee 10s linear 2s;animation-iteration-count:1;';
  } else {
    // Remove animation if no overflow
    scrollText.style.animation = 'none';
  }
}

// Check overflow on page load and window resize
// window.addEventListener('load', checkOverflow);
window.addEventListener('resize', checkOverflow);

container.addEventListener("click",checkOverflow)



function SecondsToMinutes(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if(seconds<10){
    return `${minutes}:0${seconds}`
  }
  else {
    return `${minutes}:${seconds}`
  }
}

function playNextSong(){
  currentSong.pause()
    let currentIndex = songs.indexOf(currentSong.src)
    if(currentIndex < songs.length-1){
    let PlayNextSong = songs[currentIndex+1].split("/").pop()    
    playMusic(`${currentFolder}/${PlayNextSong}`)
    console.log(songs[currentIndex+1])
    applyWhiteBorder(songs[currentIndex+1])
    pastMusic = (songs[currentIndex+1]).split("/")[(songs[currentIndex+1]).split("/").length - 1].replaceAll("%20"," ")

    
    }
    else{
      let PlayNextSong = songs[0].split("/").pop()    
      playMusic(`${currentFolder}/${PlayNextSong}`)
      applyWhiteBorder(songs[0])
      pastMusic = (songs[0]).split("/")[(songs[0]).split("/").length - 1].replaceAll("%20"," ")

    }
}

function applyWhiteBorder(toThisSongBox) {
   
  let indexOfSong = songs.indexOf(toThisSongBox)
  // console.log(indexOfSong)
  Array.from(document.querySelectorAll(".songBox"))[indexOfSong].classList.add("redBorder")

}

async function getSongs(folder){

    let data =await fetch(`./songs/${folder}/`)

    let response = await data.text()

    currentFolder = folder
    let div = document.createElement('div')
    div.innerHTML=response
    let as = div.getElementsByTagName('a')
    let songsList =[]
    Array.from(as).forEach((e)=>{
        if(e.href.endsWith(".mp3")){
            songsList.push(e.href)
        }
       
    }) 
    let UL = document.getElementsByClassName("songsList")[0]
    UL.innerHTML=`<div class="boxLine"></div>`
    songs = songsList
    for (let index = 0; index < songsList.length; index++) {
      const name = songsList[index];
      
    
        UL.innerHTML+=`<li class="songBox flex border">
                <div class="musicIcon flex">
                  <img width="32" src="./songs/${folder}/cover.jpg" alt="" />
                </div>
                <div class="musicName">${name.split("/")[name.split("/").length-1].replaceAll("%20"," ")}</div>
                <div class="songPlayCircle"> 
                  <div class="playCircle flex">
                    <img class="playBtn normal" width="13" src="images/play.svg" alt="">
                  </div>
                </div>
              </li>
              <div class="boxLine"></div>`
       
       if(index == songsList.length-1){
        document.querySelectorAll(".songBox")[index].style.cssText="margin-bottom:5cm;"
       }       
              
             
    }

    // document.querySelector(".ranger").value = 100;
   
  

    
    let playingSong ;
    let pastMusic;
    //start here tomorrow
    //Attach EventLisner to each SongBox
    Array.from(document.getElementsByClassName("songBox")).forEach(e =>{
      
      
      e.addEventListener("click",()=>{

        if(e.querySelector(".musicName").innerHTML==pastMusic){
          currentSong.pause()
          pastMusic=null
          // e.querySelector(".playBtn").src="images/play.svg"
          e.classList.remove("redBorder")
          document.querySelector(".mainPlayBtn").src="images/play.svg"
          
        }
       else{
        // console.log(e.querySelector(".musicName").innerHTML)
        playMusic(`${currentFolder}/${e.querySelector(".musicName").innerHTML}`)

        
        //start here 17 jan
         e.classList.add("redBorder")
        //  console.log("border added")
        // e.querySelector(".playBtn").src="images/pause.svg"
        document.querySelector(".mainPlayBtn").src="images/pause.svg"
        pastMusic=e.querySelector(".musicName").innerHTML
        // console.log(pastMusic)
       }
      })
    }) 
}

const playMusic = (songname)=>{
  
  Array.from(document.querySelectorAll(".songBox")).forEach((e)=>{
    e.classList.remove("redBorder")
  })
  
  // let audio = new Audio(songname)
  currentSong.src = `./songs/${songname}`
  currentSong.play()
  document.querySelector(".mainPlayBtn").src ="images/pause.svg"
  document.querySelector(".seekBarSongName").innerHTML=decodeURI(songname.split("/")[songname.split("/").length-1])
  document.querySelector(".seekBar").style.display="flex"
  document.querySelector(".seekBarFolderName").innerHTML =seekBarFolderName
  document.querySelector(".seekBarImage>img").src = `./songs/${currentFolder}/cover.jpg`
  checkOverflow()
}

async function displayAlbums() {
  
  let data =await fetch(`./songs/`)
  let response = await data.text()
  let div = document.createElement('div')
  div.innerHTML=response

  let anchors = Array.from(div.getElementsByTagName("a"))
  // displaying details of each folder
  let folderNumber = 0;
 for(let i=0;i<anchors.length;i++){
    let e=anchors[i]
    if(e.href.includes("songs/")){
      console.log(e.href.split("/").slice(-1)[0])
      let folderName = e.href.split("/").slice(-1)[0] //getting the foldername 
      let data =await fetch(`./songs/${folderName}/info.json`)
      let response = await data.json()
      console.log(response)

      document.querySelector(".cardContainer").innerHTML+=`<div data-folder="${folderName}" class="card1 flex radius">
                <div class="image radius">
                  <div class="greenPlayCircle flex justify align">
                    <img class="playBtn invert"  width="15" src="images/play.svg" alt="">
                  </div>
                </div>
                <div class="title">${response.title}</div>
                <div class="description">${response.description}</div>
              </div>`
                  
                     
              //start here image is remaininig to fetch from cover.jpg
              //4:30
      document.querySelectorAll(".image")[folderNumber].style.cssText=`background-image: url("./songs/${folderName}/cover.jpg");
      background-repeat : no-repeat;
      background-size:cover;`




      folderNumber++;

    }
  }


}

async function main() {
   currentSong = new Audio()
   await displayAlbums()
   await getSongs('aot')
 
    // console.log(songs)

    // let audio = new Audio(songs[0])
    // audio.play() 
   

    //Attach event listner to play , next , previous
    document.querySelector(".mainPlayCircle").addEventListener("click",()=>{

      if(currentSong.paused){
        currentSong.play()
        //changed pastMusic here also because it will restart the song otherwise when we stop the song by click on songBox and play it by clicking on play button and then click on songBox for stopping it
        pastMusic=document.querySelector(".seekBarSongName").innerHTML
        document.querySelector(".mainPlayBtn").src="images/pause.svg"
        console.log("current "+currentSong.src)
        applyWhiteBorder(currentSong.src)
      }
      else{
        currentSong.pause()
        document.querySelector(".mainPlayBtn").src="images/play.svg"
      }
    })

    currentSong.addEventListener("timeupdate",()=>{
      // console.log(currentSong.currentTime, currentSong.duration)
      if (!isNaN(currentSong.duration)) {
      currentSongTime=SecondsToMinutes(currentSong.currentTime)
      currentSongDuration= SecondsToMinutes(currentSong.duration)
      document.querySelector(".startTime").innerHTML = currentSongTime
      document.querySelector(".endTime").innerHTML =currentSongDuration

      if(currentSongTime==currentSongDuration){
        playNextSong()
      }
      //2:43
      document.querySelector(".greenBar").style.width = `${(currentSong.currentTime/currentSong.duration)*100}%`
      document.querySelector(".sliderCircle").style.left = `${(currentSong.currentTime/currentSong.duration)*100}%`
    }})

    document.querySelector(".playBar").addEventListener("click",(e)=>{
      // console.log(e.offsetX)
      // console.log(e.target.getBoundingClientRect())

      // document.querySelector(".greenBar").style.width = `${(e.offsetX/e.target.getBoundingClientRect().width)*100}%`
      // document.querySelector(".sliderCircle").style.left = `${(e.offsetX/e.target.getBoundingClientRect().width)*100}%`
     
      const playBar = e.currentTarget;
      const rect = playBar.getBoundingClientRect(); // Get playBar's bounding rectangle
      const clickPosition = e.clientX - rect.left; // Calculate click position relative to playBar
    
      // Calculate percentage
      const percentage = (clickPosition / rect.width) * 100;
    
      // Update greenBar and sliderCircle positions
      document.querySelector(".greenBar").style.width = `${percentage}%`;
      document.querySelector(".sliderCircle").style.left = `${percentage}%`;
      currentSong.currentTime = currentSong.duration * percentage /100

    })

   document.querySelector(".previousBtn").addEventListener("click",() => {
     
      currentSong.pause()
      let currentIndex = songs.indexOf(currentSong.src)
      if(currentIndex==0){
      let PlayPreviousSong = songs[songs.length - 1].split("/").pop()
      playMusic(`${currentFolder}/${PlayPreviousSong}`)
      applyWhiteBorder(songs[songs.length - 1])
      pastMusic = (songs[songs.length - 1]).split("/")[(songs[songs.length - 1]).split("/").length - 1].replaceAll("%20"," ")
      console.log(pastMusic)
      }
      else{
        let PlayPreviousSong = songs[currentIndex-1].split("/").pop()
        playMusic(`${currentFolder}/${PlayPreviousSong}`)
        applyWhiteBorder(songs[currentIndex-1])
        pastMusic = (songs[currentIndex-1]).split("/")[(songs[currentIndex-1]).split("/").length - 1].replaceAll("%20"," ")
 
      }


   }
   )


   document.querySelector(".nextBtn").addEventListener("click",() => {
     
    playNextSong()

}
)

   document.querySelector(".volumeRange").addEventListener("change",(e) => {
     
    console.log(typeof(e.target.value),e.target.value) //by default it is string
    currentSong.volume = parseInt(e.target.value)/100
    console.log(parseInt(e.target.value)/100)
    if(currentSong.volume==0){
      document.querySelector(".volume img").src="images/mute.svg"
    }
    else{
      document.querySelector(".volume img").src="images/volume.svg"
    }
    
   }
   )

   Array.from(document.querySelectorAll(".card1")).forEach((e) => {
     
      e.addEventListener("click",async (item) => {
        
        //currentTarget = card1 because we only added eventListner to it, and if we click on image/title/desc
        //it will not cause any problem thats why currentTarget is used instead of Target
        // console.log(item.currentTarget.dataset.folder)
        seekBarFolderName=item.currentTarget.getElementsByClassName("title")[0].innerHTML
        // console.log("This is item ",seekBarFolderName)
        await getSongs(`${item.currentTarget.dataset.folder}`)
        document.querySelector(".leftSection").style.cssText=` transform: translateX(0);
    /* transition: ease-in-out; */
 transition-duration: .5s;`
   
      }
      )

   }
   )

   let Muted = false;
   document.querySelector(".volume img").addEventListener("click",(e) => {
     if(Muted){
      e.currentTarget.src = "images/volume.svg"
      Muted=false
      currentSong.volume = 20/100
      document.querySelector(".volumeRange").value = 20
 
    }
     else{
       e.currentTarget.src = "images/mute.svg"
       Muted=true
       currentSong.volume = 0;
       document.querySelector(".volumeRange").value = 0
     }
   }
   )

   document.querySelector(".hamburger").addEventListener("click",(e) => {
     document.querySelector(".leftSection").style.cssText=` transform: translateX(0);
        /* transition: ease-in-out; */
     transition-duration: .5s;`
   }
   )

   document.querySelector(".getBackLeftSection").addEventListener("click",() => {
    document.querySelector(".leftSection").style.cssText=` transform: translateX(-110%);
    /* transition: ease-in-out; */
 transition-duration: .5s;`
   }
  )
  let string;

  window.addEventListener("resize",(e) => {
    if(window.innerWidth>900){
      document.querySelector(".leftSection").style.cssText=` transform: translateX(0);
      /* transition: ease-in-out; */
   transition-duration: .5s;`
    }
    else{
      document.querySelector(".leftSection").style.cssText=` transform: translateX(-110%);
      /* transition: ease-in-out; */
   transition-duration: .5s;`
    }
  }
  )
  if(window.innerWidth<350){
    string = "padding-bottom: 5rem;"
  }else{
   string =""
  }
  let seekBarHidden = false
  
  document.querySelector(".goBackSeekBar").addEventListener("click",() => {
    if(seekBarHidden){
       document.querySelector(".seekBar").style.cssText=`display:flex;transform:translateY(0);transition-duration: .5s;z-index:100;`
       seekBarHidden=false
      } 
    else{
    document.querySelector(".seekBar").style.cssText=`display:flex;${string}transform:translateY(58%);transition-duration: .5s;z-index:100;`

    console.log("Changed SeekBar")
    seekBarHidden=true
    }
  }
  )

  

}
main()
});
