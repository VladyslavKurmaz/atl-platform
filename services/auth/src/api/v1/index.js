'use strict';

const { ApiInfo, BaseApi } = require("./..");

class ApiV1 extends BaseApi{

  constructor(server, version, base) {
    super(server, new ApiInfo(version, base.join('/'), server.params.buildEndpoint(base), false, '2019-09-01', null));
  }

  configure() {
    super.configure();

    this.router.route('/contacts')
      // version info
      .get((req, res) => {
        return res.json(this.server.reply.success([
          {
            id: 'linkedin',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'facebook',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'github',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'google',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'stackexchange',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'twitter',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'dropbox',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'slack',
            icon: null,
            authLink: 'http://'
          },
          {
            id: 'company',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAGu0lEQVR4XuWbdYwlRRCHv8PdXYNzuEtwCBIgaICQkOAECS4BjsMhIThBgx8S3AkaHIIcFwIEt+AenMPJt+ne9M29NzNv3zzd+m/39XR3/aaruupXNSMY5jIi6D8tMCnw03DDQwB2BS4FJgceAK4A7gf+Hg5gCMC3wKwZZb8ArgGuBN7vZyAE4BNgvjpK/gc8Fk7FncAf/QaGAGwKXA3MXaDcd8B1wVze7hcgohPU/rcE9gqA6BDryV/AFsAj/QBCBCDVZX5gd2APYME6SmoWG/UrAFGvSYBNwqnYKtwS8bd/AIHSWfa01DoBtRSaA3gl4ycOAc7vae2BsgCo53nAwYnCLwBrDCcAVgeeTxT2ilwU+KCXQWjkBDj2PWDhROF7g2n0Gga+vM+AMY0AoJKnAcf2mrY5+72tUQCWBV7tIwDGNwqAur8OLN0nIIwdCgCjgFMTAMwarwK0q7KyKrBSMvhN4KkSD+8GTJmMuxX4vsRzcUj2+VFDAWAR4N3MFeoN8WIDGzkZGJ2MvwzYt8TzKjtzMk6T9ESWkSUBgU5l5FAAcAJjgNWSmc4FDiuzizCmEwDovHXiUd7QlIcKwKHAOclkXikLAP+WBKETALwErJLsTzMePVQA5gk8gvlClA2AJ7oUAJO6DzNmuzIwbqgAqOfjwPqJwh8Dn5cEwERq3mTs1yUjSt/gZMlzXsm/lVhzFmDxZJxgDAR0zQCwD6Dz6kXRfA9vFgB5RNNhyZRek7WBZ5sFwOfvC+xQLwHgS5MDHXDYzZiAz+8SeMIIgJNKs/9egMhOwA7JGOm1MuZ0LWANI4q3kaRunnj1LZEMsASwX/y7WQCmB74Cpk4W2BEwQsuTdl2DM4X9TZFsRpZrkM9sFgDnvSXzNu8Atu8SALIn1EhyLkBid0CqAGA74PZE4fFhkR9zQGjXCfBlbJvsQxMyHxiUKgCYCvgSmDGZ10VcrJ60AwB9hfHFNMkmtgHurhoA57OMpvOLYq5wSQ4AvpWtk9+NIJ2jSC7KOEEzU8PwWrIUcFTywy+A5O4EDrqKE+AaVpceLNp9h3/XMeugJ5CqADA8NQyevcNK5i2/M3BTqwBwXo/n/l0KgEVdj/9E/Q9VnQD1XqcGq/My8EMNUExEFkr+rx2/VQK89TLJkL5G287KCpmSv/0O1j4nkioBMDX+KJTM4kJHAmfVWLeVt4CFXc3RNx5lz0DbtRQAJz8TOCJZZRxg3p2VVgKwLvBksqCcpaV/G0FaDoBEp8c+FePwdzL/ayUA2RKevMWG9cyrShOIa9g8kZIPJwAqnEqrAFAfzVB6LsqBwIXtBOAk4PhkQT1vtn7okZwzGWP3SVFW53BZ4LR5Q8dp6B3F63iZ5G+pesH4tF0A6N2fBuQMu0Es5q6Zt5GqTcB+gYO6QfOwB0NhHXNdqRIAj5/3eXr9dBILiU8rUJpXWwDYPDRYxsW8Dq3EVAlyWUD1Cx7/X4seqHJzNwLG28rPgRMoQ1kX7bGlv1cFgNSYnEDMvSciHlqqRROTVwWAXECaz28MPNrEvtr2aFUAPAyotGIc7t1rK13XSxUAeOdbFosBimHvQx3W3PR3DPBa0T6qAMB+Qcvj3SbfhALIn62+Bo31T+w27QP1bfnOG6muVHECXMSPLCQhvQ2Kus6tHtlu16hYzkoZ3lrPy/ub9moCF4R95a5TBQBxAecy9ZS1KRILFjcUDUp+N81+LtMfVOtxfdHydViomstVCYBUt4WIKPYRnRKyPFljI8NY2zdkNnHKtc9krvSW8d86uOsDRW5rjnRcFFNtzbKUVAmAjKtFT8WjqElYN4xyQCYvt93etvsimS3ME7tRLgfsTYhi3c+wd8XwD/kIG6JKSZUA2E3u8VNqRYIWUCUwoyICcnGJXa4FPJOMq9WRlt5Exh+20pWKQ6oEwHYVCQtF+9bOU5ku0NJxzVymJnkwyzYPNjckYzSvmPbqZC3XDRZA80CuEgC/J4pKe/UsF+ipuP4xwOnJZiQvJU+KxL5Aa3zRf9wckq7YmGkNcGxy7A1+XLuUVAnAZuG7w7iwnRhnBydoTd5PcOJ65uqLlT2moaDpVytR/L7RU6bynqSUBjsaOKOU9i3I1W2fr1mASDbkm7NKe0/ZTQIjQyeqZpQnOkBp+EIeIE5S5QlwTkvkd2Xa59IN65j86sQyWqPiKbLAOUOdB712JWUaCrKqBsC9aat7h97faIuWpK0e26+TrRs0AoQNj8cBNmXY+6dIgxsXaG4Nf/vcCgBShXxbHlsTk1JeuSQaXqVyj86Zy/kVzddqAIrW7/jv/wMMck5n5Xm8FAAAAABJRU5ErkJggg==',
            authLink: 'http://'
          }
        ]));
    });
  }

}

module.exports.create = (server, version, base) => {
  return new ApiV1(server, version, base);
}