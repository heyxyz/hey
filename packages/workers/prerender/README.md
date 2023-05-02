# Prerender worker

Prerender Worker for SEO Tags with Cloudflare

This document describes how to create a Cloudflare Worker that prerenders your web application for search engine bots by checking the `User-Agent` header. This worker will be proxied via Workers Routes in Cloudflare.

Please note that this worker will not work locally.

This worker check the `User-Agent` header and if it contains bot check regex, it will prerender the page and return the HTML that contains SEO tags. Otherwise, it will return the original response of the web application.
