let running = false;

chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === "START") {
        running = true;
        startAuto();
    }

    if (msg.action === "STOP") {
        running = false;
        console.log("⛔ STOP");
    }
});

async function startAuto() {
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    console.log("🚀 Start Auto Accept...");

    while (running) {
        try {
            // ========================
            // B1: Lưu list ngoài
            // ========================
            const getItems = () =>
                Array.from(document.querySelectorAll('[data-e2e="dm-new-conversation-item"]'));

            const oldItems = getItems();

            // ========================
            // B2: Click "Yêu cầu tin nhắn"
            // ========================
            let clicked = false;

            for (let el of document.querySelectorAll('div[class*="DivRequestGroup"]')) {
                if (el.innerText.includes("Yêu cầu tin nhắn")) {
                    el.click();
                    clicked = true;
                    break;
                }
            }

            if (!clicked) {
                console.log("❌ Không tìm thấy request tab");
                await sleep(3000);
                continue;
            }

            // ========================
            // B3: Đợi list trong
            // ========================
            let insideItems = [];

            for (let i = 0; i < 10; i++) {
                await sleep(1000);

                const current = getItems();
                insideItems = current.filter(el => !oldItems.includes(el));

                if (insideItems.length > 0) break;
            }

            if (!insideItems.length) {
                console.log("❌ Không có request");
                await sleep(3000);
                continue;
            }

            // ========================
            // B4: Click item đầu
            // ========================
            insideItems[0].click();
            await sleep(2000);

            // ========================
            // B5: Click accept
            // ========================
            const acceptBtn = Array.from(document.querySelectorAll('div[role="button"]'))
                .find(btn => btn.innerText.trim() === "Chấp nhận");

            if (acceptBtn) {
                acceptBtn.click();
                console.log("✅ Accepted");
            } else {
                console.log("⚠️ Không thấy nút accept");
            }

            await sleep(3000);

        } catch (err) {
            console.error("❌ Error:", err);
        }
    }
}