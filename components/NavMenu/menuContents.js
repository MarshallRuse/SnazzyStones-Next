const menuContents = [
    {
        isLink: true,
        link: "/",
        displayText: "HOME",
    },
    {
        isLink: true,
        link: "/retail",
        displayText: "SHOP",
        submenu: [
            {
                isLink: true,
                link: "/retail/categories/Anklets",
                displayText: "Anklets",
            },
            {
                isLink: true,
                link: "/retail/categories/Bracelets",
                displayText: "Bracelets",
            },
            {
                isLink: true,
                link: "/retail/categories/Hoops",
                displayText: "Hoops",
            },
            {
                isLink: true,
                link: "/retail/categories/Necklaces",
                displayText: "Necklaces",
            },
            {
                isLink: true,
                link: "/retail/categories/Pendants",
                displayText: "Pendants",
            },
        ],
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

export default menuContents;
