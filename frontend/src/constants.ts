export const wsActions = {
	ANALYTICS: "analytics",
	NEWORDER: "neworder",
} as const

export type TWsActions = (typeof wsActions)[keyof typeof wsActions]
export type TWsEventData<T> =  { action: TWsActions; message: T }
