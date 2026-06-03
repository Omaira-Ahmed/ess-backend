const request =
require("supertest");

const app =
require("../app");

describe(
    "Leave Registration API",
    () => {

        test(
            "Register without token",
            async () => {

                const res =
                await request(app)
                .post(
                    "/api/v1/leave-register/1"
                );

                expect(
                    res.statusCode
                ).toBe(401);

            }
        );

    }
);