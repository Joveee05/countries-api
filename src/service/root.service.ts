export default class RootService {
  processResponse(payload: {
    status: boolean;
    statusCode: number;
    message: string;
    data: any;
  }) {
    const { data, statusCode, message, status } = payload;
    return { status, statusCode, message, data };
  }

  getDefaultErrorResponse() {
    return {
      status: false,
      statusCode: 500,
      message: "Internal Server Error",
      data: [],
    };
  }
}
