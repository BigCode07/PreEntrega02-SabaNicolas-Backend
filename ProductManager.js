/*
Consigna
✓ Realizar una clase de nombre “ProductManager”,
el cual permitirá trabajar con múltiples
productos. Éste debe poder agregar, consultar,
modificar y eliminar un producto y manejarlo en
persistencia de archivos (basado en entregable
1).
Aspectos a incluir
✓ La clase debe contar con una variable this.path,
el cual se inicializará desde el constructor y debe
recibir la ruta a trabajar desde el momento de
generar su instancia.
Manejo de archivos
DESAFÍO ENTREGABLE
✓ Debe guardar objetos con el siguiente
formato:
- id (se debe incrementar
automáticamente, no enviarse
desde el cuerpo)
- title (nombre del producto)
- description (descripción del
producto)
- price (precio)
- thumbnail (ruta de imagen)
- code (código identificador)
- stock (número de piezas
disponibles)

✓Debe tener un método addProduct el
cual debe recibir un objeto con el
formato previamente especificado,
asignarle un id autoincrementable y
guardarlo en el arreglo (recuerda
siempre guardarlo como un array en el
archivo).
✓ Debe tener un método getProducts, el
cual debe leer el archivo de productos y
devolver todos los productos en
formato de arreglo.
✓ Debe tener un método getProductById,
el cual debe recibir un id, y tras leer el
archivo, debe buscar el producto con el
id especificado y devolverlo en formato
objeto

*/

const fs = require("fs");

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, "utf8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    const id = this.generateUniqueId();
    const product = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    this.products.push(product);
    this.saveProducts();
    return product;
  }

  saveProducts() {
    const data = JSON.stringify(this.products, null, 2);
    fs.writeFileSync(this.path, data, "utf8");
  }

  getProducts() {
    this.loadProducts();
    return this.products;
  }

  getProductById(id) {
    this.loadProducts();
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    updatedFields.id = id;

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updatedFields,
    };

    this.saveProducts();

    return this.products[productIndex];
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with id ${id} not found`);
    }

    const deletedProduct = this.products.splice(index, 1)[0];
    this.saveProducts();

    return deletedProduct;
  }

  generateUniqueId() {
    return Date.now().toString();
  }
}

/*
EJEMPLO

Se creará una instancia de la clase “ProductManager”
Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
Se llamará al método “addProduct” con los campos:
title: “producto prueba”
description:”Este es un producto prueba”
price:200,
thumbnail:”Sin imagen”
code:”abc123”,
stock:25
El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
*/

const productManager = new ProductManager("productos.json");

console.log(productManager.getProducts());

const newProduct = productManager.addProduct({
  title: "producto prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin imagen",
  code: "abc123",
  stock: 25,
});

console.log(productManager.getProducts());

const retrievedProduct = productManager.getProductById(newProduct.id);
console.log(retrievedProduct);

const updatedProduct = productManager.updateProduct(newProduct.id, {
  price: 250,
  stock: 30,
});
console.log(updatedProduct);

const deletedProduct = productManager.deleteProduct(newProduct.id);
console.log(deletedProduct);
