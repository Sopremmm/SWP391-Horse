import React from "react";
import ReactDOM from "react-dom/client";
import App from './App.tsx';
import { Link } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
function CalendarIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="rounded-[4px] border border-racing-border/40 bg-racing-muted flex-shrink-0">
      <rect width="48" height="48" rx="4" fill="#EFEEEB"/>
      <rect x="0.5" y="0.5" width="47" height="47" rx="3.5" stroke="#C0C9C0" strokeOpacity="0.4"/>
      <path d="M17 34C16.45 34 15.9792 33.8042 15.5875 33.4125C15.1958 33.0208 15 32.55 15 32V18C15 17.45 15.1958 16.9792 15.5875 16.5875C15.9792 16.1958 16.45 16 17 16H18V14H20V16H28V14H30V16H31C31.55 16 32.0208 16.1958 32.4125 16.5875C32.8042 16.9792 33 17.45 33 18V32C33 32.55 32.8042 33.0208 32.4125 33.4125C32.0208 33.8042 31.55 34 31 34H17ZM17 32H31V22H17V32ZM17 20H31V18H17V20ZM24 26C23.7167 26 23.4792 25.9042 23.2875 25.7125C23.0958 25.5208 23 25.2833 23 25C23 24.7167 23.0958 24.4792 23.2875 24.2875C23.4792 24.0958 23.7167 24 24 24C24.2833 24 24.5208 24.0958 24.7125 24.2875C24.9042 24.4792 25 24.7167 25 25C25 25.2833 24.9042 25.5208 24.7125 25.7125C24.5208 25.9042 24.2833 26 24 26ZM20 26C19.7167 26 19.4792 25.9042 19.2875 25.7125C19.0958 25.5208 19 25.2833 19 25C19 24.7167 19.0958 24.4792 19.2875 24.2875C19.4792 24.0958 19.7167 24 20 24C20.2833 24 20.5208 24.0958 20.7125 24.2875C20.9042 24.4792 21 24.7167 21 25C21 25.2833 20.9042 25.5208 20.7125 25.7125C20.5208 25.9042 20.2833 26 20 26ZM28 26C27.7167 26 27.4792 25.9042 27.2875 25.7125C27.0958 25.5208 27 25.2833 27 25C27 24.7167 27.0958 24.4792 27.2875 24.2875C27.4792 24.0958 27.7167 24 28 24C28.2833 24 28.5208 24.0958 28.7125 24.2875C28.9042 24.4792 29 24.7167 29 25C29 25.2833 28.9042 25.5208 28.7125 25.7125C28.5208 25.9042 28.2833 26 28 26ZM24 30C23.7167 30 23.4792 29.9042 23.2875 29.7125C23.0958 29.5208 23 29.2833 23 29C23 28.7167 23.0958 28.4792 23.2875 28.2875C23.4792 28.0958 23.7167 28 24 28C24.2833 28 24.5208 28.0958 24.7125 28.2875C24.9042 28.4792 25 28.7167 25 29C25 29.2833 24.9042 29.5208 24.7125 29.7125C24.5208 29.9042 24.2833 30 24 30ZM20 30C19.7167 30 19.4792 29.9042 19.2875 29.7125C19.0958 29.5208 19 29.2833 19 29C19 28.7167 19.0958 28.4792 19.2875 28.2875C19.4792 28.0958 19.7167 28 20 28C20.2833 28 20.5208 28.0958 20.7125 28.2875C20.9042 28.4792 21 28.7167 21 29C21 29.2833 20.9042 29.5208 20.7125 29.7125C20.5208 29.9042 20.2833 30 20 30ZM28 30C27.7167 30 27.4792 29.9042 27.2875 29.7125C27.0958 29.5208 27 29.2833 27 29C27 28.7167 27.0958 28.4792 27.2875 28.2875C27.4792 28.0958 27.7167 28 28 28C28.2833 28 28.5208 28.0958 28.7125 28.2875C28.9042 28.4792 29 28.7167 29 29C29 29.2833 28.9042 29.5208 28.7125 29.7125C28.5208 29.9042 28.2833 30 28 30Z" fill="#002A15"/>
    </svg>
  );
}

