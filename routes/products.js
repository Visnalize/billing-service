import ls from "../lemon.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const products = async (req, res) => {
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
};

export default products;
