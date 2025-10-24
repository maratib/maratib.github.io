---
title: MongoDB Native
description: MongoDB Native
---

**Description**: Understand MongoDB's role in the MERN stack and why it's the preferred database for JavaScript applications.

### Why MongoDB in MERN?

- **Document-Oriented**: Stores data in JSON-like documents
- **Flexible Schema**: Easy to evolve as application requirements change
- **JavaScript Native**: Uses BSON (Binary JSON) - perfect for JS ecosystem
- **Horizontal Scaling**: Easy scaling with sharding
- **Aggregation Pipeline**: Powerful data processing capabilities

### MERN Stack Architecture

```
Client (React) → Express.js API → MongoDB Database
     ↑                  ↑               ↑
  TypeScript        TypeScript      TypeScript
                    (Node.js)     (MongoDB Driver)
```

---

## 2. Core MongoDB Concepts

**Description**: Learn fundamental MongoDB concepts and how they translate to TypeScript types.

### Document Structure

```typescript
// types/database.ts
import { ObjectId } from "mongodb";

export interface MongoDBDocument {
  _id?: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends MongoDBDocument {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  profile?: {
    avatar?: string;
    bio?: string;
  };
  settings: Record<string, any>;
}
```

### BSON Data Types

```typescript
// BSON types mapping to TypeScript
{
  string: "text",
  number: 42.5,
  boolean: true,
  date: new Date(),
  array: [1, "two", { three: 3 }],
  object: { key: "value" },
  objectId: new ObjectId(),
  binary: Buffer.from("data"),
  null: null,
  undefined: undefined
}
```

---

## 3. Setting Up MongoDB

**Description**: Configure MongoDB connection with proper TypeScript typing and error handling.

### Environment Configuration

```typescript
// config/database.ts
export interface DatabaseConfig {
  uri: string;
  options: {
    maxPoolSize: number;
    serverSelectionTimeoutMS: number;
    socketTimeoutMS: number;
  };
}

export const dbConfig: DatabaseConfig = {
  uri: process.env.MONGODB_URI || "mongodb://localhost:27017/mernapp",
  options: {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  },
};
```

### Database Connection Class

```typescript
// lib/mongodb.ts
import { MongoClient, Db, MongoClientOptions } from "mongodb";

class DatabaseService {
  private static instance: DatabaseService;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnected: boolean = false;

  private constructor() {}

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  async connect(): Promise<Db> {
    if (this.isConnected && this.db) {
      return this.db;
    }

    try {
      this.client = new MongoClient(
        dbConfig.uri,
        dbConfig.options as MongoClientOptions
      );
      await this.client.connect();
      this.db = this.client.db();
      this.isConnected = true;

      console.log("✅ MongoDB connected successfully");
      return this.db;
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      throw new Error(`Database connection failed: ${error}`);
    }
  }

  getDatabase(): Db {
    if (!this.db || !this.isConnected) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.db;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      this.isConnected = false;
      console.log("📭 MongoDB disconnected");
    }
  }

  isDatabaseConnected(): boolean {
    return this.isConnected;
  }
}

export const databaseService = DatabaseService.getInstance();
```

---

## 4. Data Modeling

**Description**: Design efficient MongoDB schemas with proper relationships and validation.

### User Model with Relationships

```typescript
// models/User.ts
import { ObjectId, Collection } from "mongodb";
import { databaseService } from "../lib/mongodb";

export interface IUser {
  _id?: ObjectId;
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
  createdAt: Date;
  updatedAt: Date;
}

export class UserModel {
  private collection: Collection<IUser>;

  constructor() {
    this.collection = databaseService.getDatabase().collection<IUser>("users");
  }

  // Create indexes for better performance
  async createIndexes(): Promise<void> {
    await this.collection.createIndex({ email: 1 }, { unique: true });
    await this.collection.createIndex({ createdAt: -1 });
    await this.collection.createIndex({ "stats.lastActive": -1 });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.collection.findOne({ email });
  }

  async findById(_id: ObjectId): Promise<IUser | null> {
    return this.collection.findOne({ _id });
  }

  async create(
    userData: Omit<IUser, "_id" | "createdAt" | "updatedAt">
  ): Promise<IUser> {
    const user: IUser = {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await this.collection.insertOne(user);
    return { ...user, _id: result.insertedId };
  }
}
```

