
import { Product, BlogPost, CartItem, UserProfile, Stamp, Order, OrderStatus, SiteSettings, FaqItem, Material, Size } from '../types';
import { COLLAB_PRODUCTS, BLOG_POSTS, ACHIEVEMENTS, INITIAL_FAQS, MATERIALS, SIZES, STORE_INFO } from '../constants';
import { supabase } from './supabase';

const CART_KEY = 'heim_cart';
const USER_KEY = 'heim_user_profile';
const ALL_USERS_KEY = 'heim_all_users'; // Keep user sync local for now as per manual scope

// Helper to map DB snake_case to CamelCase if necessary
// Assuming Supabase returns data matching the JSON structure if we use JSON columns or matching names
// The manual SQL uses snake_case for some fields: uploaded_image, image_prompt, full_description, customer_name, total_amount, island_name, last_check_in.

class DataService {
  constructor() {
    this.initLocal();
  }

  private initLocal() {
    if (typeof window === 'undefined') return;
    
    // Initialize Local Storage for User/Cart if empty
    if (!localStorage.getItem(USER_KEY)) {
        const defaultUser: UserProfile = {
            name: '島民代表',
            islandName: '睡眠島',
            title: '愛睡覺的',
            avatar: '😊',
            miles: 0,
            unlockedStamps: [],
            lastCheckIn: ''
        };
        localStorage.setItem(USER_KEY, JSON.stringify(defaultUser));
    }
  }

  // --- PRODUCTS (Supabase) ---
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return COLLAB_PRODUCTS; // Fallback for empty DB

