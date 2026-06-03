const request = require("supertest");
const app = require("../app");

describe("Leave Approval API", () => {

    test("Approve without token → should return 401", async () => {

        const res = await request(app)
            .patch("/api/v1/leave-approvals/1/approve") // FIXED METHOD
            .send();

        console.log("STATUS:", res.statusCode);
        console.log("BODY:", res.body);

        expect(res.statusCode).toBe(401);
    });

});