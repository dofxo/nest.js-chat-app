export default class SuccessException extends Error {
  statusCode: number;
  data: any;

  constructor({ message, data = {}, statusCode = 200 }) {
    super(message);
    this.name = "success";
    this.data = data;
    this.statusCode = statusCode;
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      name: this.name,
      message: this.message,
      data: this.data,
    };
  }
}
