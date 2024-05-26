import Joi from "joi";

const productSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  desc: Joi.string().required(),
  img: Joi.string().required(),
  categories: Joi.array().items(Joi.string()),
  size: Joi.string(),
  color: Joi.string(),
  price: Joi.number().min(0).required(),
});

export default productSchema;
