import "dotenv/config"

export const ENV = {
    PORT : process.env.PORT || 3000,
MONGO_URI : process.env.MONGO_URI,
NODE_ENV : process.env.NODE_ENV,
JWT_SECRET : process.env.JWT_SECRET,
RESEND_API_KEY : process.env.RESEND_API_KEY
}