enum StatusCode {
	OK = 200,
	Created = 201,
	NoContent = 204,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	Conflict = 409,
	InternalServerError = 500,
}

export type Result<T> = {
	statusCode: StatusCode;
	statusMessage: string;
	message: string;
	data?: T;
	hint?: string;
};

export function ResponseMessage<T>(
	statusCode: StatusCode,
	message: string,
	data?: T,
	hint?: string
): Result<T> {
	const statusMessage =
		`${StatusCode[statusCode]}(${statusCode})` || "Unknown Status Code";
	const result = {
		statusCode,
		statusMessage,
		message,
		data,
		hint,
	};

	return result;
}
