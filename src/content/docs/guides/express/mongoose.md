---
title: Mongoose
description: Mongoose
---

Mongoose is an ODM (**Object Document Mapper**) for MongoDB that provides schema **validation**, **relationships**, **middleware**, and **TypeScript** support.

### Why Mongoose?

- **Schema Enforcement**: Define structure and data types
- **Validation**: Built-in and custom validation rules
- **Middleware**: Pre/post hooks for business logic
- **Population**: Easy document referencing
- **Type Safety**: Full TypeScript support
- **Instance Methods**: Object-oriented approach

### Architecture

```
React Frontend → Express API → Mongoose Models → MongoDB
     ↑                ↑              ↑            ↑
  TypeScript      TypeScript     TypeScript    BSON Data
```

---

## 2. Setting Up Mongoose

**Description**: Configure Mongoose with TypeScript support and connection management.

### Installation & Dependencies

```bash
npm install mongoose
npm install -D @types/mongoose
```

### Database Connection Setup

```typescript
// config/database.ts
import mongoose from "mongoose";
import { config } from "dotenv";

config();

export interface DatabaseConfig {
  uri: string;
  options: mongoose.ConnectOptions;
}

export const dbConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/mernapp",
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    bufferMaxEntries: 0,
  },
};
```

### Connection Manager

```typescript
// lib/mongodb.ts
import mongoose, { Connection } from "mongoose";
import { dbConfig } from "../config/database";

class DatabaseService {
  private static instance: DatabaseService;
  private connection: typeof mongoose | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      // Mongoose event listeners
      mongoose.connection.on("connected", () => {
        console.log("✅ Mongoose connected to MongoDB");
      });

      mongoose.connection.on("error", (error) => {
        console.error("❌ Mongoose connection error:", error);
      });

      mongoose.connection.on("disconnected", () => {
        console.log("📭 Mongoose disconnected");
      });

      // Connect to database
      this.connection = await mongoose.connect(dbConfig.uri, dbConfig.options);
      this.isConnected = true;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw new Error(`Database connection failed: ${error}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      this.isConnected = false;
    }
  }

  getConnection(): typeof mongoose {
    if (!this.isConnected || !this.connection) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.connection;
  }

  isDatabaseConnected(): boolean {
    return this.isConnected && mongoose.connection.readyState === 1;
  }

  // Graceful shutdown
  async gracefulShutdown(): Promise<void> {
    console.log("Received shutdown signal. Closing MongoDB connection...");
    await this.disconnect();
    console.log("MongoDB connection closed. Goodbye!");
  }
}

// Handle application termination
process.on("SIGINT", async () => {
  await DatabaseService.getInstance().gracefulShutdown();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await DatabaseService.getInstance().gracefulShutdown();
  process.exit(0);
});

export const databaseService = DatabaseService.getInstance();
```

---

## 3. Schema Design & Models

**Description**: Define Mongoose schemas with TypeScript interfaces for type safety.

### Base Schema with Timestamps

```typescript
// types/base.types.ts
import { Document, Types } from "mongoose";

export interface BaseDocument extends Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Reusable schema options
export const baseSchemaOptions = {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
};
```

### User Schema with Comprehensive Validation

```typescript
// models/User.ts
import { Schema, model, Model, Types } from "mongoose";
import { BaseDocument, baseSchemaOptions } from "../types/base.types";
import bcrypt from "bcryptjs";

// TypeScript Interface
export interface IUser extends BaseDocument {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
  profile: {
    avatar?: string;
    bio?: string;
    location?: string;
    website?: string;
  };
  preferences: {
    emailNotifications: boolean;
    theme: "light" | "dark";
    language: string;
  };
  stats: {
    postCount: number;
    commentCount: number;
    lastActive: Date;
  };
  isActive: boolean;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Static Methods Interface
interface UserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
  findActiveUsers(): Promise<IUser[]>;
}

