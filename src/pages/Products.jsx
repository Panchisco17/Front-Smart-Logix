import { useEffect, useState } from "react";
import { getInventory } from "../service/inventoryService";
import { getSaveUser } from "../service/authService";
import { createOrderRequest } from "../api/orderApi";

function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    
    const [customerName, setCustomerName] = useState("");
    const [customerEmail, setCustomerEmail] = useState("");
    const [shippingAddress, setShippingAddress] = useState("");

    // Nuevos estados para manejar el descuento
    const [discountCode, setDiscountCode] = useState("");
    const [isDiscountApplied, setIsDiscountApplied] = useState(false);

    const currentUser = getSaveUser();

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        setLoading(true);
        try {
            const response = await getInventory();
            const availableProducts = response.filter(item => item.availableQuantity > 0);
            setProducts(availableProducts);
        } catch (err) {
            setError("Error al cargar los productos disponibles.");
        } finally {
            setLoading(false);
        }
    }

    function handleAddToCart(product) {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.sku === product.sku);
            
            if (existingItem) {
                if (existingItem.quantity + 1 > product.availableQuantity) {
                    alert("No puedes agregar más de la cantidad disponible en stock.");
                    return prevCart;
                }
                return prevCart.map((item) =>
                    item.sku === product.sku ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    }

    function handleRemoveFromCart(sku) {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.sku === sku);
            if (existingItem.quantity === 1) {
                return prevCart.filter((item) => item.sku !== sku);
            } else {
                return prevCart.map((item) =>
                    item.sku === sku ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
        });
    }

    // Nueva función para validar y aplicar el descuento
    function handleApplyDiscount() {
        if (discountCode.trim().toUpperCase() === "2X1") {
            setIsDiscountApplied(true);
            setMessage("¡Código 2x1 aplicado con éxito!");
            setError("");
        } else {
            setError("Código de descuento inválido");
            setIsDiscountApplied(false);
        }
    }

    // Cálculo del subtotal base sin descuentos
    const baseSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    let discountAmount = 0;
    if (isDiscountApplied) {
        // Buscamos productos que tengan 2 o más unidades
        const eligibleItems = cart.filter(item => item.quantity >= 2);
        
        if (eligibleItems.length > 0) {
            // Ordenamos por precio de menor a mayor para aplicar el 2x1 al producto más barato
            const itemToDiscount = eligibleItems.sort((a, b) => a.price - b.price)[0];
            
            // Solo descontamos el equivalente a 1 unidad del producto de menor valor
            discountAmount = itemToDiscount.price; 
        }
    }

    // El subtotal real del carrito menos el descuento aplicado
    const cartSubtotal = baseSubtotal - discountAmount;

    const shippingCost = cartSubtotal > 50000 ? 0 : 5000;
    const cartTotal = cartSubtotal + shippingCost;

    async function handleCheckout() {
        if (cart.length === 0) return;
        
        if (!customerName.trim() || !customerEmail.trim() || !shippingAddress.trim()) {
            setError("Por favor, completa tu nombre, correo y dirección de envío.");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const orderData = {
                customerName: customerName.trim(),
                customerEmail: customerEmail.trim(),
                shippingAddress: shippingAddress.trim(),
                discountCode: isDiscountApplied ? discountCode.toUpperCase() : null, // Se envía el código usado
                lines: cart.map(item => ({
                    sku: item.sku,
                    quantity: item.quantity,
                    unitPrice: item.price 
                }))
            };

            await createOrderRequest(orderData);

            setMessage("¡Pedido realizado con éxito!");
            setCart([]); 
            setShippingAddress(""); 
            setCustomerName("");
            setCustomerEmail("");
            
            // Reiniciamos los estados del código de descuento
            setDiscountCode("");
            setIsDiscountApplied(false);

            await loadProducts(); 
            setTimeout(() => setMessage(""), 4000);
        } catch (err) {
            setMessage("");
            setError(err.message || "Hubo un problema al procesar el pedido.");
        } finally {
            setLoading(false);
        }
    }

    if (loading && products.length === 0) {
        return <div className="text-center py-10 text-gray-600">Cargando catálogo...</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            
            <div className="flex-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Catálogo de Productos</h2>

                {error && <div className="mb-4 p-3 rounded bg-red-100 text-red-700">{error}</div>}
                {message && <div className="mb-4 p-3 rounded bg-green-100 text-green-700">{message}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {products.length === 0 ? (
                        <p className="text-gray-500 col-span-full">No hay productos disponibles en este momento.</p>
                    ) : (
                        products.map((item) => (
                            <div key={item.sku} className="border border-gray-200 rounded-lg p-4 flex flex-col justify-between hover:shadow-md transition">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase">{item.sku}</span>
                                        <span className="bg-green-100 text-green-800 text-sm font-bold px-2 py-1 rounded">
                                            ${item.price?.toFixed(0)} 
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{item.productName}</h3>
                                    <p className="text-sm text-gray-600 mb-4">Stock disponible: <span className="font-bold text-blue-600">{item.availableQuantity}</span></p>
                                </div>
                                
                                <button onClick={() => handleAddToCart(item)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition">
                                    Agregar al Carrito
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className="w-full lg:w-96 bg-gray-50 p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">🛒 Mi Carrito</h2>

                {cart.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-6">Tu carrito está vacío.</p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <ul className="divide-y divide-gray-200">
                            {cart.map((item) => (
                                <li key={item.sku} className="py-3 flex justify-between items-center">
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{item.productName}</p>
                                        <p className="text-xs font-semibold text-gray-600">${(item.price * item.quantity).toFixed(0)}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 ml-2">
                                        <button onClick={() => handleRemoveFromCart(item.sku)} className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 font-bold">-</button>
                                        <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => handleAddToCart(item)} className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 font-bold">+</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-gray-200 pt-4 mt-2">
                            
                            {/* --- SECCIÓN NUEVA: INPUT DESCUENTO --- */}
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="Ingresa código (Ej: 2X1)"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm uppercase"
                                    disabled={isDiscountApplied}
                                />
                                <button
                                    onClick={handleApplyDiscount}
                                    disabled={isDiscountApplied || !discountCode.trim()}
                                    className={`px-4 py-2 rounded font-bold text-white transition text-sm ${
                                        isDiscountApplied ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                >
                                    {isDiscountApplied ? "Aplicado" : "Aplicar"}
                                </button>
                            </div>
                            {/* --- FIN SECCIÓN NUEVA --- */}

                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 text-sm">Artículos:</span>
                                <span className="font-bold text-gray-700">{cart.reduce((t, i) => t + i.quantity, 0)}</span>
                            </div>
                            
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 text-sm">Subtotal:</span>
                                <span className="font-bold text-gray-700">${baseSubtotal.toFixed(0)}</span>
                            </div>

                            {/* --- SECCIÓN NUEVA: MUESTRA EL DESCUENTO SI EXISTE --- */}
                            {discountAmount > 0 && (
                                <div className="flex justify-between items-center mb-1 text-green-600">
                                    <span className="text-sm font-semibold">Descuento 2x1 aplicado:</span>
                                    <span className="font-bold">-${discountAmount.toFixed(0)}</span>
                                </div>
                            )}

                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-500 text-sm">Costo de Envío:</span>
                                {shippingCost === 0 ? (
                                    <span className="font-bold text-green-600 uppercase text-sm">¡Gratis!</span>
                                ) : (
                                    <span className="font-bold text-gray-700">${shippingCost.toFixed(0)}</span>
                                )}
                            </div>

                            {cartSubtotal <= 50000 && (
                                <p className="text-xs text-blue-600 text-right mb-4 mt-1 font-medium">
                                    Agrega ${(50000 - cartSubtotal).toFixed(0)} más para envío gratis.
                                </p>
                            )}
                            
                            {cartSubtotal > 50000 && <div className="mb-4"></div>}

                            <div className="flex justify-between items-center mb-4 border-t border-gray-200 pt-2">
                                <span className="font-bold text-gray-800 text-lg">Total:</span>
                                <span className="font-bold text-2xl text-green-600">${cartTotal.toFixed(0)}</span>
                            </div>

                            <div className="flex flex-col gap-3 mb-4 border-t border-gray-200 pt-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Nombre Completo</label>
                                    <input 
                                        type="text" 
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Ej: Juan Pérez" 
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Correo Electrónico</label>
                                    <input 
                                        type="email" 
                                        value={customerEmail}
                                        onChange={(e) => setCustomerEmail(e.target.value)}
                                        placeholder="Ej: correo@mail.com" 
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Dirección de Envío</label>
                                    <input 
                                        type="text" 
                                        value={shippingAddress}
                                        onChange={(e) => setShippingAddress(e.target.value)}
                                        placeholder="Ej: Concha y Toro 123" 
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <button disabled={loading} onClick={handleCheckout} className={`w-full py-3 rounded font-bold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}>
                                {loading ? "Procesando..." : "Realizar Pedido"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProductsPage;