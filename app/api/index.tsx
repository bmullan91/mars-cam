export interface Camera {
  id: number;
  name: string;
  rover_id: number;
  full_name: string;
}

export interface Rover {
  id: number;
  name: string;
  landing_date: string;
  launch_date: string;
  status: string;
}

export interface Metadata {
  id: number;
  sol: number;
  camera: Camera;
  img_src: string;
  earth_date: string;
  rover: Rover;
}

export interface Images {
  ascii: string;
  base64: string;
}

export interface RoverImage {
  metadata: Metadata;
  images: Images;
  index: string;
}

export interface TeamRover {
  numImages: number;
  key: string;
}

type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

interface RoverAPIOptions {
  fetch?: Fetch;
}

export class RoverAPI {
  fetch: Fetch;
  imageCount: number;
  BASE_URL: string;

  constructor(options?: RoverAPIOptions) {
    this.fetch = options?.fetch || fetch; // default to global, Remix polyfils this by default
    this.imageCount = 0;
    this.BASE_URL = "https://hiring.hypercore-protocol.org/termrover";
  }

  async getImageAtIndex(index: number): Promise<RoverImage> {
    const response = await this.fetch(`${this.BASE_URL}/${index}`);

    if (!response.ok) {
      throw new Error("Image not available");
    }

    const data: RoverImage = await response.json();

    return data;
  }

  async getImageCount() {
    if (this.imageCount) {
      return this.imageCount;
    }

    const response = await this.fetch(this.BASE_URL);

    if (!response.ok) {
      throw new Error("Failed calling getImageCount");
    }

    const { numImages }: TeamRover = await response.json();

    this.imageCount = numImages;

    return this.imageCount;
  }

  async getLatestImage() {
    const response = await this.fetch(`${this.BASE_URL}/latest`);

    if (!response.ok) {
      throw new Error("Failed to get the latest image");
    }

    const data: RoverImage = await response.json();

    return data;
  }

  async *roverImageGenerator(startingIndex?: number) {
    let index = startingIndex || 0;
    const imgCount = await this.getImageCount();

    while (index < imgCount) {
      const img = await this.getImageAtIndex(index);
      index++;
      yield img;
    }
  }
}

export function useRoverAPI() {
  const api = new RoverAPI();
  return api;
}
