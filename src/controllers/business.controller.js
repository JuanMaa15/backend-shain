import businessService from "#services/business.service.js";

const businessController = {

  updateBusiness: async(req, res, next) => {

    const data = req.body;
    const id = req.params.id;
    const imageBuffer = req.file?.buffer;
    
    try {

      const updateBusiness = await businessService.updateBusiness({id, data, imageBuffer});

      return res.status(200).json({
        status: 'sucess',
        code: 200,
        data: updateBusiness
      });
    } catch (error) {
      next(error);
    }

  },

  getBusiness: async(req, res, next) => {

    const {id} = req.params;

    try {

      const bussines = await businessService.getOneBusiness(id);

      return res.status(200).json({
        status: 'sucess',
        code: 200,
        data: bussines
      });

    } catch (error) {
      next(error);
    }

  }



}

export default businessController;