// Schema Definition
const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include in queries by default
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    profile: {
      avatar: String,
      bio: {
        type: String,
        maxlength: [500, "Bio cannot exceed 500 characters"],
      },
      location: String,
      website: {
        type: String,
        match: [/^https?:\/\/.+\..+/, "Please enter a valid URL"],
      },
    },
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      theme: { type: String, enum: ["light", "dark"], default: "light" },
      language: { type: String, default: "en" },
    },
    stats: {
      postCount: { type: Number, default: 0 },
      commentCount: { type: Number, default: 0 },
      lastActive: { type: Date, default: Date.now },
    },
    isActive: { type: Boolean, default: true },
    lastLogin: Date,
  },
  baseSchemaOptions
);

// Indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1, createdAt: -1 });
userSchema.index({ "stats.lastActive": -1 });
userSchema.index({ isActive: 1 });

// Instance Methods
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Static Methods
userSchema.statics.findByEmail = function (
  email: string
): Promise<IUser | null> {
  return this.findOne({ email }).select("+password");
};

userSchema.statics.findActiveUsers = function (): Promise<IUser[]> {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Virtuals
userSchema.virtual("profile.fullName").get(function () {
  return this.name;
});

userSchema.virtual("isRecentlyActive").get(function () {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return this.stats.lastActive > thirtyDaysAgo;
});

export const User = model<IUser, UserModel>("User", userSchema);
```

### Post Schema with References

```typescript
// models/Post.ts
import { Schema, model, Model, Types } from "mongoose";
import { BaseDocument, baseSchemaOptions } from "../types/base.types";

// Embedded Comment Schema
export interface IComment {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: {
      type: String,
      required: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Main Post Interface
export interface IPost extends BaseDocument {
  title: string;
  content: string;
  author: Types.ObjectId;
  tags: string[];
  category: string;
  status: "draft" | "published" | "archived";
  metadata: {
    views: number;
    likes: number;
    readTime: number;
    featured: boolean;
  };
  comments: IComment[];
  publishedAt?: Date;
}

interface PostModel extends Model<IPost> {
  findPublished(): Promise<IPost[]>;
  findByAuthor(authorId: Types.ObjectId): Promise<IPost[]>;
  searchPosts(query: string): Promise<IPost[]>;
}

const postSchema = new Schema<IPost, PostModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      minlength: [50, "Content must be at least 50 characters"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        "technology",
        "lifestyle",
        "education",
        "business",
        "entertainment",
      ],
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    metadata: {
      views: { type: Number, default: 0 },
      likes: { type: Number, default: 0 },
      readTime: { type: Number, default: 0 },
      featured: { type: Boolean, default: false },
    },
    comments: [commentSchema],
    publishedAt: Date,
  },
  baseSchemaOptions
);

// Indexes
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ tags: 1 });
postSchema.index({ "metadata.featured": 1, publishedAt: -1 });
postSchema.index({ title: "text", content: "text" });

// Static Methods
postSchema.statics.findPublished = function (): Promise<IPost[]> {
  return this.find({ status: "published" })
    .populate("author", "name email profile.avatar")
    .sort({ publishedAt: -1 });
};

postSchema.statics.findByAuthor = function (
  authorId: Types.ObjectId
): Promise<IPost[]> {
  return this.find({ author: authorId }).sort({ createdAt: -1 });
};

postSchema.statics.searchPosts = function (query: string): Promise<IPost[]> {
  return this.find(
    { $text: { $search: query }, status: "published" },
    { score: { $meta: "textScore" } }
  ).sort({ score: { $meta: "textScore" } });
};

// Virtual for comment count
postSchema.virtual("commentCount").get(function () {
  return this.comments.length;
});

// Calculate read time before save
postSchema.pre("save", function (next) {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  this.metadata.readTime = Math.ceil(wordCount / wordsPerMinute);
  next();
});

