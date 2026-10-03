import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Phone,
  Sparkles,
  X,
  Send,
  ChevronRight,
  Clock,
  MapPin,
  Dumbbell,
  Users,
  RotateCcw,
  Navigation,
  MessageCircle,
  Tag,
  CreditCard
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BRAND } from '../../data/brand';

interface SupportWidgetProps {
  onOpenTrial?: () => void;
  onOpenEnquiry: (type?: string) => void;
  onOpenFAQ?: () => void;
}

interface ChatAction {
  type: 'trial' | 'enquiry' | 'whatsapp' | 'call' | 'link' | 'external';
  label: string;
  payload?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  action?: ChatAction;
  secondaryAction?: ChatAction;
}

interface QuickQuestion {
  id: string;
  label: string;
  query: string;
  icon: React.ComponentType<{ className?: string }>;
}

const QUICK_QUESTIONS: QuickQuestion[] = [
  { id: 'timings', label: 'GYM TIMINGS', query: 'What are the gym timings?', icon: Clock },
  { id: 'location', label: 'LOCATION', query: 'Where is Xing Fitness located?', icon: MapPin },
  { id: 'programs', label: 'PROGRAMS', query: 'What programs do you offer?', icon: Dumbbell },
  { id: 'memberships', label: 'MEMBERSHIPS', query: 'What memberships do you have?', icon: CreditCard },
  { id: 'offers', label: 'OFFERS', query: 'What offers are available?', icon: Tag },
  { id: 'trial', label: 'FREE TRIAL', query: 'How do I book a free trial?', icon: Sparkles },
  { id: 'pt', label: 'PERSONAL TRAINING', query: 'Do you offer personal training?', icon: Users },
  { id: 'contact', label: 'CONTACT', query: 'How do I contact the gym?', icon: Phone }
];

/**
 * Controlled Knowledge Base — ONLY Verified Xing Fitness Information
 * Never hallucinates, never invents unverified data.
 */
