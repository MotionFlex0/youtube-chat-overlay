const CHAT_ITEM_OBSERVER_OPTIONS = {
    root: document.querySelector(".yco-chat-item-list"),
    threshold: 0.1
};

const chatItemIntersectionObserver = new IntersectionObserver(chatItemIntersectionCallback, CHAT_ITEM_OBSERVER_OPTIONS);


(async () => {
    await new Promise(resolve => setTimeout(resolve, 5000));

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
})();


function chatObserverCallback(mutationList, observer) {
    mutationList.forEach(mutation => {
        if (mutation.addedNodes.length > 0) {
            console.log(`[youtube-chat-overlay] Node(s) added with length: ${mutation.addedNodes.length}`);
            setTimeout(() => {
                mutation.addedNodes.forEach(node => {
                    chatQueue.addMessageFromRendererElement(node)
                });
            }, 500);
        }
        if (mutation.removedNodes.length > 0) {
            console.log(`[youtube-chat-overlay] Node(s) removed with length: ${mutation.removedNodes.length}`)
            setTimeout(() => {
                mutation.removedNodes.forEach(node => chatQueue.removeMessageFromRendererElement(node));
            }, 500);
        }
    });
}

function chatItemIntersectionCallback(entries, observer) {
    entries.forEach(e => {
        if (e.intersectionRatio != 1) {
            // console.log("something has gone out of view. element: ", e.target.querySelector(".message").innerText)
            e.target.remove();
        }
    });
}

const chatQueue = {
    addMessageFromRendererElement: function(rendererElement) {
        const ycoChatList = document.querySelector(".yco-chat-item-list");
        const newChatItem = ycoChatList.querySelector(".yco-chat-item[hidden]").cloneNode(true);
        // for (const [k,v] of chatItems) {
        //     if ()
        // }
        const authorPhoto = rendererElement.querySelector("#author-photo > img").src;
        const timestamp = rendererElement.querySelector("#timestamp").innerText;
        const authorName = rendererElement.querySelector("#author-name").innerText;
        const message = rendererElement.querySelector("#message").innerHTML;

        
        // console.log({authorPhoto, timestamp, authorName, message});
        //console.log(rendererElement);

        newChatItem.querySelector(".author-name").innerText = authorName;
        newChatItem.querySelector(".message").innerHTML = message;
        newChatItem.removeAttribute("hidden");
        ycoChatList.appendChild(newChatItem);
        ycoChatList.scrollTop = ycoChatList.scrollHeight;
        chatItemIntersectionObserver.observe(newChatItem);
        // authorName.innerText = 
        //authorName.children[0].replaceWith(document.adoptNode(rendererElement));
        //message.innerText = rendererElement.querySelector("#message").innerText;

    },
    removeMessageFromRendererElement: function(rendererElement) {
        const ycoChatList = document.querySelector(".yco-chat-item-list");
        ycoChatList.querySelector(`#${rendererElement.id}`).remove(); 
    }
}
