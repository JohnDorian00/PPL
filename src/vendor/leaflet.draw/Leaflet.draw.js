/**
 * Leaflet.draw assumes that you have already included the Leaflet library.
 */
L.drawVersion = '0.4.2';
/**
 * @class L.Draw
 * @aka Draw
 *
 *
 * To add the draw toolbar set the option drawControl: true in the map options.
 *
 * @example
 * ```js
 *      var map = L.map('map', {drawControl: true}).setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 * ```
 *
 * ### Adding the edit toolbar
 * To use the edit toolbar you must initialise the Leaflet.draw control and manually add it to the map.
 *
 * ```js
 *      var map = L.map('map').setView([51.505, -0.09], 13);
 *
 *      L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
 *          attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
 *      }).addTo(map);
 *
 *      // FeatureGroup is to store editable layers
 *      var drawnItems = new L.FeatureGroup();
 *      map.addLayer(drawnItems);
 *
 *      var drawControl = new L.Control.Draw({
 *          edit: {
 *              featureGroup: drawnItems
 *          }
 *      });
 *      map.addControl(drawControl);
 * ```
 *
 * The key here is the featureGroup option. This tells the plugin which FeatureGroup contains the layers that
 * should be editable. The featureGroup can contain 0 or more features with geometry types Point, LineString, and Polygon.
 * Leaflet.draw does not work with multigeometry features such as MultiPoint, MultiLineString, MultiPolygon,
 * or GeometryCollection. If you need to add multigeometry features to the draw plugin, convert them to a
 * FeatureCollection of non-multigeometries (Points, LineStrings, or Polygons).
 */
L.Draw = {};

/**
 * @class L.drawLocal
 * @aka L.drawLocal
 *
 * The core toolbar class of the API — it is used to create the toolbar ui
 *
 * @example
 * ```js
 *      var modifiedDraw = L.drawLocal.extend({
 *          draw: {
 *              toolbar: {
 *                  buttons: {
 *                      polygon: 'Draw an awesome polygon'
 *                  }
 *              }
 *          }
 *      });
 * ```
 *
 * The default state for the control is the draw toolbar just below the zoom control.
 *  This will allow map users to draw vectors and markers.
 *  **Please note the edit toolbar is not enabled by default.**
 */
L.drawLocal = {
	// format: {
	// 	numeric: {
	// 		delimiters: {
	// 			thousands: ',',
	// 			decimal: '.'
	// 		}
	// 	}
	// },
	draw: {
		toolbar: {
			// #TODO: this should be reorganized where actions are nested in actions
			// ex: actions.undo  or actions.cancel
			actions: {
				title: 'Отменаить рисование',
				text: 'Отмена'
			},
			finish: {
				title: 'Закончить рисование',
				text: 'Закончить'
			},
			undo: {
				title: 'Удалить последнюю точку на рисунке',
				text: 'Удалить последнюю точку'
			},
			buttons: {
				polyline: 'Нарисовать линию',
				polygon: 'Нарисовать полигон',
				rectangle: 'Нарисовать прямоугольник',
				circle: 'Нарисовать круг',
				marker: 'Нарисовать на крате маркер',
				circlemarker: 'Нарисовать на карте точку'
			}
		},
		handlers: {
			circle: {
				tooltip: {
					start: 'Нажмите и двигайте мышью чтобы нарисовать круг'
				},
				radius: 'Радиус'
			},
			circlemarker: {
				tooltip: {
					start: 'Нажмите на карту чтобы нарисовть точку'
				}
			},
			marker: {
				tooltip: {
					start: 'Нажмите на карту чтобы поставить отметку'
				}
			},
			polygon: {
				tooltip: {
					start: 'Нажмите чтобы начать рисовать полигон',
					cont: 'Нажмите закончить чтобы остановить рисование',
					end: 'На первую точку чтобы отменить рисование'
				}
			},
			polyline: {
				error: '<strong>Error:</strong> shape edges cannot cross!',
				tooltip: {
					start: 'Нажмите чтобы начать рисовать линию',
					cont: 'Нажмите закончить чтобы остановить рисование',
					end: 'На первую точку чтобы отменить рисование'
				}
			},
			rectangle: {
				tooltip: {
					start: 'Нажмите и двигайте мышью чтобы нарисовать прямоугольник'
				}
			},
			simpleshape: {
				tooltip: {
					end: 'Отпустите мышь, чтобы закончить рисование'
				}
			}
		}
	},
	edit: {
		toolbar: {
			actions: {
				save: {
					title: 'Сохранить изменения',
					text: 'Сохранить'
				},
				cancel: {
					title: 'Отмена дейсвтий, откат всех изменений',
					text: 'Отмена'
				},
				clearAll: {
					title: 'Очистить все слои',
					text: 'Очистить все'
				}
			},
			buttons: {
				edit: 'Модифицировать слой',
				editDisabled: 'Нет слоев для модификации',
				remove: 'Удалить слой',
				removeDisabled: 'Нет слоев для удаления'
			}
		},
		handlers: {
			edit: {
				tooltip: {
					text: 'Двигайте маркеры чтобы изменить фигуры',
					subtext: 'Нажмите назад чтобы отменить действие'
				}
			},
			remove: {
				tooltip: {
					text: 'Нажмите чтобы удалить'
				}
			}
		}
	}
};
