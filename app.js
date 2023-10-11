import express from "express";
import mongoose from "mongoose";

const app = express();

app.use(express.urlencoded({ extended: true }));
//Setting up EJS
app.set("view engine", "ejs");

//Setup Static Folder
app.use(express.static("public"));

//create a new database with mongoose
const uri = "mongodb://127.0.0.1:27017/todoListDB";
mongoose.connect(uri);

//Create a new Schema "Item Schema"
const itemsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "The name field cannot be empty"],
  },
});

//Create a mongoose Model
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Buy food",
});

const item2 = new Item({
  name: "Wash the car",
});
const item3 = new Item({
  name: "Make Breakfast",
});

const defaultItems = [item1, item2, item3];

//let res = await Item.insertMany(defaultItems);

app.get("/", function (req, res) {
  Item.find({}).then((foundItems) => {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems).then((insertedElements) => {
        console.log("Elements inserted :", insertedElements);
        res.redirect("/");
      });
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName,
  });
  newItem.save().then(console.log("Item saved successfully!"));
  res.redirect("/");
});

app.post("/delete", (req, res) => {
  if (req.body.checkbox !== undefined && req.body.checkbox !== null) {
    Item.findByIdAndRemove(req.body.checkbox).then(
      console.log("Item", req.body.checkbox, "was deleted successfully.")
    );
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

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function (req, res) {
  console.log("Server is listenning at port 3000");
});
