import React, { useState } from 'react';
import product1 from '../../assets/product-1.png';
import product2 from '../../assets/product-2.png';
import product3 from '../../assets/product-3.png';
import product4 from '../../assets/product-4.png';

const ShopSection = () => {
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);

  const products = [
    {
      id: 1,
      name: 'Protein Powder',
      price: '120.00',
      image: product1
    },
    {
      id: 2,
      name: 'Water Bottle',
      price: '50.00',
      image: product2
    },
    {
      id: 3,
      name: 'Women Gloves',
      price: '240.00',
      image: product3
    },
    {
      id: 4,
      name: 'Gym Shoes',
      price: '120.00',
      image: product4
    }
  ];

  const getQuantity = (productId) => {
    return quantities[productId] || 0;
  };

  const incrementQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const decrementQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0)
    }));
  };

  const addToCart = (product) => {
    const quantity = getQuantity(product.id);
    
    if (quantity === 0) {
      alert('Please select a quantity');
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity }]);
    }

    // Reset quantity after adding to cart
    setQuantities(prev => ({
      ...prev,
      [product.id]: 0
    }));

    alert(`Added ${quantity} ${product.name}(s) to cart`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">Shop Our Fitness Collection</h2>
          <a href="#" className="text-blue-500 hover:text-blue-600 transition-colors">View All</a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col items-center">
              {/* Product Image with Hover Effect */}
              <div className="w-full aspect-square mb-4 overflow-hidden rounded-lg group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              
              {/* Product Name */}
              <h3 className="text-xl font-medium mb-2">{product.name}</h3>
              
              {/* Price */}
              <div className="text-xl font-bold mb-4">
                <span className="text-lg">₵</span>
                {product.price}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center border rounded-full overflow-hidden">
                  <button 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </button>
                  <span className="px-4">
                    {getQuantity(product.id) > 0 ? getQuantity(product.id) : ''}
                  </span>
                  <button 
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button 
                onClick={() => addToCart(product)}
                className="flex items-center gap-2 bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all hover:shadow-lg active:scale-95"
              >
                Add
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopSection; 