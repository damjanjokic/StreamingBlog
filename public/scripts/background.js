var counter = 0;
function changeBG(){
    var imgs = [
        "url(https://image.ibb.co/bW87SQ/Picture4.jpg)",
        "url(https://preview.ibb.co/dn8rnQ/Picture1.jpg)",
        "url(https://image.ibb.co/mGc6Mk/Picture2.jpg)",
      ]
    
    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
}
  
  setInterval(changeBG, 5000);


