const express = require("express");
const path = require("path");
const fs = require("fs");
const { authorizeAdmin, authorizeUser } = require("../userRouter/authorize");

const inventoryRouter = express.Router();

const InventoryJson = path.join(__dirname, "db", "inventory.json");

inventoryRouter.post("/", authorizeAdmin, (req, res) => {
  const newProduct = req.body;
  fs.readFile(InventoryJson, "utf-8", (err, inventory) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
    }
    const ParsedInventory = JSON.parse(inventory);
    newProduct.id = ParsedInventory.length + 1;
    const newInventory = [...ParsedInventory, newProduct];
    fs.writeFile(InventoryJson, JSON.stringify(newInventory), (err) => {
      if (err) {
        res.status(500).json({
          data: null,
          message: "Error, Could not save Product to database.",
        });
      }
    });
    res.status(200).send(newProduct);
  });
});

inventoryRouter.get("/", authorizeUser, (req, res) => {
  fs.readFile(InventoryJson, "utf-8", (err, inventory) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
      return;
    }
    res.status(200).send(inventory);
  });
});

inventoryRouter.get("/:id", authorizeUser, (req, res) => {
  const id = req.params.id;
  console.log(id);
  fs.readFile(InventoryJson, "utf-8", (err, inventory) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
    }
    const ParsedInventory = JSON.parse(inventory);
    const index = ParsedInventory.findIndex((item) => item.id == id);
    console.log(index);
    if (index == -1) {
      res.status(404).json({
        data: null,
        message: "item not found",
      });
      return;
    }
    res.status(200).send(ParsedInventory[index]);
  });
});

inventoryRouter.patch("/:id", authorizeAdmin, (req, res) => {
  const id = req.params.id;
  const upadetedDetails = req.body;
  fs.readFile(InventoryJson, "utf-8", (err, inventory) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
      return;
    }
    const ParsedInventory = JSON.parse(inventory);
    const index = ParsedInventory.findIndex((item) => item.id == id);
    if (index === -1) {
      res.status(404).json({
        data: null,
        message: "item not found",
      });
      return;
    }
    const updateProduct = { ...ParsedInventory[index], ...upadetedDetails };
    ParsedInventory.splice(index, 1, updateProduct);
    fs.writeFile(InventoryJson, JSON.stringify(ParsedInventory), (err) => {
      if (err) {
        res.status(500).json({
          data: null,
          message: "Internal Server Error. Could not save Product to database.",
        });
      }
    });
    res.status(200).send(updateProduct);
  });
});

inventoryRouter.delete("/:id", authorizeAdmin, (req, res) => {
  const id = req.params.id;
  fs.readFile(InventoryJson, "utf-8", (err, inventory) => {
    if (err) {
      res.status(404).json({
        data: null,
        error: "occured while making request",
      });
      return;
    }
    const ParsedInventory = JSON.parse(inventory);
    const index = ParsedInventory.findIndex((item) => item.id == id);
    if (index === -1) {
      res.status(404).json({
        data: null,
        message: "item not found",
      });
      return;
    }
    const deletedProduct = ParsedInventory.splice(index, 1);
    fs.writeFile(InventoryJson, JSON.stringify(ParsedInventory), (err) => {
      if (err) {
        res.status(404).json({
          data: null,
          message: "item not found",
        });
        return;
      }
      res.status(200).send(deletedProduct);
    });
  });
});

module.exports = {
  inventoryRouter,
};
