
const socket=io.connect("https://chatterwebapp.herokuapp.com/")
let message_sender=document.getElementById("send_message");
let messageInput=document.getElementById("message");
let message_container=document.getElementById("text_block")
let users=document.getElementById("User_Joined");

window.addEventListener("resize",()=>{
  let width=window.innerWidth-100;
  users.style.width=width+"px";
})

console.log(roomName)
// let user=prompt("enter you name: ")
// if(user===null)user="Unknown"
let user="";
document.getElementById("name_enter").addEventListener("submit",e=>{
  e.preventDefault();
   user=document.getElementById("name").value;
   document.getElementById("starting_page").style.display="none";
   document.getElementById("message-field").style.display="flex";
   socket.emit("new_user",roomName,user);
   displayName("You");
})

// displayName("You","joined","left","#ece5dd","#ED2939")



let names_map=[];
socket.on("user_connected",(names)=>{
    // displayName(names,"joined","left","#ece5dd","#ED2939")
    displayName(names);
    user_disconnected(names,"connected","center","#90EE90","#ED2939");
    socket.emit("user_display",user,roomName);
})
socket.on("user_add",(names)=>{
  users.innerText="";
  displayName("You");
  for(var i=0;i<names.length;i++){
    if(names[i]!=user)displayName(names[i]);
  }
})
socket.on("user-disconnected",(name,names)=>{
   user_disconnected(name,"disconnected","center","#90EE90","#ED2939");
   users.innerText="";
  displayName("You");
  for(var i=0;i<names.length;i++){
    if(names[i]!=user && names[i]!=name)displayName(names[i]);
  }
})

message_sender.addEventListener("submit",e=>{
    e.preventDefault();
    let message=messageInput.value;
    if(message=="");
    else{
    console.log(message);
    let data=user+"\n"+message;
    addMessage("",message,"right","#90EE90","white");
    socket.emit("send-chat",roomName,message);
    messageInput.value="";
    messageInput.rows="1";
    }
    
});

function addMessage(user,message,direction,color,user_color){
   let elem=document.createElement("div");
   let text=document.createElement("div");
   let user_name=document.createElement("div");
   let mess_ge=document.createElement("div");
   let time=document.createElement("div");
     
 let today=new Date();

let hours=today.getHours();
let minutes=today.getMinutes();

     time.innerText=hours+":"+minutes;
     time.style.position="relative";
     time.style.bottom="0";
     time.style.right="0";
     time.style.fontSize="10px";
     time.style.color="grey";
   mess_ge.innerText=message;
   user_name.style.color=user_color;
   user_name.style.fontWeight="bold";
   user_name.innerText=user;
   text.style.display="flex";
   text.style.flexDirection="column";
   text.style.marginRight="2%";
   text.append(user_name)
   text.append(mess_ge);
   text.append(time);
   elem.style.width="98%";
   text.style.display="inline-block";
   text.style.width="fit-content";
   text.style.height="fit-content";
   text.style.wordBreak="break-word";
   text.style.whiteSpace="pre-wrap";
   elem.style.display="flex";
   elem.style.marginTop="2%";
   elem.style.marginBottom="2%";
   elem.style.marginLeft="2%";
   if(direction=="right")
   elem.style.justifyContent="end";
   text.style.paddingLeft="20px";
   text.style.paddingRight="20px";
   text.style.textAlign=direction;
   text.style.backgroundColor=color;
   text.style.borderRadius="10px";
   elem.append(text);
   elem.className="animate__animated animate__bounceIn";
   message_container.append(elem);
}
socket.on("chat_sent",(name,text)=>{
    addMessage(name,text,"left","white","#ED2939");
})
function user_disconnected(user,message,direction,color,user_color){
  let elem=document.createElement("div");
  let text=document.createElement("div");
  let user_name=document.createElement("div");
  let mess_ge=document.createElement("div");
  mess_ge.innerText=message;
  user_name.style.color=user_color;
  user_name.style.fontWeight="bold";
  user_name.innerText=user;
  text.style.display="flex";
  text.style.flexDirection="column";
  text.style.marginRight="2%";
  text.append(user_name)
  text.append(mess_ge);
  elem.style.display="flex";
  elem.style.marginTop="20px";
  elem.style.marginBottom="20px";
  elem.style.justifyContent="center";
  text.style.paddingLeft="10px";
  text.style.paddingRight="10px";
  text.style.textAlign=direction;
  text.style.backgroundColor=color;
  text.style.borderRadius="10px";
  elem.append(text);
  message_container.append(elem);
}
// function displayName(user,message,direction,color,user_color){
//     let elem=document.createElement("div");
//    let text=document.createElement("div");
//    let user_name=document.createElement("div");
//    let mess_ge=document.createElement("div");
//    let time=document.createElement("div");
     
//  let today=new Date();

// let hours=today.getHours();
// let minutes=today.getMinutes();

//      time.innerText=hours+":"+minutes;
//      time.style.position="relative";
//      time.style.bottom="0";
//      time.style.right="0";
//      time.style.fontSize="10px";
//      time.style.color="grey";
//    mess_ge.innerText=message;
//    user_name.style.color=user_color;
//    user_name.style.fontWeight="bold";
//    user_name.innerText=user;
//    text.style.display="flex";
//    text.style.flexDirection="column";
   
//    text.append(user_name)
//    text.append(mess_ge);
//    text.append(time);
//    elem.style.width="100%";
//    elem.style.display="flex";
//    elem.style.marginTop="20px";
//    elem.style.marginBottom="20px";
//    if(direction=="right")
//    elem.style.justifyContent="end";
//    text.style.paddingLeft="20px";
//    text.style.paddingRight="20px";
//    text.style.textAlign=direction;
//    text.style.backgroundColor=color;
//    text.style.borderRadius="10px";
//    elem.append(text);
//    users.append(elem);
// }
function displayName(name){
  if(name=="You")users.innerText+=name;
  else
  users.innerText+=","+name;
}