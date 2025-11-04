export interface PhotoData {
  data: string;
  mimeType: string;
}

declare global {
  interface Window {
    adt_ajax: {
      api_url: string;
      nonce: string;
    };
  }
}
