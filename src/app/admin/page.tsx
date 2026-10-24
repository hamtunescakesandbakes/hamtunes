"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  LayoutDashboard,
  Cake,
  Image as ImageIcon,
  MessageSquare,
  RefreshCw,
  Settings as SettingsIcon,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Download,
  Search,
  Check,
  X,
  Sparkles,
  Phone,
  MessageCircle,
  ExternalLink,
  Tag,
  Calculator,
  Percent,
  Plus,
  Trash2,
  CheckSquare,
  DollarSign,
  Info,
} from "lucide-react";
import { Product, Asset, Enquiry, SyncSettings, PricingMethod, QuantityTier } from "@/lib/types";
import { BRAND, CAKE_CATEGORIES, BAKES_CATEGORIES } from "@/lib/constants";
import { formatNaira, calculateRecommendedPrice, CATEGORY_PRICING_GUIDELINES } from "@/lib/pricing";

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authError, setAuthError] = useState("");

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<
    "overview" | "enquiries" | "images" | "products" | "pricing" | "sync" | "settings"
  >("overview");

  // Data states
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [syncStats, setSyncStats] = useState<any>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [autoPublish, setAutoPublish] = useState(true);

  // Filters & selections
  const [enquirySearch, setEnquirySearch] = useState("");
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState("all");
  const [imageDivisionFilter, setImageDivisionFilter] = useState("all");
  const [imageStatusFilter, setImageStatusFilter] = useState("all");

  // Pricing Filters & Editing Modal
  const [pricingFilterCategory, setPricingFilterCategory] = useState("all");
  const [pricingFilterApproval, setPricingFilterApproval] = useState("all");
  const [pricingSearch, setPricingSearch] = useState("");
  const [editingPricingProduct, setEditingPricingProduct] = useState<Product | null>(null);

  // Pricing Form State (in modal)
  const [editMethod, setEditMethod] = useState<PricingMethod>("starting_at");
  const [editBasePrice, setEditBasePrice] = useState<number | "">("");
  const [editMaxPrice, setEditMaxPrice] = useState<number | "">("");
  const [editUnitLabel, setEditUnitLabel] = useState<string>("piece");
  const [editTiers, setEditTiers] = useState<QuantityTier[]>([]);
  const [editPriceNotes, setEditPriceNotes] = useState<string>("");
  const [editIsApproved, setEditIsApproved] = useState<boolean>(false);
  // Private Cost & Margin inputs
  const [editUnitCost, setEditUnitCost] = useState<number | "">("");
  const [editTargetMargin, setEditTargetMargin] = useState<number>(0.50);
  const [editCostNotes, setEditCostNotes] = useState<string>("");
  const [savingPrice, setSavingPrice] = useState(false);

  // Editing modals/drawers
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Check existing session
  useEffect(() => {
    const savedPin = sessionStorage.getItem("hamtunes_admin_auth");
    if (savedPin === "hamtunes2026") {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === "hamtunes2026" || pinInput === "admin123") {
      sessionStorage.setItem("hamtunes_admin_auth", "hamtunes2026");
      setIsAuthenticated(true);
      setAuthError("");
      fetchDashboardData();
    } else {
      setAuthError("Incorrect Admin PIN. Please try again.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("hamtunes_admin_auth");
    setIsAuthenticated(false);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [enqRes, imgRes, prodRes, syncRes] = await Promise.all([
        fetch("/api/enquiries").then((r) => r.json()),
        fetch("/api/images").then((r) => r.json()),
        fetch("/api/products?admin=true").then((r) => r.json()), // Fetch unmasked admin products
        fetch("/api/sync").then((r) => r.json()),
      ]);

      if (enqRes.success) setEnquiries(enqRes.enquiries);
      if (imgRes.success) setAssets(imgRes.assets);
      if (prodRes.success) setProducts(prodRes.products);
      if (syncRes.success) {
        setSyncStats(syncRes.stats);
        setRecentLogs(syncRes.recent_logs);
        setAutoPublish(syncRes.settings?.auto_publish_confident ?? true);
      }
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
        alert(
          `Sync Finished! +${data.result.files_added} files added, ${data.result.duplicates_skipped} duplicates skipped.`
        );
      } else {
        alert("Sync error: " + data.error);
      }
    } catch (err: any) {
      alert("Failed to run sync: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleAutoPublish = async () => {
    const newVal = !autoPublish;
    setAutoPublish(newVal);
    try {
      await fetch("/api/sync/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auto_publish_confident: newVal }),
      });
    } catch (err) {
      console.error("Error saving auto-publish setting:", err);
    }
  };

  const handleUpdateAssetStatus = async (
    assetId: string,
    status: Asset["status"],
    isFeatured?: boolean
  ) => {
    try {
      const res = await fetch(`/api/images/${assetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, is_featured: isFeatured }),
      });
      const data = await res.json();
      if (data.success) {
        setAssets((prev) =>
          prev.map((a) => (a.id === assetId ? { ...a, status, is_featured: isFeatured ?? a.is_featured } : a))
        );
      }
    } catch (err) {
      alert("Error updating asset status");
    }
  };

  const handleUpdateEnquiryStatus = async (enquiryId: string, status: Enquiry["status"]) => {
    try {
      const res = await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setEnquiries((prev) =>
          prev.map((e) => (e.id === enquiryId ? { ...e, status } : e))
        );
        if (selectedEnquiry && selectedEnquiry.id === enquiryId) {
          setSelectedEnquiry({ ...selectedEnquiry, status });
        }
      }
    } catch (err) {
      alert("Error updating enquiry status");
    }
  };

  const handleSaveEnquiryNotes = async (enquiryId: string, notes: string) => {
    try {
      await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internal_notes: notes }),
      });
      setEnquiries((prev) =>
        prev.map((e) => (e.id === enquiryId ? { ...e, internal_notes: notes } : e))
      );
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= PRICING MANAGEMENT HANDLERS ================= */
  const openPricingModal = (product: Product) => {
    setEditingPricingProduct(product);
    setEditMethod(product.pricing_method || "starting_at");
    setEditBasePrice(product.base_price !== undefined ? product.base_price : "");
    setEditMaxPrice(product.max_price !== undefined ? product.max_price : "");
    setEditUnitLabel(product.unit_label || (product.division === "cakes" ? "cake" : "piece"));
    setEditTiers(product.quantity_tiers ? [...product.quantity_tiers] : []);
    setEditPriceNotes(product.price_notes || "");
    setEditIsApproved(Boolean(product.is_price_approved));

    // Private Costs
    setEditUnitCost(product.private_costs?.unit_cost !== undefined ? product.private_costs.unit_cost : "");
    setEditTargetMargin(product.private_costs?.target_gross_margin !== undefined ? product.private_costs.target_gross_margin : 0.50);
    setEditCostNotes(product.private_costs?.cost_notes || "");
  };

  const handleSaveProductPricing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPricingProduct) return;
    setSavingPrice(true);

    try {
      const payload: Partial<Product> = {
        pricing_method: editMethod,
        currency: "NGN",
        base_price: editBasePrice !== "" ? Number(editBasePrice) : undefined,
        max_price: editMaxPrice !== "" ? Number(editMaxPrice) : undefined,
        unit_label: editUnitLabel,
        quantity_tiers: editTiers,
        price_notes: editPriceNotes,
        is_price_approved: editIsApproved,
        private_costs: {
          unit_cost: editUnitCost !== "" ? Number(editUnitCost) : undefined,
          target_gross_margin: Number(editTargetMargin),
          cost_notes: editCostNotes,
        },
      };

      const res = await fetch(`/api/products/${editingPricingProduct.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingPricingProduct.id ? data.product : p))
        );
        setEditingPricingProduct(null);
      } else {
        alert("Failed to save pricing: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      alert("Error saving pricing: " + err.message);
    } finally {
      setSavingPrice(false);
    }
  };

  const handleQuickApprovePrice = async (product: Product) => {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_price_approved: true }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? data.product : p))
        );
      }
    } catch (err) {
      alert("Failed to approve price");
    }
  };

  const handleBatchApproveAllPending = async () => {
    const unapproved = products.filter((p) => !p.is_price_approved);
    if (!confirm(`Are you sure you want to approve all ${unapproved.length} pending prices?`)) return;

    for (const p of unapproved) {
      await handleQuickApprovePrice(p);
    }
    alert("All pending prices have been approved and published to the live catalogue!");
  };

  const handleAddTier = () => {
    setEditTiers([...editTiers, { quantity: 6, label: "Box of 6", price: 7000 }]);
  };

  const handleRemoveTier = (idx: number) => {
    setEditTiers(editTiers.filter((_, i) => i !== idx));
  };

  const handleUpdateTier = (idx: number, field: keyof QuantityTier, val: any) => {
    const updated = [...editTiers];
    (updated[idx] as any)[field] = val;
    setEditTiers(updated);
  };

  // Live Calculator computation
  const liveCost = editUnitCost !== "" ? Number(editUnitCost) : 0;
  const liveMargin = Number(editTargetMargin);
  const liveCalc = calculateRecommendedPrice(liveCost, liveMargin);

  const exportEnquiriesCSV = () => {
    const headers = [
      "ID",
      "Created At",
      "Customer Name",
      "Phone Number",
      "Email",
      "Type",
      "Event Date",
      "Size / Quantity",
      "Status",
      "Notes",
    ];
    const rows = enquiries.map((e) => [
      e.id,
      e.created_at,
      `"${e.customer_name}"`,
      `"${e.phone_number}"`,
      e.email || "",
      e.enquiry_type,
      e.event_date || "",
      `"${e.cake_size_or_quantity || ""}"`,
      e.status,
      `"${(e.internal_notes || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `hamtunes_enquiries_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered lists
  const filteredEnquiries = enquiries.filter((e) => {
    const matchesStatus =
      enquiryStatusFilter === "all" || e.status === enquiryStatusFilter;
    const matchesSearch =
      !enquirySearch ||
      e.customer_name.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      e.phone_number.includes(enquirySearch);
    return matchesStatus && matchesSearch;
  });

  const filteredAssets = assets.filter((a) => {
    const matchesDivision =
      imageDivisionFilter === "all" || a.division === imageDivisionFilter;
    const matchesStatus =
      imageStatusFilter === "all" || a.status === imageStatusFilter;
    return matchesDivision && matchesStatus;
  });

  const filteredPricingProducts = products.filter((p) => {
    const matchesCategory =
      pricingFilterCategory === "all" || p.category === pricingFilterCategory;
    const matchesApproval =
      pricingFilterApproval === "all"
        ? true
        : pricingFilterApproval === "approved"
        ? p.is_price_approved
        : pricingFilterApproval === "pending_approval"
        ? !p.is_price_approved
        : p.pricing_method === "quote_only";
    const matchesSearch =
      !pricingSearch ||
      p.name.toLowerCase().includes(pricingSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(pricingSearch.toLowerCase());
    return matchesCategory && matchesApproval && matchesSearch;
  });

  const needsReviewAssets = assets.filter((a) => a.status === "needs_review");
  const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;
  const pendingPricesCount = products.filter((p) => !p.is_price_approved).length;

  // 1. PIN LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-[#FFF9F5]">
        <div className="max-w-md w-full bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E8DDD7] shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF0F5] text-[#F50057] flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-serif font-black text-2xl text-[#351207]">
              Hamtunes Management Portal
            </h1>
            <p className="text-xs text-[#6F625C]">
              Enter the administrator access passcode to manage pricing, enquiries, photos, and website settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 text-center">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#351207] mb-1">
                Admin Passcode
              </label>
              <input
                type="password"
                placeholder="Enter passcode..."
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                className="w-full px-4 py-3 rounded-xl border border-[#E8DDD7] text-sm text-center tracking-widest focus:outline-none focus:border-[#F50057]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#F50057] hover:bg-[#D5004C] text-white font-semibold py-3.5 rounded-xl shadow-md transition-all text-sm"
            >
              Access Dashboard
            </button>
          </form>

          <p className="text-[11px] text-[#6F625C] text-center">
            Official Hamtunes Administration System • {BRAND.experienceYears} Years of Baking
          </p>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-[#FFF9F5] pb-24">
      {/* Top Admin Header */}
      <div className="bg-[#351207] text-[#FFF9F5] border-b border-[#5A2718]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-[#F50057] bg-white">
              <Image src="/images/logo.png" alt="Logo" fill className="object-cover" />
            </div>
            <div>
              <div className="font-serif font-black text-lg text-white">
                Hamtunes Admin Portal
              </div>
              <div className="text-[11px] text-[#F7EFE8]/70">
                {BRAND.experienceYears} Operating Business Dashboard
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSync}
              disabled={syncing}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-semibold shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
              <span>{syncing ? "Scanning Folders..." : "Sync Photos Now"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl border border-[#E8DDD7]/20 text-xs font-semibold hover:bg-white/10 text-[#F7EFE8] transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto border-t border-[#5A2718] pt-2 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              {
                id: "pricing",
                label: `Pricing & Margins ${pendingPricesCount > 0 ? `(${pendingPricesCount} Review)` : ""}`,
                icon: Tag,
              },
              {
                id: "enquiries",
                label: `Enquiries ${newEnquiriesCount > 0 ? `(${newEnquiriesCount})` : ""}`,
                icon: MessageSquare,
              },
              {
                id: "images",
                label: `Photo Catalogue ${needsReviewAssets.length > 0 ? `(${needsReviewAssets.length} Review)` : ""}`,
                icon: ImageIcon,
              },
              { id: "products", label: "Products", icon: Cake },
              { id: "sync", label: "Sync & Watcher Settings", icon: RefreshCw },
              { id: "settings", label: "Contact & Website", icon: SettingsIcon },
            ].map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-t-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    active
                      ? "bg-[#FFF9F5] text-[#351207] shadow-sm font-bold"
                      : "text-[#F7EFE8]/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#F50057]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {loading ? (
          <div className="text-center py-20 space-y-3">
            <div className="w-8 h-8 border-3 border-[#F50057] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#6F625C]">Loading Hamtunes records...</p>
          </div>
        ) : (
          <>
            {/* ================= 1. OVERVIEW TAB ================= */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DDD7] space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#6F625C]">
                      Total Enquiries
                    </span>
                    <div className="font-serif font-black text-2xl text-[#351207]">
                      {enquiries.length}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#F50057]/40 bg-[#FFF0F5]/30 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#F50057]">
                      New Enquiries
                    </span>
                    <div className="font-serif font-black text-2xl text-[#F50057]">
                      {newEnquiriesCount}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-amber-300 bg-amber-50/40 space-y-1">
                    <span className="text-[11px] font-bold uppercase text-amber-800">
                      Pending Price Approval
                    </span>
                    <div className="font-serif font-black text-2xl text-amber-700">
                      {pendingPricesCount}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DDD7] space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#6F625C]">
                      Published Products
                    </span>
                    <div className="font-serif font-black text-2xl text-[#351207]">
                      {products.filter((p) => p.is_published).length}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DDD7] space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#6F625C]">
                      Indexed Photos
                    </span>
                    <div className="font-serif font-black text-2xl text-[#351207]">
                      {assets.length}
                    </div>
                  </div>

                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DDD7] space-y-1">
                    <span className="text-[11px] font-bold uppercase text-[#6F625C]">
                      Sync Engine
                    </span>
                    <div className="text-xs font-bold text-green-700 flex items-center gap-1 mt-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Operational</span>
                    </div>
                  </div>
                </div>

                {/* Pending Price Approval Notice Callout */}
                {pendingPricesCount > 0 && (
                  <div className="bg-[#FFFFFF] rounded-2xl border-2 border-amber-300 p-6 space-y-3 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Tag className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-serif font-bold text-lg text-[#351207]">
                            {pendingPricesCount} Product Prices Awaiting Owner Review
                          </h3>
                          <p className="text-xs text-[#6F625C] leading-relaxed">
                            Following the {BRAND.experienceYears} brand guideline, newly synced items have preliminary market benchmarks that are marked as <strong>Pending Owner Approval</strong>. While pending, the public website displays &ldquo;Custom Quote&rdquo; or &ldquo;Price on Consultation&rdquo; so customers never see unapproved prices.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setActiveTab("pricing")}
                          className="px-4 py-2 rounded-xl bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-bold shadow-sm"
                        >
                          Review & Set Prices
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Needs Review Queue for Photos */}
                {needsReviewAssets.length > 0 && (
                  <div className="bg-[#FFFFFF] rounded-2xl border border-amber-300 p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-amber-600" />
                        <h2 className="font-serif font-bold text-lg text-[#351207]">
                          Images Awaiting Review ({needsReviewAssets.length})
                        </h2>
                      </div>
                      <button
                        onClick={() => setActiveTab("images")}
                        className="text-xs font-semibold text-[#F50057] hover:underline"
                      >
                        Open Full Review Queue
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {needsReviewAssets.slice(0, 3).map((asset) => (
                        <div
                          key={asset.id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-[#E8DDD7] bg-[#FFF9F5]"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-white border">
                            <Image
                              src={asset.thumbnail_url}
                              alt={asset.caption}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="text-xs font-bold text-[#351207] truncate">
                              {asset.caption}
                            </div>
                            <div className="text-[11px] text-[#6F625C]">
                              Suggested: {asset.category}
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                              <button
                                onClick={() => handleUpdateAssetStatus(asset.id, "published")}
                                className="px-2 py-1 rounded bg-[#F50057] text-white text-[10px] font-bold hover:bg-[#D5004C]"
                              >
                                Approve & Publish
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Customer Enquiries Preview */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif font-bold text-lg text-[#351207]">
                      Recent Customer Enquiries
                    </h2>
                    <button
                      onClick={() => setActiveTab("enquiries")}
                      className="text-xs font-semibold text-[#F50057] hover:underline"
                    >
                      View All ({enquiries.length})
                    </button>
                  </div>

                  <div className="divide-y divide-[#E8DDD7]/60">
                    {enquiries.slice(0, 5).map((enq) => (
                      <div
                        key={enq.id}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FFF9F5] px-2 rounded-lg transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedEnquiry(enq);
                          setActiveTab("enquiries");
                        }}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-[#351207]">
                              {enq.customer_name}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                enq.status === "new"
                                  ? "bg-[#FFF0F5] text-[#F50057]"
                                  : enq.status === "contacted"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-green-50 text-green-700"
                              }`}
                            >
                              {enq.status}
                            </span>
                          </div>
                          <div className="text-xs text-[#6F625C] flex items-center gap-3">
                            <span>Phone: {enq.phone_number}</span>
                            {enq.event_date && <span>Date: {enq.event_date}</span>}
                            <span className="capitalize">Type: {enq.enquiry_type.replace(/_/g, " ")}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`https://wa.me/${enq.phone_number.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs font-semibold"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2. PRICING & MARGIN MANAGEMENT TAB ================= */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8DDD7]">
                  <div className="space-y-1">
                    <h2 className="font-serif font-black text-xl text-[#351207] flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#F50057]" />
                      <span>Product Pricing & Gross Margin System</span>
                    </h2>
                    <p className="text-xs text-[#6F625C]">
                      Manage selling prices, define box tiers, calculate profit margins using{" "}
                      <code className="text-[#351207] font-semibold bg-[#F7EFE8] px-1.5 py-0.5 rounded">
                        Selling Price = Cost ÷ (1 − Target Margin)
                      </code>
                      , and approve prices for live display.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleBatchApproveAllPending}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-700 hover:bg-green-800 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <CheckSquare className="w-4 h-4" />
                      <span>Approve All Pending ({pendingPricesCount})</span>
                    </button>
                  </div>
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DDD7]">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F625C]" />
                      <input
                        type="text"
                        placeholder="Search product pricing..."
                        value={pricingSearch}
                        onChange={(e) => setPricingSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DDD7] text-xs focus:outline-none focus:border-[#F50057]"
                      />
                    </div>

                    <select
                      value={pricingFilterApproval}
                      onChange={(e) => setPricingFilterApproval(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#E8DDD7] text-xs bg-white"
                    >
                      <option value="all">All Approval States</option>
                      <option value="pending_approval">Pending Owner Approval ({pendingPricesCount})</option>
                      <option value="approved">Approved & Published ({products.length - pendingPricesCount})</option>
                      <option value="quote_only">Custom Quote Only</option>
                    </select>

                    <select
                      value={pricingFilterCategory}
                      onChange={(e) => setPricingFilterCategory(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#E8DDD7] text-xs bg-white"
                    >
                      <option value="all">All Categories</option>
                      {CAKE_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                        <option key={c.id} value={c.id}>
                          Cake: {c.label}
                        </option>
                      ))}
                      {BAKES_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                        <option key={c.id} value={c.id}>
                          Bake: {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="text-xs text-[#6F625C]">
                    Showing <span className="font-bold text-[#351207]">{filteredPricingProducts.length}</span> products
                  </div>
                </div>

                {/* Pricing Table */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F7EFE8] text-[#351207] uppercase text-[10px] font-bold tracking-wider border-b border-[#E8DDD7]">
                        <tr>
                          <th className="py-3 px-4">Product</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Pricing Method</th>
                          <th className="py-3 px-4">Selling Price (₦)</th>
                          <th className="py-3 px-4 text-neutral-500">
                            Unit Cost (Private)
                          </th>
                          <th className="py-3 px-4 text-neutral-500">
                            Target Margin
                          </th>
                          <th className="py-3 px-4">Approval Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DDD7]">
                        {filteredPricingProducts.map((prod) => {
                          const unitCost = prod.private_costs?.unit_cost;
                          const targetMargin = prod.private_costs?.target_gross_margin;
                          return (
                            <tr
                              key={prod.id}
                              className="hover:bg-[#FFF9F5] transition-colors cursor-pointer"
                              onClick={() => openPricingModal(prod)}
                            >
                              <td className="py-3 px-4 flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#F7EFE8] border border-[#E8DDD7]">
                                  <Image
                                    src={prod.primary_image_url}
                                    alt={prod.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div>
                                  <div className="font-bold text-[#351207]">{prod.name}</div>
                                  <div className="text-[10px] text-[#6F625C]">{prod.division}</div>
                                </div>
                              </td>

                              <td className="py-3 px-4 capitalize text-[#6F625C]">
                                {prod.category.replace(/_/g, " ")}
                              </td>

                              <td className="py-3 px-4">
                                <span className="px-2 py-0.5 rounded-md bg-[#F7EFE8] text-[#351207] font-mono text-[10px] capitalize">
                                  {prod.pricing_method.replace(/_/g, " ")}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-bold text-[#351207]">
                                {prod.price_display}
                              </td>

                              {/* Confidential Private Cost Columns */}
                              <td className="py-3 px-4 font-mono text-neutral-600">
                                {unitCost ? formatNaira(unitCost) : "—"}
                              </td>

                              <td className="py-3 px-4 font-mono text-neutral-600">
                                {targetMargin ? `${Math.round(targetMargin * 100)}%` : "—"}
                              </td>

                              {/* Approval Status */}
                              <td className="py-3 px-4">
                                {prod.is_price_approved ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-800">
                                    <Check className="w-3 h-3" />
                                    <span>Approved & Live</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                    <Clock className="w-3 h-3" />
                                    <span>Pending Owner Review</span>
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                                {!prod.is_price_approved ? (
                                  <button
                                    onClick={() => handleQuickApprovePrice(prod)}
                                    className="px-2.5 py-1 rounded-lg bg-green-700 hover:bg-green-800 text-white font-semibold text-[11px] shadow-xs"
                                    title="Approve proposed price for live display"
                                  >
                                    Approve
                                  </button>
                                ) : (
                                  <span className="text-[10px] text-green-700 font-semibold">Active</span>
                                )}

                                <button
                                  onClick={() => openPricingModal(prod)}
                                  className="px-2.5 py-1 rounded-lg border border-[#E8DDD7] hover:bg-[#F7EFE8] text-[#351207] font-semibold text-[11px]"
                                >
                                  Edit Pricing
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Edit Pricing Modal */}
                {editingPricingProduct && (
                  <div
                    className="fixed inset-0 z-50 bg-[#351207]/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setEditingPricingProduct(null)}
                  >
                    <div
                      className="bg-[#FFFFFF] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-[#E8DDD7] shadow-2xl my-8 max-h-[92vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-start justify-between border-b border-[#E8DDD7] pb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border bg-[#F7EFE8]">
                            <Image
                              src={editingPricingProduct.primary_image_url}
                              alt={editingPricingProduct.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-serif font-black text-xl text-[#351207]">
                              {editingPricingProduct.name}
                            </h3>
                            <div className="text-xs text-[#6F625C] capitalize">
                              {editingPricingProduct.division.replace(/_/g, " ")} • {editingPricingProduct.category.replace(/_/g, " ")}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setEditingPricingProduct(null)}
                          className="p-1 rounded-full hover:bg-[#F7EFE8] text-[#351207]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProductPricing} className="space-y-6">
                        {/* 1. PRICING METHOD SELECTOR */}
                        <div>
                          <label className="block text-xs font-bold text-[#351207] mb-1.5">
                            Select Pricing Method
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {[
                              { id: "starting_at", label: "Starting Price (From ₦X)" },
                              { id: "per_unit", label: "Per Unit (₦X / piece)" },
                              { id: "quantity_tiers", label: "Quantity Tiers (Boxes/Trays)" },
                              { id: "fixed", label: "Fixed Price (₦X)" },
                              { id: "price_range", label: "Price Range (₦X – ₦Y)" },
                              { id: "quote_only", label: "Custom Quote Only" },
                            ].map((opt) => (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => setEditMethod(opt.id as PricingMethod)}
                                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                                  editMethod === opt.id
                                    ? "border-[#F50057] bg-[#FFF0F5] text-[#F50057]"
                                    : "border-[#E8DDD7] hover:bg-[#F7EFE8] text-[#351207]"
                                }`}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* 2. RELEVANT FIELDS FOR SELECTED METHOD */}
                        {editMethod !== "quote_only" && (
                          <div className="bg-[#FFF9F5] p-4 rounded-2xl border border-[#E8DDD7] space-y-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#F50057] block">
                              Public Price Configuration
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-bold text-[#351207] mb-1">
                                  {editMethod === "starting_at"
                                    ? "Starting Base Price (₦)"
                                    : editMethod === "per_unit"
                                    ? "Unit Price (₦)"
                                    : "Selling Price (₦)"}
                                </label>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F625C]">
                                    ₦
                                  </span>
                                  <input
                                    type="number"
                                    placeholder="e.g. 35000"
                                    value={editBasePrice}
                                    onChange={(e) =>
                                      setEditBasePrice(
                                        e.target.value ? Number(e.target.value) : ""
                                      )
                                    }
                                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8DDD7] text-sm font-bold text-[#351207] bg-white"
                                  />
                                </div>
                              </div>

                              {editMethod === "price_range" && (
                                <div>
                                  <label className="block text-xs font-bold text-[#351207] mb-1">
                                    Maximum Price (₦)
                                  </label>
                                  <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F625C]">
                                      ₦
                                    </span>
                                    <input
                                      type="number"
                                      placeholder="e.g. 75000"
                                      value={editMaxPrice}
                                      onChange={(e) =>
                                        setEditMaxPrice(
                                          e.target.value ? Number(e.target.value) : ""
                                        )
                                      }
                                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-[#E8DDD7] text-sm font-bold text-[#351207] bg-white"
                                    />
                                  </div>
                                </div>
                              )}

                              {editMethod === "per_unit" && (
                                <div>
                                  <label className="block text-xs font-bold text-[#351207] mb-1">
                                    Unit Label
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="e.g., piece, pack, slice, jar"
                                    value={editUnitLabel}
                                    onChange={(e) => setEditUnitLabel(e.target.value)}
                                    className="w-full px-3 py-2 rounded-xl border border-[#E8DDD7] text-sm bg-white"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Quantity Tiers Manager */}
                            {editMethod === "quantity_tiers" && (
                              <div className="space-y-3 pt-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-[#351207]">
                                    Quantity / Box Tiers:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={handleAddTier}
                                    className="text-xs text-[#F50057] font-semibold flex items-center gap-1 hover:underline"
                                  >
                                    <Plus className="w-3.5 h-3.5" /> Add Tier
                                  </button>
                                </div>

                                <div className="space-y-2">
                                  {editTiers.map((tier, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8DDD7]"
                                    >
                                      <input
                                        type="text"
                                        placeholder="Label (e.g. Box of 6)"
                                        value={tier.label}
                                        onChange={(e) =>
                                          handleUpdateTier(idx, "label", e.target.value)
                                        }
                                        className="flex-1 px-2.5 py-1.5 rounded-lg border border-[#E8DDD7] text-xs"
                                      />
                                      <div className="relative w-32">
                                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6F625C]">
                                          ₦
                                        </span>
                                        <input
                                          type="number"
                                          placeholder="Price"
                                          value={tier.price}
                                          onChange={(e) =>
                                            handleUpdateTier(idx, "price", Number(e.target.value))
                                          }
                                          className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-[#E8DDD7] text-xs font-bold"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => handleRemoveTier(idx)}
                                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-xs font-bold text-[#351207] mb-1">
                                Customer Pricing Notes (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g., Starting price for 8-inch single tier. Multi-tier quoted on request."
                                value={editPriceNotes}
                                onChange={(e) => setEditPriceNotes(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-[#E8DDD7] text-xs bg-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* 3. CONFIDENTIAL PRODUCTION COST & MARGIN CALCULATOR */}
                        <div className="bg-[#351207] text-[#FFF9F5] p-5 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calculator className="w-4 h-4 text-[#F50057]" />
                              <h4 className="font-serif font-bold text-sm text-white">
                                Private Production Cost & Margin Calculator
                              </h4>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#5A2718] text-[#F50057]">
                              Strictly Confidential
                            </span>
                          </div>

                          <p className="text-[11px] text-[#F7EFE8]/75 leading-relaxed">
                            Formula:{" "}
                            <code className="text-[#F50057] font-mono font-bold">
                              Selling Price = Unit Cost ÷ (1 − Target Margin)
                            </code>
                            . Enter your real ingredient, packaging, and labor unit cost to calculate the exact recommended price.
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-[#F7EFE8] mb-1">
                                Total Unit Production Cost (₦)
                              </label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/50">
                                  ₦
                                </span>
                                <input
                                  type="number"
                                  placeholder="e.g. 17500"
                                  value={editUnitCost}
                                  onChange={(e) =>
                                    setEditUnitCost(
                                      e.target.value ? Number(e.target.value) : ""
                                    )
                                  }
                                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#220B04] border border-[#5A2718] text-sm font-bold text-white focus:outline-none focus:border-[#F50057]"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-[#F7EFE8] mb-1">
                                Target Gross Margin (%): {Math.round(editTargetMargin * 100)}%
                              </label>
                              <input
                                type="range"
                                min="0.20"
                                max="0.80"
                                step="0.05"
                                value={editTargetMargin}
                                onChange={(e) => setEditTargetMargin(Number(e.target.value))}
                                className="w-full accent-[#F50057] cursor-pointer mt-2"
                              />
                            </div>
                          </div>

                          {/* Live Calculated Metric Box */}
                          {liveCost > 0 && (
                            <div className="p-3.5 rounded-xl bg-[#220B04] border border-[#5A2718] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                              <div>
                                <span className="text-white/70 block">Recommended Price:</span>
                                <span className="font-serif font-black text-base text-[#F50057]">
                                  {formatNaira(liveCalc.recommendedPrice)}
                                </span>
                                <span className="text-[10px] text-white/60 ml-2">
                                  (Profit: {formatNaira(liveCalc.grossProfit)})
                                </span>
                              </div>

                              <button
                                type="button"
                                onClick={() => setEditBasePrice(liveCalc.recommendedPrice)}
                                className="px-3 py-1.5 rounded-lg bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-bold transition-colors"
                              >
                                Apply to Selling Price
                              </button>
                            </div>
                          )}

                          <div>
                            <label className="block text-[11px] font-bold text-[#F7EFE8] mb-1">
                              Private Cost Breakdown Notes (Internal Only)
                            </label>
                            <input
                              type="text"
                              placeholder="e.g., Flour & butter: ₦9,000, Eggs & sugar: ₦4,500, Packaging & box: ₦4,000"
                              value={editCostNotes}
                              onChange={(e) => setEditCostNotes(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-[#220B04] border border-[#5A2718] text-xs text-white"
                            />
                          </div>
                        </div>

                        {/* 4. APPROVAL TOGGLE */}
                        <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#E8DDD7] flex items-center justify-between">
                          <div>
                            <div className="text-xs font-bold text-[#351207]">
                              Approve and Publish Price
                            </div>
                            <div className="text-[11px] text-[#6F625C]">
                              When checked, this price displays publicly on the live website. If unchecked, the item displays &ldquo;Custom Quote&rdquo;.
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={editIsApproved}
                            onChange={(e) => setEditIsApproved(e.target.checked)}
                            className="w-5 h-5 accent-[#F50057] rounded cursor-pointer"
                          />
                        </div>

                        {/* Form Submit Buttons */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setEditingPricingProduct(null)}
                            className="px-4 py-2.5 rounded-xl border border-[#E8DDD7] text-xs font-semibold text-[#351207] hover:bg-[#F7EFE8]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={savingPrice}
                            className="px-6 py-2.5 rounded-xl bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                          >
                            {savingPrice ? (
                              <span>Saving...</span>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                <span>Save & Update Pricing</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= 3. ENQUIRIES TAB ================= */}
            {activeTab === "enquiries" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DDD7]">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6F625C]" />
                      <input
                        type="text"
                        placeholder="Search customer name or phone..."
                        value={enquirySearch}
                        onChange={(e) => setEnquirySearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8DDD7] text-xs focus:outline-none focus:border-[#F50057]"
                      />
                    </div>

                    <select
                      value={enquiryStatusFilter}
                      onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#E8DDD7] text-xs bg-white focus:outline-none"
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <button
                    onClick={exportEnquiriesCSV}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E8DDD7] text-xs font-semibold text-[#351207] hover:bg-[#F7EFE8]"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F50057]" />
                    <span>Export CSV</span>
                  </button>
                </div>

                {/* Enquiries Table */}
                <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F7EFE8] text-[#351207] uppercase text-[10px] font-bold tracking-wider border-b border-[#E8DDD7]">
                        <tr>
                          <th className="py-3 px-4">Customer</th>
                          <th className="py-3 px-4">Contact</th>
                          <th className="py-3 px-4">Enquiry Type</th>
                          <th className="py-3 px-4">Event Date</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8DDD7]">
                        {filteredEnquiries.map((enq) => (
                          <tr
                            key={enq.id}
                            className="hover:bg-[#FFF9F5] transition-colors cursor-pointer"
                            onClick={() => setSelectedEnquiry(enq)}
                          >
                            <td className="py-3 px-4 font-semibold text-[#351207]">
                              {enq.customer_name}
                              {enq.business_name && (
                                <div className="text-[10px] text-[#6F625C] font-normal">
                                  {enq.business_name}
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-4 text-[#6F625C]">{enq.phone_number}</td>
                            <td className="py-3 px-4 capitalize">
                              {enq.enquiry_type.replace(/_/g, " ")}
                            </td>
                            <td className="py-3 px-4 text-[#6F625C]">{enq.event_date || "—"}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                  enq.status === "new"
                                    ? "bg-[#FFF0F5] text-[#F50057]"
                                    : enq.status === "contacted"
                                    ? "bg-blue-50 text-blue-700"
                                    : "bg-green-50 text-green-700"
                                }`}
                              >
                                {enq.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                              <a
                                href={`https://wa.me/${enq.phone_number.replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#25D366] text-white text-[11px] font-semibold"
                              >
                                <MessageCircle className="w-3 h-3 fill-white" />
                                <span>WhatsApp</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Selected Enquiry Details Modal */}
                {selectedEnquiry && (
                  <div
                    className="fixed inset-0 z-50 bg-[#351207]/70 backdrop-blur-xs flex items-center justify-center p-4"
                    onClick={() => setSelectedEnquiry(null)}
                  >
                    <div
                      className="bg-[#FFFFFF] rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E8DDD7] shadow-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between border-b border-[#E8DDD7] pb-3">
                        <h3 className="font-serif font-bold text-lg text-[#351207]">
                          Enquiry Details: {selectedEnquiry.customer_name}
                        </h3>
                        <button
                          onClick={() => setSelectedEnquiry(null)}
                          className="p-1 rounded hover:bg-[#F7EFE8]"
                        >
                          <X className="w-5 h-5 text-[#351207]" />
                        </button>
                      </div>

                      <div className="space-y-3 text-xs text-[#351207]">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-bold text-[#6F625C]">Phone / WhatsApp:</span>
                            <p className="font-semibold">{selectedEnquiry.phone_number}</p>
                          </div>
                          <div>
                            <span className="font-bold text-[#6F625C]">Event Date:</span>
                            <p>{selectedEnquiry.event_date || "Not specified"}</p>
                          </div>
                        </div>

                        {selectedEnquiry.cake_size_or_quantity && (
                          <div>
                            <span className="font-bold text-[#6F625C]">Size / Quantity:</span>
                            <p>{selectedEnquiry.cake_size_or_quantity}</p>
                          </div>
                        )}

                        {selectedEnquiry.budget_range && (
                          <div>
                            <span className="font-bold text-[#6F625C]">Customer Budget:</span>
                            <p className="font-semibold text-[#F50057]">{selectedEnquiry.budget_range}</p>
                          </div>
                        )}

                        {selectedEnquiry.design_notes && (
                          <div>
                            <span className="font-bold text-[#6F625C]">Customer Notes:</span>
                            <p className="p-2.5 rounded-lg bg-[#FFF9F5] border border-[#E8DDD7] mt-1 leading-relaxed">
                              {selectedEnquiry.design_notes}
                            </p>
                          </div>
                        )}

                        {selectedEnquiry.reference_image_url && (
                          <div>
                            <span className="font-bold text-[#6F625C]">Reference Photo:</span>
                            <div className="relative aspect-video w-full rounded-lg overflow-hidden border mt-1">
                              <Image
                                src={selectedEnquiry.reference_image_url}
                                alt="Reference"
                                fill
                                className="object-contain"
                              />
                            </div>
                          </div>
                        )}

                        {/* Status Updater */}
                        <div className="pt-2">
                          <label className="block font-bold text-[#6F625C] mb-1">
                            Update Enquiry Status:
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {(["new", "contacted", "in_progress", "completed", "archived"] as const).map(
                              (st) => (
                                <button
                                  key={st}
                                  onClick={() => handleUpdateEnquiryStatus(selectedEnquiry.id, st)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                                    selectedEnquiry.status === st
                                      ? "bg-[#F50057] text-white"
                                      : "bg-[#F7EFE8] text-[#351207] hover:bg-[#E8DDD7]"
                                  }`}
                                >
                                  {st.replace(/_/g, " ")}
                                </button>
                              )
                            )}
                          </div>
                        </div>

                        {/* Internal Admin Notes */}
                        <div>
                          <label className="block font-bold text-[#6F625C] mb-1">
                            Internal Admin Notes:
                          </label>
                          <textarea
                            rows={2}
                            defaultValue={selectedEnquiry.internal_notes || ""}
                            onBlur={(e) =>
                              handleSaveEnquiryNotes(selectedEnquiry.id, e.target.value)
                            }
                            placeholder="Add internal notes for baker or delivery staff..."
                            className="w-full p-2 rounded-lg border border-[#E8DDD7] text-xs focus:outline-none focus:border-[#F50057]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ================= 4. PHOTO MANAGEMENT & REVIEW TAB ================= */}
            {activeTab === "images" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DDD7]">
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={imageDivisionFilter}
                      onChange={(e) => setImageDivisionFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#E8DDD7] text-xs bg-white"
                    >
                      <option value="all">All Divisions</option>
                      <option value="cakes">Cakes</option>
                      <option value="bakes_and_small_chops">Bakes & Small Chops</option>
                      <option value="brand">Brand Assets</option>
                    </select>

                    <select
                      value={imageStatusFilter}
                      onChange={(e) => setImageStatusFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-[#E8DDD7] text-xs bg-white"
                    >
                      <option value="all">All Statuses</option>
                      <option value="needs_review">Needs Review</option>
                      <option value="published">Published</option>
                      <option value="approved">Approved</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="text-xs text-[#6F625C]">
                    Showing <span className="font-bold text-[#351207]">{filteredAssets.length}</span> assets
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
                    >
                      <div className="relative aspect-square w-full bg-[#F7EFE8]">
                        <Image
                          src={asset.thumbnail_url}
                          alt={asset.alt_text}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              asset.status === "published"
                                ? "bg-green-600 text-white"
                                : asset.status === "needs_review"
                                ? "bg-amber-600 text-white"
                                : "bg-neutral-800 text-white"
                            }`}
                          >
                            {asset.status.replace(/_/g, " ")}
                          </span>
                          {asset.is_featured && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[#F50057] text-white">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 space-y-2 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="text-xs font-bold text-[#351207] line-clamp-1">
                            {asset.caption}
                          </div>
                          <div className="text-[11px] text-[#6F625C] capitalize">
                            Category: {asset.category.replace(/_/g, " ")}
                          </div>
                          <div className="text-[10px] text-[#6F625C]/80">
                            Folder: {asset.original_folder}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#E8DDD7] flex items-center justify-between gap-1">
                          {asset.status === "needs_review" ? (
                            <button
                              onClick={() => handleUpdateAssetStatus(asset.id, "published")}
                              className="w-full bg-[#F50057] hover:bg-[#D5004C] text-white text-[11px] font-semibold py-1.5 rounded-lg"
                            >
                              Approve & Publish
                            </button>
                          ) : asset.status === "published" ? (
                            <button
                              onClick={() => handleUpdateAssetStatus(asset.id, "archived")}
                              className="w-full border border-[#E8DDD7] text-[#6F625C] hover:bg-[#F7EFE8] text-[11px] font-medium py-1.5 rounded-lg"
                            >
                              Unpublish / Archive
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateAssetStatus(asset.id, "published")}
                              className="w-full bg-[#F50057] text-white text-[11px] font-semibold py-1.5 rounded-lg"
                            >
                              Publish
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 5. PRODUCTS TAB ================= */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-[#FFFFFF] p-4 rounded-2xl border border-[#E8DDD7]">
                  <div className="text-xs text-[#6F625C]">
                    Manage public catalogue products. You can manage descriptions, divisions, and quick pricing from here.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="bg-[#FFFFFF] rounded-2xl border border-[#E8DDD7] overflow-hidden flex flex-col justify-between p-4 space-y-3"
                    >
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-[#F7EFE8]">
                        <Image
                          src={prod.primary_image_url}
                          alt={prod.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="text-xs font-bold text-[#351207]">{prod.name}</div>
                        <div className="text-[11px] text-[#6F625C] capitalize">
                          Division: {prod.division.replace(/_/g, " ")} • {prod.category.replace(/_/g, " ")}
                        </div>
                        <div className="text-xs font-bold text-[#F50057]">
                          {prod.price_display}
                        </div>
                        <p className="text-[11px] text-[#6F625C] line-clamp-2">
                          {prod.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-[#E8DDD7] flex items-center justify-between text-xs">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            prod.is_published
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {prod.is_published ? "Published" : "Draft"}
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab("pricing");
                            openPricingModal(prod);
                          }}
                          className="text-[11px] font-semibold text-[#F50057] hover:underline flex items-center gap-1"
                        >
                          <span>Manage Price</span>
                          <Tag className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ================= 6. SYNC & WATCHER SETTINGS ================= */}
            {activeTab === "sync" && (
              <div className="max-w-3xl space-y-6">
                <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-4">
                  <h2 className="font-serif font-bold text-lg text-[#351207]">
                    Automatic Photography Synchronisation
                  </h2>
                  <p className="text-xs text-[#6F625C] leading-relaxed">
                    Hamtunes connects directly to your local image folders:{" "}
                    <code className="text-[#F50057] bg-[#FFF0F5] px-1 py-0.5 rounded font-mono">
                      Website Assets/
                    </code>
                    . When new images are saved into those folders, the watcher automatically processes,
                    generates WebP formats, detects duplicates, recommends category pricing structures, and marks prices as <strong>Pending Owner Approval</strong>.
                  </p>

                  <div className="p-4 rounded-xl bg-[#FFF9F5] border border-[#E8DDD7] space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-[#351207]">
                          Automatic Publication for High-Confidence Photos
                        </div>
                        <div className="text-[11px] text-[#6F625C]">
                          When enabled, photos with high classification confidence appear in the
                          catalogue without manual approval. Prices remain safely unapproved until confirmed.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoPublish}
                        onChange={handleToggleAutoPublish}
                        className="w-5 h-5 accent-[#F50057] rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={handleRunSync}
                      disabled={syncing}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F50057] hover:bg-[#D5004C] text-white text-xs font-semibold shadow-sm transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
                      <span>{syncing ? "Scanning & Optimizing..." : "Trigger Manual Scan Now"}</span>
                    </button>

                    <div className="text-xs text-[#6F625C]">
                      Last Sync: {syncStats?.last_sync ? new Date(syncStats.last_sync).toLocaleString() : "Never"}
                    </div>
                  </div>
                </div>

                {/* Real-time Watcher Terminal Instructions */}
                <div className="bg-[#351207] text-[#FFF9F5] p-6 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#F50057]" />
                    <h3 className="font-serif font-bold text-sm text-white">
                      Starting the Real-Time Background Watcher
                    </h3>
                  </div>
                  <p className="text-xs text-[#F7EFE8]/80 leading-relaxed">
                    To keep the folder watcher running continuously in the background on your machine, run:
                  </p>
                  <pre className="bg-[#220B04] p-3 rounded-xl text-xs font-mono text-[#F50057] select-all">
                    bun run watch
                  </pre>
                  <p className="text-[11px] text-[#F7EFE8]/60">
                    Note: The local watcher runs while your development machine is turned on. When deploying
                    to the cloud (e.g., Vercel), new photos can be uploaded directly through this admin
                    dashboard or via the connected Supabase cloud storage.
                  </p>
                </div>

                {/* Recent Sync Logs */}
                <div className="bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-3">
                  <h3 className="font-serif font-bold text-sm text-[#351207]">
                    Recent Synchronisation Logs
                  </h3>
                  <div className="divide-y divide-[#E8DDD7] text-xs">
                    {recentLogs.map((log: any) => (
                      <div key={log.id} className="py-2.5 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-[#351207] capitalize">{log.trigger} Sync:</span>{" "}
                          <span>+{log.files_added} added, {log.duplicates_skipped} duplicates skipped</span>
                        </div>
                        <span className="text-[#6F625C] text-[11px]">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= 7. SETTINGS TAB ================= */}
            {activeTab === "settings" && (
              <div className="max-w-2xl bg-[#FFFFFF] p-6 rounded-2xl border border-[#E8DDD7] space-y-6">
                <div>
                  <h2 className="font-serif font-bold text-lg text-[#351207]">
                    Official Business Contact Details
                  </h2>
                  <p className="text-xs text-[#6F625C]">
                    Verified business details used across the website, footer, and click-to-chat links.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-[#351207] mb-1">WhatsApp Number</label>
                    <input
                      type="text"
                      disabled
                      value={BRAND.whatsAppDisplay}
                      className="w-full p-2.5 rounded-xl border border-[#E8DDD7] bg-[#F7EFE8] text-[#351207] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#351207] mb-1">Telephone Line</label>
                    <input
                      type="text"
                      disabled
                      value={BRAND.phoneDisplay}
                      className="w-full p-2.5 rounded-xl border border-[#E8DDD7] bg-[#F7EFE8] text-[#351207] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#351207] mb-1">Email Address</label>
                    <input
                      type="text"
                      disabled
                      value={BRAND.email}
                      className="w-full p-2.5 rounded-xl border border-[#E8DDD7] bg-[#F7EFE8] text-[#351207]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[#351207] mb-1">Instagram Profile</label>
                    <input
                      type="text"
                      disabled
                      value={BRAND.instagramUrl}
                      className="w-full p-2.5 rounded-xl border border-[#E8DDD7] bg-[#F7EFE8] text-[#351207]"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
