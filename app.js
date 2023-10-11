import express from "express";
import mongoose from "mongoose";
import _ from 'lodash';

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
  name: "Welcome to your todoList.",
});

const item2 = new Item({
  name: "Hit the + button to add a new Item.",
});
const item3 = new Item({
  name: "<-- Hot this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

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
  const listName = req.body.list;

  const newItem = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    newItem.save().then(console.log("Item saved successfully!"));
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(newItem);
      foundList.save().then(console.log("Element inserted and updated."));
      res.redirect(`/${listName}`);
    });
  }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (checkedItemId !== undefined && checkedItemId !== null) {
    if (listName === "Today") {
      Item.findByIdAndRemove(checkedItemId).then(
        console.log("Item", checkedItemId, "was deleted successfully.")
      );
      res.redirect("/");
    } else {
      List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      ).then(
        console.log(
          "Custom list item",
          checkedItemId,
          "was deleted successfully."
        )
      );
      res.redirect(`/${listName}`);
    }
  }
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }).then((foundList) => {
    if (!foundList) {
      //create a new list
      const list = new List({
        name: customListName,
        items: defaultItems,
      });
      list.save().then(console.log("Item(s) saved."));
      res.redirect(`/${customListName}`);
    } else {
      //Show an existing list
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      });
    }
  });
  //
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
