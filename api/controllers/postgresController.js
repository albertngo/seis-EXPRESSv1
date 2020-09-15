let postgres = require("../../databases/postgres");

exports.postgres_get_controller = (req, resp) => {
  postgres
    .query('SELECT * FROM public."People"')
    .then((results) => {
      console.log(results);
      resp.send({ allData: results.rows });
    })
    .catch((e) => console.log(e));
};
