# 海姆名床 (Heim Mattress) - 部署手冊

本專案已配置為可部署至 Vercel，並使用 Supabase 作為後端資料庫。

## 1. Supabase 設定

請登入 [Supabase](https://supabase.com/) 建立新專案，並在 SQL Editor 執行以下語法以建立資料表：

```sql
-- 1. Products (商品表)
create table products (
  id text primary key,
  name text not null,
  category text,
  price integer,
  description text,
  full_description text,
  image_prompt text,
  uploaded_image text, -- Base64 或 URL
  gallery_prompts text[], -- Array of strings
  tags text[],
  features jsonb, -- JSON array: [{icon, label}]
  specs jsonb, -- JSON array: [{label, value}]
  variants jsonb, -- JSON array: [{id, name, price}]
  seo jsonb, -- {title, description, keywords}
  koc_name text,
  reviews jsonb, -- Array of reviews
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Orders (訂單表)
create table orders (
  id text primary key,
  customer_name text,
  items jsonb not null,
  total_amount integer,
  status text default 'PENDING',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Blog Posts (部落格)
create table blog_posts (
  id text primary key,
  title text,
  excerpt text,
  content text,
  category text,
  author text,
  date text, -- YYYY-MM-DD
  tags text[],
  image_prompt text,
  related_link jsonb, -- {label, page}
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Materials (工坊材料)
create table materials (
  id text primary key,
  name text,
  type text, -- COVER, COMFORT_LAYER, SUPPORT_LAYER
  price integer,
  description text,
  color text,
  thickness integer,
  benefits text[],
  stats jsonb -- {firmness, breathability}
);

-- 5. Sizes (床墊尺寸)
create table sizes (
  id text primary key,
  name text,
  width integer,
  length integer,
  base_price integer
);

-- 6. FAQs (常見問題)
create table faqs (
  id text primary key,
  category text,
  question text,
  answer text
);

-- 7. Site Settings (網站設定 - 單一記錄)
create table site_settings (
  id integer primary key default 1,
  value jsonb -- Stores the entire settings object
);

-- 初始化預設設定 (Optional)
insert into site_settings (id, value) values (1, '{
    "announcementText": "🎉 年終慶至114/12/31前下訂，滿萬送千！",
    "announcementColor": "#F4A261",
    "showAnnouncement": true,
    "blogAutoGenerateInterval": "off"
}');
```

## 2. 環境變數設定

在本地開發 (`.env`) 或 Vercel 專案設定中填入：

- `VITE_SUPABASE_URL`: 您的 Supabase Project URL
- `VITE_SUPABASE_ANON_KEY`: 您的 Supabase Anon Key
- `VITE_GEMINI_API_KEY`: Google Gemini API Key

## 3. 部署至 Vercel

1. 將程式碼推送到 GitHub。
2. 在 Vercel Import 專案。
3. Framework Preset 選擇 **Vite**。
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. 設定上述環境變數。
7. 點擊 Deploy。

## 4. 注意事項

- **Tailwind CSS**: 專案已遷移至 Build-time Tailwind。請確保 `npm install` 成功執行。
- **資料庫遷移**: 若從舊版 localStorage 遷移，需手動將重要資料重新輸入至 Supabase 或撰寫腳本遷移。
- **圖片儲存**: 目前系統仍支援 Base64 圖片，建議後續優化為上傳至 Supabase Storage 並僅儲存 URL。

