export class FetchError extends Error {
	info: any;
	status: number;

	constructor(message: string) {
		super(message);
		this.name = "FetchError";
		this.status = 500;
	}
}

export const fetcher = async (url: string) => {
	const res = await fetch(`https://gomapi.hayasaka.moe${url}`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});

	if (!res.ok) {
		const error = new FetchError("An error occurred while fetching the data.");
		error.info = await res.json().catch(() => ({}));
		error.status = res.status;
		throw error;
	}

	return res.json();
};
