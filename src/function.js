window.miaVariabileGlobale;
function clickImage(plyId){
  
  ply0_src = getCleanerPath(ply0.src)
  ply1_src = getCleanerPath(ply1.src)
  ply2_src = getCleanerPath(ply2.src)
  

  if(plyId == "0") {
    plyId = getCookie("path1")
  } else if(plyId == "1") {
    plyId = getCookie("path2")
  } else if(plyId == "2") {
    plyId = getCookie("path3")
  } else {
    methodPreference = "None"
  }



  // save data we care about
  sendData({"username": userId,
            "preference": plyId,
            //"ply0": ply0_id,
            //"ply1": ply1_id,
            //"ply2": ply2_id,
            //"target": target,
            "text": getCookie("testo"),  //getelementbyid testomodificato
    })

  // Delay display the next 2 images
  // If first time this gt is shown => display now the same pair (no shuffle now) with the other text

  
}

function sendData(data) {
  console.log('sending data...')
  const XHR = new XMLHttpRequest();
  const FD = new FormData();

  // Push our data into our FormData object
  for (const [name, value] of Object.entries(data)) {
    FD.append(name, value);
  }
  console.log("FD")
  console.log(FD)

  // Define what happens on successful data submission
  XHR.addEventListener('load', (event) => {
    console.log('Sucessfully sent response.');
  });

  // Define what happens in case of error
  XHR.addEventListener('error', (event) => {
    alert('Oops! Something went wrong. Try refreshing the page. If the issue persists, please read the message at the bottom of the page.');
  });

  // Set up request to my Google Sheet
  // ORIGINAL SHAPE2TEXT: 
  //XHR.open('POST', 'https://script.google.com/macros/s/AKfycbyuBMedQoivgJvHnFNDRo2tH8vr50-hi_LEMY6cZQDBhzVUcvlJJLDq2E9O2jR8Ab3n/exec');
  
  XHR.open('POST', 'https://script.google.com/macros/s/AKfycbz5ghRM3HIJM29TqInOwNEJmjooyZCOcuIkTZwVjhmlupXl3qe8L7DgKiZaxnvMRwWzfw/exec');

  // Send our FormData object; HTTP headers are set automatically
  XHR.send(FD);
  newSampleImages(true);
}

function getRandomInt(max){ 
  return Math.floor(Math.random()*(max)) 
}

function getCleanerPath(path){
  /* Given a filepath, removes all directories except for the last one
      Ex. : a/b/d/e/f.txt -> e/f.txt */
  split = path.split("/")
  return split[split.length - 2] + "/" + split[split.length - 1]
}

function shuffleArray(arr){
  return arr.sort(function () {  //ascending ore descending in base of the reutrn of the fun positive or negative
    return Math.random() - 0.5;
  })
}


function newSampleImages(reload){
    //fetch('./randomt2s_1e2h_data.json')
    fetch('./all_texts.json')//<C:\Users\s_bst\Desktop\code\humaneval_genshapes.github.io-main\human_test_set_final.json>
    .then(response => response.json())
    .then(data => {
      console.log(data)
      // pick random element from data
      idx = getRandomInt(data.length)
      point_e = "point_e"//data[idx].gt_id
      shap_e = "shap_e"//data[idx].dist_id
      towards_impl = "towards_impl"//data[idx].dist_id
      text = data[idx].text
      base_url = './shapes/'
      // Nella prima pagina
      setCookie("testo", text, 1)
      // Method order is randomized
      var shapes = shuffleArray([point_e,shap_e,towards_impl])
      if (shapes[0]==point_e) // target is used to remember which shape is pont e
      {
        target = 0
      }
      else if (shapes[0]==shap_e)
      {
        target = 1
      }
      else
      {
        target = 2
      }

      // save model_ids of images
      ply0_id = shapes[0]
      ply1_id = shapes[1]
      ply2_id = shapes[2]

      var path1=ply0_id+"/"+text.substring(0,50);
      var path2=ply1_id+"/"+text.substring(0,50);
      var path3=ply2_id+"/"+text.substring(0,50);


      setCookie("path1", path1, 1)
      setCookie("path2", path2, 1)
      setCookie("path3", path3, 1)

      if(reload){
        location.reload();
      }
      // display text
      console.log(ply0_id+":"+ply1_id+";"+ply2_id+"£"+getCookie("testo"))
      
      
      
      
    })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error)
    })
  
}


function stringGen(len){
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (var i = 0; i < len; i++)
    text += possible.charAt(getRandomInt(possible.length));
  return text;
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/;SameSite=Strict";
}

function userIdSetup(){
  userId = getCookie("userId")
  if(userId == ""){
    userId = stringGen(10)
    setCookie("userId", userId, 100)
  }
  return userId
}