export async function fetchCategoryMenuItems() {
    const categoriesResponse = await fetch("/api/retail/categories");
    const responseJson = await categoriesResponse.json();
    const categories = responseJson.categories;
    const menuItems = categories.map((cat) => ({
        isLink: true,
        link: `/retail/categories/${cat.title.replace(" ", "_")}`,
        displayText: cat.title,
    }));

    return menuItems.sort((a, b) => (a.displayText > b.displayText ? 1 : b.displayText > a.displayText ? -1 : 0));
}

export const menuContents = [
    {
        isLink: true,
        link: "/",
        displayText: "HOME",
    },
    {
        isLink: true,
        link: "/retail",
        displayText: "SHOP",
        submenu: [], // NavBar and MobileNav check if a submenu property exists before rendering contents.  SHOPs subcategories are dynamic based on Etsy's API results
    },
    {
        isLink: true,
        link: "/our-shows",
        displayText: "OUR SHOWS",
    },
    {
        isLink: false,
        displayText: "LEARN MORE",
        submenu: [
            {
                isLink: true,
                link: "/our-story",
                displayText: "Our Story",
            },
            {
                isLink: true,
                link: "/silver-care",
                displayText: "Caring For Your Silver",
            },
        ],
    },
    {
        isLink: true,
        link: "/contact-us",
        displayText: "CONTACT US",
    },
];
