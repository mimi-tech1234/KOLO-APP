import { db } from "../config/db.js";

export const pricingService = {
  async getMarketPrices(region, category = null, currency = "NGN") {
    try {
      let query = "SELECT * FROM price_benchmarks WHERE region = $1 AND currency = $2";
      const values = [region, currency];

      if (category) {
        query += ` AND category = $3`;
        values.push(category);
      }

      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      console.error("Error fetching market prices:", error);
      throw error;
    }
  },

  async getAllRegions() {
    try {
      const { rows } = await db.query(
        "SELECT DISTINCT region FROM price_benchmarks ORDER BY region"
      );
      return rows.map((r) => r.region);
    } catch (error) {
      console.error("Error fetching regions:", error);
      throw error;
    }
  },

  async getCategories(region) {
    try {
      const { rows } = await db.query(
        "SELECT DISTINCT category FROM price_benchmarks WHERE region = $1 ORDER BY category",
        [region]
      );
      return rows.map((r) => r.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  async calculateProfitMargin(itemName, sellingPrice, region) {
    try {
      const { rows } = await db.query(
        "SELECT benchmark_price FROM price_benchmarks WHERE item_name ILIKE $1 AND region = $2 LIMIT 1",
        [`%${itemName}%`, region]
      );

      if (rows.length === 0) {
        return {
          success: false,
          message: "Benchmark price not found for this item",
          sellingPrice: parseFloat(sellingPrice)
        };
      }

      const benchmarkPrice = parseFloat(rows[0].benchmark_price);
      const margin = sellingPrice - benchmarkPrice;
      const marginPercent = ((margin / benchmarkPrice) * 100).toFixed(2);

      return {
        success: true,
        sellingPrice: parseFloat(sellingPrice),
        benchmarkPrice,
        margin: parseFloat(margin.toFixed(2)),
        marginPercent: parseFloat(marginPercent),
        status: margin > 0 ? "Above market" : "Below market"
      };
    } catch (error) {
      console.error("Error calculating profit margin:", error);
      throw error;
    }
  },

  async seedMarketPrices(prices) {
    try {
      for (const price of prices) {
        await db.query(
          `INSERT INTO price_benchmarks (region, item_name, category, benchmark_price, currency, source)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT DO NOTHING`,
          [
            price.region,
            price.itemName,
            price.category,
            price.benchmarkPrice,
            price.currency || "NGN",
            price.source || "manual"
          ]
        );
      }

      return { success: true, message: "Prices seeded successfully" };
    } catch (error) {
      console.error("Error seeding prices:", error);
      throw error;
    }
  }
};
