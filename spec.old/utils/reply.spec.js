const reply = require('./../../src/utils/reply').create();

describe("Reply", () => {
  const e = ['error1', 'error2'];
  const r = ['ref1', 'ref2'];
  const d = {var:'name'};
  //
  beforeAll(() => {
  });
  afterAll(() => {
  });

  it("Success without links", () => {
    expect({success:true, data:d, refs:null}).toEqual(reply.success(d));
  });
  it("Success with links", () => {
    expect({success:true, data:d, refs:r}).toEqual(reply.success(d, r));
  });
  it("Fail", () => {
    expect({success:false, errors:e}).toEqual(reply.fail(e));
  });
});