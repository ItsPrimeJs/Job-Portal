import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        // Check if token is present
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. No token provided.",
            });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user ID from the decoded token to the request object
        req.userId = decoded.userId;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails or any other error occurs
        console.error("Error during authentication:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export default isAuthenticated;