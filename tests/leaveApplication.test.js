const request =
require("supertest");

const app =
require("../app");

describe(
    "Leave Application API",
    () => {

        test(
            "Apply leave without payload",
            async () => {

                const res =
                await request(app)
                .post(
                    "/api/v1/leave-applications"
                )
                .send({});

                expect(
                    [400,401]
                ).toContain(
                    res.statusCode
                );

            }
        );

    }
);