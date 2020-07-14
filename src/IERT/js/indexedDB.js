/*
* Модуль indexedDB, для хранения данных о станция и графов связей с прочей информацией
* */
import XmlQuery from './xmlQuery'

let indexeddbCreator = (function () {
    try {
      let db = {
        database: (window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB),
        transaction: (window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction),
        keyRange: (window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange)
      };
      if (db.database === undefined || db.transaction === undefined || db.keyRange === undefined) {
        console.error('Ошибка поиска функций indexedDB, возможно браузер их не поддерживает');
        return false;
      }
      return function (options) {
        try {
          let parameters = ['version', 'definitions', 'databaseName', 'host', 'initDatabase', 'updateDatabaseAjax', 'updateDatabase', 'dataProvider', 'storeName'],
            g, self = this;
          self.statusID = 'start';
          for (g = 0; g < parameters.length; g++) {
            if (options[parameters[g]] === undefined) {
              console.error('Настрока параемтров indexedDB неправильная, параметр ' + parameters[g] + ' обязателен но он не указан');
              return {dbStatus: 'error'};
            }
            this[parameters[g]] = options[parameters[g]];
          }
          let initDatabase = function (ev) {
            options.initDatabase(ev, self)
          }, mainRequest = db.database.open(options.databaseName, options.version);
          this.updateDatabaseAjax = options.updateDatabaseAjax;
          this.updateDatabase = options.updateDatabase;
          this.dataProvider = options.dataProvider;
          mainRequest.onerror = function () {
            console.error("Ошрбка запуска базы данных indexedDB");
          };
          mainRequest.onsuccess = function (event) {
            self.connection = event.target.result;
            self.connection.onerror = function (event) {
              console.error("Ошибка базы данных: " + event.target.errorCode);
            };
            self.connection.onversionchange = function () {
              self.connection.close();
              console.error("Ошибка запуска базы данных indexedDB");
            };
            try {
              if (new Date(localStorage.getItem('IERTstation_last_update')).valueOf() < new Date().valueOf() - 3 * 60 * 60 * 1000) {
                self.updateDatabaseAjax(self);
              }
            } catch (e) {
              self.updateDatabaseAjax(self);
            }
            setInterval(function () {
              localStorage.setItem('IERTstation_last_update', (new Date()).toJSON());
              self.updateDatabaseAjax(self);
            }, 60 * 60 * 60 * 3)
          };
          mainRequest.onupgradeneeded = initDatabase;
          return function () {
            return self.dataProvider(self);
          }
        } catch
          (e) {
          console.trace(e);
          return {dbStatus: 'error'};
        }
      }
    } catch
      (e) {
      console.trace(e);
      return {dbStatus: 'error'};
    }
  }
)
();
let optionStation = {
  version: 1,
  host: (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') ? location.origin : "http://10.248.62.211:8080",
  definitions: 'IERTmaps',
  databaseName: 'IERTstation',
  storeName: 'station',
  initDatabase: function (event, self) {
    self.statusID = 'update';
    if (!self.connection) {
      self.connection = event.target.result;
    }
    let station = self.connection.createObjectStore(self.storeName, {keyPath: "stan_id"});
    station.createIndex("esr_ind", "esr", {unique: true});
    station.createIndex("name_ind", "name", {unique: false});
  },
  updateDatabaseAjax: function (self) {
    self.statusID = 'updateAjax';
    let xmlQuery = new XmlQuery({
      url: self.host + "/jaxrpc-DBQuest/HTTPQuery?codePage=UTF-8&DefName=" + self.definitions,
      querySet: 'GetSimpleMapData'
    });
    xmlQuery.query('json', function (data) {
      self.updateDatabase(data, self)
    }, function () {
      xmlQuery.destroy();
      setTimeout(self.updateDatabaseAjax, 2000, self);
    })
  },
  updateDatabase: function (data, self) {
    data = data.rows;
    let transaction = self.connection.transaction(self.storeName, "readwrite"),
      objectStore = transaction.objectStore(self.storeName), g;
    objectStore.clear();
    for (let g = 0; g < data.length; g++) {
      data[g].esr = parseInt(data[g].esr);
      objectStore.add(data[g]);
    }
    self.statusID = 'ready';
  },
  dataProvider: function (self) {
    let provider = {};
    provider.getEsr = function (esr) {
      try {
        esr = parseInt(esr);
      } catch (e) {
        return;
      }
      let data = {status: false};
      let transaction = self.connection.transaction([self.storeName], "readonly").objectStore(self.storeName).index("esr_ind").get(esr);
      transaction.onsuccess = function (event) {
        data.status = true;
        if (transaction.result) data.answer = transaction.result;
      };
      return data;
    };
    return provider;
  }
};
const db = new indexeddbCreator(optionStation);
export default db
