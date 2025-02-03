// const e = require("express");

let currentSong;
let playPause = document.querySelector(".playPause");
  let insideImage = playPause.querySelector("img")
async function getSongs(folder) {
  let a = await fetch(`http://127.0.0.1:5501/PROJECTS/SPOTIFY/songs/${folder}/`);
  let response = await a.text();
  //   console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1].replaceAll("%20", " "));
    }
  }
   // Update the song list in the UI
   let songUL = document.querySelector(".musicList").getElementsByTagName("ul")[0];
   songUL.innerHTML = ""; // Clear previous songs

   // Add new songs to the list
   for (const song of songs) {
     songUL.innerHTML += `<li>
       <div class="musicIcon">  <img src="/PROJECTS/SPOTIFY/musicImages/musicicon.svg" alt=""></div>
       <div class="nameSong">${song}</div>
       <div class="playNow invert"> <img src="/PROJECTS/SPOTIFY/musicImages/play.svg" alt="" /></div>
     </li>`;
   }

   // Re-add click event listeners to each song in the updated list
   Array.from(document.querySelector(".musicList").getElementsByTagName("li")).forEach((e) => {
     e.addEventListener("click", () => {
       
       playMusic(e.getElementsByTagName("div")[1].innerHTML.trim()); // Play the clicked song
       document.querySelector(".playbar").style.display="flex" 
       let isFirstClick=true  
       if(isFirstClick){
          
        
        document.querySelector(".allCardContainer").style.height="calc(70vh - 40px)"
       
          isFirstClick=false;
         }
     });
   });
  return songs;
}

function Convert(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  if(seconds<10){
    return `${minutes}:0${seconds}`
  }
  else {
    return `${minutes}:${seconds}`
  }
}

const playMusic=(name) => {
 
  if (currentSong) {
    currentSong.pause(); // Pause the currently playing song
  }

 currentSong=new Audio(`/PROJECTS/SPOTIFY/songs/${name}`)
 console.log("-----"+currentSong)
//  console.log("Duration"+currentSong.duration)
//  console.log("Current time"+currentSong.currentTime)

  currentSong.src=`/PROJECTS/SPOTIFY/songs/${name}`
  insideImage.src=`/PROJECTS/SPOTIFY/musicImages/pause.svg`
  currentSong.play()

  document.querySelector(".mySong").innerHTML= name.replace(".mp3"," ")
  document.querySelector(".Starttime").innerHTML="00:00" 

  let green=document.querySelector(".seekbargreen")
  let seekbar=document.querySelector(".seekbar")
  currentSong.addEventListener("timeupdate",()=>{
    // console.log("Current Time : "+currentSong.currentTime,"Total Duration : "+currentSong.duration)
    document.querySelector(".Starttime").innerHTML=Convert(currentSong.currentTime)
    document.querySelector(".Endtime").innerHTML=Convert(currentSong.duration)
    document.querySelector(".circle").style.left=(( (currentSong.currentTime / currentSong.duration)*100))+"%";
    let Percentage= (( (currentSong.currentTime / currentSong.duration)*100))
    green.style.width=Percentage+"%"
    // seekbar.style.width=100-Percentage+"%"
   
  })
  

}

async function displayAlbums() {
  
  let a = await fetch(`http://127.0.0.1:5501/PROJECTS/SPOTIFY/songs/`);
  let response = await a.text();
  //   console.log(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");

  Array.from(anchors).forEach(e=>{
    if(e.href.includes("/songs")){
      console.log(e.href)
    }
    

  })

}


async function main() {
  let songs = await getSongs("default");

  //displayAlbums
  displayAlbums()
  
  
  console.log(insideImage.src)
  playPause.addEventListener("click",()=>{
    if(currentSong.paused){
      currentSong.play()
      insideImage.src=`/PROJECTS/SPOTIFY/musicImages/pause.svg`
      console.log("Song is played successfully")
      document.querySelector(".playbar").style.display="flex" 
       

      
    }else{
      currentSong.pause()
      console.log("Song is paused successfully")
      insideImage.src=`/PROJECTS/SPOTIFY/musicImages/play.svg`
      document.querySelector(".playbar").style.display="flex"    }
  })

  
  // offset and getBoundingClientRect() method.
 
  document.querySelector(".seekbars").addEventListener("click",(e)=>{
     document.querySelector(".circle").style.left=((e.offsetX/e.target.getBoundingClientRect().width )*100)+"%";
    currentSong.currentTime=(currentSong.duration * (e.offsetX/e.target.getBoundingClientRect().width )*100 ) /100;
    let Percentage= (e.offsetX/e.target.getBoundingClientRect().width )*100
    green.style.width=Percentage+"%"
    // seekbar.style.width=100-Percentage+"%"
     
  })

  // add Event Listner to Hamburger

  document.querySelector(".hamburger").addEventListener("click",(e)=>{
    document.querySelector(".menubar").style.cssText=` transform:translateX(0px);
    
       /* transition: ease-in-out;*/
       transition-duration: .5s; 
      `
      document.querySelector(".mainsection").style.cssText=` transform:translateX(0px);
      /* transition: ease-in-out;*/
      transition-duration: .5s; 
     `
    //  document.querySelector(".mainsection").style.cssText="min-width:100px"
     document.querySelector(".hamburger").style.display="none"
     document.querySelector(".plus-icon").style.display="flex"

    //  if(window.innerWidth<=600){
    //  document.querySelector(".Library").style.width="420px"
    //  document.querySelector(".menubar").style.width="420px"
    //  }
     
    console.log("HAMBURGIT")
  })
  
  // add Event Listner to Plus-icon
   
  document.querySelector(".plus-icon").addEventListener("click",(e)=>{
    document.querySelector(".menubar").style.cssText=` transform:translateX(-330px);
       /* transition: ease-in-out;*/
       transition-duration: .5s; 
      `
      document.querySelector(".mainsection").style.cssText=` transform:translateX(-330px);
      /* transition: ease-in-out;*/
      transition-duration: .5s; 
      
     `
    //  document.querySelector(".all").style.cssText=`width:100vw`
     document.querySelector(".plus-icon").style.display="none"
     document.querySelector(".hamburger").style.display="flex"
     document.querySelector(".Library").style.width="320px"
     document.querySelector(".menubar").style.width="320px"
  })

  //Previous Song Button

  document.querySelector(".previous").addEventListener("click",(e)=>{
   
   console.log("333333333333333333333333333333")
     let currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "))
     

    console.log(songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "))  )
    if(currentIndex>0){
    playMusic(songs[currentIndex-1])
    }
    else{
      playMusic(songs[songs.length-1])
    }


  })

  // Next Button

  document.querySelector(".next").addEventListener("click",(e)=>{

    let currentIndex = songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "))
     

    console.log(songs.indexOf(currentSong.src.split("/").slice(-1)[0].replaceAll("%20"," "))  )
    if(currentIndex<songs.length-1){
    playMusic(songs[currentIndex+1])
    }
    else{
      playMusic(songs[0])
    }
  
  })
  //Volume button Functionality
  document.querySelector(".accent").addEventListener("change",(e)=>{

    console.log(e.target.value) // 0 to 100
    currentSong.volume = e.target.value / 100 ; // volume takes value between 0 to 1

  })

  //Adding EventListner to Card
 // Inside the click event listener for the cards
Array.from(document.getElementsByClassName("card1")).forEach((e) => {
  e.addEventListener("click", async (item) => {
    console.log(item.currentTarget.dataset.folder);
    songs = await getSongs(`${item.currentTarget.dataset.folder}`);

   
  });
});

}
main();
