//Inject settings menu into YouTube video

console.log("Inside yco_settings.js....");

setTimeout(() => {
    fetch(chrome.runtime.getURL("/src/js/lib/winbox.bundle.js"))
    .then(resp => resp.text())
    .then(js => {
        // document.body.insertAdjacentHTML("beforeend", `<script>"${js}"></script></script>`);
        window.eval(js);
        console.log("Injected WinBox into page....");
        
        const settingsWindow = new WinBox("YCO Settings", {
            class: ["no-full"],
            x: "center",
            y: "center",
            top: 40,
            max: false,
            onmoove: function(x, y) {
                this.body.textContent = 
                    "x: " + x + ", " +
                    "y: " + y
                ;
            }
        });
        // settingsWindow.move(, "center");
    });


}, 3000);