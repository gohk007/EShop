const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");

//routes
const port = 3000;
require("dotenv/config");
const api = process.env.API_URL;

//middle wares
app.use(bodyParser.json());
app.use(morgan("tiny"));

//Schema

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);

app.get(`/${api}/products`, async (req, res) => {

    var productList = await Product.find();

    res.send(productList);
});

app.post(`/${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock,
    });

    product
        .save()
        .then((ceatedProdct) => {
            res.status(201).json(ceatedProdct);
        })
        .catch((err) => {
            res.status(201).json({ error: err, success: false });
        });
});

mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "shop-database",
    })
    .then(() => {
        console.log("database connected.....");
    })
    .catch((err) => {
        console.log(`${err}`);
    });

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(api);
});
