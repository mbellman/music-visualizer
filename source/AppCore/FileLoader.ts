import { Callback } from 'Base/Core';

interface IBase64Data {
  header: string;
  data: string;
}

export default class FileLoader {
  public static fileToBase64Data (file: File): Promise<IBase64Data> {
    return new Promise((resolve: Callback<IBase64Data>) => {
      const fileReader: FileReader = new FileReader();

      fileReader.addEventListener('loadend', () => {
        const base64Data: IBase64Data = FileLoader._getBase64Data(fileReader.result);

        resolve(base64Data);
      });

      fileReader.readAsDataURL(file);
    });
  }

  public static async fileToBlob (file: File): Promise<Blob> {
    const uint8Array: Uint8Array = await FileLoader.fileToUint8Array(file);

    return new Blob([uint8Array], { type: file.type });
  }

  public static async fileToString (file: File): Promise<string> {
    const uint8Array: Uint8Array = await FileLoader.fileToUint8Array(file);

    return String.fromCharCode.apply(null, uint8Array);
  }

  public static async fileToUint8Array (file: File): Promise<Uint8Array> {
    const { header, data } = await FileLoader.fileToBase64Data(file);
    const decodedData: string = atob(data);
    const decodedBytes: number[] = new Array(decodedData.length);

    for (let i = 0; i < decodedBytes.length; i++) {
      decodedBytes[i] = decodedData.charCodeAt(i);
    }

    return new Uint8Array(decodedBytes);
  }

  public static urlToArrayBuffer (url: string): Promise<ArrayBuffer> {
    return new Promise((resolve: Callback<ArrayBuffer>) => {
      const ajax: XMLHttpRequest = new XMLHttpRequest();

      ajax.open('GET', url);
      ajax.responseType = 'arraybuffer';
      ajax.onload = () => resolve(ajax.response);
      ajax.send();
    });
  }

  private static _getBase64Data (fileReaderResult: string): IBase64Data {
    const [ header, data ] = fileReaderResult.split(';base64,');

    return { header, data };
  }
}
