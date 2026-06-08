import React from 'react';
import { Link, useParams } from 'react-router-dom';

import './AdminManageTournamentDetail.css';

type RouteParams = {
  name?: string;
};

function AdminSidebar({ activeLabel }: { activeLabel: 'Tournaments' | string }) {
  return (
    <div className="amtDetailAside" aria-label="Admin navigation">
      <div className="amtDetailAsideTop">
        <div className="amtDetailBrand">Heritage</div>
        <div className="amtDetailKicker">RACING ADMIN</div>
      </div>

      <div className="amtDetailNav">
        <div className="amtDetailNavItem">
          <div className="amtDetailNavIcon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 6V0H18V6H10V6M0 10V0H8V10H0V10M10 18V8H18V18H10V18M0 18V12H8V18H0V18M2 8H6V2H2V8V8M12 16H16V10H12V16V16M12 4H16V2H12V4V4M2 16H6V14H2V16V16M6 8V8V8V8V8V8M12 4V4V4V4V4V4M12 10V10V10V10V10V10M6 14V14V14V14V14V14"
                fill="#404942"
              />
            </svg>
          </div>
          <span>Dashboard</span>
        </div>

        <div className="amtDetailNavItem">
          <div className="amtDetailNavIcon" aria-hidden="true">
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.4 9L15 7.6L17.075 5.5L15 3.425L16.4 2L18.5 4.1L20.575 2L22 3.425L19.9 5.5L22 7.6L20.575 9L18.5 6.925L16.4 9V9M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8V8M0 16V13.2C0 12.65 0.145833 12.1333 0.4375 11.65C0.729167 11.1667 1.11667 10.8 1.6 10.55C2.45 10.1167 3.40833 9.75 4.475 9.45C5.54167 9.15 6.71667 9 8 9C8.5 9 8.9875 9.025 9.4625 9.075C9.9375 9.125 10.4 9.2 10.85 9.3L9.1 11.05C8.91667 11.0167 8.7375 11 8.5625 11C8.3875 11 8.2 11 8 11C6.81667 11 5.75417 11.1417 4.8125 11.425C3.87083 11.7083 3.1 12.0167 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14H8.25L10.25 16H0V16M13.55 16.4L10.1 12.95L11.5 11.55L13.55 13.6L18.6 8.55L20 9.95L13.55 16.4V16.4M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8V8M8.25 14V14V14V14V14V14V14V14V14V14V14V14"
                fill="#404942"
              />
            </svg>
          </div>
          <span>Users</span>
        </div>

        <div className={`amtDetailNavItem ${activeLabel === 'Tournaments' ? 'amtDetailNavItemActive' : ''}`}>
          <div className="amtDetailNavIcon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.92 17.64V15.68H7.84V12.642C7.03967 12.4623 6.32508 12.1234 5.69625 11.6253C5.06742 11.1271 4.606 10.5023 4.312 9.751C3.087 9.604 2.06208 9.06908 1.23725 8.14625C0.412417 7.22342 0 6.14133 0 4.9V3.92C0 3.381 0.191917 2.91958 0.57575 2.53575C0.959583 2.15192 1.421 1.96 1.96 1.96H3.92V0H13.72V1.96H15.68C16.219 1.96 16.6804 2.15192 17.0643 2.53575C17.4481 2.91958 17.64 3.381 17.64 3.92V4.9C17.64 6.14133 17.2276 7.22342 16.4027 8.14625C15.5779 9.06908 14.553 9.604 13.328 9.751C13.034 10.5023 12.5726 11.1271 11.9438 11.6253C11.3149 12.1234 10.6003 12.4623 9.8 12.642V15.68H13.72V17.64H3.92V17.64M3.92 7.644V3.92H1.96V4.9C1.96 5.52067 2.13967 6.08008 2.499 6.57825C2.85833 7.07642 3.332 7.43167 3.92 7.644V7.644M13.72 7.644C14.308 7.43167 14.7817 7.07642 15.141 6.57825C15.5003 6.08008 15.68 5.52067 15.68 4.9V3.92H13.72V7.644V7.644"
                fill="#002A15"
              />
            </svg>
          </div>
          <span>Tournaments</span>
        </div>

        <div className="amtDetailNavItem">
          <div className="amtDetailNavIcon" aria-hidden="true">
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M0 16V13.2C0 12.65 0.141667 12.1333 0.425 11.65C0.708333 11.1667 1.1 10.8 1.6 10.55C2.45 10.1167 3.40833 9.75 4.475 9.45C5.54167 9.15 6.71667 9 8 9C8.5 9 8.9875 9.025 9.4625 9.075C9.9375 9.125 10.4 9.2 10.85 9.3L9.1 11.05C8.91667 11.0167 8.7375 11 8.5625 11C8.3875 11 8.2 11 8 11C6.81667 11 5.75417 11.1417 4.8125 11.425C3.87083 11.7083 3.1 12.0167 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14H8.25L10.25 16H0V16M13.55 16.4L10.1 12.95L11.5 11.55L13.55 13.6L18.6 8.55L20 9.95L13.55 16.4V16.4M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8V8M8.25 14V14V14V14V14V14V14V14V14V14V14V14"
                fill="#404942"
              />
            </svg>
          </div>
          <span>Registrations</span>
        </div>

        <div className="amtDetailNavItem">
          <div className="amtDetailNavIcon" aria-hidden="true">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375C2.55 10.2292 2.55 10.1167 2.55 10C2.55 9.88333 2.55 9.77083 2.55 9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625C17.55 9.77083 17.55 9.88333 17.55 10C17.55 10.1167 17.55 10.2292 17.55 10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3V20M9.05 18H11.025L11.375 15.35C11.8917 15.2167 12.3708 15.0208 12.8125 14.7625C13.2542 14.5042 13.6583 14.1917 14.025 13.825L16.5 14.85L17.475 13.15L15.325 11.525C15.4083 11.2917 15.4667 11.0458 15.5 10.7875C15.5333 10.5292 15.55 10.2667 15.55 10C15.55 9.73333 15.5333 9.47083 15.5 9.2125C15.4667 8.95417 15.4083 8.70833 15.325 8.475L17.475 6.85L16.5 5.15L14.025 6.2C13.6583 5.81667 13.2542 5.49583 12.8125 5.2375C12.3708 4.97917 11.8917 4.78333 11.375 4.65L11.05 2H9.075L8.725 4.65C8.20833 4.78333 7.72917 4.97917 7.2875 5.2375C6.84583 5.49583 6.44167 5.80833 6.075 6.175L3.6 5.15L2.625 6.85L4.775 8.45C4.69167 8.7 4.63333 8.95 4.6 9.2C4.56667 9.45 4.55 9.71667 4.55 10C4.55 10.2667 4.56667 10.525 4.6 10.775C4.63333 11.025 4.69167 11.275 4.775 11.525L2.625 13.15L3.6 14.85L6.075 13.8C6.44167 14.1833 6.84583 14.5042 7.2875 14.7625C7.72917 15.0208 8.20833 15.2167 8.725 15.35L9.05 18V18M10.1 13.5C11.0667 13.5 11.8917 13.1583 12.575 12.475C13.2583 11.7917 13.6 10.9667 13.6 10C13.6 9.03333 13.2583 8.20833 12.575 7.525C11.8917 6.84167 11.0667 6.5 10.1 6.5C9.11667 6.5 8.2875 6.84167 7.6125 7.525C6.9375 8.20833 6.6 9.03333 6.6 10C6.6 10.9667 6.9375 11.7917 7.6125 12.475C8.2875 13.1583 9.11667 13.5 10.1 13.5V13.5M10.05 10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10V10"
                fill="#404942"
              />
            </svg>
          </div>
          <span>Settings</span>
        </div>
      </div>

      <div className="amtDetailAsideBottom">
        <div className="amtDetailAsideLink">Help Center</div>
        <div className="amtDetailAsideLink amtDetailAsideLinkDanger">Logout</div>
      </div>
    </div>
  );
}