export const Post = model<IPost, PostModel>("Post", postSchema);
```

---

## 4. CRUD Operations

**Description**: Implement complete CRUD operations using Mongoose methods.

### User Service with Full CRUD

```typescript
// services/UserService.ts
import { Types, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { User, IUser } from "../models/User";
import { AppError } from "../utils/errorHandler";

export class UserService {
  // CREATE
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: IUser["role"];
  }): Promise<IUser> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new AppError("User with this email already exists", 400);
      }

      const user = new User({
        ...userData,
        role: userData.role || "user",
        profile: {},
        preferences: {
          emailNotifications: true,
          theme: "light",
          language: "en",
        },
        stats: {
          postCount: 0,
          commentCount: 0,
          lastActive: new Date(),
        },
      });

      await user.save();
      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to create user", 500);
    }
  }

  // READ
  async getUserById(id: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError("Invalid user ID", 400);
    }

    return User.findById(id).select("-password");
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findByEmail(email);
  }

  async getUsers(
    filter: FilterQuery<IUser> = {},
    options: {
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
      select?: string;
    } = {}
  ): Promise<{
    users: IUser[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sort = { createdAt: -1 },
      select = "-password",
    } = options;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select(select)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  // UPDATE
  async updateUser(
    userId: string,
    updates: UpdateQuery<IUser>,
    options: QueryOptions = { new: true, runValidators: true }
  ): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    // Remove immutable fields
    const { _id, createdAt, ...safeUpdates } = updates as any;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...safeUpdates,
        $set: { "stats.lastActive": new Date() },
      },
      options
    ).select("-password");

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return updatedUser;
  }

  // DELETE
  async deleteUser(userId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    const result = await User.findByIdAndDelete(userId);
    return !!result;
  }

  // SOFT DELETE
  async deactivateUser(userId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new AppError("Invalid user ID", 400);
    }

    return User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select("-password");
  }

  // BULK OPERATIONS
  async updateManyUsers(
    filter: FilterQuery<IUser>,
    updates: UpdateQuery<IUser>
  ): Promise<number> {
    const result = await User.updateMany(filter, updates);
    return result.modifiedCount;
  }

  async getUsersStats(): Promise<{
    total: number;
    active: number;
    byRole: Record<string, number>;
  }> {
    const stats = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: ["$isActive", 1, 0] } },
          byRole: { $push: "$role" },
        },
      },
      {
        $project: {
          total: 1,
          active: 1,
          byRole: {
            $arrayToObject: {
              $map: {
                input: { $setUnion: ["$byRole", []] },
                as: "role",
                in: {
                  k: "$$role",
                  v: {
                    $size: {
                      $filter: {
                        input: "$byRole",
                        as: "r",
                        cond: { $eq: ["$$r", "$$role"] },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    return stats[0] || { total: 0, active: 0, byRole: {} };
  }
}
```

---

## 5. Advanced Queries

**Description**: Master complex querying with Mongoose's fluent API.

### Advanced Query Service

```typescript
// services/QueryService.ts
import { Types, FilterQuery } from "mongoose";
import { Post, IPost } from "../models/Post";
import { User, IUser } from "../models/User";

export class QueryService {
  // COMPLEX POST QUERIES
  async findPostsWithFilters(filters: {
    authorId?: string;
    tags?: string[];
    status?: IPost["status"];
    category?: string;
    minViews?: number;
    dateRange?: { start: Date; end: Date };
    searchTerm?: string;
    featured?: boolean;
  }): Promise<IPost[]> {
    const query: FilterQuery<IPost> = {};

    // Author filter
    if (filters.authorId && Types.ObjectId.isValid(filters.authorId)) {
      query.author = new Types.ObjectId(filters.authorId);
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Category filter
    if (filters.category) {
      query.category = filters.category;
    }

    // Views range
    if (filters.minViews !== undefined) {
      query["metadata.views"] = { $gte: filters.minViews };
    }

    // Date range
    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    // Featured filter
    if (filters.featured !== undefined) {
      query["metadata.featured"] = filters.featured;
    }

    // Text search
    if (filters.searchTerm) {
      query.$text = { $search: filters.searchTerm };
    }

    return Post.find(query)
      .populate("author", "name email profile.avatar")
      .sort({ createdAt: -1 })
      .limit(50)
      .exec();
  }

  // PAGINATION WITH POPULATION
  async getPostsPaginated(options: {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: "asc" | "desc";
    populateAuthor?: boolean;
    status?: IPost["status"];
  }): Promise<{
    posts: IPost[];
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
    page: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      populateAuthor = true,
      status = "published",
    } = options;

    const skip = (page - 1) * limit;
    const sortDirection = sortOrder === "asc" ? 1 : -1;

    // Build query
    let query = Post.find({ status });

    // Apply population
    if (populateAuthor) {
      query = query.populate("author", "name email profile.avatar");
    }

    // Execute queries in parallel
    const [posts, total] = await Promise.all([
      query
        .sort({ [sortBy]: sortDirection })
        .skip(skip)
        .limit(limit)
        .exec(),
      Post.countDocuments({ status }),
    ]);

    return {
      posts,
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
      page,
    };
  }

  // ADVANCED USER QUERIES
  async findUsersWithPostCount(): Promise<any[]> {
    return User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          postCount: { $size: "$posts" },
          lastActive: "$stats.lastActive",
          isActive: 1,
        },
      },
      {
        $sort: { postCount: -1 },
      },
    ]);
  }

  // TEXT SEARCH WITH HIGHLIGHTING
  async searchPostsAdvanced(
    query: string,
    options: {
      limit?: number;
      category?: string;
    } = {}
  ): Promise<any[]> {
    const { limit = 10, category } = options;

    const searchPipeline: any[] = [
      {
        $match: {
          $text: { $search: query },
          status: "published",
        },
      },
      {
        $addFields: {
          score: { $meta: "textScore" },
        },
      },
    ];

    // Add category filter if provided
    if (category) {
      searchPipeline[0].$match.category = category;
    }

    searchPipeline.push(
      {
        $sort: { score: { $meta: "textScore" } },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          title: 1,
          content: { $substr: ["$content", 0, 200] }, // Preview
          "author.name": 1,
          "author.profile.avatar": 1,
          metadata: 1,
          score: 1,
          commentCount: { $size: "$comments" },
        },
      }
    );

    return Post.aggregate(searchPipeline);
  }
}
```

---

## 6. Middleware & Hooks

**Description**: Use Mongoose middleware for business logic and data transformation.

### User Middleware

```typescript
// middleware/userMiddleware.ts
import bcrypt from "bcryptjs";
import { User, IUser } from "../models/User";

// Password hashing middleware
User.schema.pre<IUser>("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();

  try {
    // Generate salt
    const salt = await bcrypt.genSalt(12);
    // Hash password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Update timestamps middleware
User.schema.pre<IUser>(["save", "findOneAndUpdate"], function (next) {
  if (this.isModified()) {
    this.stats.lastActive = new Date();
  }
  next();
});

// Log user activity middleware
User.schema.post<IUser>("save", function (doc) {
  console.log(`User ${doc.email} was saved successfully`);
});

// Remove user posts when user is deleted
User.schema.post<IUser>("findOneAndDelete", async function (doc) {
  if (doc) {
    const { Post } = await import("../models/Post");
    await Post.deleteMany({ author: doc._id });
    console.log(`All posts by user ${doc.email} have been deleted`);
  }
});
```

### Post Middleware

```typescript
// middleware/postMiddleware.ts
import { Post, IPost } from "../models/Post";
import { User } from "../models/User";

// Update user's post count when post is saved
Post.schema.pre<IPost>("save", async function (next) {
  if (this.isNew) {
    try {
      await User.findByIdAndUpdate(this.author, {
        $inc: { "stats.postCount": 1 },
      });
    } catch (error) {
      console.error("Error updating user post count:", error);
    }
  }
  next();
});

// Set publishedAt when status changes to published
Post.schema.pre<IPost>("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
  next();
});

// Update user's post count when post is deleted
Post.schema.post<IPost>("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      await User.findByIdAndUpdate(doc.author, {
        $inc: { "stats.postCount": -1 },
      });
    } catch (error) {
      console.error("Error updating user post count on delete:", error);
    }
  }
});

