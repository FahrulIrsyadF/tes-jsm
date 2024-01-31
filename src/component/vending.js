import React, { useState, useEffect } from "react";

export default function Vending() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedAmount, setSelectedAmount] = useState([]);
  const [change, setChange] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function getProduct() {
    const response = await fetch("http://localhost:5000/products");
    const prod = await response.json();
    // console.log(prod);
    if (response.status == 200) {
      setProducts(prod);
      // console.log(prod);
    } else {
      console.error("Error fetching products:", error);
    }
  }

  const handleProductSelect = (product) => {
    if (product.stock > 0) {
      setSelectedProduct(product);
      setQuantity(1);
      setError("");
      setMessage("");
    } else {
      setSelectedProduct(product);
      setError("Stok produk habis");
    }
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
      // Pastikan quantity tidak melebihi stok produk
      if (prevQuantity < selectedProduct.stock) {
        return prevQuantity + 1;
      }
      return prevQuantity;
    });
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => {
      // Pastikan quantity tidak kurang dari 1
      if (prevQuantity > 1) {
        return prevQuantity - 1;
      }
      return prevQuantity;
    });
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount((prevAmounts) => [...prevAmounts, amount]);
    setMessage("");
  };

  const handlePayment = (id) => {
    if (selectedProduct && selectedAmount.length > 0) {
      const totalAmount = selectedAmount.reduce(
        (sum, amount) => sum + amount,
        0
      );

      if (totalAmount >= selectedProduct.price * quantity) {
        const remainingChange = totalAmount - selectedProduct.price * quantity;
        setChange(remainingChange);

        fetch(`http://localhost:5000/products/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            stock: selectedProduct.stock - quantity,
          }),
        })
          .then((response) => {
            if (response.ok) {
              setMessage(
                "Pembayaran berhasil! Terima kasih sudah berbelanja. Anda akan kembali ke halaman awal dalam 5 detik"
              );
              
              // Reset data setelah pembayaran berhasil
              setTimeout(() => {
                location.href = "/";
              }, 5000);
            } else {
              setError("Gagal memperbarui stok produk.");
            }
          })
          .catch((error) => {
            setError("Terjadi kesalahan dalam pembaruan stok produk.");
            console.error("Error updating stock:", error);
          });
      } else {
        setError("Pembayaran gagal. Saldo Anda tidak cukup.");
        setTimeout(() => {
          setError("");
        }, 4000);
      }
    } else {
      setError("Pilih produk dan nominal pembayaran terlebih dahulu.");
      setTimeout(() => {
        setError("");
      }, 4000);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return (
    <div className="bg-[#A7727D] py-10 px-5">
      <div className="flex sm:flex-row flex-col h-screen rounded-2xl py-3 px-3 bg-[#EDDBC7]">
        {/* Bagian Kiri - List Produk */}
        <div className="sm:w-1/2 w-full p-4 select-none overflow-auto sm:overflow-hidden hover:overflow-y-auto">
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product)}
                className={`cursor-pointer text-center border p-4 rounded-md hover:bg-[#F9F5E7] ${
                  selectedProduct && selectedProduct.id === product.id
                    ? "bg-[#F9F5E7]"
                    : "bg-[#F8EAD8]"
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="mb-2 h-24 w-24 object-cover rounded-md mx-auto"
                />
                <p className="font-medium text-lg text-[#DACC96]">
                  {product.name}
                </p>
                <p className="text-sm font-bold text-[#DACC96]">
                  Harga: Rp.{product.price}
                </p>
                <p className="text-sm font-medium text-[#DACC96]">
                  Stok: {product.stock}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bagian Kanan - Informasi Produk yang Dipilih */}
        <div className="sm:w-1/2 w-full p-4 sm:overflow-hidden hover:overflow-y-auto">
          {selectedProduct ? (
            <div>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="mb-4 h-40 w-40 mx-auto object-cover rounded-md"
              />
              <p className="font-bold text-xl mb-2 text-[#9D5353]">
                Produk: {selectedProduct.name}
              </p>
              <p className="mb-2 text-[#9D5353]">
                Harga: Rp.{selectedProduct.price}
              </p>

              {selectedProduct.stock !== 0 && (
                <>
                  <div className="flex flex-col mb-2">
                    <span className="text-[#9D5353]">Kuantitas :</span>
                    <div className="relative inline-block text-left mt-2">
                      <button
                        className="bg-[#9D5353] hover:bg-[#BF8B67] text-white font-medium py-1 px-4 rounded-lg"
                        onClick={handleDecrement}
                      >
                        -
                      </button>
                      <input
                        className={`text-[#9D5353] rounded-r rounded-l w-12 text-center p-2 mx-2`}
                        type="text"
                        value={quantity}
                        // onChange={handleChange}
                        disabled
                      />
                      <button
                        className="bg-[#9D5353] hover:bg-[#BF8B67] text-white font-medium py-1 px-4 rounded-lg"
                        onClick={handleIncrement}
                      >
                        +
                      </button>
                      {/* {error && <p className="text-red-500">{error}</p>} */}
                    </div>
                  </div>

                  <p className="mb-2 text-[#9D5353]">
                    Harga yang harus dibayar: Rp.
                    {selectedProduct.price * quantity}
                  </p>

                  <div className="mb-2">
                    <p className="font-bold text-lg text-[#9D5353] mb-2">
                      Masukkan Uang:
                    </p>
                    <div className="flex flex-wrap">
                      {[2000, 5000, 10000, 20000, 50000].map((amount) => (
                        <div
                          key={amount}
                          onClick={() => handleAmountSelect(amount)}
                          className={`cursor-pointer select-none border border-[#9D5353] p-2 mr-2 mb-2 rounded-md text-[#9D5353] ${
                            selectedAmount === amount
                              ? "bg-[#9D5353] text-white"
                              : ""
                          }`}
                        >
                          Rp.{amount}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tampilkan jumlah nominal yang dipilih */}
                  {selectedAmount.length > 0 && (
                    <div className="mb-2 text-lg text-[#9D5353]">
                      Jumlah Nominal:{" "}
                      {Object.entries(
                        selectedAmount.reduce((countMap, amount) => {
                          countMap[amount] = (countMap[amount] || 0) + 1;
                          return countMap;
                        }, {})
                      )
                        .map(([amount, count]) => `Rp.${amount}x${count}`)
                        .join(", ")}
                    </div>
                  )}

                  <p className="mb-2 text-lg text-[#9D5353]">
                    Total Saldo Anda: Rp.
                    {selectedAmount.reduce((sum, amount) => sum + amount, 0)}
                  </p>

                  <p className="mb-2 text-lg text-[#9D5353]">
                    Kembalian: Rp.{change}
                  </p>

                  <button
                    onClick={() => handlePayment(selectedProduct.id)}
                    className="bg-[#9D5353] text-white p-3 rounded-md hover:bg-[#BF8B67]"
                  >
                    Bayar
                  </button>
                </>
              )}
              {message && (
                <p className="mt-4 py-3 px-2 mx-auto text-center text-lg bg-green-500 text-white rounded-xl select-none">
                  {message}
                </p>
              )}
              {error && (
                <p className="mt-4 py-3 px-2 mx-auto text-center text-lg bg-red-500 text-white rounded-xl select-none">
                  {error}
                </p>
              )}
            </div>
          ) : (
            // Tampilan awal halaman
            <div className="mx-auto mt-16">
              <p className="sm:text-3xl text-xl font-bold text-center text-gray-600 mb-4">
                Selamat datang di Mesin Jajan Otomatis!
              </p>
              <p className="sm:text-base text-sm font-bold text-center text-gray-500">
                Silakan pilih berbagai cemilan favorit untuk menemani hari Anda
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
