!(function () {
  return function e(t, n, i) {
    function r(s, a) {
      if (!n[s]) {
        if (!t[s]) {
          var u = "function" == typeof require && require;
          if (!a && u) return u(s, !0);
          if (o) return o(s, !0);
          var c = new Error("Cannot find module '" + s + "'");
          throw ((c.code = "MODULE_NOT_FOUND"), c);
        }
        var l = (n[s] = {
          exports: {},
        });
        t[s][0].call(
          l.exports,
          function (e) {
            return r(t[s][1][e] || e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          i
        );
      }
      return n[s].exports;
    }
    for (
      var o = "function" == typeof require && require, s = 0;
      s < i.length;
      s++
    )
      r(i[s]);
    return r;
  };
})()(
  {
    1: [
      function (e, t, n) {
        "use strict";
        const i = e("backbone"),
          r = (e("js-cookie"), e("jquery"));
        (i.cookies = e("../cookies/controller")),
          r.ajaxSetup({
            headers: {
              "Access-Token": i.cookies.getAccessToken(),
            },
          }),
          (i._sync = i.sync),
          (i.sync = function (e, t, n) {
            (n.beforeSend = function (e) {
              e.setRequestHeader("Access-Token", i.cookies.getAccessToken());
            }),
              i._sync(e, t, n);
          }),
          (i.Collection.prototype.attr = function (e, t) {
            if (void 0 === t) return this._attributes[e];
            (this._attributes[e] = t), this.trigger("change:" + e, t);
          }),
          (i.$ = r),
          (t.exports = i);
      },
      {
        "../cookies/controller": 2,
        backbone: 18,
        jquery: 19,
        "js-cookie": 20,
      },
    ],
    2: [
      function (e, t, n) {
        "use strict";
        const i = e("js-cookie");
        t.exports = {
          removeAll: function () {
            this.removeAccessToken(), this.removeCurrentConfig();
          },
          getAccessToken: function () {
            return i.get("accessToken");
          },
          createAccessToken: function (e) {
            i.set("accessToken", e);
          },
          removeAccessToken: function () {
            i.remove("accessToken");
          },
          removeCurrentConfig: function () {
            i.remove("currentConfig");
          },
          getConfig: function () {
            if (i.get("configuration"))
              return JSON.parse(i.get("configuration"));
          },
        };
      },
      {
        "js-cookie": 20,
      },
    ],
    3: [
      function (e, t, n) {
        "use strict";
        var i = e("../../util/backbone/backbone");
        t.exports = i.Model.extend({
          defaults: {
            name: "",
            email: "",
            subject: "",
            message: "",
          },
          validation: {
            email: {
              required: !0,
              pattern: "email",
            },
            subject: {
              required: !0,
              minLength: 2,
            },
            message: {
              required: !0,
              minLength: 20,
            },
          },
        });
      },
      {
        "../../util/backbone/backbone": 1,
      },
    ],
    4: [
      function (e, t, n) {
        "use strict";
        const i = e("backbone"),
          r = (e("backbone.marionette"), e("jquery"));
        t.exports = i.Marionette.ItemView.extend({
          el: "body",
          ui: {
            betaForm: "#beta-signup-form",
            betaInput: "#beta-signup-email-input",
            betaSubmit: "#beta-signup-submit",
            betaSuccess: "#beta-signup-success",
          },
          events: {
            "click @ui.betaSubmit": "onBetaSubmit",
            "keyup @ui.listEntry": "editForm",
          },
          initialize: function (e) {
            this.bindUIElements();
          },
          onBetaSubmit: function () {
            let e = this,
              t = this.ui.betaInput[0],
              n = t.checkValidity(),
              i = t.value;
            n &&
              r.ajax({
                url: "/notifications/email/beta/subscribe",
                method: "POST",
                dataType: "json",
                data: {
                  email: i,
                },
                success: function (t) {
                  e.ui.betaForm.hide(),
                    e.ui.betaSuccess.removeClass("is--hidden");
                },
                error: function (e) {
                  console.log(e);
                },
              });
          },
        });
      },
      {
        backbone: 18,
        "backbone.marionette": 14,
        jquery: 19,
      },
    ],
    5: [
      function (e, t, n) {
        "use strict";
        const i = e("backbone"),
          r = (e("backbone.marionette"), e("jquery"));
        e("js-cookie");
        (i.$ = r),
          (i.Validation = e("backbone-validation")),
          (t.exports = i.Marionette.ItemView.extend({
            el: "body",
            ui: {
              contactSubmit: "#contact-submit",
              messageSent: "#contact-message-sent",
              messageError: "#contact-message-error",
              listEntry: ".form-container .form-entry",
              errorList: ".errors-list",
            },
            events: {
              "click @ui.contactSubmit": "onContactformSubmit",
              "keyup @ui.listEntry": "editForm",
            },
            initialize: function (e) {
              this.bindUIElements();
              i.Validation.bind(this);
            },
            onContactformSubmit: function () {
              var e = this;
              this.getInputValues(),
                this.model.validate()
                  ? this.onSubmitError(this.model.validate())
                  : r.ajax({
                      url: `${window.location.protocol}//${window.location.host}/notifications/email/contact`,
                      method: "POST",
                      dataType: "json",
                      data: {
                        name: e.model.get("name"),
                        email: e.model.get("email"),
                        subject: e.model.get("subject"),
                        message: e.model.get("message"),
                      },
                      success: function (t) {
                        e.onSubmitSuccess(), e.resetForm();
                      },
                      error: function (t) {
                        e.onSubmitError();
                      },
                    });
            },
            getInputValues: function () {
              for (var e = this.ui.listEntry, t = 0; t < e.length; t++) {
                var n = r(e[t]);
                this.model.set(n.attr("name"), n.val());
              }
            },
            reinitInputValues: function () {
              for (var e = this.ui.listEntry, t = 0; t < e.length; t++) {
                r(e[t]).val("");
              }
            },
            onSubmitError: function (e) {
              var t = this;
              this.ui.messageError.addClass("is--visible"),
                this.ui.messageSent.removeClass("is--visible"),
                this.ui.errorList.empty(),
                Object.keys(e).forEach(function (n, i) {
                  const r = e[n];
                  t.ui.errorList.append("<p>" + r + "</p>");
                });
            },
            onSubmitSuccess: function () {
              r("#contact-message-sent").addClass("is--visible"),
                r("#contact-message-error").removeClass("is--visible");
            },
            resetForm: function () {
              this.reinitInputValues(), this.model.clear();
            },
          }));
      },
      {
        backbone: 18,
        "backbone-validation": 11,
        "backbone.marionette": 14,
        jquery: 19,
        "js-cookie": 20,
      },
    ],
    6: [
      function (e, t, n) {
        "use strict";
        const i = e("backbone"),
          r = (e("backbone.marionette"), e("jquery"));
        t.exports = i.Marionette.ItemView.extend({
          el: "body",
          ui: {
            newsletterForm: "#newsletter-footer-form",
            newsletterInput: "#newsletter-footer-input",
            newsletterContainer: "#newsletter-footer-container",
            newsletterSuccess: "#newsletter-footer-success",
          },
          events: {
            "submit @ui.newsletterForm": "onNewsletterFormSubmit",
            "keyup @ui.listEntry": "editForm",
          },
          initialize: function (e) {
            this.bindUIElements();
          },
          onNewsletterFormSubmit: function (e) {
            e.preventDefault();
            let t = this,
              n = this.ui.newsletterInput[0],
              i = n.checkValidity(),
              o = n.value;
            i &&
              r.ajax({
                url: "/notifications/email/newsletters/subscribe",
                method: "POST",
                dataType: "json",
                data: {
                  email: o,
                },
                success: function (e) {
                  t.ui.newsletterContainer.hide(),
                    t.ui.newsletterSuccess.removeClass("is--hidden");
                },
                error: function (e) {
                  console.log("Error:", e);
                },
              });
          },
        });
      },
      {
        backbone: 18,
        "backbone.marionette": 14,
        jquery: 19,
      },
    ],
    7: [
      function (e, t, n) {
        var i = e("./tracker");
        e("../../../util/cookies/controller");
        t.exports = function () {
          new i();
        };
      },
      {
        "../../../util/cookies/controller": 2,
        "./tracker": 8,
      },
    ],
    8: [
      function (e, t, n) {
        "use strict";
        var i = e("backbone"),
          r = (e("backbone.marionette"), e("jquery"));
        (i.$ = r),
          (t.exports = i.Marionette.ItemView.extend({
            el: "body",
            ui: {
              topbarLogin: "#topbar-login",
              topbarSignup: "#topbar-signup",
              topbarMobileLogin: "#topbar-mobile-login",
              topbarMobileSignup: "#topbar-mobile-signup",
              landingTopCTAbutton: "#landing-CTA-button",
              landingBottomCTAbutton: "#landing-bottom-CTA-button",
              landingDownloadPsd: "#landing-download-psd-button",
              landingGithub: "#landing-github-button",
              betaSignupArea: "#beta-signup-mailjet",
              footerNewsletter: "footer-newsletter-button",
              facebookIcon: "#facebook-footer-icon",
              twitterIcon: "#twitter-footer-icon",
              linkedinIcon: "#linkedin-footer-icon",
            },
            events: {
              "click @ui.topbarLogin": "onMenuLoginClick",
              "click @ui.topbarSignup": "onMenuSignupClick",
              "click @ui.topbarMobileLogin": "onMenuLoginClick",
              "click @ui.topbarMobileSignup": "onMenuSignupClick",
              "click @ui.landingTopCTAbutton": "onLandingCTAbuttonClick",
              "click @ui.landingBottomCTAbutton":
                "onLandingSecondCTAbuttonClick",
              "click @ui.landingDownloadPsd": "onLandingPsdButtonClick",
              "click @ui.landingGithub": "onLandingGithubClick",
              "click @ui.betaSignupArea": "onBetaSignupArea",
              "click @ui.footerNewsletter": "onFooterNewsletterClick",
              "click @ui.facebookIcon": "onFacebookIconClick",
              "click @ui.twitterIcon": "onTwitterIconClick",
              "click @ui.linkedinIcon": "onLinkedinIconClick",
            },
            initialize: function () {
              this.bindUIElements();
            },
            onMenuLoginClick: function () {
              this.clickEvent("topbar", "menu:login");
            },
            onMenuSignupClick: function () {
              this.clickEvent("topbar", "menu:signup");
            },
            onLandingCTAbuttonClick: function () {
              this.clickEvent("landing", "first:ctabutton");
            },
            onLandingSecondCTAbuttonClick: function () {
              this.clickEvent("landing", "second:ctabutton");
            },
            onLandingPsdButtonClick: function () {
              this.clickEvent("landing", "psd:download:button");
            },
            onLandingGithubClick: function () {
              this.clickEvent("landing", "github:button");
            },
            onBetaSignupArea: function () {
              this.clickEvent("beta:signup", "signup:area");
            },
            onFacebookIconClick: function () {
              this.social("Facebook", "https://www.facebook.com/yotako.io/");
            },
            onTwitterIconClick: function () {
              this.social("Twitter", "https://twitter.com/yotako_io");
            },
            onLinkedinIconClick: function () {
              this.social(
                "LinkedIn",
                "https://www.linkedin.com/company/yotako"
              );
            },
            onFooterNewsletterClick: function () {
              this.clickEvent("footer", "newsletter:popup");
            },
            clickEvent: function (e, t) {
              gtag("send", {
                hitType: "event",
                eventCategory: e,
                eventAction: "Click",
                eventLabel: t,
                transport: "beacon",
              });
            },
            social: function (e, t) {
              gtag("send", {
                hitType: "social",
                socialNetwork: e,
                socialAction: "go",
                socialTarget: t,
              });
            },
          }));
      },
      {
        backbone: 18,
        "backbone.marionette": 14,
        jquery: 19,
      },
    ],
    9: [
      function (e, t, n) {
        "use strict";
        var i = e("backbone"),
          r = (e("backbone.marionette"), e("jquery")),
          o = e("js-cookie");
        (i.$ = r),
          (i.Validation = e("backbone-validation")),
          (t.exports = i.Marionette.ItemView.extend({
            el: "body",
            ui: {
              burgerMenu: "#burger-menu-hook",
              menuMobile: ".menu-mobile",
              cookieContainer: ".cookies-container",
              cookieAgreeButton: "#accept-cookies-hook",
              contactSubmit: "#contact-submit",
            },
            events: {
              "click @ui.burgerMenu": "toggleMenuOpen",
              "click @ui.cookieAgreeButton": "setAcceptCookie",
              "mouseleave @ui.profileItemContainer": "closeProfileMenu",
            },
            initialize: function (e) {
              this.bindUIElements(), this.checkAcceptCookie();
            },
            toggleMenuOpen: function () {
              let e = this.ui.menuMobile;
              e.hasClass("is--open")
                ? e.removeClass("is--open")
                : e.addClass("is--open");
            },
            checkAcceptCookie: function () {
              o.get("cookies_agreed")
                ? this.ui.cookieContainer.removeClass("is--visible")
                : this.ui.cookieContainer.addClass("is--visible");
            },
            setAcceptCookie: function () {
              o.set("cookies_agreed", !0), this.checkAcceptCookie();
            },
          }));
      },
      {
        backbone: 18,
        "backbone-validation": 11,
        "backbone.marionette": 14,
        jquery: 19,
        "js-cookie": 20,
      },
    ],
    10: [
      function (e, t, n) {
        "use strict";
        const i = e("./views/betaView.js"),
          r = e("./views/newsletterView.js"),
          o = e("./views/utilsView"),
          s = e("./views/contact"),
          a = e("./models/form"),
          u = e("./views/tracking/index"),
          c = new a();
        u(),
          new o(),
          new s({
            model: c,
          }),
          new r(),
          new i();
      },
      {
        "./models/form": 3,
        "./views/betaView.js": 4,
        "./views/contact": 5,
        "./views/newsletterView.js": 6,
        "./views/tracking/index": 7,
        "./views/utilsView": 9,
      },
    ],
    11: [
      function (e, t, n) {
        var i;
        (i = function (e, t) {
          return (
            (e.Validation = (function (e) {
              "use strict";
              var t,
                n,
                i,
                r,
                o,
                s,
                a,
                u,
                c,
                l,
                h = {
                  forceUpdate: !1,
                  selector: "name",
                  labelFormatter: "sentenceCase",
                  valid: Function.prototype,
                  invalid: Function.prototype,
                },
                f = {
                  formatLabel: function (e, t) {
                    return y[h.labelFormatter](e, t);
                  },
                  format: function () {
                    var e = Array.prototype.slice.call(arguments);
                    return e.shift().replace(/\{(\d+)\}/g, function (t, n) {
                      return void 0 !== e[n] ? e[n] : t;
                    });
                  },
                },
                d = function (t, n, i) {
                  return (
                    (n = n || {}),
                    (i = i || ""),
                    e.each(t, function (r, o) {
                      t.hasOwnProperty(o) &&
                        (r && e.isArray(r)
                          ? e.forEach(r, function (e, t) {
                              d(e, n, i + o + "." + t + "."),
                                (n[i + o + "." + t] = e);
                            })
                          : r &&
                            "object" == typeof r &&
                            r.constructor === Object &&
                            d(r, n, i + o + "."),
                        (n[i + o] = r));
                    }),
                    n
                  );
                },
                p =
                  ((t = function (t, n) {
                    var i = t.attributes;
                    if (
                      (e.isFunction(i)
                        ? (i = i(n))
                        : e.isString(i) && e.isFunction(b[i]) && (i = b[i](n)),
                      e.isArray(i))
                    )
                      return i;
                  }),
                  (n = function (t, n, i, r) {
                    return e.reduce(
                      (function (t, n) {
                        var i =
                          (t.validation && e.result(t, "validation")[n]) || {};
                        return (
                          (e.isFunction(i) || e.isString(i)) &&
                            (i = {
                              fn: i,
                            }),
                          e.isArray(i) || (i = [i]),
                          e.reduce(
                            i,
                            function (t, n) {
                              return (
                                e.each(
                                  e.without(e.keys(n), "msg"),
                                  function (e) {
                                    t.push({
                                      fn: w[e],
                                      val: n[e],
                                      msg: n.msg,
                                    });
                                  }
                                ),
                                t
                              );
                            },
                            []
                          )
                        );
                      })(t, n),
                      function (o, s) {
                        var a = e.extend({}, f, w),
                          u = s.fn.call(a, i, n, s.val, t, r);
                        return (
                          !1 !== u &&
                          !1 !== o &&
                          (u && !o ? e.result(s, "msg") || u : o)
                        );
                      },
                      ""
                    );
                  }),
                  (r = function (t, n, r) {
                    n.associatedViews
                      ? n.associatedViews.push(t)
                      : (n.associatedViews = [t]),
                      e.extend(n, i(t, r));
                  }),
                  (o = function (t, n) {
                    n && t.associatedViews && t.associatedViews.length > 1
                      ? (t.associatedViews = e.without(t.associatedViews, n))
                      : (delete t.validate,
                        delete t.preValidate,
                        delete t.isValid,
                        delete t.associatedViews);
                  }),
                  (s = function (e) {
                    r(this.view, e, this.options);
                  }),
                  (a = function (e) {
                    o(e);
                  }),
                  {
                    version: "0.11.3",
                    configure: function (t) {
                      e.extend(h, t);
                    },
                    bind: function (t, n) {
                      var i = (n = e.extend({}, h, g, n)).model || t.model,
                        o = n.collection || t.collection;
                      if (void 0 === i && void 0 === o)
                        throw "Before you execute the binding your view must have a model or a collection.\nSee http://thedersen.com/projects/backbone-validation/#using-form-model-validation for more information.";
                      i
                        ? r(t, i, n)
                        : o &&
                          (o.each(function (e) {
                            r(t, e, n);
                          }),
                          o.bind("add", s, {
                            view: t,
                            options: n,
                          }),
                          o.bind("remove", a));
                    },
                    unbind: function (t, n) {
                      var i = (n = e.extend({}, n)).model || t.model,
                        r = n.collection || t.collection;
                      i
                        ? o(i, t)
                        : r &&
                          (r.each(function (e) {
                            o(e, t);
                          }),
                          r.unbind("add", s),
                          r.unbind("remove", a));
                    },
                    mixin: (i = function (i, r) {
                      return {
                        preValidate: function (t, i) {
                          var r,
                            o = this,
                            s = {};
                          return e.isObject(t)
                            ? (e.each(t, function (e, t) {
                                (r = o.preValidate(t, e)) && (s[t] = r);
                              }),
                              e.isEmpty(s) ? void 0 : s)
                            : n(this, t, i, e.extend({}, this.attributes));
                        },
                        isValid: function (o) {
                          var s, a, u, c;
                          return (
                            (o = o || t(r, i)),
                            e.isString(o) ? (a = [o]) : e.isArray(o) && (a = o),
                            a &&
                              ((s = d(this.attributes)),
                              e.each(
                                this.associatedViews,
                                function (t) {
                                  e.each(
                                    a,
                                    function (i) {
                                      (u = n(
                                        this,
                                        i,
                                        s[i],
                                        e.extend({}, this.attributes)
                                      ))
                                        ? (r.invalid(t, i, u, r.selector),
                                          ((c = c || {})[i] = u))
                                        : r.valid(t, i, r.selector);
                                    },
                                    this
                                  );
                                },
                                this
                              )),
                            !0 === o && (c = this.validate()),
                            c &&
                              this.trigger("invalid", this, c, {
                                validationError: c,
                              }),
                            a ? !c : !this.validation || this._isValid
                          );
                        },
                        validate: function (o, s) {
                          var a = this,
                            u = !o,
                            c = e.extend({}, r, s),
                            l = (function (t, n) {
                              return (
                                (n =
                                  n || e.keys(e.result(t, "validation") || {})),
                                e.reduce(
                                  n,
                                  function (e, t) {
                                    return (e[t] = void 0), e;
                                  },
                                  {}
                                )
                              );
                            })(a, t(r, i)),
                            h = e.extend({}, l, a.attributes, o),
                            f = d(h),
                            p = o ? d(o) : f,
                            g = (function (t, i, r) {
                              var o,
                                s = {},
                                a = !0,
                                u = e.clone(i);
                              return (
                                e.each(r, function (e, i) {
                                  (o = n(t, i, e, u)) && ((s[i] = o), (a = !1));
                                }),
                                {
                                  invalidAttrs: s,
                                  isValid: a,
                                }
                              );
                            })(a, h, e.pick(f, e.keys(l)));
                          if (
                            ((a._isValid = g.isValid),
                            e.each(a.associatedViews, function (t) {
                              e.each(l, function (e, n) {
                                var i = g.invalidAttrs.hasOwnProperty(n),
                                  r = p.hasOwnProperty(n);
                                i || c.valid(t, n, c.selector),
                                  i &&
                                    (r || u) &&
                                    c.invalid(
                                      t,
                                      n,
                                      g.invalidAttrs[n],
                                      c.selector
                                    );
                              });
                            }),
                            e.defer(function () {
                              a.trigger(
                                "validated",
                                a._isValid,
                                a,
                                g.invalidAttrs
                              ),
                                a.trigger(
                                  "validated:" +
                                    (a._isValid ? "valid" : "invalid"),
                                  a,
                                  g.invalidAttrs
                                );
                            }),
                            !c.forceUpdate &&
                              e.intersection(e.keys(g.invalidAttrs), e.keys(p))
                                .length > 0)
                          )
                            return g.invalidAttrs;
                        },
                      };
                    })(null, h),
                  }),
                g = (p.callbacks = {
                  valid: function (e, t, n) {
                    e.$("[" + n + '~="' + t + '"]')
                      .removeClass("invalid")
                      .removeAttr("data-error");
                  },
                  invalid: function (e, t, n, i) {
                    e.$("[" + i + '~="' + t + '"]')
                      .addClass("invalid")
                      .attr("data-error", n);
                  },
                }),
                v = (p.patterns = {
                  digits: /^\d+$/,
                  number: /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/,
                  email:
                    /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i,
                  url: /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i,
                }),
                m = (p.messages = {
                  required: "{0} is required",
                  acceptance: "{0} must be accepted",
                  min: "{0} must be greater than or equal to {1}",
                  max: "{0} must be less than or equal to {1}",
                  range: "{0} must be between {1} and {2}",
                  length: "{0} must be {1} characters",
                  minLength: "{0} must be at least {1} characters",
                  maxLength: "{0} must be at most {1} characters",
                  rangeLength: "{0} must be between {1} and {2} characters",
                  oneOf: "{0} must be one of: {1}",
                  equalTo: "{0} must be the same as {1}",
                  digits: "{0} must only contain digits",
                  number: "{0} must be a number",
                  email: "{0} must be a valid email",
                  url: "{0} must be a valid url",
                  inlinePattern: "{0} is invalid",
                }),
                y = (p.labelFormatters = {
                  none: function (e) {
                    return e;
                  },
                  sentenceCase: function (e) {
                    return e
                      .replace(/(?:^\w|[A-Z]|\b\w)/g, function (e, t) {
                        return 0 === t
                          ? e.toUpperCase()
                          : " " + e.toLowerCase();
                      })
                      .replace(/_/g, " ");
                  },
                  label: function (e, t) {
                    return (t.labels && t.labels[e]) || y.sentenceCase(e, t);
                  },
                }),
                b = (p.attributeLoaders = {
                  inputNames: function (e) {
                    var t = [];
                    return (
                      e &&
                        e.$("form [name]").each(function () {
                          /^(?:input|select|textarea)$/i.test(this.nodeName) &&
                            this.name &&
                            "submit" !== this.type &&
                            -1 === t.indexOf(this.name) &&
                            t.push(this.name);
                        }),
                      t
                    );
                  },
                }),
                w = (p.validators =
                  ((u = String.prototype.trim
                    ? function (e) {
                        return null === e ? "" : String.prototype.trim.call(e);
                      }
                    : function (e) {
                        return null === e
                          ? ""
                          : e
                              .toString()
                              .replace(/^\s+/, "")
                              .replace(/\s+$/, "");
                      }),
                  (c = function (t) {
                    return (
                      e.isNumber(t) || (e.isString(t) && t.match(v.number))
                    );
                  }),
                  (l = function (t) {
                    return !(
                      e.isNull(t) ||
                      e.isUndefined(t) ||
                      (e.isString(t) && "" === u(t)) ||
                      (e.isArray(t) && e.isEmpty(t))
                    );
                  }),
                  {
                    fn: function (t, n, i, r, o) {
                      return e.isString(i) && (i = r[i]), i.call(r, t, n, o);
                    },
                    required: function (t, n, i, r, o) {
                      var s = e.isFunction(i) ? i.call(r, t, n, o) : i;
                      return (
                        !(!s && !l(t)) &&
                        (s && !l(t)
                          ? this.format(m.required, this.formatLabel(n, r))
                          : void 0)
                      );
                    },
                    acceptance: function (t, n, i, r) {
                      if ("true" !== t && (!e.isBoolean(t) || !1 === t))
                        return this.format(
                          m.acceptance,
                          this.formatLabel(n, r)
                        );
                    },
                    min: function (e, t, n, i) {
                      if (!c(e) || e < n)
                        return this.format(m.min, this.formatLabel(t, i), n);
                    },
                    max: function (e, t, n, i) {
                      if (!c(e) || e > n)
                        return this.format(m.max, this.formatLabel(t, i), n);
                    },
                    range: function (e, t, n, i) {
                      if (!c(e) || e < n[0] || e > n[1])
                        return this.format(
                          m.range,
                          this.formatLabel(t, i),
                          n[0],
                          n[1]
                        );
                    },
                    length: function (t, n, i, r) {
                      if (!e.isString(t) || t.length !== i)
                        return this.format(m.length, this.formatLabel(n, r), i);
                    },
                    minLength: function (t, n, i, r) {
                      if (!e.isString(t) || t.length < i)
                        return this.format(
                          m.minLength,
                          this.formatLabel(n, r),
                          i
                        );
                    },
                    maxLength: function (t, n, i, r) {
                      if (!e.isString(t) || t.length > i)
                        return this.format(
                          m.maxLength,
                          this.formatLabel(n, r),
                          i
                        );
                    },
                    rangeLength: function (t, n, i, r) {
                      if (!e.isString(t) || t.length < i[0] || t.length > i[1])
                        return this.format(
                          m.rangeLength,
                          this.formatLabel(n, r),
                          i[0],
                          i[1]
                        );
                    },
                    oneOf: function (t, n, i, r) {
                      if (!e.include(i, t))
                        return this.format(
                          m.oneOf,
                          this.formatLabel(n, r),
                          i.join(", ")
                        );
                    },
                    equalTo: function (e, t, n, i, r) {
                      if (e !== r[n])
                        return this.format(
                          m.equalTo,
                          this.formatLabel(t, i),
                          this.formatLabel(n, i)
                        );
                    },
                    pattern: function (e, t, n, i) {
                      if (!l(e) || !e.toString().match(v[n] || n))
                        return this.format(
                          m[n] || m.inlinePattern,
                          this.formatLabel(t, i),
                          n
                        );
                    },
                  }));
              return (
                e.each(w, function (t, n) {
                  w[n] = e.bind(w[n], e.extend({}, f, w));
                }),
                p
              );
            })(t)),
            e.Validation
          );
        }),
          "object" == typeof n
            ? (t.exports = i(e("backbone"), e("underscore")))
            : "function" == typeof define &&
              define.amd &&
              define(["backbone", "underscore"], i);
      },
      {
        backbone: 18,
        underscore: 21,
      },
    ],
    12: [
      function (e, t, n) {
        !(function (i, r) {
          if ("function" == typeof define && define.amd)
            define(["backbone", "underscore"], function (e, t) {
              return r(e, t);
            });
          else if (void 0 !== n) {
            var o = e("backbone"),
              s = e("underscore");
            t.exports = r(o, s);
          } else r(i.Backbone, i._);
        })(this, function (e, t) {
          "use strict";
          var n = e.ChildViewContainer;
          return (
            (e.ChildViewContainer = (function (e, t) {
              var n = function (e) {
                (this._views = {}),
                  (this._indexByModel = {}),
                  (this._indexByCustom = {}),
                  this._updateLength(),
                  t.each(e, this.add, this);
              };
              t.extend(n.prototype, {
                add: function (e, t) {
                  var n = e.cid;
                  return (
                    (this._views[n] = e),
                    e.model && (this._indexByModel[e.model.cid] = n),
                    t && (this._indexByCustom[t] = n),
                    this._updateLength(),
                    this
                  );
                },
                findByModel: function (e) {
                  return this.findByModelCid(e.cid);
                },
                findByModelCid: function (e) {
                  var t = this._indexByModel[e];
                  return this.findByCid(t);
                },
                findByCustom: function (e) {
                  var t = this._indexByCustom[e];
                  return this.findByCid(t);
                },
                findByIndex: function (e) {
                  return t.values(this._views)[e];
                },
                findByCid: function (e) {
                  return this._views[e];
                },
                remove: function (e) {
                  var n = e.cid;
                  return (
                    e.model && delete this._indexByModel[e.model.cid],
                    t.any(
                      this._indexByCustom,
                      function (e, t) {
                        if (e === n) return delete this._indexByCustom[t], !0;
                      },
                      this
                    ),
                    delete this._views[n],
                    this._updateLength(),
                    this
                  );
                },
                call: function (e) {
                  this.apply(e, t.tail(arguments));
                },
                apply: function (e, n) {
                  t.each(this._views, function (i) {
                    t.isFunction(i[e]) && i[e].apply(i, n || []);
                  });
                },
                _updateLength: function () {
                  this.length = t.size(this._views);
                },
              });
              return (
                t.each(
                  [
                    "forEach",
                    "each",
                    "map",
                    "find",
                    "detect",
                    "filter",
                    "select",
                    "reject",
                    "every",
                    "all",
                    "some",
                    "any",
                    "include",
                    "contains",
                    "invoke",
                    "toArray",
                    "first",
                    "initial",
                    "rest",
                    "last",
                    "without",
                    "isEmpty",
                    "pluck",
                    "reduce",
                  ],
                  function (e) {
                    n.prototype[e] = function () {
                      var n = [t.values(this._views)].concat(
                        t.toArray(arguments)
                      );
                      return t[e].apply(t, n);
                    };
                  }
                ),
                n
              );
            })(0, t)),
            (e.ChildViewContainer.VERSION = "0.1.11"),
            (e.ChildViewContainer.noConflict = function () {
              return (e.ChildViewContainer = n), this;
            }),
            e.ChildViewContainer
          );
        });
      },
      {
        backbone: 18,
        underscore: 13,
      },
    ],
    13: [
      function (e, t, n) {
        (function () {
          var e = this,
            i = e._,
            r = Array.prototype,
            o = Object.prototype,
            s = Function.prototype,
            a = r.push,
            u = r.slice,
            c = o.toString,
            l = o.hasOwnProperty,
            h = Array.isArray,
            f = Object.keys,
            d = s.bind,
            p = Object.create,
            g = function () {},
            v = function (e) {
              return e instanceof v
                ? e
                : this instanceof v
                ? void (this._wrapped = e)
                : new v(e);
            };
          void 0 !== n
            ? (void 0 !== t && t.exports && (n = t.exports = v), (n._ = v))
            : (e._ = v),
            (v.VERSION = "1.8.3");
          var m = function (e, t, n) {
              if (void 0 === t) return e;
              switch (null == n ? 3 : n) {
                case 1:
                  return function (n) {
                    return e.call(t, n);
                  };
                case 2:
                  return function (n, i) {
                    return e.call(t, n, i);
                  };
                case 3:
                  return function (n, i, r) {
                    return e.call(t, n, i, r);
                  };
                case 4:
                  return function (n, i, r, o) {
                    return e.call(t, n, i, r, o);
                  };
              }
              return function () {
                return e.apply(t, arguments);
              };
            },
            y = function (e, t, n) {
              return null == e
                ? v.identity
                : v.isFunction(e)
                ? m(e, t, n)
                : v.isObject(e)
                ? v.matcher(e)
                : v.property(e);
            };
          v.iteratee = function (e, t) {
            return y(e, t, 1 / 0);
          };
          var b = function (e, t) {
              return function (n) {
                var i = arguments.length;
                if (i < 2 || null == n) return n;
                for (var r = 1; r < i; r++)
                  for (
                    var o = arguments[r], s = e(o), a = s.length, u = 0;
                    u < a;
                    u++
                  ) {
                    var c = s[u];
                    (t && void 0 !== n[c]) || (n[c] = o[c]);
                  }
                return n;
              };
            },
            w = function (e) {
              if (!v.isObject(e)) return {};
              if (p) return p(e);
              g.prototype = e;
              var t = new g();
              return (g.prototype = null), t;
            },
            x = function (e) {
              return function (t) {
                return null == t ? void 0 : t[e];
              };
            },
            _ = Math.pow(2, 53) - 1,
            C = x("length"),
            k = function (e) {
              var t = C(e);
              return "number" == typeof t && t >= 0 && t <= _;
            };

          function E(e) {
            return function (t, n, i, r) {
              n = m(n, r, 4);
              var o = !k(t) && v.keys(t),
                s = (o || t).length,
                a = e > 0 ? 0 : s - 1;
              return (
                arguments.length < 3 && ((i = t[o ? o[a] : a]), (a += e)),
                (function (t, n, i, r, o, s) {
                  for (; o >= 0 && o < s; o += e) {
                    var a = r ? r[o] : o;
                    i = n(i, t[a], a, t);
                  }
                  return i;
                })(t, n, i, o, a, s)
              );
            };
          }
          (v.each = v.forEach =
            function (e, t, n) {
              var i, r;
              if (((t = m(t, n)), k(e)))
                for (i = 0, r = e.length; i < r; i++) t(e[i], i, e);
              else {
                var o = v.keys(e);
                for (i = 0, r = o.length; i < r; i++) t(e[o[i]], o[i], e);
              }
              return e;
            }),
            (v.map = v.collect =
              function (e, t, n) {
                t = y(t, n);
                for (
                  var i = !k(e) && v.keys(e),
                    r = (i || e).length,
                    o = Array(r),
                    s = 0;
                  s < r;
                  s++
                ) {
                  var a = i ? i[s] : s;
                  o[s] = t(e[a], a, e);
                }
                return o;
              }),
            (v.reduce = v.foldl = v.inject = E(1)),
            (v.reduceRight = v.foldr = E(-1)),
            (v.find = v.detect =
              function (e, t, n) {
                var i;
                if (
                  void 0 !==
                    (i = k(e) ? v.findIndex(e, t, n) : v.findKey(e, t, n)) &&
                  -1 !== i
                )
                  return e[i];
              }),
            (v.filter = v.select =
              function (e, t, n) {
                var i = [];
                return (
                  (t = y(t, n)),
                  v.each(e, function (e, n, r) {
                    t(e, n, r) && i.push(e);
                  }),
                  i
                );
              }),
            (v.reject = function (e, t, n) {
              return v.filter(e, v.negate(y(t)), n);
            }),
            (v.every = v.all =
              function (e, t, n) {
                t = y(t, n);
                for (
                  var i = !k(e) && v.keys(e), r = (i || e).length, o = 0;
                  o < r;
                  o++
                ) {
                  var s = i ? i[o] : o;
                  if (!t(e[s], s, e)) return !1;
                }
                return !0;
              }),
            (v.some = v.any =
              function (e, t, n) {
                t = y(t, n);
                for (
                  var i = !k(e) && v.keys(e), r = (i || e).length, o = 0;
                  o < r;
                  o++
                ) {
                  var s = i ? i[o] : o;
                  if (t(e[s], s, e)) return !0;
                }
                return !1;
              }),
            (v.contains =
              v.includes =
              v.include =
                function (e, t, n, i) {
                  return (
                    k(e) || (e = v.values(e)),
                    ("number" != typeof n || i) && (n = 0),
                    v.indexOf(e, t, n) >= 0
                  );
                }),
            (v.invoke = function (e, t) {
              var n = u.call(arguments, 2),
                i = v.isFunction(t);
              return v.map(e, function (e) {
                var r = i ? t : e[t];
                return null == r ? r : r.apply(e, n);
              });
            }),
            (v.pluck = function (e, t) {
              return v.map(e, v.property(t));
            }),
            (v.where = function (e, t) {
              return v.filter(e, v.matcher(t));
            }),
            (v.findWhere = function (e, t) {
              return v.find(e, v.matcher(t));
            }),
            (v.max = function (e, t, n) {
              var i,
                r,
                o = -1 / 0,
                s = -1 / 0;
              if (null == t && null != e)
                for (
                  var a = 0, u = (e = k(e) ? e : v.values(e)).length;
                  a < u;
                  a++
                )
                  (i = e[a]) > o && (o = i);
              else
                (t = y(t, n)),
                  v.each(e, function (e, n, i) {
                    ((r = t(e, n, i)) > s || (r === -1 / 0 && o === -1 / 0)) &&
                      ((o = e), (s = r));
                  });
              return o;
            }),
            (v.min = function (e, t, n) {
              var i,
                r,
                o = 1 / 0,
                s = 1 / 0;
              if (null == t && null != e)
                for (
                  var a = 0, u = (e = k(e) ? e : v.values(e)).length;
                  a < u;
                  a++
                )
                  (i = e[a]) < o && (o = i);
              else
                (t = y(t, n)),
                  v.each(e, function (e, n, i) {
                    ((r = t(e, n, i)) < s || (r === 1 / 0 && o === 1 / 0)) &&
                      ((o = e), (s = r));
                  });
              return o;
            }),
            (v.shuffle = function (e) {
              for (
                var t,
                  n = k(e) ? e : v.values(e),
                  i = n.length,
                  r = Array(i),
                  o = 0;
                o < i;
                o++
              )
                (t = v.random(0, o)) !== o && (r[o] = r[t]), (r[t] = n[o]);
              return r;
            }),
            (v.sample = function (e, t, n) {
              return null == t || n
                ? (k(e) || (e = v.values(e)), e[v.random(e.length - 1)])
                : v.shuffle(e).slice(0, Math.max(0, t));
            }),
            (v.sortBy = function (e, t, n) {
              return (
                (t = y(t, n)),
                v.pluck(
                  v
                    .map(e, function (e, n, i) {
                      return {
                        value: e,
                        index: n,
                        criteria: t(e, n, i),
                      };
                    })
                    .sort(function (e, t) {
                      var n = e.criteria,
                        i = t.criteria;
                      if (n !== i) {
                        if (n > i || void 0 === n) return 1;
                        if (n < i || void 0 === i) return -1;
                      }
                      return e.index - t.index;
                    }),
                  "value"
                )
              );
            });
          var F = function (e) {
            return function (t, n, i) {
              var r = {};
              return (
                (n = y(n, i)),
                v.each(t, function (i, o) {
                  var s = n(i, o, t);
                  e(r, i, s);
                }),
                r
              );
            };
          };
          (v.groupBy = F(function (e, t, n) {
            v.has(e, n) ? e[n].push(t) : (e[n] = [t]);
          })),
            (v.indexBy = F(function (e, t, n) {
              e[n] = t;
            })),
            (v.countBy = F(function (e, t, n) {
              v.has(e, n) ? e[n]++ : (e[n] = 1);
            })),
            (v.toArray = function (e) {
              return e
                ? v.isArray(e)
                  ? u.call(e)
                  : k(e)
                  ? v.map(e, v.identity)
                  : v.values(e)
                : [];
            }),
            (v.size = function (e) {
              return null == e ? 0 : k(e) ? e.length : v.keys(e).length;
            }),
            (v.partition = function (e, t, n) {
              t = y(t, n);
              var i = [],
                r = [];
              return (
                v.each(e, function (e, n, o) {
                  (t(e, n, o) ? i : r).push(e);
                }),
                [i, r]
              );
            }),
            (v.first =
              v.head =
              v.take =
                function (e, t, n) {
                  if (null != e)
                    return null == t || n ? e[0] : v.initial(e, e.length - t);
                }),
            (v.initial = function (e, t, n) {
              return u.call(
                e,
                0,
                Math.max(0, e.length - (null == t || n ? 1 : t))
              );
            }),
            (v.last = function (e, t, n) {
              if (null != e)
                return null == t || n
                  ? e[e.length - 1]
                  : v.rest(e, Math.max(0, e.length - t));
            }),
            (v.rest =
              v.tail =
              v.drop =
                function (e, t, n) {
                  return u.call(e, null == t || n ? 1 : t);
                }),
            (v.compact = function (e) {
              return v.filter(e, v.identity);
            });
          var T = function (e, t, n, i) {
            for (var r = [], o = 0, s = i || 0, a = C(e); s < a; s++) {
              var u = e[s];
              if (k(u) && (v.isArray(u) || v.isArguments(u))) {
                t || (u = T(u, t, n));
                var c = 0,
                  l = u.length;
                for (r.length += l; c < l; ) r[o++] = u[c++];
              } else n || (r[o++] = u);
            }
            return r;
          };

          function A(e) {
            return function (t, n, i) {
              n = y(n, i);
              for (var r = C(t), o = e > 0 ? 0 : r - 1; o >= 0 && o < r; o += e)
                if (n(t[o], o, t)) return o;
              return -1;
            };
          }

          function M(e, t, n) {
            return function (i, r, o) {
              var s = 0,
                a = C(i);
              if ("number" == typeof o)
                e > 0
                  ? (s = o >= 0 ? o : Math.max(o + a, s))
                  : (a = o >= 0 ? Math.min(o + 1, a) : o + a + 1);
              else if (n && o && a) return i[(o = n(i, r))] === r ? o : -1;
              if (r != r)
                return (o = t(u.call(i, s, a), v.isNaN)) >= 0 ? o + s : -1;
              for (o = e > 0 ? s : a - 1; o >= 0 && o < a; o += e)
                if (i[o] === r) return o;
              return -1;
            };
          }
          (v.flatten = function (e, t) {
            return T(e, t, !1);
          }),
            (v.without = function (e) {
              return v.difference(e, u.call(arguments, 1));
            }),
            (v.uniq = v.unique =
              function (e, t, n, i) {
                v.isBoolean(t) || ((i = n), (n = t), (t = !1)),
                  null != n && (n = y(n, i));
                for (var r = [], o = [], s = 0, a = C(e); s < a; s++) {
                  var u = e[s],
                    c = n ? n(u, s, e) : u;
                  t
                    ? ((s && o === c) || r.push(u), (o = c))
                    : n
                    ? v.contains(o, c) || (o.push(c), r.push(u))
                    : v.contains(r, u) || r.push(u);
                }
                return r;
              }),
            (v.union = function () {
              return v.uniq(T(arguments, !0, !0));
            }),
            (v.intersection = function (e) {
              for (
                var t = [], n = arguments.length, i = 0, r = C(e);
                i < r;
                i++
              ) {
                var o = e[i];
                if (!v.contains(t, o)) {
                  for (var s = 1; s < n && v.contains(arguments[s], o); s++);
                  s === n && t.push(o);
                }
              }
              return t;
            }),
            (v.difference = function (e) {
              var t = T(arguments, !0, !0, 1);
              return v.filter(e, function (e) {
                return !v.contains(t, e);
              });
            }),
            (v.zip = function () {
              return v.unzip(arguments);
            }),
            (v.unzip = function (e) {
              for (
                var t = (e && v.max(e, C).length) || 0, n = Array(t), i = 0;
                i < t;
                i++
              )
                n[i] = v.pluck(e, i);
              return n;
            }),
            (v.object = function (e, t) {
              for (var n = {}, i = 0, r = C(e); i < r; i++)
                t ? (n[e[i]] = t[i]) : (n[e[i][0]] = e[i][1]);
              return n;
            }),
            (v.findIndex = A(1)),
            (v.findLastIndex = A(-1)),
            (v.sortedIndex = function (e, t, n, i) {
              for (var r = (n = y(n, i, 1))(t), o = 0, s = C(e); o < s; ) {
                var a = Math.floor((o + s) / 2);
                n(e[a]) < r ? (o = a + 1) : (s = a);
              }
              return o;
            }),
            (v.indexOf = M(1, v.findIndex, v.sortedIndex)),
            (v.lastIndexOf = M(-1, v.findLastIndex)),
            (v.range = function (e, t, n) {
              null == t && ((t = e || 0), (e = 0)), (n = n || 1);
              for (
                var i = Math.max(Math.ceil((t - e) / n), 0),
                  r = Array(i),
                  o = 0;
                o < i;
                o++, e += n
              )
                r[o] = e;
              return r;
            });
          var S = function (e, t, n, i, r) {
            if (!(i instanceof t)) return e.apply(n, r);
            var o = w(e.prototype),
              s = e.apply(o, r);
            return v.isObject(s) ? s : o;
          };
          (v.bind = function (e, t) {
            if (d && e.bind === d) return d.apply(e, u.call(arguments, 1));
            if (!v.isFunction(e))
              throw new TypeError("Bind must be called on a function");
            var n = u.call(arguments, 2),
              i = function () {
                return S(e, i, t, this, n.concat(u.call(arguments)));
              };
            return i;
          }),
            (v.partial = function (e) {
              var t = u.call(arguments, 1),
                n = function () {
                  for (var i = 0, r = t.length, o = Array(r), s = 0; s < r; s++)
                    o[s] = t[s] === v ? arguments[i++] : t[s];
                  for (; i < arguments.length; ) o.push(arguments[i++]);
                  return S(e, n, this, this, o);
                };
              return n;
            }),
            (v.bindAll = function (e) {
              var t,
                n,
                i = arguments.length;
              if (i <= 1)
                throw new Error("bindAll must be passed function names");
              for (t = 1; t < i; t++) e[(n = arguments[t])] = v.bind(e[n], e);
              return e;
            }),
            (v.memoize = function (e, t) {
              var n = function (i) {
                var r = n.cache,
                  o = "" + (t ? t.apply(this, arguments) : i);
                return v.has(r, o) || (r[o] = e.apply(this, arguments)), r[o];
              };
              return (n.cache = {}), n;
            }),
            (v.delay = function (e, t) {
              var n = u.call(arguments, 2);
              return setTimeout(function () {
                return e.apply(null, n);
              }, t);
            }),
            (v.defer = v.partial(v.delay, v, 1)),
            (v.throttle = function (e, t, n) {
              var i,
                r,
                o,
                s = null,
                a = 0;
              n || (n = {});
              var u = function () {
                (a = !1 === n.leading ? 0 : v.now()),
                  (s = null),
                  (o = e.apply(i, r)),
                  s || (i = r = null);
              };
              return function () {
                var c = v.now();
                a || !1 !== n.leading || (a = c);
                var l = t - (c - a);
                return (
                  (i = this),
                  (r = arguments),
                  l <= 0 || l > t
                    ? (s && (clearTimeout(s), (s = null)),
                      (a = c),
                      (o = e.apply(i, r)),
                      s || (i = r = null))
                    : s || !1 === n.trailing || (s = setTimeout(u, l)),
                  o
                );
              };
            }),
            (v.debounce = function (e, t, n) {
              var i,
                r,
                o,
                s,
                a,
                u = function () {
                  var c = v.now() - s;
                  c < t && c >= 0
                    ? (i = setTimeout(u, t - c))
                    : ((i = null),
                      n || ((a = e.apply(o, r)), i || (o = r = null)));
                };
              return function () {
                (o = this), (r = arguments), (s = v.now());
                var c = n && !i;
                return (
                  i || (i = setTimeout(u, t)),
                  c && ((a = e.apply(o, r)), (o = r = null)),
                  a
                );
              };
            }),
            (v.wrap = function (e, t) {
              return v.partial(t, e);
            }),
            (v.negate = function (e) {
              return function () {
                return !e.apply(this, arguments);
              };
            }),
            (v.compose = function () {
              var e = arguments,
                t = e.length - 1;
              return function () {
                for (var n = t, i = e[t].apply(this, arguments); n--; )
                  i = e[n].call(this, i);
                return i;
              };
            }),
            (v.after = function (e, t) {
              return function () {
                if (--e < 1) return t.apply(this, arguments);
              };
            }),
            (v.before = function (e, t) {
              var n;
              return function () {
                return (
                  --e > 0 && (n = t.apply(this, arguments)),
                  e <= 1 && (t = null),
                  n
                );
              };
            }),
            (v.once = v.partial(v.before, 2));
          var j = !{
              toString: null,
            }.propertyIsEnumerable("toString"),
            O = [
              "valueOf",
              "isPrototypeOf",
              "toString",
              "propertyIsEnumerable",
              "hasOwnProperty",
              "toLocaleString",
            ];

          function D(e, t) {
            var n = O.length,
              i = e.constructor,
              r = (v.isFunction(i) && i.prototype) || o,
              s = "constructor";
            for (v.has(e, s) && !v.contains(t, s) && t.push(s); n--; )
              (s = O[n]) in e &&
                e[s] !== r[s] &&
                !v.contains(t, s) &&
                t.push(s);
          }
          (v.keys = function (e) {
            if (!v.isObject(e)) return [];
            if (f) return f(e);
            var t = [];
            for (var n in e) v.has(e, n) && t.push(n);
            return j && D(e, t), t;
          }),
            (v.allKeys = function (e) {
              if (!v.isObject(e)) return [];
              var t = [];
              for (var n in e) t.push(n);
              return j && D(e, t), t;
            }),
            (v.values = function (e) {
              for (
                var t = v.keys(e), n = t.length, i = Array(n), r = 0;
                r < n;
                r++
              )
                i[r] = e[t[r]];
              return i;
            }),
            (v.mapObject = function (e, t, n) {
              t = y(t, n);
              for (
                var i, r = v.keys(e), o = r.length, s = {}, a = 0;
                a < o;
                a++
              )
                s[(i = r[a])] = t(e[i], i, e);
              return s;
            }),
            (v.pairs = function (e) {
              for (
                var t = v.keys(e), n = t.length, i = Array(n), r = 0;
                r < n;
                r++
              )
                i[r] = [t[r], e[t[r]]];
              return i;
            }),
            (v.invert = function (e) {
              for (var t = {}, n = v.keys(e), i = 0, r = n.length; i < r; i++)
                t[e[n[i]]] = n[i];
              return t;
            }),
            (v.functions = v.methods =
              function (e) {
                var t = [];
                for (var n in e) v.isFunction(e[n]) && t.push(n);
                return t.sort();
              }),
            (v.extend = b(v.allKeys)),
            (v.extendOwn = v.assign = b(v.keys)),
            (v.findKey = function (e, t, n) {
              t = y(t, n);
              for (var i, r = v.keys(e), o = 0, s = r.length; o < s; o++)
                if (t(e[(i = r[o])], i, e)) return i;
            }),
            (v.pick = function (e, t, n) {
              var i,
                r,
                o = {},
                s = e;
              if (null == s) return o;
              v.isFunction(t)
                ? ((r = v.allKeys(s)), (i = m(t, n)))
                : ((r = T(arguments, !1, !1, 1)),
                  (i = function (e, t, n) {
                    return t in n;
                  }),
                  (s = Object(s)));
              for (var a = 0, u = r.length; a < u; a++) {
                var c = r[a],
                  l = s[c];
                i(l, c, s) && (o[c] = l);
              }
              return o;
            }),
            (v.omit = function (e, t, n) {
              if (v.isFunction(t)) t = v.negate(t);
              else {
                var i = v.map(T(arguments, !1, !1, 1), String);
                t = function (e, t) {
                  return !v.contains(i, t);
                };
              }
              return v.pick(e, t, n);
            }),
            (v.defaults = b(v.allKeys, !0)),
            (v.create = function (e, t) {
              var n = w(e);
              return t && v.extendOwn(n, t), n;
            }),
            (v.clone = function (e) {
              return v.isObject(e)
                ? v.isArray(e)
                  ? e.slice()
                  : v.extend({}, e)
                : e;
            }),
            (v.tap = function (e, t) {
              return t(e), e;
            }),
            (v.isMatch = function (e, t) {
              var n = v.keys(t),
                i = n.length;
              if (null == e) return !i;
              for (var r = Object(e), o = 0; o < i; o++) {
                var s = n[o];
                if (t[s] !== r[s] || !(s in r)) return !1;
              }
              return !0;
            });
          var N = function (e, t, n, i) {
            if (e === t) return 0 !== e || 1 / e == 1 / t;
            if (null == e || null == t) return e === t;
            e instanceof v && (e = e._wrapped),
              t instanceof v && (t = t._wrapped);
            var r = c.call(e);
            if (r !== c.call(t)) return !1;
            switch (r) {
              case "[object RegExp]":
              case "[object String]":
                return "" + e == "" + t;
              case "[object Number]":
                return +e != +e
                  ? +t != +t
                  : 0 == +e
                  ? 1 / +e == 1 / t
                  : +e == +t;
              case "[object Date]":
              case "[object Boolean]":
                return +e == +t;
            }
            var o = "[object Array]" === r;
            if (!o) {
              if ("object" != typeof e || "object" != typeof t) return !1;
              var s = e.constructor,
                a = t.constructor;
              if (
                s !== a &&
                !(
                  v.isFunction(s) &&
                  s instanceof s &&
                  v.isFunction(a) &&
                  a instanceof a
                ) &&
                "constructor" in e &&
                "constructor" in t
              )
                return !1;
            }
            i = i || [];
            for (var u = (n = n || []).length; u--; )
              if (n[u] === e) return i[u] === t;
            if ((n.push(e), i.push(t), o)) {
              if ((u = e.length) !== t.length) return !1;
              for (; u--; ) if (!N(e[u], t[u], n, i)) return !1;
            } else {
              var l,
                h = v.keys(e);
              if (((u = h.length), v.keys(t).length !== u)) return !1;
              for (; u--; )
                if (((l = h[u]), !v.has(t, l) || !N(e[l], t[l], n, i)))
                  return !1;
            }
            return n.pop(), i.pop(), !0;
          };
          (v.isEqual = function (e, t) {
            return N(e, t);
          }),
            (v.isEmpty = function (e) {
              return (
                null == e ||
                (k(e) && (v.isArray(e) || v.isString(e) || v.isArguments(e))
                  ? 0 === e.length
                  : 0 === v.keys(e).length)
              );
            }),
            (v.isElement = function (e) {
              return !(!e || 1 !== e.nodeType);
            }),
            (v.isArray =
              h ||
              function (e) {
                return "[object Array]" === c.call(e);
              }),
            (v.isObject = function (e) {
              var t = typeof e;
              return "function" === t || ("object" === t && !!e);
            }),
            v.each(
              [
                "Arguments",
                "Function",
                "String",
                "Number",
                "Date",
                "RegExp",
                "Error",
              ],
              function (e) {
                v["is" + e] = function (t) {
                  return c.call(t) === "[object " + e + "]";
                };
              }
            ),
            v.isArguments(arguments) ||
              (v.isArguments = function (e) {
                return v.has(e, "callee");
              }),
            "function" != typeof /./ &&
              "object" != typeof Int8Array &&
              (v.isFunction = function (e) {
                return "function" == typeof e || !1;
              }),
            (v.isFinite = function (e) {
              return isFinite(e) && !isNaN(parseFloat(e));
            }),
            (v.isNaN = function (e) {
              return v.isNumber(e) && e !== +e;
            }),
            (v.isBoolean = function (e) {
              return !0 === e || !1 === e || "[object Boolean]" === c.call(e);
            }),
            (v.isNull = function (e) {
              return null === e;
            }),
            (v.isUndefined = function (e) {
              return void 0 === e;
            }),
            (v.has = function (e, t) {
              return null != e && l.call(e, t);
            }),
            (v.noConflict = function () {
              return (e._ = i), this;
            }),
            (v.identity = function (e) {
              return e;
            }),
            (v.constant = function (e) {
              return function () {
                return e;
              };
            }),
            (v.noop = function () {}),
            (v.property = x),
            (v.propertyOf = function (e) {
              return null == e
                ? function () {}
                : function (t) {
                    return e[t];
                  };
            }),
            (v.matcher = v.matches =
              function (e) {
                return (
                  (e = v.extendOwn({}, e)),
                  function (t) {
                    return v.isMatch(t, e);
                  }
                );
              }),
            (v.times = function (e, t, n) {
              var i = Array(Math.max(0, e));
              t = m(t, n, 1);
              for (var r = 0; r < e; r++) i[r] = t(r);
              return i;
            }),
            (v.random = function (e, t) {
              return (
                null == t && ((t = e), (e = 0)),
                e + Math.floor(Math.random() * (t - e + 1))
              );
            }),
            (v.now =
              Date.now ||
              function () {
                return new Date().getTime();
              });
          var V = {
              "&": "&amp;",
              "<": "&lt;",
              ">": "&gt;",
              '"': "&quot;",
              "'": "&#x27;",
              "`": "&#x60;",
            },
            R = v.invert(V),
            I = function (e) {
              var t = function (t) {
                  return e[t];
                },
                n = "(?:" + v.keys(e).join("|") + ")",
                i = RegExp(n),
                r = RegExp(n, "g");
              return function (e) {
                return (
                  (e = null == e ? "" : "" + e), i.test(e) ? e.replace(r, t) : e
                );
              };
            };
          (v.escape = I(V)),
            (v.unescape = I(R)),
            (v.result = function (e, t, n) {
              var i = null == e ? void 0 : e[t];
              return void 0 === i && (i = n), v.isFunction(i) ? i.call(e) : i;
            });
          var L = 0;
          (v.uniqueId = function (e) {
            var t = ++L + "";
            return e ? e + t : t;
          }),
            (v.templateSettings = {
              evaluate: /<%([\s\S]+?)%>/g,
              interpolate: /<%=([\s\S]+?)%>/g,
              escape: /<%-([\s\S]+?)%>/g,
            });
          var q = /(.)^/,
            B = {
              "'": "'",
              "\\": "\\",
              "\r": "r",
              "\n": "n",
              "\u2028": "u2028",
              "\u2029": "u2029",
            },
            H = /\\|'|\r|\n|\u2028|\u2029/g,
            z = function (e) {
              return "\\" + B[e];
            };
          (v.template = function (e, t, n) {
            !t && n && (t = n), (t = v.defaults({}, t, v.templateSettings));
            var i = RegExp(
                [
                  (t.escape || q).source,
                  (t.interpolate || q).source,
                  (t.evaluate || q).source,
                ].join("|") + "|$",
                "g"
              ),
              r = 0,
              o = "__p+='";
            e.replace(i, function (t, n, i, s, a) {
              return (
                (o += e.slice(r, a).replace(H, z)),
                (r = a + t.length),
                n
                  ? (o += "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'")
                  : i
                  ? (o += "'+\n((__t=(" + i + "))==null?'':__t)+\n'")
                  : s && (o += "';\n" + s + "\n__p+='"),
                t
              );
            }),
              (o += "';\n"),
              t.variable || (o = "with(obj||{}){\n" + o + "}\n"),
              (o =
                "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" +
                o +
                "return __p;\n");
            try {
              var s = new Function(t.variable || "obj", "_", o);
            } catch (e) {
              throw ((e.source = o), e);
            }
            var a = function (e) {
                return s.call(this, e, v);
              },
              u = t.variable || "obj";
            return (a.source = "function(" + u + "){\n" + o + "}"), a;
          }),
            (v.chain = function (e) {
              var t = v(e);
              return (t._chain = !0), t;
            });
          var $ = function (e, t) {
            return e._chain ? v(t).chain() : t;
          };
          (v.mixin = function (e) {
            v.each(v.functions(e), function (t) {
              var n = (v[t] = e[t]);
              v.prototype[t] = function () {
                var e = [this._wrapped];
                return a.apply(e, arguments), $(this, n.apply(v, e));
              };
            });
          }),
            v.mixin(v),
            v.each(
              ["pop", "push", "reverse", "shift", "sort", "splice", "unshift"],
              function (e) {
                var t = r[e];
                v.prototype[e] = function () {
                  var n = this._wrapped;
                  return (
                    t.apply(n, arguments),
                    ("shift" !== e && "splice" !== e) ||
                      0 !== n.length ||
                      delete n[0],
                    $(this, n)
                  );
                };
              }
            ),
            v.each(["concat", "join", "slice"], function (e) {
              var t = r[e];
              v.prototype[e] = function () {
                return $(this, t.apply(this._wrapped, arguments));
              };
            }),
            (v.prototype.value = function () {
              return this._wrapped;
            }),
            (v.prototype.valueOf = v.prototype.toJSON = v.prototype.value),
            (v.prototype.toString = function () {
              return "" + this._wrapped;
            }),
            "function" == typeof define &&
              define.amd &&
              define("underscore", [], function () {
                return v;
              });
        }.call(this));
      },
      {},
    ],
    14: [
      function (e, t, n) {
        !(function (i, r) {
          if ("function" == typeof define && define.amd)
            define([
              "backbone",
              "underscore",
              "backbone.wreqr",
              "backbone.babysitter",
            ], function (e, t) {
              return (i.Marionette = i.Mn = r(i, e, t));
            });
          else if (void 0 !== n) {
            var o = e("backbone"),
              s = e("underscore");
            e("backbone.wreqr"), e("backbone.babysitter");
            t.exports = r(i, o, s);
          } else i.Marionette = i.Mn = r(i, i.Backbone, i._);
        })(this, function (e, t, n) {
          "use strict";
          var i = e.Marionette,
            r = e.Mn,
            o = (t.Marionette = {});
          (o.VERSION = "2.4.7"),
            (o.noConflict = function () {
              return (e.Marionette = i), (e.Mn = r), this;
            }),
            (o.Deferred = t.$.Deferred),
            (o.FEATURES = {}),
            (o.isEnabled = function (e) {
              return !!o.FEATURES[e];
            }),
            (o.extend = t.Model.extend),
            (o.isNodeAttached = function (e) {
              return t.$.contains(document.documentElement, e);
            }),
            (o.mergeOptions = function (e, t) {
              e && n.extend(this, n.pick(e, t));
            }),
            (o.getOption = function (e, t) {
              if (e && t)
                return e.options && void 0 !== e.options[t]
                  ? e.options[t]
                  : e[t];
            }),
            (o.proxyGetOption = function (e) {
              return o.getOption(this, e);
            }),
            (o._getValue = function (e, t, i) {
              return n.isFunction(e) && (e = i ? e.apply(t, i) : e.call(t)), e;
            }),
            (o.normalizeMethods = function (e) {
              return n.reduce(
                e,
                function (e, t, i) {
                  return n.isFunction(t) || (t = this[t]), t && (e[i] = t), e;
                },
                {},
                this
              );
            }),
            (o.normalizeUIString = function (e, t) {
              return e.replace(/@ui\.[a-zA-Z-_$0-9]*/g, function (e) {
                return t[e.slice(4)];
              });
            }),
            (o.normalizeUIKeys = function (e, t) {
              return n.reduce(
                e,
                function (e, n, i) {
                  return (e[o.normalizeUIString(i, t)] = n), e;
                },
                {}
              );
            }),
            (o.normalizeUIValues = function (e, t, i) {
              return (
                n.each(e, function (r, s) {
                  n.isString(r)
                    ? (e[s] = o.normalizeUIString(r, t))
                    : n.isObject(r) &&
                      n.isArray(i) &&
                      (n.extend(r, o.normalizeUIValues(n.pick(r, i), t)),
                      n.each(i, function (e) {
                        var i = r[e];
                        n.isString(i) && (r[e] = o.normalizeUIString(i, t));
                      }));
                }),
                e
              );
            }),
            (o.actAsCollection = function (e, t) {
              n.each(
                [
                  "forEach",
                  "each",
                  "map",
                  "find",
                  "detect",
                  "filter",
                  "select",
                  "reject",
                  "every",
                  "all",
                  "some",
                  "any",
                  "include",
                  "contains",
                  "invoke",
                  "toArray",
                  "first",
                  "initial",
                  "rest",
                  "last",
                  "without",
                  "isEmpty",
                  "pluck",
                ],
                function (i) {
                  e[i] = function () {
                    var e = [n.values(n.result(this, t))].concat(
                      n.toArray(arguments)
                    );
                    return n[i].apply(n, e);
                  };
                }
              );
            });
          var s = (o.deprecate = function (e, t) {
            n.isObject(e) &&
              (e =
                e.prev +
                " is going to be removed in the future. Please use " +
                e.next +
                " instead." +
                (e.url ? " See: " + e.url : "")),
              (void 0 !== t && t) ||
                s._cache[e] ||
                (s._warn("Deprecation warning: " + e), (s._cache[e] = !0));
          });
          (s._console = "undefined" != typeof console ? console : {}),
            (s._warn = function () {
              return (
                s._console.warn ||
                s._console.log ||
                function () {}
              ).apply(s._console, arguments);
            }),
            (s._cache = {}),
            (o._triggerMethod = (function () {
              var e = /(^|:)(\w)/gi;

              function t(e, t, n) {
                return n.toUpperCase();
              }
              return function (i, r, o) {
                var s = arguments.length < 3;
                s && (r = (o = r)[0]);
                var a,
                  u = i["on" + r.replace(e, t)];
                return (
                  n.isFunction(u) && (a = u.apply(i, s ? n.rest(o) : o)),
                  n.isFunction(i.trigger) &&
                    (s + o.length > 1
                      ? i.trigger.apply(i, s ? o : [r].concat(n.drop(o, 0)))
                      : i.trigger(r)),
                  a
                );
              };
            })()),
            (o.triggerMethod = function (e) {
              return o._triggerMethod(this, arguments);
            }),
            (o.triggerMethodOn = function (e) {
              return (
                n.isFunction(e.triggerMethod)
                  ? e.triggerMethod
                  : o.triggerMethod
              ).apply(e, n.rest(arguments));
            }),
            (o.MonitorDOMRefresh = function (e) {
              function t() {
                e._isShown &&
                  e._isRendered &&
                  o.isNodeAttached(e.el) &&
                  o.triggerMethodOn(e, "dom:refresh", e);
              }
              e._isDomRefreshMonitored ||
                ((e._isDomRefreshMonitored = !0),
                e.on({
                  show: function () {
                    (e._isShown = !0), t();
                  },
                  render: function () {
                    (e._isRendered = !0), t();
                  },
                }));
            }),
            (function (e) {
              function t(t, i, r, o) {
                var s = o.split(/\s+/);
                n.each(s, function (n) {
                  var o = t[n];
                  if (!o)
                    throw new e.Error(
                      'Method "' +
                        n +
                        '" was configured as an event handler, but does not exist.'
                    );
                  t.listenTo(i, r, o);
                });
              }

              function i(e, t, n, i) {
                e.listenTo(t, n, i);
              }

              function r(e, t, i, r) {
                var o = r.split(/\s+/);
                n.each(o, function (n) {
                  var r = e[n];
                  e.stopListening(t, i, r);
                });
              }

              function o(e, t, n, i) {
                e.stopListening(t, n, i);
              }

              function s(t, i, r, o, s) {
                if (i && r) {
                  if (!n.isObject(r))
                    throw new e.Error({
                      message: "Bindings must be an object or function.",
                      url: "marionette.functions.html#marionettebindentityevents",
                    });
                  (r = e._getValue(r, t)),
                    n.each(r, function (e, r) {
                      n.isFunction(e) ? o(t, i, r, e) : s(t, i, r, e);
                    });
                }
              }
              (e.bindEntityEvents = function (e, n, r) {
                s(e, n, r, i, t);
              }),
                (e.unbindEntityEvents = function (e, t, n) {
                  s(e, t, n, o, r);
                }),
                (e.proxyBindEntityEvents = function (t, n) {
                  return e.bindEntityEvents(this, t, n);
                }),
                (e.proxyUnbindEntityEvents = function (t, n) {
                  return e.unbindEntityEvents(this, t, n);
                });
            })(o);
          var a = [
            "description",
            "fileName",
            "lineNumber",
            "name",
            "message",
            "number",
          ];
          return (
            (o.Error = o.extend.call(Error, {
              urlRoot: "http://marionettejs.com/docs/v" + o.VERSION + "/",
              constructor: function (e, t) {
                n.isObject(e) ? (e = (t = e).message) : t || (t = {});
                var i = Error.call(this, e);
                n.extend(this, n.pick(i, a), n.pick(t, a)),
                  this.captureStackTrace(),
                  t.url && (this.url = this.urlRoot + t.url);
              },
              captureStackTrace: function () {
                Error.captureStackTrace &&
                  Error.captureStackTrace(this, o.Error);
              },
              toString: function () {
                return (
                  this.name +
                  ": " +
                  this.message +
                  (this.url ? " See: " + this.url : "")
                );
              },
            })),
            (o.Error.extend = o.extend),
            (o.Callbacks = function () {
              (this._deferred = o.Deferred()), (this._callbacks = []);
            }),
            n.extend(o.Callbacks.prototype, {
              add: function (e, t) {
                var i = n.result(this._deferred, "promise");
                this._callbacks.push({
                  cb: e,
                  ctx: t,
                }),
                  i.then(function (n) {
                    t && (n.context = t), e.call(n.context, n.options);
                  });
              },
              run: function (e, t) {
                this._deferred.resolve({
                  options: e,
                  context: t,
                });
              },
              reset: function () {
                var e = this._callbacks;
                (this._deferred = o.Deferred()),
                  (this._callbacks = []),
                  n.each(
                    e,
                    function (e) {
                      this.add(e.cb, e.ctx);
                    },
                    this
                  );
              },
            }),
            (o.Controller = function (e) {
              (this.options = e || {}),
                n.isFunction(this.initialize) && this.initialize(this.options);
            }),
            (o.Controller.extend = o.extend),
            n.extend(o.Controller.prototype, t.Events, {
              destroy: function () {
                return (
                  o._triggerMethod(this, "before:destroy", arguments),
                  o._triggerMethod(this, "destroy", arguments),
                  this.stopListening(),
                  this.off(),
                  this
                );
              },
              triggerMethod: o.triggerMethod,
              mergeOptions: o.mergeOptions,
              getOption: o.proxyGetOption,
            }),
            (o.Object = function (e) {
              (this.options = n.extend({}, n.result(this, "options"), e)),
                this.initialize.apply(this, arguments);
            }),
            (o.Object.extend = o.extend),
            n.extend(o.Object.prototype, t.Events, {
              initialize: function () {},
              destroy: function (e) {
                return (
                  (e = e || {}),
                  this.triggerMethod("before:destroy", e),
                  this.triggerMethod("destroy", e),
                  this.stopListening(),
                  this
                );
              },
              triggerMethod: o.triggerMethod,
              mergeOptions: o.mergeOptions,
              getOption: o.proxyGetOption,
              bindEntityEvents: o.proxyBindEntityEvents,
              unbindEntityEvents: o.proxyUnbindEntityEvents,
            }),
            (o.Region = o.Object.extend(
              {
                constructor: function (e) {
                  if (
                    ((this.options = e || {}),
                    (this.el = this.getOption("el")),
                    (this.el = this.el instanceof t.$ ? this.el[0] : this.el),
                    !this.el)
                  )
                    throw new o.Error({
                      name: "NoElError",
                      message: 'An "el" must be specified for a region.',
                    });
                  (this.$el = this.getEl(this.el)), o.Object.call(this, e);
                },
                show: function (e, t) {
                  if (this._ensureElement()) {
                    this._ensureViewIsIntact(e), o.MonitorDOMRefresh(e);
                    var i = t || {},
                      r = e !== this.currentView,
                      s = !!i.preventDestroy,
                      a = !!i.forceShow,
                      u = !!this.currentView,
                      c = r && !s,
                      l = r || a;
                    if (
                      (u &&
                        this.triggerMethod(
                          "before:swapOut",
                          this.currentView,
                          this,
                          t
                        ),
                      this.currentView && r && delete this.currentView._parent,
                      c
                        ? this.empty()
                        : u &&
                          l &&
                          this.currentView.off("destroy", this.empty, this),
                      l)
                    ) {
                      e.once("destroy", this.empty, this),
                        (e._parent = this),
                        this._renderView(e),
                        u && this.triggerMethod("before:swap", e, this, t),
                        this.triggerMethod("before:show", e, this, t),
                        o.triggerMethodOn(e, "before:show", e, this, t),
                        u &&
                          this.triggerMethod(
                            "swapOut",
                            this.currentView,
                            this,
                            t
                          );
                      var h = o.isNodeAttached(this.el),
                        f = [],
                        d = n.extend(
                          {
                            triggerBeforeAttach: this.triggerBeforeAttach,
                            triggerAttach: this.triggerAttach,
                          },
                          i
                        );
                      return (
                        h &&
                          d.triggerBeforeAttach &&
                          ((f = this._displayedViews(e)),
                          this._triggerAttach(f, "before:")),
                        this.attachHtml(e),
                        (this.currentView = e),
                        h &&
                          d.triggerAttach &&
                          ((f = this._displayedViews(e)),
                          this._triggerAttach(f)),
                        u && this.triggerMethod("swap", e, this, t),
                        this.triggerMethod("show", e, this, t),
                        o.triggerMethodOn(e, "show", e, this, t),
                        this
                      );
                    }
                    return this;
                  }
                },
                triggerBeforeAttach: !0,
                triggerAttach: !0,
                _triggerAttach: function (e, t) {
                  var i = (t || "") + "attach";
                  n.each(
                    e,
                    function (e) {
                      o.triggerMethodOn(e, i, e, this);
                    },
                    this
                  );
                },
                _displayedViews: function (e) {
                  return n.union([e], n.result(e, "_getNestedViews") || []);
                },
                _renderView: function (e) {
                  e.supportsRenderLifecycle ||
                    o.triggerMethodOn(e, "before:render", e),
                    e.render(),
                    e.supportsRenderLifecycle ||
                      o.triggerMethodOn(e, "render", e);
                },
                _ensureElement: function () {
                  if (
                    (n.isObject(this.el) ||
                      ((this.$el = this.getEl(this.el)),
                      (this.el = this.$el[0])),
                    !this.$el || 0 === this.$el.length)
                  ) {
                    if (this.getOption("allowMissingEl")) return !1;
                    throw new o.Error(
                      'An "el" ' + this.$el.selector + " must exist in DOM"
                    );
                  }
                  return !0;
                },
                _ensureViewIsIntact: function (e) {
                  if (!e)
                    throw new o.Error({
                      name: "ViewNotValid",
                      message:
                        "The view passed is undefined and therefore invalid. You must pass a view instance to show.",
                    });
                  if (e.isDestroyed)
                    throw new o.Error({
                      name: "ViewDestroyedError",
                      message:
                        'View (cid: "' +
                        e.cid +
                        '") has already been destroyed and cannot be used.',
                    });
                },
                getEl: function (e) {
                  return t.$(e, o._getValue(this.options.parentEl, this));
                },
                attachHtml: function (e) {
                  this.$el.contents().detach(), this.el.appendChild(e.el);
                },
                empty: function (e) {
                  var t = this.currentView,
                    n = !!(e || {}).preventDestroy;
                  return t
                    ? (t.off("destroy", this.empty, this),
                      this.triggerMethod("before:empty", t),
                      n || this._destroyView(),
                      this.triggerMethod("empty", t),
                      delete this.currentView,
                      n && this.$el.contents().detach(),
                      this)
                    : this;
                },
                _destroyView: function () {
                  var e = this.currentView;
                  e.isDestroyed ||
                    (e.supportsDestroyLifecycle ||
                      o.triggerMethodOn(e, "before:destroy", e),
                    e.destroy
                      ? e.destroy()
                      : (e.remove(), (e.isDestroyed = !0)),
                    e.supportsDestroyLifecycle ||
                      o.triggerMethodOn(e, "destroy", e));
                },
                attachView: function (e) {
                  return (
                    this.currentView && delete this.currentView._parent,
                    (e._parent = this),
                    (this.currentView = e),
                    this
                  );
                },
                hasView: function () {
                  return !!this.currentView;
                },
                reset: function () {
                  return (
                    this.empty(),
                    this.$el && (this.el = this.$el.selector),
                    delete this.$el,
                    this
                  );
                },
              },
              {
                buildRegion: function (e, t) {
                  if (n.isString(e)) return this._buildRegionFromSelector(e, t);
                  if (e.selector || e.el || e.regionClass)
                    return this._buildRegionFromObject(e, t);
                  if (n.isFunction(e))
                    return this._buildRegionFromRegionClass(e);
                  throw new o.Error({
                    message: "Improper region configuration type.",
                    url: "marionette.region.html#region-configuration-types",
                  });
                },
                _buildRegionFromSelector: function (e, t) {
                  return new t({
                    el: e,
                  });
                },
                _buildRegionFromObject: function (e, t) {
                  var i = e.regionClass || t,
                    r = n.omit(e, "selector", "regionClass");
                  return e.selector && !r.el && (r.el = e.selector), new i(r);
                },
                _buildRegionFromRegionClass: function (e) {
                  return new e();
                },
              }
            )),
            (o.RegionManager = o.Controller.extend({
              constructor: function (e) {
                (this._regions = {}),
                  (this.length = 0),
                  o.Controller.call(this, e),
                  this.addRegions(this.getOption("regions"));
              },
              addRegions: function (e, t) {
                return (
                  (e = o._getValue(e, this, arguments)),
                  n.reduce(
                    e,
                    function (e, i, r) {
                      return (
                        n.isString(i) &&
                          (i = {
                            selector: i,
                          }),
                        i.selector && (i = n.defaults({}, i, t)),
                        (e[r] = this.addRegion(r, i)),
                        e
                      );
                    },
                    {},
                    this
                  )
                );
              },
              addRegion: function (e, t) {
                var n;
                return (
                  (n =
                    t instanceof o.Region
                      ? t
                      : o.Region.buildRegion(t, o.Region)),
                  this.triggerMethod("before:add:region", e, n),
                  (n._parent = this),
                  this._store(e, n),
                  this.triggerMethod("add:region", e, n),
                  n
                );
              },
              get: function (e) {
                return this._regions[e];
              },
              getRegions: function () {
                return n.clone(this._regions);
              },
              removeRegion: function (e) {
                var t = this._regions[e];
                return this._remove(e, t), t;
              },
              removeRegions: function () {
                var e = this.getRegions();
                return (
                  n.each(
                    this._regions,
                    function (e, t) {
                      this._remove(t, e);
                    },
                    this
                  ),
                  e
                );
              },
              emptyRegions: function () {
                var e = this.getRegions();
                return n.invoke(e, "empty"), e;
              },
              destroy: function () {
                return (
                  this.removeRegions(),
                  o.Controller.prototype.destroy.apply(this, arguments)
                );
              },
              _store: function (e, t) {
                this._regions[e] || this.length++, (this._regions[e] = t);
              },
              _remove: function (e, t) {
                this.triggerMethod("before:remove:region", e, t),
                  t.empty(),
                  t.stopListening(),
                  delete t._parent,
                  delete this._regions[e],
                  this.length--,
                  this.triggerMethod("remove:region", e, t);
              },
            })),
            o.actAsCollection(o.RegionManager.prototype, "_regions"),
            (o.TemplateCache = function (e) {
              this.templateId = e;
            }),
            n.extend(o.TemplateCache, {
              templateCaches: {},
              get: function (e, t) {
                var n = this.templateCaches[e];
                return (
                  n ||
                    ((n = new o.TemplateCache(e)),
                    (this.templateCaches[e] = n)),
                  n.load(t)
                );
              },
              clear: function () {
                var e,
                  t = n.toArray(arguments),
                  i = t.length;
                if (i > 0)
                  for (e = 0; e < i; e++) delete this.templateCaches[t[e]];
                else this.templateCaches = {};
              },
            }),
            n.extend(o.TemplateCache.prototype, {
              load: function (e) {
                if (this.compiledTemplate) return this.compiledTemplate;
                var t = this.loadTemplate(this.templateId, e);
                return (
                  (this.compiledTemplate = this.compileTemplate(t, e)),
                  this.compiledTemplate
                );
              },
              loadTemplate: function (e, n) {
                var i = t.$(e);
                if (!i.length)
                  throw new o.Error({
                    name: "NoTemplateError",
                    message: 'Could not find template: "' + e + '"',
                  });
                return i.html();
              },
              compileTemplate: function (e, t) {
                return n.template(e, t);
              },
            }),
            (o.Renderer = {
              render: function (e, t) {
                if (!e)
                  throw new o.Error({
                    name: "TemplateNotFoundError",
                    message:
                      "Cannot render the template since its false, null or undefined.",
                  });
                return (n.isFunction(e) ? e : o.TemplateCache.get(e))(t);
              },
            }),
            (o.View = t.View.extend({
              isDestroyed: !1,
              supportsRenderLifecycle: !0,
              supportsDestroyLifecycle: !0,
              constructor: function (e) {
                (this.render = n.bind(this.render, this)),
                  (e = o._getValue(e, this)),
                  (this.options = n.extend({}, n.result(this, "options"), e)),
                  (this._behaviors = o.Behaviors(this)),
                  t.View.call(this, this.options),
                  o.MonitorDOMRefresh(this);
              },
              getTemplate: function () {
                return this.getOption("template");
              },
              serializeModel: function (e) {
                return e.toJSON.apply(e, n.rest(arguments));
              },
              mixinTemplateHelpers: function (e) {
                e = e || {};
                var t = this.getOption("templateHelpers");
                return (t = o._getValue(t, this)), n.extend(e, t);
              },
              normalizeUIKeys: function (e) {
                var t = n.result(this, "_uiBindings");
                return o.normalizeUIKeys(e, t || n.result(this, "ui"));
              },
              normalizeUIValues: function (e, t) {
                var i = n.result(this, "ui"),
                  r = n.result(this, "_uiBindings");
                return o.normalizeUIValues(e, r || i, t);
              },
              configureTriggers: function () {
                if (this.triggers) {
                  var e = this.normalizeUIKeys(n.result(this, "triggers"));
                  return n.reduce(
                    e,
                    function (e, t, n) {
                      return (e[n] = this._buildViewTrigger(t)), e;
                    },
                    {},
                    this
                  );
                }
              },
              delegateEvents: function (e) {
                return (
                  this._delegateDOMEvents(e),
                  this.bindEntityEvents(
                    this.model,
                    this.getOption("modelEvents")
                  ),
                  this.bindEntityEvents(
                    this.collection,
                    this.getOption("collectionEvents")
                  ),
                  n.each(
                    this._behaviors,
                    function (e) {
                      e.bindEntityEvents(
                        this.model,
                        e.getOption("modelEvents")
                      ),
                        e.bindEntityEvents(
                          this.collection,
                          e.getOption("collectionEvents")
                        );
                    },
                    this
                  ),
                  this
                );
              },
              _delegateDOMEvents: function (e) {
                var i = o._getValue(e || this.events, this);
                (i = this.normalizeUIKeys(i)),
                  n.isUndefined(e) && (this.events = i);
                var r = {},
                  s = n.result(this, "behaviorEvents") || {},
                  a = this.configureTriggers(),
                  u = n.result(this, "behaviorTriggers") || {};
                n.extend(r, s, i, a, u),
                  t.View.prototype.delegateEvents.call(this, r);
              },
              undelegateEvents: function () {
                return (
                  t.View.prototype.undelegateEvents.apply(this, arguments),
                  this.unbindEntityEvents(
                    this.model,
                    this.getOption("modelEvents")
                  ),
                  this.unbindEntityEvents(
                    this.collection,
                    this.getOption("collectionEvents")
                  ),
                  n.each(
                    this._behaviors,
                    function (e) {
                      e.unbindEntityEvents(
                        this.model,
                        e.getOption("modelEvents")
                      ),
                        e.unbindEntityEvents(
                          this.collection,
                          e.getOption("collectionEvents")
                        );
                    },
                    this
                  ),
                  this
                );
              },
              _ensureViewIsIntact: function () {
                if (this.isDestroyed)
                  throw new o.Error({
                    name: "ViewDestroyedError",
                    message:
                      'View (cid: "' +
                      this.cid +
                      '") has already been destroyed and cannot be used.',
                  });
              },
              destroy: function () {
                if (this.isDestroyed) return this;
                var e = n.toArray(arguments);
                return (
                  this.triggerMethod.apply(this, ["before:destroy"].concat(e)),
                  (this.isDestroyed = !0),
                  this.triggerMethod.apply(this, ["destroy"].concat(e)),
                  this.unbindUIElements(),
                  (this.isRendered = !1),
                  this.remove(),
                  n.invoke(this._behaviors, "destroy", e),
                  this
                );
              },
              bindUIElements: function () {
                this._bindUIElements(),
                  n.invoke(this._behaviors, this._bindUIElements);
              },
              _bindUIElements: function () {
                if (this.ui) {
                  this._uiBindings || (this._uiBindings = this.ui);
                  var e = n.result(this, "_uiBindings");
                  (this.ui = {}),
                    n.each(
                      e,
                      function (e, t) {
                        this.ui[t] = this.$(e);
                      },
                      this
                    );
                }
              },
              unbindUIElements: function () {
                this._unbindUIElements(),
                  n.invoke(this._behaviors, this._unbindUIElements);
              },
              _unbindUIElements: function () {
                this.ui &&
                  this._uiBindings &&
                  (n.each(
                    this.ui,
                    function (e, t) {
                      delete this.ui[t];
                    },
                    this
                  ),
                  (this.ui = this._uiBindings),
                  delete this._uiBindings);
              },
              _buildViewTrigger: function (e) {
                var t = n.defaults({}, e, {
                    preventDefault: !0,
                    stopPropagation: !0,
                  }),
                  i = n.isObject(e) ? t.event : e;
                return function (e) {
                  e &&
                    (e.preventDefault && t.preventDefault && e.preventDefault(),
                    e.stopPropagation &&
                      t.stopPropagation &&
                      e.stopPropagation());
                  var n = {
                    view: this,
                    model: this.model,
                    collection: this.collection,
                  };
                  this.triggerMethod(i, n);
                };
              },
              setElement: function () {
                var e = t.View.prototype.setElement.apply(this, arguments);
                return (
                  n.invoke(this._behaviors, "proxyViewProperties", this), e
                );
              },
              triggerMethod: function () {
                var e = o._triggerMethod(this, arguments);
                return (
                  this._triggerEventOnBehaviors(arguments),
                  this._triggerEventOnParentLayout(
                    arguments[0],
                    n.rest(arguments)
                  ),
                  e
                );
              },
              _triggerEventOnBehaviors: function (e) {
                for (
                  var t = o._triggerMethod,
                    n = this._behaviors,
                    i = 0,
                    r = n && n.length;
                  i < r;
                  i++
                )
                  t(n[i], e);
              },
              _triggerEventOnParentLayout: function (e, t) {
                var i = this._parentLayoutView();
                if (i) {
                  var r = o.getOption(i, "childViewEventPrefix") + ":" + e,
                    s = [this].concat(t);
                  o._triggerMethod(i, r, s);
                  var a = o.getOption(i, "childEvents");
                  a = o._getValue(a, i);
                  var u = i.normalizeMethods(a);
                  u && n.isFunction(u[e]) && u[e].apply(i, s);
                }
              },
              _getImmediateChildren: function () {
                return [];
              },
              _getNestedViews: function () {
                var e = this._getImmediateChildren();
                return e.length
                  ? n.reduce(
                      e,
                      function (e, t) {
                        return t._getNestedViews
                          ? e.concat(t._getNestedViews())
                          : e;
                      },
                      e
                    )
                  : e;
              },
              _parentLayoutView: function () {
                for (var e = this._parent; e; ) {
                  if (e instanceof o.LayoutView) return e;
                  e = e._parent;
                }
              },
              normalizeMethods: o.normalizeMethods,
              mergeOptions: o.mergeOptions,
              getOption: o.proxyGetOption,
              bindEntityEvents: o.proxyBindEntityEvents,
              unbindEntityEvents: o.proxyUnbindEntityEvents,
            })),
            (o.ItemView = o.View.extend({
              constructor: function () {
                o.View.apply(this, arguments);
              },
              serializeData: function () {
                if (!this.model && !this.collection) return {};
                var e = [this.model || this.collection];
                return (
                  arguments.length && e.push.apply(e, arguments),
                  this.model
                    ? this.serializeModel.apply(this, e)
                    : {
                        items: this.serializeCollection.apply(this, e),
                      }
                );
              },
              serializeCollection: function (e) {
                return e.toJSON.apply(e, n.rest(arguments));
              },
              render: function () {
                return (
                  this._ensureViewIsIntact(),
                  this.triggerMethod("before:render", this),
                  this._renderTemplate(),
                  (this.isRendered = !0),
                  this.bindUIElements(),
                  this.triggerMethod("render", this),
                  this
                );
              },
              _renderTemplate: function () {
                var e = this.getTemplate();
                if (!1 !== e) {
                  if (!e)
                    throw new o.Error({
                      name: "UndefinedTemplateError",
                      message:
                        "Cannot render the template since it is null or undefined.",
                    });
                  var t = this.mixinTemplateHelpers(this.serializeData()),
                    n = o.Renderer.render(e, t, this);
                  return this.attachElContent(n), this;
                }
              },
              attachElContent: function (e) {
                return this.$el.html(e), this;
              },
            })),
            (o.CollectionView = o.View.extend({
              childViewEventPrefix: "childview",
              sort: !0,
              constructor: function (e) {
                this.once("render", this._initialEvents),
                  this._initChildViewStorage(),
                  o.View.apply(this, arguments),
                  this.on({
                    "before:show": this._onBeforeShowCalled,
                    show: this._onShowCalled,
                    "before:attach": this._onBeforeAttachCalled,
                    attach: this._onAttachCalled,
                  }),
                  this.initRenderBuffer();
              },
              initRenderBuffer: function () {
                this._bufferedChildren = [];
              },
              startBuffering: function () {
                this.initRenderBuffer(), (this.isBuffering = !0);
              },
              endBuffering: function () {
                var e,
                  t = this._isShown && o.isNodeAttached(this.el);
                (this.isBuffering = !1),
                  this._isShown &&
                    this._triggerMethodMany(
                      this._bufferedChildren,
                      this,
                      "before:show"
                    ),
                  t &&
                    this._triggerBeforeAttach &&
                    ((e = this._getNestedViews()),
                    this._triggerMethodMany(e, this, "before:attach")),
                  this.attachBuffer(this, this._createBuffer()),
                  t &&
                    this._triggerAttach &&
                    ((e = this._getNestedViews()),
                    this._triggerMethodMany(e, this, "attach")),
                  this._isShown &&
                    this._triggerMethodMany(
                      this._bufferedChildren,
                      this,
                      "show"
                    ),
                  this.initRenderBuffer();
              },
              _triggerMethodMany: function (e, t, i) {
                var r = n.drop(arguments, 3);
                n.each(e, function (e) {
                  o.triggerMethodOn.apply(e, [e, i, e, t].concat(r));
                });
              },
              _initialEvents: function () {
                this.collection &&
                  (this.listenTo(this.collection, "add", this._onCollectionAdd),
                  this.listenTo(
                    this.collection,
                    "remove",
                    this._onCollectionRemove
                  ),
                  this.listenTo(this.collection, "reset", this.render),
                  this.getOption("sort") &&
                    this.listenTo(this.collection, "sort", this._sortViews));
              },
              _onCollectionAdd: function (e, t, i) {
                var r = void 0 !== i.at && (i.index || t.indexOf(e));
                if (
                  ((this.getOption("filter") || !1 === r) &&
                    (r = n.indexOf(this._filteredSortedModels(r), e)),
                  this._shouldAddChild(e, r))
                ) {
                  this.destroyEmptyView();
                  var o = this.getChildView(e);
                  this.addChild(e, o, r);
                }
              },
              _onCollectionRemove: function (e) {
                var t = this.children.findByModel(e);
                this.removeChildView(t), this.checkEmpty();
              },
              _onBeforeShowCalled: function () {
                (this._triggerBeforeAttach = this._triggerAttach = !1),
                  this.children.each(function (e) {
                    o.triggerMethodOn(e, "before:show", e);
                  });
              },
              _onShowCalled: function () {
                this.children.each(function (e) {
                  o.triggerMethodOn(e, "show", e);
                });
              },
              _onBeforeAttachCalled: function () {
                this._triggerBeforeAttach = !0;
              },
              _onAttachCalled: function () {
                this._triggerAttach = !0;
              },
              render: function () {
                return (
                  this._ensureViewIsIntact(),
                  this.triggerMethod("before:render", this),
                  this._renderChildren(),
                  (this.isRendered = !0),
                  this.triggerMethod("render", this),
                  this
                );
              },
              reorder: function () {
                var e = this.children,
                  t = this._filteredSortedModels();
                if (!t.length && this._showingEmptyView) return this;
                if (
                  n.some(t, function (t) {
                    return !e.findByModel(t);
                  })
                )
                  this.render();
                else {
                  var i = n.map(t, function (t, n) {
                      var i = e.findByModel(t);
                      return (i._index = n), i.el;
                    }),
                    r = e.filter(function (e) {
                      return !n.contains(i, e.el);
                    });
                  this.triggerMethod("before:reorder"),
                    this._appendReorderedChildren(i),
                    n.each(r, this.removeChildView, this),
                    this.checkEmpty(),
                    this.triggerMethod("reorder");
                }
              },
              resortView: function () {
                o.getOption(this, "reorderOnSort")
                  ? this.reorder()
                  : this.render();
              },
              _sortViews: function () {
                var e = this._filteredSortedModels();
                n.find(
                  e,
                  function (e, t) {
                    var n = this.children.findByModel(e);
                    return !n || n._index !== t;
                  },
                  this
                ) && this.resortView();
              },
              _emptyViewIndex: -1,
              _appendReorderedChildren: function (e) {
                this.$el.append(e);
              },
              _renderChildren: function () {
                this.destroyEmptyView(),
                  this.destroyChildren({
                    checkEmpty: !1,
                  }),
                  this.isEmpty(this.collection)
                    ? this.showEmptyView()
                    : (this.triggerMethod("before:render:collection", this),
                      this.startBuffering(),
                      this.showCollection(),
                      this.endBuffering(),
                      this.triggerMethod("render:collection", this),
                      this.children.isEmpty() &&
                        this.getOption("filter") &&
                        this.showEmptyView());
              },
              showCollection: function () {
                var e,
                  t = this._filteredSortedModels();
                n.each(
                  t,
                  function (t, n) {
                    (e = this.getChildView(t)), this.addChild(t, e, n);
                  },
                  this
                );
              },
              _filteredSortedModels: function (e) {
                var t,
                  i = this.getViewComparator(),
                  r = this.collection.models;
                ((e = Math.min(Math.max(e, 0), r.length - 1)), i) &&
                  (e &&
                    ((t = r[e]), (r = r.slice(0, e).concat(r.slice(e + 1)))),
                  (r = this._sortModelsBy(r, i)),
                  t && r.splice(e, 0, t));
                return (
                  this.getOption("filter") &&
                    (r = n.filter(
                      r,
                      function (e, t) {
                        return this._shouldAddChild(e, t);
                      },
                      this
                    )),
                  r
                );
              },
              _sortModelsBy: function (e, t) {
                return "string" == typeof t
                  ? n.sortBy(
                      e,
                      function (e) {
                        return e.get(t);
                      },
                      this
                    )
                  : 1 === t.length
                  ? n.sortBy(e, t, this)
                  : e.sort(n.bind(t, this));
              },
              showEmptyView: function () {
                var e = this.getEmptyView();
                if (e && !this._showingEmptyView) {
                  this.triggerMethod("before:render:empty"),
                    (this._showingEmptyView = !0);
                  var n = new t.Model();
                  this.addEmptyView(n, e), this.triggerMethod("render:empty");
                }
              },
              destroyEmptyView: function () {
                this._showingEmptyView &&
                  (this.triggerMethod("before:remove:empty"),
                  this.destroyChildren(),
                  delete this._showingEmptyView,
                  this.triggerMethod("remove:empty"));
              },
              getEmptyView: function () {
                return this.getOption("emptyView");
              },
              addEmptyView: function (e, t) {
                var i,
                  r =
                    this._isShown &&
                    !this.isBuffering &&
                    o.isNodeAttached(this.el),
                  s =
                    this.getOption("emptyViewOptions") ||
                    this.getOption("childViewOptions");
                n.isFunction(s) && (s = s.call(this, e, this._emptyViewIndex));
                var a = this.buildChildView(e, t, s);
                (a._parent = this),
                  this.proxyChildEvents(a),
                  a.once(
                    "render",
                    function () {
                      this._isShown && o.triggerMethodOn(a, "before:show", a),
                        r &&
                          this._triggerBeforeAttach &&
                          ((i = this._getViewAndNested(a)),
                          this._triggerMethodMany(i, this, "before:attach"));
                    },
                    this
                  ),
                  this.children.add(a),
                  this.renderChildView(a, this._emptyViewIndex),
                  r &&
                    this._triggerAttach &&
                    ((i = this._getViewAndNested(a)),
                    this._triggerMethodMany(i, this, "attach")),
                  this._isShown && o.triggerMethodOn(a, "show", a);
              },
              getChildView: function (e) {
                var t = this.getOption("childView");
                if (!t)
                  throw new o.Error({
                    name: "NoChildViewError",
                    message: 'A "childView" must be specified',
                  });
                return t;
              },
              addChild: function (e, t, n) {
                var i = this.getOption("childViewOptions");
                i = o._getValue(i, this, [e, n]);
                var r = this.buildChildView(e, t, i);
                return (
                  this._updateIndices(r, !0, n),
                  this.triggerMethod("before:add:child", r),
                  this._addChildView(r, n),
                  this.triggerMethod("add:child", r),
                  (r._parent = this),
                  r
                );
              },
              _updateIndices: function (e, t, n) {
                this.getOption("sort") &&
                  (t && (e._index = n),
                  this.children.each(function (n) {
                    n._index >= e._index && (n._index += t ? 1 : -1);
                  }));
              },
              _addChildView: function (e, t) {
                var n,
                  i =
                    this._isShown &&
                    !this.isBuffering &&
                    o.isNodeAttached(this.el);
                this.proxyChildEvents(e),
                  e.once(
                    "render",
                    function () {
                      this._isShown &&
                        !this.isBuffering &&
                        o.triggerMethodOn(e, "before:show", e),
                        i &&
                          this._triggerBeforeAttach &&
                          ((n = this._getViewAndNested(e)),
                          this._triggerMethodMany(n, this, "before:attach"));
                    },
                    this
                  ),
                  this.children.add(e),
                  this.renderChildView(e, t),
                  i &&
                    this._triggerAttach &&
                    ((n = this._getViewAndNested(e)),
                    this._triggerMethodMany(n, this, "attach")),
                  this._isShown &&
                    !this.isBuffering &&
                    o.triggerMethodOn(e, "show", e);
              },
              renderChildView: function (e, t) {
                return (
                  e.supportsRenderLifecycle ||
                    o.triggerMethodOn(e, "before:render", e),
                  e.render(),
                  e.supportsRenderLifecycle ||
                    o.triggerMethodOn(e, "render", e),
                  this.attachHtml(this, e, t),
                  e
                );
              },
              buildChildView: function (e, t, i) {
                var r = new t(
                  n.extend(
                    {
                      model: e,
                    },
                    i
                  )
                );
                return o.MonitorDOMRefresh(r), r;
              },
              removeChildView: function (e) {
                return e
                  ? (this.triggerMethod("before:remove:child", e),
                    e.supportsDestroyLifecycle ||
                      o.triggerMethodOn(e, "before:destroy", e),
                    e.destroy ? e.destroy() : e.remove(),
                    e.supportsDestroyLifecycle ||
                      o.triggerMethodOn(e, "destroy", e),
                    delete e._parent,
                    this.stopListening(e),
                    this.children.remove(e),
                    this.triggerMethod("remove:child", e),
                    this._updateIndices(e, !1),
                    e)
                  : e;
              },
              isEmpty: function () {
                return !this.collection || 0 === this.collection.length;
              },
              checkEmpty: function () {
                this.isEmpty(this.collection) && this.showEmptyView();
              },
              attachBuffer: function (e, t) {
                e.$el.append(t);
              },
              _createBuffer: function () {
                var e = document.createDocumentFragment();
                return (
                  n.each(this._bufferedChildren, function (t) {
                    e.appendChild(t.el);
                  }),
                  e
                );
              },
              attachHtml: function (e, t, n) {
                e.isBuffering
                  ? e._bufferedChildren.splice(n, 0, t)
                  : e._insertBefore(t, n) || e._insertAfter(t);
              },
              _insertBefore: function (e, t) {
                var n;
                return (
                  this.getOption("sort") &&
                    t < this.children.length - 1 &&
                    (n = this.children.find(function (e) {
                      return e._index === t + 1;
                    })),
                  !!n && (n.$el.before(e.el), !0)
                );
              },
              _insertAfter: function (e) {
                this.$el.append(e.el);
              },
              _initChildViewStorage: function () {
                this.children = new t.ChildViewContainer();
              },
              destroy: function () {
                return this.isDestroyed
                  ? this
                  : (this.triggerMethod("before:destroy:collection"),
                    this.destroyChildren({
                      checkEmpty: !1,
                    }),
                    this.triggerMethod("destroy:collection"),
                    o.View.prototype.destroy.apply(this, arguments));
              },
              destroyChildren: function (e) {
                var t = e || {},
                  i = !0,
                  r = this.children.map(n.identity);
                return (
                  n.isUndefined(t.checkEmpty) || (i = t.checkEmpty),
                  this.children.each(this.removeChildView, this),
                  i && this.checkEmpty(),
                  r
                );
              },
              _shouldAddChild: function (e, t) {
                var i = this.getOption("filter");
                return !n.isFunction(i) || i.call(this, e, t, this.collection);
              },
              proxyChildEvents: function (e) {
                var t = this.getOption("childViewEventPrefix");
                this.listenTo(e, "all", function () {
                  var i = n.toArray(arguments),
                    r = i[0],
                    o = this.normalizeMethods(n.result(this, "childEvents"));
                  (i[0] = t + ":" + r),
                    i.splice(1, 0, e),
                    void 0 !== o &&
                      n.isFunction(o[r]) &&
                      o[r].apply(this, i.slice(1)),
                    this.triggerMethod.apply(this, i);
                });
              },
              _getImmediateChildren: function () {
                return n.values(this.children._views);
              },
              _getViewAndNested: function (e) {
                return [e].concat(n.result(e, "_getNestedViews") || []);
              },
              getViewComparator: function () {
                return this.getOption("viewComparator");
              },
            })),
            (o.CompositeView = o.CollectionView.extend({
              constructor: function () {
                o.CollectionView.apply(this, arguments);
              },
              _initialEvents: function () {
                this.collection &&
                  (this.listenTo(this.collection, "add", this._onCollectionAdd),
                  this.listenTo(
                    this.collection,
                    "remove",
                    this._onCollectionRemove
                  ),
                  this.listenTo(this.collection, "reset", this._renderChildren),
                  this.getOption("sort") &&
                    this.listenTo(this.collection, "sort", this._sortViews));
              },
              getChildView: function (e) {
                return this.getOption("childView") || this.constructor;
              },
              serializeData: function () {
                var e = {};
                return (
                  this.model &&
                    (e = n
                      .partial(this.serializeModel, this.model)
                      .apply(this, arguments)),
                  e
                );
              },
              render: function () {
                return (
                  this._ensureViewIsIntact(),
                  (this._isRendering = !0),
                  this.resetChildViewContainer(),
                  this.triggerMethod("before:render", this),
                  this._renderTemplate(),
                  this._renderChildren(),
                  (this._isRendering = !1),
                  (this.isRendered = !0),
                  this.triggerMethod("render", this),
                  this
                );
              },
              _renderChildren: function () {
                (this.isRendered || this._isRendering) &&
                  o.CollectionView.prototype._renderChildren.call(this);
              },
              _renderTemplate: function () {
                var e = {};
                (e = this.serializeData()),
                  (e = this.mixinTemplateHelpers(e)),
                  this.triggerMethod("before:render:template");
                var t = this.getTemplate(),
                  n = o.Renderer.render(t, e, this);
                this.attachElContent(n),
                  this.bindUIElements(),
                  this.triggerMethod("render:template");
              },
              attachElContent: function (e) {
                return this.$el.html(e), this;
              },
              attachBuffer: function (e, t) {
                this.getChildViewContainer(e).append(t);
              },
              _insertAfter: function (e) {
                this.getChildViewContainer(this, e).append(e.el);
              },
              _appendReorderedChildren: function (e) {
                this.getChildViewContainer(this).append(e);
              },
              getChildViewContainer: function (e, t) {
                if (e.$childViewContainer) return e.$childViewContainer;
                var n,
                  i = o.getOption(e, "childViewContainer");
                if (i) {
                  var r = o._getValue(i, e);
                  if (
                    (n =
                      "@" === r.charAt(0) && e.ui ? e.ui[r.substr(4)] : e.$(r))
                      .length <= 0
                  )
                    throw new o.Error({
                      name: "ChildViewContainerMissingError",
                      message:
                        'The specified "childViewContainer" was not found: ' +
                        e.childViewContainer,
                    });
                } else n = e.$el;
                return (e.$childViewContainer = n), n;
              },
              resetChildViewContainer: function () {
                this.$childViewContainer && (this.$childViewContainer = void 0);
              },
            })),
            (o.LayoutView = o.ItemView.extend({
              regionClass: o.Region,
              options: {
                destroyImmediate: !1,
              },
              childViewEventPrefix: "childview",
              constructor: function (e) {
                (e = e || {}),
                  (this._firstRender = !0),
                  this._initializeRegions(e),
                  o.ItemView.call(this, e);
              },
              render: function () {
                return (
                  this._ensureViewIsIntact(),
                  this._firstRender
                    ? (this._firstRender = !1)
                    : this._reInitializeRegions(),
                  o.ItemView.prototype.render.apply(this, arguments)
                );
              },
              destroy: function () {
                return this.isDestroyed
                  ? this
                  : (!0 === this.getOption("destroyImmediate") &&
                      this.$el.remove(),
                    this.regionManager.destroy(),
                    o.ItemView.prototype.destroy.apply(this, arguments));
              },
              showChildView: function (e, t, i) {
                var r = this.getRegion(e);
                return r.show.apply(r, n.rest(arguments));
              },
              getChildView: function (e) {
                return this.getRegion(e).currentView;
              },
              addRegion: function (e, t) {
                var n = {};
                return (n[e] = t), this._buildRegions(n)[e];
              },
              addRegions: function (e) {
                return (
                  (this.regions = n.extend({}, this.regions, e)),
                  this._buildRegions(e)
                );
              },
              removeRegion: function (e) {
                return (
                  delete this.regions[e], this.regionManager.removeRegion(e)
                );
              },
              getRegion: function (e) {
                return this.regionManager.get(e);
              },
              getRegions: function () {
                return this.regionManager.getRegions();
              },
              _buildRegions: function (e) {
                var t = {
                  regionClass: this.getOption("regionClass"),
                  parentEl: n.partial(n.result, this, "el"),
                };
                return this.regionManager.addRegions(e, t);
              },
              _initializeRegions: function (e) {
                var t;
                this._initRegionManager(),
                  (t = o._getValue(this.regions, this, [e]) || {});
                var i = this.getOption.call(e, "regions");
                (i = o._getValue(i, this, [e])),
                  n.extend(t, i),
                  (t = this.normalizeUIValues(t, ["selector", "el"])),
                  this.addRegions(t);
              },
              _reInitializeRegions: function () {
                this.regionManager.invoke("reset");
              },
              getRegionManager: function () {
                return new o.RegionManager();
              },
              _initRegionManager: function () {
                (this.regionManager = this.getRegionManager()),
                  (this.regionManager._parent = this),
                  this.listenTo(
                    this.regionManager,
                    "before:add:region",
                    function (e) {
                      this.triggerMethod("before:add:region", e);
                    }
                  ),
                  this.listenTo(
                    this.regionManager,
                    "add:region",
                    function (e, t) {
                      (this[e] = t), this.triggerMethod("add:region", e, t);
                    }
                  ),
                  this.listenTo(
                    this.regionManager,
                    "before:remove:region",
                    function (e) {
                      this.triggerMethod("before:remove:region", e);
                    }
                  ),
                  this.listenTo(
                    this.regionManager,
                    "remove:region",
                    function (e, t) {
                      delete this[e], this.triggerMethod("remove:region", e, t);
                    }
                  );
              },
              _getImmediateChildren: function () {
                return n
                  .chain(this.regionManager.getRegions())
                  .pluck("currentView")
                  .compact()
                  .value();
              },
            })),
            (o.Behavior = o.Object.extend({
              constructor: function (e, t) {
                (this.view = t),
                  (this.defaults = n.result(this, "defaults") || {}),
                  (this.options = n.extend({}, this.defaults, e)),
                  (this.ui = n.extend(
                    {},
                    n.result(t, "ui"),
                    n.result(this, "ui")
                  )),
                  o.Object.apply(this, arguments);
              },
              $: function () {
                return this.view.$.apply(this.view, arguments);
              },
              destroy: function () {
                return this.stopListening(), this;
              },
              proxyViewProperties: function (e) {
                (this.$el = e.$el), (this.el = e.el);
              },
            })),
            (o.Behaviors = (function (e, t) {
              var n = /^(\S+)\s*(.*)$/;

              function i(e, n) {
                return t.isObject(e.behaviors)
                  ? ((n = i.parseBehaviors(e, n || t.result(e, "behaviors"))),
                    i.wrap(e, n, t.keys(r)),
                    n)
                  : {};
              }
              var r = {
                behaviorTriggers: function (e, t) {
                  return new o(this, t).buildBehaviorTriggers();
                },
                behaviorEvents: function (i, r) {
                  var o = {};
                  return (
                    t.each(
                      r,
                      function (i, r) {
                        var a = {},
                          u = t.clone(t.result(i, "events")) || {};
                        u = e.normalizeUIKeys(u, s(i));
                        var c = 0;
                        t.each(
                          u,
                          function (e, o) {
                            var s = o.match(n),
                              u =
                                s[1] +
                                "." +
                                [this.cid, r, c++, " "].join("") +
                                s[2],
                              l = t.isFunction(e) ? e : i[e];
                            l && (a[u] = t.bind(l, i));
                          },
                          this
                        ),
                          (o = t.extend(o, a));
                      },
                      this
                    ),
                    o
                  );
                },
              };

              function o(e, t) {
                (this._view = e), (this._behaviors = t), (this._triggers = {});
              }

              function s(e) {
                return e._uiBindings || e.ui;
              }
              return (
                t.extend(i, {
                  behaviorsLookup: function () {
                    throw new e.Error({
                      message:
                        "You must define where your behaviors are stored.",
                      url: "marionette.behaviors.html#behaviorslookup",
                    });
                  },
                  getBehaviorClass: function (t, n) {
                    return t.behaviorClass
                      ? t.behaviorClass
                      : e._getValue(i.behaviorsLookup, this, [t, n])[n];
                  },
                  parseBehaviors: function (e, n) {
                    return t
                      .chain(n)
                      .map(function (n, r) {
                        var o = new (i.getBehaviorClass(n, r))(n, e),
                          s = i.parseBehaviors(e, t.result(o, "behaviors"));
                        return [o].concat(s);
                      })
                      .flatten()
                      .value();
                  },
                  wrap: function (e, n, i) {
                    t.each(i, function (i) {
                      e[i] = t.partial(r[i], e[i], n);
                    });
                  },
                }),
                t.extend(o.prototype, {
                  buildBehaviorTriggers: function () {
                    return (
                      t.each(
                        this._behaviors,
                        this._buildTriggerHandlersForBehavior,
                        this
                      ),
                      this._triggers
                    );
                  },
                  _buildTriggerHandlersForBehavior: function (n, i) {
                    var r = t.clone(t.result(n, "triggers")) || {};
                    (r = e.normalizeUIKeys(r, s(n))),
                      t.each(
                        r,
                        t.bind(this._setHandlerForBehavior, this, n, i)
                      );
                  },
                  _setHandlerForBehavior: function (e, t, n, i) {
                    var r = i.replace(/^\S+/, function (e) {
                      return e + ".behaviortriggers" + t;
                    });
                    this._triggers[r] = this._view._buildViewTrigger(n);
                  },
                }),
                i
              );
            })(o, n)),
            (o.AppRouter = t.Router.extend({
              constructor: function (e) {
                (this.options = e || {}), t.Router.apply(this, arguments);
                var n = this.getOption("appRoutes"),
                  i = this._getController();
                this.processAppRoutes(i, n),
                  this.on("route", this._processOnRoute, this);
              },
              appRoute: function (e, t) {
                var n = this._getController();
                this._addAppRoute(n, e, t);
              },
              _processOnRoute: function (e, t) {
                if (n.isFunction(this.onRoute)) {
                  var i = n.invert(this.getOption("appRoutes"))[e];
                  this.onRoute(e, i, t);
                }
              },
              processAppRoutes: function (e, t) {
                if (t) {
                  var i = n.keys(t).reverse();
                  n.each(
                    i,
                    function (n) {
                      this._addAppRoute(e, n, t[n]);
                    },
                    this
                  );
                }
              },
              _getController: function () {
                return this.getOption("controller");
              },
              _addAppRoute: function (e, t, i) {
                var r = e[i];
                if (!r)
                  throw new o.Error(
                    'Method "' + i + '" was not found on the controller'
                  );
                this.route(t, i, n.bind(r, e));
              },
              mergeOptions: o.mergeOptions,
              getOption: o.proxyGetOption,
              triggerMethod: o.triggerMethod,
              bindEntityEvents: o.proxyBindEntityEvents,
              unbindEntityEvents: o.proxyUnbindEntityEvents,
            })),
            (o.Application = o.Object.extend({
              constructor: function (e) {
                this._initializeRegions(e),
                  (this._initCallbacks = new o.Callbacks()),
                  (this.submodules = {}),
                  n.extend(this, e),
                  this._initChannel(),
                  o.Object.apply(this, arguments);
              },
              execute: function () {
                this.commands.execute.apply(this.commands, arguments);
              },
              request: function () {
                return this.reqres.request.apply(this.reqres, arguments);
              },
              addInitializer: function (e) {
                this._initCallbacks.add(e);
              },
              start: function (e) {
                this.triggerMethod("before:start", e),
                  this._initCallbacks.run(e, this),
                  this.triggerMethod("start", e);
              },
              addRegions: function (e) {
                return this._regionManager.addRegions(e);
              },
              emptyRegions: function () {
                return this._regionManager.emptyRegions();
              },
              removeRegion: function (e) {
                return this._regionManager.removeRegion(e);
              },
              getRegion: function (e) {
                return this._regionManager.get(e);
              },
              getRegions: function () {
                return this._regionManager.getRegions();
              },
              module: function (e, t) {
                var i = o.Module.getClass(t),
                  r = n.toArray(arguments);
                return r.unshift(this), i.create.apply(i, r);
              },
              getRegionManager: function () {
                return new o.RegionManager();
              },
              _initializeRegions: function (e) {
                var t = n.isFunction(this.regions)
                  ? this.regions(e)
                  : this.regions || {};
                this._initRegionManager();
                var i = o.getOption(e, "regions");
                return (
                  n.isFunction(i) && (i = i.call(this, e)),
                  n.extend(t, i),
                  this.addRegions(t),
                  this
                );
              },
              _initRegionManager: function () {
                (this._regionManager = this.getRegionManager()),
                  (this._regionManager._parent = this),
                  this.listenTo(
                    this._regionManager,
                    "before:add:region",
                    function () {
                      o._triggerMethod(this, "before:add:region", arguments);
                    }
                  ),
                  this.listenTo(
                    this._regionManager,
                    "add:region",
                    function (e, t) {
                      (this[e] = t),
                        o._triggerMethod(this, "add:region", arguments);
                    }
                  ),
                  this.listenTo(
                    this._regionManager,
                    "before:remove:region",
                    function () {
                      o._triggerMethod(this, "before:remove:region", arguments);
                    }
                  ),
                  this.listenTo(
                    this._regionManager,
                    "remove:region",
                    function (e) {
                      delete this[e],
                        o._triggerMethod(this, "remove:region", arguments);
                    }
                  );
              },
              _initChannel: function () {
                (this.channelName = n.result(this, "channelName") || "global"),
                  (this.channel =
                    n.result(this, "channel") ||
                    t.Wreqr.radio.channel(this.channelName)),
                  (this.vent = n.result(this, "vent") || this.channel.vent),
                  (this.commands =
                    n.result(this, "commands") || this.channel.commands),
                  (this.reqres =
                    n.result(this, "reqres") || this.channel.reqres);
              },
            })),
            (o.Module = function (e, t, i) {
              (this.moduleName = e),
                (this.options = n.extend({}, this.options, i)),
                (this.initialize = i.initialize || this.initialize),
                (this.submodules = {}),
                this._setupInitializersAndFinalizers(),
                (this.app = t),
                n.isFunction(this.initialize) &&
                  this.initialize(e, t, this.options);
            }),
            (o.Module.extend = o.extend),
            n.extend(o.Module.prototype, t.Events, {
              startWithParent: !0,
              initialize: function () {},
              addInitializer: function (e) {
                this._initializerCallbacks.add(e);
              },
              addFinalizer: function (e) {
                this._finalizerCallbacks.add(e);
              },
              start: function (e) {
                this._isInitialized ||
                  (n.each(this.submodules, function (t) {
                    t.startWithParent && t.start(e);
                  }),
                  this.triggerMethod("before:start", e),
                  this._initializerCallbacks.run(e, this),
                  (this._isInitialized = !0),
                  this.triggerMethod("start", e));
              },
              stop: function () {
                this._isInitialized &&
                  ((this._isInitialized = !1),
                  this.triggerMethod("before:stop"),
                  n.invoke(this.submodules, "stop"),
                  this._finalizerCallbacks.run(void 0, this),
                  this._initializerCallbacks.reset(),
                  this._finalizerCallbacks.reset(),
                  this.triggerMethod("stop"));
              },
              addDefinition: function (e, t) {
                this._runModuleDefinition(e, t);
              },
              _runModuleDefinition: function (e, i) {
                if (e) {
                  var r = n.flatten([this, this.app, t, o, t.$, n, i]);
                  e.apply(this, r);
                }
              },
              _setupInitializersAndFinalizers: function () {
                (this._initializerCallbacks = new o.Callbacks()),
                  (this._finalizerCallbacks = new o.Callbacks());
              },
              triggerMethod: o.triggerMethod,
            }),
            n.extend(o.Module, {
              create: function (e, t, i) {
                var r = e,
                  o = n.drop(arguments, 3),
                  s = (t = t.split(".")).length,
                  a = [];
                return (
                  (a[s - 1] = i),
                  n.each(
                    t,
                    function (t, n) {
                      var s = r;
                      (r = this._getModule(s, t, e, i)),
                        this._addModuleDefinition(s, r, a[n], o);
                    },
                    this
                  ),
                  r
                );
              },
              _getModule: function (e, t, i, r, o) {
                var s = n.extend({}, r),
                  a = this.getClass(r),
                  u = e[t];
                return (
                  u ||
                    ((u = new a(t, i, s)), (e[t] = u), (e.submodules[t] = u)),
                  u
                );
              },
              getClass: function (e) {
                var t = o.Module;
                return e
                  ? e.prototype instanceof t
                    ? e
                    : e.moduleClass || t
                  : t;
              },
              _addModuleDefinition: function (e, t, n, i) {
                var r = this._getDefine(n),
                  o = this._getStartWithParent(n, t);
                r && t.addDefinition(r, i), this._addStartWithParent(e, t, o);
              },
              _getStartWithParent: function (e, t) {
                var i;
                return n.isFunction(e) && e.prototype instanceof o.Module
                  ? ((i = t.constructor.prototype.startWithParent),
                    !!n.isUndefined(i) || i)
                  : !n.isObject(e) ||
                      ((i = e.startWithParent), !!n.isUndefined(i) || i);
              },
              _getDefine: function (e) {
                return !n.isFunction(e) || e.prototype instanceof o.Module
                  ? n.isObject(e)
                    ? e.define
                    : null
                  : e;
              },
              _addStartWithParent: function (e, t, n) {
                (t.startWithParent = t.startWithParent && n),
                  t.startWithParent &&
                    !t.startWithParentIsConfigured &&
                    ((t.startWithParentIsConfigured = !0),
                    e.addInitializer(function (e) {
                      t.startWithParent && t.start(e);
                    }));
              },
            }),
            o
          );
        });
      },
      {
        backbone: 18,
        "backbone.babysitter": 12,
        "backbone.wreqr": 16,
        underscore: 15,
      },
    ],
    15: [
      function (e, t, n) {
        arguments[4][13][0].apply(n, arguments);
      },
      {
        dup: 13,
      },
    ],
    16: [
      function (e, t, n) {
        !(function (i, r) {
          if ("function" == typeof define && define.amd)
            define(["backbone", "underscore"], function (e, t) {
              return r(e, t);
            });
          else if (void 0 !== n) {
            var o = e("backbone"),
              s = e("underscore");
            t.exports = r(o, s);
          } else r(i.Backbone, i._);
        })(this, function (e, t) {
          "use strict";
          var n,
            i,
            r = e.Wreqr,
            o = (e.Wreqr = {});
          return (
            (e.Wreqr.VERSION = "1.4.0"),
            (e.Wreqr.noConflict = function () {
              return (e.Wreqr = r), this;
            }),
            (o.Handlers = (function (e, t) {
              var n = function (e) {
                (this.options = e),
                  (this._wreqrHandlers = {}),
                  t.isFunction(this.initialize) && this.initialize(e);
              };
              return (
                (n.extend = e.Model.extend),
                t.extend(n.prototype, e.Events, {
                  setHandlers: function (e) {
                    t.each(
                      e,
                      t.bind(function (e, n) {
                        var i = null;
                        t.isObject(e) &&
                          !t.isFunction(e) &&
                          ((i = e.context), (e = e.callback)),
                          this.setHandler(n, e, i);
                      }, this)
                    );
                  },
                  setHandler: function (e, t, n) {
                    var i = {
                      callback: t,
                      context: n,
                    };
                    (this._wreqrHandlers[e] = i),
                      this.trigger("handler:add", e, t, n);
                  },
                  hasHandler: function (e) {
                    return !!this._wreqrHandlers[e];
                  },
                  getHandler: function (e) {
                    var t = this._wreqrHandlers[e];
                    if (t)
                      return function () {
                        return t.callback.apply(t.context, arguments);
                      };
                  },
                  removeHandler: function (e) {
                    delete this._wreqrHandlers[e];
                  },
                  removeAllHandlers: function () {
                    this._wreqrHandlers = {};
                  },
                }),
                n
              );
            })(e, t)),
            (o.CommandStorage =
              ((n = function (e) {
                (this.options = e),
                  (this._commands = {}),
                  t.isFunction(this.initialize) && this.initialize(e);
              }),
              t.extend(n.prototype, e.Events, {
                getCommands: function (e) {
                  var t = this._commands[e];
                  return (
                    t ||
                      ((t = {
                        command: e,
                        instances: [],
                      }),
                      (this._commands[e] = t)),
                    t
                  );
                },
                addCommand: function (e, t) {
                  this.getCommands(e).instances.push(t);
                },
                clearCommands: function (e) {
                  this.getCommands(e).instances = [];
                },
              }),
              n)),
            (o.Commands = (function (e, t) {
              return e.Handlers.extend({
                storageType: e.CommandStorage,
                constructor: function (t) {
                  (this.options = t || {}),
                    this._initializeStorage(this.options),
                    this.on("handler:add", this._executeCommands, this),
                    e.Handlers.prototype.constructor.apply(this, arguments);
                },
                execute: function (e) {
                  e = arguments[0];
                  var n = t.rest(arguments);
                  this.hasHandler(e)
                    ? this.getHandler(e).apply(this, n)
                    : this.storage.addCommand(e, n);
                },
                _executeCommands: function (e, n, i) {
                  var r = this.storage.getCommands(e);
                  t.each(r.instances, function (e) {
                    n.apply(i, e);
                  }),
                    this.storage.clearCommands(e);
                },
                _initializeStorage: function (e) {
                  var n,
                    i = e.storageType || this.storageType;
                  (n = t.isFunction(i) ? new i() : i), (this.storage = n);
                },
              });
            })(o, t)),
            (o.RequestResponse = (function (e, t) {
              return e.Handlers.extend({
                request: function (e) {
                  if (this.hasHandler(e))
                    return this.getHandler(e).apply(this, t.rest(arguments));
                },
              });
            })(o, t)),
            (o.EventAggregator = (function (e, t) {
              var n = function () {};
              return (
                (n.extend = e.Model.extend), t.extend(n.prototype, e.Events), n
              );
            })(e, t)),
            (o.Channel =
              ((i = function (t) {
                (this.vent = new e.Wreqr.EventAggregator()),
                  (this.reqres = new e.Wreqr.RequestResponse()),
                  (this.commands = new e.Wreqr.Commands()),
                  (this.channelName = t);
              }),
              t.extend(i.prototype, {
                reset: function () {
                  return (
                    this.vent.off(),
                    this.vent.stopListening(),
                    this.reqres.removeAllHandlers(),
                    this.commands.removeAllHandlers(),
                    this
                  );
                },
                connectEvents: function (e, t) {
                  return this._connect("vent", e, t), this;
                },
                connectCommands: function (e, t) {
                  return this._connect("commands", e, t), this;
                },
                connectRequests: function (e, t) {
                  return this._connect("reqres", e, t), this;
                },
                _connect: function (e, n, i) {
                  if (n) {
                    i = i || this;
                    var r = "vent" === e ? "on" : "setHandler";
                    t.each(
                      n,
                      t.bind(function (n, o) {
                        this[e][r](o, t.bind(n, i));
                      }, this)
                    );
                  }
                },
              }),
              i)),
            (o.radio = (function (e, t) {
              var n = function () {
                (this._channels = {}),
                  (this.vent = {}),
                  (this.commands = {}),
                  (this.reqres = {}),
                  this._proxyMethods();
              };
              t.extend(n.prototype, {
                channel: function (e) {
                  if (!e) throw new Error("Channel must receive a name");
                  return this._getChannel(e);
                },
                _getChannel: function (t) {
                  var n = this._channels[t];
                  return (
                    n || ((n = new e.Channel(t)), (this._channels[t] = n)), n
                  );
                },
                _proxyMethods: function () {
                  t.each(
                    ["vent", "commands", "reqres"],
                    t.bind(function (e) {
                      t.each(
                        i[e],
                        t.bind(function (t) {
                          this[e][t] = r(this, e, t);
                        }, this)
                      );
                    }, this)
                  );
                },
              });
              var i = {
                  vent: [
                    "on",
                    "off",
                    "trigger",
                    "once",
                    "stopListening",
                    "listenTo",
                    "listenToOnce",
                  ],
                  commands: [
                    "execute",
                    "setHandler",
                    "setHandlers",
                    "removeHandler",
                    "removeAllHandlers",
                  ],
                  reqres: [
                    "request",
                    "setHandler",
                    "setHandlers",
                    "removeHandler",
                    "removeAllHandlers",
                  ],
                },
                r = function (e, n, i) {
                  return function (r) {
                    var o = e._getChannel(r)[n];
                    return o[i].apply(o, t.rest(arguments));
                  };
                };
              return new n();
            })(o, t)),
            e.Wreqr
          );
        });
      },
      {
        backbone: 18,
        underscore: 17,
      },
    ],
    17: [
      function (e, t, n) {
        arguments[4][13][0].apply(n, arguments);
      },
      {
        dup: 13,
      },
    ],
    18: [
      function (e, t, n) {
        (function (t) {
          !(function (i) {
            var r =
              ("object" == typeof self && self.self == self && self) ||
              ("object" == typeof t && t.global == t && t);
            if ("function" == typeof define && define.amd)
              define(["underscore", "jquery", "exports"], function (e, t, n) {
                r.Backbone = i(r, n, e, t);
              });
            else if (void 0 !== n) {
              var o,
                s = e("underscore");
              try {
                o = e("jquery");
              } catch (e) {}
              i(r, n, s, o);
            } else
              r.Backbone = i(r, {}, r._, r.jQuery || r.Zepto || r.ender || r.$);
          })(function (e, t, n, i) {
            var r = e.Backbone,
              o = [].slice;
            (t.VERSION = "1.2.1"),
              (t.$ = i),
              (t.noConflict = function () {
                return (e.Backbone = r), this;
              }),
              (t.emulateHTTP = !1),
              (t.emulateJSON = !1);
            var s = function (e, t, i) {
                n.each(t, function (t, r) {
                  n[r] &&
                    (e.prototype[r] = (function (e, t, i) {
                      switch (e) {
                        case 1:
                          return function () {
                            return n[t](this[i]);
                          };
                        case 2:
                          return function (e) {
                            return n[t](this[i], e);
                          };
                        case 3:
                          return function (e, r) {
                            return n[t](this[i], e, r);
                          };
                        case 4:
                          return function (e, r, o) {
                            return n[t](this[i], e, r, o);
                          };
                        default:
                          return function () {
                            var e = o.call(arguments);
                            return e.unshift(this[i]), n[t].apply(n, e);
                          };
                      }
                    })(t, r, i));
                });
              },
              a = (t.Events = {}),
              u = /\s+/,
              c = function (e, t, i, r, o) {
                var s,
                  a = 0;
                if (i && "object" == typeof i) {
                  void 0 !== r &&
                    "context" in o &&
                    void 0 === o.context &&
                    (o.context = r);
                  for (s = n.keys(i); a < s.length; a++)
                    t = e(t, s[a], i[s[a]], o);
                } else if (i && u.test(i))
                  for (s = i.split(u); a < s.length; a++) t = e(t, s[a], r, o);
                else t = e(t, i, r, o);
                return t;
              };
            a.on = function (e, t, n) {
              return l(this, e, t, n);
            };
            var l = function (e, t, n, i, r) {
              ((e._events = c(h, e._events || {}, t, n, {
                context: i,
                ctx: e,
                listening: r,
              })),
              r) && ((e._listeners || (e._listeners = {}))[r.id] = r);
              return e;
            };
            a.listenTo = function (e, t, i) {
              if (!e) return this;
              var r = e._listenId || (e._listenId = n.uniqueId("l")),
                o = this._listeningTo || (this._listeningTo = {}),
                s = o[r];
              if (!s) {
                var a = this._listenId || (this._listenId = n.uniqueId("l"));
                s = o[r] = {
                  obj: e,
                  objId: r,
                  id: a,
                  listeningTo: o,
                  count: 0,
                };
              }
              return l(e, t, i, this, s), this;
            };
            var h = function (e, t, n, i) {
              if (n) {
                var r = e[t] || (e[t] = []),
                  o = i.context,
                  s = i.ctx,
                  a = i.listening;
                a && a.count++,
                  r.push({
                    callback: n,
                    context: o,
                    ctx: o || s,
                    listening: a,
                  });
              }
              return e;
            };
            (a.off = function (e, t, n) {
              return this._events
                ? ((this._events = c(f, this._events, e, t, {
                    context: n,
                    listeners: this._listeners,
                  })),
                  this)
                : this;
            }),
              (a.stopListening = function (e, t, i) {
                var r = this._listeningTo;
                if (!r) return this;
                for (
                  var o = e ? [e._listenId] : n.keys(r), s = 0;
                  s < o.length;
                  s++
                ) {
                  var a = r[o[s]];
                  if (!a) break;
                  a.obj.off(t, i, this);
                }
                return n.isEmpty(r) && (this._listeningTo = void 0), this;
              });
            var f = function (e, t, i, r) {
              if (e) {
                var o,
                  s = 0,
                  a = r.context,
                  u = r.listeners;
                if (t || i || a) {
                  for (var c = t ? [t] : n.keys(e); s < c.length; s++) {
                    var l = e[(t = c[s])];
                    if (!l) break;
                    for (var h = [], f = 0; f < l.length; f++) {
                      var d = l[f];
                      (i && i !== d.callback && i !== d.callback._callback) ||
                      (a && a !== d.context)
                        ? h.push(d)
                        : (o = d.listening) &&
                          0 == --o.count &&
                          (delete u[o.id], delete o.listeningTo[o.objId]);
                    }
                    h.length ? (e[t] = h) : delete e[t];
                  }
                  return n.size(e) ? e : void 0;
                }
                for (var p = n.keys(u); s < p.length; s++)
                  delete u[(o = u[p[s]]).id], delete o.listeningTo[o.objId];
              }
            };
            (a.once = function (e, t, i) {
              var r = c(d, {}, e, t, n.bind(this.off, this));
              return this.on(r, void 0, i);
            }),
              (a.listenToOnce = function (e, t, i) {
                var r = c(d, {}, t, i, n.bind(this.stopListening, this, e));
                return this.listenTo(e, r);
              });
            var d = function (e, t, i, r) {
              if (i) {
                var o = (e[t] = n.once(function () {
                  r(t, o), i.apply(this, arguments);
                }));
                o._callback = i;
              }
              return e;
            };
            a.trigger = function (e) {
              if (!this._events) return this;
              for (
                var t = Math.max(0, arguments.length - 1), n = Array(t), i = 0;
                i < t;
                i++
              )
                n[i] = arguments[i + 1];
              return c(p, this._events, e, void 0, n), this;
            };
            var p = function (e, t, n, i) {
                if (e) {
                  var r = e[t],
                    o = e.all;
                  r && o && (o = o.slice()),
                    r && g(r, i),
                    o && g(o, [t].concat(i));
                }
                return e;
              },
              g = function (e, t) {
                var n,
                  i = -1,
                  r = e.length,
                  o = t[0],
                  s = t[1],
                  a = t[2];
                switch (t.length) {
                  case 0:
                    for (; ++i < r; ) (n = e[i]).callback.call(n.ctx);
                    return;
                  case 1:
                    for (; ++i < r; ) (n = e[i]).callback.call(n.ctx, o);
                    return;
                  case 2:
                    for (; ++i < r; ) (n = e[i]).callback.call(n.ctx, o, s);
                    return;
                  case 3:
                    for (; ++i < r; ) (n = e[i]).callback.call(n.ctx, o, s, a);
                    return;
                  default:
                    for (; ++i < r; ) (n = e[i]).callback.apply(n.ctx, t);
                    return;
                }
              };
            (a.bind = a.on), (a.unbind = a.off), n.extend(t, a);
            var v = (t.Model = function (e, t) {
              var i = e || {};
              t || (t = {}),
                (this.cid = n.uniqueId(this.cidPrefix)),
                (this.attributes = {}),
                t.collection && (this.collection = t.collection),
                t.parse && (i = this.parse(i, t) || {}),
                (i = n.defaults({}, i, n.result(this, "defaults"))),
                this.set(i, t),
                (this.changed = {}),
                this.initialize.apply(this, arguments);
            });
            n.extend(v.prototype, a, {
              changed: null,
              validationError: null,
              idAttribute: "id",
              cidPrefix: "c",
              initialize: function () {},
              toJSON: function (e) {
                return n.clone(this.attributes);
              },
              sync: function () {
                return t.sync.apply(this, arguments);
              },
              get: function (e) {
                return this.attributes[e];
              },
              escape: function (e) {
                return n.escape(this.get(e));
              },
              has: function (e) {
                return null != this.get(e);
              },
              matches: function (e) {
                return !!n.iteratee(e, this)(this.attributes);
              },
              set: function (e, t, i) {
                if (null == e) return this;
                var r;
                if (
                  ("object" == typeof e
                    ? ((r = e), (i = t))
                    : ((r = {})[e] = t),
                  i || (i = {}),
                  !this._validate(r, i))
                )
                  return !1;
                var o = i.unset,
                  s = i.silent,
                  a = [],
                  u = this._changing;
                (this._changing = !0),
                  u ||
                    ((this._previousAttributes = n.clone(this.attributes)),
                    (this.changed = {}));
                var c = this.attributes,
                  l = this.changed,
                  h = this._previousAttributes;
                for (var f in (this.idAttribute in r &&
                  (this.id = r[this.idAttribute]),
                r))
                  (t = r[f]),
                    n.isEqual(c[f], t) || a.push(f),
                    n.isEqual(h[f], t) ? delete l[f] : (l[f] = t),
                    o ? delete c[f] : (c[f] = t);
                if (!s) {
                  a.length && (this._pending = i);
                  for (var d = 0; d < a.length; d++)
                    this.trigger("change:" + a[d], this, c[a[d]], i);
                }
                if (u) return this;
                if (!s)
                  for (; this._pending; )
                    (i = this._pending),
                      (this._pending = !1),
                      this.trigger("change", this, i);
                return (this._pending = !1), (this._changing = !1), this;
              },
              unset: function (e, t) {
                return this.set(
                  e,
                  void 0,
                  n.extend({}, t, {
                    unset: !0,
                  })
                );
              },
              clear: function (e) {
                var t = {};
                for (var i in this.attributes) t[i] = void 0;
                return this.set(
                  t,
                  n.extend({}, e, {
                    unset: !0,
                  })
                );
              },
              hasChanged: function (e) {
                return null == e
                  ? !n.isEmpty(this.changed)
                  : n.has(this.changed, e);
              },
              changedAttributes: function (e) {
                if (!e) return !!this.hasChanged() && n.clone(this.changed);
                var t = this._changing
                    ? this._previousAttributes
                    : this.attributes,
                  i = {};
                for (var r in e) {
                  var o = e[r];
                  n.isEqual(t[r], o) || (i[r] = o);
                }
                return !!n.size(i) && i;
              },
              previous: function (e) {
                return null != e && this._previousAttributes
                  ? this._previousAttributes[e]
                  : null;
              },
              previousAttributes: function () {
                return n.clone(this._previousAttributes);
              },
              fetch: function (e) {
                e = n.extend(
                  {
                    parse: !0,
                  },
                  e
                );
                var t = this,
                  i = e.success;
                return (
                  (e.success = function (n) {
                    var r = e.parse ? t.parse(n, e) : n;
                    if (!t.set(r, e)) return !1;
                    i && i.call(e.context, t, n, e), t.trigger("sync", t, n, e);
                  }),
                  N(this, e),
                  this.sync("read", this, e)
                );
              },
              save: function (e, t, i) {
                var r;
                null == e || "object" == typeof e
                  ? ((r = e), (i = t))
                  : ((r = {})[e] = t);
                var o = (i = n.extend(
                  {
                    validate: !0,
                    parse: !0,
                  },
                  i
                )).wait;
                if (r && !o) {
                  if (!this.set(r, i)) return !1;
                } else if (!this._validate(r, i)) return !1;
                var s = this,
                  a = i.success,
                  u = this.attributes;
                (i.success = function (e) {
                  s.attributes = u;
                  var t = i.parse ? s.parse(e, i) : e;
                  if ((o && (t = n.extend({}, r, t)), t && !s.set(t, i)))
                    return !1;
                  a && a.call(i.context, s, e, i), s.trigger("sync", s, e, i);
                }),
                  N(this, i),
                  r && o && (this.attributes = n.extend({}, u, r));
                var c = this.isNew() ? "create" : i.patch ? "patch" : "update";
                "patch" !== c || i.attrs || (i.attrs = r);
                var l = this.sync(c, this, i);
                return (this.attributes = u), l;
              },
              destroy: function (e) {
                e = e ? n.clone(e) : {};
                var t = this,
                  i = e.success,
                  r = e.wait,
                  o = function () {
                    t.stopListening(), t.trigger("destroy", t, t.collection, e);
                  };
                e.success = function (n) {
                  r && o(),
                    i && i.call(e.context, t, n, e),
                    t.isNew() || t.trigger("sync", t, n, e);
                };
                var s = !1;
                return (
                  this.isNew()
                    ? n.defer(e.success)
                    : (N(this, e), (s = this.sync("delete", this, e))),
                  r || o(),
                  s
                );
              },
              url: function () {
                var e =
                  n.result(this, "urlRoot") ||
                  n.result(this.collection, "url") ||
                  D();
                if (this.isNew()) return e;
                var t = this.get(this.idAttribute);
                return e.replace(/[^\/]$/, "$&/") + encodeURIComponent(t);
              },
              parse: function (e, t) {
                return e;
              },
              clone: function () {
                return new this.constructor(this.attributes);
              },
              isNew: function () {
                return !this.has(this.idAttribute);
              },
              isValid: function (e) {
                return this._validate(
                  {},
                  n.defaults(
                    {
                      validate: !0,
                    },
                    e
                  )
                );
              },
              _validate: function (e, t) {
                if (!t.validate || !this.validate) return !0;
                e = n.extend({}, this.attributes, e);
                var i = (this.validationError = this.validate(e, t) || null);
                return (
                  !i ||
                  (this.trigger(
                    "invalid",
                    this,
                    i,
                    n.extend(t, {
                      validationError: i,
                    })
                  ),
                  !1)
                );
              },
            });
            s(
              v,
              {
                keys: 1,
                values: 1,
                pairs: 1,
                invert: 1,
                pick: 0,
                omit: 0,
                chain: 1,
                isEmpty: 1,
              },
              "attributes"
            );
            var m = (t.Collection = function (e, t) {
                t || (t = {}),
                  t.model && (this.model = t.model),
                  void 0 !== t.comparator && (this.comparator = t.comparator),
                  this._reset(),
                  this.initialize.apply(this, arguments),
                  e &&
                    this.reset(
                      e,
                      n.extend(
                        {
                          silent: !0,
                        },
                        t
                      )
                    );
              }),
              y = {
                add: !0,
                remove: !0,
                merge: !0,
              },
              b = {
                add: !0,
                remove: !1,
              };
            n.extend(m.prototype, a, {
              model: v,
              initialize: function () {},
              toJSON: function (e) {
                return this.map(function (t) {
                  return t.toJSON(e);
                });
              },
              sync: function () {
                return t.sync.apply(this, arguments);
              },
              add: function (e, t) {
                return this.set(
                  e,
                  n.extend(
                    {
                      merge: !1,
                    },
                    t,
                    b
                  )
                );
              },
              remove: function (e, t) {
                t = n.extend({}, t);
                var i = !n.isArray(e);
                e = i ? [e] : n.clone(e);
                var r = this._removeModels(e, t);
                return (
                  !t.silent && r && this.trigger("update", this, t),
                  i ? r[0] : r
                );
              },
              set: function (e, t) {
                (t = n.defaults({}, t, y)).parse &&
                  !this._isModel(e) &&
                  (e = this.parse(e, t));
                var i,
                  r,
                  o,
                  s,
                  a,
                  u = !n.isArray(e);
                e = u ? (e ? [e] : []) : e.slice();
                var c = t.at;
                null != c && (c = +c), c < 0 && (c += this.length + 1);
                for (
                  var l = this.comparator && null == c && !1 !== t.sort,
                    h = n.isString(this.comparator) ? this.comparator : null,
                    f = [],
                    d = [],
                    p = {},
                    g = t.add,
                    v = t.merge,
                    m = t.remove,
                    b = !(l || !g || !m) && [],
                    w = !1,
                    x = 0;
                  x < e.length;
                  x++
                ) {
                  if (((o = e[x]), (s = this.get(o))))
                    m && (p[s.cid] = !0),
                      v &&
                        o !== s &&
                        ((o = this._isModel(o) ? o.attributes : o),
                        t.parse && (o = s.parse(o, t)),
                        s.set(o, t),
                        l && !a && s.hasChanged(h) && (a = !0)),
                      (e[x] = s);
                  else if (g) {
                    if (!(r = e[x] = this._prepareModel(o, t))) continue;
                    f.push(r), this._addReference(r, t);
                  }
                  (r = s || r) &&
                    ((i = this.modelId(r.attributes)),
                    !b ||
                      (!r.isNew() && p[i]) ||
                      (b.push(r),
                      (w =
                        w || !this.models[x] || r.cid !== this.models[x].cid)),
                    (p[i] = !0));
                }
                if (m) {
                  for (x = 0; x < this.length; x++)
                    p[(r = this.models[x]).cid] || d.push(r);
                  d.length && this._removeModels(d, t);
                }
                if (f.length || w)
                  if ((l && (a = !0), (this.length += f.length), null != c))
                    for (x = 0; x < f.length; x++)
                      this.models.splice(c + x, 0, f[x]);
                  else {
                    b && (this.models.length = 0);
                    var _ = b || f;
                    for (x = 0; x < _.length; x++) this.models.push(_[x]);
                  }
                if (
                  (a &&
                    this.sort({
                      silent: !0,
                    }),
                  !t.silent)
                ) {
                  var C = null != c ? n.clone(t) : t;
                  for (x = 0; x < f.length; x++)
                    null != c && (C.index = c + x),
                      (r = f[x]).trigger("add", r, this, C);
                  (a || w) && this.trigger("sort", this, t),
                    (f.length || d.length) && this.trigger("update", this, t);
                }
                return u ? e[0] : e;
              },
              reset: function (e, t) {
                t = t ? n.clone(t) : {};
                for (var i = 0; i < this.models.length; i++)
                  this._removeReference(this.models[i], t);
                return (
                  (t.previousModels = this.models),
                  this._reset(),
                  (e = this.add(
                    e,
                    n.extend(
                      {
                        silent: !0,
                      },
                      t
                    )
                  )),
                  t.silent || this.trigger("reset", this, t),
                  e
                );
              },
              push: function (e, t) {
                return this.add(
                  e,
                  n.extend(
                    {
                      at: this.length,
                    },
                    t
                  )
                );
              },
              pop: function (e) {
                var t = this.at(this.length - 1);
                return this.remove(t, e);
              },
              unshift: function (e, t) {
                return this.add(
                  e,
                  n.extend(
                    {
                      at: 0,
                    },
                    t
                  )
                );
              },
              shift: function (e) {
                var t = this.at(0);
                return this.remove(t, e);
              },
              slice: function () {
                return o.apply(this.models, arguments);
              },
              get: function (e) {
                if (null != e) {
                  var t = this.modelId(this._isModel(e) ? e.attributes : e);
                  return this._byId[e] || this._byId[t] || this._byId[e.cid];
                }
              },
              at: function (e) {
                return e < 0 && (e += this.length), this.models[e];
              },
              where: function (e, t) {
                var i = n.matches(e);
                return this[t ? "find" : "filter"](function (e) {
                  return i(e.attributes);
                });
              },
              findWhere: function (e) {
                return this.where(e, !0);
              },
              sort: function (e) {
                if (!this.comparator)
                  throw new Error("Cannot sort a set without a comparator");
                return (
                  e || (e = {}),
                  n.isString(this.comparator) || 1 === this.comparator.length
                    ? (this.models = this.sortBy(this.comparator, this))
                    : this.models.sort(n.bind(this.comparator, this)),
                  e.silent || this.trigger("sort", this, e),
                  this
                );
              },
              pluck: function (e) {
                return n.invoke(this.models, "get", e);
              },
              fetch: function (e) {
                var t = (e = n.extend(
                    {
                      parse: !0,
                    },
                    e
                  )).success,
                  i = this;
                return (
                  (e.success = function (n) {
                    var r = e.reset ? "reset" : "set";
                    i[r](n, e),
                      t && t.call(e.context, i, n, e),
                      i.trigger("sync", i, n, e);
                  }),
                  N(this, e),
                  this.sync("read", this, e)
                );
              },
              create: function (e, t) {
                var i = (t = t ? n.clone(t) : {}).wait;
                if (!(e = this._prepareModel(e, t))) return !1;
                i || this.add(e, t);
                var r = this,
                  o = t.success;
                return (
                  (t.success = function (e, t, n) {
                    i && r.add(e, n), o && o.call(n.context, e, t, n);
                  }),
                  e.save(null, t),
                  e
                );
              },
              parse: function (e, t) {
                return e;
              },
              clone: function () {
                return new this.constructor(this.models, {
                  model: this.model,
                  comparator: this.comparator,
                });
              },
              modelId: function (e) {
                return e[this.model.prototype.idAttribute || "id"];
              },
              _reset: function () {
                (this.length = 0), (this.models = []), (this._byId = {});
              },
              _prepareModel: function (e, t) {
                if (this._isModel(e))
                  return e.collection || (e.collection = this), e;
                (t = t ? n.clone(t) : {}).collection = this;
                var i = new this.model(e, t);
                return i.validationError
                  ? (this.trigger("invalid", this, i.validationError, t), !1)
                  : i;
              },
              _removeModels: function (e, t) {
                for (var n = [], i = 0; i < e.length; i++) {
                  var r = this.get(e[i]);
                  if (r) {
                    var o = this.indexOf(r);
                    this.models.splice(o, 1),
                      this.length--,
                      t.silent ||
                        ((t.index = o), r.trigger("remove", r, this, t)),
                      n.push(r),
                      this._removeReference(r, t);
                  }
                }
                return !!n.length && n;
              },
              _isModel: function (e) {
                return e instanceof v;
              },
              _addReference: function (e, t) {
                this._byId[e.cid] = e;
                var n = this.modelId(e.attributes);
                null != n && (this._byId[n] = e),
                  e.on("all", this._onModelEvent, this);
              },
              _removeReference: function (e, t) {
                delete this._byId[e.cid];
                var n = this.modelId(e.attributes);
                null != n && delete this._byId[n],
                  this === e.collection && delete e.collection,
                  e.off("all", this._onModelEvent, this);
              },
              _onModelEvent: function (e, t, n, i) {
                if (("add" !== e && "remove" !== e) || n === this) {
                  if (("destroy" === e && this.remove(t, i), "change" === e)) {
                    var r = this.modelId(t.previousAttributes()),
                      o = this.modelId(t.attributes);
                    r !== o &&
                      (null != r && delete this._byId[r],
                      null != o && (this._byId[o] = t));
                  }
                  this.trigger.apply(this, arguments);
                }
              },
            });
            s(
              m,
              {
                forEach: 3,
                each: 3,
                map: 3,
                collect: 3,
                reduce: 4,
                foldl: 4,
                inject: 4,
                reduceRight: 4,
                foldr: 4,
                find: 3,
                detect: 3,
                filter: 3,
                select: 3,
                reject: 3,
                every: 3,
                all: 3,
                some: 3,
                any: 3,
                include: 2,
                contains: 2,
                invoke: 0,
                max: 3,
                min: 3,
                toArray: 1,
                size: 1,
                first: 3,
                head: 3,
                take: 3,
                initial: 3,
                rest: 3,
                tail: 3,
                drop: 3,
                last: 3,
                without: 0,
                difference: 0,
                indexOf: 3,
                shuffle: 1,
                lastIndexOf: 3,
                isEmpty: 1,
                chain: 1,
                sample: 3,
                partition: 3,
              },
              "models"
            );
            n.each(["groupBy", "countBy", "sortBy", "indexBy"], function (e) {
              n[e] &&
                (m.prototype[e] = function (t, i) {
                  var r = n.isFunction(t)
                    ? t
                    : function (e) {
                        return e.get(t);
                      };
                  return n[e](this.models, r, i);
                });
            });
            var w = (t.View = function (e) {
                (this.cid = n.uniqueId("view")),
                  n.extend(this, n.pick(e, _)),
                  this._ensureElement(),
                  this.initialize.apply(this, arguments);
              }),
              x = /^(\S+)\s*(.*)$/,
              _ = [
                "model",
                "collection",
                "el",
                "id",
                "attributes",
                "className",
                "tagName",
                "events",
              ];
            n.extend(w.prototype, a, {
              tagName: "div",
              $: function (e) {
                return this.$el.find(e);
              },
              initialize: function () {},
              render: function () {
                return this;
              },
              remove: function () {
                return this._removeElement(), this.stopListening(), this;
              },
              _removeElement: function () {
                this.$el.remove();
              },
              setElement: function (e) {
                return (
                  this.undelegateEvents(),
                  this._setElement(e),
                  this.delegateEvents(),
                  this
                );
              },
              _setElement: function (e) {
                (this.$el = e instanceof t.$ ? e : t.$(e)),
                  (this.el = this.$el[0]);
              },
              delegateEvents: function (e) {
                if ((e || (e = n.result(this, "events")), !e)) return this;
                for (var t in (this.undelegateEvents(), e)) {
                  var i = e[t];
                  if ((n.isFunction(i) || (i = this[i]), i)) {
                    var r = t.match(x);
                    this.delegate(r[1], r[2], n.bind(i, this));
                  }
                }
                return this;
              },
              delegate: function (e, t, n) {
                return (
                  this.$el.on(e + ".delegateEvents" + this.cid, t, n), this
                );
              },
              undelegateEvents: function () {
                return (
                  this.$el && this.$el.off(".delegateEvents" + this.cid), this
                );
              },
              undelegate: function (e, t, n) {
                return (
                  this.$el.off(e + ".delegateEvents" + this.cid, t, n), this
                );
              },
              _createElement: function (e) {
                return document.createElement(e);
              },
              _ensureElement: function () {
                if (this.el) this.setElement(n.result(this, "el"));
                else {
                  var e = n.extend({}, n.result(this, "attributes"));
                  this.id && (e.id = n.result(this, "id")),
                    this.className && (e.class = n.result(this, "className")),
                    this.setElement(
                      this._createElement(n.result(this, "tagName"))
                    ),
                    this._setAttributes(e);
                }
              },
              _setAttributes: function (e) {
                this.$el.attr(e);
              },
            }),
              (t.sync = function (e, i, r) {
                var o = C[e];
                n.defaults(r || (r = {}), {
                  emulateHTTP: t.emulateHTTP,
                  emulateJSON: t.emulateJSON,
                });
                var s = {
                  type: o,
                  dataType: "json",
                };
                if (
                  (r.url || (s.url = n.result(i, "url") || D()),
                  null != r.data ||
                    !i ||
                    ("create" !== e && "update" !== e && "patch" !== e) ||
                    ((s.contentType = "application/json"),
                    (s.data = JSON.stringify(r.attrs || i.toJSON(r)))),
                  r.emulateJSON &&
                    ((s.contentType = "application/x-www-form-urlencoded"),
                    (s.data = s.data
                      ? {
                          model: s.data,
                        }
                      : {})),
                  r.emulateHTTP &&
                    ("PUT" === o || "DELETE" === o || "PATCH" === o))
                ) {
                  (s.type = "POST"), r.emulateJSON && (s.data._method = o);
                  var a = r.beforeSend;
                  r.beforeSend = function (e) {
                    if ((e.setRequestHeader("X-HTTP-Method-Override", o), a))
                      return a.apply(this, arguments);
                  };
                }
                "GET" === s.type || r.emulateJSON || (s.processData = !1);
                var u = r.error;
                r.error = function (e, t, n) {
                  (r.textStatus = t),
                    (r.errorThrown = n),
                    u && u.call(r.context, e, t, n);
                };
                var c = (r.xhr = t.ajax(n.extend(s, r)));
                return i.trigger("request", i, c, r), c;
              });
            var C = {
              create: "POST",
              update: "PUT",
              patch: "PATCH",
              delete: "DELETE",
              read: "GET",
            };
            t.ajax = function () {
              return t.$.ajax.apply(t.$, arguments);
            };
            var k = (t.Router = function (e) {
                e || (e = {}),
                  e.routes && (this.routes = e.routes),
                  this._bindRoutes(),
                  this.initialize.apply(this, arguments);
              }),
              E = /\((.*?)\)/g,
              F = /(\(\?)?:\w+/g,
              T = /\*\w+/g,
              A = /[\-{}\[\]+?.,\\\^$|#\s]/g;
            n.extend(k.prototype, a, {
              initialize: function () {},
              route: function (e, i, r) {
                n.isRegExp(e) || (e = this._routeToRegExp(e)),
                  n.isFunction(i) && ((r = i), (i = "")),
                  r || (r = this[i]);
                var o = this;
                return (
                  t.history.route(e, function (n) {
                    var s = o._extractParameters(e, n);
                    !1 !== o.execute(r, s, i) &&
                      (o.trigger.apply(o, ["route:" + i].concat(s)),
                      o.trigger("route", i, s),
                      t.history.trigger("route", o, i, s));
                  }),
                  this
                );
              },
              execute: function (e, t, n) {
                e && e.apply(this, t);
              },
              navigate: function (e, n) {
                return t.history.navigate(e, n), this;
              },
              _bindRoutes: function () {
                if (this.routes) {
                  this.routes = n.result(this, "routes");
                  for (var e, t = n.keys(this.routes); null != (e = t.pop()); )
                    this.route(e, this.routes[e]);
                }
              },
              _routeToRegExp: function (e) {
                return (
                  (e = e
                    .replace(A, "\\$&")
                    .replace(E, "(?:$1)?")
                    .replace(F, function (e, t) {
                      return t ? e : "([^/?]+)";
                    })
                    .replace(T, "([^?]*?)")),
                  new RegExp("^" + e + "(?:\\?([\\s\\S]*))?$")
                );
              },
              _extractParameters: function (e, t) {
                var i = e.exec(t).slice(1);
                return n.map(i, function (e, t) {
                  return t === i.length - 1
                    ? e || null
                    : e
                    ? decodeURIComponent(e)
                    : null;
                });
              },
            });
            var M = (t.History = function () {
                (this.handlers = []),
                  n.bindAll(this, "checkUrl"),
                  "undefined" != typeof window &&
                    ((this.location = window.location),
                    (this.history = window.history));
              }),
              S = /^[#\/]|\s+$/g,
              j = /^\/+|\/+$/g,
              O = /#.*$/;
            (M.started = !1),
              n.extend(M.prototype, a, {
                interval: 50,
                atRoot: function () {
                  return (
                    this.location.pathname.replace(/[^\/]$/, "$&/") ===
                      this.root && !this.getSearch()
                  );
                },
                matchRoot: function () {
                  return (
                    this.decodeFragment(this.location.pathname).slice(
                      0,
                      this.root.length - 1
                    ) +
                      "/" ===
                    this.root
                  );
                },
                decodeFragment: function (e) {
                  return decodeURI(e.replace(/%25/g, "%2525"));
                },
                getSearch: function () {
                  var e = this.location.href.replace(/#.*/, "").match(/\?.+/);
                  return e ? e[0] : "";
                },
                getHash: function (e) {
                  var t = (e || this).location.href.match(/#(.*)$/);
                  return t ? t[1] : "";
                },
                getPath: function () {
                  var e = this.decodeFragment(
                    this.location.pathname + this.getSearch()
                  ).slice(this.root.length - 1);
                  return "/" === e.charAt(0) ? e.slice(1) : e;
                },
                getFragment: function (e) {
                  return (
                    null == e &&
                      (e =
                        this._usePushState || !this._wantsHashChange
                          ? this.getPath()
                          : this.getHash()),
                    e.replace(S, "")
                  );
                },
                start: function (e) {
                  if (M.started)
                    throw new Error(
                      "Backbone.history has already been started"
                    );
                  if (
                    ((M.started = !0),
                    (this.options = n.extend(
                      {
                        root: "/",
                      },
                      this.options,
                      e
                    )),
                    (this.root = this.options.root),
                    (this._wantsHashChange = !1 !== this.options.hashChange),
                    (this._hasHashChange = "onhashchange" in window),
                    (this._useHashChange =
                      this._wantsHashChange && this._hasHashChange),
                    (this._wantsPushState = !!this.options.pushState),
                    (this._hasPushState = !(
                      !this.history || !this.history.pushState
                    )),
                    (this._usePushState =
                      this._wantsPushState && this._hasPushState),
                    (this.fragment = this.getFragment()),
                    (this.root = ("/" + this.root + "/").replace(j, "/")),
                    this._wantsHashChange && this._wantsPushState)
                  ) {
                    if (!this._hasPushState && !this.atRoot()) {
                      var t = this.root.slice(0, -1) || "/";
                      return (
                        this.location.replace(t + "#" + this.getPath()), !0
                      );
                    }
                    this._hasPushState &&
                      this.atRoot() &&
                      this.navigate(this.getHash(), {
                        replace: !0,
                      });
                  }
                  if (
                    !this._hasHashChange &&
                    this._wantsHashChange &&
                    !this._usePushState
                  ) {
                    (this.iframe = document.createElement("iframe")),
                      (this.iframe.src = "javascript:0"),
                      (this.iframe.style.display = "none"),
                      (this.iframe.tabIndex = -1);
                    var i = document.body,
                      r = i.insertBefore(
                        this.iframe,
                        i.firstChild
                      ).contentWindow;
                    r.document.open(),
                      r.document.close(),
                      (r.location.hash = "#" + this.fragment);
                  }
                  var o =
                    window.addEventListener ||
                    function (e, t) {
                      return attachEvent("on" + e, t);
                    };
                  if (
                    (this._usePushState
                      ? o("popstate", this.checkUrl, !1)
                      : this._useHashChange && !this.iframe
                      ? o("hashchange", this.checkUrl, !1)
                      : this._wantsHashChange &&
                        (this._checkUrlInterval = setInterval(
                          this.checkUrl,
                          this.interval
                        )),
                    !this.options.silent)
                  )
                    return this.loadUrl();
                },
                stop: function () {
                  var e =
                    window.removeEventListener ||
                    function (e, t) {
                      return detachEvent("on" + e, t);
                    };
                  this._usePushState
                    ? e("popstate", this.checkUrl, !1)
                    : this._useHashChange &&
                      !this.iframe &&
                      e("hashchange", this.checkUrl, !1),
                    this.iframe &&
                      (document.body.removeChild(this.iframe),
                      (this.iframe = null)),
                    this._checkUrlInterval &&
                      clearInterval(this._checkUrlInterval),
                    (M.started = !1);
                },
                route: function (e, t) {
                  this.handlers.unshift({
                    route: e,
                    callback: t,
                  });
                },
                checkUrl: function (e) {
                  var t = this.getFragment();
                  if (
                    (t === this.fragment &&
                      this.iframe &&
                      (t = this.getHash(this.iframe.contentWindow)),
                    t === this.fragment)
                  )
                    return !1;
                  this.iframe && this.navigate(t), this.loadUrl();
                },
                loadUrl: function (e) {
                  return (
                    !!this.matchRoot() &&
                    ((e = this.fragment = this.getFragment(e)),
                    n.any(this.handlers, function (t) {
                      if (t.route.test(e)) return t.callback(e), !0;
                    }))
                  );
                },
                navigate: function (e, t) {
                  if (!M.started) return !1;
                  (t && !0 !== t) ||
                    (t = {
                      trigger: !!t,
                    }),
                    (e = this.getFragment(e || ""));
                  var n = this.root;
                  ("" !== e && "?" !== e.charAt(0)) ||
                    (n = n.slice(0, -1) || "/");
                  var i = n + e;
                  if (
                    ((e = this.decodeFragment(e.replace(O, ""))),
                    this.fragment !== e)
                  ) {
                    if (((this.fragment = e), this._usePushState))
                      this.history[t.replace ? "replaceState" : "pushState"](
                        {},
                        document.title,
                        i
                      );
                    else {
                      if (!this._wantsHashChange)
                        return this.location.assign(i);
                      if (
                        (this._updateHash(this.location, e, t.replace),
                        this.iframe &&
                          e !== this.getHash(this.iframe.contentWindow))
                      ) {
                        var r = this.iframe.contentWindow;
                        t.replace || (r.document.open(), r.document.close()),
                          this._updateHash(r.location, e, t.replace);
                      }
                    }
                    return t.trigger ? this.loadUrl(e) : void 0;
                  }
                },
                _updateHash: function (e, t, n) {
                  if (n) {
                    var i = e.href.replace(/(javascript:|#).*$/, "");
                    e.replace(i + "#" + t);
                  } else e.hash = "#" + t;
                },
              }),
              (t.history = new M());
            v.extend =
              m.extend =
              k.extend =
              w.extend =
              M.extend =
                function (e, t) {
                  var i,
                    r = this;
                  (i =
                    e && n.has(e, "constructor")
                      ? e.constructor
                      : function () {
                          return r.apply(this, arguments);
                        }),
                    n.extend(i, r, t);
                  var o = function () {
                    this.constructor = i;
                  };
                  return (
                    (o.prototype = r.prototype),
                    (i.prototype = new o()),
                    e && n.extend(i.prototype, e),
                    (i.__super__ = r.prototype),
                    i
                  );
                };
            var D = function () {
                throw new Error(
                  'A "url" property or function must be specified'
                );
              },
              N = function (e, t) {
                var n = t.error;
                t.error = function (i) {
                  n && n.call(t.context, e, i, t), e.trigger("error", e, i, t);
                };
              };
            return t;
          });
        }.call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        ));
      },
      {
        jquery: 19,
        underscore: 21,
      },
    ],
    19: [
      function (e, t, n) {
        (function (e) {
          (function (e, t, n, i, r) {
            var o, s;
            (o = "undefined" != typeof window ? window : this),
              (s = function (e, t) {
                var n = [],
                  r = n.slice,
                  o = n.concat,
                  s = n.push,
                  a = n.indexOf,
                  u = {},
                  c = u.toString,
                  l = u.hasOwnProperty,
                  h = {},
                  f = e.document,
                  d = function (e, t) {
                    return new d.fn.init(e, t);
                  },
                  p = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
                  g = /^-ms-/,
                  v = /-([\da-z])/gi,
                  m = function (e, t) {
                    return t.toUpperCase();
                  };

                function y(e) {
                  var t = "length" in e && e.length,
                    n = d.type(e);
                  return (
                    "function" !== n &&
                    !d.isWindow(e) &&
                    (!(1 !== e.nodeType || !t) ||
                      "array" === n ||
                      0 === t ||
                      ("number" == typeof t && t > 0 && t - 1 in e))
                  );
                }
                (d.fn = d.prototype =
                  {
                    jquery: "2.1.4",
                    constructor: d,
                    selector: "",
                    length: 0,
                    toArray: function () {
                      return r.call(this);
                    },
                    get: function (e) {
                      return null != e
                        ? e < 0
                          ? this[e + this.length]
                          : this[e]
                        : r.call(this);
                    },
                    pushStack: function (e) {
                      var t = d.merge(this.constructor(), e);
                      return (
                        (t.prevObject = this), (t.context = this.context), t
                      );
                    },
                    each: function (e, t) {
                      return d.each(this, e, t);
                    },
                    map: function (e) {
                      return this.pushStack(
                        d.map(this, function (t, n) {
                          return e.call(t, n, t);
                        })
                      );
                    },
                    slice: function () {
                      return this.pushStack(r.apply(this, arguments));
                    },
                    first: function () {
                      return this.eq(0);
                    },
                    last: function () {
                      return this.eq(-1);
                    },
                    eq: function (e) {
                      var t = this.length,
                        n = +e + (e < 0 ? t : 0);
                      return this.pushStack(n >= 0 && n < t ? [this[n]] : []);
                    },
                    end: function () {
                      return this.prevObject || this.constructor(null);
                    },
                    push: s,
                    sort: n.sort,
                    splice: n.splice,
                  }),
                  (d.extend = d.fn.extend =
                    function () {
                      var e,
                        t,
                        n,
                        i,
                        r,
                        o,
                        s = arguments[0] || {},
                        a = 1,
                        u = arguments.length,
                        c = !1;
                      for (
                        "boolean" == typeof s &&
                          ((c = s), (s = arguments[a] || {}), a++),
                          "object" == typeof s || d.isFunction(s) || (s = {}),
                          a === u && ((s = this), a--);
                        a < u;
                        a++
                      )
                        if (null != (e = arguments[a]))
                          for (t in e)
                            (n = s[t]),
                              s !== (i = e[t]) &&
                                (c &&
                                i &&
                                (d.isPlainObject(i) || (r = d.isArray(i)))
                                  ? (r
                                      ? ((r = !1),
                                        (o = n && d.isArray(n) ? n : []))
                                      : (o = n && d.isPlainObject(n) ? n : {}),
                                    (s[t] = d.extend(c, o, i)))
                                  : void 0 !== i && (s[t] = i));
                      return s;
                    }),
                  d.extend({
                    expando:
                      "jQuery" + ("2.1.4" + Math.random()).replace(/\D/g, ""),
                    isReady: !0,
                    error: function (e) {
                      throw new Error(e);
                    },
                    noop: function () {},
                    isFunction: function (e) {
                      return "function" === d.type(e);
                    },
                    isArray: Array.isArray,
                    isWindow: function (e) {
                      return null != e && e === e.window;
                    },
                    isNumeric: function (e) {
                      return !d.isArray(e) && e - parseFloat(e) + 1 >= 0;
                    },
                    isPlainObject: function (e) {
                      return (
                        "object" === d.type(e) &&
                        !e.nodeType &&
                        !d.isWindow(e) &&
                        !(
                          e.constructor &&
                          !l.call(e.constructor.prototype, "isPrototypeOf")
                        )
                      );
                    },
                    isEmptyObject: function (e) {
                      var t;
                      for (t in e) return !1;
                      return !0;
                    },
                    type: function (e) {
                      return null == e
                        ? e + ""
                        : "object" == typeof e || "function" == typeof e
                        ? u[c.call(e)] || "object"
                        : typeof e;
                    },
                    globalEval: function (e) {
                      var t,
                        n = eval;
                      (e = d.trim(e)) &&
                        (1 === e.indexOf("use strict")
                          ? (((t = f.createElement("script")).text = e),
                            f.head.appendChild(t).parentNode.removeChild(t))
                          : n(e));
                    },
                    camelCase: function (e) {
                      return e.replace(g, "ms-").replace(v, m);
                    },
                    nodeName: function (e, t) {
                      return (
                        e.nodeName &&
                        e.nodeName.toLowerCase() === t.toLowerCase()
                      );
                    },
                    each: function (e, t, n) {
                      var i = 0,
                        r = e.length,
                        o = y(e);
                      if (n) {
                        if (o) for (; i < r && !1 !== t.apply(e[i], n); i++);
                        else for (i in e) if (!1 === t.apply(e[i], n)) break;
                      } else if (o)
                        for (; i < r && !1 !== t.call(e[i], i, e[i]); i++);
                      else for (i in e) if (!1 === t.call(e[i], i, e[i])) break;
                      return e;
                    },
                    trim: function (e) {
                      return null == e ? "" : (e + "").replace(p, "");
                    },
                    makeArray: function (e, t) {
                      var n = t || [];
                      return (
                        null != e &&
                          (y(Object(e))
                            ? d.merge(n, "string" == typeof e ? [e] : e)
                            : s.call(n, e)),
                        n
                      );
                    },
                    inArray: function (e, t, n) {
                      return null == t ? -1 : a.call(t, e, n);
                    },
                    merge: function (e, t) {
                      for (var n = +t.length, i = 0, r = e.length; i < n; i++)
                        e[r++] = t[i];
                      return (e.length = r), e;
                    },
                    grep: function (e, t, n) {
                      for (var i = [], r = 0, o = e.length, s = !n; r < o; r++)
                        !t(e[r], r) !== s && i.push(e[r]);
                      return i;
                    },
                    map: function (e, t, n) {
                      var i,
                        r = 0,
                        s = e.length,
                        a = [];
                      if (y(e))
                        for (; r < s; r++)
                          null != (i = t(e[r], r, n)) && a.push(i);
                      else
                        for (r in e) null != (i = t(e[r], r, n)) && a.push(i);
                      return o.apply([], a);
                    },
                    guid: 1,
                    proxy: function (e, t) {
                      var n, i, o;
                      if (
                        ("string" == typeof t && ((n = e[t]), (t = e), (e = n)),
                        d.isFunction(e))
                      )
                        return (
                          (i = r.call(arguments, 2)),
                          ((o = function () {
                            return e.apply(
                              t || this,
                              i.concat(r.call(arguments))
                            );
                          }).guid = e.guid =
                            e.guid || d.guid++),
                          o
                        );
                    },
                    now: Date.now,
                    support: h,
                  }),
                  d.each(
                    "Boolean Number String Function Array Date RegExp Object Error".split(
                      " "
                    ),
                    function (e, t) {
                      u["[object " + t + "]"] = t.toLowerCase();
                    }
                  );
                var b = (function (e) {
                  var t,
                    n,
                    i,
                    r,
                    o,
                    s,
                    a,
                    u,
                    c,
                    l,
                    h,
                    f,
                    d,
                    p,
                    g,
                    v,
                    m,
                    y,
                    b,
                    w = "sizzle" + 1 * new Date(),
                    x = e.document,
                    _ = 0,
                    C = 0,
                    k = se(),
                    E = se(),
                    F = se(),
                    T = function (e, t) {
                      return e === t && (h = !0), 0;
                    },
                    A = 1 << 31,
                    M = {}.hasOwnProperty,
                    S = [],
                    j = S.pop,
                    O = S.push,
                    D = S.push,
                    N = S.slice,
                    V = function (e, t) {
                      for (var n = 0, i = e.length; n < i; n++)
                        if (e[n] === t) return n;
                      return -1;
                    },
                    R =
                      "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
                    I = "[\\x20\\t\\r\\n\\f]",
                    L = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
                    q = L.replace("w", "w#"),
                    B =
                      "\\[" +
                      I +
                      "*(" +
                      L +
                      ")(?:" +
                      I +
                      "*([*^$|!~]?=)" +
                      I +
                      "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
                      q +
                      "))|)" +
                      I +
                      "*\\]",
                    H =
                      ":(" +
                      L +
                      ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
                      B +
                      ")*)|.*)\\)|)",
                    z = new RegExp(I + "+", "g"),
                    $ = new RegExp(
                      "^" + I + "+|((?:^|[^\\\\])(?:\\\\.)*)" + I + "+$",
                      "g"
                    ),
                    P = new RegExp("^" + I + "*," + I + "*"),
                    U = new RegExp("^" + I + "*([>+~]|" + I + ")" + I + "*"),
                    W = new RegExp(
                      "=" + I + "*([^\\]'\"]*?)" + I + "*\\]",
                      "g"
                    ),
                    X = new RegExp(H),
                    J = new RegExp("^" + q + "$"),
                    K = {
                      ID: new RegExp("^#(" + L + ")"),
                      CLASS: new RegExp("^\\.(" + L + ")"),
                      TAG: new RegExp("^(" + L.replace("w", "w*") + ")"),
                      ATTR: new RegExp("^" + B),
                      PSEUDO: new RegExp("^" + H),
                      CHILD: new RegExp(
                        "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
                          I +
                          "*(even|odd|(([+-]|)(\\d*)n|)" +
                          I +
                          "*(?:([+-]|)" +
                          I +
                          "*(\\d+)|))" +
                          I +
                          "*\\)|)",
                        "i"
                      ),
                      bool: new RegExp("^(?:" + R + ")$", "i"),
                      needsContext: new RegExp(
                        "^" +
                          I +
                          "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
                          I +
                          "*((?:-\\d)?\\d*)" +
                          I +
                          "*\\)|)(?=[^-]|$)",
                        "i"
                      ),
                    },
                    G = /^(?:input|select|textarea|button)$/i,
                    Y = /^h\d$/i,
                    Q = /^[^{]+\{\s*\[native \w/,
                    Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
                    ee = /[+~]/,
                    te = /'|\\/g,
                    ne = new RegExp(
                      "\\\\([\\da-f]{1,6}" + I + "?|(" + I + ")|.)",
                      "ig"
                    ),
                    ie = function (e, t, n) {
                      var i = "0x" + t - 65536;
                      return i != i || n
                        ? t
                        : i < 0
                        ? String.fromCharCode(i + 65536)
                        : String.fromCharCode(
                            (i >> 10) | 55296,
                            (1023 & i) | 56320
                          );
                    },
                    re = function () {
                      f();
                    };
                  try {
                    D.apply((S = N.call(x.childNodes)), x.childNodes),
                      S[x.childNodes.length].nodeType;
                  } catch (e) {
                    D = {
                      apply: S.length
                        ? function (e, t) {
                            O.apply(e, N.call(t));
                          }
                        : function (e, t) {
                            for (var n = e.length, i = 0; (e[n++] = t[i++]); );
                            e.length = n - 1;
                          },
                    };
                  }

                  function oe(e, t, i, r) {
                    var o, a, c, l, h, p, m, y, _, C;
                    if (
                      ((t ? t.ownerDocument || t : x) !== d && f(t),
                      (i = i || []),
                      (l = (t = t || d).nodeType),
                      "string" != typeof e ||
                        !e ||
                        (1 !== l && 9 !== l && 11 !== l))
                    )
                      return i;
                    if (!r && g) {
                      if (11 !== l && (o = Z.exec(e)))
                        if ((c = o[1])) {
                          if (9 === l) {
                            if (!(a = t.getElementById(c)) || !a.parentNode)
                              return i;
                            if (a.id === c) return i.push(a), i;
                          } else if (
                            t.ownerDocument &&
                            (a = t.ownerDocument.getElementById(c)) &&
                            b(t, a) &&
                            a.id === c
                          )
                            return i.push(a), i;
                        } else {
                          if (o[2])
                            return D.apply(i, t.getElementsByTagName(e)), i;
                          if ((c = o[3]) && n.getElementsByClassName)
                            return D.apply(i, t.getElementsByClassName(c)), i;
                        }
                      if (n.qsa && (!v || !v.test(e))) {
                        if (
                          ((y = m = w),
                          (_ = t),
                          (C = 1 !== l && e),
                          1 === l && "object" !== t.nodeName.toLowerCase())
                        ) {
                          for (
                            p = s(e),
                              (m = t.getAttribute("id"))
                                ? (y = m.replace(te, "\\$&"))
                                : t.setAttribute("id", y),
                              y = "[id='" + y + "'] ",
                              h = p.length;
                            h--;

                          )
                            p[h] = y + ve(p[h]);
                          (_ = (ee.test(e) && pe(t.parentNode)) || t),
                            (C = p.join(","));
                        }
                        if (C)
                          try {
                            return D.apply(i, _.querySelectorAll(C)), i;
                          } catch (e) {
                          } finally {
                            m || t.removeAttribute("id");
                          }
                      }
                    }
                    return u(e.replace($, "$1"), t, i, r);
                  }

                  function se() {
                    var e = [];
                    return function t(n, r) {
                      return (
                        e.push(n + " ") > i.cacheLength && delete t[e.shift()],
                        (t[n + " "] = r)
                      );
                    };
                  }

                  function ae(e) {
                    return (e[w] = !0), e;
                  }

                  function ue(e) {
                    var t = d.createElement("div");
                    try {
                      return !!e(t);
                    } catch (e) {
                      return !1;
                    } finally {
                      t.parentNode && t.parentNode.removeChild(t), (t = null);
                    }
                  }

                  function ce(e, t) {
                    for (var n = e.split("|"), r = e.length; r--; )
                      i.attrHandle[n[r]] = t;
                  }

                  function le(e, t) {
                    var n = t && e,
                      i =
                        n &&
                        1 === e.nodeType &&
                        1 === t.nodeType &&
                        (~t.sourceIndex || A) - (~e.sourceIndex || A);
                    if (i) return i;
                    if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
                    return e ? 1 : -1;
                  }

                  function he(e) {
                    return function (t) {
                      return (
                        "input" === t.nodeName.toLowerCase() && t.type === e
                      );
                    };
                  }

                  function fe(e) {
                    return function (t) {
                      var n = t.nodeName.toLowerCase();
                      return ("input" === n || "button" === n) && t.type === e;
                    };
                  }

                  function de(e) {
                    return ae(function (t) {
                      return (
                        (t = +t),
                        ae(function (n, i) {
                          for (
                            var r, o = e([], n.length, t), s = o.length;
                            s--;

                          )
                            n[(r = o[s])] && (n[r] = !(i[r] = n[r]));
                        })
                      );
                    });
                  }

                  function pe(e) {
                    return e && void 0 !== e.getElementsByTagName && e;
                  }
                  for (t in ((n = oe.support = {}),
                  (o = oe.isXML =
                    function (e) {
                      var t = e && (e.ownerDocument || e).documentElement;
                      return !!t && "HTML" !== t.nodeName;
                    }),
                  (f = oe.setDocument =
                    function (e) {
                      var t,
                        r,
                        s = e ? e.ownerDocument || e : x;
                      return s !== d && 9 === s.nodeType && s.documentElement
                        ? ((d = s),
                          (p = s.documentElement),
                          (r = s.defaultView) &&
                            r !== r.top &&
                            (r.addEventListener
                              ? r.addEventListener("unload", re, !1)
                              : r.attachEvent && r.attachEvent("onunload", re)),
                          (g = !o(s)),
                          (n.attributes = ue(function (e) {
                            return (
                              (e.className = "i"), !e.getAttribute("className")
                            );
                          })),
                          (n.getElementsByTagName = ue(function (e) {
                            return (
                              e.appendChild(s.createComment("")),
                              !e.getElementsByTagName("*").length
                            );
                          })),
                          (n.getElementsByClassName = Q.test(
                            s.getElementsByClassName
                          )),
                          (n.getById = ue(function (e) {
                            return (
                              (p.appendChild(e).id = w),
                              !s.getElementsByName ||
                                !s.getElementsByName(w).length
                            );
                          })),
                          n.getById
                            ? ((i.find.ID = function (e, t) {
                                if (void 0 !== t.getElementById && g) {
                                  var n = t.getElementById(e);
                                  return n && n.parentNode ? [n] : [];
                                }
                              }),
                              (i.filter.ID = function (e) {
                                var t = e.replace(ne, ie);
                                return function (e) {
                                  return e.getAttribute("id") === t;
                                };
                              }))
                            : (delete i.find.ID,
                              (i.filter.ID = function (e) {
                                var t = e.replace(ne, ie);
                                return function (e) {
                                  var n =
                                    void 0 !== e.getAttributeNode &&
                                    e.getAttributeNode("id");
                                  return n && n.value === t;
                                };
                              })),
                          (i.find.TAG = n.getElementsByTagName
                            ? function (e, t) {
                                return void 0 !== t.getElementsByTagName
                                  ? t.getElementsByTagName(e)
                                  : n.qsa
                                  ? t.querySelectorAll(e)
                                  : void 0;
                              }
                            : function (e, t) {
                                var n,
                                  i = [],
                                  r = 0,
                                  o = t.getElementsByTagName(e);
                                if ("*" === e) {
                                  for (; (n = o[r++]); )
                                    1 === n.nodeType && i.push(n);
                                  return i;
                                }
                                return o;
                              }),
                          (i.find.CLASS =
                            n.getElementsByClassName &&
                            function (e, t) {
                              if (g) return t.getElementsByClassName(e);
                            }),
                          (m = []),
                          (v = []),
                          (n.qsa = Q.test(s.querySelectorAll)) &&
                            (ue(function (e) {
                              (p.appendChild(e).innerHTML =
                                "<a id='" +
                                w +
                                "'></a><select id='" +
                                w +
                                "-\f]' msallowcapture=''><option selected=''></option></select>"),
                                e.querySelectorAll("[msallowcapture^='']")
                                  .length &&
                                  v.push("[*^$]=" + I + "*(?:''|\"\")"),
                                e.querySelectorAll("[selected]").length ||
                                  v.push("\\[" + I + "*(?:value|" + R + ")"),
                                e.querySelectorAll("[id~=" + w + "-]").length ||
                                  v.push("~="),
                                e.querySelectorAll(":checked").length ||
                                  v.push(":checked"),
                                e.querySelectorAll("a#" + w + "+*").length ||
                                  v.push(".#.+[+~]");
                            }),
                            ue(function (e) {
                              var t = s.createElement("input");
                              t.setAttribute("type", "hidden"),
                                e.appendChild(t).setAttribute("name", "D"),
                                e.querySelectorAll("[name=d]").length &&
                                  v.push("name" + I + "*[*^$|!~]?="),
                                e.querySelectorAll(":enabled").length ||
                                  v.push(":enabled", ":disabled"),
                                e.querySelectorAll("*,:x"),
                                v.push(",.*:");
                            })),
                          (n.matchesSelector = Q.test(
                            (y =
                              p.matches ||
                              p.webkitMatchesSelector ||
                              p.mozMatchesSelector ||
                              p.oMatchesSelector ||
                              p.msMatchesSelector)
                          )) &&
                            ue(function (e) {
                              (n.disconnectedMatch = y.call(e, "div")),
                                y.call(e, "[s!='']:x"),
                                m.push("!=", H);
                            }),
                          (v = v.length && new RegExp(v.join("|"))),
                          (m = m.length && new RegExp(m.join("|"))),
                          (t = Q.test(p.compareDocumentPosition)),
                          (b =
                            t || Q.test(p.contains)
                              ? function (e, t) {
                                  var n =
                                      9 === e.nodeType ? e.documentElement : e,
                                    i = t && t.parentNode;
                                  return (
                                    e === i ||
                                    !(
                                      !i ||
                                      1 !== i.nodeType ||
                                      !(n.contains
                                        ? n.contains(i)
                                        : e.compareDocumentPosition &&
                                          16 & e.compareDocumentPosition(i))
                                    )
                                  );
                                }
                              : function (e, t) {
                                  if (t)
                                    for (; (t = t.parentNode); )
                                      if (t === e) return !0;
                                  return !1;
                                }),
                          (T = t
                            ? function (e, t) {
                                if (e === t) return (h = !0), 0;
                                var i =
                                  !e.compareDocumentPosition -
                                  !t.compareDocumentPosition;
                                return (
                                  i ||
                                  (1 &
                                    (i =
                                      (e.ownerDocument || e) ===
                                      (t.ownerDocument || t)
                                        ? e.compareDocumentPosition(t)
                                        : 1) ||
                                  (!n.sortDetached &&
                                    t.compareDocumentPosition(e) === i)
                                    ? e === s ||
                                      (e.ownerDocument === x && b(x, e))
                                      ? -1
                                      : t === s ||
                                        (t.ownerDocument === x && b(x, t))
                                      ? 1
                                      : l
                                      ? V(l, e) - V(l, t)
                                      : 0
                                    : 4 & i
                                    ? -1
                                    : 1)
                                );
                              }
                            : function (e, t) {
                                if (e === t) return (h = !0), 0;
                                var n,
                                  i = 0,
                                  r = e.parentNode,
                                  o = t.parentNode,
                                  a = [e],
                                  u = [t];
                                if (!r || !o)
                                  return e === s
                                    ? -1
                                    : t === s
                                    ? 1
                                    : r
                                    ? -1
                                    : o
                                    ? 1
                                    : l
                                    ? V(l, e) - V(l, t)
                                    : 0;
                                if (r === o) return le(e, t);
                                for (n = e; (n = n.parentNode); ) a.unshift(n);
                                for (n = t; (n = n.parentNode); ) u.unshift(n);
                                for (; a[i] === u[i]; ) i++;
                                return i
                                  ? le(a[i], u[i])
                                  : a[i] === x
                                  ? -1
                                  : u[i] === x
                                  ? 1
                                  : 0;
                              }),
                          s)
                        : d;
                    }),
                  (oe.matches = function (e, t) {
                    return oe(e, null, null, t);
                  }),
                  (oe.matchesSelector = function (e, t) {
                    if (
                      ((e.ownerDocument || e) !== d && f(e),
                      (t = t.replace(W, "='$1']")),
                      n.matchesSelector &&
                        g &&
                        (!m || !m.test(t)) &&
                        (!v || !v.test(t)))
                    )
                      try {
                        var i = y.call(e, t);
                        if (
                          i ||
                          n.disconnectedMatch ||
                          (e.document && 11 !== e.document.nodeType)
                        )
                          return i;
                      } catch (e) {}
                    return oe(t, d, null, [e]).length > 0;
                  }),
                  (oe.contains = function (e, t) {
                    return (e.ownerDocument || e) !== d && f(e), b(e, t);
                  }),
                  (oe.attr = function (e, t) {
                    (e.ownerDocument || e) !== d && f(e);
                    var r = i.attrHandle[t.toLowerCase()],
                      o =
                        r && M.call(i.attrHandle, t.toLowerCase())
                          ? r(e, t, !g)
                          : void 0;
                    return void 0 !== o
                      ? o
                      : n.attributes || !g
                      ? e.getAttribute(t)
                      : (o = e.getAttributeNode(t)) && o.specified
                      ? o.value
                      : null;
                  }),
                  (oe.error = function (e) {
                    throw new Error(
                      "Syntax error, unrecognized expression: " + e
                    );
                  }),
                  (oe.uniqueSort = function (e) {
                    var t,
                      i = [],
                      r = 0,
                      o = 0;
                    if (
                      ((h = !n.detectDuplicates),
                      (l = !n.sortStable && e.slice(0)),
                      e.sort(T),
                      h)
                    ) {
                      for (; (t = e[o++]); ) t === e[o] && (r = i.push(o));
                      for (; r--; ) e.splice(i[r], 1);
                    }
                    return (l = null), e;
                  }),
                  (r = oe.getText =
                    function (e) {
                      var t,
                        n = "",
                        i = 0,
                        o = e.nodeType;
                      if (o) {
                        if (1 === o || 9 === o || 11 === o) {
                          if ("string" == typeof e.textContent)
                            return e.textContent;
                          for (e = e.firstChild; e; e = e.nextSibling)
                            n += r(e);
                        } else if (3 === o || 4 === o) return e.nodeValue;
                      } else for (; (t = e[i++]); ) n += r(t);
                      return n;
                    }),
                  ((i = oe.selectors =
                    {
                      cacheLength: 50,
                      createPseudo: ae,
                      match: K,
                      attrHandle: {},
                      find: {},
                      relative: {
                        ">": {
                          dir: "parentNode",
                          first: !0,
                        },
                        " ": {
                          dir: "parentNode",
                        },
                        "+": {
                          dir: "previousSibling",
                          first: !0,
                        },
                        "~": {
                          dir: "previousSibling",
                        },
                      },
                      preFilter: {
                        ATTR: function (e) {
                          return (
                            (e[1] = e[1].replace(ne, ie)),
                            (e[3] = (e[3] || e[4] || e[5] || "").replace(
                              ne,
                              ie
                            )),
                            "~=" === e[2] && (e[3] = " " + e[3] + " "),
                            e.slice(0, 4)
                          );
                        },
                        CHILD: function (e) {
                          return (
                            (e[1] = e[1].toLowerCase()),
                            "nth" === e[1].slice(0, 3)
                              ? (e[3] || oe.error(e[0]),
                                (e[4] = +(e[4]
                                  ? e[5] + (e[6] || 1)
                                  : 2 * ("even" === e[3] || "odd" === e[3]))),
                                (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                              : e[3] && oe.error(e[0]),
                            e
                          );
                        },
                        PSEUDO: function (e) {
                          var t,
                            n = !e[6] && e[2];
                          return K.CHILD.test(e[0])
                            ? null
                            : (e[3]
                                ? (e[2] = e[4] || e[5] || "")
                                : n &&
                                  X.test(n) &&
                                  (t = s(n, !0)) &&
                                  (t =
                                    n.indexOf(")", n.length - t) - n.length) &&
                                  ((e[0] = e[0].slice(0, t)),
                                  (e[2] = n.slice(0, t))),
                              e.slice(0, 3));
                        },
                      },
                      filter: {
                        TAG: function (e) {
                          var t = e.replace(ne, ie).toLowerCase();
                          return "*" === e
                            ? function () {
                                return !0;
                              }
                            : function (e) {
                                return (
                                  e.nodeName && e.nodeName.toLowerCase() === t
                                );
                              };
                        },
                        CLASS: function (e) {
                          var t = k[e + " "];
                          return (
                            t ||
                            ((t = new RegExp(
                              "(^|" + I + ")" + e + "(" + I + "|$)"
                            )) &&
                              k(e, function (e) {
                                return t.test(
                                  ("string" == typeof e.className &&
                                    e.className) ||
                                    (void 0 !== e.getAttribute &&
                                      e.getAttribute("class")) ||
                                    ""
                                );
                              }))
                          );
                        },
                        ATTR: function (e, t, n) {
                          return function (i) {
                            var r = oe.attr(i, e);
                            return null == r
                              ? "!=" === t
                              : !t ||
                                  ((r += ""),
                                  "=" === t
                                    ? r === n
                                    : "!=" === t
                                    ? r !== n
                                    : "^=" === t
                                    ? n && 0 === r.indexOf(n)
                                    : "*=" === t
                                    ? n && r.indexOf(n) > -1
                                    : "$=" === t
                                    ? n && r.slice(-n.length) === n
                                    : "~=" === t
                                    ? (" " + r.replace(z, " ") + " ").indexOf(
                                        n
                                      ) > -1
                                    : "|=" === t &&
                                      (r === n ||
                                        r.slice(0, n.length + 1) === n + "-"));
                          };
                        },
                        CHILD: function (e, t, n, i, r) {
                          var o = "nth" !== e.slice(0, 3),
                            s = "last" !== e.slice(-4),
                            a = "of-type" === t;
                          return 1 === i && 0 === r
                            ? function (e) {
                                return !!e.parentNode;
                              }
                            : function (t, n, u) {
                                var c,
                                  l,
                                  h,
                                  f,
                                  d,
                                  p,
                                  g =
                                    o !== s ? "nextSibling" : "previousSibling",
                                  v = t.parentNode,
                                  m = a && t.nodeName.toLowerCase(),
                                  y = !u && !a;
                                if (v) {
                                  if (o) {
                                    for (; g; ) {
                                      for (h = t; (h = h[g]); )
                                        if (
                                          a
                                            ? h.nodeName.toLowerCase() === m
                                            : 1 === h.nodeType
                                        )
                                          return !1;
                                      p = g =
                                        "only" === e && !p && "nextSibling";
                                    }
                                    return !0;
                                  }
                                  if (
                                    ((p = [s ? v.firstChild : v.lastChild]),
                                    s && y)
                                  ) {
                                    for (
                                      d =
                                        (c =
                                          (l = v[w] || (v[w] = {}))[e] ||
                                          [])[0] === _ && c[1],
                                        f = c[0] === _ && c[2],
                                        h = d && v.childNodes[d];
                                      (h =
                                        (++d && h && h[g]) ||
                                        (f = d = 0) ||
                                        p.pop());

                                    )
                                      if (1 === h.nodeType && ++f && h === t) {
                                        l[e] = [_, d, f];
                                        break;
                                      }
                                  } else if (
                                    y &&
                                    (c = (t[w] || (t[w] = {}))[e]) &&
                                    c[0] === _
                                  )
                                    f = c[1];
                                  else
                                    for (
                                      ;
                                      (h =
                                        (++d && h && h[g]) ||
                                        (f = d = 0) ||
                                        p.pop()) &&
                                      ((a
                                        ? h.nodeName.toLowerCase() !== m
                                        : 1 !== h.nodeType) ||
                                        !++f ||
                                        (y &&
                                          ((h[w] || (h[w] = {}))[e] = [_, f]),
                                        h !== t));

                                    );
                                  return (
                                    (f -= r) === i || (f % i == 0 && f / i >= 0)
                                  );
                                }
                              };
                        },
                        PSEUDO: function (e, t) {
                          var n,
                            r =
                              i.pseudos[e] ||
                              i.setFilters[e.toLowerCase()] ||
                              oe.error("unsupported pseudo: " + e);
                          return r[w]
                            ? r(t)
                            : r.length > 1
                            ? ((n = [e, e, "", t]),
                              i.setFilters.hasOwnProperty(e.toLowerCase())
                                ? ae(function (e, n) {
                                    for (
                                      var i, o = r(e, t), s = o.length;
                                      s--;

                                    )
                                      e[(i = V(e, o[s]))] = !(n[i] = o[s]);
                                  })
                                : function (e) {
                                    return r(e, 0, n);
                                  })
                            : r;
                        },
                      },
                      pseudos: {
                        not: ae(function (e) {
                          var t = [],
                            n = [],
                            i = a(e.replace($, "$1"));
                          return i[w]
                            ? ae(function (e, t, n, r) {
                                for (
                                  var o, s = i(e, null, r, []), a = e.length;
                                  a--;

                                )
                                  (o = s[a]) && (e[a] = !(t[a] = o));
                              })
                            : function (e, r, o) {
                                return (
                                  (t[0] = e),
                                  i(t, null, o, n),
                                  (t[0] = null),
                                  !n.pop()
                                );
                              };
                        }),
                        has: ae(function (e) {
                          return function (t) {
                            return oe(e, t).length > 0;
                          };
                        }),
                        contains: ae(function (e) {
                          return (
                            (e = e.replace(ne, ie)),
                            function (t) {
                              return (
                                (t.textContent || t.innerText || r(t)).indexOf(
                                  e
                                ) > -1
                              );
                            }
                          );
                        }),
                        lang: ae(function (e) {
                          return (
                            J.test(e || "") ||
                              oe.error("unsupported lang: " + e),
                            (e = e.replace(ne, ie).toLowerCase()),
                            function (t) {
                              var n;
                              do {
                                if (
                                  (n = g
                                    ? t.lang
                                    : t.getAttribute("xml:lang") ||
                                      t.getAttribute("lang"))
                                )
                                  return (
                                    (n = n.toLowerCase()) === e ||
                                    0 === n.indexOf(e + "-")
                                  );
                              } while ((t = t.parentNode) && 1 === t.nodeType);
                              return !1;
                            }
                          );
                        }),
                        target: function (t) {
                          var n = e.location && e.location.hash;
                          return n && n.slice(1) === t.id;
                        },
                        root: function (e) {
                          return e === p;
                        },
                        focus: function (e) {
                          return (
                            e === d.activeElement &&
                            (!d.hasFocus || d.hasFocus()) &&
                            !!(e.type || e.href || ~e.tabIndex)
                          );
                        },
                        enabled: function (e) {
                          return !1 === e.disabled;
                        },
                        disabled: function (e) {
                          return !0 === e.disabled;
                        },
                        checked: function (e) {
                          var t = e.nodeName.toLowerCase();
                          return (
                            ("input" === t && !!e.checked) ||
                            ("option" === t && !!e.selected)
                          );
                        },
                        selected: function (e) {
                          return (
                            e.parentNode && e.parentNode.selectedIndex,
                            !0 === e.selected
                          );
                        },
                        empty: function (e) {
                          for (e = e.firstChild; e; e = e.nextSibling)
                            if (e.nodeType < 6) return !1;
                          return !0;
                        },
                        parent: function (e) {
                          return !i.pseudos.empty(e);
                        },
                        header: function (e) {
                          return Y.test(e.nodeName);
                        },
                        input: function (e) {
                          return G.test(e.nodeName);
                        },
                        button: function (e) {
                          var t = e.nodeName.toLowerCase();
                          return (
                            ("input" === t && "button" === e.type) ||
                            "button" === t
                          );
                        },
                        text: function (e) {
                          var t;
                          return (
                            "input" === e.nodeName.toLowerCase() &&
                            "text" === e.type &&
                            (null == (t = e.getAttribute("type")) ||
                              "text" === t.toLowerCase())
                          );
                        },
                        first: de(function () {
                          return [0];
                        }),
                        last: de(function (e, t) {
                          return [t - 1];
                        }),
                        eq: de(function (e, t, n) {
                          return [n < 0 ? n + t : n];
                        }),
                        even: de(function (e, t) {
                          for (var n = 0; n < t; n += 2) e.push(n);
                          return e;
                        }),
                        odd: de(function (e, t) {
                          for (var n = 1; n < t; n += 2) e.push(n);
                          return e;
                        }),
                        lt: de(function (e, t, n) {
                          for (var i = n < 0 ? n + t : n; --i >= 0; ) e.push(i);
                          return e;
                        }),
                        gt: de(function (e, t, n) {
                          for (var i = n < 0 ? n + t : n; ++i < t; ) e.push(i);
                          return e;
                        }),
                      },
                    }).pseudos.nth = i.pseudos.eq),
                  {
                    radio: !0,
                    checkbox: !0,
                    file: !0,
                    password: !0,
                    image: !0,
                  }))
                    i.pseudos[t] = he(t);
                  for (t in {
                    submit: !0,
                    reset: !0,
                  })
                    i.pseudos[t] = fe(t);

                  function ge() {}

                  function ve(e) {
                    for (var t = 0, n = e.length, i = ""; t < n; t++)
                      i += e[t].value;
                    return i;
                  }

                  function me(e, t, n) {
                    var i = t.dir,
                      r = n && "parentNode" === i,
                      o = C++;
                    return t.first
                      ? function (t, n, o) {
                          for (; (t = t[i]); )
                            if (1 === t.nodeType || r) return e(t, n, o);
                        }
                      : function (t, n, s) {
                          var a,
                            u,
                            c = [_, o];
                          if (s) {
                            for (; (t = t[i]); )
                              if ((1 === t.nodeType || r) && e(t, n, s))
                                return !0;
                          } else
                            for (; (t = t[i]); )
                              if (1 === t.nodeType || r) {
                                if (
                                  (a = (u = t[w] || (t[w] = {}))[i]) &&
                                  a[0] === _ &&
                                  a[1] === o
                                )
                                  return (c[2] = a[2]);
                                if (((u[i] = c), (c[2] = e(t, n, s))))
                                  return !0;
                              }
                        };
                  }

                  function ye(e) {
                    return e.length > 1
                      ? function (t, n, i) {
                          for (var r = e.length; r--; )
                            if (!e[r](t, n, i)) return !1;
                          return !0;
                        }
                      : e[0];
                  }

                  function be(e, t, n, i, r) {
                    for (
                      var o, s = [], a = 0, u = e.length, c = null != t;
                      a < u;
                      a++
                    )
                      (o = e[a]) &&
                        ((n && !n(o, i, r)) || (s.push(o), c && t.push(a)));
                    return s;
                  }

                  function we(e, t, n, i, r, o) {
                    return (
                      i && !i[w] && (i = we(i)),
                      r && !r[w] && (r = we(r, o)),
                      ae(function (o, s, a, u) {
                        var c,
                          l,
                          h,
                          f = [],
                          d = [],
                          p = s.length,
                          g =
                            o ||
                            (function (e, t, n) {
                              for (var i = 0, r = t.length; i < r; i++)
                                oe(e, t[i], n);
                              return n;
                            })(t || "*", a.nodeType ? [a] : a, []),
                          v = !e || (!o && t) ? g : be(g, f, e, a, u),
                          m = n ? (r || (o ? e : p || i) ? [] : s) : v;
                        if ((n && n(v, m, a, u), i))
                          for (
                            c = be(m, d), i(c, [], a, u), l = c.length;
                            l--;

                          )
                            (h = c[l]) && (m[d[l]] = !(v[d[l]] = h));
                        if (o) {
                          if (r || e) {
                            if (r) {
                              for (c = [], l = m.length; l--; )
                                (h = m[l]) && c.push((v[l] = h));
                              r(null, (m = []), c, u);
                            }
                            for (l = m.length; l--; )
                              (h = m[l]) &&
                                (c = r ? V(o, h) : f[l]) > -1 &&
                                (o[c] = !(s[c] = h));
                          }
                        } else (m = be(m === s ? m.splice(p, m.length) : m)), r ? r(null, s, m, u) : D.apply(s, m);
                      })
                    );
                  }

                  function xe(e) {
                    for (
                      var t,
                        n,
                        r,
                        o = e.length,
                        s = i.relative[e[0].type],
                        a = s || i.relative[" "],
                        u = s ? 1 : 0,
                        l = me(
                          function (e) {
                            return e === t;
                          },
                          a,
                          !0
                        ),
                        h = me(
                          function (e) {
                            return V(t, e) > -1;
                          },
                          a,
                          !0
                        ),
                        f = [
                          function (e, n, i) {
                            var r =
                              (!s && (i || n !== c)) ||
                              ((t = n).nodeType ? l(e, n, i) : h(e, n, i));
                            return (t = null), r;
                          },
                        ];
                      u < o;
                      u++
                    )
                      if ((n = i.relative[e[u].type])) f = [me(ye(f), n)];
                      else {
                        if (
                          (n = i.filter[e[u].type].apply(null, e[u].matches))[w]
                        ) {
                          for (r = ++u; r < o && !i.relative[e[r].type]; r++);
                          return we(
                            u > 1 && ye(f),
                            u > 1 &&
                              ve(
                                e.slice(0, u - 1).concat({
                                  value: " " === e[u - 2].type ? "*" : "",
                                })
                              ).replace($, "$1"),
                            n,
                            u < r && xe(e.slice(u, r)),
                            r < o && xe((e = e.slice(r))),
                            r < o && ve(e)
                          );
                        }
                        f.push(n);
                      }
                    return ye(f);
                  }
                  return (
                    (ge.prototype = i.filters = i.pseudos),
                    (i.setFilters = new ge()),
                    (s = oe.tokenize =
                      function (e, t) {
                        var n,
                          r,
                          o,
                          s,
                          a,
                          u,
                          c,
                          l = E[e + " "];
                        if (l) return t ? 0 : l.slice(0);
                        for (a = e, u = [], c = i.preFilter; a; ) {
                          for (s in ((n && !(r = P.exec(a))) ||
                            (r && (a = a.slice(r[0].length) || a),
                            u.push((o = []))),
                          (n = !1),
                          (r = U.exec(a)) &&
                            ((n = r.shift()),
                            o.push({
                              value: n,
                              type: r[0].replace($, " "),
                            }),
                            (a = a.slice(n.length))),
                          i.filter))
                            !(r = K[s].exec(a)) ||
                              (c[s] && !(r = c[s](r))) ||
                              ((n = r.shift()),
                              o.push({
                                value: n,
                                type: s,
                                matches: r,
                              }),
                              (a = a.slice(n.length)));
                          if (!n) break;
                        }
                        return t
                          ? a.length
                          : a
                          ? oe.error(e)
                          : E(e, u).slice(0);
                      }),
                    (a = oe.compile =
                      function (e, t) {
                        var n,
                          r = [],
                          o = [],
                          a = F[e + " "];
                        if (!a) {
                          for (t || (t = s(e)), n = t.length; n--; )
                            (a = xe(t[n]))[w] ? r.push(a) : o.push(a);
                          (a = F(
                            e,
                            (function (e, t) {
                              var n = t.length > 0,
                                r = e.length > 0,
                                o = function (o, s, a, u, l) {
                                  var h,
                                    f,
                                    p,
                                    g = 0,
                                    v = "0",
                                    m = o && [],
                                    y = [],
                                    b = c,
                                    w = o || (r && i.find.TAG("*", l)),
                                    x = (_ +=
                                      null == b ? 1 : Math.random() || 0.1),
                                    C = w.length;
                                  for (
                                    l && (c = s !== d && s);
                                    v !== C && null != (h = w[v]);
                                    v++
                                  ) {
                                    if (r && h) {
                                      for (f = 0; (p = e[f++]); )
                                        if (p(h, s, a)) {
                                          u.push(h);
                                          break;
                                        }
                                      l && (_ = x);
                                    }
                                    n && ((h = !p && h) && g--, o && m.push(h));
                                  }
                                  if (((g += v), n && v !== g)) {
                                    for (f = 0; (p = t[f++]); ) p(m, y, s, a);
                                    if (o) {
                                      if (g > 0)
                                        for (; v--; )
                                          m[v] || y[v] || (y[v] = j.call(u));
                                      y = be(y);
                                    }
                                    D.apply(u, y),
                                      l &&
                                        !o &&
                                        y.length > 0 &&
                                        g + t.length > 1 &&
                                        oe.uniqueSort(u);
                                  }
                                  return l && ((_ = x), (c = b)), m;
                                };
                              return n ? ae(o) : o;
                            })(o, r)
                          )).selector = e;
                        }
                        return a;
                      }),
                    (u = oe.select =
                      function (e, t, r, o) {
                        var u,
                          c,
                          l,
                          h,
                          f,
                          d = "function" == typeof e && e,
                          p = !o && s((e = d.selector || e));
                        if (((r = r || []), 1 === p.length)) {
                          if (
                            (c = p[0] = p[0].slice(0)).length > 2 &&
                            "ID" === (l = c[0]).type &&
                            n.getById &&
                            9 === t.nodeType &&
                            g &&
                            i.relative[c[1].type]
                          ) {
                            if (
                              !(t = (i.find.ID(
                                l.matches[0].replace(ne, ie),
                                t
                              ) || [])[0])
                            )
                              return r;
                            d && (t = t.parentNode),
                              (e = e.slice(c.shift().value.length));
                          }
                          for (
                            u = K.needsContext.test(e) ? 0 : c.length;
                            u-- && ((l = c[u]), !i.relative[(h = l.type)]);

                          )
                            if (
                              (f = i.find[h]) &&
                              (o = f(
                                l.matches[0].replace(ne, ie),
                                (ee.test(c[0].type) && pe(t.parentNode)) || t
                              ))
                            ) {
                              if ((c.splice(u, 1), !(e = o.length && ve(c))))
                                return D.apply(r, o), r;
                              break;
                            }
                        }
                        return (
                          (d || a(e, p))(
                            o,
                            t,
                            !g,
                            r,
                            (ee.test(e) && pe(t.parentNode)) || t
                          ),
                          r
                        );
                      }),
                    (n.sortStable = w.split("").sort(T).join("") === w),
                    (n.detectDuplicates = !!h),
                    f(),
                    (n.sortDetached = ue(function (e) {
                      return (
                        1 & e.compareDocumentPosition(d.createElement("div"))
                      );
                    })),
                    ue(function (e) {
                      return (
                        (e.innerHTML = "<a href='#'></a>"),
                        "#" === e.firstChild.getAttribute("href")
                      );
                    }) ||
                      ce("type|href|height|width", function (e, t, n) {
                        if (!n)
                          return e.getAttribute(
                            t,
                            "type" === t.toLowerCase() ? 1 : 2
                          );
                      }),
                    (n.attributes &&
                      ue(function (e) {
                        return (
                          (e.innerHTML = "<input/>"),
                          e.firstChild.setAttribute("value", ""),
                          "" === e.firstChild.getAttribute("value")
                        );
                      })) ||
                      ce("value", function (e, t, n) {
                        if (!n && "input" === e.nodeName.toLowerCase())
                          return e.defaultValue;
                      }),
                    ue(function (e) {
                      return null == e.getAttribute("disabled");
                    }) ||
                      ce(R, function (e, t, n) {
                        var i;
                        if (!n)
                          return !0 === e[t]
                            ? t.toLowerCase()
                            : (i = e.getAttributeNode(t)) && i.specified
                            ? i.value
                            : null;
                      }),
                    oe
                  );
                })(e);
                (d.find = b),
                  (d.expr = b.selectors),
                  (d.expr[":"] = d.expr.pseudos),
                  (d.unique = b.uniqueSort),
                  (d.text = b.getText),
                  (d.isXMLDoc = b.isXML),
                  (d.contains = b.contains);
                var w = d.expr.match.needsContext,
                  x = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
                  _ = /^.[^:#\[\.,]*$/;

                function C(e, t, n) {
                  if (d.isFunction(t))
                    return d.grep(e, function (e, i) {
                      return !!t.call(e, i, e) !== n;
                    });
                  if (t.nodeType)
                    return d.grep(e, function (e) {
                      return (e === t) !== n;
                    });
                  if ("string" == typeof t) {
                    if (_.test(t)) return d.filter(t, e, n);
                    t = d.filter(t, e);
                  }
                  return d.grep(e, function (e) {
                    return a.call(t, e) >= 0 !== n;
                  });
                }
                (d.filter = function (e, t, n) {
                  var i = t[0];
                  return (
                    n && (e = ":not(" + e + ")"),
                    1 === t.length && 1 === i.nodeType
                      ? d.find.matchesSelector(i, e)
                        ? [i]
                        : []
                      : d.find.matches(
                          e,
                          d.grep(t, function (e) {
                            return 1 === e.nodeType;
                          })
                        )
                  );
                }),
                  d.fn.extend({
                    find: function (e) {
                      var t,
                        n = this.length,
                        i = [],
                        r = this;
                      if ("string" != typeof e)
                        return this.pushStack(
                          d(e).filter(function () {
                            for (t = 0; t < n; t++)
                              if (d.contains(r[t], this)) return !0;
                          })
                        );
                      for (t = 0; t < n; t++) d.find(e, r[t], i);
                      return (
                        ((i = this.pushStack(
                          n > 1 ? d.unique(i) : i
                        )).selector = this.selector
                          ? this.selector + " " + e
                          : e),
                        i
                      );
                    },
                    filter: function (e) {
                      return this.pushStack(C(this, e || [], !1));
                    },
                    not: function (e) {
                      return this.pushStack(C(this, e || [], !0));
                    },
                    is: function (e) {
                      return !!C(
                        this,
                        "string" == typeof e && w.test(e) ? d(e) : e || [],
                        !1
                      ).length;
                    },
                  });
                var k,
                  E = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/;
                ((d.fn.init = function (e, t) {
                  var n, i;
                  if (!e) return this;
                  if ("string" == typeof e) {
                    if (
                      !(n =
                        "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3
                          ? [null, e, null]
                          : E.exec(e)) ||
                      (!n[1] && t)
                    )
                      return !t || t.jquery
                        ? (t || k).find(e)
                        : this.constructor(t).find(e);
                    if (n[1]) {
                      if (
                        ((t = t instanceof d ? t[0] : t),
                        d.merge(
                          this,
                          d.parseHTML(
                            n[1],
                            t && t.nodeType ? t.ownerDocument || t : f,
                            !0
                          )
                        ),
                        x.test(n[1]) && d.isPlainObject(t))
                      )
                        for (n in t)
                          d.isFunction(this[n])
                            ? this[n](t[n])
                            : this.attr(n, t[n]);
                      return this;
                    }
                    return (
                      (i = f.getElementById(n[2])) &&
                        i.parentNode &&
                        ((this.length = 1), (this[0] = i)),
                      (this.context = f),
                      (this.selector = e),
                      this
                    );
                  }
                  return e.nodeType
                    ? ((this.context = this[0] = e), (this.length = 1), this)
                    : d.isFunction(e)
                    ? void 0 !== k.ready
                      ? k.ready(e)
                      : e(d)
                    : (void 0 !== e.selector &&
                        ((this.selector = e.selector),
                        (this.context = e.context)),
                      d.makeArray(e, this));
                }).prototype = d.fn),
                  (k = d(f));
                var F = /^(?:parents|prev(?:Until|All))/,
                  T = {
                    children: !0,
                    contents: !0,
                    next: !0,
                    prev: !0,
                  };

                function A(e, t) {
                  for (; (e = e[t]) && 1 !== e.nodeType; );
                  return e;
                }
                d.extend({
                  dir: function (e, t, n) {
                    for (
                      var i = [], r = void 0 !== n;
                      (e = e[t]) && 9 !== e.nodeType;

                    )
                      if (1 === e.nodeType) {
                        if (r && d(e).is(n)) break;
                        i.push(e);
                      }
                    return i;
                  },
                  sibling: function (e, t) {
                    for (var n = []; e; e = e.nextSibling)
                      1 === e.nodeType && e !== t && n.push(e);
                    return n;
                  },
                }),
                  d.fn.extend({
                    has: function (e) {
                      var t = d(e, this),
                        n = t.length;
                      return this.filter(function () {
                        for (var e = 0; e < n; e++)
                          if (d.contains(this, t[e])) return !0;
                      });
                    },
                    closest: function (e, t) {
                      for (
                        var n,
                          i = 0,
                          r = this.length,
                          o = [],
                          s =
                            w.test(e) || "string" != typeof e
                              ? d(e, t || this.context)
                              : 0;
                        i < r;
                        i++
                      )
                        for (n = this[i]; n && n !== t; n = n.parentNode)
                          if (
                            n.nodeType < 11 &&
                            (s
                              ? s.index(n) > -1
                              : 1 === n.nodeType &&
                                d.find.matchesSelector(n, e))
                          ) {
                            o.push(n);
                            break;
                          }
                      return this.pushStack(o.length > 1 ? d.unique(o) : o);
                    },
                    index: function (e) {
                      return e
                        ? "string" == typeof e
                          ? a.call(d(e), this[0])
                          : a.call(this, e.jquery ? e[0] : e)
                        : this[0] && this[0].parentNode
                        ? this.first().prevAll().length
                        : -1;
                    },
                    add: function (e, t) {
                      return this.pushStack(
                        d.unique(d.merge(this.get(), d(e, t)))
                      );
                    },
                    addBack: function (e) {
                      return this.add(
                        null == e ? this.prevObject : this.prevObject.filter(e)
                      );
                    },
                  }),
                  d.each(
                    {
                      parent: function (e) {
                        var t = e.parentNode;
                        return t && 11 !== t.nodeType ? t : null;
                      },
                      parents: function (e) {
                        return d.dir(e, "parentNode");
                      },
                      parentsUntil: function (e, t, n) {
                        return d.dir(e, "parentNode", n);
                      },
                      next: function (e) {
                        return A(e, "nextSibling");
                      },
                      prev: function (e) {
                        return A(e, "previousSibling");
                      },
                      nextAll: function (e) {
                        return d.dir(e, "nextSibling");
                      },
                      prevAll: function (e) {
                        return d.dir(e, "previousSibling");
                      },
                      nextUntil: function (e, t, n) {
                        return d.dir(e, "nextSibling", n);
                      },
                      prevUntil: function (e, t, n) {
                        return d.dir(e, "previousSibling", n);
                      },
                      siblings: function (e) {
                        return d.sibling((e.parentNode || {}).firstChild, e);
                      },
                      children: function (e) {
                        return d.sibling(e.firstChild);
                      },
                      contents: function (e) {
                        return e.contentDocument || d.merge([], e.childNodes);
                      },
                    },
                    function (e, t) {
                      d.fn[e] = function (n, i) {
                        var r = d.map(this, t, n);
                        return (
                          "Until" !== e.slice(-5) && (i = n),
                          i && "string" == typeof i && (r = d.filter(i, r)),
                          this.length > 1 &&
                            (T[e] || d.unique(r), F.test(e) && r.reverse()),
                          this.pushStack(r)
                        );
                      };
                    }
                  );
                var M,
                  S = /\S+/g,
                  j = {};

                function O() {
                  f.removeEventListener("DOMContentLoaded", O, !1),
                    e.removeEventListener("load", O, !1),
                    d.ready();
                }
                (d.Callbacks = function (e) {
                  e =
                    "string" == typeof e
                      ? j[e] ||
                        (function (e) {
                          var t = (j[e] = {});
                          return (
                            d.each(e.match(S) || [], function (e, n) {
                              t[n] = !0;
                            }),
                            t
                          );
                        })(e)
                      : d.extend({}, e);
                  var t,
                    n,
                    i,
                    r,
                    o,
                    s,
                    a = [],
                    u = !e.once && [],
                    c = function (h) {
                      for (
                        t = e.memory && h,
                          n = !0,
                          s = r || 0,
                          r = 0,
                          o = a.length,
                          i = !0;
                        a && s < o;
                        s++
                      )
                        if (!1 === a[s].apply(h[0], h[1]) && e.stopOnFalse) {
                          t = !1;
                          break;
                        }
                      (i = !1),
                        a &&
                          (u
                            ? u.length && c(u.shift())
                            : t
                            ? (a = [])
                            : l.disable());
                    },
                    l = {
                      add: function () {
                        if (a) {
                          var n = a.length;
                          !(function t(n) {
                            d.each(n, function (n, i) {
                              var r = d.type(i);
                              "function" === r
                                ? (e.unique && l.has(i)) || a.push(i)
                                : i && i.length && "string" !== r && t(i);
                            });
                          })(arguments),
                            i ? (o = a.length) : t && ((r = n), c(t));
                        }
                        return this;
                      },
                      remove: function () {
                        return (
                          a &&
                            d.each(arguments, function (e, t) {
                              for (var n; (n = d.inArray(t, a, n)) > -1; )
                                a.splice(n, 1),
                                  i && (n <= o && o--, n <= s && s--);
                            }),
                          this
                        );
                      },
                      has: function (e) {
                        return e ? d.inArray(e, a) > -1 : !(!a || !a.length);
                      },
                      empty: function () {
                        return (a = []), (o = 0), this;
                      },
                      disable: function () {
                        return (a = u = t = void 0), this;
                      },
                      disabled: function () {
                        return !a;
                      },
                      lock: function () {
                        return (u = void 0), t || l.disable(), this;
                      },
                      locked: function () {
                        return !u;
                      },
                      fireWith: function (e, t) {
                        return (
                          !a ||
                            (n && !u) ||
                            ((t = [e, (t = t || []).slice ? t.slice() : t]),
                            i ? u.push(t) : c(t)),
                          this
                        );
                      },
                      fire: function () {
                        return l.fireWith(this, arguments), this;
                      },
                      fired: function () {
                        return !!n;
                      },
                    };
                  return l;
                }),
                  d.extend({
                    Deferred: function (e) {
                      var t = [
                          [
                            "resolve",
                            "done",
                            d.Callbacks("once memory"),
                            "resolved",
                          ],
                          [
                            "reject",
                            "fail",
                            d.Callbacks("once memory"),
                            "rejected",
                          ],
                          ["notify", "progress", d.Callbacks("memory")],
                        ],
                        n = "pending",
                        i = {
                          state: function () {
                            return n;
                          },
                          always: function () {
                            return r.done(arguments).fail(arguments), this;
                          },
                          then: function () {
                            var e = arguments;
                            return d
                              .Deferred(function (n) {
                                d.each(t, function (t, o) {
                                  var s = d.isFunction(e[t]) && e[t];
                                  r[o[1]](function () {
                                    var e = s && s.apply(this, arguments);
                                    e && d.isFunction(e.promise)
                                      ? e
                                          .promise()
                                          .done(n.resolve)
                                          .fail(n.reject)
                                          .progress(n.notify)
                                      : n[o[0] + "With"](
                                          this === i ? n.promise() : this,
                                          s ? [e] : arguments
                                        );
                                  });
                                }),
                                  (e = null);
                              })
                              .promise();
                          },
                          promise: function (e) {
                            return null != e ? d.extend(e, i) : i;
                          },
                        },
                        r = {};
                      return (
                        (i.pipe = i.then),
                        d.each(t, function (e, o) {
                          var s = o[2],
                            a = o[3];
                          (i[o[1]] = s.add),
                            a &&
                              s.add(
                                function () {
                                  n = a;
                                },
                                t[1 ^ e][2].disable,
                                t[2][2].lock
                              ),
                            (r[o[0]] = function () {
                              return (
                                r[o[0] + "With"](
                                  this === r ? i : this,
                                  arguments
                                ),
                                this
                              );
                            }),
                            (r[o[0] + "With"] = s.fireWith);
                        }),
                        i.promise(r),
                        e && e.call(r, r),
                        r
                      );
                    },
                    when: function (e) {
                      var t,
                        n,
                        i,
                        o = 0,
                        s = r.call(arguments),
                        a = s.length,
                        u = 1 !== a || (e && d.isFunction(e.promise)) ? a : 0,
                        c = 1 === u ? e : d.Deferred(),
                        l = function (e, n, i) {
                          return function (o) {
                            (n[e] = this),
                              (i[e] =
                                arguments.length > 1 ? r.call(arguments) : o),
                              i === t
                                ? c.notifyWith(n, i)
                                : --u || c.resolveWith(n, i);
                          };
                        };
                      if (a > 1)
                        for (
                          t = new Array(a), n = new Array(a), i = new Array(a);
                          o < a;
                          o++
                        )
                          s[o] && d.isFunction(s[o].promise)
                            ? s[o]
                                .promise()
                                .done(l(o, i, s))
                                .fail(c.reject)
                                .progress(l(o, n, t))
                            : --u;
                      return u || c.resolveWith(i, s), c.promise();
                    },
                  }),
                  (d.fn.ready = function (e) {
                    return d.ready.promise().done(e), this;
                  }),
                  d.extend({
                    isReady: !1,
                    readyWait: 1,
                    holdReady: function (e) {
                      e ? d.readyWait++ : d.ready(!0);
                    },
                    ready: function (e) {
                      (!0 === e ? --d.readyWait : d.isReady) ||
                        ((d.isReady = !0),
                        (!0 !== e && --d.readyWait > 0) ||
                          (M.resolveWith(f, [d]),
                          d.fn.triggerHandler &&
                            (d(f).triggerHandler("ready"), d(f).off("ready"))));
                    },
                  }),
                  (d.ready.promise = function (t) {
                    return (
                      M ||
                        ((M = d.Deferred()),
                        "complete" === f.readyState
                          ? setTimeout(d.ready)
                          : (f.addEventListener("DOMContentLoaded", O, !1),
                            e.addEventListener("load", O, !1))),
                      M.promise(t)
                    );
                  }),
                  d.ready.promise();
                var D = (d.access = function (e, t, n, i, r, o, s) {
                  var a = 0,
                    u = e.length,
                    c = null == n;
                  if ("object" === d.type(n))
                    for (a in ((r = !0), n)) d.access(e, t, a, n[a], !0, o, s);
                  else if (
                    void 0 !== i &&
                    ((r = !0),
                    d.isFunction(i) || (s = !0),
                    c &&
                      (s
                        ? (t.call(e, i), (t = null))
                        : ((c = t),
                          (t = function (e, t, n) {
                            return c.call(d(e), n);
                          }))),
                    t)
                  )
                    for (; a < u; a++)
                      t(e[a], n, s ? i : i.call(e[a], a, t(e[a], n)));
                  return r ? e : c ? t.call(e) : u ? t(e[0], n) : o;
                });

                function N() {
                  Object.defineProperty((this.cache = {}), 0, {
                    get: function () {
                      return {};
                    },
                  }),
                    (this.expando = d.expando + N.uid++);
                }
                (d.acceptData = function (e) {
                  return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
                }),
                  (N.uid = 1),
                  (N.accepts = d.acceptData),
                  (N.prototype = {
                    key: function (e) {
                      if (!N.accepts(e)) return 0;
                      var t = {},
                        n = e[this.expando];
                      if (!n) {
                        n = N.uid++;
                        try {
                          (t[this.expando] = {
                            value: n,
                          }),
                            Object.defineProperties(e, t);
                        } catch (i) {
                          (t[this.expando] = n), d.extend(e, t);
                        }
                      }
                      return this.cache[n] || (this.cache[n] = {}), n;
                    },
                    set: function (e, t, n) {
                      var i,
                        r = this.key(e),
                        o = this.cache[r];
                      if ("string" == typeof t) o[t] = n;
                      else if (d.isEmptyObject(o)) d.extend(this.cache[r], t);
                      else for (i in t) o[i] = t[i];
                      return o;
                    },
                    get: function (e, t) {
                      var n = this.cache[this.key(e)];
                      return void 0 === t ? n : n[t];
                    },
                    access: function (e, t, n) {
                      var i;
                      return void 0 === t ||
                        (t && "string" == typeof t && void 0 === n)
                        ? void 0 !== (i = this.get(e, t))
                          ? i
                          : this.get(e, d.camelCase(t))
                        : (this.set(e, t, n), void 0 !== n ? n : t);
                    },
                    remove: function (e, t) {
                      var n,
                        i,
                        r,
                        o = this.key(e),
                        s = this.cache[o];
                      if (void 0 === t) this.cache[o] = {};
                      else {
                        d.isArray(t)
                          ? (i = t.concat(t.map(d.camelCase)))
                          : ((r = d.camelCase(t)),
                            (i =
                              t in s
                                ? [t, r]
                                : (i = r) in s
                                ? [i]
                                : i.match(S) || [])),
                          (n = i.length);
                        for (; n--; ) delete s[i[n]];
                      }
                    },
                    hasData: function (e) {
                      return !d.isEmptyObject(
                        this.cache[e[this.expando]] || {}
                      );
                    },
                    discard: function (e) {
                      e[this.expando] && delete this.cache[e[this.expando]];
                    },
                  });
                var V = new N(),
                  R = new N(),
                  I = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
                  L = /([A-Z])/g;

                function q(e, t, n) {
                  var i;
                  if (void 0 === n && 1 === e.nodeType)
                    if (
                      ((i = "data-" + t.replace(L, "-$1").toLowerCase()),
                      "string" == typeof (n = e.getAttribute(i)))
                    ) {
                      try {
                        n =
                          "true" === n ||
                          ("false" !== n &&
                            ("null" === n
                              ? null
                              : +n + "" === n
                              ? +n
                              : I.test(n)
                              ? d.parseJSON(n)
                              : n));
                      } catch (e) {}
                      R.set(e, t, n);
                    } else n = void 0;
                  return n;
                }
                d.extend({
                  hasData: function (e) {
                    return R.hasData(e) || V.hasData(e);
                  },
                  data: function (e, t, n) {
                    return R.access(e, t, n);
                  },
                  removeData: function (e, t) {
                    R.remove(e, t);
                  },
                  _data: function (e, t, n) {
                    return V.access(e, t, n);
                  },
                  _removeData: function (e, t) {
                    V.remove(e, t);
                  },
                }),
                  d.fn.extend({
                    data: function (e, t) {
                      var n,
                        i,
                        r,
                        o = this[0],
                        s = o && o.attributes;
                      if (void 0 === e) {
                        if (
                          this.length &&
                          ((r = R.get(o)),
                          1 === o.nodeType && !V.get(o, "hasDataAttrs"))
                        ) {
                          for (n = s.length; n--; )
                            s[n] &&
                              0 === (i = s[n].name).indexOf("data-") &&
                              ((i = d.camelCase(i.slice(5))), q(o, i, r[i]));
                          V.set(o, "hasDataAttrs", !0);
                        }
                        return r;
                      }
                      return "object" == typeof e
                        ? this.each(function () {
                            R.set(this, e);
                          })
                        : D(
                            this,
                            function (t) {
                              var n,
                                i = d.camelCase(e);
                              if (o && void 0 === t)
                                return void 0 !== (n = R.get(o, e))
                                  ? n
                                  : void 0 !== (n = R.get(o, i))
                                  ? n
                                  : void 0 !== (n = q(o, i, void 0))
                                  ? n
                                  : void 0;
                              this.each(function () {
                                var n = R.get(this, i);
                                R.set(this, i, t),
                                  -1 !== e.indexOf("-") &&
                                    void 0 !== n &&
                                    R.set(this, e, t);
                              });
                            },
                            null,
                            t,
                            arguments.length > 1,
                            null,
                            !0
                          );
                    },
                    removeData: function (e) {
                      return this.each(function () {
                        R.remove(this, e);
                      });
                    },
                  }),
                  d.extend({
                    queue: function (e, t, n) {
                      var i;
                      if (e)
                        return (
                          (t = (t || "fx") + "queue"),
                          (i = V.get(e, t)),
                          n &&
                            (!i || d.isArray(n)
                              ? (i = V.access(e, t, d.makeArray(n)))
                              : i.push(n)),
                          i || []
                        );
                    },
                    dequeue: function (e, t) {
                      t = t || "fx";
                      var n = d.queue(e, t),
                        i = n.length,
                        r = n.shift(),
                        o = d._queueHooks(e, t);
                      "inprogress" === r && ((r = n.shift()), i--),
                        r &&
                          ("fx" === t && n.unshift("inprogress"),
                          delete o.stop,
                          r.call(
                            e,
                            function () {
                              d.dequeue(e, t);
                            },
                            o
                          )),
                        !i && o && o.empty.fire();
                    },
                    _queueHooks: function (e, t) {
                      var n = t + "queueHooks";
                      return (
                        V.get(e, n) ||
                        V.access(e, n, {
                          empty: d.Callbacks("once memory").add(function () {
                            V.remove(e, [t + "queue", n]);
                          }),
                        })
                      );
                    },
                  }),
                  d.fn.extend({
                    queue: function (e, t) {
                      var n = 2;
                      return (
                        "string" != typeof e && ((t = e), (e = "fx"), n--),
                        arguments.length < n
                          ? d.queue(this[0], e)
                          : void 0 === t
                          ? this
                          : this.each(function () {
                              var n = d.queue(this, e, t);
                              d._queueHooks(this, e),
                                "fx" === e &&
                                  "inprogress" !== n[0] &&
                                  d.dequeue(this, e);
                            })
                      );
                    },
                    dequeue: function (e) {
                      return this.each(function () {
                        d.dequeue(this, e);
                      });
                    },
                    clearQueue: function (e) {
                      return this.queue(e || "fx", []);
                    },
                    promise: function (e, t) {
                      var n,
                        i = 1,
                        r = d.Deferred(),
                        o = this,
                        s = this.length,
                        a = function () {
                          --i || r.resolveWith(o, [o]);
                        };
                      for (
                        "string" != typeof e && ((t = e), (e = void 0)),
                          e = e || "fx";
                        s--;

                      )
                        (n = V.get(o[s], e + "queueHooks")) &&
                          n.empty &&
                          (i++, n.empty.add(a));
                      return a(), r.promise(t);
                    },
                  });
                var B,
                  H,
                  z = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
                  $ = ["Top", "Right", "Bottom", "Left"],
                  P = function (e, t) {
                    return (
                      (e = t || e),
                      "none" === d.css(e, "display") ||
                        !d.contains(e.ownerDocument, e)
                    );
                  },
                  U = /^(?:checkbox|radio)$/i;
                (B = f
                  .createDocumentFragment()
                  .appendChild(f.createElement("div"))),
                  (H = f.createElement("input")).setAttribute("type", "radio"),
                  H.setAttribute("checked", "checked"),
                  H.setAttribute("name", "t"),
                  B.appendChild(H),
                  (h.checkClone = B.cloneNode(!0).cloneNode(
                    !0
                  ).lastChild.checked),
                  (B.innerHTML = "<textarea>x</textarea>"),
                  (h.noCloneChecked = !!B.cloneNode(!0).lastChild.defaultValue),
                  (h.focusinBubbles = "onfocusin" in e);
                var W = /^key/,
                  X = /^(?:mouse|pointer|contextmenu)|click/,
                  J = /^(?:focusinfocus|focusoutblur)$/,
                  K = /^([^.]*)(?:\.(.+)|)$/;

                function G() {
                  return !0;
                }

                function Y() {
                  return !1;
                }

                function Q() {
                  try {
                    return f.activeElement;
                  } catch (e) {}
                }
                (d.event = {
                  global: {},
                  add: function (e, t, n, i, r) {
                    var o,
                      s,
                      a,
                      u,
                      c,
                      l,
                      h,
                      f,
                      p,
                      g,
                      v,
                      m = V.get(e);
                    if (m)
                      for (
                        n.handler && ((n = (o = n).handler), (r = o.selector)),
                          n.guid || (n.guid = d.guid++),
                          (u = m.events) || (u = m.events = {}),
                          (s = m.handle) ||
                            (s = m.handle =
                              function (t) {
                                return void 0 !== d &&
                                  d.event.triggered !== t.type
                                  ? d.event.dispatch.apply(e, arguments)
                                  : void 0;
                              }),
                          c = (t = (t || "").match(S) || [""]).length;
                        c--;

                      )
                        (p = v = (a = K.exec(t[c]) || [])[1]),
                          (g = (a[2] || "").split(".").sort()),
                          p &&
                            ((h = d.event.special[p] || {}),
                            (p = (r ? h.delegateType : h.bindType) || p),
                            (h = d.event.special[p] || {}),
                            (l = d.extend(
                              {
                                type: p,
                                origType: v,
                                data: i,
                                handler: n,
                                guid: n.guid,
                                selector: r,
                                needsContext:
                                  r && d.expr.match.needsContext.test(r),
                                namespace: g.join("."),
                              },
                              o
                            )),
                            (f = u[p]) ||
                              (((f = u[p] = []).delegateCount = 0),
                              (h.setup && !1 !== h.setup.call(e, i, g, s)) ||
                                (e.addEventListener &&
                                  e.addEventListener(p, s, !1))),
                            h.add &&
                              (h.add.call(e, l),
                              l.handler.guid || (l.handler.guid = n.guid)),
                            r ? f.splice(f.delegateCount++, 0, l) : f.push(l),
                            (d.event.global[p] = !0));
                  },
                  remove: function (e, t, n, i, r) {
                    var o,
                      s,
                      a,
                      u,
                      c,
                      l,
                      h,
                      f,
                      p,
                      g,
                      v,
                      m = V.hasData(e) && V.get(e);
                    if (m && (u = m.events)) {
                      for (c = (t = (t || "").match(S) || [""]).length; c--; )
                        if (
                          ((p = v = (a = K.exec(t[c]) || [])[1]),
                          (g = (a[2] || "").split(".").sort()),
                          p)
                        ) {
                          for (
                            h = d.event.special[p] || {},
                              f =
                                u[
                                  (p = (i ? h.delegateType : h.bindType) || p)
                                ] || [],
                              a =
                                a[2] &&
                                new RegExp(
                                  "(^|\\.)" +
                                    g.join("\\.(?:.*\\.|)") +
                                    "(\\.|$)"
                                ),
                              s = o = f.length;
                            o--;

                          )
                            (l = f[o]),
                              (!r && v !== l.origType) ||
                                (n && n.guid !== l.guid) ||
                                (a && !a.test(l.namespace)) ||
                                (i &&
                                  i !== l.selector &&
                                  ("**" !== i || !l.selector)) ||
                                (f.splice(o, 1),
                                l.selector && f.delegateCount--,
                                h.remove && h.remove.call(e, l));
                          s &&
                            !f.length &&
                            ((h.teardown &&
                              !1 !== h.teardown.call(e, g, m.handle)) ||
                              d.removeEvent(e, p, m.handle),
                            delete u[p]);
                        } else
                          for (p in u) d.event.remove(e, p + t[c], n, i, !0);
                      d.isEmptyObject(u) &&
                        (delete m.handle, V.remove(e, "events"));
                    }
                  },
                  trigger: function (t, n, i, r) {
                    var o,
                      s,
                      a,
                      u,
                      c,
                      h,
                      p,
                      g = [i || f],
                      v = l.call(t, "type") ? t.type : t,
                      m = l.call(t, "namespace") ? t.namespace.split(".") : [];
                    if (
                      ((s = a = i = i || f),
                      3 !== i.nodeType &&
                        8 !== i.nodeType &&
                        !J.test(v + d.event.triggered) &&
                        (v.indexOf(".") >= 0 &&
                          ((m = v.split(".")), (v = m.shift()), m.sort()),
                        (c = v.indexOf(":") < 0 && "on" + v),
                        ((t = t[d.expando]
                          ? t
                          : new d.Event(
                              v,
                              "object" == typeof t && t
                            )).isTrigger = r ? 2 : 3),
                        (t.namespace = m.join(".")),
                        (t.namespace_re = t.namespace
                          ? new RegExp(
                              "(^|\\.)" + m.join("\\.(?:.*\\.|)") + "(\\.|$)"
                            )
                          : null),
                        (t.result = void 0),
                        t.target || (t.target = i),
                        (n = null == n ? [t] : d.makeArray(n, [t])),
                        (p = d.event.special[v] || {}),
                        r || !p.trigger || !1 !== p.trigger.apply(i, n)))
                    ) {
                      if (!r && !p.noBubble && !d.isWindow(i)) {
                        for (
                          u = p.delegateType || v,
                            J.test(u + v) || (s = s.parentNode);
                          s;
                          s = s.parentNode
                        )
                          g.push(s), (a = s);
                        a === (i.ownerDocument || f) &&
                          g.push(a.defaultView || a.parentWindow || e);
                      }
                      for (o = 0; (s = g[o++]) && !t.isPropagationStopped(); )
                        (t.type = o > 1 ? u : p.bindType || v),
                          (h =
                            (V.get(s, "events") || {})[t.type] &&
                            V.get(s, "handle")) && h.apply(s, n),
                          (h = c && s[c]) &&
                            h.apply &&
                            d.acceptData(s) &&
                            ((t.result = h.apply(s, n)),
                            !1 === t.result && t.preventDefault());
                      return (
                        (t.type = v),
                        r ||
                          t.isDefaultPrevented() ||
                          (p._default && !1 !== p._default.apply(g.pop(), n)) ||
                          !d.acceptData(i) ||
                          (c &&
                            d.isFunction(i[v]) &&
                            !d.isWindow(i) &&
                            ((a = i[c]) && (i[c] = null),
                            (d.event.triggered = v),
                            i[v](),
                            (d.event.triggered = void 0),
                            a && (i[c] = a))),
                        t.result
                      );
                    }
                  },
                  dispatch: function (e) {
                    e = d.event.fix(e);
                    var t,
                      n,
                      i,
                      o,
                      s,
                      a,
                      u = r.call(arguments),
                      c = (V.get(this, "events") || {})[e.type] || [],
                      l = d.event.special[e.type] || {};
                    if (
                      ((u[0] = e),
                      (e.delegateTarget = this),
                      !l.preDispatch || !1 !== l.preDispatch.call(this, e))
                    ) {
                      for (
                        a = d.event.handlers.call(this, e, c), t = 0;
                        (o = a[t++]) && !e.isPropagationStopped();

                      )
                        for (
                          e.currentTarget = o.elem, n = 0;
                          (s = o.handlers[n++]) &&
                          !e.isImmediatePropagationStopped();

                        )
                          (e.namespace_re &&
                            !e.namespace_re.test(s.namespace)) ||
                            ((e.handleObj = s),
                            (e.data = s.data),
                            void 0 !==
                              (i = (
                                (d.event.special[s.origType] || {}).handle ||
                                s.handler
                              ).apply(o.elem, u)) &&
                              !1 === (e.result = i) &&
                              (e.preventDefault(), e.stopPropagation()));
                      return (
                        l.postDispatch && l.postDispatch.call(this, e), e.result
                      );
                    }
                  },
                  handlers: function (e, t) {
                    var n,
                      i,
                      r,
                      o,
                      s = [],
                      a = t.delegateCount,
                      u = e.target;
                    if (a && u.nodeType && (!e.button || "click" !== e.type))
                      for (; u !== this; u = u.parentNode || this)
                        if (!0 !== u.disabled || "click" !== e.type) {
                          for (i = [], n = 0; n < a; n++)
                            void 0 === i[(r = (o = t[n]).selector + " ")] &&
                              (i[r] = o.needsContext
                                ? d(r, this).index(u) >= 0
                                : d.find(r, this, null, [u]).length),
                              i[r] && i.push(o);
                          i.length &&
                            s.push({
                              elem: u,
                              handlers: i,
                            });
                        }
                    return (
                      a < t.length &&
                        s.push({
                          elem: this,
                          handlers: t.slice(a),
                        }),
                      s
                    );
                  },
                  props:
                    "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(
                      " "
                    ),
                  fixHooks: {},
                  keyHooks: {
                    props: "char charCode key keyCode".split(" "),
                    filter: function (e, t) {
                      return (
                        null == e.which &&
                          (e.which =
                            null != t.charCode ? t.charCode : t.keyCode),
                        e
                      );
                    },
                  },
                  mouseHooks: {
                    props:
                      "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(
                        " "
                      ),
                    filter: function (e, t) {
                      var n,
                        i,
                        r,
                        o = t.button;
                      return (
                        null == e.pageX &&
                          null != t.clientX &&
                          ((i = (n = e.target.ownerDocument || f)
                            .documentElement),
                          (r = n.body),
                          (e.pageX =
                            t.clientX +
                            ((i && i.scrollLeft) || (r && r.scrollLeft) || 0) -
                            ((i && i.clientLeft) || (r && r.clientLeft) || 0)),
                          (e.pageY =
                            t.clientY +
                            ((i && i.scrollTop) || (r && r.scrollTop) || 0) -
                            ((i && i.clientTop) || (r && r.clientTop) || 0))),
                        e.which ||
                          void 0 === o ||
                          (e.which = 1 & o ? 1 : 2 & o ? 3 : 4 & o ? 2 : 0),
                        e
                      );
                    },
                  },
                  fix: function (e) {
                    if (e[d.expando]) return e;
                    var t,
                      n,
                      i,
                      r = e.type,
                      o = e,
                      s = this.fixHooks[r];
                    for (
                      s ||
                        (this.fixHooks[r] = s =
                          X.test(r)
                            ? this.mouseHooks
                            : W.test(r)
                            ? this.keyHooks
                            : {}),
                        i = s.props ? this.props.concat(s.props) : this.props,
                        e = new d.Event(o),
                        t = i.length;
                      t--;

                    )
                      e[(n = i[t])] = o[n];
                    return (
                      e.target || (e.target = f),
                      3 === e.target.nodeType &&
                        (e.target = e.target.parentNode),
                      s.filter ? s.filter(e, o) : e
                    );
                  },
                  special: {
                    load: {
                      noBubble: !0,
                    },
                    focus: {
                      trigger: function () {
                        if (this !== Q() && this.focus) return this.focus(), !1;
                      },
                      delegateType: "focusin",
                    },
                    blur: {
                      trigger: function () {
                        if (this === Q() && this.blur) return this.blur(), !1;
                      },
                      delegateType: "focusout",
                    },
                    click: {
                      trigger: function () {
                        if (
                          "checkbox" === this.type &&
                          this.click &&
                          d.nodeName(this, "input")
                        )
                          return this.click(), !1;
                      },
                      _default: function (e) {
                        return d.nodeName(e.target, "a");
                      },
                    },
                    beforeunload: {
                      postDispatch: function (e) {
                        void 0 !== e.result &&
                          e.originalEvent &&
                          (e.originalEvent.returnValue = e.result);
                      },
                    },
                  },
                  simulate: function (e, t, n, i) {
                    var r = d.extend(new d.Event(), n, {
                      type: e,
                      isSimulated: !0,
                      originalEvent: {},
                    });
                    i
                      ? d.event.trigger(r, null, t)
                      : d.event.dispatch.call(t, r),
                      r.isDefaultPrevented() && n.preventDefault();
                  },
                }),
                  (d.removeEvent = function (e, t, n) {
                    e.removeEventListener && e.removeEventListener(t, n, !1);
                  }),
                  (d.Event = function (e, t) {
                    if (!(this instanceof d.Event)) return new d.Event(e, t);
                    e && e.type
                      ? ((this.originalEvent = e),
                        (this.type = e.type),
                        (this.isDefaultPrevented =
                          e.defaultPrevented ||
                          (void 0 === e.defaultPrevented &&
                            !1 === e.returnValue)
                            ? G
                            : Y))
                      : (this.type = e),
                      t && d.extend(this, t),
                      (this.timeStamp = (e && e.timeStamp) || d.now()),
                      (this[d.expando] = !0);
                  }),
                  (d.Event.prototype = {
                    isDefaultPrevented: Y,
                    isPropagationStopped: Y,
                    isImmediatePropagationStopped: Y,
                    preventDefault: function () {
                      var e = this.originalEvent;
                      (this.isDefaultPrevented = G),
                        e && e.preventDefault && e.preventDefault();
                    },
                    stopPropagation: function () {
                      var e = this.originalEvent;
                      (this.isPropagationStopped = G),
                        e && e.stopPropagation && e.stopPropagation();
                    },
                    stopImmediatePropagation: function () {
                      var e = this.originalEvent;
                      (this.isImmediatePropagationStopped = G),
                        e &&
                          e.stopImmediatePropagation &&
                          e.stopImmediatePropagation(),
                        this.stopPropagation();
                    },
                  }),
                  d.each(
                    {
                      mouseenter: "mouseover",
                      mouseleave: "mouseout",
                      pointerenter: "pointerover",
                      pointerleave: "pointerout",
                    },
                    function (e, t) {
                      d.event.special[e] = {
                        delegateType: t,
                        bindType: t,
                        handle: function (e) {
                          var n,
                            i = e.relatedTarget,
                            r = e.handleObj;
                          return (
                            (i && (i === this || d.contains(this, i))) ||
                              ((e.type = r.origType),
                              (n = r.handler.apply(this, arguments)),
                              (e.type = t)),
                            n
                          );
                        },
                      };
                    }
                  ),
                  h.focusinBubbles ||
                    d.each(
                      {
                        focus: "focusin",
                        blur: "focusout",
                      },
                      function (e, t) {
                        var n = function (e) {
                          d.event.simulate(t, e.target, d.event.fix(e), !0);
                        };
                        d.event.special[t] = {
                          setup: function () {
                            var i = this.ownerDocument || this,
                              r = V.access(i, t);
                            r || i.addEventListener(e, n, !0),
                              V.access(i, t, (r || 0) + 1);
                          },
                          teardown: function () {
                            var i = this.ownerDocument || this,
                              r = V.access(i, t) - 1;
                            r
                              ? V.access(i, t, r)
                              : (i.removeEventListener(e, n, !0),
                                V.remove(i, t));
                          },
                        };
                      }
                    ),
                  d.fn.extend({
                    on: function (e, t, n, i, r) {
                      var o, s;
                      if ("object" == typeof e) {
                        for (s in ("string" != typeof t &&
                          ((n = n || t), (t = void 0)),
                        e))
                          this.on(s, t, n, e[s], r);
                        return this;
                      }
                      if (
                        (null == n && null == i
                          ? ((i = t), (n = t = void 0))
                          : null == i &&
                            ("string" == typeof t
                              ? ((i = n), (n = void 0))
                              : ((i = n), (n = t), (t = void 0))),
                        !1 === i)
                      )
                        i = Y;
                      else if (!i) return this;
                      return (
                        1 === r &&
                          ((o = i),
                          ((i = function (e) {
                            return d().off(e), o.apply(this, arguments);
                          }).guid = o.guid || (o.guid = d.guid++))),
                        this.each(function () {
                          d.event.add(this, e, i, n, t);
                        })
                      );
                    },
                    one: function (e, t, n, i) {
                      return this.on(e, t, n, i, 1);
                    },
                    off: function (e, t, n) {
                      var i, r;
                      if (e && e.preventDefault && e.handleObj)
                        return (
                          (i = e.handleObj),
                          d(e.delegateTarget).off(
                            i.namespace
                              ? i.origType + "." + i.namespace
                              : i.origType,
                            i.selector,
                            i.handler
                          ),
                          this
                        );
                      if ("object" == typeof e) {
                        for (r in e) this.off(r, t, e[r]);
                        return this;
                      }
                      return (
                        (!1 !== t && "function" != typeof t) ||
                          ((n = t), (t = void 0)),
                        !1 === n && (n = Y),
                        this.each(function () {
                          d.event.remove(this, e, n, t);
                        })
                      );
                    },
                    trigger: function (e, t) {
                      return this.each(function () {
                        d.event.trigger(e, t, this);
                      });
                    },
                    triggerHandler: function (e, t) {
                      var n = this[0];
                      if (n) return d.event.trigger(e, t, n, !0);
                    },
                  });
                var Z =
                    /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
                  ee = /<([\w:]+)/,
                  te = /<|&#?\w+;/,
                  ne = /<(?:script|style|link)/i,
                  ie = /checked\s*(?:[^=]|=\s*.checked.)/i,
                  re = /^$|\/(?:java|ecma)script/i,
                  oe = /^true\/(.*)/,
                  se = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
                  ae = {
                    option: [1, "<select multiple='multiple'>", "</select>"],
                    thead: [1, "<table>", "</table>"],
                    col: [2, "<table><colgroup>", "</colgroup></table>"],
                    tr: [2, "<table><tbody>", "</tbody></table>"],
                    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    _default: [0, "", ""],
                  };

                function ue(e, t) {
                  return d.nodeName(e, "table") &&
                    d.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr")
                    ? e.getElementsByTagName("tbody")[0] ||
                        e.appendChild(e.ownerDocument.createElement("tbody"))
                    : e;
                }

                function ce(e) {
                  return (
                    (e.type = (null !== e.getAttribute("type")) + "/" + e.type),
                    e
                  );
                }

                function le(e) {
                  var t = oe.exec(e.type);
                  return t ? (e.type = t[1]) : e.removeAttribute("type"), e;
                }

                function he(e, t) {
                  for (var n = 0, i = e.length; n < i; n++)
                    V.set(e[n], "globalEval", !t || V.get(t[n], "globalEval"));
                }

                function fe(e, t) {
                  var n, i, r, o, s, a, u, c;
                  if (1 === t.nodeType) {
                    if (
                      V.hasData(e) &&
                      ((o = V.access(e)), (s = V.set(t, o)), (c = o.events))
                    )
                      for (r in (delete s.handle, (s.events = {}), c))
                        for (n = 0, i = c[r].length; n < i; n++)
                          d.event.add(t, r, c[r][n]);
                    R.hasData(e) &&
                      ((a = R.access(e)), (u = d.extend({}, a)), R.set(t, u));
                  }
                }

                function de(e, t) {
                  var n = e.getElementsByTagName
                    ? e.getElementsByTagName(t || "*")
                    : e.querySelectorAll
                    ? e.querySelectorAll(t || "*")
                    : [];
                  return void 0 === t || (t && d.nodeName(e, t))
                    ? d.merge([e], n)
                    : n;
                }
                (ae.optgroup = ae.option),
                  (ae.tbody = ae.tfoot = ae.colgroup = ae.caption = ae.thead),
                  (ae.th = ae.td),
                  d.extend({
                    clone: function (e, t, n) {
                      var i,
                        r,
                        o,
                        s,
                        a,
                        u,
                        c,
                        l = e.cloneNode(!0),
                        f = d.contains(e.ownerDocument, e);
                      if (
                        !(
                          h.noCloneChecked ||
                          (1 !== e.nodeType && 11 !== e.nodeType) ||
                          d.isXMLDoc(e)
                        )
                      )
                        for (
                          s = de(l), i = 0, r = (o = de(e)).length;
                          i < r;
                          i++
                        )
                          (a = o[i]),
                            (u = s[i]),
                            (c = void 0),
                            "input" === (c = u.nodeName.toLowerCase()) &&
                            U.test(a.type)
                              ? (u.checked = a.checked)
                              : ("input" !== c && "textarea" !== c) ||
                                (u.defaultValue = a.defaultValue);
                      if (t)
                        if (n)
                          for (
                            o = o || de(e), s = s || de(l), i = 0, r = o.length;
                            i < r;
                            i++
                          )
                            fe(o[i], s[i]);
                        else fe(e, l);
                      return (
                        (s = de(l, "script")).length > 0 &&
                          he(s, !f && de(e, "script")),
                        l
                      );
                    },
                    buildFragment: function (e, t, n, i) {
                      for (
                        var r,
                          o,
                          s,
                          a,
                          u,
                          c,
                          l = t.createDocumentFragment(),
                          h = [],
                          f = 0,
                          p = e.length;
                        f < p;
                        f++
                      )
                        if ((r = e[f]) || 0 === r)
                          if ("object" === d.type(r))
                            d.merge(h, r.nodeType ? [r] : r);
                          else if (te.test(r)) {
                            for (
                              o = o || l.appendChild(t.createElement("div")),
                                s = (ee.exec(r) || ["", ""])[1].toLowerCase(),
                                a = ae[s] || ae._default,
                                o.innerHTML =
                                  a[1] + r.replace(Z, "<$1></$2>") + a[2],
                                c = a[0];
                              c--;

                            )
                              o = o.lastChild;
                            d.merge(h, o.childNodes),
                              ((o = l.firstChild).textContent = "");
                          } else h.push(t.createTextNode(r));
                      for (l.textContent = "", f = 0; (r = h[f++]); )
                        if (
                          (!i || -1 === d.inArray(r, i)) &&
                          ((u = d.contains(r.ownerDocument, r)),
                          (o = de(l.appendChild(r), "script")),
                          u && he(o),
                          n)
                        )
                          for (c = 0; (r = o[c++]); )
                            re.test(r.type || "") && n.push(r);
                      return l;
                    },
                    cleanData: function (e) {
                      for (
                        var t, n, i, r, o = d.event.special, s = 0;
                        void 0 !== (n = e[s]);
                        s++
                      ) {
                        if (
                          d.acceptData(n) &&
                          (r = n[V.expando]) &&
                          (t = V.cache[r])
                        ) {
                          if (t.events)
                            for (i in t.events)
                              o[i]
                                ? d.event.remove(n, i)
                                : d.removeEvent(n, i, t.handle);
                          V.cache[r] && delete V.cache[r];
                        }
                        delete R.cache[n[R.expando]];
                      }
                    },
                  }),
                  d.fn.extend({
                    text: function (e) {
                      return D(
                        this,
                        function (e) {
                          return void 0 === e
                            ? d.text(this)
                            : this.empty().each(function () {
                                (1 !== this.nodeType &&
                                  11 !== this.nodeType &&
                                  9 !== this.nodeType) ||
                                  (this.textContent = e);
                              });
                        },
                        null,
                        e,
                        arguments.length
                      );
                    },
                    append: function () {
                      return this.domManip(arguments, function (e) {
                        (1 !== this.nodeType &&
                          11 !== this.nodeType &&
                          9 !== this.nodeType) ||
                          ue(this, e).appendChild(e);
                      });
                    },
                    prepend: function () {
                      return this.domManip(arguments, function (e) {
                        if (
                          1 === this.nodeType ||
                          11 === this.nodeType ||
                          9 === this.nodeType
                        ) {
                          var t = ue(this, e);
                          t.insertBefore(e, t.firstChild);
                        }
                      });
                    },
                    before: function () {
                      return this.domManip(arguments, function (e) {
                        this.parentNode &&
                          this.parentNode.insertBefore(e, this);
                      });
                    },
                    after: function () {
                      return this.domManip(arguments, function (e) {
                        this.parentNode &&
                          this.parentNode.insertBefore(e, this.nextSibling);
                      });
                    },
                    remove: function (e, t) {
                      for (
                        var n, i = e ? d.filter(e, this) : this, r = 0;
                        null != (n = i[r]);
                        r++
                      )
                        t || 1 !== n.nodeType || d.cleanData(de(n)),
                          n.parentNode &&
                            (t &&
                              d.contains(n.ownerDocument, n) &&
                              he(de(n, "script")),
                            n.parentNode.removeChild(n));
                      return this;
                    },
                    empty: function () {
                      for (var e, t = 0; null != (e = this[t]); t++)
                        1 === e.nodeType &&
                          (d.cleanData(de(e, !1)), (e.textContent = ""));
                      return this;
                    },
                    clone: function (e, t) {
                      return (
                        (e = null != e && e),
                        (t = null == t ? e : t),
                        this.map(function () {
                          return d.clone(this, e, t);
                        })
                      );
                    },
                    html: function (e) {
                      return D(
                        this,
                        function (e) {
                          var t = this[0] || {},
                            n = 0,
                            i = this.length;
                          if (void 0 === e && 1 === t.nodeType)
                            return t.innerHTML;
                          if (
                            "string" == typeof e &&
                            !ne.test(e) &&
                            !ae[(ee.exec(e) || ["", ""])[1].toLowerCase()]
                          ) {
                            e = e.replace(Z, "<$1></$2>");
                            try {
                              for (; n < i; n++)
                                1 === (t = this[n] || {}).nodeType &&
                                  (d.cleanData(de(t, !1)), (t.innerHTML = e));
                              t = 0;
                            } catch (e) {}
                          }
                          t && this.empty().append(e);
                        },
                        null,
                        e,
                        arguments.length
                      );
                    },
                    replaceWith: function () {
                      var e = arguments[0];
                      return (
                        this.domManip(arguments, function (t) {
                          (e = this.parentNode),
                            d.cleanData(de(this)),
                            e && e.replaceChild(t, this);
                        }),
                        e && (e.length || e.nodeType) ? this : this.remove()
                      );
                    },
                    detach: function (e) {
                      return this.remove(e, !0);
                    },
                    domManip: function (e, t) {
                      e = o.apply([], e);
                      var n,
                        i,
                        r,
                        s,
                        a,
                        u,
                        c = 0,
                        l = this.length,
                        f = this,
                        p = l - 1,
                        g = e[0],
                        v = d.isFunction(g);
                      if (
                        v ||
                        (l > 1 &&
                          "string" == typeof g &&
                          !h.checkClone &&
                          ie.test(g))
                      )
                        return this.each(function (n) {
                          var i = f.eq(n);
                          v && (e[0] = g.call(this, n, i.html())),
                            i.domManip(e, t);
                        });
                      if (
                        l &&
                        ((i = (n = d.buildFragment(
                          e,
                          this[0].ownerDocument,
                          !1,
                          this
                        )).firstChild),
                        1 === n.childNodes.length && (n = i),
                        i)
                      ) {
                        for (
                          s = (r = d.map(de(n, "script"), ce)).length;
                          c < l;
                          c++
                        )
                          (a = n),
                            c !== p &&
                              ((a = d.clone(a, !0, !0)),
                              s && d.merge(r, de(a, "script"))),
                            t.call(this[c], a, c);
                        if (s)
                          for (
                            u = r[r.length - 1].ownerDocument,
                              d.map(r, le),
                              c = 0;
                            c < s;
                            c++
                          )
                            (a = r[c]),
                              re.test(a.type || "") &&
                                !V.access(a, "globalEval") &&
                                d.contains(u, a) &&
                                (a.src
                                  ? d._evalUrl && d._evalUrl(a.src)
                                  : d.globalEval(
                                      a.textContent.replace(se, "")
                                    ));
                      }
                      return this;
                    },
                  }),
                  d.each(
                    {
                      appendTo: "append",
                      prependTo: "prepend",
                      insertBefore: "before",
                      insertAfter: "after",
                      replaceAll: "replaceWith",
                    },
                    function (e, t) {
                      d.fn[e] = function (e) {
                        for (
                          var n, i = [], r = d(e), o = r.length - 1, a = 0;
                          a <= o;
                          a++
                        )
                          (n = a === o ? this : this.clone(!0)),
                            d(r[a])[t](n),
                            s.apply(i, n.get());
                        return this.pushStack(i);
                      };
                    }
                  );
                var pe,
                  ge = {};

                function ve(t, n) {
                  var i,
                    r = d(n.createElement(t)).appendTo(n.body),
                    o =
                      e.getDefaultComputedStyle &&
                      (i = e.getDefaultComputedStyle(r[0]))
                        ? i.display
                        : d.css(r[0], "display");
                  return r.detach(), o;
                }

                function me(e) {
                  var t = f,
                    n = ge[e];
                  return (
                    n ||
                      (("none" !== (n = ve(e, t)) && n) ||
                        ((t = (pe = (
                          pe ||
                          d("<iframe frameborder='0' width='0' height='0'/>")
                        ).appendTo(t.documentElement))[0]
                          .contentDocument).write(),
                        t.close(),
                        (n = ve(e, t)),
                        pe.detach()),
                      (ge[e] = n)),
                    n
                  );
                }
                var ye = /^margin/,
                  be = new RegExp("^(" + z + ")(?!px)[a-z%]+$", "i"),
                  we = function (t) {
                    return t.ownerDocument.defaultView.opener
                      ? t.ownerDocument.defaultView.getComputedStyle(t, null)
                      : e.getComputedStyle(t, null);
                  };

                function xe(e, t, n) {
                  var i,
                    r,
                    o,
                    s,
                    a = e.style;
                  return (
                    (n = n || we(e)) && (s = n.getPropertyValue(t) || n[t]),
                    n &&
                      ("" !== s ||
                        d.contains(e.ownerDocument, e) ||
                        (s = d.style(e, t)),
                      be.test(s) &&
                        ye.test(t) &&
                        ((i = a.width),
                        (r = a.minWidth),
                        (o = a.maxWidth),
                        (a.minWidth = a.maxWidth = a.width = s),
                        (s = n.width),
                        (a.width = i),
                        (a.minWidth = r),
                        (a.maxWidth = o))),
                    void 0 !== s ? s + "" : s
                  );
                }

                function _e(e, t) {
                  return {
                    get: function () {
                      if (!e()) return (this.get = t).apply(this, arguments);
                      delete this.get;
                    },
                  };
                }
                !(function () {
                  var t,
                    n,
                    i = f.documentElement,
                    r = f.createElement("div"),
                    o = f.createElement("div");

                  function s() {
                    (o.style.cssText =
                      "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute"),
                      (o.innerHTML = ""),
                      i.appendChild(r);
                    var s = e.getComputedStyle(o, null);
                    (t = "1%" !== s.top),
                      (n = "4px" === s.width),
                      i.removeChild(r);
                  }
                  o.style &&
                    ((o.style.backgroundClip = "content-box"),
                    (o.cloneNode(!0).style.backgroundClip = ""),
                    (h.clearCloneStyle =
                      "content-box" === o.style.backgroundClip),
                    (r.style.cssText =
                      "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute"),
                    r.appendChild(o),
                    e.getComputedStyle &&
                      d.extend(h, {
                        pixelPosition: function () {
                          return s(), t;
                        },
                        boxSizingReliable: function () {
                          return null == n && s(), n;
                        },
                        reliableMarginRight: function () {
                          var t,
                            n = o.appendChild(f.createElement("div"));
                          return (
                            (n.style.cssText = o.style.cssText =
                              "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0"),
                            (n.style.marginRight = n.style.width = "0"),
                            (o.style.width = "1px"),
                            i.appendChild(r),
                            (t = !parseFloat(
                              e.getComputedStyle(n, null).marginRight
                            )),
                            i.removeChild(r),
                            o.removeChild(n),
                            t
                          );
                        },
                      }));
                })(),
                  (d.swap = function (e, t, n, i) {
                    var r,
                      o,
                      s = {};
                    for (o in t) (s[o] = e.style[o]), (e.style[o] = t[o]);
                    for (o in ((r = n.apply(e, i || [])), t)) e.style[o] = s[o];
                    return r;
                  });
                var Ce = /^(none|table(?!-c[ea]).+)/,
                  ke = new RegExp("^(" + z + ")(.*)$", "i"),
                  Ee = new RegExp("^([+-])=(" + z + ")", "i"),
                  Fe = {
                    position: "absolute",
                    visibility: "hidden",
                    display: "block",
                  },
                  Te = {
                    letterSpacing: "0",
                    fontWeight: "400",
                  },
                  Ae = ["Webkit", "O", "Moz", "ms"];

                function Me(e, t) {
                  if (t in e) return t;
                  for (
                    var n = t[0].toUpperCase() + t.slice(1),
                      i = t,
                      r = Ae.length;
                    r--;

                  )
                    if ((t = Ae[r] + n) in e) return t;
                  return i;
                }

                function Se(e, t, n) {
                  var i = ke.exec(t);
                  return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t;
                }

                function je(e, t, n, i, r) {
                  for (
                    var o =
                        n === (i ? "border" : "content")
                          ? 4
                          : "width" === t
                          ? 1
                          : 0,
                      s = 0;
                    o < 4;
                    o += 2
                  )
                    "margin" === n && (s += d.css(e, n + $[o], !0, r)),
                      i
                        ? ("content" === n &&
                            (s -= d.css(e, "padding" + $[o], !0, r)),
                          "margin" !== n &&
                            (s -= d.css(e, "border" + $[o] + "Width", !0, r)))
                        : ((s += d.css(e, "padding" + $[o], !0, r)),
                          "padding" !== n &&
                            (s += d.css(e, "border" + $[o] + "Width", !0, r)));
                  return s;
                }

                function Oe(e, t, n) {
                  var i = !0,
                    r = "width" === t ? e.offsetWidth : e.offsetHeight,
                    o = we(e),
                    s = "border-box" === d.css(e, "boxSizing", !1, o);
                  if (r <= 0 || null == r) {
                    if (
                      (((r = xe(e, t, o)) < 0 || null == r) && (r = e.style[t]),
                      be.test(r))
                    )
                      return r;
                    (i = s && (h.boxSizingReliable() || r === e.style[t])),
                      (r = parseFloat(r) || 0);
                  }
                  return (
                    r + je(e, t, n || (s ? "border" : "content"), i, o) + "px"
                  );
                }

                function De(e, t) {
                  for (var n, i, r, o = [], s = 0, a = e.length; s < a; s++)
                    (i = e[s]).style &&
                      ((o[s] = V.get(i, "olddisplay")),
                      (n = i.style.display),
                      t
                        ? (o[s] || "none" !== n || (i.style.display = ""),
                          "" === i.style.display &&
                            P(i) &&
                            (o[s] = V.access(i, "olddisplay", me(i.nodeName))))
                        : ((r = P(i)),
                          ("none" === n && r) ||
                            V.set(
                              i,
                              "olddisplay",
                              r ? n : d.css(i, "display")
                            )));
                  for (s = 0; s < a; s++)
                    (i = e[s]).style &&
                      ((t &&
                        "none" !== i.style.display &&
                        "" !== i.style.display) ||
                        (i.style.display = t ? o[s] || "" : "none"));
                  return e;
                }

                function Ne(e, t, n, i, r) {
                  return new Ne.prototype.init(e, t, n, i, r);
                }
                d.extend({
                  cssHooks: {
                    opacity: {
                      get: function (e, t) {
                        if (t) {
                          var n = xe(e, "opacity");
                          return "" === n ? "1" : n;
                        }
                      },
                    },
                  },
                  cssNumber: {
                    columnCount: !0,
                    fillOpacity: !0,
                    flexGrow: !0,
                    flexShrink: !0,
                    fontWeight: !0,
                    lineHeight: !0,
                    opacity: !0,
                    order: !0,
                    orphans: !0,
                    widows: !0,
                    zIndex: !0,
                    zoom: !0,
                  },
                  cssProps: {
                    float: "cssFloat",
                  },
                  style: function (e, t, n, i) {
                    if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                      var r,
                        o,
                        s,
                        a = d.camelCase(t),
                        u = e.style;
                      if (
                        ((t = d.cssProps[a] || (d.cssProps[a] = Me(u, a))),
                        (s = d.cssHooks[t] || d.cssHooks[a]),
                        void 0 === n)
                      )
                        return s &&
                          "get" in s &&
                          void 0 !== (r = s.get(e, !1, i))
                          ? r
                          : u[t];
                      "string" === (o = typeof n) &&
                        (r = Ee.exec(n)) &&
                        ((n = (r[1] + 1) * r[2] + parseFloat(d.css(e, t))),
                        (o = "number")),
                        null != n &&
                          n == n &&
                          ("number" !== o || d.cssNumber[a] || (n += "px"),
                          h.clearCloneStyle ||
                            "" !== n ||
                            0 !== t.indexOf("background") ||
                            (u[t] = "inherit"),
                          (s &&
                            "set" in s &&
                            void 0 === (n = s.set(e, n, i))) ||
                            (u[t] = n));
                    }
                  },
                  css: function (e, t, n, i) {
                    var r,
                      o,
                      s,
                      a = d.camelCase(t);
                    return (
                      (t = d.cssProps[a] || (d.cssProps[a] = Me(e.style, a))),
                      (s = d.cssHooks[t] || d.cssHooks[a]) &&
                        "get" in s &&
                        (r = s.get(e, !0, n)),
                      void 0 === r && (r = xe(e, t, i)),
                      "normal" === r && t in Te && (r = Te[t]),
                      "" === n || n
                        ? ((o = parseFloat(r)),
                          !0 === n || d.isNumeric(o) ? o || 0 : r)
                        : r
                    );
                  },
                }),
                  d.each(["height", "width"], function (e, t) {
                    d.cssHooks[t] = {
                      get: function (e, n, i) {
                        if (n)
                          return Ce.test(d.css(e, "display")) &&
                            0 === e.offsetWidth
                            ? d.swap(e, Fe, function () {
                                return Oe(e, t, i);
                              })
                            : Oe(e, t, i);
                      },
                      set: function (e, n, i) {
                        var r = i && we(e);
                        return Se(
                          0,
                          n,
                          i
                            ? je(
                                e,
                                t,
                                i,
                                "border-box" === d.css(e, "boxSizing", !1, r),
                                r
                              )
                            : 0
                        );
                      },
                    };
                  }),
                  (d.cssHooks.marginRight = _e(
                    h.reliableMarginRight,
                    function (e, t) {
                      if (t)
                        return d.swap(
                          e,
                          {
                            display: "inline-block",
                          },
                          xe,
                          [e, "marginRight"]
                        );
                    }
                  )),
                  d.each(
                    {
                      margin: "",
                      padding: "",
                      border: "Width",
                    },
                    function (e, t) {
                      (d.cssHooks[e + t] = {
                        expand: function (n) {
                          for (
                            var i = 0,
                              r = {},
                              o = "string" == typeof n ? n.split(" ") : [n];
                            i < 4;
                            i++
                          )
                            r[e + $[i] + t] = o[i] || o[i - 2] || o[0];
                          return r;
                        },
                      }),
                        ye.test(e) || (d.cssHooks[e + t].set = Se);
                    }
                  ),
                  d.fn.extend({
                    css: function (e, t) {
                      return D(
                        this,
                        function (e, t, n) {
                          var i,
                            r,
                            o = {},
                            s = 0;
                          if (d.isArray(t)) {
                            for (i = we(e), r = t.length; s < r; s++)
                              o[t[s]] = d.css(e, t[s], !1, i);
                            return o;
                          }
                          return void 0 !== n ? d.style(e, t, n) : d.css(e, t);
                        },
                        e,
                        t,
                        arguments.length > 1
                      );
                    },
                    show: function () {
                      return De(this, !0);
                    },
                    hide: function () {
                      return De(this);
                    },
                    toggle: function (e) {
                      return "boolean" == typeof e
                        ? e
                          ? this.show()
                          : this.hide()
                        : this.each(function () {
                            P(this) ? d(this).show() : d(this).hide();
                          });
                    },
                  }),
                  (d.Tween = Ne),
                  (Ne.prototype = {
                    constructor: Ne,
                    init: function (e, t, n, i, r, o) {
                      (this.elem = e),
                        (this.prop = n),
                        (this.easing = r || "swing"),
                        (this.options = t),
                        (this.start = this.now = this.cur()),
                        (this.end = i),
                        (this.unit = o || (d.cssNumber[n] ? "" : "px"));
                    },
                    cur: function () {
                      var e = Ne.propHooks[this.prop];
                      return e && e.get
                        ? e.get(this)
                        : Ne.propHooks._default.get(this);
                    },
                    run: function (e) {
                      var t,
                        n = Ne.propHooks[this.prop];
                      return (
                        this.options.duration
                          ? (this.pos = t =
                              d.easing[this.easing](
                                e,
                                this.options.duration * e,
                                0,
                                1,
                                this.options.duration
                              ))
                          : (this.pos = t = e),
                        (this.now = (this.end - this.start) * t + this.start),
                        this.options.step &&
                          this.options.step.call(this.elem, this.now, this),
                        n && n.set
                          ? n.set(this)
                          : Ne.propHooks._default.set(this),
                        this
                      );
                    },
                  }),
                  (Ne.prototype.init.prototype = Ne.prototype),
                  (Ne.propHooks = {
                    _default: {
                      get: function (e) {
                        var t;
                        return null == e.elem[e.prop] ||
                          (e.elem.style && null != e.elem.style[e.prop])
                          ? (t = d.css(e.elem, e.prop, "")) && "auto" !== t
                            ? t
                            : 0
                          : e.elem[e.prop];
                      },
                      set: function (e) {
                        d.fx.step[e.prop]
                          ? d.fx.step[e.prop](e)
                          : e.elem.style &&
                            (null != e.elem.style[d.cssProps[e.prop]] ||
                              d.cssHooks[e.prop])
                          ? d.style(e.elem, e.prop, e.now + e.unit)
                          : (e.elem[e.prop] = e.now);
                      },
                    },
                  }),
                  (Ne.propHooks.scrollTop = Ne.propHooks.scrollLeft =
                    {
                      set: function (e) {
                        e.elem.nodeType &&
                          e.elem.parentNode &&
                          (e.elem[e.prop] = e.now);
                      },
                    }),
                  (d.easing = {
                    linear: function (e) {
                      return e;
                    },
                    swing: function (e) {
                      return 0.5 - Math.cos(e * Math.PI) / 2;
                    },
                  }),
                  (d.fx = Ne.prototype.init),
                  (d.fx.step = {});
                var Ve,
                  Re,
                  Ie = /^(?:toggle|show|hide)$/,
                  Le = new RegExp("^(?:([+-])=|)(" + z + ")([a-z%]*)$", "i"),
                  qe = /queueHooks$/,
                  Be = [
                    function (e, t, n) {
                      var i,
                        r,
                        o,
                        s,
                        a,
                        u,
                        c,
                        l = this,
                        h = {},
                        f = e.style,
                        p = e.nodeType && P(e),
                        g = V.get(e, "fxshow");
                      n.queue ||
                        (null == (a = d._queueHooks(e, "fx")).unqueued &&
                          ((a.unqueued = 0),
                          (u = a.empty.fire),
                          (a.empty.fire = function () {
                            a.unqueued || u();
                          })),
                        a.unqueued++,
                        l.always(function () {
                          l.always(function () {
                            a.unqueued--,
                              d.queue(e, "fx").length || a.empty.fire();
                          });
                        }));
                      1 === e.nodeType &&
                        ("height" in t || "width" in t) &&
                        ((n.overflow = [f.overflow, f.overflowX, f.overflowY]),
                        (c = d.css(e, "display")),
                        "inline" ===
                          ("none" === c
                            ? V.get(e, "olddisplay") || me(e.nodeName)
                            : c) &&
                          "none" === d.css(e, "float") &&
                          (f.display = "inline-block"));
                      n.overflow &&
                        ((f.overflow = "hidden"),
                        l.always(function () {
                          (f.overflow = n.overflow[0]),
                            (f.overflowX = n.overflow[1]),
                            (f.overflowY = n.overflow[2]);
                        }));
                      for (i in t)
                        if (((r = t[i]), Ie.exec(r))) {
                          if (
                            (delete t[i],
                            (o = o || "toggle" === r),
                            r === (p ? "hide" : "show"))
                          ) {
                            if ("show" !== r || !g || void 0 === g[i]) continue;
                            p = !0;
                          }
                          h[i] = (g && g[i]) || d.style(e, i);
                        } else c = void 0;
                      if (d.isEmptyObject(h))
                        "inline" === ("none" === c ? me(e.nodeName) : c) &&
                          (f.display = c);
                      else
                        for (i in (g
                          ? "hidden" in g && (p = g.hidden)
                          : (g = V.access(e, "fxshow", {})),
                        o && (g.hidden = !p),
                        p
                          ? d(e).show()
                          : l.done(function () {
                              d(e).hide();
                            }),
                        l.done(function () {
                          var t;
                          for (t in (V.remove(e, "fxshow"), h))
                            d.style(e, t, h[t]);
                        }),
                        h))
                          (s = Pe(p ? g[i] : 0, i, l)),
                            i in g ||
                              ((g[i] = s.start),
                              p &&
                                ((s.end = s.start),
                                (s.start =
                                  "width" === i || "height" === i ? 1 : 0)));
                    },
                  ],
                  He = {
                    "*": [
                      function (e, t) {
                        var n = this.createTween(e, t),
                          i = n.cur(),
                          r = Le.exec(t),
                          o = (r && r[3]) || (d.cssNumber[e] ? "" : "px"),
                          s =
                            (d.cssNumber[e] || ("px" !== o && +i)) &&
                            Le.exec(d.css(n.elem, e)),
                          a = 1,
                          u = 20;
                        if (s && s[3] !== o) {
                          (o = o || s[3]), (r = r || []), (s = +i || 1);
                          do {
                            (s /= a = a || ".5"), d.style(n.elem, e, s + o);
                          } while (a !== (a = n.cur() / i) && 1 !== a && --u);
                        }
                        return (
                          r &&
                            ((s = n.start = +s || +i || 0),
                            (n.unit = o),
                            (n.end = r[1] ? s + (r[1] + 1) * r[2] : +r[2])),
                          n
                        );
                      },
                    ],
                  };

                function ze() {
                  return (
                    setTimeout(function () {
                      Ve = void 0;
                    }),
                    (Ve = d.now())
                  );
                }

                function $e(e, t) {
                  var n,
                    i = 0,
                    r = {
                      height: e,
                    };
                  for (t = t ? 1 : 0; i < 4; i += 2 - t)
                    r["margin" + (n = $[i])] = r["padding" + n] = e;
                  return t && (r.opacity = r.width = e), r;
                }

                function Pe(e, t, n) {
                  for (
                    var i,
                      r = (He[t] || []).concat(He["*"]),
                      o = 0,
                      s = r.length;
                    o < s;
                    o++
                  )
                    if ((i = r[o].call(n, t, e))) return i;
                }

                function Ue(e, t, n) {
                  var i,
                    r,
                    o = 0,
                    s = Be.length,
                    a = d.Deferred().always(function () {
                      delete u.elem;
                    }),
                    u = function () {
                      if (r) return !1;
                      for (
                        var t = Ve || ze(),
                          n = Math.max(0, c.startTime + c.duration - t),
                          i = 1 - (n / c.duration || 0),
                          o = 0,
                          s = c.tweens.length;
                        o < s;
                        o++
                      )
                        c.tweens[o].run(i);
                      return (
                        a.notifyWith(e, [c, i, n]),
                        i < 1 && s ? n : (a.resolveWith(e, [c]), !1)
                      );
                    },
                    c = a.promise({
                      elem: e,
                      props: d.extend({}, t),
                      opts: d.extend(
                        !0,
                        {
                          specialEasing: {},
                        },
                        n
                      ),
                      originalProperties: t,
                      originalOptions: n,
                      startTime: Ve || ze(),
                      duration: n.duration,
                      tweens: [],
                      createTween: function (t, n) {
                        var i = d.Tween(
                          e,
                          c.opts,
                          t,
                          n,
                          c.opts.specialEasing[t] || c.opts.easing
                        );
                        return c.tweens.push(i), i;
                      },
                      stop: function (t) {
                        var n = 0,
                          i = t ? c.tweens.length : 0;
                        if (r) return this;
                        for (r = !0; n < i; n++) c.tweens[n].run(1);
                        return (
                          t
                            ? a.resolveWith(e, [c, t])
                            : a.rejectWith(e, [c, t]),
                          this
                        );
                      },
                    }),
                    l = c.props;
                  for (
                    !(function (e, t) {
                      var n, i, r, o, s;
                      for (n in e)
                        if (
                          ((r = t[(i = d.camelCase(n))]),
                          (o = e[n]),
                          d.isArray(o) && ((r = o[1]), (o = e[n] = o[0])),
                          n !== i && ((e[i] = o), delete e[n]),
                          (s = d.cssHooks[i]) && ("expand" in s))
                        )
                          for (n in ((o = s.expand(o)), delete e[i], o))
                            (n in e) || ((e[n] = o[n]), (t[n] = r));
                        else t[i] = r;
                    })(l, c.opts.specialEasing);
                    o < s;
                    o++
                  )
                    if ((i = Be[o].call(c, e, l, c.opts))) return i;
                  return (
                    d.map(l, Pe, c),
                    d.isFunction(c.opts.start) && c.opts.start.call(e, c),
                    d.fx.timer(
                      d.extend(u, {
                        elem: e,
                        anim: c,
                        queue: c.opts.queue,
                      })
                    ),
                    c
                      .progress(c.opts.progress)
                      .done(c.opts.done, c.opts.complete)
                      .fail(c.opts.fail)
                      .always(c.opts.always)
                  );
                }
                (d.Animation = d.extend(Ue, {
                  tweener: function (e, t) {
                    d.isFunction(e)
                      ? ((t = e), (e = ["*"]))
                      : (e = e.split(" "));
                    for (var n, i = 0, r = e.length; i < r; i++)
                      (n = e[i]), (He[n] = He[n] || []), He[n].unshift(t);
                  },
                  prefilter: function (e, t) {
                    t ? Be.unshift(e) : Be.push(e);
                  },
                })),
                  (d.speed = function (e, t, n) {
                    var i =
                      e && "object" == typeof e
                        ? d.extend({}, e)
                        : {
                            complete: n || (!n && t) || (d.isFunction(e) && e),
                            duration: e,
                            easing: (n && t) || (t && !d.isFunction(t) && t),
                          };
                    return (
                      (i.duration = d.fx.off
                        ? 0
                        : "number" == typeof i.duration
                        ? i.duration
                        : i.duration in d.fx.speeds
                        ? d.fx.speeds[i.duration]
                        : d.fx.speeds._default),
                      (null != i.queue && !0 !== i.queue) || (i.queue = "fx"),
                      (i.old = i.complete),
                      (i.complete = function () {
                        d.isFunction(i.old) && i.old.call(this),
                          i.queue && d.dequeue(this, i.queue);
                      }),
                      i
                    );
                  }),
                  d.fn.extend({
                    fadeTo: function (e, t, n, i) {
                      return this.filter(P)
                        .css("opacity", 0)
                        .show()
                        .end()
                        .animate(
                          {
                            opacity: t,
                          },
                          e,
                          n,
                          i
                        );
                    },
                    animate: function (e, t, n, i) {
                      var r = d.isEmptyObject(e),
                        o = d.speed(t, n, i),
                        s = function () {
                          var t = Ue(this, d.extend({}, e), o);
                          (r || V.get(this, "finish")) && t.stop(!0);
                        };
                      return (
                        (s.finish = s),
                        r || !1 === o.queue
                          ? this.each(s)
                          : this.queue(o.queue, s)
                      );
                    },
                    stop: function (e, t, n) {
                      var i = function (e) {
                        var t = e.stop;
                        delete e.stop, t(n);
                      };
                      return (
                        "string" != typeof e &&
                          ((n = t), (t = e), (e = void 0)),
                        t && !1 !== e && this.queue(e || "fx", []),
                        this.each(function () {
                          var t = !0,
                            r = null != e && e + "queueHooks",
                            o = d.timers,
                            s = V.get(this);
                          if (r) s[r] && s[r].stop && i(s[r]);
                          else
                            for (r in s)
                              s[r] && s[r].stop && qe.test(r) && i(s[r]);
                          for (r = o.length; r--; )
                            o[r].elem !== this ||
                              (null != e && o[r].queue !== e) ||
                              (o[r].anim.stop(n), (t = !1), o.splice(r, 1));
                          (!t && n) || d.dequeue(this, e);
                        })
                      );
                    },
                    finish: function (e) {
                      return (
                        !1 !== e && (e = e || "fx"),
                        this.each(function () {
                          var t,
                            n = V.get(this),
                            i = n[e + "queue"],
                            r = n[e + "queueHooks"],
                            o = d.timers,
                            s = i ? i.length : 0;
                          for (
                            n.finish = !0,
                              d.queue(this, e, []),
                              r && r.stop && r.stop.call(this, !0),
                              t = o.length;
                            t--;

                          )
                            o[t].elem === this &&
                              o[t].queue === e &&
                              (o[t].anim.stop(!0), o.splice(t, 1));
                          for (t = 0; t < s; t++)
                            i[t] && i[t].finish && i[t].finish.call(this);
                          delete n.finish;
                        })
                      );
                    },
                  }),
                  d.each(["toggle", "show", "hide"], function (e, t) {
                    var n = d.fn[t];
                    d.fn[t] = function (e, i, r) {
                      return null == e || "boolean" == typeof e
                        ? n.apply(this, arguments)
                        : this.animate($e(t, !0), e, i, r);
                    };
                  }),
                  d.each(
                    {
                      slideDown: $e("show"),
                      slideUp: $e("hide"),
                      slideToggle: $e("toggle"),
                      fadeIn: {
                        opacity: "show",
                      },
                      fadeOut: {
                        opacity: "hide",
                      },
                      fadeToggle: {
                        opacity: "toggle",
                      },
                    },
                    function (e, t) {
                      d.fn[e] = function (e, n, i) {
                        return this.animate(t, e, n, i);
                      };
                    }
                  ),
                  (d.timers = []),
                  (d.fx.tick = function () {
                    var e,
                      t = 0,
                      n = d.timers;
                    for (Ve = d.now(); t < n.length; t++)
                      (e = n[t])() || n[t] !== e || n.splice(t--, 1);
                    n.length || d.fx.stop(), (Ve = void 0);
                  }),
                  (d.fx.timer = function (e) {
                    d.timers.push(e), e() ? d.fx.start() : d.timers.pop();
                  }),
                  (d.fx.interval = 13),
                  (d.fx.start = function () {
                    Re || (Re = setInterval(d.fx.tick, d.fx.interval));
                  }),
                  (d.fx.stop = function () {
                    clearInterval(Re), (Re = null);
                  }),
                  (d.fx.speeds = {
                    slow: 600,
                    fast: 200,
                    _default: 400,
                  }),
                  (d.fn.delay = function (e, t) {
                    return (
                      (e = (d.fx && d.fx.speeds[e]) || e),
                      (t = t || "fx"),
                      this.queue(t, function (t, n) {
                        var i = setTimeout(t, e);
                        n.stop = function () {
                          clearTimeout(i);
                        };
                      })
                    );
                  }),
                  (function () {
                    var e = f.createElement("input"),
                      t = f.createElement("select"),
                      n = t.appendChild(f.createElement("option"));
                    (e.type = "checkbox"),
                      (h.checkOn = "" !== e.value),
                      (h.optSelected = n.selected),
                      (t.disabled = !0),
                      (h.optDisabled = !n.disabled),
                      ((e = f.createElement("input")).value = "t"),
                      (e.type = "radio"),
                      (h.radioValue = "t" === e.value);
                  })();
                var We,
                  Xe = d.expr.attrHandle;
                d.fn.extend({
                  attr: function (e, t) {
                    return D(this, d.attr, e, t, arguments.length > 1);
                  },
                  removeAttr: function (e) {
                    return this.each(function () {
                      d.removeAttr(this, e);
                    });
                  },
                }),
                  d.extend({
                    attr: function (e, t, n) {
                      var i,
                        r,
                        o = e.nodeType;
                      if (e && 3 !== o && 8 !== o && 2 !== o)
                        return void 0 === e.getAttribute
                          ? d.prop(e, t, n)
                          : ((1 === o && d.isXMLDoc(e)) ||
                              ((t = t.toLowerCase()),
                              (i =
                                d.attrHooks[t] ||
                                (d.expr.match.bool.test(t) ? We : void 0))),
                            void 0 === n
                              ? i && "get" in i && null !== (r = i.get(e, t))
                                ? r
                                : null == (r = d.find.attr(e, t))
                                ? void 0
                                : r
                              : null !== n
                              ? i &&
                                "set" in i &&
                                void 0 !== (r = i.set(e, n, t))
                                ? r
                                : (e.setAttribute(t, n + ""), n)
                              : void d.removeAttr(e, t));
                    },
                    removeAttr: function (e, t) {
                      var n,
                        i,
                        r = 0,
                        o = t && t.match(S);
                      if (o && 1 === e.nodeType)
                        for (; (n = o[r++]); )
                          (i = d.propFix[n] || n),
                            d.expr.match.bool.test(n) && (e[i] = !1),
                            e.removeAttribute(n);
                    },
                    attrHooks: {
                      type: {
                        set: function (e, t) {
                          if (
                            !h.radioValue &&
                            "radio" === t &&
                            d.nodeName(e, "input")
                          ) {
                            var n = e.value;
                            return (
                              e.setAttribute("type", t), n && (e.value = n), t
                            );
                          }
                        },
                      },
                    },
                  }),
                  (We = {
                    set: function (e, t, n) {
                      return (
                        !1 === t ? d.removeAttr(e, n) : e.setAttribute(n, n), n
                      );
                    },
                  }),
                  d.each(
                    d.expr.match.bool.source.match(/\w+/g),
                    function (e, t) {
                      var n = Xe[t] || d.find.attr;
                      Xe[t] = function (e, t, i) {
                        var r, o;
                        return (
                          i ||
                            ((o = Xe[t]),
                            (Xe[t] = r),
                            (r = null != n(e, t, i) ? t.toLowerCase() : null),
                            (Xe[t] = o)),
                          r
                        );
                      };
                    }
                  );
                var Je = /^(?:input|select|textarea|button)$/i;
                d.fn.extend({
                  prop: function (e, t) {
                    return D(this, d.prop, e, t, arguments.length > 1);
                  },
                  removeProp: function (e) {
                    return this.each(function () {
                      delete this[d.propFix[e] || e];
                    });
                  },
                }),
                  d.extend({
                    propFix: {
                      for: "htmlFor",
                      class: "className",
                    },
                    prop: function (e, t, n) {
                      var i,
                        r,
                        o = e.nodeType;
                      if (e && 3 !== o && 8 !== o && 2 !== o)
                        return (
                          (1 !== o || !d.isXMLDoc(e)) &&
                            ((t = d.propFix[t] || t), (r = d.propHooks[t])),
                          void 0 !== n
                            ? r && "set" in r && void 0 !== (i = r.set(e, n, t))
                              ? i
                              : (e[t] = n)
                            : r && "get" in r && null !== (i = r.get(e, t))
                            ? i
                            : e[t]
                        );
                    },
                    propHooks: {
                      tabIndex: {
                        get: function (e) {
                          return e.hasAttribute("tabindex") ||
                            Je.test(e.nodeName) ||
                            e.href
                            ? e.tabIndex
                            : -1;
                        },
                      },
                    },
                  }),
                  h.optSelected ||
                    (d.propHooks.selected = {
                      get: function (e) {
                        var t = e.parentNode;
                        return (
                          t && t.parentNode && t.parentNode.selectedIndex, null
                        );
                      },
                    }),
                  d.each(
                    [
                      "tabIndex",
                      "readOnly",
                      "maxLength",
                      "cellSpacing",
                      "cellPadding",
                      "rowSpan",
                      "colSpan",
                      "useMap",
                      "frameBorder",
                      "contentEditable",
                    ],
                    function () {
                      d.propFix[this.toLowerCase()] = this;
                    }
                  );
                var Ke = /[\t\r\n\f]/g;
                d.fn.extend({
                  addClass: function (e) {
                    var t,
                      n,
                      i,
                      r,
                      o,
                      s,
                      a = "string" == typeof e && e,
                      u = 0,
                      c = this.length;
                    if (d.isFunction(e))
                      return this.each(function (t) {
                        d(this).addClass(e.call(this, t, this.className));
                      });
                    if (a)
                      for (t = (e || "").match(S) || []; u < c; u++)
                        if (
                          (i =
                            1 === (n = this[u]).nodeType &&
                            (n.className
                              ? (" " + n.className + " ").replace(Ke, " ")
                              : " "))
                        ) {
                          for (o = 0; (r = t[o++]); )
                            i.indexOf(" " + r + " ") < 0 && (i += r + " ");
                          (s = d.trim(i)),
                            n.className !== s && (n.className = s);
                        }
                    return this;
                  },
                  removeClass: function (e) {
                    var t,
                      n,
                      i,
                      r,
                      o,
                      s,
                      a = 0 === arguments.length || ("string" == typeof e && e),
                      u = 0,
                      c = this.length;
                    if (d.isFunction(e))
                      return this.each(function (t) {
                        d(this).removeClass(e.call(this, t, this.className));
                      });
                    if (a)
                      for (t = (e || "").match(S) || []; u < c; u++)
                        if (
                          (i =
                            1 === (n = this[u]).nodeType &&
                            (n.className
                              ? (" " + n.className + " ").replace(Ke, " ")
                              : ""))
                        ) {
                          for (o = 0; (r = t[o++]); )
                            for (; i.indexOf(" " + r + " ") >= 0; )
                              i = i.replace(" " + r + " ", " ");
                          (s = e ? d.trim(i) : ""),
                            n.className !== s && (n.className = s);
                        }
                    return this;
                  },
                  toggleClass: function (e, t) {
                    var n = typeof e;
                    return "boolean" == typeof t && "string" === n
                      ? t
                        ? this.addClass(e)
                        : this.removeClass(e)
                      : d.isFunction(e)
                      ? this.each(function (n) {
                          d(this).toggleClass(
                            e.call(this, n, this.className, t),
                            t
                          );
                        })
                      : this.each(function () {
                          if ("string" === n)
                            for (
                              var t, i = 0, r = d(this), o = e.match(S) || [];
                              (t = o[i++]);

                            )
                              r.hasClass(t) ? r.removeClass(t) : r.addClass(t);
                          else
                            ("undefined" !== n && "boolean" !== n) ||
                              (this.className &&
                                V.set(this, "__className__", this.className),
                              (this.className =
                                this.className || !1 === e
                                  ? ""
                                  : V.get(this, "__className__") || ""));
                        });
                  },
                  hasClass: function (e) {
                    for (
                      var t = " " + e + " ", n = 0, i = this.length;
                      n < i;
                      n++
                    )
                      if (
                        1 === this[n].nodeType &&
                        (" " + this[n].className + " ")
                          .replace(Ke, " ")
                          .indexOf(t) >= 0
                      )
                        return !0;
                    return !1;
                  },
                });
                var Ge = /\r/g;
                d.fn.extend({
                  val: function (e) {
                    var t,
                      n,
                      i,
                      r = this[0];
                    return arguments.length
                      ? ((i = d.isFunction(e)),
                        this.each(function (n) {
                          var r;
                          1 === this.nodeType &&
                            (null ==
                            (r = i ? e.call(this, n, d(this).val()) : e)
                              ? (r = "")
                              : "number" == typeof r
                              ? (r += "")
                              : d.isArray(r) &&
                                (r = d.map(r, function (e) {
                                  return null == e ? "" : e + "";
                                })),
                            ((t =
                              d.valHooks[this.type] ||
                              d.valHooks[this.nodeName.toLowerCase()]) &&
                              "set" in t &&
                              void 0 !== t.set(this, r, "value")) ||
                              (this.value = r));
                        }))
                      : r
                      ? (t =
                          d.valHooks[r.type] ||
                          d.valHooks[r.nodeName.toLowerCase()]) &&
                        "get" in t &&
                        void 0 !== (n = t.get(r, "value"))
                        ? n
                        : "string" == typeof (n = r.value)
                        ? n.replace(Ge, "")
                        : null == n
                        ? ""
                        : n
                      : void 0;
                  },
                }),
                  d.extend({
                    valHooks: {
                      option: {
                        get: function (e) {
                          var t = d.find.attr(e, "value");
                          return null != t ? t : d.trim(d.text(e));
                        },
                      },
                      select: {
                        get: function (e) {
                          for (
                            var t,
                              n,
                              i = e.options,
                              r = e.selectedIndex,
                              o = "select-one" === e.type || r < 0,
                              s = o ? null : [],
                              a = o ? r + 1 : i.length,
                              u = r < 0 ? a : o ? r : 0;
                            u < a;
                            u++
                          )
                            if (
                              ((n = i[u]).selected || u === r) &&
                              (h.optDisabled
                                ? !n.disabled
                                : null === n.getAttribute("disabled")) &&
                              (!n.parentNode.disabled ||
                                !d.nodeName(n.parentNode, "optgroup"))
                            ) {
                              if (((t = d(n).val()), o)) return t;
                              s.push(t);
                            }
                          return s;
                        },
                        set: function (e, t) {
                          for (
                            var n,
                              i,
                              r = e.options,
                              o = d.makeArray(t),
                              s = r.length;
                            s--;

                          )
                            ((i = r[s]).selected =
                              d.inArray(i.value, o) >= 0) && (n = !0);
                          return n || (e.selectedIndex = -1), o;
                        },
                      },
                    },
                  }),
                  d.each(["radio", "checkbox"], function () {
                    (d.valHooks[this] = {
                      set: function (e, t) {
                        if (d.isArray(t))
                          return (e.checked = d.inArray(d(e).val(), t) >= 0);
                      },
                    }),
                      h.checkOn ||
                        (d.valHooks[this].get = function (e) {
                          return null === e.getAttribute("value")
                            ? "on"
                            : e.value;
                        });
                  }),
                  d.each(
                    "blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(
                      " "
                    ),
                    function (e, t) {
                      d.fn[t] = function (e, n) {
                        return arguments.length > 0
                          ? this.on(t, null, e, n)
                          : this.trigger(t);
                      };
                    }
                  ),
                  d.fn.extend({
                    hover: function (e, t) {
                      return this.mouseenter(e).mouseleave(t || e);
                    },
                    bind: function (e, t, n) {
                      return this.on(e, null, t, n);
                    },
                    unbind: function (e, t) {
                      return this.off(e, null, t);
                    },
                    delegate: function (e, t, n, i) {
                      return this.on(t, e, n, i);
                    },
                    undelegate: function (e, t, n) {
                      return 1 === arguments.length
                        ? this.off(e, "**")
                        : this.off(t, e || "**", n);
                    },
                  });
                var Ye = d.now(),
                  Qe = /\?/;
                (d.parseJSON = function (e) {
                  return JSON.parse(e + "");
                }),
                  (d.parseXML = function (e) {
                    var t;
                    if (!e || "string" != typeof e) return null;
                    try {
                      t = new DOMParser().parseFromString(e, "text/xml");
                    } catch (e) {
                      t = void 0;
                    }
                    return (
                      (t && !t.getElementsByTagName("parsererror").length) ||
                        d.error("Invalid XML: " + e),
                      t
                    );
                  });
                var Ze = /#.*$/,
                  et = /([?&])_=[^&]*/,
                  tt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
                  nt = /^(?:GET|HEAD)$/,
                  it = /^\/\//,
                  rt =
                    /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
                  ot = {},
                  st = {},
                  at = "*/".concat("*"),
                  ut = e.location.href,
                  ct = rt.exec(ut.toLowerCase()) || [];

                function lt(e) {
                  return function (t, n) {
                    "string" != typeof t && ((n = t), (t = "*"));
                    var i,
                      r = 0,
                      o = t.toLowerCase().match(S) || [];
                    if (d.isFunction(n))
                      for (; (i = o[r++]); )
                        "+" === i[0]
                          ? ((i = i.slice(1) || "*"),
                            (e[i] = e[i] || []).unshift(n))
                          : (e[i] = e[i] || []).push(n);
                  };
                }

                function ht(e, t, n, i) {
                  var r = {},
                    o = e === st;

                  function s(a) {
                    var u;
                    return (
                      (r[a] = !0),
                      d.each(e[a] || [], function (e, a) {
                        var c = a(t, n, i);
                        return "string" != typeof c || o || r[c]
                          ? o
                            ? !(u = c)
                            : void 0
                          : (t.dataTypes.unshift(c), s(c), !1);
                      }),
                      u
                    );
                  }
                  return s(t.dataTypes[0]) || (!r["*"] && s("*"));
                }

                function ft(e, t) {
                  var n,
                    i,
                    r = d.ajaxSettings.flatOptions || {};
                  for (n in t)
                    void 0 !== t[n] && ((r[n] ? e : i || (i = {}))[n] = t[n]);
                  return i && d.extend(!0, e, i), e;
                }
                d.extend({
                  active: 0,
                  lastModified: {},
                  etag: {},
                  ajaxSettings: {
                    url: ut,
                    type: "GET",
                    isLocal:
                      /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
                        ct[1]
                      ),
                    global: !0,
                    processData: !0,
                    async: !0,
                    contentType:
                      "application/x-www-form-urlencoded; charset=UTF-8",
                    accepts: {
                      "*": at,
                      text: "text/plain",
                      html: "text/html",
                      xml: "application/xml, text/xml",
                      json: "application/json, text/javascript",
                    },
                    contents: {
                      xml: /xml/,
                      html: /html/,
                      json: /json/,
                    },
                    responseFields: {
                      xml: "responseXML",
                      text: "responseText",
                      json: "responseJSON",
                    },
                    converters: {
                      "* text": String,
                      "text html": !0,
                      "text json": d.parseJSON,
                      "text xml": d.parseXML,
                    },
                    flatOptions: {
                      url: !0,
                      context: !0,
                    },
                  },
                  ajaxSetup: function (e, t) {
                    return t
                      ? ft(ft(e, d.ajaxSettings), t)
                      : ft(d.ajaxSettings, e);
                  },
                  ajaxPrefilter: lt(ot),
                  ajaxTransport: lt(st),
                  ajax: function (e, t) {
                    "object" == typeof e && ((t = e), (e = void 0)),
                      (t = t || {});
                    var n,
                      i,
                      r,
                      o,
                      s,
                      a,
                      u,
                      c,
                      l = d.ajaxSetup({}, t),
                      h = l.context || l,
                      f =
                        l.context && (h.nodeType || h.jquery) ? d(h) : d.event,
                      p = d.Deferred(),
                      g = d.Callbacks("once memory"),
                      v = l.statusCode || {},
                      m = {},
                      y = {},
                      b = 0,
                      w = "canceled",
                      x = {
                        readyState: 0,
                        getResponseHeader: function (e) {
                          var t;
                          if (2 === b) {
                            if (!o)
                              for (o = {}; (t = tt.exec(r)); )
                                o[t[1].toLowerCase()] = t[2];
                            t = o[e.toLowerCase()];
                          }
                          return null == t ? null : t;
                        },
                        getAllResponseHeaders: function () {
                          return 2 === b ? r : null;
                        },
                        setRequestHeader: function (e, t) {
                          var n = e.toLowerCase();
                          return (
                            b || ((e = y[n] = y[n] || e), (m[e] = t)), this
                          );
                        },
                        overrideMimeType: function (e) {
                          return b || (l.mimeType = e), this;
                        },
                        statusCode: function (e) {
                          var t;
                          if (e)
                            if (b < 2) for (t in e) v[t] = [v[t], e[t]];
                            else x.always(e[x.status]);
                          return this;
                        },
                        abort: function (e) {
                          var t = e || w;
                          return n && n.abort(t), _(0, t), this;
                        },
                      };
                    if (
                      ((p.promise(x).complete = g.add),
                      (x.success = x.done),
                      (x.error = x.fail),
                      (l.url = ((e || l.url || ut) + "")
                        .replace(Ze, "")
                        .replace(it, ct[1] + "//")),
                      (l.type = t.method || t.type || l.method || l.type),
                      (l.dataTypes = d
                        .trim(l.dataType || "*")
                        .toLowerCase()
                        .match(S) || [""]),
                      null == l.crossDomain &&
                        ((a = rt.exec(l.url.toLowerCase())),
                        (l.crossDomain = !(
                          !a ||
                          (a[1] === ct[1] &&
                            a[2] === ct[2] &&
                            (a[3] || ("http:" === a[1] ? "80" : "443")) ===
                              (ct[3] || ("http:" === ct[1] ? "80" : "443")))
                        ))),
                      l.data &&
                        l.processData &&
                        "string" != typeof l.data &&
                        (l.data = d.param(l.data, l.traditional)),
                      ht(ot, l, t, x),
                      2 === b)
                    )
                      return x;
                    for (c in ((u = d.event && l.global) &&
                      0 == d.active++ &&
                      d.event.trigger("ajaxStart"),
                    (l.type = l.type.toUpperCase()),
                    (l.hasContent = !nt.test(l.type)),
                    (i = l.url),
                    l.hasContent ||
                      (l.data &&
                        ((i = l.url += (Qe.test(i) ? "&" : "?") + l.data),
                        delete l.data),
                      !1 === l.cache &&
                        (l.url = et.test(i)
                          ? i.replace(et, "$1_=" + Ye++)
                          : i + (Qe.test(i) ? "&" : "?") + "_=" + Ye++)),
                    l.ifModified &&
                      (d.lastModified[i] &&
                        x.setRequestHeader(
                          "If-Modified-Since",
                          d.lastModified[i]
                        ),
                      d.etag[i] &&
                        x.setRequestHeader("If-None-Match", d.etag[i])),
                    ((l.data && l.hasContent && !1 !== l.contentType) ||
                      t.contentType) &&
                      x.setRequestHeader("Content-Type", l.contentType),
                    x.setRequestHeader(
                      "Accept",
                      l.dataTypes[0] && l.accepts[l.dataTypes[0]]
                        ? l.accepts[l.dataTypes[0]] +
                            ("*" !== l.dataTypes[0]
                              ? ", " + at + "; q=0.01"
                              : "")
                        : l.accepts["*"]
                    ),
                    l.headers))
                      x.setRequestHeader(c, l.headers[c]);
                    if (
                      l.beforeSend &&
                      (!1 === l.beforeSend.call(h, x, l) || 2 === b)
                    )
                      return x.abort();
                    for (c in ((w = "abort"),
                    {
                      success: 1,
                      error: 1,
                      complete: 1,
                    }))
                      x[c](l[c]);
                    if ((n = ht(st, l, t, x))) {
                      (x.readyState = 1),
                        u && f.trigger("ajaxSend", [x, l]),
                        l.async &&
                          l.timeout > 0 &&
                          (s = setTimeout(function () {
                            x.abort("timeout");
                          }, l.timeout));
                      try {
                        (b = 1), n.send(m, _);
                      } catch (e) {
                        if (!(b < 2)) throw e;
                        _(-1, e);
                      }
                    } else _(-1, "No Transport");

                    function _(e, t, o, a) {
                      var c,
                        m,
                        y,
                        w,
                        _,
                        C = t;
                      2 !== b &&
                        ((b = 2),
                        s && clearTimeout(s),
                        (n = void 0),
                        (r = a || ""),
                        (x.readyState = e > 0 ? 4 : 0),
                        (c = (e >= 200 && e < 300) || 304 === e),
                        o &&
                          (w = (function (e, t, n) {
                            for (
                              var i, r, o, s, a = e.contents, u = e.dataTypes;
                              "*" === u[0];

                            )
                              u.shift(),
                                void 0 === i &&
                                  (i =
                                    e.mimeType ||
                                    t.getResponseHeader("Content-Type"));
                            if (i)
                              for (r in a)
                                if (a[r] && a[r].test(i)) {
                                  u.unshift(r);
                                  break;
                                }
                            if (u[0] in n) o = u[0];
                            else {
                              for (r in n) {
                                if (!u[0] || e.converters[r + " " + u[0]]) {
                                  o = r;
                                  break;
                                }
                                s || (s = r);
                              }
                              o = o || s;
                            }
                            if (o) return o !== u[0] && u.unshift(o), n[o];
                          })(l, x, o)),
                        (w = (function (e, t, n, i) {
                          var r,
                            o,
                            s,
                            a,
                            u,
                            c = {},
                            l = e.dataTypes.slice();
                          if (l[1])
                            for (s in e.converters)
                              c[s.toLowerCase()] = e.converters[s];
                          for (o = l.shift(); o; )
                            if (
                              (e.responseFields[o] &&
                                (n[e.responseFields[o]] = t),
                              !u &&
                                i &&
                                e.dataFilter &&
                                (t = e.dataFilter(t, e.dataType)),
                              (u = o),
                              (o = l.shift()))
                            )
                              if ("*" === o) o = u;
                              else if ("*" !== u && u !== o) {
                                if (!(s = c[u + " " + o] || c["* " + o]))
                                  for (r in c)
                                    if (
                                      (a = r.split(" "))[1] === o &&
                                      (s = c[u + " " + a[0]] || c["* " + a[0]])
                                    ) {
                                      !0 === s
                                        ? (s = c[r])
                                        : !0 !== c[r] &&
                                          ((o = a[0]), l.unshift(a[1]));
                                      break;
                                    }
                                if (!0 !== s)
                                  if (s && e.throws) t = s(t);
                                  else
                                    try {
                                      t = s(t);
                                    } catch (e) {
                                      return {
                                        state: "parsererror",
                                        error: s
                                          ? e
                                          : "No conversion from " +
                                            u +
                                            " to " +
                                            o,
                                      };
                                    }
                              }
                          return {
                            state: "success",
                            data: t,
                          };
                        })(l, w, x, c)),
                        c
                          ? (l.ifModified &&
                              ((_ = x.getResponseHeader("Last-Modified")) &&
                                (d.lastModified[i] = _),
                              (_ = x.getResponseHeader("etag")) &&
                                (d.etag[i] = _)),
                            204 === e || "HEAD" === l.type
                              ? (C = "nocontent")
                              : 304 === e
                              ? (C = "notmodified")
                              : ((C = w.state),
                                (m = w.data),
                                (c = !(y = w.error))))
                          : ((y = C),
                            (!e && C) || ((C = "error"), e < 0 && (e = 0))),
                        (x.status = e),
                        (x.statusText = (t || C) + ""),
                        c
                          ? p.resolveWith(h, [m, C, x])
                          : p.rejectWith(h, [x, C, y]),
                        x.statusCode(v),
                        (v = void 0),
                        u &&
                          f.trigger(c ? "ajaxSuccess" : "ajaxError", [
                            x,
                            l,
                            c ? m : y,
                          ]),
                        g.fireWith(h, [x, C]),
                        u &&
                          (f.trigger("ajaxComplete", [x, l]),
                          --d.active || d.event.trigger("ajaxStop")));
                    }
                    return x;
                  },
                  getJSON: function (e, t, n) {
                    return d.get(e, t, n, "json");
                  },
                  getScript: function (e, t) {
                    return d.get(e, void 0, t, "script");
                  },
                }),
                  d.each(["get", "post"], function (e, t) {
                    d[t] = function (e, n, i, r) {
                      return (
                        d.isFunction(n) &&
                          ((r = r || i), (i = n), (n = void 0)),
                        d.ajax({
                          url: e,
                          type: t,
                          dataType: r,
                          data: n,
                          success: i,
                        })
                      );
                    };
                  }),
                  (d._evalUrl = function (e) {
                    return d.ajax({
                      url: e,
                      type: "GET",
                      dataType: "script",
                      async: !1,
                      global: !1,
                      throws: !0,
                    });
                  }),
                  d.fn.extend({
                    wrapAll: function (e) {
                      var t;
                      return d.isFunction(e)
                        ? this.each(function (t) {
                            d(this).wrapAll(e.call(this, t));
                          })
                        : (this[0] &&
                            ((t = d(e, this[0].ownerDocument).eq(0).clone(!0)),
                            this[0].parentNode && t.insertBefore(this[0]),
                            t
                              .map(function () {
                                for (var e = this; e.firstElementChild; )
                                  e = e.firstElementChild;
                                return e;
                              })
                              .append(this)),
                          this);
                    },
                    wrapInner: function (e) {
                      return d.isFunction(e)
                        ? this.each(function (t) {
                            d(this).wrapInner(e.call(this, t));
                          })
                        : this.each(function () {
                            var t = d(this),
                              n = t.contents();
                            n.length ? n.wrapAll(e) : t.append(e);
                          });
                    },
                    wrap: function (e) {
                      var t = d.isFunction(e);
                      return this.each(function (n) {
                        d(this).wrapAll(t ? e.call(this, n) : e);
                      });
                    },
                    unwrap: function () {
                      return this.parent()
                        .each(function () {
                          d.nodeName(this, "body") ||
                            d(this).replaceWith(this.childNodes);
                        })
                        .end();
                    },
                  }),
                  (d.expr.filters.hidden = function (e) {
                    return e.offsetWidth <= 0 && e.offsetHeight <= 0;
                  }),
                  (d.expr.filters.visible = function (e) {
                    return !d.expr.filters.hidden(e);
                  });
                var dt = /%20/g,
                  pt = /\[\]$/,
                  gt = /\r?\n/g,
                  vt = /^(?:submit|button|image|reset|file)$/i,
                  mt = /^(?:input|select|textarea|keygen)/i;

                function yt(e, t, n, i) {
                  var r;
                  if (d.isArray(t))
                    d.each(t, function (t, r) {
                      n || pt.test(e)
                        ? i(e, r)
                        : yt(
                            e + "[" + ("object" == typeof r ? t : "") + "]",
                            r,
                            n,
                            i
                          );
                    });
                  else if (n || "object" !== d.type(t)) i(e, t);
                  else for (r in t) yt(e + "[" + r + "]", t[r], n, i);
                }
                (d.param = function (e, t) {
                  var n,
                    i = [],
                    r = function (e, t) {
                      (t = d.isFunction(t) ? t() : null == t ? "" : t),
                        (i[i.length] =
                          encodeURIComponent(e) + "=" + encodeURIComponent(t));
                    };
                  if (
                    (void 0 === t &&
                      (t = d.ajaxSettings && d.ajaxSettings.traditional),
                    d.isArray(e) || (e.jquery && !d.isPlainObject(e)))
                  )
                    d.each(e, function () {
                      r(this.name, this.value);
                    });
                  else for (n in e) yt(n, e[n], t, r);
                  return i.join("&").replace(dt, "+");
                }),
                  d.fn.extend({
                    serialize: function () {
                      return d.param(this.serializeArray());
                    },
                    serializeArray: function () {
                      return this.map(function () {
                        var e = d.prop(this, "elements");
                        return e ? d.makeArray(e) : this;
                      })
                        .filter(function () {
                          var e = this.type;
                          return (
                            this.name &&
                            !d(this).is(":disabled") &&
                            mt.test(this.nodeName) &&
                            !vt.test(e) &&
                            (this.checked || !U.test(e))
                          );
                        })
                        .map(function (e, t) {
                          var n = d(this).val();
                          return null == n
                            ? null
                            : d.isArray(n)
                            ? d.map(n, function (e) {
                                return {
                                  name: t.name,
                                  value: e.replace(gt, "\r\n"),
                                };
                              })
                            : {
                                name: t.name,
                                value: n.replace(gt, "\r\n"),
                              };
                        })
                        .get();
                    },
                  }),
                  (d.ajaxSettings.xhr = function () {
                    try {
                      return new XMLHttpRequest();
                    } catch (e) {}
                  });
                var bt = 0,
                  wt = {},
                  xt = {
                    0: 200,
                    1223: 204,
                  },
                  _t = d.ajaxSettings.xhr();
                e.attachEvent &&
                  e.attachEvent("onunload", function () {
                    for (var e in wt) wt[e]();
                  }),
                  (h.cors = !!_t && "withCredentials" in _t),
                  (h.ajax = _t = !!_t),
                  d.ajaxTransport(function (e) {
                    var t;
                    if (h.cors || (_t && !e.crossDomain))
                      return {
                        send: function (n, i) {
                          var r,
                            o = e.xhr(),
                            s = ++bt;
                          if (
                            (o.open(
                              e.type,
                              e.url,
                              e.async,
                              e.username,
                              e.password
                            ),
                            e.xhrFields)
                          )
                            for (r in e.xhrFields) o[r] = e.xhrFields[r];
                          for (r in (e.mimeType &&
                            o.overrideMimeType &&
                            o.overrideMimeType(e.mimeType),
                          e.crossDomain ||
                            n["X-Requested-With"] ||
                            (n["X-Requested-With"] = "XMLHttpRequest"),
                          n))
                            o.setRequestHeader(r, n[r]);
                          (t = function (e) {
                            return function () {
                              t &&
                                (delete wt[s],
                                (t = o.onload = o.onerror = null),
                                "abort" === e
                                  ? o.abort()
                                  : "error" === e
                                  ? i(o.status, o.statusText)
                                  : i(
                                      xt[o.status] || o.status,
                                      o.statusText,
                                      "string" == typeof o.responseText
                                        ? {
                                            text: o.responseText,
                                          }
                                        : void 0,
                                      o.getAllResponseHeaders()
                                    ));
                            };
                          }),
                            (o.onload = t()),
                            (o.onerror = t("error")),
                            (t = wt[s] = t("abort"));
                          try {
                            o.send((e.hasContent && e.data) || null);
                          } catch (e) {
                            if (t) throw e;
                          }
                        },
                        abort: function () {
                          t && t();
                        },
                      };
                  }),
                  d.ajaxSetup({
                    accepts: {
                      script:
                        "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
                    },
                    contents: {
                      script: /(?:java|ecma)script/,
                    },
                    converters: {
                      "text script": function (e) {
                        return d.globalEval(e), e;
                      },
                    },
                  }),
                  d.ajaxPrefilter("script", function (e) {
                    void 0 === e.cache && (e.cache = !1),
                      e.crossDomain && (e.type = "GET");
                  }),
                  d.ajaxTransport("script", function (e) {
                    var t, n;
                    if (e.crossDomain)
                      return {
                        send: function (i, r) {
                          (t = d("<script>")
                            .prop({
                              async: !0,
                              charset: e.scriptCharset,
                              src: e.url,
                            })
                            .on(
                              "load error",
                              (n = function (e) {
                                t.remove(),
                                  (n = null),
                                  e &&
                                    r("error" === e.type ? 404 : 200, e.type);
                              })
                            )),
                            f.head.appendChild(t[0]);
                        },
                        abort: function () {
                          n && n();
                        },
                      };
                  });
                var Ct = [],
                  kt = /(=)\?(?=&|$)|\?\?/;
                d.ajaxSetup({
                  jsonp: "callback",
                  jsonpCallback: function () {
                    var e = Ct.pop() || d.expando + "_" + Ye++;
                    return (this[e] = !0), e;
                  },
                }),
                  d.ajaxPrefilter("json jsonp", function (t, n, i) {
                    var r,
                      o,
                      s,
                      a =
                        !1 !== t.jsonp &&
                        (kt.test(t.url)
                          ? "url"
                          : "string" == typeof t.data &&
                            !(t.contentType || "").indexOf(
                              "application/x-www-form-urlencoded"
                            ) &&
                            kt.test(t.data) &&
                            "data");
                    if (a || "jsonp" === t.dataTypes[0])
                      return (
                        (r = t.jsonpCallback =
                          d.isFunction(t.jsonpCallback)
                            ? t.jsonpCallback()
                            : t.jsonpCallback),
                        a
                          ? (t[a] = t[a].replace(kt, "$1" + r))
                          : !1 !== t.jsonp &&
                            (t.url +=
                              (Qe.test(t.url) ? "&" : "?") + t.jsonp + "=" + r),
                        (t.converters["script json"] = function () {
                          return s || d.error(r + " was not called"), s[0];
                        }),
                        (t.dataTypes[0] = "json"),
                        (o = e[r]),
                        (e[r] = function () {
                          s = arguments;
                        }),
                        i.always(function () {
                          (e[r] = o),
                            t[r] &&
                              ((t.jsonpCallback = n.jsonpCallback), Ct.push(r)),
                            s && d.isFunction(o) && o(s[0]),
                            (s = o = void 0);
                        }),
                        "script"
                      );
                  }),
                  (d.parseHTML = function (e, t, n) {
                    if (!e || "string" != typeof e) return null;
                    "boolean" == typeof t && ((n = t), (t = !1)), (t = t || f);
                    var i = x.exec(e),
                      r = !n && [];
                    return i
                      ? [t.createElement(i[1])]
                      : ((i = d.buildFragment([e], t, r)),
                        r && r.length && d(r).remove(),
                        d.merge([], i.childNodes));
                  });
                var Et = d.fn.load;
                (d.fn.load = function (e, t, n) {
                  if ("string" != typeof e && Et)
                    return Et.apply(this, arguments);
                  var i,
                    r,
                    o,
                    s = this,
                    a = e.indexOf(" ");
                  return (
                    a >= 0 && ((i = d.trim(e.slice(a))), (e = e.slice(0, a))),
                    d.isFunction(t)
                      ? ((n = t), (t = void 0))
                      : t && "object" == typeof t && (r = "POST"),
                    s.length > 0 &&
                      d
                        .ajax({
                          url: e,
                          type: r,
                          dataType: "html",
                          data: t,
                        })
                        .done(function (e) {
                          (o = arguments),
                            s.html(
                              i ? d("<div>").append(d.parseHTML(e)).find(i) : e
                            );
                        })
                        .complete(
                          n &&
                            function (e, t) {
                              s.each(n, o || [e.responseText, t, e]);
                            }
                        ),
                    this
                  );
                }),
                  d.each(
                    [
                      "ajaxStart",
                      "ajaxStop",
                      "ajaxComplete",
                      "ajaxError",
                      "ajaxSuccess",
                      "ajaxSend",
                    ],
                    function (e, t) {
                      d.fn[t] = function (e) {
                        return this.on(t, e);
                      };
                    }
                  ),
                  (d.expr.filters.animated = function (e) {
                    return d.grep(d.timers, function (t) {
                      return e === t.elem;
                    }).length;
                  });
                var Ft = e.document.documentElement;

                function Tt(e) {
                  return d.isWindow(e) ? e : 9 === e.nodeType && e.defaultView;
                }
                (d.offset = {
                  setOffset: function (e, t, n) {
                    var i,
                      r,
                      o,
                      s,
                      a,
                      u,
                      c = d.css(e, "position"),
                      l = d(e),
                      h = {};
                    "static" === c && (e.style.position = "relative"),
                      (a = l.offset()),
                      (o = d.css(e, "top")),
                      (u = d.css(e, "left")),
                      ("absolute" === c || "fixed" === c) &&
                      (o + u).indexOf("auto") > -1
                        ? ((s = (i = l.position()).top), (r = i.left))
                        : ((s = parseFloat(o) || 0), (r = parseFloat(u) || 0)),
                      d.isFunction(t) && (t = t.call(e, n, a)),
                      null != t.top && (h.top = t.top - a.top + s),
                      null != t.left && (h.left = t.left - a.left + r),
                      "using" in t ? t.using.call(e, h) : l.css(h);
                  },
                }),
                  d.fn.extend({
                    offset: function (e) {
                      if (arguments.length)
                        return void 0 === e
                          ? this
                          : this.each(function (t) {
                              d.offset.setOffset(this, e, t);
                            });
                      var t,
                        n,
                        i = this[0],
                        r = {
                          top: 0,
                          left: 0,
                        },
                        o = i && i.ownerDocument;
                      return o
                        ? ((t = o.documentElement),
                          d.contains(t, i)
                            ? (void 0 !== i.getBoundingClientRect &&
                                (r = i.getBoundingClientRect()),
                              (n = Tt(o)),
                              {
                                top: r.top + n.pageYOffset - t.clientTop,
                                left: r.left + n.pageXOffset - t.clientLeft,
                              })
                            : r)
                        : void 0;
                    },
                    position: function () {
                      if (this[0]) {
                        var e,
                          t,
                          n = this[0],
                          i = {
                            top: 0,
                            left: 0,
                          };
                        return (
                          "fixed" === d.css(n, "position")
                            ? (t = n.getBoundingClientRect())
                            : ((e = this.offsetParent()),
                              (t = this.offset()),
                              d.nodeName(e[0], "html") || (i = e.offset()),
                              (i.top += d.css(e[0], "borderTopWidth", !0)),
                              (i.left += d.css(e[0], "borderLeftWidth", !0))),
                          {
                            top: t.top - i.top - d.css(n, "marginTop", !0),
                            left: t.left - i.left - d.css(n, "marginLeft", !0),
                          }
                        );
                      }
                    },
                    offsetParent: function () {
                      return this.map(function () {
                        for (
                          var e = this.offsetParent || Ft;
                          e &&
                          !d.nodeName(e, "html") &&
                          "static" === d.css(e, "position");

                        )
                          e = e.offsetParent;
                        return e || Ft;
                      });
                    },
                  }),
                  d.each(
                    {
                      scrollLeft: "pageXOffset",
                      scrollTop: "pageYOffset",
                    },
                    function (t, n) {
                      var i = "pageYOffset" === n;
                      d.fn[t] = function (r) {
                        return D(
                          this,
                          function (t, r, o) {
                            var s = Tt(t);
                            if (void 0 === o) return s ? s[n] : t[r];
                            s
                              ? s.scrollTo(
                                  i ? e.pageXOffset : o,
                                  i ? o : e.pageYOffset
                                )
                              : (t[r] = o);
                          },
                          t,
                          r,
                          arguments.length,
                          null
                        );
                      };
                    }
                  ),
                  d.each(["top", "left"], function (e, t) {
                    d.cssHooks[t] = _e(h.pixelPosition, function (e, n) {
                      if (n)
                        return (
                          (n = xe(e, t)),
                          be.test(n) ? d(e).position()[t] + "px" : n
                        );
                    });
                  }),
                  d.each(
                    {
                      Height: "height",
                      Width: "width",
                    },
                    function (e, t) {
                      d.each(
                        {
                          padding: "inner" + e,
                          content: t,
                          "": "outer" + e,
                        },
                        function (n, i) {
                          d.fn[i] = function (i, r) {
                            var o =
                                arguments.length &&
                                (n || "boolean" != typeof i),
                              s =
                                n ||
                                (!0 === i || !0 === r ? "margin" : "border");
                            return D(
                              this,
                              function (t, n, i) {
                                var r;
                                return d.isWindow(t)
                                  ? t.document.documentElement["client" + e]
                                  : 9 === t.nodeType
                                  ? ((r = t.documentElement),
                                    Math.max(
                                      t.body["scroll" + e],
                                      r["scroll" + e],
                                      t.body["offset" + e],
                                      r["offset" + e],
                                      r["client" + e]
                                    ))
                                  : void 0 === i
                                  ? d.css(t, n, s)
                                  : d.style(t, n, i, s);
                              },
                              t,
                              o ? i : void 0,
                              o,
                              null
                            );
                          };
                        }
                      );
                    }
                  ),
                  (d.fn.size = function () {
                    return this.length;
                  }),
                  (d.fn.andSelf = d.fn.addBack),
                  "function" == typeof i &&
                    i.amd &&
                    i("jquery", [], function () {
                      return d;
                    });
                var At = e.jQuery,
                  Mt = e.$;
                return (
                  (d.noConflict = function (t) {
                    return (
                      e.$ === d && (e.$ = Mt),
                      t && e.jQuery === d && (e.jQuery = At),
                      d
                    );
                  }),
                  void 0 === t && (e.jQuery = e.$ = d),
                  d
                );
              }),
              "object" == typeof e && "object" == typeof e.exports
                ? (e.exports = o.document
                    ? s(o, !0)
                    : function (e) {
                        if (!e.document)
                          throw new Error(
                            "jQuery requires a window with a document"
                          );
                        return s(e);
                      })
                : s(o),
              r("undefined" != typeof $ ? $ : window.$);
          }.call(e, void 0, void 0, void 0, void 0, function (e) {
            t.exports = e;
          }));
        }.call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        ));
      },
      {},
    ],
    20: [
      function (e, t, n) {
        !(function (e) {
          if ("function" == typeof define && define.amd) define(e);
          else if ("object" == typeof n) t.exports = e();
          else {
            var i = window.Cookies,
              r = (window.Cookies = e());
            r.noConflict = function () {
              return (window.Cookies = i), r;
            };
          }
        })(function () {
          function e() {
            for (var e = 0, t = {}; e < arguments.length; e++) {
              var n = arguments[e];
              for (var i in n) t[i] = n[i];
            }
            return t;
          }
          return (function t(n) {
            function i(t, r, o) {
              var s;
              if ("undefined" != typeof document) {
                if (arguments.length > 1) {
                  if (
                    "number" ==
                    typeof (o = e(
                      {
                        path: "/",
                      },
                      i.defaults,
                      o
                    )).expires
                  ) {
                    var a = new Date();
                    a.setMilliseconds(a.getMilliseconds() + 864e5 * o.expires),
                      (o.expires = a);
                  }
                  try {
                    (s = JSON.stringify(r)), /^[\{\[]/.test(s) && (r = s);
                  } catch (e) {}
                  return (
                    (r = n.write
                      ? n.write(r, t)
                      : encodeURIComponent(String(r)).replace(
                          /%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,
                          decodeURIComponent
                        )),
                    (t = (t = (t = encodeURIComponent(String(t))).replace(
                      /%(23|24|26|2B|5E|60|7C)/g,
                      decodeURIComponent
                    )).replace(/[\(\)]/g, escape)),
                    (document.cookie = [
                      t,
                      "=",
                      r,
                      o.expires && "; expires=" + o.expires.toUTCString(),
                      o.path && "; path=" + o.path,
                      o.domain && "; domain=" + o.domain,
                      o.secure ? "; secure" : "",
                    ].join(""))
                  );
                }
                t || (s = {});
                for (
                  var u = document.cookie ? document.cookie.split("; ") : [],
                    c = /(%[0-9A-Z]{2})+/g,
                    l = 0;
                  l < u.length;
                  l++
                ) {
                  var h = u[l].split("="),
                    f = h.slice(1).join("=");
                  '"' === f.charAt(0) && (f = f.slice(1, -1));
                  try {
                    var d = h[0].replace(c, decodeURIComponent);
                    if (
                      ((f = n.read
                        ? n.read(f, d)
                        : n(f, d) || f.replace(c, decodeURIComponent)),
                      this.json)
                    )
                      try {
                        f = JSON.parse(f);
                      } catch (e) {}
                    if (t === d) {
                      s = f;
                      break;
                    }
                    t || (s[d] = f);
                  } catch (e) {}
                }
                return s;
              }
            }
            return (
              (i.set = i),
              (i.get = function (e) {
                return i(e);
              }),
              (i.getJSON = function () {
                return i.apply(
                  {
                    json: !0,
                  },
                  [].slice.call(arguments)
                );
              }),
              (i.defaults = {}),
              (i.remove = function (t, n) {
                i(
                  t,
                  "",
                  e(n, {
                    expires: -1,
                  })
                );
              }),
              (i.withConverter = t),
              i
            );
          })(function () {});
        });
      },
      {},
    ],
    21: [
      function (e, t, n) {
        (function (e) {
          !(function () {
            var i =
                ("object" == typeof self && self.self === self && self) ||
                ("object" == typeof e && e.global === e && e) ||
                this ||
                {},
              r = i._,
              o = Array.prototype,
              s = Object.prototype,
              a = "undefined" != typeof Symbol ? Symbol.prototype : null,
              u = o.push,
              c = o.slice,
              l = s.toString,
              h = s.hasOwnProperty,
              f = Array.isArray,
              d = Object.keys,
              p = Object.create,
              g = function () {},
              v = function (e) {
                return e instanceof v
                  ? e
                  : this instanceof v
                  ? void (this._wrapped = e)
                  : new v(e);
              };
            void 0 === n || n.nodeType
              ? (i._ = v)
              : (void 0 !== t &&
                  !t.nodeType &&
                  t.exports &&
                  (n = t.exports = v),
                (n._ = v)),
              (v.VERSION = "1.9.1");
            var m,
              y = function (e, t, n) {
                if (void 0 === t) return e;
                switch (null == n ? 3 : n) {
                  case 1:
                    return function (n) {
                      return e.call(t, n);
                    };
                  case 3:
                    return function (n, i, r) {
                      return e.call(t, n, i, r);
                    };
                  case 4:
                    return function (n, i, r, o) {
                      return e.call(t, n, i, r, o);
                    };
                }
                return function () {
                  return e.apply(t, arguments);
                };
              },
              b = function (e, t, n) {
                return v.iteratee !== m
                  ? v.iteratee(e, t)
                  : null == e
                  ? v.identity
                  : v.isFunction(e)
                  ? y(e, t, n)
                  : v.isObject(e) && !v.isArray(e)
                  ? v.matcher(e)
                  : v.property(e);
              };
            v.iteratee = m = function (e, t) {
              return b(e, t, 1 / 0);
            };
            var w = function (e, t) {
                return (
                  (t = null == t ? e.length - 1 : +t),
                  function () {
                    for (
                      var n = Math.max(arguments.length - t, 0),
                        i = Array(n),
                        r = 0;
                      r < n;
                      r++
                    )
                      i[r] = arguments[r + t];
                    switch (t) {
                      case 0:
                        return e.call(this, i);
                      case 1:
                        return e.call(this, arguments[0], i);
                      case 2:
                        return e.call(this, arguments[0], arguments[1], i);
                    }
                    var o = Array(t + 1);
                    for (r = 0; r < t; r++) o[r] = arguments[r];
                    return (o[t] = i), e.apply(this, o);
                  }
                );
              },
              x = function (e) {
                if (!v.isObject(e)) return {};
                if (p) return p(e);
                g.prototype = e;
                var t = new g();
                return (g.prototype = null), t;
              },
              _ = function (e) {
                return function (t) {
                  return null == t ? void 0 : t[e];
                };
              },
              C = function (e, t) {
                return null != e && h.call(e, t);
              },
              k = function (e, t) {
                for (var n = t.length, i = 0; i < n; i++) {
                  if (null == e) return;
                  e = e[t[i]];
                }
                return n ? e : void 0;
              },
              E = Math.pow(2, 53) - 1,
              F = _("length"),
              T = function (e) {
                var t = F(e);
                return "number" == typeof t && t >= 0 && t <= E;
              };
            (v.each = v.forEach =
              function (e, t, n) {
                var i, r;
                if (((t = y(t, n)), T(e)))
                  for (i = 0, r = e.length; i < r; i++) t(e[i], i, e);
                else {
                  var o = v.keys(e);
                  for (i = 0, r = o.length; i < r; i++) t(e[o[i]], o[i], e);
                }
                return e;
              }),
              (v.map = v.collect =
                function (e, t, n) {
                  t = b(t, n);
                  for (
                    var i = !T(e) && v.keys(e),
                      r = (i || e).length,
                      o = Array(r),
                      s = 0;
                    s < r;
                    s++
                  ) {
                    var a = i ? i[s] : s;
                    o[s] = t(e[a], a, e);
                  }
                  return o;
                });
            var A = function (e) {
              return function (t, n, i, r) {
                var o = arguments.length >= 3;
                return (function (t, n, i, r) {
                  var o = !T(t) && v.keys(t),
                    s = (o || t).length,
                    a = e > 0 ? 0 : s - 1;
                  for (
                    r || ((i = t[o ? o[a] : a]), (a += e));
                    a >= 0 && a < s;
                    a += e
                  ) {
                    var u = o ? o[a] : a;
                    i = n(i, t[u], u, t);
                  }
                  return i;
                })(t, y(n, r, 4), i, o);
              };
            };
            (v.reduce = v.foldl = v.inject = A(1)),
              (v.reduceRight = v.foldr = A(-1)),
              (v.find = v.detect =
                function (e, t, n) {
                  var i = (T(e) ? v.findIndex : v.findKey)(e, t, n);
                  if (void 0 !== i && -1 !== i) return e[i];
                }),
              (v.filter = v.select =
                function (e, t, n) {
                  var i = [];
                  return (
                    (t = b(t, n)),
                    v.each(e, function (e, n, r) {
                      t(e, n, r) && i.push(e);
                    }),
                    i
                  );
                }),
              (v.reject = function (e, t, n) {
                return v.filter(e, v.negate(b(t)), n);
              }),
              (v.every = v.all =
                function (e, t, n) {
                  t = b(t, n);
                  for (
                    var i = !T(e) && v.keys(e), r = (i || e).length, o = 0;
                    o < r;
                    o++
                  ) {
                    var s = i ? i[o] : o;
                    if (!t(e[s], s, e)) return !1;
                  }
                  return !0;
                }),
              (v.some = v.any =
                function (e, t, n) {
                  t = b(t, n);
                  for (
                    var i = !T(e) && v.keys(e), r = (i || e).length, o = 0;
                    o < r;
                    o++
                  ) {
                    var s = i ? i[o] : o;
                    if (t(e[s], s, e)) return !0;
                  }
                  return !1;
                }),
              (v.contains =
                v.includes =
                v.include =
                  function (e, t, n, i) {
                    return (
                      T(e) || (e = v.values(e)),
                      ("number" != typeof n || i) && (n = 0),
                      v.indexOf(e, t, n) >= 0
                    );
                  }),
              (v.invoke = w(function (e, t, n) {
                var i, r;
                return (
                  v.isFunction(t)
                    ? (r = t)
                    : v.isArray(t) &&
                      ((i = t.slice(0, -1)), (t = t[t.length - 1])),
                  v.map(e, function (e) {
                    var o = r;
                    if (!o) {
                      if ((i && i.length && (e = k(e, i)), null == e)) return;
                      o = e[t];
                    }
                    return null == o ? o : o.apply(e, n);
                  })
                );
              })),
              (v.pluck = function (e, t) {
                return v.map(e, v.property(t));
              }),
              (v.where = function (e, t) {
                return v.filter(e, v.matcher(t));
              }),
              (v.findWhere = function (e, t) {
                return v.find(e, v.matcher(t));
              }),
              (v.max = function (e, t, n) {
                var i,
                  r,
                  o = -1 / 0,
                  s = -1 / 0;
                if (
                  null == t ||
                  ("number" == typeof t && "object" != typeof e[0] && null != e)
                )
                  for (
                    var a = 0, u = (e = T(e) ? e : v.values(e)).length;
                    a < u;
                    a++
                  )
                    null != (i = e[a]) && i > o && (o = i);
                else
                  (t = b(t, n)),
                    v.each(e, function (e, n, i) {
                      ((r = t(e, n, i)) > s ||
                        (r === -1 / 0 && o === -1 / 0)) &&
                        ((o = e), (s = r));
                    });
                return o;
              }),
              (v.min = function (e, t, n) {
                var i,
                  r,
                  o = 1 / 0,
                  s = 1 / 0;
                if (
                  null == t ||
                  ("number" == typeof t && "object" != typeof e[0] && null != e)
                )
                  for (
                    var a = 0, u = (e = T(e) ? e : v.values(e)).length;
                    a < u;
                    a++
                  )
                    null != (i = e[a]) && i < o && (o = i);
                else
                  (t = b(t, n)),
                    v.each(e, function (e, n, i) {
                      ((r = t(e, n, i)) < s || (r === 1 / 0 && o === 1 / 0)) &&
                        ((o = e), (s = r));
                    });
                return o;
              }),
              (v.shuffle = function (e) {
                return v.sample(e, 1 / 0);
              }),
              (v.sample = function (e, t, n) {
                if (null == t || n)
                  return T(e) || (e = v.values(e)), e[v.random(e.length - 1)];
                var i = T(e) ? v.clone(e) : v.values(e),
                  r = F(i);
                t = Math.max(Math.min(t, r), 0);
                for (var o = r - 1, s = 0; s < t; s++) {
                  var a = v.random(s, o),
                    u = i[s];
                  (i[s] = i[a]), (i[a] = u);
                }
                return i.slice(0, t);
              }),
              (v.sortBy = function (e, t, n) {
                var i = 0;
                return (
                  (t = b(t, n)),
                  v.pluck(
                    v
                      .map(e, function (e, n, r) {
                        return {
                          value: e,
                          index: i++,
                          criteria: t(e, n, r),
                        };
                      })
                      .sort(function (e, t) {
                        var n = e.criteria,
                          i = t.criteria;
                        if (n !== i) {
                          if (n > i || void 0 === n) return 1;
                          if (n < i || void 0 === i) return -1;
                        }
                        return e.index - t.index;
                      }),
                    "value"
                  )
                );
              });
            var M = function (e, t) {
              return function (n, i, r) {
                var o = t ? [[], []] : {};
                return (
                  (i = b(i, r)),
                  v.each(n, function (t, r) {
                    var s = i(t, r, n);
                    e(o, t, s);
                  }),
                  o
                );
              };
            };
            (v.groupBy = M(function (e, t, n) {
              C(e, n) ? e[n].push(t) : (e[n] = [t]);
            })),
              (v.indexBy = M(function (e, t, n) {
                e[n] = t;
              })),
              (v.countBy = M(function (e, t, n) {
                C(e, n) ? e[n]++ : (e[n] = 1);
              }));
            var S =
              /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
            (v.toArray = function (e) {
              return e
                ? v.isArray(e)
                  ? c.call(e)
                  : v.isString(e)
                  ? e.match(S)
                  : T(e)
                  ? v.map(e, v.identity)
                  : v.values(e)
                : [];
            }),
              (v.size = function (e) {
                return null == e ? 0 : T(e) ? e.length : v.keys(e).length;
              }),
              (v.partition = M(function (e, t, n) {
                e[n ? 0 : 1].push(t);
              }, !0)),
              (v.first =
                v.head =
                v.take =
                  function (e, t, n) {
                    return null == e || e.length < 1
                      ? null == t
                        ? void 0
                        : []
                      : null == t || n
                      ? e[0]
                      : v.initial(e, e.length - t);
                  }),
              (v.initial = function (e, t, n) {
                return c.call(
                  e,
                  0,
                  Math.max(0, e.length - (null == t || n ? 1 : t))
                );
              }),
              (v.last = function (e, t, n) {
                return null == e || e.length < 1
                  ? null == t
                    ? void 0
                    : []
                  : null == t || n
                  ? e[e.length - 1]
                  : v.rest(e, Math.max(0, e.length - t));
              }),
              (v.rest =
                v.tail =
                v.drop =
                  function (e, t, n) {
                    return c.call(e, null == t || n ? 1 : t);
                  }),
              (v.compact = function (e) {
                return v.filter(e, Boolean);
              });
            var j = function (e, t, n, i) {
              for (var r = (i = i || []).length, o = 0, s = F(e); o < s; o++) {
                var a = e[o];
                if (T(a) && (v.isArray(a) || v.isArguments(a)))
                  if (t) for (var u = 0, c = a.length; u < c; ) i[r++] = a[u++];
                  else j(a, t, n, i), (r = i.length);
                else n || (i[r++] = a);
              }
              return i;
            };
            (v.flatten = function (e, t) {
              return j(e, t, !1);
            }),
              (v.without = w(function (e, t) {
                return v.difference(e, t);
              })),
              (v.uniq = v.unique =
                function (e, t, n, i) {
                  v.isBoolean(t) || ((i = n), (n = t), (t = !1)),
                    null != n && (n = b(n, i));
                  for (var r = [], o = [], s = 0, a = F(e); s < a; s++) {
                    var u = e[s],
                      c = n ? n(u, s, e) : u;
                    t && !n
                      ? ((s && o === c) || r.push(u), (o = c))
                      : n
                      ? v.contains(o, c) || (o.push(c), r.push(u))
                      : v.contains(r, u) || r.push(u);
                  }
                  return r;
                }),
              (v.union = w(function (e) {
                return v.uniq(j(e, !0, !0));
              })),
              (v.intersection = function (e) {
                for (
                  var t = [], n = arguments.length, i = 0, r = F(e);
                  i < r;
                  i++
                ) {
                  var o = e[i];
                  if (!v.contains(t, o)) {
                    var s;
                    for (s = 1; s < n && v.contains(arguments[s], o); s++);
                    s === n && t.push(o);
                  }
                }
                return t;
              }),
              (v.difference = w(function (e, t) {
                return (
                  (t = j(t, !0, !0)),
                  v.filter(e, function (e) {
                    return !v.contains(t, e);
                  })
                );
              })),
              (v.unzip = function (e) {
                for (
                  var t = (e && v.max(e, F).length) || 0, n = Array(t), i = 0;
                  i < t;
                  i++
                )
                  n[i] = v.pluck(e, i);
                return n;
              }),
              (v.zip = w(v.unzip)),
              (v.object = function (e, t) {
                for (var n = {}, i = 0, r = F(e); i < r; i++)
                  t ? (n[e[i]] = t[i]) : (n[e[i][0]] = e[i][1]);
                return n;
              });
            var O = function (e) {
              return function (t, n, i) {
                n = b(n, i);
                for (
                  var r = F(t), o = e > 0 ? 0 : r - 1;
                  o >= 0 && o < r;
                  o += e
                )
                  if (n(t[o], o, t)) return o;
                return -1;
              };
            };
            (v.findIndex = O(1)),
              (v.findLastIndex = O(-1)),
              (v.sortedIndex = function (e, t, n, i) {
                for (var r = (n = b(n, i, 1))(t), o = 0, s = F(e); o < s; ) {
                  var a = Math.floor((o + s) / 2);
                  n(e[a]) < r ? (o = a + 1) : (s = a);
                }
                return o;
              });
            var D = function (e, t, n) {
              return function (i, r, o) {
                var s = 0,
                  a = F(i);
                if ("number" == typeof o)
                  e > 0
                    ? (s = o >= 0 ? o : Math.max(o + a, s))
                    : (a = o >= 0 ? Math.min(o + 1, a) : o + a + 1);
                else if (n && o && a) return i[(o = n(i, r))] === r ? o : -1;
                if (r != r)
                  return (o = t(c.call(i, s, a), v.isNaN)) >= 0 ? o + s : -1;
                for (o = e > 0 ? s : a - 1; o >= 0 && o < a; o += e)
                  if (i[o] === r) return o;
                return -1;
              };
            };
            (v.indexOf = D(1, v.findIndex, v.sortedIndex)),
              (v.lastIndexOf = D(-1, v.findLastIndex)),
              (v.range = function (e, t, n) {
                null == t && ((t = e || 0), (e = 0)), n || (n = t < e ? -1 : 1);
                for (
                  var i = Math.max(Math.ceil((t - e) / n), 0),
                    r = Array(i),
                    o = 0;
                  o < i;
                  o++, e += n
                )
                  r[o] = e;
                return r;
              }),
              (v.chunk = function (e, t) {
                if (null == t || t < 1) return [];
                for (var n = [], i = 0, r = e.length; i < r; )
                  n.push(c.call(e, i, (i += t)));
                return n;
              });
            var N = function (e, t, n, i, r) {
              if (!(i instanceof t)) return e.apply(n, r);
              var o = x(e.prototype),
                s = e.apply(o, r);
              return v.isObject(s) ? s : o;
            };
            (v.bind = w(function (e, t, n) {
              if (!v.isFunction(e))
                throw new TypeError("Bind must be called on a function");
              var i = w(function (r) {
                return N(e, i, t, this, n.concat(r));
              });
              return i;
            })),
              (v.partial = w(function (e, t) {
                var n = v.partial.placeholder,
                  i = function () {
                    for (
                      var r = 0, o = t.length, s = Array(o), a = 0;
                      a < o;
                      a++
                    )
                      s[a] = t[a] === n ? arguments[r++] : t[a];
                    for (; r < arguments.length; ) s.push(arguments[r++]);
                    return N(e, i, this, this, s);
                  };
                return i;
              })),
              (v.partial.placeholder = v),
              (v.bindAll = w(function (e, t) {
                var n = (t = j(t, !1, !1)).length;
                if (n < 1)
                  throw new Error("bindAll must be passed function names");
                for (; n--; ) {
                  var i = t[n];
                  e[i] = v.bind(e[i], e);
                }
              })),
              (v.memoize = function (e, t) {
                var n = function (i) {
                  var r = n.cache,
                    o = "" + (t ? t.apply(this, arguments) : i);
                  return C(r, o) || (r[o] = e.apply(this, arguments)), r[o];
                };
                return (n.cache = {}), n;
              }),
              (v.delay = w(function (e, t, n) {
                return setTimeout(function () {
                  return e.apply(null, n);
                }, t);
              })),
              (v.defer = v.partial(v.delay, v, 1)),
              (v.throttle = function (e, t, n) {
                var i,
                  r,
                  o,
                  s,
                  a = 0;
                n || (n = {});
                var u = function () {
                    (a = !1 === n.leading ? 0 : v.now()),
                      (i = null),
                      (s = e.apply(r, o)),
                      i || (r = o = null);
                  },
                  c = function () {
                    var c = v.now();
                    a || !1 !== n.leading || (a = c);
                    var l = t - (c - a);
                    return (
                      (r = this),
                      (o = arguments),
                      l <= 0 || l > t
                        ? (i && (clearTimeout(i), (i = null)),
                          (a = c),
                          (s = e.apply(r, o)),
                          i || (r = o = null))
                        : i || !1 === n.trailing || (i = setTimeout(u, l)),
                      s
                    );
                  };
                return (
                  (c.cancel = function () {
                    clearTimeout(i), (a = 0), (i = r = o = null);
                  }),
                  c
                );
              }),
              (v.debounce = function (e, t, n) {
                var i,
                  r,
                  o = function (t, n) {
                    (i = null), n && (r = e.apply(t, n));
                  },
                  s = w(function (s) {
                    if ((i && clearTimeout(i), n)) {
                      var a = !i;
                      (i = setTimeout(o, t)), a && (r = e.apply(this, s));
                    } else i = v.delay(o, t, this, s);
                    return r;
                  });
                return (
                  (s.cancel = function () {
                    clearTimeout(i), (i = null);
                  }),
                  s
                );
              }),
              (v.wrap = function (e, t) {
                return v.partial(t, e);
              }),
              (v.negate = function (e) {
                return function () {
                  return !e.apply(this, arguments);
                };
              }),
              (v.compose = function () {
                var e = arguments,
                  t = e.length - 1;
                return function () {
                  for (var n = t, i = e[t].apply(this, arguments); n--; )
                    i = e[n].call(this, i);
                  return i;
                };
              }),
              (v.after = function (e, t) {
                return function () {
                  if (--e < 1) return t.apply(this, arguments);
                };
              }),
              (v.before = function (e, t) {
                var n;
                return function () {
                  return (
                    --e > 0 && (n = t.apply(this, arguments)),
                    e <= 1 && (t = null),
                    n
                  );
                };
              }),
              (v.once = v.partial(v.before, 2)),
              (v.restArguments = w);
            var V = !{
                toString: null,
              }.propertyIsEnumerable("toString"),
              R = [
                "valueOf",
                "isPrototypeOf",
                "toString",
                "propertyIsEnumerable",
                "hasOwnProperty",
                "toLocaleString",
              ],
              I = function (e, t) {
                var n = R.length,
                  i = e.constructor,
                  r = (v.isFunction(i) && i.prototype) || s,
                  o = "constructor";
                for (C(e, o) && !v.contains(t, o) && t.push(o); n--; )
                  (o = R[n]) in e &&
                    e[o] !== r[o] &&
                    !v.contains(t, o) &&
                    t.push(o);
              };
            (v.keys = function (e) {
              if (!v.isObject(e)) return [];
              if (d) return d(e);
              var t = [];
              for (var n in e) C(e, n) && t.push(n);
              return V && I(e, t), t;
            }),
              (v.allKeys = function (e) {
                if (!v.isObject(e)) return [];
                var t = [];
                for (var n in e) t.push(n);
                return V && I(e, t), t;
              }),
              (v.values = function (e) {
                for (
                  var t = v.keys(e), n = t.length, i = Array(n), r = 0;
                  r < n;
                  r++
                )
                  i[r] = e[t[r]];
                return i;
              }),
              (v.mapObject = function (e, t, n) {
                t = b(t, n);
                for (
                  var i = v.keys(e), r = i.length, o = {}, s = 0;
                  s < r;
                  s++
                ) {
                  var a = i[s];
                  o[a] = t(e[a], a, e);
                }
                return o;
              }),
              (v.pairs = function (e) {
                for (
                  var t = v.keys(e), n = t.length, i = Array(n), r = 0;
                  r < n;
                  r++
                )
                  i[r] = [t[r], e[t[r]]];
                return i;
              }),
              (v.invert = function (e) {
                for (var t = {}, n = v.keys(e), i = 0, r = n.length; i < r; i++)
                  t[e[n[i]]] = n[i];
                return t;
              }),
              (v.functions = v.methods =
                function (e) {
                  var t = [];
                  for (var n in e) v.isFunction(e[n]) && t.push(n);
                  return t.sort();
                });
            var L = function (e, t) {
              return function (n) {
                var i = arguments.length;
                if ((t && (n = Object(n)), i < 2 || null == n)) return n;
                for (var r = 1; r < i; r++)
                  for (
                    var o = arguments[r], s = e(o), a = s.length, u = 0;
                    u < a;
                    u++
                  ) {
                    var c = s[u];
                    (t && void 0 !== n[c]) || (n[c] = o[c]);
                  }
                return n;
              };
            };
            (v.extend = L(v.allKeys)),
              (v.extendOwn = v.assign = L(v.keys)),
              (v.findKey = function (e, t, n) {
                t = b(t, n);
                for (var i, r = v.keys(e), o = 0, s = r.length; o < s; o++)
                  if (t(e[(i = r[o])], i, e)) return i;
              });
            var q,
              B,
              H = function (e, t, n) {
                return t in n;
              };
            (v.pick = w(function (e, t) {
              var n = {},
                i = t[0];
              if (null == e) return n;
              v.isFunction(i)
                ? (t.length > 1 && (i = y(i, t[1])), (t = v.allKeys(e)))
                : ((i = H), (t = j(t, !1, !1)), (e = Object(e)));
              for (var r = 0, o = t.length; r < o; r++) {
                var s = t[r],
                  a = e[s];
                i(a, s, e) && (n[s] = a);
              }
              return n;
            })),
              (v.omit = w(function (e, t) {
                var n,
                  i = t[0];
                return (
                  v.isFunction(i)
                    ? ((i = v.negate(i)), t.length > 1 && (n = t[1]))
                    : ((t = v.map(j(t, !1, !1), String)),
                      (i = function (e, n) {
                        return !v.contains(t, n);
                      })),
                  v.pick(e, i, n)
                );
              })),
              (v.defaults = L(v.allKeys, !0)),
              (v.create = function (e, t) {
                var n = x(e);
                return t && v.extendOwn(n, t), n;
              }),
              (v.clone = function (e) {
                return v.isObject(e)
                  ? v.isArray(e)
                    ? e.slice()
                    : v.extend({}, e)
                  : e;
              }),
              (v.tap = function (e, t) {
                return t(e), e;
              }),
              (v.isMatch = function (e, t) {
                var n = v.keys(t),
                  i = n.length;
                if (null == e) return !i;
                for (var r = Object(e), o = 0; o < i; o++) {
                  var s = n[o];
                  if (t[s] !== r[s] || !(s in r)) return !1;
                }
                return !0;
              }),
              (q = function (e, t, n, i) {
                if (e === t) return 0 !== e || 1 / e == 1 / t;
                if (null == e || null == t) return !1;
                if (e != e) return t != t;
                var r = typeof e;
                return (
                  ("function" === r ||
                    "object" === r ||
                    "object" == typeof t) &&
                  B(e, t, n, i)
                );
              }),
              (B = function (e, t, n, i) {
                e instanceof v && (e = e._wrapped),
                  t instanceof v && (t = t._wrapped);
                var r = l.call(e);
                if (r !== l.call(t)) return !1;
                switch (r) {
                  case "[object RegExp]":
                  case "[object String]":
                    return "" + e == "" + t;
                  case "[object Number]":
                    return +e != +e
                      ? +t != +t
                      : 0 == +e
                      ? 1 / +e == 1 / t
                      : +e == +t;
                  case "[object Date]":
                  case "[object Boolean]":
                    return +e == +t;
                  case "[object Symbol]":
                    return a.valueOf.call(e) === a.valueOf.call(t);
                }
                var o = "[object Array]" === r;
                if (!o) {
                  if ("object" != typeof e || "object" != typeof t) return !1;
                  var s = e.constructor,
                    u = t.constructor;
                  if (
                    s !== u &&
                    !(
                      v.isFunction(s) &&
                      s instanceof s &&
                      v.isFunction(u) &&
                      u instanceof u
                    ) &&
                    "constructor" in e &&
                    "constructor" in t
                  )
                    return !1;
                }
                i = i || [];
                for (var c = (n = n || []).length; c--; )
                  if (n[c] === e) return i[c] === t;
                if ((n.push(e), i.push(t), o)) {
                  if ((c = e.length) !== t.length) return !1;
                  for (; c--; ) if (!q(e[c], t[c], n, i)) return !1;
                } else {
                  var h,
                    f = v.keys(e);
                  if (((c = f.length), v.keys(t).length !== c)) return !1;
                  for (; c--; )
                    if (((h = f[c]), !C(t, h) || !q(e[h], t[h], n, i)))
                      return !1;
                }
                return n.pop(), i.pop(), !0;
              }),
              (v.isEqual = function (e, t) {
                return q(e, t);
              }),
              (v.isEmpty = function (e) {
                return (
                  null == e ||
                  (T(e) && (v.isArray(e) || v.isString(e) || v.isArguments(e))
                    ? 0 === e.length
                    : 0 === v.keys(e).length)
                );
              }),
              (v.isElement = function (e) {
                return !(!e || 1 !== e.nodeType);
              }),
              (v.isArray =
                f ||
                function (e) {
                  return "[object Array]" === l.call(e);
                }),
              (v.isObject = function (e) {
                var t = typeof e;
                return "function" === t || ("object" === t && !!e);
              }),
              v.each(
                [
                  "Arguments",
                  "Function",
                  "String",
                  "Number",
                  "Date",
                  "RegExp",
                  "Error",
                  "Symbol",
                  "Map",
                  "WeakMap",
                  "Set",
                  "WeakSet",
                ],
                function (e) {
                  v["is" + e] = function (t) {
                    return l.call(t) === "[object " + e + "]";
                  };
                }
              ),
              v.isArguments(arguments) ||
                (v.isArguments = function (e) {
                  return C(e, "callee");
                });
            var z = i.document && i.document.childNodes;
            "function" != typeof /./ &&
              "object" != typeof Int8Array &&
              "function" != typeof z &&
              (v.isFunction = function (e) {
                return "function" == typeof e || !1;
              }),
              (v.isFinite = function (e) {
                return !v.isSymbol(e) && isFinite(e) && !isNaN(parseFloat(e));
              }),
              (v.isNaN = function (e) {
                return v.isNumber(e) && isNaN(e);
              }),
              (v.isBoolean = function (e) {
                return !0 === e || !1 === e || "[object Boolean]" === l.call(e);
              }),
              (v.isNull = function (e) {
                return null === e;
              }),
              (v.isUndefined = function (e) {
                return void 0 === e;
              }),
              (v.has = function (e, t) {
                if (!v.isArray(t)) return C(e, t);
                for (var n = t.length, i = 0; i < n; i++) {
                  var r = t[i];
                  if (null == e || !h.call(e, r)) return !1;
                  e = e[r];
                }
                return !!n;
              }),
              (v.noConflict = function () {
                return (i._ = r), this;
              }),
              (v.identity = function (e) {
                return e;
              }),
              (v.constant = function (e) {
                return function () {
                  return e;
                };
              }),
              (v.noop = function () {}),
              (v.property = function (e) {
                return v.isArray(e)
                  ? function (t) {
                      return k(t, e);
                    }
                  : _(e);
              }),
              (v.propertyOf = function (e) {
                return null == e
                  ? function () {}
                  : function (t) {
                      return v.isArray(t) ? k(e, t) : e[t];
                    };
              }),
              (v.matcher = v.matches =
                function (e) {
                  return (
                    (e = v.extendOwn({}, e)),
                    function (t) {
                      return v.isMatch(t, e);
                    }
                  );
                }),
              (v.times = function (e, t, n) {
                var i = Array(Math.max(0, e));
                t = y(t, n, 1);
                for (var r = 0; r < e; r++) i[r] = t(r);
                return i;
              }),
              (v.random = function (e, t) {
                return (
                  null == t && ((t = e), (e = 0)),
                  e + Math.floor(Math.random() * (t - e + 1))
                );
              }),
              (v.now =
                Date.now ||
                function () {
                  return new Date().getTime();
                });
            var $ = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#x27;",
                "`": "&#x60;",
              },
              P = v.invert($),
              U = function (e) {
                var t = function (t) {
                    return e[t];
                  },
                  n = "(?:" + v.keys(e).join("|") + ")",
                  i = RegExp(n),
                  r = RegExp(n, "g");
                return function (e) {
                  return (
                    (e = null == e ? "" : "" + e),
                    i.test(e) ? e.replace(r, t) : e
                  );
                };
              };
            (v.escape = U($)),
              (v.unescape = U(P)),
              (v.result = function (e, t, n) {
                v.isArray(t) || (t = [t]);
                var i = t.length;
                if (!i) return v.isFunction(n) ? n.call(e) : n;
                for (var r = 0; r < i; r++) {
                  var o = null == e ? void 0 : e[t[r]];
                  void 0 === o && ((o = n), (r = i)),
                    (e = v.isFunction(o) ? o.call(e) : o);
                }
                return e;
              });
            var W = 0;
            (v.uniqueId = function (e) {
              var t = ++W + "";
              return e ? e + t : t;
            }),
              (v.templateSettings = {
                evaluate: /<%([\s\S]+?)%>/g,
                interpolate: /<%=([\s\S]+?)%>/g,
                escape: /<%-([\s\S]+?)%>/g,
              });
            var X = /(.)^/,
              J = {
                "'": "'",
                "\\": "\\",
                "\r": "r",
                "\n": "n",
                "\u2028": "u2028",
                "\u2029": "u2029",
              },
              K = /\\|'|\r|\n|\u2028|\u2029/g,
              G = function (e) {
                return "\\" + J[e];
              };
            (v.template = function (e, t, n) {
              !t && n && (t = n), (t = v.defaults({}, t, v.templateSettings));
              var i,
                r = RegExp(
                  [
                    (t.escape || X).source,
                    (t.interpolate || X).source,
                    (t.evaluate || X).source,
                  ].join("|") + "|$",
                  "g"
                ),
                o = 0,
                s = "__p+='";
              e.replace(r, function (t, n, i, r, a) {
                return (
                  (s += e.slice(o, a).replace(K, G)),
                  (o = a + t.length),
                  n
                    ? (s +=
                        "'+\n((__t=(" + n + "))==null?'':_.escape(__t))+\n'")
                    : i
                    ? (s += "'+\n((__t=(" + i + "))==null?'':__t)+\n'")
                    : r && (s += "';\n" + r + "\n__p+='"),
                  t
                );
              }),
                (s += "';\n"),
                t.variable || (s = "with(obj||{}){\n" + s + "}\n"),
                (s =
                  "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" +
                  s +
                  "return __p;\n");
              try {
                i = new Function(t.variable || "obj", "_", s);
              } catch (e) {
                throw ((e.source = s), e);
              }
              var a = function (e) {
                  return i.call(this, e, v);
                },
                u = t.variable || "obj";
              return (a.source = "function(" + u + "){\n" + s + "}"), a;
            }),
              (v.chain = function (e) {
                var t = v(e);
                return (t._chain = !0), t;
              });
            var Y = function (e, t) {
              return e._chain ? v(t).chain() : t;
            };
            (v.mixin = function (e) {
              return (
                v.each(v.functions(e), function (t) {
                  var n = (v[t] = e[t]);
                  v.prototype[t] = function () {
                    var e = [this._wrapped];
                    return u.apply(e, arguments), Y(this, n.apply(v, e));
                  };
                }),
                v
              );
            }),
              v.mixin(v),
              v.each(
                [
                  "pop",
                  "push",
                  "reverse",
                  "shift",
                  "sort",
                  "splice",
                  "unshift",
                ],
                function (e) {
                  var t = o[e];
                  v.prototype[e] = function () {
                    var n = this._wrapped;
                    return (
                      t.apply(n, arguments),
                      ("shift" !== e && "splice" !== e) ||
                        0 !== n.length ||
                        delete n[0],
                      Y(this, n)
                    );
                  };
                }
              ),
              v.each(["concat", "join", "slice"], function (e) {
                var t = o[e];
                v.prototype[e] = function () {
                  return Y(this, t.apply(this._wrapped, arguments));
                };
              }),
              (v.prototype.value = function () {
                return this._wrapped;
              }),
              (v.prototype.valueOf = v.prototype.toJSON = v.prototype.value),
              (v.prototype.toString = function () {
                return String(this._wrapped);
              }),
              "function" == typeof define &&
                define.amd &&
                define("underscore", [], function () {
                  return v;
                });
          })();
        }.call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        ));
      },
      {},
    ],
  },
  {},
  [10]
);
