console.log(`This is the content script overlay..>! URL: ${window.location.href}`);

const chatFrame = document.querySelector("#chatframe");

if (chatFrame) {
    const chatApp = chatFrame.contentDocument.querySelector("yt-live-chat-app");
    if (chatApp) {
        console.log("[youtube-chat-overlay] Found chat app.");
        const chatHeader = chatApp.querySelector("yt-live-chat-header-renderer");
        const chat = chatApp.querySelector("#chat");

        const chatItem = chat.querySelector("#items");

        const observer = new MutationObserver(chatObserverCallback);
        observer.observe(chatItem, {
            childList: true
        });

        const youtubePlayer = document.querySelector("#ytd-player");
        if (youtubePlayer.clientWidth > 0 && youtubePlayer.clientHeight > 0) {
            fetch(chrome.runtime.getURL("/src/template/css/style.css"))
            .then(resp => resp.text())
            .then(css => {
                document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);
            });  

            // This is purely for testing. It prevents the chat overlay being loaded more than once.
            const chatOverlay = document.querySelector(".yco-chat");
            if (chatOverlay == null) {
                fetch(chrome.runtime.getURL("/src/template/chat_overlay.html"))
                .then(resp => resp.text())
                .then(template => {
                    youtubePlayer.insertAdjacentHTML("beforeend", template);
                });
            }

        }
    }
    else {
        console.log("[youtube-chat-overlay] Something went wrong! Found chat frame but could not find chat app.");
    }
}


function chatObserverCallback(mutationList, observer) {
    mutationList.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
            console.log(`[youtube-chat-overlay] Node(s) added with length: ${mutation.addedNodes.length}`);
        }
        if (mutation.removedNodes.length > 0) {
            console.log(`[youtube-chat-overlay] Node(s) removed with length: ${mutation.removedNodes.length}`)
        }
    });
}

const chatOverlayQueue = {
    pushItem: function(e) {
        
    },
    popItem: function() {

    }
}