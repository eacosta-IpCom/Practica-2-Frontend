import { useState, useEffect } from 'react';

// Definimos qué tiene un producto de acuerdo con el backend
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  quantity:number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([]); //Se utiliza para guardar los productos
  const [cart, setCart] = useState<Product[]>([]);

  // useEffect pide los productos al Backend
  useEffect(() => {
    fetch('http://localhost:8080/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error conectando al backend:", err));
  }, []);

  //Lógica para agregar al carrito (en memoria del cliente)
  //async / await = el programa espera la respuesta del servidor para continuar
const addToCart = async (product: Product) => {
  console.log("Agregando producto con ID:", product.id, "Cantidad:", product.quantity);

  // Se envía el producto con su cantidad actual
  const itemParaEnviar = {
    ...product
  };

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/user1/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(itemParaEnviar)
    });

    if (!response.ok) {
      // Si el backend responde con error 400 (Bad Request), se obtiene el mensaje
      const errorData = await response.json();
      alert("Error: " + errorData.message); //
    } else {
      refreshCart();
    }
  } catch (error) {
    console.error("Error al conectar con el servidor:", error);
  }
};


//vuelve a pedir la lista de todos los productos en el carrito
 const refreshCart = () => {
   fetch('http://localhost:8080/api/cart/user1')
     .then(res => res.json())
     .then(data => setCart(data));
 };

  //Obtiene el id del producto a borrar y lo envia al cartservice, si el back retorna como exitoso el borrado se actualiza la pantalla
  const removeFromCart = async (productId: number) => {
    console.log("Intentando borrar producto con ID:", productId);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart/user1/items/${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        refreshCart();
      }
    } catch (error) {
      console.error("Error al borrar:", error);
    }
  };

  return (
    <div className="container">
      <h1>Practica 2 cambios a la rama pruebasGitFrontend desde eacosta prueba 3 </h1>


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


    </div>
  );
}

export default App;