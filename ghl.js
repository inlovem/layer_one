// /* =========================================================================
//    0.  THEME TOKENS  – blue / white / grey only
//    ========================================================================= */
//    :root{
//     --unit:16px;           /* base spacing                                  */
//     --blue:#8280FF;        /* brand accent                                   */
//     --bg-light:#EBECF0;    /* neo surface                                    */
//     --grey:#BABECC;        /* soft shadow grey                               */
//     --grey-dark:#61677C;   /* body text                                      */
//     --white:#FFFFFF;
  
//     --shadow-out: -5px -5px 20px var(--white), 5px 5px 20px var(--grey);
//     --shadow-in : inset  2px  2px  5px var(--grey),
//                   inset -5px -5px 10px var(--white);
//   }
  
//   /* =========================================================================
//      1.  GLOBAL BASE  – fonts + blue gradient bg
//      ========================================================================= */
//   html,body{
//     font-family:'Montserrat',sans-serif;
//     font-size:var(--unit);
//     letter-spacing:-0.2px;
//     color:var(--grey-dark);
//     background: var(--white) !important;
//   }
  
//   /* =========================================================================
//      2.  NEOMORPHIC PANELS  – target existing IDs/classes
//      ========================================================================= */
//   #central-panel,
//   #agency-dashboard-statistic-card,
//   .each_product,
//   .n-dialog.n-modal{
//     /* neo surface */
//     background:var(--bg-light)!important;
//     border-radius:calc(var(--unit)*1.25)!important;
//     box-shadow:var(--shadow-out)!important;
//     color:var(--grey-dark)!important;
//   }
  
//   /* Sunken inner inputs/buttons inside those panels */
//   #central-panel input,
//   #agency-dashboard-statistic-card input,
//   .each_product input,
//   .n-dialog.n-modal input,
//   #central-panel textarea,
//   #agency-dashboard-statistic-card textarea,
//   .each_product textarea,
//   .n-dialog.n-modal textarea{
//     background:var(--bg-light)!important;
//     border:0;
//     border-radius:calc(var(--unit)*1.25);
//     box-shadow:var(--shadow-in)!important;
//     padding:var(--unit);
//     color:var(--grey-dark);
//   }
//   #central-panel input:focus,
//   #agency-dashboard-statistic-card input:focus,
//   .each_product input:focus,
//   .n-dialog.n-modal input:focus{
//     box-shadow:inset 1px 1px 2px var(--grey),
//                inset -1px -1px 2px var(--white)!important;
//   }
  
//   /* Buttons already rendered by GHL –‑ give raised neo look but PRESERVE hover states later */
//   #central-panel button,
//   #agency-dashboard-statistic-card button,
//   .each_product button,
//   .n-dialog.n-modal button{
//     background:var(--bg-light)!important;
//     border:0;
//     border-radius:calc(var(--unit)*1.25);
//     padding:var(--unit);
//     font-weight:600;
//     box-shadow:var(--shadow-out)!important;
//     transition:box-shadow .2s ease-in-out,background .2s ease-in-out;
//   }
//   #central-panel button:hover,
//   #agency-dashboard-statistic-card button:hover,
//   .each_product button:hover,
//   .n-dialog.n-modal button:hover{
//     box-shadow:-2px -2px 5px var(--white),
//                 2px  2px 5px var(--grey)!important;
//   }
//   #central-panel button:active,
//   #agency-dashboard-statistic-card button:active,
//   .each_product button:active,
//   .n-dialog.n-modal button:active{
//     box-shadow:var(--shadow-in)!important;
//   }
  
//   /* =========================================================================
//      3.  GLASSMORPHIC SECTIONS  – keep original translucent feel
//      ========================================================================= */
//   .message-body--conversation,
//   .modal-dialog,
//   .vs__dropdown-menu,
//   .globalSearchModal,
//   .dialer,
//   .group-hover,
//   .n-drawer-body,
//   .n-drawer-header,
//   #user-list,
//   .dropdown-menu,
//   .dropdown-menu .show{
//     background:rgba(226,222,247,0.75)!important;
//     backdrop-filter:blur(20px)!important;
//     -webkit-backdrop-filter:blur(20px)!important;
//     border-radius:10px!important;
//     border:0!important;
//   }
  
//   /* Header strip */
//   #location-dashboard-header,
//   .hl_header{
//     background:rgba(255, 255, 255, 0.9)!important;
//     backdrop-filter:blur(8px)!important;
//     border:none!important;
//   }
  
//   /* Glass dashboard/kanban cards that should stay frosted */
//   .hl-card,
//   .dashboard-widget-type-custom,
//   .opportunitiesCard.hl-card{
//     background:rgba(255,255,255,0.10)!important;
//     backdrop-filter:blur(12px)!important;
//     -webkit-backdrop-filter:blur(12px)!important;
//     border:1px solid rgba(255,255,255,0.15)!important;
//     border-radius:16px!important;
//     box-shadow:0 8px 24px rgba(0,0,0,0.2)!important;
//     color:white!important;
//   }
  
//   /* =========================================================================
//      4.  GENERIC TRANSPARENT BUTTONS (retain, but blue accent on hover)
//      ========================================================================= */
//   .n-button,
//   .hl-text-btn,
//   .hl-btn{
//     background:transparent!important;
//     border:1px solid var(--white)!important;
//     color:var(--white)!important;
//     transition:all .2s ease-in-out;
//   }
//   .n-button:hover,
//   .hl-text-btn:hover,
//   .hl-btn:hover{
//     background:rgba(255,255,255,0.08)!important;
//     border-color:var(--blue)!important;
//     color:var(--blue)!important;
//   }
//   .n-button svg,
//   .hl-text-btn svg,
//   .hl-btn svg{stroke:currentColor!important;}
  
//   /* =========================================================================
//      5.  SWITCH COMPONENT (blue when active)
//      ========================================================================= */
//   .n-switch[aria-checked="false"] .n-switch__rail{
//     background:var(--white)!important;
//     border:1px solid var(--white)!important;
//   }
//   .n-switch[aria-checked="true"] .n-switch__rail{
//     background:var(--blue)!important;
//     border:1px solid var(--blue)!important;
//   }
//   .n-switch .n-switch__button{background:#000!important;}
  
//   /* =========================================================================
//      6.  HIGH‑LEVEL CLEAN‑UPS  (no duplicates, no blanket background‑off)
//      ========================================================================= */
//   /* Remove borders on chart containers */
//   .chart-container,
//   .custom-chart-container{border:none!important;box-shadow:none!important;}
  



//   #sidebar-v2, .hl_header, .container-fluid{
//     background: rgba(226, 222, 247, 0) !important;
//   }



// #central-panel, #agency-dashboard-statistic-card, .each_product, .n-dialog.n-modal
// {
//     background-color: rgba(226, 222, 247, 0.75) !important;
//     border-radius: 10px !important
//   }
// #central-panel-header{
//   border-bottom: none !important;
//   margin-bottom: 29px !important;
// }
// .message-body--conversation{
// background-color: rgba(226, 222, 247, 0.75) !important;
//   backdrop-filter: blur(10px) !important;
// }