function getVerifiedAnswer(rawQuery: string): { text: string; action?: ChatAction; secondaryAction?: ChatAction } {
  const q = rawQuery.toLowerCase().trim();

  // 1. "What is Xing Fitness?" / General about
  if (
    q.includes('what is xing') ||
    q.includes('about xing') ||
    q.includes('who are you') ||
    q.includes('tell me about') ||
    q.includes('what kind of gym')
  ) {
    return {
      text: `Xing Fitness is a premium unisex gym and fitness club established in 2020, located in AECS Layout, Brookefield, Bengaluru.\n\nWe feature US-imported commercial Matrix strength & cardio equipment, certified personal training support, and dedicated workout zones for strength, cardio, and group classes.`,
      action: { type: 'link', label: 'Explore About Page', payload: '/about' },
      secondaryAction: { type: 'trial', label: 'Book 1-Day Trial' }
    };
  }

  // 2. "Where is Xing Fitness located?" / "How do I get directions?" / Location inquiries
  if (
    q.includes('location') ||
    q.includes('address') ||
    q.includes('where is') ||
    q.includes('where are') ||
    q.includes('directions') ||
    q.includes('how do i get') ||
    q.includes('how can i reach') ||
    q.includes('how to reach') ||
    q.includes('how to get') ||
    q.includes('map') ||
    q.includes('maps') ||
    q.includes('landmark') ||
    q.includes('reach') ||
    q.includes('located') ||
    q.includes('situated') ||
    q.includes('where are you') ||
    q.includes('where is the gym') ||
    q.includes('find the gym') ||
    q.includes('aecs') ||
    q.includes('brookefield')
  ) {
    return {
      text: `Xing Fitness is located at 4th Floor No, VV Arcade, 1st Cross Rd, above Kanti Sweets, B Block, AECS Layout, Brookefield, Bengaluru, Karnataka 560037.\n\n• Landmark: Above Kanti Sweets on 1st Cross Rd\n• Dedicated on-site parking for two-wheelers and four-wheelers with security\n• Convenient for members from AECS Layout, Brookefield, Kundalahalli, and Whitefield.`,
      action: { type: 'external', label: '📍 GET DIRECTIONS', payload: BRAND.googleMapsUrl },
      secondaryAction: { type: 'call', label: 'CALL RECEPTION' }
    };
  }

  // 3. "What are the gym timings?"
  if (
    q.includes('timing') ||
    q.includes('timings') ||
    q.includes('hour') ||
    q.includes('hours') ||
    q.includes('when do you open') ||
    q.includes('closing time') ||
    q.includes('opening time') ||
    q.includes('schedule') ||
    q.includes('sunday')
  ) {
    return {
      text: `Xing Fitness Gym Timings:\n• Monday – Saturday: 5:30 AM – 10:00 PM\n• Sunday: 11:00 AM – 08:00 PM\n\nFloor coaches are on duty during operating hours.`,
      action: { type: 'trial', label: 'Book Trial Pass' }
    };
  }

  // 4. "What is the phone number?" / "call"
  if (
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('telephone') ||
    q.includes('mobile number')
  ) {
    return {
      text: `Phone Number:\n8970000122 (or +91 8970000122)\n\nYou can call our front desk directly during working hours for immediate assistance.`,
      action: { type: 'call', label: 'CALL NOW: 8970000122' },
      secondaryAction: { type: 'whatsapp', label: 'WHATSAPP' }
    };
  }

  // 5. "What is the WhatsApp number?"
  if (q.includes('whatsapp') || q.includes('wa.me') || q.includes('chat')) {
    return {
      text: `WhatsApp Concierge:\n+91 8970000122\n\nYou can chat directly with our front desk team for inquiries, trial confirmations, and membership details.`,
      action: { type: 'whatsapp', label: 'WHATSAPP: +91 8970000122' }
    };
  }

  // 6. "What is the email?"
  if (q.includes('email') || q.includes('mail')) {
    return {
      text: `Official Email:\nxing.fitnessclub@gmail.com\n\nFor official inquiries, partnerships, or corporate memberships.`,
      action: { type: 'external', label: 'Send Email', payload: 'mailto:xing.fitnessclub@gmail.com' }
    };
  }

  // 7. "Where can I find you on Instagram?" / Social
  if (q.includes('instagram') || q.includes('insta') || q.includes('social')) {
    return {
      text: `Official Instagram:\nhttps://www.instagram.com/xing.fitnessclub\nHandle: @xing.fitnessclub\n\nFollow us for gym updates, workout snippets, and announcements.`,
      action: { type: 'external', label: 'Open Instagram', payload: BRAND.instagram }
    };
  }

  // 8. "How do I contact the gym?"
  if (q.includes('contact') || q.includes('reach you') || q.includes('front desk') || q.includes('reception')) {
    return {
      text: `Contact Xing Fitness:\n• Phone: 8970000122 (+91 8970000122)\n• WhatsApp: +91 8970000122\n• Email: xing.fitnessclub@gmail.com\n• Address: 4th Floor No, VV Arcade, 1st Cross Rd, above Kanti Sweets, B Block, AECS Layout, Brookefield, Bengaluru, Karnataka 560037.`,
      action: { type: 'call', label: 'CALL NOW' },
      secondaryAction: { type: 'whatsapp', label: 'WHATSAPP' }
    };
  }

  // 9. "What programs do you offer?"
  if (
    (q.includes('program') || q.includes('programs')) &&
    !q.includes('weight loss') &&
    !q.includes('strength')
  ) {
    return {
      text: `Xing Fitness offers three main program categories:\n\n1. Group Classes: HIIT, CrossFit, Zumba, Yoga, Functional Training & Group Fitness Classes\n2. Facility Memberships: Monthly, Quarterly, Half-Yearly, and Annual access\n3. Outcome Packages: Strength Training, Weight Loss Programs, and 1-on-1 Personal Training.`,
      action: { type: 'link', label: 'View All Programs', payload: '/programs' },
      secondaryAction: { type: 'enquiry', label: 'Enquire on Programs' }
    };
  }

  // 10. "Do you offer strength training?" / Equipment
  if (
    q.includes('strength') ||
    q.includes('weight training') ||
    q.includes('free weight') ||
    q.includes('dumbbell') ||
    q.includes('barbell') ||
    q.includes('bench') ||
    q.includes('matrix') ||
    q.includes('equipment')
  ) {
    return {
      text: `Yes! Xing Fitness features a dedicated Weight & Strength floor equipped with US-imported commercial Matrix machinery, selectorized weight towers, dual cable crossovers, heavy Olympic benches, and full matched dumbbell sets up to 40kg over impact-absorbing rubber flooring.`,
      action: { type: 'link', label: 'Explore Equipment Standards', payload: '/why-xing' },
      secondaryAction: { type: 'trial', label: 'Test Equipment In Free Trial' }
    };
  }

  // 11. "Do you offer weight loss programs?"
  if (q.includes('weight loss') || q.includes('fat loss') || q.includes('slim') || q.includes('burn fat')) {
    return {
      text: `Yes! We offer structured Weight Loss & Conditioning programs. These combine progressive resistance training to preserve lean muscle, cardio deck conditioning (commercial treadmills and bikes), and habit-based dietary guidance.`,
      action: { type: 'enquiry', label: 'Enquire for Weight Loss' },
      secondaryAction: { type: 'trial', label: 'Book 1-Day Trial' }
    };
  }

  // 12. "Do you offer personal training?" / Trainers
  if (
    q.includes('personal training') ||
    q.includes('personal trainer') ||
    q.includes('pt') ||
    q.includes('1 on 1') ||
    q.includes('one on one') ||
    q.includes('coach') ||
    q.includes('trainers')
  ) {
    return {
      text: `Yes! Xing Fitness provides 1-on-1 Personal Training with certified floor coaches. Coaches deliver comprehensive movement screening, posture assessment, real-time biomechanical technique correction, and tailored periodization for your goals.\n\nActive Offer: 20% OFF Personal Training currently available.`,
      action: { type: 'enquiry', label: 'Inquire About PT (20% Off)' },
      secondaryAction: { type: 'link', label: 'Meet Our Coaches', payload: '/about#trainers' }
    };
  }

  // 13. "Do you have HIIT?"
  if (q.includes('hiit') || q.includes('interval')) {
    return {
      text: `Yes! We conduct high-energy HIIT (High-Intensity Interval Training) sessions designed to build cardiovascular stamina and metabolic conditioning.\n\nActive Offer: ₹1,999 for 12 Sessions of Body Workouts & HIIT Classes.`,
      action: { type: 'enquiry', label: 'Claim 12 HIIT Sessions for ₹1,999' },
      secondaryAction: { type: 'link', label: 'View Group Classes', payload: '/programs#group-classes' }
    };
  }

  // 14. "Do you have CrossFit?"
  if (q.includes('crossfit') || q.includes('cross fit')) {
    return {
      text: `Yes! We offer CrossFit-style athletic conditioning and functional workouts focusing on multi-joint compound movements, metabolic circuits, and functional strength.`,
      action: { type: 'link', label: 'View Programs', payload: '/programs' }
    };
  }

  // 15. "Do you have Zumba?" / Dance
  if (q.includes('zumba') || q.includes('dance')) {
    return {
      text: `Yes! Zumba and dance fitness classes are held in our dedicated group fitness studio featuring sprung shock-absorbing flooring and dynamic ambient lighting.`,
      action: { type: 'link', label: 'Explore Studio Classes', payload: '/programs#group-classes' },
      secondaryAction: { type: 'trial', label: 'Book Free Trial' }
    };
  }

  // 16. "Do you have Yoga?"
  if (q.includes('yoga') || q.includes('stretch') || q.includes('flexibility')) {
    return {
      text: `Yes! We offer Yoga sessions in our dedicated group fitness studio, focusing on flexibility, mobility, breathwork, and mindful recovery.`,
      action: { type: 'link', label: 'Explore Studio Classes', payload: '/programs#group-classes' }
    };
  }

  // 17. "Do you have functional training?"
  if (q.includes('functional')) {
    return {
      text: `Yes! We provide functional training utilizing dual cable functional trainers, bodyweight suspension, free weights, and core conditioning for real-world athletic performance.`,
      action: { type: 'link', label: 'Explore Programs', payload: '/programs' }
    };
  }

  // 18. "Do you have group fitness?" / Classes
  if (q.includes('group fitness') || q.includes('group class') || q.includes('group classes')) {
    return {
      text: `Yes! Group fitness classes are hosted in our dedicated studio: HIIT, CrossFit, Zumba, Yoga, and Functional Conditioning. All classes take place in a separate studio space from the main weight floor.`,
      action: { type: 'link', label: 'View Group Classes', payload: '/programs#group-classes' }
    };
  }

  // 19. "What memberships do you have?"
  if (q.includes('membership') || q.includes('memberships') || q.includes('annual plan') || q.includes('subscription')) {
    return {
      text: `We offer four facility membership tiers:\n• Monthly Membership\n• Quarterly (3-Month) Membership\n• Half-Yearly (6-Month) Membership\n• Annual (12-Month) Membership\n\nAll memberships include full access to US-imported Matrix machinery, free weights floor, cardio deck, locker facilities, and shower amenities.\n\nActive Promotion: 30% OFF Annual Membership and up to 40% OFF Couples Annual Membership.`,
      action: { type: 'enquiry', label: 'Enquire for Membership' },
      secondaryAction: { type: 'link', label: 'View Membership Details', payload: '/programs#memberships' }
    };
  }

  // 20. Pricing inquiries (Never invent fake price numbers)
  if (q.includes('price') || q.includes('pricing') || q.includes('cost') || q.includes('fee') || q.includes('how much') || q.includes('rate')) {
    return {
      text: `Verified Membership Pricing Information:\nWe offer Monthly, Quarterly, Half-Yearly, and Annual access tiers. Current promotions include:\n• 30% OFF Annual Membership\n• Up to 40% OFF Couples Annual Membership\n• 20% OFF Personal Training\n• ₹1,999 for 12 Sessions of HIIT Classes\n\nFor exact current rates on specific durations, please contact our reception directly on WhatsApp or call our desk.`,
      action: { type: 'whatsapp', label: 'WHATSAPP FOR RATES' },
      secondaryAction: { type: 'call', label: 'CALL RECEPTION' }
    };
  }

  // 21. "What offers are available?"
  if (q.includes('offer') || q.includes('offers') || q.includes('discount') || q.includes('deal') || q.includes('promotion')) {
    return {
      text: `Current Official Xing Fitness Offers:\n1. 30% OFF Annual Membership\n2. Up to 40% OFF Couples Annual Membership\n3. 20% OFF Personal Training\n4. ₹1,999 — Body Workouts & HIIT Classes (12 Sessions)\n\nThese can be claimed through our Offers page or by contacting our front desk.`,
      action: { type: 'link', label: 'VIEW ALL 4 OFFERS', payload: '/offers' },
      secondaryAction: { type: 'enquiry', label: 'ENQUIRE ON AN OFFER' }
    };
  }

  // 22. "How do I book a free trial?"
  if (q.includes('free trial') || q.includes('trial') || q.includes('guest pass') || q.includes('test pass') || q.includes('demo')) {
    return {
      text: `You can claim a complimentary 1-Day Trial Pass! Experience our commercial Matrix equipment, tour our training zones, and speak directly with our coaches.`,
      action: { type: 'trial', label: 'BOOK FREE TRIAL PASS' }
    };
  }

  // 23. Parking
  if (q.includes('parking') || q.includes('car') || q.includes('bike') || q.includes('vehicle')) {
    return {
      text: `Yes! Xing Fitness provides dedicated on-site parking for both two-wheelers and four-wheelers with security on premises.`,
      action: { type: 'external', label: '📍 GET DIRECTIONS', payload: BRAND.googleMapsUrl }
    };
  }

  // 24. App / Progress tracking
  if (q.includes('app') || q.includes('track') || q.includes('progress') || q.includes('portal')) {
    return {
      text: `Members can track body weight, BMI trends, and fitness goals directly through our mobile-ready member portal at /member/progress.`,
      action: { type: 'link', label: 'Open Member Portal', payload: '/member/progress' }
    };
  }

  // 25. Medical advice / Unverified policies guardrail
  if (q.includes('pain') || q.includes('injury') || q.includes('medicine') || q.includes('supplement') || q.includes('steroid') || q.includes('diet chart')) {
    return {
      text: `Our coaches provide exercise movement guidance and form screening, but we do not provide medical diagnosis or prescriptive medical advice. Please consult a qualified physician or healthcare provider for specific medical guidance.`,
      action: { type: 'whatsapp', label: 'Contact Reception for Queries' }
    };
  }

  // 26. STRICT FALLBACK — Never hallucinate
  return {
    text: `I don't have verified information about that yet. Please contact Xing Fitness directly through WhatsApp or call the reception.`,
    action: { type: 'whatsapp', label: 'WHATSAPP RECEPTION' },
    secondaryAction: { type: 'call', label: 'CALL RECEPTION NOW' }
  };
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'msg-welcome',
  sender: 'assistant',
  text: `Hello! Welcome to Xing Fitness Brookefield.\n\nI can answer questions about our gym timings, location, US-imported equipment, separate training zones, programs, memberships, and current offers. Select a quick question below or type your inquiry.`
};

