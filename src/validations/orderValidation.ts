import Joi from "joi";

const orderSchema = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .required(),
  amount: Joi.number().min(0).required(),
  address: Joi.object().required(),
  status: Joi.string().valid("pending", "shipped", "delivered", "cancelled"),
});

export default orderSchema;