### Post Model with Embedded Comments

```typescript
// models/Post.ts
export interface IComment {
  _id: ObjectId;
  authorId: ObjectId;
  content: string;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost {
  _id?: ObjectId;
  title: string;
  content: string;
  authorId: ObjectId;
  tags: string[];
  status: "draft" | "published" | "archived";
  metadata: {
    views: number;
    likes: number;
    readTime: number;
    featured: boolean;
  };
  comments: IComment[]; // Embedded documents
  createdAt: Date;
  updatedAt: Date;
}

export class PostModel {
  private collection: Collection<IPost>;

  constructor() {
    this.collection = databaseService.getDatabase().collection<IPost>("posts");
  }

  async createIndexes(): Promise<void> {
    await this.collection.createIndex({ authorId: 1, createdAt: -1 });
    await this.collection.createIndex({ tags: 1 });
    await this.collection.createIndex({ "metadata.featured": 1 });
    await this.collection.createIndex({ title: "text", content: "text" });
  }
}
```

---

## 5. CRUD Operations

**Description**: Master Create, Read, Update, and Delete operations with TypeScript.

### Complete CRUD Implementation

```typescript
// services/UserService.ts
import { ObjectId, Filter, UpdateFilter, OptionalId } from "mongodb";
import { IUser, UserModel } from "../models/User";

export class UserService {
  private userModel: UserModel;

  constructor() {
    this.userModel = new UserModel();
  }

  // CREATE
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    role?: IUser["role"];
  }): Promise<IUser> {
    // Validate input
    if (!userData.email || !userData.password) {
      throw new Error("Email and password are required");
    }

    // Check if user already exists
    const existingUser = await this.userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    return this.userModel.create({
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
  }

  // READ - Multiple methods
  async getUserById(id: string): Promise<IUser | null> {
    if (!ObjectId.isValid(id)) {
      throw new Error("Invalid user ID");
    }
    return this.userModel.findById(new ObjectId(id));
  }

  async getUsers(
    filter: Filter<IUser> = {},
    options: {
      page?: number;
      limit?: number;
      sort?: Record<string, 1 | -1>;
    } = {}
  ): Promise<{ users: IUser[]; total: number; page: number }> {
    const { page = 1, limit = 10, sort = { createdAt: -1 } } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.userModel.collection
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.userModel.collection.countDocuments(filter),
    ]);

    return { users, total, page };
  }

  // UPDATE
  async updateUser(
    userId: string,
    updates: Partial<Omit<IUser, "_id" | "createdAt">>
  ): Promise<IUser | null> {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const updateFilter: UpdateFilter<IUser> = {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    };

    const result = await this.userModel.collection.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      updateFilter,
      { returnDocument: "after" }
    );

    return result;
  }

  // DELETE
  async deleteUser(userId: string): Promise<boolean> {
    if (!ObjectId.isValid(userId)) {
      throw new Error("Invalid user ID");
    }

    const result = await this.userModel.collection.deleteOne({
      _id: new ObjectId(userId),
    });

    return result.deletedCount === 1;
  }

  // Bulk operations
  async updateManyUsers(
    filter: Filter<IUser>,
    updates: UpdateFilter<IUser>
  ): Promise<number> {
    const result = await this.userModel.collection.updateMany(filter, {
      ...updates,
      $set: { updatedAt: new Date() },
    });
    return result.modifiedCount;
  }
}
```

---

## 6. Advanced Querying

**Description**: Learn complex queries, filtering, and data retrieval patterns.

### Query Operators & Filtering

