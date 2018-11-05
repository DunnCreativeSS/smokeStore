"use strict";

var _get = require("lodash/get");

var _get2 = _interopRequireDefault(_get);

var _ecc = require("./auth/ecc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function (steemAPI) {
  function numberWithCommas(x) {
    return x.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function vestingSteem(account, gprops) {
    var vests = parseFloat(account.vesting_shares.split(" ")[0]);
    var total_vests = parseFloat(gprops.total_vesting_shares.split(" ")[0]);
    var total_vest_steem = parseFloat(gprops.total_vesting_fund_steem.split(" ")[0]);
    var vesting_steemf = total_vest_steem * (vests / total_vests);
    return vesting_steemf;
  }

  function estimateAccountValue(account) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        gprops = _ref.gprops,
        vesting_steem = _ref.vesting_steem;

    var promises = [];
    var username = account.name;
    var assetPrecision = 1000;

    if (!vesting_steem) {
      vesting_steem = vestingSteem(account, gprops);
    }

    return Promise.all(promises).then(function () {
      var balance_steem = parseFloat(account.balance.split(" ")[0]);
      var total_steem = vesting_steem + balance_steem;
      return total_steem.toFixed(2);
    });
  }

  function createSuggestedPassword() {
    var PASSWORD_LENGTH = 32;
    var privateKey = _ecc.key_utils.get_random_key();
    return privateKey.toWif().substring(3, 3 + PASSWORD_LENGTH);
  }

  return {
    reputation: function reputation(_reputation) {
      if (_reputation == null) return _reputation;
      _reputation = parseInt(_reputation);
      var rep = String(_reputation);
      var neg = rep.charAt(0) === "-";
      rep = neg ? rep.substring(1) : rep;
      var str = rep;
      var leadingDigits = parseInt(str.substring(0, 4));
      var log = Math.log(leadingDigits) / Math.log(10);
      var n = str.length - 1;
      var out = n + (log - parseInt(log));
      if (isNaN(out)) out = 0;
      out = Math.max(out - 9, 0);
      out = (neg ? -1 : 1) * out;
      out = out * 9 + 25;
      out = parseInt(out);
      return out;
    },

    vestToSteem: function vestToSteem(vestingShares, totalVestingShares, totalVestingFundSteem) {
      return parseFloat(totalVestingFundSteem) * (parseFloat(vestingShares) / parseFloat(totalVestingShares));
    },

    commentPermlink: function commentPermlink(parentAuthor, parentPermlink) {
      var timeStr = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
      parentPermlink = parentPermlink.replace(/(-\d{8}t\d{9}z)/g, "");
      return "re-" + parentAuthor + "-" + parentPermlink + "-" + timeStr;
    },

    amount: function amount(_amount, asset) {
      return _amount.toFixed(3) + " " + asset;
    },
    numberWithCommas: numberWithCommas,
    vestingSteem: vestingSteem,
    estimateAccountValue: estimateAccountValue,
    createSuggestedPassword: createSuggestedPassword
  };
};