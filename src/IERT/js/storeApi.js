/*
	dataStorage, умное и быстрое хранилище справочников ЖД сети
	(c) 2019-2020, Shinderov Roman
	https://github.com/Rootmen/dataStorage
*/

// import XmlQuery from '@/IERT/js/xmlQuery'
// import svg from '@/public/img/optimised.svg'

const apiStore = (function () {
  var API = null, APIstatus = 'init';
  var storeType = [
    {
      name: "dors",
      fname: "DorsCfto",
      storeName: "dors",
      keyName: "numDB",
      url: '/jaxrpc-DBQuest/HTTPQuery?DefName=CHESS&codePage=UTF-8&xmlQuery=<QuerySet refid="GET_XLS_DOR_CODE"></QuerySet>'
    }];
  (function initDBstore() {
    var db, unstable = !window.indexedDB, dbName = 'SPF2data', version = 1, ready = false,
      indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
      IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
      IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange,
      urlToLoadJaxrpc = (window.location.hostname === "localhost") ? "http://10.248.62.211:8080" : "http://" + ((window.location.host) ? window.location.host : "192.168.10.3:8090");

    (function scriptStorage() {
      var request = indexedDB.open(dbName, version);
      request.onerror = function () {
        errorInterceptor("001")
      };
      request.onsuccess = function (event) {
        db = event.target.result;
        db.onerror = function () {
          errorInterceptor("004")
        };
        db.onversionchange = function () {
          db.close();
          APIstatus = 'init';
          setTimeout(initDBstore, 100);
        };
        var lastUpdate = window.localStorage.getItem('storeDataUpdate');
        if (lastUpdate === null) {
          updateStore();
        } else {
          if ((new Date(lastUpdate)).valueOf() < (new Date()).valueOf() - 4 * 60 * 60 * 1000) {
            updateStore();
          } else {
            initAPI();
          }
        }
      };
      request.onupgradeneeded = function (event) {
        var db = event.target.result;
        switch (db.version) {
          case db.version:
            for (var g = 0; g < storeType.length; g++) {
              try {
                db.deleteObjectStore(storeType[g].storeName);
              } catch (e) {
              }
              db.createObjectStore(storeType[g].storeName, {keyPath: storeType[g].keyName});
            }
            break;
          default:
            db.close();
            indexedDB.deleteDatabase(dbName);
            setTimeout(initDBstore, 4);
            break;
        }
        updateStore();
      };
    })();

    function updateStore() {
      APIstatus = 'update';
      window.localStorage.setItem('storeDataUpdate', new Date().toUTCString());
      var countData = storeType.length, ajaxOptionsForms = {
        type: "GET",
        dataType: "JSON",
        cache: false,
        error: function () {
          errorInterceptor("005")
        },
        complete: function () {
          countData--;
        }
      }, storeData = {};
      for (var g = 0; g < storeType.length; g++) {
        ajaxOptionsForms.success = (function () {
          var storeAjax = storeType[g];
          return function (data) {
            storeData[storeAjax.name] = data.rows;
          }
        })();
        ajaxOptionsForms.url = urlToLoadJaxrpc + storeType[g].url;
        //$.ajax(ajaxOptionsForms);
      }

      function completeLoad() {
        for (var g = 0; g < storeType.length; g++) {
          try {
            var transaction = db.transaction(storeType[g].storeName, "readwrite").objectStore(storeType[g].storeName);
          } catch (e) {
            db.close();
            indexedDB.deleteDatabase(dbName);
            setTimeout(initDBstore, 4);
            return;
          }
          try {
            transaction.clear();
          } catch (e) {
          }
          for (var j = 0; j < storeData[storeType[g].name].length; j++) {
            storeData[storeType[g].name][j].numDB = j;
            transaction.put(storeData[storeType[g].name][j]);
          }
        }
        return initAPI()
      }

      function updateStoreLoop() {
        return (countData > 0) ? setTimeout(updateStoreLoop, 4) : completeLoad();
      }

      setTimeout(updateStoreLoop, 4);
    }

    function initAPI() {
      APIstatus = 'ready';
      API = function () {
        var self = {};
        for (var g = 0; g < storeType.length; g++) {
          self["get" + storeType[g].fname] = (function () {
            var name = storeType[g].storeName;
            return function (callback, filter) {
              if (callback === undefined || "function" !== typeof callback) {
                throw 'Ошибка, функция callback не указана или ее тип не function';
              }
              try {
                var transaction = db.transaction(name).objectStore(name);
              } catch (e) {
                db.close();
                indexedDB.deleteDatabase(dbName);
                APIstatus = 'init';
                setTimeout(initDBstore, 4);

                function initAPIwait() {
                  if (APIstatus === 'ready') {
                    if (self["get" + name]) {
                      self["get" + name](callback, filter)
                    } else {
                      callback(undefined);
                    }
                    return;
                  }
                  setTimeout(initAPIwait, 4);
                }

                setTimeout(initAPIwait, 4);
                return true;
              }
              var callbackFunction = function () {
                callback(event.target.result);
              };
              if (filter === undefined) {
                if (transaction.getAll) {
                  transaction.getAll().onsuccess = callbackFunction;
                } else {
                  var dataOut = [], curs;
                  curs = transaction.openCursor();
                  curs.onsuccess = function (event) {
                    var cursor = event.target.result;
                    if (cursor) {
                      dataOut.push(cursor.value);
                      cursor.continue();
                    } else {
                      callback(dataOut)
                    }
                  };
                  curs.onerror = function () {
                    db.close();
                    indexedDB.deleteDatabase(dbName);
                    APIstatus = 'init';
                    setTimeout(initDBstore, 4);

                    function initAPIwait() {
                      if (APIstatus === 'ready') {
                        if (self["get" + name]) {
                          self["get" + name](callback, filter)
                        } else {
                          callback(undefined);
                        }
                        return;
                      }
                      setTimeout(initAPIwait, 4);
                    }

                    setTimeout(initAPIwait, 4);
                  }
                }
              } else {
                transaction.get(filter).onsuccess = callbackFunction;
              }
              return true;
            }
          })()
        }
        self.updateStore = function () {
          if (APIstatus !== 'ready') {
            console.log('Обновление данных уже идет');
            return false;
          }
          updateStore();
          return true;
        };
        self.getLastUpdateData = function () {
          return new Date(window.localStorage.getItem('storeDataUpdate'));
        };
        self.getStatus = function () {
          return APIstatus;
        };
        return self;
      }
    }
  })();

  function getAPI() {
    APIstatus = 'ready';
    return (API === null) ? {
      getStatus: function () {
        return APIstatus;
      }
    } : API();
  }
  return getAPI
})();
export default apiStore;