// Auto-increment views on find
Post.schema.post<IPost>("findOne", async function (doc) {
  if (doc && doc.status === "published") {
    await Post.findByIdAndUpdate(doc._id, {
      $inc: { "metadata.views": 1 },
    });
  }
});
```

---

## 7. Population & Relationships

**Description**: Manage document relationships and references with population.

### Population Service

```typescript
// services/PopulationService.ts
import { Types } from "mongoose";
import { Post } from "../models/Post";
import { User } from "../models/User";

export class PopulationService {
  // POPULATE POST WITH AUTHOR DETAILS
  async getPostWithAuthor(postId: string): Promise<any> {
    if (!Types.ObjectId.isValid(postId)) {
      throw new Error("Invalid post ID");
    }

    return Post.findById(postId)
      .populate("author", "name email profile.avatar role")
      .populate("comments.author", "name profile.avatar")
      .exec();
  }

  // GET USER WITH POSTS (DEEP POPULATION)
  async getUserWithPosts(
    userId: string,
    options: {
      postsLimit?: number;
      postsPage?: number;
    } = {}
  ): Promise<any> {
    const { postsLimit = 10, postsPage = 1 } = options;

    const user = await User.findById(userId).select("-password").lean();

    if (!user) {
      return null;
    }

    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .limit(postsLimit)
      .skip((postsPage - 1) * postsLimit)
      .populate("author", "name profile.avatar")
      .lean();

    const totalPosts = await Post.countDocuments({ author: userId });

    return {
      ...user,
      posts: {
        data: posts,
        pagination: {
          page: postsPage,
          limit: postsLimit,
          total: totalPosts,
          totalPages: Math.ceil(totalPosts / postsLimit),
        },
      },
    };
  }

