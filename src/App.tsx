import { useState, useEffect } from 'react';

// Definimos qué tiene un producto según el backend
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity:number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  // 1. Cargar productos desde el Backend de Java
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error conectando al backend:", err));
  }, []);

  // 2. Lógica para agregar al carrito (en memoria del cliente)
 const addToCart = async (product: Product) => {
   // Verificamos que el producto tenga un ID real antes de enviar
   console.log("Agregando producto con ID:", product.id);

   const itemParaEnviar = {
     ...product, // Esto copia id, name, price, etc.
     quantity: 1
   };

   await fetch(`${import.meta.env.VITE_API_URL}/cart/user1/items`, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify(itemParaEnviar)
   });

   refreshCart();
 };

 const refreshCart = () => {
   fetch('http://localhost:8080/api/cart/user1')
     .then(res => res.json())
     .then(data => setCart(data));
 };

  // 3. Quitar del carrito (Llamada al Backend)
  const removeFromCart = async (productId: number) => {
    console.log("Intentando borrar producto con ID:", productId); // Revisa esto en la consola (F12)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/user1/items/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refreshCart(); // Esto vuelve a pedir el carrito al servidor
      }
    } catch (error) {
      console.error("Error al borrar:", error);
    }
  };

  return (
    <div className="container">
      <h1>🛒 Tienda Practica 2 (Java 25 + React)</h1>

      {/* SECCIÓN DE PRODUCTOS */}
      <div className="grid">
        {products.map(product => (
          <div key={product.id} className="card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p><strong>${product.price}</strong></p>

            {/* AGREGAMOS ESTA LÍNEA */}
            <p><small>Cantidad: {product.quantity}</small></p>

            <button className="btn" onClick={() => addToCart(product)}>Agregar al carrito</button>
          </div>
        ))}
      </div>

      {/* SECCIÓN DEL CARRITO */}
      <div className="cart-section">
        <h2>Tu Carrito ({cart.length} ítems)</h2>
        {cart.length === 0 ? <p>El carrito está vacío.</p> : (
          <ul>
            {cart.map((item, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>
                {item.name} - ${item.price}
                <button className="btn btn-delete" style={{ marginLeft: '10px' }} onClick={() => removeFromCart(item.id)}>Quitar</button>
              </li>
            ))}
          </ul>
        )}
        <h3>Total: ${cart.reduce((acc, item) => acc + item.price, 0)}</h3>
      </div>
    </div>
  );
}

export default App;