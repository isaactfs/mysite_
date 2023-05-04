require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./model/user');
const bcrypt = require('bcrypt');
const Message = require('./model/message')

const app = express();

app.use(bodyParser.urlencoded({extended: true}))

// make some files accessable(public)
app.use(express.static("public"));

// set view engine to ejs
app.set('view engine', 'ejs');

//connect to mongoose
// mongoose.connect("mongodb://localhost:27017/messageDB");
mongoose.connect(process.env.MONGODB);

app.get("/", function(req, res){
    res.render("index", {sent: ""});
});

app.post("/contactme", async (req, res) =>{
    const name = req.body.name;
    const email = req.body.email;
    const contact_no = req.body.contact_no;
    const msg = req.body.message;

    try{
        const response = await Message.create({
            name,
            email,
            contact_no,
            msg
        });
    } catch(err){
        throw err
    }
    res.render("index", {sent: "Thanks, Message sent successfully"});
});

// admin login page
app.get("/admin-login", function(req, res){
    res.render("admin-login", {login: ""});
});

app.post("/admin-login", async (req, res)=>{
    try {
        //get user input
        const { username, password } = req.body;

        // check if user exist
        const admin = await User.findOne({ username });
        if(admin){
            if(password === admin.password){
                // messages
                let messageArray = [];
                Message.find({}).then(function(message){
                    //reverse the array and set to a new variable
                    //reverse used to put the last message on the top by reversing the array index.
                    messageArray = message.reverse();
                    res.render("admin",{
                        messageEJS: messageArray
                    });
                });
                }
                else{
                    res.render("admin-login", {
                        login: "Login Failed"
                    });
                }
            }
            else{
                res.render("admin-login", {
                    login: "Login Failed"
                });
            }
    } catch (err) {
        console.log(err);
    }
});

app.post("/deleteMessage", function(req, res){
    // console.log(req.body.deleteButton)
    const deleteMessageID = (req.body.deleteButton).trim();
    // console.log(deleteMessageID);
    Message.findByIdAndRemove(deleteMessageID).then(function(err){
        if(err){
            // messages
            try{
                let messageArray = [];
                Message.find({}).then(function(message){
                messageArray = message.reverse();
                    res.render("admin",{
                        messageEJS: messageArray
                    });
                });
            }catch(err) {
                console.log(err)
            }
            
        }else{
            // messages
            let messageArray = [];
            Message.find({}).then(function(message){
                messageArray = message.reverse();
                res.render("admin",{
                    messageEJS: messageArray
                });
            });
        }
    });
});

//404
app.get('*', function(req, res){
    res.send("page not found")
});


let port = process.env.PORT;
if(port == null || port ==""){
    port = 5555;
}

//listener
app.listen(port, function(){
    console.log("Server has started successfully\n http://localhost:5555");
});
//done