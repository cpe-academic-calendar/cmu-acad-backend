import { registerAs } from "@nestjs/config";

export default registerAs('authen',() => ({
    auth_path : process.env.redirect_uri,
    oauth_path: process.env.oauth_path,
    info_url: process.env.info_url,
    client_id: process.env.client_id,
    client_secret: process.env.client_secret,
    grant_type: process.env.grant_type,
    railway_url: process.env.railway,
    misapi_url: process.env.mis_api,
    netlify_url: process.env.netlify_url
}))