  // VIRTUAL POPULATION (Comments count)
  async getPostsWithCommentCounts(filters: any = {}): Promise<any[]> {
    return Post.find(filters)
      .populate("author", "name profile.avatar")
      .then((posts) => {
        return posts.map((post) => ({
          ...post.toObject(),
          commentCount: post.comments.length,
        }));
      });
  }

  // MULTI-LEVEL POPULATION
  async getPostWithCommentsAndAuthors(postId: string): Promise<any> {
    return Post.findById(postId)
      .populate({
        path: "author",
        select: "name profile.avatar",
        model: "User",
      })
      .populate({
        path: "comments.author",
        select: "name profile.avatar",
        model: "User",
      })
      .exec();
  }

  // AGGREGATION WITH LOOKUP (Alternative to populate)
  async getUsersWithPostStats(): Promise<any[]> {
    return User.aggregate([
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "author",
          as: "posts",
        },
      },
      {
        $lookup: {
          from: "posts",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$author", "$$userId"] },
                status: "published",
              },
            },
            {
              $group: {
                _id: null,
                totalViews: { $sum: "$metadata.views" },
                totalLikes: { $sum: "$metadata.likes" },
                averageReadTime: { $avg: "$metadata.readTime" },
              },
            },
          ],
          as: "postStats",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          role: 1,
          postCount: { $size: "$posts" },
          totalViews: { $arrayElemAt: ["$postStats.totalViews", 0] } || 0,
          totalLikes: { $arrayElemAt: ["$postStats.totalLikes", 0] } || 0,
          averageReadTime:
            { $arrayElemAt: ["$postStats.averageReadTime", 0] } || 0,
          lastActive: "$stats.lastActive",
        },
      },
      {
        $sort: { postCount: -1 },
      },
    ]);
  }
}
```

---

## 8. Aggregation

**Description**: Use Mongoose aggregation framework for complex data analysis.

### Advanced Aggregation Service

```typescript
// services/AggregationService.ts
import { Post } from "../models/Post";
import { User } from "../models/User";

export interface UserStats {
  total: number;
  active: number;
  byRole: Record<string, number>;
  registrationByMonth: Array<{ month: string; count: number }>;
}

export interface PostAnalytics {
  total: number;
  published: number;
  drafts: number;
  byCategory: Record<string, number>;
  averageStats: {
    views: number;
    likes: number;
    readTime: number;
    comments: number;
  };
  topPosts: Array<{
    title: string;
    views: number;
    likes: number;
  }>;
}

