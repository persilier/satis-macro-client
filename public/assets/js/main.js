/* eslint-disable no-undef */
// add parser through the tablesorter addParser method
$.tablesorter.addParser({
  id: "dates",
  is: function(s, table, cell, $cell) {
    return false;
  },
  format: function(s, table, cell, cellIndex) {
    return `${s}`.substring(0, 10);
  },
  type: "date",
});

$(function() {
  try {
    if ($("table")) {
      $("table").trigger("updateAll");
    }
    $("table").tablesorter({});
  } catch (error) {
    console.log(error);
  }
});