// .hl_conversations--messages-list-v2, .border-b-2, .hl-statistic{
//   border-color: rgba(0,0,0,0) !important;
// }

// .border-transparent:hover{
//   border-color: #efef15 !important;;
// }

// .vs__search, .number-config-header, .hl-display-sm-semibold {
//   color: var(--blue) !important;
// }

// .modal-dialog, .vs__dropdown-menu, .globalSearchModal, .dialer, .group-hover{
//   background-color: rgba(226, 222, 247, 0.75) !important;
//   backdrop-filter: blur(20px) !important;
//   border-radius: 10px !important;
//   border-width: 0 !important;
// }

// .n-drawer-body,
// .n-drawer-header, #user-list,  .dropdown-menu,
// .dropdown-menu .show {
// background-color: rgba(226, 222, 247, 0.75) !important;
//   backdrop-filter: blur(20px) !important;
//   border-radius: 10px !important
// }

// /* #location-dashboard-header,
// .hl_header {
//   background-color: rgba(255, 255, 255, .15) !important;
//   backdrop-filter: blur(10px) !important;
//   border: none !important;
//   box-shadow: none !important;
// } */


// #location-dashboard-header, 
// .hl_header {
//     background-color: rgba(226, 222, 247, 0.75) !important;
//     backdrop-filter: blur(10px) !important;
//     border: none !important;
//     box-shadow: none !important;
//     top: 0 !important;
// }

// #location-dashboard-header {
//     border-bottom-left-radius: 0 !important;
//     border-bottom-right-radius: 0 !important;
// }

// .hl_header {
//     border-top-left-radius: 0 !important;
//     border-top-right-radius: 0 !important;
// }

// .mt-4 {
//   margin-top: 2px !important;
// }

// .v-binder-follower-content {
//     background-color: rgba(226, 222, 247, 0.75) !important;
// }

// .hl-card {
//   border: 1px solid #eaecf026;
// }

// #location_dashboard-btn-dashboard_switcher {
//   border: none !important;
//   outline: none !important;
//   background:rgb(194, 87, 0) !important;
// }

// #location_dashboard-btn-dashboard_switcher svg,
// .location-dashboard_btn--add-widget svg {
//   stroke: black !important
// }

// .w-5 {
//   stroke: black;
// }

// text {
//   fill:rgb(59, 58, 58) !important;
// }


// .messages-list--item-v2 {
//   border-left-width: 0 !important;

// }

// .conversation-selected-v2 {
//   background:rgb(58, 48, 48);
//   border-left: 3px solid rgb(239, 134, 21) !important;
//   border-right: 0 !important;
// }

// #quick-filter-panel-drawer {
//   border: none !important;
// }

// quick-filter-panel-drawer .clamp-text {
//   color: black !important;
// }

// .title {
//   font-weight: 300;
// }

// #location-switcher-sidbar-v2 {
//   visibility: visible !important;
//   height: 0 !important;
// }

// #location-dashboard_btn--edit-dashboard {
//   background: none !important;
// }

// .n-button__content svg {
//   stroke:rgb(216, 101, 0) !important;
// }

// .mt-4 {
//   margin-top: 0 !important;
// }

// .nav-title:hover {
//   color: #90909072 !important
// }

// .hl_conversations--message-header {
//   background: none !important
// }


// #allCheckbox, [type = checkbox] {
//   border-color:rgba(131, 88, 1, 0.59) !important;
// }

// #allCheckbox:hover {
//   border-color:rgb(163, 96, 1) !important;
// }

// #allCheckbox:focus {
//   border-color:rgb(246, 214, 2) !important;
//   background-color:rgba(1, 92, 128, 0.49) !important;
// }

// #allCheckbox:checked {
//   border-color:rgb(133, 87, 2) !important;
//   background-color:rgba(2, 124, 246, 0.75) !important;
// }

// .icon svg path {
//   stroke: var(--blue) !important;
// }


// .n-button--default-type {
//   background: var(--blue) !important;
//   color: rgb(255, 255, 255) !important
// }


// button {
//   background: none !important;
//   color: rgb(255, 255, 255) !important
// }

// button:hover {
//   color: var(--blue)!important
// }

// button:hover span {
//   color: rgb(159, 159, 159) !important;
// }

// button:hover svg,
// button:hover i {
//   path: black !important;

// }

// button:hover svg,
// button:hover i {
//   color: black !important;
// }




// .hl-text-btn{
//   color: var(--blue) !important;
//   background-color: none !important;
//   background: none !important;
// }
// .hl-text-btn:hover{
//   color: #ff0000 !important;
//   background-color: var(--blue) !important;
// }
// .hl-text-btn:hover .hl-text-sm-medium{
//   color: #d6f602 !important;
// }

// .hl-text-btn.hl-text-sm-medium{
//   border: none !important;
// }


// .nav-title{
//   color: #ffffff !important;
// }
// .nav-title:hover {
//   color: #8cf602 !important;
// }

// .nav-title:active {
//   color: #e2f602 !important;
// }



// #location_dashboard_quick_filters-btn-add_quick_filters{
//   background: #5c5c5ca9 !important;
//   color: rgb(190, 253, 0) !important;
// }

// #location_dashboard_quick_filters-btn-add_quick_filters:focus {
//   border-width: 0 !important;
// }

// #sb_location-mobile-app,
// #sb_app-marketplace,
// #sb_AI #Agents,
// #sb_email-marketing,
// #sb_automation,
// #sb_sites,
// #sb_memberships,
// #sb_reporting {
//   visibility: hidden !important;
//   height: 0 !important;
//   margin: 0 !important;
//   padding: 0 !important;
// }

// /* 🔘 Default: Make all sidebar icons grey */
// .hl_nav-header a img,
// .hl_nav-header a i {
//   filter: grayscale(100%) brightness(0.6);
//   transition: filter 0.3s ease;
// }

// .hl_nav-header a:hover img,
// .hl_nav-header a:hover i,
// .hl_nav-header a:hover svg,
// .hl_nav-header a:hover svg path {
//   filter: none !important;
//   color: var(--blue) !important;
//   stroke: var(--blue) !important;
//   fill: var(--blue) !important;
// }


// /* ✅ ACTIVE: Make white (even if exact-path-active-class, exact-active-class, or active) */
// .hl_nav-header a.exact-path-active-class img,
// .hl_nav-header a.exact-path-active-class i,
// .hl_nav-header a.exact-active-class img,
// .hl_nav-header a.exact-active-class i,
// .hl_nav-header a.active img,
// .hl_nav-header a.active i,
// .hl_nav-header a[aria-current="page"] img,
// .hl_nav-header a[aria-current="page"] i {
//   filter: none !important;
//   filter: brightness(2.5) saturate(1.5) !important;
// }

