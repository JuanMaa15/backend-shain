import businessController from "#controllers/business.controller.js";
import { authorizeAccess, authRequired } from "#middlewares/auth.middleware.js";
import { upload } from "#middlewares/validateImage.middleware.js";
import { validateSchema } from "#middlewares/validateSchema.middleware.js";
import Business from "#models/business.model.js";
import businessSchema from "#schemas/business.schema.js";
import { Router } from "express";

const router = Router();

router.patch(
  '/:id', 
  authRequired, 
  authorizeAccess({model:Business}), 
  upload.single('image'),
  validateSchema(businessSchema.updateBusiness), 
  businessController.updateBusiness
);

router.get('/:userId', businessController.getBusiness);

export default router;