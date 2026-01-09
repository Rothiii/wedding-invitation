// Main entry point for the server
// This file bootstraps the application

import './infra/http/server'

// Export app for Cloudflare Workers or other serverless environments
export { createApp } from './infra/http/routes'
