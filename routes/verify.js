import ls from "../lemon.js";

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const verify = async (req, res) => {
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

    console.info(isActive ? "✅" : "❌", "/verify", email, _productIds);
    res.json(isActive);
  } catch (err) {
    console.error("❌", err);
    res.json(err).status(500);
  }
};

export default verify;
