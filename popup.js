document.getElementById("start").onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	console.log("Start");
    chrome.tabs.sendMessage(tab.id, { action: "START" });
};

document.getElementById("stop").onclick = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.tabs.sendMessage(tab.id, { action: "STOP" });
};