export class AggregationService {
  // USER STATISTICS AGGREGATION
  async getUserStatistics(): Promise<UserStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pipeline = [
      // Match active users (optional)
      {
        $match: {
          "stats.lastActive": { $gte: thirtyDaysAgo },
        },
      },
      // Facet for multiple aggregations
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          activeUsers: [{ $match: { isActive: true } }, { $count: "count" }],
          usersByRole: [
            {
              $group: {
                _id: "$role",
                count: { $sum: 1 },
              },
            },
          ],
          registrationByMonth: [
            {
              $group: {
                _id: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                },
                count: { $sum: 1 },
              },
            },
            {
              $sort: { "_id.year": 1, "_id.month": 1 },
            },
            {
              $project: {
                _id: 0,
                month: {
                  $concat: [
                    { $toString: "$_id.year" },
                    "-",
                    { $toString: "$_id.month" },
                  ],
                },
                count: 1,
              },
            },
          ],
        },
      },
      // Project final structure
      {
        $project: {
          total: { $arrayElemAt: ["$totalUsers.count", 0] },
          active: { $arrayElemAt: ["$activeUsers.count", 0] },
          byRole: {
            $arrayToObject: {
              $map: {
                input: "$usersByRole",
                as: "role",
                in: {
                  k: "$$role._id",
                  v: "$$role.count",
                },
              },
            },
          },
          registrationByMonth: 1,
        },
      },
    ];

    const result = await User.aggregate(pipeline);
    return result[0] as UserStats;
  }

  // POST ANALYTICS AGGREGATION
  async getPostAnalytics(authorId?: string): Promise<PostAnalytics> {
    const matchStage: any = {};
    if (authorId) {
      matchStage.author = new Types.ObjectId(authorId);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          totalPosts: [{ $count: "count" }],
          byStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          byCategory: [
            {
              $group: {
                _id: "$category",
                count: { $sum: 1 },
              },
            },
          ],
          averageStats: [
            {
              $group: {
                _id: null,
                avgViews: { $avg: "$metadata.views" },
                avgLikes: { $avg: "$metadata.likes" },
                avgReadTime: { $avg: "$metadata.readTime" },
                avgComments: { $avg: { $size: "$comments" } },
              },
            },
          ],
          topPosts: [
            { $match: { status: "published" } },
            {
              $project: {
                title: 1,
                views: "$metadata.views",
                likes: "$metadata.likes",
                commentCount: { $size: "$comments" },
              },
            },
            { $sort: { views: -1 } },
            { $limit: 5 },
          ],
        },
      },
      {
        $project: {
          total: { $arrayElemAt: ["$totalPosts.count", 0] },
          published: {
            $let: {
              vars: {
                published: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$byStatus",
                        as: "s",
                        cond: { $eq: ["$$s._id", "published"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$published.count",
            },
          },
          drafts: {
            $let: {
              vars: {
                drafts: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$byStatus",
                        as: "s",
                        cond: { $eq: ["$$s._id", "draft"] },
                      },
                    },
                    0,
                  ],
                },
              },
              in: "$$drafts.count",
            },
          },
          byCategory: {
            $arrayToObject: {
              $map: {
                input: "$byCategory",
                as: "cat",
                in: {
                  k: "$$cat._id",
                  v: "$$cat.count",
                },
              },
            },
          },
          averageStats: {
            views: {
              $round: [{ $arrayElemAt: ["$averageStats.avgViews", 0] }, 2],
            },
            likes: {
              $round: [{ $arrayElemAt: ["$averageStats.avgLikes", 0] }, 2],
            },
            readTime: {
              $round: [{ $arrayElemAt: ["$averageStats.avgReadTime", 0] }, 2],
            },
            comments: {
              $round: [{ $arrayElemAt: ["$averageStats.avgComments", 0] }, 2],
            },
          },
          topPosts: 1,
        },
      },
    ];

    const result = await Post.aggregate(pipeline);
    return result[0] as PostAnalytics;
  }

  // TRENDING POSTS AGGREGATION
  async getTrendingPosts(limit: number = 10): Promise<any[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return Post.aggregate([
      {
        $match: {
          status: "published",
          publishedAt: { $gte: oneWeekAgo },
        },
      },
      {
        $addFields: {
          engagementScore: {
            $add: [
              { $multiply: ["$metadata.views", 0.1] },
              { $multiply: ["$metadata.likes", 1] },
              { $multiply: [{ $size: "$comments" }, 2] },
            ],
          },
        },
      },
      {
        $sort: { engagementScore: -1 },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $project: {
          title: 1,
          content: { $substr: ["$content", 0, 150] },
          "author.name": 1,
          "author.profile.avatar": 1,
          metadata: 1,
          engagementScore: 1,
          commentCount: { $size: "$comments" },
        },
      },
    ]);
  }
}
```

---

## 9. Validation

**Description**: Implement comprehensive validation using Mongoose's built-in and custom validators.

### Custom Validators

```typescript
// utils/validators.ts
import { CallbackError } from "mongoose";