```typescript
// services/PostService.ts
import { ObjectId, Filter } from "mongodb";
import { IPost, PostModel } from "../models/Post";

export class PostService {
  private postModel: PostModel;

  constructor() {
    this.postModel = new PostModel();
  }

  // Complex filtering with multiple conditions
  async findPostsByFilters(filters: {
    authorId?: string;
    tags?: string[];
    status?: IPost["status"];
    minViews?: number;
    dateRange?: { start: Date; end: Date };
    searchTerm?: string;
  }): Promise<IPost[]> {
    const query: Filter<IPost> = {};

    // Author filter
    if (filters.authorId && ObjectId.isValid(filters.authorId)) {
      query.authorId = new ObjectId(filters.authorId);
    }

    // Tags filter (array contains any of the specified tags)
    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    // Status filter
    if (filters.status) {
      query.status = filters.status;
    }

    // Views range filter
    if (filters.minViews !== undefined) {
      query["metadata.views"] = { $gte: filters.minViews };
    }

    // Date range filter
    if (filters.dateRange) {
      query.createdAt = {
        $gte: filters.dateRange.start,
        $lte: filters.dateRange.end,
      };
    }

    // Text search
    if (filters.searchTerm) {
      query.$text = { $search: filters.searchTerm };
    }

    return this.postModel.collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
  }

  // Pagination with complex sorting
  async getPostsWithPagination(options: {
    page: number;
    limit: number;
    sortBy: "createdAt" | "views" | "likes";
    sortOrder: "asc" | "desc";
    featuredOnly?: boolean;
  }): Promise<{
    posts: IPost[];
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const { page, limit, sortBy, sortOrder, featuredOnly = false } = options;
    const skip = (page - 1) * limit;

    const filter: Filter<IPost> = { status: "published" };
    if (featuredOnly) {
      filter["metadata.featured"] = true;
    }

    const sortDirection = sortOrder === "asc" ? 1 : -1;
    const sortField =
      sortBy === "views" || sortBy === "likes" ? `metadata.${sortBy}` : sortBy;

    const [posts, total] = await Promise.all([
      this.postModel.collection
        .find(filter)
        .sort({ [sortField]: sortDirection })
        .skip(skip)
        .limit(limit)
        .toArray(),
      this.postModel.collection.countDocuments(filter),
    ]);

    return {
      posts,
      total,
      hasNext: page * limit < total,
      hasPrev: page > 1,
    };
  }
}
```

---

## 7. Aggregation Framework

**Description**: Use MongoDB's powerful aggregation pipeline for complex data analysis.

### Advanced Aggregation Examples

