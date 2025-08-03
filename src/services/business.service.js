import Business from "#models/business.model.js";

const businessService = {

  createBusiness: async(data) => await Business.create(data),

  updateBusiness: async(id, data) => await Business.findByIdAndUpdate(id, data, {new: true}),

  getOneBusinessByUser: async(user) => await Business.findOne({user}),

}

export default businessService;