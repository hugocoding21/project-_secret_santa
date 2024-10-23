const app = require("./app");

app.listen(app.get("port"), function () {
  console.log("Serve is running at " + app.get("host") + ":" + app.get("port"));
});
