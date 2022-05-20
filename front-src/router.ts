import { Router } from "@vaadin/router";

const root = document.querySelector(".root");
const router = new Router(root);

router.setRoutes([
  { path: "/", component: "home-ubication" },
  { path: "/home-oficial", component: "home-oficial" },
  { path: "/sign", component: "sign-page" },
  { path: "/me-page", component: "me-page" },
  { path: "/edit-me", component: "edit-me" },
  { path: "/change-password", component: "change-password" },
  { path: "/report-pet", component: "report-pet" },
  { path: "/me-reports", component: "me-reports" },
  { path: "/update-report", component: "update-report" },
]);
