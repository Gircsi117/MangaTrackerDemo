import { Image as RNImage } from "react-native";

class Image {
  public static getImageSize(
    url: string,
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      RNImage.getSize(
        url,
        (width, height) => resolve({ width, height }),
        reject,
      );
    });
  }
}

export default Image;
