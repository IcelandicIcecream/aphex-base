var SECONDS_A_MINUTE = 60;
var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
var MILLISECONDS_A_SECOND = 1e3;
var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND;
var MS = "millisecond";
var S = "second";
var MIN = "minute";
var H = "hour";
var D = "day";
var W = "week";
var M = "month";
var Q = "quarter";
var Y = "year";
var DATE = "date";
var FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ssZ";
var INVALID_DATE_STRING = "Invalid Date";
var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;
const en = {
  name: "en",
  weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
  months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
  ordinal: function ordinal(n) {
    var s = ["th", "st", "nd", "rd"];
    var v = n % 100;
    return "[" + n + (s[(v - 20) % 10] || s[v] || s[0]) + "]";
  }
};
var padStart = function padStart2(string, length, pad) {
  var s = String(string);
  if (!s || s.length >= length) return string;
  return "" + Array(length + 1 - s.length).join(pad) + string;
};
var padZoneStr = function padZoneStr2(instance) {
  var negMinutes = -instance.utcOffset();
  var minutes = Math.abs(negMinutes);
  var hourOffset = Math.floor(minutes / 60);
  var minuteOffset = minutes % 60;
  return (negMinutes <= 0 ? "+" : "-") + padStart(hourOffset, 2, "0") + ":" + padStart(minuteOffset, 2, "0");
};
var monthDiff = function monthDiff2(a, b) {
  if (a.date() < b.date()) return -monthDiff2(b, a);
  var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
  var anchor = a.clone().add(wholeMonthDiff, M);
  var c = b - anchor < 0;
  var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
  return +(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)) || 0);
};
var absFloor = function absFloor2(n) {
  return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
};
var prettyUnit = function prettyUnit2(u3) {
  var special = {
    M,
    y: Y,
    w: W,
    d: D,
    D: DATE,
    h: H,
    m: MIN,
    s: S,
    ms: MS,
    Q
  };
  return special[u3] || String(u3 || "").toLowerCase().replace(/s$/, "");
};
var isUndefined = function isUndefined2(s) {
  return s === void 0;
};
const U = {
  s: padStart,
  z: padZoneStr,
  m: monthDiff,
  a: absFloor,
  p: prettyUnit,
  u: isUndefined
};
var L = "en";
var Ls = {};
Ls[L] = en;
var IS_DAYJS = "$isDayjsObject";
var isDayjs = function isDayjs2(d) {
  return d instanceof Dayjs || !!(d && d[IS_DAYJS]);
};
var parseLocale = function parseLocale2(preset, object, isLocal) {
  var l;
  if (!preset) return L;
  if (typeof preset === "string") {
    var presetLower = preset.toLowerCase();
    if (Ls[presetLower]) {
      l = presetLower;
    }
    if (object) {
      Ls[presetLower] = object;
      l = presetLower;
    }
    var presetSplit = preset.split("-");
    if (!l && presetSplit.length > 1) {
      return parseLocale2(presetSplit[0]);
    }
  } else {
    var name = preset.name;
    Ls[name] = preset;
    l = name;
  }
  if (!isLocal && l) L = l;
  return l || !isLocal && L;
};
var dayjs = function dayjs2(date, c) {
  if (isDayjs(date)) {
    return date.clone();
  }
  var cfg = typeof c === "object" ? c : {};
  cfg.date = date;
  cfg.args = arguments;
  return new Dayjs(cfg);
};
var wrapper = function wrapper2(date, instance) {
  return dayjs(date, {
    locale: instance.$L,
    utc: instance.$u,
    x: instance.$x,
    $offset: instance.$offset
    // todo: refactor; do not use this.$offset in you code
  });
};
var Utils = U;
Utils.l = parseLocale;
Utils.i = isDayjs;
Utils.w = wrapper;
var parseDate = function parseDate2(cfg) {
  var date = cfg.date, utc2 = cfg.utc;
  if (date === null) return /* @__PURE__ */ new Date(NaN);
  if (Utils.u(date)) return /* @__PURE__ */ new Date();
  if (date instanceof Date) return new Date(date);
  if (typeof date === "string" && !/Z$/i.test(date)) {
    var d = date.match(REGEX_PARSE);
    if (d) {
      var m = d[2] - 1 || 0;
      var ms = (d[7] || "0").substring(0, 3);
      if (utc2) {
        return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
      }
      return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
    }
  }
  return new Date(date);
};
var Dayjs = /* @__PURE__ */ (function() {
  function Dayjs2(cfg) {
    this.$L = parseLocale(cfg.locale, null, true);
    this.parse(cfg);
    this.$x = this.$x || cfg.x || {};
    this[IS_DAYJS] = true;
  }
  var _proto = Dayjs2.prototype;
  _proto.parse = function parse(cfg) {
    this.$d = parseDate(cfg);
    this.init();
  };
  _proto.init = function init() {
    var $d = this.$d;
    this.$y = $d.getFullYear();
    this.$M = $d.getMonth();
    this.$D = $d.getDate();
    this.$W = $d.getDay();
    this.$H = $d.getHours();
    this.$m = $d.getMinutes();
    this.$s = $d.getSeconds();
    this.$ms = $d.getMilliseconds();
  };
  _proto.$utils = function $utils() {
    return Utils;
  };
  _proto.isValid = function isValid() {
    return !(this.$d.toString() === INVALID_DATE_STRING);
  };
  _proto.isSame = function isSame(that, units) {
    var other = dayjs(that);
    return this.startOf(units) <= other && other <= this.endOf(units);
  };
  _proto.isAfter = function isAfter(that, units) {
    return dayjs(that) < this.startOf(units);
  };
  _proto.isBefore = function isBefore(that, units) {
    return this.endOf(units) < dayjs(that);
  };
  _proto.$g = function $g(input, get, set) {
    if (Utils.u(input)) return this[get];
    return this.set(set, input);
  };
  _proto.unix = function unix() {
    return Math.floor(this.valueOf() / 1e3);
  };
  _proto.valueOf = function valueOf() {
    return this.$d.getTime();
  };
  _proto.startOf = function startOf(units, _startOf) {
    var _this = this;
    var isStartOf = !Utils.u(_startOf) ? _startOf : true;
    var unit = Utils.p(units);
    var instanceFactory = function instanceFactory2(d, m) {
      var ins = Utils.w(_this.$u ? Date.UTC(_this.$y, m, d) : new Date(_this.$y, m, d), _this);
      return isStartOf ? ins : ins.endOf(D);
    };
    var instanceFactorySet = function instanceFactorySet2(method, slice) {
      var argumentStart = [0, 0, 0, 0];
      var argumentEnd = [23, 59, 59, 999];
      return Utils.w(_this.toDate()[method].apply(
        // eslint-disable-line prefer-spread
        _this.toDate("s"),
        (isStartOf ? argumentStart : argumentEnd).slice(slice)
      ), _this);
    };
    var $W = this.$W, $M = this.$M, $D = this.$D;
    var utcPad = "set" + (this.$u ? "UTC" : "");
    switch (unit) {
      case Y:
        return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);
      case M:
        return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);
      case W: {
        var weekStart = this.$locale().weekStart || 0;
        var gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
        return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
      }
      case D:
      case DATE:
        return instanceFactorySet(utcPad + "Hours", 0);
      case H:
        return instanceFactorySet(utcPad + "Minutes", 1);
      case MIN:
        return instanceFactorySet(utcPad + "Seconds", 2);
      case S:
        return instanceFactorySet(utcPad + "Milliseconds", 3);
      default:
        return this.clone();
    }
  };
  _proto.endOf = function endOf(arg) {
    return this.startOf(arg, false);
  };
  _proto.$set = function $set(units, _int) {
    var _C$D$C$DATE$C$M$C$Y$C;
    var unit = Utils.p(units);
    var utcPad = "set" + (this.$u ? "UTC" : "");
    var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C[D] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[DATE] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[M] = utcPad + "Month", _C$D$C$DATE$C$M$C$Y$C[Y] = utcPad + "FullYear", _C$D$C$DATE$C$M$C$Y$C[H] = utcPad + "Hours", _C$D$C$DATE$C$M$C$Y$C[MIN] = utcPad + "Minutes", _C$D$C$DATE$C$M$C$Y$C[S] = utcPad + "Seconds", _C$D$C$DATE$C$M$C$Y$C[MS] = utcPad + "Milliseconds", _C$D$C$DATE$C$M$C$Y$C)[unit];
    var arg = unit === D ? this.$D + (_int - this.$W) : _int;
    if (unit === M || unit === Y) {
      var date = this.clone().set(DATE, 1);
      date.$d[name](arg);
      date.init();
      this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
    } else if (name) this.$d[name](arg);
    this.init();
    return this;
  };
  _proto.set = function set(string, _int2) {
    return this.clone().$set(string, _int2);
  };
  _proto.get = function get(unit) {
    return this[Utils.p(unit)]();
  };
  _proto.add = function add(number, units) {
    var _this2 = this, _C$MIN$C$H$C$S$unit;
    number = Number(number);
    var unit = Utils.p(units);
    var instanceFactorySet = function instanceFactorySet2(n) {
      var d = dayjs(_this2);
      return Utils.w(d.date(d.date() + Math.round(n * number)), _this2);
    };
    if (unit === M) {
      return this.set(M, this.$M + number);
    }
    if (unit === Y) {
      return this.set(Y, this.$y + number);
    }
    if (unit === D) {
      return instanceFactorySet(1);
    }
    if (unit === W) {
      return instanceFactorySet(7);
    }
    var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE, _C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR, _C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND, _C$MIN$C$H$C$S$unit)[unit] || 1;
    var nextTimeStamp = this.$d.getTime() + number * step;
    return Utils.w(nextTimeStamp, this);
  };
  _proto.subtract = function subtract(number, string) {
    return this.add(number * -1, string);
  };
  _proto.format = function format(formatStr) {
    var _this3 = this;
    var locale2 = this.$locale();
    if (!this.isValid()) return locale2.invalidDate || INVALID_DATE_STRING;
    var str = formatStr || FORMAT_DEFAULT;
    var zoneStr = Utils.z(this);
    var $H = this.$H, $m = this.$m, $M = this.$M;
    var weekdays = locale2.weekdays, months = locale2.months, meridiem = locale2.meridiem;
    var getShort = function getShort2(arr, index, full, length) {
      return arr && (arr[index] || arr(_this3, str)) || full[index].slice(0, length);
    };
    var get$H = function get$H2(num) {
      return Utils.s($H % 12 || 12, num, "0");
    };
    var meridiemFunc = meridiem || function(hour, minute, isLowercase) {
      var m = hour < 12 ? "AM" : "PM";
      return isLowercase ? m.toLowerCase() : m;
    };
    var matches = function matches2(match) {
      switch (match) {
        case "YY":
          return String(_this3.$y).slice(-2);
        case "YYYY":
          return Utils.s(_this3.$y, 4, "0");
        case "M":
          return $M + 1;
        case "MM":
          return Utils.s($M + 1, 2, "0");
        case "MMM":
          return getShort(locale2.monthsShort, $M, months, 3);
        case "MMMM":
          return getShort(months, $M);
        case "D":
          return _this3.$D;
        case "DD":
          return Utils.s(_this3.$D, 2, "0");
        case "d":
          return String(_this3.$W);
        case "dd":
          return getShort(locale2.weekdaysMin, _this3.$W, weekdays, 2);
        case "ddd":
          return getShort(locale2.weekdaysShort, _this3.$W, weekdays, 3);
        case "dddd":
          return weekdays[_this3.$W];
        case "H":
          return String($H);
        case "HH":
          return Utils.s($H, 2, "0");
        case "h":
          return get$H(1);
        case "hh":
          return get$H(2);
        case "a":
          return meridiemFunc($H, $m, true);
        case "A":
          return meridiemFunc($H, $m, false);
        case "m":
          return String($m);
        case "mm":
          return Utils.s($m, 2, "0");
        case "s":
          return String(_this3.$s);
        case "ss":
          return Utils.s(_this3.$s, 2, "0");
        case "SSS":
          return Utils.s(_this3.$ms, 3, "0");
        case "Z":
          return zoneStr;
      }
      return null;
    };
    return str.replace(REGEX_FORMAT, function(match, $1) {
      return $1 || matches(match) || zoneStr.replace(":", "");
    });
  };
  _proto.utcOffset = function utcOffset() {
    return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
  };
  _proto.diff = function diff(input, units, _float) {
    var _this4 = this;
    var unit = Utils.p(units);
    var that = dayjs(input);
    var zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
    var diff2 = this - that;
    var getMonth = function getMonth2() {
      return Utils.m(_this4, that);
    };
    var result;
    switch (unit) {
      case Y:
        result = getMonth() / 12;
        break;
      case M:
        result = getMonth();
        break;
      case Q:
        result = getMonth() / 3;
        break;
      case W:
        result = (diff2 - zoneDelta) / MILLISECONDS_A_WEEK;
        break;
      case D:
        result = (diff2 - zoneDelta) / MILLISECONDS_A_DAY;
        break;
      case H:
        result = diff2 / MILLISECONDS_A_HOUR;
        break;
      case MIN:
        result = diff2 / MILLISECONDS_A_MINUTE;
        break;
      case S:
        result = diff2 / MILLISECONDS_A_SECOND;
        break;
      default:
        result = diff2;
        break;
    }
    return _float ? result : Utils.a(result);
  };
  _proto.daysInMonth = function daysInMonth() {
    return this.endOf(M).$D;
  };
  _proto.$locale = function $locale() {
    return Ls[this.$L];
  };
  _proto.locale = function locale2(preset, object) {
    if (!preset) return this.$L;
    var that = this.clone();
    var nextLocaleName = parseLocale(preset, object, true);
    if (nextLocaleName) that.$L = nextLocaleName;
    return that;
  };
  _proto.clone = function clone() {
    return Utils.w(this.$d, this);
  };
  _proto.toDate = function toDate() {
    return new Date(this.valueOf());
  };
  _proto.toJSON = function toJSON() {
    return this.isValid() ? this.toISOString() : null;
  };
  _proto.toISOString = function toISOString() {
    return this.$d.toISOString();
  };
  _proto.toString = function toString() {
    return this.$d.toUTCString();
  };
  return Dayjs2;
})();
var proto = Dayjs.prototype;
dayjs.prototype = proto;
[["$ms", MS], ["$s", S], ["$m", MIN], ["$H", H], ["$W", D], ["$M", M], ["$y", Y], ["$D", DATE]].forEach(function(g) {
  proto[g[1]] = function(input) {
    return this.$g(input, g[0], g[1]);
  };
});
dayjs.extend = function(plugin, option) {
  if (!plugin.$i) {
    plugin(option, Dayjs, dayjs);
    plugin.$i = true;
  }
  return dayjs;
};
dayjs.locale = parseLocale;
dayjs.isDayjs = isDayjs;
dayjs.unix = function(timestamp) {
  return dayjs(timestamp * 1e3);
};
dayjs.en = Ls[L];
dayjs.Ls = Ls;
dayjs.p = {};
var t = function t2(format) {
  return format.replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g, function(_, a, b) {
    return a || b.slice(1);
  });
};
var englishFormats = {
  LTS: "h:mm:ss A",
  LT: "h:mm A",
  L: "MM/DD/YYYY",
  LL: "MMMM D, YYYY",
  LLL: "MMMM D, YYYY h:mm A",
  LLLL: "dddd, MMMM D, YYYY h:mm A"
};
var u = function u2(formatStr, formats) {
  return formatStr.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g, function(_, a, b) {
    var B = b && b.toUpperCase();
    return a || formats[b] || englishFormats[b] || t(formats[B]);
  });
};
var formattingTokens = /(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g;
var match1 = /\d/;
var match2 = /\d\d/;
var match3 = /\d{3}/;
var match4 = /\d{4}/;
var match1to2 = /\d\d?/;
var matchSigned = /[+-]?\d+/;
var matchOffset = /[+-]\d\d:?(\d\d)?|Z/;
var matchWord = /\d*[^-_:/,()\s\d]+/;
var locale = {};
var parseTwoDigitYear = function parseTwoDigitYear2(input) {
  input = +input;
  return input + (input > 68 ? 1900 : 2e3);
};
function offsetFromString$1(string) {
  if (!string) return 0;
  if (string === "Z") return 0;
  var parts = string.match(/([+-]|\d\d)/g);
  var minutes = +(parts[1] * 60) + (+parts[2] || 0);
  return minutes === 0 ? 0 : parts[0] === "+" ? -minutes : minutes;
}
var addInput = function addInput2(property) {
  return function(input) {
    this[property] = +input;
  };
};
var zoneExpressions = [matchOffset, function(input) {
  var zone = this.zone || (this.zone = {});
  zone.offset = offsetFromString$1(input);
}];
var getLocalePart = function getLocalePart2(name) {
  var part = locale[name];
  return part && (part.indexOf ? part : part.s.concat(part.f));
};
var meridiemMatch = function meridiemMatch2(input, isLowerCase) {
  var isAfternoon;
  var _locale = locale, meridiem = _locale.meridiem;
  if (!meridiem) {
    isAfternoon = input === (isLowerCase ? "pm" : "PM");
  } else {
    for (var i = 1; i <= 24; i += 1) {
      if (input.indexOf(meridiem(i, 0, isLowerCase)) > -1) {
        isAfternoon = i > 12;
        break;
      }
    }
  }
  return isAfternoon;
};
var expressions = {
  A: [matchWord, function(input) {
    this.afternoon = meridiemMatch(input, false);
  }],
  a: [matchWord, function(input) {
    this.afternoon = meridiemMatch(input, true);
  }],
  Q: [match1, function(input) {
    this.month = (input - 1) * 3 + 1;
  }],
  S: [match1, function(input) {
    this.milliseconds = +input * 100;
  }],
  SS: [match2, function(input) {
    this.milliseconds = +input * 10;
  }],
  SSS: [match3, function(input) {
    this.milliseconds = +input;
  }],
  s: [match1to2, addInput("seconds")],
  ss: [match1to2, addInput("seconds")],
  m: [match1to2, addInput("minutes")],
  mm: [match1to2, addInput("minutes")],
  H: [match1to2, addInput("hours")],
  h: [match1to2, addInput("hours")],
  HH: [match1to2, addInput("hours")],
  hh: [match1to2, addInput("hours")],
  D: [match1to2, addInput("day")],
  DD: [match2, addInput("day")],
  Do: [matchWord, function(input) {
    var _locale2 = locale, ordinal2 = _locale2.ordinal;
    var _input$match = input.match(/\d+/);
    this.day = _input$match[0];
    if (!ordinal2) return;
    for (var i = 1; i <= 31; i += 1) {
      if (ordinal2(i).replace(/\[|\]/g, "") === input) {
        this.day = i;
      }
    }
  }],
  w: [match1to2, addInput("week")],
  ww: [match2, addInput("week")],
  M: [match1to2, addInput("month")],
  MM: [match2, addInput("month")],
  MMM: [matchWord, function(input) {
    var months = getLocalePart("months");
    var monthsShort = getLocalePart("monthsShort");
    var matchIndex = (monthsShort || months.map(function(_) {
      return _.slice(0, 3);
    })).indexOf(input) + 1;
    if (matchIndex < 1) {
      throw new Error();
    }
    this.month = matchIndex % 12 || matchIndex;
  }],
  MMMM: [matchWord, function(input) {
    var months = getLocalePart("months");
    var matchIndex = months.indexOf(input) + 1;
    if (matchIndex < 1) {
      throw new Error();
    }
    this.month = matchIndex % 12 || matchIndex;
  }],
  Y: [matchSigned, addInput("year")],
  YY: [match2, function(input) {
    this.year = parseTwoDigitYear(input);
  }],
  YYYY: [match4, addInput("year")],
  Z: zoneExpressions,
  ZZ: zoneExpressions
};
function correctHours(time) {
  var afternoon = time.afternoon;
  if (afternoon !== void 0) {
    var hours = time.hours;
    if (afternoon) {
      if (hours < 12) {
        time.hours += 12;
      }
    } else if (hours === 12) {
      time.hours = 0;
    }
    delete time.afternoon;
  }
}
function makeParser(format) {
  format = u(format, locale && locale.formats);
  var array = format.match(formattingTokens);
  var length = array.length;
  for (var i = 0; i < length; i += 1) {
    var token = array[i];
    var parseTo = expressions[token];
    var regex = parseTo && parseTo[0];
    var parser = parseTo && parseTo[1];
    if (parser) {
      array[i] = {
        regex,
        parser
      };
    } else {
      array[i] = token.replace(/^\[|\]$/g, "");
    }
  }
  return function(input) {
    var time = {};
    for (var _i = 0, start = 0; _i < length; _i += 1) {
      var _token = array[_i];
      if (typeof _token === "string") {
        start += _token.length;
      } else {
        var _regex = _token.regex, _parser = _token.parser;
        var part = input.slice(start);
        var match = _regex.exec(part);
        var value = match[0];
        _parser.call(time, value);
        input = input.replace(value, "");
      }
    }
    correctHours(time);
    return time;
  };
}
var parseFormattedInput = function parseFormattedInput2(input, format, utc2, dayjs3) {
  try {
    if (["x", "X"].indexOf(format) > -1) return new Date((format === "X" ? 1e3 : 1) * input);
    var parser = makeParser(format);
    var _parser2 = parser(input), year = _parser2.year, month = _parser2.month, day = _parser2.day, hours = _parser2.hours, minutes = _parser2.minutes, seconds = _parser2.seconds, milliseconds = _parser2.milliseconds, zone = _parser2.zone, week = _parser2.week;
    var now = /* @__PURE__ */ new Date();
    var d = day || (!year && !month ? now.getDate() : 1);
    var y = year || now.getFullYear();
    var M2 = 0;
    if (!(year && !month)) {
      M2 = month > 0 ? month - 1 : now.getMonth();
    }
    var h = hours || 0;
    var m = minutes || 0;
    var s = seconds || 0;
    var ms = milliseconds || 0;
    if (zone) {
      return new Date(Date.UTC(y, M2, d, h, m, s, ms + zone.offset * 60 * 1e3));
    }
    if (utc2) {
      return new Date(Date.UTC(y, M2, d, h, m, s, ms));
    }
    var newDate;
    newDate = new Date(y, M2, d, h, m, s, ms);
    if (week) {
      newDate = dayjs3(newDate).week(week).toDate();
    }
    return newDate;
  } catch (e) {
    return /* @__PURE__ */ new Date("");
  }
};
const customParseFormat = (function(o, C, d) {
  d.p.customParseFormat = true;
  if (o && o.parseTwoDigitYear) {
    parseTwoDigitYear = o.parseTwoDigitYear;
  }
  var proto2 = C.prototype;
  var oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    var date = cfg.date, utc2 = cfg.utc, args = cfg.args;
    this.$u = utc2;
    var format = args[1];
    if (typeof format === "string") {
      var isStrictWithoutLocale = args[2] === true;
      var isStrictWithLocale = args[3] === true;
      var isStrict = isStrictWithoutLocale || isStrictWithLocale;
      var pl = args[2];
      if (isStrictWithLocale) {
        pl = args[2];
      }
      locale = this.$locale();
      if (!isStrictWithoutLocale && pl) {
        locale = d.Ls[pl];
      }
      this.$d = parseFormattedInput(date, format, utc2, d);
      this.init();
      if (pl && pl !== true) this.$L = this.locale(pl).$L;
      if (isStrict && date != this.format(format)) {
        this.$d = /* @__PURE__ */ new Date("");
      }
      locale = {};
    } else if (format instanceof Array) {
      var len = format.length;
      for (var i = 1; i <= len; i += 1) {
        args[1] = format[i - 1];
        var result = d.apply(this, args);
        if (result.isValid()) {
          this.$d = result.$d;
          this.$L = result.$L;
          this.init();
          break;
        }
        if (i === len) this.$d = /* @__PURE__ */ new Date("");
      }
    } else {
      oldParse.call(this, cfg);
    }
  };
});
const LEVELS = { debug: 0, info: 1, warn: 2, error: 3, none: 4 };
let currentLevel = typeof process !== "undefined" && process.env?.NODE_ENV === "production" ? "warn" : "debug";
function setLogLevel(level) {
  currentLevel = level;
}
function createMethod(level, consoleFn) {
  return (...args) => {
    if (LEVELS[currentLevel] > LEVELS[level])
      return;
    if (args.length > 0 && typeof args[0] === "object" && args[0] !== null && !(args[0] instanceof Error)) {
      const ctx = args[0];
      const rest = args.slice(1);
      consoleFn(`[${level.toUpperCase()}]`, ...rest, ctx);
    } else {
      consoleFn(`[${level.toUpperCase()}]`, ...args);
    }
  };
}
const defaultLogger = {
  debug: createMethod("debug", console.log),
  info: createMethod("info", console.log),
  warn: createMethod("warn", console.warn),
  error: createMethod("error", console.error)
};
let activeLogger = defaultLogger;
function setLogger(logger) {
  activeLogger = logger;
}
const cmsLogger = {
  debug: (...args) => activeLogger.debug(...args),
  info: (...args) => activeLogger.info(...args),
  warn: (...args) => activeLogger.warn(...args),
  error: (...args) => activeLogger.error(...args)
};
dayjs.extend(customParseFormat);
class Rule {
  _required = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _rules = [];
  _level = "error";
  _message;
  static FIELD_REF = /* @__PURE__ */ Symbol("fieldReference");
  static valueOfField(path) {
    return {
      __fieldReference: true,
      path
    };
  }
  valueOfField(path) {
    return Rule.valueOfField(path);
  }
  required() {
    const newRule = this.clone();
    newRule._required = true;
    return newRule;
  }
  optional() {
    const newRule = this.clone();
    newRule._required = false;
    return newRule;
  }
  min(len) {
    const newRule = this.clone();
    newRule._rules.push({ type: "min", constraint: len });
    return newRule;
  }
  max(len) {
    const newRule = this.clone();
    newRule._rules.push({ type: "max", constraint: len });
    return newRule;
  }
  length(len) {
    const newRule = this.clone();
    newRule._rules.push({ type: "length", constraint: len });
    return newRule;
  }
  unique() {
    const newRule = this.clone();
    newRule._rules.push({ type: "unique" });
    return newRule;
  }
  email() {
    const newRule = this.clone();
    newRule._rules.push({ type: "email" });
    return newRule;
  }
  uri(options) {
    const newRule = this.clone();
    newRule._rules.push({ type: "uri", constraint: options });
    return newRule;
  }
  regex(pattern, name) {
    const newRule = this.clone();
    newRule._rules.push({ type: "regex", constraint: { pattern, name } });
    return newRule;
  }
  positive() {
    const newRule = this.clone();
    newRule._rules.push({ type: "positive" });
    return newRule;
  }
  negative() {
    const newRule = this.clone();
    newRule._rules.push({ type: "negative" });
    return newRule;
  }
  integer() {
    const newRule = this.clone();
    newRule._rules.push({ type: "integer" });
    return newRule;
  }
  greaterThan(num) {
    const newRule = this.clone();
    newRule._rules.push({ type: "greaterThan", constraint: num });
    return newRule;
  }
  lessThan(num) {
    const newRule = this.clone();
    newRule._rules.push({ type: "lessThan", constraint: num });
    return newRule;
  }
  date(format) {
    const newRule = this.clone();
    newRule._rules.push({ type: "date", constraint: format || "YYYY-MM-DD" });
    return newRule;
  }
  datetime(dateFormat, timeFormat) {
    const newRule = this.clone();
    const fullFormat = `${dateFormat || "YYYY-MM-DD"} ${timeFormat || "HH:mm"}`;
    newRule._rules.push({ type: "datetime", constraint: fullFormat });
    return newRule;
  }
  custom(fn) {
    const newRule = this.clone();
    newRule._rules.push({ type: "custom", constraint: fn });
    return newRule;
  }
  error(message) {
    const newRule = this.clone();
    newRule._level = "error";
    newRule._message = message;
    return newRule;
  }
  warning(message) {
    const newRule = this.clone();
    newRule._level = "warning";
    newRule._message = message;
    return newRule;
  }
  info(message) {
    const newRule = this.clone();
    newRule._level = "info";
    newRule._message = message;
    return newRule;
  }
  clone() {
    const newRule = new Rule();
    newRule._required = this._required;
    newRule._rules = [...this._rules];
    newRule._level = this._level;
    newRule._message = this._message;
    return newRule;
  }
  async validate(value, context = {}) {
    const markers = [];
    if (this._required && (value === void 0 || value === null || value === "")) {
      markers.push({
        level: this._level,
        message: this._message || "Required",
        path: context.path
      });
    }
    if (!this._required && (value === void 0 || value === null || value === "")) {
      return markers;
    }
    for (const rule of this._rules) {
      try {
        const result = await this.validateRule(rule, value, context);
        if (result) {
          markers.push({
            level: this._level,
            message: this._message || result,
            path: context.path
          });
        }
      } catch (error) {
        markers.push({
          level: "error",
          message: `Validation error: ${error instanceof Error ? error.message : "Unknown error"}`,
          path: context.path
        });
      }
    }
    return markers;
  }
  async validateRule(rule, value, context) {
    switch (rule.type) {
      case "min":
        if (typeof value === "string" && value.length < rule.constraint) {
          return `Must be at least ${rule.constraint} characters`;
        }
        if (typeof value === "number" && value < rule.constraint) {
          return `Must be at least ${rule.constraint}`;
        }
        if (Array.isArray(value) && value.length < rule.constraint) {
          return `Must have at least ${rule.constraint} item${rule.constraint === 1 ? "" : "s"}`;
        }
        break;
      case "max":
        if (typeof value === "string" && value.length > rule.constraint) {
          return `Must be at most ${rule.constraint} characters`;
        }
        if (typeof value === "number" && value > rule.constraint) {
          return `Must be at most ${rule.constraint}`;
        }
        if (Array.isArray(value) && value.length > rule.constraint) {
          return `Must have at most ${rule.constraint} item${rule.constraint === 1 ? "" : "s"}`;
        }
        break;
      case "length":
        if (Array.isArray(value) && value.length !== rule.constraint) {
          return `Must have exactly ${rule.constraint} item${rule.constraint === 1 ? "" : "s"}`;
        }
        if (typeof value === "string" && value.length !== rule.constraint) {
          return `Must be exactly ${rule.constraint} characters`;
        }
        break;
      case "unique":
        if (Array.isArray(value)) {
          const seen = /* @__PURE__ */ new Set();
          for (const item of value) {
            const normalized = this.normalizeForComparison(item);
            const serialized = JSON.stringify(normalized);
            if (seen.has(serialized)) {
              return "All items must be unique";
            }
            seen.add(serialized);
          }
        }
        break;
      case "email":
        if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "Must be a valid email address";
        }
        break;
      case "uri":
        if (typeof value === "string") {
          const opts = rule.constraint || {};
          const schemes = opts.scheme || [/^https?$/];
          const allowRelative = opts.allowRelative || false;
          const relativeOnly = opts.relativeOnly || false;
          const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(value);
          const isProtocolRelative = value.startsWith("//");
          if (relativeOnly) {
            if (hasScheme || isProtocolRelative) {
              return "Must be a relative URL";
            }
            if (!value.startsWith("/") && !value.startsWith(".") && !value.startsWith("#") && !value.startsWith("?")) {
              return "Must be a relative URL starting with /, ., #, or ?";
            }
          } else if (!hasScheme && !isProtocolRelative) {
            if (!allowRelative) {
              return "Must be an absolute URL";
            }
            if (!value.startsWith("/") && !value.startsWith(".") && !value.startsWith("#") && !value.startsWith("?")) {
              return "Must be a valid relative URL";
            }
          } else {
            try {
              const url = new URL(value);
              const urlScheme = url.protocol.slice(0, -1);
              const schemeMatches = schemes.some((s) => s instanceof RegExp ? s.test(urlScheme) : s === urlScheme);
              if (!schemeMatches) {
                const schemeList = schemes.map((s) => s instanceof RegExp ? s.toString() : s).join(", ");
                return `URL scheme must be one of: ${schemeList}`;
              }
            } catch {
              return "Must be a valid URL";
            }
          }
        }
        break;
      case "regex":
        if (typeof value === "string" && !rule.constraint.pattern.test(value)) {
          return `Must match pattern${rule.constraint.name ? ` (${rule.constraint.name})` : ""}`;
        }
        break;
      case "positive":
        if (typeof value === "number" && value <= 0) {
          return "Must be positive";
        }
        break;
      case "negative":
        if (typeof value === "number" && value >= 0) {
          return "Must be negative";
        }
        break;
      case "integer":
        if (typeof value === "number" && !Number.isInteger(value)) {
          return "Must be an integer";
        }
        break;
      case "date": {
        if (typeof value === "string") {
          const format = rule.constraint || "YYYY-MM-DD";
          cmsLogger.debug("[Rule.validate] DATE validation", { value, format });
          const parsed = dayjs(value, format, true);
          cmsLogger.debug("[Rule.validate] DATE parsed", {
            isValid: parsed.isValid(),
            parsed: parsed.format()
          });
          if (!parsed.isValid()) {
            cmsLogger.debug("[Rule.validate] DATE validation FAILED - invalid format");
            return `Invalid date format. Expected: ${format}`;
          }
          if (parsed.format(format) !== value) {
            cmsLogger.debug("[Rule.validate] DATE validation FAILED - format mismatch", {
              expected: value,
              got: parsed.format(format)
            });
            return `Invalid date. Expected format: ${format}`;
          }
          cmsLogger.debug("[Rule.validate] DATE validation PASSED");
        }
        break;
      }
      case "datetime": {
        if (typeof value === "string") {
          const format = rule.constraint || "YYYY-MM-DD HH:mm";
          cmsLogger.debug("[Rule.validate] DATETIME validation", { value, format });
          const parsed = dayjs(value, format, true);
          cmsLogger.debug("[Rule.validate] DATETIME parsed", {
            isValid: parsed.isValid(),
            parsed: parsed.format()
          });
          if (!parsed.isValid()) {
            cmsLogger.debug("[Rule.validate] DATETIME validation FAILED - invalid format");
            return `Invalid datetime format. Expected: ${format}`;
          }
          if (parsed.format(format) !== value) {
            cmsLogger.debug("[Rule.validate] DATETIME validation FAILED - format mismatch", {
              expected: value,
              got: parsed.format(format)
            });
            return `Invalid datetime. Expected format: ${format}`;
          }
          cmsLogger.debug("[Rule.validate] DATETIME validation PASSED");
        }
        break;
      }
      case "custom": {
        const customResult = await rule.constraint(value, context);
        if (customResult === false) {
          return "Validation failed";
        }
        if (typeof customResult === "string") {
          return customResult;
        }
        if (Array.isArray(customResult) && customResult.length > 0) {
          return customResult[0].message;
        }
        break;
      }
    }
    return null;
  }
  isRequired() {
    return this._required;
  }
  // Helper method to normalize objects for comparison (exclude _key)
  normalizeForComparison(value) {
    if (value === null || value === void 0) {
      return value;
    }
    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeForComparison(item));
    }
    if (typeof value === "object") {
      const normalized = {};
      for (const [key, val] of Object.entries(value)) {
        if (key !== "_key") {
          normalized[key] = this.normalizeForComparison(val);
        }
      }
      return normalized;
    }
    return value;
  }
}
var REGEX_VALID_OFFSET_FORMAT = /[+-]\d\d(?::?\d\d)?/g;
var REGEX_OFFSET_HOURS_MINUTES_FORMAT = /([+-]|\d\d)/g;
function offsetFromString(value) {
  if (value === void 0) {
    value = "";
  }
  var offset = value.match(REGEX_VALID_OFFSET_FORMAT);
  if (!offset) {
    return null;
  }
  var _ref = ("" + offset[0]).match(REGEX_OFFSET_HOURS_MINUTES_FORMAT) || ["-", 0, 0], indicator = _ref[0], hoursOffset = _ref[1], minutesOffset = _ref[2];
  var totalOffsetInMinutes = +hoursOffset * 60 + +minutesOffset;
  if (totalOffsetInMinutes === 0) {
    return 0;
  }
  return indicator === "+" ? totalOffsetInMinutes : -totalOffsetInMinutes;
}
const utc = (function(option, Dayjs2, dayjs3) {
  var proto2 = Dayjs2.prototype;
  dayjs3.utc = function(date) {
    var cfg = {
      date,
      utc: true,
      args: arguments
    };
    return new Dayjs2(cfg);
  };
  proto2.utc = function(keepLocalTime) {
    var ins = dayjs3(this.toDate(), {
      locale: this.$L,
      utc: true
    });
    if (keepLocalTime) {
      return ins.add(this.utcOffset(), MIN);
    }
    return ins;
  };
  proto2.local = function() {
    return dayjs3(this.toDate(), {
      locale: this.$L,
      utc: false
    });
  };
  var oldParse = proto2.parse;
  proto2.parse = function(cfg) {
    if (cfg.utc) {
      this.$u = true;
    }
    if (!this.$utils().u(cfg.$offset)) {
      this.$offset = cfg.$offset;
    }
    oldParse.call(this, cfg);
  };
  var oldInit = proto2.init;
  proto2.init = function() {
    if (this.$u) {
      var $d = this.$d;
      this.$y = $d.getUTCFullYear();
      this.$M = $d.getUTCMonth();
      this.$D = $d.getUTCDate();
      this.$W = $d.getUTCDay();
      this.$H = $d.getUTCHours();
      this.$m = $d.getUTCMinutes();
      this.$s = $d.getUTCSeconds();
      this.$ms = $d.getUTCMilliseconds();
    } else {
      oldInit.call(this);
    }
  };
  var oldUtcOffset = proto2.utcOffset;
  proto2.utcOffset = function(input, keepLocalTime) {
    var _this$$utils = this.$utils(), u3 = _this$$utils.u;
    if (u3(input)) {
      if (this.$u) {
        return 0;
      }
      if (!u3(this.$offset)) {
        return this.$offset;
      }
      return oldUtcOffset.call(this);
    }
    if (typeof input === "string") {
      input = offsetFromString(input);
      if (input === null) {
        return this;
      }
    }
    var offset = Math.abs(input) <= 16 ? input * 60 : input;
    if (offset === 0) {
      return this.utc(keepLocalTime);
    }
    var ins = this.clone();
    if (keepLocalTime) {
      ins.$offset = offset;
      ins.$u = false;
      return ins;
    }
    var localTimezoneOffset = this.$u ? this.toDate().getTimezoneOffset() : -1 * this.utcOffset();
    ins = this.local().add(offset + localTimezoneOffset, MIN);
    ins.$offset = offset;
    ins.$x.$localOffset = localTimezoneOffset;
    return ins;
  };
  var oldFormat = proto2.format;
  var UTC_FORMAT_DEFAULT = "YYYY-MM-DDTHH:mm:ss[Z]";
  proto2.format = function(formatStr) {
    var str = formatStr || (this.$u ? UTC_FORMAT_DEFAULT : "");
    return oldFormat.call(this, str);
  };
  proto2.valueOf = function() {
    var addedOffset = !this.$utils().u(this.$offset) ? this.$offset + (this.$x.$localOffset || this.$d.getTimezoneOffset()) : 0;
    return this.$d.valueOf() - addedOffset * MILLISECONDS_A_MINUTE;
  };
  proto2.isUTC = function() {
    return !!this.$u;
  };
  proto2.toISOString = function() {
    return this.toDate().toISOString();
  };
  proto2.toString = function() {
    return this.toDate().toUTCString();
  };
  var oldToDate = proto2.toDate;
  proto2.toDate = function(type) {
    if (type === "s" && this.$offset) {
      return dayjs3(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate();
    }
    return oldToDate.call(this);
  };
  var oldDiff = proto2.diff;
  proto2.diff = function(input, units, _float) {
    if (input && this.$u === input.$u) {
      return oldDiff.call(this, input, units, _float);
    }
    var localThis = this.local();
    var localInput = dayjs3(input).local();
    return oldDiff.call(localThis, localInput, units, _float);
  };
});
dayjs.extend(customParseFormat);
dayjs.extend(utc);
function convertDateToUserFormat(value, userFormat) {
  const parsedISO = dayjs(value, "YYYY-MM-DD", true);
  if (parsedISO.isValid()) {
    return parsedISO.format(userFormat);
  }
  const parsedUser = dayjs(value, userFormat, true);
  if (parsedUser.isValid()) {
    return value;
  }
  return value;
}
function convertDateToISO(value, userFormat) {
  const parsedUser = dayjs(value, userFormat, true);
  if (parsedUser.isValid()) {
    return parsedUser.format("YYYY-MM-DD");
  }
  const parsedISO = dayjs(value, "YYYY-MM-DD", true);
  if (parsedISO.isValid()) {
    return value;
  }
  return value;
}
function convertDateTimeToUserFormat(value, dateFormat, timeFormat = "HH:mm") {
  const userFormat = `${dateFormat} ${timeFormat}`;
  const parsedISO = dayjs(value, "YYYY-MM-DDTHH:mm:ss[Z]", true);
  if (parsedISO.isValid()) {
    return parsedISO.format(userFormat);
  }
  const parsedUser = dayjs(value, userFormat, true);
  if (parsedUser.isValid()) {
    return value;
  }
  return value;
}
function convertDateTimeToISO(value, dateFormat, timeFormat = "HH:mm") {
  const userFormat = `${dateFormat} ${timeFormat}`;
  cmsLogger.debug("[convertDateTimeToISO]", { value, userFormat });
  const parsedUser = dayjs(value, userFormat, true);
  if (parsedUser.isValid()) {
    const result = parsedUser.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    cmsLogger.debug("[convertDateTimeToISO] User format parse successful, converting to UTC:", result);
    return result;
  }
  const parsedISO = dayjs(value, "YYYY-MM-DDTHH:mm:ss[Z]", true);
  if (parsedISO.isValid()) {
    const result = parsedISO.utc().format("YYYY-MM-DDTHH:mm:ss[Z]");
    cmsLogger.debug("[convertDateTimeToISO] ISO parse successful:", result);
    return result;
  }
  cmsLogger.debug("[convertDateTimeToISO] Invalid - returning as-is");
  return value;
}
function normalizeDateFields(data, schema) {
  const normalizedData = { ...data };
  const dataForValidation = { ...data };
  cmsLogger.debug("[normalizeDateFields] Starting normalization...");
  cmsLogger.debug("[normalizeDateFields] Input data:", data);
  for (const field of schema.fields) {
    if (field.type === "date" && normalizedData[field.name]) {
      const dateField = field;
      const userFormat = dateField.options?.dateFormat || "YYYY-MM-DD";
      const dateValue = normalizedData[field.name];
      cmsLogger.debug(`[normalizeDateFields] Processing DATE field "${field.name}"`, {
        originalValue: dateValue,
        userFormat
      });
      if (typeof dateValue === "string") {
        normalizedData[field.name] = convertDateToISO(dateValue, userFormat);
        dataForValidation[field.name] = convertDateToUserFormat(dateValue, userFormat);
        cmsLogger.debug(`[normalizeDateFields] Converted DATE field "${field.name}"`, {
          normalizedValue: normalizedData[field.name],
          validationValue: dataForValidation[field.name]
        });
      }
    } else if (field.type === "datetime" && normalizedData[field.name]) {
      const dateTimeField = field;
      const dateFormat = dateTimeField.options?.dateFormat || "YYYY-MM-DD";
      const timeFormat = dateTimeField.options?.timeFormat || "HH:mm";
      const dateTimeValue = normalizedData[field.name];
      cmsLogger.debug(`[normalizeDateFields] Processing DATETIME field "${field.name}"`, {
        originalValue: dateTimeValue,
        dateFormat,
        timeFormat,
        combinedFormat: `${dateFormat} ${timeFormat}`
      });
      if (typeof dateTimeValue === "string") {
        normalizedData[field.name] = convertDateTimeToISO(dateTimeValue, dateFormat, timeFormat);
        dataForValidation[field.name] = convertDateTimeToUserFormat(dateTimeValue, dateFormat, timeFormat);
        cmsLogger.debug(`[normalizeDateFields] Converted DATETIME field "${field.name}"`, {
          normalizedValue: normalizedData[field.name],
          validationValue: dataForValidation[field.name]
        });
      }
    }
  }
  cmsLogger.debug("[normalizeDateFields] Final result:", {
    normalizedData,
    dataForValidation
  });
  return { normalizedData, dataForValidation };
}
export {
  Rule as R,
  setLogLevel as a,
  cmsLogger as c,
  dayjs as d,
  normalizeDateFields as n,
  setLogger as s,
  utc as u
};
