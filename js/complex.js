/* Copyright (c) 2016 Patrick Roberts */ ! function(a) {
    "use strict";

    function u(a) {
        return a >= 0 ? a - a % 1 : a - (1 + a % 1) % 1
    }

    function v(a) {
        return a >= 0 ? a + (1 - a % 1) % 1 : a - a % 1
    }

    function w(a) {
        return u(a + .5)
    }

    function x(a) {
        return a - a % 1
    }

    function y(a) {
        return a % 1
    }

    function z(a, c, e, f) {
        return c = c || 0, this instanceof z ? ("number" == typeof e ? this.m = b.abs(e) : this.m = b.sqrt(a * a + c * c), "number" == typeof f ? this.t = e >= 0 ? f : f + d : this.t = b.atan2(c, a), this.t = (this.t % (2 * d) + 2 * d) % (2 * d), this.t -= this.t > d ? 2 * d : 0, this.r = a, void(this.i = c)) : new z(a, c, e, f)
    }

    function A(a, b, c) {
        var d;
        return o.test(a) ? p.test(c.slice(b)) ? a : a.charAt(0).replace(h, A) + "*" + a.charAt(1).replace(h, A) : m.test(a) ? "(" : n.test(a) ? ")" : (d = a.search(q), a.charAt(-1 !== d ? d : "*"))
    }

    function B(a) {
        var g, h, i, b = /[^a-z]+/gi,
            c = "abcdefghijklmnopqrstuvwxyz",
            d = c.length,
            e = {},
            f = "";
        for (a = a.map(function(a) {
                var c = a.replace(b, "");
                if (a !== c) throw new SyntaxError('"' + a + '" is an invalid variable name.');
                return c
            }), g = 0; g < a.length; g++) {
            if (e[a[g]]) throw new ReferenceError("May not have duplicate parameter names.");
            for (h = g; h >= 0;) i = h % d, h -= i, f = c.charAt(i) + f, h = h / d - 1;
            e[a[g]] = f, f = ""
        }
        return e
    }

    function C(a, b) {
        for (var c = 1; c > 0 && b < a.length;) "(" === a[b] && c++, ")" === a[b] && c--, b++;
        if (c > 0) throw new SyntaxError('Expected ")".');
        return b - 1
    }

    function D(a, c) {
        var e, f, d = 0;
        for (e = c; e < a.length; e++) {
            if ("(" === a[e] ? d++ : ")" === a[e] && d--, 0 > d) throw new SyntaxError('Unexpected token ")".');
            if (0 === d && ("+" === a[e] || "-" === a[e] && !s[a[e - 1]]) && (f = a.substr(b.max(0, e - 3)).search(p), -1 === f || f > 1)) return e
        }
        return a.length
    }

    function E(a, c) {
        var e, f, d = 0;
        for (e = c; e < a.length; e++) {
            if ("(" === a[e] ? d++ : ")" === a[e] && d--, 0 > d) throw new SyntaxError('Unexpected token ")".');
            if (0 === d) {
                if (("+" === a[e] || "-" === a[e] && !s[a[e - 1]]) && (f = a.substr(b.max(0, e - 3)).search(p), -1 === f || f > 1)) return e;
                if ("*" === a[e] || "/" === a[e] || " " === a[e] || "%" === a[e]) return e
            }
        }
        return a.length
    }

    function F(a, b, c) {
        switch (a) {
            case "+":
            case "-":
                return D(b, c);
            case "*":
            case " ":
            case "/":
            case "%":
            case "^":
                return E(b, c);
            default:
                throw new SyntaxError('"' + a + '" is not a valid operator.')
        }
    }

    function G() {
        Array.apply(this, arguments)
    }

    function H(a, b, c) {
        var g, h, m, n, o, p, d = "",
            e = 0,
            f = !1;
        if (0 === a.length) throw new SyntaxError('"" is not a valid argument.');
        for (; e < a.length;)
            if (f || 0 !== a.substr(e).search(i))
                if (f || 0 !== a.substr(e).search(j))
                    if (f || 0 !== a.substr(e).search(l)) {
                        if (!f || 0 !== a.substr(e).search(k)) throw new SyntaxError('Unexpected token "' + a.charAt(e) + '".');
                        if (g = a.substr(e).match(k)[0], n = s[g], p = F(g, a, e + g.length), !n) throw new SyntaxError('"' + g + '" is not a valid operator.');
                        d += n, e += g.length;
                        try {
                            var q = new G,
                                u = H(a.substring(e, p), [], q, !0),
                                v = new Function("", "var C=this.Complex;return " + u + ";").bind(q)();
                            d += "this[" + c.push(v) + "]"
                        } catch (w) {
                            d += H(a.substring(e, p), b, c, !0)
                        } finally {
                            d += ")"
                        }
                        e = ")" === a[p] ? p + 1 : p, f = !0
                    } else {
                        if (g = a.substr(e).match(l)[0], o = parseFloat(g), isNaN(o)) throw new TypeError('"' + g + '" is not a valid number.');
                        d += "this[" + c.push(new z(o, 0, o, 0)) + "]", e += g.length, f = !0
                    }
        else {
            if (g = a.substr(e).match(j)[0], h = t[g] || b[g], !h) throw new ReferenceError('"' + g + '" is not a valid variable.');
            d += h, e += g.length, f = !0
        } else {
            switch (g = a.substr(e).match(i)[0], m = r[g], g) {
                case "-":
                    p = D(a, e + g.length);
                    break;
                case "e^":
                    p = E(a, e + g.length);
                    break;
                default:
                    p = C(a, e + g.length)
            }
            if (m) {
                d += "(" === m ? "" : m, e += g.length;
                try {
                    var q = new G,
                        u = H(a.substring(e, p), [], q, !0),
                        v = new Function("", "var C=this.Complex;return " + u + ";").bind(q)();
                    d += "this[" + c.push(v) + "]"
                } catch (w) {
                    d += H(a.substring(e, p), b, c, !0)
                } finally {
                    d += "(" === m ? "" : ")"
                }
                e = ")" === a[p] ? p + 1 : p, f = !0
            } else {
                if (g = g.substr(0, g.length - 1), !t[g] && !b[g]) throw new ReferenceError('"' + g + '(" is not a valid function.');
                a = a.substr(0, e) + g + "*(" + a.substr(e + g.length + 1)
            }
        }
        return d
    }
    var e, g, b = a.Math,
        c = a.Number,
        d = b.PI,
        f = [],
        h = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]|(?:[\{\}\[\]]| *[\+\-\*\/\^ %] *)/gi,
        i = /[a-z]*\(|(?:-|e\^)\(?/i,
        j = /[a-z]+(?![a-z\(])/i,
        k = /[\+\-\*\/\^ %]/,
        l = /(?:\d*\.\d+|\d+\.\d*|\d+)(?:e[\-+]?\d+(?![\d\.]))?/i,
        m = /\{|\[/,
        n = /\}|\]/,
        o = /\d[a-z\{\[\(]|[\}\]\)][a-z\d]/i,
        p = /(?:\d*\.\d+|\d+\.\d*|\d+)e[\-+]?\d+(?![\d\.])/i,
        q = /[\+\-\*\/\^%]/,
        r = {
            "(": "(",
            "sqrt(": "C.sqrt(",
            "cbrt(": "C.cbrt(",
            "exp(": "C.exp(",
            "e^(": "C.exp(",
            "e^": "C.exp(",
            "log(": "C.log(",
            "Log(": "C.log(",
            "ln(": "C.log(",
            "gamma(": "C.gamma(",
            "fact(": "C.fact(",
            "factorial(": "C.fact(",
            "sin(": "C.sin(",
            "cos(": "C.cos(",
            "tan(": "C.tan(",
            "sec(": "C.sec(",
            "csc(": "C.csc(",
            "cot(": "C.cot(",
            "arcsin(": "C.arcsin(",
            "arccos(": "C.arccos(",
            "arctan(": "C.arctan(",
            "arcsec(": "C.arcsec(",
            "arccsc(": "C.arccsc(",
            "arccot(": "C.arccot(",
            "arsin(": "C.arcsin(",
            "arcos(": "C.arccos(",
            "artan(": "C.arctan(",
            "arsec(": "C.arcsec(",
            "arcsc(": "C.arccsc(",
            "arcot(": "C.arccot(",
            "asin(": "C.arcsin(",
            "acos(": "C.arccos(",
            "atan(": "C.arctan(",
            "asec(": "C.arcsec(",
            "acsc(": "C.arccsc(",
            "acot(": "C.arccot(",
            "sinh(": "C.sinh(",
            "cosh(": "C.cosh(",
            "tanh(": "C.tanh(",
            "sech(": "C.sech(",
            "csch(": "C.csch(",
            "coth(": "C.coth(",
            "arcsinh(": "C.arcsinh(",
            "arccosh(": "C.arccosh(",
            "arctanh(": "C.arctanh(",
            "arcsech(": "C.arcsech(",
            "arccsch(": "C.arccsch(",
            "arccoth(": "C.arccoth(",
            "arsinh(": "C.arcsinh(",
            "arcosh(": "C.arccosh(",
            "artanh(": "C.arctanh(",
            "arsech(": "C.arcsech(",
            "arcsch(": "C.arccsch(",
            "arcoth(": "C.arccoth(",
            "asinh(": "C.arcsinh(",
            "acosh(": "C.arccosh(",
            "atanh(": "C.arctanh(",
            "asech(": "C.arcsech(",
            "acsch(": "C.arccsch(",
            "acoth(": "C.arccoth(",
            "-": "C.neg(",
            "-(": "C.neg(",
            "re(": "C.re(",
            "real(": "C.re(",
            "im(": "C.im(",
            "imag(": "C.im(",
            "abs(": "C.abs(",
            "mag(": "C.abs(",
            "arg(": "C.arg(",
            "conj(": "C.conj(",
            "norm(": "C.norm(",
            "normal(": "C.norm(",
            "floor(": "C.floor(",
            "ceil(": "C.ceil(",
            "ceiling(": "C.ceil(",
            "round(": "C.round(",
            "fpart(": "C.fPart(",
            "frac(": "C.fPart(",
            "ipart(": "C.iPart(",
            "int(": "C.iPart("
        },
        s = {
            "+": ".add(",
            "-": ".sub(",
            "*": ".mult(",
            " ": ".mult(",
            "/": ".div(",
            "%": ".mod(",
            "^": ".pow("
        },
        t = {
            e: "C.E",
            i: "C.I",
            pi: "C.PI"
        };
    void 0 === b.sinh && (b.sinh = function(a) {
        return (b.exp(a) - b.exp(-a)) / 2
    }), void 0 === b.cosh && (b.cosh = function(a) {
        return (b.exp(a) + b.exp(-a)) / 2
    }), void 0 === c.EPSILON && (c.EPSILON = 2.220446049250313e-16), e = new z(b.sqrt(2 * d), 0, b.sqrt(2 * d), 0), g = [.9999999999998099, 676.5203681218851, -1259.1392167224028, 771.3234287776531, -176.6150291621406, 12.507343278686905, -.13857109526572012, 9984369578019572e-21, 1.5056327351493116e-7].map(function(a, c) {
        return f.push(new z(c, 0, c, 0)), new z(a, 0, b.abs(a), 0 > a ? d : 0)
    }), z.ZERO = new z(0, 0, 0, 0), z.ONE = new z(1, 0, 1, 0), z.I = new z(0, 1, 1, d / 2), z.NEG_I = new z(0, -1, 1, 3 * d / 2), z.PI = new z(d, 0, d, 0), z.E = new z(b.E, 0, b.E, 0), z.TWO = new z(2, 0, 2, 0), z.TWO_I = new z(0, 2, 2, d / 2), z.Polar = function(a, c) {
        return new z(a * b.cos(c), a * b.sin(c), a, c)
    }, z.prototype.toString = function(a) {
        var c, d, e, f;
        return z.isFinite(this) || isNaN(this.m) ? z.isNaN(this) ? "NaN" : a ? (c = this.r.toPrecision().toUpperCase(), d = this.i.toPrecision().toUpperCase(), 0 === this.i ? c : 0 === this.r ? 1 === b.abs(this.i) ? this.i > 0 ? "i" : "-i" : d + " i" : c + (this.i > 0 ? "+" : "") + (1 === b.abs(this.i) ? this.i > 0 ? "i" : "-i" : d + " i")) : (e = this.m.toPrecision().toUpperCase(), f = this.t.toPrecision().toUpperCase(), 0 === this.m || 0 === this.t ? e : e + " e^(" + f + " i)") : "Infinity"
    }, z.prototype.equals = z.prototype["="] = function(a) {
        var d = this.r,
            e = this.i,
            f = this.m,
            g = this.t,
            h = a.r,
            i = a.i,
            j = a.m,
            k = a.t,
            l = b.abs(d - h) <= b.max(b.abs(d), b.abs(h)) * c.EPSILON,
            m = b.abs(e - i) <= b.max(b.abs(e), b.abs(i)) * c.EPSILON,
            n = b.abs(f - j) <= b.max(b.abs(f), b.abs(j)) * c.EPSILON,
            o = b.abs(g - k) <= b.max(b.abs(g), b.abs(k)) * c.EPSILON;
        return l && m || n && o
    }, z.prototype.re = z.prototype.real = function() {
        return this.r
    }, z.prototype.im = z.prototype.imag = function() {
        return this.i
    }, z.prototype.abs = z.prototype.mag = function() {
        return this.m
    }, z.prototype.arg = z.prototype.angle = function() {
        return this.t
    }, z.prototype.rAdd = function(a) {
        return new z(this.r + a, this.i)
    }, z.prototype.add = z.prototype["+"] = function(a) {
        return new z(this.r + a.r, this.i + a.i)
    }, z.prototype.rSub = function(a) {
        return new z(this.r - a, this.i)
    }, z.prototype.sub = z.prototype["-"] = function(a) {
        return new z(this.r - a.r, this.i - a.i)
    }, z.prototype.rMult = function(a) {
        return z.Polar(this.m * a, this.t)
    }, z.prototype.mult = z.prototype["*"] = function(a) {
        return z.Polar(this.m * a.m, this.t + a.t)
    }, z.prototype.rDiv = function(a) {
        return z.Polar(this.m / a, this.t)
    }, z.prototype.div = z.prototype["/"] = function(a) {
        return z.Polar(this.m / a.m, this.t - a.t)
    }, z.prototype.rMod = function(a) {
        return new z(0 === a ? 0 : this.r % a, this.i)
    }, z.prototype.mod = z.prototype["%"] = function(a) {
        return new z(0 === a.r ? 0 : this.r % a.r, 0 === a.i ? 0 : this.i % a.i)
    }, z.prototype.rPow = function(a) {
        return 0 === a ? new z(1, 0, 1, 0) : 1 === a ? new z(this.r, this.i, this.m, this.t) : 2 === a ? z.square(this) : 3 === a ? z.cube(this) : z.Polar(b.pow(this.m, a), this.t * a)
    }, z.prototype.pow = z.prototype["^"] = function(a) {
        return 0 === a.i ? this.rPow(a.r) : z.Polar(b.pow(this.m, a.r) * b.exp(-a.i * this.t), a.i * b.log(this.m) + a.r * this.t)
    }, z.neg = function(a) {
        return new z(-a.r, -a.i, a.m, a.t + d)
    }, z.re = function(a) {
        return new z(a.r, 0, b.abs(a.r), a.r < 0 ? d : 0)
    }, z.im = function(a) {
        return new z(a.i, 0, b.abs(a.i), a.i < 0 ? d : 0)
    }, z.abs = function(a) {
        return new z(a.m, 0, a.m, 0)
    }, z.arg = function(a) {
        return new z(a.t, 0, b.abs(a.t), a.t < 0 ? d : 0)
    }, z.conj = function(a) {
        return new z(a.r, -a.i, a.m, (2 * d - a.t) % d * 2)
    }, z.norm = function(a) {
        return z.Polar(a.m / a.m, 0 === a.m ? 0 : a.t)
    }, z.floor = function(a) {
        return new z(u(a.r), u(a.i))
    }, z.ceil = function(a) {
        return new z(v(a.r), v(a.i))
    }, z.round = function(a) {
        return new z(w(a.r), w(a.i))
    }, z.iPart = function(a) {
        return new z(x(a.r), x(a.i))
    }, z.fPart = function(a) {
        return new z(y(a.r), y(a.i))
    }, z.square = function(a) {
        return new z(a.r * a.r - a.i * a.i, 2 * a.r * a.i, a.m * a.m, 2 * a.t)
    }, z.cube = function(a) {
        return new z(a.r * a.r * a.r - 3 * a.r * a.i * a.i, 3 * a.r * a.r * a.i - a.i * a.i * a.i, a.m * a.m * a.m, 3 * a.t)
    }, z.sqrt = function(a) {
        return a.rPow(.5)
    }, z.cbrt = function(a) {
        return a.rPow(1 / 3)
    }, z.exp = function(a) {
        return 0 === a.i ? z.E.rPow(a.r) : z.Polar(b.exp(a.r), a.i)
    }, z.log = function(a) {
        return new z(b.log(a.m), a.t)
    }, z.gamma = function(a) {
        var b, c, d, h;
        if (a.r < .5) return z.PI.div(z.sin(z.PI.mult(a)).mult(z.gamma(z.ONE.sub(a))));
        for (b = a.sub(z.ONE), c = g[0], d = 1; 9 > d; d++) c = c.add(g[d].div(b.add(f[d])));
        return h = b.add(new z(7.5, 0, 7.5, 0)), e.mult(h.pow(b.add(new z(.5, 0, .5, 0)))).mult(z.exp(z.neg(h))).mult(c)
    }, z.fact = function(a) {
        return z.gamma(a.add(z.ONE))
    }, z.cos = function(a) {
        var b = a.mult(z.I);
        return z.exp(b).add(z.exp(z.neg(b))).div(z.TWO)
    }, z.sin = function(a) {
        var b = a.mult(z.I);
        return z.exp(b).sub(z.exp(z.neg(b))).div(z.TWO_I)
    }, z.tan = function(a) {
        var b = a.mult(z.I),
            c = z.exp(b),
            d = z.exp(z.neg(b));
        return c.sub(d).div(c.add(d).mult(z.I))
    }, z.sec = function(a) {
        var b = a.mult(z.I);
        return z.TWO.div(z.exp(b).add(z.exp(z.neg(b))))
    }, z.csc = function(a) {
        var b = a.mult(z.I);
        return z.TWO_I.div(z.exp(b).sub(z.exp(z.neg(b))))
    }, z.cot = function(a) {
        var b = a.mult(z.I),
            c = z.exp(b),
            d = z.exp(z.neg(b));
        return c.add(d).mult(z.I).div(c.sub(d))
    }, z.arccos = function(a) {
        return z.I.mult(z.log(a.add(z.NEG_I.mult(z.sqrt(z.ONE.sub(a.rPow(2)))))))
    }, z.arcsin = function(a) {
        return z.NEG_I.mult(z.log(a.mult(z.I).add(z.sqrt(z.ONE.sub(a.rPow(2))))))
    }, z.arctan = function(a) {
        var b = z.I;
        return b.mult(z.log(b.add(a).div(b.sub(a)))).div(z.TWO)
    }, z.arcsec = function(a) {
        return z.NEG_I.mult(z.log(a.rPow(-1).add(z.sqrt(z.ONE.sub(z.I.div(a.rPow(2)))))))
    }, z.arccsc = function(a) {
        return z.NEG_I.mult(z.log(z.I.div(a).add(z.sqrt(z.ONE.sub(a.rPow(-2))))))
    }, z.arccot = function(a) {
        var b = z.I;
        return b.mult(z.log(a.sub(b).div(a.add(b)))).div(z.TWO)
    }, z.cosh = function(a) {
        return z.exp(a).add(z.exp(z.neg(a))).div(z.TWO)
    }, z.sinh = function(a) {
        return z.exp(a).sub(z.exp(z.neg(a))).div(z.TWO)
    }, z.tanh = function(a) {
        var b = z.exp(a),
            c = z.exp(z.neg(a));
        return b.sub(c).div(b.add(c))
    }, z.sech = function(a) {
        return z.TWO.div(z.exp(a).add(z.exp(z.neg(a))))
    }, z.csch = function(a) {
        return z.TWO.div(z.exp(a).sub(z.exp(z.neg(a))))
    }, z.coth = function(a) {
        var b = z.exp(a),
            c = z.exp(z.neg(a));
        return b.add(c).div(b.sub(c))
    }, z.arccosh = function(a) {
        return z.log(a.add(z.sqrt(a.rPow(2).sub(z.ONE))))
    }, z.arcsinh = function(a) {
        return z.log(a.add(z.sqrt(a.rPow(2).add(z.ONE))))
    }, z.arctanh = function(a) {
        return z.log(z.ONE.add(a).div(z.ONE.sub(a))).div(z.TWO)
    }, z.arcsech = function(a) {
        return z.log(z.ONE.add(z.sqrt(z.ONE.sub(a.rPow(2)))).div(a))
    }, z.arccsch = function(a) {
        return z.log(z.ONE.add(z.sqrt(z.ONE.add(a.rPow(2)))).div(a))
    }, z.arccoth = function(a) {
        return z.log(a.add(z.ONE).div(a.sub(z.ONE))).div(z.TWO)
    }, z.min = function() {
        var a = Array.prototype.slice.call(arguments).map(function(a) {
                return a.m
            }),
            c = b.min.apply(b, a);
        return arguments[a.indexOf(c)]
    }, z.max = function() {
        var a = Array.prototype.slice.call(arguments).map(function(a) {
                return a.m
            }),
            c = b.max.apply(b, a);
        return arguments[a.indexOf(c)]
    }, z.isNaN = function(a) {
        return isNaN(a.r) || isNaN(a.i) || isNaN(a.m) || isNaN(a.t)
    }, z.isFinite = function(a) {
        return isFinite(a.m)
    }, z.formatFunction = function(a) {
        return a.replace(h, A)
    }, G.prototype = [], G.prototype.push = function() {
        return Array.prototype.push.apply(this, arguments) - 1
    }, G.prototype.Complex = z, z.parseFunction = function(a, b, c) {
        "boolean" == typeof b ? (c = b, b = []) : Array.isArray(b) || (b = []), c || (a = z.formatFunction(a));
        var d = B(b),
            e = new G,
            f = H("(" + a + ")", d, e),
            g = b.map(function(a) {
                return d[a]
            }).join(",");
        return new Function(g, "var C=this.Complex;return " + f + ";").bind(e)
    }, "undefined" != typeof module && null !== module && module.exports ? module.exports = z : "function" == typeof define && define.amd ? define([], function() {
        return z
    }) : a.Complex = z
}("undefined" == typeof global ? this : global);