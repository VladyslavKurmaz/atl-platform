'use strict';

const req = require("request");

describe("Appl", () => {
  let server;
  beforeAll(() => {
    server = require('./../src/server').run4tests();
  });
  afterAll(() => {
    server.stop();
  });
  describe("GET /healthcheck", () => {
    var data = {};
    beforeAll((done) => {
      req.get(server.params.buildEndpoint(['healthcheck']), (error, response, body) => {
        data.status = response.statusCode;
        data.body = JSON.parse(body);
        done();
      });
    });
    it("Status 200", () => {
      expect(data.status).toBe(200);
    });
    it("Body", () => {
      expect(data.body.success).toBe(true);
    });
  });
});