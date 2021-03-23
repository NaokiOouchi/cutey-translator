let isTranslate = false;
let chikuDic;
const SELECTOR_SPAN = 'span.css-901oao.css-16my406.r-1tl8opc.r-bcqeeo.r-qvutc0';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command === "translate") {
        isTranslate = true;
        chikuDic = msg.chikuDic;
        translate();
    }
    sendResponse("end.");
    return true;
});

const observer = new MutationObserver(function (mutations) {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (!node.childElementCount) return;
            const spanElms = node.querySelectorAll(SELECTOR_SPAN);

            spanElms.forEach(spanElm => {
                updateText(spanElm)
            });
        });
    });
});
const config = {
    attributes: true,
    childList: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
};

const translate = () => {
    const targets = document.querySelectorAll('[aria-label^="タイムライン: "]');
    targets.forEach(target => {
        const spanElms = target.querySelectorAll(SELECTOR_SPAN);
        spanElms.forEach(spanElm => {
            updateText(spanElm)
        });
        const div = target.querySelector('div')
        observer.observe(div, config);
    })
};

const updateText = (elm) => {
    if (!isTranslate) return
    var text = elm.innerText;
    for (let index in chikuDic) {
        const chikuObj = chikuDic[index];
        const repText = text.replaceAll(chikuObj.chikuchiku, chikuObj.cute);
        console.log(text.replaceAll(chikuObj.chikuchiku, chikuObj.cute))
        text = repText;
    }
    elm.innerText = text;
}