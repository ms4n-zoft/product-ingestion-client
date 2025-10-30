# Product Admin API

Simple API for managing and fetching product data with pagination support.

## Base URL

```
http://localhost:3000
```

---

## Endpoints

### Health Check

#### `GET /`

Health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

---

#### `GET /health`

Alternative health check endpoint.

**Response:**

```json
{
  "status": "ok"
}
```

---

### Products

#### `GET /products/minimal` ⭐ **Recommended for UI Cards**

Fetch paginated products with minimal data optimized for listing pages and UI cards.

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (starts from 1) |
| pageSize | number | 10 | Items per page (max: 100) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "690149f0f6a907bf3d010815",
      "product_slug": "100-ai-prompts",
      "product_name": "100+ AI Prompts",
      "company_name": "Trello",
      "description": "A Trello board template collecting over 100 AI prompts and prompt-writing resources...",
      "website": "https://trello.com/b/4BPkSY1w/100-ai-prompts-resources-prompt-lovers",
      "logo_url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Trello_logo.svg",
      "parent_category": "Project Management / Collaboration",
      "industry": ["Productivity", "Project Management", "Team Collaboration"]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Use Case:** Perfect for product listing pages, search results, and UI cards where you need basic product information for display.

**Example:**

```
GET /products/minimal?page=2&pageSize=15
```

---

#### `GET /products`

Fetch paginated products with full data (includes complete snapshot object).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number (starts from 1) |
| pageSize | number | 10 | Items per page (max: 100) |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "ObjectId",
      "product_slug": "string",
      "snapshot": {
        "product_name": "string",
        "company_name": "string",
        "description": "string",
        "features": [],
        "pricing": {},
        "reviews": {}
        // ... extensive product data
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 10,
    "totalItems": 150,
    "totalPages": 15,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

**Use Case:** When you need complete product data for detailed analysis or bulk processing. Contains full snapshot object with all available product information.

**Example:**

```
GET /products?page=2&pageSize=15
```

---

#### `GET /products/:id`

Get a single product by MongoDB ObjectId.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | MongoDB ObjectId |

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "ObjectId",
    "product_slug": "string",
    "snapshot": {}
  }
}
```

**Example:**

```
GET /products/690149f0f6a907bf3d010815
```

---

#### `GET /products/slug/:slug` ⭐ **Recommended for Product Detail Pages**

Get a single product by slug with full data.

**URL Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| slug | string | Product slug (e.g., "100-ai-prompts") |

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "690149f0f6a907bf3d010815",
      "product_slug": "100-ai-prompts",
      "snapshot": {
        "product_name": "100+ AI Prompts",
        "company_name": "Trello",
        "description": "A Trello board template collecting over 100 AI prompts...",
        "website": "https://trello.com/b/4BPkSY1w/100-ai-prompts-resources-prompt-lovers",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/6/60/Trello_logo.svg",
        "features": [
          {
            "name": "Board & Cards",
            "description": "Kanban-style boards with lists and cards to organize prompts..."
          }
        ],
        "pricing": {
          "overview": "Trello uses a freemium pricing model...",
          "pricing_plans": []
        },
        "reviews": {
          "strengths": ["Easy to use, simple Kanban interface"],
          "weaknesses": ["Advanced enterprise controls require paid plans"],
          "overall_rating": null
        },
        "company_info": {},
        "integrations": []
        // ... complete product data
      }
    }
  ]
}
```

**Use Case:** Perfect for individual product detail pages where you need complete product information including features, pricing, reviews, company info, etc.

**Example:**

```
GET /products/slug/100-ai-prompts
```

---

## Frontend Integration Guide

### 🎯 Quick Reference for Frontend Teams

| Use Case                  | Endpoint                   | Purpose                                |
| ------------------------- | -------------------------- | -------------------------------------- |
| **Product Listing/Cards** | `GET /products/minimal`    | Fast-loading cards with essential info |
| **Product Detail Page**   | `GET /products/slug/:slug` | Complete product information           |
| **Data Processing/Admin** | `GET /products`            | Full dataset for analysis              |
| **Direct ID Lookup**      | `GET /products/:id`        | Get by MongoDB ObjectId                |

### 💡 Best Practices

1. **Use `/products/minimal` for listings** - Much faster, smaller payload (~500 bytes vs ~50KB per product)
2. **Use `/products/slug/:slug` for detail pages** - Complete data when user clicks on a product
3. **Implement pagination** - Use `page` and `pageSize` parameters for large datasets
4. **Handle loading states** - Show skeleton cards while data loads
5. **Cache appropriately** - Consider caching product listings for better UX

### 🔗 Typical Frontend Flow

```javascript
// 1. Load product listing page
const response = await fetch("/products/minimal?page=1&pageSize=20");
const { data: products, pagination } = await response.json();

// 2. User clicks on a product card
const productSlug = "some-product-slug";
const detailResponse = await fetch(`/products/slug/${productSlug}`);
const {
  data: [productDetail],
} = await detailResponse.json();
```

---

## Error Handling

All errors return appropriate HTTP status codes with error details:

```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Database

- **Database:** scraped-raw-data
- **Collection:** final_product_payloads
- **Total Products:** 147
- **Main Fields:** product_slug, snapshot (contains all product data)

### Data Structure Notes

- **minimal endpoint**: Returns flattened, essential fields for UI display
- **full endpoints**: Return complete `snapshot` object with all scraped data
- **product_slug**: Used as the primary identifier for frontend routing
- **\_id**: MongoDB ObjectId, used for direct database queries

---

## Environment Variables

```
MONGO_URI=mongodb+srv://...
DB_NAME=scraped-raw-data
PORT=3000
NODE_ENV=development
```
