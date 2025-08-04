import Business from "#models/business.model.js";
import cloudinaryService from "./cloudinary.service.js";

const businessService = {

  createBusiness: async(data) =>  await Business.create(data),

  updateBusiness: async({id, data, imageBuffer}) => {

    const image = await cloudinaryService.uploadImageToCloudinary({imageBuffer, folder:'business'});

    let fullData = data;

    if (imageBuffer)
      fullData = {...data, image: image.secure_url}

    const updateBusiness = await Business.findByIdAndUpdate(id, fullData, {new: true});

    return updateBusiness;
  },

  getOneBusinessByUser: async(user) => await Business.findOne({user}),

}

export default businessService;