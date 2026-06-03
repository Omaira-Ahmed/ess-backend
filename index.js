require("dotenv").config();

const app = require("./app");
const logger = require("./utils/logger")

const PORT = process.env.PORT || 3000;

// ONLY start server if NOT testing
if (process.env.NODE_ENV !== "test") {

    app.listen(PORT, () => {
        logger.info(`Server running on port ${PORT}`);
    });

}