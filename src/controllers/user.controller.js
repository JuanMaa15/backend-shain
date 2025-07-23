import userService from "#services/user.service.js";

const userController = {

  updateUser: async(req, res, next) => {

    const {id} = req.params;
    const data = req.body;

    try {
      
      const updateUser = await userService.updateUser(id, data);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          name: updateUser.name,
          username: updateUser.username,
          email: updateUser.email,
        } 
      }); 
    } catch (error) {
      next(error);
    }

  },

  getUser: async(req, res, next) => {

    const {id} = req.params;

    try {
      
      const user = await userService.getOneUser(id);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: user
      });

    } catch (error) {
      next(error);
    }

  }

}   

export default userController;

