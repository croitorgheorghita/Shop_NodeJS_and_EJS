const User = require("../models/user");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const mongodb = require("mongodb");
const uuid = require("uuid/v4");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const io = require("./../socket");

exports.login = async (req, res) => {
  errors = validationResult(req);
  err = [];

  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    res.render("account", {
      errorMessage: errors.array()[0].msg,
      isLogged: req.session.isLogged
    });
  } else {
    try {
      var user = await User.findOne({ email: req.body.email });
      if (!user) {
        err.push("Email not found");
        res.render("account", {
          errorMessage: err[0],
          isLogged: req.session.isLogged
        });
      } else {
        var pass = await bcrypt.compare(req.body.password, user.password);
        if (pass == false) {
          err.push("Password don't match");
          res.render("account", {
            errorMessage: err[0],
            isLogged: req.session.isLogged
          });
        } else {
          req.session.user = user._id;
          req.session.isLogged = true;
          let products = await Product.find().limit(4);
          res.render("index", {
            title: "Luxury watches",
            products: products,
            isLogged: req.session.isLogged
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};

exports.register = async (req, res) => {
  errors = validationResult(req);
  err = [];
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    res.render("register", {
      errorMessage: errors.array()[0].msg,
      isLogged: req.session.isLogged
    });
  } else {
    try {
      var user = await User.findOne({ email: req.body.email });
      if (user) {
        err.push("Email is used");
        console.log(err);
        res.render("register", {
          errorMessage: err[0],
          isLogged: req.session.isLogged
        });
      } else {
        var hashpass = await bcrypt.hash(req.body.password, 12);
        var newUser = {
          username: req.body.username,
          email: req.body.email,
          password: hashpass,
          cart: []
        };

        await User.create(newUser);
        io.getIO().emit("products", { action: "users" });
        res.redirect("/account");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

exports.logout = async (req, res) => {
  if (req.session.isLogged === true) {
    req.session.isLogged = false;
  }

  res.redirect("/");
};

exports.addProduct = async (req, res) => {
  errors = validationResult(req);
  image = req.file;
  err = [];
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].msg);
    res.render("addProduct", {
      errorMessage: errors.array()[0].msg,
      isLogged: req.session.isLogged
    });
  }
  if (!image) {
    //console.log(errors.array()[0].msg)
    err.push("The file must be a image");
    res.render("addProduct", {
      errorMessage: err[0],
      isLogged: req.session.isLogged
    });
  } else {
    imageUrl = image.path;
    var product = {
      title: req.body.name,
      price: req.body.price,
      imageUrl: imageUrl,
      description: req.body.description,
      visit: 0,
      bought: 0,
      userId: req.session.user
    };
    try {
      var prod = await Product.create(product);
      io.getIO().emit("products", { action: "create" });
      console.log("s-a Emis");
      var products = await Product.find({ userId: req.session.user });
      res.render("./admin_panel.ejs", {
        isLogged: req.session.isLogged,
        products: products
      });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.addToCart = async (req, res) => {
  err = [];
  if (req.session.isLogged !== true) {
    err.push("You must be authenticated to add to the cart");
    res.render("./checkout.ejs", {
      errorMessage: err[0],
      isLogged: req.session.isLogged
    });
  } else {
    try {
      let user = await User.findById(req.session.user);

      let index = user.cart.findIndex(pos => {
        return pos.productId == req.body.id;
      });

      let updateCart = [...user.cart];

      if (index >= 0) {
        Quantity = user.cart[index].quantity + 1;
        updateCart[index].quantity = Quantity;
      } else {
        updateCart.push({
          productId: mongoose.Types.ObjectId(req.body.id),
          quantity: 1
        });
      }

      let product = await Product.findOne({ _id: req.body.id });

      if (product.bought != undefined) {
        let productBougth = product.bought;
        productBougth = productBougth + 1;

        newProduct = await Product.updateOne(
          { _id: req.body.id },
          { $set: { bought: productBougth } }
        );

        user = await User.updateOne(
          { _id: req.session.user },
          { $set: { cart: updateCart } }
        );
      }
      let userFinal = await User.findById(req.session.user);
      userFinal
        .populate("cart.productId")
        .execPopulate()
        .then(user => {
          products = user.cart;
          if (products.length > 0) {
            for (var i = 0; i < products.length; i++) {
              if (products[i].productId == null) products.splice(i, 1);
            }
            if (products[0].productId === null) {
              products = [];
            }
          }
          io.getIO().emit("products", { action: "bougth" });
          res.render("./checkout.ejs", {
            errorMessage: null,
            isLogged: req.session.isLogged,
            products: products
          });
        });
    } catch (err) {
      console.log(err);
    }
  }
};

exports.clearCart = async (req, res) => {
  let user = User.findById(req.session.user);

  updateCart = [];

  user.cart = updateCart;
  try {
    let userUpdate = await User.updateOne(
      { _id: req.session.user },
      {
        $set: {
          cart: updateCart
        }
      }
    );
  } catch (err) {
    console.log(err);
  }

  res.redirect("/checkout");
};

exports.takeOrder = async (req, res) => {
  try {
    let user = await User.findById(req.session.user);

    newUser = await user.populate("cart.productId").execPopulate();
  } catch (err) {
    console.log(err);
  }
  //let order=Order.create()
  let number = uuid();
  const orderName = "Order " + number + ".pdf";
  const orderPath = path.join("data", "orders", orderName);
  const pdfkit = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'outline; filename="' + orderName + '"');

  pdfkit.pipe(fs.createWriteStream(orderPath));
  pdfkit.pipe(res);

  pdfkit.fontSize(20).text("Order nr:" + number);
  pdfkit.text("-----------------------------------------------------------");

  var pretTotal = 0;
  user.cart.forEach(element => {
    pret = element.productId.price * element.quantity;
    pdfkit
      .fontSize(17)
      .text(
        "Produs: " +
          element.productId.title +
          "------ Pret $" +
          element.productId.price +
          " x " +
          element.quantity +
          " = " +
          pret +
          "$"
      );
    pretTotal = pretTotal + pret;
  });
  pdfkit
    .fontSize(20)
    .text("-----------------------------------------------------------");
  pdfkit.fontSize(17).text("Total");
  pdfkit.fontSize(17).text(pretTotal + "$");

  pdfkit.end();

  //console.log(user.cart)

  // res.redirect('/ckeckout')
};
