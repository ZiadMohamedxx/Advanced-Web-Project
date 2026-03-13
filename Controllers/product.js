import Product from "../Models/product.js";

const createProduct = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.description ||
      req.body.price === undefined ||
      req.body.quantity === undefined
    ) {
      res.status(400).send({
        message: "Send all required fields: name, description, price, quantity",
      });
      return;
    }

    const newProduct = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
    };

    const product = await Product.create(newProduct);
    res.status(201).send(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
};

export { createProduct, getAllProducts, getProductById };