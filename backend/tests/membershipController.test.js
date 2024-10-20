const request = require("supertest");
const app = require("../app");
const Membership = require("../src/models/membershipModel");
const Group = require("../src/models/GroupModel");
const User = require("../src/models/userModel");
const jwt = require("jsonwebtoken");

describe("Group Membership API", () => {
  let token;
  const mockGroupId = "507f191e810c19729de860ea";
  const mockUserId = "507f191e810c19729de860eb";

  beforeAll(() => {
    jest.clearAllMocks();
    token = jwt.sign({ id: mockUserId }, process.env.JWT_KEY, { expiresIn: "1h" });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("PUT /groups/:groupId/members/:userId", () => {
    it("should return 404 if group is not found", async () => {
      Group.findbyId = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put(`/groups/${mockGroupId}/members/${mockUserId}`)
        .set("Authorization", token)
        .send({ isAccepted: true });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Group not found");
    });

    it("should return 404 if member is not found", async () => {
      const userId = "507f191e810c19729de860eb";
      Group.findById = jest.fn().mockResolvedValue({ _id: mockGroupId, ownerId: "507f191e810c19729de860eb" });
      Membership.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .put(`/groups/${mockGroupId}/members/${userId}`)
        .set("Authorization", token)
        .send({ isAccepted: true });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Member not found in this group");
    });
    it("should update the member status", async () => {
      const mockMembership = { userId: mockUserId, groupId: mockGroupId, isAccepted: false };
      Group.findById = jest.fn().mockResolvedValue({ _id: mockGroupId, ownerId: "507f191e810c19729de860eb" });
      Membership.findOne = jest.fn().mockResolvedValue(mockMembership);
      Membership.prototype.save = jest.fn().mockResolvedValue(mockMembership);
      const res = await request(app)
        .put(`/groups/${mockGroupId}/members/${mockUserId}`)
        .set("Authorization", token)
        .send({ isAccepted: true });
      expect(res.status).toBe(200);
      expect(res.body).toEqual(mockMembership);
    });
  });

  describe("POST /groups/:groupId/members", () => {
    it("should add a member to the group", async () => {
      const mockUser = { _id: mockUserId, email: "test@example.com" };
      const mockMembership = {
        userId: mockUserId,
        groupId: mockGroupId,
        isAccepted: false,
      };

      Group.findById = jest.fn().mockResolvedValue({ _id: mockGroupId, ownerId: mockUserId });
      User.findOne = jest.fn().mockResolvedValue(mockUser);
      Membership.findOne = jest.fn().mockResolvedValue(null);
      Membership.prototype.save = jest.fn().mockResolvedValue(mockMembership);

      const res = await request(app)
        .post(`/groups/${mockGroupId}/members`)
        .set("Authorization", token)
        .send({ email: "test@example.com" });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("message", "Invitation sent");
      expect(res.body.membership).toMatchObject(mockMembership);
    });

    it("should return 404 if group is not found", async () => {
      Group.findById = jest.fn().mockResolvedValue(null);
      User.findOne = jest.fn().mockResolvedValue(null);

      const res = await request(app)
        .post(`/groups/${mockGroupId}/members`)
        .set("Authorization", token)
        .send({ email: "test@example.com" });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Group not found");
    });

    it("should return 404 if user is not found", async () => {
      Group.findById.mockResolvedValue({ _id: mockGroupId, ownerId: "507f191e810c19729de860eb" });

      const res = await request(app)
        .post(`/groups/${mockGroupId}/members`)
        .set("Authorization", token)
        .send({ email: "nonexistent@example.com" });

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "User not found");
    });

    it("should return 400 if user is already a member", async () => {
      Group.findById = jest.fn().mockResolvedValue({ _id: mockGroupId, ownerId: "507f191e810c19729de860eb" });
      User.findOne = jest.fn().mockResolvedValue({ _id: mockUserId });
      Membership.findOne = jest.fn().mockResolvedValue({});

      const res = await request(app)
        .post(`/groups/${mockGroupId}/members`)
        .set("Authorization", token)
        .send({ email: "test@example.com" });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("message", "User is already a member or invited");
    });
  });

  describe("GET /groups/:groupId/members", () => {
    it("should return all members of the group", async () => {
      const mockUser = { _id: "507f191e810c19729de860eb", username: "testUser", email: "test@szsz.com" };
      const mockMemberships = [
        {
          _id: "membershipId1",
          groupId: mockGroupId,
          userId: mockUser._id,
          isAccepted: false,
        },
      ];
      Membership.find = jest.fn().mockResolvedValue(mockMemberships);
      Membership.find = jest.fn().mockImplementation(() => {
        return {
          populate: jest.fn().mockResolvedValue([{ ...mockMemberships[0], user: mockUser }]),
        };
      });

      const res = await request(app).get(`/groups/${mockGroupId}/members`).set("Authorization", token);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([{ ...mockMemberships[0], user: mockUser }]);
    });
  });

  describe("DELETE /groups/:groupId/members/:userId", () => {
    it("should remove a member from the group", async () => {
      const mockMembership = { userId: mockUserId, groupId: mockGroupId };

      Group.findById = jest.fn().mockResolvedValue({ _id: mockGroupId, ownerId: "507f191e810c19729de860eb" });
      Membership.findOneAndDelete = jest.fn().mockResolvedValue(mockMembership);

      const res = await request(app).delete(`/groups/${mockGroupId}/members/${mockUserId}`).set("Authorization", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("message", "Member successfully removed");
    });

    it("should return 404 if group is not found", async () => {
      Group.findById = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete(`/groups/${mockGroupId}/members/${mockUserId}`).set("Authorization", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Group not found");
    });

    it("should return 404 if member is not found", async () => {
      Group.findById = jest.fn().mockResolvedValue({ _id: mockGroupId, ownerId: "507f191e810c19729de860eb" });
      Membership.findOneAndDelete = jest.fn().mockResolvedValue(null);

      const res = await request(app).delete(`/groups/${mockGroupId}/members/${mockUserId}`).set("Authorization", token);

      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty("message", "Member not found in this group");
    });
  });
});