// /* 🧠 Optional: Make active nav text white too */
// .hl_nav-header a.exact-path-active-class .nav-title,
// .hl_nav-header a.exact-active-class .nav-title,
// .hl_nav-header a.active .nav-title,
// .hl_nav-header a[aria-current="page"] .nav-title {
//   color: white !important;
// }


// /* Remove border from dashboard cards */
// .hl-card,
// .dashboard-widget-type-custom,
// .dashboard-widget-module-custom {
//   border: none !important;
//   box-shadow: none !important; /* Optional: removes subtle edge shadows */
// }

// /* Extra cleanup if borders are inside chart containers */
// .chart-container,
// .custom-chart-container {
//   border: none !important;
//   box-shadow: none !important;
// }

// /* In case some inline styles sneak through */
// .hl-card[style],
// .dashboard-widget-type-custom[style],
// .dashboard-widget-module-custom[style] {
//   border: none !important;
// }


// /* Generic styling for buttons with transparent background and white borders */
// .n-button,
// .hl-table-filter-btn,
// #snippets-header-btn-secondary {
//   background-color: transparent !important;
//   border: 1px solid white !important;
//   color: white !important;
// }

// /* Optional: make inner SVG icons and spans white */
// .n-button svg,
// .n-button path,
// .n-button span {
//   color: white !important;
// }

// /* Optional: brighten on hover */
// .n-button:hover {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }

// .n-button:hover svg,
// .n-button:hover path,
// .n-button:hover span {
//   stroke: var(--blue) !important;
//   color: var(--blue) !important;
// }



// .filter-bar .hl-table-filter-btn span,
// .filter-bar .hl-table-filter-btn svg,
// .filter-bar .hl-table-filter-btn path {
//   background-color: transparent !important;
//   color: #000000 !important;
//   stroke: #000000 !important;
// }


// /* Dropdown menu styling */
// #tb_trigger-links > div[role="menu"] {
//   background-color: rgba(45, 45, 45, 0.95) !important;
//   backdrop-filter: blur(8px) !important;
//   border-radius: 10px !important;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4) !important;
//   border: 1px solid rgba(255, 255, 255, 0.1) !important;
// }

// /* Dropdown links */
// #tb_trigger-links > div[role="menu"] a {
//   color: #ffffff !important;
// }

// /* On hover */
// #tb_trigger-links > div[role="menu"] a:hover {
//   background-color: rgba(255, 255, 255, 0.05) !important;
//   color: var(--blue) !important;
// }

// #hl-table-group-list-table-filter-text-search,
// #hl-table-group-list-table-filter-text-search .n-input__input-el {
//   background-color: transparent !important;
//   color: rgb(255, 255, 255) !important;
// }

// /* Override internal wrapper styling */
// #hl-table-group-list-table-filter-text-search .n-input__border,
// #hl-table-group-list-table-filter-text-search .n-input__state-border {
//   background: transparent !important;
//   border: 1px solid white !important;
// }

// /* Input placeholder fix */
// #hl-table-group-list-table-filter-text-search .n-input__placeholder span {
//   color: rgba(255, 255, 255, 0.7) !important;
// }

// /* Make sure search icon is white */
// #hl-table-group-list-table-filter-text-search .n-input__prefix svg,
// #hl-table-group-list-table-filter-text-search .n-input__prefix path {
//   color: white !important;
// }

// #hl-table-group-list-table-filter-text-search, #hl-table-group-list-table-filter-text-search .n-input__input-el {
//   background-color: transparent !important;
//   color: #ffffff !important;
//   border: 0;
// }

// #hl-table-group-list-table-filter-text-search,
// #hl-table-group-list-table-filter-text-search .n-input__input-el {
//   background-color: transparent !important;
//   color: rgb(255, 255, 255) !important;
// }

// /* Override internal wrapper styling */
// #hl-table-group-list-table-filter-text-search .n-input__border,
// #hl-table-group-list-table-filter-text-search .n-input__state-border {
//   background: transparent !important;
//   border: 1px solid white !important;
// }

// /* Input placeholder fix */
// #hl-table-group-list-table-filter-text-search .n-input__placeholder span {
//   color: rgba(255, 255, 255, 0.7) !important;
// }

// /* Make sure search icon is white */
// #hl-table-group-list-table-filter-text-search .n-input__prefix svg,
// #hl-table-group-list-table-filter-text-search .n-input__prefix path {

//   color: white !important;
// }

// #hl-table-group-list-table-filter-text-search, #hl-table-group-list-table-filter-text-search .n-input__input-el {
//   background-color: transparent !important;
//   color: #ffffff !important;
//   border: 0;
// }

// .n-data-table {
//   --n-th-color-hover-modal: transparent !important;
//   --n-th-color-popover: transparent !important;
//   --n-th-color-hover-popover: transparent !important;
//   --n-th-button-color-hover: transparent !important;
// }

// .n-data-table-th,
// .n-data-table-th:hover {
//   background-color: transparent !important;
//   box-shadow: none !important;
//   color: white !important;
// }

// .n-button n-button--default-type n-button--small-type {
//   background-color: transparent !important;
//   border: 1px solid white !important;
//   color: white !important;
// }

// .n-pagination .n-button {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
// }

// /* Disable states — still transparent */
// .n-pagination .n-button:disabled,
// .n-pagination .n-pagination-item--disabled .n-button {
//   background-color: transparent !important;
//   border-color: rgba(255, 255, 255, 0.15) !important;
//   color: rgba(255, 255, 255, 0.4) !important;
// }

// /* Hover, focus, press */
// .n-pagination .n-button:hover,
// .n-pagination .n-button:focus,
// .n-pagination .n-button:active {
//   background-color: rgba(255, 255, 255, 0.05) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }

// /* 🎯 Target Lead Source Report pagination buttons */
// #dashboard-lead-source-report-pagination-pagination .n-button {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
// }

// /* 🛑 Disable state = transparent too */
// #dashboard-lead-source-report-pagination-pagination .n-button:disabled,
// #dashboard-lead-source-report-pagination-pagination .n-pagination-item--disabled .n-button {
//   background-color: transparent !important;
//   border-color: rgba(255, 255, 255, 0.15) !important;
//   color: rgba(255, 255, 255, 0.4) !important;
// }

// /* ✨ Hover, focus, active */
// #dashboard-lead-source-report-pagination-pagination .n-button:hover,
// #dashboard-lead-source-report-pagination-pagination .n-button:focus,
// #dashboard-lead-source-report-pagination-pagination .n-button:active {
//   background-color: rgba(255, 255, 255, 0.05) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }

// /* 📦 Optional: match button content color too */
// #dashboard-lead-source-report-pagination-pagination .n-button__content {
//   color: inherit !important;
// }


// /* 💡 All generic Naive buttons with default type */
// .n-button.n-button--default-type {
//   background-color: transparent !important;
//   color: white !important;
// }

// /* 🔁 Hover, Focus, Pressed for default-type buttons */
// .n-button.n-button--default-type:hover,
// .n-button.n-button--default-type:focus,
// .n-button.n-button--default-type:active {
//   background-color: rgba(255, 255, 255, 0.05) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }

