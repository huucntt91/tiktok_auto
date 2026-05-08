let running = false;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "START") {
        running = true;
        // Bắt đầu chạy
        autoAcceptMessageRequests();
    }

    if (msg.action === "STOP") {
        running = false;
        console.log("⛔ STOP");
    }
});

// Hàm tạo độ trễ cơ bản
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function autoAcceptMessageRequests() {
    console.log("Bắt đầu tiến trình tự động chấp nhận tin nhắn...");
    let count = 0;

    while (true) {
        try {
            console.log("----------------------------------");

            // ==========================================
            // BƯỚC 1: Tìm và click "Yêu cầu tin nhắn"
            // ==========================================
            const requestBtn = document.querySelector('div[class*="DivRequestInfo"]');
            if (requestBtn) {
                requestBtn.click();
                console.log("B1: Đã click 'Yêu cầu tin nhắn'");
            }else {
                console.log("Cảnh báo: Không tìm thấy nút 'Yêu cầu tin nhắn', có thể đã hết yêu cầu hoặc giao diện đã thay đổi.");
                break;
            }

            await wait(5000);
            // ==========================================
            // BƯỚC 2: Chờ Danh sách 2 xuất hiện (Smart Wait)
            // ==========================================
            const containers = document.querySelector('div[id*="more-acton-icon"]');
            if (containers) {
                console.log("B2: Đã thấy khung chat hiện ra");
                containers.click();
            } else {
                console.log("Cảnh báo: Không tìm thấy khung chat, có thể đã bị chặn hoặc lỗi giao diện.");
                break;
            }
            await wait(1500);

            // ==========================================
            // BƯỚC 3: Chờ nút "Chấp nhận" xuất hiện (Smart Wait)
            // ==========================================
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
    console.log("Đã dừng tiến trình tự động.");
}

//autoAcceptMessageRequests();


