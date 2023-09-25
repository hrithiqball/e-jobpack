enum StatusCode {
	OK = 200,
	Created = 201,
	NoContent = 204,
	BadRequest = 400,
	Unauthorized = 401,
	Forbidden = 403,
	NotFound = 404,
	InternalServerError = 500,
}

export type Result = {
	statusMessage: string;
	message: string;
	data?: any;
	hint?: string;
};

export default function ResponseMessage<T>(
	statusCode: StatusCode,
	message: string,
	data?: T,
	hint?: string
): Result {
	const statusMessage =
		`${StatusCode[statusCode]}(${statusCode})` || "Unknown Status Code";
	const result = {
		statusMessage,
		message,
		data,
		hint,
	};

	return result;
}
