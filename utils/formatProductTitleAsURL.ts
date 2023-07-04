export default function formatProductTitleAsURL(title: string) {
    return title
        .split("|")[0]
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9 -]/gi, "")
        .replace(/[ -]/gi, "-")
        .replace(/-{2,}/gi, "-");
}
