var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

function runProgram() {
  displayTable();
  setTimeout(bezos, 3000);
}

function bezos() {
  inquirer
    .prompt([
      {
        name: "actionChosen",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Products",
          "View Low Inventory",
          "Add A New Product",
          "Increase Quantity Of Existing Product"
        ]
      }
    ])
    .then(function(answers) {
      response = answers.actionChosen;
      switch (response) {
        case "View All Products":
          viewProducts();
          break;
        case "View Low Inventory":
          lowInventory();
          break;
        case "Add A New Product":
          inquirer
            .prompt([
              {
                name: "itemAdded",
                type: "input",
                message: "What item would you like to add?"
              },
              {
                name: "deptName",
                type: "input",
                message: "What dept should this item be added to?"
              },
              {
                name: "price",
                type: "input",
                message:
                  "What price would you like the itm to be? (No $ symbols please)"
              },
              {
                name: "quantity",
                type: "input",
                message: "How many would you like to add?"
              }
            ])
            .then(function(answers2) {
              addNewProduct(
                answers2.itemAdded,
                answers2.deptName,
                answers2.price,
                answers2.quantity
              );
            });
          break;
        case "Increase Quantity Of Existing Product":
          inquirer
            .prompt([
              {
                name: "itemPicked",
                type: "input",
                message: "What item would you like to add to? Select using ID"
              },
              {
                name: "amount",
                type: "input",
                message: "How many would you like to add?"
              }
            ])
            .then(function(response3) {
              console.log("added");
              addToInventory(response3.itemPicked, response3.amount);
            });
          break;
      }
    });
}

function viewProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    // Log all results of the SELECT statement
    for (var i = 0; i < res.length; i++) {
      console.log(
        "Item ID-",
        res[i].item_id,
        " Product-",
        res[i].product_name,
        " Price-",
        res[i].price,
        " Quantity-",
        res[i].stock_quantity
      );
    }
  });
}

function lowInventory() {
  connection.query(
    "SELECT * FROM products WHERE stock_quantity < ?",
    ["5"],
    function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(
          "Item ID-",
          res[i].item_id,
          " Product-",
          res[i].product_name,
          " Price-",
          res[i].price,
          " Quantity-",
          res[i].stock_quantity
        );
      }
    }
  );
  connection.end();
}

function addToInventory(item, numAdded) {
  console.log("Updating quantity...\n");

  var query = connection.query(
    "UPDATE products SET stock_quantity = stock_quantity + " +
      numAdded +
      " WHERE ?",
    [
      {
        item_id: item
      }
    ],
    function(err, res) {
      if (err) {
        throw err;
      }
    }
  );
  connection.end();
}

function addNewProduct(item, dept, priceSet, quantity) {
  connection.query(
    "INSERT INTO products SET ?",
    [
      {
        product_name: item,
        department_name: dept,
        price: priceSet,
        stock_quantity: quantity
      }
    ],
    function(err, res) {
      console.log(res.affectedRows + " product inserted!\n");
    }
  );
  connection.end();
}

//viewProducts();
//addNewProduct("Samsung Galaxy 7 S8", "Electronics", 399.99, 2);
//lowInventory();
//addToInventory(5, 10);
bezos();
