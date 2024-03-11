import axios, { AxiosInstance, AxiosResponse, Method } from "axios";

const PORT = process.env.APP_PORT;
const BASE_LOCALHOST = "http://localhost";
const LOCALHOST = PORT ? `${BASE_LOCALHOST}:${PORT}` : BASE_LOCALHOST;

interface RequestParams<TBody = unknown> {
  method: Method;
  url?: string;
  body?: TBody;
}

export interface ResponseError {
  name: string;
  code: number;
  message?: string;
}

export class RequestMaker<TData extends unknown, TBody = unknown> {
  private axiosInstance: AxiosInstance;

  constructor(url: string) {
    this.axiosInstance = axios.create({
      baseURL: LOCALHOST + url,
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

  private handleError(err: any): ResponseError {
    return {
      name: err.response.data.name,
      code: err.response.status,
      ...(err.response.data.message && { message: err.response.data.message }),
    };
  }

  public async request<TDataOverride = TData, TBodyOverride = TBody>(
    params: RequestParams<TBodyOverride>
  ): Promise<TDataOverride> {
    try {
      const response = await this.axiosInstance.request<TDataOverride>({
        url: params.url,
        method: params.method,
        data: params.body || undefined,
      });

      return response as TDataOverride;
    } catch (err) {
      throw err;
    }
  }
}
