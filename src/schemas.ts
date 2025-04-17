import * as z from "zod";

// Base schemas
const ImageMetadataSchema = z.looseInterface({
  width: z.number(),
  height: z.number(),
  mime_type: z.string(),
  size: z.number(),
  duration: z.number().optional(),
});

const ArtistLinkSchema = z.looseInterface({
  user_id: z.number(),
  tag_id: z.number(),
  url: z.url(),
});

// Tag schema with self-referential structure
const TagSchema = z.looseInterface({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  short_description: z.string(),
  spoiler_image_uri: z.string().nullable(),
  aliased_tag: z.string().nullable(),
  aliases: z.array(z.string()),
  category: z.enum([
    "character",
    "content-fanmade",
    "content-official",
    "error",
    "oc",
    "origin",
    "rating",
    "species",
    "spoiler",
  ]),
  dnp_entries: z.array(z.any()),
  images: z.number(),
  implied_by_tags: z.array(z.string()),
  implied_tags: z.array(z.string()),
  name_in_namespace: z.string(),
  namespace: z.string().nullable(),
});

// Image response schema
const ImageResponseSchema = z.looseInterface({
  id: z.number(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  first_seen_at: z.iso.datetime(),
  score: z.number(),
  comment_count: z.number(),
  width: z.number(),
  height: z.number(),
  description: z.string(),
  uploader: z.string().nullable(),
  uploader_id: z.number().nullable(),
  thumbnails_generated: z.boolean(),
  spoilered: z.boolean(),
  tag_ids: z.array(z.number()),
  tags: z.array(z.string()),
  tag_count: z.number(),
  source_url: z.string().optional(),
  source_urls: z.array(z.string()).optional(),
  representations: z.record(z.string(), z.string()),
  intensities: z.record(z.string(), z.number()).optional(),
  aspect_ratio: z.number().optional(),
  size: z.number().optional(),
  format: z.string().optional(),
  mime_type: z.string().optional(),
  name: z.string().optional(),
  orig_sha512_hash: z.string().nullable(),
  sha512_hash: z.string().optional(),
  orig_size: z.number().optional(),
  processed: z.boolean().optional(),
  deletion_reason: z.string().nullable(),
  duplicate_of: z.number().nullable(),
  hidden_from_users: z.boolean().optional(),
  view_url: z.string().optional(),
  wilson_score: z.number().optional(),
  faves: z.number().optional(),
  upvotes: z.number().optional(),
  downvotes: z.number().optional(),
  animated: z.boolean().optional(),
  duration: z.number().optional(),
});

// Filter response schema
const FilterResponseSchema = z.looseInterface({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  user_id: z.number().nullable(),
  user_count: z.number(),
  system: z.boolean(),
  public: z.boolean(),
  spoilered_tag_ids: z.array(z.number()),
  spoilered_complex: z.string().nullable(),
  hidden_tag_ids: z.array(z.number()),
  hidden_complex: z.string().nullable(),
});

// User response schema
const UserResponseSchema = z.looseInterface({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  role: z.string(),
  description: z.string(),
  avatar_url: z.url().optional(),
  created_at: z.iso.datetime(),
  comment_count: z.number(),
  uploads_count: z.number(),
  posts_count: z.number(),
  topics_count: z.number(),
  links: z.array(z.url()),
  awards: z.array(z.string()),
});

// Oembed response schema
const OembedResponseSchema = z.looseInterface({
  author_name: z.string(),
  author_url: z.url(),
  cache_age: z.literal(7200),
  derpibooru_comments: z.number(),
  derpibooru_id: z.number(),
  derpibooru_score: z.number(),
  derpibooru_tags: z.array(z.string()),
  provider_name: z.literal("Derpibooru"),
  provider_url: z.literal("https://derpibooru.org"),
  title: z.string(),
  type: z.literal("photo"),
  version: z.literal("1.0"),
});

// API Response wrappers
const SearchImagesResponseSchema = z.looseInterface({
  total: z.number(),
  images: z.array(ImageResponseSchema),
  interactions: z.array(z.unknown()).optional(),
});

const SearchTagsResponseSchema = z.looseInterface({
  tags: z.array(TagSchema),
  total: z.number(),
});

// Comment response schema
const CommentResponseSchema = z.looseInterface({
  id: z.number(),
  author: z.string(),
  avatar: z.string().nullable(),
  body: z.string(),
  created_at: z.iso.datetime(),
  edited_at: z.iso.datetime().nullable(),
  image_id: z.number().nullable(),
  user_id: z.number().nullable(),
});

// Post response schema
const PostResponseSchema = z.looseInterface({
  author: z.string(),
  avatar: z.string().nullable(),
  body: z.string(),
  created_at: z.iso.datetime(),
  edit_reason: z.string().nullable(),
  edited_at: z.iso.datetime().nullable(),
  id: z.number(),
  updated_at: z.iso.datetime(),
  user_id: z.number().nullable(),
});

// Gallery response schema
const GalleryResponseSchema = z.looseInterface({
  description: z.string(),
  id: z.number(),
  spoiler_warning: z.string().nullable(),
  thumbnail_id: z.number().nullable(),
  title: z.string(),
  user: z.string(),
  user_id: z.number(),
});

// Search response wrappers for new types
const SearchCommentsResponseSchema = z.looseInterface({
  total: z.number(),
  comments: z.array(CommentResponseSchema),
});

const SearchGalleriesResponseSchema = z.looseInterface({
  total: z.number(),
  galleries: z.array(GalleryResponseSchema),
});

const SearchPostsResponseSchema = z.looseInterface({
  total: z.number(),
  posts: z.array(PostResponseSchema),
});

// Types inferred from schemas
type ImageMetadata = z.infer<typeof ImageMetadataSchema>;
type ArtistLink = z.infer<typeof ArtistLinkSchema>;
type Tag = z.infer<typeof TagSchema>;
type ImageResponse = z.infer<typeof ImageResponseSchema>;
type FilterResponse = z.infer<typeof FilterResponseSchema>;
type UserResponse = z.infer<typeof UserResponseSchema>;
type OembedResponse = z.infer<typeof OembedResponseSchema>;
type SearchImagesResponse = z.infer<typeof SearchImagesResponseSchema>;
type SearchTagsResponse = z.infer<typeof SearchTagsResponseSchema>;
type CommentResponse = z.infer<typeof CommentResponseSchema>;
type PostResponse = z.infer<typeof PostResponseSchema>;
type GalleryResponse = z.infer<typeof GalleryResponseSchema>;
type SearchCommentsResponse = z.infer<typeof SearchCommentsResponseSchema>;
type SearchGalleriesResponse = z.infer<typeof SearchGalleriesResponseSchema>;
type SearchPostsResponse = z.infer<typeof SearchPostsResponseSchema>;

export {
  ImageMetadataSchema,
  ArtistLinkSchema,
  TagSchema,
  ImageResponseSchema,
  FilterResponseSchema,
  UserResponseSchema,
  OembedResponseSchema,
  SearchImagesResponseSchema,
  SearchTagsResponseSchema,
  CommentResponseSchema,
  PostResponseSchema,
  GalleryResponseSchema,
  SearchCommentsResponseSchema,
  SearchGalleriesResponseSchema,
  SearchPostsResponseSchema,
  type ImageMetadata,
  type ArtistLink,
  type Tag,
  type ImageResponse,
  type FilterResponse,
  type UserResponse,
  type OembedResponse,
  type SearchImagesResponse,
  type SearchTagsResponse,
  type CommentResponse,
  type PostResponse,
  type GalleryResponse,
  type SearchCommentsResponse,
  type SearchGalleriesResponse,
  type SearchPostsResponse,
};