export const customValidators = {
  // Password strength validator
  passwordValidator: {
    validator: function (password: string) {
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        password
      );
    },
    message:
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character",
  },

  // Email domain validator
  emailDomainValidator: {
    validator: function (email: string) {
      const allowedDomains = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "company.com",
      ];
      const domain = email.split("@")[1];
      return allowedDomains.includes(domain);
    },
    message: "Email domain not allowed",
  },

  // Array length validator
  arrayLengthValidator: (min: number, max: number) => ({
    validator: function (array: any[]) {
      return array.length >= min && array.length <= max;
    },
    message: `Array must contain between ${min} and ${max} items`,
  }),

  // Unique array values validator
  uniqueArrayValidator: {
    validator: function (array: string[]) {
      return new Set(array).size === array.length;
    },
    message: "Array must contain unique values",
  },
};

// Async validators
export const asyncValidators = {
  // Check if email is unique (async)
  uniqueEmail: async function (email: string) {
    const { User } = await import("../models/User");
    const user = await User.findOne({ email });
    return !user;
  },

  // Check if username is available
  usernameAvailable: async function (username: string) {
    const { User } = await import("../models/User");
    const user = await User.findOne({ username });
    return !user;
  },
};
```

### Enhanced User Schema with Validation

```typescript
// models/UserWithValidation.ts
import { Schema, model } from "mongoose";
import { customValidators, asyncValidators } from "../utils/validators";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers and underscores",
      ],
      validate: {
        validator: async function (username: string) {
          return asyncValidators.usernameAvailable(username);
        },
        message: "Username is already taken",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
      validate: [
        {
          validator: customValidators.emailDomainValidator.validator,
          message: customValidators.emailDomainValidator.message,
        },
        {
          validator: async function (email: string) {
            return asyncValidators.uniqueEmail(email);
          },
          message: "Email is already registered",
        },
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: customValidators.passwordValidator.validator,
        message: customValidators.passwordValidator.message,
      },
    },
    age: {
      type: Number,
      min: [13, "You must be at least 13 years old"],
      max: [120, "Age cannot exceed 120 years"],
    },
    tags: {
      type: [String],
      validate: [
        customValidators.arrayLengthValidator(1, 10),
        customValidators.uniqueArrayValidator,
      ],
    },
  },
  {
    timestamps: true,
  }
);

// Custom validation error handler
userSchema.post("save", function (error: any, doc: any, next: any) {
  if (error.name === "ValidationError") {
    const errors: { [key: string]: string } = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    next(new Error(JSON.stringify(errors)));
  } else {
    next(error);
  }
});

export const UserWithValidation = model("UserWithValidation", userSchema);
```

---

## 10. Express Integration

**Description**: Integrate Mongoose with Express.js routes and controllers.

### User Controller with Mongoose

```typescript
// controllers/userController.ts
import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { AppError } from "../utils/errorHandler";
import { asyncHandler } from "../middleware/asyncHandler";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as string;
    const isActive = req.query.isActive as string;

    const filter: any = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const result = await this.userService.getUsers(filter, { page, limit });

    res.status(200).json({
      success: true,
      data: result.users,
      pagination: {
        page: result.page,
        limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password, role } = req.body;

    const user = await this.userService.createUser({
      name,
      email,
      password,
      role,
    });

    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully",
    });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updates = req.body;

    const updatedUser = await this.userService.updateUser(id, updates);

    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "User updated successfully",
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.userService.deleteUser(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  });

  getUserStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await this.userService.getUsersStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  });
}
```

### Express Routes with Validation

```typescript
// routes/users.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";
import {
  validateObjectId,
  sanitizeInput,
} from "../middleware/validationMiddleware";