interface RaceCardProps {
  date: string;
  urgencyIcon: "clock" | "calendar-x";
  urgencyText: string;
  raceName: string;
  location: string;
  horse: string;
}

function UrgencyClockIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path d="M4.5 1.5V0H9V1.5H4.5ZM6 9.75H7.5V5.25H6V9.75ZM6.75 15.75C5.825 15.75 4.95312 15.5719 4.13438 15.2156C3.31563 14.8594 2.6 14.375 1.9875 13.7625C1.375 13.15 0.890625 12.4344 0.534375 11.6156C0.178125 10.7969 0 9.925 0 9C0 8.075 0.178125 7.20312 0.534375 6.38438C0.890625 5.56563 1.375 4.85 1.9875 4.2375C2.6 3.625 3.31563 3.14062 4.13438 2.78437C4.95312 2.42812 5.825 2.25 6.75 2.25C7.525 2.25 8.26875 2.375 8.98125 2.625C9.69375 2.875 10.3625 3.2375 10.9875 3.7125L12.0375 2.6625L13.0875 3.7125L12.0375 4.7625C12.5125 5.3875 12.875 6.05625 13.125 6.76875C13.375 7.48125 13.5 8.225 13.5 9C13.5 9.925 13.3219 10.7969 12.9656 11.6156C12.6094 12.4344 12.125 13.15 11.5125 13.7625C10.9 14.375 10.1844 14.8594 9.36563 15.2156C8.54688 15.5719 7.675 15.75 6.75 15.75ZM6.75 14.25C8.2 14.25 9.4375 13.7375 10.4625 12.7125C11.4875 11.6875 12 10.45 12 9C12 7.55 11.4875 6.3125 10.4625 5.2875C9.4375 4.2625 8.2 3.75 6.75 3.75C5.3 3.75 4.0625 4.2625 3.0375 5.2875C2.0125 6.3125 1.5 7.55 1.5 9C1.5 10.45 2.0125 11.6875 3.0375 12.7125C4.0625 13.7375 5.3 14.25 6.75 14.25Z" fill="#BA1A1A"/>
    </svg>
  );
}

function UrgencyCalendarXIcon() {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path d="M5.025 12.525L3.975 11.475L5.7 9.75L3.975 8.025L5.025 6.975L6.75 8.7L8.475 6.975L9.525 8.025L7.8 9.75L9.525 11.475L8.475 12.525L6.75 10.8L5.025 12.525ZM1.5 15C1.0875 15 0.734375 14.8531 0.440625 14.5594C0.146875 14.2656 0 13.9125 0 13.5V3C0 2.5875 0.146875 2.23438 0.440625 1.94062C0.734375 1.64687 1.0875 1.5 1.5 1.5H2.25V0H3.75V1.5H9.75V0H11.25V1.5H12C12.4125 1.5 12.7656 1.64687 13.0594 1.94062C13.3531 2.23438 13.5 2.5875 13.5 3V13.5C13.5 13.9125 13.3531 14.2656 13.0594 14.5594C12.7656 14.8531 12.4125 15 12 15H1.5ZM1.5 13.5H12V6H1.5V13.5ZM1.5 4.5H12V3H1.5V4.5Z" fill="#BA1A1A"/>
    </svg>
  );
}

