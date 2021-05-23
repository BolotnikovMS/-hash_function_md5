let md5 = new function () {
  let hex = '0123456789abcdef',
      num = 0x0F,
      singleByte = 0x80,
      range = 0xFFFF,
      h1 = 0x67452301,
      h2 = 0xEFCDAB89,
      h3 = 0x98BADCFE,
      h4 = 0x10325476,
      x = [
        [0, 1, [7, 12, 17, 22]],
        [1, 5, [5, 9, 14, 20]],
        [5, 3, [4, 11, 16, 23]],
        [0, 7, [6, 10, 15, 21]]
      ],
      A = function (x, y, z) {
        return (((x >> 16) + (y >> 16) + ((z = (x & range) + (y & range)) >> 16)) << 16) | (z & range);
      },
      B = function (s) {
        let i,
          n = ((s.length + 8) >> 6) + 1,
          b = new Array(1 + n * 16).join('0').split('');
        for (i = 0; i < s.length; i++) {
          b[i >> 2] |= s.charCodeAt(i) << ((i % 4) * 8);
        }

        return (b[i >> 2] |= singleByte << ((i % 4) * 8), b[n * 16 - 2] = s.length * 8, b);
      },
      RotateLeft = function (n, c) {
        return (n << c) | (n >>> (32 - c));
      },
      C = function (q, a, b, x, s, t) {
        return A(RotateLeft(A(A(a, q), A(x, t)), s), b);
      },

      F = function (a, b, c, d, x, s, t) {
        return C((b & c) | ((~b) & d), a, b, x, s, t);
      },
      G = function (a, b, c, d, x, s, t) {
        return C((b & d) | (c & (~d)), a, b, x, s, t);
      },
      H = function (a, b, c, d, x, s, t) {
          return C(b ^ c ^ d, a, b, x, s, t);
      },
      I = function (a, b, c, d, x, s, t) {
          return C(c ^ (b | (~d)), a, b, x, s, t);
      },
      arrFunc = [F, G, H, I],
      S = (function () {
        let a = [],
            i,
            x = Math.pow(2, 32);
        for (i = 0; i < 64;) {
            a[i] = Math.floor(Math.abs(Math.sin(++i)) * x);
        }

        return a;
      })(),
      X = function (n) {
        let j,
            s = '';
        for (j = 0; j < 4; j++) {
            s += hex.charAt((n >> (j * 8 + 4)) & num) + hex.charAt((n >> (j * 8)) & num);
        }
        return s;
      };
  return function (s) {
      let $ = B('' + s),
          a = [0, 1, 2, 3],
          b = [0, 3, 2, 1],
          v = [h1, h2, h3, h4];

      for (let i, j, k, N = 0, J = 0, o = [].concat(v); N < $.length; N += 16, o = [].concat(v), J = 0) {
        for (i = 0; i < 4; i++) {
          for (j = 0; j < 4; j++) {
            for (k = 0; k < 4; k++, a.unshift(a.pop())) {
              v[b[k]] = arrFunc[i](
                v[a[0]],
                v[a[1]],
                v[a[2]],
                v[a[3]],
                $[N + (((j * 4 + k) * x[i][1] + x[i][0]) % 16)],
                x[i][2][k],
                S[J++],
            );
            }
          }
        }
        for (i = 0; i < 4; i++) {
          v[i] = A(v[i], o[i]);
        }
      }
      return X(v[0]) + X(v[1]) + X(v[2]) + X(v[3]);
  }
};

console.log('Хеш: ' + md5('Hello JS'));