let postgres = require("../../databases/postgres");

exports.postgres_get_controller = (req, resp) => {
  console.log("Reached Here");

  let retries = 5;
  while (retries) {
    try {
      postgres.connect().then(performQueries, console.error);
      break;
    } catch (e) {
      retries -= 1;
      console.log(`There was an error connecting ${e}`);
      let timeout = new Promise((resp) => setTimeout(resp, 5000));
    }
  }

  function performQueries(client) {
    console.log("Connected to postgres UPDATED VERSION 3!");

    client
      .query(
        "SELECT * from information_schema.tables WHERE table_name = 'ass_test_table';"
      )
      .then((result) => {
        console.log, console.error;
        resp.send(result);
      });
  }
};
