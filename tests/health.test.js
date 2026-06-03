const request =
require("supertest");

const app =
require("../app");

describe("Health Check", () => {

    test(
        "GET /health",
        async () => {

            const res =
            await request(app)
            .get("/health");

            expect(
                res.statusCode
            ).toBe(200);

            expect(
                res.body.status
            ).toBe("UP");

        }
    );

});