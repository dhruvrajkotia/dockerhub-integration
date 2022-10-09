import PromiseRouter from "express-promise-router"
import { errorHandler } from '../utils/error-handler'
import { customerSlots } from "./customer-slots"
import { createPartner } from './create-partner'
import { updatePartner } from './update-partner'
import { fetchPartnerByUrl } from './fetch-partner-by-url'
import { fetchPartners } from './fetch-partners'
import { deletePartner } from './delete-partner'
import { trackMixpanel } from './track-mixpanel'
import { login } from './login'
import { signup } from './signup'
import { fetchMe } from './fetch-me'
import { checkIfAuthenticated } from "../middleware/auth-middleware";
import { isAdmin } from "../middleware/is-admin-middleware";
import { fetchDetailsFromAirtable } from "./fetch-details-from-airtable"

import { healthCheck } from './healthcheck';

const router = PromiseRouter();

// Log the routes.
router.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
});

// Used for the auto-dev finder.
router.get("/", (req, res) => {
    // res.send('OK')
    res.json({ status: "ok" });
});

// healthcheck
router.get("/healthcheck", healthCheck);

// auth
router.post('/login', login)
router.post('/signup', signup)
router.get('/account/me', checkIfAuthenticated, fetchMe)

// slot routes
router.post('/set-conversation-id', customerSlots) // todo: customer/slots


// Fetch Data from Airtable
router.post('/fetch-data', fetchDetailsFromAirtable )

// partner routes
router.post('/create-partner', checkIfAuthenticated, isAdmin, createPartner)
router.post('/update-partner', checkIfAuthenticated, isAdmin, updatePartner)
router.post('/delete-partner', checkIfAuthenticated, isAdmin, deletePartner)
router.post('/fetch-partners', checkIfAuthenticated, isAdmin, fetchPartners)
router.post('/fetch-partner-by-url', fetchPartnerByUrl)

// track-mixpanel
router.post('/track-mixpanel', trackMixpanel)

// Errors
router.use(errorHandler);

export default router;
