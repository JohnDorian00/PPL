'use strict';

import $ from "@/vendor/jquery-3.4.1.min"

const XmlQuery =  (function () {
  let latId = 0, activeQuery = new Map();
  let lastKey = [];
  document.addEventListener('keypress', function (event) {
    lastKey = [lastKey[0], lastKey[1], event.key];
    if (lastKey[0] === 'f' && lastKey[1] === 'f' && lastKey[2] === 'f') {
      lastKey[0] = [];
      console.log("3F");
      allQueryWindows();
    }
  });


  function allQueryWindows() {
    return null;
  }


  return function (options) {
    options = options || {};
    let xmlFiltered = {}, ajax = null, querySet = options.querySet;
    let queryId = latId++, self = this, ajaxUpdateStatus = null, url = options.url || '';
    activeQuery.set(latId, this);
    this.setUrl = function (urlP) {
      return (url = urlP);
    };
    this.setQueryName = function (name) {
      return (querySet = name);
    };
    this.setFilter = function (name, data, type, param, len) {
      if (!(type === "text" || type === "mass" || type === "date" || type === "object")) {
        return false;
      }
      xmlFiltered[name] = {'type': type, 'data': data, 'param': param, 'len': len};
      return true;
    };
    this.deleteFilter = function (name) {
      if (!xmlFiltered[name]) {
        return false;
      }
      delete xmlFiltered[name];
      return true;
    };
    this.clearFilter = function () {
      xmlFiltered = {};
    };
    this.getFilter = function (name) {
      return ((xmlFiltered[name]) ? xmlFiltered[name].data : undefined);
    };
    this.getUrl = function () {
      if (!xmlFiltered) {
        return;
      }
      let keys = Object.keys(xmlFiltered), textQuery = "", counterSum = 0;
      for (let g = 0; g < keys.length; g++) {
        let thisParam = "";
        switch (xmlFiltered[keys[g]].type) {
          case 'text':
            thisParam += xmlFiltered[keys[g]].data;
            if (thisParam !== "") {
              counterSum++;
            }
            break;
          case 'mass':
            if (xmlFiltered[keys[g]].data.length !== xmlFiltered[keys[g]].len) {
              for (let j = 0; j < xmlFiltered[keys[g]].data.length; j++) {
                thisParam += "," + xmlFiltered[keys[g]].data[j][xmlFiltered[keys[g]].param];
                counterSum++;
              }
              thisParam = thisParam.substr(1);
            }
            break;
          case 'date':
            thisParam += xmlFiltered[keys[g]].data.format("yyyy-mm-dd HH:MM:ss");
            counterSum++;
            break;
          default:
            break;
        }
        thisParam = '<TextParam ID="' + keys[g] + '">' + thisParam + '</TextParam>';
        textQuery += thisParam;
      }
      return textQuery;
    };
    this.query = function (type, success, error, statusCharge) {
      if (ajax) {
        return false;
      }
      let query = '<QuerySet refid="' + querySet + '">' + this.getUrl() + '<RefID ID="ResultType">JSON_Q</RefID></QuerySet>';
      console.log("url ", this.getUrl());
      ajax = $.ajax({
        url: url,
        dataType: type,
        contentType: "application/xml",
        type: "POST",
        error: error,
        success: success,
        complete: this.computedAjax,
        data: query
      });
      if (statusCharge) {
        ajax.onreadystatechange = statusCharge;
      }
      return true;
    };
    this.queryAbort = function () {
      if (ajax) {
        ajax.abort();
      } else {
        return false;
      }
      this.computedAjax();
      return true;
    };
    this.computedAjax = function () {
      ajax = null;
    };
    this.destroy = function () {
      activeQuery.delete(queryId);
    };
  };
})();

export default XmlQuery;
