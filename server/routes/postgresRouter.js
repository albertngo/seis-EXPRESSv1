let express = require("express");
let router = express.Router();
let postgresController = require("../api/controllers/postgresController");

router.get("/", postgresController.postgres_get_controller);

module.exports = router;
