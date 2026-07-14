import { createRouter } from "./http.js";
import registerAdminRoutes from "../modules/admin/routes.js";
import registerAuthRoutes from "../modules/auth/routes.js";
import registerCounselorRoutes from "../modules/counselor/routes.js";
import registerParticipantRoutes from "../modules/participant/routes.js";
import registerPublicRoutes from "../modules/public/routes.js";

const router = createRouter();

registerAuthRoutes(router);
registerParticipantRoutes(router);
registerCounselorRoutes(router);
registerAdminRoutes(router);
registerPublicRoutes(router);

export default router;
