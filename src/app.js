const path = require("path");
const express = require("express");
const hbs = require("hbs");
const geocode = require("./utils/geocode");
const forcast = require("./utils/forecast");

// console.log(__dirname);

const app = express();
const port = process.env.PORT || 3000;

// *Define paths for Express config
const publicDirectory = path.join(__dirname, "../public");
const viewsPath = path.join("__dirname", "../templates/views");
// partials includes those elements which are repetative in different pages
const partialsPath = path.join("__dirname", "../templates/partials");

// *Setup handlebars engine & views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// *Setup static directory to serve
app.use(express.static(publicDirectory));

// To show the hbs on the server we need to get it
app.get("", (req, res) => {
  res.render("index", {
    title: "Weather",
    name: "Fardis Amouzadeh",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Me",
    name: "Fardis Amouzadeh",
  });
});

app.get("/help", (req, res) => {
  res.render("help", {
    helpText: "This is some helpful text!",
    title: "Help",
    name: "Fardis Amouzadeh",
  });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send({ error: "You must provide an address in query string!" });
  }
  geocode(
    req.query.address,
    (error, { latitude, longtitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }
      forcast(latitude, longtitude, (error, forcastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forcast: forcastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get("/products", (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: "You must provide a search term!",
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

// This means any page that has not been matched so far that starts with /help/
app.get("/help/*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Fardis Amouzadeh",
    errormsg: "Help article not found.",
  });
});

// Now we want to setup a handler for 404 pages, '*' means match anything that has not been matched so far.
// * means match everything
app.get("*", (req, res) => {
  res.render("404", {
    title: "404",
    name: "Fardis Amouzadeh",
    errormsg: "Page not found.",
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}!`);
});
