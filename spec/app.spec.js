var req = require("request");

describe("Appl", () => {
  var context;
  beforeAll(() => {
    context = require("../src/server")();
  });
  afterAll(() => {
    context.server.close();
  });
  describe("GET /healthcheck", () => {
    var data = {};
    beforeAll((done) => {
      const h = 'localhost'; //context.params.host;
      const p = context.params.port;
      req.get(`http://${h}:${p}/healthcheck`, (error, response, body) => {
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