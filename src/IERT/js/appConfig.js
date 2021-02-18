let theme;

(function () {
  theme = localStorage.getItem("theme");
  if (!theme) theme = "metrodark";
})();

export default {
  "theme": theme,
  "windowsTheme": theme,
  "menuTheme": theme,
  "host": (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') ? location.origin : "http://192.168.10.3:8080",
  "definitions": "SPF2_Defs",
  "appName": "SPF2",
}