```typescript
// services/AnalyticsService.ts
import { ObjectId, Collection } from "mongodb";
import { databaseService } from "../lib/mongodb";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  usersByRole: { role: string; count: number }[];
  registrationByMonth: { month: string; count: number }[];
}

interface PostAnalytics {
  totalPosts: number;
  averageViews: number;
  postsByStatus: { status: string; count: number }[];
  topTags: { tag: string; count: number }[];
}

export class AnalyticsService {
  private usersCollection: Collection;
  private postsCollection: Collection;

  constructor() {
    const db = databaseService.getDatabase();
    this.usersCollection = db.collection("users");
    this.postsCollection = db.collection("posts");
  }

  async getUserStatistics(): Promise<UserStats> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const pipeline = [
      // Stage 1: Match active users (optional)
      {
        $match: {
          "stats.lastActive": { $gte: thirtyDaysAgo },
        },
      },
      // Stage 2: Group by multiple fields
      {
        $facet: {
          totalUsers: [{ $count: "count" }],
          usersByRole: [
            {
              $group: {
                _id: "$role",
                count: { $sum: 1 },
              },
            },
            {
              $project: {
                role: "$_id",
                count: 1,
                _id: 0,
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
                month: {
                  $concat: [
                    { $toString: "$_id.year" },
                    "-",
                    { $toString: "$_id.month" },
                  ],
                },
                count: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      // Stage 3: Project final structure
      {
        $project: {
          totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },
          usersByRole: 1,
          registrationByMonth: 1,
        },
      },
    ];

    const result = await this.usersCollection.aggregate(pipeline).next();
    return result as UserStats;
  }

  async getPostAnalytics(authorId?: string): Promise<PostAnalytics> {
    const matchStage: any = { status: "published" };
    if (authorId) {
      matchStage.authorId = new ObjectId(authorId);
    }

    const pipeline = [
      { $match: matchStage },
      {
        $facet: {
          totalPosts: [{ $count: "count" }],
          averageViews: [
            {
              $group: {
                _id: null,
                average: { $avg: "$metadata.views" },
              },
            },
          ],
          postsByStatus: [
            {
              $group: {
                _id: "$status",
                count: { $sum: 1 },
              },
            },
          ],
          topTags: [
            { $unwind: "$tags" },
            {
              $group: {
                _id: "$tags",
                count: { $sum: 1 },
              },
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
          ],
        },
      },
      {
        $project: {
          totalPosts: { $arrayElemAt: ["$totalPosts.count", 0] },
          averageViews: {
            $round: [{ $arrayElemAt: ["$averageViews.average", 0] }, 2],
          },
          postsByStatus: {
            $map: {
              input: "$postsByStatus",
              as: "status",
              in: {
                status: "$$status._id",
                count: "$$status.count",
              },
            },
          },
          topTags: {
            $map: {
              input: "$topTags",
              as: "tag",
              in: {
                tag: "$$tag._id",
                count: "$$tag.count",
              },
            },
          },
        },
      },
    ];

    const result = await this.postsCollection.aggregate(pipeline).next();
    return result as PostAnalytics;
  }
}
```

---

## 8. Indexing & Performance

**Description**: Optimize query performance with proper indexing strategies.

### Index Management

```typescript
// utils/indexManager.ts
import { Db, IndexSpecification } from "mongodb";
import { databaseService } from "../lib/mongodb";

export class IndexManager {
  private db: Db;

  constructor() {
    this.db = databaseService.getDatabase();
  }

  async createAllIndexes(): Promise<void> {
    await this.createUserIndexes();
    await this.createPostIndexes();
    await this.createCommentIndexes();
  }

  private async createUserIndexes(): Promise<void> {
    const userIndexes: IndexSpecification[] = [
      { key: { email: 1 }, unique: true, name: "email_unique" },
      { key: { createdAt: -1 }, name: "createdAt_desc" },
      { key: { "stats.lastActive": -1 }, name: "lastActive_desc" },
      { key: { role: 1, createdAt: -1 }, name: "role_createdAt" },
    ];

    for (const index of userIndexes) {
      await this.db.collection("users").createIndex(index);
    }
  }

  private async createPostIndexes(): Promise<void> {
    const postIndexes: IndexSpecification[] = [
      { key: { authorId: 1, createdAt: -1 }, name: "author_createdAt" },
      { key: { tags: 1 }, name: "tags" },
      { key: { status: 1, createdAt: -1 }, name: "status_createdAt" },
      {
        key: { "metadata.featured": 1, createdAt: -1 },
        name: "featured_createdAt",
      },
      { key: { title: "text", content: "text" }, name: "text_search" },
      { key: { "metadata.views": -1 }, name: "views_desc" },
    ];

    for (const index of postIndexes) {
      await this.db.collection("posts").createIndex(index);
    }
  }

  private async createCommentIndexes(): Promise<void> {
    const commentIndexes: IndexSpecification[] = [
      { key: { postId: 1, createdAt: -1 }, name: "post_comments" },
      { key: { authorId: 1 }, name: "comment_author" },
    ];

    for (const index of commentIndexes) {
      await this.db.collection("comments").createIndex(index);
    }
  }

  async getIndexStats(collectionName: string): Promise<any> {
    return this.db.collection(collectionName).indexes();
  }
}
```

---

## 9. MongoDB with Express.js

