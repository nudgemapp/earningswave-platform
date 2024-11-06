declare module "finnhub" {
  export class ApiClient {
    static instance: {
      authentications: {
        api_key: {
          apiKey: string;
        };
      };
    };
  }

  export class DefaultApi {
    transcripts(
      id: string,
      callback: (error: any, data: any, response: any) => void
    ): void;
  }

  export default {
    ApiClient,
    DefaultApi,
  };
}
