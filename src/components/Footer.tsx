import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export interface FooterProps {
  setCurrentView?: (v: any) => void;
  className?: string;
  isCinematic?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ 
  setCurrentView, 
  className = '',
  isCinematic = false 
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNavigate = (view: string) => {
    if (setCurrentView) {
      setCurrentView(view);
    }
    // Also dispatch custom event for cross-tree navigation
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('orient:navigate', { detail: view }));
      const mainContainer = document.getElementById('main-scroll-container');
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 4000);
  };

  return (
    <footer 
      id="orient-footer"
      className={`w-full bg-background text-foreground border-t border-transparent relative flex flex-col justify-center transition-colors duration-500 ${
        isCinematic 
          ? 'min-h-screen lg:h-screen py-20 lg:py-0' 
          : 'py-16 md:py-20 lg:py-24'
      } ${className}`}
    >
      <div className="max-w-[90vw] lg:max-w-[67vw] mx-auto px-4 md:px-8 lg:px-12 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-16">
          {/* Brand & Socials */}
          <div className="col-span-1 lg:col-span-2">
            <div 
              className="flex items-center gap-2.5 mb-5 cursor-pointer inline-flex group"
              onClick={() => handleNavigate('home')}
            >
              <span className="font-heading font-black text-3xl tracking-tight text-primary uppercase group-hover:scale-105 transition-transform">
                Orient
              </span>
              <span className="text-sm lg:text-base tracking-[0.18em] uppercase px-3 py-1 rounded-lg bg-primary/10 text-primary font-medium leading-none border-0">
                Global
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-medium max-w-sm">
              Redefining lifestyle standards in Plateau State. A convergence of culinary art, premium retail, and luxury entertainment environments.
            </p>
            <div className="flex gap-3">
              {[
                { icon: 'facebook', label: 'Facebook' },
                { icon: 'camera_alt', label: 'Instagram' },
                { icon: 'alternate_email', label: 'Email' },
                { icon: 'business', label: 'LinkedIn' }
              ].map(social => (
                <a 
                  key={social.icon} 
                  className="w-9 h-9 lg:w-10 lg:h-10 rounded-xl bg-card text-foreground hover:bg-primary hover:text-white flex items-center justify-center transition-all shadow-soft border-0 active:scale-95" 
                  href="#" 
                  aria-label={social.label}
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="material-icons text-base lg:text-lg">{social.icon}</i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Divisions */}
          <div>
            <h3 className="text-foreground font-black uppercase tracking-[0.2em] mb-5 text-xs">
              Divisions
            </h3>
            <ul className="space-y-2.5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              {[
                { name: 'The Bakery', view: 'bakery' },
                { name: 'Supermarket', view: 'supermarket' },
                { name: 'Restaurant', view: 'dining' },
                { name: 'Gaming Arena', view: 'games' },
                { name: 'Orient Water', view: 'water' },
                { name: 'VIP Lounge', view: 'lounge' }
              ].map(li => (
                <li key={li.name}>
                  <button 
                    type="button"
                    onClick={() => handleNavigate(li.view)} 
                    className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] text-left hover:translate-x-1 duration-200 block"
                  >
                    {li.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Corporate */}
          <div>
            <h3 className="text-foreground font-black uppercase tracking-[0.2em] mb-5 text-xs">
              Corporate
            </h3>
            <ul className="space-y-2.5 text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
              {[
                { name: 'About Us', view: 'about' },
                { name: 'Careers', href: '#' },
                { name: 'Investor Relations', href: '#' },
                { name: 'Press & Media', href: '#' },
                { name: 'Management Portal', view: 'admin' },
                { name: 'Staff Sign In', view: 'login' },
              ].map(li => (
                <li key={li.name}>
                  {li.view ? (
                    <button 
                      type="button"
                      onClick={() => handleNavigate(li.view)}
                      className="hover:text-primary transition-colors uppercase tracking-widest text-[10px] text-left hover:translate-x-1 duration-200 block"
                    >
                      {li.name}
                    </button>
                  ) : (
                    <a 
                      className="hover:text-primary transition-colors hover:translate-x-1 duration-200 block" 
                      href={li.href || '#'}
                      onClick={(e) => { if (!li.href || li.href === '#') e.preventDefault(); }}
                    >
                      {li.name}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-foreground font-black uppercase tracking-[0.2em] mb-5 text-xs">
              Newsletter
            </h3>
            <p className="text-xs text-muted-foreground mb-4 leading-relaxed font-medium">
              Subscribe to receive corporate updates and exclusive departmental offerings.
            </p>
            <form onSubmit={handleSubscribe} className="w-full">
              <div className="flex items-center w-full bg-card rounded-xl p-1.5 transition-all shadow-soft border-0">
                <input 
                  className="flex-1 bg-transparent py-1.5 sm:py-2 px-3 text-foreground placeholder-muted-foreground focus:outline-none text-xs font-medium min-w-0 border-0 outline-none" 
                  placeholder="Email Address" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button 
                  type="submit"
                  aria-label="Subscribe"
                  className="h-8 w-8 sm:h-9 sm:w-9 bg-primary text-white rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-primary/20 flex items-center justify-center shrink-0 cursor-pointer active:scale-95 border-0"
                >
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </form>
            {subscribed && (
              <p className="text-[11px] text-emerald-500 mt-2.5 font-semibold flex items-center gap-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Thank you for subscribing!
              </p>
            )}
            <p className="text-[9px] text-muted-foreground mt-3 uppercase tracking-widest font-bold">
              Protected by Orient Purity & Privacy Standards.
            </p>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-transparent pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-bold">
          <p>© {new Date().getFullYear()} Orient Global Services Ltd. All rights reserved.</p>
          <div className="flex gap-5 flex-wrap justify-center">
            <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Cookie Policy</a>
            <a className="hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Security & Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
