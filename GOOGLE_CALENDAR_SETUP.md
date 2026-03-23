# Google Calendar Integration Setup

## Option 1: Use Google Calendar API (Recommended)

### Step 1: Get Google Calendar API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google Calendar API"
4. Go to Credentials → Create API Key
5. Copy the API key

### Step 2: Add to .env
```bash
# In kohsha-server/.env
GOOGLE_CALENDAR_API_KEY=your_api_key_here
```

### Step 3: Restart Server
The system will now fetch Indian holidays from Google Calendar automatically.

---

## Option 2: No Setup Required (Current Default)
If you don't have a Google Calendar API Key:
- Holidays feature is disabled
- Only custom school events show in calendar
- For holidays to work, complete Option 1 setup

---

## What Holidays Will Show
When configured, the following Indian national holidays and festivals automatically appear:
- Republic Day (Jan 26)
- Holi (March)
- Easter / Good Friday (March/April)
- Rama Navami (March/April)
- Buddha Purnima (May)
- Eid ul-Fitr (March)
- Eid ul-Adha (June)
- Independence Day (Aug 15)
- Ganesh Chaturthi (September)
- Dussehra (September/October)
- Diwali (October/November)
- Guru Nanak Jayanti (November)
- Christmas (Dec 25)
- ...and many more

---

## Backend Changes
- ✅ Only custom school events are stored in our database
- ✅ Google Calendar holidays are fetched dynamically
- ✅ Both are merged in API response

## Frontend Changes
- ✅ Calendar displays both holidays and custom events
- ✅ Holidays marked with 🎉 emoji type indicator
- ✅ Only custom events can be edited/deleted from backend

---

## Troubleshooting
**Q: Holidays not showing?**
- Check if GOOGLE_CALENDAR_API_KEY is set in .env
- Restart server after adding key
- Check server logs for "✓ Fetched X holidays"

**Q: Can I use a different calendar?**
- Change `GOOGLE_CALENDAR_ID` in `holidays.service.js`
- Any public Google Calendar ID works

**Q: Want to disable holidays?**
- Remove `GOOGLE_CALENDAR_API_KEY` from .env
- Restart server
- Only custom events will show
