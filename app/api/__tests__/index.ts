import { RoverAPI, RoverImage, TeamRover } from "../";

const mockFetch = jest.fn();

const api = new RoverAPI({ fetch: mockFetch });
const realApi = new RoverAPI();

export const mockRoverImg = (): RoverImage => ({
  images: { ascii: "", base64: "" },
  index: "0",
  metadata: {
    camera: { full_name: "", id: 1, name: "cam", rover_id: 1 },
    earth_date: new Date().toISOString(),
    id: 1,
    img_src: "",
    rover: {
      id: 1,
      landing_date: new Date().toISOString(),
      launch_date: new Date().toISOString(),
      name: "Perseverance",
      status: "ok",
    },
    sol: 1,
  },
});

describe("Rover API", () => {
  describe("getImageAtIndex", () => {
    it("should return an image for a valid index", async () => {
      const expected = mockRoverImg();
      const index = 0;
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(expected), { status: 200 })
      );
      const actual = await api.getImageAtIndex(index);

      expect(actual).toEqual(expected);
      expect(mockFetch).toHaveBeenCalledWith(`${api.BASE_URL}/${index}`);
    });

    it("should throw if no image found", async () => {
      mockFetch.mockResolvedValueOnce(new Response("nope", { status: 404 }));

      await expect(api.getImageAtIndex(999999999)).rejects.toThrow(
        "Image not available"
      );
    });
  });

  describe("getImageCount", () => {
    it("should throw if an error occurs", async () => {
      mockFetch.mockResolvedValueOnce(new Response("nope", { status: 500 }));

      await expect(api.getImageCount()).rejects.toThrow(
        "Failed calling getImageCount"
      );
    });

    it("should return the number of images", async () => {
      const expected = 123;

      const r = new Response(JSON.stringify({ numImages: expected }), {
        status: 200,
      });
      mockFetch.mockResolvedValueOnce(r);
      const actual = await api.getImageCount();

      expect(actual).toEqual(expected);
      expect(mockFetch).toHaveBeenCalledWith(api.BASE_URL);
    });

    it("should used a previously cached value", async () => {
      mockFetch.mockClear();
      const expected = 123;
      const actual = await api.getImageCount();

      expect(actual).toEqual(expected);
      expect(mockFetch).toHaveBeenCalledTimes(0);
    });
  });

  describe("getLatestImage", () => {
    it("should return a RoverImage", async () => {
      const expected = mockRoverImg();
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(expected), { status: 200 })
      );
      const actual = await api.getLatestImage();

      expect(actual).toEqual(expected);
      expect(mockFetch).toHaveBeenCalledWith(`${api.BASE_URL}/latest`);
    });

    it("should return a RoverImage", async () => {
      mockFetch.mockResolvedValueOnce(new Response("nope", { status: 404 }));

      await expect(api.getLatestImage()).rejects.toThrow(
        "Failed to get the latest image"
      );
    });
  });

  describe("roverImageGenerator", () => {
    it("should return an async iterator yielding RoverImage's", async () => {
      const customAPI = new RoverAPI({ fetch: mockFetch });
      customAPI.imageCount = 1;
      const expected = mockRoverImg();
      mockFetch.mockResolvedValueOnce(
        new Response(JSON.stringify(expected), { status: 200 })
      );

      for await (let img of customAPI.roverImageGenerator()) {
        expect(img).toEqual(expected);
      }
    });
  });
});