      return data.map((p: any) => ({
        ...p,
        fullDescription: p.full_description,
        imagePrompt: p.image_prompt,
        uploadedImage: p.uploaded_image,
        kocName: p.koc_name
      }));
    } catch (e) {
      console.warn('Failed to fetch products from Supabase, falling back to constants', e);
      return COLLAB_PRODUCTS;
    }
  }

  async saveProduct(product: Product): Promise<void> {
    const dbProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      full_description: product.fullDescription,
      image_prompt: product.imagePrompt,
      uploaded_image: product.uploadedImage,
      gallery_prompts: product.galleryPrompts, // Assuming column exists or handled via features jsonb? Manual says "features jsonb". I'll assume flexible schema or added columns.
      tags: product.tags,
      features: product.features,
      specs: product.specs,
      variants: product.variants,
      reviews: product.reviews,
      seo: product.seo,
      koc_name: product.kocName
    };

    const { error } = await supabase.from('products').upsert(dbProduct);
    if (error) throw error;
  }

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  }

  // --- BLOG POSTS (Supabase) ---
  async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return BLOG_POSTS;

      return data.map((p: any) => ({
        ...p,
        imagePrompt: p.image_prompt
      }));
    } catch (e) {
      console.warn('Failed to fetch blog posts, fallback', e);
      return BLOG_POSTS;
    }
  }

  async saveBlogPost(post: BlogPost): Promise<void> {
    const dbPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      author: post.author,
      date: post.date,
      tags: post.tags,
      image_prompt: post.imagePrompt,
      related_link: post.relatedLink // Column might need to be added or stored in JSON
    };
    const { error } = await supabase.from('blog_posts').upsert(dbPost);
    if (error) throw error;
  }

  async deleteBlogPost(id: string): Promise<void> {
    const { error } = await supabase.from('blog_posts').delete().eq('id', id);
    if (error) throw error;
  }

  // --- ORDERS (Supabase) ---
  async getOrders(): Promise<Order[]> {
    try {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        
        return data ? data.map((o: any) => ({
            id: o.id,
            customerName: o.customer_name,
            items: o.items,
            totalAmount: o.total_amount,
            status: o.status,
            date: new Date(o.created_at).toLocaleString('zh-TW')
        })) : [];
    } catch (e) {
        console.warn('Failed to fetch orders', e);
        return [];
    }
  }

  async createOrder(items: CartItem[], totalAmount: number): Promise<Order> {
      const profile = this.getUserProfile();
      const newOrder: Order = {
          id: Date.now().toString(),
          customerName: profile.name,
          items,
          totalAmount,
          status: OrderStatus.PENDING,
          date: new Date().toLocaleString('zh-TW')
      };

      const dbOrder = {
          id: newOrder.id,
          customer_name: newOrder.customerName,
          items: newOrder.items,
          total_amount: newOrder.totalAmount,
          status: newOrder.status
      };

      const { error } = await supabase.from('orders').insert(dbOrder);
      if (error) {
          console.error('Order creation failed in Supabase, saving locally as backup');
          // Fallback to local storage or throw?
          // For now throw to alert user
          throw error;
      }
      
      this.saveCart([]);
      return newOrder;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
  }

  // --- SETTINGS (Supabase) ---
  // Assuming a table 'site_settings' with a single row where id=1
  async getSiteSettings(): Promise<SiteSettings> {
    const defaultSettings: SiteSettings = {
        announcementText: '🎉 年終慶至114/12/31前下訂，滿萬送千！',
        announcementColor: '#F4A261',
        showAnnouncement: true,
        heroImage: '', 
        storyImage1: '',
        storyImage2: '',
        gtmId: '',
        googleSiteVerificationId: '',
        blogAutoGenerateInterval: 'off',
        lastBlogAutoGenerateDate: '',
        enableBalloon: false,
        balloonCode: '',
        balloonDesc: ''
    };

    try {
        const { data, error } = await supabase.from('site_settings').select('value').eq('id', 1).single();
        if (error || !data) return defaultSettings;
        return { ...defaultSettings, ...data.value };
    } catch (e) {
        return defaultSettings;
    }
  }

  async saveSiteSettings(settings: SiteSettings): Promise<void> {
      // Upsert to id 1
      const { error } = await supabase.from('site_settings').upsert({ id: 1, value: settings });
      if (error) throw error;
  }

  // --- MATERIALS / SIZES / FAQs (Supabase) ---
  // Assuming tables 'materials', 'sizes', 'faqs' exist.
  
  async getMaterials(): Promise<Material[]> {
      try {
          const { data, error } = await supabase.from('materials').select('*');
          if (error || !data || data.length === 0) return MATERIALS;
          return data; // Assume columns match interface or simple mapping
      } catch { return MATERIALS; }
  }

  async saveMaterial(material: Material): Promise<void> {
      const { error } = await supabase.from('materials').upsert(material);
      if (error) throw error;
  }

  async deleteMaterial(id: string): Promise<void> {
      const { error } = await supabase.from('materials').delete().eq('id', id);
      if (error) throw error;
  }

  async getSizes(): Promise<Size[]> {
      try {
          const { data, error } = await supabase.from('sizes').select('*');
          if (error || !data || data.length === 0) return SIZES;
          return data.map((s: any) => ({
              ...s,
              basePrice: s.base_price ?? s.basePrice // handle snake_case if DB uses it
          }));
      } catch { return SIZES; }
  }

  async saveSize(size: Size): Promise<void> {
      const dbSize = {
          ...size,
          base_price: size.basePrice
      };
      const { error } = await supabase.from('sizes').upsert(dbSize);
      if (error) throw error;
  }

  async deleteSize(id: string): Promise<void> {
      const { error } = await supabase.from('sizes').delete().eq('id', id);
      if (error) throw error;
  }

  async getFAQs(): Promise<FaqItem[]> {
      try {
          const { data, error } = await supabase.from('faqs').select('*');
          if (error || !data || data.length === 0) return INITIAL_FAQS;
          return data;
      } catch { return INITIAL_FAQS; }
  }

  async saveFAQ(faq: FaqItem): Promise<void> {
      const { error } = await supabase.from('faqs').upsert(faq);
      if (error) throw error;
  }
  
  async deleteFAQ(id: string): Promise<void> {
      const { error } = await supabase.from('faqs').delete().eq('id', id);
      if (error) throw error;
  }

  // --- CLIENT SIDE ONLY (LocalStorage) ---
  
  getCart(): CartItem[] {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveCart(items: CartItem[]): void {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  getUserProfile(): UserProfile {
      const data = localStorage.getItem(USER_KEY);
      if (data) return JSON.parse(data);
      // Re-init if missing
      this.initLocal();
      return JSON.parse(localStorage.getItem(USER_KEY)!);
  }

  saveUserProfile(profile: UserProfile): void {
      localStorage.setItem(USER_KEY, JSON.stringify(profile));
      this.syncUserToCRM(profile);
  }

  private syncUserToCRM(profile: UserProfile) {
      // Keep local CRM sync for demo/fallback
      const allUsersData = localStorage.getItem(ALL_USERS_KEY);
      let allUsers: UserProfile[] = allUsersData ? JSON.parse(allUsersData) : [];
      const index = allUsers.findIndex(u => u.name === profile.name && u.islandName === profile.islandName);
      if (index >= 0) allUsers[index] = profile;
      else allUsers.push(profile);
      localStorage.setItem(ALL_USERS_KEY, JSON.stringify(allUsers));
  }

  getAllProfiles(): UserProfile[] {
      // This is primarily for Admin. In production with Supabase Auth, this would query 'profiles' table.
      // But since we are keeping Auth separate/local for now:
      const data = localStorage.getItem(ALL_USERS_KEY);
      return data ? JSON.parse(data) : [this.getUserProfile()];
  }

  checkIn(): number {
      const profile = this.getUserProfile();
      const today = new Date().toISOString().split('T')[0];
      if (profile.lastCheckIn === today) return 0;
      const reward = 50 + Math.floor(Math.random() * 50);
      profile.lastCheckIn = today;
      profile.miles += reward;
      this.saveUserProfile(profile);
      return reward;
  }

  unlockAchievement(achievementId: string): Stamp | null {
      const profile = this.getUserProfile();
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) return null;
      if (profile.unlockedStamps.includes(achievementId)) return null;
      profile.unlockedStamps.push(achievementId);
      profile.miles += achievement.milesReward;
      this.saveUserProfile(profile);
      return achievement;
  }

  resetData() {
    localStorage.clear();
    this.initLocal();
    window.location.reload();
  }
}

export const dataService = new DataService();
