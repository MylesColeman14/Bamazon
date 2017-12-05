DROP DATABASE IF EXISTS bamazondb;

CREATE DATABASE bamazondb;

USE bamazondb;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Mac Book", "Electronics",1000,60);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Desk", "Office Goods",300,100);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("'60' Television", "Electronics",1250,40);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("I Phone 6", "Electronics",800,80);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Star Wars Poster", "Home Goods",30,600);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Mechanical Keyboard", "Electronics",300,0);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Pillows", "Home Goods",20,2000);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Mouse Pad", "Office Goods",10,420);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Towels", "Home Goods",10,1500);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES("Something Dank", "Home Goods",9420,420);

SELECT * FROM products;
