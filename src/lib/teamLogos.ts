/**
 * ESPN Team Logo Mapping
 * Maps team names to ESPN CDN team IDs for logo URLs
 *
 * Logo URL Pattern:
 * - Standard: https://a.espncdn.com/i/teamlogos/ncaa/500/{teamId}.png
 * - Dark mode: https://a.espncdn.com/i/teamlogos/ncaa/500-dark/{teamId}.png
 */

// ESPN team ID mapping for all bowl game teams
const ESPN_TEAM_IDS: Record<string, number> = {
  // A
  'Alabama': 333,
  'App State': 2026,
  'Appalachian State': 2026,
  'Arizona': 12,
  'Arizona State': 9,
  'Army': 349,

  // B
  'BYU': 252,
  'Brigham Young': 252,

  // C
  'Central Michigan': 2117,
  'Cincinnati': 2132,
  'Clemson': 228,
  'Coastal Carolina': 324,

  // D
  'Duke': 150,

  // E
  'East Carolina': 151,
  'ECU': 151,

  // F
  'FIU': 2229,
  'Florida International': 2229,
  'Fresno State': 278,

  // G
  'Georgia': 61,
  'Georgia Southern': 290,
  'Georgia Tech': 59,

  // H
  'Houston': 248,

  // I
  'Illinois': 356,
  'Indiana': 84,
  'Iowa': 2294,

  // L
  'Louisiana Tech': 2348,
  'LSU': 99,
  'Louisiana State': 99,

  // M
  'Miami': 2390,
  'Miami (FL)': 2390,
  'Miami (OH)': 193,
  'Michigan': 130,
  'Minnesota': 135,
  'Mississippi State': 344,
  'Miss State': 344,
  'Missouri': 142,
  'Mizzou': 142,

  // N
  'Navy': 2426,
  'Nebraska': 158,
  'New Mexico': 167,
  'North Texas': 249,
  'Northwestern': 77,

  // O
  'Ohio State': 194,
  'OSU': 194,
  'Ole Miss': 145,
  'Oregon': 2483,

  // P
  'Penn State': 213,
  'Pitt': 221,
  'Pittsburgh': 221,

  // R
  'Rice': 242,

  // S
  'San Diego State': 21,
  'SDSU': 21,
  'SMU': 2567,
  'Southern Methodist': 2567,

  // T
  'TCU': 2628,
  'Texas Christian': 2628,
  'Tennessee': 2633,
  'Texas': 251,
  'Texas State': 326,
  'Texas Tech': 2641,

  // U
  'UConn': 41,
  'Connecticut': 41,
  'USC': 30,
  'Utah': 254,
  'UTSA': 2636,
  'UT San Antonio': 2636,

  // V
  'Vanderbilt': 238,
  'Virginia': 258,
  'UVA': 258,

  // W
  'Wake Forest': 154,
}

const ESPN_LOGO_BASE_URL = 'https://a.espncdn.com/i/teamlogos/ncaa/500'

/**
 * Get the ESPN logo URL for a team
 * @param teamName - The team name as stored in the database
 * @returns The ESPN CDN logo URL, or null if team not found
 */
export function getTeamLogoUrl(teamName: string): string | null {
  const teamId = ESPN_TEAM_IDS[teamName]
  if (!teamId) return null
  return `${ESPN_LOGO_BASE_URL}/${teamId}.png`
}

/**
 * Get the ESPN dark mode logo URL for a team
 * @param teamName - The team name as stored in the database
 * @returns The ESPN CDN dark mode logo URL, or null if team not found
 */
export function getTeamDarkLogoUrl(teamName: string): string | null {
  const teamId = ESPN_TEAM_IDS[teamName]
  if (!teamId) return null
  return `${ESPN_LOGO_BASE_URL}-dark/${teamId}.png`
}

/**
 * Check if a team has a logo mapping
 * @param teamName - The team name to check
 * @returns true if the team has a mapped logo
 */
export function hasTeamLogo(teamName: string): boolean {
  return teamName in ESPN_TEAM_IDS
}
