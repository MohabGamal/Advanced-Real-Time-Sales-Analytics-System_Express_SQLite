import { test } from "node:test"
import assert from "node:assert"
import { nodeFetch } from "../utils/util.index"

type Res = {
	message: string
}

test("fails for invalid input of /api/orders", async () => {
	let res: Res = { message: "" }
	try {
		res = await nodeFetch<Res>("http://localhost:8800/api/orders", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				quantity: 1,
				price: 0,
			}),
		})
	} finally {
		assert.strictEqual(res.message, "please provide proper quantity and price") // Pass
	}
})

test("success for getting analytics of /api/analytics", async () => {
	let res: Res = { message: "" }
	try {
		res = await nodeFetch("http://localhost:8800/api/analytics")
	} finally {
		assert.strictEqual(res.message, "Analytics retrieved successfully") // Fail (expected: "Analytics retrieved successfully!")
	}
})