export default function AdminManageTournamentDetail() {
  const { name } = useParams<RouteParams>();

  return (
    <div className="amtDetailPage">
      <div className="amtDetailWrap">
        <header className="amtDetailTopbar">
          <div className="amtDetailBreadcrumb">
            <div className="amtDetailBreadcrumbItem">Tournaments</div>
            <div className="amtDetailSep" aria-hidden="true">
              <svg width="5" height="7" viewBox="0 0 5 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.4">
                  <path
                    d="M2.68333 3.5L0 0.816667L0.816667 0L4.31667 3.5L0.816667 7L0 6.18333L2.68333 3.5V3.5"
                    fill="#1B1C1A"
                  />
                </g>
              </svg>
            </div>
            <div className="amtDetailTournamentTitle">{name ?? 'Tournament'}</div>
          </div>

          <div className="amtDetailTopActions">
            <button type="button" className="amtDetailIconBtn" aria-label="Help">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0V17M8 9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5V9.5M8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20V20M4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15V15"
                  fill="#1B1C1A"
                />
              </svg>
              <span className="amtDetailIconBtnDot" aria-hidden="true">
                {/* purely decorative placeholder */}
              </span>
            </button>

            <div className="amtDetailCircleBtn" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8V8M0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0V16M2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14M8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6V6M8 4V4V4V4V4V4V4V4V4V4M8 14V14V14V14V14V14V14V14V14V14V14V14V14"
                  fill="#404942"
                />
              </svg>
            </div>
          </div>
        </header>

        <div className="amtDetailMain">
          <div className="amtDetailHero">
            <div className="amtDetailHeroBg">
              <img
                alt="tournament hero"
                className="amtDetailHeroImg"
                src="https://placehold.co/896x320"
              />
              <div className="amtDetailHeroGradient" />
            </div>

            <div className="amtDetailHeroContent">
              <div className="amtDetailHeroLeft">
                <div className="amtDetailBadges">
                  <div className="amtBadge amtBadgeGold">PREMIUM EVENT</div>
                  <div className="amtBadge amtBadgeTeal">REGISTRATION OPEN</div>
                </div>

                <div className="amtDetailHeroTitle">{name ?? 'Royal Ascot Autumn Derby'}</div>
                <div className="amtDetailHeroDesc">
                  The pinnacle of the autumn racing season, where tradition meets speed. A
                  gathering of the world&apos;s most elite breeders and thoroughbreds.
                </div>
              </div>

              <div className="amtDetailHeroEdit">
                <div className="amtDetailEditBtn">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M2 16H3.425L13.2 6.225L11.775 4.8L2 14.575V16V16M0 18V13.75L13.2 0.575C13.4 0.391667 13.6208 0.25 13.8625 0.15C14.1042 0.05 14.3583 0 14.625 0C14.8917 0 15.15 0.05 15.4 0.15C15.65 0.25 15.8667 0.4 16.05 0.6L17.425 2C17.625 2.18333 17.7708 2.4 17.8625 2.65C17.9542 2.9 18 3.15 18 3.4C18 3.66667 17.9542 3.92083 17.8625 4.1625C17.7708 4.40417 17.625 4.625 17.425 4.825L4.25 18H0V18M16 3.4V3.4L14.6 2V2L16 3.4V3.4M12.475 5.525L11.775 4.8V4.8L13.2 6.225V6.225L12.475 5.525V5.525"
                      fill="#785A1A"
                    />
                  </svg>
                  <div className="amtDetailEditText">Edit<br />Tournament</div>
                </div>
              </div>
            </div>
          </div>

          <div className="amtDetailGrid">
            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2V20M2 18H16V18V18V8H2V18V18V18V18M2 6H16V4V4V4H2V4V4V6V6M2 6V4V4V4V4V4V4V6V6V6"
                    fill="#002A15"
                  />
                </svg>
              </div>
              <div className="amtDetailStatLabel">DATE</div>
              <div className="amtDetailStatValue">Nov 12-15,<br />2024</div>
            </div>

            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 12C1.45 12 0.979167 11.8042 0.5875 11.4125C0.195833 11.0208 0 10.55 0 10V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V10C20 10.55 19.8042 11.0208 19.4125 11.4125C19.0208 11.8042 18.55 12 18 12H2V12M2 10H18V10V10V2V2V2H15V6H13V2H11V6H9V2H7V6H5V2H2V2V2V10V10V10V10M5 6V6H7V6H5V6M9 6V6H11V6H9V6M13 6V6H15V6H13V6M10 6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6V6"
                    fill="#002A15"
                  />
                </svg>
              </div>
              <div className="amtDetailStatLabel">DISTANCE</div>
              <div className="amtDetailStatValue">2400m</div>
            </div>

            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14V14V14H19V16H2V16M6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6V12M8 10C8 9.45 7.80417 8.97917 7.4125 8.5875C7.02083 8.19583 6.55 8 6 8V10V10V10H8V10M18 10H20V10V10V8C19.45 8 18.9792 8.19583 18.5875 8.5875C18.1958 8.97917 18 9.45 18 10V10M13 9C13.8333 9 14.5417 8.70833 15.125 8.125C15.7083 7.54167 16 6.83333 16 6C16 5.16667 15.7083 4.45833 15.125 3.875C14.5417 3.29167 13.8333 3 13 3C12.1667 3 11.4583 3.29167 10.875 3.875C10.2917 4.45833 10 5.16667 10 6C10 6.83333 10.2917 7.54167 10.875 8.125C11.4583 8.70833 12.1667 9 13 9V9M6 4C6.55 4 7.02083 3.80417 7.4125 3.4125C7.80417 3.02083 8 2.55 8 2H6V2V2V4V4M20 4V2V2V2H18C18 2.55 18.1958 3.02083 18.5875 3.4125C18.9792 3.80417 19.45 4 20 4V4"
                    fill="#775A19"
                  />
                </svg>
              </div>
              <div className="amtDetailStatLabel">PRIZE POOL</div>
              <div className="amtDetailStatValue">$500,000</div>
            </div>

            <div className="amtDetailStat">
              <div className="amtDetailStatIcon">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10V10M8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35V17.35M8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20V20M8 8V8V8V8V8V8V8V8V8V8"
                    fill="#002A15"
                  />
                </svg>
              </div>
              <div className="amtDetailStatLabel">LOCATION</div>
              <div className="amtDetailStatValue">Berkshire,<br />UK</div>
            </div>
          </div>

          <div className="amtDetailSection">
            <div className="amtDetailSectionHeader">
              <div>
                <div className="amtDetailSectionTitle">Race Management</div>
                <div className="amtDetailSectionDesc">Schedule heats, manage participants, and assign final standings.</div>
                <div className="amtDetailSectionMeta">
                  <div className="amtDetailMetaLabel">TOTAL REGISTRATIONS:</div>
                  <div className="amtDetailMetaPill">10/20</div>
                  <div className="amtDetailMetaPillSmall">REGISTRATION OPEN</div>
                </div>
              </div>

              <div className="amtDetailCreateHeat">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8V8" fill="white" />
                </svg>
                <span>Create Race Heat</span>
              </div>
            </div>

            <div className="amtHeatCard">
              <div className="amtHeatCardHeader">
                <div className="amtHeatHeaderLeft">
                  <div className="amtHeatHeaderBar" aria-hidden="true">
                    <svg width="8" height="32" viewBox="0 0 8 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="8" height="32" rx="4" fill="#002A15" />
                    </svg>
                  </div>
                  <div>
                    <div className="amtHeatTitle">Heat: Qualifier A</div>
                    <div className="amtHeatSlots">8 SLOTS FILLED</div>
                  </div>
                </div>

                <div className="amtHeatHeaderActions">
                  <button className="amtHeatActionBtn" type="button">Edit Heat Details</button>
                  <button className="amtHeatActionBtn amtHeatActionBtnDanger" type="button">Cancel Heat</button>
                </div>
              </div>

              <div className="amtHeatTable">
                <div className="amtHeatTableHead">
                  <div className="amtHeatRowHead">
                    <div className="amtHeatCellHead">GATE</div>
                    <div className="amtHeatCellHead">HORSE NAME</div>
                    <div className="amtHeatCellHead">OWNER</div>
                    <div className="amtHeatCellHead amtHeatCellHeadRight">FINAL RANK</div>
                  </div>
                </div>

                <div className="amtHeatBody">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((gate) => (
                    <div key={gate} className="amtHeatRow">
                      <div className="amtHeatCell amtHeatCellGate">{gate}</div>
                      <div className="amtHeatCell amtHeatCellHorse">
                        <div className="amtHeatHorseName">{gate === 1 ? 'Sovereign Victory' : gate === 2 ? 'Emerald Legacy' : gate === 3 ? 'Gilded Thunder' : gate === 4 ? 'Midnight Rose' : gate === 5 ? 'Royal Radiance' : gate === 6 ? 'Velvet Gallop' : gate === 7 ? 'Majestic Wind' : 'Golden Mane'}</div>
                      </div>
                      <div className="amtHeatCell amtHeatCellOwner">
                        <div className="amtHeatOwnerName">{gate === 1 ? 'Lord Winston Churchill' : gate === 2 ? 'Duke of Wellington' : gate === 3 ? 'Eleanor Rigby' : gate === 4 ? 'Sir Arthur Dayne' : gate === 5 ? 'Lady Katherine' : gate === 6 ? 'Baron von Richter' : gate === 7 ? 'Countess of Kent' : 'General Montgomery'}</div>
                      </div>
                      <div className="amtHeatCell amtHeatCellRank">
                        <button type="button" className="amtAssignRankBtn">Assign Rank</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="amtHeatFooter">
                  <button type="button" className="amtSaveRankBtn">Save Rankings</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminSidebar activeLabel="Tournaments" />
    </div>
  );
}

