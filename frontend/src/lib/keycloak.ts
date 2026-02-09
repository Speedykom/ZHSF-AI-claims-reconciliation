import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080",
  realm: "ZHSF-Claims-Rec",
  clientId: "frontend-app",
});

export default keycloak;
