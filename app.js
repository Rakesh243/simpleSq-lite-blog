const express = require('express');
const ejs = require('ejs');
const _ = require('lodash');
const bodyParser = require("body-parser");
const path = require("path");

const aboutContent = "Hello, I am Rakesh, well i'm not a Developer also not a college Degree. But what i mostly like is creating new websites and writing blog post about education, tech, programming, hacking..."

const app = express()
const sqlite3 = require('sqlite3').verbose();
const db_name = path.join(__dirname, "data", "app.db");
const db = new sqlite3.Database(db_name,err => {
  if(err) {
    return console.log(err.message);
  }
  console.log("conntected");
});

const sql_create = `CREATE TABLE IF NOT EXISTS BlogPosts (title TEXT,content TEXT)`;
//db.serialize(function() {
 // db.run("CREATE TABLE BlogPosts (title TEXT,content TEXT)");
  
//});
db.run(sql_create,err => {
  if(err) {
    console.log(err.message);
  }
  console.log("created BlogPosts table");
})

app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}));
//#########################################

let posts = [];

//############################################
app.get("/", (req, res)=> {
  const sql = "SELECT * FROM BlogPosts"
  db.all(sql, [],(err, data) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("home",{
      Alldata:data
    })
  });
});



app.get('/about',(req,res) => res.render("about",{
    aboutContent: aboutContent
}));


//##############################################
app.get('/contact',(req,res) => res.render("contact"));
//compose GET----as we are not passing any value because this is only for admin not for Client...
app.get('/compose',(req,res) => res.render("compose")); 



app.post("/compose", (req, res)=> { 

    const sql = "INSERT INTO BlogPosts (title, content) VALUES (?,?)";
    const post =  [req.body.postTitle, req.body.postBody];
    db.run(sql, post, err => {
      if(err) {
        return console.log(err.message);
      }
      posts.push(post);
     
    })
   
    res.redirect("/");
  
  });
 
  app.get("/posts/:postName", function(req, res){
    const requestedTitle = _.lowerCase(req.params.postName);
  
    posts.forEach(function(tpost){
      const storedTitle = _.lowerCase(tpost.title);
  
      if (storedTitle === requestedTitle) {
        res.render("showposts", {
          title: tpost.title,
          content: tpost.content
        });
      }
    });
  
  });
  
  let port = process.env.PORT;
  if (port == null || port == "") {
    port = 3000;
  }
  app.listen(port);
