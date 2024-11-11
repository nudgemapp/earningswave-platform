declare module "finnhub" {
  interface Authentication {
    apiKey: string;
  }

  interface Authentications {
    api_key: Authentication;
  }

  export class ApiClient {
    static instance: {
      authentications: Authentications;
    };
  }

  export class DefaultApi {
    constructor();

    transcripts(
      id: string,
      callback: (error: any, data: any, response: any) => void
    ): void;

    symbolSearch(
      query: string,
      callback: (error: any, data: any, response: any) => void
    ): void;

    stockSymbols(
      exchange: string,
      callback: (error: any, data: any, response: any) => void
    ): void;
  }

  const finnhub: {
    ApiClient: typeof ApiClient;
    DefaultApi: typeof DefaultApi;
  };

  export default finnhub;
}
