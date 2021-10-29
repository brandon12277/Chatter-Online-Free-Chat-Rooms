
//Initialization
const express=require("express");
const app=express();

const server = require('http').createServer(app);
const {Server}= require("socket.io")
const port=process.env.PORT || 3000 || 8443;
const io = new Server(server,{
    cors:{
    origin:"https://chatterwebapp.herokuapp.com/",
    methods:["GET","POST"]
    }
})


const bodyParser=require("body-parser");
const ejs=require("ejs");
const { urlencoded } = require("body-parser");
const url=require("url");
const { RSA_PKCS1_PADDING } = require("constants");

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");
const rooms={ };


//Get and Post Routes
app.get("/",(req,res)=>{
    res.render("home_page",{});
   });

app.get("/:room",(req,res)=>{
    let room=req.params.room;
    if(rooms[room]==null)res.redirect("/")
    res.render("room",{roomName:room});
});
app.get("/error/createRoom",(req,res)=>{
    res.render("error_page",{});
});
app.get("/error/joinRoom",(req,res)=>{
    res.render("error_join",{});
});
app.post("/users",(req,res)=>{
   
})


app.post("/createRoom",(req,res)=>{
        if(rooms[req.body.room]!=null && Object.keys(rooms[req.body.room].users)!=0){

          res.redirect("/error/createRoom");
        }
        else{
        rooms[req.body.room]={users:{}}
        let roomName="/"+req.body.room;
        console.log(rooms[req.body.room]);
        return res.redirect(roomName);
        }
})


app.post("/joinRoom",(req,res)=>{
    if(rooms[req.body.new_room]==null)res.redirect("/error/joinRoom");
    else{
        let room="/"+req.body.new_room;
        res.redirect(room)
    }
    
})




//Web Sockets for chat app

io.on('connection',socket=>{
         
         socket.on("new_user",(room,name)=>{
             socket.join(room)
             rooms[room].users[socket.id]=name;
            
             socket.to(room).emit("user_connected",name);
         })
        socket.on("send-chat",(room,message)=>{
            socket.to(room).emit("chat_sent",rooms[room].users[socket.id],message);
        })
        socket.on("user_display",(name,room)=>{
            let names=[];
            Object.keys(rooms[room].users).map(value=>{
                names.push(rooms[room].users[value]);
            })
            socket.to(room).emit("user_add",names)
          })
          socket.on("disconnect",()=>{
          ReturnUsertRooms(socket).forEach(room=>{
            let names=[];
            Object.keys(rooms[room].users).map(value=>{
                names.push(rooms[room].users[value]);
            })
                socket.to(room).emit("user-disconnected",rooms[room].users[socket.id],names);
                delete rooms[room].users[socket.id];
                if(Object.keys(rooms[req.body.room].users)==0)delete rooms[room];
               
            })
           
        
          })
})
function ReturnUsertRooms(socket){
    
    return Object.entries(rooms).reduce((names,[name,room])=>{
           if(room.users[socket.id]!=null)names.push(name)
           return names;
    },[])
    
}

server.listen(port,()=>{ console.log('server started');});