// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  res.status(200).json({
    products: [
      {
        id: "1",
        name: "Biskuit",
        price: 6000,
        stock: 10,
        image: "http://localhost:3000/img/biskuit.png",
      },
      {
        id: "2",
        name: "Chips",
        price: 8000,
        stock: 0,
        image: "http://localhost:3000/img/chips.png",
      },
      {
        id: "3",
        name: "Oreo",
        price: 10000,
        stock: 10,
        image: "http://localhost:3000/img/oreo.png",
      },
      {
        id: "4",
        name: "Tango",
        price: 12000,
        stock: 10,
        image: "http://localhost:3000/img/tango.png",
      },
      {
        id: "5",
        name: "Cokelat",
        price: 15000,
        stock: 10,
        image: "http://localhost:3000/img/cokelat.png",
      },
    ],
  });
}
