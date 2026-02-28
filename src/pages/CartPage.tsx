import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useOrders } from "@/hooks/useOrders";
import Footer from "@/components/Footer";
import {
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  ShoppingBag,
  User,
  MapPin,
  CalendarDays,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import supabase from "@/lib/supabase";

// ── Calendar helpers ──────────────────────────────────────────────
const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

const TIME_SLOTS = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
];

// ─────────────────────────────────────────────────────────────────

export default function CartPage() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  // Calendar state
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // Delivery location
  const [deliveryAddress, setDeliveryAddress] = useState(
    (user as any)?.address || ""
  );

  // Customer info (guests)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const deliveryFee = total > 50 ? 0 : 4.99;
  const grandTotal = total + deliveryFee;

  // ── Calendar navigation ───────────────────────────────────────
  const prevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else setCalMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else setCalMonth((m) => m + 1);
  };

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);

  const isDateDisabled = (day: number) => {
    const d = new Date(calYear, calMonth, day);
    d.setHours(0, 0, 0, 0);
    const t2 = new Date();
    t2.setHours(0, 0, 0, 0);
    return d < t2;
  };

  const isDateSelected = (day: number) =>
    selectedDate?.getDate() === day &&
    selectedDate?.getMonth() === calMonth &&
    selectedDate?.getFullYear() === calYear;

  const handleDayClick = (day: number) => {
    if (isDateDisabled(day)) return;
    setSelectedDate(new Date(calYear, calMonth, day));
    setSelectedTime(""); // reset time when date changes
  };

  // ── Submit order ──────────────────────────────────────────────
  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Veuillez sélectionner une date et une heure de livraison");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Veuillez entrer une adresse de livraison");
      return;
    }
    if (
      !user &&
      (!customerInfo.email ||
        !customerInfo.firstName ||
        !customerInfo.lastName ||
        !customerInfo.phone)
    ) {
      toast.error("Veuillez remplir toutes les informations de livraison");
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        user_id: user?.id || null,
        total_amount: grandTotal,
        delivery_fee: deliveryFee,
        status: "pending",
        payment_status: "cash_on_delivery",
        delivery_address: deliveryAddress,
        requested_delivery_date: selectedDate.toISOString().split("T")[0],
        estimated_delivery_time: `${
          selectedDate.toISOString().split("T")[0]
        } ${selectedTime}`,
        special_instructions: specialInstructions,
        payment_method: "cash_on_delivery",
        customer_email: user?.email || customerInfo.email,
        customer_first_name: (user as any)?.firstName || customerInfo.firstName,
        customer_last_name: (user as any)?.lastName || customerInfo.lastName,
        customer_phone: (user as any)?.phone || customerInfo.phone,
      };

      await createOrder(orderData, items);
      clearCart();
      toast.success("Commande confirmée ! Paiement à la livraison.");
    } catch (error) {
      toast.error("Erreur lors de la commande : " + (error as any).message);
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Empty cart ────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24"
          >
            <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("cart.empty")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("cart.emptyDescription")}
            </p>
            <Link to="/menu">
              <Button size="lg">
                {t("cart.browseMenu")}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl xs:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-center"
        >
          {t("cart.title")}{" "}
          <span className="text-fire">{t("common.cart")}</span>
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ── Left column: items + date/time + location ── */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cart Items */}
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="glass" className="p-4 md:p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-base sm:text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-base sm:text-lg">
                        €{item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                        <span className="font-bold w-8 text-center">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive h-7 w-7 sm:h-8 sm:w-8 p-0"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* ── Calendar ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="glass" className="p-6">
                <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5 text-primary" />
                  Date de livraison
                </h3>

                {/* Month navigation */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    ‹
                  </button>
                  <span className="font-semibold text-base">
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    ›
                  </button>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-xs font-semibold text-muted-foreground py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before first day */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const disabled = isDateDisabled(day);
                    const selected = isDateSelected(day);
                    return (
                      <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        disabled={disabled}
                        className={`
                          aspect-square rounded-lg text-sm font-medium transition-all duration-200
                          ${
                            disabled
                              ? "text-muted-foreground/40 cursor-not-allowed"
                              : selected
                              ? "bg-primary text-white shadow-md scale-105"
                              : "hover:bg-primary/10 hover:text-primary"
                          }
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <p className="mt-4 text-sm text-center text-primary font-medium">
                    ✓{" "}
                    {selectedDate.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                )}
              </Card>
            </motion.div>

            {/* ── Time slots ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card variant="glass" className="p-6">
                <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Heure de livraison
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`
                        py-2 px-1 rounded-lg text-sm font-medium transition-all duration-200 border
                        ${
                          selectedTime === slot
                            ? "bg-primary text-white border-primary shadow-md scale-105"
                            : "border-border hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
                        }
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* ── Delivery location ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="glass" className="p-6">
                <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Adresse de livraison
                </h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="address">Adresse complète</Label>
                    <Input
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Numéro, rue, ville, code postal"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions">
                      Instructions spéciales (optionnel)
                    </Label>
                    <Input
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Sonnette cassée, code d'entrée, étage…"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* ── Guest customer info ── */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card variant="glass" className="p-6">
                  <h3 className="font-display font-bold text-lg mb-5 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Vos informations
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="firstName">Prénom</Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          className="mt-1"
                          onChange={(e) =>
                            setCustomerInfo((p) => ({
                              ...p,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="Votre prénom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Nom</Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          className="mt-1"
                          onChange={(e) =>
                            setCustomerInfo((p) => ({
                              ...p,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="Votre nom"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        className="mt-1"
                        onChange={(e) =>
                          setCustomerInfo((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        placeholder="votre@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        className="mt-1"
                        onChange={(e) =>
                          setCustomerInfo((p) => ({
                            ...p,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="+33 6 XX XX XX XX"
                      />
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          {/* ── Right column: order summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="fire" className="p-6 sticky top-28">
              <h2 className="font-display font-bold text-xl mb-6">
                {t("cart.orderSummary")}
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("cart.subtotal")}</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("cart.deliveryFee")}</span>
                  <span>
                    {deliveryFee === 0
                      ? t("cart.freeDelivery")
                      : `€${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                {deliveryFee > 0 && (
                  <p className="text-fresh text-sm">
                    {t("cart.addForFreeDelivery", {
                      amount: (50 - total).toFixed(2),
                    })}
                  </p>
                )}
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-display font-bold text-xl">
                    <span>{t("cart.total")}</span>
                    <span className="text-primary">
                      €{grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery summary */}
              {(selectedDate || selectedTime || deliveryAddress) && (
                <div className="bg-muted/50 rounded-xl p-4 mb-6 space-y-2 text-sm">
                  {selectedDate && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CalendarDays className="w-4 h-4 text-primary shrink-0" />
                      {selectedDate.toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </div>
                  )}
                  {selectedTime && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="w-4 h-4 text-primary shrink-0" />
                      {selectedTime}
                    </div>
                  )}
                  {deliveryAddress && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="truncate">{deliveryAddress}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Cash on delivery badge */}
              <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                Paiement à la livraison
              </div>

              {/* Confirm button */}
              <Button
                className="w-full"
                size="lg"
                disabled={
                  !selectedDate ||
                  !selectedTime ||
                  !deliveryAddress.trim() ||
                  isProcessing
                }
                onClick={handleConfirm}
              >
                {isProcessing ? "Traitement..." : "Confirmer la commande"}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-muted-foreground text-xs text-center mt-3">
                Vous paierez en espèces à la livraison
              </p>
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}
