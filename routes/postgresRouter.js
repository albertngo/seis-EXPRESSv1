let express = require("express");
let router = express.Router();
let postgresController = require("../api/controllers/postgresController");

router.get("/", () => {
  let retries = 5;
  while (retries) {
    try {
      postgresController.postgres_get_controller;
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(`Retires left: ${retries}`);
      let wait = new Promise((res) => {
        setTimeout(res, 5000);
      });
    }
  }
});

module.exports = router;
