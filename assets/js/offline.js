if ("serviceWorker" in navigator) {
	window.addEventListener("load", function() {
		navigator.serviceWorker.register("sw.js").then(function(registration) {
			console.log("Service Worker successful: ", registration.scope);
		}, function(err) {
			console.log("Service Worker failed: ", err);
		})
	})
}