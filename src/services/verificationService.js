/**
 * Verification Service for ACM Event Attendance Portal
 * 
 * Handles loading, parsing, and verifying student credentials against a Master Student List.
 * Supports local JSON, local CSV, and remote Google Sheets CSV URLs.
 */

/**
 * Normalizes text for reliable matching:
 * - Trims leading & trailing whitespace
 * - Converts to lowercase
 * - Collapses multiple spaces into a single space
 */
export function normalizeText(text) {
  if (!text) return '';
  return String(text)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Simple robust CSV parser for Master Student List.
 * Handles headers like "Roll Number", "Roll no", "RollNo", "Student Name", "Name", "Full Name".
 */
export function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  // Parse header line
  const headers = lines[0].split(',').map((h) => h.trim().replace(/^["']|["']$/g, ''));
  
  let rollColIndex = -1;
  let nameColIndex = -1;

  headers.forEach((header, index) => {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-noise]/g, '');
    if (
      normalizedHeader.includes('roll') ||
      normalizedHeader.includes('rollno') ||
      normalizedHeader.includes('rollnumber')
    ) {
      rollColIndex = index;
    } else if (
      normalizedHeader.includes('name') ||
      normalizedHeader.includes('studentname') ||
      normalizedHeader.includes('fullname')
    ) {
      nameColIndex = index;
    }
  });

  // Fallback defaults if headers aren't explicitly named: Col 0 = Name, Col 1 = Roll Number or vice versa
  if (rollColIndex === -1) rollColIndex = headers.length > 1 ? 1 : 0;
  if (nameColIndex === -1) nameColIndex = 0;

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting (handling quotes if any)
    const row = lines[i].split(',').map((val) => val.trim().replace(/^["']|["']$/g, ''));
    const rollNumber = row[rollColIndex] ? row[rollColIndex].trim() : '';
    const name = row[nameColIndex] ? row[nameColIndex].trim() : '';

    if (rollNumber || name) {
      records.push({ rollNumber, name });
    }
  }

  return records;
}

/**
 * Loads the Master Student List from a JSON file, CSV file, or Google Sheets CSV URL.
 * 
 * @param {string} url - Relative or absolute URL to fetch master student list from.
 * @returns {Promise<Array<{rollNumber: string, name: string}>>}
 */
export async function loadMasterStudentList(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch master list (${response.status} ${response.statusText})`);
    }

    const contentType = response.headers.get('content-type') || '';

    if (url.endsWith('.json') || contentType.includes('application/json')) {
      const data = await response.json();
      // Support array of objects with flexible key names
      return data.map((item) => ({
        rollNumber: String(item.rollNumber || item['Roll Number'] || item['Roll no'] || item['RollNo'] || item.roll_no || '').trim(),
        name: String(item.name || item.fullName || item['Student Name'] || item['Name'] || item['Full Name'] || '').trim()
      }));
    } else {
      // Treat as CSV (covers .csv files and Google Sheets CSV exports)
      const text = await response.text();
      // If the response is accidentally HTML (e.g. 404 or redirect), throw error
      if (text.trim().startsWith('<')) {
        throw new Error('Master list returned HTML instead of CSV/JSON data.');
      }
      return parseCSV(text);
    }
  } catch (error) {
    console.error('Error loading Master Student List:', error);
    throw error;
  }
}

/**
 * Verifies student input against the loaded Master Student List.
 * 
 * Logic:
 * 1. Look up Roll Number (Primary Key).
 *    If NOT found: Status = "Unverified", Remarks = "Roll Number Not Found"
 * 2. If Roll Number IS found:
 *    Compare Student Name ignoring case, leading/trailing spaces, and multiple internal spaces.
 *    If Match: Status = "Verified", Remarks = "-"
 *    If Mismatch: Status = "Unverified", Remarks = "Name Mismatch"
 * 
 * @param {Object} input - Form data containing { rollNumber, fullName }
 * @param {Array<{rollNumber: string, name: string}>} masterList - List of verified students
 * @returns {{ status: "Verified" | "Unverified", remarks: string }}
 */
export function verifyStudent(input, masterList) {
  const targetRoll = String(input.rollNumber || '').trim();
  const targetNameNormalized = normalizeText(input.fullName);

  if (!targetRoll) {
    return {
      status: '❌ Unverified',
      remarks: 'Roll Number Not Found'
    };
  }

  // 1. Search Roll Number as primary key (case-insensitive string comparison)
  const matchedStudent = masterList.find(
    (student) => String(student.rollNumber).trim().toLowerCase() === targetRoll.toLowerCase()
  );

  // If Roll Number is NOT found
  if (!matchedStudent) {
    return {
      status: '❌ Unverified',
      remarks: 'Roll Number Not Found'
    };
  }

  // 2. Roll Number is found -> Compare Student Name
  const masterNameNormalized = normalizeText(matchedStudent.name);

  if (targetNameNormalized === masterNameNormalized) {
    return {
      status: '✅ Verified',
      remarks: '-'
    };
  } else {
    return {
      status: '❌ Unverified',
      remarks: 'Name Mismatch'
    };
  }
}
