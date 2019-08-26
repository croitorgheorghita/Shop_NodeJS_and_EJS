const express = require("express");
const Product = require("../models/product");
const routes = express.Router();
const User = require("../models/user");
const Traffic = require("../models/traffic");

routes.get("/api/getDataForBox", async (req, res) => {
  let productCount = await Product.find().countDocuments();
  let userCount = await User.find().countDocuments();
  let products = await Product.find();
  let traffic = await Traffic.find();

  let visits = 0;
  let productsBougth = 0;
  let maxVisit = 0;
  var indexVisit = 0;
  let maxBougth = 0;
  var indexBougth = 0;
  products.forEach(element => {
    if (element.visit > maxVisit) {
      maxVisit = element.visit;
      indexVisit = element;
    }

    if (element.bought > maxBougth) {
      maxBougth = element.bought;
      indexBougth = element;
    }
    visits = visits + element.visit;
    productsBougth = productsBougth + element.bought;
  });

  let trafficVisit = 0;
  traffic.forEach(element => {
    trafficVisit = trafficVisit + element.visits;
  });

  res.send({
    productsNumber: productCount,
    productsVisited: visits,
    productsBougth: productsBougth,
    users: userCount,
    trafficVisit: trafficVisit,
    mostVisit: indexVisit,
    mostBougth: indexBougth
  });
});

routes.get("/api/chartData", async (req, res) => {
  let last4Documents = await Traffic.find()
    .sort({ _id: -1 })
    .limit(4);

  res.send({ last: last4Documents });
});

routes.get("/api/products", async (req, res) => {
  let products = await Product.find();

  res.send({ products: products });
});
module.exports = routes;
