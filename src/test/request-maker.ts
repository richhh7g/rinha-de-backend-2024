import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

const PORT = process.env.APP_PORT;
const BASE_LOCALHOST = "http://localhost";
const LOCALHOST = PORT ? `${BASE_LOCALHOST}:${PORT}` : BASE_LOCALHOST;

export class RequestMaker<TData extends unknown> {
  private axiosInstance: AxiosInstance;

  constructor(url: string) {
    this.axiosInstance = axios.create({
      url,
      baseURL: LOCALHOST,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.axiosInstance.interceptors.response.use(
      this.handleSuccess,
      this.handleError
    );
  }

  private handleSuccess(response: AxiosResponse) {
    return response.data;
  }

  private handleError(err: any) {
    throw err;
  }

  public async request(config?: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await this.axiosInstance.request<TData>(
        config ? config : {}
      );
      return response;
    } catch (err) {
      return err.message;
    }
  }
}