// /* 🛑 Disabled buttons */
// .n-button[disabled],
// .n-button.n-button--disabled {
//   background-color: transparent !important;
//   border-color: rgba(255, 255, 255, 0.15) !important;
//   color: rgba(255, 255, 255, 0.4) !important;
//   cursor: not-allowed !important;
// }

// /* 🧩 Make sure icon buttons (like trash icon) stay clean */
// .n-button svg,
// .n-button path {
//   color: white !important;
// }

// /* 🔘 Optional: Specific ID overrides (just in case anything is stubborn) */
// #add-filter,
// #drawer-component-btn-negative-action,
// #sort-filter-component__button,
// #bulk-request-previous-btn,
// #bulk-request-next-btn,
// #stats-page-btn {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
// }

// #add-filter:hover,
// #drawer-component-btn-negative-action:hover,
// #sort-filter-component__button:hover,
// #bulk-request-previous-btn:hover,
// #bulk-request-next-btn:hover,
// #stats-page-btn:hover {
//   background-color: rgba(255, 255, 255, 0.05) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }


// #trash-btn {
//   --n-color: transparent !important;
//   --n-color-hover: transparent !important;
//   --n-color-pressed: transparent !important;
//   --n-color-focus: transparent !important;
//   --n-border: 1px solid white !important;
//   --n-border-hover: 1px solid var(--blue) !important;
//   --n-text-color: white !important;
//   --n-text-color-hover: var(--blue) !important;
//   --n-text-color-pressed: var(--blue) !important;
//   --n-text-color-focus: var(--blue) !important;
//   background-color: transparent !important;
//   color: white !important;
//   border: 1px solid white !important;
//   transition: all 0.2s ease-in-out !important;
// }

// #trash-btn:hover {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   color: var(--blue) !important;
//   border-color: var(--blue) !important;
// }


// #compound-filter button,
// #compound-filter .n-button {
//   --n-color: transparent !important;
//   --n-color-hover: rgba(255, 0, 0, 0.05) !important;
//   --n-color-pressed: rgba(255, 255, 255, 0.1) !important;
//   --n-color-focus: rgba(255, 255, 255, 0.1) !important;

//   --n-text-color: #5e5e5e !important;
//   --n-text-color-hover: var(--blue) !important;
//   --n-text-color-pressed: var(--blue) !important;
//   --n-text-color-focus: var(--blue) !important;

//   --n-border: 1px solid rgba(255, 255, 255, 0.3) !important;
//   --n-border-hover: 1px solid var(--blue) !important;
//   --n-border-pressed: 1px solid var(--blue) !important;
//   --n-border-focus: 1px solid var(--blue) !important;

//   background-color: transparent !important;
//   color: #ffffff !important;
//   border: 1px solid rgba(255, 255, 255, 0.3) !important;
//   border-radius: 6px !important;
//   transition: all 0.2s ease-in-out;
// }

// #compound-filter button:hover,
// #compound-filter .n-button:hover {
//   background-color: rgba(255, 255, 255, 0.05) !important;
//   color: var(--blue) !important;
//   border-color: var(--blue) !important;
// }


// #compound-filter button:hover .n-button__content svg,
// #compound-filter button:hover .n-button__content path {
//   stroke: var(--blue) !important;
//   color: var(--blue) !important;
// }


// .n-card.n-modal.hl-modal {
//   background-color: rgba(20, 20, 20, 0.6) !important; /* semi-transparent grey */
//   backdrop-filter: blur(15px) !important; /* glassy blur */
//   -webkit-backdrop-filter: blur(15px) !important;
//   color: #ffffff !important;
//   border: 1px solid rgba(255, 255, 255, 0.1) !important;
//   box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25) !important;
//   --n-color: transparent !important;
//   --n-color-modal: transparent !important;
//   --n-color-popover: transparent !important;
//   --n-color-embedded: transparent !important;
//   --n-color-embedded-modal: transparent !important;
//   --n-color-embedded-popover: transparent !important;
//   --n-border-color: rgba(255, 255, 255, 0.1) !important;
//   --n-text-color: #ffffff !important;
//   --n-title-text-color: #ffffff !important;
//   --n-close-icon-color: rgba(255, 255, 255, 0.75) !important;
//   --n-close-icon-color-hover: var(--blue) !important;
//   --n-close-icon-color-pressed: var(--blue) !important;
// }



// /* 🔘 Transparent button style for modals */
// #modal-footer-btn-negative-action,
// #book-appt-custom,
// #book-appt-default,
// .n-button--default-type,
// .n-button--tertiary-type {
//   background-color: transparent !important;
//   color: white !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   --n-text-color: white !important;
//   --n-color: transparent !important;
//   --n-border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   --n-ripple-color: transparent !important;
//   --n-color-hover: rgba(255, 255, 255, 0.1) !important;
//   --n-border-hover: 1px solid var(--blue) !important;
//   --n-text-color-hover: var(--blue) !important;
// }

// /* 🖱️ On hover: glow + soft background */
// #modal-footer-btn-negative-action:hover,
// #book-appt-custom:hover,
// #book-appt-default:hover {
//   background-color: rgba(255, 255, 255, 0.08) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }

// #modal-footer-btn-negative-action span,
// #book-appt-custom span,
// #book-appt-default span {
//   color: inherit !important;
// }

// /* Ensure SVG/icons inside are white or matching */
// #modal-footer-btn-negative-action svg,
// #book-appt-custom svg,
// #book-appt-default svg,
// #modal-footer-btn-negative-action path,
// #book-appt-custom path,
// #book-appt-default path {

//   fill: white !important;
// }

// #add-description-text,
// .addDescriptionText {
//   color: var(--blue) !important;
// }

// #add-description-text:hover,
// .addDescriptionText:hover {
//   color: #ffffff !important;
//   text-decoration: underline;
// }

// .n-base-selection-label__render-label:hover,
// .n-base-selection-overlay__wrapper:hover {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   color: var(--blue) !important;
// }

// .n-base-selection-overlay__wrapper {
//   color: white !important;
// }

// .n-base-selection-placeholder,
// .n-base-selection-placeholder__inner {
//   color: rgba(255, 255, 255, 0.6) !important;
// }

// .n-base-selection-input {
//   color: white !important;
// }


// input[type="checkbox"]:checked::before {
//   content: '✔';
//   color: var(--blue); /* make sure it's visible */
//   font-size: 16px;
// }


// /* 🔁 Swap button styles: ENABLED = white, DISABLED = transparent */

// button.btn.btn-light.btn-sm {
// background-color: white !important;
// color: black !important;
// border: 1px solid white !important;
// }

// button.btn.btn-light.btn-sm:disabled {
// background-color: transparent !important;
// color: rgba(255, 255, 255, 0.3) !important;
// border: 1px solid rgba(255, 255, 255, 0.2) !important;
// cursor: not-allowed !important;
// opacity: 1 !important; /* override built-in opacity if needed */
// }

