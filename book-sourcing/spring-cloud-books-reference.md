# Spring Cloud Books — Session Reference (June 2026)

## Goal
Download all Spring Cloud books from PDFdriver. PDFdriver was completely blocked (ParkLogic), so alternative sources were used.

## What worked

### Book 1: 《Spring Cloud 微服务实战》(翟永超) ✅ DOWNLOADED
- **Source:** 多多软件站 (ddooo.com)
- **Page:** `http://www.ddooo.com/softdown/107766.htm`
- **API:** `https://api.ddooo.com/down/107766/2` (with Referer header)
- **Format:** RAR archive (172MB) containing `557411+Spring+Cloud微服务实战.pdf`
- **Status:** Downloaded to `/opt/data/spring-cloud-books/springcloud_107766.rar`
- **Limitation:** No `unrar` on system — cannot extract without it

### Book not found on accessible sites
- 《Spring Cloud Alibaba 微服务原理与实战》— Not found on any accessible download site
- 《微服务架构设计模式》(中文) — Not found on any accessible download site
- 《凤凰架构》— Not found on any accessible download site
- *Spring Microservices in Action* — Found on wowebook.org (premium host redirect)
- *Microservices with Spring Boot and Spring Cloud, 4th Ed* — Found on wowebook.org (premium host redirect)

## Search strategy that worked

### Step 1: Sogou Search (搜狗) — the key breakthrough
```bash
curl -sL -A "Mozilla/5.0" "https://www.sogou.com/web?query=Spring+Cloud+微服务实战+翟永超+pdf+下载"
```
- Returned **real search results** in raw HTML
- Found links to: 多多软件站, CSDN, bccn.net, 码农网, 52doc.com, etc.
- All other search engines (Baidu=CAPTCHA, Bing=blank, DuckDuckGo=timeout, Google=timeout) failed

### Step 2: 多多软件站 download
- Page has a "本地下载" button that triggers the API
- API requires the `Referer` header matching the book page
- Returns RAR file containing the PDF

## What didn't work
- All LibGen/Anna's Archive mirrors timed out
- All Cloudflare-protected sites (pdfcookie, pdfroom) blocked
- Chinese sites with point systems (bccn.net, CSDN) inaccessible without login
- 52doc.com returns 403

## Tools needed for next time
- **unrar** (to extract RAR-archived PDFs) — most Chinese book sites distribute as RAR
- A user-provided 百度网盘/阿里云盘 share link (most Chinese tech books are shared this way)
