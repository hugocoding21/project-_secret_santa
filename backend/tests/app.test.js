require("dotenv").config({ path: ".env.test" });
// const app = require("../app");
const mongoose = require("mongoose");
describe("MongoDB Connection", () => {
  
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST);
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("MongoDB Connection", () => {
    it("should connect to MongoDB successfully", async () => {
      const state = mongoose.connection.readyState;
      expect(state).toBe(1);
    });
  });
});
