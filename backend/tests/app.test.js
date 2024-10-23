require("dotenv").config({ path: ".env.test" });
const mongoose = require("mongoose");

describe("MongoDB Connection", () => {
  it("should connect to MongoDB successfully", async () => {
    await mongoose.connect(process.env.MONGO_URL);
    const state = mongoose.connection.readyState;
    expect(state).toBe(1);
    await mongoose.disconnect();
  }, 10000);
});
