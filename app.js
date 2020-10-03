const express = require("express");
const ejs = require("ejs");
const mongoose = require("mongoose")
const app = express();

const bcrypt = require("bcrypt")
const saltRounds = 3;

app.use(express.urlencoded({
  extended: true
}))
app.use(express.static("public"))
app.set('view engine', 'ejs');



mongoose.connect("mongodb+srv://admin-aryan:test123@cluster0-bamzo.mongodb.net/akiraDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})



const clothSchema = new mongoose.Schema({
  name: String,
  password: String,
  orders: [{
    name: String,
    message: String
  }],
  wish: [{
    name: String,
    message: String
  }],
  sent: [{
    message: String,
    sentTo: String
  }]
});
const Item = new mongoose.model("Cloth", clothSchema);




app.get("/", function (req, res) {
  res.render("home")
})

app.get("/login", function (req, res) {
  res.render("login")
})

app.get("/register", function (req, res) {
  res.render("register")
})


app.post("/login", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const name = req.body.username;
    Item.find(function (err, found) {
      if (!err) {

        found.forEach((ele) => {
          if (ele.name == name) {
            bcrypt.compare(req.body.password, ele.password, function (err, result) {
              if (result == true) {

                res.render("customer-hp", {
                  customerName: ele.name,
                  sent: ele.sent
                })
              } else {

                res.redirect("/")
              }
            })

          }
        })

      }
    })
  })

})

app.post("/register", function (req, res) {

  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const name = req.body.username;
    let person = new Item({
      name: name,
      password: hash
    });

    person.save()

    res.render("customer-hp", {
      customerName: person.name,
      sent: person.sent
    })
  })
})






app.post("/order", function (req, res) {

  Item.find(function (err, found) {
    if (!err) {
      var i = {
        name: req.body.orderBtn,
        message: req.body.orderInput
      }

      found.forEach((ele) => {
        {
          if (ele.name !== req.body.orderBtn) {
            ele.orders.push(i)
            ele.save()
          }

        }
      })

      found.forEach((ele) => {
        if (ele.name === req.body.orderBtn) {
          ele.sent.push(({
            message: req.body.orderInput,
            sentTo: "Everyone"
          }))
          ele.save()

          res.render("customer-hp", {
            customerName: ele.name,
            orders: ele.orders,
            wish: ele.wish,
            sent: ele.sent
          })
        }
      })
    }
  })

})

app.post("/private", function (req, res) {
  Item.find(function (err, found) {
    if (!err) {
      res.render("private", {
        list: found,
        name: req.body.private
      })
    }
  })


})


app.post("/wish", function (req, res) {
  var arr1 = req.body.list.split(",")

  var j = {};
  Item.find(function (err, found) {
    if (!err) {
      found.forEach((ele) => {
        if (arr1.includes(ele.name)) {
          j = {
            name: req.body.orderBtn,
            message: req.body.orderInput
          }

          ele.wish.push(j)

          ele.save();

        }
      })

      found.forEach((ele) => {
        if (ele.name === req.body.orderBtn) {

          ele.sent.push(({
            message: req.body.orderInput,
            sentTo: req.body.list
          }))
          ele.save()

          res.render("customer-hp", {
            customerName: ele.name,
            orders: ele.orders,
            wish: ele.wish,
            sent: ele.sent
          })
        }
      })

    }
  })
})


app.post("/orderList", function (req, res) {


  Item.find(function (err, found) {
    if (!err) {
      found.forEach((ele) => {
        if (ele.name == req.body.Orders) {
          res.render("orderList", {
            orders: ele.orders
          })
        }

      })
    }
  })

  truncate = function (str, length, ending) {
    if (length == null) {
      length = 50;
    }
    if (ending == null) {
      ending = " ..."
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str
    }
  }

})

app.post("/wishList", function (req, res) {

  Item.find(function (err, found) {
    if (!err) {
      found.forEach((ele) => {
        if (ele.name == req.body.Orders) {
          console.log(ele.orders);
          console.log(ele.wish);
          res.render("wishlist", {
            orders: ele.wish
          })
        }

      })
    }
  })

})

app.get("/admin", function (req, res) {
  Item.find(function (err, found) {
    if (!err) {
      res.render("admin", {
        db: found
      })
    }
  })

})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}



app.listen(port, function () {
  console.log("The server is running successfully");
})