const router = Router();
const userController = new UserController();

// Validation middleware
router.use(sanitizeInput);

router.get("/", userController.getUsers);
router.get("/stats", userController.getUserStats);
router.get("/:id", validateObjectId("id"), userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", validateObjectId("id"), userController.updateUser);
router.delete("/:id", validateObjectId("id"), userController.deleteUser);

export default router;
```

### Async Handler Middleware

```typescript
// middleware/asyncHandler.ts
import { Request, Response, NextFunction } from "express";

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

---

## 11. React Integration

**Description**: Connect React frontend with Mongoose backend through API calls.

### Custom React Hooks for Mongoose Data

```typescript
// hooks/useUsers.ts
import { useState, useEffect } from "react";
import { IUser } from "../types/database";

interface UseUsersResult {
  users: IUser[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  pagination: {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const useUsers = (
  page: number = 1,
  limit: number = 10
): UseUsersResult => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      const response = await fetch(`/api/users?${queryParams}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    pagination,
  };
};
```

### React Component Using Mongoose Data

```typescript
// components/UserManagement.tsx
import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";

export const UserManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { users, loading, error, pagination } = useUsers(currentPage);

  if (loading)
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id.toString()}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center space-x-4 mb-4">
              {user.profile?.avatar && (
                <img
                  src={user.profile.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.role === "admin"
                    ? "bg-purple-100 text-purple-800"
                    : user.role === "moderator"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {user.role}
              </span>

              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  user.isActive
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>Posts: {user.stats.postCount}</p>
              <p>
                Last active:{" "}
                {new Date(user.stats.lastActive).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <button
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-gray-700">
          Page {currentPage} of {pagination.totalPages}
        </span>

        <button
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

---

## 12. Best Practices

**Description**: Essential best practices for production Mongoose applications.

### Error Handling & Logging

```typescript
// utils/errorHandler.ts
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string, originalError?: Error) {
    super(`Database error: ${message}`, 500);
    this.name = "DatabaseError";

    if (originalError) {
      this.stack = originalError.stack;
    }
  }
}

export class ValidationError extends AppError {
  public errors: Record<string, string>;

  constructor(errors: Record<string, string>) {
    super("Validation failed", 400);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

// middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import {
  AppError,
  DatabaseError,
  ValidationError,
} from "../utils/errorHandler";
import { Error as MongoError } from "mongoose";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
  });

  // Mongoose validation error
  if (error instanceof MongoError.ValidationError) {
    const errors: Record<string, string> = {};
    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    const validationError = new ValidationError(errors);
    res.status(validationError.statusCode).json({
      success: false,
      message: validationError.message,
      errors: validationError.errors,
    });
    return;
  }

  // Mongoose duplicate key error
  if (error instanceof MongoError && error.code === 11000) {
    const field = Object.keys((error as any).keyPattern)[0];
    res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
    return;
  }

  // Mongoose cast error (invalid ObjectId)
  if (error instanceof MongoError.CastError) {
    res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
    return;
  }

  // Custom AppError
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
    return;
  }

  // Unknown error
  res.status(500).json({
    success: false,
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};
```

### Connection Management & Graceful Shutdown

```typescript
// app.ts - Express application with Mongoose
import express from "express";
import { databaseService } from "./lib/mongodb";
import userRoutes from "./routes/users";
import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

// Initialize database connection
databaseService.connect().catch(console.error);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is healthy",
    database: databaseService.isDatabaseConnected()
      ? "connected"
      : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// Error handling (should be last)
app.use(errorHandler);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Received shutdown signal. Starting graceful shutdown...");

  // Stop accepting new requests
  server.close(async () => {
    console.log("HTTP server closed.");

    // Close database connection
    await databaseService.gracefulShutdown();

    console.log("Graceful shutdown completed.");
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
```
