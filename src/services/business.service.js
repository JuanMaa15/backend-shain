import Business from "#models/business.model.js";
import cloudinaryService from "./cloudinary.service.js";

const businessService = {

  createBusiness: async(data) =>  await Business.create(data),

  updateBusiness: async({id, data, imageBuffer}) => {
     
    let fullData = data;

    if (imageBuffer){
      const image = await cloudinaryService.uploadImageToCloudinary({imageBuffer, folder:'business'});
      fullData = {...data, image: image.secure_url}
    }
    
    const updateBusiness = await Business.findByIdAndUpdate(id, fullData, {new: true});

    return updateBusiness;
  },

  getOneBusiness: async(id) => await Business.findById(id),

  getOneBusinessByUser: async(user) => await Business.findOne({user}),

  getOneBusinessbyCode: async(code) => await Business.findOne({businessJoinCode: code}),

}

export default businessService;