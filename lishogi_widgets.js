var lishogi_widgets = (function() {
	function fetchJson(url, callback) {
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var data = JSON.parse(this.responseText);
				callback(data);
			}
		};
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	}

	var cache = {}
	var callbacks = {}
	function getAuthor(name, callback) {
		if (cache[name]) {
			callback(cache[name]);
		} else if (callbacks[name]) {
			callbacks[name].push(callback);
		} else {
			callbacks[name] = [ callback ];

			fetchJson("https://lishogi.org/api/user/" + name, function(data) {
				cache[name] = data;
				for (var i = 0; i < callbacks[name].length; ++i) {
					callbacks[name][i](data);
				}
				callbacks[name] = null;
			});
		}
	}

	function profile_logo(theme) {
		return (theme == "dark") ? "https://lishogi1.org/assets/logo/lishogi-favicon-32-invert.png" : "https://lishogi1.org/assets/logo/lishogi-favicon-32.png";
	}
	function profile_logo(theme) {
		return (theme == "dark") ? "https://lishogi1.org/assets/logo/lishogi-favicon-32-invert.png" : "https://lishogi1.org/assets/logo/lishogi-favicon-32.png";
	}

	function capitalize(inp) {
		return inp.charAt(0).toUpperCase() + inp.slice(1);
	}

	var serial = 0;
	return {
		profile: function(theme, author, text) {
			serial++;
			var id = serial;
			if (text == null)
				text = author;
			var tmp = "<a  id=\"lishogi_widget_" + id + "\" class=\"lishogi_widget lishogi_theme_" + theme;
			tmp    += "\" href=\"https://lishogi.org/@/" + author + "\">";
			tmp    += "<img src=\"" + profile_logo(theme) + "\" alt=\"lishogi\" />"
			tmp    += "<span>" + text + "</span></a>";
			document.write(tmp);
			getAuthor(author, function(data) {});
		},
		profile_scores: function(theme, author, text) {
			serial++;
			var id = serial;
			if (text == undefined)
				text = author;
			var tmp = "<a id=\"lishogi_widget_" + id + "\" class=\"lishogi_widget lishogi_theme_" + theme;
			tmp    += "\" href=\"https://lishogi.org/@/" + author + "\">";
			tmp    += "<img src=\"" + profile_logo(theme) + "\" alt=\"lishogi\" />"
			tmp    += "<span>" + text + "</span></a>";
			document.write(tmp);
			getAuthor(author, function(data) {
				if (text && text != "")
					text = text + " | ";

				var res = text + "Classical <b>" + data.perfs.classical.rating;
				res    += "</b> | Blitz <b>" + data.perfs.blitz.rating + "</b>";

				document.getElementById("lishogi_widget_" + id).getElementsByTagName('span')[0].innerHTML = res;
			});
		},
		profile_big: function(theme, author, text) {
			serial++;
			var id = serial;
			if (text == undefined)
				text = author + " on Lishogi";
			var tmp = "<a id=\"lishogi_widget_" + id + "\" class=\"lishogi_widget lishogi_theme_" + theme;
			tmp    += " lishogi_long\" href=\"https://lishogi.org/@/" + author + "\">";
			tmp    += "<img src=\"" + profile_logo(theme) + "\" alt=\"lishogi\" />" + text + "<hr />"
			tmp    += "<span></span></a>";
			document.write(tmp);
			getAuthor(author, function(data) {
				var res = "";
				for (var key in data.perfs) {
					if (data.perfs.hasOwnProperty(key) && data.perfs[key].games > 0) {
						if (res!="")
							res += "<br />";
						res += capitalize(key) + " <b>" + data.perfs[key].rating + "</b> / " + data.perfs[key].games + " Games";
					}
				}
				document.getElementById("lishogi_widget_" + id).getElementsByTagName('span')[0].innerHTML = res;
			});
		}
	}
})();