// /* Optional: hover effect for enabled buttons */
// button.btn.btn-light.btn-sm:not(:disabled):hover {
// background-color: var(--blue) !important;
// color: black !important;
// border-color: var(--blue) !important;
// }

// /* Force icons inside enabled (active) buttons to be black */
// button.btn.btn-light.btn-sm:not(:disabled) i,
// button.btn.btn-light.btn-sm:not(:disabled) svg,
// button.btn.btn-light.btn-sm:not(:disabled) path {
// color: black !important;
// stroke: black !important;
// }

// /* Keep the "More Filters" button transparent */
// #hl_smartlists--filter-btn {
// background-color: transparent !important;
// }

// /* Keep text white (normal and hover) */
// #hl_smartlists--filter-btn span {
// color: white !important;
// }
// #hl_smartlists--filter-btn:hover span {
// color: white !important;
// }

// /* Make the icon white (normal and hover) */
// #hl_smartlists--filter-btn i {
// color: white !important;

// }

// #hl_smartlists--filter-btn:hover i {
// color: white !important;

// }


// /* Make the Cancel button's background fully transparent, but keep everything else */
// #cancelfilter {
// background-color: transparent !important;
// --n-color: transparent !important;
// --n-color-hover: transparent !important;
// --n-color-pressed: transparent !important;
// --n-color-focus: transparent !important;
// --n-border: 1px solid rgb(255, 255, 255) !important;
// }

// /* Keep the text color white or as needed */
// #cancelfilter .n-button__content {
// color: white !important;
// }



// .wrapper[data-v-3b1ba070] {
//   background: none !important;
//   background-color: rgba(0, 0, 0, 0) !important;
//   color: #FFF !important;
// }

// /* Add this to your existing style injection */
// .n-date-panel.n-date-panel--daterange {
// background-color: rgba(255, 255, 255, 0.1) !important;
// backdrop-filter: blur(12px) !important;
// -webkit-backdrop-filter: blur(12px) !important;
// border-radius: 12px !important;
// box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25) !important;
// color: #ffffff !important;
// }

// .n-date-panel--daterange .n-date-panel-actions__suffix .n-button {
// background-color: transparent !important;
// border: 1px solid rgba(255, 255, 255, 0.2) !important;
// color: white !important;
// box-shadow: none !important;
// }

// /* Optional: Hover effect for better UX */
// .n-date-panel--daterange .n-date-panel-actions__suffix .n-button:hover {
// background-color: rgba(255, 255, 255, 0.05) !important;
// border-color: var(--blue) !important;
// color: var(--blue) !important;
// }


// /* Target Tabulator paginator buttons and dropdown */
// .tabulator-paginator select,
// .tabulator-paginator button {
// color: #ffffff !important;
// }

// /* Optional: If the background is light, make sure the background is transparent or styled to match your glass theme */
// .tabulator-paginator select,
// .tabulator-paginator button {
// background-color: transparent !important;
// border: 1px solid rgba(255, 255, 255, 0.25) !important;
// }

// #m_cancel {
// background-color: transparent !important;
// color: white !important;
// border: 1px solid rgba(255, 255, 255, 0.25) !important;
// box-shadow: none !important;
// --n-color: transparent !important;
// --n-color-hover: transparent !important;
// --n-color-pressed: transparent !important;
// --n-color-focus: transparent !important;
// --n-border: 1px solid rgba(255, 255, 255, 0.25) !important;
// --n-text-color: white !important;
// --n-ripple-color: transparent !important;
// }

// /* Optional: On hover */
// #m_cancel:hover {
// background-color: rgba(255, 255, 255, 0.08) !important;
// border-color: var(--blue) !important;
// color: var(--blue) !important;
// }

// #kanban-toggle-btn,
// #list-view-toggle-btn,
// #import-btn {
// background-color: transparent !important;
// --n-color: transparent !important;
// }


// /* ✨ Apply glassy styling to Kanban cards */
// .opportunitiesCard.hl-card {
// background-color: rgba(255, 255, 255, 0.1) !important;
// backdrop-filter: blur(12px) !important;
// -webkit-backdrop-filter: blur(12px) !important;
// border-radius: 12px !important;
// border: 1px solid rgba(255, 255, 255, 0.15) !important;
// box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
// color: white !important;
// }

// /* Optional: make text inside readable against the glassy bg */
// .opportunitiesCard.hl-card * {
// color: white !important;
// }

// #manage-fields-cancel {
// background-color: transparent !important;
// --n-color: transparent !important;
// }


// .hl-btn {
// background-color: transparent !important;
// color: white !important;
// border: 1px solid white !important;
// }

// .hl-btn i {
// color: white !important;

// }

// .hl-btn:hover {
// background-color: transparent !important;
// color: var(--blue) !important;
// border-color: var(--blue) !important;
// }

// .hl-btn:hover i {
// color: var(--blue) !important;
// stroke: var(--blue) !important;
// }


// #tgl-show-in-pie-chart,
// #tgl-show-in-funnel {
// border: 2px solid white !important;
// color: var(var(--blue)) !important;
// }

// #sort-filter-component__cancel-btn {
// background-color: transparent !important;
// border: 1px solid rgba(255, 255, 255, 0.6) !important;
// color: white !important;
// }

// #sort-filter-component__cancel-btn:hover {
// background-color: rgba(255, 255, 255, 0.05) !important;
// color: white !important;
// }


// .n-base-select-menu {
// background-color: #1e1e1e !important;
// color: rgb(255, 0, 0) !important;
// box-shadow: none !important;
// border: 1px solid #444 !important;
// }

// .n-base-select-option--pending,
// .n-base-select-option:hover {
// background-color: #2a2a2a !important;
// color: var(--blue) !important;
// }

// /* Ensure dropdown options change properly on hover */
// .n-base-select-option--pending:hover,
// .n-base-select-option--selected:hover,
// .n-base-select-option:hover {
// background-color: #2a2a2a !important;
// color: var(--blue) !important;
// }

// /* Target the inner span that holds text */
// .n-base-select-option span,
// .n-base-select-option__content span {
// color: white !important;
// }

// /* When hovered, force the text color inside to green */
// .n-base-select-option:hover span,
// .n-base-select-option__content:hover span {
// color: #000000 !important;
// }

// /* Force checkmark (svg) inside selected option to be green */
// .n-base-select-option__check svg path {
// fill: var(--blue) !important;
// }


// .n-date-panel.n-date-panel--daterange.n-date-panel--shadow {
// background-color: rgba(255, 255, 255, 0.1) !important;
// backdrop-filter: blur(12px) !important;
// -webkit-backdrop-filter: blur(12px) !important;
// border-radius: 12px !important;
// border: 1px solid rgba(255, 255, 255, 0.15) !important;
// box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
// color: white !important;

// /* Override internal theme variables */
// --n-panel-color: rgba(255, 255, 255, 0.1) !important;
// --n-panel-box-shadow: none !important;
// --n-panel-text-color: white !important;
// --n-calendar-title-text-color: white !important;
// --n-calendar-days-text-color: white !important;
// --n-item-text-color: white !important;
// --n-item-color-hover: rgba(255, 255, 255, 0.1) !important;
// --n-item-color-active: var(--blue) !important;
// --n-item-text-color-active: rgb(255, 255, 255) !important;
// --n-item-color-disabled: rgba(255, 255, 255, 0.05) !important;
// --n-item-text-color-disabled: rgba(255, 255, 255, 0.3) !important;
// }

