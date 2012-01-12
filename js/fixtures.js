var VISITS_FIXTURES = true;

var customers = ["John Doe", "Menganito Gómez", "Fulanito Gutiérrez", "Pepita Pulgarcita"];
var visitsTodo = [
  ["2012-01-12", "Go there"],
  ["2012-01-13", "Make a call"],
  ["", ""],
  ["2012-01-14", "Send an email"]
];


for(var i=0;i<customers.length;i++){
  Visits.customerController.createCustomer(customers[i]);
}

for(var i=0;i<customers.length;i++){
  var company = Visits.customerController.getCustomer(customers[i]);
  company.set('nextVisit', visitsTodo[i]);
}

