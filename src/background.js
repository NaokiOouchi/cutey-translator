const ID_ENABLED = "cutey-translator-enabled"
const ID_DISABLED = "cutey-translator-disabled"
var sessionItem;
chrome.contextMenus.create({
    type: "normal",
    id: "parent",
    title: "Cutey Translator"
});

chrome.contextMenus.create({
    title: '有効',
    type: 'radio',
    checked: false,
    enabled: true,
    contexts: ['all'],
    parentId: "parent",
    id: ID_ENABLED
});
chrome.contextMenus.create({
    title: '無効',
    type: 'radio',
    checked: true,
    enabled: false,
    contexts: ['all'],
    parentId: "parent",
    id: ID_DISABLED
});

chrome.contextMenus.onClicked.addListener(function (item, tab) {
    sessionItem = item
    console.log(sessionItem)
    main(sessionItem, tab)
    return true;
});

chrome.tabs.onUpdated.addListener(function (tabid, info, tab) {
    console.log(sessionItem)
    if (sessionItem === undefined) {
        return true;
    }
    if (info.status === "complete") {
        main(sessionItem, tab)
    }
});
const main = (item, tab) => {
    if (item.wasChecked) return
    if (item.menuItemId === ID_ENABLED) {
        chrome.runtime.getPackageDirectoryEntry(function (root) {
            const file = 'resources/chikuchiku-dictionary.json';
            root.getFile(file, {}, function (sample) {
                sample.file(function (file) {
                    const reader = new FileReader();
                    reader.onloadend = function (e) {
                        const {result} = e.target;
                        chrome.tabs.sendMessage(tab.id, {
                                command: "translate",
                                chikuDic: JSON.parse(result)
                            },
                            function (msg) {
                                console.log("result message:", msg);
                            });
                        togggleEnabled(ID_DISABLED, true)
                        togggleEnabled(ID_ENABLED, false)
                    }
                    reader.readAsText(file);
                });
            });
        });
    } else if (item.menuItemId === ID_DISABLED) {
        chrome.tabs.sendMessage(tab.id, {
                command: "disTranslate",
            },
            function (msg) {
                console.log("result message:", msg);
            });
        togggleEnabled(ID_ENABLED, true)
        togggleEnabled(ID_DISABLED, false)
    }
}
const togggleEnabled = (id, flg) => {
    chrome.contextMenus.update(id, {
        enabled: flg,
        checked: !flg
    })
};
