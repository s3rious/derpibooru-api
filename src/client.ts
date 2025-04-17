import { z } from "zod";

import {
  safe,
  ImageResponseSchema,
  TagSchema,
  FilterResponseSchema,
  UserResponseSchema,
  OembedResponseSchema,
  SearchImagesResponseSchema,
  SearchTagsResponseSchema,
  CommentResponseSchema,
  PostResponseSchema,
  SearchCommentsResponseSchema,
  SearchGalleriesResponseSchema,
  SearchPostsResponseSchema,
  type Safe,
  type ImageResponse,
  type Tag,
  type FilterResponse,
  type UserResponse,
  type OembedResponse,
  type SearchImagesResponse,
  type SearchTagsResponse,
  type CommentResponse,
  type PostResponse,
  type SearchCommentsResponse,
  type SearchGalleriesResponse,
  type SearchPostsResponse,
} from "./index.js";

interface DerpibooruClientConfig {
  apiKey?: string;
  baseUrl?: string;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  searchParams?: Record<string, string>;
}

class DerpibooruClient {
  readonly #baseUrl: string;
  readonly #apiKey?: string;

  constructor(config: DerpibooruClientConfig = {}) {
    this.#baseUrl = config.baseUrl ?? "https://derpibooru.org";
    this.#apiKey = config.apiKey;
  }

