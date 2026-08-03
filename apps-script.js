/**
 * ACM Event Attendance Portal - Google Apps Script Backend API
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click Extensions > Apps Script.
 * 3. Delete any default code and paste this script.
 * 4. Click Deploy > New deployment.
 * 5. Select type "Web app".
 * 6. Set Description: "ACM Attendance Portal API".
 * 7. Set Execute as: "Me (your email)".
 * 8. Set Who has access: "Anyone".
 * 9. Click Deploy, authorize permissions, and copy the Web App URL.
 * 10. Paste the Web App URL inside `src/config/config.js` as `googleAppsScriptUrl`.
 */

// Enable CORS and format response helpers
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * GET Handler (Used for health checking & diagnostics)
 */
function doGet(e) {
  return createJsonResponse({
    status: "active",
    message: "ACM Attendance API is online.",
    timestamp: new Date().toISOString()
  });
}

/**
 * POST Handler (Processes attendance submissions and performs duplicate checks)
 */
function doPost(e) {
  // Obtain script lock to prevent concurrency double-write race conditions
  var lock = LockService.getScriptLock();
  try {
    // Wait up to 30 seconds for lock release
    lock.waitLock(30000);
  } catch (f) {
    return createJsonResponse({
      status: "error",
      message: "Database busy. Please try submitting again in a few seconds."
    });
  }

  try {
    // 1. Verify and parse POST payload
    if (!e || !e.postData || !e.postData.contents) {
      return createJsonResponse({
        status: "error",
        message: "Bad Request: Missing payload."
      });
    }

    var payloadData = JSON.parse(e.postData.contents);
    
    // Extract parameters
    var fullName = payloadData.fullName ? payloadData.fullName.toString().trim() : "";
    var email = payloadData.email || payloadData.Email || payloadData["Email Address"] || "";
    var rollNumber = payloadData.rollNumber ? payloadData.rollNumber.toString().trim() : "";
    var college = payloadData.college ? payloadData.college.toString().trim() : "";
    var course = payloadData.course ? payloadData.course.toString().trim() : "";
    var section = payloadData.section ? payloadData.section.toString().trim() : "";
    var semester = payloadData.semester ? payloadData.semester.toString().trim() : "";
    var mobile = payloadData.mobile ? payloadData.mobile.toString().trim() : "";
    var internshipInterest = payloadData.internshipInterest || payloadData.internship || payloadData["Interested in Internship"] || payloadData.Internship || "Yes";
    var statusVal = payloadData.Status || payloadData.status || "❌ Unverified";
    var remarksVal = payloadData.Remarks || payloadData.remarks || "-";
    
    // Metadata hidden fields
    var browser = payloadData.browser || "Unknown";
    var device = payloadData.device || "Unknown";
    var operatingSystem = payloadData.operatingSystem || "Unknown";
    var platform = payloadData.platform || "Unknown";
    var userAgent = payloadData.userAgent || "Unknown";
    var timestamp = payloadData.timestamp || new Date().toLocaleString();

    // 2. Validate essential inputs (All fields are mandatory)
    if (!fullName || !rollNumber || !college || !course || !section || !semester || !mobile) {
      return createJsonResponse({
        status: "error",
        message: "Missing mandatory fields: Name, Roll Number, College, Course, Section, Semester, or Mobile."
      });
    }

    // 3. Connect to target sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var lastRow = sheet.getLastRow();
    
    // 4. Auto-initialize headers if the sheet is blank
    if (lastRow === 0) {
      var headers = [
        "Timestamp", 
        "Full Name", 
        "Email Address",
        "Roll Number", 
        "College", 
        "Course", 
        "Section", 
        "Semester", 
        "Mobile Number", 
        "Interested in Internship",
        "Status",
        "Remarks",
        "Browser", 
        "Device", 
        "Operating System", 
        "Platform", 
        "User Agent"
      ];
      sheet.appendRow(headers);
      // Format headers: Bold, grey background, freeze top row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F3F4F6");
      sheet.setFrozenRows(1);
      lastRow = 1;
    }

    // 5. Duplicate check using Roll Number (Column D / Index 4 if Email exists, or Column C)
    if (lastRow > 1) {
      // Fetch all roll numbers in Column C/D (starting from Row 2)
      var rollNumbersRange = sheet.getRange(2, 3, lastRow - 1, 2);
      var rollNumbersValues = rollNumbersRange.getValues();
      
      // Perform case-insensitive string comparison
      var targetRoll = rollNumber.toLowerCase();
      for (var i = 0; i < rollNumbersValues.length; i++) {
        var colC = rollNumbersValues[i][0].toString().trim().toLowerCase();
        var colD = rollNumbersValues[i][1].toString().trim().toLowerCase();
        if (colC === targetRoll || colD === targetRoll) {
          // Release script lock prior to exit
          lock.releaseLock();
          return createJsonResponse({
            status: "duplicate",
            message: "You have already marked your attendance. (Duplicate roll number: " + rollNumber + ")"
          });
        }
      }
    }

    // 6. Register fresh attendance record
    var newRow = [
      timestamp,
      fullName,
      email,
      rollNumber,
      college,
      course,
      section,
      semester,
      mobile,
      internshipInterest,
      statusVal,
      remarksVal,
      browser,
      device,
      operatingSystem,
      platform,
      userAgent
    ];
    sheet.appendRow(newRow);
    
    // Save, release lock, and return status
    SpreadsheetApp.flush();
    lock.releaseLock();

    return createJsonResponse({
      status: "success",
      message: "Attendance registered successfully.",
      data: {
        fullName: fullName,
        rollNumber: rollNumber,
        timestamp: timestamp
      }
    });

  } catch (error) {
    // Release lock in case of errors
    if (lock.hasLock()) {
      lock.releaseLock();
    }
    return createJsonResponse({
      status: "error",
      message: "Server Database Error: " + error.toString()
    });
  }
}
