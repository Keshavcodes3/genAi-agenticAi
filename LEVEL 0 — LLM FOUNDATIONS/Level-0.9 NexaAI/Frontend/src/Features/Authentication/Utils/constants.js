export const API_BASE_URL =
    (import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

export const AUTH_ROUTES = {
    register: "/register",
    login: "/login",
    logout: "/logout",
    me: "/user",
};

export const AVATAR_OPTIONS = [
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fthf.bing.com%2Fth%2Fid%2FOIP.VfRpzjFk7aRwGE1NAzkfuwHaG9%3Fcb%3Dthfc1falcon%26pid%3DApi&f=1&ipt=1e9cc6bf98a08b154b91aad3ae9cf46c50711f522ddef84ae5ae62c9e2c86475&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse3.mm.bing.net%2Fth%2Fid%2FOIP.-Y0WcUHiYzqNpDW1la4pJQHaHa%3Fpid%3DApi&f=1&ipt=bfbfe128899a47789124ed308495dbad662a9e493b8a2a00704dd919ff729bbe&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.hjFOYx5pbMGSQ2bODUjn6AHaHa%3Fpid%3DApi&f=1&ipt=0615d67fa114e1ed4a1ccae53054c034809a77a77e46205cedfba2c97d8255ee&ipo=images",
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.JPQFymbFyF1TjoU3H_yXhgHaHa%3Fpid%3DApi&f=1&ipt=fed6f173325870305b09ade94825c9013d3a85a44fd532ba4174349910c0ec14&ipo=images",
];
