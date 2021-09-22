/* jshint esversion:6*/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const ejs = require("ejs");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
mongoose.connect("mongodb+srv://admin-Maneet:Mankamal79@cluster0.sdk6q.mongodb.net/todolistDB", {
  useNewURLParser: true,
});
const itemSchema = {
  name: String
};

const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to your toDoList"
});
const item2 = new Item({
  name: "Hit the + button to add a new item"
});
const item3 = new Item({
  name: "<--Hit this to delete an item"
});
const defaultItems = [item1, item2, item3];
const listSchema = {
  name: String,
  items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully saved default items to the db");
        }
        
      });
res.redirect("/");
    } else {
      res.render("lists", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  });
});
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create new one
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customListName);
      }
      else {
        //show existing one
        res.render("lists", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  })
})
app.post("/", function (request, response) {
  const itemName = request.body.newItem;
  const listName = request.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName === "Today") {
    item.save();
    response.redirect("/");
  }
  else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      response.redirect("/" + listName);
    })
  }
});
app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName= req.body.listName;
  if (listName==="Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
    if (!err) {
      console.log("Item successfully deleted from the database");
      res.redirect("/");
    }
  });
  }
  else{

  }
})

app.listen(3000, function () {
  console.log("Server started at port 3000");
});