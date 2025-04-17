import { describe, it, expect } from "vitest";

import { DerpibooruClient } from "../client.js";
import { safe } from "../safe.js";

// Skip these tests in CI environment
const itif = process.env.CI ? it.skip : it;

/* recurse over array and objects and sort every key:value of object and every array alphabetically */
function sortObject<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map(sortObject).sort() as T;
  }

  if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => [key, sortObject(value)]),
    ) as T;
  }

  return obj;
}

describe("Integration Tests", () => {
  const client = new DerpibooruClient();

  describe("searchImages", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch(
          "https://derpibooru.org/api/v1/json/search/images?q=safe&page=1&per_page=1",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.searchImages("safe", 1, 1);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data),
      );
    });
  });

  describe("getImage", () => {
    itif("should return same data as raw fetch", async () => {
      const imageId = 1; // Using a known image ID

      // Make raw fetch request
      const rawResponse = await safe(
        fetch(`https://derpibooru.org/api/v1/json/images/${imageId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getImage(imageId);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.image),
      );
    });
  });

  describe("getFeaturedImage", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch("https://derpibooru.org/api/v1/json/images/featured", {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getFeaturedImage();
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.image),
      );
    });
  });

  describe("searchTags", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch("https://derpibooru.org/api/v1/json/search/tags?q=pony&page=1", {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.searchTags("pony", 1);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data),
      );
    });
  });

  describe("getTag", () => {
    itif("should return same data as raw fetch", async () => {
      const tagId = "safe"; // Using a known tag ID

      // Make raw fetch request
      const rawResponse = await safe(
        fetch(`https://derpibooru.org/api/v1/json/tags/${tagId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getTag(tagId);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.tag),
      );
    });
  });

  describe("getFilter", () => {
    itif("should return same data as raw fetch", async () => {
      const filterId = 56027; // Using a known filter ID

      // Make raw fetch request
      const rawResponse = await safe(
        fetch(`https://derpibooru.org/api/v1/json/filters/${filterId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getFilter(filterId);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.filter),
      );
    });
  });

  describe("getSystemFilters", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch("https://derpibooru.org/api/v1/json/filters/system?page=1", {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getSystemFilters(1);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.filters),
      );
    });
  });

  describe("getOembed", () => {
    itif("should return same data as raw fetch", async () => {
      const imageUrl = "https://derpibooru.org/images/1"; // Using a known image URL

      // Make raw fetch request
      const rawResponse = await safe(
        fetch(
          `https://derpibooru.org/api/v1/json/oembed?url=${encodeURIComponent(imageUrl)}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getOembed(imageUrl);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data),
      );
    });
  });

  describe("getComment", () => {
    itif("should return same data as raw fetch", async () => {
      const commentId = 1000; // Using a known comment ID

      // Make raw fetch request
      const rawResponse = await safe(
        fetch(`https://derpibooru.org/api/v1/json/comments/${commentId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getComment(commentId);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.comment),
      );
    });
  });

  describe("searchComments", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch(
          "https://derpibooru.org/api/v1/json/search/comments?q=test&page=1",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.searchComments("test", 1);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data),
      );
    });
  });

  describe("searchGalleries", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch(
          "https://derpibooru.org/api/v1/json/search/galleries?q=test&page=1",
          {
            headers: {
              "Content-Type": "application/json",
            },
          },
        ),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.searchGalleries("test", 1);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data),
      );
    });
  });

  describe("getPost", () => {
    itif("should return same data as raw fetch", async () => {
      const postId = 2730144; // Using a known post ID

      // Make raw fetch request
      const rawResponse = await safe(
        fetch(`https://derpibooru.org/api/v1/json/posts/${postId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.getPost(postId);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data.post),
      );
    });
  });

  describe("searchPosts", () => {
    itif("should return same data as raw fetch", async () => {
      // Make raw fetch request
      const rawResponse = await safe(
        fetch("https://derpibooru.org/api/v1/json/search/posts?q=test&page=1", {
          headers: {
            "Content-Type": "application/json",
          },
        }),
      );

      expect(rawResponse.success).toBe(true);
      if (!rawResponse.success) return;

      const rawJson = await safe(rawResponse.data.json());
      expect(rawJson.success).toBe(true);
      if (!rawJson.success) return;

      // Make client request
      const clientResponse = await client.searchPosts("test", 1);
      expect(clientResponse.success).toBe(true);
      if (!clientResponse.success) return;

      // Compare responses
      expect(sortObject(clientResponse.data)).toMatchObject(
        sortObject(rawJson.data),
      );
    });
  });
});
