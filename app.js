const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose");
main().catch(err=> console.log(err));

const app = express();

app.set("view engine" , "ejs");

app.use(express.urlencoded({extended: true}))
app.use(express.json())

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wikiDB')
}

console.log("Server Connected");

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
})

const Article = new mongoose.model("Article",articleSchema);

app.route("/articles")
.get(async (req, res) => {
    try {
      const foundData = await Article.find();
      res.send(foundData);
    } catch (err) {
      res.send(err);
    }
  })

.post(async (req, res)=>{
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    })

    newArticle.save()
    .then(function(Data){
        console.log("Data saved to DB");
    })
    .catch(function(err){
        console.log(err);
    })
})

.delete(async(req,res)=>{
    Article.deleteMany()
    .then(function(Data){
        res.send("Data Deleted");
    })
    .catch(function(err){
        console.log(err);
    })
})

app.route("/articles/:articleTitle")
  .get(async (req, res) => {
    try {
      const Data = await Article.findOne({ title: req.params.articleTitle });
      res.send(Data);
    } catch (err) {
        console.log(err);
      res.send("Data not found");
      
    }
  })
  
  .put((req, res) => {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true }
    )
      .then(() => {
        res.send("Data Updated");
      })
      .catch((err) => {
        console.log(err);
        res.send(err);
      });
  });
  
  


app.listen(3000,()=>{
    console.log("Server is connected to port 3000");
})
