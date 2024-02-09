interface Message {
  jsonrpc: string;
}

export interface NotificationMessage extends Message {
	/**
	 * The method to be invoked.
	 */
	method: string;

	/**
	 * The notification's params.
	 */
	params?: unknown[] | object;
}

export interface RequestMessage extends NotificationMessage {
  /**
   * The request id.
   */
  id: number | string;
}

interface ResponseError {
  /**
   * A number indicating the error type that occurred.
   */
  code: number;

  /**
   * A string providing a short description of the error.
   */
  message: string;

  /**
   * A primitive or structured value that contains additional
   * information about the error. Can be omitted.
   */
  data?: string | number | boolean | unknown[] | object | null;
}

export interface ResponseMessage extends Message {
  /**
   * The request id.
   */
  id: number | string | null;

  /**
   * The result of a request. This member is REQUIRED on success.
   * This member MUST NOT exist if there was an error invoking the method.
   */
  result?: string | number | boolean | unknown[] | object | null;

  /**
   * The error object in case a request fails.
   */
  error?: ResponseError;
}
