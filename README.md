# Threaded Anonymous Email

This is a simple email service that helps two users to communicate between a proxy server, allowing both parties to stay anonymous to each other.

## How to start

-   setup you env based on env example
-   setup Vercel, Sendgrid and Supabase accounts
-   `npm install`
-   `vercel dev` to develop locally
-   `vercel --prod` deploy to Vercel server

Make sure that the Vercel server IS NOT Vercel authenticated, otherwise sendgrid can't access the API.

## Examples

### new email

Client 1 email request -> API -> Sendgrid -> Client 2 (from address is shown as your domain address)

### reply email

Client 2 email request -> Sendgrid -> API -> Sendgrid -> Client 1 (from address is shown as your domain address)

### API endpoints

-   `/api` - handles replies to a thread based on `threadRef` and `from` address
-   `/api/new` - handles new emails. API key must be provided via the header

### 3rd party services used:

-   Vercel - serverless API
-   Sendgrid
    -   Mail - simple package to send out mails
    -   Parse Webhook - redirect and parse replies to the API
-   Supabase - to keep track of threads and both clients
