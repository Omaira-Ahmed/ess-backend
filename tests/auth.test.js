const request =
require("supertest");

const app =
require("../app");

describe("Auth API", () => {

    test(
        "Register without data",
        async () => {

            const res =
            await request(app)
            .post("/api/v1/auth/register")
            .send({});

            expect(
                res.statusCode
            ).toBe(400);

        }
    );

    test(
        "Login without data",
        async () => {

            const res =
            await request(app)
            .post("/api/v1/auth/login")
            .send({});

            expect(
                res.statusCode
            ).toBe(400);

        }
    );

});