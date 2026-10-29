export const ordersData = [
  {
    id: "#ORD-1001",
    customer: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 202 555 0147",

    items: [
      {
        id: 1,
        name: "Premium Wireless Headphones",
        sku: "WH-1001",
        price: 79.99,
        quantity: 2,
      },
      {
        id: 2,
        name: "USB-C Hub",
        sku: "UH-5001",
        price: 39.99,
        quantity: 1,
      },
    ],

    subtotal: 199.97,
    shipping: 10,
    tax: 10,
    amount: 219.97,

    status: "Delivered",
    payment: "Paid",

    date: "Aug 28, 2026",
    trackingNumber: "TRK-784512963",
    estimatedDelivery: "Aug 31, 2026",

    shippingAddress: "123 Main Street, New York, NY 10001",

    notes: "Please leave the package at the front door.",
  },

  {
    id: "#ORD-1002",
    customer: "Sophia Carter",
    email: "sophia.carter@example.com",
    phone: "+1 202 555 0182",

    items: [
      {
        id: 3,
        name: "Smart Fitness Watch",
        sku: "FW-3021",
        price: 119.5,
        quantity: 1,
      },
    ],

    subtotal: 119.5,
    shipping: 10,
    tax: 5.98,
    amount: 135.48,

    status: "Processing",
    payment: "Paid",

    date: "Aug 27, 2026",
    trackingNumber: "TRK-784512964",
    estimatedDelivery: "Sep 02, 2026",

    shippingAddress: "45 Park Avenue, New York, NY 10002",

    notes: "Customer requested standard delivery.",
  },

  {
    id: "#ORD-1003",
    customer: "Daniel Wilson",
    email: "daniel.wilson@example.com",
    phone: "+1 202 555 0116",

    items: [
      {
        id: 4,
        name: "Classic Running Shoes",
        sku: "RS-4018",
        price: 69.99,
        quantity: 1,
      },
    ],

    subtotal: 69.99,
    shipping: 10,
    tax: 3.5,
    amount: 83.49,

    status: "Shipped",
    payment: "Paid",

    date: "Aug 26, 2026",
    trackingNumber: "TRK-784512965",
    estimatedDelivery: "Sep 01, 2026",

    shippingAddress: "88 Madison Avenue, New York, NY 10003",

    notes: "",
  },

  {
    id: "#ORD-1004",
    customer: "Emma Johnson",
    email: "emma.johnson@example.com",
    phone: "+1 202 555 0194",

    items: [
      {
        id: 5,
        name: "Ceramic Coffee Mug",
        sku: "CM-5092",
        price: 24.99,
        quantity: 2,
      },
      {
        id: 6,
        name: "Minimal Leather Backpack",
        sku: "BP-2042",
        price: 89,
        quantity: 1,
      },
    ],

    subtotal: 138.98,
    shipping: 10,
    tax: 6.95,
    amount: 155.93,

    status: "Pending",
    payment: "Pending",

    date: "Aug 25, 2026",
    trackingNumber: "TRK-784512966",
    estimatedDelivery: "Sep 04, 2026",

    shippingAddress: "72 Broadway, New York, NY 10004",

    notes: "Order is awaiting payment confirmation.",
  },

  {
    id: "#ORD-1005",
    customer: "Michael Brown",
    email: "michael.brown@example.com",
    phone: "+1 202 555 0163",

    items: [
      {
        id: 7,
        name: "Mechanical Keyboard",
        sku: "MK-4001",
        price: 99,
        quantity: 1,
      },
      {
        id: 8,
        name: "USB-C Hub",
        sku: "UH-5001",
        price: 39.99,
        quantity: 1,
      },
    ],

    subtotal: 138.99,
    shipping: 10,
    tax: 6.95,
    amount: 155.94,

    status: "Delivered",
    payment: "Paid",

    date: "Aug 24, 2026",
    trackingNumber: "TRK-784512967",
    estimatedDelivery: "Aug 29, 2026",

    shippingAddress: "19 West Street, New York, NY 10005",

    notes: "Delivered successfully.",
  },

  {
    id: "#ORD-1006",
    customer: "Olivia Davis",
    email: "olivia.davis@example.com",
    phone: "+1 202 555 0135",

    items: [
      {
        id: 9,
        name: "Smart Fitness Watch",
        sku: "FW-3021",
        price: 129.99,
        quantity: 2,
      },
    ],

    subtotal: 259.98,
    shipping: 0,
    tax: 13,
    amount: 272.98,

    status: "Cancelled",
    payment: "Refunded",

    date: "Aug 23, 2026",
    trackingNumber: "TRK-784512968",
    estimatedDelivery: "Cancelled",

    shippingAddress: "54 Lexington Avenue, New York, NY 10006",

    notes: "Customer cancelled the order. Payment refunded.",
  },

  {
    id: "#ORD-1007",
    customer: "James Miller",
    email: "james.miller@example.com",
    phone: "+1 202 555 0171",

    items: [
      {
        id: 10,
        name: "Premium Wireless Headphones",
        sku: "WH-1001",
        price: 79.99,
        quantity: 1,
      },
    ],

    subtotal: 79.99,
    shipping: 10,
    tax: 4,
    amount: 93.99,

    status: "Processing",
    payment: "Paid",

    date: "Aug 22, 2026",
    trackingNumber: "TRK-784512969",
    estimatedDelivery: "Sep 03, 2026",

    shippingAddress: "91 Lexington Avenue, New York, NY 10007",

    notes: "Order is currently being prepared.",
  },

  {
    id: "#ORD-1008",
    customer: "Isabella Moore",
    email: "isabella.moore@example.com",
    phone: "+1 202 555 0128",

    items: [
      {
        id: 11,
        name: "Minimal Leather Backpack",
        sku: "BP-2042",
        price: 89.99,
        quantity: 2,
      },
    ],

    subtotal: 179.98,
    shipping: 10,
    tax: 9,
    amount: 198.98,

    status: "Shipped",
    payment: "Paid",

    date: "Aug 21, 2026",
    trackingNumber: "TRK-784512970",
    estimatedDelivery: "Aug 30, 2026",

    shippingAddress: "31 5th Avenue, New York, NY 10008",

    notes: "Package has been shipped.",
  },

  {
    id: "#ORD-1009",
    customer: "Noah Taylor",
    email: "noah.taylor@example.com",
    phone: "+1 202 555 0109",

    items: [
      {
        id: 12,
        name: "Classic Running Shoes",
        sku: "RS-4018",
        price: 74.99,
        quantity: 1,
      },
      {
        id: 13,
        name: "Ceramic Coffee Mug",
        sku: "CM-5092",
        price: 24.99,
        quantity: 1,
      },
    ],

    subtotal: 99.98,
    shipping: 10,
    tax: 5,
    amount: 114.98,

    status: "Delivered",
    payment: "Paid",

    date: "Aug 20, 2026",
    trackingNumber: "TRK-784512971",
    estimatedDelivery: "Aug 25, 2026",

    shippingAddress: "14 Hudson Street, New York, NY 10009",

    notes: "Delivered successfully.",
  },

  {
    id: "#ORD-1010",
    customer: "Ava Anderson",
    email: "ava.anderson@example.com",
    phone: "+1 202 555 0158",

    items: [
      {
        id: 14,
        name: "USB-C Hub",
        sku: "UH-5001",
        price: 39.99,
        quantity: 1,
      },
      {
        id: 15,
        name: "Mechanical Keyboard",
        sku: "MK-4001",
        price: 99,
        quantity: 1,
      },
    ],

    subtotal: 138.99,
    shipping: 10,
    tax: 6.95,
    amount: 155.94,

    status: "Pending",
    payment: "Pending",

    date: "Aug 19, 2026",
    trackingNumber: "TRK-784512972",
    estimatedDelivery: "Sep 05, 2026",

    shippingAddress: "67 East 10th Street, New York, NY 10010",

    notes: "Order is awaiting payment confirmation.",
  },
];

export const getOrderById = (id) => {
  const cleanId = String(id).replace("#", "");

  return ordersData.find((order) => order.id.replace("#", "") === cleanId);
};

export const getOrderStatusIndex = (status) => {
  const statusIndex = {
    Pending: 0,
    Processing: 1,
    Shipped: 2,
    Delivered: 4,
    Cancelled: -1,
  };

  return statusIndex[status] ?? 0;
};