**Description**: Integrate MongoDB with Express.js routes and controllers.

### Express Route Handlers

```typescript
// controllers/userController.ts
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
import { UserService } from "../services/UserService";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const role = req.query.role as string;

      const filter: any = {};
      if (role) filter.role = role;

      const result = await this.userService.getUsers(filter, { page, limit });

      res.json({
        success: true,
        data: result.users,
        pagination: {
          page: result.page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch users",
        error: error.message,
      });
    }
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // Remove sensitive data
      const { password, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } = req.body;

      const user = await this.userService.createUser({
        name,
        email,
        password,
        role,
      });

      // Remove password from response
      const { password: _, ...userResponse } = user;

      res.status(201).json({
        success: true,
        data: userResponse,
        message: "User created successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedUser = await this.userService.updateUser(id, updates);

      if (!updatedUser) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const { password, ...userResponse } = updatedUser;

      res.json({
        success: true,
        data: userResponse,
        message: "User updated successfully",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  };
}
```

### Express Routes Setup

```typescript
// routes/users.ts
import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.post("/", userController.createUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

export default router;
```

---

## 10. Integration with React

**Description**: Connect React frontend with MongoDB backend through API calls.

### React Hooks for MongoDB Data

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

      const response = await fetch(`/api/users?page=${page}&limit=${limit}`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
        setPagination(result.pagination);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err.message);
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

### React Component Using MongoDB Data

```typescript
// components/UserList.tsx
import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";

export const UserList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { users, loading, error, pagination } = useUsers(currentPage);

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-list">
      <h2>Users ({pagination.totalPages} pages)</h2>

      <div className="users-grid">
        {users.map((user) => (
          <div key={user._id?.toString()} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={`role ${user.role}`}>{user.role}</span>
            <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination">
        <button
          disabled={!pagination.hasPrev}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage} of {pagination.totalPages}
        </span>

        <button
          disabled={!pagination.hasNext}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

---

## 11. Best Practices

**Description**: Essential best practices for production MongoDB applications.

### Security & Validation

```typescript
// utils/validation.ts
import { ObjectId } from "mongodb";

export class ValidationUtils {
  static isValidObjectId(id: string): boolean {
    return ObjectId.isValid(id);
  }

  static sanitizeUserInput(input: any): any {
    // Remove MongoDB operators to prevent injection
    const forbiddenKeys = [
      "$where",
      "$gt",
      "$gte",
      "$lt",
      "$lte",
      "$ne",
      "$in",
      "$nin",
    ];

    const sanitize = (obj: any): any => {
      if (typeof obj !== "object" || obj === null) return obj;

      if (Array.isArray(obj)) {
        return obj.map(sanitize);
      }

      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        if (forbiddenKeys.includes(key)) {
          throw new Error(`Forbidden key in input: ${key}`);
        }
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    };

    return sanitize(input);
  }
}

// middleware/validationMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { ValidationUtils } from "../utils/validation";

export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName];

    if (!ValidationUtils.isValidObjectId(id)) {
      res.status(400).json({
        success: false,
        message: `Invalid ${paramName} ID format`,
      });
      return;
    }

    next();
  };
};

export const sanitizeInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (req.body) {
      req.body = ValidationUtils.sanitizeUserInput(req.body);
    }
    next();
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid input data",
    });
  }
};
```

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

// middleware/errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorHandler";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  } else {
    // Log unexpected errors
    console.error("Unexpected error:", error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  }
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction): Promise<void> => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
```

### Connection Management

```typescript
// app.ts - Express application setup
import express from "express";
import { databaseService } from "./lib/mongodb";
import userRoutes from "./routes/users";
import { errorHandler } from "./middleware/errorMiddleware";

const app = express();

// Initialize database connection
databaseService.connect().catch(console.error);

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Received SIGINT. Closing database connections...");
  await databaseService.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Received SIGTERM. Closing database connections...");
  await databaseService.disconnect();
  process.exit(0);
});

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Error handling (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```
