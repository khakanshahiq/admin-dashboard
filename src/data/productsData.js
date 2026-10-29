export const productsData = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    sku: "WH-1001",
    category: "Electronics",
    price: 149.99,
    stock: 48,
    status: "Active",
    sales: 328,
    revenue: 49196.72,
    description:
      "Premium wireless headphones with active noise cancellation, deep bass, and long-lasting battery life.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    created: "Jan 12, 2026",
    updated: "Aug 28, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 2,
    name: "Minimal Leather Backpack",
    sku: "BP-2042",
    category: "Accessories",
    price: 89.99,
    stock: 24,
    status: "Active",
    sales: 214,
    revenue: 19257.86,
    description:
      "A clean and durable leather backpack designed for everyday work, travel, and casual use.",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    created: "Feb 05, 2026",
    updated: "Aug 26, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 3,
    name: "Smart Fitness Watch",
    sku: "FW-3021",
    category: "Wearables",
    price: 129.99,
    stock: 31,
    status: "Active",
    sales: 187,
    revenue: 24308.13,
    description:
      "Smart fitness watch with activity tracking, heart-rate monitoring, notifications, and multiple workout modes.",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    created: "Mar 18, 2026",
    updated: "Aug 24, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 4,
    name: "Classic Running Shoes",
    sku: "RS-4018",
    category: "Fashion",
    price: 74.99,
    stock: 12,
    status: "Low stock",
    sales: 156,
    revenue: 11698.44,
    description:
      "Lightweight running shoes with breathable materials and responsive cushioning for everyday training.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    created: "Apr 09, 2026",
    updated: "Aug 22, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 5,
    name: "Ceramic Coffee Mug",
    sku: "CM-5092",
    category: "Home & Living",
    price: 24.99,
    stock: 0,
    status: "Out of stock",
    sales: 98,
    revenue: 2449.02,
    description:
      "Minimal ceramic coffee mug with a smooth finish, comfortable handle, and modern design.",
    image:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80",
    created: "May 14, 2026",
    updated: "Aug 20, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 6,
    name: "Mechanical Keyboard",
    sku: "MK-4001",
    category: "Electronics",
    price: 99,
    stock: 18,
    status: "Active",
    sales: 142,
    revenue: 14058,
    description:
      "Mechanical keyboard with tactile switches, durable keycaps, and a compact modern layout.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
    created: "Jun 02, 2026",
    updated: "Aug 19, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 7,
    name: "USB-C Hub",
    sku: "UH-5001",
    category: "Electronics",
    price: 39.99,
    stock: 42,
    status: "Active",
    sales: 263,
    revenue: 10517.37,
    description:
      "Compact USB-C hub with multiple ports for connecting displays, storage devices, and peripherals.",
    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
    created: "Jun 21, 2026",
    updated: "Aug 18, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 8,
    name: "Premium Desk Lamp",
    sku: "DL-6014",
    category: "Home & Living",
    price: 59,
    stock: 32,
    status: "Active",
    sales: 119,
    revenue: 7021,
    description:
      "Modern LED desk lamp with adjustable lighting and a minimalist design for home and office spaces.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    created: "Jul 03, 2026",
    updated: "Aug 17, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 9,
    name: "Leather Wallet",
    sku: "LW-7025",
    category: "Fashion",
    price: 45,
    stock: 18,
    status: "Draft",
    sales: 0,
    revenue: 0,
    description:
      "Slim leather wallet with multiple card slots and a compact everyday-carry design.",
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    created: "Jul 15, 2026",
    updated: "Aug 16, 2026",
    seller: "Sardar KS UI Store",
  },

  {
    id: 10,
    name: "Minimal Desk Organizer",
    sku: "DO-8033",
    category: "Home & Living",
    price: 34.99,
    stock: 26,
    status: "Active",
    sales: 87,
    revenue: 3044.13,
    description:
      "Minimal desk organizer designed to keep stationery, accessories, and small office items neatly arranged.",
    image:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=800&q=80",
    created: "Jul 27, 2026",
    updated: "Aug 15, 2026",
    seller: "Sardar KS UI Store",
  },
];

export const getProductById = (id) => {
  return productsData.find((product) => product.id === Number(id));
};
