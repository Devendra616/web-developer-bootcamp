var faker = require("faker");
var line = "==========================================";
console.log(line);
console.log("WELCOME TO MY SHOP");
console.log(line);
let item ;
for(var i=1;i<=10;i++){
	item = faker.commerce.productName()+" - $"+faker.commerce.price();
	console.log(item);
}