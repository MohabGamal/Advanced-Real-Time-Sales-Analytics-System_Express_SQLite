import { useEffect } from "react"
import "./Chart.css"
import useFetch from "../../hooks/useFetch"
import { TOrder } from "../../types"

type TTopSales = {
	product_ID: number
	total_revenue: number
}[]

type TAnalyticsRes = {
	message: string
	totalRevenue: number
	maxRevenue: number
	revenueChangeLastMinute: number | null
	totalOrdersLastMinute: number
	topSales: TTopSales
}

type TChartProps = {
	orders: TOrder[]
}

// orders prop to be used in useEffect to update the chart when a new order is received
const Chart = ({ orders }: TChartProps) => {
	const { data: revenues, fetchApi } = useFetch<TAnalyticsRes>()
	useEffect(() => {
		fetchApi("http://localhost:8800/api/analytics")
	}, [orders])

	return (
		<div className="chart-container">
			<h2>Top Sales (Revenue by Product)</h2>
			<div className="chart">
				{revenues &&
					revenues.topSales.map((sale) => (
						<div
							key={sale.product_ID}
							className="bar"
							style={
								{
									"--bar-height": `${
										(sale.total_revenue / revenues.maxRevenue) * 100
									}%`,
								} as React.CSSProperties
							}
							title={`$${sale.total_revenue}`}
						>
							{sale.product_ID}
						</div>
					))}
			</div>
		</div>
	)
}

export default Chart
