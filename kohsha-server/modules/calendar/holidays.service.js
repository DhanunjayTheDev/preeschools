/**
 * Service to fetch Indian holidays from Google Calendar
 * Uses public India Holiday calendar via Google Calendar API
 */

const axios = require('axios');

// Google Calendar API configuration
// Using India public holidays calendar ID
const GOOGLE_CALENDAR_ID = 'en.indian#holiday@group.v.calendar.google.com';
const GOOGLE_API_KEY = process.env.GOOGLE_CALENDAR_API_KEY || 'enter-your-api-key';

// Cache for holidays to avoid repeated API calls
const holidayCache = {};

/**
 * Fetch Indian holidays from Google Calendar Public API
 */
const fetchIndianHolidaysFromGoogle = async (year) => {
  // Return cached result if available
  if (holidayCache[year]) {
    return holidayCache[year];
  }

  try {
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'enter-your-api-key') {
      console.log(`⚠ Google Calendar API Key not configured, returning empty holidays`);
      return [];
    }

    const startDate = `${year}-01-01T00:00:00Z`;
    const endDate = `${year}-12-31T23:59:59Z`;

    const response = await axios.get('https://www.googleapis.com/calendar/v3/calendars/en.indian%23holiday%40group.v.calendar.google.com/events', {
      params: {
        key: GOOGLE_API_KEY,
        timeMin: startDate,
        timeMax: endDate,
        singleEvents: true,
        orderBy: 'startTime',
      },
      timeout: 5000,
    });

    const holidays = (response.data.items || []).map(item => ({
      date: new Date(item.start.date || item.start.dateTime),
      title: item.summary,
      description: item.description || item.summary,
      type: 'HOLIDAY',
    }));

    // Cache the result
    holidayCache[year] = holidays;
    console.log(`✓ Fetched ${holidays.length} holidays for ${year} from Google Calendar`);
    return holidays;
  } catch (error) {
    console.log(`⚠ Google Calendar API error for ${year}:`, error.message);
    return [];
  }
};

/**
 * Get formatted holidays for display in UI
 * Dynamically fetches from Google Calendar API
 */
const getFormattedHolidays = async (year) => {
  const rawHolidays = await fetchIndianHolidaysFromGoogle(year);

  // Deduplicate holidays that share the same date timestamp (can occur with Google Calendar)
  const seen = new Set();
  const unique = rawHolidays.filter((holiday) => {
    const key = `${holiday.date.getTime()}_${holiday.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.map((holiday) => ({
    _id: `holiday_${year}_${holiday.date.getTime()}`,
    title: holiday.title,
    description: holiday.description,
    type: holiday.type,
    startDate: holiday.date.toISOString(),
    endDate: holiday.date.toISOString(),
    isAllDay: true,
    isRecurring: false,
    targetClasses: [],
    createdBy: 'GOOGLE_CALENDAR',
    isSystemHoliday: true,
  }));
};

module.exports = {
  fetchIndianHolidaysFromGoogle,
  getFormattedHolidays,
};
