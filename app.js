import express from "express";
import  {getDate, getDay} from "./date.js";

const app = express();

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.use(express.urlencoded({ extended: true }));

//Setup Static Folder
app.use(express.static("public"));

//Setting up EJS
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  
    const day = getDate();

  res.render("list", { listTitle: day, newListItems: items });
});

app.post("/", function (req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work List") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.post("/work", function (req, res) {
  let workItem = req.body.newItem;

  workItems.push(workItem);

  res.redirect("/work");
});

app.get("/about", function(req,res){
    res.render("about");
});

app.listen(3000, function (req, res) {
  console.log("Server is listenning at port 3000");
});
