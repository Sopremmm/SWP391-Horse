import React from 'react';





const SvgWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span className="adminHomeSvgWrap">{children}</span>;
};

const AdminHome: React.FC = () => {
  return (
    <div className="HtmlBody w-[1280px] pl-72 relative bg-stone-50 inline-flex flex-col justify-start items-start">
      <div className="MainContentArea self-stretch min-h-[1299px] pb-6 flex flex-col justify-start items-start">
        <div className="HeaderTopappbar self-stretch h-24 px-12 bg-stone-50 border-b border-stone-300/20 backdrop-blur-xs inline-flex justify-between items-center">
          <div className="Container size- flex justify-start items-center gap-12">
            <div className="Heading2 size- inline-flex flex-col justify-start items-start">
              <div className="Text justify-center text-teal-950 text-3xl font-normal font-['Liberation_Serif'] leading-9">
                Admin Dashboard
              </div>
            </div>
            <div className="Nav size- px-2 flex justify-start items-start gap-8">
              <div className="Link self-stretch px-1 pb-1 border-b-2 border-teal-950 inline-flex flex-col justify-start items-start">
                <div className="Text justify-center text-teal-950 text-sm font-bold font-['Manrope'] leading-5">
                  OVERVIEW
                </div>
              </div>
              <div className="Link self-stretch px-1 pb-1 inline-flex flex-col justify-start items-start">
                <div className="Text justify-center text-neutral-700/60 text-sm font-bold font-['Manrope'] leading-5">
                  REPORTS
                </div>
              </div>
              <div className="Link self-stretch px-1 pb-1 inline-flex flex-col justify-start items-start">
                <div className="Text justify-center text-neutral-700/60 text-sm font-bold font-['Manrope'] leading-5">
                  ANALYTICS
                </div>
              </div>
            </div>
          </div>
          <div className="Container size- flex justify-start items-center gap-5">
            <div className="Button">
              <SvgWrapper>
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0V17M8 9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5M8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20V20M4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15V15"
                    fill="#004225"
                  />
                </svg>
              </SvgWrapper>
            </div>
            <div className="Container size-11 p-0.5 rounded-xl inline-flex flex-col justify-center items-start">
              <div className="Container">
                <SvgWrapper>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M13.85 25.1C14.7 24.45 15.65 23.9375 16.7 23.5625C17.75 23.1875 18.85 23 20 23C21.15 23 22.25 23.1875 23.3 23.5625C24.35 23.9375 25.3 24.45 26.15 25.1C26.7333 24.4167 27.1875 23.6417 27.5125 22.775C27.8375 21.9083 28 20.9833 28 20C28 17.7833 27.2208 15.8958 25.6625 14.3375C24.1042 12.7792 22.2167 12 20 12C17.7833 12 15.8958 12.7792 14.3375 14.3375C12.7792 15.8958 12 17.7833 12 20C12 20.9833 12.1625 21.9083 12.4875 22.775C12.8125 23.6417 13.2667 24.4167 13.85 25.1V25.1M20 21C19.0167 21 18.1875 20.6625 17.5125 19.9875C16.8375 19.3125 16.5 18.4833 16.5 17.5C16.5 16.5167 16.8375 15.6875 17.5125 15.0125C18.1875 14.3375 19.0167 14 20 14C20.9833 14 21.8125 14.3375 22.4875 15.0125C23.1625 15.6875 23.5 16.5167 23.5 17.5C23.5 18.4833 23.1625 19.3125 22.4875 19.9875C21.8125 20.6625 20.9833 21 20 21V21M20 30C18.6167 30 17.3167 29.7375 16.1 29.2125C14.8833 28.6875 13.825 27.975 12.925 27.075C12.025 26.175 11.3125 25.1167 10.7875 23.9C10.2625 22.6833 10 21.3833 10 20C10 18.6167 10.2625 17.3167 10.7875 16.1C11.3125 14.8833 12.025 13.825 12.925 12.925C13.825 12.025 14.8833 11.3125 16.1 10.7875C17.3167 10.2625 18.6167 10 20 10C21.3833 10 22.6833 10.2625 23.9 10.7875C25.1167 11.3125 26.175 12.025 27.075 12.925C27.975 13.825 28.6875 14.8833 29.2125 16.1C29.7375 17.3167 30 18.6167 30 20C30 21.3833 29.7375 22.6833 29.2125 23.9C28.6875 25.1167 27.975 26.175 27.075 27.075C26.175 27.975 25.1167 28.6875 23.9 29.2125C22.6833 29.7375 21.3833 30 20 30V30M20 28C20.8833 28 21.7167 27.8708 22.5 27.6125C23.2833 27.3542 24 26.9833 24.65 26.5C24 26.0167 23.2833 25.6458 22.5 25.3875C21.7167 25.1292 20.8833 25 20 25C19.1167 25 18.2833 25.1292 17.5 25.3875C16.7167 25.6458 16 26.0167 15.35 26.5C16 26.9833 16.7167 27.3542 17.5 27.6125C18.2833 27.8708 19.1167 28 20 28V28M20 19C20.4333 19 20.7917 18.8583 21.075 18.575C21.3583 18.2917 21.5 17.9333 21.5 17.5C21.5 17.0667 21.3583 16.7083 21.075 16.425C20.7917 16.1417 20.4333 16 20 16C19.5667 16 19.2083 16.1417 18.925 16.425C18.6417 16.7083 18.5 17.0667 18.5 17.5C18.5 17.9333 18.6417 18.2917 18.925 18.575C19.2083 18.8583 19.5667 19 20 19V19M20 17.5V17.5V17.5V17.5V17.5V17.5V17.5V17.5V17.5V17.5M20 26.5V26.5V26.5V26.5V26.5V26.5V26.5V26.5V26.5V26.5"
                      fill="#004225"
                      fill-opacity="0.6"
                    />
                  </svg>
                </SvgWrapper>
              </div>
            </div>
          </div>
        </div>

        <div className="ContentContainerMargin self-stretch px-16 flex flex-col justify-start items-start">
          <div className="ContentContainer w-full max-w-[1440px] p-16 flex flex-col justify-start items-start gap-12">
            <div className="SectionStatisticsOverview self-stretch inline-flex flex-col justify-start items-start">
              <div className="ActiveUsers self-stretch p-6 bg-white rounded-xs shadow-[0px_1px_2px_0px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 inline-flex flex-col justify-start items-start gap-1">
                <div className="Container self-stretch inline-flex justify-between items-center">
                  <div className="Overlay size-12 bg-teal-950/5 rounded-xs flex justify-center items-center">
                    <SvgWrapper>
                      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0V16M18 16V13C18 12.2667 17.7958 11.5625 17.3875 10.8875C16.9792 10.2125 16.4 9.63333 15.65 9.15C16.5 9.25 17.3 9.42083 18.05 9.6625C18.8 9.90417 19.5 10.2 20.15 10.55C20.75 10.8833 21.2083 11.2542 21.525 11.6625C21.8417 12.0708 22 12.5167 22 13V16H18V16M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8V8M18 4C18 5.1 17.6083 6.04167 16.825 6.825C16.0417 7.60833 15.1 8 14 8C13.8167 8 13.5833 7.97917 13.3 7.9375C13.0167 7.89583 12.7833 7.85 12.6 7.8C13.05 7.26667 13.3958 6.675 13.6375 6.025C13.8792 5.375 14 4.7 14 4C14 3.3 13.8792 2.625 13.6375 1.975C13.3958 1.325 13.05 0.733333 12.6 0.2C12.8333 0.116667 13.0667 0.0625 13.3 0.0375C13.5333 0.0125 13.7667 0 14 0C15.1 0 16.0417 0.391667 16.825 1.175C17.6083 1.95833 18 2.9 18 4V4M2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14V14M8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6V6M8 14V14V14V14V14V14V14V14V14V14V14V14V14V14M8 4V4V4V4V4V4V4V4V4V4V4V4V4V4"
                          fill="#004225"
                        />
                      </svg>
                    </SvgWrapper>
                  </div>
                  <div className="Overlay size- px-2.5 py-1 bg-teal-950/10 rounded-xl inline-flex flex-col justify-start items-start">
                    <div className="Text justify-center text-teal-950 text-[10px] font-bold font-['Manrope'] leading-5 tracking-wide">
                      +12% MONTHLY
                    </div>
                  </div>
                </div>
                <div className="Container self-stretch pt-5 flex flex-col justify-start items-start">
                  <div className="TotalActiveUsers self-stretch justify-center text-neutral-700/50 text-xs font-bold font-['Manrope'] uppercase leading-5 tracking-widest">
                    TOTAL ACTIVE USERS
                  </div>
                </div>
                <div className="Heading3 self-stretch flex flex-col justify-start items-start">
                  <div className="482 self-stretch justify-center text-teal-950 text-5xl font-normal font-['Liberation_Serif'] leading-[60px]">
                    12,482
                  </div>
                </div>
              </div>

              <div className="ActiveTournaments self-stretch p-6 bg-white rounded-xs shadow-[0px_1px_2px_0px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 inline-flex flex-col justify-start items-start gap-1">
                <div className="Container self-stretch inline-flex justify-between items-center">
                  <div className="Overlay size-12 bg-yellow-800/5 rounded-xs flex justify-center items-center">
                    <SvgWrapper>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M4 18V16H8V12.9C7.18333 12.7167 6.45417 12.3708 5.8125 11.8625C5.17083 11.3542 4.7 10.7167 4.4 9.95C3.15 9.8 2.10417 9.25417 1.2625 8.3125C0.420833 7.37083 0 6.26667 0 5V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H4V0H14V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V5C18 6.26667 17.5792 7.37083 16.7375 8.3125C15.8958 9.25417 14.85 9.8 13.6 9.95C13.3 10.7167 12.8292 11.3542 12.1875 11.8625C11.5458 12.3708 10.8167 12.7167 10 12.9V16H14V18H4V18M4 7.8V4H2V5C2 5.63333 2.18333 6.20417 2.55 6.7125C2.91667 7.22083 3.4 7.58333 4 7.8V7.8M9 11C9.83333 11 10.5417 10.7083 11.125 10.125C11.7083 9.54167 12 8.83333 12 8V2H6V8C6 8.83333 6.29167 9.54167 6.875 10.125C7.45833 10.7083 8.16667 11 9 11V11M14 7.8C14.6 7.58333 15.0833 7.22083 15.45 6.7125C15.8167 6.20417 16 5.63333 16 5V4H14V7.8V7.8M9 6.5V6.5V6.5V6.5V6.5V6.5V6.5V6.5V6.5"
                          fill="#775A19"
                        />
                      </svg>
                    </SvgWrapper>
                  </div>
                  <div className="Overlay size- px-2.5 py-1 bg-yellow-800/10 rounded-xl inline-flex flex-col justify-start items-start">
                    <div className="Text justify-center text-yellow-800 text-[10px] font-bold font-['Manrope'] leading-5 tracking-wide">
                      NEXT 48H
                    </div>
                  </div>
                </div>
                <div className="Container self-stretch pt-5 flex flex-col justify-start items-start">
                  <div className="UpcomingTournaments self-stretch justify-center text-neutral-700/50 text-xs font-bold font-['Manrope'] uppercase leading-5 tracking-widest">
                    UPCOMING TOURNAMENTS
                  </div>
                </div>
                <div className="Heading3 self-stretch flex flex-col justify-start items-start">
                  <div className="Icon">
                    <SvgWrapper>
                      <svg width="46" height="32" viewBox="0 0 46 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M19.2422 31.7812H0V28.3359C1.57812 26.8672 3.02734 25.5508 4.34766 24.3867C5.66797 23.2227 6.85547 22.1367 7.91016 21.1289C8.96484 20.1211 9.88672 19.1562 10.6758 18.2344C11.4648 17.3125 12.1211 16.3516 12.6445 15.3516C13.168 14.3516 13.5586 13.2734 13.8164 12.1172C14.0742 10.9609 14.2031 9.65625 14.2031 8.20312C14.2031 6.17188 13.7422 4.625 12.8203 3.5625C11.8984 2.5 10.3906 1.96875 8.29688 1.96875C7.82812 1.96875 7.36328 2.00391 6.90234 2.07422C6.44141 2.14453 6 2.23828 5.57812 2.35547C5.15625 2.47266 4.76172 2.60547 4.39453 2.75391C4.02734 2.90234 3.70312 3.05469 3.42188 3.21094L2.60156 7.05469H1.05469V1.00781C2.24219 0.726562 3.41016 0.488281 4.55859 0.292969C5.70703 0.0976562 6.95312 0 8.29688 0C11.7344 0 14.3164 0.714844 16.043 2.14453C17.7695 3.57422 18.6328 5.59375 18.6328 8.20312C18.6328 9.48438 18.4648 10.6719 18.1289 11.7656C17.793 12.8594 17.3125 13.9102 16.6875 14.918C16.0625 15.9258 15.2969 16.918 14.3906 17.8945C13.4844 18.8711 12.4531 19.8828 11.2969 20.9297C10.1406 21.9766 8.87109 23.0898 7.48828 24.2695C6.10547 25.4492 4.63281 26.75 3.07031 28.1719H19.2422V31.7812V31.7812M40.875 24.8672V31.7812H36.8438V24.8672H22.8281V21.75L38.1797 0.1875H40.875V21.5156H45.1406V24.8672H40.875V24.8672M36.8438 5.69531H36.7266L25.4766 21.5156H36.8438V5.69531V5.69531"
                          fill="#004225"
                        />
                      </svg>
                    </SvgWrapper>
                  </div>
                </div>
              </div>

              <div className="Pending self-stretch p-6 bg-white rounded-xs shadow-[0px_1px_2px_0px_rgba(0,0,0,0.10)] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 inline-flex flex-col justify-start items-start gap-1">
                <div className="Container self-stretch inline-flex justify-between items-center">
                  <div className="Overlay size-12 bg-red-700/5 rounded-xs flex justify-center items-center">
                    <SvgWrapper>
                      <svg width="19" height="21" viewBox="0 0 19 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M14 21C12.6167 21 11.4375 20.5125 10.4625 19.5375C9.4875 18.5625 9 17.3833 9 16C9 14.6167 9.4875 13.4375 10.4625 12.4625C11.4375 11.4875 12.6167 11 14 11C15.3833 11 16.5625 11.4875 17.5375 12.4625C18.5125 13.4375 19 14.6167 19 15.8C19 17.3833 18.5125 18.5625 17.5375 19.5375C16.5625 20.5125 15.3833 21 14 21V21M15.675 18.375L16.375 17.675L14.5 15.8V13H13.5V16.2L15.675 18.375V18.375M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.175C6.35833 1.41667 6.71667 0.9375 7.25 0.5625C7.78333 0.1875 8.36667 0 9 0C9.66667 0 10.2625 0.1875 10.7875 0.5625C11.3125 0.9375 11.6667 1.41667 11.85 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V10.25C17.7 10.0333 17.3833 9.85 17.05 9.7C16.7167 9.55 16.3667 9.41667 16 9.3V4V4V4H14V7H4V4H2V4V4V18V18V18H7.3C7.41667 18.3667 7.55 18.7167 7.7 19.05C7.85 19.3833 8.03333 19.7 8.25 20H2V20M9 4C9.28333 4 9.52083 3.90417 9.7125 3.7125C9.90417 3.52083 10 3.28333 10 3C10 2.71667 9.90417 2.47917 9.7125 2.2875C9.52083 2.09583 9.28333 2 9 2C8.71667 2 8.47917 2.09583 8.2875 2.2875C8.09583 2.47917 8 2.71667 8 3C8 3.28333 8.09583 3.52083 8.2875 3.7125C8.47917 3.90417 8.71667 4 9 4V4"
                          fill="#BA1A1A"
                        />
                      </svg>
                    </SvgWrapper>
                  </div>
                  <div className="Overlay size- px-2.5 py-1 bg-red-700/10 rounded-xl inline-flex flex-col justify-start items-start">
                    <div className="Text justify-center text-red-700 text-[10px] font-bold font-['Manrope'] leading-5 tracking-wide">
                      ACTION REQ.
                    </div>
                  </div>
                </div>
                <div className="Container self-stretch pt-5 flex flex-col justify-start items-start">
                  <div className="PendingRegistrations self-stretch justify-center text-neutral-700/50 text-xs font-bold font-['Manrope'] uppercase leading-5 tracking-widest">
                    PENDING REGISTRATIONS
                  </div>
                </div>
                <div className="Heading3 self-stretch flex flex-col justify-start items-start">
                  <div className="186 self-stretch justify-center text-teal-950 text-5xl font-normal font-['Liberation_Serif'] leading-[60px]">
                    186
                  </div>
                </div>
              </div>
            </div>

            {/* Left: Main Management */}
            <div className="LeftMainManagement self-stretch flex flex-col justify-start items-start gap-12">
              <div className="TournamentFeatureGrid self-stretch bg-white rounded-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start overflow-hidden">
                <div className="Horizontalborder self-stretch px-8 py-6 border-b border-stone-300/20 inline-flex justify-between items-center">
                  <div className="Heading4 size- inline-flex flex-col justify-start items-start">
                    <div className="Text justify-center text-teal-950 text-2xl font-normal font-['Liberation_Serif'] leading-8">
                      Tournament Spotlight
                    </div>
                  </div>
                  <div className="Button size- flex justify-start items-center gap-1.5">
                    <div className="Text text-center justify-center text-teal-950 text-xs font-bold font-['Manrope'] uppercase leading-5 tracking-widest">
                      BROWSE ALL TOURNAMENTS
                    </div>
                    <SvgWrapper>
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M6.66667 8L5.73333 7.03333L8.1 4.66667H0V3.33333H8.1L5.73333 0.966667L6.66667 0L10.6667 4L6.66667 8V8"
                          fill="#004225"
                        />
                      </svg>
                    </SvgWrapper>
                  </div>
                </div>

                <div className="Container self-stretch inline-flex flex-col justify-start items-start">
                  <div className="Card1 self-stretch px-8 pt-8 pb-14 inline-flex flex-col justify-start items-start gap-1">
                    <div className="Container self-stretch inline-flex justify-between items-start">
                      <div className="BackgroundBorder size-20 bg-gray-200 rounded-xs outline outline-1 outline-offset-[-1px] outline-stone-300/20 inline-flex flex-col justify-center items-start overflow-hidden">
                        <div className="Tournament self-stretch flex-1 relative bg-blend-saturation bg-white/20" />
                      </div>
                      <div className="Overlay size- px-2.5 py-1 bg-yellow-800/10 rounded-xs inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-yellow-800 text-[9px] font-bold font-['Manrope'] uppercase leading-5">
                          CLOSING SOON
                        </div>
                      </div>
                    </div>
                    <div className="Heading5 self-stretch pt-5 flex flex-col justify-start items-start">
                      <div className="RoyalAscotAutumnDerby self-stretch justify-center text-teal-950 text-xl font-normal font-['Liberation_Serif'] leading-7">
                        Royal Ascot Autumn Derby
                      </div>
                    </div>
                    <div className="Container self-stretch flex flex-col justify-start items-start">
                      <div className="GradeIStakesBerkshireUkNov12 self-stretch justify-center text-neutral-700/60 text-xs font-medium font-['Manrope'] leading-4">
                        Grade I Stakes • Berkshire, UK • Nov 12
                      </div>
                    </div>
                  </div>

                  <div className="Card2 self-stretch px-8 pt-8 pb-14 border-l border-stone-300/20 inline-flex flex-col justify-start items-start gap-1">
                    <div className="Container self-stretch inline-flex justify-between items-start">
                      <div className="BackgroundBorder size-20 bg-gray-200 rounded-xs outline outline-1 outline-offset-[-1px] outline-stone-300/20 inline-flex flex-col justify-center items-start overflow-hidden">
                        <div className="Tournament self-stretch flex-1 relative bg-blend-saturation bg-white/20" />
                      </div>
                      <div className="Overlay size- px-2.5 py-1 bg-teal-950/10 rounded-xs inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-teal-950 text-[9px] font-bold font-['Manrope'] uppercase leading-5">
                          REGISTRATION OPEN
                        </div>
                      </div>
                    </div>
                    <div className="Heading5 self-stretch pt-5 flex flex-col justify-start items-start">
                      <div className="DubaiWorldInvitational self-stretch justify-center text-teal-950 text-xl font-normal font-['Liberation_Serif'] leading-7">
                        Dubai World Invitational
                      </div>
                    </div>
                    <div className="Container self-stretch flex flex-col justify-start items-start">
                      <div className="GlobalHeritageSeriesMeydanDec05 self-stretch justify-center text-neutral-700/60 text-xs font-medium font-['Manrope'] leading-4">
                        Global Heritage Series • Meydan • Dec 05
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Registrations Table */}
              <div className="RecentRegistrationsTable self-stretch bg-white rounded-sm shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-1 outline-offset-[-1px] outline-stone-300/40 flex flex-col justify-start items-start overflow-hidden">
                <div className="Horizontalborder self-stretch px-8 py-6 border-b border-stone-300/20 inline-flex justify-between items-center">
                  <div className="Heading4 size- inline-flex flex-col justify-start items-start">
                    <div className="Text justify-center text-teal-950 text-2xl font-normal font-['Liberation_Serif'] leading-8">
                      Live Registration Feed
                    </div>
                  </div>
                  <div className="Container size- flex justify-start items-start gap-2">
                    <div className="Button size- p-2.5 rounded-xs outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center">
                      <SvgWrapper>
                        <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5.83333 10V8.33333H9.16667V10H5.83333V10M2.5 5.83333V4.16667H12.5V5.83333H2.5V5.83333M0 1.66667V0H15V1.66667H0V1.66667" fill="#404942" />
                        </svg>
                      </SvgWrapper>
                    </div>
                    <div className="Button size- p-2.5 rounded-xs outline outline-1 outline-offset-[-1px] outline-stone-300/30 inline-flex flex-col justify-center items-center">
                      <SvgWrapper>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M6.66667 10L2.5 5.83333L3.66667 4.625L5.83333 6.79167V0H7.5V6.79167L9.66667 4.625L10.8333 5.83333L6.66667 10V10M1.66667 13.3333C1.20833 13.3333 0.815972 13.1701 0.489583 12.8438C0.163194 12.5174 0 12.125 0 11.6667V9.16667H1.66667V11.6667V11.6667V11.6667H11.6667V9.16667H13.3333V11.6667C13.3333 12.125 13.1701 12.5174 12.8438 12.8438C12.5174 13.1701 12.125 13.3333 11.6667 13.3333H1.66667V13.3333"
                            fill="#404942"
                          />
                        </svg>
                      </SvgWrapper>
                    </div>
                  </div>
                </div>

                <div className="Table self-stretch flex flex-col justify-start items-start overflow-hidden">
                  <div className="Header self-stretch bg-stone-100/50 flex flex-col justify-start items-start">
                    <div className="Row self-stretch inline-flex justify-center items-start">
                      <div className="Cell w-52 px-8 py-4 inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-neutral-700/60 text-[10px] font-bold font-['Manrope'] uppercase tracking-widest">
                          HORSE &amp; PEDIGREE
                        </div>
                      </div>
                      <div className="Cell w-48 px-8 py-4 inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-neutral-700/60 text-[10px] font-bold font-['Manrope'] uppercase tracking-widest">
                          OWNER / STABLE
                        </div>
                      </div>
                      <div className="Cell w-48 px-8 py-4 inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-neutral-700/60 text-[10px] font-bold font-['Manrope'] uppercase tracking-widest">
                          TOURNAMENT
                        </div>
                      </div>
                      <div className="Cell w-40 px-8 py-4 inline-flex flex-col justify-start items-end">
                        <div className="Text text-right justify-center text-neutral-700/60 text-[10px] font-bold font-['Manrope'] uppercase tracking-widest">
                          STATUS
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="Body self-stretch flex flex-col justify-start items-start">
                    {/* Row 1 */}
                    <div className="Row self-stretch pl-8 pr-[0.01px] inline-flex justify-center items-center">
                      <div className="Data w-36 flex justify-start items-center">
                        <div className="Container size- inline-flex flex-col justify-start items-start">
                          <div className="Container self-stretch flex flex-col justify-start items-start">
                            <div className="Text justify-center text-teal-950 text-sm font-bold font-['Manrope'] leading-5">
                              Sovereign Victory
                            </div>
                          </div>
                          <div className="Container self-stretch flex flex-col justify-start items-start">
                            <div className="Text justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope']">
                              Sire: Galileo • Dam: Aura
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="Data w-56 pl-16 pr-8 py-5 inline-flex flex-col justify-start items-start">
                        <div className="Container self-stretch flex flex-col justify-start items-start">
                          <div className="AgaKhanStuds self-stretch justify-center text-teal-950 text-sm font-semibold font-['Manrope'] leading-5">
                            Aga Khan Studs
                          </div>
                        </div>
                        <div className="Container self-stretch flex flex-col justify-start items-start">
                          <div className="RepMSmith self-stretch justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope']">
                            Rep: M. Smith
                          </div>
                        </div>
                      </div>
                      <div className="Data w-48 px-8 py-7 inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-teal-950/80 text-sm font-medium font-['Manrope'] leading-5">
                          Derby Stakes
                        </div>
                      </div>
                      <div className="Data w-40 px-8 pt-6 pb-7 inline-flex flex-col justify-start items-end">
                        <div className="Overlay size- px-2.5 py-1 bg-teal-950/10 rounded-xs inline-flex justify-end items-start">
                          <div className="Text text-right justify-center text-teal-950 text-[10px] font-bold font-['Manrope'] uppercase tracking-wide">
                            CONFIRMED
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="Row self-stretch pl-8 pr-[0.01px] border-t border-stone-300/10 inline-flex justify-center items-center">
                      <div className="Data w-36 flex justify-start items-center">
                        <div className="Container size- inline-flex flex-col justify-start items-start">
                          <div className="Container self-stretch flex flex-col justify-start items-start">
                            <div className="Text justify-center text-teal-950 text-sm font-bold font-['Manrope'] leading-5">
                              Emerald Legacy
                            </div>
                          </div>
                          <div className="Container self-stretch flex flex-col justify-start items-start">
                            <div className="Text justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope']">
                              Sire: Frankel • Dam: Jade
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="Data w-56 pl-16 pr-8 py-5 inline-flex flex-col justify-start items-start">
                        <div className="Container self-stretch flex flex-col justify-start items-start">
                          <div className="Godolphin self-stretch justify-center text-teal-950 text-sm font-semibold font-['Manrope'] leading-5">
                            Godolphin
                          </div>
                        </div>
                        <div className="Container self-stretch flex flex-col justify-start items-start">
                          <div className="RepLDettori self-stretch justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope']">
                            Rep: L. Dettori
                          </div>
                        </div>
                      </div>
                      <div className="Data w-48 px-8 py-7 inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-teal-950/80 text-sm font-medium font-['Manrope'] leading-5">
                          St Leger Stakes
                        </div>
                      </div>
                      <div className="Data w-40 px-8 py-7 inline-flex flex-col justify-start items-end">
                        <div className="Overlay size- px-2.5 py-1 bg-teal-950/10 rounded-xs inline-flex justify-end items-start">
                          <div className="Text text-right justify-center text-teal-950 text-[10px] font-bold font-['Manrope'] uppercase tracking-wide">
                            IN REVIEW
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 3 */}
                    <div className="Row self-stretch pl-8 pr-[0.01px] border-t border-stone-300/10 inline-flex justify-center items-center">
                      <div className="Data w-36 flex justify-start items-center">
                        <div className="Container size- inline-flex flex-col justify-start items-start">
                          <div className="Container self-stretch flex flex-col justify-start items-start">
                            <div className="Text justify-center text-teal-950 text-sm font-bold font-['Manrope'] leading-5">
                              Golden Dancer
                            </div>
                          </div>
                          <div className="Container self-stretch flex flex-col justify-start items-start">
                            <div className="Text justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope']">
                              Sire: Kingman • Dam: Flare
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="Data w-56 pl-16 pr-8 py-5 inline-flex flex-col justify-start items-start">
                        <div className="Container self-stretch flex flex-col justify-start items-start">
                          <div className="Coolmore self-stretch justify-center text-teal-950 text-sm font-semibold font-['Manrope'] leading-5">
                            Coolmore
                          </div>
                        </div>
                        <div className="Container self-stretch flex flex-col justify-start items-start">
                          <div className="RepJDoyle self-stretch justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope']">
                            Rep: J. Doyle
                          </div>
                        </div>
                      </div>
                      <div className="Data w-48 px-8 py-7 inline-flex flex-col justify-start items-start">
                        <div className="Text justify-center text-teal-950/80 text-sm font-medium font-['Manrope'] leading-5">
                          Oaks Invitational
                        </div>
                      </div>
                      <div className="Data w-40 px-8 pt-7 pb-6 inline-flex flex-col justify-start items-end">
                        <div className="Overlay size- px-2.5 py-1 bg-teal-950/10 rounded-xs inline-flex justify-end items-start">
                          <div className="Text text-right justify-center text-teal-950 text-[10px] font-bold font-['Manrope'] uppercase tracking-wide">
                            CONFIRMED
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="OverlayHorizontalborder self-stretch px-8 py-4 bg-stone-100/10 border-t border-stone-300/10 flex flex-col justify-start items-center">
                  <div className="Button size- inline-flex justify-center items-center">
                    <div className="Text text-center justify-center text-neutral-700/50 text-xs font-bold font-['Manrope'] uppercase leading-5 tracking-widest">
                      VIEW COMPLETE HISTORY
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aside - Side Navigation Shell */}
      <div className="AsideSideNavigationShell w-72 h-[1299px] px-6 py-8 left-0 top-0 absolute bg-stone-50 border-r border-stone-300 flex flex-col justify-between items-start">
        <div className="Margin self-stretch pb-12 flex flex-col justify-start items-start">
          <div className="Container self-stretch flex flex-col justify-start items-start gap-1">
            <div className="Heading1 self-stretch flex flex-col justify-start items-start">
              <div className="HeritageRacing self-stretch justify-center text-teal-950 text-4xl font-normal font-['Liberation_Serif'] leading-9">
                Heritage Racing
              </div>
            </div>
            <div className="Container self-stretch flex flex-col justify-start items-start">
              <div className="AdministrationPortal self-stretch justify-center text-neutral-700/60 text-[10px] font-normal font-['Manrope'] uppercase leading-5 tracking-widest">
                ADMINISTRATION PORTAL
              </div>
            </div>
          </div>
        </div>

        <div className="Nav self-stretch flex-1 flex flex-col justify-start items-start gap-1">
          <div className="Link self-stretch px-4 py-3.5 bg-gray-200 border-r-[3px] border-teal-950 inline-flex justify-start items-center gap-4">
            <SvgWrapper>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9.16667 5.5V0H16.5V5.5H9.16667V5.5M0 9.16667V0H7.33333V9.16667H0V9.16667M9.16667 16.5V7.33333H16.5V16.5H9.16667V16.5M0 16.5V11H7.33333V16.5H0V16.5M1.83333 7.33333H5.5V1.83333H1.83333V7.33333V7.33333M11 14.6667H14.6667V9.16667H11V14.6667V14.6667M11 3.66667H14.6667V1.83333H11V3.66667V3.66667M1.83333 14.6667H5.5V12.8333H1.83333V14.6667V14.6667M5.5 7.33333V7.33333V7.33333V7.33333V7.33333V7.33333M11 3.66667V3.66667V3.66667V3.66667V3.66667V3.66667M11 9.16667V9.16667V9.16667V9.16667V9.16667V9.16667M5.5 12.8333V12.8333V12.8333V12.8333V12.8333V12.8333"
                  fill="#004225"
                />
              </svg>
            </SvgWrapper>
            <div className="Container size- inline-flex flex-col justify-start items-start">
              <div className="Text justify-center text-teal-950 text-base font-semibold font-['Manrope'] leading-5">Dashboard</div>
            </div>
          </div>

          <div className="Link self-stretch px-4 py-3.5 inline-flex justify-start items-center gap-4">
            <SvgWrapper>
              <svg width="21" height="15" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 14.6667V12.1C0 11.5806 0.133681 11.1031 0.401042 10.6677C0.668403 10.2323 1.02361 9.9 1.46667 9.67083C2.41389 9.19722 3.37639 8.84201 4.35417 8.60521C5.33194 8.3684 6.325 8.25 7.33333 8.25C8.34167 8.25 9.33472 8.3684 10.3125 8.60521C11.2903 8.84201 12.2528 9.19722 13.2 9.67083C13.6431 9.9 13.9983 10.2323 14.2656 10.6677C14.533 11.1031 14.6667 11.5806 14.6667 12.1V14.6667H0V14.6667M16.5 14.6667V11.9167C16.5 11.2444 16.3128 10.599 15.9385 9.98021C15.5642 9.36146 15.0333 8.83056 14.3458 8.3875C15.125 8.47917 15.8583 8.63576 16.5458 8.85729C17.2333 9.07882 17.875 9.35 18.4708 9.67083C19.0208 9.97639 19.441 10.3163 19.7313 10.6906C20.0215 11.0649 20.1667 11.4736 20.1667 11.9167V14.6667H16.5V14.6667M7.33333 7.33333C6.325 7.33333 5.46181 6.97431 4.74375 6.25625C4.02569 5.53819 3.66667 4.675 3.66667 3.66667C3.66667 2.65833 4.02569 1.79514 4.74375 1.07708C5.46181 0.359028 6.325 0 7.33333 0C8.34167 0 9.20486 0.359028 9.92292 1.07708C10.641 1.79514 11 2.65833 11 3.66667C11 4.675 10.641 5.53819 9.92292 6.25625C9.20486 6.97431 8.34167 7.33333 7.33333 7.33333V7.33333M16.5 3.66667C16.5 4.675 16.141 5.53819 15.4229 6.25625C14.7049 6.97431 13.8417 7.33333 12.8333 7.33333C12.6653 7.33333 12.4514 7.31424 12.1917 7.27604C11.9319 7.23785 11.7181 7.19583 11.55 7.15C11.9625 6.66111 12.2795 6.11875 12.501 5.52292C12.7226 4.92708 12.8333 4.30833 12.8333 3.66667C12.8333 3.025 12.7226 2.40625 12.501 1.81042C12.2795 1.21458 11.9625 0.672222 11.55 0.183333C11.7639 0.106944 11.9778 0.0572917 12.1917 0.034375C12.4056 0.0114583 12.6194 0 12.8333 0C13.8417 0 14.7049 0.359028 15.4229 1.07708C16.141 1.79514 16.5 2.65833 16.5 3.66667V3.66667M1.83333 12.8333H12.8333V12.1C12.8333 11.9319 12.7913 11.7792 12.7073 11.6417C12.6233 11.5042 12.5125 11.3972 12.375 11.3208C11.55 10.9083 10.7174 10.599 9.87708 10.3927C9.03681 10.1865 8.18889 10.0833 7.33333 10.0833C6.47778 10.0833 5.62986 10.1865 4.78958 10.3927C3.94931 10.599 3.11667 10.9083 2.29167 11.3208C2.15417 11.3972 2.0434 11.5042 1.95938 11.6417C1.87535 11.7792 1.83333 11.9319 1.83333 12.1V12.8333V12.8333M7.33333 5.5C7.8375 5.5 8.2691 5.32049 8.62813 4.96146C8.98715 4.60243 9.16667 4.17083 9.16667 3.66667C9.16667 3.1625 8.98715 2.7309 8.62813 2.37188C8.2691 2.01285 7.8375 1.83333 7.33333 1.83333C6.82917 1.83333 6.39757 2.01285 6.03854 2.37188C5.67951 2.7309 5.5 3.1625 5.5 3.66667C5.5 4.17083 5.67951 4.60243 6.03854 4.96146C6.39757 5.32049 6.82917 5.5 7.33333 5.5V5.5M7.33333 12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333V12.8333M7.33333 3.66667V3.66667V3.66667V3.66667V3.66667V3.66667V3.66667V3.66667V3.66667V3.66667V3.66667"
                  fill="#404942"
                />
              </svg>
            </SvgWrapper>
            <div className="Container size- inline-flex flex-col justify-start items-start">
              <div className="Text justify-center text-neutral-700 text-base font-normal font-['Manrope'] leading-5">Users</div>
            </div>
          </div>

          <div className="Link self-stretch px-4 py-3.5 inline-flex justify-start items-center gap-4">
            <SvgWrapper>
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3.66667 16.5V14.6667H7.33333V11.825C6.58472 11.6569 5.91632 11.3399 5.32812 10.874C4.73993 10.408 4.30833 9.82361 4.03333 9.12083C2.8875 8.98333 1.92882 8.48299 1.15729 7.61979C0.385764 6.7566 0 5.74444 0 4.58333V3.66667C0 3.1625 0.179514 2.7309 0.538542 2.37188C0.897569 2.01285 1.32917 1.83333 1.83333 1.83333H3.66667V0H12.8333V1.83333H14.6667C15.1708 1.83333 15.6024 2.01285 15.9615 2.37188C16.3205 2.7309 16.5 3.1625 16.5 3.66667V4.58333C16.5 5.74444 16.1142 6.7566 15.3427 7.61979C14.5712 8.48299 13.6125 8.98333 12.4667 9.12083C12.1917 9.82361 11.7601 10.408 11.1719 10.874C10.5837 11.3399 9.91528 11.6569 9.16667 11.825V14.6667H12.8333V16.5H3.66667V16.5M3.66667 7.15V3.66667H1.83333V4.58333C1.83333 5.16389 2.00139 5.68715 2.3375 6.15312C2.67361 6.6191 3.11667 6.95139 3.66667 7.15V7.15M8.25 10.0833C9.01389 10.0833 9.66319 9.81597 10.1979 9.28125C10.7326 8.74653 11 8.09722 11 7.33333V1.83333H5.5V7.33333C5.5 8.09722 5.76736 8.74653 6.30208 9.28125C6.83681 9.81597 7.48611 10.0833 8.25 10.0833V10.0833M12.8333 7.15C13.3833 6.95139 13.8264 6.6191 14.1625 6.15312C14.4986 5.68715 14.6667 5.16389 14.6667 4.58333V3.66667H12.8333V7.15V7.15M8.25 5.95833V5.95833V5.95833V5.95833V5.95833V5.95833V5.95833V5.95833V5.95833"
                  fill="#404942"
                />
              </svg>
            </SvgWrapper>
            <div className="Container size- inline-flex flex-col justify-start items-start">
              <div className="Text justify-center text-neutral-700 text-base font-normal font-['Manrope'] leading-5">Tournaments</div>
            </div>
          </div>

          <div className="Link self-stretch px-4 py-3.5 inline-flex justify-start items-center gap-4">
            <SvgWrapper>
              <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.96667 13.7958L13.4292 7.33333L12.1458 6.05L6.96667 11.2292L4.35417 8.61667L3.07083 9.9L6.96667 13.7958V13.7958M1.83333 18.3333C1.32917 18.3333 0.897569 18.1538 0.538542 17.7948C0.179514 17.4358 0 17.0042 0 16.5V3.66667C0 3.1625 0.179514 2.7309 0.538542 2.37188C0.897569 2.01285 1.32917 1.83333 1.83333 1.83333H5.68333C5.88194 1.28333 6.21424 0.840278 6.68021 0.504167C7.14618 0.168056 7.66944 0 8.25 0C8.83056 0 9.35382 0.168056 9.81979 0.504167C10.2858 0.840278 10.6181 1.28333 10.8167 1.83333H14.6667C15.1708 1.83333 15.6024 2.01285 15.9615 2.37188C16.3205 2.7309 16.5 3.1625 16.5 3.66667V16.5C16.5 17.0042 16.3205 17.4358 15.9615 17.7948C15.6024 18.1538 15.1708 18.3333 14.6667 18.3333H1.83333V18.3333M1.83333 16.5H14.6667V16.5V16.5V3.66667V3.66667V3.66667H1.83333V3.66667V3.66667V16.5V16.5V16.5V16.5M8.25 2.97917C8.44861 2.97917 8.61285 2.91424 8.74271 2.78437C8.87257 2.65451 8.9375 2.49028 8.9375 2.29167C8.9375 2.09306 8.87257 1.92882 8.74271 1.79896C8.61285 1.6691 8.44861 1.60417 8.25 1.60417C8.05139 1.60417 7.88715 1.6691 7.75729 1.79896C7.62743 1.92882 7.5625 2.09306 7.5625 2.29167C7.5625 2.49028 7.62743 2.65451 7.75729 2.78437C7.88715 2.91424 8.05139 2.97917 8.25 2.97917V2.97917M1.83333 16.5V16.5V16.5V3.66667V3.66667V3.66667V3.66667V3.66667V3.66667V16.5V16.5V16.5V16.5V16.5"
                  fill="#404942"
                />
              </svg>
            </SvgWrapper>
            <div className="Container size- inline-flex flex-col justify-start items-start">
              <div className="Text justify-center text-neutral-700 text-base font-normal font-['Manrope'] leading-5">Registrations</div>
            </div>
          </div>

          <div className="Link self-stretch px-4 py-3.5 inline-flex justify-start items-center gap-4">
            <SvgWrapper>
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6.69167 18.3333L6.325 15.4C6.12639 15.3236 5.93924 15.2319 5.76354 15.125C5.58785 15.0181 5.41597 14.9035 5.24792 14.7812L2.52083 15.9271L0 11.5729L2.36042 9.78542C2.34514 9.67847 2.3375 9.57535 2.3375 9.47604C2.3375 9.37674 2.3375 9.27361 2.3375 9.16667C2.3375 9.05972 2.3375 8.9566 2.3375 8.85729C2.3375 8.75799 2.34514 8.65486 2.36042 8.54792L0 6.76042L2.52083 2.40625L5.24792 3.55208C5.41597 3.42986 5.59167 3.31528 5.775 3.20833C5.95833 3.10139 6.14167 3.00972 6.325 2.93333L6.69167 0H11.7333L12.1 2.93333C12.2986 3.00972 12.4858 3.10139 12.6615 3.20833C12.8372 3.31528 13.009 3.42986 13.1771 3.55208L15.9042 2.40625L18.425 6.76042L16.0646 8.54792C16.0799 8.65486 16.0875 8.75799 16.0875 8.85729C16.0875 8.9566 16.0875 9.05972 16.0875 9.16667C16.0875 9.27361 16.0875 9.37674 16.0875 9.47604C16.0875 9.57535 16.0722 9.67847 16.0417 9.78542L18.4021 11.5729L15.8813 15.9271L13.1771 14.7812C13.009 14.9035 12.8333 15.0181 12.65 15.125C12.4667 15.2319 12.2833 15.3236 12.1 15.4L11.7333 18.3333H6.69167V18.3333M8.29583 16.5H10.1062L10.4271 14.0708C10.9007 13.9486 11.3399 13.7691 11.7448 13.5323C12.1497 13.2955 12.5201 13.009 12.8562 12.6729L15.125 13.6125L16.0187 12.0542L14.0479 10.5646C14.1243 10.3507 14.1778 10.1253 14.2083 9.88854C14.2389 9.65174 14.2542 9.41111 14.2542 9.16667C14.2542 8.92222 14.2389 8.6816 14.2083 8.44479C14.1778 8.20799 14.1243 7.98264 14.0479 7.76875L16.0187 6.27917L15.125 4.72083L12.8562 5.68333C12.5201 5.33194 12.1497 5.03785 11.7448 4.80104C11.3399 4.56424 10.9007 4.38472 10.4271 4.2625L10.1292 1.83333H8.31875L7.99792 4.2625C7.52431 4.38472 7.08507 4.56424 6.68021 4.80104C6.27535 5.03785 5.90486 5.32431 5.56875 5.66042L3.3 4.72083L2.40625 6.27917L4.37708 7.74583C4.30069 7.975 4.24722 8.20417 4.21667 8.43333C4.18611 8.6625 4.17083 8.90694 4.17083 9.16667C4.17083 9.41111 4.18611 9.64792 4.21667 9.87708C4.24722 10.1063 4.30069 10.3354 4.37708 10.5646L2.40625 12.0542L3.3 13.6125L5.56875 12.65C5.90486 13.0014 6.27535 13.2955 6.68021 13.5323C7.08507 13.7691 7.52431 13.9486 7.99792 14.0708L8.29583 16.5V16.5M9.25833 12.375C10.1444 12.375 10.9007 12.0618 11.5271 11.4354C12.1535 10.809 12.4667 10.0528 12.4667 9.16667C12.4667 8.28056 12.1535 7.52431 11.5271 6.89792C10.9007 6.27153 10.1444 5.95833 9.25833 5.95833C8.35694 5.95833 7.59688 6.27153 6.97813 6.89792C6.35938 7.52431 6.05 8.28056 6.05 9.16667C6.05 10.0528 6.35938 10.809 6.97813 11.4354C7.59688 12.0618 8.35694 12.375 9.25833 12.375V12.375M9.2125 9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667V9.16667"
                  fill="#404942"
                />
              </svg>
            </SvgWrapper>
            <div className="Container size- inline-flex flex-col justify-start items-start">
              <div className="Text justify-center text-neutral-700 text-base font-normal font-['Manrope'] leading-5">Settings</div>
            </div>
          </div>
        </div>

        <div className="Horizontalborder self-stretch pt-8 border-t border-stone-300/30 flex flex-col justify-start items-start gap-6">
          <div className="Button self-stretch py-4 bg-teal-950 rounded-xs shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] inline-flex justify-center items-center">
            <div className="Text text-center justify-center text-white text-xs font-bold font-['Manrope'] uppercase leading-4 tracking-wider">
              CREATE TOURNAMENT
            </div>
          </div>

          <div className="Container self-stretch flex flex-col justify-start items-start gap-1">
            <div className="Link self-stretch px-4 py-2.5 inline-flex justify-start items-center gap-4">
              <SvgWrapper>
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.29167 13.3333C8.58333 13.3333 8.82986 13.2326 9.03125 13.0312C9.23264 12.8299 9.33333 12.5833 9.33333 12.2917C9.33333 12 9.23264 11.7535 9.03125 11.5521C8.82986 11.3507 8.58333 11.25 8.29167 11.25C8 11.25 7.75347 11.3507 7.55208 11.5521C7.35069 11.7535 7.25 12 7.25 12.2917C7.25 12.5833 7.35069 12.8299 7.55208 13.0312C7.75347 13.2326 8 13.3333 8.29167 13.3333V13.3333M7.54167 10.125H9.08333C9.08333 9.66667 9.13542 9.30556 9.23958 9.04167C9.34375 8.77778 9.63889 8.41667 10.125 7.95833C10.4861 7.59722 10.7708 7.25347 10.9792 6.92708C11.1875 6.60069 11.2917 6.20833 11.2917 5.75C11.2917 4.97222 11.0069 4.375 10.4375 3.95833C9.86806 3.54167 9.19444 3.33333 8.41667 3.33333C7.625 3.33333 6.98264 3.54167 6.48958 3.95833C5.99653 4.375 5.65278 4.875 5.45833 5.45833L6.83333 6C6.90278 5.75 7.05903 5.47917 7.30208 5.1875C7.54514 4.89583 7.91667 4.75 8.41667 4.75C8.86111 4.75 9.19444 4.87153 9.41667 5.11458C9.63889 5.35764 9.75 5.625 9.75 5.91667C9.75 6.19444 9.66667 6.45486 9.5 6.69792C9.33333 6.94097 9.125 7.16667 8.875 7.375C8.26389 7.91667 7.88889 8.32639 7.75 8.60417C7.61111 8.88194 7.54167 9.38889 7.54167 10.125V10.125M8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667V16.6667M8.33333 15C10.1944 15 11.7708 14.3542 13.0625 13.0625C14.3542 11.7708 15 10.1944 15 8.33333C15 6.47222 14.3542 4.89583 13.0625 3.60417C11.7708 2.3125 10.1944 1.66667 8.33333 1.66667C6.47222 1.66667 4.89583 2.3125 3.60417 3.60417C2.3125 4.89583 1.66667 6.47222 1.66667 8.33333C1.66667 10.1944 2.3125 11.7708 3.60417 13.0625C4.89583 14.3542 6.47222 15 8.33333 15V15M8.33333 8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333V8.33333"
                    fill="#404942"
                  />
                </svg>
              </SvgWrapper>
              <div className="Container size- inline-flex flex-col justify-start items-start">
                <div className="Text justify-center text-neutral-700 text-xs font-semibold font-['Manrope'] uppercase leading-4 tracking-wider">
                  HELP CENTER
                </div>
              </div>
            </div>
            <div className="Link self-stretch px-4 py-2.5 inline-flex justify-start items-center gap-4">
              <SvgWrapper>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H7.5V1.66667H1.66667V1.66667V1.66667V13.3333V13.3333V13.3333H7.5V15H1.66667V15M10.8333 11.6667L9.6875 10.4583L11.8125 8.33333H5V6.66667H11.8125L9.6875 4.54167L10.8333 3.33333L15 7.5L10.8333 11.6667V11.6667"
                    fill="#404942"
                  />
                </svg>
              </SvgWrapper>
              <div className="Container size- inline-flex flex-col justify-start items-start">
                <div className="Text justify-center text-neutral-700 text-xs font-semibold font-['Manrope'] uppercase leading-4 tracking-wider">
                  LOGOUT
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