// /* Glassy hover effect */
// .n-date-panel-date:hover {
// background-color: rgba(255, 255, 255, 0.08) !important;
// color: var(--blue) !important;
// border-radius: 4px !important;
// }

// /* Selected dates in range */
// .n-date-panel-date--selected,
// .n-date-panel-date--start,
// .n-date-panel-date--end {
// background-color: var(--blue) !important;
// color: black !important;
// border-radius: 6px !important;
// }

// /* Confirm button to match your theme */
// .n-date-panel-actions__suffix .n-button {
// background-color: transparent !important;
// border: 1px solid rgba(255, 255, 255, 0.15) !important;
// color: white !important;
// font-weight: 500 !important;
// }

// .n-date-panel-actions__suffix .n-button:hover {
// background-color: rgba(255, 255, 255, 0.08) !important;
// color: var(--blue) !important;
// border-color: var(--blue) !important;
// }

// button.manage-fields {
// border: 1px solid white !important;
// border-radius: 6px !important;
// background-color: transparent !important;
// color: white !important;
// padding: 6px 10px !important;
// transition: all 0.2s ease-in-out;
// }

// /* Optional: hover effect */
// button.manage-fields:hover {
// border-color: var(--blue) !important;
// color: var(--blue) !important;
// background-color: rgba(255, 255, 255, 0.05) !important;
// }

// button.manage-fields:hover span {
// color: var(--blue) !important;
// }

// button.manage-fields:hover svg,
// button.manage-fields:hover path {
// stroke: var(--blue) !important;
// }


// .payment-widget-glassy {
// background-color: rgba(255, 255, 255, 0.1) !important;
// backdrop-filter: blur(12px) !important;
// -webkit-backdrop-filter: blur(12px) !important;
// border-radius: 12px !important;
// border: 1px solid rgba(255, 255, 255, 0.15) !important;
// box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
// color: white !important;
// }

// /* Optional text override for clarity on dark bg */
// .payment-widget-glassy * {
// color: white !important;
// }

// /* Optional: soft divider line */
// .payment-widget-glassy hr {
// border-color: rgba(255, 255, 255, 0.2) !important;

// }

// .n-button.n-button--default-type.n-button--tiny-type
//   {
//       background-color: transparent !important;
//       border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       color: white !important;
//       box-shadow: none !important;
//       --n-color: transparent !important;
//       --n-color-hover: transparent !important;
//       --n-color-pressed: transparent !important;
//       --n-color-focus: transparent !important;
//       --n-border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       --n-text-color: white !important;
//       --n-ripple-color: transparent !important;
//   }


//   /* Glassy Dropdown Menu Background */
// .n-dropdown-menu {
//   background-color: rgba(50, 50, 50, 0.75) !important;
//   backdrop-filter: blur(10px) !important;
//   -webkit-backdrop-filter: blur(10px) !important;
//   border-radius: 10px !important;
//   border: 1px solid rgba(255, 255, 255, 0.1) !important;
//   color: white !important;
//   --n-option-color-hover: rgba(255, 255, 255, 0.08) !important;
//   --n-option-text-color: white !important;
//   --n-option-text-color-hover: var(--blue) !important;
//   --n-option-color-active: rgba(255, 255, 255, 0.05) !important;
//   --n-option-text-color-active: var(--blue) !important;
// }

// /* Individual dropdown options */
// .n-dropdown-option {
//   background-color: transparent !important;
//   color: white !important;
// }

// /* Hover & Active Styling */
// .n-dropdown-option:hover,
// .n-dropdown-option-body:hover {
//   background-color: rgba(255, 255, 255, 0.08) !important;
//   color: var(--blue) !important;
// }

// /* Ensure text inside label is visible and themed */
// .n-dropdown-option-body__label {
//   color: white !important;
// }

// .n-dropdown-option:hover .n-dropdown-option-body__label {
//   color: var(--blue) !important;
// }


// .n-dropdown-option:hover svg,
// .n-dropdown-option:hover path {
//   stroke: var(--blue) !important;
// }

// .n-button.n-button--default-type.n-button--medium-type {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
// }


// .n-button.n-button--default-type.n-button--small-type.mt-2 {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
// }

// /* ✅ Inactive (white rail) */
// .n-switch[aria-checked="false"] .n-switch__rail {
//   background-color: white !important;
//   border: 1px solid white !important;
// }

// /* ✅ Active (green rail) */
// .n-switch[aria-checked="true"] .n-switch__rail {
//   background-color: var(--blue) !important;
//   border: 1px solid var(--blue) !important;
// }

// /* 🔘 Optional: button/knob always dark for contrast */
// .n-switch .n-switch__button {
//   background-color: black !important;
//   box-shadow: none !important;
// }

// /* 💫 Smooth transition */
// .n-switch__rail,
// .n-switch__button {
//   transition: all 0.25s ease-in-out !important;
// }

// .n-button.n-button--default-type.n-button--small-type
//   {
//       background-color: transparent !important;
//       border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       color: white !important;
//       box-shadow: none !important;
//   }

//   .n-button.n-button--default-type.n-button--medium-type.w-full.rounded-lg.border-2.border-dashed.p-2.n-button.n-button--default-type.n-button--medium-type.w-full.rounded-lg.border-2.border-dashed.p-2.border-gray-300
//   {
//       background-color: transparent !important;
//       border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       color: white !important;
//       box-shadow: none !important;
//   }

//   .n-button.n-button--default-type.n-button--medium-type.w-32.mr-2
//   {
//       background-color: transparent !important;
//       border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       color: white !important;
//       box-shadow: none !important;
//   }

//   /* 🌫️ Make the hover background match your theme */
// .n-menu-item-content:hover {
//   background-color: rgba(255, 255, 255, 0.08) !important;
//   color: var(--blue) !important;
// }

// /* ✅ Ensure text inside stays themed */
// .n-menu-item-content:hover .n-menu-item-content-header {
//   color: var(--blue) !important;
// }

// /* 🖤 Default (non-hovered) text color */
// .n-menu-item-content .n-menu-item-content-header {
//   color: white !important;
// }

// /* 🎯 Optional: If selected item should be green */
// .n-menu-item-content--selected {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   color: var(--blue) !important;
// }

// .n-menu-item-content--selected .n-menu-item-content-header {
//   color: var(--blue) !important;
// }

// /* 🌫️ Soften menu hover and active states */
// .n-menu {
//   --n-item-color-hover: rgba(255, 255, 255, 0.06) !important;
//   --n-item-color-active: rgba(255, 255, 255, 0.08) !important;
//   --n-item-color-active-hover: rgba(255, 255, 255, 0.08) !important;
//   --n-item-color-active-collapsed: rgba(255, 255, 255, 0.08) !important;
// }

