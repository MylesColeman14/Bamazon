var mysql = require("mysql");
var inquirer = require("inquirer")

var selectedItem = " "
var quantity;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "guest",
  database: "bamazondb"
});

var askQuestion = function() {
    inquirer.prompt([
      {
        name: "choice1",
        message: "What would you like to buy?"
      }
    ]).then(function(answers) {
    	selectedItem = answers.choice1;
        connection.query("SELECT * FROM products", function(err, res) {
        	for (var i = 0; i < res.length; i++) {
            	if(answers.choice1.toLowerCase() === res[i].product_name.toLowerCase()){
            		quantity = res[i].stock_quantity;
            		price = res[i].price;
                	console.log("The " + res[i].product_name + " has "+ res[i].stock_quantity + " in stock");
                	inquirer.prompt([
                      {
                        name:"amountSelection",
                        message:"How many would you like?"
                      }
                    ]).then(function(answers){
                       if(quantity < answers.amountSelection || quantity === 0){
                       		console.log("Not enough " + selectedItem + " in stock to fufill order.")
                       		connection.end();
                       }else{
                       		var cost = price * answers.amountSelection;
                       		var newQuantity = quantity - answers.amountSelection;
                       		console.log("You have purchased " + answers.amountSelection + " " + selectedItem + "(s) for $" + cost);
                       		updateStock(newQuantity, selectedItem);
                       		connection.end();
                       }
                    })
                  }
                }
                if(answers.choice1.toLowerCase() === "admin auth"){
                	manager();
                }
              
        });
    });
    
  
};
function queryAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    for (var i = 0; i < res.length; i++) {
      console.log("\n"+res[i].item_id + " | Item: " + res[i].product_name + " | Department: " + res[i].department_name  + " | $" + res[i].price + " | Stock: "  + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
  });
}
function updateStock(newQuantity,name) {
  console.log("Updating current stock...\n");
  var query = connection.query(
    "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: newQuantity
      },
      {
        product_name: name
      }
    ],
    function(err, res) {
      
    }
  );
  
}

function manager(){
	inquirer.prompt([
		{
			name:"adminPass",
			message:"Please enter the admin password"
		}
	]).then(function(answers){
		if(answers.adminPass === "Gu3$T"){
			inquirer.prompt([
				{
					name:"adminChoice",
					message:"What do you want to do?",
					type: "list",
					choices:["View Products", 'View low stock', "Restock", "Add Product"]
				}
			]).then(function(answers){
				if(answers.adminChoice === "View Products"){
					queryAllItems();
					connection.end();
				}else if(answers.adminChoice === "View low stock"){
					lowStock();
				}else if(answers.adminChoice === "Restock"){
					inquirer.prompt([
						{
							name:"restockItem",
							message:"What item do you want to restock?"
						}
					]).then(function(answers){
						restock(answers.restockItem);
					})
				}else{
					addProduct();
				}
			})
		}else{
			console.log("invalid password");
		}
	})
}
function restock(restock){
	connection.query("SELECT * FROM products", function(err,res){
		for(var i = 0; i< res.length;i++){
			if(restock.toLowerCase() === res[i].product_name.toLowerCase()){
				var currentQuantity = res[i].stock_quantity;
				var restockOption = restock;
				inquirer.prompt([
					{
						name:"restockAmount",
						message:"How much are you restoking?"
					}
				]).then(function(answers){
					var newQuantity = parseInt(answers.restockAmount) + parseInt(currentQuantity);
					updateStock(newQuantity, restockOption);
					queryAllItems();
					connection.end()
				})
			}
		}
	})
}
function lowStock(){
	var query = connection.query("SELECT * FROM products", function(err, res){
		for (var i = 0; i < res.length; i++) {
			if(res[i].stock_quantity < 20){
				console.log(res[i].product_name + " | Remaining stock: " + res[i].stock_quantity)
			}
      	}
    	console.log("-----------------------------------");
    	connection.end();
    });
}

function addProduct(){

	inquirer.prompt([
		{
			name: "name",
			message: "What is the items name?"
		}
	]).then(function(answers){
		var name = answers.name;
		inquirer.prompt([
			{
				name:"department",
				message:"What department does the item belong to?"
			}
		]).then(function(answers){
			var department = answers.department;
			inquirer.prompt([
				{
					name:"price",
					message:"How much will this item cost?"
				}
			]).then(function(answers){
				var itemPrice = answers.price;
				inquirer.prompt([
					{
						name:"quantity",
						message:"How many will we initially have in stock?"
					}
				]).then(function(answers){
					initalQunatity = answers.quantity;
					var query = connection.query(
					    "INSERT INTO products SET?",
					    {
					      product_name:name,
					      department_name: department,
					      price: itemPrice,
					      stock_quantity: initalQunatity
					    },
					    function(err, res) {
					      console.log("item insterted!\n");
					      queryAllItems();
					      connection.end();
					    });
					 console.log(query.sql);
				})
			})
		});
	});



	
}
queryAllItems();
askQuestion();