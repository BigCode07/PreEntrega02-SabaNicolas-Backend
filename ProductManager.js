const fs = require("fs");

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.idCounter = 1;
  }

  addProduct(productObject) {
    if (
      !productObject.title ||
      !productObject.description ||
      !productObject.price ||
      !productObject.thumbnail ||
      !productObject.code ||
      !productObject.stock
    ) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    if (this.products.some((product) => product.code === productObject)) {
      console.error("El codigo ya existe. Debe ser unico");
      return;
    }

    const product = {
      id: this.idCounter++,
      title: productObject.title,
      description: productObject.description,
      price: productObject.price,
      thumbnail: productObject.thumbnail,
      code: productObject.code,
      stock: productObject.stock,
    };
    this.products.push(product);
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      const products = JSON.parse(data);
      this.products = products;
      return this.products;
    } catch (err) {
      console.error("Error al leer el archivo de productos:", err);
      return [];
    }
  }

  getProductById(id) {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      const products = JSON.parse(data);
      const foundProduct = products.find((product) => product.id === id);
      if (foundProduct) {
        return foundProduct;
      } else {
        console.error("Producto no encontrado.");
        return null;
      }
    } catch (err) {
      console.error("Error al leer el archivo de productos:", err);
      return null;
    }
  }

  updateProduct(id, updatedProduct) {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      let products = JSON.parse(data);
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products[index] = { ...products[index], ...updatedProduct };
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        return true;
      } else {
        console.error("Producto no encontrado.");
        return false;
      }
    } catch (err) {
      console.error("Error al leer/escribir el archivo de productos:", err);
      return false;
    }
  }

  deleteProduct(id) {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      let products = JSON.parse(data);
      const index = products.findIndex((product) => product.id === id);
      if (index !== -1) {
        products.splice(index, 1);
        fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
        return true;
      } else {
        console.error("Producto no encontrado.");
        return false;
      }
    } catch (err) {
      console.error("Error al leer/escribir el archivo de productos:", err);
      return false;
    }
  }

  displayProducts() {
    this.products.forEach((product) => console.log(product.toString()));
  }
}

const productManager = new ProductManager();

console.log("Productos al inicio", productManager.getProduct());

productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

console.log(
  "\nProductos despues de agregar uno:",
  productManager.getProducts()
);

productManager.addProduct(
  "Otro producto",
  "Otra descripción",
  150,
  "Otra imagen",
  "abc123",
  30
);

console.log(
  "\nProductos después de intentar agregar un producto duplicado:",
  productManager.getProducts()
);

const productIdToFind = 1;
const foundProduct = productManager.getProductById(productIdToFind);

if (foundProduct) {
  console.log(`\nProducto encontrado por ID (${productIdToFind}):`);
  console.log(foundProduct);
} else {
  console.error(`\nProducto no encontrado por ID (${productIdToFind}).`);
}

module.exports = ProductManager;
