export async function avoidRateLimit(ms = 500) {
    if (process.env.NODE_ENV === "production") {
        await sleep(ms);
    }
}

function sleep(ms = 500) {
    return new Promise((res) => setTimeout(res, ms));
}
