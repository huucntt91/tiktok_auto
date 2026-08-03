const setStatus = (msg) => {
    document.getElementById("status").textContent = msg;
};

async function getActiveTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
}

// ==========================================
// Tự động chấp nhận tin nhắn
// ==========================================

document.getElementById("start").onclick = async () => {
    const tab = await getActiveTab();
    chrome.tabs.sendMessage(tab.id, { action: "START" }, (response) => {
        if (chrome.runtime.lastError) {
            setStatus("❌ " + chrome.runtime.lastError.message);
            return;
        }
        setStatus("✅ Đang chấp nhận tin nhắn...");
        console.log("✅ Response:", response);
    });
};

document.getElementById("stop").onclick = async () => {
    const tab = await getActiveTab();
    chrome.tabs.sendMessage(tab.id, { action: "STOP" }, (response) => {
        if (chrome.runtime.lastError) {
            setStatus("❌ " + chrome.runtime.lastError.message);
            return;
        }
        setStatus("⛔ Đã dừng chấp nhận tin nhắn.");
        console.log("✅ Response:", response);
    });
};

// ==========================================
// Tự động gửi tin nhắn Live
// ==========================================

document.getElementById("startLive").onclick = async () => {
    const tab = await getActiveTab();
    const message = document.getElementById("liveMessage").value.trim();
    if (!message) {
        setStatus("⚠️ Vui lòng nhập nội dung tin nhắn!");
        return;
    }

    const intervalMin = parseFloat(document.getElementById("intervalMin").value) || 3;
    const varianceSec = parseFloat(document.getElementById("intervalVariance").value) ?? 15;
    const intervalMs  = intervalMin * 60 * 1000;
    const varianceMs  = varianceSec * 1000;

    chrome.tabs.sendMessage(tab.id, { action: "START_LIVE_SEND", message, intervalMs, varianceMs }, (response) => {
        if (chrome.runtime.lastError) {
            setStatus("❌ " + chrome.runtime.lastError.message);
            return;
        }
        setStatus(`🔴 Đang gửi – mỗi ~${intervalMin} phút ± ${varianceSec}s`);
        console.log("✅ Response:", response);
    });
};

document.getElementById("stopLive").onclick = async () => {
    const tab = await getActiveTab();
    chrome.tabs.sendMessage(tab.id, { action: "STOP_LIVE_SEND" }, (response) => {
        if (chrome.runtime.lastError) {
            setStatus("❌ " + chrome.runtime.lastError.message);
            return;
        }
        setStatus("⛔ Đã dừng gửi tin nhắn live.");
        console.log("✅ Response:", response);
    });
};
