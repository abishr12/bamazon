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

function viewSales() {
  connection.query(
    "SET sql_mode=(SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));",
    function(err, res) {
      if (err) throw err;
    }
  );
  connection.query(
    "SELECT d.dept_id, d.dept_name, d.over_head_costs, SUM(p.product_sales) AS total_price FROM products AS p LEFT JOIN departments AS d ON p.department_name=d.dept_name GROUP BY p.department_name ORDER BY d.dept_id;",
    function(err, res) {
      if (err) throw err;
      console.log(res);
    }
  );
}

viewSales();
