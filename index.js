function Forms(client) {
  this.client = client;
}

function padZeros(val) {
  val = String(val);
  while (val.length < 2) {
    val = '0' + val;
  }
  return val;
}

var dateFormatters = {
  time: function (dateObj) {
    return [dateObj.getHours(), dateObj.getMinutes(), dateObj.getSeconds()]
      .map(padZeros)
      .join(':');
  },
  date: function(dateObj) {
    return [dateObj.getFullYear(), dateObj.getMonth() + 1, dateObj.getDate()]
      .map(padZeros)
      .join('-');
  }
};

/**
 * Fill out one or more input elements (regardless of visibility)
 * @param {Element} elem The input element to change (when setting a single
 *                        value) or the parent node (when setting multiple
 *                        values).
 * @param {object} value The value to set (when setting a single value) or a
 *                       hash of form element names to corresponding values
 *                       (when setting multiple values)
 */
Forms.prototype.fill = function(elem, value, done) {
  setValue.call(this, elem, value, done);
};

function setValue(elem, value, done) {
  elem.getAttribute('type', function(err, type) {
    type = type.trim().toLowerCase();
    if (value instanceof Date && dateFormatters.hasOwnProperty(type)) {
      value = dateFormatters[type](value);
    }
    elem.client.executeScript(function(elem, value) {
      elem.value = value;
    }, [elem, value], done);
  });
}

module.exports = function(client, options) {
  return new Forms(client);
};
