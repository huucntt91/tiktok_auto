let running = false;
let autoSendRunning = false;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "START") {
        running = true;
        autoAcceptMessageRequests();
    }

    if (msg.action === "STOP") {
        running = false;
        console.log("⛔ STOP");
    }

    if (msg.action === "START_LIVE_SEND") {
        if (autoSendRunning) return;
        autoSendRunning = true;
        const message     = msg.message     || '@2K9, 2K10 có thể tìm FB "Học Văn Chị Tấm" để tham khảo lộ trình XPS nhé !!!';
        const intervalMs  = msg.intervalMs  || 180000; // mặc định 3 phút
        const varianceMs  = msg.varianceMs  !== undefined ? msg.varianceMs : 15000; // mặc định ±15s
        startAutoSendLive(message, intervalMs, varianceMs);
    }

    if (msg.action === "STOP_LIVE_SEND") {
        autoSendRunning = false;
        if (window.__autoSendTimeout) {
            clearTimeout(window.__autoSendTimeout);
            window.__autoSendTimeout = null;
        }
        console.log("⛔ Đã dừng tự động gửi tin nhắn live.");
    }
});

// =============================================
// TÍNH NĂNG 1: Tự động chấp nhận yêu cầu tin nhắn
// =============================================

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function autoAcceptMessageRequests() {
    console.log("Bắt đầu tiến trình tự động chấp nhận tin nhắn...");
    let count = 0;

    while (running) {
        try {
            console.log("----------------------------------");

            // BƯỚC 1: Tìm và click "Yêu cầu tin nhắn"
            const requestBtn = document.querySelector('div[class*="DivRequestInfo"]');
            if (requestBtn) {
                requestBtn.click();
                console.log("B1: Đã click 'Yêu cầu tin nhắn'");
            } else {
                console.log("Cảnh báo: Không tìm thấy nút 'Yêu cầu tin nhắn', có thể đã hết yêu cầu hoặc giao diện đã thay đổi.");
                break;
            }

            await wait(5000);

            // BƯỚC 2: Tìm và click icon more-action
            const containers = document.querySelector('div[id*="more-acton-icon"]');
            if (containers) {
                console.log("B2: Đã thấy khung chat hiện ra");
                containers.click();
            } else {
                console.log("Cảnh báo: Không tìm thấy khung chat, có thể đã bị chặn hoặc lỗi giao diện.");
                break;
            }
            await wait(1500);

            // BƯỚC 3: Tìm và click nút "Chấp nhận"
            const acceptBtn = document.evaluate(
                "//div[contains(text(), 'Chấp nhận')]",
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (acceptBtn) {
                acceptBtn.click();
                count++;
                console.log(`B3: Đã click 'Chấp nhận' thành công (Tổng: ${count} người)`);
            } else {
                console.log("Cảnh báo: Không tìm thấy nút 'Chấp nhận' cho người này (Có thể tài khoản bị chặn).");
                break;
            }

            await wait(3000);

        } catch (error) {
            console.error("Đã xảy ra lỗi hệ thống:", error);
            break;
        }
    }
    console.log("Đã dừng tiến trình tự động chấp nhận.");
}

// =============================================
// TÍNH NĂNG 2: Tự động gửi tin nhắn trên TikTok Live
// =============================================

function startAutoSendLive(message, intervalMs = 180000, varianceMs = 15000) {
    console.log("🚀 Bắt đầu tự động gửi tin nhắn live...");
    console.log("📝 Nội dung:", message);
    console.log(`⏱️ Chu kỳ: ${intervalMs / 60000} phút ± ${varianceMs / 1000} giây`);

    function sendMessage() {
        if (!autoSendRunning) {
            console.log("⛔ Đã dừng gửi tin nhắn live.");
            return;
        }

        const input = document.querySelector('[data-e2e="room-chat-input-field"]');
        if (!input) {
            console.warn("⚠️ Không tìm thấy ô nhập tin nhắn. Thử lại sau 5 giây...");
            window.__autoSendTimeout = setTimeout(sendMessage, 5000);
            return;
        }

        input.click();
        input.focus();

        document.execCommand("selectAll");
        document.execCommand("delete");

        document.execCommand("insertText", false, message);
        input.dispatchEvent(new Event("input", { bubbles: true }));

        setTimeout(() => {
            const sendBtn = document.querySelector('[data-e2e="room-chat-send-btn"]');
            if (sendBtn) {
                sendBtn.click();
                console.log("✅ Đã gửi lúc:", new Date().toLocaleTimeString());
            } else {
                console.warn("⚠️ Không tìm thấy nút gửi.");
            }

            if (!autoSendRunning) return;

            // Chu kỳ tiếp theo: intervalMs ± varianceMs ngẫu nhiên
            const next = intervalMs + (Math.random() * varianceMs * 2 - varianceMs);
            const nextSec = Math.round(next / 1000);
            console.log(`⏱️ Tin tiếp theo sau ${nextSec} giây`);
            window.__autoSendTimeout = setTimeout(sendMessage, next);
        }, 100);
    }

    sendMessage();
}
