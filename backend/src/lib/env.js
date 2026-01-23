import "dotenv/config"

export const ENV = {
    PORT : process.env.PORT || 3000,
MONGO_URI : process.env.MONGO_URI,
NODE_ENV : process.env.NODE_ENV,
JWT_SECRET : process.env.JWT_SECRET,
RESEND_API_KEY : process.env.RESEND_API_KEY,
CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
ARCJET : process.env.ARCJET,
ARCJET_ENV : process.env.ARCJET_ENV
}