import Joi from "joi";

const cartSchema = Joi.object({
  userId: Joi.string().required(),
  products: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().required(),
        quantity: Joi.number().min(1).required(),
      })
    )
    .required(),
});

export default cartSchema;
