const express=require("express");
const app=express();

const server = require('http').createServer(app);
const {Server}= require("socket.io")
const io = new Server(server,{
    cors:{
    origin:"http://localhost:3000/",
    methods:["GET","POST"]
    }
})


const bodyParser=require("body-parser");
const ejs=require("ejs");
const { urlencoded } = require("body-parser");
const url=require("url")

const port=3000;

app.use(express.static("static"));
app.use(bodyParser.urlencoded({extended:false}));
app.set("view engine","ejs");
const rooms={ };
app.get("/",(req,res)=>{
    res.render("home_page",{});
   });

app.get("/:room",(req,res)=>{
    let room=req.params.room;
    if(rooms[room]==null)res.redirect("/")
    res.render("room",{roomName:room});
});
app.post("/users",(req,res)=>{
    let names=[];
    let room=req.body.room;
    Object.keys(rooms[room].users).map(value=>{
        names.push(rooms[room].users[value]);
    })
    res.send(names);
})
app.post("/createRoom",(req,res)=>{
        if(rooms[req.body.room]!=null){
            alert("room already exists");
            res.redirect("/");
        }
        else{
        rooms[req.body.room]={users:{}}
        let roomName="/"+req.body.room;
        console.log(rooms[req.body.room]);
        return res.redirect(roomName);
        }
})


app.post("/joinRoom",(req,res)=>{
    if(rooms[req.body.new_room]==null)res.redirect("/");
    else{
        let room="/"+req.body.new_room;
        res.redirect(room)
    }
    
})



io.on('connection',socket=>{
         socket.on("new_user",(room,name)=>{
             socket.join(room)
             rooms[room].users[socket.id]=name;
            
             socket.to(room).emit("user_connected",name);
         })
        socket.on("send-chat",(room,message)=>{
            socket.to(room).emit("chat_sent",rooms[room].users[socket.id],message);
        })
})


server.listen(port,()=>{ console.log('server started');});