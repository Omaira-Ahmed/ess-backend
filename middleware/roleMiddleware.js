const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {

        // must come AFTER authMiddleware
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized - no user found"
            });
        }

        // IMPORTANT FIX: default safety check
        const userRole = req.user.role;

        if (!userRole) {
            return res.status(403).json({
                message: "Role missing in token (fix login payload)"
            });
        }

        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                message: `Access denied for role: ${userRole}`
            });
        }

        next();
    };
};

module.exports = roleMiddleware;