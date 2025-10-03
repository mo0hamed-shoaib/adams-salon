"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TimePicker } from "@/components/ui/time-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Settings,
  Users,
  Clock,
  MapPin,
  Scissors,
  MessageSquare,
  Save,
  LogOut,
  ChevronDown,
  ChevronRight,
  Plus,
  Minus,
  Trash2,
  Edit,
  Star,
} from "lucide-react";
import { ShopData, Service, Testimonial, WorkingHours } from "@/lib/types";
import { useTranslations, useLocale } from "next-intl";

export default function Dashboard() {
  const router = useRouter();
  const t = useTranslations("dashboard");
  const locale = useLocale();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedServices, setExpandedServices] = useState<Set<string>>(
    new Set()
  );
  const [expandedTestimonials, setExpandedTestimonials] = useState<Set<string>>(
    new Set()
  );
  const [currentSection, setCurrentSection] = useState("status");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced update function to prevent API calls on every keystroke
  const debouncedUpdateShopData = useCallback(
    async (newData: Partial<ShopData>) => {
      // Clear previous timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(async () => {
        try {
          const response = await fetch("/api/shop-data/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              password:
                process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "admin123",
              data: newData,
            }),
          });

          if (response.ok) {
            const result = await response.json();
            setShopData(result.data);
            toast.success("Data updated successfully!");
          } else {
            toast.error("Failed to update data");
          }
        } catch (error) {
          toast.error("Update failed");
        }
      }, 1000); // Wait 1 second after user stops typing
    },
    []
  );

  // Immediate update for non-text inputs (switches, deletes, etc.)
  const immediateUpdateShopData = useCallback(
    async (newData: Partial<ShopData>) => {
      try {
        const response = await fetch("/api/shop-data/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD || "admin123",
            data: newData,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setShopData(result.data);
          toast.success("Data updated successfully!");
        } else {
          toast.error("Failed to update data");
        }
      } catch (error) {
        toast.error("Update failed");
      }
    },
    []
  );

  useEffect(() => {
    // Check if already authenticated
    const authStatus = localStorage.getItem("dashboard_authenticated");
    if (authStatus === "true") {
      setIsAuthenticated(true);
      fetchShopData();
    }
  }, []);

  const getCurrentStatus = () => {
    if (!shopData) {
      return false;
    }
    // Check if there's a manual override for today
    if (shopData.status.manualOverride) {
      const overrideDate = new Date(shopData.status.manualOverride.lastUpdated);
      const today = new Date();

      // If the override was set today, use it
      if (overrideDate.toDateString() === today.toDateString()) {
        return shopData.status.manualOverride.isOpen;
      }
    }

    // Otherwise, use working hours logic
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayHours = shopData.workingHours.find((day) => day.day === today);

    if (!todayHours || !todayHours.isOpen) {
      return false;
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMin] = todayHours.openTime.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(":").map(Number);

    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  };

  const getStatusDescription = () => {
    if (!shopData) {
      return "";
    }
    if (shopData.status.manualOverride) {
      const overrideDate = new Date(shopData.status.manualOverride.lastUpdated);
      const today = new Date();

      if (overrideDate.toDateString() === today.toDateString()) {
        const timeStr = overrideDate.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        return `Manual override (${timeStr})`;
      }
    }

    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    const todayHours = shopData.workingHours.find((day) => day.day === today);

    if (!todayHours || !todayHours.isOpen) {
      return "Closed today (working hours)";
    }

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const [openHour, openMin] = todayHours.openTime.split(":").map(Number);
    const [closeHour, closeMin] = todayHours.closeTime.split(":").map(Number);

    const openMinutes = openHour * 60 + openMin;
    const closeMinutes = closeHour * 60 + closeMin;

    if (currentMinutes < openMinutes) {
      return `Opens at ${todayHours.openTime}`;
    } else if (currentMinutes > closeMinutes) {
      return `Closed at ${todayHours.closeTime}`;
    } else {
      return "Open (working hours)";
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem("dashboard_authenticated", "true");
        fetchShopData();
        toast.success("Login successful!");
      } else {
        toast.error("Invalid password");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchShopData = async () => {
    try {
      const response = await fetch("/api/shop-data");
      const data = await response.json();
      setShopData(data);
    } catch (error) {
      toast.error("Failed to fetch shop data");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dashboard_authenticated");
    setPassword("");
    setShopData(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                placeholder={t("login.password")}
              />
            </div>
            <Button onClick={handleLogin} className="w-full" disabled={loading}>
              {loading ? t("login.login") + "..." : t("login.login")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!shopData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t("actions.logout")}
          </Button>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Settings</span>
                <Select
                  value={currentSection}
                  onValueChange={setCurrentSection}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="status">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        {t("tabs.status")}
                      </div>
                    </SelectItem>
                    <SelectItem value="hours">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {t("tabs.hours")}
                      </div>
                    </SelectItem>
                    <SelectItem value="services">
                      <div className="flex items-center gap-2">
                        <Scissors className="h-4 w-4" />
                        {t("tabs.services")}
                      </div>
                    </SelectItem>
                    <SelectItem value="testimonials">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        {t("tabs.testimonials")}
                      </div>
                    </SelectItem>
                    <SelectItem value="location">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t("tabs.location")}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Status Section */}
          {currentSection === "status" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {t("status.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label>{t("status.manualOverride")}</Label>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={getCurrentStatus()}
                          onCheckedChange={(checked) => {
                            const now = new Date();
                            const newStatus = {
                              ...shopData.status,
                              manualOverride: {
                                isOpen: checked,
                                lastUpdated: now.toISOString(),
                                reason: checked
                                  ? "Manually opened"
                                  : "Manually closed",
                              },
                            };
                            immediateUpdateShopData({ status: newStatus });
                          }}
                        />
                        <Badge
                          variant={getCurrentStatus() ? "default" : "secondary"}
                        >
                          {getCurrentStatus()
                            ? t("status.isOpen")
                            : t("status.closed")}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {getStatusDescription()}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("status.clientsInShop")}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                clientsInShop: Math.max(
                                  0,
                                  shopData.status.clientsInShop - 1
                                ),
                              },
                            })
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={shopData.status.clientsInShop}
                          onChange={(e) =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                clientsInShop: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                clientsInShop:
                                  shopData.status.clientsInShop + 1,
                              },
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("status.clientsComing")}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                clientsComing: Math.max(
                                  0,
                                  shopData.status.clientsComing - 1
                                ),
                              },
                            })
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={shopData.status.clientsComing}
                          onChange={(e) =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                clientsComing: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                clientsComing:
                                  shopData.status.clientsComing + 1,
                              },
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>{t("status.waitingTime")}</Label>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                waitingTime: Math.max(
                                  0,
                                  shopData.status.waitingTime - 1
                                ),
                              },
                            })
                          }
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          value={shopData.status.waitingTime}
                          onChange={(e) =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                waitingTime: parseInt(e.target.value) || 0,
                              },
                            })
                          }
                          className="text-center"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() =>
                            immediateUpdateShopData({
                              status: {
                                ...shopData.status,
                                waitingTime: shopData.status.waitingTime + 1,
                              },
                            })
                          }
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Working Hours Section */}
          {currentSection === "hours" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {t("hours.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shopData.workingHours.map((day, index) => (
                    <div
                      key={day.day}
                      className="p-4 border rounded-lg space-y-3 sm:space-y-0"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                        <div className="flex items-center gap-3 sm:gap-6">
                          <div className="w-20 sm:w-24 font-medium text-sm sm:text-base">
                            {t(`hours.days.${day.day}`)}
                          </div>
                          <Switch
                            checked={day.isOpen}
                            onCheckedChange={(checked) => {
                              const newHours = [...shopData.workingHours];
                              newHours[index] = { ...day, isOpen: checked };
                              immediateUpdateShopData({
                                workingHours: newHours,
                              });
                            }}
                          />
                        </div>
                        {day.isOpen && (
                          <div className="flex items-center gap-3 flex-wrap">
                            <TimePicker
                              value={day.openTime}
                              onChange={(value) => {
                                const newHours = [...shopData.workingHours];
                                newHours[index] = { ...day, openTime: value };
                                immediateUpdateShopData({
                                  workingHours: newHours,
                                });
                              }}
                              placeholder="Open time"
                              className="w-28 sm:w-32"
                            />
                            <span className="text-muted-foreground text-sm">
                              to
                            </span>
                            <TimePicker
                              value={day.closeTime}
                              onChange={(value) => {
                                const newHours = [...shopData.workingHours];
                                newHours[index] = { ...day, closeTime: value };
                                immediateUpdateShopData({
                                  workingHours: newHours,
                                });
                              }}
                              placeholder="Close time"
                              className="w-28 sm:w-32"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Services Section */}
          {currentSection === "services" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scissors className="h-5 w-5" />
                    {t("services.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shopData.services.map((service, index) => {
                    const isExpanded = expandedServices.has(service.id);
                    return (
                      <Collapsible
                        key={service.id}
                        open={isExpanded}
                        onOpenChange={(open) => {
                          const newExpanded = new Set(expandedServices);
                          if (open) {
                            newExpanded.add(service.id);
                          } else {
                            newExpanded.delete(service.id);
                          }
                          setExpandedServices(newExpanded);
                        }}
                      >
                        <div className="border rounded-lg">
                          <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                                  <Scissors className="h-5 w-5 text-primary" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold">
                                    {service.name[locale as "ar" | "en"] ||
                                      "New Service"}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {service.price}{" "}
                                    {locale === "ar" ? "جنيه" : "EGP"}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newServices =
                                      shopData.services.filter(
                                        (_, i) => i !== index
                                      );
                                    immediateUpdateShopData({
                                      services: newServices,
                                    });
                                  }}
                                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-destructive hover:text-destructive cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="p-4 pt-0 space-y-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {t("services.name")} - العربية
                                  </Label>
                                  <Input
                                    value={service.name.ar}
                                    onChange={(e) => {
                                      const newServices = [
                                        ...shopData.services,
                                      ];
                                      newServices[index] = {
                                        ...service,
                                        name: {
                                          ...service.name,
                                          ar: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        services: newServices,
                                      });
                                      debouncedUpdateShopData({
                                        services: newServices,
                                      });
                                    }}
                                    placeholder="اسم الخدمة بالعربية"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {t("services.name")} - English
                                  </Label>
                                  <Input
                                    value={service.name.en}
                                    onChange={(e) => {
                                      const newServices = [
                                        ...shopData.services,
                                      ];
                                      newServices[index] = {
                                        ...service,
                                        name: {
                                          ...service.name,
                                          en: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        services: newServices,
                                      });
                                      debouncedUpdateShopData({
                                        services: newServices,
                                      });
                                    }}
                                    placeholder="Service name in English"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>
                                    {t("services.price")} (
                                    {locale === "ar" ? "جنيه" : "EGP"})
                                  </Label>
                                  <Input
                                    type="number"
                                    value={service.price}
                                    onChange={(e) => {
                                      const newServices = [
                                        ...shopData.services,
                                      ];
                                      newServices[index] = {
                                        ...service,
                                        price: parseInt(e.target.value) || 0,
                                      };
                                      setShopData({
                                        ...shopData,
                                        services: newServices,
                                      });
                                      debouncedUpdateShopData({
                                        services: newServices,
                                      });
                                    }}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>{t("services.image")}</Label>
                                  <Input
                                    value={service.image}
                                    onChange={(e) => {
                                      const newServices = [
                                        ...shopData.services,
                                      ];
                                      newServices[index] = {
                                        ...service,
                                        image: e.target.value,
                                      };
                                      setShopData({
                                        ...shopData,
                                        services: newServices,
                                      });
                                      debouncedUpdateShopData({
                                        services: newServices,
                                      });
                                    }}
                                    placeholder="Image URL"
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label>
                                    {t("services.description")} - العربية
                                  </Label>
                                  <Input
                                    value={service.description?.ar || ""}
                                    onChange={(e) => {
                                      const newServices = [
                                        ...shopData.services,
                                      ];
                                      newServices[index] = {
                                        ...service,
                                        description: {
                                          ar: e.target.value,
                                          en: service.description?.en || "",
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        services: newServices,
                                      });
                                      debouncedUpdateShopData({
                                        services: newServices,
                                      });
                                    }}
                                    placeholder="وصف الخدمة بالعربية"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>
                                    {t("services.description")} - English
                                  </Label>
                                  <Input
                                    value={service.description?.en || ""}
                                    onChange={(e) => {
                                      const newServices = [
                                        ...shopData.services,
                                      ];
                                      newServices[index] = {
                                        ...service,
                                        description: {
                                          ar: service.description?.ar || "",
                                          en: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        services: newServices,
                                      });
                                      debouncedUpdateShopData({
                                        services: newServices,
                                      });
                                    }}
                                    placeholder="Service description in English"
                                  />
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => {
                        const newService = {
                          id: Date.now().toString(),
                          name: { ar: "", en: "" },
                          price: 0,
                          image: "",
                          description: { ar: "", en: "" },
                        };
                        immediateUpdateShopData({
                          services: [...shopData.services, newService],
                        });
                      }}
                      className="w-full"
                    >
                      {t("services.addService")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Testimonials Section */}
          {currentSection === "testimonials" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {t("testimonials.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {shopData.testimonials.map((testimonial, index) => {
                    const isExpanded = expandedTestimonials.has(testimonial.id);
                    return (
                      <Collapsible
                        key={testimonial.id}
                        open={isExpanded}
                        onOpenChange={(open) => {
                          const newExpanded = new Set(expandedTestimonials);
                          if (open) {
                            newExpanded.add(testimonial.id);
                          } else {
                            newExpanded.delete(testimonial.id);
                          }
                          setExpandedTestimonials(newExpanded);
                        }}
                      >
                        <div className="border rounded-lg">
                          <CollapsibleTrigger className="w-full p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                  <MessageSquare className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-semibold">
                                    {testimonial.name[locale as "ar" | "en"] ||
                                      "New Testimonial"}
                                  </h3>
                                  <div className="flex items-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${
                                          i < testimonial.rating
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    ))}
                                    <span className="text-xs text-muted-foreground ml-1">
                                      ({testimonial.rating}/5)
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newTestimonials =
                                      shopData.testimonials.filter(
                                        (_, i) => i !== index
                                      );
                                    immediateUpdateShopData({
                                      testimonials: newTestimonials,
                                    });
                                  }}
                                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent h-9 rounded-md px-3 text-destructive hover:text-destructive cursor-pointer"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </div>
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <div className="p-4 pt-0 space-y-4 border-t">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {t("testimonials.name")} - العربية
                                  </Label>
                                  <Input
                                    value={testimonial.name.ar}
                                    onChange={(e) => {
                                      const newTestimonials = [
                                        ...shopData.testimonials,
                                      ];
                                      newTestimonials[index] = {
                                        ...testimonial,
                                        name: {
                                          ...testimonial.name,
                                          ar: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        testimonials: newTestimonials,
                                      });
                                      debouncedUpdateShopData({
                                        testimonials: newTestimonials,
                                      });
                                    }}
                                    placeholder="اسم العميل بالعربية"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {t("testimonials.name")} - English
                                  </Label>
                                  <Input
                                    value={testimonial.name.en}
                                    onChange={(e) => {
                                      const newTestimonials = [
                                        ...shopData.testimonials,
                                      ];
                                      newTestimonials[index] = {
                                        ...testimonial,
                                        name: {
                                          ...testimonial.name,
                                          en: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        testimonials: newTestimonials,
                                      });
                                      debouncedUpdateShopData({
                                        testimonials: newTestimonials,
                                      });
                                    }}
                                    placeholder="Customer name in English"
                                  />
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                  {t("testimonials.rating")} (1-5)
                                </Label>
                                <Input
                                  type="number"
                                  min="1"
                                  max="5"
                                  value={testimonial.rating}
                                  onChange={(e) => {
                                    const newTestimonials = [
                                      ...shopData.testimonials,
                                    ];
                                    newTestimonials[index] = {
                                      ...testimonial,
                                      rating: Math.min(
                                        5,
                                        Math.max(
                                          1,
                                          parseInt(e.target.value) || 1
                                        )
                                      ),
                                    };
                                    setShopData({
                                      ...shopData,
                                      testimonials: newTestimonials,
                                    });
                                    debouncedUpdateShopData({
                                      testimonials: newTestimonials,
                                    });
                                  }}
                                  className="mt-1"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {t("testimonials.comment")} - العربية
                                  </Label>
                                  <Input
                                    value={testimonial.comment.ar}
                                    onChange={(e) => {
                                      const newTestimonials = [
                                        ...shopData.testimonials,
                                      ];
                                      newTestimonials[index] = {
                                        ...testimonial,
                                        comment: {
                                          ...testimonial.comment,
                                          ar: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        testimonials: newTestimonials,
                                      });
                                      debouncedUpdateShopData({
                                        testimonials: newTestimonials,
                                      });
                                    }}
                                    className="mt-1"
                                    placeholder="تعليق العميل بالعربية"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">
                                    {t("testimonials.comment")} - English
                                  </Label>
                                  <Input
                                    value={testimonial.comment.en}
                                    onChange={(e) => {
                                      const newTestimonials = [
                                        ...shopData.testimonials,
                                      ];
                                      newTestimonials[index] = {
                                        ...testimonial,
                                        comment: {
                                          ...testimonial.comment,
                                          en: e.target.value,
                                        },
                                      };
                                      setShopData({
                                        ...shopData,
                                        testimonials: newTestimonials,
                                      });
                                      debouncedUpdateShopData({
                                        testimonials: newTestimonials,
                                      });
                                    }}
                                    className="mt-1"
                                    placeholder="Customer review in English"
                                  />
                                </div>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  })}

                  <div className="pt-4 border-t">
                    <Button
                      onClick={() => {
                        const newTestimonial = {
                          id: Date.now().toString(),
                          name: { ar: "", en: "" },
                          rating: 5,
                          comment: { ar: "", en: "" },
                          avatar: "",
                        };
                        immediateUpdateShopData({
                          testimonials: [
                            ...shopData.testimonials,
                            newTestimonial,
                          ],
                        });
                      }}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t("testimonials.addTestimonial")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Location Section */}
          {currentSection === "location" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t("location.title")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t("location.address")} - العربية</Label>
                      <Input
                        value={shopData.location.address.ar}
                        onChange={(e) => {
                          const newLocation = {
                            ...shopData.location,
                            address: {
                              ...shopData.location.address,
                              ar: e.target.value,
                            },
                          };
                          setShopData({ ...shopData, location: newLocation });
                          debouncedUpdateShopData({ location: newLocation });
                        }}
                        placeholder="عنوان المتجر بالعربية"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t("location.address")} - English</Label>
                      <Input
                        value={shopData.location.address.en}
                        onChange={(e) => {
                          const newLocation = {
                            ...shopData.location,
                            address: {
                              ...shopData.location.address,
                              en: e.target.value,
                            },
                          };
                          setShopData({ ...shopData, location: newLocation });
                          debouncedUpdateShopData({ location: newLocation });
                        }}
                        placeholder="Shop address in English"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("location.mapsUrl")}</Label>
                    <Input
                      value={shopData.location.mapsUrl}
                      onChange={(e) => {
                        const newLocation = {
                          ...shopData.location,
                          mapsUrl: e.target.value,
                        };
                        setShopData({ ...shopData, location: newLocation });
                        debouncedUpdateShopData({ location: newLocation });
                      }}
                      className="mt-2"
                      placeholder={t("location.mapsPlaceholder")}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
