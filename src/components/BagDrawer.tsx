import React, { useMemo, useState } from 'react';
import { X, Plus, Minus, ShoppingBag, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { ClinicalMeal, MealAddon } from '../data/clinicalData';
import { ClinicalCheckbox, MealImage } from './ClinicalVisuals';

export interface BagItem {
  key: string;
  meal: ClinicalMeal;
  addons: MealAddon[];
  quantity: number;
}

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: BagItem[];
  activeHub: string;
  onUpdateQty: (key: string, delta: number) => void;
  onClearBag: () => void;
}

const DELIVERY_WINDOWS = [
  'Next Window · 12:30 – 01:15 PM',
  'Afternoon · 04:15 – 04:45 PM',
  'Dinner · 07:30 – 08:15 PM',
];

export const BagDrawer: React.FC<BagDrawerProps> = ({
  isOpen,
  onClose,
  items,
  activeHub,
  onUpdateQty,
  onClearBag,
}) => {
  const [step, setStep] = useState<'bag' | 'checkout' | 'confirmed'>('bag');
  const [deliveryWindow, setDeliveryWindow] = useState(DELIVERY_WINDOWS[0]);
  const [steelTiffin, setSteelTiffin] = useState(true);
  const [paymentMode, setPaymentMode] = useState<'upi' | 'cod'>('upi');

  // Checkout verification fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('560038');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderSnapshot, setOrderSnapshot] = useState<{
    orderId: string;
    total: number;
    kcal: number;
    protein: number;
    count: number;
    window: string;
    customer: string;
  } | null>(null);

  const summary = useMemo(() => {
    let subtotal = 0;
    let totalKcal = 0;
    let totalProtein = 0;
    let totalCount = 0;
    for (const item of items) {
      const unitPrice =
        item.meal.priceInr + item.addons.reduce((s, a) => s + a.priceDelta, 0);
      const unitKcal =
        item.meal.kcal + item.addons.reduce((s, a) => s + a.kcalDelta, 0);
      const unitProtein =
        item.meal.proteinG + item.addons.reduce((s, a) => s + a.proteinDelta, 0);
      subtotal += unitPrice * item.quantity;
      totalKcal += unitKcal * item.quantity;
      totalProtein += unitProtein * item.quantity;
      totalCount += item.quantity;
    }
    const deliveryFee = subtotal >= 699 || subtotal === 0 ? 0 : 49;
    const gst = Math.round(subtotal * 0.05);
    const grandTotal = subtotal + deliveryFee + gst;
    return { subtotal, deliveryFee, gst, grandTotal, totalKcal, totalProtein, totalCount };
  }, [items]);

  if (!isOpen) return null;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || phone.trim().length < 8 || !address.trim() || pincode.trim().length < 6) {
      setErrorMsg('Please complete your name, 10-digit phone, flat/street address, and 6-digit pin code.');
      return;
    }
    setErrorMsg('');
    const orderNum = `AAH-${Math.floor(4100 + Math.random() * 5800)}`;
    setOrderSnapshot({
      orderId: orderNum,
      total: summary.grandTotal,
      kcal: summary.totalKcal,
      protein: summary.totalProtein,
      count: summary.totalCount,
      window: deliveryWindow,
      customer: customerName.trim(),
    });
    onClearBag();
    setStep('confirmed');
  };

  const handleClose = () => {
    if (step === 'confirmed') setStep('bag');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#0E3E2D]/40 backdrop-blur-[2px] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Clinical Diet Bag and Checkout"
    >
      <div className="bg-[#FBF9F5] w-full max-w-md h-full flex flex-col border-l border-[#E8E4DC] shadow-clinical-float">
        {/* Drawer Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E8E4DC] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#135D43]" />
            <div>
              <h2 className="font-display text-lg font-bold text-[#0E3E2D] leading-none">
                {step === 'bag' && 'Your Diet Bag'}
                {step === 'checkout' && 'Delivery Verification'}
                {step === 'confirmed' && 'Order Confirmed'}
              </h2>
              <p className="text-[11px] text-[#4B5563] mt-1">{activeHub}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close diet bag"
            className="w-10 h-10 rounded-xl bg-[#F4F1EA] hover:bg-[#E8E4DC] flex items-center justify-center text-[#1F2937] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {step === 'confirmed' && orderSnapshot ? (
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6 space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-[#EBF3F0] border border-[#135D43]/20 flex items-center justify-center text-[#135D43]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.04em] text-[#135D43]">
                  Kitchen Dispatch Scheduled
                </p>
                <h3 className="font-display text-2xl font-bold text-[#0E3E2D]">
                  Order #{orderSnapshot.orderId} Confirmed
                </h3>
                <p className="text-sm text-[#4B5563] leading-relaxed">
                  Thank you, <strong className="text-[#1F2937]">{orderSnapshot.customer}</strong>.
                  Our Indiranagar clinical kitchen is preparing your weighed meals for{' '}
                  <strong className="text-[#1F2937]">{orderSnapshot.window}</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FBF9F5] border border-[#E8E4DC] space-y-2 text-xs tabular-nums">
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Formulations Queued</span>
                  <strong className="text-[#1F2937]">{orderSnapshot.count} bowls</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Total Verified Nutrition</span>
                  <strong className="text-[#135D43]">
                    {orderSnapshot.kcal} kcal · {orderSnapshot.protein}g Pro
                  </strong>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#E8E4DC] text-sm">
                  <span className="font-semibold text-[#1F2937]">Amount Payable</span>
                  <strong className="font-display text-[#0E3E2D]">₹{orderSnapshot.total}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full min-h-[48px] rounded-xl bg-[#135D43] hover:bg-[#0E3E2D] text-white text-sm font-semibold cursor-pointer"
              >
                Return to Clinical Menu
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] flex items-center justify-center text-[#135D43] mx-auto">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-display text-lg font-semibold text-[#0E3E2D]">
                Your diet bag is empty
              </h3>
              <p className="text-sm text-[#4B5563]">
                Add lab-verified clinical bowls from the Menu or queue an entire day from your Daily
                Plan.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="min-h-[44px] px-5 rounded-xl bg-[#135D43] text-white text-sm font-semibold hover:bg-[#0E3E2D] transition-colors cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : step === 'bag' ? (
            <>
              {/* Macro Summary Bar */}
              <div className="bg-[#0E3E2D] text-white rounded-2xl p-4 flex items-center justify-between tabular-nums">
                <div>
                  <p className="text-[11px] font-semibold text-[#90D5B4]">Bag Nutritional Total</p>
                  <p className="font-display text-lg font-bold mt-0.5">
                    {summary.totalKcal} kcal · {summary.totalProtein}g Protein
                  </p>
                </div>
                <span className="text-xs font-semibold bg-white/10 px-2.5 py-1 rounded-full">
                  {summary.totalCount} {summary.totalCount === 1 ? 'bowl' : 'bowls'}
                </span>
              </div>

              {/* Free Delivery Threshold Notice */}
              <div className="flex items-center gap-2.5 text-xs text-[#0E3E2D] bg-[#EBF3F0] border border-[#135D43]/20 rounded-xl px-3.5 py-2.5">
                <Truck className="w-4 h-4 text-[#135D43] shrink-0" />
                {summary.subtotal >= 699 ? (
                  <span>
                    <strong>Free cold-sealed clinical courier</strong> unlocked on this order.
                  </span>
                ) : (
                  <span>
                    Add <strong className="tabular-nums">₹{699 - summary.subtotal}</strong> more for
                    free temperature-controlled courier.
                  </span>
                )}
              </div>

              {/* Itemized Bowls */}
              <div className="space-y-3">
                {items.map((item) => {
                  const unitPrice =
                    item.meal.priceInr + item.addons.reduce((s, a) => s + a.priceDelta, 0);
                  return (
                    <div
                      key={item.key}
                      className="bg-white rounded-2xl border border-[#E8E4DC] p-3.5 flex gap-3.5"
                    >
                      <MealImage
                        src={item.meal.image}
                        alt={item.meal.name}
                        className="w-20 h-20 rounded-xl shrink-0"
                      />
                      <div className="min-w-0 flex-1 flex flex-col justify-between gap-2">
                        <div>
                          <p className="font-display text-sm font-semibold text-[#1F2937] leading-snug">
                            {item.meal.name}
                          </p>
                          {item.addons.length > 0 && (
                            <p className="text-[11px] text-[#135D43] mt-0.5 line-clamp-2">
                              + {item.addons.map((a) => a.label).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-sm font-bold text-[#0E3E2D] tabular-nums">
                            ₹{unitPrice * item.quantity}
                          </span>
                          <div className="inline-flex items-center gap-1 bg-[#F4F1EA] rounded-lg p-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, -1)}
                              aria-label={`Decrease quantity of ${item.meal.name}`}
                              className="w-8 h-8 rounded-md hover:bg-white flex items-center justify-center text-[#1F2937] cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums text-[#0E3E2D]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.key, 1)}
                              aria-label={`Increase quantity of ${item.meal.name}`}
                              className="w-8 h-8 rounded-md hover:bg-white flex items-center justify-center text-[#1F2937] cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Delivery Slot & Packaging */}
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.03em] text-[#4B5563]">
                  Courier Window
                </p>
                <div className="space-y-2">
                  {DELIVERY_WINDOWS.map((win) => (
                    <button
                      key={win}
                      type="button"
                      onClick={() => setDeliveryWindow(win)}
                      className={`w-full min-h-[42px] px-3.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between cursor-pointer ${
                        deliveryWindow === win
                          ? 'bg-[#EBF3F0] border-[#135D43] text-[#0E3E2D]'
                          : 'bg-white border-[#E8E4DC] text-[#4B5563]'
                      }`}
                    >
                      <span>{win}</span>
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          deliveryWindow === win
                            ? 'bg-[#135D43]'
                            : 'border border-[#9CA3AF]'
                        }`}
                      >
                        {deliveryWindow === win && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <ClinicalCheckbox
                  checked={steelTiffin}
                  onChange={() => setSteelTiffin((v) => !v)}
                  label="Steel Insulated Returnable Tiffin"
                  sublabel="Keeps food at optimal thermal range"
                  rightText="₹0"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-4 space-y-2 text-xs tabular-nums">
                <div className="flex justify-between text-[#4B5563]">
                  <span>Formulations Subtotal</span>
                  <span className="font-semibold text-[#1F2937]">₹{summary.subtotal}</span>
                </div>
                <div className="flex justify-between text-[#4B5563]">
                  <span>Clinical Cold-Chain Courier</span>
                  <span className="font-semibold text-[#135D43]">
                    {summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-[#4B5563]">
                  <span>GST (5%)</span>
                  <span className="font-semibold text-[#1F2937]">₹{summary.gst}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-[#E8E4DC] text-sm">
                  <span className="font-bold text-[#0E3E2D]">Total Payable</span>
                  <span className="font-display text-lg font-bold text-[#0E3E2D]">
                    ₹{summary.grandTotal}
                  </span>
                </div>
              </div>
            </>
          ) : (
            /* Step 2: Checkout Verification Form */
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
              <button
                type="button"
                onClick={() => setStep('bag')}
                className="text-xs font-semibold text-[#135D43] hover:underline cursor-pointer"
              >
                ← Edit bag items ({summary.totalCount})
              </button>

              <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="ck-name" className="block text-xs font-semibold text-[#1F2937]">
                    Recipient Name
                  </label>
                  <input
                    id="ck-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g., Siddharth Menon"
                    className="clinical-input w-full px-3.5 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ck-phone" className="block text-xs font-semibold text-[#1F2937]">
                    Mobile Number (+91)
                  </label>
                  <input
                    id="ck-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98450 67890"
                    className="clinical-input w-full px-3.5 text-sm tabular-nums"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ck-address" className="block text-xs font-semibold text-[#1F2937]">
                    Flat / Tower / Street Address
                  </label>
                  <input
                    id="ck-address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Flat 402, 100 Feet Road, Indiranagar"
                    className="clinical-input w-full px-3.5 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ck-pin" className="block text-xs font-semibold text-[#1F2937]">
                    PIN Code
                  </label>
                  <input
                    id="ck-pin"
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="560038"
                    className="clinical-input w-full px-3.5 text-sm tabular-nums"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-[#E8E4DC]">
                  <span className="block text-xs font-semibold text-[#1F2937]">Payment Method</span>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setPaymentMode('upi')}
                      className={`min-h-[44px] rounded-xl border text-xs font-semibold cursor-pointer ${
                        paymentMode === 'upi'
                          ? 'bg-[#EBF3F0] border-[#135D43] text-[#0E3E2D]'
                          : 'bg-white border-[#E8E4DC] text-[#4B5563]'
                      }`}
                    >
                      UPI / Card
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMode('cod')}
                      className={`min-h-[44px] rounded-xl border text-xs font-semibold cursor-pointer ${
                        paymentMode === 'cod'
                          ? 'bg-[#EBF3F0] border-[#135D43] text-[#0E3E2D]'
                          : 'bg-white border-[#E8E4DC] text-[#4B5563]'
                      }`}
                    >
                      Pay on Delivery
                    </button>
                  </div>
                </div>

                {errorMsg && <p className="text-xs font-semibold text-[#BA1A1A]">{errorMsg}</p>}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#4B5563] px-1">
                <ShieldCheck className="w-4 h-4 text-[#135D43] shrink-0" />
                <span>Includes printed batch QR &amp; macro slip inside sealed bag.</span>
              </div>
            </form>
          )}
        </div>

        {/* Sticky Bottom Conversion Bar */}
        {items.length > 0 && step !== 'confirmed' && (
          <div className="p-4 bg-white border-t border-[#E8E4DC] shrink-0">
            {step === 'bag' ? (
              <button
                type="button"
                onClick={() => setStep('checkout')}
                className="w-full min-h-[52px] rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer tabular-nums"
              >
                Proceed to Checkout · ₹{summary.grandTotal}
              </button>
            ) : (
              <button
                type="submit"
                form="checkout-form"
                className="w-full min-h-[52px] rounded-xl bg-[#D95D39] hover:bg-[#C24E2D] active:scale-[0.98] text-white text-sm font-semibold transition-all cursor-pointer tabular-nums"
              >
                Confirm Clinical Order · ₹{summary.grandTotal}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