// /* Make SVG icons white */
// .toolbar-button__icon,
// .toolbar-button__icon--medium,
// .n-base-icon,
// svg {
// color: white !important;
// }

// /* Make base64 IMG icons white using filter */
// .toolbar-button__icon img,
// .toolbar-button__icon--medium img,
// img.toolbar-button__icon {
// filter: brightness(0) invert(1) !important;
// }

// .toolbar-button__icon--medium {
//   filter: brightness(0) invert(1);
// }

// /* Target all dropdown menus */
// .topmenu-navitem > div[role="menu"] {
//   background-color: #484848 !important; /* Light gray */
//   color: #fcfcfc; /* Optional: darker text for contrast */
// }

// /* Light gray hover background for dropdown items */
// .topmenu-navitem > div[role="menu"] a:hover {
//   background-color: #9998985f !important; /* Light gray */
//   color: #000 !important; /* Optional: darker text */
// }

// .n-button.n-button--default-type.n-button--medium-type
//   {
//       background-color: transparent !important;
//       border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       color: white !important;
//       box-shadow: none !important;
//   }

//   .n-button.n-button--default-type.n-button--medium-type
//   {
//       background-color: transparent !important;
//       border: 1px solid rgba(255, 255, 255, 0.25) !important;
//       color: white !important;
//       box-shadow: none !important;
//   }


// .n-button--default-type:not(.n-button--disabled):hover {
//   background-color: #f0f0f0; /* Light gray hover */
//   color: #000; /* Optional: darker text */
//   border-color: #ccc;
// }

// /* Disabled buttons still look inert, but transition smoothly if visually styled */
// .n-button--disabled {
//   cursor: not-allowed;
//   opacity: 0.6;
// }

// /* Base transition for all buttons */
// .n-button {
//   transition:
//     background-color 0.3s ease,
//     color 0.3s ease,
//     border-color 0.3s ease;
// }

// /* Hover effect for enabled buttons */
// .n-button:not(.n-button--disabled):hover {
//   background-color: #f5f5f5; /* Light gray */
//   border-color: #ccc;
//   color: #333;
// }

// /* Optional focus and active feedback */
// .n-button:focus,
// .n-button:active {
//   outline: none;
//   background-color: #eaeaea;
// }

// /* Disabled button still transitions smoothly */
// .n-button--disabled {
//   cursor: not-allowed;
//   opacity: 0.5;
//   transition: opacity 0.3s ease;
// }

// .n-button-group .n-button:hover {
//   background-color: transparent !important;
//   border-color: transparent !important;
// }

// .n-button.n-button--default-type.n-button--large-type {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
//   box-shadow: none !important;
// }

// .n-button.n-button--default-type.n-button--medium-type.dropdown-tree__trigger:hover {
//   background-color: transparent !important;
//   border-color: transparent !important;
// }

// .n-button.n-button--default-type.n-button--medium-type:hover {
//   background-color: transparent !important;
//   border-color: transparent !important;
// }

// .n-button.n-button--default-type.n-button--large-type.mr-3 {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
//   box-shadow: none !important;
// }

// .n-button.n-button--default-type.n-button--medium-type.ml-auto {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
//   box-shadow: none !important;
// }

// .n-button.n-button--default-type.n-button--medium-type.w-96 {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
//   box-shadow: none !important;
// }
// .n-button.n-button--default-type.n-button--small-type {
//   background-color: transparent !important;
//   color: black !important;
//   box-shadow: none !important;
// }



// .n-button.n-button--default-type.n-button--medium-type {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
//   box-shadow: none !important;
// }

// .highcharts-background {
//   fill: rgba(255, 255, 255, 0.1) !important;
//   backdrop-filter: blur(12px) !important;
//   -webkit-backdrop-filter: blur(12px) !important;
//   stroke: rgba(255, 255, 255, 0.15) !important;
//   rx: 12px !important;
//   ry: 12px !important;
// }


// .hl_widget--card
// {
//   fill: rgba(255, 255, 255, 0.1) !important;
//   backdrop-filter: blur(12px) !important;
//   -webkit-backdrop-filter: blur(12px) !important;
//   stroke: rgba(255, 255, 255, 0.15) !important;
//   rx: 12px !important;
//   ry: 12px !important;
// }


// .n-button.n-button--default-type.n-button--medium-type {
//   background-color: transparent !important;
//   border: 1px solid rgba(255, 255, 255, 0.25) !important;
//   color: white !important;
//   box-shadow: none !important;
// }


// .n-tag.n-tag--round.hl-success {
//   background-color: rgba(255, 255, 255, 0.12) !important;
//   color: var(--blue) !important;
//   backdrop-filter: blur(8px) !important;
//   -webkit-backdrop-filter: blur(8px) !important;
//   border: 1px solid rgba(255, 255, 255, 0.15) !important;
//   border-radius: 9999px !important; /* for full round pill look */
// }

// .n-tabs-nav-y-scroll {
//   background-color: rgba(255, 255, 255, 0.08) !important;
//   backdrop-filter: blur(8px) !important;
//   -webkit-backdrop-filter: blur(8px) !important;
//   border: 1px solid rgba(255, 255, 255, 0.15) !important;
//   color: white !important;
//   border-radius: 8px !important;
//   transition: all 0.25s ease-in-out;
// }

// /* 🔁 Hover effect */
// .n-tabs-nav-y-scroll:hover {
//   background-color: rgba(255, 255, 255, 0.12) !important;
//   border-color: var(--blue) !important;
//   color: var(--blue) !important;
// }


// /* Frosty hover effect */
// .n-tabs-tab:hover {
// background-color: rgba(255, 255, 255, 0.08) !important;
// color: var(--blue) !important;
// }

// /* Frosty selected tab */
// .n-tabs-tab--active {
// background-color: rgba(255, 255, 255, 0.12) !important;
// color: var(--blue) !important;
// }

// .n-button.n-button--default-type.n-button--small-type {
//   background: transparent !important;
// }
// .n-base-selection-label {
//   background: transparent !important;
// }

// .n-button.n-button--default-type.n-button--small-type {
//   background-color: transparent !important;
// }




// .email-provider-container.mb-6.cursor-pointer.hl-card {
//   background-color: transparent !important;
//   color: inherit !important;
// }

// .n-button.n-button--default-type.n-button--large-type {
//   background-color: transparent !important;
// }
// .n-button.n-button--default-type.n-button--small-type {
//   background-color: transparent !important;
// }


// .n-button.n-button--primary-type.n-button--medium-type {
//   background-color: transparent !important;
// }

// .n-button.n-button{
//   background-color: transparent !important;
// }

// .card-integration--inner {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   backdrop-filter: blur(12px) !important;
//   -webkit-backdrop-filter: blur(12px) !important;
//   border-radius: 12px !important;
//   border: 1px solid rgba(255, 255, 255, 0.15) !important;
//   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
//   color: white !important;
//   height: 100% !important;
// }





