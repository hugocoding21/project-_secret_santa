require("dotenv").config({ path: ".env.test" });
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../src/models/userModel");

describe("User API", () => {
  beforeAll(async () => {
    await mongoose.createConnection(process.env.MONGO_URI_TEST);
    await request(app).post("/register").send({
      username: "testuser",
      email: "testuser@example.com",
      password: "password123",
    });
    const res = await request(app).post("/login").send({
      email: "testuser@example.com",
      password: "password123",
    });
    this.body = res.body;
  });

  afterAll(async () => {
    jest.clearAllMocks();

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("POST /register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/register").send({
        username: "testuser2",
        email: "testuser2@example.com",
        password: "password123",
      });
      expect(res.status).toBe(201);
      expect(res.body.message).toMatch(/User created: testuser2@example.com/);
    });

    it("should not register an existing user", async () => {
      const res = await request(app).post("/register").send({
        username: "testuser",
        email: "testuser@example.com",
        password: "password123",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email already used");
    });
  });

  describe("POST /login", () => {
    it("should login an existing user", async () => {
      const res = await request(app).post("/login").send({
        email: "testuser@example.com",
        password: "password123",
      });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.userId).toBeDefined();
    });

    it("should not login with incorrect credentials", async () => {
      const res = await request(app).post("/login").send({
        email: "testuser@example.com",
        password: "wrongpassword",
      });
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid email or password");
    });
  });

  describe("GET /users/:user_id", () => {
    it("should retrieve user data successfully", async () => {
      const res = await request(app).get(`/users/${this.body.userId}`).set("Authorization", `${this.body.token}`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", "testuser@example.com");
      expect(res.body).toHaveProperty("username", "testuser");
    });

    it("should return 400 for invalid user ID", async () => {
      const res = await request(app).get("/users/invalidUserId").set("Authorization", `${this.body.token}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid format ID");
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentUserId = "507f191e810c19729de860ea";

      const res = await request(app).get(`/users/${nonExistentUserId}`).set("Authorization", `${this.body.token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });

  describe("PUT /users/:user_id", () => {
    let userId;

    beforeAll(async () => {
      const user = await User.findOne({ email: "testuser@example.com" });
      userId = user._id;
    });

    it("should update user data", async () => {
      const res = await request(app)
        .put(`/users/${userId}`)
        .set("Authorization", `${this.body.token}`)
        .send({ username: "updatedUser" });
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("username", "updatedUser");
    });

    it("should return 404 for non-existent user", async () => {
      const nonExistentUserId = "507f191e810c19729de860ea";

      const res = await request(app)
        .put(`/users/${nonExistentUserId}`)
        .set("Authorization", `${this.body.token}`)
        .send({ username: "updatedUser" });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });

    it("should return 400 for invalid user ID", async () => {
      const res = await request(app)
        .put("/users/invalidUserId")
        .set("Authorization", `${this.body.token}`)
        .send({ username: "updatedUser" });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid format ID");
    });
  });

  describe("DELETE /users/:user_id", () => {
    let userId;

    beforeAll(async () => {
      const user = await User.findOne({ email: "testuser@example.com" });
      userId = user._id;
    });

    it("should delete a user", async () => {
      const res = await request(app).delete(`/users/${userId}`).set("Authorization", `${this.body.token}`);
      expect(res.status).toBe(200);
      expect(res.body.message).toBe("User deleted successfully");
    });

    it("should return 404 for invalide Id", async () => {
      const res = await request(app).delete("/users/dede").set("Authorization", `${this.body.token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Invalid format ID");
    });
    it("should return 404 for non-existent user", async () => {
      const res = await request(app)
        .delete("/users/507f191e810c19729de860ea")
        .set("Authorization", `${this.body.token}`);
      expect(res.status).toBe(404);
      expect(res.body.message).toBe("User not found");
    });
  });
});
