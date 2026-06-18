# Cognitive Science Books Batch Download — June 8, 2026

## Books Downloaded

### From ebook-treasure-chest (城通网盘 — all <3MB, no corruption)

| Book | Author | Size | CDN Node | Time | Formats |
|------|--------|------|----------|------|---------|
| 人类思维的自然史 | 迈克尔·托马塞洛 | 2.46 MB | 94-cucc-data | ~instant | epub(776K) ✅ mobi(1.0M) ✅ azw3(1.1M) ✅ |
| 深度预测 | 理查德·A·克拉克 | 2.42 MB | 94-cucc-data | ~instant | epub(704K) ✅ mobi(1.2M) ✅ azw3(1.3M) ✅ |
| 真相与错觉 | 塔莎·欧里希 | 4.30 MB | 94-cucc-data | ~20s | epub(1.3M) ✅ mobi(3.0M) ✅ azw3(1.9M) ✅ |
| 认知迭代 | 卡罗琳·威廉姆斯 | 5.36 MB | 94-cucc-data | ~300s (resume) | epub(1.3M) ✅ mobi(3.5M) ✅ azw3(2.8M) ✅ |

**All 4 books had all 3 formats intact** — no corruption at all. Reason: all files were close to the 3MB threshold (认知迭代 at 5.36MB had very mild throttling, required curl resume with `-C -`).

### From lunarora.com (夸克网盘 — could NOT download from overseas)

| Book | Author | Rating | Quark URL | Extraction Code |
|------|--------|--------|-----------|----------------|
| 神经的逻辑 | 埃利泽·斯滕伯格 | ⭐8.5 | pan.quark.cn/s/2ea3e1fe1f50 | 9km9 |
| 认知与设计 | Jeff Johnson | ⭐8.6 | pan.quark.cn/s/2cdd3ec2132c | a63h |
| 怎样解题 | G·波利亚 | ⭐8.7 | pan.quark.cn/s/ce4b079079ce | 9ml0 |

## Parallel Download Approach

Using `delegate_task` to run 3 ctfile downloads in parallel saved significant time. Each subagent:
1. Opens its own browser session to the ctfile URL
2. Submits password 8866 (Enter key works on z701.com password page)
3. Extracts JS variables from browser console
4. Calls the ctfile API to get a CDN URL
5. Downloads with curl
6. Extracts with Python zipfile

Each subagent has its own isolated browser + terminal session, so they don't interfere with each other (single-task limit per download, but each subagent is its own session).

## Key Observations

1. **Files under ~5MB from tv002 CDN download reliably** without corruption. The 3MB threshold is when spd2 kicks in (slower throttled speed), not when corruption starts. Corruption reliably occurs with files >10-15MB.
2. **ctfile browser interaction for password**: Pressing Enter after typing 8866 into the password field works reliably. No need to target the decrypt button.
3. **Quark cloud share page structure**: Accessible without login, shows extraction code textbox + "提取文件" button. After entering the code, it shows file list with checkbox + "保存到网盘". Download requires login — no guest download available.
4. **lunarora.com search behavior**: Exact long titles (with colons/subtitles) may return empty results even when the book exists. Shorter keyword searches work better.
