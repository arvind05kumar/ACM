/**
 * Validation rules for the ACM Attendance Form fields.
 */

// Valid colleges list
const VALID_COLLEGES = ["CEC", "COE", "CCT", "CBSA", "CCP", "HMCT"];

/**
 * Validates the attendance form fields. All fields are mandatory.
 * @param {object} values - Form field values.
 * @returns {object} errors - Object containing error messages for invalid fields.
 */
export function validateForm(values) {
  const errors = {};

  // Full Name Validation
  if (!values.fullName || !values.fullName.trim()) {
    errors.fullName = "Full Name is required.";
  } else if (values.fullName.trim().length < 2) {
    errors.fullName = "Name must be at least 2 characters long.";
  }

  // Email Address Validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!values.email || !values.email.trim()) {
    errors.email = "Email Address is required.";
  } else if (!emailRegex.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Roll Number Validation
  if (!values.rollNumber || !values.rollNumber.trim()) {
    errors.rollNumber = "Roll Number is required.";
  } else if (values.rollNumber.trim().length < 3) {
    errors.rollNumber = "Roll Number is too short.";
  }

  // College Validation
  if (!values.college) {
    errors.college = "College is required.";
  } else if (!VALID_COLLEGES.includes(values.college)) {
    errors.college = "Please select a valid college.";
  }

  // Course Validation
  if (!values.course || !values.course.trim()) {
    errors.course = "Course is required.";
  }

  // Section Validation
  if (!values.section || !values.section.trim()) {
    errors.section = "Section is required.";
  }

  // Semester Validation
  if (!values.semester) {
    errors.semester = "Semester is required.";
  } else {
    const sem = parseInt(values.semester, 10);
    if (isNaN(sem) || sem < 1 || sem > 8) {
      errors.semester = "Semester must be between 1 and 8.";
    }
  }

  // Mobile Number Validation (Mandatory)
  if (!values.mobile || !values.mobile.trim()) {
    errors.mobile = "Mobile Number is required.";
  } else {
    const cleaned = values.mobile.replace(/\D/g, '');
    if (cleaned.length < 10 || cleaned.length > 15) {
      errors.mobile = "Mobile number must be between 10 and 15 digits.";
    }
  }

  // Internship Interest Validation
  if (!values.internshipInterest) {
    errors.internshipInterest = "Please select whether you are interested in an internship.";
  }

  return errors;
}