// .n-tabs-tab.n-tabs-tab--active{
//   background-color: rgba(255, 255, 255, 0.12) !important;
//   color: var(--blue) !important;
//   border-radius: 8px !important;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
//   transition: all 0.25s ease-in-out;
// }

// /* Base tab style */
// .n-tabs-tab {
//   color: rgba(255, 255, 255, 0.7) !important;
//   border-radius: 8px !important;
//   padding: 6px 14px !important;
//   margin-right: 6px;
//   transition: all 0.2s ease-in-out;
//   font-weight: 400;
// }

// /* ✨ Hover with purple background */
// .n-tabs-tab:hover {
//   color: white !important;
//   background-color: rgba(160, 32, 240, 0.2) !important; /* bright purple, glassy */
//   backdrop-filter: blur(6px);
//   box-shadow: 0 2px 8px rgba(160, 32, 240, 0.3);
//   border-radius: 8px;
// }

// /* ✅ Active tab — keep that sweet neon green glow */
// .n-tabs-tab--active {
//   color: var(--blue) !important;
//   background-color: rgba(213, 246, 2, 0.12) !important;
//   font-weight: 600 !important;
//   border-radius: 8px !important;
//   box-shadow: 0 4px 12px rgba(213, 246, 2, 0.3) !important;
//   backdrop-filter: blur(8px);
// }

// /* Label transition */
// .n-tabs-tab__label {
//   transition: color 0.2s ease-in-out;
// }

// .wrapperHeader.z-10.h-full.overflow-y-scroll.border-r.border-gray-200 {
//   color: white !important;
//   border-color: rgba(255, 255, 255, 0.2) !important; /* optional: lighten the border */
// }

// .wrapperHeader * {
//   color: white !important;
// }


// .opportunityCard.hl-card {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   backdrop-filter: blur(12px) !important;
//   -webkit-backdrop-filter: blur(12px) !important;
//   border-radius: 12px !important;
//   border: 1px solid rgba(255, 255, 255, 0.15) !important;
//   box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
//   color: white !important;
//   padding: 16px !important; /* optional spacing inside the card */
//   transition: all 0.3s ease-in-out;
// }

// /* Optional: add a subtle hover effect for interactivity */
// .opportunityCard.hl-card:hover {
//   background-color: rgba(255, 255, 255, 0.15) !important;
//   box-shadow: 0 10px 32px rgba(0, 0, 0, 0.3) !important;
//   border-color: var(--blue) !important;
// }

// .hl_wrapper.w-full {
//   background-color: transparent !important;   
// }

// .n-button.n-button--default-type.n-button--large-type.hl-table-filter-btn svg,
// .n-button.n-button--default-type.n-button--large-type.hl-table-filter-btn path {
// stroke: white !important;
// color: white !important;
// background-color: transparent !important;
// }

// .n-button.n-button--default-type.n-button--large-type.hl-table-filter-btn span {
//   color: white !important;
//   background-color: transparent !important;

// }


// .n-button.n-button--default-type.n-button--large-type.hl-table-filter-btn {
//   color: white !important;
//   background-color: transparent !important;

// }


//   .hl_v2-location_switcher {
//     background-color: rgba(5, 25, 45, 0.3) !important;
//     backdrop-filter: blur(22px) !important;
//     -webkit-backdrop-filter: blur(22px) !important;
//     border-radius: 12px !important;
//     border: 1px solid rgba(255, 255, 255, 0.15) !important;
//     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
//     color: white !important;
//     padding: 12px !important;
//     transition: all 0.3sease-in-out;
// }


// /* 

// .dashboard-widget-type-custom {
//   background-color: rgba(255, 255, 255, .15) !important;
//   backdrop-filter: blur(5px) !important;
//   border-width: 0 !important;
//   border-radius: 16px !important;
// }

// .dashboard-widget-type-custom {
//   background-color: rgba(255, 255, 255, 0.1) !important;
//   backdrop-filter: blur(12px) !important;
//   border-radius: 16px !important;
// } */

//  #notification_banner-top_bar{
//   background: rgba(85, 5, 5, 0.28) !important;
//   backdrop-filter: blur(16px) saturate(180%) !important;
//     -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
//  }

// .hl-card {
//     background: rgba(5, 5, 5, 0.28) !important;
//     border: 1px solid rgba(255, 255, 255, 0.18) !important;
//     border-radius: 16px !important;
//     backdrop-filter: blur(16px) saturate(180%) !important;
//     -webkit-backdrop-filter: blur(16px) saturate(180%) !important;
//     box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2) !important;
//     transition: all 0.3s ease-in-out !important;
//     height: 100% !important;
//   }

  
//   .hl-card-content {
//     background-color: rgba(255, 255, 255, 0.1) !important;
//     backdrop-filter: blur(12px) !important;
//     -webkit-backdrop-filter: blur(12px) !important;
//     border-radius: 12px !important;
//     color: white !important;
//     border: none !important;
//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     gap: 1rem;
//   }

//   .hl-card-header{ border-bottom: none !important;}
  


//   .hl-card-content .m-auto {
//     margin: 0 auto !important;
//   }
  
// .masking-layer.suspend{ background: red !important;} .masking-layer.suspend span { color: black !important;}
// .vue-echarts-inner path[d="M0 0L33 7L66 0L66 75.5233L33 82.5233L0 75.5233Z"] {
//   transition: fill 0.3s ease, stroke-width 0.3s ease, stroke 0.3s ease !important;
//   stroke-width: 2 !important;
//   stroke: rgba(105, 104, 255, 0.6) !important;
//   fill: rgba(105, 104, 255, 0.22) !important;
// }

// .vue-echarts-inner:hover path[d="M0 0L33 7L66 0L66 75.5233L33 82.5233L0 75.5233Z"] {
//   fill: rgba(105, 104, 255, 0.5) !important;
//   stroke: rgba(105, 104, 255, 1) !important;
//   stroke-width: 4 !important;
// }

// #location-switcher-sidbar-v2{ visibility:hidden !important;}

// .ZH9GEANH2fTAI1P3ZZOK #location-switcher-sidbar-v2{ visibility:visible !important;}
// .ZH9GEANH2fTAI1P3ZZOK #sb_reputation, .ZH9GEANH2fTAI1P3ZZOK #sb_AI, .ZH9GEANH2fTAI1P3ZZOK #sb_calendars, .ZH9GEANH2fTAI1P3ZZOK #sb_launchpad{
//      display: flex !important;      
//   visibility: visible !important;
//   height: auto !important;
//   margin: initial !important;
//   padding: initial !important;
//   }

// #agency-dashboard-statistic-card .icon  { background: #d5f601 !important;
//     border: #d5f601 !important;}
// .text-dark{
//  color: #ffffff !important;}

//  #sb_reputation, #sb_AI, #sb_calendars, #sb_launchpad{
//     display: none !important;
//     visibility: hidden !important;
//     height: 0 !important;
//     margin 0 !important;
//     padding 0 !important;
//   }

// .highcharts-tooltip-box{
//   fill: blue !important;
// }