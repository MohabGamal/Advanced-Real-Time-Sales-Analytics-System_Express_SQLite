import { useState, useEffect } from "react"
import { TWsEventData } from "./constants"
import useFetch from "./hooks/useFetch"
import Chart from "./components/chart/chart"
import { TOrder } from "./types"

const App = () => {
	const [orders, setOrders] = useState<TOrder[]>([])
	const [price, setPrice] = useState<string>("")
	const [quantity, setQuantity] = useState<number>(1)
	const { error, isLoading, fetchApi } = useFetch<{ message: string }>()

	const handleQuantityChange = (change: number) => {
		setQuantity((prev) => Math.max(1, prev + change))
	}

	const handleSend = async (event: React.FormEvent) => {
		event.preventDefault()

		await fetchApi("http://localhost:8800/api/orders", {
			method: "POST",
			body: { price, quantity },
		})
	}
	useEffect(() => {
		const ws = new WebSocket("ws://localhost:8800")

		ws.onopen = () => {
			console.log("Connected to WebSocket server")
		}

		ws.onmessage = (event) => {
			console.log(event.data)
			const { action, message }: TWsEventData<TOrder> = JSON?.parse(event.data)
			if (action === "neworder") {
				setOrders((prevOrders) => [...prevOrders, message])
			}
			console.log(action, message)
		}

		ws.onclose = () => {
			console.log("WebSocket connection closed")
		}

		ws.onerror = (error) => {
			console.error("WebSocket error:", error)
		}

		return () => {
			ws.close()
		}
	}, [])

	return (
		<>
			<div className="container">
				<div className="card">
					<h1 className="title">Add New Order</h1>
					<form onSubmit={handleSend} className="form">
						<div className="form-group">
							<label htmlFor="price" className="label">
								Price
							</label>
							<input
								type="text"
								placeholder="Price"
								id="price"
								className="input"
								onChange={(e) => setPrice(e.target.value)}
							/>
						</div>

						<div className="form-group">
							<label htmlFor="quantity" className="label">
								Quantity
							</label>
							<div className="quantity-controls">
								<button
									type="button"
									onClick={() => handleQuantityChange(-1)}
									className="quantity-button"
								>
									-
								</button>
								<input
									type="text"
									id="quantity"
									value={quantity}
									readOnly
									className="quantity-input"
								/>
								<button
									type="button"
									onClick={() => handleQuantityChange(1)}
									className="quantity-button"
								>
									+
								</button>
							</div>
						</div>

						<button
							type="submit"
							className="submit-button"
							disabled={isLoading}
						>
							{isLoading ? "Sending..." : "Send"}
						</button>
					</form>
					{error && <p className="error-message">Error: {error}</p>}
					<ul className="message-list">
						<h2>New Orders</h2>
						{orders.map((order) => (
							<li key={order.orderId} className="message-item">
								<h3>Order: {order.orderId}</h3>
								<p>Price: {order.price}$</p>
								<p>Quantity: {order.quantity}</p>
							</li>
						))}
					</ul>
				</div>
        
			</div>
			<Chart orders={orders} />
		</>
	)
}

export default App
