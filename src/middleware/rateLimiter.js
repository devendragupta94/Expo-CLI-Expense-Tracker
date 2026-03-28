import ratelimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) => {
    try {
        // here we just keep it simple
        // in a real-world app you'd like to put the UserId or IPAddress as your key
        const {success} = await ratelimit.limit("my-rate-limit")
        if(!success){
            return res.status(429).json({
                message:"Too many requests, please try again later."
            })
        }
        next();
    } catch (error) {
        console.log("Rate limit error", error)
        next(error)
    }
}

export default rateLimiter;