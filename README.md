# Derpibooru API Client

![Branches](.github/badges/coverage-branches.svg)
![Functions](.github/badges/coverage-functions.svg)
![Lines](.github/badges/coverage-lines.svg)
![Statements](.github/badges/coverage-statements.svg)
![Coverage](.github/badges/coverage-total.svg)

A modern TypeScript implementation of the Derpibooru API with Zod validation, designed to be Web-interoperable across all server runtimes.

## Features

- Full TypeScript support with type inference
- Runtime validation using Zod v4
- Comprehensive API coverage
- Type-safe response handling
- GO-style error handling with Safe<T> type
- Web-interoperable (works in Node.js, Bun, Browser, and other runtimes)

## Requirements

- Node.js >=22.14.0 (or any Web-interoperable runtime)
- TypeScript >=5.3.3 (for development)
- Zod v4 (peer dependency)

## Usage

```typescript
import { DerpibooruClient } from 'derpibooru-api';

// Create a client instance with explicit configuration type
const derpibooruClient = new DerpibooruClient({
  apiKey: 'your-api-key', // Optional
});

// Search for images with explicit parameters
async function searchPonyImages() {
  const searchParameters = {
    query: 'safe, pony',
    pageNumber: 1,
    imagesPerPage: 15,
  };

  const searchResult = await derpibooruClient.searchImages(
    searchParameters.query,
    searchParameters.pageNumber,
    searchParameters.imagesPerPage
  );

  if (!searchResult.success) {
    console.error('Failed to search images:', searchResult.error);
    return;
  }

  console.log(searchResult.data.images);
}

// Get a specific image by ID
async function getSpecificImage(imageId: number) {
  const imageResult = await derpibooruClient.getImage(imageId);

  if (!imageResult.success) {
    console.error('Failed to get image:', imageResult.error);
    return;
  }

  console.log(imageResult.data);
}

// Search tags with artist name
async function searchArtistTags(artistName: string) {
  const tagResult = await derpibooruClient.searchTags(`artist:${artistName}`);

  if (!tagResult.success) {
    console.error('Failed to search tags:', tagResult.error);
    return;
  }

  console.log(tagResult.data.tags);
}

// Upload an image with complete metadata
async function uploadImageWithMetadata() {
  const imageMetadata = {
    imageUrl: 'https://example.com/image.png',
    imageDescription: 'A cute pony',
    imageTags: ['safe', 'pony'],
    sourceUrl: 'https://example.com/source',
  };

  const uploadResult = await derpibooruClient.uploadImage({
    url: imageMetadata.imageUrl,
    description: imageMetadata.imageDescription,
    tags: imageMetadata.imageTags,
    source_url: imageMetadata.sourceUrl,
  });

  if (!uploadResult.success) {
    console.error('Failed to upload image:', uploadResult.error);
    return;
  }

  console.log(uploadResult.data);
}

// Perform reverse image search with similarity threshold
async function findSimilarImages(imageUrl: string, similarityThreshold: number) {
  const searchResult = await derpibooruClient.reverseImageSearch(
    imageUrl,
    similarityThreshold
  );

  if (!searchResult.success) {
    console.error('Failed to perform reverse image search:', searchResult.error);
    return;
  }

  console.log(searchResult.data);
}
```

## API Reference

### `DerpibooruClient`

The main client class for interacting with the Derpibooru API.

#### Constructor

```typescript
type DerpibooruClientConfiguration = {
  readonly apiKey?: string;
  readonly baseUrl?: string;
};

const configuration: DerpibooruClientConfiguration = {
  apiKey: '',
  baseUrl: '',
}

const derpibooruClient = new DerpibooruClient(configuration)
```

#### Methods

All methods return a `Safe<T>` type where `T` is the expected response type:

```typescript
type Safe<T> = {
  readonly success: true;
  readonly data: T;
} | {
  readonly success: false;
  readonly error: string;
};
```

Available methods:

Images:
- `searchImages(query: string, page?: number, perPage?: number): Promise<Safe<SearchImagesResponse>>`
- `getImage(id: number): Promise<Safe<ImageResponse>>`
- `getFeaturedImage(): Promise<Safe<ImageResponse>>`
- `uploadImage(params: { url: string; description?: string; tags?: string[]; source_url?: string }): Promise<Safe<ImageResponse>>`
- `reverseImageSearch(url: string, distance?: number): Promise<Safe<SearchImagesResponse>>`

Tags:
- `searchTags(query: string, page?: number): Promise<Safe<SearchTagsResponse>>`
- `getTag(tagId: string): Promise<Safe<Tag>>`

Filters:
- `getFilter(id: number): Promise<Safe<FilterResponse>>`
- `getSystemFilters(page?: number): Promise<Safe<FilterResponse[]>>`
- `getUserFilters(page?: number): Promise<Safe<FilterResponse[]>>`

Users and Profiles:
- `getUser(id: number): Promise<Safe<UserResponse>>`

Comments:
- `getComment(id: number): Promise<Safe<CommentResponse>>`
- `searchComments(query: string, page?: number): Promise<Safe<SearchCommentsResponse>>`

Galleries:
- `searchGalleries(query: string, page?: number): Promise<Safe<SearchGalleriesResponse>>`

Posts:
- `getPost(id: number): Promise<Safe<PostResponse>>`
- `searchPosts(query: string, page?: number): Promise<Safe<SearchPostsResponse>>`

Embeds:
- `getOembed(url: string): Promise<Safe<OembedResponse>>`

## Type Safety

All responses are validated at runtime using Zod schemas. The library exports all types and schemas for use in your application:

```typescript
// Types
import type {
  ImageResponse,
  Tag,
  FilterResponse,
  UserResponse,
  OembedResponse,
  SearchImagesResponse,
  SearchTagsResponse,
  CommentResponse,
  PostResponse,
  SearchCommentsResponse,
  SearchGalleriesResponse,
  SearchPostsResponse,
} from 'derpibooru-api';

// Schemas
import {
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
} from 'derpibooru-api';
```

## Error Handling

The library uses a type-safe error handling pattern, returning a `Safe<T>` type. This approach:

- Makes error handling explicit and predictable
- Avoids throwing errors (except for programmer errors)
- Provides type-safe error handling
- Works well across different runtimes

Example error handling with early returns:

```typescript
async function handleImageRequest(imageId: number) {
  const imageResult = await derpibooruClient.getImage(imageId);

  if (!imageResult.success) {
    if (imageResult.error.includes('validation failed')) {
      console.error('API response validation failed:', imageResult.error);
      return;
    }
    
    console.error('API request failed:', imageResult.error);
    return;
  }

  console.log('Image data:', imageResult.data);
}
```

## Web-interoperability

This library is designed to work across all Web-interoperable runtimes by:

- Using only standard Web APIs (fetch, URL, etc.)
- Avoiding runtime-specific dependencies
- Following the Minimum Common Web Platform API specification
- Using ESM modules
- Providing consistent behavior across environments

## License

MIT 