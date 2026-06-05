import { Inventory } from "../models/Inventory.js";
import { notificationService } from "../services/notificationService.js";

export async function createInventoryItem(req, res) {
  try {
    const { name, sku, quantity, reorderLevel, unitPrice, photoUrl } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Item name is required" });
    }

    const item = await Inventory.create({
      userId: req.user.userId,
      name,
      sku,
      photoUrl,
      quantity: parseInt(quantity) || 0,
      reorderLevel: parseInt(reorderLevel) || 3,
      unitPrice: parseFloat(unitPrice) || 0
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: "Could not create inventory item", error: error.message });
  }
}

export async function updateInventoryItem(req, res) {
  try {
    const { itemId } = req.params;
    const item = await Inventory.update(itemId, req.user.userId, req.body);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error: error.message });
  }
}

export async function listInventory(req, res) {
  try {
    const items = await Inventory.findByUserId(req.user.userId);
    const itemsWithValue = items.map((item) => ({
      ...item,
      stock_value: parseFloat(item.quantity) * parseFloat(item.unit_price)
    }));

    res.json(itemsWithValue);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory", error: error.message });
  }
}

export async function getInventoryItem(req, res) {
  try {
    const { itemId } = req.params;
    const item = await Inventory.findById(itemId, req.user.userId);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item", error: error.message });
  }
}

export async function deleteInventoryItem(req, res) {
  try {
    const { itemId } = req.params;
    const deleted = await Inventory.delete(itemId, req.user.userId);

    if (!deleted) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item deleted", itemId });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error: error.message });
  }
}

export async function getLowStockItems(req, res) {
  try {
    const items = await Inventory.getLowStockItems(req.user.userId);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch low stock items", error: error.message });
  }
}

export async function getInventorySummary(req, res) {
  try {
    const summary = await Inventory.getInventorySummary(req.user.userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch inventory summary", error: error.message });
  }
}

export async function updateQuantity(req, res) {
  try {
    const { itemId } = req.params;
    const { quantity, operation } = req.body;

    if (!quantity || !operation) {
      return res.status(400).json({ message: "quantity and operation are required" });
    }

    const item = await Inventory.findById(itemId, req.user.userId);
    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    const currentQty = parseInt(item.quantity) || 0;
    const changeQty = parseInt(quantity);
    let newQty = currentQty;

    if (operation === "add") {
      newQty = currentQty + changeQty;
    } else if (operation === "subtract") {
      newQty = Math.max(0, currentQty - changeQty);
    } else if (operation === "set") {
      newQty = changeQty;
    }

    const updated = await Inventory.update(itemId, req.user.userId, { quantity: newQty });

    // Check if low stock
    if (newQty <= parseInt(item.reorder_level)) {
      await notificationService.sendLowStockAlert(itemId, req.user.userId);
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update quantity", error: error.message });
  }
}