export const SupportWidget: React.FC<SupportWidgetProps> = ({
  onOpenTrial,
  onOpenEnquiry
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Scroll to bottom on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // 1. Lock background page scroll when chatbot is open & preserve scroll position
  useEffect(() => {
    if (!isOpen) return;

    // Record current scroll position
    const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Save previous styles
    const prevBodyPaddingRight = document.body.style.paddingRight;
    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyPosition = document.body.style.position;
    const prevBodyTop = document.body.style.top;
    const prevBodyLeft = document.body.style.left;
    const prevBodyRight = document.body.style.right;
    const prevBodyWidth = document.body.style.width;
    const prevHtmlScrollBehavior = document.documentElement.style.scrollBehavior;

    // Lock body
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    return () => {
      // Restore previous styles
      document.body.style.position = prevBodyPosition;
      document.body.style.top = prevBodyTop;
      document.body.style.left = prevBodyLeft;
      document.body.style.right = prevBodyRight;
      document.body.style.width = prevBodyWidth;
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.paddingRight = prevBodyPaddingRight;

      // Restore exact scroll position without smooth scroll animation jump
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, scrollY);
      document.documentElement.style.scrollBehavior = prevHtmlScrollBehavior;
    };
  }, [isOpen]);

  // 2. Outside click / pointerdown detection to close chatbot
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent | PointerEvent) => {
      const target = e.target as Node | null;
      if (!target) return;

      // Ignore clicks inside the chat panel
      if (panelRef.current && panelRef.current.contains(target)) {
        return;
      }

      // Ignore clicks on the trigger button (handled by trigger button's onClick)
      if (triggerButtonRef.current && triggerButtonRef.current.contains(target)) {
        return;
      }

      // Any click outside closes the chatbot
      setIsOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen]);

  // 3. Escape key closes chat and restores focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        triggerButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSelectQuickQuestion = (qq: QuickQuestion) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: qq.query
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const result = getVerifiedAnswer(qq.query);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: result.text,
        action: result.action,
        secondaryAction: result.secondaryAction
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 200);
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputValue.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const result = getVerifiedAnswer(query);
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: result.text,
        action: result.action,
        secondaryAction: result.secondaryAction
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 220);
  };

  const handleExecuteAction = (action?: ChatAction) => {
    if (!action) return;

    if (action.type === 'trial') {
      setIsOpen(false);
      onOpenTrial?.();
    } else if (action.type === 'enquiry') {
      setIsOpen(false);
      onOpenEnquiry(action.label);
    } else if (action.type === 'whatsapp') {
      window.open(BRAND.whatsappUrl, '_blank', 'noopener,noreferrer');
    } else if (action.type === 'call') {
      window.location.href = BRAND.phoneRaw;
    } else if (action.type === 'link' && action.payload) {
      setIsOpen(false);
      navigate(action.payload);
    } else if (action.type === 'external' && action.payload) {
      window.open(action.payload, '_blank', 'noopener,noreferrer');
    }
  };

  const handleResetChat = () => {
    setMessages([INITIAL_MESSAGE]);
  };

  return (
    <>
      {/* Background Overlay / Outside Click Area when Chat is Open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[0.5px] transition-opacity animate-in fade-in duration-150 print:hidden cursor-pointer"
          onClick={() => setIsOpen(false)}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-hidden="true"
          style={{ touchAction: 'none', overscrollBehavior: 'contain' }}
        />
      )}

      {/* Floating Concierge Container */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 print:hidden select-none">
        {/* Interactive Chat Panel */}
        {isOpen && (
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Xing Fitness Concierge Chat"
            className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] h-[520px] max-h-[calc(100dvh-5.5rem)] sm:h-[550px] max-w-sm bg-[#0E1218]/98 border-2 border-[#D4AF37]/40 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#141923] border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-black/70 border border-[#D4AF37]/50 flex items-center justify-center p-1 shadow-md shrink-0">
                  <img
                    src="/images/branding/xing-fitness-logo.png"
                    alt="Xing Fitness"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                    <h4 className="font-display font-bold text-xs sm:text-sm text-white leading-tight">
                      Xing Fitness Concierge
                    </h4>
                  </div>
                  <p className="text-[10px] text-[#8F9CAE]">Brookefield Desk • Verified Information</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleResetChat}
                  title="Restart Chat"
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Restart chat"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions Header Strip: CALL NOW, WHATSAPP, GET DIRECTIONS */}
            <div className="px-3 py-2 bg-[#090C10] border-b border-white/5 grid grid-cols-3 gap-1.5 text-[10px] font-bold uppercase tracking-wider shrink-0">
              <a
                href={BRAND.phoneRaw}
                className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-1 transition-colors text-center"
              >
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                <span>CALL NOW</span>
              </a>
              <a
                href={BRAND.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-1 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#25D366] flex items-center justify-center gap-1 transition-colors text-center"
              >
                <MessageCircle className="w-3 h-3" />
                <span>WHATSAPP</span>
              </a>
              <a
                href={BRAND.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-1 px-1 rounded-lg bg-white/5 hover:bg-white/10 text-white flex items-center justify-center gap-1 transition-colors text-center"
              >
                <Navigation className="w-3 h-3 text-[#D4AF37]" />
                <span>DIRECTIONS</span>
              </a>
            </div>

            {/* Messages Container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3.5 text-xs touch-pan-y"
              style={{
                overscrollBehavior: 'contain',
                WebkitOverflowScrolling: 'touch'
              }}
              onWheel={(e) => e.stopPropagation()}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] px-3.5 py-2.5 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-[#D4AF37] text-black font-semibold rounded-tr-xs shadow-md shadow-[#D4AF37]/10'
                        : 'bg-[#151922] text-gray-200 border border-white/10 rounded-tl-xs space-y-2'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed text-[11px] sm:text-xs">
                      {msg.text}
                    </p>

                    {/* Contextual Action Buttons */}
                    {(msg.action || msg.secondaryAction) && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {msg.action && (
                          <button
                            type="button"
                            onClick={() => handleExecuteAction(msg.action)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-display font-bold text-[10px] uppercase tracking-wider hover:bg-[#C5A028] transition-all shadow-sm cursor-pointer"
                          >
                            <span>{msg.action.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                        {msg.secondaryAction && (
                          <button
                            type="button"
                            onClick={() => handleExecuteAction(msg.secondaryAction)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-display font-bold text-[10px] uppercase tracking-wider transition-all cursor-pointer"
                          >
                            <span>{msg.secondaryAction.label}</span>
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-1 p-2 bg-[#151922] border border-white/10 rounded-xl w-14">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-bounce [animation-delay:0.3s]" />
                </div>
              )}

              {/* 8 Quick Question Buttons */}
              {messages.length <= 4 && (
                <div className="pt-2 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] block">
                    Quick Questions
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUICK_QUESTIONS.map((qq) => {
                      const QIcon = qq.icon;
                      return (
                        <button
                          key={qq.id}
                          type="button"
                          onClick={() => handleSelectQuickQuestion(qq)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-[#D4AF37]/15 text-gray-300 hover:text-white border border-white/10 hover:border-[#D4AF37]/40 transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer text-left truncate"
                        >
                          <QIcon className="w-3 h-3 text-[#D4AF37] shrink-0" />
                          <span className="truncate">{qq.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Text Input Bar */}
            <form
              onSubmit={handleSendMessage}
              className="p-2.5 bg-[#0A0D12] border-t border-white/10 flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask timings, location, offers, trial..."
                className="flex-1 bg-white/5 border border-white/10 focus:border-[#D4AF37] rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                aria-label="Ask a question"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-8 h-8 rounded-xl bg-[#D4AF37] disabled:opacity-30 disabled:cursor-not-allowed text-black flex items-center justify-center font-bold hover:bg-[#C5A028] transition-all shrink-0 cursor-pointer"
                aria-label="Send question"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Main Trigger Pill / Bubble */}
        <button
          ref={triggerButtonRef}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#141923] hover:bg-[#1E2430] text-white border-2 border-[#D4AF37]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer"
          aria-label={isOpen ? 'Close Concierge' : 'Need Help? Chat with Xing Concierge'}
          aria-expanded={isOpen}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D4AF37]"></span>
          </span>
          <span className="font-display font-bold text-[11px] sm:text-xs tracking-wider uppercase text-white group-hover:text-[#D4AF37] transition-colors">
            {isOpen ? 'Close' : 'Chat Assistant'}
          </span>
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
        </button>
      </div>
    </>
  );
};
