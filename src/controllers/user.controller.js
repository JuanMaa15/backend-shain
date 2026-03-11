import userService from "#services/user.service.js";

const userController = {


  updateUser: async(req, res, next) => {
    const data = req.body;
    const id = req.params.id;

    try {
      
      const updateUser = await userService.updateUser(id, data);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          name: updateUser.name,
          username: updateUser.username,
          email: updateUser.email
        }
      });

    } catch (error) {
      next(error);
    }
  },

  updateUserStatus: async(req, res, next) => {

    const {status} = req.body;
    const user = req.params.id;

    try {

      const updateUser = await userService.updateUser(user, {status});

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          name: updateUser.name,
          username: updateUser.username,
          email: updateUser.email
        }
      });

    } catch (error) {
      next(error);
    }

  },

  updateReferralCodeUser: async(req, res, next) => {

    const {referralCode} = req.body;
    const {id} = req.params;

    try {
      
      const updateUser = await userService.updateReferralCodeUser(id, referralCode);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          name: updateUser.name,
          username: updateUser.username,
          email: updateUser.email,
          referralCode: updateUser.referralCode
        }

      });

    } catch (error) {
      next(error);
    }

  },

  updateMyprofile: async(req, res, next) => {

    const user = req.user.id;
    const data = req.body;

    try {
      
      const updateUser = await userService.updateUser(user, data);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: {
          name: updateUser.name,
          username: updateUser.username,
          email: updateUser.email,
          goaL: updateUser.goal ?? 0,
        } 
      }); 
    } catch (error) {
      next(error);
    }

  },

  getUsers: async(req, res, next) => {

    try {
      
      const users = await userService.getAllUsers();

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: users
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

  },

  getUsersWithReferralCode: async(req, res, next) => {
    try {
      
      const users = await userService.getUsersWithReferralCode();

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: users
      });

    } catch (error) {
      next(error);
    }
  },

  getUsersByReferredByCode: async(req, res, next) => {

    const {code: referredByCode} = req.query;

    try {
      
      const users = await userService.getUsersByReferredByCode(referredByCode);

      return res.status(200).json({
        status: 'success',
        code: 200,
        data: users
      });

    } catch (error) {
      next(error);
    }

  },

  getUsersByBusiness: async(req, res, next) => {

    const { business } = req.user;

    try {
      
      const users = await userService.getUsersByBusiness(business);

      return res.status(200).json({
        users
      });

    } catch (error) {
      next(error);
    }

  },

}   

export default userController;

