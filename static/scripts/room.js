
const socket=io.connect("http://localhost:3000/")
let message_sender=document.getElementById("send_message");
let messageInput=document.getElementById("message");
let message_container=document.getElementById("text_block")
let users=document.getElementById("User_Joined");


console.log(roomName)
let user=prompt("enter you name: ")
socket.emit("new_user",roomName,user);




let names_map=[];
socket.on("user_connected",(names)=>{
    displayName(names)
  
})
console.log(names_map);

if(names_map!=null){
    users.innerHTML="";
names_map.map(name=>{
    displayName(name)
})
}

message_sender.addEventListener("submit",e=>{
    e.preventDefault();
    let message=messageInput.value;
    console.log(message);
    let data=user+"\n"+message;
    addMessage("",message,"right","#90EE90","white");
    socket.emit("send-chat",roomName,message);
    
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
   
   text.append(user_name)
   text.append(mess_ge);
   text.append(time);
   elem.style.width="100%";
   elem.style.display="flex";
   elem.style.marginTop="20px";
   elem.style.marginBottom="20px";
   if(direction=="right")
   elem.style.justifyContent="end";
   text.style.paddingLeft="20px";
   text.style.paddingRight="20px";
   text.style.textAlign=direction;
   text.style.backgroundColor=color;
   text.style.borderRadius="10px";
   elem.append(text);
   message_container.append(elem);
}
socket.on("chat_sent",(name,text)=>{
    let data=name+"\n"+text;
    addMessage(name,text,"left","white","#ED2939");
})

function displayName(name){
    let elem=document.createElement("div");
   elem.innerText=name + "joined";
  users.append(elem);
}