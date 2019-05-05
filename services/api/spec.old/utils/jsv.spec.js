const jsv = require('./../../src/utils/jsv').create(console, { allErrors:true, removeAdditional:'all' });

describe("JSON validator", () => {
  const schema1 = {
    "title": "Schema1",
    "description": "",
    "type": "object",
    "properties": {
      "number": {
        "type": "number",
        "description": "Number field"
      }
    },
    "required": ["number"]
  };
  const schema1Data = {
    number: 0
  };
  //
  const schema2 = {
    "title": "Schema2",
    "description": "",
    "type": "object",
    "properties": {
      "number": {
        "type": "invalid_type",
        "description": "Number field"
      }
    },
    "required": ["number"]
  };
  //
  beforeAll(() => {
    jsv.compile('schema1', schema1);
  });
  afterAll(() => {
  });

  it("Validate correct schema1", () => {
    expect(true).toEqual(jsv.validate('schema1', schema1Data));
  });

  it("Validate incorrect schema1", () => {
    expect(false).toEqual(jsv.validate('schema1', {}));
  });

  it("Validate schema2", () => {
    expect(false).toEqual(jsv.isCompiled('schema2'));
    expect(false).toEqual(jsv.compile('schema2', schema2));
  });
});