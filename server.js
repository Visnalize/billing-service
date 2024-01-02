import { LemonSqueezy } from "@lemonsqueezy/lemonsqueezy.js";
import cors from "cors";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv();

const ls = new LemonSqueezy(process.env.API_KEY);
const app = express();

app.use(cors({ origin: /localhost|visnalize.com/ }));

app.get("/verify", async (req, res) => {
  const { email, productIds: _productIds } = req.query;

  if (!email || !_productIds) {
    console.error("❌", "/verify", _productIds);
    return res.json(false).status(400);
  }

  const productIds = _productIds.split(",").map(Number);
  try {
    const response = await ls.getCustomers({
      email,
      include: ["orders", "subscriptions"],
    });

    if (!response.included) {
      console.error("❌", "/verify", email, _productIds);
      return res.json(false).status(404);
    }

    const isActive = response.included.some((r) => {
      const { product_id, status, first_order_item } = r.attributes;
      return r.type === "subscriptions"
        ? productIds.includes(product_id) && status === "active"
        : productIds.includes(first_order_item.product_id) && status === "paid";
    });

    console.info("✅", "/verify", email, _productIds);
    res.json(isActive);
  } catch (err) {
    console.error("❌", err);
    res.json(err).status(500);
  }
});

app.get("/products", async (req, res) => {
  const { name } = req.query;
  try {
    const response = await ls.getProducts();
    const products = response.data
      .filter((p) => p.attributes.slug.includes(name || ""))
      .map((p) => {
        const { store_id, price_formatted } = p.attributes;
        const [price, period] = price_formatted.split("/");
        return {
          id: p.id,
          storeId: store_id,
          type: period ? "directSubscription" : "oneTime",
          prettyPrice: price,
        };
      });
    console.info("✅", "/products", name);
    res.json(products);
  } catch (err) {
    console.error("❌", err);
    res.json(err).status(500);
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));
