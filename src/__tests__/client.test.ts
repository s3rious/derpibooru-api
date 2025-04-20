import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  type SearchImagesResponse,
  type SearchTagsResponse,
} from "../index.js";

import { DerpibooruClient } from "../client.js";

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("DerpibooruClient", () => {
  let client: DerpibooruClient;

  beforeEach(() => {
    client = new DerpibooruClient();
    vi.resetAllMocks();
  });

  describe("searchImages", () => {
    it("should successfully search for images", async () => {
      const mockResponse: SearchImagesResponse = {
        images: [
          {
            id: 1,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            first_seen_at: "2024-01-01T00:00:00Z",
            score: 100,
            comment_count: 0,
            width: 800,
            height: 600,
            description: "Test image",
            uploader: "test_user",
            uploader_id: 123,
            thumbnails_generated: true,
            spoilered: false,
            tag_ids: [1, 2],
            tags: ["test", "safe"],
            tag_count: 2,
            source_url: "https://example.com",
            source_urls: ["https://example.com"],
            representations: {
              full: "https://example.com/full.png",
              large: "https://example.com/large.png",
              medium: "https://example.com/medium.png",
              small: "https://example.com/small.png",
              tall: "https://example.com/tall.png",
              thumb: "https://example.com/thumb.png",
              thumb_small: "https://example.com/thumb_small.png",
              thumb_tiny: "https://example.com/thumb_tiny.png",
              mp4: undefined,
              webm: undefined,
            },
            intensities: { ne: 0.5, nw: 0.5, se: 0.5, sw: 0.5 },
            aspect_ratio: 1.33,
            size: 1024000,
            format: "png",
            mime_type: "image/png",
            name: "test.png",
            orig_sha512_hash: null,
            sha512_hash: "abcdef1234567890",
            orig_size: 1024000,
            processed: true,
            deletion_reason: null,
            duplicate_of: null,
            hidden_from_users: false,
            view_url: "https://example.com/view.png",
            wilson_score: 0.9,
            faves: 50,
            upvotes: 60,
            downvotes: 10,
            animated: false,
            duration: undefined,
          },
        ],
        total: 1,
        interactions: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchImages("safe");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.images).toHaveLength(1);
        expect(result.data.images[0].id).toBe(1);
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await client.searchImages("nonexistent");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("HTTP error!");
      }
    });

    it("should handle fetch errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await client.searchImages("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Network error");
      }
    });

    it("should handle JSON parse errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error("Invalid JSON")),
      });

      const result = await client.searchImages("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("Invalid JSON");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        images: [{ invalid: "data" }],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.searchImages("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getImage", () => {
    it("should successfully fetch a single image", async () => {
      const mockResponse = {
        image: {
          id: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          first_seen_at: "2024-01-01T00:00:00Z",
          score: 100,
          comment_count: 0,
          width: 800,
          height: 600,
          description: "Test image",
          uploader: "test_user",
          uploader_id: 123,
          thumbnails_generated: true,
          spoilered: false,
          tag_ids: [1, 2],
          tags: ["test", "safe"],
          tag_count: 2,
          source_url: "https://example.com",
          source_urls: ["https://example.com"],
          representations: {
            full: "https://example.com/full.png",
            large: "https://example.com/large.png",
            medium: "https://example.com/medium.png",
            small: "https://example.com/small.png",
            tall: "https://example.com/tall.png",
            thumb: "https://example.com/thumb.png",
            thumb_small: "https://example.com/thumb_small.png",
            thumb_tiny: "https://example.com/thumb_tiny.png",
            mp4: undefined,
            webm: undefined,
          },
          intensities: { ne: 0.5, nw: 0.5, se: 0.5, sw: 0.5 },
          aspect_ratio: 1.33,
          size: 1024000,
          format: "png",
          mime_type: "image/png",
          name: "test.png",
          orig_sha512_hash: null,
          sha512_hash: "abcdef1234567890",
          orig_size: 1024000,
          processed: true,
          deletion_reason: null,
          duplicate_of: null,
          hidden_from_users: false,
          view_url: "https://example.com/view.png",
          wilson_score: 0.9,
          faves: 50,
          upvotes: 60,
          downvotes: 10,
          animated: false,
          duration: undefined,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getImage(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.tags).toContain("safe");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        image: { invalid: "data" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getImage(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getFeaturedImage", () => {
    it("should successfully fetch the featured image", async () => {
      const mockResponse = {
        image: {
          id: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          first_seen_at: "2024-01-01T00:00:00Z",
          score: 100,
          comment_count: 0,
          width: 800,
          height: 600,
          description: "Test image",
          uploader: "test_user",
          uploader_id: 123,
          thumbnails_generated: true,
          spoilered: false,
          tag_ids: [1, 2],
          tags: ["test", "safe"],
          tag_count: 2,
          source_url: "https://example.com",
          source_urls: ["https://example.com"],
          representations: {
            full: "https://example.com/full.png",
            large: "https://example.com/large.png",
            medium: "https://example.com/medium.png",
            small: "https://example.com/small.png",
            tall: "https://example.com/tall.png",
            thumb: "https://example.com/thumb.png",
            thumb_small: "https://example.com/thumb_small.png",
            thumb_tiny: "https://example.com/thumb_tiny.png",
            mp4: undefined,
            webm: undefined,
          },
          intensities: { ne: 0.5, nw: 0.5, se: 0.5, sw: 0.5 },
          aspect_ratio: 1.33,
          size: 1024000,
          format: "png",
          mime_type: "image/png",
          name: "test.png",
          orig_sha512_hash: null,
          sha512_hash: "abcdef1234567890",
          orig_size: 1024000,
          processed: true,
          deletion_reason: null,
          duplicate_of: null,
          hidden_from_users: false,
          view_url: "https://example.com/view.png",
          wilson_score: 0.9,
          faves: 50,
          upvotes: 60,
          downvotes: 10,
          animated: false,
          duration: undefined,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getFeaturedImage();

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        image: { invalid: "data" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getFeaturedImage();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("searchTags", () => {
    it("should successfully search for tags", async () => {
      const mockResponse: SearchTagsResponse = {
        tags: [
          {
            id: 1,
            name: "test_tag",
            slug: "test_tag",
            description: "A test tag",
            short_description: "Test",
            spoiler_image_uri: "https://example.com/spoiler.png",
            aliased_tag: null,
            aliases: [],
            category: "content-fanmade",
            dnp_entries: [],
            images: 100,
            implied_by_tags: [],
            implied_tags: [],
            name_in_namespace: "test_tag",
            namespace: null,
          },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchTags("test");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.tags).toHaveLength(1);
        expect(result.data.tags[0].name).toBe("test_tag");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        tags: [{ invalid: "data" }],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.searchTags("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getTag", () => {
    it("should successfully fetch a tag", async () => {
      const mockResponse = {
        tag: {
          id: 1,
          name: "test_tag",
          slug: "test_tag",
          description: "A test tag",
          short_description: "Test",
          spoiler_image_uri: "https://example.com/spoiler.png",
          aliased_tag: null,
          aliases: [],
          category: "content-fanmade",
          dnp_entries: [],
          images: 100,
          implied_by_tags: [],
          implied_tags: [],
          name_in_namespace: "test_tag",
          namespace: null,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getTag("test_tag");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("test_tag");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        tag: { invalid: "data" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getTag("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getFilter", () => {
    it("should successfully fetch a filter", async () => {
      const mockResponse = {
        filter: {
          id: 1,
          name: "test_filter",
          description: "A test filter",
          user_id: 123,
          user_count: 100,
          system: false,
          public: true,
          spoilered_tag_ids: [1, 2],
          spoilered_complex: "",
          hidden_tag_ids: [3, 4],
          hidden_complex: "",
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getFilter(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("test_filter");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        filter: { invalid: "data" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getFilter(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getSystemFilters", () => {
    it("should successfully fetch system filters", async () => {
      const mockResponse = {
        filters: [
          {
            id: 1,
            name: "test_filter",
            description: "A test filter",
            user_id: 123,
            user_count: 100,
            system: true,
            public: true,
            spoilered_tag_ids: [1, 2],
            spoilered_complex: "",
            hidden_tag_ids: [3, 4],
            hidden_complex: "",
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getSystemFilters(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].system).toBe(true);
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        filters: [{ invalid: "data" }],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getSystemFilters();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getUser", () => {
    it("should successfully fetch a user", async () => {
      const mockResponse = {
        user: {
          id: 1,
          name: "test_user",
          slug: "test_user",
          role: "user",
          description: "A test user",
          avatar_url: "https://example.com/avatar.png",
          created_at: "2024-01-01T00:00:00Z",
          comment_count: 100,
          uploads_count: 50,
          posts_count: 25,
          topics_count: 10,
          links: ["https://example.com/user"],
          awards: ["Test Award"],
        },
      };

      const clientWithKey = new DerpibooruClient({ apiKey: "test_key" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await clientWithKey.getUser(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("test_user");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        user: { invalid: "data" },
      };

      const clientWithKey = new DerpibooruClient({ apiKey: "test_key" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await clientWithKey.getUser(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });

    it("should raise an error if the API key is not provided", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      const result = await client.getUser(1);

      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error).toContain(
          "API key is required for user retrieval",
        );
      }
    });
  });

  describe("getOembed", () => {
    it("should successfully fetch oembed data", async () => {
      const mockResponse = {
        author_name: "test_user",
        author_url: "https://example.com/user",
        cache_age: 7200,
        derpibooru_comments: 10,
        derpibooru_id: 1,
        derpibooru_score: 100,
        derpibooru_tags: ["test", "safe"],
        provider_name: "Derpibooru",
        provider_url: "https://derpibooru.org",
        title: "Test Image",
        type: "photo",
        version: "1.0",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getOembed("https://example.com/image.png");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.author_name).toBe("test_user");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        invalid: "data",
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getOembed("https://example.com/image.png");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("uploadImage", () => {
    it("should successfully upload an image", async () => {
      const mockResponse = {
        image: {
          id: 1,
          created_at: "2024-01-01T00:00:00Z",
          updated_at: "2024-01-01T00:00:00Z",
          first_seen_at: "2024-01-01T00:00:00Z",
          score: 0,
          comment_count: 0,
          width: 800,
          height: 600,
          file_name: "test.png",
          description: "Test image",
          uploader: "test_user",
          uploader_id: 123,
          image: "https://example.com/test.png",
          thumbnails_generated: true,
          spoilered: false,
          tag_ids: [1, 2],
          tags: ["test", "safe"],
          tag_count: 2,
          source_url: "https://example.com",
          source_urls: ["https://example.com"],
          representations: {
            full: "https://example.com/full.png",
            large: "https://example.com/large.png",
            medium: "https://example.com/medium.png",
            small: "https://example.com/small.png",
            tall: "https://example.com/tall.png",
            thumb: "https://example.com/thumb.png",
            thumb_small: "https://example.com/thumb_small.png",
            thumb_tiny: "https://example.com/thumb_tiny.png",
            mp4: undefined,
            webm: undefined,
          },
          intensities: { ne: 0.5, nw: 0.5, se: 0.5, sw: 0.5 },
          aspect_ratio: 1.33,
          size: 1024000,
          format: "png",
          mime_type: "image/png",
          name: "test.png",
          orig_sha512_hash: null,
          sha512_hash: "abcdef1234567890",
          orig_size: 1024000,
          processed: true,
          deletion_reason: null,
          duplicate_of: null,
          hidden_from_users: false,
          view_url: "https://example.com/view.png",
          wilson_score: 0.9,
          faves: 50,
          upvotes: 60,
          downvotes: 10,
          animated: false,
          duration: undefined,
        },
      };

      const clientWithKey = new DerpibooruClient({ apiKey: "test_key" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await clientWithKey.uploadImage({
        url: "https://example.com/image.png",
        description: "Test image",
        tags: ["test", "safe"],
        source_url: "https://example.com",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: expect.any(String),
        }),
      );
    });

    it("should raise an error if the API key is not provided", async () => {
      const result = await client.uploadImage({
        url: "https://example.com/image.png",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe("API key is required for image upload");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        image: { invalid: "data" },
      };

      const clientWithKey = new DerpibooruClient({ apiKey: "test_key" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await clientWithKey.uploadImage({
        url: "https://example.com/image.png",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("constructor", () => {
    it("should accept custom base URL", () => {
      const customClient = new DerpibooruClient({
        baseUrl: "https://custom.example.com",
      });

      expect(customClient).toBeInstanceOf(DerpibooruClient);
    });

    it("should accept API key", async () => {
      const apiKey = "test_key";
      const clientWithKey = new DerpibooruClient({ apiKey });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ images: [], total: 0 }),
      });

      await clientWithKey.searchImages("test");

      const lastCall = mockFetch.mock.calls[0][0] as URL;
      expect(lastCall.searchParams.get("key")).toBe(apiKey);
    });
  });

  describe("reverseImageSearch", () => {
    it("should successfully perform reverse image search", async () => {
      const mockResponse: SearchImagesResponse = {
        images: [
          {
            id: 1,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z",
            first_seen_at: "2024-01-01T00:00:00Z",
            score: 100,
            comment_count: 0,
            width: 800,
            height: 600,
            description: "Test image",
            uploader: "test_user",
            uploader_id: 123,
            thumbnails_generated: true,
            spoilered: false,
            tag_ids: [1, 2],
            tags: ["test", "safe"],
            tag_count: 2,
            source_url: "https://example.com",
            source_urls: ["https://example.com"],
            representations: {
              full: "https://example.com/full.png",
              large: "https://example.com/large.png",
              medium: "https://example.com/medium.png",
              small: "https://example.com/small.png",
              tall: "https://example.com/tall.png",
              thumb: "https://example.com/thumb.png",
              thumb_small: "https://example.com/thumb_small.png",
              thumb_tiny: "https://example.com/thumb_tiny.png",
              mp4: undefined,
              webm: undefined,
            },
            intensities: { ne: 0.5, nw: 0.5, se: 0.5, sw: 0.5 },
            aspect_ratio: 1.33,
            size: 1024000,
            format: "png",
            mime_type: "image/png",
            name: "test.png",
            orig_sha512_hash: null,
            sha512_hash: "abcdef1234567890",
            orig_size: 1024000,
            processed: true,
            deletion_reason: null,
            duplicate_of: null,
            hidden_from_users: false,
            view_url: "https://example.com/view.png",
            wilson_score: 0.9,
            faves: 50,
            upvotes: 60,
            downvotes: 10,
            animated: false,
            duration: undefined,
          },
        ],
        total: 1,
        interactions: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.reverseImageSearch(
        "https://example.com/image.png",
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.images).toHaveLength(1);
        expect(result.data.images[0].id).toBe(1);
      }

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(URL),
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        images: [{ invalid: "data" }],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.reverseImageSearch(
        "https://example.com/image.png",
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });

    it("should use custom distance parameter", async () => {
      const mockResponse: SearchImagesResponse = {
        images: [],
        total: 0,
        interactions: [],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      await client.reverseImageSearch("https://example.com/image.png", 0.5);

      const lastCall = mockFetch.mock.calls[0][0] as URL;
      expect(lastCall.searchParams.get("distance")).toBe("0.5");
    });
  });

  describe("getUserFilters", () => {
    it("should successfully fetch user filters", async () => {
      const mockResponse = {
        filters: [
          {
            id: 1,
            name: "test_filter",
            description: "A test filter",
            user_id: 123,
            user_count: 100,
            system: false,
            public: true,
            spoilered_tag_ids: [1, 2],
            spoilered_complex: "",
            hidden_tag_ids: [3, 4],
            hidden_complex: "",
          },
        ],
      };

      const clientWithKey = new DerpibooruClient({ apiKey: "test_key" });
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await clientWithKey.getUserFilters(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(1);
        expect(result.data[0].name).toBe("test_filter");
      }
    });

    it("should handle API errors", async () => {
      const clientWithKey = new DerpibooruClient({ apiKey: "test_key" });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const result = await clientWithKey.getUserFilters(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("HTTP error!");
      }
    });

    it("should raise an error if the API key is not provided", async () => {
      const result = await client.getUserFilters();

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBe(
          "API key is required for user filters retrieval",
        );
      }
    });
  });

  describe("getComment", () => {
    it("should successfully fetch a comment", async () => {
      const mockResponse = {
        comment: {
          id: 1,
          author: "test_user",
          avatar: "https://example.com/avatar.png",
          body: "Test comment",
          created_at: "2024-01-01T00:00:00Z",
          edited_at: null,
          image_id: 123,
          user_id: 456,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getComment(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.author).toBe("test_user");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        comment: { invalid: "data" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getComment(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("searchComments", () => {
    it("should successfully search comments", async () => {
      const mockResponse = {
        comments: [
          {
            id: 1,
            author: "test_user",
            avatar: "https://example.com/avatar.png",
            body: "Test comment",
            created_at: "2024-01-01T00:00:00Z",
            edited_at: null,
            image_id: 123,
            user_id: 456,
          },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchComments("test");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.comments).toHaveLength(1);
        expect(result.data.comments[0].author).toBe("test_user");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        comments: [{ invalid: "data" }],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.searchComments("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("searchGalleries", () => {
    it("should successfully search galleries", async () => {
      const mockResponse = {
        galleries: [
          {
            description: "Test gallery",
            id: 1,
            spoiler_warning: null,
            thumbnail_id: 123,
            title: "Test Gallery",
            user: "test_user",
            user_id: 456,
          },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchGalleries("test");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.galleries).toHaveLength(1);
        expect(result.data.galleries[0].title).toBe("Test Gallery");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        galleries: [{ invalid: "data" }],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.searchGalleries("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("getPost", () => {
    it("should successfully fetch a post", async () => {
      const mockResponse = {
        post: {
          author: "test_user",
          avatar: "https://example.com/avatar.png",
          body: "Test post",
          created_at: "2024-01-01T00:00:00Z",
          edit_reason: null,
          edited_at: null,
          id: 1,
          updated_at: "2024-01-01T00:00:00Z",
          user_id: 456,
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.getPost(1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
        expect(result.data.author).toBe("test_user");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        post: { invalid: "data" },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.getPost(1);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });

  describe("searchPosts", () => {
    it("should successfully search posts", async () => {
      const mockResponse = {
        posts: [
          {
            author: "test_user",
            avatar: "https://example.com/avatar.png",
            body: "Test post",
            created_at: "2024-01-01T00:00:00Z",
            edit_reason: null,
            edited_at: null,
            id: 1,
            updated_at: "2024-01-01T00:00:00Z",
            user_id: 456,
          },
        ],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.searchPosts("test");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.posts).toHaveLength(1);
        expect(result.data.posts[0].author).toBe("test_user");
      }
    });

    it("should handle validation errors", async () => {
      const invalidResponse = {
        posts: [{ invalid: "data" }],
        total: 1,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(invalidResponse),
      });

      const result = await client.searchPosts("test");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("Response validation failed");
      }
    });
  });
});
