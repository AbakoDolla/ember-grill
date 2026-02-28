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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

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

export default function CartPage() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const { createOrder } = useOrders();

  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [summaryOpen, setSummaryOpen] = useState(false);

  const [deliveryAddress, setDeliveryAddress] = useState(
    (user as any)?.address || ""
  );
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
    setSelectedTime("");
  };

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
      <div className="min-h-screen bg-background pt-20 pb-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20"
          >
            <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-muted-foreground mx-auto mb-6" />
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {t("cart.empty")}
            </h1>
            <p className="text-muted-foreground mb-8 text-sm sm:text-base">
              {t("cart.emptyDescription")}
            </p>
            <Link to="/menu">
              <Button size="lg" className="w-full sm:w-auto">
                {t("cart.browseMenu")} <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Reusable summary content ──────────────────────────────────
  const SummaryContent = () => (
    <>
      <div className="space-y-2.5 mb-4">
        <div className="flex justify-between text-muted-foreground text-sm">
          <span>{t("cart.subtotal")}</span>
          <span>€{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground text-sm">
          <span>{t("cart.deliveryFee")}</span>
          <span>
            {deliveryFee === 0
              ? t("cart.freeDelivery")
              : `€${deliveryFee.toFixed(2)}`}
          </span>
        </div>
        {deliveryFee > 0 && (
          <p className="text-secondary text-xs">
            {t("cart.addForFreeDelivery", { amount: (50 - total).toFixed(2) })}
          </p>
        )}
        <div className="border-t border-border pt-2.5 flex justify-between font-display font-bold text-lg">
          <span>{t("cart.total")}</span>
          <span className="text-primary">€{grandTotal.toFixed(2)}</span>
        </div>
      </div>

      {(selectedDate || selectedTime || deliveryAddress) && (
        <div className="bg-muted/50 rounded-xl p-3 mb-4 space-y-1.5 text-xs">
          {selectedDate && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5 text-primary shrink-0" />
              {selectedDate.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </div>
          )}
          {selectedTime && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
              {selectedTime}
            </div>
          )}
          {deliveryAddress && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{deliveryAddress}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-2 bg-secondary/10 text-secondary rounded-xl px-3 py-2.5 mb-4 text-xs font-medium">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Paiement à la livraison
      </div>

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
      <p className="text-muted-foreground text-xs text-center mt-2">
        Vous paierez en espèces à la livraison
      </p>
    </>
  );

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-8 sm:pb-12">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-5 sm:mb-8 text-center"
        >
          {t("cart.title")}{" "}
          <span className="text-fire">{t("common.cart")}</span>
        </motion.h1>

        {/* ── Mobile sticky bottom bar ── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 shadow-2xl">
          {/* Expandable full summary */}
          {summaryOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border-t border-border px-4 py-4 max-h-[70vh] overflow-y-auto"
            >
              <h2 className="font-display font-bold text-base mb-4">
                {t("cart.orderSummary")}
              </h2>
              <SummaryContent />
            </motion.div>
          )}

          {/* Toggle bar */}
          <div className="bg-card border-t border-border">
            <button
              onClick={() => setSummaryOpen((o) => !o)}
              className="w-full flex items-center justify-between px-4 py-2.5 border-b border-border/40"
            >
              <span className="font-semibold text-sm flex items-center gap-2">
                {t("cart.orderSummary")}
                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-bold">
                  €{grandTotal.toFixed(2)}
                </span>
              </span>
              {summaryOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              )}
            </button>

            {/* Always-visible confirm CTA */}
            <div className="px-4 py-3">
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
                {isProcessing
                  ? "Traitement..."
                  : `Confirmer · €${grandTotal.toFixed(2)}`}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* ── Page grid ── */}
        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 pb-44 lg:pb-0">
          {/* ── Left: items + forms ── */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Cart items */}
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <Card variant="glass" className="p-3 sm:p-4 md:p-5">
                  <div className="flex gap-3 sm:gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-bold text-sm sm:text-base md:text-lg leading-tight line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-primary font-bold text-sm sm:text-base mt-0.5">
                        €{item.price.toFixed(2)}
                      </p>
                      {/* Mobile: controls inline below name */}
                      <div className="flex items-center gap-2 mt-2 sm:hidden">
                        <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="font-bold w-6 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                    {/* sm+: controls on the right */}
                    <div className="hidden sm:flex flex-col items-end gap-2 shrink-0">
                      <div className="flex items-center gap-0.5 bg-muted rounded-lg p-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          <Minus className="w-3.5 h-3.5" />
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
                          <Plus className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-destructive hover:text-destructive h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}

            {/* Calendar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass" className="p-4 sm:p-6">
                <h3 className="font-display font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Date de livraison
                </h3>
                <div className="flex items-center justify-between mb-3">
                  <button
                    onClick={prevMonth}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-xl font-bold leading-none"
                  >
                    ‹
                  </button>
                  <span className="font-semibold text-sm sm:text-base">
                    {MONTHS[calMonth]} {calYear}
                  </span>
                  <button
                    onClick={nextMonth}
                    className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-xl font-bold leading-none"
                  >
                    ›
                  </button>
                </div>
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map((d) => (
                    <div
                      key={d}
                      className="text-center text-[10px] sm:text-xs font-semibold text-muted-foreground py-1"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`e-${i}`} />
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
                          aspect-square rounded-lg text-xs sm:text-sm font-medium transition-all duration-150
                          min-h-[36px] sm:min-h-[40px] active:scale-95
                          ${
                            disabled
                              ? "text-muted-foreground/30 cursor-not-allowed"
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
                  <p className="mt-3 text-xs sm:text-sm text-center text-primary font-medium">
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

            {/* Time slots */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
            >
              <Card variant="glass" className="p-4 sm:p-6">
                <h3 className="font-display font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Heure de livraison
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 sm:gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`
                        py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-150 border
                        min-h-[38px] active:scale-95
                        ${
                          selectedTime === slot
                            ? "bg-primary text-white border-primary shadow-md scale-105"
                            : "border-border hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                        }
                      `}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Delivery address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.33 }}
            >
              <Card variant="glass" className="p-4 sm:p-6">
                <h3 className="font-display font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Adresse de livraison
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="address" className="text-sm">
                      Adresse complète
                    </Label>
                    <Input
                      id="address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Numéro, rue, ville, code postal"
                      className="mt-1 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="instructions" className="text-sm">
                      Instructions spéciales (optionnel)
                    </Label>
                    <Input
                      id="instructions"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="Sonnette cassée, code d'entrée, étage…"
                      className="mt-1 text-sm"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Guest info */}
            {!user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38 }}
              >
                <Card variant="glass" className="p-4 sm:p-6">
                  <h3 className="font-display font-bold text-base sm:text-lg mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    Vos informations
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <div>
                        <Label htmlFor="firstName" className="text-sm">
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          value={customerInfo.firstName}
                          className="mt-1 text-sm"
                          onChange={(e) =>
                            setCustomerInfo((p) => ({
                              ...p,
                              firstName: e.target.value,
                            }))
                          }
                          placeholder="Prénom"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-sm">
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          value={customerInfo.lastName}
                          className="mt-1 text-sm"
                          onChange={(e) =>
                            setCustomerInfo((p) => ({
                              ...p,
                              lastName: e.target.value,
                            }))
                          }
                          placeholder="Nom"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerInfo.email}
                        className="mt-1 text-sm"
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
                      <Label htmlFor="phone" className="text-sm">
                        Téléphone
                      </Label>
                      <Input
                        id="phone"
                        value={customerInfo.phone}
                        className="mt-1 text-sm"
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

          {/* ── Right: desktop-only summary ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="hidden lg:block"
          >
            <Card variant="fire" className="p-6 sticky top-28">
              <h2 className="font-display font-bold text-xl mb-6">
                {t("cart.orderSummary")}
              </h2>
              <SummaryContent />
            </Card>
          </motion.div>
        </div>
      </div>

      <div className="mt-12 pb-44 lg:pb-0">
        <Footer />
      </div>
    </div>
  );
}