function RaceCard({ date, urgencyIcon, urgencyText, raceName, location, horse }: RaceCardProps) {
  return (
    <div className="flex flex-col p-8 border border-racing-border/40 bg-racing-bg">
      <div className="flex justify-between items-start pb-8">
        <CalendarIcon />
        <span className="text-racing-gold-dark text-xs font-bold tracking-[0.6px]">{date}</span>
      </div>
      <div className="flex items-center gap-2 pb-5">
        {urgencyIcon === "clock" ? <UrgencyClockIcon /> : <UrgencyCalendarXIcon />}
        <span className="text-racing-red text-xs font-bold tracking-[0.6px] uppercase">{urgencyText}</span>
      </div>
      <div className="pb-2">
        <h4 className="text-racing-green font-serif text-2xl font-medium leading-8">{raceName}</h4>
      </div>
      <div className="pb-8 flex-1">
        <p className="text-racing-text text-sm">{location}</p>
      </div>
      <div className="flex justify-between items-center pt-6 border-t border-racing-border/40">
        <span className="text-racing-text text-xs font-semibold tracking-[0.6px] uppercase">Participating</span>
        <span className="text-racing-green text-sm font-bold">{horse}</span>
      </div>
    </div>
  );
}

export default function Index() {
  return (
    <div className="min-h-screen bg-racing-bg flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-20 flex items-center border-b border-racing-border/30 bg-racing-bg">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-16 flex justify-between items-center">
          <div className="flex items-center gap-8 md:gap-12">
            <Link to="/">
              <span className="font-serif text-racing-green text-2xl font-medium tracking-tight">Heritage Racing</span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link to="/" className="flex px-5 py-2 rounded-xl bg-racing-green shadow-sm">
                <span className="text-white text-sm font-normal">Home</span>
              </Link>
              <Link to="/tournament" className="flex px-4 py-2">
                <span className="text-racing-text text-sm">Tournament</span>
              </Link>
              <Link to="/horses" className="flex px-4 py-2">
                <span className="text-racing-text text-sm">My Horses</span>
              </Link>
              <Link to="/jockey" className="flex px-4 py-2">
                <span className="text-racing-text text-sm">Hire Jockey</span>
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-racing-text hover:text-racing-green transition-colors" aria-label="Notifications">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#404942"/>
              </svg>
            </button>
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/69cd9a48aa892a4aa66deabad47ced7bd57d7509?width=80"
              alt="User avatar"
              className="w-10 h-10 rounded-xl border border-racing-border object-cover"
            />
            {/* Mobile menu button */}
            <button className="md:hidden text-racing-text" aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-6 md:px-16 py-16 md:py-24 flex flex-col gap-16">

        {/* Welcome Section */}
        <section className="flex flex-col gap-3 pt-8">
          <p className="text-racing-gold-dark text-xs font-bold tracking-[2.4px] uppercase">Owner Dashboard</p>
          <h1 className="font-serif text-racing-green text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
            Welcome back, Arthur.
          </h1>
          <p className="text-racing-text text-base leading-relaxed max-w-2xl pt-3">
            Your stable is currently at peak performance. Three of your thoroughbreds are registered for upcoming
            stakes, and the training reports show exceptional progress.
          </p>
        </section>

        {/* Featured Race Hero Card */}
        <section className="relative overflow-hidden rounded-sm shadow-racing-lg border border-white/10 h-[420px] md:h-[540px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/3631d6e8854cdf27cd8520e6efb64f987dc3b233?width=2300"
            alt="Featured Horse Race"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0" style={{background: "linear-gradient(0deg, rgba(0,42,21,0.95) 0%, rgba(0,42,21,0.40) 50%, rgba(0,42,21,0.00) 100%)"}} />

          {/* Content overlay */}
          <div className="absolute inset-0 flex flex-col md:flex-row items-end justify-between p-6 md:p-12 gap-6">
            {/* Left: Race info */}
            <div className="flex flex-col gap-6 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-4">
                <span className="px-4 py-1 rounded-xl bg-racing-gold text-racing-gold-darker text-xs font-bold tracking-[0.6px]">
                  UPCOMING FEATURE
                </span>
                <div className="flex items-center gap-2">
                  <svg width="14" height="17" viewBox="0 0 14 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.66667 8.33333C7.125 8.33333 7.51736 8.17014 7.84375 7.84375C8.17014 7.51736 8.33333 7.125 8.33333 6.66667C8.33333 6.20833 8.17014 5.81597 7.84375 5.48958C7.51736 5.16319 7.125 5 6.66667 5C6.20833 5 5.81597 5.16319 5.48958 5.48958C5.16319 5.81597 5 6.20833 5 6.66667C5 7.125 5.16319 7.51736 5.48958 7.84375C5.81597 8.17014 6.20833 8.33333 6.66667 8.33333ZM6.66667 14.4583C8.36111 12.9028 9.61806 11.4896 10.4375 10.2188C11.2569 8.94792 11.6667 7.81944 11.6667 6.83333C11.6667 5.31944 11.184 4.07986 10.2188 3.11458C9.25347 2.14931 8.06944 1.66667 6.66667 1.66667C5.26389 1.66667 4.07986 2.14931 3.11458 3.11458C2.14931 4.07986 1.66667 5.31944 1.66667 6.83333C1.66667 7.81944 2.07639 8.94792 2.89583 10.2188C3.71528 11.4896 4.97222 12.9028 6.66667 14.4583ZM6.66667 16.6667C4.43056 14.7639 2.76042 12.9965 1.65625 11.3646C0.552083 9.73264 0 8.22222 0 6.83333C0 4.75 0.670139 3.09028 2.01042 1.85417C3.35069 0.618055 4.90278 0 6.66667 0C8.43056 0 9.98264 0.618055 11.3229 1.85417C12.6632 3.09028 13.3333 4.75 13.3333 6.83333C13.3333 8.22222 12.7812 9.73264 11.6771 11.3646C10.5729 12.9965 8.90278 14.7639 6.66667 16.6667Z" fill="white" fillOpacity="0.9"/>
                  </svg>
                  <span className="text-white/90 text-sm">Ascot, United Kingdom</span>
                </div>
              </div>
              <h2 className="font-serif text-white text-3xl md:text-5xl font-semibold leading-tight tracking-tight">
                The Royal Heritage Cup
              </h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-md">
                A Class 1 Group 1 international flat race for horses aged three years
                and older. Your stallion, 'Midnight Sovereign', is currently the second favorite.
              </p>
            </div>

            {/* Right: Prize pool card */}
            <div className="w-full md:w-auto md:min-w-[320px] flex flex-col gap-4 p-8 rounded-sm border border-white/20 backdrop-blur-md" style={{background: "rgba(255,255,255,0.10)"}}>
              <div className="flex justify-between items-center">
                <span className="text-racing-gold text-xs font-bold tracking-[1.2px] uppercase">Prize Pool</span>
                <span className="px-3 py-1 rounded-sm bg-racing-red text-white text-xs font-bold tracking-[0.6px] uppercase">Starts in 48H</span>
              </div>
              <div className="pb-6 border-b border-white/10">
                <span className="font-garamond text-white text-4xl md:text-5xl font-medium leading-none">£2,500,000</span>
              </div>
              <div className="flex flex-col gap-1 py-4">
                <span className="text-racing-gold text-xs font-bold tracking-[0.6px] uppercase">Race Date</span>
                <span className="text-white text-xl font-semibold">June 24, 2024</span>
              </div>
              <button className="w-full py-4 bg-racing-gold text-racing-gold-darker text-xl font-bold text-center shadow-racing-md hover:bg-racing-gold/90 transition-colors">
                View Race Details
              </button>
            </div>
          </div>
        </section>

        {/* Subsequent Entries Section */}
        <section className="flex flex-col gap-10">
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-1">
              <h3 className="font-serif text-racing-green text-3xl font-semibold">Subsequent Entries</h3>
              <p className="text-racing-text text-sm">Your registered schedule for the next 30 days.</p>
            </div>
            <button className="flex items-center gap-2 group">
              <span className="text-racing-gold-dark text-xs font-bold tracking-[0.6px] group-hover:underline">VIEW FULL CALENDAR</span>
              <svg width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.45 4.5L0 1.05L1.05 0L5.55 4.5L1.05 9L0 7.95L3.45 4.5Z" fill="#775A19"/>
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <RaceCard
              date="JULY 02"
              urgencyIcon="clock"
              urgencyText="CLOSES IN 2 DAYS"
              raceName="Longchamp Grand Prix"
              location="Paris, France • Class 2 Stakes"
              horse="Noble Grace"
            />
            <RaceCard
              date="JULY 15"
              urgencyIcon="calendar-x"
              urgencyText="ENDS JUNE 20"
              raceName="The Kentucky Invitation"
              location="Lexington, USA • Grade 1 Stakes"
              horse="Empire Gold"
            />
            <RaceCard
              date="AUGUST 05"
              urgencyIcon="clock"
              urgencyText="ENDS JULY 25"
              raceName="Sandown Classic"
              location="Melbourne, AUS • Group 3 Flat"
              horse="Thunderclap"
            />
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative overflow-hidden rounded-sm bg-racing-green shadow-racing-lg">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/a5b3057c93bcff1b7b2956ad079ac811805e20b1?width=2304"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
          />
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-12 p-10 md:p-16">
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-racing-gold text-5xl font-semibold tracking-tight">12</span>
              <span className="text-[rgba(180,240,199,0.80)] text-xs font-bold tracking-[1.2px] uppercase text-center">Active Thoroughbreds</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-racing-gold text-5xl font-semibold tracking-tight">08</span>
              <span className="text-[rgba(180,240,199,0.80)] text-xs font-bold tracking-[1.2px] uppercase text-center">Stakes Wins</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="font-serif text-racing-gold text-5xl font-semibold tracking-tight">£4.2M</span>
              <span className="text-[rgba(180,240,199,0.80)] text-xs font-bold tracking-[1.2px] uppercase text-center">Season Earnings</span>
            </div>
            <div className="flex items-center justify-center">
              <button className="bg-white text-racing-green text-sm font-bold py-5 px-8 shadow-racing-xl hover:bg-racing-bg transition-colors text-center leading-tight">
                Generate Performance<br />Report
              </button>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-racing-border/30 bg-white">
        <div className="w-full max-w-[1280px] mx-auto px-6 md:px-16 py-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex flex-col gap-3">
            <span className="font-serif text-racing-green text-3xl font-semibold">Heritage Racing</span>
            <p className="text-racing-text text-sm leading-relaxed max-w-xs">
              Elevating the legacy of equestrian management
              through precision, tradition, and performance.
            </p>
          </div>
          <div className="flex flex-col items-start md:items-end gap-8">
            <nav className="flex flex-wrap gap-6 md:gap-10">
              <a href="#" className="text-racing-text text-sm font-medium hover:text-racing-green transition-colors">Privacy Policy</a>
              <a href="#" className="text-racing-text text-sm font-medium hover:text-racing-green transition-colors">Terms of Service</a>
              <a href="#" className="text-racing-text text-sm font-medium hover:text-racing-green transition-colors">Contact Support</a>
              <a href="#" className="text-racing-text text-sm font-medium hover:text-racing-green transition-colors">About Us</a>
            </nav>
            <p className="text-racing-text/70 text-sm">© 2024 Heritage Racing Management. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* FAB */}
      <div className="fixed bottom-10 right-10 z-50">
        <button
          className="w-16 h-16 bg-racing-gold-dark rounded-xl flex items-center justify-center shadow-racing-lg hover:bg-racing-gold-dark/90 transition-colors"
          aria-label="Quick action"
        >
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H0V9H9V0H12V9H21V12H12V21H9V12Z" fill="white"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
