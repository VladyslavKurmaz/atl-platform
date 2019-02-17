var req = require("request");

describe("API v1", () => {
  var context;
  beforeAll(() => {
    context = require("./../../../src/server")();
  });
  afterAll(() => {
    context.server.close();
  });
  describe("GET /api/v1", () => {
    var data = {};
    beforeAll((done) => {
      const h = 'localhost'; // context.params.host;
      const p = context.params.port;
      req.get(`http://${h}:${p}/api/v1`, (error, response, body) => {
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