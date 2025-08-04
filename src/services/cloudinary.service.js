import cloudinary from "#config/cloudinary.config.js";
import { Readable } from "stream";

const cloudinaryService = {

  uploadImageToCloudinary: async({imageBuffer, folder = 'default'}) => {
    return new Promise( (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({
        folder,
        transformation: [{width: 600, height: 600, crop:'fill', gravity: 'face'}],
      },(error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      Readable.from(imageBuffer).pipe(stream);

    });
  },
  

}

export default cloudinaryService;