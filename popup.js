document.getElementById("start").onclick = async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    console.log("🚀 Start");

    chrome.tabs.sendMessage(
        tab.id,
        { action: "START" },
        (response) => {

            if (chrome.runtime.lastError) {
                console.error(
                    "❌",
                    chrome.runtime.lastError.message
                );
                return;
            }

            console.log("✅ Response:", response);
        }
    );
};

document.getElementById("stop").onclick = async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    console.log("⛔ Stop");

    chrome.tabs.sendMessage(
        tab.id,
        { action: "STOP" },
        (response) => {

            if (chrome.runtime.lastError) {
                console.error(
                    "❌",
                    chrome.runtime.lastError.message
                );
                return;
            }

            console.log("✅ Response:", response);
        }
    );
};