  #createUrl(path: string, searchParams?: Record<string, string>): URL {
    const url = new URL(path, this.#baseUrl);

    if (this.#apiKey) {
      url.searchParams.set("key", this.#apiKey);
    }

    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url;
  }

  async #makeRequest<TResponse>(
    path: string,
    options: RequestOptions = {},
    schema: z.ZodType<TResponse>,
  ): Promise<Safe<TResponse>> {
    const url = this.#createUrl(path, options.searchParams);

    const fetchResult = await safe(
      fetch(url, {
        method: options.method ?? "GET",
        headers: {
          "Content-Type": "application/json",
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      }),
    );

    if (!fetchResult.success) {
      return { success: false, error: fetchResult.error };
    }

    if (!fetchResult.data.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${fetchResult.data.status}`,
      };
    }

    const jsonResult = await safe(fetchResult.data.json());

    if (!jsonResult.success) {
      return { success: false, error: jsonResult.error };
    }

    const parseResult = safe(() => schema.parse(jsonResult.data));

    if (!parseResult.success) {
      return {
        success: false,
        error: `Response validation failed: ${parseResult.error}`,
      };
    }

    return { success: true, data: parseResult.data };
  }

  async searchImages(
    query: string,
    page = 1,
    perPage = 10,
  ): Promise<Safe<SearchImagesResponse>> {
    return this.#makeRequest(
      "/api/v1/json/search/images",
      {
        searchParams: {
          q: query,
          page: String(page),
          per_page: String(perPage),
        },
      },
      SearchImagesResponseSchema,
    );
  }

  async getImage(id: number): Promise<Safe<ImageResponse>> {
    const result = await this.#makeRequest(
      `/api/v1/json/images/${id}`,
      {},
      z.object({ image: ImageResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.image };
  }

  async getFeaturedImage(): Promise<Safe<ImageResponse>> {
    const result = await this.#makeRequest(
      "/api/v1/json/images/featured",
      {},
      z.object({ image: ImageResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.image };
  }

  async searchTags(query: string, page = 1): Promise<Safe<SearchTagsResponse>> {
    return this.#makeRequest(
      "/api/v1/json/search/tags",
      {
        searchParams: {
          q: query,
          page: String(page),
        },
      },
      SearchTagsResponseSchema,
    );
  }

  async getTag(tagId: string): Promise<Safe<Tag>> {
    const result = await this.#makeRequest(
      `/api/v1/json/tags/${tagId}`,
      {},
      z.object({ tag: TagSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.tag };
  }

  async getFilter(id: number): Promise<Safe<FilterResponse>> {
    const result = await this.#makeRequest(
      `/api/v1/json/filters/${id}`,
      {},
      z.object({ filter: FilterResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.filter };
  }

  async getSystemFilters(page = 1): Promise<Safe<FilterResponse[]>> {
    const result = await this.#makeRequest(
      "/api/v1/json/filters/system",
      {
        searchParams: { page: String(page) },
      },
      z.object({ filters: z.array(FilterResponseSchema) }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.filters };
  }

  async getUser(id: number): Promise<Safe<UserResponse>> {
    if (!this.#apiKey) {
      return {
        success: false,
        error: "API key is required for user retrieval",
      };
    }

    const result = await this.#makeRequest(
      `/api/v1/json/profiles/${id}`,
      {},
      z.object({ user: UserResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.user };
  }

  async getOembed(url: string): Promise<Safe<OembedResponse>> {
    return this.#makeRequest(
      "/api/v1/json/oembed",
      {
        searchParams: { url },
      },
      OembedResponseSchema,
    );
  }

  async uploadImage(params: {
    url: string;
    description?: string;
    tags?: string[];
    source_url?: string;
  }): Promise<Safe<ImageResponse>> {
    if (!this.#apiKey) {
      return { success: false, error: "API key is required for image upload" };
    }

    const result = await this.#makeRequest(
      "/api/v1/json/images",
      {
        method: "POST",
        body: {
          url: params.url,
          image: {
            description: params.description,
            tags: params.tags?.join(", "),
            source_url: params.source_url,
          },
        },
      },
      z.object({ image: ImageResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.image };
  }

  async reverseImageSearch(
    url: string,
    distance = 0.25,
  ): Promise<Safe<SearchImagesResponse>> {
    return this.#makeRequest(
      "/api/v1/json/search/reverse",
      {
        method: "POST",
        searchParams: {
          url,
          distance: String(distance),
        },
      },
      SearchImagesResponseSchema,
    );
  }

  async getUserFilters(page = 1): Promise<Safe<FilterResponse[]>> {
    if (!this.#apiKey) {
      return {
        success: false,
        error: "API key is required for user filters retrieval",
      };
    }

    const result = await this.#makeRequest(
      "/api/v1/json/filters/user",
      {
        searchParams: { page: String(page) },
      },
      z.object({ filters: z.array(FilterResponseSchema) }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.filters };
  }

  async getComment(id: number): Promise<Safe<CommentResponse>> {
    const result = await this.#makeRequest(
      `/api/v1/json/comments/${id}`,
      {},
      z.object({ comment: CommentResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.comment };
  }

  async searchComments(
    query: string,
    page = 1,
  ): Promise<Safe<SearchCommentsResponse>> {
    return this.#makeRequest(
      "/api/v1/json/search/comments",
      {
        searchParams: {
          q: query,
          page: String(page),
        },
      },
      SearchCommentsResponseSchema,
    );
  }

  async searchGalleries(
    query: string,
    page = 1,
  ): Promise<Safe<SearchGalleriesResponse>> {
    return this.#makeRequest(
      "/api/v1/json/search/galleries",
      {
        searchParams: {
          q: query,
          page: String(page),
        },
      },
      SearchGalleriesResponseSchema,
    );
  }

  async getPost(id: number): Promise<Safe<PostResponse>> {
    const result = await this.#makeRequest(
      `/api/v1/json/posts/${id}`,
      {},
      z.object({ post: PostResponseSchema }),
    );

    if (!result.success) {
      return result;
    }

    return { success: true, data: result.data.post };
  }

  async searchPosts(
    query: string,
    page = 1,
  ): Promise<Safe<SearchPostsResponse>> {
    return this.#makeRequest(
      "/api/v1/json/search/posts",
      {
        searchParams: {
          q: query,
          page: String(page),
        },
      },
      SearchPostsResponseSchema,
    );
  }
}

export { type DerpibooruClientConfig, type RequestOptions, DerpibooruClient };
