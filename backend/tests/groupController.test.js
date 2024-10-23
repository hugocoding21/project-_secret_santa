require("dotenv").config({ path: ".env.test" });
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");
const Group = require("../src/models/GroupModel");
const secretSantaAssignmentModel = require("../src/models/secretSantaAssignmentModel");

jest.mock("../src/models/GroupModel");
jest.mock("../src/models/secretSantaAssignmentModel");

describe("Group API", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ id: "507f191e810c19729de860ea" }, process.env.JWT_KEY, { expiresIn: "1h" });
  });

  afterAll(() => {
    jest.clearAllMocks();
    mongoose.connection.dropCollection("groups");
  });

  it("should create a new group", async () => {
    const mockGroup = { _id: "507f191e810c19729de860ea", name: "Test Group", santaDate: "2027-01-11T00:00:00.000Z" };

    Group.prototype.save = jest.fn().mockResolvedValue(mockGroup);

    const res = await request(app)
      .post("/groups")
      .set("Authorization", token)
      .send({ name: "Test Group", santaDate: "2027-01-11T00:00:00.000Z" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockGroup);
  });

  it("should retrieve all groups", async () => {
    const mockGroups = [
      { _id: "507f191e810c19729de860ea", name: "Group 1" },
      { _id: "507f191e810c19729de860eb", name: "Group 2" },
    ];

    Group.find.mockResolvedValue(mockGroups);

    const res = await request(app).get("/groups").set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(2);
    expect(res.body[0]).toHaveProperty("name", "Group 1");
  });

  it("should retrieve a group by ID", async () => {
    const mockGroup = { _id: "507f191e810c19729de860ea", name: "Test Group" };

    Group.findById.mockResolvedValue(mockGroup);

    secretSantaAssignmentModel.countDocuments.mockResolvedValue(1);

    const res = await request(app).get(`/groups/507f191e810c19729de860ea`).set("Authorization", token);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("_id", "507f191e810c19729de860ea");
    expect(res.body).toHaveProperty("name", "Test Group");
    expect(res.body).toHaveProperty("santaAssigned", true);
  });

  it("should update a group", async () => {
    const mockGroup = { _id: "507f191e810c19729de860ea", name: "Updated Group Name" };

    Group.findByIdAndUpdate.mockResolvedValue(mockGroup);

    const res = await request(app)
      .put(`/groups/507f191e810c19729de860ea`)
      .set("Authorization", token)
      .send({ name: "Updated Group Name" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("name", "Updated Group Name");
  });

  it("should delete a group", async () => {
    const mockGroup = { _id: "507f191e810c19729de860ea", name: "Test Group" };

    Group.findByIdAndDelete.mockResolvedValue(mockGroup);

    const res = await request(app).delete(`/groups/507f191e810c19729de860ea`).set("Authorization", token);

    expect(res.status).toBe(204);
  });
});
