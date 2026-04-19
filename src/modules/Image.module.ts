import { ImageSize, Image as RNImageStatic } from "react-native";

class Image {
  public static async getSize(
    url: string,
    headers: { [key: string]: string },
  ): Promise<ImageSize> {
    try {
      const res = await RNImageStatic.getSizeWithHeaders(url, headers);

      return res;
    } catch (error) {
      return { width: 2, height: 3 };
    }
  }
}

export default Image;
