//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/todolistDB', {useNewUrlParser: true});

// ItemSchema and collection creation...
const { Schema } = mongoose;
const itemSchema = new Schema({
  name: String
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo-list!"
});
const item2 = new Item({
  name: "Click + to add another item."
});
const item3 = new Item({
  name: "<-- Click this to delete an item."
});
const items = [item1, item2, item3];
// ...

const workItems = [];

// Inserting items in the Item collection...

// Item.insertMany(items, function(err, docs){ });
// ...

app.get("/", function(req, res) {

  const day = date.getDate();
  res.render("list", {listTitle: day, newListItems: items}); // change "newListItems: items" to "newListItems: Item" when inserting documents in collection

});

app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
