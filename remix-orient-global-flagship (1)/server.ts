import "dotenv/config";
import chatHandler from "./api/chat";
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Mock Database ---
interface WeeklyUpdate {
  id: string;
  division_id: string;
  title: string;
  status: string;
  scheduled_for: string | null;
  changeset: {
    action: string;
    block_id: string;
    payload?: any;
  };
  created_by?: string;
  created_at?: string;
}

interface ContentBlock {
  id: string;
  division_id: string;
  block_type: string;
  content_payload: any;
  order_index: number;
  published_at: string | null;
}

const db: {
  divisions: any[];
  contentBlocks: ContentBlock[];
  mediaAssets: any[];
  weeklyUpdates: WeeklyUpdate[];
  announcements: any[];
  auditLog: any[];
  products: any[];
  orders: any[];
} = {
  divisions: [
    { id: "div_bakery", name: "Bakery", slug: "bakery", theme_config: { archetype: "Warm Organic / Cultural" }, active_status: true },
    { id: "div_market", name: "Market", slug: "market", theme_config: { archetype: "Clean Utility / Data Grid" }, active_status: true },
    { id: "div_dining", name: "Dining", slug: "dining", theme_config: { archetype: "Dark Luxury / Editorial" }, active_status: true },
    { id: "div_games", name: "Games", slug: "games", theme_config: { archetype: "Brutalist / Technical Dashboard" }, active_status: true },
    { id: "div_water", name: "Water", slug: "water", theme_config: { archetype: "Atmospheric / Ultra-Minimalist" }, active_status: true },
    { id: "div_lounge", name: "Lounge", slug: "lounge", theme_config: { archetype: "Prestige / Immersive Media" }, active_status: true }
  ],
  contentBlocks: [
    { id: "cb_1", division_id: "div_bakery", block_type: "hero", content_payload: { title: "Artisan Bakery", subtitle: "Freshly baked goods daily." }, order_index: 0, published_at: new Date().toISOString() },
    { 
      id: "cb_games_hero", 
      division_id: "div_games", 
      block_type: "hero", 
      content_payload: { 
        title: "LEVEL UP", 
        highlight: "REALITY", 
        subtitle: "System Online // Initialize Sequence" 
      }, 
      order_index: 0, 
      published_at: new Date().toISOString() 
    },
    { 
      id: "cb_games_tournament", 
      division_id: "div_games", 
      block_type: "tournament", 
      content_payload: { 
        eventName: "Warzone Wednesdays", 
        prizePool: "100,000", 
        teams: 32, 
        date: "Oct 25th", 
        time: "20:00 WAT" 
      }, 
      order_index: 1, 
      published_at: new Date().toISOString() 
    },
    { 
      id: "cb_games_vr", 
      division_id: "div_games", 
      block_type: "vr_games", 
      content_payload: { 
        games: [
          { 
              title: 'LAGOS NIGHTS', 
              desc: 'Survive the undercity in this high-speed cyber-parkour experience.', 
              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCE4WCbuoUrl9ihyygcdwLIFaiB4J2no4e-n4rpfiQJPK_g5VLVldHkbEggusCRxWFS1md0TP8IX7wH3mgvKWyD6lM67qFKF5KqYIsYPnheBbkh6Ft0Ag3NP6roGGajtiTqUp3KkjnajhVv050uRAp25TKnkR0I7Y6BaFcyhc-6bzs-mFTOvmo5SVtR2kZ25m0cbPH7Sc7GbhY8R6ceAA7bzUykRKBirqKHzYu8mEYjczz2iDAMLrY3IgsDYfzQzRHJDkdMEEgX-IFA', 
              tags: ['OPEN WORLD', 'RATED M'], 
              color: 'text-[#0df2f2]', 
              borderColor: 'border-[#0df2f2]'
          },
          { 
              title: 'VOID WALKER', 
              desc: "Face your fears in the deep void. Don't look back.", 
              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDPENfCNBzaLIMmAK2r-p3wgMqRwvUWuGEJjSJx9QfORIyrbtq1Wf0lbi2WuZl-o8X9Uqif06vE_vFHKN8ThOXf2vPXg1u79XhZUC0BfsGUx9EQQTmU2guGAPHUwc0B0o24SJ1L3eGS_eEPCzyur80-fyIGZa4lb19LTw-I-r5jwm4d3TOzMQQvY59HWjXfQpqO125z0zhjOf9aH75YDi9EPF2rIgfRhUwwiuR82E_fuYfIBFaV6zS-FCxcGy8Jin66Wk-BXYIhY7Zi', 
              tags: ['HORROR', 'MULTIPLAYER'], 
              color: 'text-red-500', 
              borderColor: 'border-red-500'
          },
          { 
              title: 'PIXEL STORM', 
              desc: 'Relive the classics in fully immersive 3D voxel environments.', 
              img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDBLzp4VE-lcqy0kNGx0lXaxgnt72LHWtr72QGbeDr0TUVlAXAIMrVOFm7luq-PtDUntTG-1AXPZ8KmK9H1Knv6VZFqztDDM0pNvmBbn1a-rDoOdCqn__jd-aMKiYA3mnGowGdt5rHaq5Rt7f7H-XYDfLedcgr3WN3qioN5wIoHgWcdNCOhjt3v_UTFSqZMF9XQQ_EDlTSbYmAYUNd8gpDMiweQq8zOHGJN57f-KLDx5wq54Vww6Hc_-qNxPRLdh0_Y1VWQ-E9sC-PD', 
              tags: ['ARCADE', 'CLASSIC'], 
              color: 'text-purple-500', 
              borderColor: 'border-purple-500'
          }
        ]
      }, 
      order_index: 2, 
      published_at: new Date().toISOString() 
    },
    // Bakery Division Blocks
    {
      id: "cb_bakery_hero",
      division_id: "div_bakery",
      block_type: "hero",
      content_payload: {
        title: "Artisan \nTraditions",
        subtitle: "Every loaf tells a story of patience and craft. We use only organic flour, natural leaven, and time-honored techniques.",
        est: "Est. 2024",
        cta: "View Today's Menu",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
      },
      order_index: 0,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_bakery_products",
      division_id: "div_bakery",
      block_type: "products",
      content_payload: {
        categories: ["Artisan Bread", "Pastries", "Cakes", "Gluten Free"],
        items: [
          { name: "Sourdough Boule", price: "$6.50", desc: "Fermented for 48 hours", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9t68yp7eD8EbfgYgN8yPh9E8fINlAf8HuLVVnTGvCD3qUc3e23T2JGun-nJP6bXRoxLvgVjcWe2ClNCdUfBufe8QcXHwnZ0OciLkZ2N8bdRmt7B9LTt6rLvk-_tylwPFTYz_ay5m83naj88w2Akuwsll5wPjike46V0BokthCbRAbULhpwLdNLYdHnfjENioDCvo1aACWNopQHcbPVAEijcfvPbTyxzofDhri5y9sDrddVVqSTvw8ukWK0tOl0fcMlOG7g3KUJAbH" },
          { name: "Pain au Chocolat", price: "$4.25", desc: "Rich dark chocolate", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCM8pKrsve-Hsj7bZJX1-9KlNRvoCWYl5G6DUmCpAQ9ePX3MZYAukyMkkQi9J0Np11wBcyHAedNaXlJ-csKMnP19WqZ21uNCFRLONd0iE8bn69EmHwUpWN7-xL3oj_ob-LsHtqc6km408cTMkvKqR2MuFlSDGyXY7j7I6YUgRTzsVuffaztzdRmCOTusY4AFpDCl5H1w0d9WR06Mb7t7B7X9TOGxGqDjaAhUI0fUjEJ3RrPUOVHwqshuARGhgZcO1uyuNpfEjzHW0H3" },
          { name: "Olive Focaccia", price: "$5.75", desc: "Rosemary & sea salt", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQ-F9wusQ9tYzEARZ75JEBmmbjYOJu1BPLTcPrMezcQ5TrNe8SNrjrcDPKa3XtCkPk66CN3k5EaTyyLF5HE_aGWcM0oIXoaA3R0UoGUQplQhC7Rydzywu5-D6unPylNBeUdZRrGNm5WoxbBD_F9uiK38tOuKVjmmh1J7ftouqXh1TP3HtSIfozaVNzjcZx9h7xGSinlUY6Tqkm-vFBrA9EwTQ987rV052t1YVhPHwOI0NZ0rj9r7EoufEqGU4d-YqY7H5Voh5uYhc" },
          { name: "Almond Croissant", price: "$4.75", desc: "Toasted almond flakes", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtvcfnlP4Iieg3vcHqItD-0FtFjLHCmUns6ze42h8qXWFbF2e_i3VUn56MPO8V6qcg-YYqZHxOkRiOBmAtL7pEIuUn3KAIR9r1KN_hUU68wBE6A1obJ4mWq3pnE2PFvxCTfU_53_oVzfhEds4gxVjOMq_ey0J3EB2l9xHgUED2QHTd3vIQdIQxAwWAHeq8QTUXWbNDX8Qhu3NjybSYegFz7QB1CV-whWjtHCRXo8nMNncMP_FpKsgEZLS6uw_XPA7VBTdY36tqSaC" },
        ]
      },
      order_index: 1,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_market_hero",
      division_id: "div_market",
      block_type: "hero",
      content_payload: {
        slides: [
          {
            id: 1,
            tag: "SEASONAL",
            title: "Freshness\nRedefined.",
            desc: "Get the season's best produce delivered straight to your door. Back to School bundles now 20% off.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy-0oAZwao1WLSGC1VOrJQiwBj2NdVwZwk_gKQ4h0qNkUtaiLlYvlLil9HpoiZwlVYxQvQrPfv5-1T2QzdZGzCd7Cm6lM5g1Al6rY0AywjjIOSDxWuYyz-0ndrekG7hbkthiLq7vtP45MM7_Qruw26H5NiebjBTsMEKsemr6RsI3u64DiGKTEGl9IVvhrKExsG72Nbg-CafUrhMa7UY_DkkNwZktYjKJNlc-oezyiZxRkYH6WCgyRSTLMC4iFrZ50KgVI0RF5ZAwgm",
            bg: "from-black/70 to-transparent",
            btn: "Shop Bundles",
            navTarget: 'Deals'
          }
        ]
      },
      order_index: 0,
      published_at: new Date().toISOString()
    },
    // Market Division Blocks (Produce & Deals)
    {
      id: "cb_produce_hero",
      division_id: "div_market",
      block_type: "produce_hero",
      content_payload: {
        title: "Farm to Table",
        subtitle: "Sourced directly from local farmers in Jos.",
        stats: [
          { label: "Fresh Items", value: "120+" },
          { label: "Local Farms", value: "15" },
          { label: "Organic", value: "100%" }
        ]
      },
      order_index: 2,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_produce_bestsellers",
      division_id: "div_market",
      block_type: "produce_bestsellers",
      content_payload: {
        items: [
          { id: 'p1', name: "Fresh Spinach", price: 500, unit: "bunch", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC_QO4YyqP0qXoPz8rWqU2tV9sQ4xR3yM6nO1lA2bC5dE8fG9hI0jK3mL4nP5oQ6rS7tU8vW9xY0zB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2r", rating: 4.8, reviews: 120 },
          { id: 'p2', name: "Red Tomatoes", price: 1200, unit: "kg", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM", rating: 4.5, reviews: 85 },
          { id: 'p3', name: "Sweet Bell Peppers", price: 800, unit: "pack", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy-0oAZwao1WLSGC1VOrJQiwBj2NdVwZwk_gKQ4h0qNkUtaiLlYvlLil9HpoiZwlVYxQvQrPfv5-1T2QzdZGzCd7Cm6lM5g1Al6rY0AywjjIOSDxWuYyz-0ndrekG7hbkthiLq7vtP45MM7_Qruw26H5NiebjBTsMEKsemr6RsI3u64DiGKTEGl9IVvhrKExsG72Nbg-CafUrhMa7UY_DkkNwZktYjKJNlc-oezyiZxRkYH6WCgyRSTLMC4iFrZ50KgVI0RF5ZAwgm", rating: 4.9, reviews: 200 },
          { id: 'p4', name: "Organic Carrots", price: 600, unit: "bunch", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6UWHxlzXZ1fZ6YGBbT37L0xAuHSyG5BhZ9bwse3VDii426hr7S1c-HfyAe8e3yQ8NcDRTOXKRjo2Ufc3wc29_OSrYxO_MyJnBz_QS_HpxZUhr0N7aVtOYPSu8UR1hbVvS8J0cHecXDYljfh3DPNefV4iskMSlS7IXlsjbtCi2JYOlqt8iy0T-eLiVLfpWjmZHuJEmLkOm-Yw_J_jXwPk_uDmK3oH1SNX-lFqxu5AS_FVr7ddDLdjxkcHQ-qQDtQQknzrvfpaDEBi0", rating: 4.7, reviews: 150 }
        ]
      },
      order_index: 3,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_produce_specials",
      division_id: "div_market",
      block_type: "produce_specials",
      content_payload: {
        items: [
          { name: "Bell Peppers 3-Pack", price: 3.49, oldPrice: 4.99, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDAy5F7r7nePXG8NGmud1dxusITHs1bRYNvfGzKrcUSEPjPV0GbGAMBqixMsfkL6TkW74AsW3tc7pJCjlGtaAQ2O5T4edOomLl_ykdtZnOnEAeyWUpdmdbX36IzAldPswOVOVzmhGMDEvNFx5b9fZLw6IVxwD5AhUOlXfc3rYdymdbEvx9gf3X7jVpgigl4Z57qkg71ujGDet2pzwYUARpf42UIzcWU2kRB97YI6dSHFyM2Y1UWh9n5YMetQqLZgsoR9dnz0nEG2x_e" },
          { name: "Baby Carrots", price: 0.99, oldPrice: 1.99, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAziwwU98hSNZgMjvSEn-w4umS-8oOsp543BDdcP20dv008vBlNE12K8D0YgncHiFTWuPeKix1OhOmHxB5jKZA_TsxHrc7g_V4LO43PD1f2urJHGIRUiN32GlMo6CGti3YQ31OSMuwnf3oqKn8kIVgqtpEOdS7aTScqQLpwiF4psGuZOLk9w5u23TeWwTLdt0HjeBojUqc5nuvF3h1NhSu3kBMyL6Cq6VIWK7YqW8hyY0BcRTu4AWv4y9RX-8q72WGjz-bInNkf5eGp" }
        ]
      },
      order_index: 3,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_deals_hero",
      division_id: "div_market",
      block_type: "deals_hero",
      content_payload: {
        title: "FLASH \nDEALS",
        subtitle: "Up to 70% OFF on select items.",
        tag: "Limited Time Offer",
        endTime: new Date(Date.now() + 86400000).toISOString() // 24 hours from now
      },
      order_index: 4,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_deals_bogof",
      division_id: "div_market",
      block_type: "deals_bogof",
      content_payload: {
        title: "BOGOF Madness",
        items: [
           { name: "Italian Penne Pasta", price: 3500, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXHoapzHeb1VAPEs6czxDQyvWwduFy91nT-Drp_8nE1SyGtHCVjAT37yLzElXag6I_iuWbvvn3rXicnFwJbZK6_saydnAr5JMl2ZAbbt-npsIKEgbZlIicshunGdLBZqV_jllJM0yZfx0ST0DcjCV9quCoxmCTuc9rl_YY47qHdhClvIqTI4MUOXqUj_YG6igsq_Y8vTNSDMW6Ns8hfeTHBVkeso2GuVsE71yVuNPrxLnmZquU1I4cQrwmOV35Ph63vhNswuB0XPz5" },
           { name: "Crunchy Honey Oats", price: 8500, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXBjKg17kvDr-yZMkA48mT0lE3Xbt4JdLlpvYBXczFNBE8tetypNpxK63qyjbo4BD1q7hYNuYBuXyMnKAmdoBoJCHc3e2XEt0Zxt-1NnRMUgN4tF6M_wz5k5IglIfb5d4EYamk02-tYZmmgkrA28peT1TUqjZXXfvLB-oSob3KJSxcD_RfV2blGe4UojAy4kFgp1y40sZ_iFVNBwcE7BKn-rn_rz2ktAJ5suXl3yfKQMD0MpkzqBKZss6ejH4UDb406R4XbWhVPPm1" },
           { name: "Basmati Royal Rice", price: 12000, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJz7jDkUIg86_TDT-v0KLZPgAO2-9V1pv3RjvCTMcP2qbT01BI4V3idRe0PEcz_r2vmzFKmQW5NV-pJfbSy0LMvmpvLfACa4XrwDwqL2fvs6fl9xW0L1Q27K054mIGVnFLCOm7AqHdPBsT9eNLpjf36h9OOcJmFoPEdqwlT56Xwub4ZPB-teHtwt-C8wf2BBFKqb8E6dI8mO-Xr4rA3uX8GxYHVFrJHBhsOSIkago-Lg7IVnpVJixqjiUQ5VarxA96fq1-7BKGuqEM" },
           { name: "Napoli Pasta Sauce", price: 4500, img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPS-DzsRxxDMIbFUppQkGvVi5uAk3JOnX_sonuAN2jiZ4kKJ0z8iWrWheNqy499jUiN_4J6mqQ9CmhzWJv4nsTQxiUOeEiBXjLf3_O8qZVzKlfGBMaSQG8mW496ppb1IslRyL3FtzHdTYmTwDBtc0bWKPiLG9_eoYO4Y04sTabgnC2ZL-pFuBlWdnRLMwtbztRHsLO4dmcKkcxuPnQTRWAmxQhnsb2VfigD6R8k58is0rkwXEcSDDwQ30Jcvv31OSqejf7o7vDjLRB" }
        ]
      },
      order_index: 5,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_market_aisles",
      division_id: "div_market",
      block_type: "aisles",
      content_payload: {
        aisles: [
          { id: 'produce', name: 'Fresh Produce', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1xd2NZ3opaoe4vIhkG1KskQa5eycV1mBsXfOpf4j-MJsKt-ypLr-6_f-boyuKPonX3JvaXMTTGJY1hKM0gEqNIgAkn5V9b1TkeoiqKOc8GE1gvBAc-0rZTeFQXb2hVo2qsOMh-mQjOIQyjMOqqNlfYfFsvBlSYuCF5w-_Pq0TYPBlahOL2PCyCACTheQjxsJQIsNA5NND-7NqRH8t_thzBfpoRNDtE-gks7qVYG2cBaVC8C0IL9am7k5uv13czpM1U-14-_uj-Q9w', color: 'bg-green-100 text-green-800' },
          { id: 'bakery', name: 'Bakery & Bread', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM', color: 'bg-yellow-100 text-yellow-800' },
          { id: 'dairy', name: 'Dairy & Eggs', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbd0wFC57LwPQUOyUC38exd7j2pV9Jh0K_hLRw0yjkF5iFVsqmQz3jfBgM6_G9ZX2p6VAPIkOf-aOOXEFojpbgtgemiFiYnfzuWMcxe_MW3GkeN7U1_fuwGfrPp_Mffjm4aVHsil05PJE3o7PJg3_DDy0iQgexr7xzJPYp9S1no5rXRRZyo7BpWPEieVoHvLFrn_Nv8NF65PZWTEUQQwc7WIMR7bDeekusfqamGTmuycHFki2QQcAFevyUSfJUH8gln0PTyPBEB5MX', color: 'bg-blue-100 text-blue-800' },
          { id: 'pantry', name: 'Pantry Staples', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfoq8Qt1i7X_77OeMmegd2_Pq0DTvro1D9LRM41EHPXBvfhGfBUFUH9Hxz6iRXpsKH0WopOq6O_kC6qnviNMVijikGIXmg2_kEoGYs1dpOg2jDHPARVYUD9l8q5TSbVWMd66a8oJEmxm4TKvrUgiDQSj9NVd1rcUAE7R5dxHnKIrs9TFbKXLxgjuA6DVPTbfZ01F1DuQ5dl6lAIl20nZh9Y_PpPo159YTLemPsPv9zW0IBTa5E5lL9qd5UMd_feG8lscDICVmlTxgD', color: 'bg-orange-100 text-orange-800' },
          { id: 'meat', name: 'Meat & Seafood', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZaVZsuIcPt-Snqtd00ARadGGhvApZXRSLHFds0nhdY0X2XM2kV9tJ5rjDPZWKo4HpfqVXQcISZG8W__pRUmkDBo-9tDRZlXZm0pVeIXQPvACFQQhs5QEZyWOk4geSuBrWEs6y2_XEARkWI6z2I0R7u_HbsazyDkQ5x0UGRcWg6nhBc5ra-0d9EJZt0vTj8cE5joHZpNhvptffB8mcLhxiHj5rVSqj7JQF2yNfwy71ShpKudl8Vb6DtIxHTEtSYdZ9nVtAk1gNU01e', color: 'bg-red-100 text-red-800' },
          { id: 'frozen', name: 'Frozen Foods', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoLnVeL44jkjtmwQxjCJ4Fbt14l3Jbz8YC278yJslk1GE1LehJCw8YjnicdmDXRWfEDtkqb483NspodmfrV1Q0Jo9EbwICzgvukibkvP4bi0kSS4h-WKj3njHMuF18yFP0Lhvq5s22o0-PuE1ybYNyWLBLXJws_wfIIddru9TozcLJdj0HbIO7sU1go_xmCYJ313XT4HeCkqsoPDNpgB7NilpejuOfSstw0xnlZtse27wNMW3ChICF4PI9gXgRDtttmtbd9jw51FWU', color: 'bg-cyan-100 text-cyan-800' },
          { id: 'beverages', name: 'Beverages', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6yO9YpD7WzXoPz8rWqU2tV9sQ4xR3yM6nO1lA2bC5dE8fG9hI0jK3mL4nP5oQ6rS7tU8vW9xY0zB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2r', color: 'bg-purple-100 text-purple-800' },
          { id: 'household', name: 'Household', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR3BqvgI_JtzoDPnzd2B4va9ct4322umJBsiC4ir_l-N3MBrGNm4n-c9mdgd4GV-At7oFks2rep4HKnSd1YNmkpQWJxm3JUk-2XngzcLnstZd9nWgJldDEnqie660w8R5k5JtBm4a6XJMLa8HapRDf1S2RAw6CrZPTaGdyPkrcd8ESOfAiZOilFrNsR-RgK99FauncBpDUmq7rmrGhove30EiaBy9Rf9z2162_Y_5D34T-oRqR404T-IX9RC-m2fPDnhc62KzIHA66', color: 'bg-gray-100 text-gray-800' },
        ]
      },
      order_index: 6,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_deals_config",
      division_id: "div_market",
      block_type: "deals_config",
      content_payload: {
        savingsText: "Potential Savings",
        savingsValue: "₦22,000",
        signInText: "Sign in to Save"
      },
      order_index: 7,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_wholesale_config",
      division_id: "div_market",
      block_type: "wholesale_config",
      content_payload: {
        bannerText: "B2B Bulk Purchasing Portal",
        logisticsConstants: {
          weightPerPallet: "1000kg",
          deliveryTime: "24-48 hours"
        },
        partnerStatusTiers: [
          { name: "Platinum", discount: "15%" },
          { name: "Gold", discount: "10%" }
        ]
      },
      order_index: 8,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_ai_config",
      division_id: "div_market",
      block_type: "ai_config",
      content_payload: {
        greeting: "Hi! I noticed you're buying pasta. Need tomato sauce?",
        searchPlaceholder: "Search fresh inventory...",
        assistantName: "Market Assistant",
        dailySuggestion: "Fresh organic tomatoes just arrived!"
      },
      order_index: 9,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_deal",
      division_id: "div_market",
      block_type: "deal",
      content_payload: {
        product: {
          id: 'r-11',
          name: 'Olive Oil (500ml)',
          price: 6500,
          oldPrice: 8500,
          category: 'Pantry',
          context: 'RETAIL',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJz7jDkUIg86_TDT-v0KLZPgAO2-9V1pv3RjvCTMcP2qbT01BI4V3idRe0PEcz_r2vmzFKmQW5NV-pJfbSy0LMvmpvLfACa4XrwDwqL2fvs6fl9xW0L1Q27K054mIGVnFLCOm7AqHdPBsT9eNLpjf36h9OOcJmFoPEdqwlT56Xwub4ZPB-teHtwt-C8wf2BBFKqb8E6dI8mO-Xr4rA3uX8GxYHVFrJHBhsOSIkago-Lg7IVnpVJixqjiUQ5VarxA96fq1-7BKGuqEM',
          tags: ['FLASH DEAL']
        }
      },
      order_index: 10,
      published_at: new Date().toISOString()
    },
    // Water Division Blocks
    {
      id: "cb_water_hero",
      division_id: "div_water",
      block_type: "hero",
      content_payload: {
        title: "Purity in every drop.",
        subtitle: "Experience water refined through seven stages of molecular purification. Traceable quality, delivered to your door."
      },
      order_index: 0,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_water_products",
      division_id: "div_water",
      block_type: "products",
      content_payload: {
        items: [
          { id: '1', name: '75cl Premium', description: 'Water Bottle', price: 150, image: 'https://images.unsplash.com/photo-1602143407151-01114195bc03?auto=format&fit=crop&w=400&q=80', volume: '75cl' },
          { id: '2', name: '50cl On-the-Go', description: 'Bottle', price: 100, image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=400&q=80', volume: '50cl' },
          { id: '3', name: '19L Dispenser', description: 'Refill', price: 1200, image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=400&q=80', volume: '19L' },
          { id: '4', name: 'Sachet Pack', description: '(20pcs)', price: 300, image: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?auto=format&fit=crop&w=400&q=80', volume: '20pcs' }
        ]
      },
      order_index: 1,
      published_at: new Date().toISOString()
    },
    // Dining Division Blocks
    {
      id: "cb_dining_hero",
      division_id: "div_dining",
      block_type: "hero",
      content_payload: {
        title: "Taste the Orient",
        subtitle: "A culinary journey from the vibrant markets of Jos to the heart of fine dining. Experience the soul of local heritage and continental mastery."
      },
      order_index: 0,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_dining_menu",
      division_id: "div_dining",
      block_type: "menu",
      content_payload: {
        categories: [
          {
            name: "Proteins & Grills",
            items: [
              { id: "PRD-D-001", name: "Peppered & Grilled Beef", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Succulent prime cuts slow-marinated in scotch bonnet, onions, and indigenous spices, char-grilled over hardwood coals.", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-002", name: "Spiced Roasted & Fried Chicken", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Tender chicken steeped in aromatic ginger, garlic, thyme, and habanero relish, crisped golden on the skin.", image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-003", name: "Peppered Pork Chops", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Thick, tender pork chops braised with native aromatics and tossed in fiery bell pepper reduction sauce.", image: "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-004", name: "Goat Meat & Fresh Catfish Platter", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Chevon asun chunks alongside whole fire-roasted fresh catfish glazed in native chili and uda herb oil.", image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80" }
            ]
          },
          {
            name: "The Rice Core",
            items: [
              { id: "PRD-D-005", name: "Smoky Jollof Rice", price: "₦10", stock: 5, prepTime: "11 mins", desc: "The crown jewel of Nigerian party cuisine — long-grain rice slow-cooked in rich plum tomato, tatashe, and open-flame smoke.", image: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-006", name: "Nigerian Fried Rice", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Vibrant yellow parboiled rice wok-tossed with sweet corn, liver tidbits, fresh carrots, green peas, and rich stock.", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-007", name: "White Rice & Ayamase (Ofada Sauce)", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Fluffy steamed rice served with dark, bleached palm oil green pepper stew, iru (locust beans), and tender assorted meat.", image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-008", name: "Coconut Rice", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Fragrant rice steeped in fresh pressed coconut milk, dried crayfish essence, and mild garden peppers.", image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=800&q=80" }
            ]
          },
          {
            name: "Soups & Natural Swallows",
            items: [
              { id: "PRD-D-009", name: "Heritage Egusi Soup", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Hand-milled melon seeds cooked in rich palm oil broth with fluted pumpkin (ugu) leaves, stockfish, and smoked crayfish.", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-010", name: "Efo Riro (Rich Spinach Pottage)", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Yoruba-style rich green leafy pottage slow-simmered with shaki, ponmo, dried fish, and fermented locust beans.", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-011", name: "Seafood Okra Soup", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Finely diced fresh okra pods cooked with blue crabs, jumbo prawns, periwinkles, and fresh calamari in light pepper broth.", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-012", name: "Ogbono & Afang Soup Duet", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Velvety bush mango seed draw soup paired with wild Calabar Afang leaves, smoked dry fish, and rich beef broth.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-013", name: "Fluffy Pounded Yam", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Silky smooth, hot pounded white yam prepared to velvety elastic perfection, ready for dipping into rich heritage soups.", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-014", name: "Natural Grain Flours (Amala, Eba & Semo)", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Choice of artisanal brown yam flour (Àmàlà Isu), yellow Ijebu cassava gari (Ẹ̀bà), or stone-ground wheat semo.", image: "https://images.unsplash.com/photo-1505253758473-96b3015f240a?auto=format&fit=crop&w=800&q=80" }
            ]
          },
          {
            name: "Yam & Pasta",
            items: [
              { id: "PRD-D-015", name: "Asaro (Yam Porridge)", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Puna yam cubes slow-simmered in red palm oil, blended scotch bonnets, dried fish chunks, and shredded scent leaves.", image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-016", name: "Jollof Spaghetti & Stir-Fry Pasta", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Spaghetti simmered in rich spiced tomato sauce with bell pepper strips, sweet onions, frankfurters, and herb seasoning.", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-017", name: "Fried Yam & Plantain Combo", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Golden fried sweet puna yam batons paired with ripe plantain dodo and spicy ata dindin dipping sauce.", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" }
            ]
          },
          {
            name: "Starters & Sides",
            items: [
              { id: "PRD-D-018", name: "Artisanal Moi Moi Elewe", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Steamed savory bean pudding enriched with boiled eggs, flaked fish, crayfish, and wrapped in aromatic banana leaves.", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-019", name: "Fried Plantain (Dodo Platter)", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Caramelized, perfectly ripe sweet plantain slices fried golden brown with a pinch of sea salt.", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80" },
              { id: "PRD-D-020", name: "Pepper Soup (Catfish & Goat Meat)", price: "₦10", stock: 5, prepTime: "11 mins", desc: "Light, intensely aromatic broth infused with alligator pepper, calabash nutmeg, uda pods, and fresh scent leaves.", image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80" }
            ]
          }
        ]
      },
      order_index: 1,
      published_at: new Date().toISOString()
    },
    // Market Division Blocks
    {
      id: "cb_market_hero",
      division_id: "div_market",
      block_type: "hero",
      content_payload: {
        slides: [
          {
            id: 1,
            tag: "SEASONAL",
            title: "Freshness\nRedefined.",
            desc: "Get the season's best produce delivered straight to your door. Back to School bundles now 20% off.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy-0oAZwao1WLSGC1VOrJQiwBj2NdVwZwk_gKQ4h0qNkUtaiLlYvlLil9HpoiZwlVYxQvQrPfv5-1T2QzdZGzCd7Cm6lM5g1Al6rY0AywjjIOSDxWuYyz-0ndrekG7hbkthiLq7vtP45MM7_Qruw26H5NiebjBTsMEKsemr6RsI3u64DiGKTEGl9IVvhrKExsG72Nbg-CafUrhMa7UY_DkkNwZktYjKJNlc-oezyiZxRkYH6WCgyRSTLMC4iFrZ50KgVI0RF5ZAwgm",
            bg: "from-black/70 to-transparent",
            btn: "Shop Bundles",
            navTarget: 'Deals'
          },
          {
            id: 2,
            tag: "WHOLESALE",
            title: "Bulk Savings\nBig Profits.",
            desc: "Exclusive wholesale pricing for registered partners. Stock up on rice, grains, and pantry staples.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6UWHxlzXZ1fZ6YGBbT37L0xAuHSyG5BhZ9bwse3VDii426hr7S1c-HfyAe8e3yQ8NcDRTOXKRjo2Ufc3wc29_OSrYxO_MyJnBz_QS_HpxZUhr0N7aVtOYPSu8UR1hbVvS8J0cHecXDYljfh3DPNefV4iskMSlS7IXlsjbtCi2JYOlqt8iy0T-eLiVLfpWjmZHuJEmLkOm-Yw_J_jXwPk_uDmK3oH1SNX-lFqxu5AS_FVr7ddDLdjxkcHQ-qQDtQQknzrvfpaDEBi0",
            bg: "from-blue-900/80 to-transparent",
            btn: "Go to Portal",
            navTarget: 'Wholesale'
          },
          {
            id: 3,
            tag: "BAKERY",
            title: "Oven Fresh\nDaily.",
            desc: "Our artisan breads and pastries are baked fresh every morning. Smell the difference.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM",
            bg: "from-yellow-900/70 to-transparent",
            btn: "View Bakery",
            navTarget: 'Bakery'
          },
          {
            id: 4,
            tag: "DRINKS",
            title: "Quench Your\nThirst.",
            desc: "From sparkling water to premium wines. Refreshment delivered in minutes.",
            img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6yO9YpD7WzXoPz8rWqU2tV9sQ4xR3yM6nO1lA2bC5dE8fG9hI0jK3mL4nP5oQ6rS7tU8vW9xY0zB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2r",
            bg: "from-purple-900/70 to-transparent",
            btn: "Shop Drinks",
            navTarget: 'Aisles'
          }
        ]
      },
      order_index: 0,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_market_deal",
      division_id: "div_market",
      block_type: "deal",
      content_payload: {
        product: {
          id: 'deal-coffee',
          name: 'Premium Arabica Coffee Beans (1kg)',
          price: 12990,
          oldPrice: 18500,
          category: 'Beverages',
          context: 'RETAIL',
          image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1wZpJFJka3FlypGKUsr0BoyDreoSK1yO0HNItuIXwL45jTS5sMWtJDX0xA05wzVKWEcdMe1SOjWb69PBje0fItEcORGH36VHdOesDWcLXtQBkh8La1nnsZScU27G8OcoTKxo7cd4zC8zzD1znfAXSzlVSQq57xNupl-rWunYkpDK1Y_BCzhN_AD2ML0NXdxUY6-hQUG9tyuCXWZ-Q-S4_Aqh-WhDlYgbDQE7EKXAWmmlxMZcK9DNUkIa8eQkEjH15ny70tqJDUwlo',
          tags: ['FLASH DEAL', 'LIMITED']
        }
      },
      order_index: 1,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_market_wholesale_config",
      division_id: "div_market",
      block_type: "wholesale_config",
      content_payload: {
        tiers: [
          { minQty: 1, discount: 0, label: "Retail" },
          { minQty: 10, discount: 10, label: "Silver Partner" },
          { minQty: 50, discount: 20, label: "Gold Partner" },
          { minQty: 100, discount: 35, label: "Platinum Partner" }
        ],
        shippingThreshold: 50000,
        announcement: "New Harvest Grains now available for bulk pre-order!",
        bannerText: "Wholesale Portal: Premium Sourcing for Businesses",
        logistics: {
          unitWeightKg: 0.5,
          palletCapacity: 200,
          freeShippingThreshold: 50000
        }
      },
      order_index: 6,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_market_ai_config",
      division_id: "div_market",
      block_type: "ai_config",
      content_payload: {
        greeting: "Hi! I noticed you're buying pasta. Need tomato sauce?",
        searchPlaceholder: "Search fresh produce, pantry, and more...",
        assistantName: "Market Assistant"
      },
      order_index: 8,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_market_deals_config",
      division_id: "div_market",
      block_type: "deals_config",
      content_payload: {
        potentialSavings: 15400,
        savingsLabel: "Potential Savings Today"
      },
      order_index: 9,
      published_at: new Date().toISOString()
    },
    {
      id: "cb_produce_quick_reorder",
      division_id: "div_market",
      block_type: "quick_reorder",
      content_payload: {
        items: [
          { name: "Organic Avocados", price: "$2.99 / ea", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDhQ-F9wusQ9tYzEARZ75JEBmmbjYOJu1BPLTcPrMezcQ5TrNe8SNrjrcDPKa3XtCkPk66CN3k5EaTyyLF5HE_aGWcM0oIXoaA3R0UoGUQplQhC7Rydzywu5-D6unPylNBeUdZRrGNm5WoxbBD_F9uiK38tOuKVjmmh1J7ftouqXh1TP3HtSIfozaVNzjcZx9h7xGSinlUY6Tqkm-vFBrA9EwTQ987rV052t1YVhPHwOI0NZ0rj9r7EoufEqGU4d-YqY7H5Voh5uYhc" },
          { name: "Green Asparagus", price: "$4.50 / bundle", img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdtvcfnlP4Iieg3vcHqItD-0FtFjLHCmUns6ze42h8qXWFbF2e_i3VUn56MPO8V6qcg-YYqZHxOkRiOBmAtL7pEIuUn3KAIR9r1KN_hUU68wBE6A1obJ4mWq3pnE2PFvxCTfU_53_oVzfhEds4gxVjOMq_ey0J3EB2l9xHgUED2QHTd3vIQdIQxAwWAHeq8QTUXWbNDX8Qhu3NjybSYegFz7QB1CV-whWjtHCRXo8nMNncMP_FpKsgEZLS6uw_XPA7VBTdY36tqSaC" }
        ]
      },
      order_index: 10,
      published_at: new Date().toISOString()
    }
  ],
  mediaAssets: [],
  weeklyUpdates: [
    { id: "wu_1", division_id: "div_market", title: "New Seasonal Campaign", status: "pending_review", scheduled_for: null, changeset: { action: "update", block_id: "cb_market_hero" }, created_by: "staff_1", created_at: new Date().toISOString() }
  ],
  announcements: [
    { id: "ann_1", text: "Grand Opening Special: 20% off all services this week!", active: true }
  ],
  auditLog: [
    { id: "log_1", user: "staff_1", action: "Created draft for Market Hero", timestamp: new Date().toISOString() }
  ],
  products: [
    { id: 'r-1', name: 'Organic Hass Avocados', price: 4990, category: 'Produce', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1xd2NZ3opaoe4vIhkG1KskQa5eycV1mBsXfOpf4j-MJsKt-ypLr-6_f-boyuKPonX3JvaXMTTGJY1hKM0gEqNIgAkn5V9b1TkeoiqKOc8GE1gvBAc-0rZTeFQXb2hVo2qsOMh-mQjOIQyjMOqqNlfYfFsvBlSYuCF5w-_Pq0TYPBlahOL2PCyCACTheQjxsJQIsNA5NND-7NqRH8t_thzBfpoRNDtE-gks7qVYG2cBaVC8C0IL9am7k5uv13czpM1U-14-_uj-Q9w', tag: 'Fresh', tagColor: 'bg-green-100 text-green-700' },
    { id: 'r-2', name: 'Royal Gala Apples', price: 3490, category: 'Produce', context: 'RETAIL', unit: 'per lb', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgfsUCs8ePcoWB-jJsK24PY0w0y1xlDAgOGx2atxc1wtAHM0WSonl1a7UbEA8bQYoDZPIj7TBHezFFLC8YqvU5eGxZNK8BPGZb9OSLiw5o54mP7aNy6vIumbCt4I4o25uxve7_CcUFk8OtuKRCZTrZNp0P0ptDP-gdkz9nVYJULkCza7nvzCQWZXuNvDkNj8ko1wRQaBugXeBz7hwLnbG-c1aXTXeX8IN0bx38TMGyfYxoxyTiTCWwuCcCiFcQJKSBmKjBdnHVxkdV' },
    { id: 'r-3', name: 'Bananas (Bunch)', price: 1290, category: 'Produce', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTdK9Xp4RFtLQy4bHYyJNZQms2i9H2qddc1lRxi1NsG8KDkLY1hTq4_GwMyqsM7UifzQjV11gqNHxkUh97rRBgPS753S2H4O2HymiaSdFjXvOz7WiW_SNf_I1JihhzeFClhsM7hAQ2NwwbD-iADvS74iIc38fsN5mEVZoBfohZWJOjJtSWpw9ePEk2RDXjHujYjB9nagJCEE_3CQw5f7CQFsPbBV6xb_cmgZOuB1yNPduw9VuOgit2mS6uO7yOrcGIqyiwl1rL_ZwB' },
    { id: 'r-4', name: 'Red Bell Peppers', price: 2500, category: 'Produce', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAy5F7r7nePXG8NGmud1dxusITHs1bRYNvfGzKrcUSEPjPV0GbGAMBqixMsfkL6TkW74AsW3tc7pJCjlGtaAQ2O5T4edOomLl_ykdtZnOnEAeyWUpdmdbX36IzAldPswOVOVzmhGMDEvNFx5b9fZLw6IVxwD5AhUOlXfc3rYdymdbEvx9gf3X7jVpgigl4Z57qkg71ujGDet2pzwYUARpf42UIzcWU2kRB97YI6dSHFyM2Y1UWh9n5YMetQqLZgsoR9dnz0nEG2x_e' },
    { id: 'r-5', name: 'Baby Carrots', price: 1990, category: 'Produce', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAziwwU98hSNZgMjvSEn-w4umS-8oOsp543BDdcP20dv008vBlNE12K8D0YgncHiFTWuPeKix1OhOmHxB5jKZA_TsxHrc7g_V4LO43PD1f2urJHGIRUiN32GlMo6CGti3YQ31OSMuwnf3oqKn8kIVgqtpEOdS7aTScqQLpwiF4psGuZOLk9w5u23TeWwTLdt0HjeBojUqc5nuvF3h1NhSu3kBMyL6Cq6VIWK7YqW8hyY0BcRTu4AWv4y9RX-8q72WGjz-bInNkf5eGp' },
    { id: 'r-6', name: 'Fresh Broccoli', price: 2150, category: 'Produce', context: 'RETAIL', unit: 'per head', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9t68yp7eD8EbfgYgN8yPh9E8fINlAf8HuLVVnTGvCD3qUc3e23T2JGun-nJP6bXRoxLvgVjcWe2ClNCdUfBufe8QcXHwnZ0OciLkZ2N8bdRmt7B9LTt6rLvk-_tylwPFTYz_ay5m83naj88w2Akuwsll5wPjike46V0BokthCbRAbULhpwLdNLYdHnfjENioDCvo1aACWNopQHcbPVAEijcfvPbTyxzofDhri5y9sDrddVVqSTvw8ukWK0tOl0fcMlOG7g3KUJAbH' },
    { id: 'r-7', name: 'Almond Breeze Milk', price: 3490, category: 'Dairy', context: 'RETAIL', unit: '1L', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbd0wFC57LwPQUOyUC38exd7j2pV9Jh0K_hLRw0yjkF5iFVsqmQz3jfBgM6_G9ZX2p6VAPIkOf-aOOXEFojpbgtgemiFiYnfzuWMcxe_MW3GkeN7U1_fuwGfrPp_Mffjm4aVHsil05PJE3o7PJg3_DDy0iQgexr7xzJPYp9S1no5rXRRZyo7BpWPEieVoHvLFrn_Nv8NF65PZWTEUQQwc7WIMR7bDeekusfqamGTmuycHFki2QQcAFevyUSfJUH8gln0PTyPBEB5MX', oldPrice: 4200, tag: 'SALE', tagColor: 'bg-red-100 text-red-600' },
    { id: 'r-8', name: 'Whole Wheat Bread', price: 3250, category: 'Bakery', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM' },
    { id: 'r-9', name: 'Free Range Eggs (12)', price: 5990, category: 'Dairy', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-NDp38NsxRkFiwIRJsdcCZoEe_OsjANbmlkHgOtiNb40FBYnGQdrc95EkmA3WehJu9L5l8ob-BZxkaIcqFbtxc4oBMri96yrfCvg7jc0-fHqWsRYqcmcB-dP2XsNMoABHeTBXzQRsuq3obB1xXkA1Xm6nC8dP9amTm-oyc-IBmkRzmT9xy0wh0RdjCNZLAjk3G7OpxXjR01JzjvCwnw3jNvI2Qp7GG2eVFDmFwAD1wowNZpzrF2yOK-2BVQJD9Irj6Iblx9pEpLxk' },
    { id: 'r-10', name: 'Barilla Spaghetti', price: 1990, category: 'Pantry', context: 'RETAIL', unit: '500g', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfoq8Qt1i7X_77OeMmegd2_Pq0DTvro1D9LRM41EHPXBvfhGfBUFUH9Hxz6iRXpsKH0WopOq6O_kC6qnviNMVijikGIXmg2_kEoGYs1dpOg2jDHPARVYUD9l8q5TSbVWMd66a8oJEmxm4TKvrUgiDQSj9NVd1rcUAE7R5dxHnKIrs9TFbKXLxgjuA6DVPTbfZ01F1DuQ5dl6lAIl20nZh9Y_PpPo159YTLemPsPv9zW0IBTa5E5lL9qd5UMd_feG8lscDICVmlTxgD' },
    { id: 'r-11', name: 'Olive Oil (500ml)', price: 8500, category: 'Pantry', context: 'RETAIL', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJz7jDkUIg86_TDT-v0KLZPgAO2-9V1pv3RjvCTMcP2qbT01BI4V3idRe0PEcz_r2vmzFKmQW5NV-pJfbSy0LMvmpvLfACa4XrwDwqL2fvs6fl9xW0L1Q27K054mIGVnFLCOm7AqHdPBsT9eNLpjf36h9OOcJmFoPEdqwlT56Xwub4ZPB-teHtwt-C8wf2BBFKqb8E6dI8mO-Xr4rA3uX8GxYHVFrJHBhsOSIkago-Lg7IVnpVJixqjiUQ5VarxA96fq1-7BKGuqEM' },
    { id: 'w-1', name: 'Jasmine Rice Premium', price: 45000, category: 'Grains', context: 'WHOLESALE', unit: '20kg Bag', stock: 500, tierInfo: '-10% @ 10+', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6UWHxlzXZ1fZ6YGBbT37L0xAuHSyG5BhZ9bwse3VDii426hr7S1c-HfyAe8e3yQ8NcDRTOXKRjo2Ufc3wc29_OSrYxO_MyJnBz_QS_HpxZUhr0N7aVtOYPSu8UR1hbVvS8J0cHecXDYljfh3DPNefV4iskMSlS7IXlsjbtCi2JYOlqt8iy0T-eLiVLfpWjmZHuJEmLkOm-Yw_J_jXwPk_uDmK3oH1SNX-lFqxu5AS_FVr7ddDLdjxkcHQ-qQDtQQknzrvfpaDEBi0' },
    { id: 'w-2', name: 'Premium Light Soy Sauce', price: 32500, category: 'Condiments', context: 'WHOLESALE', unit: '12 x 500ml', stock: 120, tierInfo: 'Standard', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZHWw2XV0MzZOvQrrXfzV3o1YDv2qpnP56aep5JGUzVrFsO3-jGk65sTxTG9F9vHz9Ajhb3nNFFLLUjR3QB6nJLGHTO6fXlxC-y9OOLyp2PSAPaH8NsV6_4zhcY-lzoQoNNUC3Vj4zWdjwlgugpjW5MF4IKquE6YkNoA3AjRQaPScDi_zyUA2HHsa--IYO2FexG9Jenz2UJJvHEQuRwpYR4Z5aGsSlpF9Aniy0ogAmWDXRyXUp7cAQQmcnOxK9hNpDeQUf-EesSS9b' },
    { id: 'w-3', name: 'Coconut Milk Aroy-D', price: 58000, category: 'Pantry', context: 'WHOLESALE', unit: '24 x 400ml', stock: 45, tierInfo: '-5% @ 20+', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBT9KQuIVYUr7Ec4V7wTv51EM2_CbycSlfIYm9p0klfgPcNSrKfmRz8Mu3F7nnjvTaNyJt38kC-WUZYCw7SaCLgxtpCuJ6ZKLr7sobHIhy9-gZcvfnzsUvFHjyAulA41vIjx_Q3vRr4A7m6yXMOJLT0mBfIwzH2QQj8XypWLTFuuJF-XowSWS5veoQoTyDsOwqqDpfJ0YXq3wWUdAwwX51iavrxwrgzWRE464dbGsdAkk-t4NOanxsZ7O_Dbz2Z-9VMXZXXLO6lnhuw' },
    { id: 'w-4', name: 'Refined Sugar', price: 85000, category: 'Pantry', context: 'WHOLESALE', unit: '50kg Sack', stock: 200, tierInfo: 'Bulk', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXHoapzHeb1VAPEs6czxDQyvWwduFy91nT-Drp_8nE1SyGtHCVjAT37yLzElXag6I_iuWbvvn3rXicnFwJbZK6_saydnAr5JMl2ZAbbt-npsIKEgbZlIicshunGdLBZqV_jllJM0yZfx0ST0DcjCV9quCoxmCTuc9rl_YY47qHdhClvIqTI4MUOXqUj_YG6igsq_Y8vTNSDMW6Ns8hfeTHBVkeso2GuVsE71yVuNPrxLnmZquU1I4cQrwmOV35Ph63vhNswuB0XPz5' },
    { id: 'w-5', name: 'Vegetable Oil', price: 42000, category: 'Pantry', context: 'WHOLESALE', unit: '20L Drum', stock: 80, tierInfo: 'Standard', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM' },
    { id: 'w-6', name: 'Indomie Chicken Noodles', price: 17000, category: 'Pantry', context: 'WHOLESALE', unit: '40 Pack Carton', stock: 300, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyj_EKQtpND4fNNxmNxqVmseLJCh_vkjVVOc0ttQKEmUNIo7uW9RcBY4aEpSQ3zPNU4Pyl-Lgp00pMRuPhRRfcyDSxu3tp5tRjCDG_TVwNsMRrKq9KibYRbyU9EcVRBQye2jXp0phF5xU0DxnavANvcOqGB5yhQ_9GdXYt-dXUT27A-xfjyMpRUaofCCl5dsztm-9zfUrqWlEleZLORlLgcxdqeVg2FhYTQY46gT9cLX7Zc6ICoT2vZURYL-M5_b-rR26ddm7FMLFC' },
    { id: 'w-7', name: 'Sunlight Detergent', price: 15500, category: 'Cleaning', context: 'WHOLESALE', unit: '10kg Sack', stock: 150, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR3BqvgI_JtzoDPnzd2B4va9ct4322umJBsiC4ir_l-N3MBrGNm4n-c9mdgd4GV-At7oFks2rep4HKnSd1YNmkpQWJxm3JUk-2XngzcLnstZd9nWgJldDEnqie660w8R5k5JtBm4a6XJMLa8HapRDf1S2RAw6CrZPTaGdyPkrcd8ESOfAiZOilFrNsR-RgK99FauncBpDUmq7rmrGhove30EiaBy9Rf9z2162_Y_5D34T-oRqR404T-IX9RC-m2fPDnhc62KzIHA66' },
    { id: 'w-8', name: 'Coca-Cola Original', price: 4200, category: 'Beverages', context: 'WHOLESALE', unit: '12 x 1L Pack', stock: 200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6yO9YpD7WzXoPz8rWqU2tV9sQ4xR3yM6nO1lA2bC5dE8fG9hI0jK3mL4nP5oQ6rS7tU8vW9xY0zB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2r' },
    { id: 'w-9', name: 'Golden Penny Semovita', price: 9500, category: 'Grains', context: 'WHOLESALE', unit: '10kg Bag', stock: 80, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBxY9cZ1wA2vB3dE4fG5hI6jK7lM8nP9oQ0rS1tU2vW3xY4zB5c' },
    { id: 'w-10', name: 'Carlo Rossi Red Wine', price: 36000, category: 'Beverages', context: 'WHOLESALE', unit: 'Case of 6', stock: 40, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKt7x1qSNsf7VBZVU-XwN39yAYPA5N75TN2-DtOqOYWCxHx0YzovDauuB8JNRWHwpaKc6UsFkAO8Ez_-MBtN9A9MYe-xp79HdoR-jsux7kAuM1xvLIhT_QZaRJPIs7bbJ-W1V11FXas6dMfPj-kxJDY91JwcOO1_YOntFk7onYKv7Wuwir4AKQtbViuoFCedOizLJC--c5NjxeFKv0RoYZQjXdtk6Fs0LgXK2ShCakTCokYwYzwgtrEfkAnrT-Nuyz01TZhI9-lb6R' },
    { id: 'w-11', name: 'Nestle Bottled Water', price: 1200, category: 'Beverages', context: 'WHOLESALE', unit: '12 x 75cl Case', stock: 1000, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1wZpJFJka3FlypGKUsr0BoyDreoSK1yO0HNItuIXwL45jTS5sMWtJDX0xA05wzVKWEcdMe1SOjWb69PBje0fItEcORGH36VHdOesDWcLXtQBkh8La1nnsZScU27G8OcoTKxo7cd4zC8zzD1znfAXSzlVSQq57xNupl-rWunYkpDK1Y_BCzhN_AD2ML0NXdxUY6-hQUG9tyuCXWZ-Q-S4_Aqh-WhDlYgbDQE7EKXAWmmlxMZcK9DNUkIa8eQkEjH15ny70tqJDUwlo' },
    { id: 'w-12', name: 'Peak Powdered Milk', price: 54000, category: 'Dairy', context: 'WHOLESALE', unit: '12 x 400g Refill Case', stock: 60, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbd0wFC57LwPQUOyUC38exd7j2pV9Jh0K_hLRw0yjkF5iFVsqmQz3jfBgM6_G9ZX2p6VAPIkOf-aOOXEFojpbgtgemiFiYnfzuWMcxe_MW3GkeN7U1_fuwGfrPp_Mffjm4aVHsil05PJE3o7PJg3_DDy0iQgexr7xzJPYp9S1no5rXRRZyo7BpWPEieVoHvLFrn_Nv8NF65PZWTEUQQwc7WIMR7bDeekusfqamGTmuycHFki2QQcAFevyUSfJUH8gln0PTyPBEB5MX' },
    { id: 'w-13', name: 'Knorr Chicken Cubes', price: 9000, category: 'Condiments', context: 'WHOLESALE', unit: '50 Packs Carton', stock: 200, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnmhadoCVKHfYOfzPDp4J-6pCxjbZzTpGP75Vr_EksxMx5s-niabV7JQ0xEJAGhT6JS3uI5vilRbeFyK2EZzgvV2tCNaDGuY3AUvcd-1qmWdnf_UTBwWXlavafUaKatDnX2FVp60K_6UujA-_6AQVuHME2tSYnvfAGbqOh-74zdGtg6ddQmlBGHxLRQwJBGzO3cc0woi5qtRnAAH41xL31J5tx7UGTq9Adz2r-cl9V4BEIC4ZxsSZ_kPlJiju2gk4htfJnj3ppuzqM' },
    { id: 'w-14', name: 'Big Bull Rice', price: 44000, category: 'Grains', context: 'WHOLESALE', unit: '20kg Bag', stock: 300, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6UWHxlzXZ1fZ6YGBbT37L0xAuHSyG5BhZ9bwse3VDii426hr7S1c-HfyAe8e3yQ8NcDRTOXKRjo2Ufc3wc29_OSrYxO_MyJnBz_QS_HpxZUhr0N7aVtOYPSu8UR1hbVvS8J0cHecXDYljfh3DPNefV4iskMSlS7IXlsjbtCi2JYOlqt8iy0T-eLiVLfpWjmZHuJEmLkOm-Yw_J_jXwPk_uDmK3oH1SNX-lFqxu5AS_FVr7ddDLdjxkcHQ-qQDtQQknzrvfpaDEBi0' },
    { id: 'w-15', name: 'Dangote Salt', price: 6500, category: 'Pantry', context: 'WHOLESALE', unit: '20kg Sack', stock: 100, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXHoapzHeb1VAPEs6czxDQyvWwduFy91nT-Drp_8nE1SyGtHCVjAT37yLzElXag6I_iuWbvvn3rXicnFwJbZK6_saydnAr5JMl2ZAbbt-npsIKEgbZlIicshunGdLBZqV_jllJM0yZfx0ST0DcjCV9quCoxmCTuc9rl_YY47qHdhClvIqTI4MUOXqUj_YG6igsq_Y8vTNSDMW6Ns8hfeTHBVkeso2GuVsE71yVuNPrxLnmZquU1I4cQrwmOV35Ph63vhNswuB0XPz5' },
    { id: 'w-16', name: 'Heineken Beer', price: 8200, category: 'Beverages', context: 'WHOLESALE', unit: '24 Can Case', stock: 80, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6yO9YpD7WzXoPz8rWqU2tV9sQ4xR3yM6nO1lA2bC5dE8fG9hI0jK3mL4nP5oQ6rS7tU8vW9xY0zB1cD2eF3gH4iJ5kL6mN7oP8qR9sT0uV1wW2xY3zA4bC5dE6fG7hI8jK9lM0nO1pQ2r' }
  ],
  orders: []
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Public API Routes ---
  
  // GET /api/v1/content/:division_slug - Fetches all active content blocks for a division.
  app.get("/api/v1/content/:division_slug", (req, res) => {
    const division = db.divisions.find(d => d.slug === req.params.division_slug);
    if (!division) return res.status(404).json({ error: "Division not found" });
    
    const blocks = db.contentBlocks.filter(b => b.division_id === division.id && b.published_at !== null);
    res.json({ division, blocks });
  });

  // GET /api/v1/menu/:division_slug - Fetches structured menu/product data.
  app.get("/api/v1/menu/:division_slug", (req, res) => {
    const division = db.divisions.find(d => d.slug === req.params.division_slug);
    if (!division) return res.status(404).json({ error: "Division not found" });
    
    const menuBlocks = db.contentBlocks.filter(b => b.division_id === division.id && b.block_type === "menu" && b.published_at !== null);
    res.json({ menu: menuBlocks });
  });

  // GET /api/v1/announcements - Fetches global cross-division announcements.
  app.get("/api/v1/announcements", (req, res) => {
    res.json({ announcements: db.announcements.filter(a => a.active) });
  });

  // --- Admin API Protected Routes ---
  
  // GET /api/admin/divisions - Get all divisions
  app.get("/api/admin/divisions", (req, res) => {
    res.json({ divisions: db.divisions });
  });

  // GET /api/admin/content - Get all content blocks (including drafts)
  app.get("/api/admin/content", (req, res) => {
    res.json({ contentBlocks: db.contentBlocks });
  });

  // POST /api/admin/content - Create new content block.
  app.post("/api/admin/content", (req, res) => {
    const { division_id, block_type, content_payload, order_index, user_role } = req.body;
    
    const newBlock = {
      id: `cb_${Date.now()}`,
      division_id,
      block_type,
      content_payload,
      order_index: order_index || 0,
      published_at: null // Draft by default
    };
    
    db.contentBlocks.push(newBlock);
    
    // Create a weekly update entry
    const update = {
      id: `wu_${Date.now()}`,
      division_id,
      title: `New ${block_type} block added`,
      status: (user_role === 'admin_boss' || user_role === 'admin_head') ? "published" : "pending_review",
      scheduled_for: null,
      changeset: { action: "create", block_id: newBlock.id },
      created_by: req.body.user_id || "anonymous",
      created_at: new Date().toISOString()
    };
    
    if (update.status === "published") {
      newBlock.published_at = new Date().toISOString();
    }
    
    db.weeklyUpdates.push(update);
    
    db.auditLog.push({
      id: `log_${Date.now()}`,
      user: req.body.user_id || "anonymous",
      action: `Created ${block_type} block (${update.status})`,
      timestamp: new Date().toISOString()
    });

    res.status(201).json(newBlock);
  });

  // PUT /api/admin/content/:id - Update existing block.
  app.put("/api/admin/content/:id", (req, res) => {
    const { id } = req.params;
    const { content_payload, order_index, user_role } = req.body;
    
    const blockIndex = db.contentBlocks.findIndex(b => b.id === id);
    if (blockIndex === -1) return res.status(404).json({ error: "Block not found" });
    
    const oldPayload = db.contentBlocks[blockIndex].content_payload;
    
    // If boss or head, update live immediately. If others, create a pending update.
    if (user_role === 'admin_boss' || user_role === 'admin_head') {
      db.contentBlocks[blockIndex] = {
        ...db.contentBlocks[blockIndex],
        content_payload: content_payload || db.contentBlocks[blockIndex].content_payload,
        order_index: order_index !== undefined ? order_index : db.contentBlocks[blockIndex].order_index,
        published_at: new Date().toISOString()
      };
    } else {
      // Create a weekly update draft
      db.weeklyUpdates.push({
        id: `wu_${Date.now()}`,
        division_id: db.contentBlocks[blockIndex].division_id,
        title: `Update request for block ${id}`,
        status: "pending_review",
        scheduled_for: null,
        changeset: { action: "update", block_id: id, payload: content_payload },
        created_by: req.body.user_id || "anonymous",
        created_at: new Date().toISOString()
      });
    }

    db.auditLog.push({
      id: `log_${Date.now()}`,
      user: req.body.user_id || "anonymous",
      action: `Updated block ${id} (Role: ${user_role})`,
      timestamp: new Date().toISOString()
    });

    res.json(db.contentBlocks[blockIndex]);
  });

  // GET /api/admin/updates - Get all weekly updates (drafts, pending, published)
  app.get("/api/admin/updates", (req, res) => {
    res.json({ updates: db.weeklyUpdates });
  });

  // DELETE /api/admin/updates/:id - Delete a weekly update
  app.delete("/api/admin/updates/:id", (req, res) => {
    const { id } = req.params;
    const updateIndex = db.weeklyUpdates.findIndex(u => u.id === id);
    if (updateIndex === -1) return res.status(404).json({ error: "Update not found" });
    
    db.weeklyUpdates.splice(updateIndex, 1);
    res.json({ success: true });
  });

  // POST /api/admin/publish - Triggers cache invalidation and moves drafts to live.
  app.post("/api/admin/publish", (req, res) => {
    const { update_ids, user_role } = req.body; // Array of WeeklyUpdate IDs to publish
    
    if (user_role !== 'admin_boss' && user_role !== 'admin_head') {
      return res.status(403).json({ error: "Unauthorized to publish" });
    }

    if (!update_ids || !Array.isArray(update_ids)) {
      return res.status(400).json({ error: "update_ids array is required" });
    }

    const publishedBlocks: string[] = [];

    update_ids.forEach(uid => {
      const update = db.weeklyUpdates.find(u => u.id === uid);
      if (update && update.status !== "published") {
        update.status = "published";
        
        // Find the associated block and mark it published
        const blockId = update.changeset.block_id;
        const block = db.contentBlocks.find(b => b.id === blockId);
        if (block) {
          if (update.changeset.action === "update" && update.changeset.payload) {
            block.content_payload = update.changeset.payload;
          }
          block.published_at = new Date().toISOString();
          publishedBlocks.push(block.id);
        }
      }
    });

    db.auditLog.push({
      id: `log_${Date.now()}`,
      user: req.body.user_id || "anonymous",
      action: `Published ${publishedBlocks.length} updates`,
      timestamp: new Date().toISOString()
    });

    // In a real app, we would flush Redis cache here
    res.json({ message: "Updates published successfully", publishedBlocks });
  });

  // GET /api/admin/audit
  app.get("/api/admin/audit", (req, res) => {
    res.json({ auditLog: db.auditLog });
  });

  // --- Product Management Routes ---

  // GET /api/admin/products
  app.get("/api/admin/products", (req, res) => {
    res.json({ products: db.products });
  });

  // POST /api/admin/products
  app.post("/api/admin/products", (req, res) => {
    const newProduct = {
      id: `p${Date.now()}`,
      ...req.body
    };
    db.products.push(newProduct);
    res.status(201).json(newProduct);
  });

  // PUT /api/admin/products/:id
  app.put("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    
    db.products[index] = { ...db.products[index], ...req.body };
    res.json(db.products[index]);
  });

  // DELETE /api/admin/products/:id
  app.delete("/api/admin/products/:id", (req, res) => {
    const { id } = req.params;
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });
    
    db.products.splice(index, 1);
    res.json({ message: "Product deleted" });
  });

  // --- Orders API ---
  app.get("/api/orders", (req, res) => {
    res.json({ orders: db.orders || [] });
  });

  app.post("/api/orders", (req, res) => {
    const newOrder = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: 'Pending',
      ...req.body
    };
    if (!db.orders) db.orders = [];
    db.orders.push(newOrder);
    res.status(201).json(newOrder);
  });

  // Chat API route for local development
  app.all("/api/chat", (req, res) => {
    return chatHandler(req, res);
  });
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
