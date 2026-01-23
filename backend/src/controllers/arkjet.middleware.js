import aj from '../lib/arkjet.js'
import { isSpoofedBot } from '@arcjet/inspect'

export const arkjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req)
        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                return res.status(429).json({ message: "Rate limit exceded. Please try again later" })
            } else if (decision.reason.isBot()) {
                return res.status(483).json({ message: "Bot access denied" })

            }
            else {
                return res.status(483).json({ message: "Access denied by security policies" })
            }
        }
        if (decision.results.some(isSpoofedBot)) {
            return res.status(483).json({ message: "Bot access denied" })
        }
        next()
    } catch (error) {
        console.error("Arkjet Middleware Error:", error)
        res.status(500).json({ message: "Internal Server Error" })
    }
}