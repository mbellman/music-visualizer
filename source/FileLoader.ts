type FileLoadResolver = (value: Blob) => void;
type UrlLoadResolver = (value: any) => void;

interface IBase64Data {
  header: string;
  data: string;
}

export default class FileLoader {
  public static blobFromFile (file: File): Promise<Blob> {
    return new Promise((resolve: FileLoadResolver) => {
      const fileReader: FileReader = new FileReader();

      fileReader.addEventListener('loadend', () => {
        const { header, data } = FileLoader._getBase64Data(fileReader.result);
        const decodedData: string = atob(data);
        const decodedBytes: number[] = new Array(decodedData.length);

        for (let i = 0; i < decodedBytes.length; i++) {
          decodedBytes[i] = decodedData.charCodeAt(i);
        }

        const decodedByteArray = new Uint8Array(decodedBytes);
        const blob: Blob = new Blob([decodedByteArray], { type: header });

        resolve(blob);
      });

      fileReader.readAsDataURL(file);
    });
  }

  public static arrayBufferFromUrl (url: string): Promise<any> {
    return new Promise((resolve: UrlLoadResolver) => {
      const ajax: XMLHttpRequest = new XMLHttpRequest();

      ajax.open('GET', url);
      ajax.responseType = 'arraybuffer';
      ajax.onload = () => resolve(ajax.response);
      ajax.send();
    });
  }

  public static _getBase64Data (fileResult: string): IBase64Data {
    const [ header, data ] = fileResult.split(';base64,');

    return { header, data };
  }
}
